using System.IO;
using UnityEngine;
using UnityEngine.UI;

namespace Genesis.Core
{
    /// <summary>
    /// Branded After Action share card — 1080×1350 portrait PNG from real RunSummary data only.
    /// Offscreen uGUI → Camera → RenderTexture → EncodeToPNG.
    /// </summary>
    public static class ShareCardRenderer
    {
        public const int Width = 1080;
        public const int Height = 1350;

        public static string LastPath { get; private set; }

        public static string ShareDirectory =>
            Path.Combine(Application.persistentDataPath, "ShareCards");

        public static string Render(RunSummary run)
        {
            run ??= new RunSummary();
            var root = new GameObject("ShareCardCapture");
            Object.DontDestroyOnLoad(root);

            try
            {
                var camGo = new GameObject("ShareCardCam");
                camGo.transform.SetParent(root.transform, false);
                var cam = camGo.AddComponent<Camera>();
                cam.clearFlags = CameraClearFlags.SolidColor;
                // Night Atlas navy
                cam.backgroundColor = new Color(0.043f, 0.071f, 0.125f, 1f);
                cam.orthographic = true;
                cam.orthographicSize = 5f;
                cam.nearClipPlane = 0.1f;
                cam.farClipPlane = 50f;
                cam.enabled = false;
                cam.cullingMask = 1 << 31;
                camGo.transform.position = new Vector3(0f, 0f, -10f);

                var canvasGo = new GameObject("ShareCardCanvas");
                canvasGo.transform.SetParent(root.transform, false);
                canvasGo.layer = 31;
                var canvas = canvasGo.AddComponent<Canvas>();
                canvas.renderMode = RenderMode.ScreenSpaceCamera;
                canvas.worldCamera = cam;
                canvas.planeDistance = 1f;
                var scaler = canvasGo.AddComponent<CanvasScaler>();
                scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
                scaler.referenceResolution = new Vector2(Width, Height);
                scaler.matchWidthOrHeight = 0.5f;

                BuildCard(canvasGo.transform, run);

                // Force layout before capture
                Canvas.ForceUpdateCanvases();

                var rt = new RenderTexture(Width, Height, 24, RenderTextureFormat.ARGB32);
                cam.targetTexture = rt;
                var prev = RenderTexture.active;
                cam.Render();
                RenderTexture.active = rt;
                var tex = new Texture2D(Width, Height, TextureFormat.RGBA32, false);
                tex.ReadPixels(new Rect(0, 0, Width, Height), 0, 0);
                tex.Apply(false, false);
                RenderTexture.active = prev;
                cam.targetTexture = null;

                var bytes = tex.EncodeToPNG();
                Object.DestroyImmediate(tex);
                rt.Release();
                Object.DestroyImmediate(rt);

                Directory.CreateDirectory(ShareDirectory);
                var safeTitle = Sanitize(string.IsNullOrEmpty(run.theaterTitle) ? "theater" : run.theaterTitle);
                var file = $"genesis-{safeTitle}-{run.score}-{run.grade}-{System.DateTime.UtcNow:yyyyMMddHHmmss}.png";
                var path = Path.Combine(ShareDirectory, file);
                File.WriteAllBytes(path, bytes);
                LastPath = path;
                return path;
            }
            finally
            {
                Object.DestroyImmediate(root);
            }
        }

        static void BuildCard(Transform parent, RunSummary run)
        {
            var voidBg = new Color(0.043f, 0.071f, 0.125f, 1f);
            var panel = new Color(0.09f, 0.14f, 0.23f, 0.98f);
            var brass = new Color(0.961f, 0.647f, 0.141f, 1f); // orange accent #F5A524
            var brassMuted = new Color(0.663f, 0.702f, 0.769f, 0.95f); // #A9B3C4
            var ink = new Color(0.949f, 0.937f, 0.902f, 1f); // #F2EFE6
            var ember = new Color(0.961f, 0.647f, 0.141f, 1f);

            var bg = MakeImage(parent, "BG", voidBg);
            Stretch(bg.rectTransform);

            var plate = MakeImage(parent, "Plate", panel);
            var prt = plate.rectTransform;
            prt.anchorMin = new Vector2(0.06f, 0.08f);
            prt.anchorMax = new Vector2(0.94f, 0.92f);
            prt.offsetMin = prt.offsetMax = Vector2.zero;

            var v = plate.gameObject.AddComponent<VerticalLayoutGroup>();
            v.padding = new RectOffset(48, 48, 56, 48);
            v.spacing = 16f;
            v.childAlignment = TextAnchor.UpperCenter;
            v.childControlHeight = true;
            v.childControlWidth = true;
            v.childForceExpandWidth = true;
            v.childForceExpandHeight = false;

            Label(plate.transform, "GENESIS", 28, brass, 40f, FontStyle.Bold);
            Label(plate.transform, "LIVING ATLAS · AFTER ACTION", 20, brassMuted, 32f, FontStyle.Normal);

            string title = string.IsNullOrEmpty(run.theaterTitle) ? "THEATER" : run.theaterTitle.ToUpperInvariant();
            Label(plate.transform, Truncate(title, 42), 40, ink, 56f, FontStyle.Bold);

            string meta = BuildMetaLine(run);
            if (!string.IsNullOrEmpty(meta))
                Label(plate.transform, meta, 22, brassMuted, 36f, FontStyle.Normal);

            // Outcome from real score/grade mapping used on results screen — omit if no score context.
            string outcome = OutcomeFromRun(run);
            if (!string.IsNullOrEmpty(outcome))
                Label(plate.transform, outcome, 26, brass, 40f, FontStyle.Bold);

            Label(plate.transform, "CABINET SCORE", 20, brassMuted, 32f, FontStyle.Normal);
            Label(plate.transform, run.score.ToString(), 96, brass, 110f, FontStyle.Bold);

            if (!string.IsNullOrEmpty(run.grade))
                Label(plate.transform, run.grade.ToUpperInvariant(), 56, brass, 64f, FontStyle.Bold);

            string head = FirstNonEmpty(run.headline, run.closingLine);
            if (!string.IsNullOrEmpty(head))
                Label(plate.transform, Truncate(head, 96), 24, ink, 72f, FontStyle.Normal);

            if (!string.IsNullOrEmpty(run.topGainLine))
                Label(plate.transform, Truncate("↑ " + run.topGainLine, 64), 20, ink, 30f, FontStyle.Normal);
            if (!string.IsNullOrEmpty(run.topCostLine))
                Label(plate.transform, Truncate("↓ " + run.topCostLine, 64), 20, brassMuted, 30f, FontStyle.Normal);

            if (run.scarLines != null && run.scarLines.Count > 0)
            {
                Label(plate.transform, "SCARS LEFT ON THE DESK", 18, brassMuted, 28f, FontStyle.Bold);
                var n = Mathf.Min(4, run.scarLines.Count);
                for (var i = 0; i < n; i++)
                {
                    if (string.IsNullOrEmpty(run.scarLines[i])) continue;
                    Label(plate.transform, "· " + Truncate(run.scarLines[i], 48), 20, ink, 28f, FontStyle.Normal);
                }
            }

            Label(plate.transform, "Can you beat this desk?", 28, ember, 40f, FontStyle.Bold);
            Label(plate.transform, "Play Genesis — real geography, real history.", 18, brassMuted, 30f, FontStyle.Normal);
        }

        static string BuildMetaLine(RunSummary run)
        {
            var parts = new System.Collections.Generic.List<string>();
            if (run.year > 0) parts.Add(run.year.ToString());
            if (run.phasesTotal > 0)
                parts.Add($"{run.phasesCompleted}/{run.phasesTotal} phases");
            if (!string.IsNullOrEmpty(run.pathFamily))
                parts.Add(run.pathFamily.Replace('_', ' ').ToUpperInvariant());
            return parts.Count == 0 ? "" : string.Join("  ·  ", parts);
        }

        /// <summary>Maps score to the same titles shown on the results screen. No invented ranks.</summary>
        static string OutcomeFromRun(RunSummary run)
        {
            if (run == null) return "";
            // Prefer explicit grade letter as the outcome badge; title from score bands used in UI.
            string title = GradeTitle(run.score);
            return string.IsNullOrEmpty(title) ? "" : title.ToUpperInvariant();
        }

        static string GradeTitle(int score)
        {
            if (score >= 90) return "Master Strategist";
            if (score >= 80) return "Steady Hand";
            if (score >= 70) return "Pragmatic Course";
            if (score >= 60) return "Fragile Equilibrium";
            return "Volatile Standoff";
        }

        static string FirstNonEmpty(params string[] values)
        {
            if (values == null) return "";
            foreach (var v in values)
                if (!string.IsNullOrEmpty(v)) return v;
            return "";
        }

        static Image MakeImage(Transform parent, string name, Color c)
        {
            var go = new GameObject(name);
            go.transform.SetParent(parent, false);
            go.layer = 31;
            var img = go.AddComponent<Image>();
            img.color = c;
            img.raycastTarget = false;
            return img;
        }

        static void Label(
            Transform parent, string value, int size, Color color, float height, FontStyle style)
        {
            var go = new GameObject("Label");
            go.transform.SetParent(parent, false);
            go.layer = 31;
            go.AddComponent<RectTransform>();
            var le = go.AddComponent<LayoutElement>();
            le.minHeight = height;
            le.preferredHeight = height;
            var t = go.AddComponent<Text>();
            t.text = value ?? "";
            t.fontSize = size;
            t.color = color;
            t.fontStyle = style;
            t.alignment = TextAnchor.MiddleCenter;
            t.horizontalOverflow = HorizontalWrapMode.Wrap;
            t.verticalOverflow = VerticalWrapMode.Truncate;
            t.raycastTarget = false;
            // Built-in Arial is acceptable for share bitmap; avoids SDF dependency offscreen.
        }

        static void Stretch(RectTransform rt)
        {
            rt.anchorMin = Vector2.zero;
            rt.anchorMax = Vector2.one;
            rt.offsetMin = rt.offsetMax = Vector2.zero;
        }

        static string Truncate(string s, int max)
        {
            if (string.IsNullOrEmpty(s)) return "";
            return s.Length <= max ? s : s.Substring(0, max - 1) + "…";
        }

        static string Sanitize(string s)
        {
            var chars = s.ToLowerInvariant().ToCharArray();
            for (var i = 0; i < chars.Length; i++)
            {
                var c = chars[i];
                if (!(c is >= 'a' and <= 'z' or >= '0' and <= '9')) chars[i] = '-';
            }

            return new string(chars).Trim('-');
        }
    }
}
