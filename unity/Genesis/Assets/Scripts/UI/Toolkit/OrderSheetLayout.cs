using UnityEngine;

namespace Genesis.UI.Toolkit
{
    /// <summary>
    /// Deterministic order-sheet layout (ref 1080×1920).
    /// Equal-width cards in one horizontal rail — all options visible at once
    /// (no nested scroll). Fair comparison, low friction on mobile.
    /// </summary>
    public static class OrderSheetLayout
    {
        public const float RefPanelHeight = 1920f;
        public const float RefPanelWidth  = 1080f;

        public const float SheetPadHRef       = 20f;
        public const float HandleRef          = 28f;
        public const float HeaderRef          = 44f;
        /// <summary>Breathing room between header and card rail.</summary>
        public const float ScrollGapTopRef    = 20f;
        /// <summary>Gap between card rail and hold button (matches USS margin-bottom).</summary>
        public const float ScrollGapBottomRef = 12f;
        public const float HoldHeightRef      = 88f;
        public const float GestureMinRef      = 12f;
        public const float CardHeightMinRef   = 240f;
        public const float CardHeightMaxRef   = 380f;
        public const float CardGapRef         = 10f;
        public const float CardWidthFloor     = 96f;

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
        }

        public static float PanelScale(float panelHeight) =>
            Mathf.Clamp(panelHeight / RefPanelHeight, 0.75f, 1.12f);

        public static float Scaled(float refPx, float panelHeight) =>
            refPx * PanelScale(panelHeight);

        public static float PeekSheetHeight(float panelHeight)
        {
            float s = PanelScale(panelHeight);
            float want = (HandleRef + HeaderRef + ScrollGapTopRef + ScrollGapBottomRef
                          + CardHeightMinRef + HoldHeightRef + GestureMinRef + 8f) * s;
            return Mathf.Clamp(want, panelHeight * 0.46f, panelHeight * 0.58f);
        }

        /// <summary>
        /// Derive scroll/card/hold sizes from the live sheet height (after snap).
        /// When <paramref name="cardCount"/> &gt; 0, card width is split evenly across
        /// the inner sheet so all tiles fit in frame (no horizontal scroll).
        /// </summary>
        public static Metrics Compute(float sheetHeight, float panelWidth, float panelHeight,
            float safeAreaBottomPx = 0f, int cardCount = 3)
        {
            float pad = Scaled(SheetPadHRef, panelHeight);
            float innerW = Mathf.Max(240f, panelWidth - pad * 2f);

            float gapTop = Scaled(ScrollGapTopRef, panelHeight);
            float gapBottom = Scaled(ScrollGapBottomRef, panelHeight);
            float holdH = Scaled(HoldHeightRef, panelHeight);
            float gesture = Mathf.Max(Scaled(GestureMinRef, panelHeight), safeAreaBottomPx);
            float chrome = Scaled(HandleRef + HeaderRef, panelHeight)
                           + gapTop + gapBottom + holdH + gesture;

            float scrollH = Mathf.Max(Scaled(160f, panelHeight), sheetHeight - chrome);

            float cardH = Mathf.Clamp(scrollH - 4f,
                Scaled(CardHeightMinRef, panelHeight),
                Scaled(CardHeightMaxRef, panelHeight));
            if (cardH > scrollH) cardH = scrollH;

            int n = Mathf.Max(1, cardCount);
            float gap = Scaled(CardGapRef, panelHeight);
            float cardW = (innerW - gap * (n - 1)) / n;
            cardW = Mathf.Max(CardWidthFloor, cardW);

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
                CompactCards = cardW < 220f
            };
        }
    }
}
