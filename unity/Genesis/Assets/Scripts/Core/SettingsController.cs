using System;
using Genesis.Atlas;
using Genesis.Theater;
using Genesis.UI.Toolkit;
using UnityEngine;
using UnityEngine.UIElements;

namespace Genesis.Core
{
    /// <summary>
    /// Settings screen — UI Toolkit rebuild.
    /// Preserves all existing settings: graphics quality, freemium access, plus
    /// new Haptics toggle bound to MobilePlatform.GenesisHapticsEnabled.
    /// Public surface (class name, namespace) preserved; internal uGUI removed.
    /// </summary>
    public class SettingsController : MonoBehaviour
    {
        Func<bool> _backHandler;
        Button     _hapticsToggle;
        Label      _hapticsLabel;
        Button     _audioToggle;
        Label      _audioLabel;
        Button     _highQualBtn;
        Button     _standardQualBtn;

        // ── Lifecycle ─────────────────────────────────────────────────────────
        void Awake()
        {
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
            var doc = UiRegistry.CreateDocument("Settings", transform, 10, "Settings");
            var root = doc.rootVisualElement;
            if (root == null)
            {
                Debug.LogError("[Genesis] Settings: rootVisualElement is null.");
                return;
            }

            // Apply safe area to full root
            root.schedule.Execute(() =>
            {
                if (root.panel != null)
                    SafeAreaRoot.Apply(root.Q("settingsRoot") ?? root, root.panel);
            }).StartingIn(0);

            // ── Back ──
            WireButton(root, "backBtn", AppFlow.GoMainMenu);

            // ── Graphics quality ──
            PopulateQualitySection(root);

            // ── Haptics ──
            _hapticsToggle = root.Q<Button>("hapticsToggle");
            _hapticsLabel  = root.Q<Label>("hapticsToggleLabel");
            RefreshHapticsToggle();
            if (_hapticsToggle != null)
            {
                _hapticsToggle.clicked += () =>
                {
                    MobilePlatform.GenesisHapticsEnabled = !MobilePlatform.GenesisHapticsEnabled;
                    RefreshHapticsToggle();
                };
            }

            // ── Audio ──
            _audioToggle = root.Q<Button>("audioToggle");
            _audioLabel  = root.Q<Label>("audioToggleLabel");
            RefreshAudioToggle();
            if (_audioToggle != null)
            {
                _audioToggle.clicked += () =>
                {
                    GenesisAudio.GenesisAudioEnabled = !GenesisAudio.GenesisAudioEnabled;
                    RefreshAudioToggle();
                };
            }

            // ── Freemium / access ──
            PopulateAccessSection(root);

            // ── Android Back: navigate to main menu ──
            _backHandler = () => { AppFlow.GoMainMenu(); return true; };
            MobilePlatform.PushBack(_backHandler);
        }

        // ── Graphics quality section ──────────────────────────────────────────
        void PopulateQualitySection(VisualElement root)
        {
            var q     = QualitySettings.GetQualityLevel();
            var qName = q >= 0 && q < QualitySettings.names.Length
                ? QualitySettings.names[q]
                : "Unknown";
            SetLabel(root, "qualityLabel", $"Active: {qName}");

            _highQualBtn    = root.Q<Button>("highQualityBtn");
            _standardQualBtn = root.Q<Button>("standardQualityBtn");
            RefreshQualityButtons();

            if (_highQualBtn != null)
            {
                _highQualBtn.clicked += () =>
                {
                    TheaterPlayBootstrap.ForceHighQualityForStore();
                    AppFlow.GoSettings();
                };
            }

            if (_standardQualBtn != null)
            {
                _standardQualBtn.clicked += () =>
                {
                    QualitySettings.SetQualityLevel(2, true);
                    GenesisPremiumVisuals.ApplyForCurrentQuality();
                    AppFlow.GoSettings();
                };
            }
        }

        void RefreshQualityButtons()
        {
            int q = QualitySettings.GetQualityLevel();
            int highIdx = QualitySettings.names.Length - 1;

            if (_highQualBtn != null)
            {
                if (q == highIdx) _highQualBtn.AddToClassList("quality-btn--active");
                else _highQualBtn.RemoveFromClassList("quality-btn--active");
            }
            if (_standardQualBtn != null)
            {
                if (q == 2) _standardQualBtn.AddToClassList("quality-btn--active");
                else _standardQualBtn.RemoveFromClassList("quality-btn--active");
            }
        }

        // ── Haptics / audio toggles ───────────────────────────────────────────
        void RefreshHapticsToggle()
        {
            bool on = MobilePlatform.GenesisHapticsEnabled;
            if (_hapticsLabel  != null) _hapticsLabel.text = on ? "ON" : "OFF";
            if (_hapticsToggle != null)
            {
                if (on) _hapticsToggle.AddToClassList("toggle-pill--on");
                else    _hapticsToggle.RemoveFromClassList("toggle-pill--on");
            }
        }

        void RefreshAudioToggle()
        {
            bool on = GenesisAudio.GenesisAudioEnabled;
            if (_audioLabel  != null) _audioLabel.text = on ? "ON" : "OFF";
            if (_audioToggle != null)
            {
                if (on) _audioToggle.AddToClassList("toggle-pill--on");
                else    _audioToggle.RemoveFromClassList("toggle-pill--on");
            }
        }

        // ── Access / premium section ──────────────────────────────────────────
        void PopulateAccessSection(VisualElement root)
        {
            var freemium = FindAnyObjectByType<FreemiumStub>()
                           ?? new GameObject("FreemiumStub").AddComponent<FreemiumStub>();

            var clearanceLbl = root.Q<Label>("clearanceLabel");
            if (clearanceLbl != null)
            {
                if (freemium.IsPro)
                {
                    clearanceLbl.text = "Genesis Pro — All theaters unlocked";
                    clearanceLbl.AddToClassList("settings-status-label--pro");
                }
                else
                {
                    clearanceLbl.text = $"Standard access — {freemium.FreeTheatersRemaining} free theater(s) remaining";
                }
            }

            WireButton(root, "specialOpsBtn", () => freemium.ShowPaywallStub());
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
            var go  = new GameObject("SettingsCamera");
            var cam = go.AddComponent<Camera>();
            cam.clearFlags      = CameraClearFlags.SolidColor;
            cam.backgroundColor = new Color(0.043f, 0.071f, 0.125f);
            cam.tag             = "MainCamera";
            go.AddComponent<AudioListener>();
        }
    }
}
