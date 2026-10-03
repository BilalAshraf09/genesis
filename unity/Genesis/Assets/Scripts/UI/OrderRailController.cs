using System;
using System.Collections.Generic;
using Genesis.Data;
using Genesis.Theater;
using Genesis.UI.Toolkit;
using UnityEngine;
using UnityEngine.UIElements;

namespace Genesis.UI
{
    /// <summary>
    /// Order Rail Controller — UI Toolkit rebuild.
    /// Drives OrderSheet.uxml: glass bottom sheet with drag handle, horizontal
    /// order-card scroll, and the full-width HoldToConfirmButton.
    /// All public signatures are IDENTICAL to the legacy version (TheaterSession contract).
    ///
    /// Hold-button coordination (called from OpsHudController):
    ///   SetHoldButtonLabel(string)  — update label text
    ///   SetHoldButtonArmed(bool)    — enable / disable the hold gesture
    ///   SetHoldButtonLocked(bool)   — locked = no interaction at all
    ///
    /// Back-navigation helpers (called from OpsHudController):
    ///   IsSheetExpanded  — true when sheet is at Half or Full snap state
    ///   CollapseSheet()  — snap back to Peek
    /// </summary>
    [DefaultExecutionOrder(50)]
    public class OrderRailController : MonoBehaviour
    {
        // ── UIDocument ────────────────────────────────────────────────────────
        UIDocument    _doc;
        VisualElement _root;

        // ── Sheet elements ────────────────────────────────────────────────────
        VisualElement _sheet;
        Label         _placeNameLabel;
        Label         _beatTitleLabel;
        VisualElement _cardScrollContent;
        VisualElement _holdButtonContainer;

        // ── Sub-systems ───────────────────────────────────────────────────────
        BottomSheet           _bottomSheet;
        HoldToConfirmButton   _holdButton;
        List<OrderCardElement> _cards = new();

        // ── State ─────────────────────────────────────────────────────────────
        string _selectedOrderId;

        // ── Back-navigation helpers (for OpsHudController) ────────────────────
        public bool IsSheetExpanded =>
            _bottomSheet != null &&
            (_bottomSheet.State == BottomSheet.SnapState.Half ||
             _bottomSheet.State == BottomSheet.SnapState.Full);

        public void CollapseSheet() => _bottomSheet?.Collapse();

        // ── Lifecycle ─────────────────────────────────────────────────────────
        void Awake()
        {
            _doc  = UiRegistry.CreateDocument("OrderSheet", transform, 20, "OrderSheet");
            _root = _doc.rootVisualElement;

            if (_root == null)
            {
                Debug.LogError("[Genesis] OrderRailController: OrderSheet rootVisualElement is null. " +
                               "Is OrderSheet.uxml in GenesisUiRegistry?");
                return;
            }

            BindElements();
            BuildHoldButton();
            BuildBottomSheet();
        }

        // ── Element binding ───────────────────────────────────────────────────
        void BindElements()
        {
            _sheet              = _root.Q("sheet");
            _placeNameLabel     = _root.Q<Label>("placeNameLabel");
            _beatTitleLabel     = _root.Q<Label>("beatTitleLabel");
            _holdButtonContainer = _root.Q("holdButtonContainer");

            var scrollView = _root.Q<ScrollView>("cardScrollView");
            _cardScrollContent = scrollView?.contentContainer;
        }

        void BuildHoldButton()
        {
            _holdButton           = new HoldToConfirmButton();
            _holdButton.labelText = "EXECUTE ORDER";
            _holdButton.style.flexGrow = 1f;

            _holdButton.Confirmed += () =>
            {
                if (string.IsNullOrEmpty(_selectedOrderId) && _cards.Count > 0)
                {
                    var first = _cards[0].Order;
                    if (first != null)
                    {
                        TheaterSession.Instance?.OnOrderSelected(first);
                        SetSelected(first.id);
                    }
                }
                TheaterSession.Instance?.OnExecutePressed();
            };
            _holdButtonContainer?.Add(_holdButton);

            SetHoldButtonArmed(false);
        }

        void BuildBottomSheet()
        {
            if (_sheet == null) return;
            var dragHandle = _root.Q("dragHandle");
            var safeRoot   = _root.Q("safeRoot") ?? _root;
            _bottomSheet   = new BottomSheet(_sheet, dragHandle, safeRoot);
        }

        // ── Public contract (TheaterSession calls these) ───────────────────────

        public void ShowOrders(List<OrderChoice> orders, Action<OrderChoice> onSelect)
        {
            if (_cardScrollContent == null) return;

            // Clear previous cards.
            _cardScrollContent.Clear();
            _cards.Clear();
            _selectedOrderId = null;

            if (orders == null || orders.Count == 0) return;

            foreach (var order in orders)
            {
                if (order == null) continue;
                var card = new OrderCardElement(order, choice =>
                {
                    onSelect?.Invoke(choice);
                    SetSelected(choice.id);
                });
                _cardScrollContent.Add(card);
                _cards.Add(card);
            }

            // Update place name header from the first order's marker.
            UpdatePlaceName(orders);

            _bottomSheet?.Show();

            // Pre-select the first order by default so the user never gets stuck waiting for timeout
            if (orders.Count > 0 && orders[0] != null)
            {
                var first = orders[0];
                onSelect?.Invoke(first);
                SetSelected(first.id);
            }
            else
            {
                SetHoldButtonArmed(false);
                SetHoldButtonLocked(false);
                if (_holdButton != null) _holdButton.labelText = "SELECT AN ORDER";
            }
        }

        public void SetSelected(string orderId)
        {
            _selectedOrderId = orderId;
            foreach (var card in _cards)
                card.SetSelected(card.Order?.id == orderId);
        }

        public void Lock()
        {
            SetHoldButtonLocked(true);
            foreach (var card in _cards)
                card.pickingMode = PickingMode.Ignore;
        }

        public void Hide()
        {
            _bottomSheet?.Hide();
            _cardScrollContent?.Clear();
            _cards.Clear();
        }

        // ── Hold-button coordination (called from OpsHudController) ────────────

        public void SetHoldButtonLabel(string label)
        {
            if (_holdButton == null) return;
            _holdButton.labelText = string.IsNullOrEmpty(label) ? "HOLD TO AUTHORISE" : label;
        }

        public void SetHoldButtonArmed(bool armed)
        {
            _holdButton?.SetArmed(armed);
        }

        public void SetHoldButtonLocked(bool locked)
        {
            _holdButton?.SetLocked(locked);
        }

        // ── Private helpers ───────────────────────────────────────────────────

        void UpdatePlaceName(List<OrderChoice> orders)
        {
            if (_placeNameLabel == null) return;

            string placeName = "SELECT ORDER";
            var bundle = TheaterSession.Instance?.Bundle;

            foreach (var order in orders)
            {
                if (string.IsNullOrEmpty(order?.markerId)) continue;

                // Try to get the human-readable label from the board's marker list.
                var marker = bundle?.board?.markers?.Find(m => m != null && m.id == order.markerId);
                if (marker != null && !string.IsNullOrEmpty(marker.label))
                {
                    placeName = marker.label.ToUpperInvariant();
                }
                else
                {
                    placeName = order.markerId.Replace('_', ' ').ToUpperInvariant();
                }
                break;
            }

            _placeNameLabel.text = placeName;
        }
    }
}
