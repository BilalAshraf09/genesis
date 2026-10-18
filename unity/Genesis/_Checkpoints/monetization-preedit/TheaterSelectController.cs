using System;
using System.Collections.Generic;
using Genesis.Atlas;
using Genesis.Data;
using Genesis.Theater;
using Genesis.UI.Toolkit;
using UnityEngine;
using UnityEngine.UIElements;

namespace Genesis.Core
{
    /// <summary>
    /// Theater select (Atlas) — UI Toolkit rebuild.
    /// Lists every catalog theater with region filter chips, map thumbnails,
    /// places-discovered counts, and personal best scores.
    /// Public surface (class name, namespace) preserved; internal uGUI removed.
    /// </summary>
    public class TheaterSelectController : MonoBehaviour
    {
        // ── State ──────────────────────────────────────────────────────────────
        FreemiumStub _freemium;
        Func<bool>   _backHandler;

        string _activeRegion = "All";
        List<TheaterCatalogEntry> _theaters;
        ScrollView _theaterList;

        // ── Lifecycle ─────────────────────────────────────────────────────────
        void Awake()
        {
            Application.targetFrameRate = 60;
            EnsureCamera();

            _freemium = FindFirstObjectByType<FreemiumStub>()
                        ?? new GameObject("FreemiumStub").AddComponent<FreemiumStub>();

            BuildUi();
        }

        void OnDestroy()
        {
            MobilePlatform.PopBack(_backHandler);
        }

        // ── UI build ──────────────────────────────────────────────────────────
        void BuildUi()
        {
            var doc = UiRegistry.CreateDocument("Atlas", transform, 10, "Atlas");
            var root = doc.rootVisualElement;
            if (root == null)
            {
                Debug.LogError("[Genesis] Atlas: rootVisualElement is null.");
                return;
            }

            // Apply safe area to the full screen root
            root.schedule.Execute(() =>
            {
                if (root.panel != null)
                    SafeAreaRoot.Apply(root.Q("atlasRoot") ?? root, root.panel);
            }).StartingIn(0);

            // ── Back button ──
            WireButton(root, "backBtn", AppFlow.GoMainMenu);

            // ── Resume banner ──
            BuildResumeBanner(root);

            // ── Load catalog ──
            try
            {
                var catalog = TheaterCatalogLoader.LoadCatalog();
                _theaters = catalog.theaters ?? new List<TheaterCatalogEntry>();
            }
            catch (Exception ex)
            {
                Debug.LogWarning($"[Genesis] Atlas: catalog load failed: {ex.Message}");
                _theaters = new List<TheaterCatalogEntry>();
            }

            // ── Region filter chips ──
            BuildRegionFilter(root);

            // ── Theater list ──
            _theaterList = root.Q<ScrollView>("theaterList");
            PopulateTheaterList();

            // ── Android Back: navigate to main menu ──
            _backHandler = () => { AppFlow.GoMainMenu(); return true; };
            MobilePlatform.PushBack(_backHandler);
        }

        // ── Resume banner ─────────────────────────────────────────────────────
        void BuildResumeBanner(VisualElement root)
        {
            var banner = root.Q("resumeBanner");
            if (banner == null) return;

            if (AppFlow.HasActiveRun)
            {
                var active = AppFlow.GetActiveRunData();
                if (active != null)
                {
                    SetLabel(root, "resumeBannerTitle", active.theaterTitle);
                    SetLabel(root, "resumeBannerMeta",
                        $"Phase {active.beatIndex + 1}/{Mathf.Max(1, active.totalBeats)}");

                    WireButton(root, "resumeBannerBtn", AppFlow.ResumeActiveRun);
                    WireButton(root, "abandonBannerBtn", () =>
                    {
                        AppFlow.ClearActiveRun();
                        banner.style.display = DisplayStyle.None;
                    });
                    return;
                }
            }

            banner.style.display = DisplayStyle.None;
        }

        // ── Region filter ─────────────────────────────────────────────────────
        void BuildRegionFilter(VisualElement root)
        {
            var filterBar = root.Q<ScrollView>("regionFilterBar");
            if (filterBar == null) return;

            var regions = new List<string> { "All" };
            foreach (var t in _theaters)
            {
                if (!string.IsNullOrEmpty(t.region) && !regions.Contains(t.region))
                    regions.Add(t.region);
            }

            foreach (var region in regions)
            {
                var chip = new Button();
                chip.AddToClassList("region-chip");
                if (region == _activeRegion) chip.AddToClassList("region-chip--active");

                var lbl = new Label { text = region };
                chip.Add(lbl);

                var capturedRegion = region;
                chip.clicked += () =>
                {
                    _activeRegion = capturedRegion;
                    // Update chip active states
                    filterBar.Query<Button>(className: "region-chip").ForEach(b =>
                    {
                        var isActive = b.Q<Label>()?.text == _activeRegion;
                        if (isActive) b.AddToClassList("region-chip--active");
                        else b.RemoveFromClassList("region-chip--active");
                    });
                    PopulateTheaterList();
                };

                filterBar.Add(chip);
            }
        }

        // ── Theater list ──────────────────────────────────────────────────────
        void PopulateTheaterList()
        {
            if (_theaterList == null) return;
            _theaterList.Clear();

            foreach (var entry in _theaters)
            {
                if (entry == null) continue;
                if (_activeRegion != "All" &&
                    !string.Equals(entry.region, _activeRegion, StringComparison.OrdinalIgnoreCase))
                    continue;

                _theaterList.Add(BuildTheaterCard(entry));
            }

            if (_theaterList.childCount == 0)
            {
                var empty = new Label { text = "No theaters in this region." };
                empty.AddToClassList("label-caption");
                _theaterList.Add(empty);
            }
        }

        VisualElement BuildTheaterCard(TheaterCatalogEntry entry)
        {
            var card = new VisualElement();
            card.AddToClassList("theater-card");

            // Thumbnail
            var thumb = new VisualElement();
            thumb.AddToClassList("theater-card__thumb");
            LoadCardThumbnail(thumb, entry);
            card.Add(thumb);

            // Body
            var body = new VisualElement();
            body.AddToClassList("theater-card__body");

            var year = new Label { text = entry.year > 0 ? entry.year.ToString() : "—" };
            year.AddToClassList("theater-card__year");
            body.Add(year);

            var title = new Label { text = entry.title ?? "Untitled Theater" };
            title.AddToClassList("theater-card__title");
            body.Add(title);

            // 1-line description: use era + region as premise substitute
            string premise = BuildPremiseLine(entry);
            if (!string.IsNullOrEmpty(premise))
            {
                var premiseLbl = new Label { text = premise };
                premiseLbl.AddToClassList("theater-card__premise");
                body.Add(premiseLbl);
            }

            // Footer: places + best score
            var footer = new VisualElement();
            footer.AddToClassList("theater-card__footer");

            string placesText = BuildPlacesText(entry.id);
            if (!string.IsNullOrEmpty(placesText))
            {
                var places = new Label { text = placesText };
                places.AddToClassList("theater-card__places");
                footer.Add(places);
            }

            var pb = LocalRetention.GetPersonalBest(entry.id);
            if (pb != null)
            {
                var score = new Label { text = $"{pb.grade}  {pb.score}" };
                score.AddToClassList("theater-card__score");
                footer.Add(score);
            }

            if (footer.childCount > 0)
                body.Add(footer);

            card.Add(body);

            // Tap handler
            var capturedId = entry.id;
            card.RegisterCallback<PointerUpEvent>(_ =>
            {
                if (!_freemium.CanDeploy(capturedId))
                    _freemium.ShowPaywallStub();
                AppFlow.BeginTheater(capturedId);
            });

            return card;
        }

        static void LoadCardThumbnail(VisualElement thumb, TheaterCatalogEntry entry)
        {
            try
            {
                var preview = MapTextureLibrary.LoadUiMapPreview(
                    entry.id, entry.terrainKey ?? entry.region, size: 384);
                if (preview != null)
                    thumb.style.backgroundImage = new StyleBackground(preview);
            }
            catch (Exception ex)
            {
                Debug.LogWarning($"[Genesis] Atlas thumb failed for {entry.id}: {ex.Message}");
            }
        }

        static string BuildPremiseLine(TheaterCatalogEntry entry)
        {
            var parts = new List<string>();
            if (!string.IsNullOrEmpty(entry.era))    parts.Add(entry.era);
            if (!string.IsNullOrEmpty(entry.region)) parts.Add(entry.region);
            return string.Join(" · ", parts);
        }

        static string BuildPlacesText(string theaterId)
        {
            try
            {
                int discovered = AtlasCodex.CountFor(theaterId);
                var content    = AtlasContent.ForTheater(theaterId);
                int total      = content.Places.Count;
                if (total == 0 && discovered == 0) return "";
                return $"Discovered {discovered}/{total}";
            }
            catch
            {
                return "";
            }
        }

        // ── Utilities ─────────────────────────────────────────────────────────
        static void SetLabel(VisualElement root, string name, string text)
        {
            var lbl = root.Q<Label>(name);
            if (lbl != null) lbl.text = text ?? "";
        }

        static void WireButton(VisualElement root, string name, Action action)
        {
            var btn = root.Q<Button>(name);
            if (btn != null) btn.clicked += action;
        }

        static void EnsureCamera()
        {
            if (Camera.main != null) return;
            var go  = new GameObject("SelectCamera");
            var cam = go.AddComponent<Camera>();
            cam.clearFlags      = CameraClearFlags.SolidColor;
            cam.backgroundColor = new Color(0.043f, 0.071f, 0.125f);
            cam.tag             = "MainCamera";
            go.AddComponent<AudioListener>();
        }
    }
}
