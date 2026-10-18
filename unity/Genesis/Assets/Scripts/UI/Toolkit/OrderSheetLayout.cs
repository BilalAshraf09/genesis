using UnityEngine;
using UnityEngine.UIElements;

namespace Genesis.UI.Toolkit
{
    /// <summary>
    /// Deterministic order-sheet layout (ref 882×1784 panel units).
    /// Equal-flex row fills the sheet inner width on standard phones.
    /// Scroll row or stack when equal columns would fall below a readable floor.
    ///
    /// IMPORTANT: Never key tablet constraints off raw Screen.width pixels.
    /// Retina phones report 750–1290+ px and were incorrectly capped to a
    /// centered 430 panel-unit column. Use LogicalScreenWidth() instead.
    /// </summary>
    public static class OrderSheetLayout
    {
        public const float RefPanelHeight = 1784f;
        public const float RefPanelWidth  = 882f;

        public const float SheetPadHRef       = 16f;
        public const float HandleRef          = 18f;
        // .drag-handle margin-top in OrderSheet.uss — must be in peek math or the
        // sheet overshoots content and parks navy under HOLD TO COMMIT.
        public const float HandleMarginTopRef = 8f;
        // Matches .sheet-header max-height (eyebrow + place + 2-line beat).
        public const float HeaderRef          = 104f;
        public const float ScrollGapTopRef    = 8f;
        public const float ScrollGapBottomRef = 10f;
        public const float HoldHeightRef      = 92f;
        public const float GestureMinRef      = 12f;
        // Content-driven band: header + multi-line title + desc + deltas + pad.
        // Sized so Peek lands near ~36% panel — matches TheaterCameraRig portrait
        // map-band framing (HUD ~14% / sheet ~36%). Keep min≈max so the card rail
        // absorbs peek height (badges pin via margin-top:auto; no navy under HOLD).
        public const float CardHeightMinRef   = 380f;
        public const float CardHeightMaxRef   = 390f;
        public const float CardGapRef         = 10f;
        public const float CardWidthFloor     = 110f;
        public const float ScrollCardWidthRef = 148f;

        /// <summary>
        /// Tablet reading-width cap in PANEL units (≈ large-phone panel width
        /// under ScaleWithScreenSize ref 882). Previously 430 mixed iPhone
        /// logical points with panel units and created the narrow column.
        /// </summary>
        public const float MaxContentWidth = 860f;

        /// <summary>Logical/CSS-ish width (Game View size / iOS points / Android dp).</summary>
        public const int WidePortraitPx = 600;

        public enum RailMode
        {
            EqualRow,
            ScrollRow,
            Stack
        }

        public struct Metrics
        {
            public float SheetHeight;
            public float ScrollBandHeight;
            public float ScrollGapTop;
            public float CardHeight;
            public float CardWidth;
            public float CardGap;
            public float HoldHeight;
            public float GestureSpacerHeight;
            public float InnerWidth;
            public bool  CompactCards;
            public RailMode Mode;
            public bool ConstrainContentWidth;
        }

        public static float PanelScale(float panelHeight) =>
            Mathf.Clamp(panelHeight / RefPanelHeight, 0.8f, 1.2f);

        public static float Scaled(float refPx, float panelHeight) =>
            refPx * PanelScale(panelHeight);

        /// <summary>
        /// Density-independent screen width matching Editor Game View sizes.
        /// On device, converts physical pixels → ~160-dpi dips (≈ iOS points).
        /// </summary>
        public static float LogicalScreenWidth()
        {
#if UNITY_EDITOR
            // Game View / Device Simulator already expose the configured logical size.
            return Screen.width;
#else
            float dpi = Screen.dpi > 1f ? Screen.dpi : 160f;
            return Screen.width * (160f / dpi);
#endif
        }

        public static float LogicalScreenHeight()
        {
#if UNITY_EDITOR
            return Screen.height;
#else
            float dpi = Screen.dpi > 1f ? Screen.dpi : 160f;
            return Screen.height * (160f / dpi);
#endif
        }

        /// <summary>
        /// True only for wide portrait tablets (e.g. 600×960 logical), never for
        /// retina phones whose pixel width exceeds 600.
        /// </summary>
        public static bool ShouldConstrainContentWidth()
        {
            float w = LogicalScreenWidth();
            float h = LogicalScreenHeight();
            return w >= WidePortraitPx && h >= w;
        }

        /// <summary>
        /// Bottom safe-area inset in panel coordinates (not raw screen pixels).
        /// Clamped — ScreenToPanel can return huge garbage when Game View size
        /// disagrees with the panel scale, which previously inflated gestureSpacer
        /// to 200+ panel units and stranded HOLD TO COMMIT above empty navy.
        /// </summary>
        public const float SafeAreaBottomMaxPanel = 40f;

        public static float SafeAreaBottomPanel(IPanel panel)
        {
            if (panel == null || Screen.width <= 0 || Screen.height <= 0)
                return 0f;

            // Unity: safeArea.y is the bottom inset in screen pixels (bottom-left origin).
            float bottomPixels = Mathf.Max(0f, Screen.safeArea.y);
            if (bottomPixels < 0.5f)
                return 0f;

            // Convert using the same X so Y only reflects the inset distance.
            Vector2 atBottom = RuntimePanelUtils.ScreenToPanel(panel, new Vector2(0f, 0f));
            Vector2 atSafe = RuntimePanelUtils.ScreenToPanel(panel, new Vector2(0f, bottomPixels));
            float inset = Mathf.Abs(atSafe.y - atBottom.y);
            if (float.IsNaN(inset) || float.IsInfinity(inset))
                return 0f;

            return Mathf.Clamp(inset, 0f, SafeAreaBottomMaxPanel);
        }

        public static float PeekSheetHeight(float panelHeight)
        {
            float s = PanelScale(panelHeight);
            // Content-driven peek: handle (+margin) + header + readable cards + hold + inset.
            // Do NOT raise above want — a floor taller than CardHeightMax parks navy
            // under HOLD TO COMMIT. Cap so the map stays ≥ ~60% of panel.
            // +12 covers urgency hairline + margin rounding so content fits inside sheet.
            float want = (HandleRef + HandleMarginTopRef + HeaderRef
                          + ScrollGapTopRef + ScrollGapBottomRef
                          + CardHeightMinRef + HoldHeightRef + GestureMinRef + 12f) * s;
            return Mathf.Min(want, panelHeight * 0.40f);
        }

        /// <param name="contentWidth">Sheet/panel resolved width (includes padding box).</param>
        public static Metrics Compute(float sheetHeight, float contentWidth, float panelHeight,
            float safeAreaBottomPanel = 0f, int cardCount = 3, float measuredHeaderPx = -1f)
        {
            float pad = Scaled(SheetPadHRef, panelHeight);

            // Cards always size to the sheet they live in (full safe content width).
            // Do NOT clamp innerW to MaxContentWidth — that recreated the narrow column.
            float innerW = Mathf.Max(1f, contentWidth - pad * 2f);

            float gapTop = Scaled(ScrollGapTopRef, panelHeight);
            float gapBottom = Scaled(ScrollGapBottomRef, panelHeight);
            float holdH = Scaled(HoldHeightRef, panelHeight);
            // Aesthetic inset only. Device home-indicator / notch insets are already
            // applied by SafeAreaRoot on the panel root — adding SafeAreaBottomPanel
            // here double-counts and parks a navy band under HOLD TO COMMIT.
            // (safeAreaBottomPanel kept on the signature for diagnostics/callers.)
            _ = safeAreaBottomPanel;
            float gesture = Scaled(GestureMinRef, panelHeight);
            float handle = Scaled(HandleRef, panelHeight) + Scaled(HandleMarginTopRef, panelHeight);
            float header = measuredHeaderPx > 1f
                ? measuredHeaderPx
                : Scaled(HeaderRef, panelHeight);

            float reserved = handle + header + gapTop + gapBottom + holdH + gesture;
            float scrollH = Mathf.Max(Scaled(120f, panelHeight), sheetHeight - reserved);

            float cardMin = Scaled(CardHeightMinRef, panelHeight);
            float cardMax = Scaled(CardHeightMaxRef, panelHeight);
            // Allow the rail to grow up to the remaining peek budget so slack never
            // becomes a navy band under HOLD. Soft ceiling ≈ cardMax + 48.
            float absorbMax = Mathf.Max(cardMax, cardMin + Scaled(48f, panelHeight));
            float cardH = Mathf.Clamp(scrollH - 4f, cardMin, absorbMax);
            if (cardH > scrollH) cardH = scrollH;
            scrollH = cardH;

            int n = Mathf.Max(1, cardCount);
            float gap = Scaled(CardGapRef, panelHeight);

            float equalW = (innerW - gap * (n - 1)) / n;
            RailMode mode;
            float cardW;

            if (equalW >= CardWidthFloor)
            {
                mode = RailMode.EqualRow;
                cardW = equalW; // hint only — EqualRow uses flex-grow
            }
            else
            {
                // Narrow content: stack only when the current sheet band can hold
                // all cards; otherwise use a horizontal scroller with fixed card width.
                float stackCardH = Scaled(130f, panelHeight);
                float stackNeed = n * stackCardH + (n - 1) * gap;
                float bandBudget = Mathf.Max(0f, sheetHeight - reserved);
                bool canStack = bandBudget >= stackNeed * 0.98f;

                if (canStack)
                {
                    mode = RailMode.Stack;
                    cardW = innerW;
                    scrollH = stackNeed;
                    cardH = stackCardH;
                }
                else
                {
                    mode = RailMode.ScrollRow;
                    cardW = Mathf.Clamp(Scaled(ScrollCardWidthRef, panelHeight), CardWidthFloor, innerW * 0.78f);
                }
            }

            // Hide secondary body copy only when columns are genuinely tight.
            bool compact = mode == RailMode.ScrollRow
                           || (mode == RailMode.EqualRow && (equalW < 150f || cardH < Scaled(200f, panelHeight)));

            return new Metrics
            {
                SheetHeight = sheetHeight,
                ScrollBandHeight = scrollH,
                ScrollGapTop = gapTop,
                CardHeight = cardH,
                CardWidth = cardW,
                CardGap = gap,
                HoldHeight = holdH,
                GestureSpacerHeight = gesture,
                InnerWidth = innerW,
                CompactCards = compact,
                Mode = mode,
                // Kept for diagnostics; runtime no longer applies a centered max-width.
                ConstrainContentWidth = false
            };
        }
    }
}
