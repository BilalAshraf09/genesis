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
    /// Main menu — Living Atlas hero with drifting map, theater crisis pins,
    /// glass command dock, optional Resume strip, and nav to Play / Atlas / Codex / Settings.
    /// </summary>
    public class MainMenuController : MonoBehaviour
    {
        // ── Animation state ────────────────────────────────────────────────────
        const float DriftPeriodSec = 32f;
        const float PulsePeriodSec = 2.4f;
        const float ScanPeriodSec  = 11f;

        // Flagship theaters shown as crisis pins (layout % of screen).
        // Primary / featured sits center; others form a living-atlas constellation.
        static readonly PinSpec[] PinLayout =
        {
            new("hist-1947-radcliffe", 50f, 36f, primary: true),  // India Partition
            new("hist-1962-cuba",      16f, 44f, primary: false), // Thirteen Days
            new("hist-1989-wall",      78f, 30f, primary: false), // Wall Night
            new("hist-1917-balfour",   24f, 28f, primary: false), // Balfour
            new("hist-1950-korea",     84f, 48f, primary: false), // Parallel War
            new("hist-1956-suez",      34f, 52f, primary: false), // Canal Crisis
            new("hist-1938-munich",    66f, 52f, primary: false), // Munich Window
        };

        struct PinSpec
        {
            public readonly string Id;
            public readonly float LeftPct;
            public readonly float TopPct;
            public readonly bool Primary;
            public PinSpec(string id, float leftPct, float topPct, bool primary)
            {
                Id = id; LeftPct = leftPct; TopPct = topPct; Primary = primary;
            }
        }

        sealed class PinAnim
        {
            public VisualElement Root;
            public VisualElement Outer;
            public VisualElement Inner;
            public float PhaseOffset;
            public bool Primary;
        }

        float _driftStart = -1f;
        float _pulseStart = -1f;
        float _lastTickerChange = 0f;
        float _tickerHoldUntil = -1f;
        int _tickerIndex = 0;
        VisualElement _mapBg;
        VisualElement _mapBgDeep;
        VisualElement _hazeA;
        VisualElement _hazeB;
        VisualElement _scanBeam;
        VisualElement _dawnRim;
        VisualElement _meridians;
        VisualElement _liveDot;
        VisualElement _root;
        readonly List<PinAnim> _pins = new();
        readonly Dictionary<string, VisualElement> _pinById = new();
        string _selectedTheaterId;
        Func<bool> _backHandler;

        static Texture2D _bottomGradient;

        static readonly string[] TickerDispatches = new[]
        {
            "15 AUG 1947: SUB-CONTINENT SOVEREIGNTY TRANSFERS IN 73 DAYS",
            "RADCLIFFE BOUNDARY COMMISSION CONVENED IN SECRET AT SIMLA",
            "14.5 MILLION DISPLACED ALONG EAST & WEST CORRIDORS",
            "PUNJAB WATERWAYS & CANAL HEADWORKS HEAVILY DISPUTED",
            "ADVISORY CLEARANCE ACTIVE · PREVENT CONTINENTAL BREAKDOWN",
            "OCT 1962: U-2 RECON CONFIRMS MRBM SITES IN SAN CRISTOBAL",
            "NOV 1989: BORDER GATES OPEN ALONG BORNHOLMER STRASSE",
            "1950: 38TH PARALLEL FLASHPOINT — UN COALITION MOBILIZING"
        };

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
            _root = doc.rootVisualElement;
            if (_root == null)
            {
                Debug.LogError("[Genesis] MainMenu: rootVisualElement is null.");
                return;
            }

            _root.schedule.Execute(() =>
            {
                var panel  = _root.panel;
                var safeEl = _root.Q("safeRoot");
                if (panel != null && safeEl != null)
                    SafeAreaRoot.Apply(safeEl, panel);
            }).StartingIn(0);

            // ── Featured / selected theater ──
            var featured = ResolveFeaturedTheater();
            _selectedTheaterId = featured?.id ?? "hist-1947-radcliffe";
            ApplySelectedTheater(featured);

            // ── Map background (parallax pair) ──
            var mapBg     = _root.Q("mapBg");
            var mapBgDeep = _root.Q("mapBgDeep");
            Texture2D preview = null;
            if (mapBg != null || mapBgDeep != null)
                preview = LoadMapTexture(_selectedTheaterId, featured?.terrainKey);

            if (mapBg != null)
            {
                ApplyMapTexture(mapBg, preview);
                _mapBg = mapBg;
            }
            if (mapBgDeep != null)
            {
                ApplyMapTexture(mapBgDeep, preview);
                _mapBgDeep = mapBgDeep;
            }
            _driftStart = -1f;

            // ── Atmosphere layers ──
            _hazeA     = _root.Q("hazeA");
            _hazeB     = _root.Q("hazeB");
            _scanBeam  = _root.Q("scanBeam");
            _dawnRim   = _root.Q("dawnRim");
            _meridians = _root.Q("meridians");
            _liveDot   = _root.Q("liveDot");
            _pulseStart = -1f;

            // ── Theater crisis pins ──
            BuildTheaterPins(_root);

            PlayEntrance(_root);

            // ── Resume card ──
            var resumeCard = _root.Q("resumeCard");
            var activeRun  = AppFlow.GetActiveRunData();
            if (resumeCard != null)
            {
                if (activeRun != null)
                {
                    SetLabel(_root, "resumeTitle", activeRun.theaterTitle);
                    SetLabel(_root, "resumeMeta",
                        $"Phase {activeRun.beatIndex + 1}/{Mathf.Max(1, activeRun.totalBeats)}");

                    WireButton(_root, "resumeBtn",  AppFlow.ResumeActiveRun);
                    WireButton(_root, "abandonBtn", () =>
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
            WireButton(_root, "playBtn",     () => AppFlow.BeginTheater(_selectedTheaterId));
            WireButton(_root, "atlasBtn",    AppFlow.GoTheaterSelect);
            WireButton(_root, "codexBtn",    CodexOverlay.Open);
            WireButton(_root, "settingsBtn", AppFlow.GoSettings);

            _backHandler = () => true;
            MobilePlatform.PushBack(_backHandler);
        }

        void BuildTheaterPins(VisualElement root)
        {
            var layer = root.Q("hotspotLayer");
            if (layer == null) return;

            layer.Clear();
            _pins.Clear();
            _pinById.Clear();

            Dictionary<string, TheaterCatalogEntry> byId = null;
            try
            {
                var catalog = TheaterCatalogLoader.LoadCatalog();
                if (catalog?.theaters != null)
                {
                    byId = new Dictionary<string, TheaterCatalogEntry>(catalog.theaters.Count);
                    foreach (var t in catalog.theaters)
                    {
                        if (t != null && !string.IsNullOrEmpty(t.id))
                            byId[t.id] = t;
                    }
                }
            }
            catch { }

            float phaseStep = 0f;
            foreach (var spec in PinLayout)
            {
                TheaterCatalogEntry entry = null;
                byId?.TryGetValue(spec.Id, out entry);

                string title = !string.IsNullOrEmpty(entry?.title)
                    ? entry.title
                    : FallbackTitle(spec.Id);
                int year = entry?.year > 0 ? entry.year : FallbackYear(spec.Id);

                var pin = CreatePin(spec, title, year);
                layer.Add(pin);
                _pinById[spec.Id] = pin;

                var anim = new PinAnim
                {
                    Root         = pin,
                    Outer        = pin.Q(null, "main-menu__pin-pulse--outer"),
                    Inner        = pin.Q(null, "main-menu__pin-pulse--inner"),
                    PhaseOffset  = phaseStep,
                    Primary      = spec.Primary,
                };
                _pins.Add(anim);
                phaseStep += 0.37f;

                string theaterId = spec.Id;
                pin.RegisterCallback<ClickEvent>(_ => SelectTheater(theaterId));

                // Staggered pin fade-in (StartingIn takes delay ms as long)
                long delayMs = (long)(160f + phaseStep * 220f);
                root.schedule.Execute(() => pin.AddToClassList("main-menu__pin--ready"))
                    .StartingIn(delayMs);
            }

            RefreshPinSelection();
        }

        VisualElement CreatePin(PinSpec spec, string title, int year)
        {
            var pin = new VisualElement();
            pin.AddToClassList("main-menu__pin");
            pin.AddToClassList(spec.Primary ? "main-menu__pin--primary" : "main-menu__pin--secondary");
            pin.style.left = Length.Percent(spec.LeftPct);
            pin.style.top  = Length.Percent(spec.TopPct);
            pin.focusable = true;

            var outer = new VisualElement();
            outer.AddToClassList("main-menu__pin-pulse");
            outer.AddToClassList("main-menu__pin-pulse--outer");
            outer.pickingMode = PickingMode.Ignore;
            pin.Add(outer);

            var inner = new VisualElement();
            inner.AddToClassList("main-menu__pin-pulse");
            inner.AddToClassList("main-menu__pin-pulse--inner");
            inner.pickingMode = PickingMode.Ignore;
            pin.Add(inner);

            var core = new VisualElement();
            core.AddToClassList("main-menu__pin-core");
            core.pickingMode = PickingMode.Ignore;
            pin.Add(core);

            var chip = new VisualElement();
            chip.AddToClassList("main-menu__pin-chip");
            chip.pickingMode = PickingMode.Ignore;

            var label = new Label(FormatPinLabel(title, year, spec.Primary));
            label.AddToClassList("main-menu__pin-label");
            label.pickingMode = PickingMode.Ignore;
            chip.Add(label);
            pin.Add(chip);

            return pin;
        }

        void SelectTheater(string theaterId)
        {
            if (string.IsNullOrEmpty(theaterId) || theaterId == _selectedTheaterId)
            {
                // Second tap on the same pin enters the theater.
                if (theaterId == _selectedTheaterId)
                    AppFlow.BeginTheater(_selectedTheaterId);
                return;
            }

            _selectedTheaterId = theaterId;
            TheaterCatalogEntry entry = null;
            try
            {
                var catalog = TheaterCatalogLoader.LoadCatalog();
                entry = catalog?.theaters?.Find(t => t != null && t.id == theaterId);
            }
            catch { }

            ApplySelectedTheater(entry ?? new TheaterCatalogEntry
            {
                id    = theaterId,
                title = FallbackTitle(theaterId),
                year  = FallbackYear(theaterId),
            });
            RefreshPinSelection();
        }

        void ApplySelectedTheater(TheaterCatalogEntry entry)
        {
            if (_root == null) return;

            string id    = entry?.id ?? _selectedTheaterId ?? "hist-1947-radcliffe";
            string title = !string.IsNullOrEmpty(entry?.title) ? entry.title : FallbackTitle(id);
            string year  = entry?.year > 0 ? entry.year.ToString() : FallbackYear(id).ToString();
            string region = FormatRegion(entry?.region);

            _selectedTheaterId = id;
            SetLabel(_root, "featuredYear", year);
            SetLabel(_root, "featuredRegion", region);
            SetLabel(_root, "playBtnLabel", "ENTER THEATER");
            SetLabel(_root, "playBtnSub", title);
        }

        void RefreshPinSelection()
        {
            foreach (var kv in _pinById)
            {
                if (kv.Value == null) continue;
                if (kv.Key == _selectedTheaterId)
                    kv.Value.AddToClassList("main-menu__pin--selected");
                else
                    kv.Value.RemoveFromClassList("main-menu__pin--selected");
            }
        }

        void PlayEntrance(VisualElement root)
        {
            var hero = root.Q("hero");
            var dock = root.Q("dock");

            root.schedule.Execute(() => hero?.AddToClassList("main-menu__hero--ready"))
                .StartingIn(120);
            root.schedule.Execute(() => dock?.AddToClassList("main-menu__dock--ready"))
                .StartingIn(320);
        }

        // ── MonoBehaviour.Update: living atlas atmosphere ─────────────────────
        void Update()
        {
            UpdateMapDrift();
            UpdateAtmosphere();
            UpdatePinPulses();
            UpdateLiveDot();
        }

        void UpdateMapDrift()
        {
            if (_mapBg == null || _mapBg.panel == null) return;
            if (_driftStart < 0f) _driftStart = Time.unscaledTime;

            float elapsed = (Time.unscaledTime - _driftStart) % (DriftPeriodSec * 2f);
            float phase   = elapsed < DriftPeriodSec
                ? elapsed / DriftPeriodSec
                : 1f - (elapsed - DriftPeriodSec) / DriftPeriodSec;
            float t = Mathf.SmoothStep(0f, 1f, phase);

            float x = Mathf.Lerp(0f, -48f, t) + Mathf.Sin(t * Mathf.PI * 2f) * 8f;
            float y = Mathf.Lerp(0f, -22f, t) + Mathf.Sin(t * Mathf.PI) * 6f;
            _mapBg.transform.position = new Vector3(x, y, 0f);
            float s = Mathf.Lerp(1f, 1.08f, t);
            _mapBg.transform.scale = new Vector3(s, s, 1f);

            if (_mapBgDeep != null)
            {
                _mapBgDeep.transform.position = new Vector3(x * 0.45f - 12f, y * 0.4f - 8f, 0f);
                float ds = Mathf.Lerp(1.04f, 1.12f, t);
                _mapBgDeep.transform.scale = new Vector3(ds, ds, 1f);
            }
        }

        void UpdateAtmosphere()
        {
            float time = Time.unscaledTime;

            if (_hazeA != null)
            {
                _hazeA.transform.position = new Vector3(
                    Mathf.Sin(time * 0.07f) * 40f,
                    Mathf.Cos(time * 0.05f) * 18f, 0f);
                _hazeA.style.opacity = 0.55f + 0.35f * (0.5f + 0.5f * Mathf.Sin(time * 0.4f));
            }
            if (_hazeB != null)
            {
                _hazeB.transform.position = new Vector3(
                    Mathf.Cos(time * 0.055f) * -50f,
                    Mathf.Sin(time * 0.04f) * 22f, 0f);
                _hazeB.style.opacity = 0.45f + 0.4f * (0.5f + 0.5f * Mathf.Sin(time * 0.33f + 1.2f));
            }

            if (_scanBeam != null && _scanBeam.panel != null)
            {
                float w = _scanBeam.parent != null ? _scanBeam.parent.resolvedStyle.width : 1080f;
                if (w < 1f) w = 1080f;
                float scanT = (time % ScanPeriodSec) / ScanPeriodSec;
                float beamW = Mathf.Max(48f, w * 0.18f);
                _scanBeam.style.left = Mathf.Lerp(-beamW, w + beamW * 0.2f, scanT);
                _scanBeam.style.opacity = 0.15f + 0.85f * Mathf.Sin(scanT * Mathf.PI);
            }

            if (_dawnRim != null)
            {
                _dawnRim.style.opacity = 0.65f + 0.35f * (0.5f + 0.5f * Mathf.Sin(time * 0.35f));
                float ds = 1f + 0.04f * Mathf.Sin(time * 0.28f);
                _dawnRim.transform.scale = new Vector3(ds, ds, 1f);
            }

            if (_meridians != null)
                _meridians.style.opacity = 0.55f + 0.35f * (0.5f + 0.5f * Mathf.Sin(time * 0.5f));
        }

        void UpdatePinPulses()
        {
            if (_pins.Count == 0) return;
            if (_pulseStart < 0f) _pulseStart = Time.unscaledTime;

            float baseT = (Time.unscaledTime - _pulseStart) % PulsePeriodSec / PulsePeriodSec;
            for (int i = 0; i < _pins.Count; i++)
            {
                var pin = _pins[i];
                float t = (baseT + pin.PhaseOffset) % 1f;
                float maxOuter = pin.Primary ? 1.42f : 1.30f;
                float maxInner = pin.Primary ? 1.26f : 1.18f;
                ApplyPulse(pin.Outer, t, 1f, maxOuter);
                ApplyPulse(pin.Inner, (t + 0.5f) % 1f, 1f, maxInner);
            }
        }

        static void ApplyPulse(VisualElement el, float t, float baseScale, float maxScale)
        {
            if (el == null) return;
            float ease = Mathf.Sin(t * Mathf.PI);
            float scale = Mathf.Lerp(baseScale, maxScale, ease);
            el.transform.scale = new Vector3(scale, scale, 1f);
            el.style.opacity = Mathf.Lerp(0.85f, 0.15f, ease);
        }

        void UpdateLiveDot()
        {
            if (_liveDot == null) return;
            _liveDot.style.opacity = 0.55f + 0.45f * Mathf.Abs(Mathf.Sin(Time.unscaledTime * 2.2f));
        }

        // ── Map background loading ────────────────────────────────────────────
        static Texture2D LoadMapTexture(string theaterId, string terrainKey)
        {
            try
            {
                string regionHint = !string.IsNullOrEmpty(terrainKey) ? terrainKey : "southasia";
                return MapTextureLibrary.LoadUiMapPreview(theaterId, regionHint, size: 768);
            }
            catch (Exception ex)
            {
                Debug.LogWarning($"[Genesis] MainMenu: map background failed: {ex.Message}");
                return null;
            }
        }

        static void ApplyMapTexture(VisualElement mapBg, Texture2D preview)
        {
            if (mapBg == null) return;
            if (preview != null)
                mapBg.style.backgroundImage = new StyleBackground(preview);

            mapBg.schedule.Execute(() => mapBg.AddToClassList("main-menu__map-bg--ready"))
                .StartingIn(16);
        }

        // ── Theater catalog helpers ───────────────────────────────────────────
        static TheaterCatalogEntry ResolveFeaturedTheater()
        {
            try
            {
                var catalog = TheaterCatalogLoader.LoadCatalog();
                var flagship = catalog?.theaters?.Find(t =>
                    t != null && t.id == "hist-1947-radcliffe");
                if (flagship != null) return flagship;
                if (catalog?.theaters?.Count > 0) return catalog.theaters[0];
            }
            catch { }
            return null;
        }

        static string FormatPinLabel(string title, int year, bool primary)
        {
            string head = (title ?? "").ToUpperInvariant();
            // Keep chip scannable — primary gets year; secondary stays short.
            if (primary)
            {
                if (head.Length > 18) head = head.Substring(0, 17) + "…";
                return year > 0 ? $"{head} · {year}" : head;
            }

            if (head.Length > 14) head = head.Substring(0, 13) + "…";
            return year > 0 ? $"{head} · {year}" : head;
        }

        static string FallbackTitle(string id) => id switch
        {
            "hist-1947-radcliffe" => "India Partition",
            "hist-1962-cuba"      => "Thirteen Days",
            "hist-1989-wall"      => "Wall Night",
            "hist-1917-balfour"   => "Balfour Declaration",
            "hist-1950-korea"     => "Parallel War",
            "hist-1956-suez"      => "Canal Crisis",
            "hist-1938-munich"    => "Munich Window",
            _ => "Crisis Theater",
        };

        static int FallbackYear(string id) => id switch
        {
            "hist-1947-radcliffe" => 1947,
            "hist-1962-cuba"      => 1962,
            "hist-1989-wall"      => 1989,
            "hist-1917-balfour"   => 1917,
            "hist-1950-korea"     => 1950,
            "hist-1956-suez"      => 1956,
            "hist-1938-munich"    => 1938,
            _ => 0,
        };

        static string FormatRegion(string region)
        {
            if (string.IsNullOrWhiteSpace(region))
                return "India · Pakistan · Radcliffe Award";

            var parts = region.Split(new[] { '·', '|' }, StringSplitOptions.RemoveEmptyEntries);
            if (parts.Length <= 3) return region.Trim();
            return $"{parts[0].Trim()} · {parts[1].Trim()} · {parts[2].Trim()}";
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
            cam.backgroundColor = new Color(0.027f, 0.047f, 0.086f);
            cam.tag             = "MainCamera";
            go.AddComponent<AudioListener>();
        }
    }
}
