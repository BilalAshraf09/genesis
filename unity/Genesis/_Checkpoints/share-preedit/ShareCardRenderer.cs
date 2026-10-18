using System.IO;
using UnityEngine;
using UnityEngine.UI;
using Genesis.UI;

namespace Genesis.Core
{
    /// <summary>
    /// Phase 3 viral close — DOWNLOAD renders a cabinet share card to PNG (not a clipboard stub).
    /// Offscreen uGUI → Camera → RenderTexture → EncodeToPNG under persistentDataPath.
    /// </summary>
    public static class ShareCardRenderer
    {
        const int Width = 1080;
        const int Height = 1350;

        public static string LastPath { get; private set; }

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
                cam.backgroundColor = new Color(0.039f, 0.035f, 0.031f, 1f);
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

                var dir = Path.Combine(Application.persistentDataPath, "ShareCards");
                Directory.CreateDirectory(dir);
                var safeTitle = Sanitize(string.IsNullOrEmpty(run.theaterTitle) ? "theater" : run.theaterTitle);
                var file = $"genesis-{safeTitle}-{run.score}-{run.grade}-{System.DateTime.UtcNow:yyyyMMddHHmmss}.png";
                var path = Path.Combine(dir, file);
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
            var voidBg = new Color(0.039f, 0.035f, 0.031f, 1f);
            var panel = new Color(0.086f, 0.071f, 0.055f, 0.96f);
            var brass = new Color(0.878f, 0.753f, 0.471f, 1f);
            var brassMuted = new Color(0.62f, 0.545f, 0.396f, 0.95f);
            var ink = new Color(0.788f, 0.733f, 0.627f, 1f);
            var ember = new Color(0.831f, 0.471f, 0.227f, 1f);

            var bg = MakeImage(parent, "BG", voidBg);
            Stretch(bg.rectTransform);

            var plate = MakeImage(parent, "Plate", panel);
            var prt = plate.rectTransform;
            prt.anchorMin = new Vector2(0.06f, 0.08f);
            prt.anchorMax = new Vector2(0.94f, 0.92f);
            prt.offsetMin = prt.offsetMax = Vector2.zero;

            var v = plate.gameObject.AddComponent<VerticalLayoutGroup>();
            v.padding = new RectOffset(48, 48, 56, 48);
            v.spacing = 18f;
            v.childAlignment = TextAnchor.UpperCenter;
            v.childControlHeight = true;
            v.childControlWidth = true;
            v.childForceExpandWidth = true;
            v.childForceExpandHeight = false;

            Label(plate.transform, "GENESIS · AFTER ACTION", 22, brassMuted, 36f, FontStyle.Bold);
            Label(plate.transform,
                string.IsNullOrEmpty(run.theaterTitle) ? "THEATER" : run.theaterTitle.ToUpperInvariant(),
                42, brass, 56f, FontStyle.Bold);
            Label(plate.transform,
                $"{(run.year > 0 ? run.year.ToString() : "—")}  ·  {(string.IsNullOrEmpty(run.pathFamily) ? "MIXED" : run.pathFamily.Replace('_', ' ').ToUpperInvariant())}",
                22, ink, 36f, FontStyle.Normal);

            Label(plate.transform, "CABINET SCORE", 20, brassMuted, 32f, FontStyle.Normal);
            Label(plate.transform, run.score.ToString(), 96, brass, 110f, FontStyle.Bold);
            Label(plate.transform, string.IsNullOrEmpty(run.grade) ? "—" : run.grade,
                56, brass, 64f, FontStyle.Bold);

            var head = string.IsNullOrEmpty(run.headline)
                ? (string.IsNullOrEmpty(run.closingLine) ? "World course locked." : run.closingLine)
                : run.headline;
            Label(plate.transform, Truncate(head, 96), 24, ink, 72f, FontStyle.Normal);

            Label(plate.transform, $"BEAT MY PATH · score {run.score}", 28, ember, 40f, FontStyle.Bold);
            Label(plate.transform, "genesis · cabinet war table", 18, brassMuted, 30f, FontStyle.Normal);

            if (run.scarLines != null && run.scarLines.Count > 0)
            {
                Label(plate.transform, "SCARS LEFT ON THE DESK", 18, brassMuted, 28f, FontStyle.Bold);
                var n = Mathf.Min(4, run.scarLines.Count);
                for (var i = 0; i < n; i++)
                    Label(plate.transform, "· " + run.scarLines[i], 20, ink, 28f, FontStyle.Normal);
            }
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
