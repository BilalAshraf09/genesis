using System.Collections.Generic;
using Genesis.Core;
using Genesis.Data;
using Genesis.Monetization;
using UnityEditor;
using UnityEngine;

namespace Genesis.EditorTools
{
    /// <summary>
    /// Edit-mode validation for freemium theater access rules (no live store required).
    /// Menu: Genesis → Monetization → Validate Theater Access
    /// </summary>
    public static class TheaterAccessValidation
    {
        [MenuItem("Genesis/Monetization/Validate Theater Access")]
        public static void Validate()
        {
            int pass = 0;
            int fail = 0;

            void Check(string name, bool condition, string detail = null)
            {
                if (condition)
                {
                    pass++;
                    Debug.Log($"[AccessTest] PASS — {name}");
                }
                else
                {
                    fail++;
                    Debug.LogError($"[AccessTest] FAIL — {name}" +
                                   (string.IsNullOrEmpty(detail) ? "" : $" ({detail})"));
                }
            }

            // Isolate from PlayerPrefs entitlement cache.
            const string pref = "Genesis.Iap.FullGameOwnedCache";
            int prior = PlayerPrefs.GetInt(pref, 0);
            try
            {
                PlayerPrefs.SetInt(pref, 0);
                PlayerPrefs.Save();

                var access = TheaterAccessService.Instance;
                access.SetFullGameOwnedFromStore(false);
                access.EnsureCatalog();

                TheaterCatalog catalog = null;
                try { catalog = TheaterCatalogLoader.LoadCatalog(); }
                catch (System.Exception ex)
                {
                    Check("Catalog loads", false, ex.Message);
                    Report(pass, fail);
                    return;
                }

                var list = catalog?.theaters ?? new List<TheaterCatalogEntry>();
                Check("Catalog has theaters", list.Count > 0, $"count={list.Count}");
                Check("Catalog has more than free tier",
                    list.Count > TheaterAccessService.FreeTheaterCount,
                    $"count={list.Count}");

                var freeIds = new List<string>();
                var premiumIds = new List<string>();
                for (int i = 0; i < list.Count; i++)
                {
                    var entry = list[i];
                    var id = entry?.id;
                    if (string.IsNullOrEmpty(id)) continue;
                    if (entry.free) freeIds.Add(id);
                    else premiumIds.Add(id);
                }

                Check("Catalog marks at least one free desk", freeIds.Count > 0, $"free={freeIds.Count}");
                Check($"Catalog free flags count matches FreeTheaterCount",
                    freeIds.Count == TheaterAccessService.FreeTheaterCount,
                    $"free={freeIds.Count}");

                foreach (var id in freeIds)
                    Check($"Free access: {id}", access.CanAccessTheater(id) && access.IsFreeDesk(id));

                foreach (var id in premiumIds)
                {
                    Check($"Premium locked without entitlement: {id}",
                        !access.CanAccessTheater(id) && !access.IsFreeDesk(id));
                }

                Check("Invalid id denied", !access.CanAccessTheater(null));
                Check("Empty id denied", !access.CanAccessTheater(""));
                Check("Unknown id denied", !access.CanAccessTheater("not-a-real-theater"));

                // Entitlement unlocks everything.
                access.SetFullGameOwnedFromStore(true);
                Check("IsFullGameUnlocked after grant", access.IsFullGameUnlocked);
                foreach (var id in premiumIds)
                    Check($"Premium unlocked with entitlement: {id}", access.CanAccessTheater(id));
                foreach (var id in freeIds)
                    Check($"Free still accessible when owned: {id}", access.CanAccessTheater(id));

                // Revoke (simulates store saying not owned).
                access.SetFullGameOwnedFromStore(false);
                Check("Entitlement revoked", !access.IsFullGameUnlocked);
                if (premiumIds.Count > 0)
                    Check("Premium re-locked after revoke", !access.CanAccessTheater(premiumIds[0]));
                if (freeIds.Count > 0)
                    Check("Free still open after revoke", access.CanAccessTheater(freeIds[0]));

                var defaultFree = access.GetDefaultFreeTheaterId();
                Check("Default free theater is free desk",
                    access.IsFreeDesk(defaultFree), defaultFree);

                Check("Product id configured",
                    !string.IsNullOrEmpty(IapProductIds.UnlockAllTheaters) &&
                    IapProductIds.UnlockAllTheaters.Contains("unlock_all_theaters"));

                // Service free set must match catalog free flags.
                foreach (var id in freeIds)
                    Check($"Service free set includes catalog free: {id}", access.IsFreeDesk(id));
            }
            finally
            {
                PlayerPrefs.SetInt(pref, prior);
                PlayerPrefs.Save();
                // Restore service cache to prior.
                if (TheaterAccessService.Instance != null)
                    TheaterAccessService.Instance.SetFullGameOwnedFromStore(prior == 1);
            }

            Report(pass, fail);
        }

        static void Report(int pass, int fail)
        {
            var msg = $"[AccessTest] Done — {pass} passed, {fail} failed.";
            if (fail == 0)
            {
                Debug.Log(msg);
                EditorUtility.DisplayDialog("Theater Access", msg, "OK");
            }
            else
            {
                Debug.LogError(msg);
                EditorUtility.DisplayDialog("Theater Access", msg + "\nSee Console for details.", "OK");
            }
        }
    }
}
