using UnityEngine;
using UnityEngine.UIElements;

namespace Genesis.UI.Toolkit
{
    /// <summary>
    /// Applies Screen.safeArea padding to a VisualElement in panel coordinates.
    /// Works with iPhone notch / Dynamic Island and Android punch-hole cutouts.
    /// </summary>
    public static class SafeAreaRoot
    {
        /// <summary>
        /// Max inset per edge in panel units. Prevents ScreenToPanel garbage when
        /// Game View FixedResolution disagrees with Screen.width (Editor) from
        /// blowing padding and pushing the HUD/sheet off-screen.
        /// </summary>
        public const float MaxInsetPanel = 72f;

        /// <summary>
        /// Apply safe-area insets to <paramref name="root"/> using the panel's coordinate space.
        /// Call once after the panel is attached, then re-call whenever the safe area changes.
        /// </summary>
        public static void Apply(VisualElement root, IPanel panel)
        {
            if (root == null || panel == null)
                return;

            Rect safeArea = Screen.safeArea;
            int screenW = Screen.width;
            int screenH = Screen.height;

            // Guard against zero screen (can happen before first frame in some cases).
            if (screenW == 0 || screenH == 0)
                return;

            // Device Simulator / mismatched Game View often reports a safeArea that
            // does not fit inside Screen (e.g. Screen 1965×1518, safe 1284×2535).
            // Applying that through ScreenToPanel crushes the whole UI — skip it.
            bool safeFitsScreen =
                safeArea.xMin >= -0.5f
                && safeArea.yMin >= -0.5f
                && safeArea.xMax <= screenW + 0.5f
                && safeArea.yMax <= screenH + 0.5f
                && safeArea.width > 1f
                && safeArea.height > 1f;

            bool fullScreenSafe =
                safeArea.width >= screenW - 1f
                && safeArea.height >= screenH - 1f
                && safeArea.x <= 1f
                && safeArea.y <= 1f;

            if (!safeFitsScreen || fullScreenSafe)
            {
                ClearPadding(root);
                return;
            }

            // Convert screen-space corners to panel-space coordinates.
            Vector2 safeMin = RuntimePanelUtils.ScreenToPanel(panel,
                new Vector2(safeArea.xMin, screenH - safeArea.yMax));
            Vector2 safeMax = RuntimePanelUtils.ScreenToPanel(panel,
                new Vector2(safeArea.xMax, screenH - safeArea.yMin));

            float padLeft   = Mathf.Max(0f, safeMin.x);
            float padTop    = Mathf.Max(0f, safeMin.y);
            float padRight  = Mathf.Max(0f,
                RuntimePanelUtils.ScreenToPanel(panel, new Vector2(screenW, 0f)).x - safeMax.x);
            float padBottom = Mathf.Max(0f,
                RuntimePanelUtils.ScreenToPanel(panel, new Vector2(0f, screenH)).y - safeMax.y);

            if (float.IsNaN(padLeft) || float.IsInfinity(padLeft)) padLeft = 0f;
            if (float.IsNaN(padTop) || float.IsInfinity(padTop)) padTop = 0f;
            if (float.IsNaN(padRight) || float.IsInfinity(padRight)) padRight = 0f;
            if (float.IsNaN(padBottom) || float.IsInfinity(padBottom)) padBottom = 0f;

            // If conversion still produced nonsense relative to the panel, bail.
            float panelW = root.resolvedStyle.width;
            float panelH = root.resolvedStyle.height;
            if (panelW > 8f && panelH > 8f
                && (padLeft + padRight > panelW * 0.35f || padTop + padBottom > panelH * 0.35f))
            {
                ClearPadding(root);
                return;
            }

            padLeft   = Mathf.Min(padLeft, MaxInsetPanel);
            padTop    = Mathf.Min(padTop, MaxInsetPanel);
            padRight  = Mathf.Min(padRight, MaxInsetPanel);
            padBottom = Mathf.Min(padBottom, MaxInsetPanel);

            root.style.paddingLeft   = padLeft;
            root.style.paddingTop    = padTop;
            root.style.paddingRight  = padRight;
            root.style.paddingBottom = padBottom;
        }

        static void ClearPadding(VisualElement root)
        {
            root.style.paddingLeft = 0;
            root.style.paddingTop = 0;
            root.style.paddingRight = 0;
            root.style.paddingBottom = 0;
        }
    }

    /// <summary>
    /// MonoBehaviour companion: attach to the same GameObject as a UIDocument.
    /// Polls Screen.safeArea each frame and re-applies padding when it changes or
    /// when the screen resolution changes.
    /// </summary>
    [RequireComponent(typeof(UIDocument))]
    [AddComponentMenu("Genesis/UI/Safe Area Root")]
    public sealed class SafeAreaRootBehaviour : MonoBehaviour
    {
        [Header("Safe Area Root")]
        [Tooltip("If empty, uses the root visual element of the attached UIDocument.")]
        [SerializeField] private string _targetElementName = string.Empty;

        private UIDocument _document;
        private VisualElement _root;

        // State cached for change detection (cheap compare each Update).
        private Rect _lastSafeArea = Rect.zero;
        private int  _lastScreenW;
        private int  _lastScreenH;

        /// <summary>Bind to a named child (e.g. atlasRoot / safeRoot). Empty = document root.</summary>
        public void Configure(string targetElementName)
        {
            _targetElementName = targetElementName ?? string.Empty;
            ForceApply();
        }

        private void Awake()
        {
            _document = GetComponent<UIDocument>();
        }

        private void OnEnable()
        {
            // Defer one frame so the panel is ready after domain reload / scene load.
            // Use a geometry-changed callback on the root for reliability at first attach.
            _document.rootVisualElement?.RegisterCallback<GeometryChangedEvent>(OnGeometryChanged);
            ForceApply();
        }

        private void OnDisable()
        {
            _document.rootVisualElement?.UnregisterCallback<GeometryChangedEvent>(OnGeometryChanged);
        }

        private void Update()
        {
            // Cheap poll — struct compare is allocation-free.
            if (Screen.safeArea == _lastSafeArea
                && Screen.width  == _lastScreenW
                && Screen.height == _lastScreenH)
                return;

            ForceApply();
        }

        private void OnGeometryChanged(GeometryChangedEvent _)
        {
            ForceApply();
        }

        private void ForceApply()
        {
            if (_document == null)
                return;

            VisualElement target = GetTarget();
            if (target == null)
                return;

            IPanel panel = target.panel;
            if (panel == null)
                return;

            SafeAreaRoot.Apply(target, panel);

            // Cache the values used so we only re-apply on actual change.
            _lastSafeArea = Screen.safeArea;
            _lastScreenW  = Screen.width;
            _lastScreenH  = Screen.height;
        }

        private VisualElement GetTarget()
        {
            VisualElement root = _document.rootVisualElement;
            if (root == null)
                return null;

            if (string.IsNullOrEmpty(_targetElementName))
                return root;

            return root.Q(_targetElementName) ?? root;
        }
    }
}
