#if GENESIS_FIREBASE
using System;
using System.Threading.Tasks;
using Firebase;
using Firebase.Auth;
using UnityEngine;

namespace Genesis.Auth
{
    /// <summary>
    /// Firebase Authentication backend: Anonymous guest, email/password, Google, Apple.
    /// Guest upgrade uses LinkWithCredentialAsync so the Firebase UID (and local progress) stay intact.
    /// </summary>
    public sealed class FirebaseAuthBackend : IAuthBackend
    {
        FirebaseAuth _auth;
        AuthUser _user = new();

        public string BackendName => "Firebase";
        public bool ProvidersAvailable => _auth != null;
        public AuthUser CurrentUser => _user;

        public async Task InitializeAsync()
        {
            var status = await FirebaseApp.CheckAndFixDependenciesAsync();
            if (status != DependencyStatus.Available)
            {
                Debug.LogError($"[Genesis Auth] Firebase dependencies not available: {status}");
                _auth = null;
                _user = new AuthUser();
                return;
            }

            _auth = FirebaseAuth.DefaultInstance;
            _auth.StateChanged -= OnAuthStateChanged;
            _auth.StateChanged += OnAuthStateChanged;
            _user = Map(_auth.CurrentUser);
        }

        void OnAuthStateChanged(object sender, EventArgs e)
        {
            _user = Map(_auth?.CurrentUser);
        }

        public async Task<AuthResult> ContinueAsGuestAsync()
        {
            if (_auth == null) return AuthResult.Fail("Firebase not initialized.");
            if (_auth.CurrentUser != null)
            {
                _user = Map(_auth.CurrentUser);
                if (_user.IsAnonymous)
                    ProgressMigration.RememberGuestUid(_user.UserId);
                return AuthResult.Ok(_user);
            }

            try
            {
                var result = await _auth.SignInAnonymouslyAsync();
                _user = Map(result.User);
                ProgressMigration.RememberGuestUid(_user.UserId);
                return AuthResult.Ok(_user);
            }
            catch (Exception ex)
            {
                return AuthResult.Fail(Friendly(ex));
            }
        }

        public Task<AuthResult> SignInWithGoogleAsync() =>
            SignInOrLinkGoogleAsync(link: false);

        public Task<AuthResult> LinkGuestWithGoogleAsync() =>
            SignInOrLinkGoogleAsync(link: true);

        async Task<AuthResult> SignInOrLinkGoogleAsync(bool link)
        {
            if (_auth == null) return AuthResult.Fail("Firebase not initialized.");
            try
            {
                var tokens = await GoogleSignInBridge.RequestIdTokenAsync();
                if (tokens.Cancelled) return AuthResult.Cancel();
                if (!tokens.Success) return AuthResult.Fail(tokens.Error);

                var credential = GoogleAuthProvider.GetCredential(tokens.IdToken, tokens.AccessToken);
                return await ApplyCredentialAsync(credential, link, "Google");
            }
            catch (Exception ex)
            {
                return ClassifyCredentialException(ex, "Google");
            }
        }

        public Task<AuthResult> SignInWithAppleAsync() =>
            SignInOrLinkAppleAsync(link: false);

        public Task<AuthResult> LinkGuestWithAppleAsync() =>
            SignInOrLinkAppleAsync(link: true);

        async Task<AuthResult> SignInOrLinkAppleAsync(bool link)
        {
            if (_auth == null) return AuthResult.Fail("Firebase not initialized.");
            try
            {
#if UNITY_ANDROID && !UNITY_EDITOR
                // Firebase-driven Apple web OAuth on Android.
                var provider = new FederatedOAuthProvider(new FederatedOAuthProviderData
                {
                    ProviderId = "apple.com"
                });
                if (link)
                {
                    if (_auth.CurrentUser == null || !_auth.CurrentUser.IsAnonymous)
                        return AuthResult.Fail("No guest session to link.");
                    ProgressMigration.SnapshotLocalProgress(_auth.CurrentUser.UserId);
                    var linked = await _auth.CurrentUser.LinkWithProviderAsync(provider);
                    _user = Map(linked.User);
                    ProgressMigration.MarkMigrationComplete();
                    return AuthResult.Ok(_user);
                }

                var signed = await _auth.SignInWithProviderAsync(provider);
                _user = Map(signed.User);
                return AuthResult.Ok(_user);
#else
                var apple = await AppleSignInBridge.RequestAsync();
                if (apple.Cancelled) return AuthResult.Cancel();
                if (!apple.Success) return AuthResult.Fail(apple.Error);

                var credential = OAuthProvider.GetCredential(
                    "apple.com", apple.IdToken, apple.RawNonce, apple.AccessToken);
                return await ApplyCredentialAsync(credential, link, "Apple");
#endif
            }
            catch (Exception ex)
            {
                return ClassifyCredentialException(ex, "Apple");
            }
        }

        public async Task<AuthResult> SignUpWithEmailAsync(string email, string password)
        {
            if (_auth == null) return AuthResult.Fail("Firebase not initialized.");
            if (!ValidateEmailPassword(email, password, out var err)) return AuthResult.Fail(err);

            try
            {
                // Prefer link when currently anonymous so progress UID is preserved.
                if (_auth.CurrentUser != null && _auth.CurrentUser.IsAnonymous)
                    return await LinkGuestWithEmailAsync(email, password);

                var result = await _auth.CreateUserWithEmailAndPasswordAsync(email.Trim(), password);
                _user = Map(result.User);
                try { await result.User.SendEmailVerificationAsync(); }
                catch (Exception vex)
                {
                    Debug.LogWarning($"[Genesis Auth] Verification email: {vex.Message}");
                }

                return AuthResult.Ok(_user);
            }
            catch (Exception ex)
            {
                return ClassifyCredentialException(ex, "Email");
            }
        }

        public async Task<AuthResult> SignInWithEmailAsync(string email, string password)
        {
            if (_auth == null) return AuthResult.Fail("Firebase not initialized.");
            if (!ValidateEmailPassword(email, password, out var err)) return AuthResult.Fail(err);

            try
            {
                var result = await _auth.SignInWithEmailAndPasswordAsync(email.Trim(), password);
                _user = Map(result.User);
                return AuthResult.Ok(_user);
            }
            catch (Exception ex)
            {
                return AuthResult.Fail(Friendly(ex));
            }
        }

        public async Task<AuthResult> LinkGuestWithEmailAsync(string email, string password)
        {
            if (_auth?.CurrentUser == null || !_auth.CurrentUser.IsAnonymous)
                return AuthResult.Fail("No guest session to link.");
            if (!ValidateEmailPassword(email, password, out var err)) return AuthResult.Fail(err);

            try
            {
                ProgressMigration.SnapshotLocalProgress(_auth.CurrentUser.UserId);
                var credential = EmailAuthProvider.GetCredential(email.Trim(), password);
                var result = await _auth.CurrentUser.LinkWithCredentialAsync(credential);
                _user = Map(result.User);
                try { await result.User.SendEmailVerificationAsync(); }
                catch { /* non-fatal */ }

                ProgressMigration.MarkMigrationComplete();
                return AuthResult.Ok(_user);
            }
            catch (Exception ex)
            {
                return ClassifyCredentialException(ex, "Email");
            }
        }

        public async Task<AuthResult> SendPasswordResetAsync(string email)
        {
            if (_auth == null) return AuthResult.Fail("Firebase not initialized.");
            if (string.IsNullOrWhiteSpace(email) || !email.Contains("@"))
                return AuthResult.Fail("Enter a valid email.");

            try
            {
                await _auth.SendPasswordResetEmailAsync(email.Trim());
                return AuthResult.Ok(_user);
            }
            catch (Exception ex)
            {
                return AuthResult.Fail(Friendly(ex));
            }
        }

        public async Task<AuthResult> SendEmailVerificationAsync()
        {
            if (_auth?.CurrentUser == null) return AuthResult.Fail("Not signed in.");
            try
            {
                await _auth.CurrentUser.SendEmailVerificationAsync();
                return AuthResult.Ok(_user);
            }
            catch (Exception ex)
            {
                return AuthResult.Fail(Friendly(ex));
            }
        }

        public async Task SignOutAsync()
        {
            _auth?.SignOut();
            _user = new AuthUser();
            await Task.CompletedTask;
        }

        public async Task RefreshSessionAsync()
        {
            if (_auth?.CurrentUser == null)
            {
                _user = new AuthUser();
                return;
            }

            try
            {
                await _auth.CurrentUser.ReloadAsync();
                _user = Map(_auth.CurrentUser);
            }
            catch (Exception ex)
            {
                Debug.LogWarning($"[Genesis Auth] RefreshSession: {ex.Message}");
            }
        }

        async Task<AuthResult> ApplyCredentialAsync(Credential credential, bool link, string providerLabel)
        {
            if (link)
            {
                if (_auth.CurrentUser == null || !_auth.CurrentUser.IsAnonymous)
                    return AuthResult.Fail("No guest session to link.");

                ProgressMigration.SnapshotLocalProgress(_auth.CurrentUser.UserId);
                var linked = await _auth.CurrentUser.LinkWithCredentialAsync(credential);
                _user = Map(linked.User);
                ProgressMigration.MarkMigrationComplete();
                return AuthResult.Ok(_user);
            }

            var signed = await _auth.SignInAndRetrieveDataWithCredentialAsync(credential);
            _user = Map(signed.User);
            return AuthResult.Ok(_user);
        }

        static AuthResult ClassifyCredentialException(Exception ex, string provider)
        {
            var msg = Friendly(ex);
            // Firebase wraps FirebaseAccountLinkException / credential-already-in-use
            if (msg.IndexOf("already", StringComparison.OrdinalIgnoreCase) >= 0 ||
                msg.IndexOf("credential-already-in-use", StringComparison.OrdinalIgnoreCase) >= 0 ||
                msg.IndexOf("email-already-in-use", StringComparison.OrdinalIgnoreCase) >= 0)
            {
                return AuthResult.ConflictResult(
                    $"This {provider} identity already belongs to another Genesis account. " +
                    "Sign in to that account instead — your guest progress was backed up locally.",
                    provider);
            }

            return AuthResult.Fail(msg);
        }

        static bool ValidateEmailPassword(string email, string password, out string error)
        {
            error = "";
            if (string.IsNullOrWhiteSpace(email) || !email.Contains("@"))
            {
                error = "Enter a valid email address.";
                return false;
            }

            if (string.IsNullOrEmpty(password) || password.Length < 6)
            {
                error = "Password must be at least 6 characters.";
                return false;
            }

            return true;
        }

        static AuthUser Map(FirebaseUser user)
        {
            if (user == null) return new AuthUser();
            var provider = AuthProviderKind.Guest;
            if (!user.IsAnonymous)
            {
                provider = AuthProviderKind.Email;
                foreach (var info in user.ProviderData)
                {
                    if (info == null) continue;
                    if (info.ProviderId == GoogleAuthProvider.ProviderId)
                    {
                        provider = AuthProviderKind.Google;
                        break;
                    }

                    if (info.ProviderId == "apple.com")
                    {
                        provider = AuthProviderKind.Apple;
                        break;
                    }
                }
            }

            return new AuthUser
            {
                UserId = user.UserId ?? "",
                Email = user.Email ?? "",
                DisplayName = string.IsNullOrEmpty(user.DisplayName)
                    ? (user.IsAnonymous ? "Guest" : "Commander")
                    : user.DisplayName,
                IsAnonymous = user.IsAnonymous,
                IsEmailVerified = user.IsEmailVerified,
                PrimaryProvider = provider
            };
        }

        static string Friendly(Exception ex)
        {
            if (ex == null) return "Authentication failed.";
            if (ex is AggregateException agg && agg.InnerException != null)
                return Friendly(agg.InnerException);
            return ex.Message;
        }
    }
}
#endif
