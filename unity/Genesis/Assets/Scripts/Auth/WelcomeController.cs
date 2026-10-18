using Genesis.Core;
using Genesis.UI.Toolkit;
using UnityEngine;
using UnityEngine.UIElements;

namespace Genesis.Auth
{
    /// <summary>
    /// First-launch welcome overlay. Guest is always the primary path.
    /// Sorting order 60 (above paywall).
    /// </summary>
    public sealed class WelcomeController : MonoBehaviour
    {
        static WelcomeController _instance;

        UIDocument _doc;
        VisualElement _root;
        Label _status;
        Button _guestBtn;
        Button _googleBtn;
        Button _appleBtn;
        System.Action _onFinished;

        public static void ShowIfNeeded(System.Action onFinished)
        {
            var auth = AuthService.Instance;
            if (auth.HasCompletedWelcome)
            {
                onFinished?.Invoke();
                return;
            }

            var ctrl = Ensure();
            ctrl._onFinished = onFinished;
            ctrl.Open();
        }

        public static void Show(System.Action onFinished = null)
        {
            var ctrl = Ensure();
            ctrl._onFinished = onFinished;
            ctrl.Open();
        }

        static WelcomeController Ensure()
        {
            if (_instance != null) return _instance;
            var existing = FindAnyObjectByType<WelcomeController>();
            if (existing != null)
            {
                _instance = existing;
                return _instance;
            }

            var go = new GameObject("Welcome");
            if (Application.isPlaying) DontDestroyOnLoad(go);
            _instance = go.AddComponent<WelcomeController>();
            return _instance;
        }

        void Awake()
        {
            if (_instance != null && _instance != this)
            {
                Destroy(gameObject);
                return;
            }

            _instance = this;
            if (Application.isPlaying) DontDestroyOnLoad(gameObject);
            BuildUi();
        }

        void OnEnable()
        {
            AuthService.Instance.StateChanged += Refresh;
        }

        void OnDisable()
        {
            if (AuthService.Instance != null)
                AuthService.Instance.StateChanged -= Refresh;
        }

        void BuildUi()
        {
            _doc = UiRegistry.CreateDocument("Welcome", transform, 60, "Welcome", "Welcome");
            _root = _doc.rootVisualElement?.Q("welcomeRoot") ?? _doc.rootVisualElement;
            if (_root == null) return;

            _root.pickingMode = PickingMode.Position;
            _status = _root.Q<Label>("statusLabel");
            _guestBtn = _root.Q<Button>("guestBtn");
            _googleBtn = _root.Q<Button>("googleBtn");
            _appleBtn = _root.Q<Button>("appleBtn");

            if (_guestBtn != null)
                _guestBtn.clicked += async () =>
                {
                    var r = await AuthService.Instance.ContinueAsGuest();
                    if (r.Success) Finish();
                };

            if (_googleBtn != null)
                _googleBtn.clicked += async () =>
                {
                    var r = await AuthService.Instance.SignInWithGoogle();
                    if (r.Success) Finish();
                };

            if (_appleBtn != null)
            {
#if UNITY_IOS || UNITY_EDITOR
                _appleBtn.style.display = DisplayStyle.Flex;
#else
                // Apple button still shown on Android when Firebase Apple web flow is configured.
                _appleBtn.style.display = DisplayStyle.Flex;
#endif
                _appleBtn.clicked += async () =>
                {
                    var r = await AuthService.Instance.SignInWithApple();
                    if (r.Success) Finish();
                };
            }

            Wire(_root, "emailSignUpBtn", () => AuthEmailController.Show(AuthEmailMode.SignUp, Finish));
            Wire(_root, "emailLoginBtn", () => AuthEmailController.Show(AuthEmailMode.Login, Finish));

            _root.AddToClassList("hidden");
            Refresh();
        }

        void Open()
        {
            if (_root == null) BuildUi();
            _ = AuthService.Instance.InitializeAsync();
            _root?.RemoveFromClassList("hidden");
            Refresh();
        }

        void Finish()
        {
            _root?.AddToClassList("hidden");
            var cb = _onFinished;
            _onFinished = null;
            cb?.Invoke();
        }

        void Refresh()
        {
            if (_root == null || _root.ClassListContains("hidden")) return;
            var auth = AuthService.Instance;

            if (_status != null)
            {
                _status.RemoveFromClassList("welcome-status--error");
                string text = auth.UiState switch
                {
                    AuthUiState.Busy => "Working…",
                    AuthUiState.Failed or AuthUiState.Offline => auth.LastError,
                    AuthUiState.Cancelled => auth.LastError,
                    AuthUiState.Conflict => auth.LastError,
                    _ => ""
                };
                if (auth.UiState is AuthUiState.Failed or AuthUiState.Offline or AuthUiState.Conflict)
                    _status.AddToClassList("welcome-status--error");
                _status.text = text ?? "";
            }

            bool busy = auth.IsBusy;
            _guestBtn?.SetEnabled(!busy);
            _googleBtn?.SetEnabled(!busy);
            _appleBtn?.SetEnabled(!busy);
        }

        static void Wire(VisualElement root, string name, System.Action action)
        {
            var btn = root.Q<Button>(name);
            if (btn != null) btn.clicked += action;
        }
    }
}
