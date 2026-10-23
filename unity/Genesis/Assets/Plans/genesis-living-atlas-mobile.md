# Genesis: Living Atlas — Ground-Up Rebuild (Android + iOS)

> Supersedes `genesis-living-atlas-rebuild.md` (that file was corrupted by an overlapping save and can be deleted).
>
> **Why this plan is different from the previous ones.** The earlier rounds only swapped colours on the same runtime-built uGUI screens. The latest screenshot shows what was actually wrong, and none of it is cosmetic:
> 1. The header and the EXECUTE bar render **no text at all** (legacy `UnityEngine.UI.Text` failing inside nested layout groups).
> 2. The "board" is a camera pushed into extruded polygons, with orange **cube** zone washes and sideways `TextMesh` labels. Nobody can tell it's India.
> 3. Every panel and button is a 64-pixel texture drawn with `SetPixel`. That's why it looks like a paint tool.
>
> This plan **removes all three systems** and replaces them with Unity 6 standard tech: **UI Toolkit** (UXML + USS, SDF text, real border-radius and transitions), a **real cartographic map** projected from the Natural Earth lon/lat data already in the project, and a gameplay loop built around **learning real geography and history**. Each stage ends with phone screenshots sent to you, so we confirm progress before moving on.

---

# Project Overview
- **Game Title**: Genesis — Living Atlas of Crisis
- **High-Level Concept**: You advise leaders through real historical crises on a living map of the real world. Every decision plays out on actual geography: borders get drawn, refugee routes move, territory changes hands. After each choice you see what really happened in history, so players learn where places are and why they mattered while playing.
- **Players**: Single player.
- **Inspiration / Reference Games**: *Plague Inc.* (the map is the game), *Reigns* (fast, weighty choices), *Apple Maps / Google Earth* dark mode (clean real cartography), *Frostpunk* (consequences you can see), *Duolingo* (collection and streak-driven learning loop).
- **Tone / Art Direction**: **"Night Atlas"**: a premium, calm, readable dark map. Deep slate-navy ocean, relief-shaded land in muted natural tones, warm paper-white place labels, one signal accent (amber) plus semantic red/green for costs and gains. Glass bottom sheets with translucency and 20px radius. **Hard bans kept**: no neon, no cyberpunk, no purple glow, no bloom spam, no quiz UI, no empty screens.
- **Target Platform**: **Android + iOS only.** Every layout, input and performance decision targets phones. The Editor Game View / Device Simulator is a dev tool only; no desktop or landscape layout is built.
- **Screen Orientation / Resolution**: **Portrait only**, 1080×1920 reference, scaled to device with safe-area insets (iPhone notch / Dynamic Island / home indicator, Android punch-hole cutouts and gesture bar). Test devices: iPhone SE (750×1334), iPhone 15 (1179×2556), Pixel 8 (1080×2400), Galaxy 20:9 (1440×3200), budget Android (720×1600).
- **Render Pipeline**: URP (existing `Genesis_URP_Pipeline`) with a mobile quality tier: no HDR bloom, MSAA 2×/4× by tier, 60 fps target with 30 fps thermal fallback (existing `GenesisThermalGuard`), ASTC textures, map textures capped at 2048.
- **Current project state found during planning (fixed in Stage 0):**
  - Active build target is **StandaloneOSX**. It will be switched to **Android**.
  - **iOS Build Support module is not installed** in this Unity 6000.6.3f1 install. Install it via Unity Hub → Installs → Add modules → *iOS Build Support*. Until then iOS is checked through the Device Simulator (iPhone profiles), and the iOS Xcode export is added as soon as the module exists.
  - Default orientation is **PortraitUpsideDown** (wrong). It will be set to **Portrait**, with autorotate disabled.

---

# Game Mechanics

## Core Gameplay Loop
1. **Pick a crisis from the Atlas** (Theater Select). Each crisis card shows a small real map thumbnail of its region, the year, and "places to discover: 0/6".
2. **Fly-in briefing (learn moment #1)**. The camera starts wide on the real region with country names visible, then flies to the flashpoint. A *Field Brief* card shows where you are (region, coordinates) and one real fact about the place.
3. **Read the map**. Pulsing pins sit on real locations (Delhi, Karachi, Punjab, Kashmir, Bengal…). At most 4 labels are visible at once, always upright and never overlapping. Country names are large letter-spaced labels; cities get a dot and a small label.
4. **Decide**. Tapping a pin opens a **bottom sheet** with 2–3 order cards *for that place*. Every card shows a **title, a 1–2 line description, and effect chips** (e.g. `▲ Credibility`, `▼ Civilian cost`, `⚠ Escalation`). Selecting a card draws a line on the map from the sheet to the pin it affects.
5. **Hold to authorise**. A full-width button you press and hold for 0.8s while a ring fills, with a light haptic tick. It's deliberate and tactile, and stops accidental taps.
6. **Watch it happen on the map**. Each effect tag maps to a visible map action:
   - `escalation` → red pulse rings and a contested-region tint
   - `civilian_cost` → animated refugee flow arrows along real corridors
   - `credibility` / diplomacy → gold link arc between capitals
   - `time` → clock sweep on the pin
   - Border-themed beats → a line drawn across the map in real time (e.g. the Radcliffe Line)

   A compact meter strip (Stability · Credibility · Civilian toll · Escalation) animates the change.
7. **Debrief (learn moment #2)**. A card shows *what you did*, *what it caused*, and **"In history:"**, the real outcome. Then **Next phase →**.
8. **After Action**. Score ring and rank (S–E), 4 pillar bars, and a **map replay** where the camera revisits each decision on the map. A **"Places learned"** strip adds new places to your Atlas Codex. Share (native share sheet on Android/iOS), Redeploy, and Next crisis.
9. **Atlas Codex (retention)**. A collection of every place you've discovered, each with its fact and the crises it appeared in. A completion % per region gives a reason to come back.
10. **Save / resume** (kept from the current build). Auto-save on every phase and on app pause/background, with resume from Menu and Atlas.

**Why it's compelling (MDA / SDT):** the main pleasures are *discovery* (real places revealed) and *expression* (your path vs. history). Competence comes from clear consequences and the score/rank. Autonomy comes from picking the place first, then the order. The Codex completion loop drives replay.

## Controls and Input Methods
- **Touch only** (Input System `EnhancedTouch` + UI Toolkit pointer events): tap pins, tap cards, press-and-hold to authorise (haptic tick on supported devices), one-finger pan, two-finger pinch zoom (clamped to the region), double-tap to re-frame.
- **Android system Back button** = close sheet → pause dialog → leave screen (never a hard quit mid-run).
- All tap targets ≥ 48dp. The primary action sits in the thumb zone (bottom 20%), above the iOS home indicator / Android gesture bar.
- Mouse input in the Editor works through the same pointer events, for testing only.

---

# UI

Built entirely with **UI Toolkit**: one `UIDocument` per screen, shared `PanelSettings` (`Genesis.PanelSettings`, Scale With Screen Size 882×1784, match 0.5), and unified theme stylesheets (`tokens.uss`, `components.uss`). Text uses crisp TextMeshPro vector SDF assets generated from **Inter** (Regular, SemiBold, Bold) so that every glyph remains razor-sharp across all phone and tablet DPIs. Safe area insets (iOS Dynamic Island, notch, home indicator; Android punch-hole, gesture bar) are dynamically applied to every screen root via `SafeAreaRootBehaviour`.

---

## Design System Tokens & Foundations (`tokens.uss`)

- **Palette Hierarchy**:
  - `Background Obsidian Void`: `#090C10` / `#070A0F`
  - `Surface Glass Panel`: `#161B22` with 85% alpha (`rgba(22, 27, 34, 0.88)`), border `1px solid #30363D`
  - `Primary Action / Brass CTA`: `#E5AD3F` (Text: `#070A0F` bold uppercase; active press: `#FFC95A`)
  - `Cost / Danger / Kinetic`: Crimson `#E35D5B` / `#FF453A`
  - `Gain / Accord / Stability`: Emerald `#32D74B` / `#2EA043`
  - `Intel / Credibility`: Ocean Cyan `#64D2FF` / `#388BFD`
  - `Escalation / Contested / Warning`: Warm Amber `#FF9F0A` / `#F5A524`
  - `Text Primary`: Crisp Bone White `#F0F6FC`
  - `Text Secondary / Meta`: Muted Slate `#8B949E` / `#C9D1D9`
- **Typography Scale (Inter SDF)**:
  - Header Hero: 28–32pt Bold, uppercase, letter-spacing +2px
  - Section Eyebrow / Kicker: 12–14pt SemiBold, letter-spacing +3px, gold/cyan accent
  - Card Title: 18–20pt Bold, uppercase
  - Card Body / Description: 14–16pt Regular, line-height 1.35
  - Primary Button Label: 18–20pt Bold, uppercase
  - Badges & Metric Chips: 12–14pt SemiBold, uppercase
- **Touch Targets & Geometry**:
  - All interactive buttons have minimum touch dimensions of 48×48dp (primary CTA height 56dp).
  - Rounded corners: 16–20px for major glass cards, 8–10px for tactical chips, 28px pill radius for toggles.

---

## Complete 7-Screen Visual Specifications & Wireframes

### Screen 1: Main Menu (`MainMenu.uxml` / `MainMenu.unity`)
Hero portal welcoming players into the geopolitical command center with instant mission resume.
```
┌────────────────────────────────────────────────────────┐
│ [SAFE AREA HEADER]                                     │
│ 1914 · EUROPE IN FLAMES // GEOPOLITICAL CRISIS SIMULATOR │
│ G E N E S I S                                          │
│                                                        │
│ [ACTIVE DEPLOYMENT BANNER - IF RUN IN PROGRESS]        │
│ ┌────────────────────────────────────────────────────┐ │
│ │ ⚡ RESUME ACTIVE MISSION: PORT ARTHUR ECHO          │ │
│ │ Phase 02/03 · ⏱️ 02:45 remaining                   │ │
│ │ [ RESUME MISSION → ]         [ ABANDON RUN ]       │ │
│ └────────────────────────────────────────────────────┘ │
│                                                        │
│ [HERO FEATURED CRISIS CARD]                            │
│ ┌────────────────────────────────────────────────────┐ │
│ │ [HERO MAP THUMBNAIL PREVIEW WITH VIGNETTE SHADE]   │ │
│ │ 01 · JULY WIRE (1914)                              │ │
│ │ Belgium and northern France as mobilization starts.│ │
│ │ Region: Europe · Difficulty: Medium · FREE DESK    │ │
│ │ [ >>>  ENTER THEATER SELECTION  <<< ]              │ │
│ └────────────────────────────────────────────────────┘ │
│                                                        │
│ [QUICK ACCESS GRID]                                    │
│ ┌────────────────────────┐  ┌────────────────────────┐ │
│ │ 🗺️ STRATEGIC ARCHIVES   │  │ 📖 ATLAS CODEX         │ │
│ └────────────────────────┘  └────────────────────────┘ │
│ ┌────────────────────────┐  ┌────────────────────────┐ │
│ │ ⚙️ SETTINGS & AUDIO     │  │ 👑 FULL GAME UNLOCK    │ │
│ └────────────────────────┘  └────────────────────────┘ │
│                                                        │
│ [BOTTOM SAFE AREA] v1.0.0 · Build 2026 · Privacy · Terms│
└────────────────────────────────────────────────────────┘
```

### Screen 2: Theater Selection / Living Atlas (`Atlas.uxml` / `TheaterSelect.unity`)
Responsive 25-desk historical crisis grid with freemium lock state, filter badges, and master-detail preview.
```
┌────────────────────────────────────────────────────────┐
│ ◀ MAIN MENU      1914 · EUROPE IN FLAMES               │
│ T H E A T E R   S E L E C T I O N                      │
│ Choose a crisis to command. 5 desks are free to play.  │
│ [GUEST BADGE: 5 Free Desks]    [FULL ACCESS: $4.99]    │
├────────────────────────────────────────────────────────┤
│ [ACTIVE RUN BANNER - WHEN PERSISTED RUN EXISTS]        │
│ [ RESUME CURRENT MISSION ]      [ ABANDON & CHOOSE ]   │
├────────────────────────────────────────────────────────┤
│ [RESPONSIVE CRISIS CARD GRID: 2-col phone / 3-col tab] │
│ ┌───────────────────────┐  ┌─────────────────────────┐ │
│ │ [MAP PREVIEW 384px]   │  │ [MAP PREVIEW 384px]     │ │
│ │ 01  PORT ARTHUR ECHO  │  │ 02  JULY WIRE           │ │
│ │ FREE DESK             │  │ FREE DESK               │ │
│ │ Pacific naval crisis. │  │ Schlieffen timetable.   │ │
│ │ [ PLAY THEATER → ]    │  │ [ PLAY THEATER → ]      │ │
│ └───────────────────────┘  └─────────────────────────┘ │
│ ┌───────────────────────┐  ┌─────────────────────────┐ │
│ │ [MAP PREVIEW 384px]   │  │ [MAP PREVIEW 384px]     │ │
│ │ 06  ANATOLIAN MANDATE │  │ 07  BLACK THURSDAY      │ │
│ │ ▣ LOCKED (GENESIS PRO)│  │ ▣ LOCKED (GENESIS PRO)  │ │
│ │ Allied zones conflict │  │ Global economic panic.  │ │
│ │ [ UNLOCK $5 ]         │  │ [ UNLOCK $5 ]           │ │
│ └───────────────────────┘  └─────────────────────────┘ │
├────────────────────────────────────────────────────────┤
│ [DETAIL INSPECTION DRAWER (Bottom on Phone / Left on Tab)]│
│ Selected: Port Arthur Echo (1905) · Pacific Naval Desk │
│ Objectives | Intelligence | Historical Precedents      │
│ [ >>> PLAY THEATER / UNLOCK DESK <<< ]                 │
└────────────────────────────────────────────────────────┘
```

### Screen 3: Command HUD & Tactical Order Sheet (`CommandHud.uxml`, `OrderSheet.uxml` / `TheaterPlay.unity`)
Hero real 3D map board occupying ≥60% screen height, tactical metric HUD, and bottom directive deck.
```
┌────────────────────────────────────────────────────────┐
│ ◀ THEATERS     1914 · JULY WIRE             Phase 1/3  │
│ ⏱️ 00:45       STAB ▓▓▓  CRED ▓▓▓  TOLL ▓▓  ESC ▓     │
├────────────────────────────────────────────────────────┤
│                                                        │
│               [3D CARTOGRAPHIC HERO MAP]               │
│            (Real relief + coast + country borders)     │
│                 Brussels ◉     Liège ◉                 │
│                      •Paris        •Berlin             │
│            (Pulsing tactical beacons with halo rings)  │
│                                                        │
├────────────────────────────────────────────────────────┤
│ ▔▔▔  FRONTIER DISTRICT // Dynamic Field Intel Drawer   │
│ ┌──────────────┐  ┌──────────────┐  ┌────────────────┐ │
│ │ ⚔️ KINETIC    │  │ 🕊️ ACCORD    │  │ 👁️ COVERT       │ │
│ │ DELAY RAIL   │  │ DIRECT WIRE  │  │ BACKCHANNEL    │ │
│ │ Hold Belgian │  │ Open London  │  │ Secret cable   │ │
│ │ rail lines   │  │ diplomatic   │  │ to ambassador  │ │
│ │ ▲Cred ▼Toll  │  │ ▲Stab ▼Esc   │  │ ▲Intel         │ │
│ └──────────────┘  └──────────────┘  └────────────────┘ │
│                                                        │
│ [HERO HOLD-TO-CONFIRM COMMAND ACTUATOR (THUMB-ZONE)]   │
│ ┌────────────────────────────────────────────────────┐ │
│ │ [ ◯  HOLD TO AUTHORISE DIRECTIVE (0.8s) ]          │ │
│ └────────────────────────────────────────────────────┘ │
│ ─────────── iOS Home Indicator / Android Bar ──────────│
└────────────────────────────────────────────────────────┘
```

### Screen 4: Mid-Phase Debrief Dossier Modal (`Debrief.uxml` / `TheaterPlay.unity`)
Sliding classified glass card detailing directive fallout, gains/costs, and historical reality.
```
┌────────────────────────────────────────────────────────┐
│ [TRANSLUCENT SCRIM - HERO 3D BOARD VISIBLE BEHIND]     │
│                                                        │
│ ┌────────────────────────────────────────────────────┐ │
│ │ PHASE 1 · CLASSIFIED DEBRIEF                       │ │
│ │ ────────────────────────────────────────────────── │ │
│ │ WHAT YOU AUTHORIZED:                               │ │
│ │ DELAY RAIL MOVEMENTS ACROSS BELGIAN FRONTIER       │ │
│ │ Directives executed across western transport hubs. │ │
│ │                                                    │ │
│ │ TACTICAL OUTCOME DELTAS:                           │ │
│ │ [ ▲ Credibility +25 ]  [ ▼ Civilian Toll -15 ]     │ │
│ │ [ ⚠ Escalation Risk Contained ]                    │ │
│ │                                                    │ │
│ │ ────────────────────────────────────────────────── │ │
│ │ WHAT HAPPENED IN HISTORY:                          │ │
│ │ On August 2, 1914, Germany demanded unhindered     │ │
│ │ passage through Belgium. King Albert rejected the  │ │
│ │ ultimatum, triggering British intervention...      │ │
│ │                                                    │ │
│ │ 📍 NEW PLACES DISCOVERED: +Liège +Namur +Meuse     │ │
│ │                                                    │ │
│ │ [ >>>  PROCEED TO PHASE 2 →  <<< ]                 │ │
│ └────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

### Screen 5: After Action / World Shaper Results (`AfterAction.uxml` / `Results.unity`)
Comprehensive post-mortem evaluation with vector ScoreRing, Cabinet Rank, outcome breakdown, and viral share card.
```
┌────────────────────────────────────────────────────────┐
│ [TOP SAFE AREA]                                        │
│ AFTER ACTION REPORT · 1914 JULY WIRE                   │
│ Cabinet Decision Audit · Completed in 04:12            │
├────────────────────────────────────────────────────────┤
│ [HERO CABINET RANK & SCORERING CARD]                   │
│ ┌────────────────────────────────────────────────────┐ │
│ │             ╭──────────────╮                       │ │
│ │             │   RANK  A    │                       │ │
│ │             │   92 / 100   │  (Vector ScoreRing)   │ │
│ │             ╰──────────────╯                       │ │
│ │         "MASTER OF CRISIS CONTAINMENT"             │ │
│ │   You contained continental escalation and held   │ │
│ │   coalition credibility through the July crisis.   │ │
│ └────────────────────────────────────────────────────┘ │
│                                                        │
│ [OUTCOME PILLARS]                                      │
│ Stability        ▓▓▓▓▓▓▓▓░░  82% (+14 vs History)      │
│ Credibility      ▓▓▓▓▓▓▓▓▓░  91% (+22 vs History)      │
│ Civilian Toll    ▓▓▓░░░░░░░  28% (-34 vs History)      │
│ Escalation Risk  ▓▓▓▓░░░░░░  36% (Contained)           │
│                                                        │
│ [YOUR PATH VS HISTORY - PHASE AUDIT TIMELINE]          │
│ • Phase 1: Delayed rail surge → Prevented panic        │
│ • Phase 2: Opened direct wire → London accord          │
│ • Phase 3: Guaranteed Channel neutrality               │
│                                                        │
│ [VIRAL MOBILE SOCIAL SHARE DECK]                       │
│ ┌────────────────────────────────────────────────────┐ │
│ │ [ 📤 SHARE DEBRIEF DOSSIER (INSTAGRAM / X / WA) ]   │ │
│ │ [ 📋 COPY CHALLENGE COPY ]   [ 💾 SAVE DOSSIER ]   │ │
│ └────────────────────────────────────────────────────┘ │
│                                                        │
│ [ACTION BUTTONS]                                       │
│ [ 🔄 REDEPLOY THEATER ]    [ 🏛️ NEXT CRISIS (1917) ]   │
│ [ 🗺️ RETURN TO ARCHIVES ]                              │
└────────────────────────────────────────────────────────┘
```

### Screen 6: Settings & Preferences (`Settings.uxml` / `Settings.unity`)
Sleek settings deck with graphics quality toggle, tactile feedback, account linking, and store restore.
```
┌────────────────────────────────────────────────────────┐
│ ◀ BACK                      S E T T I N G S            │
├────────────────────────────────────────────────────────┤
│ GRAPHICS & VISUAL FIDELITY                             │
│ Current Mode: High Fidelity (60 FPS Flagship)          │
│ [ FORCE HIGH QUALITY (60 FPS) ]  [ STANDARD QUALITY ]  │
│ Full URP shadows, SSAO, 2K textures, unthrottled frame.│
│                                                        │
│ INPUT & CABINET AUDIO                                  │
│ Haptic Feedback (Touch Ticks)     [ ● ON  |   OFF ]    │
│ Atmospheric Command Audio         [ ● ON  |   OFF ]    │
│                                                        │
│ ACCOUNT & PROGRESSION                                  │
│ Cloud Profile: Offline Guest                           │
│ [ CREATE ACCOUNT / SIGN IN ]      [ SIGN OUT ]         │
│                                                        │
│ CLEARANCE & MONETIZATION                               │
│ Status: Genesis Standard (5 Free Theaters)             │
│ [ UNLOCK FULL GAME ($4.99) ]      [ RESTORE IAP ]      │
│                                                        │
│ ABOUT & LEGAL                                          │
│ Genesis Engine v1.0.0 (Unity 6000.6.3f1)               │
│ Terms of Service · Privacy Policy · Attribution        │
└────────────────────────────────────────────────────────┘
```

### Screen 7: Full Game Unlock / Paywall Modal (`FullGameUnlock.uxml`)
High-converting frosted glass store modal with clear value proposition and store compliance.
```
┌────────────────────────────────────────────────────────┐
│ [TRANSLUCENT OBSIDIAN BACKDROP SCRIM]                  │
│                                                        │
│ ┌────────────────────────────────────────────────────┐ │
│ │ [ ✕ CLOSE ]                                        │ │
│ │ G E N E S I S   P R O                              │ │
│ │ F U L L   G A M E   U N L O C K                    │ │
│ │                                                    │ │
│ │ Command all 32 historical crises across the globe. │ │
│ │ From the 1905 Far East to modern diplomatic flash- │ │
│ │ points, unlock the full Strategic Archives.        │ │
│ │                                                    │ │
│ │ ✓ All 32 historical theaters permanently unlocked  │ │
│ │ ✓ One-time non-consumable purchase — no recurring  │ │
│ │   subscriptions                                    │ │
│ │ ✓ Cloud sync & restorable across all devices       │ │
│ │                                                    │ │
│ │ PRICE: $4.99 USD (One-time)                        │ │
│ │                                                    │ │
│ │ [ >>>  UNLOCK ALL THEATERS ($4.99)  <<< ]          │ │
│ │                                                    │ │
│ │ [ RESTORE PURCHASES ]                              │ │
│ │                                                    │ │
│ │ [ Back to Free Desks ]                             │ │
│ └────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

---

## Responsive Breakpoint Rules (iOS & Android)

- **PanelSettings Scale Reference**: `882 × 1784`, match `0.5`.
- **Logical Screen Width Breakpoints**:
  - `Phone Portrait (<600 logical px)`:
    - 2-column Atlas cards.
    - Full-width stacked After Action pillars.
    - Bottom command sheet peek ~32% safe height.
  - `Large Phone / Phablet (600–768 logical px)`:
    - 2 or 3-column Atlas cards depending on screen aspect ratio.
    - Generous card padding and 18pt typography.
  - `Tablet Portrait (768–1024 logical px)`:
    - 3-column Atlas cards.
    - Side-by-side Outcome pillars in After Action.
  - `Landscape / Desktop (≥900 logical px AND width > height)`:
    - Atlas flips to Master-Detail layout: fixed detail pane on left (~38%), scrollable card grid on right.
    - Gameplay Order Sheet shifts to ergonomic side/bottom hybrid dock.
- **Hardware Safe Area Handling**:
  - Dynamically binds to `Screen.safeArea` insets.
  - Top bar adds notch / Dynamic Island padding automatically.
  - Bottom command deck leaves 24–34pt clearance above home indicator / Android navigation pill.

---

# Key Asset & Context

### Verified in project (this session)
- `StreamingAssets/Maps/geo/*.json`: 23 regions, **Natural Earth lon/lat** polygons with `bbox` (e.g. `southasia` bbox lon 60–98, lat 5–38), plus `lands` and `rivers`.
- `StreamingAssets/Maps/relief/*.png` (23), `mask/*.png` (23), `terrain/*.jpg` (9): relief and coast textures.
- `StreamingAssets/Theaters/*.json`: 33 theaters. Board markers use **approximate 0–100 x/y** (e.g. Karachi x18/y52), *not* real coordinates, and there is **no historical-outcome or place-fact content**. Both are addressed below without editing theater JSON.
- UI Toolkit (`UIDocument`) and TextMeshPro are available. Inter fonts exist in `com.unity.dt.app-ui` (copied into `Assets/UI/Fonts` so we don't depend on that package).
- Build support: **Android installed**, **iOS not installed**. Active target StandaloneOSX; orientation PortraitUpsideDown; Android min API 26; iOS target 15.0.
- `TheaterSession` talks to presentation through a small surface: `boardBuilder.Build/SetSelectedMarker`, `cameraRig.FrameBoard/FocusWorld/ResetFocus`, `hud.BindTheater/ShowBeat/SetFocusLabel/ShowIntelChip/ArmExecute/LockExecute/ShowCommitBeat/ShowMissionComplete`, `orderRail.ShowOrders/SetSelected/Lock/Hide`, `worldFx.PlayExecute`, `resolveBeat.Show`. **The rebuild keeps this contract**, so gameplay rules, scoring, save/resume and share keep working.

### New content (sidecar files — theater JSON untouched)
- `StreamingAssets/Atlas/gazetteer.json`: real lat/lon for each marker label, per theater (Delhi 28.61N 77.21E, Karachi 24.86N 67.01E, Lahore, Amritsar, Srinagar, Kolkata/Dhaka, Hyderabad…). Fallback: existing x/y mapped into the bbox.
- `StreamingAssets/Atlas/learn/<theaterId>.json`: `placeFacts{markerId→fact}`, `beatHistory{beatId→"In history" text}`, optional `storyLines` (e.g. the Radcliffe Line polyline), and `borders` if the region geo lacks admin borders. **Fully authored for 3 flagship crises** (1947 Partition, 1962 Cuba, 1989 Berlin). Other theaters fall back to briefing/premise text, so nothing is empty.
- StreamingAssets loading uses `UnityWebRequest` on Android (files sit inside the APK) and `File` IO on iOS. One loader handles both.

### New code (folder `Assets/Scripts/Atlas/`, namespace `Genesis.Atlas`)
| File | Role |
|---|---|
| `GeoProjection.cs` | lon/lat ↔ map UV ↔ world (Web-Mercator within region bbox) |
| `AtlasContent.cs` | Loads gazetteer + learn sidecars (Android-safe StreamingAssets loader), with fallbacks |
| `RealMapBoard.cs` | Builds one map surface: land rasterised from Natural Earth polygons into a runtime mask, relief hill-shade, ocean depth gradient, coast line, country borders and rivers as anti-aliased lines |
| `Shaders/AtlasMap.shadergraph` | URP mobile-friendly map shader: hillshade × land tint, ocean gradient, crisp coast edge (no bloom) |
| `AtlasPin.cs` | Pin visual + tap target, replaces `HotspotMarker` visuals |
| `AtlasCamera.cs` | Fit-to-bbox framing for portrait, fly-to, pan/pinch (EnhancedTouch), clamps |
| `MapLabelOverlay.cs` | UI Toolkit labels projected from world, priority + collision culling (≤4 city labels, country names separate) |
| `MapStoryFX.cs` | Line draw-on, refugee flow arrows, pulse rings, region tint, gold arcs (LineRenderer + scrolling texture, pooled to avoid GC) |
| `EffectToMapVerb.cs` | Maps effect tags → `MapStoryFX` calls |
| `MobilePlatform.cs` | Haptics, Android Back button routing, native share wrapper, safe-area change events |

### New UI (folder `Assets/UI/`)
- `Genesis.PanelSettings.asset`, `Theme/Genesis.tss`, `Theme/tokens.uss`, `Theme/components.uss`
- `Screens/CommandHud.uxml`, `OrderSheet.uxml`, `Debrief.uxml`, `AfterAction.uxml`, `MainMenu.uxml`, `Atlas.uxml`, `Codex.uxml`, `Settings.uxml`, `PauseDialog.uxml`
- `Scripts/UI/Toolkit/`: `SafeAreaRoot.cs`, `HoldToConfirmButton.cs` (custom `VisualElement`), `BottomSheet.cs` (snap heights + drag), `MeterStrip.cs`, `OrderCardElement.cs`, `ScoreRing.cs` (Painter2D vector arc), screen presenters.
- Existing presenter classes (`OpsHudController`, `OrderRailController`, `ResolveBeatController`, `ResultsController`, `MainMenuController`, `TheaterSelectController`, `SettingsController`) are **rewritten internally** to drive UI Toolkit, keeping public method signatures.

### Removed after the new path is verified
`UI/TacticalSkin/*`, `UI/ModernSkin/*`, `UI/Views/*` (uGUI views), `MilitaryUiSkin`, the extrusion/zone-cube code paths in `TheaterBoardBuilder` (its public API is kept as a thin adapter over `RealMapBoard`), `TextMesh` world labels, and the corrupted `Assets/Plans/genesis-living-atlas-rebuild.md`.

---

# Implementation Steps

Each stage ends with a **screenshot gate**: Device Simulator captures on iPhone SE (750×1334), iPhone 15 (1179×2556, Dynamic Island) and Pixel 8 (1080×2400, punch-hole), shown to you before the next stage starts. Stages 1, 3 and 6 also produce an **Android APK** you can install on a phone.

### Stage 0 — Mobile setup + verify foundations
- **0.1** Check that `relief/mask` PNGs line up with geo `bbox`; check whether region geo includes country borders. If not, add Natural Earth admin-0 borders to the learn sidecar for the 3 flagship regions. *Role: explorer · Deps: none · Parallel: yes*
- **0.2** Enumerate every external use of `TheaterBoardBuilder`, `HotspotMarker`, `TheaterCameraRig` and `WorldReactionFX` APIs (`TheaterSession`, `WorldReactionFX`, `MapLabelLayout`, `GenesisScarDecals`, Editor builders). This defines the adapter surface. *Role: explorer · Deps: none · Parallel: yes*
- **0.3** Copy Inter fonts to `Assets/UI/Fonts`, generate SDF `FontAsset`s, create `PanelSettings` and the theme skeleton. *Role: developer · Deps: none · Parallel: yes*
- **0.4** Mobile project setup: switch active build target to **Android**; set Default Orientation **Portrait**, disable autorotate; Android: IL2CPP, ARM64, min API 26, target Auto, ASTC; iOS (stored now, applied once the module is installed): IL2CPP, target iOS 15, portrait, *Requires full screen*; confirm Device Simulator is available for phone previews. *Role: developer · Deps: none · Parallel: yes*

### Stage 1 — The real map (hero) → screenshot gate + APK
- **1.1** `GeoProjection`, `AtlasContent` (Android-safe loader), `gazetteer.json` (flagship regions first). *Role: developer · Deps: 0.1 · Parallel: no*
- **1.2** `RealMapBoard` + `AtlasMap` shader: land mask from polygons, relief hillshade, ocean, coast, borders, rivers. *Role: developer · Deps: 1.1 · Parallel: no*
- **1.3** `AtlasPin` on real coordinates; `AtlasCamera` portrait fit-to-region with fly-to and touch pan/pinch. *Role: developer · Deps: 1.2 · Parallel: no*
- **1.4** `MapLabelOverlay` (UI Toolkit, collision-culled, upright). *Role: developer · Deps: 0.3, 1.3 · Parallel: no*
- **1.5** Make `TheaterBoardBuilder` / `TheaterCameraRig` thin adapters over the new classes; remove zone cubes and `TextMesh` labels. *Role: developer · Deps: 0.2, 1.3 · Parallel: no*
- **Gate**: India/Pakistan clearly recognisable in ≤2s on an iPhone SE screen, ≥4 named places readable, map ≥ 62% of safe height.

### Stage 2 — Command UI in UI Toolkit → screenshot gate
- **2.1** Theme tokens + components (glass sheet, chip, card, button, meter). *Role: developer · Deps: 0.3 · Parallel: yes*
- **2.2** `CommandHud.uxml` + rewritten `OpsHudController` (top bar, phase, meter strip, pause → save & exit dialog, Android Back routing). *Role: developer · Deps: 2.1 · Parallel: no*
- **2.3** `OrderSheet.uxml` + `BottomSheet` + `OrderCardElement` + rewritten `OrderRailController` (pin-scoped orders, title + description + chips, card→pin link line). *Role: developer · Deps: 2.1, 1.3 · Parallel: no*
- **2.4** `HoldToConfirmButton` + haptic, wired to `TheaterSession.OnExecutePressed`. *Role: developer · Deps: 2.2 · Parallel: no*
- **Gate**: every text element non-empty and readable on iPhone SE; cards show descriptions; authorise button labelled and above the gesture bar.

### Stage 3 — Consequences + learning → screenshot gate + APK
- **3.1** `MapStoryFX` + `EffectToMapVerb` (pooled), hooked from `WorldReactionFX.PlayExecute`. *Role: developer · Deps: 1.5 · Parallel: yes*
- **3.2** `MeterStrip` animation from effect weights. *Role: developer · Deps: 2.2 · Parallel: yes*
- **3.3** Fly-in Field Brief at beat start (place fact from sidecar). *Role: developer · Deps: 1.3, 2.1 · Parallel: yes*
- **3.4** `Debrief.uxml` + rewritten `ResolveBeatController` with an "In history" section. *Role: developer · Deps: 2.1 · Parallel: yes*
- **3.5** Author learn sidecars for 1947 Partition, 1962 Cuba, 1989 Berlin. *Role: developer · Deps: 1.1 · Parallel: yes*
- **Gate**: executing an order visibly changes the map; debrief shows real history.

### Stage 4 — After Action + Codex → screenshot gate
- **4.1** `AfterAction.uxml` + rewritten `ResultsController` (ScoreRing, pillars, map replay strip, places learned, native share / copy / redeploy / next). *Role: developer · Deps: 2.1 · Parallel: yes*
- **4.2** Codex persistence (`PlayerPrefs` JSON of discovered place ids) + `Codex.uxml`. *Role: developer · Deps: 3.5 · Parallel: yes*

### Stage 5 — Shell screens → screenshot gate
- **5.1** `MainMenu.uxml` (live map hero background, Resume card), `Atlas.uxml` (region chips, map thumbnails, resume banner), `Settings.uxml`; rewrite the matching controllers. *Role: developer · Deps: 1.2, 2.1 · Parallel: yes*

### Stage 6 — Cleanup, builds, performance
- **6.1** Delete the legacy uGUI skin/view code and dead board paths; update `GenesisSceneBuilder` checks. *Role: developer · Deps: Stages 1–5 · Parallel: no*
- **6.2** Automated Play Mode loop test + phone-resolution screenshots + **Android build (APK for sideload + AAB for Play Store)**; **iOS Xcode project export** once the iOS module is installed. *Role: developer · Deps: 6.1 · Parallel: no*
- **6.3** Mobile performance pass on the Android build: 60 fps on map pan/zoom, draw calls < 150, memory < 600MB, no GC spikes during FX; check thermal fallback. *Role: developer · Deps: 6.2 · Parallel: no*

### Stage 7 — Worldclass 7-Screen Release Unification & Pixel-Perfect Implementation (Current Goal)
- **7.1** `tokens.uss` & `components.uss` Design Token Finalization: Lock shared variables across all screens (`#090C10` obsidian void, `#161B22` frosted glass, `#E5AD3F` brass CTA, `#32D74B` stability, `#64D2FF` credibility, `#E35D5B` cost, `#FF9F0A` escalation). *Role: developer · Deps: none · Parallel: yes*
- **7.2** Screen 1 (Main Menu) Pixel-Perfect Pass: Refine `MainMenu.uxml` and `MainMenu.uss` to match `mockup-v2-mainmenu-portrait.jpg` exactly: hero card layout, responsive resume card, high-contrast CTA, and clean typography. *Role: developer · Deps: 7.1 · Parallel: yes*
- **7.3** Screen 2 (Atlas / Theater Select) Responsive Desk Pass: Align `Atlas.uxml`, `Atlas.uss`, and `TheaterCardElement.cs` with `mockup-v2-atlas-portrait.jpg` and `mockup-v2-atlas-landscape.jpg`: 25 desks, 5 free / 20 locked, responsive 2/3-col and master-detail layout. *Role: developer · Deps: 7.1 · Parallel: yes*
- **7.4** Screen 3 (Command HUD & Order Sheet) Tactical Polish: Verify and polish `CommandHud.uxml`, `OrderSheet.uxml`, and `HoldToConfirmButton.cs` against `mockup-v2-gameplay-portrait.jpg` and `mockup-v2-order-commit-portrait.jpg`: 56dp brass hold actuator, metric bars, and smooth bottom sheet. *Role: developer · Deps: 7.1 · Parallel: yes*
- **7.5** Screen 4 (Mid-Phase Debrief Modal) Dossier Polish: Update `Debrief.uxml` and `Debrief.uss` to present the sliding frosted glass classified debrief card, historical record section, discovered places badge, and brass `Next phase →` CTA. *Role: developer · Deps: 7.1 · Parallel: yes*
- **7.6** Screen 5 (After Action / Results) World Shaper Overhaul: Refine `AfterAction.uxml`, `AfterAction.uss`, and `ResultsController.cs`: vector `ScoreRing` rendering, Cabinet Rank medal, 4 outcome pillar tracks, timeline audit, and one-tap social share dossier card generator. *Role: developer · Deps: 7.1 · Parallel: yes*
- **7.7** Screen 6 (Settings & Preferences) Screen Polish: Modernize `Settings.uxml` and `Settings.uss`: graphics mode toggle (High 60fps vs Standard), haptic & audio pills, account management, and restore purchases button. *Role: developer · Deps: 7.1 · Parallel: yes*
- **7.8** Screen 7 (Full Game Unlock Modal) Store Compliance: Polish `FullGameUnlock.uxml` and `FullGameUnlock.uss`: frosted glass card, feature checklist, live localized price hint, restore button, and store compliant dismissal. *Role: developer · Deps: 7.1 · Parallel: yes*
- **7.9** Multi-Resolution Capture Suite: Extend `LivingAtlas25Validate.cs` into `ReleaseUiValidate.cs` capturing all 7 screens across the 4 responsive matrix resolutions: 390×844, 430×932, 900×1600, 1920×1080. *Role: developer · Deps: 7.2–7.8 · Parallel: no*

---

# Verification & Testing

1. **Automated Loop Test (Play Mode)**:
   - Full flow: Boot → MainMenu → Atlas → Pick desk → Command HUD → Select Directive → Hold to Confirm (0.8s) → 3D Map FX → Mid-Phase Debrief → Complete Beats → After Action Results → Share & Replay.
   - Zero console errors, zero missing labels, zero broken layout bindings.
2. **Readability & Tap Target Discipline**:
   - Zero text clipping or truncation on critical copy across all 7 screens.
   - All interactive touch targets ≥ 48×48dp; primary command actuators 56dp height in lower thumb zone.
   - Vector TextMeshPro SDF Inter fonts crisp and legible on iPhone SE (750×1334) through 4K displays.
3. **4-Resolution Responsive Matrix Validation**:
   - **390 × 844** (Standard Portrait Phone - iPhone 13/14/15/16): 2-col Atlas, stacked After Action pillars, bottom sheet thumb-zone clearance.
   - **430 × 932** (Large Portrait Phone - iPhone Pro Max / Plus): 2-col Atlas, generous card padding, zero edge overflow.
   - **900 × 1600** (Tablet Portrait - iPad / Android Tablet): 3-col Atlas, dual-column Outcome pillars in results.
   - **1920 × 1080** (Desktop / Landscape): Atlas master-detail layout (38% left pane, 3-col right grid), side/bottom command HUD dock.
   - Captured artifacts saved to `Assets/Plans/release-validate-{screen}-{resolution}.png`.
4. **Hardware Safe Area Compliance**:
   - Verified on devices with Dynamic Island, camera punch-holes, and gesture navigation bars. `SafeAreaRootBehaviour` dynamically applies insets without jarring jumps.
5. **Mobile Lifecycle & Persistence**:
   - Backgrounding during any screen preserves state; incoming calls or OS interrupts auto-save active phase.
   - Android hardware Back button cleanly steps back (Close modal → Pause dialog → Screen exit) without force-quitting.
6. **Production Build Gate**:
   - **Android**: APK and AAB build cleanly with 0 errors (IL2CPP ARM64, Target SDK 34+).
   - **iOS**: Xcode project builds cleanly with 0 errors once iOS module is compiled. Portrait orientation locked. Steady 60 FPS verified on target hardware.
