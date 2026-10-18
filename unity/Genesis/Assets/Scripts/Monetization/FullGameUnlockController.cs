using Genesis.UI.Toolkit;
using UnityEngine;
using UnityEngine.UIElements;

namespace Genesis.Monetization
{
    /// <summary>
    /// UI Toolkit full-game purchase overlay. Sorting order 55 (above codex/toasts).
    /// </summary>
    public sealed class FullGameUnlockController : MonoBehaviour
    {
        static FullGameUnlockController _instance;

        UIDocument _doc;
        VisualElement _overlay;
        Label _priceLabel;
        Label _statusLabel;
        Label _purchaseBtnLabel;
        Button _purchaseBtn;
        Button _restoreBtn;
        string _contextTheaterId;

        public static void Show(string contextTheaterId = null)
        {
            var ctrl = Ensure();
            ctrl._contextTheaterId = contextTheaterId;
            ctrl.Open();
        }

        public static void Hide()
        {
            if (_instance != null)
                _instance.Close();
        }

        static FullGameUnlockController Ensure()
        {
            if (_instance != null) return _instance;
            var existing = FindAnyObjectByType<FullGameUnlockController>();
            if (existing != null)
            {
                _instance = existing;
                return _instance;
            }

            var go = new GameObject("FullGameUnlock");
            if (Application.isPlaying)
                DontDestroyOnLoad(go);
            _instance = go.AddComponent<FullGameUnlockController>();
            return _instance;
        }

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
            BuildUi();
        }

        void OnEnable()
        {
            var iap = IapPurchaseService.Instance;
            iap.StateChanged += Refresh;
            TheaterAccessService.Instance.EntitlementsChanged += Refresh;
        }

        void OnDisable()
        {
            if (IapPurchaseService.Instance != null)
                IapPurchaseService.Instance.StateChanged -= Refresh;
            if (TheaterAccessService.Instance != null)
                TheaterAccessService.Instance.EntitlementsChanged -= Refresh;
        }

        void BuildUi()
        {
            _doc = UiRegistry.CreateDocument("FullGameUnlock", transform, 55, "FullGameUnlock", "FullGameUnlock");
            var root = _doc.rootVisualElement;
            if (root == null) return;

            root.pickingMode = PickingMode.Position;
            _overlay = root.Q("unlockOverlay") ?? root;
            _overlay.pickingMode = PickingMode.Position;

            _priceLabel = root.Q<Label>("priceLabel");
            _statusLabel = root.Q<Label>("statusLabel");
            _purchaseBtn = root.Q<Button>("purchaseBtn");
            _purchaseBtnLabel = root.Q<Label>("purchaseBtnLabel");
            _restoreBtn = root.Q<Button>("restoreBtn");

            Wire(root, "closeBtn", Close);
            Wire(root, "backBtn", Close);
            if (_purchaseBtn != null)
                _purchaseBtn.clicked += () => IapPurchaseService.Instance.PurchaseFullGame();
            if (_restoreBtn != null)
                _restoreBtn.clicked += () => IapPurchaseService.Instance.RestorePurchases();

            _overlay.AddToClassList("hidden");
            Refresh();
        }

        void Open()
        {
            if (_overlay == null) BuildUi();
            _ = IapPurchaseService.Instance.InitializeAsync();
            _overlay?.RemoveFromClassList("hidden");
            Refresh();
        }

        void Close()
        {
            _overlay?.AddToClassList("hidden");
        }

        void Refresh()
        {
            if (_overlay == null || _overlay.ClassListContains("hidden")) return;

            var access = TheaterAccessService.Instance;
            var iap = IapPurchaseService.Instance;

            if (_priceLabel != null)
                _priceLabel.text = access.IsFullGameUnlocked
                    ? "OWNED"
                    : iap.LocalizedPriceString;

            if (_statusLabel != null)
            {
                _statusLabel.RemoveFromClassList("unlock-status--error");
                _statusLabel.RemoveFromClassList("unlock-status--ok");

                string status;
                switch (iap.UiState)
                {
                    case IapPurchaseUiState.Purchasing:
                        status = "Processing purchase…";
                        break;
                    case IapPurchaseUiState.Restoring:
                        status = "Restoring purchases…";
                        break;
                    case IapPurchaseUiState.Success:
                    case IapPurchaseUiState.Owned:
                        status = "Full game unlocked. All theaters are available.";
                        _statusLabel.AddToClassList("unlock-status--ok");
                        break;
                    case IapPurchaseUiState.Cancelled:
                        status = iap.LastError;
                        break;
                    case IapPurchaseUiState.Failed:
                    case IapPurchaseUiState.Offline:
                        status = iap.LastError;
                        _statusLabel.AddToClassList("unlock-status--error");
                        break;
                    default:
                        status = access.IsFullGameUnlocked
                            ? "You already own the full game."
                            : !string.IsNullOrEmpty(_contextTheaterId)
                                ? "This theater requires Full Game Unlock."
                                : "One purchase unlocks every theater permanently.";
                        break;
                }

                _statusLabel.text = status ?? "";
            }

            bool owned = access.IsFullGameUnlocked
                         || iap.UiState == IapPurchaseUiState.Owned
                         || iap.UiState == IapPurchaseUiState.Success;
            bool busy = iap.IsPurchasing;

            if (_purchaseBtn != null)
            {
                _purchaseBtn.SetEnabled(!owned && !busy && iap.ReadyState != IapReadyState.Initializing);
                _purchaseBtn.style.display = owned ? DisplayStyle.None : DisplayStyle.Flex;
            }

            if (_purchaseBtnLabel != null)
            {
                _purchaseBtnLabel.text = busy
                    ? "PLEASE WAIT…"
                    : iap.ReadyState == IapReadyState.Unavailable
                        ? "STORE UNAVAILABLE"
                        : "UNLOCK ALL THEATERS";
            }

            if (_restoreBtn != null)
            {
                _restoreBtn.SetEnabled(!busy);
                _restoreBtn.style.display = owned ? DisplayStyle.None : DisplayStyle.Flex;
            }
        }

        static void Wire(VisualElement root, string name, System.Action action)
        {
            var btn = root.Q<Button>(name);
            if (btn != null) btn.clicked += action;
        }
    }
}
