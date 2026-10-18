using System.Threading.Tasks;
using UnityEngine;

namespace Genesis.Auth
{
    public struct GoogleTokenResult
    {
        public bool Success;
        public bool Cancelled;
        public string IdToken;
        public string AccessToken;
        public string Error;
    }

    /// <summary>
    /// Obtains a Google ID token for Firebase Auth.
    /// Platform native SDKs must be configured per AUTH_SETUP.md.
    /// </summary>
    public static class GoogleSignInBridge
    {
        public static Task<GoogleTokenResult> RequestIdTokenAsync()
        {
#if UNITY_EDITOR
            return Task.FromResult(new GoogleTokenResult
            {
                Success = false,
                Error = "Google Sign-In requires an iOS/Android device build with OAuth client IDs configured."
            });
#elif UNITY_ANDROID
            return RequestAndroidAsync();
#elif UNITY_IOS
            return RequestIosAsync();
#else
            return Task.FromResult(new GoogleTokenResult
            {
                Success = false,
                Error = "Google Sign-In is not supported on this platform."
            });
#endif
        }

#if UNITY_ANDROID && !UNITY_EDITOR
        static Task<GoogleTokenResult> RequestAndroidAsync()
        {
            // Placeholder for Google Sign-In / Credential Manager AAR integration via EDM4U.
            // Until the native plugin is wired, fail clearly rather than mock success.
            return Task.FromResult(new GoogleTokenResult
            {
                Success = false,
                Error =
                    "Google Sign-In native plugin not wired yet. " +
                    "Add the Google Sign-In Android dependency (see AUTH_SETUP.md) and rebuild."
            });
        }
#endif

#if UNITY_IOS && !UNITY_EDITOR
        static Task<GoogleTokenResult> RequestIosAsync()
        {
            return Task.FromResult(new GoogleTokenResult
            {
                Success = false,
                Error =
                    "Google Sign-In iOS SDK not wired yet. " +
                    "Add GoogleSignIn CocoaPod via EDM4U (see AUTH_SETUP.md) and rebuild."
            });
        }
#endif
    }
}
