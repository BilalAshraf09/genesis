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

Built entirely with **UI Toolkit**: one `UIDocument` per screen, a shared `PanelSettings` (Scale With Screen Size 1080×1920, match 0.5), and one theme stylesheet with design tokens. Text uses SDF font assets generated from **Inter** (Regular / SemiBold / Bold), so it stays crisp at every phone density. Safe area is applied as root padding from `Screen.safeArea`.

### Command screen (TheaterPlay) — portrait phone
```
┌──────────────────────────────────────────┐
│ ◀  1947 · India Partition     Phase 1/3  │  top bar (glass, 64dp, below notch)
│ ▓▓▓▓ Stab  ▓▓▓ Cred  ▓▓ Toll  ▓ Esc      │  meter strip (28dp)
├──────────────────────────────────────────┤
│                                          │
│        P A K I S T A N       Kashmir•    │
│                  Punjab ◉                │  REAL MAP ≥ 62% height
│     Karachi•          •Delhi             │  relief + coast + borders
│                 I N D I A       Bengal◉  │  ≤ 4 labels, upright
│                                          │
├──────────────────────────────────────────┤
│ ▔▔▔  PUNJAB  · flashpoint                │  bottom sheet (drag handle)
│ ┌────────────┐┌────────────┐┌──────────┐ │
│ │⚔ Hold date │ │🕊 Delay 12 │ │👁 Secret │ │  order cards: title +
│ │Meet politics│ │weeks to buy│ │cable to …│ │  description + chips
│ │▲Cred ▼Toll │ │▲Time ▼Cred │ │▲Intel    │ │
│ └────────────┘└────────────┘└──────────┘ │
│ [ ◯  HOLD TO AUTHORISE · HOLD THE DATE ] │  56dp, thumb zone
│ ───────── home indicator / gesture bar ── │
└──────────────────────────────────────────┘
```

### Debrief card (slides up over the map, map stays visible)
```
┌──────────────────────────────────────┐
│ PHASE 1 · DEBRIEF                    │
│ You held the date and surged forces. │
│ ▲ Credibility  ▼ Civilian cost       │
│ ─────────────────────────────────    │
│ IN HISTORY                           │
│ Transfer happened 15 Aug 1947; the   │
│ Radcliffe award was published two    │
│ days later. Up to 1M died and ~15M … │
│                [ Next phase → ]      │
└──────────────────────────────────────┘
```

### After Action
```
 Rank ring (S) 94  ·  "Steady Hand"
 Stability ▓▓▓▓▓▓▓▓░ Cred ▓▓▓▓▓▓▓░░ Toll ▓▓░ Esc ▓▓░
 [ map replay strip: Phase1 • Phase2 • Phase3 ]
 Places learned: +Punjab +Kashmir +Radcliffe Line
 [ Share ]  [ Redeploy ]  [ Next crisis ]  [ Atlas ]
```

### Mobile layout rules (apply to every screen)
- Root `SafeAreaRoot` pads by `Screen.safeArea` and re-applies on resolution or cutout change.
- Body text ≥ 15pt, card titles ≥ 18pt, primary button labels ≥ 18pt at 1080 reference. Verified on a 750×1334 iPhone SE as the worst case.
- Bottom sheet has 3 snap heights (peek 22% / half 38% / full 70%) so the map is never fully hidden while deciding.
- No hover states. Pressed states and short transitions (120–200ms) only.

### Main Menu / Atlas (Theater Select) / Codex / Settings
- **Menu**: slowly drifting real-map hero background (current or featured region), a Resume card when a save exists, then Play featured · Atlas · Codex · Settings.
- **Atlas**: region filter chips (South Asia, Europe, Middle East, Pacific…) and a scrolling list of crisis cards with map thumbnails rendered from the same geo data, year, and discovery progress.
- **Codex**: grid of discovered places with region completion %.

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

---

# Verification & Testing
1. **Automated loop test (Play Mode)**: Menu → Atlas → 1947 → tap pin → sheet shows 2–3 cards → each card has non-empty title **and** description → hold authorise → map FX spawned → debrief has "In history" text → Next ×3 → After Action shows score + share. **Fails if any visible `Label` has empty text** (this catches the exact bug in your screenshot).
2. **Readability checks**: label overlap count = 0; city labels on screen ≤ 4; minimum rendered text height ≥ 11pt-equivalent on iPhone SE; map rect ≥ 62% of safe height.
3. **Real-geography check**: pin world positions for Delhi, Karachi and Lahore fall within ±0.5° of real lat/lon after projection.
4. **Save/resume**: exit mid-phase 2 → Atlas shows Resume → resume lands in phase 2 with history intact; finishing clears the save; cold relaunch shows Resume on Menu.
5. **Phones / aspect ratios**: iPhone SE 750×1334 (smallest), iPhone 15 1179×2556 (Dynamic Island), Pixel 8 1080×2400 (punch-hole), Galaxy 1440×3200 (20:9), budget Android 720×1600. Device Simulator screenshots for each go to you at every stage gate.
6. **Mobile lifecycle**: background the app (home / app switch / incoming call) → resume continues the same phase; Android Back button never loses progress; OS kill → cold start offers Resume.
7. **Build gate**: **Android** APK + AAB build with 0 errors (IL2CPP ARM64), installed and run on a real Android phone if one is connected over USB. **iOS** Xcode export with 0 errors once iOS Build Support is installed. Portrait-only verified on both.
8. **Performance gate (Android build)**: steady 60 fps on map interaction on a mid-tier device, 30 fps thermal fallback engages cleanly, no frame > 50ms during execute FX.
