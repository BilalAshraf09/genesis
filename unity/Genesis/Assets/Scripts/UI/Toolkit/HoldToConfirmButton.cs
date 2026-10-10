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

        public event Action Confirmed;

        [UxmlAttribute]
        public string labelText
        {
            get => _btnLabel?.text ?? "";
            set => SetLabels(value, null);
        }

        public void SetLabels(string primary, string subtitle)
        {
            if (_btnLabel != null)
                _btnLabel.text = string.IsNullOrWhiteSpace(primary) ? "HOLD TO COMMIT" : primary.Trim();
            if (_subLabel != null)
            {
                bool hasSub = !string.IsNullOrWhiteSpace(subtitle);
                _subLabel.text = hasSub ? subtitle.Trim() : "";
                _subLabel.EnableInClassList("hidden", !hasSub);
            }
        }

        public HoldToConfirmButton()
        {
            Clear();
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

            RegisterCallback<PointerDownEvent>(OnPointerDown, TrickleDown.TrickleDown);
            RegisterCallback<PointerUpEvent>(OnPointerUp, TrickleDown.TrickleDown);
            RegisterCallback<PointerCancelEvent>(OnPointerCancel, TrickleDown.TrickleDown);
            clicked += OnButtonClicked;
        }

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
            UpdateFill();
            _ringCanvas.MarkDirtyRepaint();
        }

        public void SetLocked(bool locked)
        {
            _locked = locked;
            StopHold();
            EnableInClassList("hold-btn--locked", locked);
            SetEnabled(!locked && _armed);
            pickingMode = (locked || !_armed) ? PickingMode.Ignore : PickingMode.Position;
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
            _successClear?.Pause();
            _successClear = schedule.Execute(() =>
            {
                EnableInClassList("hold-btn--success", false);
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
            float cx = w * 0.5f, cy = h * 0.5f, r = Mathf.Min(cx, cy) - 3f;
            if (r < 2f) return;
            var painter = ctx.painter2D;
            bool solidCta = ClassListContains("hold-btn--armed")
                         || ClassListContains("hold-btn--holding")
                         || ClassListContains("hold-btn--success");
            // Dark track on solid gold/green; light track on idle glass.
            painter.strokeColor = solidCta
                ? new Color(0.102f, 0.071f, 0.024f, 0.35f)
                : new Color(1f, 1f, 1f, 0.18f);
            painter.lineWidth = 2.5f;
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
