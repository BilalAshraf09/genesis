using System;
using System.Collections.Generic;
using Genesis.Data;
using UnityEngine;
using UnityEngine.UIElements;

namespace Genesis.UI.Toolkit
{
    /// <summary>
    /// Crisis order card — matches Europe Desk reference:
    /// icon + kind badge on one row, title, effect chips.
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

            var selectionGlow = new VisualElement();
            selectionGlow.AddToClassList("order-card__glow");
            selectionGlow.pickingMode = PickingMode.Ignore;
            Add(selectionGlow);

            var body = new VisualElement();
            body.AddToClassList("order-card__body");
            body.pickingMode = PickingMode.Ignore;

            // Header row: icon (left) + kind pill (right) — reference layout
            var header = new VisualElement();
            header.AddToClassList("order-card__header");
            header.pickingMode = PickingMode.Ignore;

            var icon = new VisualElement();
            icon.AddToClassList("order-card__icon");
            icon.AddToClassList(KindIconClass(order.kind));
            icon.pickingMode = PickingMode.Ignore;
            header.Add(icon);

            var kindBadge = new Label { text = KindTitle(order.kind) };
            kindBadge.AddToClassList("order-card__kind");
            kindBadge.AddToClassList("type-category");
            kindBadge.pickingMode = PickingMode.Ignore;
            header.Add(kindBadge);

            body.Add(header);

            _titleLabel = new Label { text = PreferredTitle(order) };
            _titleLabel.AddToClassList("order-card__title");
            _titleLabel.AddToClassList("card-title");
            _titleLabel.AddToClassList("type-card-title");
            _titleLabel.pickingMode = PickingMode.Ignore;
            body.Add(_titleLabel);

            _descLabel = new Label { text = PreferredDetail(order) };
            _descLabel.AddToClassList("order-card__desc");
            _descLabel.AddToClassList("body-copy");
            _descLabel.AddToClassList("type-secondary");
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

        /// <summary>
        /// Fixed-width band (scroll row). Cards keep a readable constant width.
        /// </summary>
        public void ApplyBandLayout(float cardHeightPx, float cardWidthPx, float gapRightPx = 0f, bool compact = false)
        {
            float h = Mathf.Max(OrderSheetLayout.CardHeightMinRef * 0.85f, cardHeightPx);
            float w = Mathf.Max(OrderSheetLayout.CardWidthFloor, cardWidthPx);
            style.height = h;
            style.width = w;
            style.minHeight = h;
            style.maxHeight = h;
            style.minWidth = w;
            style.maxWidth = w;
            style.flexBasis = w;
            style.marginRight = gapRightPx;
            style.marginBottom = 0f;
            style.flexGrow = 0;
            style.flexShrink = 0;
            EnableInClassList("order-card--compact", compact);
            // Keep decision detail visible — compact only tightens title wrap via USS.
            if (_descLabel != null)
                _descLabel.EnableInClassList("hidden", false);
        }

        /// <summary>
        /// Equal flex columns that fill the card rail (standard phone widths).
        /// </summary>
        public void ApplyEqualFlexLayout(float cardHeightPx, float gapRightPx = 0f, bool compact = false)
        {
            float h = Mathf.Max(OrderSheetLayout.CardHeightMinRef * 0.85f, cardHeightPx);
            style.height = h;
            style.minHeight = h;
            style.maxHeight = h;
            style.width = StyleKeyword.Null;
            style.minWidth = 0f;
            style.maxWidth = StyleKeyword.Null;
            style.flexBasis = 0f;
            style.flexGrow = 1f;
            style.flexShrink = 1f;
            style.marginRight = gapRightPx;
            style.marginBottom = 0f;
            EnableInClassList("order-card--compact", compact);
            if (_descLabel != null)
                _descLabel.EnableInClassList("hidden", false);
        }

        static string PreferredTitle(OrderChoice order)
        {
            // Full decision title (wrapped). Short callsigns like "RIDER" are too opaque alone.
            if (!string.IsNullOrWhiteSpace(order.label))
                return SoftClamp(order.label.Trim(), 72);
            if (!string.IsNullOrWhiteSpace(order.ShortLabel) && order.ShortLabel.Trim().Length >= 6)
                return SoftClamp(order.ShortLabel.Trim(), 48);
            return order.DisplayCallsign ?? "ORDER";
        }

        static string PreferredDetail(OrderChoice order)
        {
            if (!string.IsNullOrWhiteSpace(order.detail))
                return SoftClamp(order.detail.Trim(), 90);
            return "Tap to arm — then hold to commit.";
        }

        void BuildDeltas(List<ChoiceEffect> effects)
        {
            _deltasRow.Clear();
            var projected = ProjectMeters(effects);
            projected.Sort((a, b) => Mathf.Abs(b.points).CompareTo(Mathf.Abs(a.points)));

            int shown = 0;
            foreach (var d in projected)
            {
                if (d.points == 0) continue;
                if (shown >= 2) break;

                // Reference format: "↑ STAB +5" / "↓ TOLL -2"
                string arrow = d.points > 0 ? "↑" : "↓";
                string sign = d.points > 0 ? $"+{d.points}" : $"{d.points}";

                var pill = new VisualElement();
                pill.AddToClassList("delta-pill");
                if (d.warn) pill.AddToClassList("delta-pill--warn");
                else if (d.abbrev == "CRED" && d.points > 0) pill.AddToClassList("delta-pill--info");
                else if (d.points > 0) pill.AddToClassList("delta-pill--gain");
                else pill.AddToClassList("delta-pill--cost");

                var label = new Label { text = $"{arrow} {d.abbrev} {sign}" };
                label.pickingMode = PickingMode.Ignore;
                label.AddToClassList("delta-pill__label");
                label.AddToClassList("effect-label");
                label.AddToClassList("type-effect-badge");
                pill.Add(label);

                _deltasRow.Add(pill);
                shown++;
            }

            _deltasRow.EnableInClassList("hidden", shown == 0);
        }

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

        // Short badges free horizontal space for the decision title on phone cards.
        static string KindTitle(string kind) => (kind ?? "").ToLowerInvariant() switch
        {
            "military" => "MIL",
            "diplomatic" => "DIPLO",
            "covert" => "COV",
            "economic" => "ECON",
            "political" => "POL",
            _ => "ORDER"
        };

        static string KindIconClass(string kind) => (kind ?? "").ToLowerInvariant() switch
        {
            "military" => "order-card__icon--military",
            "diplomatic" => "order-card__icon--diplomatic",
            "covert" => "order-card__icon--diplomatic",
            "economic" => "order-card__icon--political",
            // Political uses the people glyph so it stays distinct from diplomatic (eye-slash).
            "political" => "order-card__icon--people",
            _ => "order-card__icon--people"
        };
    }
}
