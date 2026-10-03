using System.IO;
using System.Linq;
using Genesis.UI.Toolkit;
using UnityEditor;
using UnityEngine;
using UnityEngine.UIElements;

namespace Genesis.EditorTools
{
    /// <summary>
    /// Keeps Assets/Resources/GenesisUiRegistry.asset in sync with every .uxml / .uss under Assets/UI.
    /// Runs automatically after imports that touch Assets/UI, or manually via the menu.
    /// </summary>
    public sealed class GenesisUiRegistryBuilder : AssetPostprocessor
    {
        const string RegistryPath = "Assets/Resources/GenesisUiRegistry.asset";
        const string PanelPath = "Assets/UI/Genesis.PanelSettings.asset";

        [MenuItem("Genesis/UI/Refresh UI Registry")]
        public static UiRegistry Refresh()
        {
            if (!Directory.Exists("Assets/Resources")) AssetDatabase.CreateFolder("Assets", "Resources");
            var reg = AssetDatabase.LoadAssetAtPath<UiRegistry>(RegistryPath);
            if (reg == null)
            {
                reg = ScriptableObject.CreateInstance<UiRegistry>();
                AssetDatabase.CreateAsset(reg, RegistryPath);
            }

            reg.panelSettings = AssetDatabase.LoadAssetAtPath<PanelSettings>(PanelPath);
            reg.screens = AssetDatabase.FindAssets("t:VisualTreeAsset", new[] { "Assets/UI" })
                .Select(g => AssetDatabase.LoadAssetAtPath<VisualTreeAsset>(AssetDatabase.GUIDToAssetPath(g)))
                .Where(a => a != null).ToList();
            reg.styleSheets = AssetDatabase.FindAssets("t:StyleSheet", new[] { "Assets/UI" })
                .Select(g => AssetDatabase.GUIDToAssetPath(g))
                .Where(p => p.EndsWith(".uss"))
                .Select(p => AssetDatabase.LoadAssetAtPath<StyleSheet>(p))
                .Where(a => a != null).ToList();
            EditorUtility.SetDirty(reg);
            AssetDatabase.SaveAssetIfDirty(reg);
            return reg;
        }

        static void OnPostprocessAllAssets(string[] imported, string[] deleted, string[] moved, string[] movedFrom)
        {
            bool touched = imported.Concat(deleted).Concat(moved)
                .Any(p => p.StartsWith("Assets/UI/") && (p.EndsWith(".uxml") || p.EndsWith(".uss") || p.EndsWith(".asset")));
            if (touched) EditorApplication.delayCall += () => Refresh();
        }
    }
}
