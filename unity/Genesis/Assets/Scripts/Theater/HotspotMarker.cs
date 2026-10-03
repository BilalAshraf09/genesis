using Genesis.Data;
using UnityEngine;
using Genesis.UI;

namespace Genesis.Theater
{
    /// <summary>
    /// Tap target on the Living Atlas map board.
    /// Clean flat map pin: white paper dot + dark outline disc + soft amber pulse ring.
    /// Labels are driven by MapLabelOverlay (UI Toolkit) — no TextMesh here.
    /// All public API signatures kept for TheaterSession / WorldReactionFX / BoardPointerInput.
    /// </summary>
    [RequireComponent(typeof(SphereCollider))]
    public class HotspotMarker : MonoBehaviour
    {
        // ── Public API ─────────────────────────────────────────────────────────
        public MapMarker       Marker       { get; private set; }
        public bool            IsSelected   { get; private set; }
        public bool            LabelVisible { get; private set; } = true;
        public CityStressLevel Stress       => _stress;

        // LabelRoot kept as empty placeholder for MapLabelLayout backward compat.
        public Transform LabelRoot       => _labelRoot;
        public float     LabelHalfWidth  => 1.1f;
        public float     LabelHalfHeight => 0.28f;

        // ── Visual constants ───────────────────────────────────────────────────
        const float OutlineRadius  = 0.22f;
        const float DotRadius      = 0.14f;
        const float RingIdleRadius = 0.45f;
        const float RingSelRadius  = 0.75f;
        const float DiscHeight     = 0.009f;
        const float ColliderRadius = 1.2f;

        static readonly Color ColDotIdle      = new(0.96f, 0.94f, 0.90f, 1.00f);
        static readonly Color ColDotSel       = new(1.00f, 0.72f, 0.22f, 1.00f);
        static readonly Color ColOutline      = new(0.04f, 0.07f, 0.12f, 0.95f);
        static readonly Color ColRingIdle     = new(0.93f, 0.66f, 0.16f, 0.35f);
        static readonly Color ColRingActive   = new(0.93f, 0.66f, 0.16f, 0.65f);
        static readonly Color ColRingSel      = new(1.00f, 0.75f, 0.25f, 0.95f);
        static readonly Color ColStressGreen  = new(0.25f, 0.72f, 0.48f, 0.95f);
        static readonly Color ColStressOrange = new(0.96f, 0.65f, 0.14f, 0.95f);
        static readonly Color ColStressRed    = new(0.90f, 0.33f, 0.29f, 0.95f);

        // ── State ──────────────────────────────────────────────────────────────
        MeshRenderer    _dotRenderer;
        MeshRenderer    _ringRenderer;
        Transform       _labelRoot;
        float           _moodUntil;
        Color           _moodTint = Color.clear;
        CityStressLevel _stress   = CityStressLevel.Calm;

        // ── Lifecycle ──────────────────────────────────────────────────────────

        public void Initialize(MapMarker marker, Material idle, Material selected)
        {
            Marker = marker;
            // idle / selected materials kept in signature for API compatibility but unused here.
            SetupCollider();
            BuildVisuals();

            // Empty LabelRoot placeholder so MapLabelLayout / old callers don't NRE.
            var lr = new GameObject("LabelRoot");
            _labelRoot = lr.transform;
            _labelRoot.SetParent(transform, false);

            SetSelected(false);
        }

        void SetupCollider()
        {
            var sc = GetComponent<SphereCollider>();
            if (sc == null) sc = gameObject.AddComponent<SphereCollider>();
            sc.radius  = ColliderRadius;
            sc.center  = new Vector3(0f, 0.05f, 0f);
            sc.isTrigger = false;
        }

        void BuildVisuals()
        {
            SpawnDisc("Outline", OutlineRadius,   DiscHeight,          0.000f, ColOutline,  out _);
            SpawnDisc("Dot",     DotRadius,        DiscHeight * 1.5f,   0.002f, ColDotIdle,  out _dotRenderer);
            SpawnDisc("Ring",    RingIdleRadius,   DiscHeight * 0.55f, -0.002f, ColRingIdle, out _ringRenderer);
        }

        void SpawnDisc(string goName, float radius, float height, float yOff, Color col, out MeshRenderer mr)
        {
            var go = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            go.name = goName;
            go.transform.SetParent(transform, false);
            go.transform.localPosition = new Vector3(0f, yOff, 0f);
            go.transform.localScale    = new Vector3(radius * 2f, height, radius * 2f);
            var c = go.GetComponent<Collider>();
            if (c != null) Destroy(c);
            mr = go.GetComponent<MeshRenderer>();
            if (mr != null)
            {
                mr.sharedMaterial    = TheaterMaterialFactory.Unlit(col, $"Pin_{goName}");
                mr.shadowCastingMode = UnityEngine.Rendering.ShadowCastingMode.Off;
                mr.receiveShadows    = false;
            }
        }

        // ── Public interface ───────────────────────────────────────────────────

        /// <summary>No-op; MapLabelOverlay drives label positions.</summary>
        public void ApplyLabelLocalOffset(Vector3 localOffset) { }

        /// <summary>Brief tint on EXECUTE — mood flashes dot and ring.</summary>
        public void PulseMood(Color tint, float seconds = 1.05f)
        {
            _moodTint  = tint;
            _moodUntil = Time.time + Mathf.Max(0.2f, seconds);
            if (_dotRenderer  != null)
                _dotRenderer.sharedMaterial  = TheaterMaterialFactory.Unlit(
                    new Color(tint.r, tint.g, tint.b, 0.95f), "PinMood");
            if (_ringRenderer != null)
                _ringRenderer.sharedMaterial = TheaterMaterialFactory.Unlit(
                    new Color(tint.r, tint.g, tint.b, 0.65f), "PinRingMood");
        }

        /// <summary>Persistent city-stress scar colour on the dot.</summary>
        public void SetStress(CityStressLevel level)
        {
            _stress = level;
            if (!IsSelected) ApplyDotColor();
        }

        public void SetLabelVisible(bool visible)
        {
            LabelVisible = visible;
            if (_labelRoot != null) _labelRoot.gameObject.SetActive(visible);
        }

        public void SetSelected(bool selected)
        {
            IsSelected = selected;
            ApplyDotColor();

            if (_ringRenderer != null)
            {
                var r = selected ? RingSelRadius : RingIdleRadius;
                _ringRenderer.transform.localScale = new Vector3(r * 2f, DiscHeight * 0.55f, r * 2f);
                _ringRenderer.sharedMaterial = TheaterMaterialFactory.Unlit(
                    selected ? ColRingSel : ColRingIdle, "PinRing");
            }
        }

        void ApplyDotColor()
        {
            if (_dotRenderer == null) return;
            Color col = IsSelected          ? ColDotSel
                      : _stress == CityStressLevel.Secure   ? ColStressGreen
                      : _stress == CityStressLevel.Strained ? ColStressOrange
                      : _stress == CityStressLevel.Closed   ? ColStressRed
                      : ColDotIdle;
            _dotRenderer.sharedMaterial = TheaterMaterialFactory.Unlit(col, "PinDot");
        }

        // ── Per-frame animation ────────────────────────────────────────────────

        void Update()
        {
            if (_ringRenderer == null) return;

            // Clear mood tint when it expires
            if (_moodTint.a > 0.01f && Time.time >= _moodUntil)
            {
                _moodTint = Color.clear;
                ApplyDotColor();
            }

            var mood   = _moodTint.a > 0.01f;
            var pulse  = Mathf.Sin(Time.time * (IsSelected ? 4.2f : 2.2f)) * 0.5f + 0.5f;
            var baseR  = IsSelected ? RingSelRadius : RingIdleRadius;
            var pulsedR = baseR * (1f + pulse * (IsSelected ? 0.22f : 0.12f));
            _ringRenderer.transform.localScale = new Vector3(pulsedR * 2f, DiscHeight * 0.55f, pulsedR * 2f);

            var baseCol = mood ? new Color(_moodTint.r, _moodTint.g, _moodTint.b, 0.70f)
                               : (IsSelected ? ColRingSel : ColRingActive);
            var a = IsSelected ? Mathf.Lerp(0.65f, 1.0f, pulse)
                               : Mathf.Lerp(0.25f, 0.55f, pulse);
            _ringRenderer.sharedMaterial = TheaterMaterialFactory.Unlit(
                new Color(baseCol.r, baseCol.g, baseCol.b, a), "PinRing");
        }

        void OnMouseDown()
        {
            if (FindFirstObjectByType<BoardPointerInput>() != null) return;
            TheaterSession.Instance?.OnHotspotTapped(this);
        }
    }
}
