using System;
using System.Collections.Generic;
using Genesis.Data;
using UnityEngine;
using UnityEngine.UIElements;

namespace Genesis.UI.Toolkit
{
    /// <summary>
    /// Order card for the bottom sheet.
    /// Displays: branch kind icon · place tag, TITLE (≥36px semibold),
    /// 1–2 line DESCRIPTION (≥28px), effect CHIPS (▲ gain / ▼ cost / ⚠ warn).
    /// Selected state adds amber border via .card--selected CSS class.
    /// Tap calls the provided onSelect callback.
    /// </summary>
    public sealed class OrderCardElement : VisualElement
    {
        public OrderChoice Order { get; }

        readonly Label         _titleLabel;
        readonly Label         _descLabel;
        readonly VisualElement _chipsRow;

        public OrderCardElement(OrderChoice order, Action<OrderChoice> onSelect)
        {
            Order = order ?? throw new ArgumentNullException(nameof(order));

            AddToClassList("card");
            AddToClassList("order-card");
            pickingMode = PickingMode.Position;

            // ── Header row ────────────────────────────────────────────────────
            var header = new VisualElement();
            header.AddToClassList("order-card__header");
            header.pickingMode = PickingMode.Ignore;

            string kindTitle = KindTitle(order.kind);
            var kindBadge = new Label { text = $"{KindIcon(order.kind)} {kindTitle}" };
            kindBadge.AddToClassList("order-card__kind");
            kindBadge.pickingMode = PickingMode.Ignore;
            header.Add(kindBadge);

            if (!string.IsNullOrEmpty(order.markerId))
            {
                var placeTag = new Label { text = order.markerId.Replace('_', ' ').ToUpperInvariant() };
                placeTag.AddToClassList("order-card__place");
                placeTag.pickingMode = PickingMode.Ignore;
                header.Add(placeTag);
            }
            Add(header);

            // ── Title ─────────────────────────────────────────────────────────
            string title = !string.IsNullOrEmpty(order.label)
                ? order.label
                : order.DisplayCallsign ?? "ORDER";
            _titleLabel = new Label { text = title };
            _titleLabel.AddToClassList("order-card__title");
            _titleLabel.pickingMode = PickingMode.Ignore;
            Add(_titleLabel);

            // ── Description (1–2 lines, never empty) ─────────────────────────
            string desc = BuildDescription(order);
            _descLabel = new Label { text = desc };
            _descLabel.AddToClassList("order-card__desc");
            _descLabel.pickingMode = PickingMode.Ignore;
            Add(_descLabel);

            // ── Effect chips ──────────────────────────────────────────────────
            _chipsRow = new VisualElement();
            _chipsRow.AddToClassList("order-card__chips");
            _chipsRow.pickingMode = PickingMode.Ignore;
            BuildChips(order.effects);
            Add(_chipsRow);

            // ── Tap to select ─────────────────────────────────────────────────
            RegisterCallback<PointerDownEvent>(evt =>
            {
                onSelect?.Invoke(order);
                evt.StopPropagation();
            });
        }

        public void SetSelected(bool selected)
        {
            EnableInClassList("card--selected", selected);
        }

        // ── Helpers ──────────────────────────────────────────────────────────

        static string BuildDescription(OrderChoice order)
        {
            // Prefer explicit detail field
            if (!string.IsNullOrWhiteSpace(order.detail)) return order.detail.Trim();

            // Fallback: build from effects summaries
            if (order.effects != null && order.effects.Count > 0)
            {
                var parts = new List<string>(order.effects.Count);
                foreach (var fx in order.effects)
                {
                    if (fx == null) continue;
                    if (!string.IsNullOrWhiteSpace(fx.summary)) parts.Add(fx.summary.Trim());
                    else if (!string.IsNullOrWhiteSpace(fx.tag)) parts.Add(fx.tag.Replace('_', ' '));
                }
                if (parts.Count > 0) return string.Join(" · ", parts);
            }

            // Last resort: label itself (never empty)
            return !string.IsNullOrEmpty(order.label) ? order.label : "Execute this order.";
        }

        void BuildChips(List<ChoiceEffect> effects)
        {
            if (effects == null || effects.Count == 0) return;
            foreach (var fx in effects)
            {
                if (fx == null) continue;
                string tagLower = (fx.tag ?? "").ToLowerInvariant().Replace('_', ' ');
                bool isEscalation = tagLower.Contains("escal") || tagLower.Contains("risk")
                                 || tagLower.Contains("tension") || tagLower.Contains("conflict");

                var chip = new Label();
                chip.pickingMode = PickingMode.Ignore;
                chip.AddToClassList("chip");

                string symbol;
                if (isEscalation)
                {
                    symbol = "⚠";
                    chip.AddToClassList("chip--warn");
                }
                else if (fx.weight > 0)
                {
                    symbol = "▲";
                    chip.AddToClassList("chip--gain");
                }
                else
                {
                    symbol = "▼";
                    chip.AddToClassList("chip--cost");
                }

                chip.text = $"{symbol} {tagLower}";
                _chipsRow.Add(chip);
            }
        }

        static string KindIcon(string kind) => (kind ?? "").ToLowerInvariant() switch
        {
            "military"   => "⚔",
            "diplomatic" => "🕊",
            "covert"     => "👁",
            "economic"   => "📊",
            "political"  => "🏛",
            _            => "◉"
        };

        static string KindTitle(string kind) => (kind ?? "").ToLowerInvariant() switch
        {
            "military"   => "MILITARY",
            "diplomatic" => "DIPLOMACY",
            "covert"     => "COVERT",
            "economic"   => "ECONOMIC",
            "political"  => "POLITICAL",
            _            => "DIRECTIVE"
        };
    }
}
