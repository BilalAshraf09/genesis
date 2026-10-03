# Board gamefeel research → Genesis rules

Short, actionable findings from modern strategy / ops / narrative-decision games that are **not quizzes**. Goal: kill the MCQ look and make Genesis feel like a command theater.

## What makes them feel like *games* (not quizzes)

| Pattern | Games | Why it reads as a game |
|---|---|---|
| **World is the verb surface** | Into the Breach, XCOM Geoscape | You act *on* the board; UI narrates intent. Answers never sit as A/B/C cards over the world. |
| **Telegraph before resolve** | Into the Breach | Enemy/state intentions animate *before* commit. Clarity > cool effects. |
| **Three reads** | Into the Breach (Zach Gage “subway legibility”) | 1st: board state. 2nd: objective + timer. 3rd: detail drawers. Dense quiz text fails read #1. |
| **Map as hero real estate** | XCOM 2 Geoscape | Mission list lives *below/around* the globe; selecting a pin focuses camera + lighting, not a form. |
| **Glanceable stakes meters** | Reigns pillars | Pressure is always visible as bars/icons — not paragraphs of pros/cons on the choice itself. |
| **Pressure without MCQ chrome** | Papers, Please; Reigns | Timer, scarce resources, irreversible commit. Interaction is a verb (stamp / swipe / execute), not “pick option B.” |
| **High-contrast markers** | AC Odyssey (anti-pattern) | Gold-on-sand fails. Successful maps use outlined shapes, strong hue separation, enlarge-on-select. |
| **Shareable beats** | Mobile hitters / XCOM mission punch-ins | One screenshotable moment mid-loop (order locked, world course flash) beats a static results sheet. |

### Quiz smell (what Genesis must avoid)
- Equal-weight answer tiles that read as A / B / C
- Pros/cons or long explanation on the board before commit
- Static pins that never react after EXECUTE
- Question-prompt copy (“What do you do?”) instead of an objective
- Overlapping / clipped labels fighting the map

## 7 concrete rules applied to Genesis

1. **Board is the hero plane** — Full-bleed theater map owns the first play viewport. Ops rail sits *below* the map (never over India / coasts). No answer-card stack on geography.
2. **Tap-select military orders** — Hotspots + rail are *orders* (callsign · kind · place). Verb is ENGAGE → EXECUTE ORDER, not “choose answer.”
3. **Dynamic world reaction** — Select focuses camera/lighting/fog; EXECUTE fires flash, expanding rings, beacon collapse, course-shift overlay. The world must change every commit.
4. **Telegraph + timer ring** — HUD timer ring + pressure meter are always legible; critical window pulses. Stakes live in meters, not quiz footnotes.
5. **Cinematic objective, not question** — Situation strip is PRIMARY OBJECTIVE + stakes. Ask language is command (“AUTHORIZE AN ORDER”), never MCQ prompt.
6. **Readable hierarchy** — Large Orbitron callsigns, high-contrast chalk labels, sparse markers. Enlarge/halo selected. Zero overlapping rail tiles; India-overlap fixed by rail-outside-map.
7. **One viral mid-run beat** — On resolve: shareable “WORLD COURSE LOCKED” challenge strip (invite/challenge) — screenshotable without waiting for after-action.

## Expo/three honesty
Cannot claim AAA Unity parity (limited post-FX, no full navmesh). Maximize gamefeel with: animated units, fog/focus, camera lerp, commit lighting punch, HUD rings, and readable glass chrome — all within expo-gl + three.
