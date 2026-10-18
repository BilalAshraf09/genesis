using System;

namespace Genesis.Auth
{
    public enum AuthProviderKind
    {
        None,
        Guest,
        Email,
        Google,
        Apple
    }

    public enum AuthUiState
    {
        Idle,
        Busy,
        Success,
        Cancelled,
        Failed,
        Offline,
        Conflict
    }

    public sealed class AuthUser
    {
        public string UserId { get; set; } = "";
        public string Email { get; set; } = "";
        public string DisplayName { get; set; } = "";
        public bool IsAnonymous { get; set; }
        public bool IsEmailVerified { get; set; }
        public AuthProviderKind PrimaryProvider { get; set; }

        public bool IsSignedIn => !string.IsNullOrEmpty(UserId);
        public bool IsGuest => IsSignedIn && IsAnonymous;
        public bool IsRegistered => IsSignedIn && !IsAnonymous;
    }

    public sealed class AuthResult
    {
        public bool Success { get; set; }
        public bool Cancelled { get; set; }
        public bool Conflict { get; set; }
        public string Error { get; set; } = "";
        public AuthUser User { get; set; }
        public string ConflictProviderHint { get; set; } = "";

        public static AuthResult Ok(AuthUser user) => new()
        {
            Success = true,
            User = user
        };

        public static AuthResult Fail(string error) => new()
        {
            Success = false,
            Error = error ?? "Authentication failed."
        };

        public static AuthResult Cancel(string message = "Cancelled.") => new()
        {
            Success = false,
            Cancelled = true,
            Error = message
        };

        public static AuthResult ConflictResult(string message, string providerHint = "") => new()
        {
            Success = false,
            Conflict = true,
            Error = message,
            ConflictProviderHint = providerHint
        };
    }

    public interface IAuthBackend
    {
        string BackendName { get; }
        bool ProvidersAvailable { get; }
        AuthUser CurrentUser { get; }

        System.Threading.Tasks.Task InitializeAsync();
        System.Threading.Tasks.Task<AuthResult> ContinueAsGuestAsync();
        System.Threading.Tasks.Task<AuthResult> SignInWithGoogleAsync();
        System.Threading.Tasks.Task<AuthResult> SignInWithAppleAsync();
        System.Threading.Tasks.Task<AuthResult> SignUpWithEmailAsync(string email, string password);
        System.Threading.Tasks.Task<AuthResult> SignInWithEmailAsync(string email, string password);
        System.Threading.Tasks.Task<AuthResult> SendPasswordResetAsync(string email);
        System.Threading.Tasks.Task<AuthResult> SendEmailVerificationAsync();
        System.Threading.Tasks.Task<AuthResult> LinkGuestWithGoogleAsync();
        System.Threading.Tasks.Task<AuthResult> LinkGuestWithAppleAsync();
        System.Threading.Tasks.Task<AuthResult> LinkGuestWithEmailAsync(string email, string password);
        System.Threading.Tasks.Task SignOutAsync();
        System.Threading.Tasks.Task RefreshSessionAsync();
    }
}
