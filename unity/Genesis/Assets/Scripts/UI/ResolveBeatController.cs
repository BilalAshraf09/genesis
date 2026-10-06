using System;
using System.Collections.Generic;
using Genesis.Atlas;
using Genesis.Core;
using Genesis.Data;
using Genesis.Theater;
using Genesis.UI.Toolkit;
using UnityEngine;
using UnityEngine.UIElements;

namespace Genesis.UI
{
    // ─── Payload ─────────────────────────────────────────────────────────────

    /// <summary>
    /// Data bag passed from TheaterSession to ResolveBeatController.Show().
    /// Existing fields are preserved; new fields are filled internally by Show()
    /// from AppFlow and TheaterSession context so TheaterSession does not need changes.
    /// </summary>
    public class ResolvePayload
    {
        // ── Existing (set by TheaterSession.BuildResolveSummary) ──
        public string theaterTitle;
        public string orderCallsign;
        public string courseLine;
        public string challengeLine;
        public bool   viralHook;
        public string shareText;

        // ── Enriched internally by ResolveBeatController.Show() ──
        public string theaterId;
        public string beatId;
        public int    beatIndex;   // 0-based phase index
        public int    beatTotal;   // total phases in this theater
        public string markerId;    // gazetteer marker id for Atlas discovery
        public string markerLabel; // display name of the marker
        public List<ChoiceEffect> effects;
    }

    // ─── Controller ──────────────────────────────────────────────────────────

    /// <summary>
    /// Per-phase debrief: slides a glass card up from the bottom over the live map.
    /// Driven by UI Toolkit (Debrief.uxml / Debrief.uss).
    /// Public signature Show(ResolvePayload, Action) is preserved exactly.
    /// </summary>
    public class ResolveBeatController : MonoBehaviour
    {
        // ── UI Elements ──────────────────────────────────────────────────────
        UIDocument     _doc;
        VisualElement  _overlay;
        VisualElement  _card;
        Label          _phaseTitleLabel;
        Label          _orderTitleLabel;
        Label          _orderDetailLabel;
        VisualElement  _effectChipsRow;
        Label          _historyText;
        Button         _nextButton;
        Label          _nextBtnLabel;
        Label          _atlasChip;

        // ── State ────────────────────────────────────────────────────────────
        Action     _onContinue;
        bool       _continueFired;
        bool       _shown;
        Func<bool> _backHandler;

        // ── Lifecycle ────────────────────────────────────────────────────────

        void Awake() => BuildDocument();

        void BuildDocument()
        {
            _doc = UiRegistry.CreateDocument("Debrief", transform, 30, "Debrief");
            var root = _doc.rootVisualElement;
            if (root == null)
            {
                Debug.LogError("[Genesis] Debrief: rootVisualElement is null — is Debrief.uxml in the registry?");
                return;
            }

            _overlay         = root.Q("debriefOverlay");
            _card            = root.Q("debriefCard");
            _phaseTitleLabel = root.Q<Label>("phaseTitleLabel");
            _orderTitleLabel = root.Q<Label>("orderTitleLabel");
            _orderDetailLabel = root.Q<Label>("orderDetailLabel");
            _effectChipsRow  = root.Q("effectChipsRow");
            _historyText     = root.Q<Label>("historyText");
            _nextButton      = root.Q<Button>("nextButton");
            _atlasChip       = root.Q<Label>("atlasChip");

            _nextBtnLabel = _nextButton?.Q<Label>();

            if (_nextButton != null)
                _nextButton.clicked += OnNext;

            // Start hidden
            _overlay?.AddToClassList("hidden");
        }

        // ── Public API (signature unchanged) ─────────────────────────────────

        public void Show(ResolvePayload payload, Action onContinue)
        {
            _onContinue   = onContinue;
            _continueFired = false;

            if (payload == null)
            {
                HideCard();
                return;
            }

            EnrichPayload(payload);
            PopulateUi(payload);
            ShowCard();

            MobilePlatform.HapticConfirm();

            // Android Back = same as pressing Next
            _backHandler = () => { OnNext(); return true; };
            MobilePlatform.PushBack(_backHandler);
        }

        // ── Payload enrichment (fills context fields from TheaterSession) ────

        static void EnrichPayload(ResolvePayload p)
        {
            // Theater id from AppFlow (always available)
            if (string.IsNullOrEmpty(p.theaterId))
                p.theaterId = AppFlow.SelectedTheaterId;

            var session = TheaterSession.Instance;
            if (session == null) return;

            var beat = session.CurrentBeat;
            if (beat == null) return;

            p.beatId = beat.id;

            // Find beat index and total from the bundle
            var beats = session.Bundle?.scenario?.beats;
            if (beats != null)
            {
                p.beatTotal = beats.Count;
                for (int i = 0; i < beats.Count; i++)
                {
                    if (beats[i] == beat) { p.beatIndex = i; break; }
                }
            }

            // Find the executed choice (matched by callsign)
            if (beat.choices != null && !string.IsNullOrEmpty(p.orderCallsign))
            {
                foreach (var c in beat.choices)
                {
                    if (string.Equals(c.DisplayCallsign, p.orderCallsign, StringComparison.OrdinalIgnoreCase) ||
                        string.Equals(c.callsign, p.orderCallsign, StringComparison.OrdinalIgnoreCase))
                    {
                        p.effects  = c.effects;
                        p.markerId = c.markerId;
                        break;
                    }
                }
            }

            // Resolve marker display label from gazetteer
            if (!string.IsNullOrEmpty(p.markerId) && !string.IsNullOrEmpty(p.theaterId))
            {
                var content = AtlasContent.ForTheater(p.theaterId);
                if (content.TryGetPlace(p.markerId, out var place) && !string.IsNullOrEmpty(place.label))
                    p.markerLabel = place.label;
            }

            if (string.IsNullOrEmpty(p.markerLabel))
                p.markerLabel = p.markerId;
        }

        // ── UI population ────────────────────────────────────────────────────

        void PopulateUi(ResolvePayload p)
        {
            // Phase kicker
            int phaseNum = p.beatIndex + 1;
            if (_phaseTitleLabel != null)
                _phaseTitleLabel.text = $"PHASE {phaseNum} · DEBRIEF";

            // Order title (what you did)
            string title = !string.IsNullOrEmpty(p.orderCallsign) ? p.orderCallsign : "ORDER";
            if (_orderTitleLabel != null)
                _orderTitleLabel.text = title;

            // Order detail — extract first paragraph from courseLine (before strategic effect section)
            string detail = p.courseLine ?? "";
            int cut = detail.IndexOf("\n\nSTRATEGIC EFFECT", StringComparison.Ordinal);
            if (cut > 0) detail = detail.Substring(0, cut).Trim();
            int mapCut = detail.IndexOf("\nMAP REACTION", StringComparison.Ordinal);
            if (mapCut > 0) detail = detail.Substring(0, mapCut).Trim();
            if (string.IsNullOrEmpty(detail)) detail = "Directive committed.";
            if (_orderDetailLabel != null)
                _orderDetailLabel.text = detail;

            // Effect chips
            BuildEffectChips(p);

            // In history — real outcome from atlas, falling back to payload
            string history = "";
            if (!string.IsNullOrEmpty(p.theaterId) && !string.IsNullOrEmpty(p.beatId))
                history = AtlasContent.ForTheater(p.theaterId).HistoryFor(p.beatId);
            if (string.IsNullOrEmpty(history) && !string.IsNullOrEmpty(p.challengeLine))
                history = p.challengeLine;
            if (string.IsNullOrEmpty(history) && !string.IsNullOrEmpty(p.courseLine))
                history = p.courseLine;
            if (string.IsNullOrEmpty(history))
                history = "Historical records are classified.";
            if (_historyText != null)
                _historyText.text = history;

            // Next / See After Action button
            bool isLast = p.beatTotal > 0 && p.beatIndex >= p.beatTotal - 1;
            if (_nextBtnLabel != null)
                _nextBtnLabel.text = isLast ? "See After Action →" : "Next phase →";

            // Atlas discovery chip
            bool discovered = false;
            if (!string.IsNullOrEmpty(p.theaterId) && !string.IsNullOrEmpty(p.markerId))
                discovered = AtlasCodex.Discover(p.theaterId, p.markerId);

            if (_atlasChip != null)
            {
                if (discovered)
                {
                    string place = !string.IsNullOrEmpty(p.markerLabel) ? p.markerLabel : p.markerId;
                    _atlasChip.text = $"+ Added to Atlas: {place}";
                    _atlasChip.RemoveFromClassList("hidden");
                }
                else
                {
                    _atlasChip.AddToClassList("hidden");
                }
            }
        }

        void BuildEffectChips(ResolvePayload p)
        {
            if (_effectChipsRow == null) return;
            _effectChipsRow.Clear();
            if (p.effects == null || p.effects.Count == 0) return;

            foreach (var fx in p.effects)
            {
                if (fx == null) continue;
                string cssClass = fx.weight > 0 ? "chip--gain" : (fx.weight < 0 ? "chip--cost" : "chip--warn");
                string icon     = fx.weight > 0 ? "▲" : (fx.weight < 0 ? "▼" : "⚠");
                string tag      = !string.IsNullOrEmpty(fx.summary) ? fx.summary
                                : (!string.IsNullOrEmpty(fx.tag) ? fx.tag.Replace('_', ' ') : "impact");
                string sign     = fx.weight > 0 ? $"+{fx.weight}" : (fx.weight != 0 ? $"{fx.weight}" : "");
                string chipText = string.IsNullOrEmpty(sign) ? $"{icon} {tag}" : $"{icon} {tag} {sign}";

                var chip = new Label { text = chipText };
                chip.AddToClassList("chip");
                chip.AddToClassList(cssClass);
                chip.AddToClassList("debrief-chip");
                _effectChipsRow.Add(chip);
            }
        }

        // ── Show / Hide ──────────────────────────────────────────────────────

        void ShowCard()
        {
            _shown = true;
            if (_overlay == null) return;

            _overlay.RemoveFromClassList("hidden");

            // Defer one frame so layout settles, then trigger CSS slide-up transition
            _overlay.schedule.Execute(() =>
            {
                _card?.AddToClassList("card-visible");
            }).StartingIn(16);
        }

        void HideCard()
        {
            _shown = false;
            _card?.RemoveFromClassList("card-visible");

            if (_backHandler != null)
            {
                MobilePlatform.PopBack(_backHandler);
                _backHandler = null;
            }

            // After slide-down transition, hide overlay (prevents input blocking)
            _overlay?.schedule.Execute(() =>
            {
                _overlay?.AddToClassList("hidden");
            }).StartingIn(400);
        }

        // ── Next button handler ───────────────────────────────────────────────

        void OnNext()
        {
            if (_continueFired) return;
            _continueFired = true;
            HideCard();
            var cb = _onContinue;
            _onContinue = null;
            cb?.Invoke();
        }
    }
}

