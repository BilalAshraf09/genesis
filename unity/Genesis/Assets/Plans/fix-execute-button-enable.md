# Project Overview
- **Game Title**: Genesis
- **High-Level Concept**: A strategic war cabinet simulator where players manage global tensions through tactical orders on a 3D board.
- **Players**: Single player.
- **Target Platform**: StandaloneOSX (Unity 6).
- **Render Pipeline**: URP.
- **UI System**: UI Toolkit.

# Game Mechanics
## Core Gameplay Loop
1. **Intel Phase**: Player reviews the current board state and intel chips.
2. **Order Selection**: Player selects one of several tactical orders from the bottom rail.
3. **Execution**: Player holds the "EXECUTE ORDER" button to commit the decision.
4. **Resolution**: The board state updates, and the game progresses to the next phase (beat).
5. **After Action**: Results are summarized after all phases are complete.

## Controls and Input Methods
- **Mouse/Touch**: Select hotspots on the map or order cards in the UI.
- **Hold Interaction**: The "Execute Order" button requires a hold duration to prevent accidental commits.

# UI
- **OpsHud**: Top-level HUD displaying phase info, timers, and intel.
- **Order Rail**: Bottom sheet containing order cards and the primary execution button (`HoldToConfirmButton`).
- **Resolve Overlay**: Modal displayed during phase transitions.

# Key Asset & Context
- `Assets/Scripts/UI/OpsHudController.cs`: Coordinates UI state transitions between phases.
- `Assets/Scripts/UI/OrderRailController.cs`: Manages the state of the order sheet and execution button.
- `Assets/Scripts/UI/Toolkit/HoldToConfirmButton.cs`: The custom button implementation that handles "Armed" and "Locked" states.

# Implementation Steps
## 1. Fix Button Lock State in OpsHudController
The "Execute Order" button is locked at the end of a phase's execution sequence to prevent double-clicks during animations. However, this lock state is not reset when the next phase begins and an order is armed.

- **File**: `Assets/Scripts/UI/OpsHudController.cs`
- **Change**: In the `ArmExecute` method, explicitly call `rail.SetHoldButtonLocked(false)` before arming the button.
- **Role**: developer
- **Dependencies**: None
- **Parallelizable**: No

# Verification & Testing
## Manual Verification
1. Start a theater session (e.g., in the `TheaterPlay` scene).
2. Complete Phase 1 by selecting an order and holding the "EXECUTE ORDER" button.
3. Wait for the resolution screen and click to proceed to Phase 2.
4. **Verification**: Confirm that an order is automatically selected in Phase 2 (or can be manually selected) and the "EXECUTE ORDER" button is interactive (not greyed out or unresponsive).

## Code Logic Check
- Verify that `HoldToConfirmButton.SetLocked(false)` correctly updates the `pickingMode` and `enabledSelf` state of the visual element.
