using System;
using System.Collections.Generic;
using Genesis.Atlas;
using Genesis.Core;
using Genesis.Data;
using UnityEngine;
using UnityEngine.UIElements;

namespace Genesis.UI.Toolkit
{
    /// <summary>
    /// Full-screen Atlas Codex overlay (all discovered + locked places per theater).
    /// Lazily created as a DontDestroyOnLoad UIDocument (sortingOrder 50).
    /// Static API: Open() / Close() — called by ResultsController and any shell screen.
    /// </summary>
    public static class CodexOverlay
    {
        // ── State ────────────────────────────────────────────────────────────
        static UIDocument _doc;
        static VisualElement _root;
        static Func<bool> _backHandler;

        // ── Public API (contract unchanged) ──────────────────────────────────

        public static void Open()
        {
            EnsureDocument();
            if (_root == null) return;

            PopulateContent();

            // Apply safe area
            if (_doc?.rootVisualElement?.panel != null)
                SafeAreaRoot.Apply(_root, _doc.rootVisualElement.panel);

            _doc.gameObject.SetActive(true);

            // Android Back closes
            _backHandler = () => { Close(); return true; };
            MobilePlatform.PushBack(_backHandler);
        }

        public static void Close()
        {
            if (_doc != null) _doc.gameObject.SetActive(false);

            if (_backHandler != null)
            {
                MobilePlatform.PopBack(_backHandler);
                _backHandler = null;
            }
        }

        // ── Document creation ─────────────────────────────────────────────────

        static void EnsureDocument()
        {
            if (_doc != null) return;

            _doc = UiRegistry.CreateDocument("CodexOverlay", null, 50, "Codex");
            if (_doc == null)
            {
                Debug.LogError("[Genesis] CodexOverlay: failed to create UIDocument — is Codex.uxml in the registry?");
                return;
            }

            UnityEngine.Object.DontDestroyOnLoad(_doc.gameObject);

            _root = _doc.rootVisualElement?.Q("codexRoot");
            if (_root == null)
            {
                // Fallback: use the root visual element itself
                _root = _doc.rootVisualElement;
            }

            // Wire close button
            var closeBtn = _doc.rootVisualElement?.Q<Button>("closeButton");
            if (closeBtn != null) closeBtn.clicked += Close;
        }

        // ── Content population ────────────────────────────────────────────────

        static void PopulateContent()
        {
            if (_root == null) return;

            // Load all theater catalog entries
            TheaterCatalog catalog = null;
            try { catalog = TheaterCatalogLoader.LoadCatalog(); }
            catch (Exception ex)
            { Debug.LogWarning($"[Genesis] Codex: catalog load failed: {ex.Message}"); }

            var theaters = catalog?.theaters ?? new List<TheaterCatalogEntry>();

            // Count totals across all theaters with gazetteer data
            int totalPlaces = 0, totalDiscovered = 0;
            foreach (var entry in theaters)
            {
                if (entry == null || string.IsNullOrEmpty(entry.id)) continue;
                var content = AtlasContent.ForTheater(entry.id);
                int count = content.Places.Count;
                if (count == 0) continue;
                totalPlaces += count;
                totalDiscovered += AtlasCodex.CountFor(entry.id);
            }

            // Overall progress
            SetLabel("overallLabel", BuildOverallLabel(totalDiscovered, totalPlaces));
            SetFillWidth("overallFill", totalPlaces > 0 ? (float)totalDiscovered / totalPlaces * 100f : 0f);

            // Theater sections
            var sectionsContainer = _root.Q("theaterSections");
            sectionsContainer?.Clear();

            if (sectionsContainer == null) return;

            bool anySections = false;
            foreach (var entry in theaters)
            {
                if (entry == null || string.IsNullOrEmpty(entry.id)) continue;
                var content = AtlasContent.ForTheater(entry.id);
                if (content.Places.Count == 0) continue;

                sectionsContainer.Add(BuildTheaterSection(entry, content));
                anySections = true;
            }

            if (!anySections)
            {
                var empty = new Label { text = "No atlas data available yet — play a theater to discover places." };
                empty.AddToClassList("codex-empty");
                sectionsContainer.Add(empty);
            }
        }

        static VisualElement BuildTheaterSection(TheaterCatalogEntry entry, AtlasTheaterContent content)
        {
            var section = new VisualElement();
            section.AddToClassList("codex-theater-section");

            // ── Theater header (title + year) ─────────────────────────────
            var header = new VisualElement();
            header.AddToClassList("codex-theater-header");

            string title = !string.IsNullOrEmpty(entry.title) ? entry.title : entry.id;
            var titleLabel = new Label { text = title };
            titleLabel.AddToClassList("codex-theater-title");
            header.Add(titleLabel);

            if (entry.year > 0)
            {
                var yearLabel = new Label { text = entry.year.ToString() };
                yearLabel.AddToClassList("codex-theater-year");
                header.Add(yearLabel);
            }
            section.Add(header);

            // ── Progress row ───────────────────────────────────────────────
            var places   = content.Places;
            int total    = places.Count;
            int found    = AtlasCodex.CountFor(entry.id);
            float pct    = total > 0 ? (float)found / total * 100f : 0f;

            var progressRow = new VisualElement();
            progressRow.AddToClassList("codex-theater-progress-row");

            var countLabel = new Label { text = $"{found}/{total} discovered" };
            countLabel.AddToClassList("codex-theater-count");
            progressRow.Add(countLabel);

            var pctLabel = new Label { text = $"{(int)pct}%" };
            pctLabel.AddToClassList("codex-theater-pct");
            progressRow.Add(pctLabel);
            section.Add(progressRow);

            // ── Progress bar ───────────────────────────────────────────────
            var meter = new VisualElement();
            meter.AddToClassList("meter");
            meter.AddToClassList("codex-theater-meter");

            var fill = new VisualElement();
            fill.AddToClassList("meter__fill");
            fill.AddToClassList("codex-theater-fill");
            fill.style.width = new StyleLength(new Length(pct, LengthUnit.Percent));
            meter.Add(fill);
            section.Add(meter);

            // ── Place cards ────────────────────────────────────────────────
            var grid = new VisualElement();
            grid.AddToClassList("codex-place-grid");

            foreach (var place in places)
            {
                if (place == null) continue;
                bool disc = AtlasCodex.IsDiscovered(entry.id, place.markerId);
                grid.Add(disc
                    ? BuildDiscoveredCard(entry.id, place, content)
                    : BuildLockedCard(entry, place));
            }

            section.Add(grid);
            return section;
        }

        static VisualElement BuildDiscoveredCard(string theaterId, GazetteerPlace place, AtlasTheaterContent content)
        {
            var card = new VisualElement();
            card.AddToClassList("codex-place-card");

            string name = !string.IsNullOrEmpty(place.label) ? place.label : place.markerId;
            var nameLabel = new Label { text = name };
            nameLabel.AddToClassList("codex-place-name");
            card.Add(nameLabel);

            // Lat/Lon
            string latlon = $"{FormatCoord(place.lat, true)}  {FormatCoord(place.lon, false)}";
            var latlonLabel = new Label { text = latlon };
            latlonLabel.AddToClassList("codex-place-latlon");
            card.Add(latlonLabel);

            // Fact
            string fact = content.FactFor(place.markerId);
            if (!string.IsNullOrEmpty(fact))
            {
                var factLabel = new Label { text = fact };
                factLabel.AddToClassList("codex-place-fact");
                card.Add(factLabel);
            }

            return card;
        }

        static VisualElement BuildLockedCard(TheaterCatalogEntry entry, GazetteerPlace place)
        {
            var card = new VisualElement();
            card.AddToClassList("codex-place-card");
            card.AddToClassList("codex-place-card--locked");

            var nameLabel = new Label { text = "???" };
            nameLabel.AddToClassList("codex-place-locked-name");
            card.Add(nameLabel);

            string theaterName = !string.IsNullOrEmpty(entry.title) ? entry.title : entry.id;
            var hint = new Label { text = $"Discover in: {theaterName}" };
            hint.AddToClassList("codex-place-locked-hint");
            card.Add(hint);

            return card;
        }

        // ── Helpers ───────────────────────────────────────────────────────────

        static string BuildOverallLabel(int discovered, int total)
        {
            if (total == 0) return "No places in atlas yet";
            int pct = Mathf.RoundToInt((float)discovered / total * 100f);
            return $"{discovered}/{total} places discovered  ·  {pct}% complete";
        }

        static string FormatCoord(float v, bool isLat)
        {
            string dir = isLat ? (v >= 0 ? "N" : "S") : (v >= 0 ? "E" : "W");
            return $"{Mathf.Abs(v):F1}°{dir}";
        }

        static void SetLabel(string name, string text)
        {
            var lbl = _root?.Q<Label>(name);
            if (lbl != null) lbl.text = text ?? "";
        }

        static void SetFillWidth(string name, float pct)
        {
            var el = _root?.Q(name);
            if (el != null) el.style.width = new StyleLength(new Length(pct, LengthUnit.Percent));
        }
    }
}

