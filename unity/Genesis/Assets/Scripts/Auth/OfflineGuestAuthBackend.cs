using System;
using System.Threading.Tasks;
using UnityEngine;

namespace Genesis.Auth
{
    /// <summary>
    /// Guest-first backend used until Firebase packages + config files are installed.
    /// Guest play works fully. Email / Google / Apple return actionable setup errors
    /// (never fake a successful federated sign-in).
    /// </summary>
    public sealed class OfflineGuestAuthBackend : IAuthBackend
    {
        const string PrefUid = "Genesis.Auth.OfflineUid";
        const string PrefAnon = "Genesis.Auth.OfflineAnonymous";
        const string PrefEmail = "Genesis.Auth.OfflineEmail";
        const string PrefSignedIn = "Genesis.Auth.OfflineSignedIn";

        public string BackendName => "OfflineGuest";
        public bool ProvidersAvailable => false;
        public AuthUser CurrentUser { get; private set; } = new();

        public Task InitializeAsync()
        {
            if (PlayerPrefs.GetInt(PrefSignedIn, 0) == 1)
                CurrentUser = LoadUser();
            else
                CurrentUser = new AuthUser();
            return Task.CompletedTask;
        }

        public Task<AuthResult> ContinueAsGuestAsync()
        {
            string uid = PlayerPrefs.GetString(PrefUid, "");
            if (string.IsNullOrEmpty(uid) || PlayerPrefs.GetInt(PrefAnon, 1) != 1)
            {
                uid = "guest-" + Guid.NewGuid().ToString("N");
                PlayerPrefs.SetString(PrefUid, uid);
                PlayerPrefs.SetInt(PrefAnon, 1);
                PlayerPrefs.DeleteKey(PrefEmail);
            }

            PlayerPrefs.SetInt(PrefSignedIn, 1);
            PlayerPrefs.Save();
            CurrentUser = LoadUser();
            ProgressMigration.RememberGuestUid(CurrentUser.UserId);
            return Task.FromResult(AuthResult.Ok(CurrentUser));
        }

        public Task<AuthResult> SignInWithGoogleAsync() =>
            Task.FromResult(AuthResult.Fail(FirebaseRequired("Google Sign-In")));

        public Task<AuthResult> SignInWithAppleAsync() =>
            Task.FromResult(AuthResult.Fail(FirebaseRequired("Sign in with Apple")));

        public Task<AuthResult> SignUpWithEmailAsync(string email, string password) =>
            Task.FromResult(AuthResult.Fail(FirebaseRequired("Email sign-up")));

        public Task<AuthResult> SignInWithEmailAsync(string email, string password) =>
            Task.FromResult(AuthResult.Fail(FirebaseRequired("Email login")));

        public Task<AuthResult> SendPasswordResetAsync(string email) =>
            Task.FromResult(AuthResult.Fail(FirebaseRequired("Password reset")));

        public Task<AuthResult> SendEmailVerificationAsync() =>
            Task.FromResult(AuthResult.Fail(FirebaseRequired("Email verification")));

        public Task<AuthResult> LinkGuestWithGoogleAsync() =>
            Task.FromResult(AuthResult.Fail(FirebaseRequired("Link Google")));

        public Task<AuthResult> LinkGuestWithAppleAsync() =>
            Task.FromResult(AuthResult.Fail(FirebaseRequired("Link Apple")));

        public Task<AuthResult> LinkGuestWithEmailAsync(string email, string password) =>
            Task.FromResult(AuthResult.Fail(FirebaseRequired("Link email")));

        public Task SignOutAsync()
        {
            // Keep guest uid + progress; clear session so Welcome can show again if desired.
            PlayerPrefs.SetInt(PrefSignedIn, 0);
            PlayerPrefs.Save();
            CurrentUser = new AuthUser();
            return Task.CompletedTask;
        }

        public Task RefreshSessionAsync() => InitializeAsync();

        AuthUser LoadUser()
        {
            return new AuthUser
            {
                UserId = PlayerPrefs.GetString(PrefUid, ""),
                Email = PlayerPrefs.GetString(PrefEmail, ""),
                IsAnonymous = PlayerPrefs.GetInt(PrefAnon, 1) == 1,
                PrimaryProvider = PlayerPrefs.GetInt(PrefAnon, 1) == 1
                    ? AuthProviderKind.Guest
                    : AuthProviderKind.Email,
                DisplayName = PlayerPrefs.GetInt(PrefAnon, 1) == 1 ? "Guest" : "Commander"
            };
        }

        static string FirebaseRequired(string feature) =>
            $"{feature} requires Firebase Auth. Add config files and packages — see Assets/Scripts/Auth/AUTH_SETUP.md.";
    }
}
