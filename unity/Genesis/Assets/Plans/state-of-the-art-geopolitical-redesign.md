# Project Overview
- **Game Title**: Genesis: Geopolitical Crisis Command
- **High-Level Concept**: A state-of-the-art mobile geopolitical crisis simulator where players assume the role of Supreme Crisis Director across pivotal historical flashpoints (from the 1947 India Partition and 1962 Cuban Missile Crisis to modern trade and border standoffs). Players master real-world geography, analyze authentic field intelligence, deploy high-stakes military, diplomatic, and covert directives, and reshape world history on a dynamic 3D operations board.
- **Players**: Single player (Supreme Crisis Commander / National Security Council).
- **Inspiration / Reference Games**: *Plague Inc.* (immersive global map HUD & crisp data visualization), *Reigns: Her Majesty* (high-impact choice consequences and fluid decision cards), *DEFCON Mobile* (atmospheric command center aesthetic), *Hearts of Iron IV* (depth of historical geography and tactical theaters), and *Apple Design Award* mobile strategy winners.
- **Tone / Art Direction**: Modern Geopolitical Command Center ("SOTA Obsidian & Luminous Cartography"). Deep obsidian glassmorphic HUD (`#0D1117`, `#161B22`), luminous vector status indicators (Signal Crimson for kinetic forces, Electric Cyan for diplomacy, Cyber Amber for covert intelligence, Emerald for stability), and a hero 3D cartographic terrain map featuring authentic relief topography, satellite-derived albedo, glowing boundary borders, and pulsing tactical radar pins.
- **Target Platform**: Production-Ready Mobile (iOS App Store & Android Google Play Store). Full adherence to Apple Human Interface Guidelines (HIG) and Google Material Design (min 48×48dp tap targets, Dynamic Island / notch Safe Area inset handling, and mobile lifecycle suspension).
- **Screen Orientation / Resolution**: Portrait Native (1080×1920 reference resolution) with dynamic responsive CanvasScaler (Match Width 0.5) and hardware SafeAreaFitter for edge-to-edge iPhones and Android cutouts.
- **Render Pipeline**: Universal Render Pipeline (URP 17.6) optimized for mobile GPU thermal efficiency (60 FPS target, ASTC texture compression, 2K map resolution, optimized fill rate, calibrated post-processing without heavy overdraw).

---

# Game Mechanics

## Core Gameplay Loop
1. **Theater Selection & Intel Dossier**:
   - The player selects an authentic historical flashpoint from the Strategic Archives (e.g. *1947 India Partition*, *1962 Cuban Missile Crisis*, *1989 Fall of the Berlin Wall*).
   - Each theater displays historical context, geographical territory, strategic tension stakes, and clearance level.
2. **Interactive 3D Cartographic Hero Board**:
   - The real-world geography is the centerpiece of the experience (occupying 60%+ of the screen height).
   - Topographical elevation, national borders, key rivers, and contested cities/corridors are displayed with authentic cartographic clarity so players actively learn real-world geography as they play.
   - Pulsing tactical beacons identify active flashpoints (e.g. *Radcliffe Border Line*, *Punjab Canal Headworks*, *Lahore-Amritsar Corridor*).
3. **Strategic Directive Deck (3-Card Choice Matrix)**:
   - In each operational phase, the National Security Council presents 3 actionable directives categorized by branch:
     - ⚔️ **Military / Kinetic**: Immediate territorial control, troop surge, security cordons (high stability, risks collateral escalation).
     - 🕊️ **Diplomatic / Accord**: Treaties, international arbitration, demilitarized zones (high credibility, slower response).
     - 👁️ **Covert / Intelligence**: Black ops, reconnaissance, covert off-ramps (precise effect, variable political exposure).
   - Each card displays clear title, branch tag, projected impact badges (e.g., `▲ Stability +40`, `▼ Escalation -15`), and tactical briefing copy.
4. **Interactive Arm & Board Synchronization**:
   - Tapping any order card or 3D map beacon immediately synchronizes the board: the cinematic camera glides smoothly to the targeted sector, a contextual Field Intel chip highlights local demographics and stakes, and the primary Action Actuator (`[ AUTHORIZE DIRECTIVE ]`) arms with high-contrast tactical state.
5. **Impactful Execution Sequence**:
   - Striking the Actuator initiates the order: the 3D board dynamically responds with border line shifts, territory wash color transitions, camera impulse shake, and audio cues.
6. **Classified Debrief Modal**:
   - A non-intrusive, frosted glass debrief card slides in, detailing the immediate geopolitical fallout, revised stability metrics, and offering a bold `[ PROCEED TO NEXT PHASE → ]` button.
7. **Comprehensive Mobile Lifecycle & Persistence (Save, Pause, Background, Resume)**:
   - **Continuous State Persistence**: The game continuously serializes the active operational state (Theater ID, Beat Index, Phase Number, Executed Order Callsigns, Strategic Effects, Scars, and Score Polarity).
   - **Multi-Point Auto-Save**:
     - *On Phase Advancement*: Instant auto-save every time an order is authorized and resolved.
     - *On App Background / OS Interruption*: Hooked into Unity's `OnApplicationPause(true)`, `OnApplicationFocus(false)`, and `OnApplicationQuit()` so incoming phone calls, switching apps, or device lock never loses player progress.
     - *On Explicit Exit*: Tapping the `[ ◀ THEATERS ]` button pauses the operational clock and provides an instant `[ SAVE & RETURN TO ARCHIVES ]` action.
   - **Universal Resume Matrix**:
     - *Main Menu Flow*: If an ongoing operation exists, a prominent hero button `[ ⚡ RESUME OPERATION: <THEATER_NAME> (PHASE 02/03) ]` is displayed right above the New Campaign button.
     - *Strategic Archives Flow*: The archives display an active top banner allowing the player to either `[ RESUME CURRENT MISSION ]` or `[ ABANDON & CHOOSE NEW ]`.
     - *Cold Reboot Resilience*: Reopening the app from a terminated cold state cleanly detects and restores the in-progress theater.
     - *Edge-Case Hygiene*: Completing a theater clears the active save file so obsolete runs never persist into results or future playthroughs. Corrupted save data is caught and gracefully recovers without crashing.
8. **Comprehensive "World Shaper" After-Action Evaluation & Social Share**:
   - **How Your Decisions Shaped the World**:
     - *Narrative World Legacy*: Dynamic geopolitical post-mortem analyzing the long-term regional outcome created by the player's choices (e.g. *"Peaceful Partition achieved: bilateral border commissions established, 14.5M refugees granted protected passage, regional conflict successfully localized"*).
     - *Decision Audit Trail*: Step-by-step breakdown of every directive authorized across each phase, displaying the specific geopolitical trade-offs, lives impacted, and alliance shifts.
   - **Multi-Vector Decision Effectiveness Score**:
     - *Cabinet Rank*: Prestigious Medal Badges (Rank **S** [Supreme Statesman 90-100], Rank **A** [Master Strategist 80-89], Rank **B** [Pragmatic Commander 70-79], Rank **C** [Crisis Containment 60-69], Rank **D/E** [Escalation Breakdown]).
     - *Effectiveness Pillars*:
       - 🛡️ **Regional Stability** (0–100%)
       - 🕊️ **Diplomatic Credibility** (0–100%)
       - 👥 **Humanitarian Security / Lives Protected**
       - ⚠️ **Escalation & Conflict Risk**
   - **Viral Mobile Social Sharing (iOS & Android)**:
     - *One-Tap Social Card Generation*: Renders a crisp 1080×1080 or 1080×1920 tactical debrief dossier card featuring the player's Rank medal, numeric score, map thumbnail, and key achievements.
     - *Native Share Sheet Integration*: Connects to iOS `UIActivityViewController` and Android `ACTION_SEND` intents to easily share directly to WhatsApp, X (Twitter), Discord, Instagram Stories, and iMessage.
     - *Formatted Challenge Copy*: Instant copy to teletype clipboard with engaging challenge text (e.g., *"I resolved the 1947 India Partition in Genesis with Rank S (Cabinet Score 94/100). Preserved stability and prevented continental escalation. Can you beat my path? #GenesisGame"*).
     - *Actionable Replayability*: Instant one-tap `[ 🔄 REDEPLOY THIS THEATER ]` or `[ 🏛️ NEXT HISTORICAL FLASHPOINT ]`.

## Controls and Input Methods
- **Thumb-Zone Optimization (Portrait Mobile)**:
  - **Upper Deck (0–14% Safe Height)**: Theater identity, phase badge (`PHASE 02/03`), mission chronometer, and persistent `[ ◀ THEATERS ]` pause/exit button.
  - **Map Zone (14–72% Safe Height)**: Unobstructed view of the 3D map. Direct touch raycasting allows tapping city pins and tactical beacons to inspect regions. Smooth pinch-to-zoom and pan support.
  - **Lower Command Deck (72–100% Safe Height)**:
    - *Directive Rail*: 3 horizontal cards with generous tap targets (min 64pt height) and clear branch color indicators.
    - *Hero Command Actuator*: Full-width 56pt high-contrast button (`[ AUTHORIZE DIRECTIVE: SURGE BORDER FORCES ]`).
- **Input System Integration**:
  - Full compatibility with Unity's New Input System and legacy touch/mouse events via `InputSystemUIInputModule`.
  - Keyboard shortcuts for Desktop: `1`, `2`, `3` to select orders, `Space` / `Enter` to authorize, `Esc` to pause/exit.

---

# UI Design & Architecture

## Visual Design System
- **Color Palette (Modern Command Obsidian & Signal Accents)**:
  - *Background Void*: `#090C10` (Dark space gray).
  - *Card & Modal Glass*: `#161B22` with `#30363D` borders and 12px rounded corners.
  - *Branch Colors*:
    - **Military**: Signal Crimson (`#FF453A`) with subtle glow.
    - **Diplomatic**: Oceanic Cyan (`#32D74B` / `#64D2FF`).
    - **Covert**: Amber Neon (`#FF9F0A` / `#FFD60A`).
  - *Text & Typography*:
    - Headers & Titles: Crisp White (`#F0F6FC`) in Heavy/Bold sans-serif.
    - Body & Descriptions: High-legibility Slate Cream (`#C9D1D9` / `#8B949E`).
    - Accents & Highlights: Radar Gold (`#E3B341`).
- **Typography Discipline (TextMeshPro / Modern Font Stack)**:
  - Replaces legacy blurry 11pt bitmap text with TextMeshPro vector SDF rendering.
  - Strict minimum font sizes:
    - Primary Action Buttons: 20–22pt Bold.
    - Card Callsigns: 18–20pt SemiBold.
    - Card Descriptions: 14–16pt Regular (clean line height, 100% readable).
    - Status & Intel Badges: 14–16pt Bold uppercase.

## Screens & Layout Wireframes

### 1. Operations HUD (`TheaterPlay.unity`)
```
+-------------------------------------------------------------------------+
| [SAFE AREA TOP BAR]                                                     |
| [ ◀ THEATERS ]   1947 · INDIA PARTITION   [PHASE 01/03]   ⏱️ 00:45       |
| OBJECTIVE: SECURE RADCLIFFE BORDER LINE & REFUGEE CORRIDORS             |
+-------------------------------------------------------------------------+
|                                                                         |
|                                                                         |
|                       [3D CARTOGRAPHIC HERO MAP]                        |
|               (Real relief terrain + authentic borders)                 |
|               (Pulsing tactical beacons: Punjab, Delhi, Bengal)         |
|               (Readable city pins & territory labels)                   |
|                                                                         |
|                                                                         |
+-------------------------------------------------------------------------+
| [FIELD INTEL DRAWER - DYNAMIC]                                          |
| 📍 PUNJAB SECTOR // 14.5M civilians in transit · Communal clash alert   |
+-------------------------------------------------------------------------+
| [DIRECTIVE SELECTION RAIL - 3 TACTICAL CARDS]                           |
| +--------------------+ +--------------------+ +--------------------+    |
| | ⚔️ MILITARY        | | 🕊️ DIPLOMATIC      | | 👁️ COVERT INTEL    |    |
| | SURGE PATROLS      | | JOINT BOUNDARY     | | SECURE DISPATCH    |    |
| | Deploy boundary    | | Bilateral liaison  | | Black teletype line|    |
| | forces to canal    | | for border award   | | to high commission |    |
| | ▲ Stability +40    | | ▲ Accord +25       | | ▲ Intel +50        |    |
| +--------------------+ +--------------------+ +--------------------+    |
|                                                                         |
| [HERO COMMAND ACTUATOR (THUMB-ZONE)]                                    |
| +---------------------------------------------------------------------+ |
| | >>>  AUTHORIZE DIRECTIVE: SURGE PATROLS [ARMED]  <<<                | |
| +---------------------------------------------------------------------+ |
+-------------------------------------------------------------------------+
```

### 2. Strategic Theater Archives (`TheaterSelect.unity`)
```
+-------------------------------------------------------------------------+
| [ ◀ HQ ]             STRATEGIC THEATER ARCHIVES                         |
| Select an authentic historical crisis or resume ongoing operation       |
+-------------------------------------------------------------------------+
| [ACTIVE DEPLOYMENT BANNER (IF SAVED RUN EXISTS)]                        |
| +---------------------------------------------------------------------+ |
| | ⚠️ ONGOING OPERATION: 1947 INDIA PARTITION (PHASE 02/03)             | |
| | [ RESUME OPERATION ]                       [ ABANDON & RESTART ]    | |
| +---------------------------------------------------------------------+ |
+-------------------------------------------------------------------------+
| [THEATER CATALOG SCROLL - FILTERABLE CHIPS: ALL | COLD WAR | CRISES]     |
| +---------------------------------------------------------------------+ |
| | 1947 · INDIA PARTITION                              [ DEPLOY > ]    |
| | Region: South Asia · Radcliffe Line & Punjab Refugee Corridors      |
| | Complexity: ★★★★☆ · 3 Operational Phases                            |
| +---------------------------------------------------------------------+ |
| +---------------------------------------------------------------------+ |
| | 1962 · CUBAN MISSILE CRISIS                         [ DEPLOY > ]    |
| | Region: Caribbean · Naval Blockade & Strategic Nuclear Threshold    |
| | Complexity: ★★★★★ · 3 Operational Phases                            |
| +---------------------------------------------------------------------+ |
| +---------------------------------------------------------------------+ |
| | 1989 · FALL OF THE BERLIN WALL                      [ DEPLOY > ]    |
| | Region: Central Europe · Border Checkpoints & Diplomatic Openings   |
| | Complexity: ★★★☆☆ · 3 Operational Phases                            |
| +---------------------------------------------------------------------+ |
+-------------------------------------------------------------------------+
```

### 3. After-Action "World Shaper" Dossier (`Results.unity`)
```
+-------------------------------------------------------------------------+
| [SAFE AREA HEADER]                                                      |
| AFTER ACTION EVALUATION // WAR CABINET HISTORICAL ARCHIVES             |
| 1947 · INDIA PARTITION (1945–1962 ERA)                                  |
+-------------------------------------------------------------------------+
| [HERO MEDAL & SCORE CITATION CARD]                                      |
|                                                                         |
|                          ⭐ RANK S ⭐                                    |
|                   CABINET SCORE: 94 / 100                               |
|            SUPREME CRISIS RESOLUTION: MASTER STRATEGIST                 |
|                                                                         |
|   "Through decisive bilateral cordons and early boundary agreements,    |
|    you prevented continental war and preserved two stable states."      |
|                                                                         |
|   +-----------------------------------------------------------------+   |
|   | DECISION EFFECTIVENESS METRICS:                                 |   |
|   | 🛡️ Stability: 94%   🕊️ Credibility: 88%   👥 Security: 92%       |   |
|   | ▲ Top Gain: Border Patrol Surge (+45)                           |   |
|   | ▼ Top Cost: High Commission Friction (-12)                      |   |
|   +-----------------------------------------------------------------+   |
+-------------------------------------------------------------------------+
| [HOW YOUR DECISIONS SHAPED THE WORLD — CHRONOLOGICAL TIMELINE]          |
| +---------------------------------------------------------------------+ |
| | PHASE 01: HOLD EARLY DATE & SURGE BOUNDARY FORCES                   | |
| | Sector: Radcliffe Border Line · Secured vital canal headworks        | |
| +---------------------------------------------------------------------+ |
| +---------------------------------------------------------------------+ |
| | PHASE 02: BILATERAL CORRIDOR PACT                                   | |
| | Sector: Punjab Corridor · 14.5M refugees granted protected transit  | |
| +---------------------------------------------------------------------+ |
| +---------------------------------------------------------------------+ |
| | PHASE 03: DUAL DOMINION SOVEREIGNTY TRANSFER                        | |
| | Sector: Delhi-Karachi Axis · Peaceful transfer ratified by councils | |
| +---------------------------------------------------------------------+ |
+-------------------------------------------------------------------------+
| [SOCIAL MEDIA VIRAL SHARE & REPLAY BAND]                                |
| +---------------------------------------------------------------------+ |
| | [ 📤 SHARE TO SOCIAL (INSTAGRAM / X / WHATSAPP) ]                   | |
| | [ 📋 COPY CHALLENGE TEXT ]              [ 💾 SAVE SHARE CARD ]      | |
| +---------------------------------------------------------------------+ |
|                                                                         |
| [ACTION BUTTONS]                                                        |
| +---------------------------------------------------------------------+ |
| | [ 🔄 REDEPLOY THIS THEATER ]                                        | |
| | [ 🏛️ NEXT HISTORICAL CRISIS ]           [ 🏠 MAIN HEADQUARTERS ]    | |
| +---------------------------------------------------------------------+ |
+-------------------------------------------------------------------------+
```

---

# Key Asset & Context

### Existing Resources & Data Files
- **32 Authentic Theater Scenarios**: `Assets/StreamingAssets/Theaters/hist-*.json` (Rich historical premises, real dates, realistic choices and consequences).
- **Cartographic Geo Datasets**: `Assets/StreamingAssets/Maps/geo/` (Authentic country and regional geojson polygons).
- **Topographical Relief Maps**: `Assets/StreamingAssets/Maps/relief/` (46 authentic regional 2K heightmaps).
- **Cartographic Land Masks**: `Assets/StreamingAssets/Maps/mask/` (46 crisp regional coast masks).
- **Satellite / Terrain Textures**: `Assets/StreamingAssets/Maps/terrain/` (Authentic terrain albedo maps).
- **Rendering Shaders**: URP Lit and Unlit shaders under `Assets/Shaders/` supporting bump-mapped terrain relief, border glows, and crisp unlit UI elements.

### Core Scripts to Create or Modernize
1. **`Assets/Scripts/UI/ModernSkin/ModernUiPalette.cs`**:
   - Central design token provider: high-contrast colors, rounded card procedural textures, glowing beacon sprites, and branch color palettes.
2. **`Assets/Scripts/UI/Views/OpsHudView.cs`**:
   - Complete modernization: sleek header deck with `[ ◀ THEATERS ]` button, responsive objective bar, floating intel pill, and large thumb-zone directive actuator.
3. **`Assets/Scripts/UI/Views/OrderRailView.cs` & `TacticalOrderCard.cs`**:
   - Modern directive cards: branch color indicators (⚔️/🕊️/👁️), prominent titles, effect badges, and high-contrast description copy.
4. **`Assets/Scripts/UI/Views/ResolveBeatModal.cs`**:
   - High-contrast classified dispatch modal with translucent backdrop, clean operational report, and bold `[ PROCEED TO NEXT PHASE → ]` action.
5. **`Assets/Scripts/Core/ResultsController.cs`**:
   - Dopamine-driven results screen: massive Rank medal, score progress, impact chips, timeline audit, and one-tap replay/next-theater buttons.
6. **`Assets/Scripts/Core/AppFlow.cs` & `TheaterSession.cs`**:
   - Full save/resume lifecycle: automatic persistence of active run state (theater id, phase index, executed orders), enabling players to leave, pick another theater, or resume seamlessly.
7. **`Assets/Scripts/Theater/TheaterBoardBuilder.cs`**:
   - 3D map visual polish: clean relief texturing using authentic heightmaps, glowing national boundary lines, smooth coast shelves, and uncluttered city beacons.

---

# Implementation Steps

### Phase 1: Architecture & UI Foundations
- **Step 1.1**: Design and establish `ModernUiPalette.cs` containing sleek rounded card sprites, glowing radar rings, branch iconography colors, and high-contrast styling tokens.
  - *Assigned role*: developer
  - *Dependencies*: None
  - *Parallelizable*: Yes
- **Step 1.2**: Upgrade `GenesisType.cs` to ensure crisp typography rendering with high contrast, strong outlines, and comfortable mobile reading sizes (headers 24–32pt, body 16–20pt).
  - *Assigned role*: developer
  - *Dependencies*: None
  - *Parallelizable*: Yes

### Phase 2: Operations HUD & Directive Selection Redesign
- **Step 2.1**: Refactor `TacticalOrderCard.cs` to display branch badges (Military, Diplomatic, Covert), callsign titles, effect deltas, and readable tactical descriptions with active glow highlights.
  - *Assigned role*: developer
  - *Dependencies*: Step 1.1
  - *Parallelizable*: Yes
- **Step 2.2**: Rebuild `OrderRailView.cs` to provide an ergonomic horizontal card deck in the bottom thumb zone with smooth card selection.
  - *Assigned role*: developer
  - *Dependencies*: Step 2.1
  - *Parallelizable*: No
- **Step 2.3**: Rebuild `OpsHudView.cs` with a top header containing the `[ ◀ THEATERS ]` exit button, phase progression indicator, mission timer, dynamic Field Intel pill, and full-width armed actuator.
  - *Assigned role*: developer
  - *Dependencies*: Step 1.1, Step 1.2
  - *Parallelizable*: Yes

### Phase 3: In-Game Map Cartography & Interaction
- **Step 3.1**: Polish `TheaterBoardBuilder.cs` and `HotspotMarker.cs` to render authentic relief maps with glowing borders, uncluttered place pins, and breathing radar beacon pulses.
  - *Assigned role*: developer
  - *Dependencies*: None
  - *Parallelizable*: Yes
- **Step 3.2**: Configure `TheaterCameraRig.cs` for smooth cinematic focus transitions when flashpoints or directive cards are selected.
  - *Assigned role*: developer
  - *Dependencies*: Step 3.1
  - *Parallelizable*: Yes

### Phase 4: Debrief Modal & Results Screen Overhaul
- **Step 4.1**: Overhaul `ResolveBeatModal.cs` into a clean, modern debrief card with narrative summary, strategic impacts, and an unmissable `[ PROCEED TO NEXT PHASE → ]` CTA.
  - *Assigned role*: developer
  - *Dependencies*: Step 1.1
  - *Parallelizable*: Yes
- **Step 4.2**: Overhaul `ResultsController.cs` into the "World Shaper" After-Action Dossier:
  - Hero Medal citation (Rank S to E) with animated score readout (0–100).
  - "How Your Decisions Shaped the World" narrative and multi-metric effectiveness breakdown (Stability, Diplomatic Credibility, Humanitarian Security, Escalation Control).
  - Detailed chronological decision trail showing specific trade-offs and outcomes per phase.
  - Social media share integration: native OS share sheet triggering, card image export, and copyable challenge text.
  - Thumb-friendly replay (`[ REDEPLOY ]`) and archive advancement (`[ NEXT THEATER ]`) buttons.
  - *Assigned role*: developer
  - *Dependencies*: Step 1.1, Step 1.2
  - *Parallelizable*: Yes

### Phase 5: Mobile Lifecycle, Persistence & Multi-Screen Flow
- **Step 5.1**: Implement robust mobile lifecycle persistence in `AppFlow.cs` and `TheaterSession.cs` utilizing `OnApplicationPause`, `OnApplicationFocus`, and `OnApplicationQuit` to ensure 100% data retention across app suspensions, backgrounding, and cold reboots.
  - *Assigned role*: developer
  - *Dependencies*: None
  - *Parallelizable*: Yes
- **Step 5.2**: Update `TheaterSelectView.cs` and `TheaterSelectController.cs` with an active "Ongoing Operation" card featuring one-tap `[ RESUME OPERATION ]` and `[ ABANDON OPERATION ]` alongside the 32 historical flashpoints with mobile-friendly touch targets.
  - *Assigned role*: developer
  - *Dependencies*: Step 5.1
  - *Parallelizable*: Yes
- **Step 5.3**: Update `MainMenuView.cs` and `MainMenuController.cs` with an unmissable hero button `[ ⚡ RESUME OPERATION ]` that routes directly back into the saved theater phase with all previous choices and map reactions intact.
  - *Assigned role*: developer
  - *Dependencies*: Step 5.1
  - *Parallelizable*: No

---

# Verification & Testing
1. **Mobile Platform & Ergonomics (iOS & Android)**:
   - Validate UI layout on multiple aspect ratios (iPhone 15 Pro with Dynamic Island, standard 16:9, modern 20:9 Android screens).
   - Ensure all interactive buttons have minimum tap heights ≥48pt (primary actuators 54–60pt) with generous padding adhering to iOS HIG and Android Material guidelines.
2. **Session Save & Resume Lifecycle Test Suite**:
   - *Test Case 1 (In-Game Menu Exit)*: Enter 1947 India Partition → Execute Phase 1 → In Phase 2, tap `[ ◀ THEATERS ]` → Confirm Exit → Verify return to Archives → Verify "Resume Operation" banner is present → Tap Resume → Verify game re-enters Phase 2 with Phase 1 decisions, order timeline, and map reactions intact.
   - *Test Case 2 (App Backgrounding / Suspension)*: In Phase 2, trigger OS backgrounding / app pause → Resume application → Verify game state and chronometer are maintained without loss or reset.
   - *Test Case 3 (Cold Relaunch)*: In Phase 2, simulate app termination and cold launch from Boot → Main Menu → Verify `[ ⚡ RESUME OPERATION ]` hero button appears → Tap Resume → Verify instant reentry into the active theater phase.
   - *Test Case 4 (Theater Abandonment & Switch)*: In Archives, tap `[ ABANDON OPERATION ]` on an active run → Confirm abandon → Select a different theater (e.g. 1962 Cuban Missile Crisis) → Verify new theater starts clean at Phase 1 with fresh state.
   - *Test Case 5 (Completion Clearance)*: Play theater through all 3 phases to Results → Verify active run save is wiped so returning to Menu/Archives presents fresh options instead of stale resume prompts.
3. **Visual Readability & 3D Cartography Check**:
   - Inspect all screens in Portrait 1080×1920: verify that every directive title, effect delta, briefing description, and place name is legible in ≤2 seconds without clutter or overlap.
4. **Standalone Compilation & Zero-Error Gate**:
   - Run compilation and verify clean build pipeline for iOS/Android/macOS targets under Unity 6 URP.
