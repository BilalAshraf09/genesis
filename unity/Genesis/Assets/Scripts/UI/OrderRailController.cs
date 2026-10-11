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
        VisualElement _cardContent;
        VisualElement _scrollHint;
        string _selectedOrderId;
        bool   _layoutPending;
        bool   _layoutCallbacksRegistered;
        bool   _scrollWired;
        float  _scrollOffset;

        public bool IsSheetExpanded =>
            _bottomSheet != null &&
            (_bottomSheet.State == BottomSheet.SnapState.Half ||
             _bottomSheet.State == BottomSheet.SnapState.Full);

        public bool IsSheetVisible =>
            _bottomSheet != null && _bottomSheet.IsVisible;

        public void CollapseSheet() => _bottomSheet?.Collapse();
        public void ExpandSheet() => _bottomSheet?.Expand();

        VisualElement _urgencyLine;
        IVisualElementScheduledItem _urgencyPulse;

        public void SetUrgency(int level)
        {
            if (_sheet == null) return;
            _sheet.EnableInClassList("sheet--warn", level == 1);
            _sheet.EnableInClassList("sheet--urgent", level >= 2);

            if (_urgencyLine == null) _urgencyLine = _sheet.Q("sheet-urgency-line") ?? _sheet.Q(className: "sheet-urgency-line");
            if (_urgencyLine == null) return;

            _urgencyPulse?.Pause();
            if (level > 0)
            {
                float period = level >= 2 ? 0.8f : 2.0f;
                _urgencyPulse = _urgencyLine.schedule.Execute(() =>
                {
                    float t = Time.unscaledTime * 2f * Mathf.PI / period;
                    _urgencyLine.style.opacity = 0.4f + 0.6f * (Mathf.Sin(t) * 0.5f + 0.5f);
                }).Every(33);
            }
            else
            {
                _urgencyLine.style.opacity = 0f;
            }
        }

        void Awake()
        {
            EnsureDocument();
            if (_root == null)
            {
                Debug.LogError("[Genesis] OrderRailController: OrderSheet rootVisualElement is null.");
                return;
            }

            // UXML clone can lag one frame after domain reload / play enter.
            if (!TryBuildUi())
                _root.schedule.Execute(() => TryBuildUi()).StartingIn(0);
        }

        void OnEnable()
        {
            // Soft domain reload nulls private fields while orphan UIDocuments remain.
            TryBuildUi();
        }

        void EnsureDocument()
        {
            if (_doc == null)
            {
                // Prefer an existing OrderSheet document created before a script reload.
                var existing = GameObject.Find("OrderSheet");
                if (existing != null)
                    _doc = existing.GetComponent<UIDocument>();
            }

            if (_doc == null)
                _doc = UiRegistry.CreateDocument("OrderSheet", transform, 20, "OrderSheet");

            _root = _doc != null ? _doc.rootVisualElement : null;
        }

        bool TryBuildUi()
        {
            EnsureDocument();
            if (_root == null) return false;

            // Soft domain reload can leave managed refs to detached VisualElements.
            if (_holdButton != null && (_holdButton.panel == null || _holdButton.parent == null))
            {
                _holdButton = null;
                _bottomSheet = null;
                _layoutCallbacksRegistered = false;
                _cards.Clear();
            }

            if (_bottomSheet != null && _holdButton != null
                && _holdButton.panel != null && _cardRail != null && _cardRail.panel != null)
                return true;

            BindElements();
            if (_sheet == null || _holdButtonContainer == null || _cardRail == null)
                return false;

            if (_holdButton == null) BuildHoldButton();
            if (_bottomSheet == null) BuildBottomSheet();
            RegisterLayoutCallbacks();
            // Clear any stale centered max-width left on surviving VisualElements
            // after domain reload / prior layout bugs.
            if (_sheet != null)
            {
                _sheet.style.maxWidth = StyleKeyword.None;
                _sheet.style.alignSelf = Align.Stretch;
                _sheet.style.width = Length.Percent(100);
            }
            return true;
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
            if (_layoutCallbacksRegistered) return;
            var safeRoot = _root?.Q("safeRoot") ?? _root;
            safeRoot?.RegisterCallback<GeometryChangedEvent>(_ => RequestLayoutSync());
            _sheet?.RegisterCallback<GeometryChangedEvent>(_ => RequestLayoutSync());
            _layoutCallbacksRegistered = true;
        }

        void BuildHoldButton()
        {
            _holdButton = new HoldToConfirmButton();
            _holdButton.SetLabels("HOLD TO COMMIT", null);
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
            TryBuildUi();
            if (_cardRail == null) return;
            _cardRail.Clear();
            _cards.Clear();
            _scrollHint = null;
            _scrollOffset = 0f;
            _selectedOrderId = null;
            if (orders == null || orders.Count == 0) return;

            _cardContent = new VisualElement();
            _cardContent.AddToClassList("card-rail__content");
            _cardContent.pickingMode = PickingMode.Ignore;
            _cardContent.style.flexDirection = FlexDirection.Row;
            _cardContent.style.alignItems = Align.Stretch;
            _cardContent.style.flexGrow = 0;
            _cardContent.style.flexShrink = 0;
            _cardRail.Add(_cardContent);

            _scrollHint = new VisualElement();
            _scrollHint.AddToClassList("card-rail__scroll-hint");
            _scrollHint.pickingMode = PickingMode.Ignore;
            _cardRail.Add(_scrollHint);

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
                _cardContent.Add(card);
                _cards.Add(card);
            }

            UpdatePlaceName(orders);
            _bottomSheet?.Show();
            SyncResponsiveLayout();
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
                _holdButton?.SetLabels("CHOOSE AN ORDER", null);
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
                string.IsNullOrEmpty(primary) ? "HOLD TO COMMIT" : primary,
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

        void SyncResponsiveLayout()
        {
            if (_sheet == null || _root == null) return;

            var safeRoot = _root.Q("safeRoot") ?? _root;
            if (safeRoot.resolvedStyle.height > 1f) _panelHeight = safeRoot.resolvedStyle.height;
            if (safeRoot.resolvedStyle.width > 1f) _panelWidth = safeRoot.resolvedStyle.width;

            // Always size cards from the full safe-root width. Never trust a stale
            // sheet.resolvedStyle.width that may still carry a prior max-width cap.
            float contentW = _panelWidth;

            float peekH = OrderSheetLayout.PeekSheetHeight(_panelHeight);
            float sheetH = _sheet.resolvedStyle.height;
            if (sheetH < 80f) sheetH = peekH;

            // Peek is the production snap — keep style.height locked to content-driven
            // peek so transition/overshoot cannot leave a navy band under HOLD.
            if (_bottomSheet == null || _bottomSheet.State == BottomSheet.SnapState.Peek)
            {
                sheetH = peekH;
                _sheet.style.transitionDuration = new System.Collections.Generic.List<TimeValue>
                {
                    new TimeValue(0)
                };
                _sheet.style.height = peekH;
            }

            float safeBottom = OrderSheetLayout.SafeAreaBottomPanel(_root.panel);
            int cardCount = Mathf.Max(1, _cards.Count);

            var headerEl = _root.Q("sheetHeader");
            float measuredHeader = headerEl != null && headerEl.resolvedStyle.height > 1f
                ? headerEl.resolvedStyle.height
                : -1f;

            var m = OrderSheetLayout.Compute(
                sheetH, contentW, _panelHeight, safeBottom, cardCount, measuredHeader);

            // CRITICAL: the decision panel must fill the available safe content width.
            // A centered max-width column (previously keyed off raw Screen.width pixels
            // and/or a 430 panel-unit cap) is what made the sheet narrower than the HUD
            // on retina phones. Gutters come from USS padding only.
            _sheet.style.maxWidth = StyleKeyword.None;
            _sheet.style.alignSelf = Align.Stretch;
            _sheet.style.width = Length.Percent(100);
            _sheet.style.minWidth = StyleKeyword.Null;
            _sheet.style.flexGrow = 0;
            _sheet.style.flexShrink = 0;

            // Hold CTA first — never clipped by an oversized card rail.
            if (_holdButtonContainer != null)
            {
                _holdButtonContainer.style.height = m.HoldHeight;
                _holdButtonContainer.style.minHeight = m.HoldHeight;
                _holdButtonContainer.style.maxHeight = m.HoldHeight;
                _holdButtonContainer.style.flexShrink = 0;
                _holdButtonContainer.style.width = StyleKeyword.Null;
                _holdButtonContainer.style.alignSelf = Align.Stretch;
            }

            if (_holdButton != null)
            {
                _holdButton.style.height = m.HoldHeight;
                _holdButton.style.minHeight = m.HoldHeight;
                _holdButton.style.width = Length.Percent(100);
            }

            if (_gestureSpacer != null)
            {
                _gestureSpacer.style.height = m.GestureSpacerHeight;
                _gestureSpacer.style.minHeight = m.GestureSpacerHeight;
                _gestureSpacer.style.flexShrink = 0;
            }

            bool scroll = m.Mode == OrderSheetLayout.RailMode.ScrollRow;
            bool stack = m.Mode == OrderSheetLayout.RailMode.Stack;
            bool equal = m.Mode == OrderSheetLayout.RailMode.EqualRow;

            if (_cardRail != null)
            {
                _cardRail.EnableInClassList("card-rail--scroll", scroll);
                _cardRail.EnableInClassList("card-rail--stack", stack);

                _cardRail.style.flexDirection = stack ? FlexDirection.Column : FlexDirection.Row;
                _cardRail.style.flexGrow = 0;
                _cardRail.style.flexShrink = 1;
                _cardRail.style.marginTop = m.ScrollGapTop;
                _cardRail.style.height = m.ScrollBandHeight;
                _cardRail.style.minHeight = m.ScrollBandHeight;
                _cardRail.style.maxHeight = m.ScrollBandHeight;
                _cardRail.style.width = Length.Percent(100);
                _cardRail.style.alignSelf = Align.Stretch;
                _cardRail.style.overflow = scroll ? Overflow.Hidden : Overflow.Hidden;
            }

            if (_cardContent != null)
            {
                _cardContent.style.flexDirection = stack ? FlexDirection.Column : FlexDirection.Row;
                _cardContent.style.height = m.ScrollBandHeight;
                if (equal || stack)
                {
                    _cardContent.style.width = Length.Percent(100);
                    _cardContent.style.flexGrow = 1;
                    _cardContent.style.flexShrink = 1;
                    _scrollOffset = 0f;
                    _cardContent.style.translate = StyleKeyword.Null;
                }
                else
                {
                    // Scroll row: content sizes to cards, may exceed rail width.
                    _cardContent.style.width = StyleKeyword.Null;
                    _cardContent.style.flexGrow = 0;
                    _cardContent.style.flexShrink = 0;
                }
            }

            float cardH = m.CardHeight;
            for (int i = 0; i < _cards.Count; i++)
            {
                float gap = i < _cards.Count - 1 ? m.CardGap : 0f;

                if (equal)
                {
                    _cards[i].ApplyEqualFlexLayout(cardH, gap, m.CompactCards);
                }
                else if (stack)
                {
                    _cards[i].ApplyBandLayout(cardH, m.InnerWidth, 0f, m.CompactCards);
                    _cards[i].style.marginRight = 0;
                    _cards[i].style.marginBottom = gap;
                    _cards[i].style.width = Length.Percent(100);
                    _cards[i].style.maxWidth = Length.Percent(100);
                    _cards[i].style.flexGrow = 0;
                }
                else
                {
                    _cards[i].ApplyBandLayout(cardH, m.CardWidth, gap, m.CompactCards);
                }
            }

            if (_scrollHint != null)
            {
                bool showHint = scroll && _cards.Count > 1;
                _scrollHint.style.display = showHint ? DisplayStyle.Flex : DisplayStyle.None;
                if (showHint) _scrollHint.BringToFront();
            }

            if (_cardRail != null && scroll)
                EnsureScrollRailInteractions();
        }

        void EnsureScrollRailInteractions()
        {
            if (_scrollWired || _cardRail == null || _cardContent == null) return;
            _scrollWired = true;

            float dragStartX = 0f;
            float startOffset = 0f;
            bool tracking = false;
            bool dragging = false;
            const float DragThreshold = 10f;

            _cardRail.RegisterCallback<PointerDownEvent>(evt =>
            {
                tracking = true;
                dragging = false;
                dragStartX = evt.position.x;
                startOffset = _scrollOffset;
            });

            _cardRail.RegisterCallback<PointerMoveEvent>(evt =>
            {
                if (!tracking || _cardContent == null) return;
                float dx = evt.position.x - dragStartX;
                if (!dragging)
                {
                    if (Mathf.Abs(dx) < DragThreshold) return;
                    dragging = true;
                    _cardRail.CapturePointer(evt.pointerId);
                }

                float contentW = 0f;
                foreach (var c in _cards)
                    contentW += c.resolvedStyle.width + c.resolvedStyle.marginRight;
                float viewW = _cardRail.resolvedStyle.width;
                float minOffset = Mathf.Min(0f, viewW - contentW - 4f);
                _scrollOffset = Mathf.Clamp(startOffset + dx, minOffset, 0f);
                _cardContent.style.translate = new Translate(_scrollOffset, 0);
            });

            void EndDrag(IPointerEvent evt)
            {
                if (!tracking) return;
                tracking = false;
                if (dragging && _cardRail.HasPointerCapture(evt.pointerId))
                    _cardRail.ReleasePointer(evt.pointerId);
                dragging = false;
            }

            _cardRail.RegisterCallback<PointerUpEvent>(evt => EndDrag(evt));
            _cardRail.RegisterCallback<PointerCancelEvent>(evt => EndDrag(evt));
        }
    }
}
