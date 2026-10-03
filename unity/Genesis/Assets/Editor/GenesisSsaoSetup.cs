using UnityEditor;
using UnityEngine;
using UnityEngine.Rendering;
using UnityEngine.Rendering.Universal;

namespace Genesis.EditorTools
{
    /// <summary>
    /// Phase B — enable URP SSAO on Genesis_URP_Renderer (Med+/High desk grounding).
    /// Run once in Editor after package import; safe to re-run.
    /// </summary>
    public static class GenesisSsaoSetup
    {
        const string RendererPath = "Assets/Settings/Genesis_URP_Renderer.asset";

        [MenuItem("Genesis/Visuals/Enable SSAO on Theater Renderer")]
        public static void EnableSsao()
        {
            var renderer = AssetDatabase.LoadAssetAtPath<UniversalRendererData>(RendererPath);
            if (renderer == null)
            {
                Debug.LogError($"[Genesis] Missing renderer at {RendererPath}");
                return;
            }

            foreach (var feature in renderer.rendererFeatures)
            {
                if (feature != null && feature.GetType().Name.Contains("ScreenSpaceAmbientOcclusion"))
                {
                    feature.SetActive(true);
                    EditorUtility.SetDirty(renderer);
                    AssetDatabase.SaveAssets();
                    Debug.Log("[Genesis] SSAO already present — re-enabled.");
                    return;
                }
            }

            // Create via ScriptableObject when the URP SSAO type is available.
            var ssaoType = System.Type.GetType(
                "UnityEngine.Rendering.Universal.ScreenSpaceAmbientOcclusion, Unity.RenderPipelines.Universal.Runtime");
            if (ssaoType == null)
            {
                Debug.LogWarning("[Genesis] SSAO type not found in this URP build — skip.");
                return;
            }

            var ssao = ScriptableObject.CreateInstance(ssaoType);
            ssao.name = "Genesis_SSAO";
            AssetDatabase.AddObjectToAsset(ssao, renderer);

            var so = new SerializedObject(renderer);
            var features = so.FindProperty("m_RendererFeatures");
            features.arraySize += 1;
            features.GetArrayElementAtIndex(features.arraySize - 1).objectReferenceValue =
                ssao as ScriptableRendererFeature;
            so.ApplyModifiedPropertiesWithoutUndo();

            // Tune desk-scale: small radius, downsample on (Survival Kids guidance).
            var featureSo = new SerializedObject(ssao);
            TrySetFloat(featureSo, "m_Settings.Radius", 0.35f);
            TrySetFloat(featureSo, "m_Settings.Intensity", 0.55f);
            TrySetBool(featureSo, "m_Settings.Downsample", true);
            featureSo.ApplyModifiedPropertiesWithoutUndo();

            (ssao as ScriptableRendererFeature)?.SetActive(true);
            EditorUtility.SetDirty(renderer);
            EditorUtility.SetDirty(ssao);
            AssetDatabase.SaveAssets();
            Debug.Log("[Genesis] SSAO renderer feature added to Genesis_URP_Renderer.");
        }

        static void TrySetFloat(SerializedObject so, string path, float value)
        {
            var p = so.FindProperty(path);
            if (p != null) p.floatValue = value;
        }

        static void TrySetBool(SerializedObject so, string path, bool value)
        {
            var p = so.FindProperty(path);
            if (p != null) p.boolValue = value;
        }
    }
}
