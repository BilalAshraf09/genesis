#if UNITY_EDITOR
using System.IO;
using Genesis.Effects;
using UnityEditor;
using UnityEngine;

namespace Genesis.EditorTools
{
    /// <summary>
    /// Phase C — author Resources/GenesisVFX/DeskDust for High-tier EXECUTE dust.
    /// Particle recipe (VFX Graph optional later); safe on Metal/Vulkan/GLES via Particles.
    /// </summary>
    public static class GenesisDeskDustSetup
    {
        const string Folder = "Assets/Resources/GenesisVFX";
        const string PrefabPath = Folder + "/DeskDust.prefab";

        [MenuItem("Genesis/Visuals/Build DeskDust VFX Resource")]
        public static void BuildDeskDustResource()
        {
            Directory.CreateDirectory(Folder);
            var temp = GenesisDeskDustFactory.BuildRuntime(Vector3.zero, 1f);
            temp.name = "DeskDust";

            // Stop play so PrefabUtility serializes resting state.
            var ps = temp.GetComponent<ParticleSystem>();
            if (ps != null) ps.Stop(true, ParticleSystemStopBehavior.StopEmittingAndClear);

            var prefab = PrefabUtility.SaveAsPrefabAsset(temp, PrefabPath);
            Object.DestroyImmediate(temp);
            AssetDatabase.SaveAssets();
            AssetDatabase.Refresh();

            if (prefab != null)
            {
                Selection.activeObject = prefab;
                Debug.Log($"[Genesis] DeskDust VFX resource → {PrefabPath}");
            }
            else
            {
                Debug.LogError("[Genesis] DeskDust prefab save failed.");
            }
        }
    }
}
#endif
