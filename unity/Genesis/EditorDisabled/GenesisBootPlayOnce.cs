#if UNITY_EDITOR
using System.IO;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;

namespace Genesis.EditorTools
{
    /// <summary>
    /// FAST resume: open Boot and enter Play Mode once.
    /// ENV GENESIS_BOOT_PLAY=1 after domain reload, or menu Genesis → Open Boot And Play.
    /// Does not rebuild scenes.
    /// </summary>
    public static class GenesisBootPlayOnce
    {
        const string BootScenePath = "Assets/Scenes/Boot.unity";
        const string MarkerDir = "Temp/GenesisCapture";
        const string PlayingMarker = "Temp/GenesisCapture/BOOT_PLAYING.txt";
        static bool _armed;

        const string RequestMarker = "Temp/GenesisCapture/REQUEST_BOOT_PLAY.txt";

        [InitializeOnLoadMethod]
        static void Hook()
        {
            var flag = System.Environment.GetEnvironmentVariable("GENESIS_BOOT_PLAY");
            var envOn = !string.IsNullOrEmpty(flag) &&
                        (flag == "1" || flag.Equals("true", System.StringComparison.OrdinalIgnoreCase));
            var fileOn = File.Exists(RequestMarker);
            if (!envOn && !fileOn) return;
            EditorApplication.update -= Tick;
            EditorApplication.update += Tick;
        }

        static void Tick()
        {
            if (EditorApplication.isCompiling || EditorApplication.isUpdating) return;
            if (EditorApplication.isPlayingOrWillChangePlaymode) return;
            if (_armed) return;
            _armed = true;
            EditorApplication.update -= Tick;
            try { if (File.Exists(RequestMarker)) File.Delete(RequestMarker); } catch { /* ignore */ }
            OpenBootAndPlay();
        }

        [MenuItem("Genesis/Open Boot And Play")]
        public static void OpenBootAndPlay()
        {
            if (!File.Exists(BootScenePath))
            {
                Debug.LogError("[Genesis] Boot.unity missing — run Genesis → Rebuild Full App Shell once.");
                return;
            }

            if (EditorApplication.isPlaying)
            {
                EditorApplication.isPlaying = false;
                EditorApplication.delayCall += OpenBootAndPlay;
                return;
            }

            var scene = EditorSceneManager.OpenScene(BootScenePath, OpenSceneMode.Single);
            Debug.Log($"[Genesis] FAST path — entering Play Mode on {BootScenePath} ({scene.name}).");
            try
            {
                Directory.CreateDirectory(MarkerDir);
                File.WriteAllText(PlayingMarker, $"{System.DateTime.UtcNow:o}\n{BootScenePath}\n");
            }
            catch { /* ignore */ }

            EditorApplication.delayCall += () =>
            {
                if (EditorApplication.isCompiling || EditorApplication.isUpdating) return;
                EditorApplication.isPlaying = true;
            };
        }
    }
}
#endif
