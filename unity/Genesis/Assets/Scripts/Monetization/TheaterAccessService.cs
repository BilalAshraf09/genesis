using System;
using System.Collections.Generic;
using Genesis.Core;
using Genesis.Data;
using UnityEngine;

namespace Genesis.Monetization
{
    /// <summary>
    /// Single source of truth for theater access: catalog <c>free</c> flags mark free desks;
    /// remaining require the full-game non-consumable entitlement from the store.
    /// Falls back to the first <see cref="FreeTheaterCount"/> entries if no flags are set.
    /// </summary>
    public sealed class TheaterAccessService : MonoBehaviour
    {
        public const int FreeTheaterCount = 5;
        const string PrefEntitlementCache = "Genesis.Iap.FullGameOwnedCache";

        static TheaterAccessService _instance;

        readonly HashSet<string> _freeIds = new(StringComparer.Ordinal);
        bool _catalogReady;
        bool _fullGameOwned;

        public static TheaterAccessService Instance
        {
            get
            {
                if (_instance != null) return _instance;
                _instance = FindAnyObjectByType<TheaterAccessService>();
                if (_instance != null) return _instance;

                var go = new GameObject("TheaterAccessService");
                if (Application.isPlaying)
                    DontDestroyOnLoad(go);
                _instance = go.AddComponent<TheaterAccessService>();
                return _instance;
            }
        }

        public bool IsFullGameUnlocked => _fullGameOwned;

        public int FreeTheatersRemaining
        {
            get
            {
                if (_fullGameOwned) return 0;
                EnsureCatalog();
                int free = 0;
                try
                {
                    var catalog = TheaterCatalogLoader.LoadCatalog();
                    var list = catalog?.theaters;
                    if (list == null) return FreeTheaterCount;
                    for (int i = 0; i < list.Count; i++)
                    {
                        var id = list[i]?.id;
                        if (string.IsNullOrEmpty(id)) continue;
                        if (!CanAccessTheater(id)) continue;
                        // Count free desks the player has not completed yet (soft metric for Settings).
                        if (IsFreeDesk(id) && LocalRetention.GetPersonalBest(id) == null)
                            free++;
                    }
                }
                catch
                {
                    free = FreeTheaterCount;
                }

                return free;
            }
        }

        public event Action EntitlementsChanged;

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
            _fullGameOwned = PlayerPrefs.GetInt(PrefEntitlementCache, 0) == 1;
            EnsureCatalog();
        }

        public void EnsureCatalog()
        {
            if (_catalogReady && _freeIds.Count > 0) return;

            _freeIds.Clear();
            try
            {
                var catalog = TheaterCatalogLoader.LoadCatalog();
                var list = catalog?.theaters;
                if (list == null) return;

                // Prefer explicit catalog free flags (source of truth for freemium).
                for (int i = 0; i < list.Count; i++)
                {
                    var entry = list[i];
                    if (entry == null || !entry.free || string.IsNullOrEmpty(entry.id)) continue;
                    _freeIds.Add(entry.id);
                }

                // Fallback: first N desks if the catalog omitted free flags entirely.
                if (_freeIds.Count == 0)
                {
                    int granted = 0;
                    for (int i = 0; i < list.Count && granted < FreeTheaterCount; i++)
                    {
                        var id = list[i]?.id;
                        if (string.IsNullOrEmpty(id)) continue;
                        _freeIds.Add(id);
                        granted++;
                    }
                }
            }
            catch (Exception ex)
            {
                Debug.LogWarning($"[Genesis] TheaterAccessService catalog load failed: {ex.Message}");
            }

            _catalogReady = true;
        }

        public bool IsFreeDesk(string theaterId)
        {
            if (string.IsNullOrEmpty(theaterId)) return false;
            EnsureCatalog();
            return _freeIds.Contains(theaterId);
        }

        public bool CanAccessTheater(string theaterId)
        {
            if (string.IsNullOrEmpty(theaterId)) return false;
            if (_fullGameOwned) return true;
            EnsureCatalog();
            return _freeIds.Contains(theaterId);
        }

        /// <summary>
        /// If accessible, returns true. If locked, opens the purchase UI and returns false.
        /// </summary>
        public bool EnsureAccessOrShowUnlock(string theaterId)
        {
            if (CanAccessTheater(theaterId)) return true;
            FullGameUnlockController.Show(theaterId);
            return false;
        }

        public void SetFullGameOwnedFromStore(bool owned)
        {
            if (_fullGameOwned == owned) return;
            _fullGameOwned = owned;
            PlayerPrefs.SetInt(PrefEntitlementCache, owned ? 1 : 0);
            PlayerPrefs.Save();
            EntitlementsChanged?.Invoke();
            Debug.Log($"[Genesis] Full-game entitlement cache → {owned}");
        }

        public void RefreshEntitlements()
        {
            var iap = IapPurchaseService.Instance;
            if (iap != null)
                iap.RefreshEntitlements();
        }

        public void RequestUnlockAllTheaters()
        {
            FullGameUnlockController.Show(null);
        }

        public void RestorePurchases()
        {
            IapPurchaseService.Instance?.RestorePurchases();
        }

        /// <summary>First free catalog theater — safe default for Play / cold start.</summary>
        public string GetDefaultFreeTheaterId()
        {
            EnsureCatalog();
            try
            {
                var list = TheaterCatalogLoader.LoadCatalog()?.theaters;
                if (list != null)
                {
                    for (int i = 0; i < list.Count; i++)
                    {
                        var id = list[i]?.id;
                        if (!string.IsNullOrEmpty(id) && _freeIds.Contains(id))
                            return id;
                    }
                }
            }
            catch { /* fall through */ }

            return "hist-1905-port-arthur";
        }
    }
}
