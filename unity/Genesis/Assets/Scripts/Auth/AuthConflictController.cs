using Genesis.UI.Toolkit;
using UnityEngine;
using UnityEngine.UIElements;

namespace Genesis.Auth
{
    /// <summary>
    /// Shown when linking fails because the provider already belongs to another account.
    /// Guest session and local backup remain intact.
    /// </summary>
    public sealed class AuthConflictController : MonoBehaviour
    {
        static AuthConflictController _instance;

        UIDocument _doc;
        VisualElement _overlay;
        Label _message;
        Label _signInLabel;
        AuthResult _pending;

        public static void Show(AuthResult conflict)
        {
            var ctrl = Ensure();
            ctrl._pending = conflict;
            ctrl.Open();
        }

        static AuthConflictController Ensure()
        {
            if (_instance != null) return _instance;
            var existing = FindAnyObjectByType<AuthConflictController>();
            if (existing != null) return _instance = existing;
            var go = new GameObject("AuthConflict");
            if (Application.isPlaying) DontDestroyOnLoad(go);
            return _instance = go.AddComponent<AuthConflictController>();
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

        void BuildUi()
        {
            _doc = UiRegistry.CreateDocument("AuthConflict", transform, 62, "AuthConflict", "AuthConflict");
            _overlay = _doc.rootVisualElement?.Q("conflictOverlay") ?? _doc.rootVisualElement;
            if (_overlay == null) return;
            _overlay.pickingMode = PickingMode.Position;
            _message = _overlay.Q<Label>("messageLabel");
            _signInLabel = _overlay.Q<Label>("signInBtnLabel");

            var signIn = _overlay.Q<Button>("signInBtn");
            if (signIn != null)
                signIn.clicked += () =>
                {
                    Close();
                    var hint = _pending?.ConflictProviderHint ?? "";
                    if (hint.IndexOf("Google", System.StringComparison.OrdinalIgnoreCase) >= 0)
                        _ = AuthService.Instance.SignInWithGoogle();
                    else if (hint.IndexOf("Apple", System.StringComparison.OrdinalIgnoreCase) >= 0)
                        _ = AuthService.Instance.SignInWithApple();
                    else
                        AuthEmailController.Show(AuthEmailMode.Login);
                };

            var cancel = _overlay.Q<Button>("cancelBtn");
            if (cancel != null) cancel.clicked += Close;

            _overlay.AddToClassList("hidden");
        }

        void Open()
        {
            if (_overlay == null) BuildUi();
            if (_message != null)
                _message.text = _pending?.Error ?? "This identity belongs to another account.";
            if (_signInLabel != null)
            {
                var hint = _pending?.ConflictProviderHint;
                _signInLabel.text = string.IsNullOrEmpty(hint)
                    ? "SIGN IN TO EXISTING ACCOUNT"
                    : $"SIGN IN WITH {hint.ToUpperInvariant()}";
            }

            _overlay?.RemoveFromClassList("hidden");
        }

        void Close()
        {
            _overlay?.AddToClassList("hidden");
        }
    }
}
