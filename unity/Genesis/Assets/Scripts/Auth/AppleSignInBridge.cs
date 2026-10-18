using System;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using UnityEngine;

namespace Genesis.Auth
{
    public struct AppleTokenResult
    {
        public bool Success;
        public bool Cancelled;
        public string IdToken;
        public string AccessToken;
        public string RawNonce;
        public string Error;
    }

    /// <summary>
    /// Sign in with Apple → identity token + raw nonce for Firebase OAuthProvider.
    /// iOS requires the Sign in with Apple entitlement (AUTH_SETUP.md).
    /// Android Apple uses Firebase FederatedOAuthProvider in FirebaseAuthBackend.
    /// </summary>
    public static class AppleSignInBridge
    {
        public static Task<AppleTokenResult> RequestAsync()
        {
#if UNITY_EDITOR
            return Task.FromResult(new AppleTokenResult
            {
                Success = false,
                Error = "Sign in with Apple requires an iOS device build with the Apple capability enabled."
            });
#elif UNITY_IOS
            return RequestIosAsync();
#else
            return Task.FromResult(new AppleTokenResult
            {
                Success = false,
                Error = "Native Sign in with Apple is iOS-only. Android uses Firebase Apple web OAuth."
            });
#endif
        }

        public static string GenerateRawNonce(int size = 32)
        {
            var data = new byte[size];
            using (var rng = RandomNumberGenerator.Create())
                rng.GetBytes(data);
            var sb = new StringBuilder(size * 2);
            foreach (var b in data) sb.AppendFormat("{0:x2}", b);
            return sb.ToString();
        }

        public static string Sha256Nonce(string rawNonce)
        {
            using var sha = SHA256.Create();
            var hash = sha.ComputeHash(Encoding.UTF8.GetBytes(rawNonce));
            var sb = new StringBuilder(hash.Length * 2);
            foreach (var b in hash) sb.AppendFormat("{0:x2}", b);
            return sb.ToString();
        }

#if UNITY_IOS && !UNITY_EDITOR
        static Task<AppleTokenResult> RequestIosAsync()
        {
            // Wire Unity Sign In With Apple / Apple Auth plugin here after package install.
            // Keep raw nonce for Firebase; send SHA256 nonce to Apple.
            var raw = GenerateRawNonce();
            PlayerPrefs.SetString("Genesis.Auth.AppleRawNonce", raw);
            return Task.FromResult(new AppleTokenResult
            {
                Success = false,
                RawNonce = raw,
                Error =
                    "Sign in with Apple Unity plugin not wired yet. " +
                    "Install Apple's Sign in with Apple Unity package (see AUTH_SETUP.md) and rebuild."
            });
        }
#endif
    }
}
