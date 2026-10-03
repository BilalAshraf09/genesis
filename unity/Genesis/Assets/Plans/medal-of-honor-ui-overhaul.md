# Project Overview
- **Game Title**: Genesis: Geopolitical Command
- **High-Level Concept**: A high-stakes, fast-paced modern mobile geopolitical strategy and crisis intervention game where players assume the mantle of Supreme Strategic Director across history's tensest flashpoints (e.g. 1947 Radcliffe Partition, 1962 Cuban Missile Crisis, 1989 Berlin Wall). Direct real-time intelligence, balance volatile military, diplomatic, and covert directives, and master the board before geopolitical equilibrium collapses.
- **Players**: Single player (Supreme Strategic Commander).
- **Inspiration / Reference Games**: *Plague Inc.*, *Reigns: Beyond*, *DEFCON Mobile*, *Hearts of Iron IV*, *Out There: Ω Edition*, *Twilight Struggle*.
- **Tone / Art Direction**: State-of-the-Art Modern Mobile Tactical Command ("Cyber-War Room" meets polished mobile strategy). Clean ultra-dark obsidian surfaces, vibrant high-contrast neon accents (Signal Cyan, Radar Gold, Warning Amber, Crimson Alert), sleek rounded frosted glass panels, crystal-clear typography (Source Sans 3 bold/heavy), animated radar pulses on board flashpoints, and punchy, tactile haptic/audio feedback.
- **Target Platform**: Mobile (iOS & Android flagship) and Desktop (macOS/Windows).
- **Screen Orientation / Resolution**: Portrait Native (1080×1920 reference) with responsive adaptation for Landscape (1920×1080) and modern notch cutouts via CanvasScaler and SafeAreaFitter.
- **Render Pipeline**: Universal Render Pipeline (URP) with clean bloom, calibrated vignette, and crisp unlit UI elements.

---

# Game Mechanics

## Core Gameplay Loop
1. **Theater Briefing & Threat Level**: Commander enters a crisis theater (e.g., 1947 India Partition, Cold War Berlin). Each theater presents a global crisis timer and three escalating operational phases.
2. **Dynamic 3D War Board & Screen-Space Flashpoints**: The 3D country relief sits at the core of the screen. Instead of blurry 3D text floating in world space, sleek glowing beacon rings and screen-space tactical badges highlight key contested flashpoints (e.g., Punjab, Kashmir, Bengal).
3. **Branch Directives (Military, Diplomatic, Covert)**: Each beat presents 3 distinct strategic cards. Each card displays an operational callsign, branch iconography (⚔️ Military, 🕊️ Diplomatic, 👁️ Covert), forecasted geopolitical delta, and tactical summary.
4. **Intuitive Tap-to-Arm & Map Sync**: Tapping any card or map hotspot immediately spotlights that sector on the 3D board, displays real-time field intel, and arms the prominent, thumb-friendly command button.
5. **Impactful Execution Sequence**: Striking the bottom Command Actuator (`[ AUTHORIZE DIRECTIVE ]`) triggers punchy visual reactions on the board: camera zoom, dynamic shockwave/scars, and sound cue.
6. **Classified Debrief Modal (Modern Bottom-Sheet)**: A clean, high-contrast outcome card slides into view detailing what happened, revealing net stability gained/lost, and presenting a bold, unmissable `[ PROCEED TO NEXT PHASE → ]` button.
7. **Dopamine-Driven Results & Replayability**: Upon finishing all beats, a modern scorecard reveals the Commander's Medal Rank (S/A/B/C/D), numeric score (0–100), key achievements, and instant `[ REPLAY THEATER ]` or `[ NEXT CRISIS ]` one-tap loops.

## Controls and Input Methods
- **One-Thumb Mobile Navigation**:
  - Hotspot Beacon Tap: Focuses the 3D map camera smoothly on the flashpoint sector.
  - Directive Card Tap: Swaps active orders, updates projected outcomes, and arms the actuator.
  - Primary Action Actuator (`[ AUTHORIZE ORDER ]`): Full-width, 64pt high-contrast button positioned in the primary ergonomic thumb zone.
  - Debrief `[ PROCEED ]` Button: Prominently sized (60pt min height) with deep contrast, guaranteed never to clip or overlap text.
- **Desktop Parity**: Full mouse click support, Spacebar shortcut to execute armed directives, and arrow keys to cycle orders.

---

# UI Design & Architecture (Modern Mobile Interface)

## Visual Design System
- **Palette**:
  - *Deep Tactical Obsidian*: `#0B0E14` (Main backing), `#121722` (Card surfaces), `#1A2232` (Elevated modals).
  - *Branch Identifiers*:
    - **Military**: Signal Crimson (`#FF3B30`) & Coral Accent (`#FF6961`).
    - **Diplomatic**: Electric Cyan (`#00D2FF`) & Soft Sky (`#70E2FF`).
    - **Covert / Intel**: Cyber Amber (`#FF9500`) & Neon Gold (`#FFCC00`).
  - *Success & Status*: Neo Emerald (`#34C759`), Neutral Light (`#F2F5F8`), Muted Secondary (`#8E9AA8`).
- **Typography Discipline**:
  - Header Sizes: 28–34pt Bold Sans-Serif (`Source Sans 3`).
  - Body & Card Titles: 20–24pt Medium/Bold Sans-Serif.
  - Sub-labels & Badges: 16–18pt Bold Sans-Serif.
  - Strictly zero blurry serif fonts or micro 11pt text. High contrast (white/gold on dark obsidian).

## Screens & Layout Wireframes

### 1. In-Game Ops HUD (`OpsHudView`) & 3D War Board
```
+-------------------------------------------------------------------------+
| [TOP BAR: SAFE AREA]                                                    |
| [1947 INDIA PARTITION]             [PHASE 01/03]              ( [45s] ) |
| PRIMARY OBJECTIVE: ESTABLISH BORDER DELIMITATION ALONG SUTLEJ RIVER     |
+-------------------------------------------------------------------------+
|                                                                         |
|                          [3D TACTICAL WAR MAP]                          |
|                  (Glowing Beacon Rings on Flashpoints)                  |
|                  (Clean Screen-Space Projected Pins)                    |
|                                                                         |
+-------------------------------------------------------------------------+
| [SELECTED FLASHPOINT INTEL CHIP]                                        |
| ⚡ PUNJAB CORRIDOR: 14.5M Displaced civilians · Border units mobilized |
+-------------------------------------------------------------------------+
| [DIRECTIVE CARD DECK - SELECT TO ARM]                                   |
| +--------------------+ +--------------------+ +--------------------+   |
| | ⚔️ MILITARY        | | 🕊️ DIPLOMATIC      | | 👁️ COVERT INTEL    |   |
| | BORDER FORCE       | | JOINT BOUNDARY     | | SECURE DISPATCH    |   |
| | Stability: +45     | | Stability: +30     | | Intel: +60         |   |
| +--------------------+ +--------------------+ +--------------------+   |
|                                                                         |
| +---------------------------------------------------------------------+ |
| | >>>  AUTHORIZE DIRECTIVE: ORDER ALPHA [ARMED]  <<<                  | |
| +---------------------------------------------------------------------+ |
+-------------------------------------------------------------------------+
```

### 2. Modern Outcome Debrief Modal (`ResolveBeatModal`)
```
+-------------------------------------------------------------------------+
| [DIMMED TACTICAL BACKDROP]                                              |
|                                                                         |
|   +-----------------------------------------------------------------+   |
|   | ⚡ CRISIS RESOLUTION // ORDER ALPHA EXECUTED                     |   |
|   |-----------------------------------------------------------------|   |
|   | COURSE REPORT:                                                  |   |
|   | Border security contingents deployed across the Lahore-Amritsar |   |
|   | axis. Joint patrols engaged. Civil transit stabilized.          |   |
|   |                                                                 |   |
|   | IMPACT SUMMARY:                                                 |   |
|   | ▲ STABILITY: +45 PTS      ▲ BORDER CONTROL: SECURED             |   |
|   |                                                                 |   |
|   | [ TRANSMIT / SHARE DISPATCH ]                                   |   |
|   |                                                                 |   |
|   | +-------------------------------------------------------------+ |   |
|   | |        PROCEED TO NEXT PHASE →                              | |   |
|   | +-------------------------------------------------------------+ |   |
|   +-----------------------------------------------------------------+   |
+-------------------------------------------------------------------------+
```

### 3. Modern Results & Citation Screen (`ResultsView`)
```
+-------------------------------------------------------------------------+
|                        AFTER-ACTION EVALUATION                          |
|                       1947 RADCLIFFE PARTITION                          |
|                                                                         |
|                    +-------------------------------+                    |
|                    |          GRADE: S             |                    |
|                    |     STRATEGIC TRIUMPH         |                    |
|                    |        SCORE: 94 / 100        |                    |
|                    +-------------------------------+                    |
|                                                                         |
|   +-------------------------------+ +-------------------------------+   |
|   | STABILITY INDEX: 88%          | | CIVILIAN CASUALTIES: MINIMAL  |   |
|   +-------------------------------+ +-------------------------------+   |
|                                                                         |
|   DECISION TIMELINE:                                                    |
|   - Phase 1: ORDER ALPHA · Border Brigades (Executed)                   |
|   - Phase 2: ORDER BRAVO · Diplomatic Boundary (Ratified)               |
|   - Phase 3: ORDER CHARLIE · Corridor Transit (Enforced)                |
|                                                                         |
|   +-------------------------------+ +-------------------------------+   |
|   | 🔄 PLAY AGAIN                 | | 🏛️ RETURN TO COMMAND          |   |
|   +-------------------------------+ +-------------------------------+   |
+-------------------------------------------------------------------------+
```

---

# Key Asset & Context

### 1. Modern Procedural Skin & UI Helpers
- `Assets/Scripts/UI/TacticalSkin/ModernMobileUiSkin.cs`: Generates clean, crisp rounded rects, glowing border frames, branch badges, and high-contrast button sprites.
- `Assets/Scripts/UI/TacticalSkin/TacticalButton.cs`: Upgraded with modern high-contrast styling, clean text sizing (never clips), and springy micro-animations.
- `Assets/Scripts/UI/TacticalSkin/TacticalChronometer.cs`: Modern circular countdown timer with glowing radial progress ring and urgent pulse on <15s remaining.

### 2. View Layer Overhaul
- `Assets/Scripts/UI/Views/OpsHudView.cs`: Completely rewritten to provide a clean, modern mobile top bar, responsive intel banner, and prominent 64px thumb-zone command button.
- `Assets/Scripts/UI/Views/OrderRailView.cs` & `TacticalOrderCard.cs`: Modern card deck with color-coded branch badges, bold titles, and active glow outlines.
- `Assets/Scripts/UI/Views/ResolveBeatModal.cs`: Rebuilt from scratch with responsive vertical auto-layout, readable outcome descriptions (22pt), and large, unmissable `[ PROCEED TO NEXT PHASE → ]` primary CTA.
- `Assets/Scripts/UI/Views/ResultsView.cs`: Redesigned after-action screen with large grade display, score breakdown, and immediate replay triggers.

### 3. Game Flow & 3D Map Improvements
- `Assets/Scripts/Theater/TheaterSession.cs`: Fix scene transition logic so completion smoothly transitions to Results regardless of boot source; streamline beat resolution.
- `Assets/Scripts/Theater/TheaterBoardBuilder.cs` & `HotspotMarker.cs`: Clean up 3D board pins to remove cluttered 3D text signs, using modern pulse rings and screen-space tactical markers.
- `Assets/Scripts/Core/AppFlow.cs` & `ResultsController.cs`: Integrate the new `ResultsView` into the core scene loop.

---

# Implementation Steps

### Step 1: Modern Mobile Skin & Visual Assets
- **Description**: Implement `ModernMobileUiSkin.cs` providing high-contrast rounded cards, glowing borders, branch colors (Military Crimson, Diplomatic Cyan, Covert Amber), and crisp button textures.
- **Assigned role**: developer
- **Dependencies**: None
- **Parallelizable**: No

### Step 2: 3D Board De-cluttering & Pulse Markers
- **Description**: Update `HotspotMarker.cs` and `TheaterBoardBuilder.cs` to eliminate messy 3D `TextMesh` plates and replace them with sleek glowing beacon rings and clean labels that do not obscure the map.
- **Assigned role**: developer
- **Dependencies**: Step 1
- **Parallelizable**: Yes (with Step 3)

### Step 3: Modern Ops HUD & Directive Card Deck
- **Description**: Rebuild `OpsHudView.cs`, `OrderRailView.cs`, and `TacticalOrderCard.cs` from scratch with mobile-first thumb ergonomics, high-contrast typography, and a prominent 64px `[ AUTHORIZE ORDER ]` actuator.
- **Assigned role**: developer
- **Dependencies**: Step 1
- **Parallelizable**: No

### Step 4: Resolution Popup Debrief Modal
- **Description**: Rebuild `ResolveBeatModal.cs` and `ResolveBeatController.cs` from scratch. Implement a clean, high-contrast modal with comfortable padding, readable 22pt body text, and an unmissable `[ PROCEED TO NEXT PHASE → ]` button.
- **Assigned role**: developer
- **Dependencies**: Step 1, Step 3
- **Parallelizable**: Yes (with Step 5)

### Step 5: After-Action Results Screen & Game Loop Flow
- **Description**: Rebuild `ResultsController.cs` and create `ResultsView.cs` with modern score hero, letter grade banner (S/A/B/C), stat breakdowns, and direct `[ PLAY AGAIN ]` / `[ COMMAND HUB ]` buttons. Fix `TheaterSession.cs` so theater completion reliably transitions to Results.
- **Assigned role**: developer
- **Dependencies**: Step 3
- **Parallelizable**: No

### Step 6: Integration, Scene Assembly & Polish
- **Description**: Update `GenesisSceneBuilder.cs` to assemble all scenes (`Boot`, `MainMenu`, `TheaterSelect`, `TheaterPlay`, `Results`) with the new modern mobile UI hierarchy and verify asset wiring.
- **Assigned role**: developer
- **Dependencies**: Step 2, Step 3, Step 4, Step 5
- **Parallelizable**: No

### Step 7: Verification & Automated Mobile Testing
- **Description**: Run automated Play Mode test from Boot through Theater Play to Results. Verify zero console errors, 60 FPS performance, readable text in both Portrait (1080×1920) and Landscape (1920×1080), and responsive button interactions.
- **Assigned role**: explorer
- **Dependencies**: Step 6
- **Parallelizable**: No

---

# Verification & Testing
- **Visual & Layout Inspection**:
  - Test at 1080×1920 (Portrait mobile standard) in Simulator: Verify the Top HUD, Map Flashpoints, Order Rail, and Bottom Command Actuator fit comfortably with zero overlap.
  - Verify `ResolveBeatModal`: Confirm header, outcome report text, and `[ PROCEED TO NEXT PHASE → ]` button are 100% visible, legible, and clickable.
  - Verify `ResultsView`: Confirm score, grade, and replay buttons display cleanly without text truncation.
- **End-to-End Game Flow Verification**:
  - Run Play Mode through `Boot.unity` -> `MainMenu` -> `TheaterPlay` (Radcliffe 1947).
  - Select each beat directive, strike `[ AUTHORIZE DIRECTIVE ]`, verify world reaction FX, debrief popup, click `[ PROCEED ]`, complete 3 beats, and verify smooth transition to Results.
- **Console & Performance Checks**:
  - Verify zero compiler warnings/errors, zero magenta materials, and 60 FPS frame rate.
