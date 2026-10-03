using System;
using Genesis.Atlas;
using UnityEngine;
using UnityEngine.UIElements;

namespace Genesis.UI.Toolkit
{
    /// <summary>
    /// Full-width hold-to-confirm button for the order sheet.
    /// Supports hold (fills circular ring) AND direct tap/click for instant execution.
    /// Disabled / locked state suppresses all interaction.
    /// Inherits from Button for standard UI Toolkit accessibility and reliable clicks.
    /// </summary>
    [UxmlElement]
    public partial class HoldToConfirmButton : Button
    {
        // ── Constants ─────────────────────────────────────────────────────────
        const float HoldDuration = 0.45f;

        // ── State ─────────────────────────────────────────────────────────────
        float _progress;          // 0..1
        bool  _holding;
        bool  _armed;
        bool  _locked;
        bool  _confirmedThisPress;
        float _holdStartTime;
        int   _capturedPointerId = -1;
        IVisualElementScheduledItem _ticker;

        // ── Children ──────────────────────────────────────────────────────────
        readonly VisualElement _ringCanvas;
        readonly Label         _btnLabel;

        // ── Events ────────────────────────────────────────────────────────────
        public event Action Confirmed;

        // ── UXML attribute ────────────────────────────────────────────────────
        [UxmlAttribute]
        public string labelText
        {
            get => _btnLabel?.text ?? "";
            set { if (_btnLabel != null) _btnLabel.text = value ?? ""; }
        }

        // ── Constructor ───────────────────────────────────────────────────────
        public HoldToConfirmButton()
        {
            Clear(); // Clear default button hierarchy if any
            AddToClassList("hold-btn");
            pickingMode = PickingMode.Position;
            focusable   = true;

            // Row: ring canvas (left) | label (right)
            style.flexDirection = FlexDirection.Row;
            style.alignItems    = Align.Center;

            _ringCanvas = new VisualElement();
            _ringCanvas.AddToClassList("hold-btn__ring-canvas");
            _ringCanvas.pickingMode = PickingMode.Ignore;
            _ringCanvas.generateVisualContent += DrawRing;
            Add(_ringCanvas);

            _btnLabel = new Label { text = "AUTHORISE ORDER" };
            _btnLabel.AddToClassList("hold-btn__label");
            _btnLabel.pickingMode = PickingMode.Ignore;
            Add(_btnLabel);

            // Register pointer & mouse events
            RegisterCallback<PointerDownEvent>(OnPointerDown, TrickleDown.TrickleDown);
            RegisterCallback<PointerUpEvent>(OnPointerUp, TrickleDown.TrickleDown);
            RegisterCallback<PointerCancelEvent>(OnPointerCancel, TrickleDown.TrickleDown);
            
            // Standard Button click fallback
            clicked += OnButtonClicked;
        }

        // ── Public API ────────────────────────────────────────────────────────
        public void SetArmed(bool armed)
        {
            _armed    = armed;
            _progress = 0f;
            EnableInClassList("hold-btn--armed", armed && !_locked);
            EnableInClassList("hold-btn--idle",  !armed || _locked);
            SetEnabled(armed && !_locked);
            pickingMode = !_locked ? PickingMode.Position : PickingMode.Ignore;
            _ringCanvas.MarkDirtyRepaint();
        }

        public void SetLocked(bool locked)
        {
            _locked = locked;
            StopHold();
            EnableInClassList("hold-btn--locked", locked);
            SetEnabled(!locked && _armed);
            pickingMode = (locked || !_armed) ? PickingMode.Ignore : PickingMode.Position;
            _ringCanvas.MarkDirtyRepaint();
        }

        // ── Pointer & Click events ───────────────────────────────────────────
        void OnButtonClicked()
        {
            if (!_armed || _locked) return;
            FireConfirm();
        }

        void OnPointerDown(PointerDownEvent evt)
        {
            if (_locked || !_armed || _holding) return;
            _holding            = true;
            _confirmedThisPress = false;
            _capturedPointerId  = evt.pointerId;
            this.CapturePointer(evt.pointerId);
            _holdStartTime      = Time.unscaledTime;
            _progress           = 0f;
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

            // Releasing after pressing down confirms the order!
            if (wasHolding && _armed && !_locked)
            {
                FireConfirm();
            }
        }

        void OnPointerCancel(PointerCancelEvent evt)
        {
            if (!_holding) return;
            bool wasHolding = _holding;
            StopHold();

            if (wasHolding && _armed && !_locked)
            {
                FireConfirm();
            }
        }

        void FireConfirm()
        {
            if (_confirmedThisPress || !_armed || _locked) return;
            _confirmedThisPress = true;
            StopHold();
            MobilePlatform.HapticConfirm();
            Confirmed?.Invoke();
        }

        void StopHold()
        {
            _holding = false;
            _ticker?.Pause();
            _ticker = null;
            if (_capturedPointerId >= 0)
            {
                this.ReleasePointer(_capturedPointerId);
                _capturedPointerId = -1;
            }
            _progress = 0f;
            _ringCanvas.MarkDirtyRepaint();
        }

        void OnTick()
        {
            if (!_holding) return;
            _progress = Mathf.Clamp01((Time.unscaledTime - _holdStartTime) / HoldDuration);
            _ringCanvas.MarkDirtyRepaint();

            if (_progress >= 1f)
            {
                FireConfirm();
            }
        }

        // ── Painter2D ring ─────────────────────────────────────────────────────
        void DrawRing(MeshGenerationContext ctx)
        {
            float w = _ringCanvas.contentRect.width;
            float h = _ringCanvas.contentRect.height;
            if (w < 1f || h < 1f) return;

            float cx = w * 0.5f;
            float cy = h * 0.5f;
            float r  = Mathf.Min(cx, cy) - 3f;
            if (r < 2f) return;

            var painter = ctx.painter2D;

            // Dim track (full circle)
            painter.strokeColor = new Color(1f, 1f, 1f, 0.18f);
            painter.lineWidth   = 2.5f;
            painter.lineCap     = LineCap.Round;
            painter.BeginPath();
            painter.Arc(new Vector2(cx, cy), r,
                        Angle.Degrees(-90f), Angle.Degrees(270f),
                        ArcDirection.Clockwise);
            painter.Stroke();

            // Amber progress arc
            if (_progress > 0.002f)
            {
                float endDeg = -90f + 360f * _progress;
                painter.strokeColor = new Color(0.961f, 0.647f, 0.141f, 1f); // #F5A524
                painter.lineWidth   = 2.5f;
                painter.lineCap     = LineCap.Round;
                painter.BeginPath();
                painter.Arc(new Vector2(cx, cy), r,
                            Angle.Degrees(-90f), Angle.Degrees(endDeg),
                            ArcDirection.Clockwise);
                painter.Stroke();
            }
        }
    }
}
