# Project Overview
- **Game Title**: Genesis
- **High-Level Concept**: A geopolitical crisis simulator where players make high-stakes decisions at historical flashpoints.
- **Players**: Single player (Mobile focus).
- **Inspiration**: *Hearts of Iron IV*, *Stellaris*, high-fidelity command center interfaces.
- **Tone**: Strategic, serious, high-tech, urgent.
- **Target Platform**: Mobile (Portrait).
- **Render Pipeline**: URP.

# Game Mechanics
## Core Gameplay Loop
Players monitor a map for "Flashpoints" (crisis events). Selecting a flashpoint opens a drawer of "Orders" (actions). Each order has immediate and long-term effects on global metrics (Stability, Credibility, Civilian Toll, Escalation). Players must manage these resources while progressing through historical phases.

## Controls and Input Methods
- **Touch/Tap**: Select flashpoints, browse order cards.
- **Swipe/Drag**: Expand or collapse the Order Sheet (Bottom Sheet).
- **Hold to Commit**: A deliberate interaction to confirm high-impact decisions, preventing accidental taps.

# UI
The "Theater Layout" is the core interface. It must provide:
1. **Situational Awareness**: Clear map view.
2. **Resource Tracking**: Persistent visibility of global metrics.
3. **Actionable Intelligence**: Readability of order effects.
4. **Time Pressure**: Clear visualization of the remaining phase time.

# Key Asset & Context
- `Assets/UI/Screens/CommandHud.uxml`: Top HUD structure.
- `Assets/UI/Screens/OrderSheet.uxml`: Bottom sheet structure.
- `Assets/UI/Screens/CommandHud.uss`: Top HUD styling.
- `Assets/UI/Screens/OrderSheet.uss`: Bottom sheet styling.
- `Assets/UI/Theme/Genesis.tss`: Global theme settings.

# Implementation Steps
## Step 1: Consolidate Top HUD (Visual Hierarchy)
- **Description**: Redesign `CommandHud.uxml` to merge the "Top Bar" and "Meter Strip" into a single, cohesive "Command Header".
- **Assigned Role**: Developer
- **Dependencies**: None
- **Parallelizable**: Yes
- **Details**: 
    - Move `meterStrip` inside or directly adjacent to `topBar` to reduce vertical padding.
    - Use compact "Resource Pills" instead of full-width columns for STAB/CRED/TOLL/ESC.
    - Increase visibility of the Phase and Timer by grouping them with a more prominent background.

## Step 2: Overhaul Order Cards (Readability)
- **Description**: Update the layout of individual order cards (likely generated via `OrderCardElement`) to prioritize clarity.
- **Assigned Role**: Developer
- **Dependencies**: None
- **Parallelizable**: Yes
- **Details**:
    - Standardize card headers with distinct category colors (e.g., Diplomatic = Blue, Political = Orange, Military = Red).
    - Use clearer icons for resource modifiers (e.g., `+1 STAB`).
    - Improve typography for order descriptions to ensure readability on small screens.

## Step 3: Refine Bottom Sheet (Interactivity)
- **Description**: Adjust `OrderSheet.uxml` and `.uss` for a more tactile "Command Center" feel.
- **Assigned Role**: Developer
- **Dependencies**: Step 1
- **Parallelizable**: No
- **Details**:
    - Add a subtle glow/pulsing effect to the `sheet-urgency-line` when time is low.
    - Refine the `hold-button-container` to feel more like a physical "Launch/Commit" button.

## Step 4: Map Blending & Fade (Aesthetics)
- **Description**: Improve the transition between UI overlays and the 3D map.
- **Assigned Role**: Developer
- **Dependencies**: Step 1 & 3
- **Parallelizable**: Yes
- **Details**:
    - Update `hud-map-fade` in `CommandHud.uss` to use a more natural gradient that doesn't feel like a hard cut.
    - Ensure the "Intel Chip" and "Field Brief" popups don't obscure critical map regions.

# Verification & Testing
- **Visual Audit**: Compare the new layout against the provided reference image to ensure a significant improvement in professionalism and readability.
- **Responsive Check**: Test the layout in the Unity Editor with different Aspect Ratios (9:16, 9:20, 10:16) to ensure UI Toolkit Flexbox handles safe areas correctly.
- **Performance**: Ensure the UI does not cause draw call spikes (UI Toolkit usually handles this well, but check for excessive clipping).
