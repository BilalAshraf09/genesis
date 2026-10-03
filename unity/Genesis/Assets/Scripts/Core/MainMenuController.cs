using System;
using Genesis.Atlas;
using Genesis.Theater;
using Genesis.UI.Toolkit;
using UnityEngine;
using UnityEngine.UIElements;

namespace Genesis.Core
{
    /// <summary>
    /// Main menu — UI Toolkit rebuild.
    /// Hero area with drifting real-map background, optional Resume card,
    /// and navigation to Play / Atlas / Codex / Settings.
    /// Public surface (class name, namespace) preserved; internal uGUI removed.
    /// </summary>
    public class MainMenuController : MonoBehaviour
    {
        // ── Drift animation state ──────────────────────────────────────────────
        const float DriftPeriodSec = 25f;
        float _driftStart = -1f;
        VisualElement _mapBg;
        Func<bool> _backHandler;

        // ── Lifecycle ─────────────────────────────────────────────────────────
        void Awake()
        {
            Application.targetFrameRate = 60;
            EnsureCamera();
            BuildUi();
        }

        void OnDestroy()
        {
            MobilePlatform.PopBack(_backHandler);
        }

        // ── UI build ──────────────────────────────────────────────────────────
        void BuildUi()
        {
            var doc = UiRegistry.CreateDocument("MainMenu", transform, 10, "MainMenu");
            var root = doc.rootVisualElement;
            if (root == null)
            {
                Debug.LogError("[Genesis] MainMenu: rootVisualElement is null.");
                return;
            }

            // Apply safe area to the content root (map background fills full screen)
            root.schedule.Execute(() =>
            {
                var panel   = root.panel;
                var safeEl  = root.Q("safeRoot");
                if (panel != null && safeEl != null)
                    SafeAreaRoot.Apply(safeEl, panel);
            }).StartingIn(0);

            // ── Map background ──
            var mapBg = root.Q("mapBg");
            if (mapBg != null)
            {
                LoadMapBackground(mapBg);
                StartDriftAnimation(mapBg);
            }

            // ── Featured theater (play button) ──
            string featuredId    = ResolveFeaturedTheaterId();
            string featuredTitle = ResolveFeaturedTitle(featuredId);
            var playBtnLabel = root.Q<Label>("playBtnLabel");
            if (playBtnLabel != null)
                playBtnLabel.text = $"Play  {featuredTitle} ▶";

            // ── Resume card ──
            var resumeCard = root.Q("resumeCard");
            var activeRun  = AppFlow.GetActiveRunData();
            if (resumeCard != null)
            {
                if (activeRun != null)
                {
                    SetLabel(root, "resumeTitle", activeRun.theaterTitle);
                    SetLabel(root, "resumeMeta",
                        $"Phase {activeRun.beatIndex + 1}/{Mathf.Max(1, activeRun.totalBeats)}");

                    WireButton(root, "resumeBtn",  AppFlow.ResumeActiveRun);
                    WireButton(root, "abandonBtn", () =>
                    {
                        AppFlow.ClearActiveRun();
                        resumeCard.style.display = DisplayStyle.None;
                    });
                }
                else
                {
                    resumeCard.style.display = DisplayStyle.None;
                }
            }

            // ── Navigation buttons ──
            WireButton(root, "playBtn",     () => AppFlow.BeginTheater(featuredId));
            WireButton(root, "atlasBtn",    AppFlow.GoTheaterSelect);
            WireButton(root, "codexBtn",    CodexOverlay.Open);
            WireButton(root, "settingsBtn", AppFlow.GoSettings);

            // ── Android Back: consume (do not hard-quit on main menu) ──
            _backHandler = () => true;
            MobilePlatform.PushBack(_backHandler);
        }

        // ── MonoBehaviour.Update: drives map drift animation ──────────────────
        void Update()
        {
            if (_mapBg == null || _mapBg.panel == null) return;
            if (_driftStart < 0f) _driftStart = Time.unscaledTime;

            float elapsed = (Time.unscaledTime - _driftStart) % (DriftPeriodSec * 2f);
            float phase   = elapsed < DriftPeriodSec
                ? elapsed / DriftPeriodSec
                : 1f - (elapsed - DriftPeriodSec) / DriftPeriodSec;
            float t = Mathf.SmoothStep(0f, 1f, phase);

            _mapBg.transform.position = new Vector3(Mathf.Lerp(0f, -28f, t), Mathf.Lerp(0f, -14f, t), 0f);
            float s = Mathf.Lerp(1f, 1.04f, t);
            _mapBg.transform.scale = new Vector3(s, s, 1f);
        }

        // ── Map background loading ────────────────────────────────────────────
        void LoadMapBackground(VisualElement mapBg)
        {
            try
            {
                var relief = MapTextureLibrary.LoadRelief(
                    MapTextureLibrary.ResolveRegionKey("hist-1947-radcliffe", "southasia"),
                    "hist-1947-radcliffe");
                if (relief != null)
                    mapBg.style.backgroundImage = new StyleBackground(relief);
            }
            catch (Exception ex)
            {
                Debug.LogWarning($"[Genesis] MainMenu: map background failed: {ex.Message}");
            }
        }

        // ── Cache mapBg ref and reset drift state ─────────────────────────────
        void StartDriftAnimation(VisualElement mapBg)
        {
            _mapBg      = mapBg;
            _driftStart = -1f;
        }

        // ── Theater catalog helpers ───────────────────────────────────────────
        static string ResolveFeaturedTheaterId()
        {
            try
            {
                var catalog = TheaterCatalogLoader.LoadCatalog();
                var flagship = catalog?.theaters?.Find(t =>
                    t != null && t.id == "hist-1947-radcliffe");
                if (flagship != null) return flagship.id;
                if (catalog?.theaters?.Count > 0) return catalog.theaters[0].id;
            }
            catch { }
            return "hist-1947-radcliffe";
        }

        static string ResolveFeaturedTitle(string theaterId)
        {
            try
            {
                var catalog = TheaterCatalogLoader.LoadCatalog();
                var entry = catalog?.theaters?.Find(t => t != null && t.id == theaterId);
                if (!string.IsNullOrEmpty(entry?.title)) return entry.title;
            }
            catch { }
            return "1947 Partition";
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
            var go  = new GameObject("MenuCamera");
            var cam = go.AddComponent<Camera>();
            cam.clearFlags      = CameraClearFlags.SolidColor;
            cam.backgroundColor = new Color(0.043f, 0.071f, 0.125f);
            cam.tag             = "MainCamera";
            go.AddComponent<AudioListener>();
        }
    }
}
