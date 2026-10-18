using System;
using System.Threading.Tasks;
using Genesis.Monetization;
using UnityEngine;

namespace Genesis.Auth
{
    /// <summary>
    /// Central authentication service. Guest play never requires registration.
    /// Theater unlock remains owned by IapPurchaseService — auth never grants premium.
    /// </summary>
    public sealed class AuthService : MonoBehaviour
    {
        const string PrefWelcomeDone = "Genesis.Auth.WelcomeCompleted";

        static AuthService _instance;
        IAuthBackend _backend;
        AuthUiState _uiState = AuthUiState.Idle;
        string _lastError = "";
        bool _initStarted;

        public static AuthService Instance
        {
            get
            {
                if (_instance != null) return _instance;
                _instance = FindAnyObjectByType<AuthService>();
                if (_instance != null) return _instance;

                var go = new GameObject("AuthService");
                if (Application.isPlaying)
                    DontDestroyOnLoad(go);
                _instance = go.AddComponent<AuthService>();
                return _instance;
            }
        }

        public AuthUser CurrentUser => _backend?.CurrentUser ?? new AuthUser();
        public bool IsSignedIn => CurrentUser.IsSignedIn;
        public bool IsGuest => CurrentUser.IsGuest;
        public bool IsRegistered => CurrentUser.IsRegistered;
        public bool ProvidersAvailable => _backend != null && _backend.ProvidersAvailable;
        public string BackendName => _backend?.BackendName ?? "None";
        public AuthUiState UiState => _uiState;
        public string LastError => _lastError ?? "";
        public bool IsBusy => _uiState == AuthUiState.Busy;
        public bool HasCompletedWelcome =>
            PlayerPrefs.GetInt(PrefWelcomeDone, 0) == 1 || IsSignedIn;

        public event Action StateChanged;

        void Awake()
        {
            if (_instance != null && _instance != this)
            {
                Destroy(gameObject);
                return;
            }

            _instance = this;
            if (Application.isPlaying)
                DontDestroyOnLoad(gameObject);
            EnsureBackend();
        }

        void Start()
        {
            _ = InitializeAsync();
        }

        void EnsureBackend()
        {
            if (_backend != null) return;
#if GENESIS_FIREBASE
            _backend = new FirebaseAuthBackend();
#else
            _backend = new OfflineGuestAuthBackend();
#endif
            Debug.Log($"[Genesis Auth] Backend: {_backend.BackendName}");
        }

        public async Task InitializeAsync()
        {
            if (_initStarted) return;
            _initStarted = true;
            EnsureBackend();
            SetBusy();
            try
            {
                await _backend.InitializeAsync();
                if (IsSignedIn && IsGuest)
                    ProgressMigration.RememberGuestUid(CurrentUser.UserId);
                if (ProgressMigration.HasPendingMigration)
                    ProgressMigration.MergeBackupIntoCurrent(
                        ProgressMigration.LastGuestUid);
                SetIdle();
            }
            catch (Exception ex)
            {
                Fail(ex.Message);
            }
        }

        public async Task<AuthResult> ContinueAsGuest()
        {
            if (IsBusy) return AuthResult.Fail("Busy.");
            SetBusy();
            try
            {
                var result = await _backend.ContinueAsGuestAsync();
                ApplyResult(result);
                if (result.Success)
                    MarkWelcomeCompleted();
                return result;
            }
            catch (Exception ex)
            {
                return Fail(ex.Message);
            }
        }

        public async Task<AuthResult> SignInWithGoogle()
        {
            if (IsBusy) return AuthResult.Fail("Busy.");
            SetBusy();
            try
            {
                // Prefer link while guest so UID + local progress are preserved.
                AuthResult result = IsGuest
                    ? await _backend.LinkGuestWithGoogleAsync()
                    : await _backend.SignInWithGoogleAsync();

                // If link failed because Firebase isn't configured / plugin missing, surface error.
                // Conflict is handled inside ApplyResult (keeps guest signed in).
                ApplyResult(result);
                if (result.Success)
                {
                    MarkWelcomeCompleted();
                    AfterAuthSuccess();
                }

                return result;
            }
            catch (Exception ex)
            {
                return Fail(ex.Message);
            }
        }

        public async Task<AuthResult> SignInWithApple()
        {
            if (IsBusy) return AuthResult.Fail("Busy.");
            SetBusy();
            try
            {
                AuthResult result = IsGuest
                    ? await _backend.LinkGuestWithAppleAsync()
                    : await _backend.SignInWithAppleAsync();

                ApplyResult(result);
                if (result.Success)
                {
                    MarkWelcomeCompleted();
                    AfterAuthSuccess();
                }

                return result;
            }
            catch (Exception ex)
            {
                return Fail(ex.Message);
            }
        }

        public async Task<AuthResult> SignUpWithEmail(string email, string password, string confirmPassword)
        {
            if (IsBusy) return AuthResult.Fail("Busy.");
            if (password != confirmPassword)
                return Fail("Passwords do not match.");

            SetBusy();
            try
            {
                if (IsGuest)
                    ProgressMigration.SnapshotLocalProgress(CurrentUser.UserId);

                var result = IsGuest
                    ? await _backend.LinkGuestWithEmailAsync(email, password)
                    : await _backend.SignUpWithEmailAsync(email, password);

                ApplyResult(result);
                if (result.Success)
                {
                    MarkWelcomeCompleted();
                    AfterAuthSuccess();
                }

                return result;
            }
            catch (Exception ex)
            {
                return Fail(ex.Message);
            }
        }

        public async Task<AuthResult> SignInWithEmail(string email, string password)
        {
            if (IsBusy) return AuthResult.Fail("Busy.");
            SetBusy();
            try
            {
                // Snapshot guest progress before switching accounts.
                if (IsGuest)
                    ProgressMigration.SnapshotLocalProgress(CurrentUser.UserId);

                var result = await _backend.SignInWithEmailAsync(email, password);
                ApplyResult(result);
                if (result.Success)
                {
                    // Merge guest snapshot into the signed-in account (max PB scores).
                    if (!string.IsNullOrEmpty(ProgressMigration.LastGuestUid))
                        ProgressMigration.MergeBackupIntoCurrent(ProgressMigration.LastGuestUid);
                    MarkWelcomeCompleted();
                    AfterAuthSuccess();
                }

                return result;
            }
            catch (Exception ex)
            {
                return Fail(ex.Message);
            }
        }

        public async Task<AuthResult> SendPasswordReset(string email)
        {
            if (IsBusy) return AuthResult.Fail("Busy.");
            SetBusy();
            try
            {
                var result = await _backend.SendPasswordResetAsync(email);
                ApplyResult(result, keepUser: true);
                if (result.Success)
                {
                    _lastError = "Password reset email sent.";
                    _uiState = AuthUiState.Success;
                    Raise();
                }

                return result;
            }
            catch (Exception ex)
            {
                return Fail(ex.Message);
            }
        }

        public async Task SignOut()
        {
            if (IsBusy) return;
            SetBusy();
            try
            {
                await _backend.SignOutAsync();
                _uiState = AuthUiState.Idle;
                _lastError = "";
                Raise();
            }
            catch (Exception ex)
            {
                Fail(ex.Message);
            }
        }

        public async Task RefreshSession()
        {
            EnsureBackend();
            await _backend.RefreshSessionAsync();
            Raise();
        }

        public void MarkWelcomeCompleted()
        {
            PlayerPrefs.SetInt(PrefWelcomeDone, 1);
            PlayerPrefs.Save();
        }

        public void ClearWelcomeCompletedForDebug()
        {
            PlayerPrefs.DeleteKey(PrefWelcomeDone);
            PlayerPrefs.Save();
        }

        void AfterAuthSuccess()
        {
            // Reconcile store entitlements — never grant from auth alone.
            try { IapPurchaseService.Instance?.RefreshEntitlements(); }
            catch (Exception ex)
            {
                Debug.LogWarning($"[Genesis Auth] IAP refresh after auth: {ex.Message}");
            }
        }

        void ApplyResult(AuthResult result, bool keepUser = false)
        {
            if (result == null)
            {
                Fail("Unknown auth error.");
                return;
            }

            if (result.Cancelled)
            {
                _uiState = AuthUiState.Cancelled;
                _lastError = result.Error;
                Raise();
                return;
            }

            if (result.Conflict)
            {
                _uiState = AuthUiState.Conflict;
                _lastError = result.Error;
                Raise();
                AuthConflictController.Show(result);
                return;
            }

            if (!result.Success)
            {
                Fail(result.Error);
                return;
            }

            _uiState = AuthUiState.Success;
            _lastError = "";
            Raise();
            // Return to idle shortly so buttons re-enable.
            _uiState = AuthUiState.Idle;
            Raise();
        }

        void SetBusy()
        {
            _uiState = AuthUiState.Busy;
            _lastError = "";
            Raise();
        }

        void SetIdle()
        {
            _uiState = AuthUiState.Idle;
            Raise();
        }

        AuthResult Fail(string error)
        {
            _uiState = string.IsNullOrEmpty(error) &&
                       Application.internetReachability == NetworkReachability.NotReachable
                ? AuthUiState.Offline
                : AuthUiState.Failed;
            _lastError = string.IsNullOrEmpty(error) ? "Authentication failed." : error;
            Raise();
            return AuthResult.Fail(_lastError);
        }

        void Raise() => StateChanged?.Invoke();
    }
}
