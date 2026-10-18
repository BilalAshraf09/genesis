# Genesis Full Game Unlock — Store Setup

Client product ID (do not change after publishing):

```
com.bilalashraf.genesis.unlock_all_theaters
```

| Field | Value |
| --- | --- |
| Type | Non-consumable (one-time) |
| Display name | Full Game Unlock |
| Description | Permanently unlock all theaters. |
| Target US price | $4.99 |
| Bundle ID (iOS / Android) | `com.bilalashraf.genesis` |
| Unity IAP package | `com.unity.purchasing` **5.0.2** (StoreController / IAP v5 API) |
| Unity version | 6000.6.3f1 |

Localized prices come from the store at runtime. Never treat `$4.99` in client UI as authoritative.

---

## Unity project (done in code)

- Package: `com.unity.purchasing` in `Packages/manifest.json`
- Billing mode resource: `Assets/Resources/BillingMode.json` → Google Play for Android
- Product constants: `IapProductIds.cs`
- Store lifecycle: `IapPurchaseService.cs` (Unity Services init → Connect → FetchProducts → FetchPurchases)
- Access gate: `TheaterAccessService.cs` (first **5** catalog theaters free)
- Purchase UI: `FullGameUnlock` UXML/USS + `FullGameUnlockController.cs`

---

## App Store Connect (manual)

1. Agreements, Tax, and Banking completed for Paid Apps.
2. Create the iOS app with bundle ID `com.bilalashraf.genesis` if missing.
3. Features → In-App Purchases → create **Non-Consumable**:
   - Product ID: `com.bilalashraf.genesis.unlock_all_theaters` (exact match)
   - Reference name: Full Game Unlock
   - Price tier ≈ USD 4.99
   - Localization: display name + description
4. Submit the IAP with an app version (or Cleared for Sale once reviewed).
5. Sandbox: Users and Access → Sandbox → Testers — create a sandbox Apple ID.
6. On device: sign out of Media & Purchases (or use Sandbox account when prompted). Do not use a production Apple ID for sandbox buys.

---

## Google Play Console (manual)

1. Create / select the app with application ID `com.bilalashraf.genesis`.
2. Monetize → Products → In-app products → Create product:
   - Product ID: `com.bilalashraf.genesis.unlock_all_theaters` (exact match)
   - Name / description as above
   - Default price ≈ USD 4.99 (Play localizes)
   - Status: Active
3. License testing: Setup → License testing — add Gmail testers.
4. Upload a signed build (internal testing track is enough) that includes the billing permission / Play Billing via Unity IAP.
5. Testers install from the Play track; purchases are test charges (not charged).

---

## How to test purchases

| Platform | How |
| --- | --- |
| Editor | Unity IAP Fake Store / Coding environment — validates UI + callbacks, **not** live entitlement |
| iOS | Sandbox Apple ID on device/TestFlight |
| Android | License testers + internal track APK/AAB |

Client checklist after a successful store purchase:

1. `IapPurchaseService` reaches `Ready`
2. Purchase → `OnPurchasePending` → grant → `ConfirmPurchase`
3. Theater select unlocks premium cards immediately
4. Kill app → relaunch → `FetchPurchases` restores ownership
5. Settings → Restore Purchases restores on a fresh install / new device (same store account)

---

## Security notes

- PlayerPrefs cache (`Genesis.Iap.FullGameOwnedCache`) is **UI responsiveness only**. Ownership is reconciled from the store via `FetchPurchases` / `CheckEntitlement`.
- No store secrets or shared keys belong in client code.
- Receipt verification server is **not** required for this non-consumable freemium gate; add one later only if fraud or multi-platform entitlement sync requires it.

---

## Remaining manual work

- [ ] Create the non-consumable product in App Store Connect
- [ ] Create the same product ID in Google Play Console
- [ ] Configure sandbox / license test accounts
- [ ] Device test: purchase, cancel, fail, pending, restore, offline relaunch
- [ ] Confirm price localization strings appear in the Full Game Unlock UI
