using System;
using System.IO;
using UnityEngine;
using UnityEngine.Networking;

namespace Genesis.Core
{
    /// <summary>
    /// Cross-platform StreamingAssets reader.
    /// Android APK packs assets inside the jar — <see cref="File.Exists"/> fails there;
    /// diagnosis P1.1: use UnityWebRequest against Application.streamingAssetsPath.
    /// </summary>
    public static class StreamingAssetsIO
    {
        const int TimeoutSeconds = 20;

        public static bool Exists(string path)
        {
            if (string.IsNullOrEmpty(path)) return false;
            if (File.Exists(path)) return true;
            if (!NeedsWebRequest(path)) return false;
            var bytes = ReadAllBytes(path);
            return bytes != null && bytes.Length > 0;
        }

        public static byte[] ReadAllBytes(string path)
        {
            if (string.IsNullOrEmpty(path)) return null;

            if (File.Exists(path))
            {
                try { return File.ReadAllBytes(path); }
                catch (Exception ex)
                {
                    Debug.LogWarning($"[Genesis] StreamingAssets File read failed ({path}): {ex.Message}");
                }
            }

            if (!NeedsWebRequest(path) && !Application.isMobilePlatform)
                return null;

            try
            {
                using var req = UnityWebRequest.Get(path);
                req.timeout = TimeoutSeconds;
                var op = req.SendWebRequest();
                // Theater / map loads are already synchronous — block once at load.
                while (!op.isDone) { }

                if (req.result == UnityWebRequest.Result.Success && req.downloadHandler?.data != null)
                    return req.downloadHandler.data;

                Debug.LogWarning(
                    $"[Genesis] StreamingAssets UWR failed ({path}): {req.error ?? req.result.ToString()}");
            }
            catch (Exception ex)
            {
                Debug.LogWarning($"[Genesis] StreamingAssets UWR exception ({path}): {ex.Message}");
            }

            return null;
        }

        public static string ReadAllText(string path)
        {
            var bytes = ReadAllBytes(path);
            if (bytes == null || bytes.Length == 0) return null;
            return System.Text.Encoding.UTF8.GetString(bytes);
        }

        static bool NeedsWebRequest(string path)
        {
            if (string.IsNullOrEmpty(path)) return false;
            // jar:file://…/base.apk!/assets/… (Android) or http(s) StreamingAssets (WebGL).
            return path.IndexOf("://", StringComparison.Ordinal) >= 0
                   || path.IndexOf("!", StringComparison.Ordinal) >= 0
                   || Application.platform == RuntimePlatform.Android;
        }
    }
}
