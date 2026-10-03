using UnityEngine;
using UnityEngine.UI;

namespace Genesis.Core
{
    /// <summary>Boot splash → MainMenu. First scene in build settings.</summary>
    public class BootController : MonoBehaviour
    {
        public float holdSeconds = 1.35f;
        float _t;
        bool _done;

        void Awake()
        {
            Application.targetFrameRate = 60;
            EnsureCamera();
            EnsureCanvas();
        }

        void Update()
        {
            if (_done) return;
            _t += Time.unscaledDeltaTime;
            if (_t >= holdSeconds || Input.anyKeyDown || Input.GetMouseButtonDown(0))
            {
                _done = true;
                AppFlow.GoMainMenu();
            }
        }

        static void EnsureCamera()
        {
            if (Camera.main != null) return;
            var go = new GameObject("BootCamera");
            var cam = go.AddComponent<Camera>();
            cam.clearFlags = CameraClearFlags.SolidColor;
            cam.backgroundColor = new Color(0.04f, 0.035f, 0.03f);
            cam.tag = "MainCamera";
            go.AddComponent<AudioListener>();
        }

        void EnsureCanvas()
        {
            if (FindFirstObjectByType<Canvas>() != null) return;
            var canvasGo = new GameObject("BootCanvas");
            var canvas = canvasGo.AddComponent<Canvas>();
            canvas.renderMode = RenderMode.ScreenSpaceOverlay;

            // Inline portrait scaler.
            var scaler = canvasGo.AddComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(1080f, 1920f);
            scaler.screenMatchMode = CanvasScaler.ScreenMatchMode.MatchWidthOrHeight;
            scaler.matchWidthOrHeight = 0.55f;
            canvasGo.AddComponent<GraphicRaycaster>();

            // Full-stretch safe-area root (no polling fitter needed for 1.35 s splash).
            var safeGo = new GameObject("SafeArea");
            safeGo.transform.SetParent(canvasGo.transform, false);
            var root = safeGo.AddComponent<RectTransform>();
            root.anchorMin = Vector2.zero;
            root.anchorMax = Vector2.one;
            root.offsetMin = root.offsetMax = Vector2.zero;

            var title = CreateText(root, "GENESIS", 64, new Vector2(0.5f, 0.55f));
            title.color = new Color(0.86f, 0.74f, 0.48f);
            title.fontStyle = FontStyle.Bold;

            var sub = CreateText(root, "DECISION WORLDS", 22, new Vector2(0.5f, 0.46f));
            sub.color = new Color(0.7f, 0.66f, 0.58f);

            var hint = CreateText(root, "CLICK TO CONTINUE", 16, new Vector2(0.5f, 0.18f));
            hint.color = new Color(0.55f, 0.5f, 0.42f);
        }

        static UnityEngine.UI.Text CreateText(Transform parent, string value, int size, Vector2 anchor)
        {
            var go = new GameObject(value);
            go.transform.SetParent(parent, false);
            var rt = go.AddComponent<RectTransform>();
            rt.anchorMin = anchor;
            rt.anchorMax = anchor;
            rt.pivot = new Vector2(0.5f, 0.5f);
            rt.sizeDelta = new Vector2(900, 80);
            var t = go.AddComponent<UnityEngine.UI.Text>();
            t.text = value;
            t.fontSize = size;
            t.alignment = TextAnchor.MiddleCenter;
            // Font defaults to built-in Arial — sufficient for the 1.35 s boot splash.
            return t;
        }
    }
}
