using System;
using UnityEngine;
using UnityEngine.UIElements;

namespace Genesis.UI.Toolkit
{
    /// <summary>
    /// Controls the bottom sheet element with three snap heights:
    ///   Peek  = 22 % of panel height  (map ≥ 78 %)
    ///   Half  = 38 % of panel height  (map ≥ 62 %)
    ///   Full  = 70 % of panel height  (max order detail)
    /// Animates via <c>style.height</c>; the CSS <c>transition-duration: 0.22s</c>
    /// already defined on <c>.order-sheet</c> provides the easing.
    /// Drag on the drag-handle snaps to the nearest height.
    /// Never fully hides the map — Peek is the minimum shown state.
    /// </summary>
    public sealed class BottomSheet
    {
        // ── Snap enum ─────────────────────────────────────────────────────────
        public enum SnapState { Hidden, Peek, Half, Full }

        // ── Snap percentages ─────────────────────────────────────────────────
        const float PeekPct = 0.38f; // Reduced from 0.42 to give more room to map
        const float HalfPct = 0.55f;
        const float FullPct = 0.85f;

        // ── Drag threshold (px) to register a directional swipe ─────────────
        const float DragThreshold = 28f;

        // ── References ────────────────────────────────────────────────────────
        readonly VisualElement _sheet;
        readonly VisualElement _rootForHeight;

        // ── State ─────────────────────────────────────────────────────────────
        SnapState _state = SnapState.Hidden;
        float _panelHeight = 667f;    // fallback until geometry resolves
        float _dragStartY;
        float _sheetStartH;
        bool  _dragging;
        int   _dragPointerId = -1;

        public SnapState State => _state;
        public bool IsVisible  => _state != SnapState.Hidden;

        /// <summary>Raised whenever the snap state changes.</summary>
        public event Action<SnapState> StateChanged;

        // ── Constructor ───────────────────────────────────────────────────────
        public BottomSheet(VisualElement sheet, VisualElement dragHandle, VisualElement heightRoot)
        {
            _sheet          = sheet  ?? throw new ArgumentNullException(nameof(sheet));
            _rootForHeight  = heightRoot ?? sheet.parent ?? sheet;

            // Resolve panel height whenever the root layout changes.
            _rootForHeight.RegisterCallback<GeometryChangedEvent>(OnRootGeometry);

            // Wire drag events on the drag handle.
            if (dragHandle != null)
            {
                dragHandle.pickingMode = PickingMode.Position;
                dragHandle.RegisterCallback<PointerDownEvent>(OnHandleDown);
                dragHandle.RegisterCallback<PointerMoveEvent>(OnHandleMove);
                dragHandle.RegisterCallback<PointerUpEvent>(OnHandleUp);
                dragHandle.RegisterCallback<PointerCancelEvent>(OnHandleCancel);
            }
        }

        // ── Public API ────────────────────────────────────────────────────────
        public void Show()           => SnapTo(SnapState.Peek);
        public void Hide()           => SnapTo(SnapState.Hidden);
        public void Expand()         => SnapTo(SnapState.Half);
        public void Collapse()       => SnapTo(SnapState.Peek);

        public void SnapTo(SnapState state, bool immediate = false)
        {
            _state = state;

            if (state == SnapState.Hidden)
            {
                _sheet.AddToClassList("hidden");
                _sheet.style.height = StyleKeyword.Auto;
                StateChanged?.Invoke(state);
                return;
            }

            _sheet.RemoveFromClassList("hidden");

            float targetH = StateToHeight(state);
            _sheet.style.height = targetH;
            StateChanged?.Invoke(state);
        }

        // ── Geometry tracking ─────────────────────────────────────────────────
        void OnRootGeometry(GeometryChangedEvent evt)
        {
            float h = evt.newRect.height;
            if (h > 1f) _panelHeight = h;

            // Re-apply current state with updated dimensions.
            if (_state != SnapState.Hidden)
                _sheet.style.height = StateToHeight(_state);
        }

        // ── Drag handle events ────────────────────────────────────────────────
        void OnHandleDown(PointerDownEvent evt)
        {
            _dragging       = true;
            _dragStartY     = evt.position.y;
            _sheetStartH    = _sheet.resolvedStyle.height;
            _dragPointerId  = evt.pointerId;
            ((VisualElement)evt.target).CapturePointer(evt.pointerId);
            evt.StopPropagation();
        }

        void OnHandleMove(PointerMoveEvent evt)
        {
            if (!_dragging) return;
            // Positive dy → dragging up (expanding sheet).
            float dy      = _dragStartY - evt.position.y;
            float maxH    = _panelHeight * FullPct * 1.05f;
            float newH    = Mathf.Clamp(_sheetStartH + dy, 0f, maxH);
            _sheet.style.height = newH;
            evt.StopPropagation();
        }

        void OnHandleUp(PointerUpEvent evt)
        {
            if (!_dragging) return;
            float dy = _dragStartY - evt.position.y;
            FinishDrag(dy);
            ((VisualElement)evt.target).ReleasePointer(evt.pointerId);
            _dragging      = false;
            _dragPointerId = -1;
            evt.StopPropagation();
        }

        void OnHandleCancel(PointerCancelEvent evt)
        {
            if (!_dragging) return;
            _dragging      = false;
            _dragPointerId = -1;
            SnapTo(_state); // restore
        }

        void FinishDrag(float dy)
        {
            float peekH = StateToHeight(SnapState.Peek);
            float halfH = StateToHeight(SnapState.Half);
            float fullH = StateToHeight(SnapState.Full);
            float currH = _sheet.resolvedStyle.height;

            SnapState target;
            if (dy > DragThreshold)          // dragged up → expand
            {
                target = _state switch
                {
                    SnapState.Peek => SnapState.Half,
                    SnapState.Half => SnapState.Full,
                    _              => SnapState.Full
                };
            }
            else if (dy < -DragThreshold)    // dragged down → collapse
            {
                target = _state switch
                {
                    SnapState.Full => SnapState.Half,
                    SnapState.Half => SnapState.Peek,
                    _              => SnapState.Peek
                };
            }
            else                             // small move → snap to nearest
            {
                float dPeek = Mathf.Abs(currH - peekH);
                float dHalf = Mathf.Abs(currH - halfH);
                float dFull = Mathf.Abs(currH - fullH);
                float minD  = Mathf.Min(dPeek, Mathf.Min(dHalf, dFull));
                target = minD == dPeek ? SnapState.Peek
                       : minD == dHalf ? SnapState.Half
                       :                 SnapState.Full;
            }

            SnapTo(target);
        }

        // ── Helpers ───────────────────────────────────────────────────────────
        float StateToHeight(SnapState state) => state switch
        {
            SnapState.Peek => Mathf.Max(520f, _panelHeight * 0.36f),
            SnapState.Half => Mathf.Max(660f, _panelHeight * 0.55f),
            SnapState.Full => Mathf.Max(800f, _panelHeight * 0.88f),
            _              => 0f
        };
    }
}
