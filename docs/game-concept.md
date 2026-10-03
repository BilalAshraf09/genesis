# Genesis — Decision Worlds

## Pitch
Cross-platform (Expo web + mobile): deploy into **32 world turning points (1900–2026)** on theater-specific 3D ops boards. Each decision is a cinematic order under a live timer — not a quiz. Freemium: **2 theaters free**, then **$5** unlocks all remaining forever.

## Visual identity (modern AAA)
- **Typography:** Orbitron (display/HUD) + Sora (body) — bold hierarchy, generous letter-spacing
- **Color:** deep ink void, frosted glass panels, electric cyan primary, ember secondary (urgency)
- **Chrome:** glass/blur panels, soft radii, sparse accent glow — console strategy menu, not CMS
- **Home:** game select — featured theater tiles with full-bleed maps + gradient overlays
- **Play:** immersive full-bleed theater is the HERO — dynamic units/fog/focus, pressure stake bar on the map, cinematic PRIMARY OBJECTIVE (not a question), orders rail BELOW the map (zero overlap / India-safe), glass HUD with timer ring
- **After-action:** glass consequence board; pros/cons only here

## Core loop
- Tap hotspot / ENGAGE order → **EXECUTE ORDER** → world reacts (shockwave, lighting, course flash) → resolve with mid-run **CHALLENGE A RIVAL** share beat → tap-to-dismiss
- Per-move ops timer (force-lock on expiry); resolve popup never auto-dismisses
- Ten moves · atmospheres/music · auth + paywall · expo-gl + three (dynamic board, not static tiles)

## Freemium / Monetization
Browse free · sign in to DEPLOY · 2 free theaters · **$5 unlock-all** (`genesis_unlock_all`) · optional **streak freeze** (`genesis_streak_freeze` ~$0.99) · **Genesis Pro** via RevenueCat (`genesis_pro`).
- **Android / Play:** Google Play Billing (stub + RevenueCat) — the only ship path.
- **Local Expo web:** MockBilling sandbox for demos only — no Stripe / web Checkout.
- Full strategy, price tests, and enable steps: [monetization.md](./monetization.md)
- **Publish readiness:** **Not ready** for production Play (billing stub + Console setup). Checklist: [android-publish-readiness.md](./android-publish-readiness.md)

## Out of scope
Live Play credentials in-repo · Stripe / web monetization · multiplayer · full Unity export

## Retention loops
Habit systems so players return (AsyncStorage, no heavy multiplayer backend):
- **Crisis of the Day** — one rotating theater with ×1.15 score multiplier + FOMO countdown / limited desk seats (daily seed)
- **Play-day streaks** + desk titles + **streak-freeze IAP** (`genesis_streak_freeze`) to save a missed day
- **Mastery** — % theaters cleared, unique endings + **endings gallery**
- **Resume** — unfinished runs saved mid-scenario; Resume / Restart on home + briefing
- **Smart next-play** — recommend related / underplayed theaters after after-action
- **Personal bests** — beat-score / NEW PB callout on overall score
- **Cliffhangers** — path-family teaser on after-action to pull the next session
- **Deep-link invites** — `genesis://invite` + `/invite` challenge accept flow
- **Mid-run viral beat** — WORLD COURSE LOCKED challenge share on resolve
- **Global leaderboard** — plausible Top 20 weekly (mock + local PB); `LEADERBOARD_API_URL` stub
- **Viral / growth** — share-to-challenge, D0→D1 return briefing, opt-in Crisis reminder — see [retention-viral-review.md](./retention-viral-review.md)

## Tone
High-budget war-room gravity. Command a theater — don’t answer a quiz. FOMO can be sharp (countdowns, seat expires) but stays Orbitron/Sora glass HUD — not pastel casino.

## Board gamefeel
Research + rules: [board-gamefeel-research.md](./board-gamefeel-research.md)
