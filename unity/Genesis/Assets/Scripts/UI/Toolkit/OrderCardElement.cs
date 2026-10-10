using System;
using System.Collections.Generic;
using Genesis.Data;
using UnityEngine;
using UnityEngine.UIElements;

namespace Genesis.UI.Toolkit
{
    /// <summary>
    /// Crisis order card — kind, decision, stakes. Built for glanceable comparison.
    /// </summary>
    public sealed class OrderCardElement : VisualElement
    {
        public OrderChoice Order { get; }

        readonly Label _titleLabel;
        readonly Label _descLabel;
        readonly VisualElement _deltasRow;

        public OrderCardElement(OrderChoice order, Action<OrderChoice> onSelect)
        {
            Order = order ?? throw new ArgumentNullException(nameof(order));

            AddToClassList("order-card");
            AddToClassList(KindClass(order.kind));
            pickingMode = PickingMode.Position;

            // Accent rail kept for USS kind hooks; hidden by default stylesheet.
            var accentRail = new VisualElement();
            accentRail.AddToClassList("order-card__rail");
            accentRail.pickingMode = PickingMode.Ignore;
            Add(accentRail);

            var body = new VisualElement();
            body.AddToClassList("order-card__body");
            body.pickingMode = PickingMode.Ignore;

            var header = new VisualElement();
            header.AddToClassList("order-card__header");
            header.pickingMode = PickingMode.Ignore;

            var kindBadge = new Label { text = KindTitle(order.kind) };
            kindBadge.AddToClassList("order-card__kind");
            kindBadge.pickingMode = PickingMode.Ignore;
            header.Add(kindBadge);
            body.Add(header);

            _titleLabel = new Label { text = PreferredTitle(order) };
            _titleLabel.AddToClassList("order-card__title");
            _titleLabel.pickingMode = PickingMode.Ignore;
            body.Add(_titleLabel);

            _descLabel = new Label { text = PreferredDetail(order) };
            _descLabel.AddToClassList("order-card__desc");
            _descLabel.pickingMode = PickingMode.Ignore;
            body.Add(_descLabel);

            _deltasRow = new VisualElement();
            _deltasRow.AddToClassList("order-card__deltas");
            _deltasRow.pickingMode = PickingMode.Ignore;
            BuildDeltas(order.effects);
            body.Add(_deltasRow);

            Add(body);

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
            if (!string.IsNullOrWhiteSpace(order.label))
                return SoftClamp(order.label.Trim(), 64);
            if (!string.IsNullOrWhiteSpace(order.ShortLabel) && order.ShortLabel.Trim().Length >= 6)
                return SoftClamp(order.ShortLabel.Trim(), 64);
            return order.DisplayCallsign ?? "ORDER";
        }

        static string PreferredDetail(OrderChoice order)
        {
            if (!string.IsNullOrWhiteSpace(order.detail))
                return SoftClamp(order.detail.Trim(), 56);
            return "Arms this order for commit.";
        }

        void BuildDeltas(List<ChoiceEffect> effects)
        {
            _deltasRow.Clear();
            var projected = ProjectMeters(effects);

            // Rank by absolute impact so the two most consequential meters win the strip.
            projected.Sort((a, b) => Mathf.Abs(b.points).CompareTo(Mathf.Abs(a.points)));

            int shown = 0;
            foreach (var d in projected)
            {
                if (d.points == 0) continue;
                if (shown >= 2) break;

                string sign = d.points > 0 ? $"+{d.points}" : $"{d.points}";
                var label = new Label { text = $"{d.abbrev} {sign}" };
                label.pickingMode = PickingMode.Ignore;
                label.AddToClassList("delta");
                if (d.warn) label.AddToClassList("delta--warn");
                else if (d.points > 0) label.AddToClassList("delta--gain");
                else label.AddToClassList("delta--cost");
                _deltasRow.Add(label);
                shown++;
            }

            _deltasRow.EnableInClassList("hidden", shown == 0);
        }

        /// <summary>
        /// Maps effects onto HUD meters for at-a-glance comparison.
        /// </summary>
        static List<(string abbrev, int points, bool warn)> ProjectMeters(List<ChoiceEffect> effects)
        {
            int stab = 0, cred = 0, toll = 0, esc = 0;
            if (effects != null)
            {
                foreach (var fx in effects)
                {
                    if (fx == null) continue;
                    string tag = (fx.tag ?? "").ToLowerInvariant();
                    int w = fx.weight;

                    if (tag.Contains("credib") || tag.Contains("diplomat") || tag.Contains("trust")
                        || tag.Contains("alliance") || tag.Contains("mediat"))
                    {
                        cred += w;
                        stab += RoundSide(w * 0.4f);
                    }
                    else if (tag.Contains("civilian") || tag.Contains("toll") || tag.Contains("refugee"))
                    {
                        toll += Mathf.Abs(w);
                        stab -= RoundSide(Mathf.Abs(w) * 0.3f);
                    }
                    else if (tag.Contains("escal") || tag.Contains("tension") || tag.Contains("conflict")
                             || tag.Contains("deter"))
                    {
                        esc += Mathf.Abs(w);
                        stab -= RoundSide(Mathf.Abs(w) * 0.4f);
                    }
                    else if (tag.Contains("stab") || tag.Contains("peace") || tag.Contains("order")
                             || tag.Contains("stabil"))
                    {
                        stab += w;
                        esc -= RoundSide(w * 0.3f);
                    }
                    else if (tag.Contains("time") || tag.Contains("delay"))
                    {
                        stab -= 1;
                        cred += 1;
                    }
                    else
                    {
                        stab += RoundSide(w * 0.5f);
                    }
                }
            }

            return new List<(string, int, bool)>
            {
                ("STAB", stab, false),
                ("CRED", cred, false),
                ("ESC", esc, esc != 0),
                ("TOLL", toll, toll != 0),
            };
        }

        static int RoundSide(float value)
        {
            if (value > 0f) return Mathf.Max(1, Mathf.RoundToInt(value));
            if (value < 0f) return Mathf.Min(-1, Mathf.RoundToInt(value));
            return 0;
        }

        static string SoftClamp(string value, int maxChars)
        {
            if (string.IsNullOrEmpty(value) || value.Length <= maxChars) return value ?? "";
            return value.Substring(0, maxChars - 1).TrimEnd() + "…";
        }

        static string KindClass(string kind) => (kind ?? "").ToLowerInvariant() switch
        {
            "military" => "order-card--military",
            "diplomatic" => "order-card--diplomatic",
            "covert" => "order-card--covert",
            "economic" => "order-card--economic",
            "political" => "order-card--political",
            _ => "order-card--covert"
        };

        static string KindTitle(string kind) => (kind ?? "").ToLowerInvariant() switch
        {
            "military" => "MILITARY",
            "diplomatic" => "DIPLOMACY",
            "covert" => "COVERT",
            "economic" => "ECONOMIC",
            "political" => "POLITICAL",
            _ => "DIRECTIVE"
        };
    }
}
