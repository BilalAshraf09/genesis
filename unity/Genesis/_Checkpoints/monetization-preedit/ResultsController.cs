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
    /// After Action results screen — UI Toolkit rebuild.
    /// Reads RunSummary from AppFlow, drives AfterAction.uxml, handles Atlas discovery,
    /// share/copy (native on mobile), and retention calls. Public surface unchanged.
    /// </summary>
    public class ResultsController : MonoBehaviour
    {
        // ── Fields ────────────────────────────────────────────────────────────
        Label _shareStatus;
        LocalRetention.NextPlay _next;
        string _theaterId;

        // ── Lifecycle ─────────────────────────────────────────────────────────
        void Awake()
        {
            Application.targetFrameRate = 60;
            EnsureCamera();
            EnsureEventSystem();
            BuildUi();
        }

        // ── UI build ──────────────────────────────────────────────────────────
        void BuildUi()
        {
            var run = AppFlow.LastRun ?? new RunSummary();
            _theaterId = !string.IsNullOrEmpty(run.theaterId)
                ? run.theaterId
                : AppFlow.SelectedTheaterId;

            // ── Retention (keep existing calls) ──
            LocalRetention.GetPersonalBest(_theaterId);
            LocalRetention.RecordCompletion(_theaterId, run.score, run.grade, run.pathFamily, out _);
            LocalRetention.CliffhangerFor(_theaterId, run.pathFamily);
            _next = LocalRetention.RecommendNext(_theaterId);

            // ── UIDocument ──
            var doc = UiRegistry.CreateDocument("AfterAction", null, 10, "AfterAction");
            doc.gameObject.AddComponent<SafeAreaRootBehaviour>();

            var root = doc.rootVisualElement;
            if (root == null)
            {
                Debug.LogError("[Genesis] AfterAction: rootVisualElement is null. Is AfterAction.uxml in the registry?");
                return;
            }

            PopulateHeader(root, run);
            PopulateScoreSection(root, run);
            PopulatePillars(root, run);
            PopulatePath(root, run);
            BuildDecisions(root, run);
            BuildPlacesLearned(root, run);
            LoadMapThumbnail(root, _theaterId);

            _shareStatus = root.Q<Label>("shareStatus");

            WireButton(root, "shareBtn",      () => DoShare(run));
            WireButton(root, "redeployBtn",   () => AppFlow.BeginTheater(_theaterId));
            WireButton(root, "nextCrisisBtn", () =>
            {
                if (_next != null) AppFlow.BeginTheater(_next.theaterId);
                else AppFlow.GoTheaterSelect();
            });
            WireButton(root, "codexBtn", CodexOverlay.Open);
        }

        // ── Header ────────────────────────────────────────────────────────────
        static void PopulateHeader(VisualElement root, RunSummary run)
        {
            SetLabel(root, "theaterTitle",
                !string.IsNullOrEmpty(run.theaterTitle) ? run.theaterTitle : "Theater");

            string year   = run.year > 0 ? run.year.ToString() : "—";
            string phases = $"{run.phasesCompleted}/{Mathf.Max(1, run.phasesTotal)} phases";
            SetLabel(root, "theaterMeta", $"{year}  ·  {phases}");
        }

        // ── Score ring + headline ─────────────────────────────────────────────
        static void PopulateScoreSection(VisualElement root, RunSummary run)
        {
            string grade = !string.IsNullOrEmpty(run.grade) ? run.grade.ToUpperInvariant() : "C";

            var scoreRing = root.Q<ScoreRing>("scoreRing");
            scoreRing?.SetScore(run.score, grade);

            SetLabel(root, "rankTitleLabel", GradeTitle(run.score));

            string headline = !string.IsNullOrEmpty(run.headline) ? run.headline
                            : !string.IsNullOrEmpty(run.closingLine) ? run.closingLine
                            : "Crisis resolved.";
            SetLabel(root, "headlineLabel", headline);
        }

        // ── 4 pillar bars ─────────────────────────────────────────────────────
        static void PopulatePillars(VisualElement root, RunSummary run)
        {
            float stabilityPct   = Mathf.Clamp(run.score + 3, 5, 99);
            float credibilityPct = Mathf.Clamp(run.score - 4, 5, 98);
            float civilianPct    = Mathf.Clamp(50 - run.netPolarity * 2, 5, 95);
            float escalationPct  = Mathf.Clamp(55 - run.score * 0.5f, 5, 90);

            // Start at 0 so the CSS transition animates in
            SetFillWidth(root, "stabilityFill",   0f);
            SetFillWidth(root, "credibilityFill",  0f);
            SetFillWidth(root, "civilianFill",     0f);
            SetFillWidth(root, "escalationFill",   0f);

            root.schedule.Execute(() =>
            {
                SetFillWidth(root, "stabilityFill",   stabilityPct);
                SetFillWidth(root, "credibilityFill",  credibilityPct);
                SetFillWidth(root, "civilianFill",     civilianPct);
                SetFillWidth(root, "escalationFill",   escalationPct);
                SetLabel(root, "stabilityPct",   $"{(int)stabilityPct}%");
                SetLabel(root, "credibilityPct", $"{(int)credibilityPct}%");
                SetLabel(root, "civilianPct",    $"{(int)civilianPct}%");
                SetLabel(root, "escalationPct",  $"{(int)escalationPct}%");
            }).StartingIn(120);
        }

        // ── Path vs history ───────────────────────────────────────────────────
        static void PopulatePath(VisualElement root, RunSummary run)
        {
            string closing = !string.IsNullOrEmpty(run.closingLine)
                ? run.closingLine
                : (!string.IsNullOrEmpty(run.headline) ? run.headline : "Crisis resolved.");
            SetLabel(root, "closingLine", closing);

            var gainChip = root.Q<Label>("topGainChip");
            var costChip = root.Q<Label>("topCostChip");

            string gain = !string.IsNullOrEmpty(run.topGainLine) ? run.topGainLine : null;
            string cost = !string.IsNullOrEmpty(run.topCostLine) ? run.topCostLine : null;

            if (gainChip != null)
            {
                gainChip.style.display = gain != null ? DisplayStyle.Flex : DisplayStyle.None;
                if (gain != null) gainChip.text = gain;
            }
            if (costChip != null)
            {
                costChip.style.display = cost != null ? DisplayStyle.Flex : DisplayStyle.None;
                if (cost != null) costChip.text = cost;
            }
        }

        // ── Decision rows ─────────────────────────────────────────────────────
        static void BuildDecisions(VisualElement root, RunSummary run)
        {
            var container = root.Q("decisionsContainer");
            if (container == null) return;

            if (run.ordersExecuted == null || run.ordersExecuted.Count == 0)
            {
                container.Add(MakeDecisionRow(0, "No orders committed", null));
                return;
            }

            for (int i = 0; i < run.ordersExecuted.Count; i++)
            {
                string callsign = run.ordersExecuted[i] ?? "Order";
                string scar = run.scarLines != null && i < run.scarLines.Count
                    ? run.scarLines[i] : null;
                container.Add(MakeDecisionRow(i + 1, callsign, scar));
            }
        }

        /// <summary>
        /// Stacked decision row (phase kicker → title → caption).
        /// Avoids side-by-side overflow where "Phase N" painted over the callsign.
        /// </summary>
        static VisualElement MakeDecisionRow(int phaseIndex, string callsign, string desc)
        {
            var row = new VisualElement();
            row.AddToClassList("decision-row");

            var phaseLabel = new Label
            {
                text = phaseIndex <= 0 ? "—" : $"PHASE {phaseIndex:00}"
            };
            phaseLabel.AddToClassList("decision-phase");
            row.Add(phaseLabel);

            var title = string.IsNullOrWhiteSpace(callsign) ? "Order" : callsign.Trim();
            var csLabel = new Label { text = title };
            csLabel.AddToClassList("decision-callsign");
            row.Add(csLabel);

            string caption = CleanDecisionCaption(title, desc);
            if (!string.IsNullOrEmpty(caption))
            {
                var descLabel = new Label { text = caption };
                descLabel.AddToClassList("decision-caption");
                row.Add(descLabel);
            }

            return row;
        }

        static string CleanDecisionCaption(string title, string desc)
        {
            if (string.IsNullOrWhiteSpace(desc)) return null;
            string d = desc.Trim();
            // Drop redundant "X · TITLE" when title already shows the callsign.
            if (string.Equals(d, title, StringComparison.OrdinalIgnoreCase)) return null;
            if (d.EndsWith(" · " + title, StringComparison.OrdinalIgnoreCase))
                d = d.Substring(0, d.Length - (" · " + title).Length).Trim();
            else if (d.EndsWith("· " + title, StringComparison.OrdinalIgnoreCase))
                d = d.Substring(0, d.Length - ("· " + title).Length).Trim(' ', '·');
            if (string.IsNullOrWhiteSpace(d) ||
                string.Equals(d, title, StringComparison.OrdinalIgnoreCase))
                return null;
            return d;
        }

        // ── Places learned + Atlas Codex discovery ────────────────────────────
        void BuildPlacesLearned(VisualElement root, RunSummary run)
        {
            var container = root.Q("placesContainer");
            if (container == null) return;
            if (run.ordersExecuted == null || run.ordersExecuted.Count == 0) return;

            var content  = AtlasContent.ForTheater(_theaterId);
            var added    = new HashSet<string>(StringComparer.OrdinalIgnoreCase);

            TheaterBundle bundle = null;
            try { bundle = TheaterCatalogLoader.LoadTheater(_theaterId); }
            catch (Exception ex)
            { Debug.LogWarning($"[Genesis] Places: theater load failed: {ex.Message}"); }

            foreach (var callsign in run.ordersExecuted)
            {
                if (string.IsNullOrEmpty(callsign)) continue;

                string markerId = FindMarkerId(bundle, callsign)
                                ?? SanitizeKey(callsign); // fallback: use callsign as key

                if (added.Contains(markerId)) continue;
                added.Add(markerId);

                bool isNew = AtlasCodex.Discover(_theaterId, markerId);

                string placeLabel = content.TryGetPlace(markerId, out var place) && !string.IsNullOrEmpty(place.label)
                    ? place.label
                    : callsign;

                var chip = new Label { text = isNew ? $"+NEW  {placeLabel}" : placeLabel };
                chip.AddToClassList(isNew ? "chip--new" : "chip--known");
                container.Add(chip);
            }

            if (added.Count == 0)
            {
                var chip = new Label { text = "Theater explored" };
                chip.AddToClassList("chip--known");
                container.Add(chip);
            }
        }

        static string FindMarkerId(TheaterBundle bundle, string callsign)
        {
            if (bundle?.scenario?.beats == null) return null;
            foreach (var beat in bundle.scenario.beats)
            {
                if (beat.choices == null) continue;
                foreach (var choice in beat.choices)
                {
                    if (string.Equals(choice.DisplayCallsign, callsign, StringComparison.OrdinalIgnoreCase)
                     || string.Equals(choice.callsign, callsign, StringComparison.OrdinalIgnoreCase))
                    {
                        if (!string.IsNullOrEmpty(choice.markerId)) return choice.markerId;
                    }
                }
            }
            return null;
        }

        static string SanitizeKey(string s)
        {
            if (string.IsNullOrEmpty(s)) return "unknown";
            var chars = s.ToLowerInvariant().ToCharArray();
            for (int i = 0; i < chars.Length; i++)
                if (!(chars[i] >= 'a' && chars[i] <= 'z' || chars[i] >= '0' && chars[i] <= '9'))
                    chars[i] = '_';
            return new string(chars).Trim('_');
        }

        // ── Map thumbnail ─────────────────────────────────────────────────────
        void LoadMapThumbnail(VisualElement root, string theaterId)
        {
            var thumb = root.Q("mapThumbnail");
            if (thumb == null) return;

            try
            {
                var catalog = TheaterCatalogLoader.LoadCatalog();
                var entry   = catalog?.theaters?.Find(t => t != null && t.id == theaterId);
                var preview = MapTextureLibrary.LoadUiMapPreview(
                    theaterId, entry?.terrainKey ?? entry?.region, size: 512);
                if (preview != null)
                    thumb.style.backgroundImage = new StyleBackground(preview);

                if (entry?.region != null)
                    SetLabel(root, "mapLabel", entry.region);
            }
            catch (Exception ex)
            {
                Debug.LogWarning($"[Genesis] Map thumbnail failed: {ex.Message}");
            }
        }

        // ── Share ─────────────────────────────────────────────────────────────
        void DoShare(RunSummary run)
        {
            try
            {
                string payload = BuildShareText(run);
                GUIUtility.systemCopyBuffer = payload;

                var path = ShareCardRenderer.Render(run);

#if UNITY_ANDROID || UNITY_IOS
                if (!string.IsNullOrEmpty(path))
                    Application.OpenURL("file://" + path);
#endif
                FlashStatus("Result copied — share card saved!");
            }
            catch (Exception ex)
            {
                Debug.LogWarning($"[Genesis] Share failed: {ex.Message}");
                GUIUtility.systemCopyBuffer = BuildShareText(run);
                FlashStatus("Copied to clipboard!");
            }
        }

        static string BuildShareText(RunSummary run)
        {
            string grade  = !string.IsNullOrEmpty(run.grade) ? run.grade : "C";
            string orders = run.ordersExecuted != null && run.ordersExecuted.Count > 0
                ? string.Join(" · ", run.ordersExecuted) : "—";
            return $"GENESIS · After Action\n{run.theaterTitle} ({run.year})\n" +
                   $"Rank {grade} · Score {run.score}/100\nPath: {orders}\n" +
                   "Play Genesis — real geography, real history.";
        }

        void FlashStatus(string msg)
        {
            if (_shareStatus == null) return;
            _shareStatus.text = msg ?? "";
            CancelInvoke(nameof(ClearShareStatus));
            Invoke(nameof(ClearShareStatus), 2.0f);
        }

        void ClearShareStatus() { if (_shareStatus != null) _shareStatus.text = ""; }

        // ── Utilities ─────────────────────────────────────────────────────────
        static string GradeTitle(int score)
        {
            if (score >= 90) return "Master Strategist";
            if (score >= 80) return "Steady Hand";
            if (score >= 70) return "Pragmatic Course";
            if (score >= 60) return "Fragile Equilibrium";
            return "Volatile Standoff";
        }

        static void SetLabel(VisualElement root, string name, string text)
        {
            var lbl = root.Q<Label>(name);
            if (lbl != null) lbl.text = text ?? "";
        }

        static void SetFillWidth(VisualElement root, string name, float pct)
        {
            var el = root.Q(name);
            if (el != null) el.style.width = new StyleLength(new Length(pct, LengthUnit.Percent));
        }

        static void WireButton(VisualElement root, string name, Action action)
        {
            var btn = root.Q<Button>(name);
            if (btn != null) btn.clicked += action;
        }

        static void EnsureCamera()
        {
            if (Camera.main != null) return;
            var go  = new GameObject("ResultsCamera");
            var cam = go.AddComponent<Camera>();
            cam.clearFlags      = CameraClearFlags.SolidColor;
            cam.backgroundColor = new Color(0.043f, 0.071f, 0.125f);
            cam.tag             = "MainCamera";
            go.AddComponent<AudioListener>();
        }

        static void EnsureEventSystem()
        {
            if (FindFirstObjectByType<UnityEngine.EventSystems.EventSystem>() != null) return;
            var es = new GameObject("EventSystem");
            es.AddComponent<UnityEngine.EventSystems.EventSystem>();
#if GENESIS_INPUT_SYSTEM || ENABLE_INPUT_SYSTEM
            es.AddComponent<UnityEngine.InputSystem.UI.InputSystemUIInputModule>();
#else
            es.AddComponent<UnityEngine.EventSystems.StandaloneInputModule>();
#endif
        }
    }
}
