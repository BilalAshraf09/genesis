using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Genesis.Theater;

namespace Genesis.Atlas
{
    /// <summary>
    /// Pooled, GC-free-at-runtime map consequence FX drawn flat just above the map surface (y≈0.03–0.06).
    /// Palette: #E5534B escalation/cost · #3FB97A gain · #D9B45A diplomacy · #F5A524 accent amber · #5AA9E6 info.
    /// Usage: call Init(mapRoot) once, then call effect methods (all return IEnumerator for yield or fire-and-forget),
    /// call Clear() between beats to stop all running effects and return pool items.
    /// </summary>
    public sealed class MapStoryFX : MonoBehaviour
    {
        // ── Palette ──────────────────────────────────────────────────────────────
        public static readonly Color CostRed       = new(0.898f, 0.325f, 0.294f, 1f);
        public static readonly Color GainGreen     = new(0.247f, 0.725f, 0.478f, 1f);
        public static readonly Color DiplomacyGold = new(0.851f, 0.706f, 0.353f, 1f);
        public static readonly Color AccentAmber   = new(0.961f, 0.647f, 0.141f, 1f);
        public static readonly Color InfoBlue      = new(0.353f, 0.663f, 0.902f, 1f);

        // ── Y positions above map surface ────────────────────────────────────────
        const float RingY     = 0.04f;
        const float FlowY     = 0.05f;
        const float ArcBaseY  = 0.05f;
        const float ArcPeakDY = 0.65f; // raised arc above map
        const float DiscY     = 0.03f;
        const float ClockY    = 0.06f;
        const float DrawLineY = 0.05f;

        // ── Shape constants ───────────────────────────────────────────────────────
        const int CircleSegs  = 32;
        const int ArcSegs     = 22;
        const int BezierSegs  = 26;
        const int ClockSegs   = 48;
        const int MaxLinePts  = 256;

        // ── Pool sizes ────────────────────────────────────────────────────────────
        const int PoolRings  = 6;
        const int PoolArrows = 3;
        const int PoolArcs   = 3;
        const int PoolLines  = 4;
        const int PoolDiscs  = 4;
        const int PoolClocks = 2;

        // ── Pre-computed unit circle (XZ plane, Y=0) ─────────────────────────────
        static readonly Vector3[] s_UnitCircle;
        static MapStoryFX()
        {
            s_UnitCircle = new Vector3[CircleSegs];
            for (int i = 0; i < CircleSegs; i++)
            {
                float a = i * Mathf.PI * 2f / CircleSegs;
                s_UnitCircle[i] = new Vector3(Mathf.Cos(a), 0f, Mathf.Sin(a));
            }
        }

        // ── Pool item ─────────────────────────────────────────────────────────────
        sealed class FxItem
        {
            public GameObject  go;
            public LineRenderer lr;
            public MeshRenderer mr;
            public Material    mat;
            public Vector3[]   lineBuf;  // Only allocated for line-type items
            public bool        inUse;
        }

        readonly List<FxItem> _ringPool  = new(PoolRings);
        readonly List<FxItem> _arrowPool = new(PoolArrows);
        readonly List<FxItem> _arcPool   = new(PoolArcs);
        readonly List<FxItem> _linePool  = new(PoolLines);
        readonly List<FxItem> _discPool  = new(PoolDiscs);
        readonly List<FxItem> _clockPool = new(PoolClocks);

        // ── Dedicated selection-link (persistent, not pooled) ─────────────────────
        // Shown while an order card is selected; cleared on execute / beat change.
        LineRenderer _selectionLinkLR;
        Material     _selectionLinkMat;
        const float  SelectionLinkY     = 0.06f;
        const float  SelectionLinkWidth = 0.055f;

        // ── Shared one-shot work buffers (set before first yield, safe to share) ──
        readonly Vector3[] _arcBuf    = new Vector3[ArcSegs + 1];
        readonly Vector3[] _bezierBuf = new Vector3[BezierSegs + 1];

        // ── Dash texture for flow arrows / draw lines ─────────────────────────────
        Texture2D _dashTex;

        Transform _root;
        float _boardWidth = 24f;
        public bool IsInitialized { get; private set; }

        // ─────────────────────────────────────────────────────────────────────────
        // Lifecycle
        // ─────────────────────────────────────────────────────────────────────────

        /// <summary>
        /// Call once before using any effects. Safe to call multiple times (idempotent).
        /// Pass <paramref name="boardWidth"/> (default 24) so ClockSweep and ring radii scale
        /// correctly for the current theater board.
        /// </summary>
        public void Init(Transform mapRoot, float boardWidth = 24f)
        {
            // Store boardWidth always so runtime-scaled FX (ClockSweep) pick up the real size.
            _boardWidth = Mathf.Max(1f, boardWidth);
            if (IsInitialized) return;
            _root = mapRoot != null ? mapRoot : transform;
            IsInitialized = true;

            CreateDashTexture();
            CreateLRPool(_ringPool,  PoolRings,  "Ring",      0.07f,  LineTextureMode.Stretch, false);
            CreateLRPool(_arrowPool, PoolArrows, "FlowArrow", 0.055f, LineTextureMode.Tile,    false);
            CreateLRPool(_arcPool,   PoolArcs,   "GoldArc",   0.05f,  LineTextureMode.Stretch, false);
            CreateLRPool(_linePool,  PoolLines,  "DrawLine",  0.065f, LineTextureMode.Tile,    true);
            CreateDiscPool(_discPool, PoolDiscs, "RegionDisc");
            CreateLRPool(_clockPool, PoolClocks, "ClockSweep", 0.055f, LineTextureMode.Stretch, false);
        }

        void Awake()
        {
            // Auto-init if added to a scene without an explicit Init call.
            // WorldReactionFX will call Init(mapRoot, boardWidth) afterwards to update _boardWidth.
            if (!IsInitialized) Init(transform);
        }

        /// <summary>Stop all running effects and return every pool item. Call between beats.</summary>
        public void Clear()
        {
            StopAllCoroutines();
            ReturnAll(_ringPool);
            ReturnAll(_arrowPool);
            ReturnAll(_arcPool);
            ReturnAll(_linePool);
            ReturnAll(_discPool);
            ReturnAll(_clockPool);
            ClearSelectionLink();
        }

        // ─────────────────────────────────────────────────────────────────────────
        // Public effects
        // ─────────────────────────────────────────────────────────────────────────

        /// <summary>Expanding/fading rings centered on world (XZ). Fire-and-forget or yield.</summary>
        public IEnumerator PulseRings(Vector3 world, Color color, int count = 3)
        {
            if (!IsInitialized) Init(transform, _boardWidth);
            count = Mathf.Clamp(count, 1, PoolRings);
            for (int i = 0; i < count; i++)
            {
                var item = Borrow(_ringPool);
                StartCoroutine(PulseRingRoutine(item, world, color, i * 0.26f));
            }
            // PulseRings returns immediately after firing; total ring lifetime ≈ 1.0s + delays.
            yield break;
        }

        /// <summary>Animated scrolling chevron flow along a gently curved path. Returns after duration.</summary>
        public IEnumerator FlowArrows(Vector3 fromWorld, Vector3 toWorld, Color color, float duration)
        {
            if (!IsInitialized) Init(transform);
            var item = Borrow(_arrowPool);

            // Compute quadratic Bezier control point (perpendicular offset for gentle curve)
            var mid = (fromWorld + toWorld) * 0.5f;
            var dir = toWorld - fromWorld;
            var perp = new Vector3(-dir.z, 0f, dir.x).normalized;
            var ctrl = mid + perp * (dir.magnitude * 0.22f);
            ctrl.y = FlowY;

            // Pre-compute all bezier positions into the LineRenderer (before first yield)
            int n = BezierSegs + 1;
            for (int i = 0; i < n; i++)
            {
                float t = (float)i / BezierSegs;
                _bezierBuf[i] = QuadBezier(fromWorld, ctrl, toWorld, t, FlowY);
            }
            item.lr.positionCount = n;
            item.lr.SetPositions(_bezierBuf);

            // Set base color (white vertex colors, color from material)
            item.lr.startColor = Color.white;
            item.lr.endColor   = Color.white;

            // Fade in
            float elapsed = 0f;
            float fadeIn  = Mathf.Min(0.25f, duration * 0.15f);
            while (elapsed < fadeIn)
            {
                elapsed += Time.deltaTime;
                var alpha = elapsed / fadeIn;
                SetMatColor(item.mat, new Color(color.r, color.g, color.b, alpha));
                yield return null;
            }

            // Scroll texture offset for the full duration
            float scrollOffset = 0f;
            const float scrollSpeed = 1.8f;
            float hold = duration - fadeIn - 0.18f;
            elapsed = 0f;
            while (elapsed < hold)
            {
                elapsed     += Time.deltaTime;
                scrollOffset += Time.deltaTime * scrollSpeed;
                item.mat.SetTextureOffset("_BaseMap", new Vector2(scrollOffset, 0f));
                yield return null;
            }

            // Fade out
            elapsed = 0f;
            float fadeOut = 0.18f;
            while (elapsed < fadeOut)
            {
                elapsed += Time.deltaTime;
                var alpha = 1f - elapsed / fadeOut;
                SetMatColor(item.mat, new Color(color.r, color.g, color.b, alpha));
                yield return null;
            }

            item.mat.SetTextureOffset("_BaseMap", Vector2.zero);
            Return(item);
        }

        /// <summary>
        /// Raised parabolic arc that draws on from fromWorld to toWorld (diplomacy/credibility link).
        /// Returns after duration.
        /// </summary>
        public IEnumerator GoldArc(Vector3 fromWorld, Vector3 toWorld, float duration)
        {
            if (!IsInitialized) Init(transform);
            var item = Borrow(_arcPool);

            // Pre-compute arc positions (raised parabola in XZ + Y arc)
            for (int i = 0; i <= ArcSegs; i++)
            {
                float t = (float)i / ArcSegs;
                var p = Vector3.Lerp(fromWorld, toWorld, t);
                p.y  = ArcBaseY + Mathf.Sin(t * Mathf.PI) * ArcPeakDY;
                _arcBuf[i] = p;
            }

            item.lr.startColor = Color.white;
            item.lr.endColor   = new Color(1f, 1f, 1f, 0.55f);
            item.lr.positionCount = 0;

            var gold = DiplomacyGold;

            // Draw-on: reveal positions progressively
            float elapsed  = 0f;
            int prevRevealed = 0;
            while (elapsed < duration * 0.65f)
            {
                elapsed += Time.deltaTime;
                var k = Mathf.Clamp01(elapsed / (duration * 0.65f));
                int revealed = Mathf.Clamp(Mathf.RoundToInt(k * (ArcSegs + 1)), 2, ArcSegs + 1);

                if (revealed > prevRevealed)
                {
                    item.lr.positionCount = revealed;
                    for (int j = prevRevealed; j < revealed; j++)
                        item.lr.SetPosition(j, _arcBuf[j]);
                    prevRevealed = revealed;
                }

                // Fade in
                var alpha = Mathf.Clamp01(elapsed / 0.25f);
                SetMatColor(item.mat, new Color(gold.r, gold.g, gold.b, alpha));
                yield return null;
            }

            // Hold
            float holdTime = duration * 0.2f;
            elapsed = 0f;
            while (elapsed < holdTime) { elapsed += Time.deltaTime; yield return null; }

            // Fade out
            elapsed = 0f;
            float fadeOut = duration * 0.15f;
            while (elapsed < fadeOut)
            {
                elapsed += Time.deltaTime;
                var alpha = 1f - elapsed / fadeOut;
                SetMatColor(item.mat, new Color(gold.r, gold.g, gold.b, alpha * 0.9f));
                yield return null;
            }

            Return(item);
        }

        /// <summary>
        /// Progressive line draw-on (borders like the Radcliffe Line). Returns after duration.
        /// worldPts: pre-projected world positions.
        /// </summary>
        public IEnumerator DrawLine(List<Vector3> worldPts, Color color, float duration)
        {
            if (!IsInitialized) Init(transform);
            if (worldPts == null || worldPts.Count < 2) yield break;

            var item = Borrow(_linePool);

            // Copy input points to per-item buffer (one-time, not per frame)
            int n = Mathf.Min(worldPts.Count, MaxLinePts);
            for (int i = 0; i < n; i++)
            {
                var wp = worldPts[i];
                item.lineBuf[i] = new Vector3(wp.x, DrawLineY, wp.z);
            }

            item.lr.positionCount = 2;
            item.lr.SetPosition(0, item.lineBuf[0]);
            item.lr.SetPosition(1, item.lineBuf[1]);
            item.lr.startColor = Color.white;
            item.lr.endColor   = Color.white;

            // Fade in quickly
            SetMatColor(item.mat, new Color(color.r, color.g, color.b, 0f));

            float elapsed     = 0f;
            int   prevRevealed = 2;
            float scrollOff   = 0f;

            while (elapsed < duration)
            {
                elapsed += Time.deltaTime;
                var k = Mathf.Clamp01(elapsed / duration);

                // Reveal positions progressively
                int revealed = Mathf.Clamp(Mathf.RoundToInt(k * n), 2, n);
                if (revealed > prevRevealed)
                {
                    item.lr.positionCount = revealed;
                    for (int j = prevRevealed; j < revealed; j++)
                        item.lr.SetPosition(j, item.lineBuf[j]);
                    prevRevealed = revealed;
                }

                // Scroll texture
                scrollOff += Time.deltaTime * 0.6f;
                item.mat.SetTextureOffset("_BaseMap", new Vector2(scrollOff, 0f));

                // Fade in over first 0.3s, hold, fade at end
                float alpha;
                if (elapsed < 0.3f)
                    alpha = elapsed / 0.3f;
                else if (elapsed < duration - 0.25f)
                    alpha = 1f;
                else
                    alpha = (duration - elapsed) / 0.25f;

                SetMatColor(item.mat, new Color(color.r, color.g, color.b, Mathf.Clamp01(alpha)));
                yield return null;
            }

            Return(item);
        }

        /// <summary>Soft translucent disc wash over a region. Fire-and-forget or yield.</summary>
        public IEnumerator RegionTint(Vector3 world, float radius, Color color, float duration)
        {
            if (!IsInitialized) Init(transform);
            var item = Borrow(_discPool);

            // Position disc
            item.go.transform.position = new Vector3(world.x, DiscY, world.z);

            // Tint with low alpha (disc wash, not opaque)
            var tint = new Color(color.r, color.g, color.b, Mathf.Min(color.a, 0.28f));

            float elapsed = 0f;
            float fadeIn  = Mathf.Min(0.4f, duration * 0.22f);
            float fadeOut = Mathf.Min(0.35f, duration * 0.18f);
            float hold    = Mathf.Max(0f, duration - fadeIn - fadeOut);

            // Fade in (expanding disc)
            while (elapsed < fadeIn)
            {
                elapsed += Time.deltaTime;
                var k = elapsed / fadeIn;
                var r = Mathf.Lerp(radius * 0.3f, radius, k);
                item.go.transform.localScale = new Vector3(r * 2f, 0.004f, r * 2f);
                SetMatColor(item.mat, new Color(tint.r, tint.g, tint.b, tint.a * k));
                yield return null;
            }

            // Hold
            item.go.transform.localScale = new Vector3(radius * 2f, 0.004f, radius * 2f);
            SetMatColor(item.mat, tint);
            elapsed = 0f;
            while (elapsed < hold) { elapsed += Time.deltaTime; yield return null; }

            // Fade out
            elapsed = 0f;
            while (elapsed < fadeOut)
            {
                elapsed += Time.deltaTime;
                var k = elapsed / fadeOut;
                SetMatColor(item.mat, new Color(tint.r, tint.g, tint.b, tint.a * (1f - k)));
                yield return null;
            }

            Return(item);
        }

        /// <summary>Radial clock sweep on a pin (time effect). Fire-and-forget or yield.</summary>
        public IEnumerator ClockSweep(Vector3 world, float duration)
        {
            if (!IsInitialized) Init(transform);
            var item = Borrow(_clockPool);

            // Scale to board size: 0.05 × boardWidth ≈ 1.2 units on a 24-unit board — clearly
            // visible on a portrait phone without crowding adjacent pins.
            float radius = _boardWidth * 0.05f;
            var gold = DiplomacyGold;
            item.lr.startColor = Color.white;
            item.lr.endColor   = Color.white;
            SetMatColor(item.mat, gold);

            float elapsed = 0f;
            while (elapsed < duration)
            {
                elapsed += Time.deltaTime;
                var k = Mathf.Clamp01(elapsed / duration);

                // Sweep from 12 o'clock clockwise
                int pts = Mathf.Clamp(Mathf.RoundToInt(k * ClockSegs), 1, ClockSegs);
                item.lr.positionCount = pts + 1; // center + arc

                // Center
                item.lr.SetPosition(0, new Vector3(world.x, ClockY, world.z));

                // Arc points
                for (int i = 0; i < pts; i++)
                {
                    float ang = (float)i / ClockSegs * Mathf.PI * 2f - Mathf.PI * 0.5f;
                    item.lr.SetPosition(i + 1, new Vector3(
                        world.x + Mathf.Cos(ang) * radius,
                        ClockY,
                        world.z + Mathf.Sin(ang) * radius));
                }

                // Fade out in final 20%
                var alpha = k > 0.8f ? (1f - k) / 0.2f * 0.85f : 0.85f;
                SetMatColor(item.mat, new Color(gold.r, gold.g, gold.b, alpha));
                yield return null;
            }

            Return(item);
        }

        // ─────────────────────────────────────────────────────────────────────────
        // Selection link (persistent, driven by TheaterSession on card select)
        // ─────────────────────────────────────────────────────────────────────────

        /// <summary>
        /// Draws (or updates) a thin persistent amber line from <paramref name="from"/> to
        /// <paramref name="to"/> on the map surface. Used to link the selected order card in
        /// the bottom sheet to the pin it affects.  Call <see cref="ClearSelectionLink"/> when
        /// the selection changes, the sheet hides, or EXECUTE fires.
        /// </summary>
        public void DrawSelectionLink(Vector3 from, Vector3 to, Color color)
        {
            if (!IsInitialized) Init(_root != null ? _root : transform, _boardWidth);
            SetupSelectionLink();
            var f = new Vector3(from.x, SelectionLinkY, from.z);
            var t = new Vector3(to.x,   SelectionLinkY, to.z);
            _selectionLinkLR.positionCount = 2;
            _selectionLinkLR.SetPosition(0, f);
            _selectionLinkLR.SetPosition(1, t);
            SetMatColor(_selectionLinkMat, color);
            _selectionLinkLR.gameObject.SetActive(true);
        }

        /// <summary>Hides the selection link drawn by <see cref="DrawSelectionLink"/>.</summary>
        public void ClearSelectionLink()
        {
            if (_selectionLinkLR == null) return;
            _selectionLinkLR.positionCount = 0;
            _selectionLinkLR.gameObject.SetActive(false);
        }

        void SetupSelectionLink()
        {
            if (_selectionLinkLR != null) return;
            var root = _root != null ? _root : transform;
            var go = new GameObject("FX_SelectionLink");
            go.transform.SetParent(root, false);

            var lr = go.AddComponent<LineRenderer>();
            lr.useWorldSpace        = true;
            lr.shadowCastingMode    = UnityEngine.Rendering.ShadowCastingMode.Off;
            lr.receiveShadows       = false;
            lr.lightProbeUsage      = UnityEngine.Rendering.LightProbeUsage.Off;
            lr.startWidth           = SelectionLinkWidth;
            lr.endWidth             = SelectionLinkWidth;
            lr.numCapVertices       = 4;
            lr.positionCount        = 0;

            var grad = new Gradient();
            grad.SetKeys(
                new GradientColorKey[] { new GradientColorKey(new Color(0.96f, 0.65f, 0.14f), 0.0f), new GradientColorKey(new Color(1.0f, 0.88f, 0.5f), 1.0f) },
                new GradientAlphaKey[] { new GradientAlphaKey(0.35f, 0.0f), new GradientAlphaKey(0.95f, 1.0f) });
            lr.colorGradient = grad;

            _selectionLinkMat = TheaterMaterialFactory.Unlit(Color.white, "FX_SelectionLink");
            ApplyTransparentSurface(_selectionLinkMat);
            lr.sharedMaterial = _selectionLinkMat;

            _selectionLinkLR = lr;
            go.SetActive(false);
        }

        // ─────────────────────────────────────────────────────────────────────────
        // Editor helper (static visual state for non-play-mode snapshots)
        // ─────────────────────────────────────────────────────────────────────────

#if UNITY_EDITOR
        /// <summary>Directly sets pool items to a visible mid-animation state for editor screenshots.</summary>
        public void EditorShowStatic(
            Vector3 ringCenter, Color ringColor,
            Vector3 arrowFrom, Vector3 arrowTo, Color arrowColor,
            Vector3 arcFrom, Vector3 arcTo,
            List<Vector3> linePts, Color lineColor,
            Vector3 discCenter, float discRadius, Color discColor,
            Vector3 clockCenter)
        {
            if (!IsInitialized) Init(transform);

            // Rings: show at mid-radius
            for (int ri = 0; ri < Mathf.Min(3, PoolRings); ri++)
            {
                var it = Borrow(_ringPool);
                float r = 0.5f + ri * 0.55f;
                it.lr.positionCount = CircleSegs + 1;
                for (int i = 0; i <= CircleSegs; i++)
                {
                    var ci = s_UnitCircle[i % CircleSegs];
                    it.lr.SetPosition(i, new Vector3(ringCenter.x + ci.x * r, RingY, ringCenter.z + ci.z * r));
                }
                float fade = 1f - (float)ri / 3f;
                SetMatColor(it.mat, new Color(ringColor.r, ringColor.g, ringColor.b, fade * 0.85f));
            }

            // Arrow: full path visible
            {
                var it = Borrow(_arrowPool);
                var mid = (arrowFrom + arrowTo) * 0.5f;
                var dir = arrowTo - arrowFrom;
                var perp = new Vector3(-dir.z, 0f, dir.x).normalized;
                var ctrl = mid + perp * (dir.magnitude * 0.22f);
                ctrl.y = FlowY;
                it.lr.positionCount = BezierSegs + 1;
                for (int i = 0; i <= BezierSegs; i++)
                    it.lr.SetPosition(i, QuadBezier(arrowFrom, ctrl, arrowTo, (float)i / BezierSegs, FlowY));
                it.lr.startColor = Color.white;
                it.lr.endColor   = Color.white;
                SetMatColor(it.mat, arrowColor);
            }

            // Arc: full arc visible
            {
                var it = Borrow(_arcPool);
                it.lr.positionCount = ArcSegs + 1;
                for (int i = 0; i <= ArcSegs; i++)
                {
                    float t = (float)i / ArcSegs;
                    var p = Vector3.Lerp(arcFrom, arcTo, t);
                    p.y = ArcBaseY + Mathf.Sin(t * Mathf.PI) * ArcPeakDY;
                    it.lr.SetPosition(i, p);
                }
                it.lr.startColor = Color.white;
                it.lr.endColor   = new Color(1f, 1f, 1f, 0.5f);
                SetMatColor(it.mat, DiplomacyGold);
            }

            // DrawLine: full line visible
            if (linePts != null && linePts.Count >= 2)
            {
                var it = Borrow(_linePool);
                int n = Mathf.Min(linePts.Count, MaxLinePts);
                it.lr.positionCount = n;
                for (int i = 0; i < n; i++)
                {
                    var wp = linePts[i];
                    it.lineBuf[i] = new Vector3(wp.x, DrawLineY, wp.z);
                    it.lr.SetPosition(i, it.lineBuf[i]);
                }
                it.lr.startColor = Color.white;
                it.lr.endColor   = Color.white;
                SetMatColor(it.mat, lineColor);
            }

            // Disc: visible at given radius
            {
                var it = Borrow(_discPool);
                it.go.transform.position = new Vector3(discCenter.x, DiscY, discCenter.z);
                it.go.transform.localScale = new Vector3(discRadius * 2f, 0.004f, discRadius * 2f);
                SetMatColor(it.mat, new Color(discColor.r, discColor.g, discColor.b, 0.22f));
            }

            // Clock: half-sweep
            {
                var it = Borrow(_clockPool);
                const float r = 0.42f;
                int pts = ClockSegs / 2;
                it.lr.positionCount = pts + 1;
                it.lr.SetPosition(0, new Vector3(clockCenter.x, ClockY, clockCenter.z));
                for (int i = 0; i < pts; i++)
                {
                    float ang = (float)i / ClockSegs * Mathf.PI * 2f - Mathf.PI * 0.5f;
                    it.lr.SetPosition(i + 1, new Vector3(
                        clockCenter.x + Mathf.Cos(ang) * r, ClockY, clockCenter.z + Mathf.Sin(ang) * r));
                }
                it.lr.startColor = Color.white;
                it.lr.endColor   = Color.white;
                SetMatColor(it.mat, DiplomacyGold);
            }
        }
#endif

        // ─────────────────────────────────────────────────────────────────────────
        // Animation routines
        // ─────────────────────────────────────────────────────────────────────────

        IEnumerator PulseRingRoutine(FxItem item, Vector3 world, Color color, float delay)
        {
            // Delay without WaitForSeconds allocation
            if (delay > 0f)
            {
                float d = 0f;
                while (d < delay) { d += Time.deltaTime; yield return null; }
            }

            item.lr.positionCount = CircleSegs + 1;
            item.lr.startColor    = Color.white;
            item.lr.endColor      = Color.white;

            const float dur       = 1.0f;
            const float maxRadius = 1.7f;
            const float minRadius = 0.08f;
            float t = 0f;

            while (t < dur)
            {
                t += Time.deltaTime;
                var k      = Mathf.Clamp01(t / dur);
                var radius = Mathf.Lerp(minRadius, maxRadius, k * (2f - k));       // ease-out
                var alpha  = color.a * (1f - k * k);                               // quadratic fade

                for (int i = 0; i <= CircleSegs; i++)
                {
                    var ci = s_UnitCircle[i % CircleSegs];
                    item.lr.SetPosition(i, new Vector3(
                        world.x + ci.x * radius,
                        RingY,
                        world.z + ci.z * radius));
                }

                SetMatColor(item.mat, new Color(color.r, color.g, color.b, alpha));
                yield return null;
            }

            Return(item);
        }

        // ─────────────────────────────────────────────────────────────────────────
        // Pool management
        // ─────────────────────────────────────────────────────────────────────────

        void CreateDashTexture()
        {
            _dashTex = new Texture2D(8, 1, TextureFormat.RGBA32, false)
            {
                filterMode = FilterMode.Point,
                wrapMode   = TextureWrapMode.Repeat
            };
            for (int i = 0; i < 8; i++)
                _dashTex.SetPixel(i, 0, i < 5 ? Color.white : Color.clear);
            _dashTex.Apply();
        }

        void CreateLRPool(List<FxItem> pool, int count, string tag, float width,
                          LineTextureMode texMode, bool needsLineBuf)
        {
            for (int i = 0; i < count; i++)
            {
                var go = new GameObject($"FX_{tag}_{i}");
                go.transform.SetParent(_root, false);
                go.SetActive(false);

                var lr = go.AddComponent<LineRenderer>();
                lr.useWorldSpace        = true;
                lr.shadowCastingMode    = UnityEngine.Rendering.ShadowCastingMode.Off;
                lr.receiveShadows       = false;
                lr.lightProbeUsage      = UnityEngine.Rendering.LightProbeUsage.Off;
                lr.startWidth           = width;
                lr.endWidth             = width;
                lr.textureMode          = texMode;
                lr.numCapVertices       = 2;
                lr.positionCount        = 0;

                var mat = TheaterMaterialFactory.Unlit(Color.clear, $"FX_{tag}");
                ApplyTransparentSurface(mat);

                bool isDashed = tag is "FlowArrow" or "DrawLine";
                if (isDashed && _dashTex != null)
                {
                    mat.SetTexture("_BaseMap", _dashTex);
                    mat.SetTextureScale("_BaseMap", new Vector2(5f, 1f));
                }

                lr.sharedMaterial = mat;

                var item = new FxItem { go = go, lr = lr, mat = mat };
                if (needsLineBuf) item.lineBuf = new Vector3[MaxLinePts];
                pool.Add(item);
            }
        }

        void CreateDiscPool(List<FxItem> pool, int count, string tag)
        {
            for (int i = 0; i < count; i++)
            {
                var go = new GameObject($"FX_{tag}_{i}");
                go.transform.SetParent(_root, false);
                go.SetActive(false);

                // Flat cylinder as disc
                var discGo = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
                discGo.name = "DiscMesh";
                discGo.transform.SetParent(go.transform, false);
                discGo.transform.localPosition = Vector3.zero;
                discGo.transform.localScale    = new Vector3(1f, 0.004f, 1f);

                var col = discGo.GetComponent<Collider>();
                if (col != null)
                {
                    if (Application.isPlaying) Destroy(col);
                    else DestroyImmediate(col);
                }

                var mr  = discGo.GetComponent<MeshRenderer>();
                var mat = TheaterMaterialFactory.Unlit(Color.clear, $"FX_{tag}");
                ApplyTransparentSurface(mat);
                if (mr != null) mr.sharedMaterial = mat;

                pool.Add(new FxItem { go = go, mr = mr, mat = mat });
            }
        }

        FxItem Borrow(List<FxItem> pool)
        {
            // Linear scan — pools are small (≤6 items), no GC on List<T> value-type enumerator
            for (int i = 0; i < pool.Count; i++)
            {
                if (!pool[i].inUse)
                {
                    pool[i].inUse = true;
                    pool[i].go.SetActive(true);
                    return pool[i];
                }
            }
            // All in use: silently reuse first (clears old state)
            pool[0].inUse = true;
            pool[0].go.SetActive(true);
            return pool[0];
        }

        void Return(FxItem item)
        {
            if (item == null) return;
            item.inUse = false;
            if (item.lr != null) item.lr.positionCount = 0;
            if (item.go != null) item.go.SetActive(false);
        }

        static void ReturnAll(List<FxItem> pool)
        {
            for (int i = 0; i < pool.Count; i++)
            {
                var it = pool[i];
                it.inUse = false;
                if (it.lr != null) it.lr.positionCount = 0;
                if (it.go != null) it.go.SetActive(false);
            }
        }

        // ─────────────────────────────────────────────────────────────────────────
        // Utilities (all GC-free — no heap allocation in hot path)
        // ─────────────────────────────────────────────────────────────────────────

        static Vector3 QuadBezier(Vector3 a, Vector3 ctrl, Vector3 b, float t, float y)
        {
            float it = 1f - t;
            var p = it * it * a + 2f * it * t * ctrl + t * t * b;
            p.y = y;
            return p;
        }

        static void SetMatColor(Material mat, Color c)
        {
            if (mat == null) return;
            if (mat.HasProperty("_BaseColor")) mat.SetColor("_BaseColor", c);
            if (mat.HasProperty("_Color"))     mat.SetColor("_Color",     c);
        }

        static void ApplyTransparentSurface(Material mat)
        {
            if (mat == null) return;
            if (mat.HasProperty("_Surface"))   mat.SetFloat("_Surface",   1f);
            if (mat.HasProperty("_ZWrite"))    mat.SetFloat("_ZWrite",    0f);
            if (mat.HasProperty("_SrcBlend"))
                mat.SetFloat("_SrcBlend",  (float)UnityEngine.Rendering.BlendMode.SrcAlpha);
            if (mat.HasProperty("_DstBlend"))
                mat.SetFloat("_DstBlend",  (float)UnityEngine.Rendering.BlendMode.OneMinusSrcAlpha);
            mat.SetOverrideTag("RenderType", "Transparent");
            mat.renderQueue = (int)UnityEngine.Rendering.RenderQueue.Transparent;
            mat.EnableKeyword("_SURFACE_TYPE_TRANSPARENT");
        }
    }
}
