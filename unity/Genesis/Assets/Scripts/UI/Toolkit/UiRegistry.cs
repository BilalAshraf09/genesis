using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UIElements;

namespace Genesis.UI.Toolkit
{
    /// <summary>
    /// Runtime access to UI Toolkit assets (PanelSettings, UXML screens, USS sheets) for the
    /// runtime-built (zero prefab) Genesis scenes. Lives at Assets/Resources/GenesisUiRegistry.asset.
    /// Populated automatically by the editor (Genesis/UI/Refresh UI Registry, and on every asset import
    /// under Assets/UI). Lookup is by file name without extension, e.g. Screen("CommandHud").
    /// </summary>
    [CreateAssetMenu(menuName = "Genesis/UI Registry", fileName = "GenesisUiRegistry")]
    public sealed class UiRegistry : ScriptableObject
    {
        public const string ResourcePath = "GenesisUiRegistry";

        public PanelSettings panelSettings;
        public List<VisualTreeAsset> screens = new();
        public List<StyleSheet> styleSheets = new();


        static UiRegistry _cached;

        public static UiRegistry Load()
        {
            if (_cached == null) _cached = Resources.Load<UiRegistry>(ResourcePath);
            if (_cached == null) Debug.LogError("[Genesis UI] Missing Resources/GenesisUiRegistry.asset — run Genesis/UI/Refresh UI Registry.");
            return _cached;
        }

        public VisualTreeAsset Screen(string name)
        {
            foreach (var s in screens) if (s != null && s.name == name) return s;
            Debug.LogWarning($"[Genesis UI] UXML '{name}' not in registry.");
            return null;
        }

        public StyleSheet Sheet(string name)
        {
            foreach (var s in styleSheets) if (s != null && s.name == name) return s;
            Debug.LogWarning($"[Genesis UI] USS '{name}' not in registry.");
            return null;
        }


        /// <summary>
        /// Creates a GameObject with a UIDocument using the shared Genesis PanelSettings.
        /// All Genesis documents share ONE panel, so sortingOrder decides stacking:
        ///   0 = map labels, 10 = HUD, 20 = order sheet, 30 = debrief, 40 = dialogs, 50 = overlays (codex/toasts).
        /// Optionally clones a UXML screen and attaches extra stylesheets by name.
        /// The document root is full-screen with pickingMode Ignore so taps fall through to the 3D map
        /// wherever there is no interactive element.
        /// </summary>
        public static UIDocument CreateDocument(string goName, Transform parent, int sortingOrder,
                                                string uxmlName = null, params string[] extraSheets)
        {
            var reg = Load();
            var go = new GameObject(goName);
            if (parent != null) go.transform.SetParent(parent, false);
            var doc = go.AddComponent<UIDocument>();
            if (reg != null) doc.panelSettings = reg.panelSettings;
            doc.sortingOrder = sortingOrder;
            if (reg != null && !string.IsNullOrEmpty(uxmlName)) doc.visualTreeAsset = reg.Screen(uxmlName);

            var root = doc.rootVisualElement;
            if (root != null)
            {
                root.pickingMode = PickingMode.Ignore;
                root.style.flexGrow = 1;
                if (reg != null && extraSheets != null)
                {
                    foreach (var sheetName in extraSheets)
                    {
                        var sheet = reg.Sheet(sheetName);
                        if (sheet != null && !root.styleSheets.Contains(sheet)) root.styleSheets.Add(sheet);
                    }
                }
            }
            return doc;
        }

        /// <summary>
        /// True when a pickable UI Toolkit element (not a full-screen Ignore root) is under the given
        /// screen position (pixels, origin bottom-left as in Input). The 3D board input must skip taps
        /// when this returns true.
        /// </summary>
        public static bool IsPointerOverUi(Vector2 screenPos)
        {
            var reg = Load();
            if (reg == null || reg.panelSettings == null) return false;
            var docs = Object.FindObjectsByType<UIDocument>(FindObjectsSortMode.None);
            foreach (var d in docs)
            {
                if (d == null || !d.isActiveAndEnabled) continue;
                var panel = d.rootVisualElement?.panel;
                if (panel == null) continue;
                var flipped = new Vector2(screenPos.x, UnityEngine.Screen.height - screenPos.y);
                var panelPos = RuntimePanelUtils.ScreenToPanel(panel, flipped);
                var picked = panel.Pick(panelPos);
                // panel.Pick only returns elements with PickingMode.Position. Document roots are Ignore,
                // so anything picked that is not a root / the panel's visual tree is real UI.
                if (picked == null || picked.parent == null) continue;
                if (picked == d.rootVisualElement || picked == d.rootVisualElement.parent) continue;
                return true;
            }
            return false;
        }
    }
}
