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
    [DefaultExecutionOrder(50)]
    public class OrderRailController : MonoBehaviour
    {
        UIDocument    _doc;
        VisualElement _root;
        VisualElement _sheet;
        Label         _placeNameLabel;
        VisualElement _cardRail;
        VisualElement _holdButtonContainer;
        VisualElement _gestureSpacer;

        float _panelHeight = OrderSheetLayout.RefPanelHeight;
        float _panelWidth  = OrderSheetLayout.RefPanelWidth;

        BottomSheet         _bottomSheet;
        HoldToConfirmButton _holdButton;
        List<OrderCardElement> _cards = new();
        string _selectedOrderId;
        bool   _layoutPending;

        public bool IsSheetExpanded =>
            _bottomSheet != null &&
            (_bottomSheet.State == BottomSheet.SnapState.Half ||
             _bottomSheet.State == BottomSheet.SnapState.Full);

        public void CollapseSheet() => _bottomSheet?.Collapse();
        public void ExpandSheet() => _bottomSheet?.Expand();

        void Awake()
        {
            _doc  = UiRegistry.CreateDocument("OrderSheet", transform, 20, "OrderSheet");
            _root = _doc.rootVisualElement;
            if (_root == null)
            {
                Debug.LogError("[Genesis] OrderRailController: OrderSheet rootVisualElement is null.");
                return;
            }

            BindElements();
            BuildHoldButton();
            BuildBottomSheet();
            RegisterLayoutCallbacks();
        }

        void BindElements()
        {
            _sheet               = _root.Q("sheet");
            _placeNameLabel      = _root.Q<Label>("placeNameLabel");
            _holdButtonContainer = _root.Q("holdButtonContainer");
            _gestureSpacer       = _root.Q("gestureSpacer");
            _cardRail            = _root.Q("cardRail");
        }

        void RegisterLayoutCallbacks()
        {
            var safeRoot = _root?.Q("safeRoot") ?? _root;
            safeRoot?.RegisterCallback<GeometryChangedEvent>(_ => RequestLayoutSync());
            _sheet?.RegisterCallback<GeometryChangedEvent>(_ => RequestLayoutSync());
        }

        void BuildHoldButton()
        {
            _holdButton = new HoldToConfirmButton();
            _holdButton.SetLabels("HOLD TO AUTHORISE", null);
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
            _holdButtonContainer?.Clear();
            _holdButtonContainer?.Add(_holdButton);
            SetHoldButtonArmed(false);
        }

        void BuildBottomSheet()
        {
            if (_sheet == null) return;
            var dragHandle = _root.Q("dragHandle");
            var safeRoot   = _root.Q("safeRoot") ?? _root;
            _bottomSheet = new BottomSheet(_sheet, dragHandle, safeRoot);
            _bottomSheet.StateChanged += _ => RequestLayoutSync();
        }

        public void ShowOrders(List<OrderChoice> orders, Action<OrderChoice> onSelect)
        {
            if (_cardRail == null) return;
            _cardRail.Clear();
            _cards.Clear();
            _selectedOrderId = null;
            if (orders == null || orders.Count == 0) return;

            foreach (var order in orders)
            {
                if (order == null) continue;
                var card = new OrderCardElement(order, choice =>
                {
                    MobilePlatform.HapticTick();
                    GenesisAudio.Ensure().PlaySelect();
                    onSelect?.Invoke(choice);
                    SetSelected(choice.id);
                });
                _cardRail.Add(card);
                _cards.Add(card);
            }

            UpdatePlaceName(orders);
            _bottomSheet?.Show();
            RequestLayoutSync();
            _root?.schedule.Execute(RequestLayoutSync).StartingIn(48);

            if (orders.Count > 0 && orders[0] != null)
            {
                onSelect?.Invoke(orders[0]);
                SetSelected(orders[0].id);
            }
            else
            {
                SetHoldButtonArmed(false);
                SetHoldButtonLocked(false);
                _holdButton?.SetLabels("SELECT AN ORDER", null);
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
            _cardRail?.Clear();
            _cards.Clear();
        }

        /// <summary>Primary hold line + optional subtitle (decision summary).</summary>
        public void SetHoldButtonLabel(string label) => SetHoldButtonLabels(label, null);

        public void SetHoldButtonLabels(string primary, string subtitle)
        {
            _holdButton?.SetLabels(
                string.IsNullOrEmpty(primary) ? "HOLD TO AUTHORISE" : primary,
                subtitle);
        }

        public void SetHoldButtonArmed(bool armed) => _holdButton?.SetArmed(armed);
        public void SetHoldButtonLocked(bool locked) => _holdButton?.SetLocked(locked);

        void UpdatePlaceName(List<OrderChoice> orders)
        {
            if (_placeNameLabel == null) return;
            string placeName = "SELECT ORDER";
            var bundle = TheaterSession.Instance?.Bundle;
            foreach (var order in orders)
            {
                if (string.IsNullOrEmpty(order?.markerId)) continue;
                var marker = bundle?.board?.markers?.Find(m => m != null && m.id == order.markerId);
                placeName = marker != null && !string.IsNullOrEmpty(marker.label)
                    ? marker.label.ToUpperInvariant()
                    : order.markerId.Replace('_', ' ').ToUpperInvariant();
                break;
            }
            _placeNameLabel.text = placeName;
        }

        void RequestLayoutSync()
        {
            if (_root == null || _layoutPending) return;
            _layoutPending = true;
            _root.schedule.Execute(() =>
            {
                _layoutPending = false;
                SyncResponsiveLayout();
            }).StartingIn(0);
        }

        static float SafeAreaBottomPx()
        {
            var sa = Screen.safeArea;
            if (Screen.height <= 0) return 0f;
            return Mathf.Max(0f, Screen.height - sa.yMax);
        }

        void SyncResponsiveLayout()
        {
            if (_sheet == null || _root == null) return;

            var safeRoot = _root.Q("safeRoot") ?? _root;
            if (safeRoot.resolvedStyle.height > 1f) _panelHeight = safeRoot.resolvedStyle.height;
            if (safeRoot.resolvedStyle.width > 1f) _panelWidth = safeRoot.resolvedStyle.width;

            float sheetH = _sheet.resolvedStyle.height;
            if (sheetH < 80f) sheetH = OrderSheetLayout.PeekSheetHeight(_panelHeight);

            float safeBottom = SafeAreaBottomPx();
            int cardCount = Mathf.Max(1, _cards.Count);
            var m = OrderSheetLayout.Compute(sheetH, _panelWidth, _panelHeight, safeBottom, cardCount);

            if (_gestureSpacer != null)
            {
                _gestureSpacer.style.height = m.GestureSpacerHeight;
                _gestureSpacer.style.minHeight = m.GestureSpacerHeight;
            }

            if (_cardRail != null)
            {
                _cardRail.style.flexGrow = 0;
                _cardRail.style.flexShrink = 0;
                _cardRail.style.marginTop = m.ScrollGapTop;
                _cardRail.style.height = m.ScrollBandHeight;
                _cardRail.style.minHeight = m.ScrollBandHeight;
                _cardRail.style.maxHeight = m.ScrollBandHeight;
            }

            if (_holdButtonContainer != null)
            {
                _holdButtonContainer.style.height = m.HoldHeight;
                _holdButtonContainer.style.minHeight = m.HoldHeight;
                _holdButtonContainer.style.maxHeight = m.HoldHeight;
            }

            if (_holdButton != null)
            {
                _holdButton.style.height = m.HoldHeight;
                _holdButton.style.minHeight = m.HoldHeight;
            }

            // Cards match the rail exactly — one horizontal glance, no nested scroll.
            float cardH = m.CardHeight;
            for (int i = 0; i < _cards.Count; i++)
            {
                float gap = i < _cards.Count - 1 ? m.CardGap : 0f;
                _cards[i].ApplyBandLayout(cardH, m.CardWidth, gap, m.CompactCards);
            }
        }
    }
}
