using System;
using Genesis.Atlas;
using Genesis.Core;
using UnityEngine;
using UnityEngine.UIElements;

namespace Genesis.UI.Toolkit
{
    /// <summary>
    /// Hold-to-confirm with primary + optional subtitle (readable on narrow phones).
    /// </summary>
    [UxmlElement]
    public partial class HoldToConfirmButton : Button
    {
        const float HoldDuration = 0.45f;
        const long SuccessFlashMs = 280;

        float _progress;
        bool  _holding;
        bool  _armed;
        bool  _locked;
        bool  _confirmedThisPress;
        float _holdStartTime;
        float _lastProgressHaptic;
        int   _capturedPointerId = -1;
        IVisualElementScheduledItem _ticker;
        IVisualElementScheduledItem _successClear;

        readonly VisualElement _fill;
        readonly VisualElement _ringCanvas;
        readonly VisualElement _textCol;
        readonly Label         _btnLabel;
        readonly Label         _subLabel;
        readonly Label         _arrow;

        public event Action Confirmed;

        [UxmlAttribute]
        public string labelText
        {
            get => _btnLabel?.text ?? "";
            set => SetLabels(value, null);
        }

        public void SetLabels(string primary, string subtitle)
        {
            // Keep built-in Button.text empty so it never ghosts under our layout.
            text = string.Empty;
            StripDefaultButtonText();
            if (_btnLabel != null)
                _btnLabel.text = string.IsNullOrWhiteSpace(primary) ? "HOLD TO COMMIT" : primary.Trim();
            if (_subLabel != null)
            {
                bool hasSub = !string.IsNullOrWhiteSpace(subtitle);
                _subLabel.text = hasSub ? subtitle.Trim() : "";
                _subLabel.EnableInClassList("hidden", !hasSub);
                // Explicit display — USS .hidden can otherwise leave the subtitle clipped/absent.
                _subLabel.style.display = hasSub ? DisplayStyle.Flex : DisplayStyle.None;
                _subLabel.style.opacity = hasSub ? 1f : 0f;
            }
        }

        void StripDefaultButtonText()
        {
            text = string.Empty;
            // Remove leftover default labels (class unity-button__text / untitled Labels).
            var doomed = new System.Collections.Generic.List<VisualElement>();
            foreach (var child in Children())
            {
                if (child == _fill || child == _ringCanvas || child == _textCol || child == _arrow)
                    continue;
                if (child is Label)
                    doomed.Add(child);
            }
            foreach (var el in doomed)
                el.RemoveFromHierarchy();
        }

        public HoldToConfirmButton()
        {
            Clear();
            text = string.Empty; // suppress default Button label chrome
            AddToClassList("hold-btn");
            pickingMode = PickingMode.Position;
            focusable   = true;

            style.flexDirection = FlexDirection.Row;
            style.alignItems    = Align.Center;
            style.flexGrow = 1f;
            style.alignSelf = Align.Stretch;
            style.marginLeft = 0;
            style.marginRight = 0;
            style.paddingLeft = 0;
            style.paddingRight = 0;
            style.paddingTop = 0;
            style.paddingBottom = 0;
            style.overflow = Overflow.Hidden;

            // Unity may re-inject a default text Label; strip anything that isn't ours.
            RegisterCallback<AttachToPanelEvent>(_ => StripDefaultButtonText());

            _fill = new VisualElement();
            _fill.AddToClassList("hold-btn__fill");
            _fill.pickingMode = PickingMode.Ignore;
            Add(_fill);

            _ringCanvas = new VisualElement();
            _ringCanvas.AddToClassList("hold-btn__ring-canvas");
            _ringCanvas.pickingMode = PickingMode.Ignore;
            _ringCanvas.generateVisualContent += DrawRing;
            Add(_ringCanvas);

            _textCol = new VisualElement();
            _textCol.AddToClassList("hold-btn__text-col");
            _textCol.pickingMode = PickingMode.Ignore;

            _btnLabel = new Label { text = "HOLD TO COMMIT" };
            _btnLabel.AddToClassList("hold-btn__label");
            _btnLabel.pickingMode = PickingMode.Ignore;
            _btnLabel.style.marginRight = 0;

            _subLabel = new Label();
            _subLabel.AddToClassList("hold-btn__sublabel");
            _subLabel.AddToClassList("hidden");
            _subLabel.pickingMode = PickingMode.Ignore;

            _textCol.Add(_btnLabel);
            _textCol.Add(_subLabel);
            Add(_textCol);

            _arrow = new Label { text = "→" };
            _arrow.AddToClassList("hold-btn__arrow");
            _arrow.pickingMode = PickingMode.Ignore;
            Add(_arrow);

            ApplyChrome(ChromeState.Idle);

            RegisterCallback<PointerDownEvent>(OnPointerDown, TrickleDown.TrickleDown);
            RegisterCallback<PointerUpEvent>(OnPointerUp, TrickleDown.TrickleDown);
            RegisterCallback<PointerCancelEvent>(OnPointerCancel, TrickleDown.TrickleDown);
            clicked += OnButtonClicked;
        }

        IVisualElementScheduledItem _armedPulseItem;

        public void SetArmed(bool armed)
        {
            _armed    = armed;
            _progress = 0f;
            EnableInClassList("hold-btn--armed", armed && !_locked);
            EnableInClassList("hold-btn--idle",  !armed || _locked);
            EnableInClassList("hold-btn--holding", false);
            EnableInClassList("hold-btn--success", false);
            SetEnabled(armed && !_locked);
            pickingMode = !_locked ? PickingMode.Position : PickingMode.Ignore;
            ApplyChrome(armed && !_locked ? ChromeState.Armed : ChromeState.Idle);
            UpdateFill();
            _ringCanvas.MarkDirtyRepaint();

            _armedPulseItem?.Pause();
            // Solid orange CTA — no border pulse (reference is a flat filled button).
            style.borderTopWidth = style.borderBottomWidth =
                style.borderLeftWidth = style.borderRightWidth = 0;
            style.borderTopColor = style.borderBottomColor =
                style.borderLeftColor = style.borderRightColor = StyleKeyword.Null;
        }

        enum ChromeState { Idle, Armed, Holding, Success }

        void ApplyChrome(ChromeState state)
        {
            // Inline colors beat Unity's default .unity-button theme.
            Color bg;
            switch (state)
            {
                case ChromeState.Armed:
                    bg = new Color(0.961f, 0.647f, 0.141f, 1f); // #F5A524
                    break;
                case ChromeState.Holding:
                    bg = new Color(0.910f, 0.588f, 0.071f, 1f); // #E89612
                    break;
                case ChromeState.Success:
                    bg = new Color(0.247f, 0.725f, 0.478f, 1f); // #3FB97A
                    break;
                default:
                    bg = new Color(1f, 1f, 1f, 0.06f);
                    break;
            }
            style.backgroundColor = bg;
            style.backgroundImage = StyleKeyword.None;
            style.borderTopLeftRadius = style.borderTopRightRadius =
                style.borderBottomLeftRadius = style.borderBottomRightRadius = 20;

            bool solid = state != ChromeState.Idle;
            if (_btnLabel != null)
                _btnLabel.style.color = solid
                    ? new Color(0.043f, 0.071f, 0.125f, 1f)   // #0B1220
                    : new Color(0.961f, 0.647f, 0.141f, 1f); // #F5A524
            if (_subLabel != null)
                _subLabel.style.color = solid
                    ? new Color(0.043f, 0.071f, 0.125f, 0.88f)
                    : new Color(0.663f, 0.702f, 0.769f, 1f); // #A9B3C4
            if (_arrow != null)
                _arrow.style.color = solid
                    ? new Color(0.043f, 0.071f, 0.125f, 1f)
                    : new Color(0.431f, 0.478f, 0.561f, 1f);
        }

        public void SetLocked(bool locked)
        {
            _locked = locked;
            StopHold();
            EnableInClassList("hold-btn--locked", locked);
            EnableInClassList("hold-btn--armed", _armed && !_locked);
            EnableInClassList("hold-btn--idle", !_armed || _locked);
            SetEnabled(!locked && _armed);
            pickingMode = (locked || !_armed) ? PickingMode.Ignore : PickingMode.Position;
            ApplyChrome(_armed && !_locked ? ChromeState.Armed : ChromeState.Idle);
            UpdateFill();
            _ringCanvas.MarkDirtyRepaint();
        }

        void OnButtonClicked()
        {
            if (!_armed || _locked) return;
            FireConfirm();
        }

        void OnPointerDown(PointerDownEvent evt)
        {
            if (_locked || !_armed || _holding) return;
            _holding = true;
            _confirmedThisPress = false;
            _capturedPointerId = evt.pointerId;
            ((VisualElement)this).CapturePointer(evt.pointerId);
            _holdStartTime = Time.unscaledTime;
            _lastProgressHaptic = 0f;
            _progress = 0f;
            EnableInClassList("hold-btn--holding", true);
            ApplyChrome(ChromeState.Holding);
            MobilePlatform.HapticTick();
            _ticker = schedule.Execute(OnTick).Every(16);
            evt.StopPropagation();
        }

        void OnPointerUp(PointerUpEvent evt)
        {
            if (!_holding) return;
            bool wasHolding = _holding;
            StopHold();
            evt.StopPropagation();
            if (wasHolding && _armed && !_locked) FireConfirm();
        }

        void OnPointerCancel(PointerCancelEvent evt)
        {
            if (!_holding) return;
            bool wasHolding = _holding;
            StopHold();
            if (wasHolding && _armed && !_locked) FireConfirm();
        }

        void FireConfirm()
        {
            if (_confirmedThisPress || !_armed || _locked) return;
            _confirmedThisPress = true;
            StopHold();
            _progress = 1f;
            UpdateFill();
            EnableInClassList("hold-btn--success", true);
            ApplyChrome(ChromeState.Success);
            _successClear?.Pause();
            _successClear = schedule.Execute(() =>
            {
                EnableInClassList("hold-btn--success", false);
                ApplyChrome(_armed && !_locked ? ChromeState.Armed : ChromeState.Idle);
                _progress = 0f;
                UpdateFill();
                _ringCanvas.MarkDirtyRepaint();
            }).StartingIn(SuccessFlashMs);

            MobilePlatform.HapticConfirm();
            GenesisAudio.Ensure().PlayHoldComplete();
            Confirmed?.Invoke();
        }

        void StopHold()
        {
            _holding = false;
            _ticker?.Pause();
            _ticker = null;
            if (_capturedPointerId >= 0)
            {
                ((VisualElement)this).ReleasePointer(_capturedPointerId);
                _capturedPointerId = -1;
            }
            if (!_confirmedThisPress) _progress = 0f;
            EnableInClassList("hold-btn--holding", false);
            if (!_confirmedThisPress)
                ApplyChrome(_armed && !_locked ? ChromeState.Armed : ChromeState.Idle);
            UpdateFill();
            _ringCanvas.MarkDirtyRepaint();
        }

        void OnTick()
        {
            if (!_holding) return;
            _progress = Mathf.Clamp01((Time.unscaledTime - _holdStartTime) / HoldDuration);
            UpdateFill();
            _ringCanvas.MarkDirtyRepaint();
            if (_progress - _lastProgressHaptic >= 0.25f)
            {
                _lastProgressHaptic = _progress;
                MobilePlatform.HapticProgress();
            }
            if (_progress >= 1f) FireConfirm();
        }

        void UpdateFill()
        {
            if (_fill != null)
                _fill.style.width = new StyleLength(new Length(Mathf.Clamp01(_progress) * 100f, LengthUnit.Percent));
        }

        void DrawRing(MeshGenerationContext ctx)
        {
            float w = _ringCanvas.contentRect.width;
            float h = _ringCanvas.contentRect.height;
            if (w < 1f || h < 1f) return;
            float cx = w * 0.5f, cy = h * 0.5f, r = Mathf.Min(cx, cy) - 4f;
            if (r < 2f) return;
            var painter = ctx.painter2D;
            bool solidCta = ClassListContains("hold-btn--armed")
                         || ClassListContains("hold-btn--holding")
                         || ClassListContains("hold-btn--success");
            // Dark track on solid gold/green; light track on idle glass.
            painter.strokeColor = solidCta
                ? new Color(0.043f, 0.071f, 0.125f, 0.55f)
                : new Color(1f, 1f, 1f, 0.22f);
            painter.lineWidth = 5f;
            painter.lineCap = LineCap.Round;
            painter.BeginPath();
            painter.Arc(new Vector2(cx, cy), r, Angle.Degrees(-90f), Angle.Degrees(270f), ArcDirection.Clockwise);
            painter.Stroke();
            if (_progress > 0.002f)
            {
                float endDeg = -90f + 360f * _progress;
                painter.strokeColor = ClassListContains("hold-btn--success")
                    ? new Color(0.043f, 0.071f, 0.125f, 1f)
                    : new Color(0.102f, 0.071f, 0.024f, 1f);
                painter.BeginPath();
                painter.Arc(new Vector2(cx, cy), r, Angle.Degrees(-90f), Angle.Degrees(endDeg), ArcDirection.Clockwise);
                painter.Stroke();
            }
        }
    }
}
