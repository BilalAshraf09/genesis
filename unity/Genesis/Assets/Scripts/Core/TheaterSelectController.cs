using System;
using System.Collections.Generic;
using Genesis.Atlas;
using Genesis.Data;
using Genesis.Monetization;
using Genesis.Theater;
using Genesis.UI.Toolkit;
using UnityEngine;
using UnityEngine.UIElements;

namespace Genesis.Core
{
    /// <summary>
    /// Theater select (Atlas) — Living Atlas 25-desk grid (5 free / 20 locked),
    /// guest/full-access badges, selection sync, and detail preview.
    /// </summary>
    public class TheaterSelectController : MonoBehaviour
    {
        FreemiumStub _freemium;
        Func<bool>   _backHandler;

        TheaterSelectionSlice _slice;
        List<TheaterSelectionEntry> _theaters;
        VisualElement _theaterGrid;
        ScrollView _theaterScroll;
        VisualElement _theaterDetail;
        VisualElement _detailMap;
        Label _detailRegion;
        Label _detailDifficulty;
        Label _detailTitle;
        Label _detailEra;
        Label _detailDesc;
        Label _detailTabBody;
        Label _detailPlayLabel;
        Label _guestBadgeMeta;
        Label _fullAccessPrice;
        Button _fullAccessBtn;
        Button _detailPlayBtn;
        VisualElement _guestBadge;

        readonly Dictionary<string, TheaterCardElement> _cardById = new();
        string _selectedId;
        string _activeTab = "overview";
        TheaterSelectionEntry _selectedEntry;
        float _lastGridWidth = -1f;
        bool _layoutWired;
        bool _landscapeDetail;
        VisualElement _atlasBody;
        VisualElement _accessFooter;
        VisualElement _detailPortraitHost;

        void Awake()
        {
            Application.targetFrameRate = 60;
            EnsureCamera();

            _freemium = FindAnyObjectByType<FreemiumStub>()
                        ?? new GameObject("FreemiumStub").AddComponent<FreemiumStub>();

            BuildUi();
        }

        void OnEnable()
        {
            TheaterAccessService.Instance.EntitlementsChanged += OnEntitlementsChanged;
        }

        void OnDisable()
        {
            if (TheaterAccessService.Instance != null)
                TheaterAccessService.Instance.EntitlementsChanged -= OnEntitlementsChanged;
        }

        void OnDestroy()
        {
            MobilePlatform.PopBack(_backHandler);
        }

        void OnEntitlementsChanged()
        {
            RefreshAccessBadges();
            PopulateTheaterGrid();
            if (!string.IsNullOrEmpty(_selectedId))
                SelectTheater(_selectedId, scrollToDetail: false);
        }

        void BuildUi()
        {
            var doc = UiRegistry.CreateDocument("Atlas", transform, 10, "Atlas");
            var root = doc.rootVisualElement;
            if (root == null)
            {
                Debug.LogError("[Genesis] Atlas: rootVisualElement is null.");
                return;
            }

            var safe = doc.gameObject.GetComponent<SafeAreaRootBehaviour>()
                       ?? doc.gameObject.AddComponent<SafeAreaRootBehaviour>();
            safe.Configure("atlasRoot");

            WireButton(root, "backBtn", AppFlow.GoMainMenu);
            BuildResumeBanner(root);

            _atlasBody        = root.Q("atlasBody");
            _theaterGrid      = root.Q("theaterGrid");
            _theaterScroll    = root.Q<ScrollView>("theaterList");
            _theaterDetail    = root.Q("theaterDetail");
            _accessFooter     = root.Q("accessFooter");
            _detailPortraitHost = _theaterDetail?.parent;
            _detailMap        = root.Q("detailMap");
            _detailRegion     = root.Q<Label>("detailRegion");
            _detailDifficulty = root.Q<Label>("detailDifficulty");
            _detailTitle      = root.Q<Label>("detailTitle");
            _detailEra        = root.Q<Label>("detailEra");
            _detailDesc       = root.Q<Label>("detailDesc");
            _detailTabBody    = root.Q<Label>("detailTabBody");
            _detailPlayLabel  = root.Q<Label>("detailPlayLabel");
            _detailPlayBtn    = root.Q<Button>("detailPlayBtn");
            _guestBadge       = root.Q("guestBadge");
            _guestBadgeMeta   = root.Q<Label>("guestBadgeMeta");
            _fullAccessPrice  = root.Q<Label>("fullAccessPrice");
            _fullAccessBtn    = root.Q<Button>("fullAccessBtn");

            if (_fullAccessBtn != null)
                _fullAccessBtn.clicked += () => FullGameUnlockController.Show();

            if (_detailPlayBtn != null)
                _detailPlayBtn.clicked += OnDetailPlayPressed;

            WireTab(root, "tabOverview", "overview");
            WireTab(root, "tabObjectives", "objectives");
            WireTab(root, "tabIntel", "intel");

            try
            {
                _slice = TheaterCatalogLoader.LoadSelectionSlice();
                _theaters = _slice?.theaters ?? new List<TheaterSelectionEntry>();
            }
            catch (Exception ex)
            {
                Debug.LogWarning($"[Genesis] Atlas: selection slice load failed: {ex.Message}");
                _slice = new TheaterSelectionSlice();
                _theaters = new List<TheaterSelectionEntry>();
            }

            ApplySliceHeader(root);
            RefreshAccessBadges();
            PopulateTheaterGrid();

            if (!_layoutWired && _theaterGrid != null)
            {
                _layoutWired = true;
                _theaterGrid.RegisterCallback<GeometryChangedEvent>(_ => RelayoutGridIfNeeded());
                root.RegisterCallback<GeometryChangedEvent>(_ => ApplyBodyLayoutMode());
                ApplyBodyLayoutMode();
            }

            string initial = null;
            foreach (var t in _theaters)
            {
                if (t == null || string.IsNullOrEmpty(t.launchId)) continue;
                if (_freemium.CanDeploy(t.launchId))
                {
                    initial = t.launchId;
                    break;
                }
            }
            if (initial == null && _theaters.Count > 0)
                initial = _theaters[0]?.launchId;
            if (!string.IsNullOrEmpty(initial))
                SelectTheater(initial, scrollToDetail: false);

            _backHandler = () => { AppFlow.GoMainMenu(); return true; };
            MobilePlatform.PushBack(_backHandler);
        }

        void ApplySliceHeader(VisualElement root)
        {
            if (_slice == null) return;
            var eyebrow = root.Q(className: "atlas-header__eyebrow") as Label;
            if (eyebrow != null && !string.IsNullOrEmpty(_slice.eyebrow))
                eyebrow.text = _slice.eyebrow;
            var title = root.Q(className: "atlas-header__title") as Label;
            if (title != null && !string.IsNullOrEmpty(_slice.title))
                title.text = _slice.title;
            var sub = root.Q(className: "atlas-header__sub") as Label;
            if (sub != null && !string.IsNullOrEmpty(_slice.subtitle))
                sub.text = _slice.subtitle;
        }

        void RefreshAccessBadges()
        {
            var access = TheaterAccessService.Instance;
            bool unlocked = access != null && access.IsFullGameUnlocked;

            if (_guestBadge != null)
                _guestBadge.style.display = unlocked ? DisplayStyle.None : DisplayStyle.Flex;

            if (_guestBadgeMeta != null && !unlocked)
                _guestBadgeMeta.text = "Play 5 theaters for free";

            if (_fullAccessBtn != null)
            {
                _fullAccessBtn.EnableInClassList("atlas-badge--owned", unlocked);
                _fullAccessBtn.SetEnabled(!unlocked);
            }

            if (_fullAccessPrice != null)
                _fullAccessPrice.text = unlocked ? "OWNED" : IapProductIds.TargetUsdPriceHint;
        }

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

        void PopulateTheaterGrid()
        {
            if (_theaterGrid == null)
            {
                Debug.LogError("[Genesis] Atlas: theaterGrid is null — UXML bind failed.");
                return;
            }

            _theaterGrid.Clear();
            _cardById.Clear();

            int index = 0;
            try
            {
                foreach (var entry in _theaters)
                {
                    if (entry == null || string.IsNullOrEmpty(entry.launchId)) continue;
                    index++;
                    var card = BuildTheaterCard(entry, index);
                    _theaterGrid.Add(card);
                    _cardById[entry.launchId] = card;
                }
            }
            catch (Exception ex)
            {
                Debug.LogError($"[Genesis] Atlas: PopulateTheaterGrid failed after {index} cards: {ex}");
            }

            if (_theaterGrid.childCount == 0)
            {
                var empty = new Label { text = "No theaters available." };
                empty.AddToClassList("atlas-header__sub");
                _theaterGrid.Add(empty);
            }

            _lastGridWidth = -1f;
            RelayoutGridIfNeeded();
        }

        /// <summary>
        /// V2 landscape: fixed detail pane left, scrollable grid right.
        /// Portrait: detail stays in the scroll under the grid (mockup stack).
        /// Uses LogicalScreenWidth so retina phones never flip to landscape layout.
        /// </summary>
        void ApplyBodyLayoutMode()
        {
            if (_atlasBody == null || _theaterDetail == null || _theaterScroll == null)
                return;

            // Only flip when the Atlas panel itself is landscape. Never key off
            // Screen.width alone — Editor Game View FixedResolution often disagrees.
            float panelW = _atlasBody.resolvedStyle.width;
            float panelH = _atlasBody.resolvedStyle.height;
            if (panelW < 32f || panelH < 32f) return;

            bool landscape = panelW > panelH * 1.25f;

            if (landscape == _landscapeDetail) return;
            _landscapeDetail = landscape;

            _atlasBody.EnableInClassList("atlas-body--landscape", landscape);

            try
            {
                if (landscape)
                {
                    if (_theaterDetail.parent != _atlasBody)
                    {
                        _theaterDetail.RemoveFromHierarchy();
                        _atlasBody.Insert(0, _theaterDetail);
                    }
                }
                else if (_detailPortraitHost != null && _theaterDetail.parent != _detailPortraitHost)
                {
                    _theaterDetail.RemoveFromHierarchy();
                    if (_accessFooter != null && _accessFooter.parent == _detailPortraitHost)
                    {
                        int idx = _detailPortraitHost.IndexOf(_accessFooter);
                        if (idx >= 0)
                            _detailPortraitHost.Insert(idx + 1, _theaterDetail);
                        else
                            _detailPortraitHost.Add(_theaterDetail);
                    }
                    else
                        _detailPortraitHost.Add(_theaterDetail);
                }
            }
            catch (Exception ex)
            {
                Debug.LogWarning($"[Genesis] Atlas: detail reparent skipped: {ex.Message}");
            }

            _lastGridWidth = -1f;
            RelayoutGridIfNeeded();
        }

        void RelayoutGridIfNeeded()
        {
            if (_theaterGrid == null) return;
            float panelW = _theaterGrid.resolvedStyle.width;
            if (panelW < 8f) return;

            // Use the grid's rendered pixel width — never bare Screen.width.
            // Editor often reports the Game View host window (e.g. 1965) while the
            // panel is phone-sized; that falsely picked 5 columns and broke cards.
            float ppp = _theaterGrid.panel != null
                ? Mathf.Max(0.01f, _theaterGrid.panel.scaledPixelsPerPoint)
                : 1f;
            float screenW = panelW * ppp;
            if (Mathf.Abs(screenW - _lastGridWidth) < 0.5f) return;
            _lastGridWidth = screenW;

            // Portrait phone → 2; large phone / small tablet → 3;
            // landscape master–detail → 2–3 from pane width; ultra-wide → 5.
            int cols;
            if (_landscapeDetail)
                cols = panelW >= 560f ? 3 : 2;
            else if (screenW >= 1100f)
                cols = 5;
            else if (screenW >= 700f)
                cols = 3;
            else
                cols = 2;

            float gap = 8f;
            float cardW = (panelW - gap * (cols - 1) - 1f) / cols;

            int i = 0;
            foreach (var child in _theaterGrid.Children())
            {
                if (!child.ClassListContains("theater-card")) continue;
                child.style.width = cardW;
                child.style.minWidth = cardW;
                child.style.maxWidth = cardW;
                child.style.flexGrow = 0;
                child.style.flexShrink = 0;
                child.style.marginRight = ((i % cols) == cols - 1) ? 0f : gap;
                i++;
            }
        }

        TheaterCardElement BuildTheaterCard(TheaterSelectionEntry entry, int number)
        {
            bool locked = !_freemium.CanDeploy(entry.launchId);
            return new TheaterCardElement(
                entry,
                number,
                locked,
                onSelect: id =>
                {
                    SelectTheater(id, scrollToDetail: true);
                    if (!_freemium.CanDeploy(id))
                        _freemium.ShowPaywallStub();
                },
                onCta: (id, wasLocked) =>
                {
                    if (wasLocked || !_freemium.CanDeploy(id))
                    {
                        _freemium.ShowPaywallStub();
                        return;
                    }
                    SelectTheater(id, scrollToDetail: false);
                    AppFlow.BeginTheater(id);
                });
        }

        void SelectTheater(string theaterId, bool scrollToDetail)
        {
            if (string.IsNullOrEmpty(theaterId)) return;
            _selectedId = theaterId;
            _selectedEntry = null;
            foreach (var t in _theaters)
            {
                if (t != null && t.launchId == theaterId)
                {
                    _selectedEntry = t;
                    break;
                }
            }

            foreach (var kv in _cardById)
                kv.Value.SetSelected(kv.Key == theaterId);

            UpdateDetailPanel();

            if (scrollToDetail && !_landscapeDetail && _theaterScroll != null && _theaterDetail != null)
                _theaterDetail.schedule.Execute(() => _theaterScroll.ScrollTo(_theaterDetail)).StartingIn(0);
        }

        void UpdateDetailPanel()
        {
            if (_theaterDetail == null) return;
            if (_selectedEntry == null)
            {
                _theaterDetail.AddToClassList("theater-detail--hidden");
                return;
            }

            _theaterDetail.RemoveFromClassList("theater-detail--hidden");

            bool locked = !_freemium.CanDeploy(_selectedEntry.launchId);

            if (_detailMap != null)
                TheaterCardElement.LoadThumbnail(_detailMap, _selectedEntry);

            if (_detailRegion != null)
                _detailRegion.text = TheaterCardElement.ShortRegion(_selectedEntry.region).ToUpperInvariant();
            if (_detailDifficulty != null)
                _detailDifficulty.text = (_selectedEntry.difficulty ?? "Medium").ToUpperInvariant();
            if (_detailTitle != null)
                _detailTitle.text = (_selectedEntry.displayTitle ?? "").ToUpperInvariant();
            if (_detailEra != null)
                _detailEra.text = _selectedEntry.era ?? "";
            if (_detailDesc != null)
                _detailDesc.text = _selectedEntry.description ?? "";

            if (_detailPlayBtn != null)
                _detailPlayBtn.EnableInClassList("theater-detail__play--locked", locked);
            if (_detailPlayLabel != null)
                _detailPlayLabel.text = locked
                    ? TheaterCardElement.UnlockCtaLabel
                    : TheaterCardElement.PlayCtaLabel;

            RefreshTabBody();
        }

        void OnDetailPlayPressed()
        {
            if (_selectedEntry == null) return;
            if (!_freemium.CanDeploy(_selectedEntry.launchId))
            {
                _freemium.ShowPaywallStub();
                return;
            }
            AppFlow.BeginTheater(_selectedEntry.launchId);
        }

        void WireTab(VisualElement root, string name, string tabId)
        {
            var btn = root.Q<Button>(name);
            if (btn == null) return;
            btn.clicked += () =>
            {
                _activeTab = tabId;
                root.Query<Button>(className: "theater-detail__tab").ForEach(b =>
                    b.RemoveFromClassList("theater-detail__tab--active"));
                btn.AddToClassList("theater-detail__tab--active");
                RefreshTabBody();
            };
        }

        void RefreshTabBody()
        {
            if (_detailTabBody == null || _selectedEntry == null) return;
            _detailTabBody.text = _activeTab switch
            {
                "objectives" => string.IsNullOrEmpty(_selectedEntry.objectives)
                    ? "Complete each phase with a viable after-action grade."
                    : _selectedEntry.objectives +
                      (string.IsNullOrEmpty(_selectedEntry.challenges)
                          ? ""
                          : "\n\nChallenges: " + _selectedEntry.challenges),
                "intel" => string.IsNullOrEmpty(_selectedEntry.intel)
                    ? "Intel markers unlock during play."
                    : _selectedEntry.intel,
                _ => (_selectedEntry.description ?? "") +
                     $"\n\nDifficulty: {_selectedEntry.difficulty ?? "Medium"}. " +
                     "Recommended for players comfortable with timed crisis decisions."
            };
        }

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
            var go = new GameObject("SelectCamera");
            var cam = go.AddComponent<Camera>();
            cam.clearFlags = CameraClearFlags.SolidColor;
            cam.backgroundColor = new Color(0.024f, 0.075f, 0.129f);
            cam.tag = "MainCamera";
            go.AddComponent<AudioListener>();
        }
    }
}
