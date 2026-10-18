# Genesis Authentication Setup

## Backend

**Firebase Authentication** — single identity for Guest (Anonymous), Email/Password, Google, and Apple.

| Mode | Firebase provider |
| --- | --- |
| Continue as Guest | Anonymous |
| Email sign-up / login | Email/Password |
| Continue with Google | Google |
| Continue with Apple | Apple |

Guest upgrade uses `LinkWithCredentialAsync` so the Firebase UID (and on-device PlayerPrefs progress) stay the same.

**Auth never grants premium theaters.** Full-game unlock remains Unity IAP (`TheaterAccessService` / `IapPurchaseService`).

---

## Current client status

Until Firebase packages + config files are installed, the game uses **OfflineGuest** backend:

- Continue as Guest — **works** (local guest id)
- Email / Google / Apple — return a clear setup error (not mocked as success)

Define `GENESIS_FIREBASE` is auto-enabled via asmdef `versionDefines` when `com.google.firebase.app` / `com.google.firebase.auth` are present.

---

## 1. Create Firebase project

1. [Firebase Console](https://console.firebase.google.com/) → Add project
2. Add Android app: package `com.bilalashraf.genesis` → download `google-services.json`
3. Add iOS app: bundle `com.bilalashraf.genesis` → download `GoogleService-Info.plist`
4. Place both files under `Assets/` (Firebase docs: project root / StreamingAssets per installer)

## 2. Enable Auth providers

Firebase Console → Authentication → Sign-in method:

- [ ] Anonymous
- [ ] Email/Password (enable email link optional; password required)
- [ ] Google
- [ ] Apple

## 3. Install Firebase Unity SDK

Recommended: import the current Firebase Unity SDK `.unitypackage` (App + Auth) from  
https://developers.google.com/unity/archive  

Or via OpenUPM (if you use that registry):

```json
"scopedRegistries": [{
  "name": "package.openupm.com",
  "url": "https://package.openupm.com",
  "scopes": ["com.google.firebase", "com.google.external-dependency-manager"]
}],
"dependencies": {
  "com.google.firebase.app": "<version>",
  "com.google.firebase.auth": "<version>"
}
```

Resolve Android/iOS native deps with **External Dependency Manager** (EDM4U) force-resolve.

## 4. Google Sign-In

1. Google Cloud Console → OAuth client IDs (Web + Android + iOS) for the Firebase project
2. Android: add SHA-1 of your upload/debug keystore to Firebase Android app settings
3. Wire native Google Sign-In / Credential Manager so `GoogleSignInBridge` returns an ID token  
   (see stubs in `GoogleSignInBridge.cs` — replace with real SDK calls after plugins are added)
4. Firebase uses `GoogleAuthProvider.GetCredential(idToken, accessToken)`

**Not claimed working** until native Google Sign-In is wired and tested on device.

## 5. Sign in with Apple

### iOS

1. Apple Developer → Identifiers → enable **Sign In with Apple** on App ID `com.bilalashraf.genesis`
2. Xcode capability: Sign In with Apple
3. Install Apple’s Sign in with Apple Unity package (or equivalent) and complete `AppleSignInBridge` (raw nonce → Firebase `OAuthProvider.GetCredential`)

### Android

1. Firebase Apple provider → configure Services ID + return URL
2. Client uses Firebase `FederatedOAuthProvider` (`apple.com`) — see `FirebaseAuthBackend`

**Android Apple** requires Firebase Console OAuth web config. Do not claim Android Apple works until that is done.

## 6. Credentials you must supply (never commit secrets)

| Item | Where |
| --- | --- |
| `google-services.json` | Unity project |
| `GoogleService-Info.plist` | Unity project |
| OAuth client IDs | Google Cloud / Firebase |
| Apple Services ID + key | Apple Developer + Firebase Apple provider |
| Android SHA-1 | Firebase Android app settings |

Do **not** put Firebase Admin / service-account keys in the Unity client.

## 7. Manual test checklist

1. Fresh install → Welcome → Continue as Guest → play theaters 1–5  
2. Theater 6+ → existing Full Game Unlock IAP UI (not login)  
3. Relaunch as guest → progress persists  
4. Settings → Create Account → link Email/Google/Apple → progress kept (same UID)  
5. Conflict: provider already used → conflict UI; guest backup kept  
6. Cancel provider sheet → back to Welcome/Settings; progress intact  
7. Sign out → Welcome can show again if welcome flag cleared; IAP restore still works  
8. Auth success does **not** unlock premium without store entitlement  

---

## Files

| Path | Role |
| --- | --- |
| `AuthService.cs` | Public API / session |
| `OfflineGuestAuthBackend.cs` | Pre-Firebase guest |
| `FirebaseAuthBackend.cs` | Real Firebase (`#if GENESIS_FIREBASE`) |
| `ProgressMigration.cs` | Snapshot + merge PBs |
| `WelcomeController` + UXML | First launch |
| `AuthEmailController` + UXML | Email flows |
| `AuthConflictController` + UXML | Link conflicts |
