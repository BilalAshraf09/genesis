using System.Collections.Generic;
using UnityEngine;
using UnityEngine.EventSystems;
using Genesis.UI.Toolkit;
#if GENESIS_INPUT_SYSTEM
using UnityEngine.InputSystem;
using UnityEngine.InputSystem.EnhancedTouch;
using Touch = UnityEngine.InputSystem.EnhancedTouch.Touch;
#endif

namespace Genesis.Theater
{
    /// <summary>
    /// Touch / mouse board picks via Input System (and legacy fallback).
    /// Taps are ignored when UiRegistry.IsPointerOverUi is true.
    /// Drag > 12px is a pan sent to TheaterCameraRig; not a tap.
    /// One-finger drag = pan; two-finger pinch = zoom (handled here and forwarded to rig).
    /// </summary>
    public class BoardPointerInput : MonoBehaviour
    {
        public Camera    rayCamera;
        public float     maxDistance  = 200f;
        public LayerMask hotspotMask  = ~0;

        // Drag threshold: >12px → pan, not a tap.
        const float DragThresholdPx   = 12f;
        const float PanSensitivity    = 0.012f; // world units per screen-pixel moved
        const float PinchSensitivity  = 0.008f; // zoom factor change per pixel gap change

        static readonly List<RaycastResult> UiHits = new(8);

        // State for drag / pan tracking
        bool    _pointerDown;
        Vector2 _pressPos;
        bool    _isDragging;
        Vector2 _lastPanPos;

#if GENESIS_INPUT_SYSTEM
        // Two-finger pinch state
        float   _lastPinchDist;
        bool    _pinching;
#endif

        TheaterCameraRig _rig;

        void OnEnable()
        {
#if GENESIS_INPUT_SYSTEM
            EnhancedTouchSupport.Enable();
#endif
            _rig = TheaterSession.Instance?.cameraRig
                   ?? Object.FindFirstObjectByType<TheaterCameraRig>();
        }

        void OnDisable()
        {
#if GENESIS_INPUT_SYSTEM
            // Don't disable shared support here — other systems may need it.
#endif
        }

        void Update()
        {
            if (rayCamera == null) rayCamera = Camera.main;
            if (rayCamera == null) return;

            // Cache camera rig lazily
            if (_rig == null)
                _rig = TheaterSession.Instance?.cameraRig
                       ?? Object.FindFirstObjectByType<TheaterCameraRig>();

#if GENESIS_INPUT_SYSTEM
            HandleEnhancedTouches();
#endif
            HandleMouseFallback();
        }

        // ── Enhanced Touch (Input System) ──────────────────────────────────────

#if GENESIS_INPUT_SYSTEM
        void HandleEnhancedTouches()
        {
            var touches = Touch.activeTouches;

            if (touches.Count == 2)
            {
                // Two-finger pinch zoom
                var t0 = touches[0].screenPosition;
                var t1 = touches[1].screenPosition;
                var dist = Vector2.Distance(t0, t1);

                if (!_pinching)
                {
                    _lastPinchDist = dist;
                    _pinching      = true;
                    _isDragging    = false; // cancel any ongoing pan
                }
                else if (_rig != null)
                {
                    var delta = dist - _lastPinchDist;
                    // Pinch in (shrinking gap) → zoom in (factor < 1)
                    var factor = 1f - delta * PinchSensitivity;
                    _rig.ZoomBy(factor);
                    _lastPinchDist = dist;
                }
                return;
            }

            _pinching = false;

            if (touches.Count == 1)
            {
                var t = touches[0];
                var sp = t.screenPosition;

                if (t.phase == UnityEngine.InputSystem.TouchPhase.Began)
                {
                    if (IsPointerOverBlockingUi(sp)) return;
                    _pointerDown = true;
                    _pressPos    = sp;
                    _lastPanPos  = sp;
                    _isDragging  = false;
                }
                else if (t.phase == UnityEngine.InputSystem.TouchPhase.Moved && _pointerDown)
                {
                    if (!_isDragging && Vector2.Distance(sp, _pressPos) > DragThresholdPx)
                        _isDragging = true;

                    if (_isDragging && _rig != null)
                    {
                        // In 2D mode, the map is requested to be "fixed". Disable panning to prevent the "floating" feel.
                        if (!_rig.is2DMode)
                        {
                            var delta = sp - _lastPanPos;
                            // Convert screen-pixel delta to world XZ pan (negate X for natural feel)
                            _rig.PanWorld(new Vector2(-delta.x * PanSensitivity, -delta.y * PanSensitivity));
                        }
                        _lastPanPos = sp;
                    }
                }
                else if ((t.phase == UnityEngine.InputSystem.TouchPhase.Ended ||
                          t.phase == UnityEngine.InputSystem.TouchPhase.Canceled) && _pointerDown)
                {
                    if (!_isDragging)
                        TryFireTap(_pressPos);
                    _pointerDown = false;
                    _isDragging  = false;
                }
            }
            else
            {
                _pointerDown = false;
                _isDragging  = false;
            }
        }
#endif

        // ── Mouse fallback (Editor / non-IS) ───────────────────────────────────

        void HandleMouseFallback()
        {
#if GENESIS_INPUT_SYSTEM
            var mouse = Mouse.current;
            if (mouse == null) return;

            var sp = mouse.position.ReadValue();
            if (mouse.leftButton.wasPressedThisFrame)
            {
                if (IsPointerOverBlockingUi(sp)) return;
                _pointerDown = true;
                _pressPos    = sp;
                _lastPanPos  = sp;
                _isDragging  = false;
            }
            else if (mouse.leftButton.isPressed && _pointerDown)
            {
                if (!_isDragging && Vector2.Distance(sp, _pressPos) > DragThresholdPx)
                    _isDragging = true;

                if (_isDragging && _rig != null)
                {
                    if (!_rig.is2DMode)
                    {
                        var delta = sp - _lastPanPos;
                        _rig.PanWorld(new Vector2(-delta.x * PanSensitivity, -delta.y * PanSensitivity));
                    }
                    _lastPanPos = sp;
                }
            }
            else if (mouse.leftButton.wasReleasedThisFrame && _pointerDown)
            {
                if (!_isDragging)
                    TryFireTap(_pressPos);
                _pointerDown = false;
                _isDragging  = false;
            }

            // Scroll wheel zoom
            var scroll = mouse.scroll.ReadValue();
            if (scroll.y != 0f && _rig != null)
            {
                var factor = 1f - scroll.y * 0.08f;
                _rig.ZoomBy(factor);
            }
#elif ENABLE_LEGACY_INPUT_MANAGER
            var sp = (Vector2)Input.mousePosition;
            if (Input.GetMouseButtonDown(0))
            {
                if (IsPointerOverBlockingUi(sp)) return;
                _pointerDown = true;
                _pressPos    = sp;
                _lastPanPos  = sp;
                _isDragging  = false;
            }
            else if (Input.GetMouseButton(0) && _pointerDown)
            {
                if (!_isDragging && Vector2.Distance(sp, _pressPos) > DragThresholdPx)
                    _isDragging = true;
                if (_isDragging && _rig != null)
                {
                    if (!_rig.is2DMode)
                    {
                        var delta = sp - _lastPanPos;
                        _rig.PanWorld(new Vector2(-delta.x * PanSensitivity, -delta.y * PanSensitivity));
                    }
                    _lastPanPos = sp;
                }
            }
            else if (Input.GetMouseButtonUp(0) && _pointerDown)
            {
                if (!_isDragging)
                    TryFireTap(_pressPos);
                _pointerDown = false;
                _isDragging  = false;
            }

            var scrollDelta = Input.mouseScrollDelta.y;
            if (scrollDelta != 0f && _rig != null)
            {
                _rig.ZoomBy(1f - scrollDelta * 0.08f);
            }
#endif
        }

        void TryFireTap(Vector2 screenPos)
        {
            // UiRegistry check: ignore if a real UI element is under the pointer.
            if (UiRegistry.IsPointerOverUi(screenPos)) return;
            if (IsPointerOverBlockingUi(screenPos)) return;

            var ray = rayCamera.ScreenPointToRay(screenPos);
            if (!Physics.Raycast(ray, out var hit, maxDistance, hotspotMask, QueryTriggerInteraction.Collide))
                return;

            var hotspot = hit.collider != null
                ? hit.collider.GetComponentInParent<HotspotMarker>()
                : null;
            if (hotspot != null)
                TheaterSession.Instance?.OnHotspotTapped(hotspot);
        }

        /// <summary>
        /// Raycast the uGUI EventSystem to block when opaque interactive panels are hit.
        /// </summary>
        static bool IsPointerOverBlockingUi(Vector2 screenPos)
        {
            if (EventSystem.current == null) return false;

            UiHits.Clear();
            var ped = new PointerEventData(EventSystem.current) { position = screenPos };
            EventSystem.current.RaycastAll(ped, UiHits);
            if (UiHits.Count == 0) return false;

            for (var i = 0; i < UiHits.Count; i++)
            {
                var go = UiHits[i].gameObject;
                if (go == null) continue;
                if (go.GetComponentInParent<UnityEngine.UI.Selectable>() != null)
                    return true;
                if (go.GetComponentInParent<CanvasGroup>() is { blocksRaycasts: true, interactable: true } group &&
                    group.alpha > 0.05f &&
                    go.GetComponentInParent<Genesis.UI.ResolveBeatController>() != null)
                    return true;
                if (go.GetComponentInParent<Genesis.UI.OrderRailController>() != null)
                    return true;
            }

            return false;
        }
    }
}

