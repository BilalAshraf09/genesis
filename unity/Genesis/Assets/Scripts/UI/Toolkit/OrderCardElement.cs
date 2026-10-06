using System;
using System.Collections.Generic;
using Genesis.Data;
using UnityEngine;
using UnityEngine.UIElements;

namespace Genesis.UI.Toolkit
{
    /// <summary>
    /// Order card — full decision label as title, readable chips, no zone overlap.
    /// </summary>
    public sealed class OrderCardElement : VisualElement
    {
        public OrderChoice Order { get; }

        readonly Label _titleLabel;
        readonly Label _descLabel;
        readonly VisualElement _chipsRow;

        public OrderCardElement(OrderChoice order, Action<OrderChoice> onSelect)
        {
            Order = order ?? throw new ArgumentNullException(nameof(order));

            AddToClassList("order-card");
            pickingMode = PickingMode.Position;

            var header = new VisualElement();
            header.AddToClassList("order-card__header");
            header.pickingMode = PickingMode.Ignore;

            var kindBadge = new Label { text = $"{KindIcon(order.kind)} {KindTitle(order.kind)}" };
            kindBadge.AddToClassList("order-card__kind");
            kindBadge.pickingMode = PickingMode.Ignore;
            header.Add(kindBadge);

            string place = PlaceLabel(order);
            if (!string.IsNullOrEmpty(place))
            {
                var placeTag = new Label { text = place };
                placeTag.AddToClassList("order-card__place");
                placeTag.pickingMode = PickingMode.Ignore;
                header.Add(placeTag);
            }
            Add(header);

            // Full decision text — never the 4-letter short code alone.
            _titleLabel = new Label { text = PreferredTitle(order) };
            _titleLabel.AddToClassList("order-card__title");
            _titleLabel.pickingMode = PickingMode.Ignore;
            Add(_titleLabel);

            _descLabel = new Label { text = PreferredDetail(order) };
            _descLabel.AddToClassList("order-card__desc");
            _descLabel.pickingMode = PickingMode.Ignore;
            Add(_descLabel);

            _chipsRow = new VisualElement();
            _chipsRow.AddToClassList("order-card__chips");
            _chipsRow.pickingMode = PickingMode.Ignore;
            BuildChips(order.effects, maxChips: 2);
            Add(_chipsRow);

            RegisterCallback<PointerDownEvent>(evt =>
            {
                onSelect?.Invoke(order);
                evt.StopPropagation();
            });
        }

        public void SetSelected(bool selected) =>
            EnableInClassList("order-card--selected", selected);

        public void ApplyBandLayout(float cardHeightPx, float cardWidthPx, float gapRightPx = 0f, bool compact = false)
        {
            float h = Mathf.Max(160f, cardHeightPx);
            float w = Mathf.Max(OrderSheetLayout.CardWidthFloor, cardWidthPx);
            style.height = h;
            style.width = w;
            style.minHeight = h;
            style.maxHeight = h;
            style.minWidth = w;
            style.maxWidth = w;
            style.marginRight = gapRightPx;
            EnableInClassList("order-card--compact", compact);
        }

        static string PreferredTitle(OrderChoice order)
        {
            // Use the human decision sentence — short codes (LIMIT/HOLD) are for HUD only.
            if (!string.IsNullOrWhiteSpace(order.label))
                return SoftClamp(order.label.Trim(), 90);
            if (!string.IsNullOrWhiteSpace(order.ShortLabel) && order.ShortLabel.Trim().Length >= 6)
                return order.ShortLabel.Trim();
            return order.DisplayCallsign ?? "ORDER";
        }

        static string PreferredDetail(OrderChoice order)
        {
            if (!string.IsNullOrWhiteSpace(order.detail))
                return SoftClamp(order.detail.Trim(), 96);
            return "Select this order to arm execute.";
        }

        static string PlaceLabel(OrderChoice order)
        {
            if (string.IsNullOrEmpty(order.markerId)) return "";
            return SoftClamp(order.markerId.Replace('_', ' ').ToUpperInvariant(), 16);
        }

        void BuildChips(List<ChoiceEffect> effects, int maxChips)
        {
            if (effects == null || effects.Count == 0) return;
            int added = 0;
            foreach (var fx in effects)
            {
                if (fx == null) continue;
                if (added >= maxChips) break;

                string tag = (fx.tag ?? "").ToLowerInvariant().Replace('_', ' ').Trim();
                if (string.IsNullOrEmpty(tag)) continue;
                // Short tags read better in equal-width (3-up) columns.
                tag = SoftClamp(tag, 12);

                bool warn = tag.Contains("escal") || tag.Contains("risk")
                         || tag.Contains("tension") || tag.Contains("conflict");

                var chip = new Label();
                chip.pickingMode = PickingMode.Ignore;
                chip.AddToClassList("chip");
                if (warn) chip.AddToClassList("chip--warn");
                else if (fx.weight > 0) chip.AddToClassList("chip--gain");
                else chip.AddToClassList("chip--cost");

                chip.text = $"{(warn ? "⚠" : fx.weight > 0 ? "▲" : "▼")} {tag}";
                _chipsRow.Add(chip);
                added++;
            }
        }

        static string SoftClamp(string value, int maxChars)
        {
            if (string.IsNullOrEmpty(value) || value.Length <= maxChars) return value ?? "";
            return value.Substring(0, maxChars - 1).TrimEnd() + "…";
        }

        static string KindIcon(string kind) => (kind ?? "").ToLowerInvariant() switch
        {
            "military" => "⚔", "diplomatic" => "🕊", "covert" => "👁",
            "economic" => "📊", "political" => "🏛", _ => "◉"
        };

        static string KindTitle(string kind) => (kind ?? "").ToLowerInvariant() switch
        {
            "military" => "MILITARY", "diplomatic" => "DIPLOMACY", "covert" => "COVERT",
            "economic" => "ECONOMIC", "political" => "POLITICAL", _ => "DIRECTIVE"
        };
    }
}
