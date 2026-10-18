using Genesis.Auth;
using Genesis.Monetization;
using UnityEditor;
using UnityEngine;

namespace Genesis.EditorTools
{
    /// <summary>Menu: Genesis → Auth → Validate Guest + Access Separation</summary>
    public static class AuthValidation
    {
        [MenuItem("Genesis/Auth/Validate Guest + Access Separation")]
        public static async void Validate()
        {
            int pass = 0, fail = 0;
            void Check(string name, bool ok)
            {
                if (ok) { pass++; Debug.Log($"[AuthTest] PASS — {name}"); }
                else { fail++; Debug.LogError($"[AuthTest] FAIL — {name}"); }
            }

            var auth = AuthService.Instance;
            await auth.InitializeAsync();

            Check("Backend present", !string.IsNullOrEmpty(auth.BackendName));
            Check("Offline or Firebase backend",
                auth.BackendName == "OfflineGuest" || auth.BackendName == "Firebase");

            const string entitlementPref = "Genesis.Iap.FullGameOwnedCache";
            int priorEntitlement = PlayerPrefs.GetInt(entitlementPref, 0);
            try
            {
                TheaterAccessService.Instance.SetFullGameOwnedFromStore(false);

                var guest = await auth.ContinueAsGuest();
                Check("ContinueAsGuest succeeds", guest.Success && auth.IsGuest);
                Check("Guest has user id", !string.IsNullOrEmpty(auth.CurrentUser.UserId));
                Check("Guest auth does not unlock full game",
                    !TheaterAccessService.Instance.IsFullGameUnlocked);

                if (auth.BackendName == "OfflineGuest")
                {
                    var g = await auth.SignInWithGoogle();
                    Check("Google without Firebase does not fake success", !g.Success);
                    var e = await auth.SignUpWithEmail("a@b.com", "password1", "password1");
                    Check("Email without Firebase does not fake success", !e.Success);
                }

                Check("Welcome completed after guest", auth.HasCompletedWelcome);
                Check("Guest uid remembered for migration",
                    !string.IsNullOrEmpty(ProgressMigration.LastGuestUid));
            }
            finally
            {
                TheaterAccessService.Instance.SetFullGameOwnedFromStore(priorEntitlement == 1);
            }

            var msg = $"[AuthTest] Done — {pass} passed, {fail} failed. Backend={auth.BackendName}";
            if (fail == 0) Debug.Log(msg);
            else Debug.LogError(msg);
            EditorUtility.DisplayDialog("Auth Validation", msg, "OK");
        }
    }
}
