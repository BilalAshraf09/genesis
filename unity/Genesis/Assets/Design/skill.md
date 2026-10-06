# Project Genesis: AI Knowledge & Development Skill

## Project Overview
**Genesis** is a high-fidelity strategic war cabinet simulator. The game focuses on tactical decision-making through a "War Desk" interface, where the player acts as a central authority figure committing orders to resolve global tensions.

**Platform**: Mobile — Android + iOS (portrait-first, touch + haptics).
**Engine**: Unity 6 (6000.6.3f1).
**Tech Stack**:
- **Rendering**: Custom Genesis URP Pipeline (Genesis_URP_Pipeline), tiered via `GenesisPremiumVisuals` + `GenesisThermalGuard`.
- **UI System**: UI Toolkit (UXML/USS) for all interactive HUD elements; `SafeAreaRoot` on every screen.
- **Input**: New Input System touch (pan/pinch on board) + UI Toolkit pointer; Android Back via `MobilePlatform` stack.
- **Feel**: `MobilePlatform` haptics (tick / confirm) + native share sheet (Android intent; iOS/clipboard fallback).

**Reference layout**: 1080 × 1920 (`tokens.uss`), map band between top ~14% HUD and bottom ~36–38% order sheet.

---

## Core Systems Implemented

### 1. The Theater Loop (`TheaterSession.cs`)
The primary game loop is governed by a `TheaterSession` singleton. It manages the transition between phases (beats):
- **Intel Phase**: Populating `OpsHud` with beat-specific intel and briefing data.
- **Order Selection**: Handling hotspots on the 3D board and linking them to `OrderCardElements` in the rail.
- **Execution Sequence**: A coroutine-based flow that handles UI locking, world VFX triggers, scar lines, and the resolution overlay.

### 2. UI Toolkit Infrastructure
UI Toolkit is the interactive HUD standard (do not add uGUI for gameplay HUD):
- `OrderRailController`: Horizontal order cards + `HoldToConfirmButton` inside a `BottomSheet`.
- `OpsHudController`: Top-bar timer, phase indicators, intel chip, field brief, pause + Android Back.
- `BottomSheet`: Drawer-style panels with drag handles and snap states (Peek / Half / Full).

### 3. Tactical Visualization
- `TheaterBoardBuilder`: Dynamic board from `TheaterBundle`; amber selection link desk → hotspot.
- `WorldReactionFX` + `MapStoryFX`: EXECUTE map verbs (ink / corridor / stress) with restrained desk light punch.
- `GenesisScarDecals`: Contested-ink scars (URP DecalProjector on Med+, mesh blot fallback).
- `TheaterCameraRig`: Cinemachine framing, idle noise (tier-gated), EXECUTE impulse, portrait map-band bias.

### 4. Persistence, Meta & Mobile Shell
- `AppFlow`: Boot → MainMenu → TheaterPlay → Results; auto-save active runs.
- `RunScoreUtility`: Cabinet score / path family / share + challenge text.
- `ShareCardRenderer`: Offscreen PNG share card (uGUI capture only — not gameplay HUD).
- `MobilePlatform`: Haptics, Back stack, share helpers.
- `GenesisThermalGuard`: Sustained heat → quality step-down on device.

---

## Issue Resolution Patterns

### UI Interactivity & State Locking
**Scenario**: The "Execute" button would remain disabled after Phase 1.
**Resolution**: Strict Arm/Lock/Unlock lifecycle. After a phase resolves, `LockExecute()`; next phase must `ArmExecute()` → `SetHoldButtonLocked(false)`.
**Takeaway**: Always verify `pickingMode` and `SetEnabled` on UI Toolkit elements across beat transitions.

### Touch vs Board Raycasts
**Scenario**: HUD chrome blocked board touches.
**Resolution**: `PickingMode.Position` on interactive elements; `PickingMode.Ignore` on visual-only decorators so unused HUD regions fall through to the board.

### Thermal / Premium Tiers
**Scenario**: High visual settings cook mid-range phones during long theaters.
**Resolution**: `GenesisThermalGuard` steps quality down; `GenesisPremiumVisuals` gates SSAO, decals, CM noise, VFX preference. Mid/High render scale stays 1.0 while on those tiers.

---

## Current Status
- **Playable Slice**: Theater Play loop works end-to-end (load → multi-beat → Results).
- **Mobile shell**: Safe areas, portrait camera band, touch board input, Android Back, share path.
- **Sprint 1 (shipped)**: Patterned haptics (`MobilePlatform`), procedural `GenesisAudio` (ambience/UI/world), hold-to-confirm fill + cancel + success flash, phase choreography (brief → sheet expand), timer warn/critical USS, Settings audio mute.
- **Visuals**: Board, EXECUTE map FX, scars, CM impulse — present but not yet “cabinet prestige” on mid-tier phones.
- **Gaps**: Briefings are linear (no prior-choice reactivity); portrait readability/share polish (Sprint 2); narrative scars/score story (Sprint 3).

---

## Roadmap — Mobile State of the Art

Target experience: a portrait war desk that feels physical, decisive, and cool-running on mid-tier Android and recent iPhones.

### Sprint 1 — Touch Cabinet Feel ✅ DONE
Shipped: `GenesisAudio.cs`, upgraded `MobilePlatform` haptics, `HoldToConfirmButton` hold/cancel/success, `OpsHudController` choreography + timer urgency, Settings cabinet audio toggle, USS enter/urgency/hold states.

### Sprint 2 — Readable War Desk (portrait UX + map clarity)
**Goal**: One glance tells phase, stakes, and what to tap next.

1. **Portrait information hierarchy**
   - Enforce single primary CTA: when sheet is Half/Full, dim non-essential HUD; when Peek, board is hero.
   - Larger tap targets (≥44pt) on cards, pins, pause; avoid overlapping sheet drag vs card scroll conflicts.
   - Files: `BottomSheet.cs`, `OrderCardElement.cs`, `HotspotMarker.cs`, USS theme tokens.

2. **Map readability on small screens**
   - Pin + label collision already constrained — tune sizes/opacity per quality tier; ensure scars remain readable on Low (mesh blot).
   - Selection link thickness / contrast for bright outdoor phone use.
   - Files: `TheaterBoardBuilder.cs`, `MapLabelOverlay.cs`, `MapStoryFX.cs`, `GenesisScarDecals.cs`.

3. **Results / After Action / Share (viral close)**
   - Results rows: scar line + polarity pills scannable in one thumb scroll.
   - Share: Android PNG+text intent; iOS `UIActivityViewController` path for share card file (not clipboard-only).
   - Files: `ResultsController.cs`, `ShareCardRenderer.cs`, `MobilePlatform.cs`, `AfterAction.*`.

### Sprint 3 — Narrative Weight (data-driven consequences)
**Goal**: Choices change the next briefing and the board’s memory — without a rewrite of the loop.

1. **Reactive briefings**
   - Extend `BeatData` / `OrderChoice` with optional `requiresTags` / `unlockTags` / `briefingVariants` driven by accumulated effect tags from prior orders.
   - `TheaterSession` filters or swaps briefing text + available choices from run state (still data-first).
   - Files: `TheaterModels.cs`, theater JSON in StreamingAssets, `TheaterSession.cs`, `OpsHudController` intel APIs.

2. **Persistent board memory**
   - Ensure every EXECUTE leaves a scar + marker stress that survives the full run and appears on Results mini-summary / share card.
   - Optional: light “escalation ink” wash intensity from net polarity.
   - Files: `TheaterSession.cs`, `GenesisScarDecals.cs`, `HotspotMarker.cs`, `RunScoreUtility.cs`.

3. **Deeper score feedback**
   - Surface Escalation vs Stability as two readable meters on Results (derived from existing effect weights/tags — avoid opaque single number only).
   - Files: `RunScoreUtility.cs`, `ResultsController.cs`, `Debrief.*` / `AfterAction.*`.

### Sprint 4 — Sustain & Ship Quality
**Goal**: 30+ minute sessions stay playable; store builds look intentional.

1. **Thermal / battery pass**
   - Profile Med/Low: particle budgets in `MapStoryFX`, CM noise off on Low, bloom caps already tiered — verify on a mid Android + one iPhone.
   - Background: pause timer + mute ambience on `OnApplicationPause`.
   - Files: `GenesisThermalGuard.cs`, `GenesisPremiumVisuals.cs`, `TheaterPlayBootstrap.cs`, audio service.

2. **Build / store hygiene**
   - Confirm EAS-adjacent / Unity mobile build scripts (`GenesisMobileBuild`) target API levels, orientation lock portrait, icons/splash.
   - Device checklist: safe area notches, Dynamic Island, Android gesture nav, Back stack on every modal.

---

## Priority Order (do in sequence)
1. Sprint 1 — Feel (UI motion + haptics + audio skeleton)
2. Sprint 2 — Clarity (portrait UX + map + share)
3. Sprint 3 — Narrative (reactive beats + scars + score story)
4. Sprint 4 — Sustain (thermal + ship)

Do **not** chase desktop landscape framing or high-end-only VFX as the north star; premium on mobile means restraint, readability, and tactile feedback under thermal budgets.

---

## AI Handoff Instructions
When working on Genesis:
1. **Mobile portrait first**: Layout and camera assume HUD top / map band / order sheet bottom. Test with phone aspect, not ultrawide.
2. **Respect UI Toolkit**: No uGUI for interactive HUD (share-card offscreen capture is the known exception).
3. **State machine**: Gameplay loop changes go through `TheaterSession.cs`.
4. **Data first**: New behaviors via `BeatData` / `OrderChoice` / effects — not hardcoded controller branches.
5. **URP + tiers**: Materials/FX must respect `GenesisPremiumVisuals` and stay cool under `GenesisThermalGuard`.
6. **Touch contracts**: Interactive = `PickingMode.Position`; chrome = `Ignore`; Back handlers push/pop via `MobilePlatform`.
7. **Keep skill.md honest**: When a roadmap item ships, move it into “Core Systems Implemented” / “Current Status”.
