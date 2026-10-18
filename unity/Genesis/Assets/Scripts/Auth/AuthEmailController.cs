using Genesis.UI.Toolkit;
using UnityEngine;
using UnityEngine.UIElements;

namespace Genesis.Auth
{
    public enum AuthEmailMode
    {
        SignUp,
        Login,
        Reset
    }

    public sealed class AuthEmailController : MonoBehaviour
    {
        static AuthEmailController _instance;

        UIDocument _doc;
        VisualElement _overlay;
        Label _title;
        Label _body;
        Label _status;
        Label _primaryLabel;
        Label _switchLabel;
        Label _togglePwLabel;
        TextField _email;
        TextField _password;
        TextField _confirm;
        Button _primary;
        Button _forgot;
        Button _togglePw;
        AuthEmailMode _mode = AuthEmailMode.SignUp;
        bool _passwordVisible;
        System.Action _onSuccess;

        public static void Show(AuthEmailMode mode, System.Action onSuccess = null)
        {
            var ctrl = Ensure();
            ctrl._mode = mode;
            ctrl._onSuccess = onSuccess;
            ctrl.Open();
        }

        static AuthEmailController Ensure()
        {
            if (_instance != null) return _instance;
            var existing = FindAnyObjectByType<AuthEmailController>();
            if (existing != null) return _instance = existing;
            var go = new GameObject("AuthEmail");
            if (Application.isPlaying) DontDestroyOnLoad(go);
            return _instance = go.AddComponent<AuthEmailController>();
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

        void OnEnable() => AuthService.Instance.StateChanged += Refresh;
        void OnDisable()
        {
            if (AuthService.Instance != null)
                AuthService.Instance.StateChanged -= Refresh;
        }

        void BuildUi()
        {
            _doc = UiRegistry.CreateDocument("AuthEmail", transform, 61, "AuthEmail", "AuthEmail");
            _overlay = _doc.rootVisualElement?.Q("authEmailOverlay") ?? _doc.rootVisualElement;
            if (_overlay == null) return;
            _overlay.pickingMode = PickingMode.Position;

            _title = _overlay.Q<Label>("titleLabel");
            _body = _overlay.Q<Label>("bodyLabel");
            _status = _overlay.Q<Label>("statusLabel");
            _email = _overlay.Q<TextField>("emailField");
            _password = _overlay.Q<TextField>("passwordField");
            _confirm = _overlay.Q<TextField>("confirmField");
            _primary = _overlay.Q<Button>("primaryBtn");
            _primaryLabel = _overlay.Q<Label>("primaryBtnLabel");
            _forgot = _overlay.Q<Button>("forgotBtn");
            _switchLabel = _overlay.Q<Label>("switchModeLabel");
            _togglePw = _overlay.Q<Button>("togglePasswordBtn");
            _togglePwLabel = _overlay.Q<Label>("togglePasswordLabel");

            Wire(_overlay, "closeBtn", Close);
            Wire(_overlay, "backBtn", Close);

            if (_primary != null)
                _primary.clicked += OnPrimary;
            if (_forgot != null)
                _forgot.clicked += () =>
                {
                    _mode = AuthEmailMode.Reset;
                    ApplyMode();
                };
            Wire(_overlay, "switchModeBtn", () =>
            {
                if (_mode == AuthEmailMode.Reset)
                    _mode = AuthEmailMode.Login;
                else
                    _mode = _mode == AuthEmailMode.SignUp ? AuthEmailMode.Login : AuthEmailMode.SignUp;
                ApplyMode();
            });

            if (_togglePw != null)
                _togglePw.clicked += () =>
                {
                    _passwordVisible = !_passwordVisible;
                    if (_password != null) _password.isPasswordField = !_passwordVisible;
                    if (_confirm != null) _confirm.isPasswordField = !_passwordVisible;
                    if (_togglePwLabel != null)
                        _togglePwLabel.text = _passwordVisible ? "HIDE" : "SHOW";
                };

            _overlay.AddToClassList("hidden");
        }

        void Open()
        {
            if (_overlay == null) BuildUi();
            ApplyMode();
            _overlay?.RemoveFromClassList("hidden");
            Refresh();
        }

        void Close()
        {
            _overlay?.AddToClassList("hidden");
        }

        void ApplyMode()
        {
            switch (_mode)
            {
                case AuthEmailMode.Login:
                    if (_title != null) _title.text = "LOG IN";
                    if (_body != null) _body.text = "Sign in to your Genesis account.";
                    if (_primaryLabel != null) _primaryLabel.text = "LOG IN";
                    if (_switchLabel != null) _switchLabel.text = "Need an account? Sign up";
                    _password?.RemoveFromClassList("hidden");
                    _confirm?.AddToClassList("hidden");
                    if (_togglePw != null) _togglePw.style.display = DisplayStyle.Flex;
                    if (_forgot != null) _forgot.style.display = DisplayStyle.Flex;
                    break;
                case AuthEmailMode.Reset:
                    if (_title != null) _title.text = "RESET PASSWORD";
                    if (_body != null) _body.text = "We'll email you a reset link.";
                    if (_primaryLabel != null) _primaryLabel.text = "SEND RESET LINK";
                    if (_switchLabel != null) _switchLabel.text = "Back to log in";
                    _password?.AddToClassList("hidden");
                    _confirm?.AddToClassList("hidden");
                    if (_togglePw != null) _togglePw.style.display = DisplayStyle.None;
                    if (_forgot != null) _forgot.style.display = DisplayStyle.None;
                    break;
                default:
                    if (_title != null) _title.text = "SIGN UP";
                    if (_body != null) _body.text = "Create an account. Guest progress stays on this device.";
                    if (_primaryLabel != null) _primaryLabel.text = "CREATE ACCOUNT";
                    if (_switchLabel != null) _switchLabel.text = "Already have an account? Log in";
                    _password?.RemoveFromClassList("hidden");
                    _confirm?.RemoveFromClassList("hidden");
                    if (_togglePw != null) _togglePw.style.display = DisplayStyle.Flex;
                    if (_forgot != null) _forgot.style.display = DisplayStyle.None;
                    break;
            }
        }

        async void OnPrimary()
        {
            var auth = AuthService.Instance;
            string email = _email?.value?.Trim() ?? "";
            string password = _password?.value ?? "";
            string confirm = _confirm?.value ?? "";

            AuthResult result;
            switch (_mode)
            {
                case AuthEmailMode.Login:
                    result = await auth.SignInWithEmail(email, password);
                    break;
                case AuthEmailMode.Reset:
                    result = await auth.SendPasswordReset(email);
                    break;
                default:
                    result = await auth.SignUpWithEmail(email, password, confirm);
                    break;
            }

            if (result.Success)
            {
                if (_mode == AuthEmailMode.Reset)
                {
                    if (_status != null)
                    {
                        _status.text = "Check your email for a reset link.";
                        _status.AddToClassList("auth-email-status--ok");
                    }

                    return;
                }

                Close();
                var cb = _onSuccess;
                _onSuccess = null;
                cb?.Invoke();
            }
        }

        void Refresh()
        {
            if (_overlay == null || _overlay.ClassListContains("hidden")) return;
            var auth = AuthService.Instance;
            if (_status != null)
            {
                _status.RemoveFromClassList("auth-email-status--error");
                _status.RemoveFromClassList("auth-email-status--ok");
                if (auth.UiState is AuthUiState.Failed or AuthUiState.Offline or AuthUiState.Conflict)
                {
                    _status.text = auth.LastError;
                    _status.AddToClassList("auth-email-status--error");
                }
                else if (auth.UiState == AuthUiState.Busy)
                {
                    _status.text = "Working…";
                }
                else if (auth.UiState == AuthUiState.Success && _mode == AuthEmailMode.Reset)
                {
                    _status.text = auth.LastError;
                    _status.AddToClassList("auth-email-status--ok");
                }
                else if (auth.UiState != AuthUiState.Success)
                {
                    _status.text = "";
                }
            }

            _primary?.SetEnabled(!auth.IsBusy);
        }

        static void Wire(VisualElement root, string name, System.Action action)
        {
            var btn = root.Q<Button>(name);
            if (btn != null) btn.clicked += action;
        }
    }
}
