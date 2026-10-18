using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Unity.Services.Core;
using Unity.Services.Core.Environments;
using UnityEngine;
using UnityEngine.Purchasing;

namespace Genesis.Monetization
{
    public enum IapReadyState
    {
        Uninitialized,
        Initializing,
        Ready,
        Unavailable
    }

    public enum IapPurchaseUiState
    {
        Idle,
        Purchasing,
        Restoring,
        Success,
        Cancelled,
        Failed,
        Owned,
        Offline
    }

    /// <summary>
    /// Unity IAP v5 store integration for the full-game non-consumable.
    /// Ownership is granted only from confirmed store orders / entitlements.
    /// </summary>
    public sealed class IapPurchaseService : MonoBehaviour
    {
        static IapPurchaseService _instance;

        StoreController _store;
        bool _listenersBound;
        bool _initStarted;
        string _localizedPrice;
        string _lastError;

        public static IapPurchaseService Instance
        {
            get
            {
                if (_instance != null) return _instance;
                _instance = FindAnyObjectByType<IapPurchaseService>();
                if (_instance != null) return _instance;

                var go = new GameObject("IapPurchaseService");
                if (Application.isPlaying)
                    DontDestroyOnLoad(go);
                _instance = go.AddComponent<IapPurchaseService>();
                return _instance;
            }
        }

        public IapReadyState ReadyState { get; private set; } = IapReadyState.Uninitialized;
        public IapPurchaseUiState UiState { get; private set; } = IapPurchaseUiState.Idle;
        public string LocalizedPriceString =>
            !string.IsNullOrEmpty(_localizedPrice) ? _localizedPrice : IapProductIds.TargetUsdPriceHint;
        public string LastError => _lastError ?? "";
        public bool IsPurchasing => UiState == IapPurchaseUiState.Purchasing || UiState == IapPurchaseUiState.Restoring;

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
            if (TheaterAccessService.Instance.IsFullGameUnlocked)
                UiState = IapPurchaseUiState.Owned;
        }

        void Start()
        {
            _ = InitializeAsync();
        }

        public async Task InitializeAsync()
        {
            if (_initStarted) return;
            _initStarted = true;
            ReadyState = IapReadyState.Initializing;
            Raise();

            try
            {
                if (UnityServices.State == ServicesInitializationState.Uninitialized)
                {
                    var options = new InitializationOptions().SetEnvironmentName("production");
                    await UnityServices.InitializeAsync(options);
                }

                _store = UnityIAPServices.StoreController();
                BindListeners();
                await _store.Connect();
                FetchCatalog();
            }
            catch (Exception ex)
            {
                Debug.LogWarning($"[Genesis IAP] Init failed: {ex.Message}");
                ReadyState = IapReadyState.Unavailable;
                UiState = IapPurchaseUiState.Offline;
                _lastError = "Store unavailable. Check network and try again.";
                Raise();
            }
        }

        void BindListeners()
        {
            if (_store == null || _listenersBound) return;
            _listenersBound = true;

            _store.OnProductsFetched += OnProductsFetched;
            _store.OnProductsFetchFailed += OnProductsFetchFailed;
            _store.OnPurchasesFetched += OnPurchasesFetched;
            _store.OnPurchasesFetchFailed += OnPurchasesFetchFailed;
            _store.OnPurchasePending += OnPurchasePending;
            _store.OnPurchaseConfirmed += OnPurchaseConfirmed;
            _store.OnPurchaseFailed += OnPurchaseFailed;
            _store.OnPurchaseDeferred += _ =>
            {
                UiState = IapPurchaseUiState.Purchasing;
                _lastError = "Purchase waiting for approval…";
                Raise();
            };
            _store.OnStoreDisconnected += desc =>
            {
                ReadyState = IapReadyState.Unavailable;
                if (UiState != IapPurchaseUiState.Owned)
                    UiState = IapPurchaseUiState.Offline;
                _lastError = desc?.message ?? "Disconnected from store.";
                Raise();
            };
            _store.OnCheckEntitlement += OnCheckEntitlement;
        }

        void FetchCatalog()
        {
            if (_store == null) return;
            var defs = new List<ProductDefinition>
            {
                new ProductDefinition(IapProductIds.UnlockAllTheaters, ProductType.NonConsumable)
            };
            _store.FetchProducts(defs);
        }

        void OnProductsFetched(List<Product> products)
        {
            var product = products?.FirstOrDefault(p =>
                p?.definition != null &&
                p.definition.id == IapProductIds.UnlockAllTheaters);

            if (product?.metadata != null && !string.IsNullOrEmpty(product.metadata.localizedPriceString))
                _localizedPrice = product.metadata.localizedPriceString;

            ReadyState = IapReadyState.Ready;
            if (TheaterAccessService.Instance.IsFullGameUnlocked)
                UiState = IapPurchaseUiState.Owned;
            else if (UiState == IapPurchaseUiState.Offline || UiState == IapPurchaseUiState.Idle)
                UiState = IapPurchaseUiState.Idle;

            Raise();
            _store.FetchPurchases();
        }

        void OnProductsFetchFailed(ProductFetchFailed failure)
        {
            Debug.LogWarning($"[Genesis IAP] Product fetch failed: {failure?.FailureReason}");
            ReadyState = IapReadyState.Unavailable;
            if (!TheaterAccessService.Instance.IsFullGameUnlocked)
            {
                UiState = IapPurchaseUiState.Offline;
                _lastError = "Could not load store products.";
            }
            Raise();
            // Still try purchases — some platforms cache entitlements offline.
            try { _store?.FetchPurchases(); } catch { /* ignore */ }
        }

        void OnPurchasesFetched(Orders orders)
        {
            bool owned = OrderContainsUnlock(orders);
            ApplyOwnership(owned, fromStore: true);
            if (!owned && ReadyState == IapReadyState.Ready && UiState != IapPurchaseUiState.Purchasing)
                UiState = IapPurchaseUiState.Idle;
            Raise();
        }

        void OnPurchasesFetchFailed(PurchasesFetchFailureDescription failure)
        {
            Debug.LogWarning($"[Genesis IAP] Purchases fetch failed: {failure?.message}");
            // Keep cached entitlement; do not revoke on transient network failure.
            if (!TheaterAccessService.Instance.IsFullGameUnlocked && UiState != IapPurchaseUiState.Owned)
            {
                _lastError = "Could not refresh purchases.";
            }
            Raise();
        }

        void OnPurchasePending(PendingOrder order)
        {
            if (!PendingContainsUnlock(order))
            {
                // Unknown product — still confirm to clear store queue safely without granting.
                _store?.ConfirmPurchase(order);
                return;
            }

            // Grant only after we will confirm; for non-consumables, grant then confirm.
            TheaterAccessService.Instance.SetFullGameOwnedFromStore(true);
            UiState = IapPurchaseUiState.Success;
            Raise();
            _store?.ConfirmPurchase(order);
        }

        void OnPurchaseConfirmed(Order order)
        {
            switch (order)
            {
                case ConfirmedOrder confirmed when OrderItemIsUnlock(confirmed):
                    TheaterAccessService.Instance.SetFullGameOwnedFromStore(true);
                    UiState = IapPurchaseUiState.Owned;
                    _lastError = "";
                    break;
                case FailedOrder failed:
                    // Do not revoke a grant already applied from Pending; store may retry.
                    _lastError = failed.Details ?? failed.FailureReason.ToString();
                    if (!TheaterAccessService.Instance.IsFullGameUnlocked)
                        UiState = IapPurchaseUiState.Failed;
                    break;
            }

            Raise();
        }

        void OnPurchaseFailed(FailedOrder order)
        {
            var reason = order?.FailureReason ?? PurchaseFailureReason.Unknown;
            if (reason == PurchaseFailureReason.UserCancelled)
            {
                UiState = IapPurchaseUiState.Cancelled;
                _lastError = "Purchase cancelled.";
            }
            else
            {
                UiState = IapPurchaseUiState.Failed;
                _lastError = order?.Details ?? reason.ToString();
            }

            Raise();
        }

        void OnCheckEntitlement(Entitlement entitlement)
        {
            if (entitlement == null) return;
            var product = entitlement.Product;
            if (product?.definition == null) return;
            if (product.definition.id != IapProductIds.UnlockAllTheaters) return;

            bool owned = entitlement.Status == EntitlementStatus.FullyEntitled
                         || entitlement.Status == EntitlementStatus.EntitledButNotFinished;
            ApplyOwnership(owned, fromStore: true);
            Raise();
        }

        public void PurchaseFullGame()
        {
            if (TheaterAccessService.Instance.IsFullGameUnlocked)
            {
                UiState = IapPurchaseUiState.Owned;
                Raise();
                return;
            }

            if (IsPurchasing) return;

            if (ReadyState != IapReadyState.Ready || _store == null)
            {
                UiState = IapPurchaseUiState.Offline;
                _lastError = "Store not ready. Try again shortly.";
                Raise();
                _ = InitializeAsync();
                return;
            }

            UiState = IapPurchaseUiState.Purchasing;
            _lastError = "";
            Raise();
            _store.PurchaseProduct(IapProductIds.UnlockAllTheaters);
        }

        public void RestorePurchases()
        {
            if (IsPurchasing) return;

            if (_store == null || ReadyState == IapReadyState.Uninitialized)
            {
                _ = InitializeAsync();
                _lastError = "Connecting to store…";
                Raise();
                return;
            }

            UiState = IapPurchaseUiState.Restoring;
            _lastError = "";
            Raise();

            _store.RestoreTransactions((success, error) =>
            {
                if (!success)
                {
                    UiState = IapPurchaseUiState.Failed;
                    _lastError = string.IsNullOrEmpty(error)
                        ? "Restore failed."
                        : error;
                    Raise();
                    return;
                }

                // RestoreTransactions triggers OnPurchasesFetched; if still not owned:
                if (!TheaterAccessService.Instance.IsFullGameUnlocked)
                {
                    UiState = IapPurchaseUiState.Idle;
                    _lastError = "No purchases to restore.";
                }
                else
                {
                    UiState = IapPurchaseUiState.Owned;
                    _lastError = "";
                }

                Raise();
            });
        }

        public void RefreshEntitlements()
        {
            if (_store == null)
            {
                _ = InitializeAsync();
                return;
            }

            try
            {
                var product = _store.GetProductById(IapProductIds.UnlockAllTheaters);
                if (product != null)
                    _store.CheckEntitlement(product);
                else
                    _store.FetchPurchases();
            }
            catch (Exception ex)
            {
                Debug.LogWarning($"[Genesis IAP] RefreshEntitlements: {ex.Message}");
            }
        }

        void ApplyOwnership(bool owned, bool fromStore)
        {
            if (owned)
            {
                TheaterAccessService.Instance.SetFullGameOwnedFromStore(true);
                UiState = IapPurchaseUiState.Owned;
                _lastError = "";
            }
            else if (fromStore && TheaterAccessService.Instance.IsFullGameUnlocked)
            {
                // Store says not owned — clear cache (refund / wrong account).
                TheaterAccessService.Instance.SetFullGameOwnedFromStore(false);
                if (UiState == IapPurchaseUiState.Owned)
                    UiState = IapPurchaseUiState.Idle;
            }
        }

        static bool OrderContainsUnlock(Orders orders)
        {
            if (orders == null) return false;
            if (orders.ConfirmedOrders != null)
            {
                foreach (var o in orders.ConfirmedOrders)
                    if (OrderItemIsUnlock(o)) return true;
            }

            if (orders.PendingOrders != null)
            {
                foreach (var o in orders.PendingOrders)
                    if (PendingContainsUnlock(o)) return true;
            }

            return false;
        }

        static bool OrderItemIsUnlock(Order order)
        {
            try
            {
                var items = order?.CartOrdered?.Items();
                if (items == null) return false;
                foreach (var item in items)
                {
                    var id = item?.Product?.definition?.id;
                    if (id == IapProductIds.UnlockAllTheaters) return true;
                }
            }
            catch { /* ignore malformed order */ }

            return false;
        }

        static bool PendingContainsUnlock(PendingOrder order) => OrderItemIsUnlock(order);

        void Raise() => StateChanged?.Invoke();
    }
}
