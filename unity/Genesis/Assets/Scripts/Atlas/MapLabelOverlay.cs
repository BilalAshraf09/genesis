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
        const float HudBandTop    = 0.14f;  // below the top HUD bar
        const float SheetBandBottom = 0.40f; // matches PeekPct (0.38) + margin
        const int MaxPinLabels    = 4;
        const float LabelDotOffsetX = 10f;  // px right of the projected dot centre
        const float LabelDotOffsetY = -14f; // px up from the projected dot centre
        const float MinOverlapDist  = 48f;  // min px between label centres (collision cull)

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
            _cam = cam;
            BuildDocument();
            RebuildCountryLabels();
            RebuildPinLabels();
        }

        void BuildDocument()
        {
            _doc = UiRegistry.CreateDocument("MapLabels", transform, sortingOrder: 0,
                uxmlName: null, "MapLabels");
            var r = _doc.rootVisualElement;
            r.pickingMode = PickingMode.Ignore;

            // Ensure the root element covers the entire screen, ignoring any potential 
            // parent padding from SafeAreaRoot.
            _root = new VisualElement();
            _root.pickingMode = PickingMode.Ignore;
            _root.AddToClassList("map-label-root");
            _root.style.width = Length.Percent(100);
            _root.style.height = Length.Percent(100);
            _root.style.position = Position.Absolute;
            _root.style.left = 0;
            _root.style.top = 0;
            r.Add(_root);
            
            // Critical: Map labels must ignore any Safe Area padding applied to the document root
            r.style.paddingLeft = 0;
            r.style.paddingRight = 0;
            r.style.paddingTop = 0;
            r.style.paddingBottom = 0;
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
            _pinEntries.Clear();
            if (_builder?.Hotspots == null) return;
            var content = AtlasContent.ForTheater(_builder.TheaterId ?? "");

            foreach (var kv in _builder.Hotspots)
            {
                var marker = kv.Value?.Marker;
                if (marker == null) continue;

                // Resolve display label from gazetteer or marker label
                string display = marker.label ?? marker.id;
                if (content.TryGetPlace(marker.id, out var place) && !string.IsNullOrEmpty(place.label))
                    display = place.label;

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
                bubble.Add(title);

                string factText = content.FactFor(marker.id);
                if (string.IsNullOrEmpty(factText)) factText = "Strategic flashpoint during the crisis.";
                var fact = new Label(factText);
                fact.pickingMode = PickingMode.Ignore;
                fact.AddToClassList("pin-fact-body");
                bubble.Add(fact);

                _pinEntries.Add(new PinLabelEntry
                {
                    MarkerId = marker.id,
                    Label = lbl,
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
            if (_builder == null || _cam == null || _root == null) return;

            var proj = _builder.Projection;
            if (proj == null) return;

            float screenH = Screen.height;
            float screenW = Screen.width;

            // Panel rect in pixels
            float panelW = _root.resolvedStyle.width;
            float panelH = _root.resolvedStyle.height;
            if (panelW < 1f || panelH < 1f) { panelW = screenW; panelH = screenH; }

            float scaleX = panelW / screenW;
            float scaleY = panelH / screenH;

            // Visible band in panel pixels (top-down from panel top)
            float bandTopPx    = HudBandTop     * panelH;
            float bandBottomPx = (1f - SheetBandBottom) * panelH;

            _activeBubbleRect = Rect.zero;
            _placedPinRects.Clear();

            // --- Pin labels first (higher priority) ---
            UpdatePinLabels(proj, screenH, scaleX, scaleY, bandTopPx, bandBottomPx, panelW, panelH);

            // --- Country labels second (culled against pin labels and bubble) ---
            UpdateCountryLabels(proj, screenH, scaleX, scaleY, bandTopPx, bandBottomPx, panelW);
        }

        void UpdateCountryLabels(GeoProjection proj, float screenH, float scaleX, float scaleY,
                                  float bandTopPx, float bandBottomPx, float panelW)
        {
            foreach (var (lbl, lat, lon) in _countryLabels)
            {
                var worldPos = proj.LatLonToWorld(lat, lon, 0.05f);
                var sp = _cam.WorldToScreenPoint(worldPos);
                if (sp.z < 0f) { lbl.style.display = DisplayStyle.None; continue; }

                // Convert to panel space (Unity screen Y= bottom → panel Y=0 top)
                float px = sp.x * scaleX;
                float py = (screenH - sp.y) * scaleY;

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

        void UpdatePinLabels(GeoProjection proj, float screenH, float scaleX, float scaleY,
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

                var sp = _cam.WorldToScreenPoint(worldPos);
                if (sp.z < 0f) continue;

                float px = sp.x * scaleX;
                float py = (screenH - sp.y) * scaleY;
                if (py < bandTopPx || py > bandBottomPx || px < 0 || px > panelW) continue;

                bool sel = hs.IsSelected;
                float priority = sel ? 0f : 1f;  // lower = higher priority
                candidates.Add((i, priority, new Vector2(px, py), sel));
            }

            // Sort: selected first, then by priority
            candidates.Sort((a, b) => a.priority.CompareTo(b.priority));

            // Hide all first
            foreach (var e in _pinEntries)
            {
                e.Label.style.display      = DisplayStyle.None;
                e.Dot.style.display        = DisplayStyle.None;
                e.FactBubble.style.display = DisplayStyle.None;
            }

            // Show up to MaxPinLabels, collision-culled
            var placed = new List<Vector2>();
            int shown = 0;
            foreach (var (idx, _, panelPos, selected) in candidates)
            {
                if (shown >= MaxPinLabels) break;

                // Collision check against already-placed labels
                bool overlaps = false;
                foreach (var p in placed)
                {
                    if (Vector2.Distance(panelPos, p) < MinOverlapDist)
                    { overlaps = true; break; }
                }
                if (overlaps && !selected) continue;

                var entry = _pinEntries[idx];
                float dotSize = selected ? 12f : 8f;

                // Dot
                entry.Dot.style.display = DisplayStyle.Flex;
                entry.Dot.style.left    = Length.Pixels(panelPos.x - dotSize * 0.5f);
                entry.Dot.style.top     = Length.Pixels(panelPos.y - dotSize * 0.5f);
                entry.Dot.style.width   = dotSize;
                entry.Dot.style.height  = dotSize;
                entry.Dot.EnableInClassList("pin-dot--selected", selected);

                // Label (offset right and slightly up from dot).
                // If this pin is selected, hide its standard label because the FactBubble already shows the title!
                if (!selected)
                {
                    float lx = panelPos.x + LabelDotOffsetX;
                    float ly = panelPos.y + LabelDotOffsetY;
                    float labelW = entry.Label.resolvedStyle.width;
                    if (labelW < 1f) labelW = 140f;
                    var labelRect = new Rect(lx, ly, labelW, 28f);

                    // If overlapping the active FactBubble, do not show this label!
                    if (_activeBubbleRect.width > 0 && labelRect.Overlaps(_activeBubbleRect))
                    {
                        entry.Label.style.display = DisplayStyle.None;
                    }
                    else
                    {
                        entry.Label.style.display = DisplayStyle.Flex;
                        entry.Label.style.left    = Length.Pixels(lx);
                        entry.Label.style.top     = Length.Pixels(ly);
                        entry.Label.EnableInClassList("pin-label--selected", false);
                        _placedPinRects.Add(labelRect);
                    }
                }
                else
                {
                    entry.Label.style.display = DisplayStyle.None;
                }

                // Fact bubble (selected only)
                if (selected && !string.IsNullOrEmpty(entry.FactLabel.text))
                {
                    entry.FactBubble.style.display = DisplayStyle.Flex;
                    entry.FactBubble.BringToFront();
                    
                    float bw = 440f;
                    float minX = 24f;
                    float maxX = panelW - bw - 24f;
                    float clampedX = Mathf.Clamp(panelPos.x - bw * 0.5f, minX, maxX);
                    entry.FactBubble.style.left = Length.Pixels(clampedX);
                    entry.FactBubble.style.width = Length.Pixels(bw);
                    
                    float bubbleH = entry.FactBubble.resolvedStyle.height;
                    if (bubbleH < 1f) bubbleH = 140f; // estimation
                    
                    // Prefer placing below the pin into open terrain
                    float targetY = panelPos.y + 24f;
                    if (targetY + bubbleH > bandBottomPx - 10f)
                    {
                        // Too close to bottom sheet! Place above the pin instead
                        targetY = panelPos.y - bubbleH - 24f;
                    }
                    
                    entry.FactBubble.style.top = Length.Pixels(targetY);
                    _activeBubbleRect = new Rect(clampedX - 10f, targetY - 10f, bw + 20f, bubbleH + 20f);
                }

                placed.Add(panelPos);
                shown++;
            }
        }
    }
}
