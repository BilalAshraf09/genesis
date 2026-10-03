using System;
using Genesis.Atlas;
using Genesis.Data;
using Genesis.Theater;
using Genesis.UI.Toolkit;
using UnityEngine;
using UnityEngine.UIElements;

namespace Genesis.UI
{
    /// <summary>
    /// Operations HUD Controller — UI Toolkit rebuild.
    /// Drives CommandHud.uxml: top bar (title, phase, timer), meter strip,
    /// intel chip, field-brief card, commit toast, and mission-complete toast.
    /// Owns the PauseDialog (sortingOrder 40) and Android Back routing.
    /// All public signatures are IDENTICAL to the legacy version (TheaterSession contract).
    /// </summary>
    [DefaultExecutionOrder(0)]
    public class OpsHudController : MonoBehaviour
    {
        // ── UIDocuments ───────────────────────────────────────────────────────
        UIDocument    _hudDoc;
        VisualElement _root;

        UIDocument    _pauseDoc;
        VisualElement _pauseRoot;
        bool          _pauseVisible;

        // ── Cached elements ───────────────────────────────────────────────────
        Label         _titleLabel;
        Label         _phaseLabel;
        Label         _timerLabel;
        VisualElement _timerFill;

        VisualElement _intelChip;
        Label         _intelText;

        VisualElement _fieldBrief;
        Label         _briefHeadline;
        Label         _briefFact;

        Label         _commitToast;
        Label         _missionToast;

        // ── State ─────────────────────────────────────────────────────────────
        float       _remaining;
        float       _duration;
        bool        _timerRunning;
        string      _theaterId;
        OrderChoice _lastArmedOrder;

        IVisualElementScheduledItem _briefDismissItem;
        IVisualElementScheduledItem _toastDismissItem;

        // ── Sub-systems ───────────────────────────────────────────────────────
        MeterStrip _meterStrip;

        // ── Android Back ──────────────────────────────────────────────────────
        Func<bool> _backHandler;

        // ── Lifecycle ─────────────────────────────────────────────────────────
        void Awake()
        {
            _hudDoc = UiRegistry.CreateDocument("OpsHud", transform, 10, "CommandHud");
            _hudDoc.gameObject.AddComponent<SafeAreaRootBehaviour>();
            _root = _hudDoc.rootVisualElement;

            if (_root == null)
            {
                Debug.LogError("[Genesis] OpsHudController: CommandHud rootVisualElement is null. " +
                               "Is CommandHud.uxml in GenesisUiRegistry?");
                return;
            }

            BindElements();
            CreatePauseDialog();
            RegisterBackHandler();
        }

        void OnDestroy()
        {
            MobilePlatform.PopBack(_backHandler);
        }

        // ── Element binding ───────────────────────────────────────────────────
        void BindElements()
        {
            _titleLabel    = _root.Q<Label>("titleLabel");
            _phaseLabel    = _root.Q<Label>("phaseLabel");
            _timerLabel    = _root.Q<Label>("timerLabel");
            _timerFill     = _root.Q("timerFill");

            _intelChip     = _root.Q("intelChip");
            _intelText     = _root.Q<Label>("intelText");

            _fieldBrief    = _root.Q("fieldBrief");
            _briefHeadline = _root.Q<Label>("briefHeadline");
            _briefFact     = _root.Q<Label>("briefFact");

            _commitToast   = _root.Q<Label>("commitToast");
            _missionToast  = _root.Q<Label>("missionToast");

            // Back button → pause dialog
            var backBtn = _root.Q<Button>("backButton");
            if (backBtn != null) backBtn.clicked += OnBackButtonPressed;

            // Meter strip
            _meterStrip = new MeterStrip(
                _root.Q("meterStabFill"),
                _root.Q("meterCredFill"),
                _root.Q("meterTollFill"),
                _root.Q("meterEscFill"));
        }

        // ── Pause dialog ──────────────────────────────────────────────────────
        void CreatePauseDialog()
        {
            _pauseDoc  = UiRegistry.CreateDocument("PauseDialog", transform, 40, "PauseDialog");
            _pauseRoot = _pauseDoc.rootVisualElement;

            if (_pauseRoot == null)
            {
                Debug.LogWarning("[Genesis] OpsHudController: PauseDialog rootVisualElement is null.");
                return;
            }

            var resumeBtn = _pauseRoot.Q<Button>("resumeBtn");
            if (resumeBtn != null) resumeBtn.clicked += ClosePauseDialog;

            var exitBtn = _pauseRoot.Q<Button>("exitBtn");
            if (exitBtn != null) exitBtn.clicked += () =>
            {
                ClosePauseDialog();
                TheaterSession.Instance?.AbortMission();
            };

            SetPauseVisible(false);
        }

        void ShowPauseDialog()  => SetPauseVisible(true);
        void ClosePauseDialog() => SetPauseVisible(false);

        void SetPauseVisible(bool visible)
        {
            _pauseVisible = visible;
            if (_pauseRoot == null) return;
            _pauseRoot.EnableInClassList("hidden", !visible);
        }

        // ── Android Back handler ──────────────────────────────────────────────
        void RegisterBackHandler()
        {
            _backHandler = OnBackRequested;
            MobilePlatform.PushBack(_backHandler);
        }

        bool OnBackRequested()
        {
            if (_pauseVisible)
            {
                ClosePauseDialog();
                return true;
            }

            // If the order sheet is expanded (beyond peek), collapse first.
            var rail = TheaterSession.Instance?.orderRail;
            if (rail != null && rail.IsSheetExpanded)
            {
                rail.CollapseSheet();
                return true;
            }

            ShowPauseDialog();
            return true;
        }

        void OnBackButtonPressed() => ShowPauseDialog();

        // ── Timer (Update) ────────────────────────────────────────────────────
        void Update()
        {
            if (!_timerRunning) return;

            _remaining -= Time.deltaTime;
            float safe = Mathf.Max(0f, _remaining);
            float pct  = _duration > 0f ? Mathf.Clamp01(safe / _duration) : 0f;

            if (_timerLabel != null) _timerLabel.text = FormatTime(safe);
            if (_timerFill  != null)
            {
                _timerFill.style.width = new StyleLength(new Length(pct * 100f, LengthUnit.Percent));
                _timerFill.EnableInClassList("timer-fill--urgent", pct < 0.25f);
            }

            if (_remaining <= 0f)
            {
                _timerRunning = false;
                TheaterSession.Instance?.OnTimerExpired();
            }
        }

        // ── Public contract (TheaterSession calls these) ───────────────────────

        public void BindTheater(TheaterBundle bundle)
        {
            if (bundle?.scenario == null || bundle.board == null) return;
            _theaterId = bundle.scenario.id ?? "";
            string title = $"{bundle.scenario.year}  ·  {bundle.board.title}";
            if (_titleLabel != null) _titleLabel.text = title;
        }

        public void ShowBeat(BeatData beat, int index, int total, float seconds)
        {
            if (beat == null) return;

            if (_phaseLabel != null)
                _phaseLabel.text = $"Phase {index + 1}/{Mathf.Max(1, total)}";

            _duration       = Mathf.Max(1f, seconds);
            _remaining      = _duration;
            _timerRunning   = true;
            _lastArmedOrder = null;

            if (_timerFill != null)
                _timerFill.style.width = new StyleLength(new Length(100f, LengthUnit.Percent));
            if (_timerLabel != null)
                _timerLabel.text = FormatTime(_duration);

            ClearIntelChip();
            HideToast(_commitToast);
            HideToast(_missionToast);

            ShowFieldBrief(beat);
        }

        /// <summary>
        /// Called by TheaterSession on hotspot / order selection.
        /// New CommandHud uses the intel chip for the same feedback.
        /// </summary>
        public void SetFocusLabel(string label)
        {
            // The intel chip (ShowIntelChip) is always called immediately after,
            // so no additional element is needed here.
        }

        public void ShowIntelChip(string line)
        {
            bool has = !string.IsNullOrWhiteSpace(line);
            if (_intelChip != null) _intelChip.EnableInClassList("hidden", !has);
            if (_intelText  != null) _intelText.text = has ? line.Trim() : "";
        }

        public void ClearIntelChip()
        {
            if (_intelChip != null) _intelChip.AddToClassList("hidden");
            if (_intelText  != null) _intelText.text = "";
        }

        public void ArmExecute(OrderChoice order)
        {
            _lastArmedOrder = order;
            string callsign = string.IsNullOrEmpty(order?.DisplayCallsign) ? "ORDER" : order.DisplayCallsign;
            string label    = $"HOLD TO AUTHORISE · {callsign}";

            // Arm the hold button in the order sheet (lives in OrderRailController).
            var rail = TheaterSession.Instance?.orderRail;
            if (rail != null)
            {
                rail.SetHoldButtonLabel(label);
                rail.SetHoldButtonArmed(true);
            }
        }

        public void LockExecute()
        {
            _timerRunning = false;
            var rail = TheaterSession.Instance?.orderRail;
            if (rail != null)
            {
                rail.SetHoldButtonArmed(false);
                rail.SetHoldButtonLocked(true);
            }
        }

        public void ShowCommitBeat(string verbLine)
        {
            _timerRunning = false;

            // Animate meters from just-committed order's effects.
            if (_lastArmedOrder?.effects != null)
                _meterStrip?.Animate(_lastArmedOrder.effects);

            if (_commitToast != null)
            {
                string safe = string.IsNullOrEmpty(verbLine) ? "ORDER COMMITTED" : verbLine.ToUpperInvariant();
                _commitToast.text = safe;
                _commitToast.RemoveFromClassList("hidden");

                _toastDismissItem?.Pause();
                _toastDismissItem = _root.schedule.Execute(() => HideToast(_commitToast)).StartingIn(2500);
            }
        }

        public void ShowMissionComplete(string title)
        {
            _timerRunning = false;
            ClearIntelChip();
            HideToast(_commitToast);

            string safe = string.IsNullOrEmpty(title)
                ? "MISSION ACCOMPLISHED"
                : $"MISSION ACCOMPLISHED · {title.ToUpperInvariant()}";

            if (_missionToast != null)
            {
                _missionToast.text = safe;
                _missionToast.RemoveFromClassList("hidden");
            }
        }

        // ── Field brief card ──────────────────────────────────────────────────
        void ShowFieldBrief(BeatData beat)
        {
            if (_fieldBrief == null || beat == null) return;

            _briefDismissItem?.Pause();
            _briefDismissItem = null;

            // Prefer Atlas FieldBrief; fallback to beat.briefing text.
            string headline = beat.title ?? "Mission Brief";
            string fact     = beat.briefing ?? "Intelligence classified.";

            if (!string.IsNullOrEmpty(_theaterId))
            {
                try
                {
                    var content = AtlasContent.ForTheater(_theaterId);
                    var brief   = content?.BriefFor(beat.id);
                    if (brief != null)
                    {
                        if (!string.IsNullOrEmpty(brief.headline)) headline = brief.headline;
                        if (!string.IsNullOrEmpty(brief.fact))     fact     = brief.fact;
                    }
                }
                catch (Exception ex)
                {
                    Debug.LogWarning($"[Genesis] OpsHud FieldBrief: {ex.Message}");
                }
            }

            // Guarantee non-empty (hard rule: no empty labels).
            if (string.IsNullOrEmpty(headline)) headline = "Mission Brief";
            if (string.IsNullOrEmpty(fact))     fact     = "Intelligence classified.";

            if (_briefHeadline != null) _briefHeadline.text = headline;
            if (_briefFact     != null) _briefFact.text     = fact;

            _fieldBrief.RemoveFromClassList("hidden");
            _fieldBrief.pickingMode = PickingMode.Position;
            _fieldBrief.RegisterCallback<PointerDownEvent>(OnBriefTap);

            _briefDismissItem = _root.schedule.Execute(HideBrief).StartingIn(4000);
        }

        void OnBriefTap(PointerDownEvent evt) { HideBrief(); evt.StopPropagation(); }

        void HideBrief()
        {
            _briefDismissItem?.Pause();
            _briefDismissItem = null;
            if (_fieldBrief == null) return;
            _fieldBrief.AddToClassList("hidden");
            _fieldBrief.pickingMode = PickingMode.Ignore;
            _fieldBrief.UnregisterCallback<PointerDownEvent>(OnBriefTap);
        }

        // ── Utilities ─────────────────────────────────────────────────────────
        static void HideToast(Label lbl)
        {
            if (lbl == null) return;
            lbl.AddToClassList("hidden");
            lbl.text = " ";
        }

        static string FormatTime(float seconds)
        {
            int m = Mathf.FloorToInt(seconds / 60f);
            int s = Mathf.FloorToInt(seconds % 60f);
            return $"{m}:{s:00}";
        }
    }
}
