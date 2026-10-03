# Genesis

Historical decision theater — **Unity AAA rebuild in progress** under `unity/Genesis/` (Android/iOS primary). The Expo app at repo root stays intact as the content / freemium prototype until Unity replaces the player.

Serious simulation tone — tradeoffs and consequences, not partisan propaganda. Orders are military commands on a full-bleed ops board, not a quiz.

## Unity AAA (new direction)

| | |
| --- | --- |
| **Editor** | Unity **6000.0.84f1** (6.0 LTS) |
| **Project** | `unity/Genesis/` — open in Hub |
| **First slice** | India Partition — tap hotspot → command rail → **EXECUTE ORDER** → world reaction → resolve + challenge hook |
| **Content** | JSON ported from Expo `src/data` via `python3 scripts/export-unity-theaters.py` |
| **Plan** | [`docs/unity-aaa-plan.md`](docs/unity-aaa-plan.md) (also in project store) |
| **Board preview** | `python3 -m http.server 43124 --directory unity/preview` → [http://127.0.0.1:43124](http://127.0.0.1:43124) (same StreamingAssets JSON; not Editor Play Mode) |

**Bilal local:** Hub → Add `unity/Genesis` → menu **Genesis → Rebuild Theater Play Slice** → Play. Full checklist in [`unity/Genesis/README.md`](unity/Genesis/README.md).

## What’s in the Expo build (still present)

- **Thriller ops board** — expo-gl + three 3D theater with hot-zone beacons (not MCQ cards), cinematic camera/lighting, per-move ops timer
- Strategy **command theaters** — identifiable theater coasts/cities with terrain underlay, live pressure HUD, modern quiet thriller audio
- Immersion: countdown ring, dramatized resolve (tap to continue — no popup auto-timer), tension shake, soft SFX
- **Audio** — royalty-safe soft pads + low pulse beds (not abrasive loops); mute + first-tap unlock; regenerate via `python3 scripts/gen-modern-audio.py`
- **32+ theaters · 10 phases** · mindmap + efficiency score · pros/cons only on after-action
- **Auth** (email/password) — browse free, **sign in to DEPLOY**
- **Freemium:** 2 theaters free → **Genesis Pro** (`genesis_pro`) unlocks the full timeline
- **BillingProvider** — `MockBilling` (default / `__DEV__` / Expo web / missing RC key) · `PlayBilling` via **RevenueCat** (`react-native-purchases` + `react-native-purchases-ui`) on Android/iOS when `EXPO_PUBLIC_REVENUECAT_KEY` is set
- **Packages:** `lifetime` · `yearly` · `monthly` on the current RC offering → entitlement **`genesis_pro`**
- **Paywalls UI** + **Customer Center** on native; glass paywall fallback (web / no offerings)
- Streak freeze remains Mock / secondary consumable (`genesis_streak_freeze`)
- **Growth:** deep-link invites (`/invite`, `genesis://invite`), endings gallery, global weekly LB (mock + local PB), FOMO urgency on Crisis/paywall
- Local **mock auth + sandbox IAP** (labeled; no real charge) so Try Live works without secrets
- EAS Build profiles for iOS + Android

## Run locally (no store credentials required)

```bash
git checkout cursor/genesis-first-slice-c5be
git pull
npm install
npx expo install expo-gl three   # SDK-aligned peers (safe if already present)
npx expo start --web --port 45123 --clear
```

Or the short path after a clean pull:

```bash
npm install
npm run web          # port 45123
npm run typecheck
```

Open [http://127.0.0.1:45123](http://127.0.0.1:45123). Sign up with any email + 6+ char password. After 2 free theaters, use the **Genesis Pro** CTA — clearly marked **SANDBOX** when Play / RevenueCat keys are missing (glass packages: lifetime / yearly / monthly).

### RevenueCat env (native store builds)

```bash
cp .env.example .env
# Set EXPO_PUBLIC_REVENUECAT_KEY to your RevenueCat public SDK key (never commit .env)
```

Dashboard steps (entitlement `genesis_pro`, packages, paywall, Customer Center): project doc `docs/revenuecat-setup.md`.

**Privacy:** in-app route `/privacy` · static host file `public/privacy.html` (also `docs/privacy.html`). Until a custom domain, publish that HTML over HTTPS and paste the URL into Play Console — do not invent a placeholder URL.

If Metro says `Unable to resolve "expo-gl"`:

```bash
rm -rf node_modules
npm install
npx expo start --web --clear
```

`expo-gl` (~57) and `three` are committed in `package.json` / lockfile for Expo SDK 57.

## Freemium rules

| State | Access |
| --- | --- |
| Signed out | Browse timeline; DEPLOY → auth |
| Signed in | First **2** distinct theaters free (replay OK) |
| Genesis Pro (`genesis_pro`) | All theaters on that account while entitlement is active (lifetime = forever) |
| Restore / Customer Center | Re-reads RC CustomerInfo (prod) or account row (sandbox) |

## Monetization (platform rules)

Genesis ships for **Play Store**, not the public web. BillingProvider is **Mock + RevenueCat (Play/App Store)** only.

| Surface | Processor | Notes |
| --- | --- | --- |
| **Android / Play** | RevenueCat → Google Play Billing | **Required** for digital IAP in the APK |
| **iOS (when shipping)** | RevenueCat → App Store IAP | Same entitlement `genesis_pro` |
| **Local Expo web / `__DEV__`** | MockBilling | Sandbox Pro packages for Try Live — not a ship path |

Strategy + RC dashboard checklist: `docs/monetization.md`, `docs/revenuecat-setup.md` (agent store).

### RevenueCat / Google Play (Android IAP)

1. Play Console → create lifetime + yearly + monthly products; activate; license testers.
2. RevenueCat: entitlement **`genesis_pro`**; **current offering** packages **`lifetime`**, **`yearly`**, **`monthly`**; attach paywall template; enable Customer Center.
3. Set `EXPO_PUBLIC_REVENUECAT_KEY` in `.env` (gitignored) and as an EAS Secret; rebuild.
4. App code: `react-native-purchases` + `react-native-purchases-ui` in `src/billing/` (`PlayBilling`, `revenueCat.ts`, `BillingProvider`). Missing key → MockBilling.

### Restore purchases / Customer Center

Paywall always shows Restore. Native Pro users get **Manage subscription** → `RevenueCatUI.presentCustomerCenter()`. Glass paywall lists packages when Paywalls UI is unavailable (e.g. web).

## Production swap (when Bilal is ready)

### Auth → Supabase (recommended) or Firebase

1. Create project; enable Email/Password.
2. Replace `src/account/AccountProvider.tsx` signup/login with Supabase `auth.signUp` / `signInWithPassword`.
3. Persist session via Supabase client; map `user.id` → entitlement row in Postgres.
4. Set `EXPO_PUBLIC_SUPABASE_URL` + `EXPO_PUBLIC_SUPABASE_ANON_KEY`.

### Payments

1. **Android/iOS:** set `EXPO_PUBLIC_REVENUECAT_KEY` (EAS Secret) and rebuild — `PlayBilling` + Paywalls UI are wired.
2. **Do not** ship sandbox CTA copy in production (`billing.isSandbox` / `__DEV__`).
3. Confirm RC dashboard offering + `genesis_pro` before internal testing.

## Android publish (Play Store)

**Status:** Expo web / Try Live ≠ Play APK. **In-repo Play Billing is wired**; production still blocked on Bilal’s Play Console / Expo / RevenueCat accounts. Full go/no-go: project doc `docs/android-publish-readiness.md`. Listing copy + privacy draft + screenshot pack live in the agent store under `docs/` and `media/`.

### Already correct in repo (do not invent fakes)

| Item | Value |
| --- | --- |
| Android package | `com.bilalashraf.genesis` |
| iOS bundle | `com.bilalashraf.genesis` |
| `version` | `1.0.0` |
| `versionCode` | `1` (production profile `autoIncrement: true`) |
| Production artifact | **AAB** (`eas.json` → `build.production.android.buildType: app-bundle`) |
| EAS `projectId` | Intentionally `REPLACE_WITH_EAS_PROJECT_ID` until Bilal runs `eas init` |
| `owner` | `bilal-ashraf` |

### Ordered checklist (9 steps)

| # | Step | Who |
| --- | --- | --- |
| 1 | Play Console developer account + create app `Genesis` | **Bilal** |
| 2 | Store listing (use `docs/play-store-listing.md` + `media/play-*.png`) | **Bilal** uploads |
| 3 | Host privacy policy (`docs/privacy-policy-draft.md`) + Content rating + Data safety | **Bilal** |
| 4 | App signing via EAS / Play App Signing | **Bilal** |
| 5 | Activate store products for lifetime + yearly + monthly (RC packages) | **Bilal** |
| 6 | License testers + internal testing track | **Bilal** |
| 7 | RevenueCat project + `genesis_pro` + `EXPO_PUBLIC_REVENUECAT_KEY` | **Bilal** (code ready) |
| 8 | `eas init` → replace `extra.eas.projectId` | **Bilal** |
| 9 | `eas build --profile production` + submit | **Bilal** |

### Bilal must run (Expo authenticated as bilal-ashraf)

Do **not** run these from an unauthenticated agent session. Do **not** paste a made-up projectId.

```bash
npm i -g eas-cli
eas login                          # bilal-ashraf
cd /path/to/genesis
git checkout cursor/genesis-first-slice-c5be && git pull
npm install

# Links this directory to your Expo project and prints a UUID:
eas init
# Then open app.json and set:
#   expo.extra.eas.projectId = "<uuid from eas init>"
# Replace ONLY the placeholder REPLACE_WITH_EAS_PROJECT_ID.
# Leave owner: "bilal-ashraf".

# After RevenueCat public SDK key exists (do not commit the raw key):
eas secret:create --name EXPO_PUBLIC_REVENUECAT_KEY --value 'YOUR_RC_PUBLIC_SDK_KEY' --scope project

# Gameplay-only internal APK (MockBilling until the secret is present on the build):
eas build --platform android --profile preview

# Store AAB (after listing + products + privacy URL + RC offering/paywall):
eas build --platform android --profile production
# Service account JSON → ./secrets/play-service-account.json (gitignored; see secrets/README.md)
eas submit --platform android --profile production
```

Profiles: `development` / `preview` → APK; `production` → **app-bundle**. SDK 57 → `targetSdk`/`compileSdk` **36**, 64-bit; after first AAB upload, check Play bundle explorer / pre-launch for 16 KB page-size warnings.

### Secrets checklist (Bilal’s accounts — not in repo)

| Secret | Where |
| --- | --- |
| Apple Developer team + App Store Connect app | ASC + `eas.json` `ascAppId` |
| Google Play Console app + service account JSON | `./secrets/play-service-account.json` (gitignored; see `secrets/README.md`) |
| EAS project ID | `app.json` → `extra.eas.projectId` (**from `eas init` only**) |
| Supabase / Firebase keys | EAS Secrets / `.env` (when auth is swapped off mock) |
| `EXPO_PUBLIC_REVENUECAT_KEY` | EAS Secret / local `.env` → enables live `PlayBilling` + Paywalls UI |
| Privacy policy URL | Play Console listing (host yourself; **not** invented in-repo) |
| Optional `EXPO_PUBLIC_OPENAI_API_KEY` | Eval uplink |

## Efficiency score

1. Objective progress · 2. Cost discipline · 3. Option value · 4. Path coherence  
**Efficient ≠ morally correct.**

## Environment

| Variable | Purpose |
| --- | --- |
| `EXPO_PUBLIC_OPENAI_API_KEY` | Optional live end-of-run evaluation |
| `EXPO_PUBLIC_SUPABASE_URL` | Production auth (when wired) |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Production auth (when wired) |
| `EXPO_PUBLIC_REVENUECAT_KEY` | Android/iOS: enables live `PlayBilling` (`genesis_pro`, Paywalls UI, Customer Center) |

## Out of scope here

Full App Store Connect / Play Console submission (needs Bilal’s developer accounts). Push notifications, multiplayer, live news rotation. Public web billing.
