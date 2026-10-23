using System.Collections.Generic;
using Genesis.Theater;
using Genesis.UI.Toolkit;
using UnityEngine;
using UnityEngine.UIElements;

namespace Genesis.Atlas
{
    /// <summary>
    /// UI Toolkit overlay that projects world-space label positions each LateUpdate.
    /// Country names + up to 4 pin labels; collision-culled, always upright.
    /// Sorting order 0 (below HUD at 10, below order sheet at 20).
    /// </summary>
    public sealed class MapLabelOverlay : MonoBehaviour
    {
        // Visible band constants (fraction of screen height from top)
        const float HudBandTop    = 0.15f;  // below the top HUD bar
        // Fallback when OrderSheet geometry is unavailable. Prefer live sheet height.
        // Matches TheaterCameraRig + OrderSheetLayout peek (~36% panel) + small margin.
        const float SheetBandBottomFallback = 0.30f;
        const int MaxPinLabels    = 4;
        const float LabelDotOffsetX = 12f;  // px right of the projected dot centre
        const float LabelDotOffsetY = -16f; // px up from the projected dot centre
        const float MinOverlapDist  = 64f;  // min px between label centres (collision cull)

        TheaterBoardBuilder _builder;
        Camera _cam;
        VisualElement _root;
        UIDocument _doc;

        // Country label elements (static, created once)
        readonly List<(Label label, float lat, float lon)> _countryLabels = new();
        // Pin label elements (one per hotspot marker; reused)
        readonly List<PinLabelEntry> _pinEntries = new();

        struct PinLabelEntry
        {
            public string MarkerId;
            public Label Label;
            public VisualElement Halo;
            public VisualElement Dot;
            public VisualElement FactBubble;
            public Label FactTitle;
            public Label FactLabel;
        }

        // ── Initialisation ────────────────────────────────────────────────────

        /// <summary>
        /// Called by TheaterBoardBuilder after the map and hotspots are ready.
        /// </summary>
        public void Initialize(TheaterBoardBuilder builder, Camera cam)
        {
            _builder = builder;
            _cam = cam != null ? cam : Camera.main;
            BuildDocument();
            RebuildCountryLabels();
            RebuildPinLabels();
        }

        void OnEnable()
        {
            // Soft domain reload clears managed VisualElement refs while the child
            // UIDocument GameObject can survive empty — recover on the next enable.
            if (_builder != null || GetComponentInParent<TheaterBoardBuilder>() != null)
                EnsurePinsBuilt();
        }

        /// <summary>
        /// Rebuild pin UI when hotspots arrive after the first Initialize
        /// (or after a soft domain reload left an empty overlay).
        /// </summary>
        public void EnsurePinsBuilt()
        {
            RecoverRuntimeStateIfNeeded();
            if (_builder == null || _root == null) return;

            // Accessing Hotspots triggers dictionary recovery after soft reload.
            int hotspotCount = _builder.Hotspots != null ? _builder.Hotspots.Count : 0;
            if (hotspotCount <= 0) return;

            bool pinsStale = _pinEntries.Count != hotspotCount;
            if (!pinsStale)
            {
                // Document may still be empty even if list counts match after reload.
                for (int i = 0; i < _pinEntries.Count; i++)
                {
                    if (_pinEntries[i].FactBubble == null || _pinEntries[i].FactBubble.panel == null)
                    {
                        pinsStale = true;
                        break;
                    }
                }
            }

            if (pinsStale)
            {
                if (_countryLabels.Count == 0)
                    RebuildCountryLabels();
                RebuildPinLabels();
            }
        }

        void RecoverRuntimeStateIfNeeded()
        {
            if (_builder == null)
                _builder = GetComponentInParent<TheaterBoardBuilder>()
                           ?? FindAnyObjectByType<TheaterBoardBuilder>();
            if (_cam == null)
                _cam = Camera.main;

            if (_doc == null)
                _doc = GetComponentInChildren<UIDocument>(true);

            if (_doc != null)
            {
                var r = _doc.rootVisualElement;
                if (r != null)
                {
                    _root = r.Q(null, "map-label-root");
                    if (_root == null)
                        AttachLabelRoot(r);
                }
            }

            if (_doc == null || _root == null)
                BuildDocument();
        }

        void BuildDocument()
        {
            // Reuse surviving child document after soft reload — never spawn duplicates.
            _doc = GetComponentInChildren<UIDocument>(true);
            if (_doc == null)
            {
                _doc = UiRegistry.CreateDocument("MapLabels", transform, sortingOrder: 0,
                    uxmlName: null, "MapLabels");
            }
            else
            {
                _doc.sortingOrder = 0;
                var reg = UiRegistry.Load();
                if (reg != null && reg.panelSettings != null)
                    _doc.panelSettings = reg.panelSettings;
                var existingRoot = _doc.rootVisualElement;
                if (existingRoot != null && reg != null)
                {
                    var sheet = reg.Sheet("MapLabels");
                    if (sheet != null && !existingRoot.styleSheets.Contains(sheet))
                        existingRoot.styleSheets.Add(sheet);
                }
            }

            var r = _doc.rootVisualElement;
            if (r == null) return;
            r.pickingMode = PickingMode.Ignore;

            _root = r.Q(null, "map-label-root");
            if (_root == null)
                AttachLabelRoot(r);

            // Critical: Map labels must ignore any Safe Area padding applied to the document root
            r.style.paddingLeft = 0;
            r.style.paddingRight = 0;
            r.style.paddingTop = 0;
            r.style.paddingBottom = 0;
        }

        void AttachLabelRoot(VisualElement documentRoot)
        {
            _root = new VisualElement();
            _root.pickingMode = PickingMode.Ignore;
            _root.AddToClassList("map-label-root");
            _root.style.width = Length.Percent(100);
            _root.style.height = Length.Percent(100);
            _root.style.position = Position.Absolute;
            _root.style.left = 0;
            _root.style.top = 0;
            documentRoot.Add(_root);
        }

        void RebuildCountryLabels()
        {
            _countryLabels.Clear();
            if (_builder == null || string.IsNullOrEmpty(_builder.TheaterId)) return;
            var content = AtlasContent.ForTheater(_builder.TheaterId);
            foreach (var country in content.Countries)
            {
                var lbl = new Label(country.name.ToUpperInvariant());
                lbl.pickingMode = PickingMode.Ignore;
                lbl.AddToClassList("country-label");
                lbl.style.display = DisplayStyle.None;
                _root.Add(lbl);
                _countryLabels.Add((lbl, country.lat, country.lon));
            }
        }

        void RebuildPinLabels()
        {
            // Remove prior pin UI from the root before rebuilding.
            foreach (var e in _pinEntries)
            {
                e.Label?.RemoveFromHierarchy();
                e.Halo?.RemoveFromHierarchy();
                e.Dot?.RemoveFromHierarchy();
                e.FactBubble?.RemoveFromHierarchy();
            }
            _pinEntries.Clear();
            if (_builder?.Hotspots == null || _root == null) return;
            var content = AtlasContent.ForTheater(_builder.TheaterId ?? "");

            foreach (var kv in _builder.Hotspots)
            {
                var marker = kv.Value?.Marker;
                if (marker == null) continue;

                // Resolve display label from gazetteer or marker label
                string display = marker.label ?? marker.id;
                if (content.TryGetPlace(marker.id, out var place) && !string.IsNullOrEmpty(place.label))
                    display = place.label;

                var halo = new VisualElement();
                halo.pickingMode = PickingMode.Ignore;
                halo.AddToClassList("pin-halo");
                halo.style.display = DisplayStyle.None;
                _root.Add(halo);

                var dot = new VisualElement();
                dot.pickingMode = PickingMode.Ignore;
                dot.AddToClassList("pin-dot");
                dot.style.display = DisplayStyle.None;
                _root.Add(dot);

                var lbl = new Label(display);
                lbl.pickingMode = PickingMode.Ignore;
                lbl.AddToClassList("pin-label");
                lbl.style.display = DisplayStyle.None;
                _root.Add(lbl);

                // Fact bubble for selected state
                var bubble = new VisualElement();
                bubble.pickingMode = PickingMode.Ignore;
                bubble.AddToClassList("pin-fact-bubble");
                bubble.style.display = DisplayStyle.None;
                _root.Add(bubble);

                var title = new Label(display.ToUpperInvariant());
                title.pickingMode = PickingMode.Ignore;
                title.AddToClassList("pin-fact-title");
                title.AddToClassList("type-card-title");
                bubble.Add(title);

                var bodyRow = new VisualElement();
                bodyRow.pickingMode = PickingMode.Ignore;
                bodyRow.AddToClassList("pin-fact-body-row");

                var pinGlyph = new Label("⌖");
                pinGlyph.pickingMode = PickingMode.Ignore;
                pinGlyph.AddToClassList("pin-fact-pin");
                bodyRow.Add(pinGlyph);

                string factText = content.FactFor(marker.id);
                if (string.IsNullOrEmpty(factText)) factText = "Strategic flashpoint during the crisis.";
                var fact = new Label(factText);
                fact.pickingMode = PickingMode.Ignore;
                fact.AddToClassList("pin-fact-body");
                fact.AddToClassList("type-secondary");
                bodyRow.Add(fact);
                bubble.Add(bodyRow);

                var caret = new VisualElement();
                caret.pickingMode = PickingMode.Ignore;
                caret.AddToClassList("pin-fact-caret");
                bubble.Add(caret);

                _pinEntries.Add(new PinLabelEntry
                {
                    MarkerId = marker.id,
                    Label = lbl,
                    Halo = halo,
                    Dot = dot,
                    FactBubble = bubble,
                    FactTitle = title,
                    FactLabel = fact
                });
            }
        }

        // ── Per-frame update ──────────────────────────────────────────────────

        Rect _activeBubbleRect = Rect.zero;
        readonly List<Rect> _placedPinRects = new();

        void LateUpdate()
        {
            if (_builder == null || _root == null) return;
            if (_cam == null) _cam = Camera.main;
            if (_cam == null) return;

            // Hotspots can be empty at first Initialize in some boot orders — recover.
            EnsurePinsBuilt();
            if (_pinEntries.Count == 0) return;

            var proj = _builder.EnsureProjection();
            if (proj == null) return;

            var panel = _root.panel;
            if (panel == null) return;

            float panelW = _root.resolvedStyle.width;
            float panelH = _root.resolvedStyle.height;
            if (panelW < 1f || panelH < 1f) return;

            // Visible band in panel pixels (top-down from panel top).
            // Derive the sheet occlusion from the live OrderSheet height when possible
            // so callouts stay in the open map band after peek/typography changes.
            float sheetFrac = ResolveSheetBandFraction(panelH);
            float bandTopPx    = HudBandTop * panelH;
            float bandBottomPx = (1f - sheetFrac) * panelH;

            _activeBubbleRect = Rect.zero;
            _placedPinRects.Clear();

            // --- Pin labels first (higher priority) ---
            UpdatePinLabels(proj, panel, bandTopPx, bandBottomPx, panelW, panelH);

            // --- Country labels second (culled against pin labels and bubble) ---
            UpdateCountryLabels(proj, panel, bandTopPx, bandBottomPx, panelW);
        }

        static float ResolveSheetBandFraction(float panelH)
        {
            if (panelH < 1f) return SheetBandBottomFallback;

            // Prefer peek math (cheap, no scene scan) so LateUpdate never depends on
            // FindObjectsByType after soft reload. Matches OrderSheetLayout peek ≈ 36%.
            float peek = OrderSheetLayout.PeekSheetHeight(panelH);
            if (peek > 40f)
                return Mathf.Clamp((peek / panelH) + 0.02f, 0.22f, 0.42f);

            return SheetBandBottomFallback;
        }

        static bool TryWorldToPanel(IPanel panel, Camera cam, Vector3 worldPos, out Vector2 panelPos)
        {
            panelPos = default;
            if (panel == null || cam == null) return false;

            // Prefer the panel-aware transform — robust under ScaleWithScreenSize /
            // letterboxed Game View (manual Screen.height math often drifts).
            var sp = cam.WorldToScreenPoint(worldPos);
            if (sp.z < 0f) return false;

            panelPos = RuntimePanelUtils.CameraTransformWorldToPanel(panel, worldPos, cam);
            return !float.IsNaN(panelPos.x) && !float.IsNaN(panelPos.y);
        }

        void UpdateCountryLabels(GeoProjection proj, IPanel panel,
                                  float bandTopPx, float bandBottomPx, float panelW)
        {
            foreach (var (lbl, lat, lon) in _countryLabels)
            {
                var worldPos = proj.LatLonToWorld(lat, lon, 0.05f);
                if (!TryWorldToPanel(panel, _cam, worldPos, out var panelPos))
                {
                    lbl.style.display = DisplayStyle.None;
                    continue;
                }

                float px = panelPos.x;
                float py = panelPos.y;

                if (py < bandTopPx || py > bandBottomPx || px < 0 || px > panelW)
                {
                    lbl.style.display = DisplayStyle.None;
                    continue;
                }

                // Centre the label on the projected point
                float halfW = lbl.resolvedStyle.width  * 0.5f;
                float halfH = lbl.resolvedStyle.height * 0.5f;
                if (halfW < 1f) halfW = 50f;
                if (halfH < 1f) halfH = 18f;

                var countryRect = new Rect(px - halfW, py - halfH, halfW * 2f, halfH * 2f);

                // Cull if overlapping active fact bubble
                if (_activeBubbleRect.width > 0 && countryRect.Overlaps(_activeBubbleRect))
                {
                    lbl.style.display = DisplayStyle.None;
                    continue;
                }

                // Cull if overlapping any pin label
                bool overlapsPin = false;
                foreach (var pr in _placedPinRects)
                {
                    if (countryRect.Overlaps(pr))
                    {
                        overlapsPin = true;
                        break;
                    }
                }
                if (overlapsPin)
                {
                    lbl.style.display = DisplayStyle.None;
                    continue;
                }

                lbl.style.display = DisplayStyle.Flex;
                lbl.style.left    = Length.Pixels(px - halfW);
                lbl.style.top     = Length.Pixels(py - halfH);
            }
        }

        void UpdatePinLabels(GeoProjection proj, IPanel panel,
                              float bandTopPx, float bandBottomPx, float panelW, float panelH)
        {
            if (_builder.Hotspots == null) return;

            var content = AtlasContent.ForTheater(_builder.TheaterId ?? "");

            // Score each pin for priority
            var candidates = new List<(int idx, float priority, Vector2 panelPos, bool selected)>();
            for (var i = 0; i < _pinEntries.Count; i++)
            {
                var entry = _pinEntries[i];
                if (!_builder.Hotspots.TryGetValue(entry.MarkerId, out var hs) || hs == null) continue;

                // Use real lat/lon if available, otherwise fall back to marker percent
                Vector3 worldPos;
                if (content.TryGetPlace(entry.MarkerId, out var place))
                    worldPos = proj.LatLonToWorld(place.lat, place.lon, 0.05f);
                else
                {
                    var m = hs.Marker;
                    worldPos = proj.PercentToWorld(m.x, m.y, 0.05f);
                }

                if (!TryWorldToPanel(panel, _cam, worldPos, out var panelPos)) continue;

                float px = panelPos.x;
                float py = panelPos.y;
                bool sel = hs.IsSelected;
                // Selected pins stay visible even when near the sheet/HUD; others stay in the open map band.
                if (!sel && (py < bandTopPx || py > bandBottomPx || px < 0 || px > panelW)) continue;
                if (sel && (px < -40f || px > panelW + 40f || py < 0f || py > panelH)) continue;

                float priority = sel ? 0f : 1f;  // lower = higher priority
                candidates.Add((i, priority, panelPos, sel));
            }

            // Sort: selected first, then by priority
            candidates.Sort((a, b) => a.priority.CompareTo(b.priority));

            // Hide all first
            foreach (var e in _pinEntries)
            {
                e.Label.style.display      = DisplayStyle.None;
                if (e.Halo != null) e.Halo.style.display = DisplayStyle.None;
                e.Dot.style.display        = DisplayStyle.None;
                e.FactBubble.style.display = DisplayStyle.None;
            }

            // Show up to MaxPinLabels, collision-culled
            var placed = new List<Vector2>();
            int shown = 0;
            foreach (var (idx, _, panelPos, selected) in candidates)
            {
                if (shown >= MaxPinLabels) break;

                // Collision check against already-placed pins (dots + labels).
                bool overlaps = false;
                foreach (var p in placed)
                {
                    if (Vector2.Distance(panelPos, p) < MinOverlapDist)
                    { overlaps = true; break; }
                }
                // Also cull against the active callout rect before showing.
                if (!selected && _activeBubbleRect.width > 0f)
                {
                    var probe = new Rect(panelPos.x - 8f, panelPos.y - 8f, 16f, 16f);
                    if (probe.Overlaps(_activeBubbleRect)) overlaps = true;
                }
                if (overlaps && !selected) continue;

                var entry = _pinEntries[idx];
                float dotSize = selected ? 14f : 10f;

                // Soft orange halo behind the selected pin (reference pulse)
                if (selected && entry.Halo != null)
                {
                    const float haloSize = 36f;
                    entry.Halo.style.display = DisplayStyle.Flex;
                    entry.Halo.style.left = Length.Pixels(panelPos.x - haloSize * 0.5f);
                    entry.Halo.style.top = Length.Pixels(panelPos.y - haloSize * 0.5f);
                    entry.Halo.style.width = haloSize;
                    entry.Halo.style.height = haloSize;
                    entry.Halo.BringToFront();
                }

                // Dot
                entry.Dot.style.display = DisplayStyle.Flex;
                entry.Dot.style.left    = Length.Pixels(panelPos.x - dotSize * 0.5f);
                entry.Dot.style.top     = Length.Pixels(panelPos.y - dotSize * 0.5f);
                entry.Dot.style.width   = dotSize;
                entry.Dot.style.height  = dotSize;
                entry.Dot.EnableInClassList("pin-dot--selected", selected);
                entry.Dot.BringToFront();

                // Label (offset right and slightly up from dot).
                // Selected pins use the FactBubble only — hide the plain label.
                if (!selected)
                {
                    float labelW = entry.Label.resolvedStyle.width;
                    if (labelW < 1f) labelW = 120f;
                    float labelH = 28f;

                    // Try right-of-dot, then left-of-dot, then hide label (keep dot).
                    float[] xCandidates =
                    {
                        panelPos.x + LabelDotOffsetX,
                        panelPos.x - LabelDotOffsetX - labelW
                    };
                    float ly = panelPos.y + LabelDotOffsetY;
                    bool placedLabel = false;
                    for (int ci = 0; ci < xCandidates.Length; ci++)
                    {
                        float lx = Mathf.Clamp(xCandidates[ci], 4f, Mathf.Max(4f, panelW - labelW - 4f));
                        var labelRect = new Rect(lx, ly, labelW, labelH);

                        bool hitsBubble = _activeBubbleRect.width > 0 && labelRect.Overlaps(_activeBubbleRect);
                        bool hitsPin = false;
                        foreach (var pr in _placedPinRects)
                        {
                            if (labelRect.Overlaps(pr)) { hitsPin = true; break; }
                        }
                        if (hitsBubble || hitsPin) continue;

                        entry.Label.style.display = DisplayStyle.Flex;
                        entry.Label.style.left    = Length.Pixels(lx);
                        entry.Label.style.top     = Length.Pixels(ly);
                        entry.Label.EnableInClassList("pin-label--selected", false);
                        _placedPinRects.Add(labelRect);
                        placedLabel = true;
                        break;
                    }
                    if (!placedLabel)
                        entry.Label.style.display = DisplayStyle.None;
                }
                else
                {
                    entry.Label.style.display = DisplayStyle.None;
                }

                // Fact bubble (selected only) — reference places callout ABOVE the pin.
                if (selected)
                {
                    if (string.IsNullOrEmpty(entry.FactLabel.text))
                        entry.FactLabel.text = "Strategic flashpoint during the crisis.";
                    if (string.IsNullOrEmpty(entry.FactTitle.text))
                        entry.FactTitle.text = "BRUSSELS";

                    entry.FactBubble.style.display = DisplayStyle.Flex;
                    entry.FactBubble.style.visibility = Visibility.Visible;
                    entry.FactBubble.style.opacity = 1f;
                    entry.FactBubble.BringToFront();

                    // Keep callout inside the map band; scale width with panel.
                    float bw = Mathf.Clamp(panelW * 0.55f, 200f, Mathf.Min(340f, panelW - 24f));
                    float minX = 12f;
                    float maxX = Mathf.Max(minX, panelW - bw - 12f);
                    float clampedX = Mathf.Clamp(panelPos.x - bw * 0.5f, minX, maxX);
                    entry.FactBubble.style.left = Length.Pixels(clampedX);
                    entry.FactBubble.style.width = Length.Pixels(bw);

                    float bubbleH = entry.FactBubble.resolvedStyle.height;
                    if (bubbleH < 1f) bubbleH = 64f;

                    // Prefer above the marker. Selected callouts may use the full open
                    // map band even when the pin sits near the sheet edge.
                    float gap = 10f;
                    float minY = bandTopPx + 4f;
                    float maxY = Mathf.Max(minY, bandBottomPx - bubbleH - 4f);
                    float above = panelPos.y - bubbleH - gap;
                    float below = panelPos.y + gap + 6f;
                    float targetY;
                    if (above >= minY && above <= maxY)
                        targetY = above;
                    else if (below >= minY && below <= maxY)
                        targetY = below;
                    else
                        // Pin near sheet: park callout in the upper map band, still readable.
                        targetY = Mathf.Clamp(minY + (maxY - minY) * 0.35f, minY, maxY);

                    entry.FactBubble.style.top = Length.Pixels(targetY);
                    _activeBubbleRect = new Rect(clampedX - 12f, targetY - 12f, bw + 24f, bubbleH + 24f);
                }

                // Reserve space around the dot even when the text label is hidden,
                // so nearby pins do not stack readable labels on top of each other.
                _placedPinRects.Add(new Rect(panelPos.x - 36f, panelPos.y - 22f, 72f, 44f));
                placed.Add(panelPos);
                shown++;
            }
        }
    }
}
