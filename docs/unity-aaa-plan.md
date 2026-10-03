# Genesis — Unity AAA rebuild plan

**Status:** M0 foundation + repo-side M1 polish under `unity/Genesis/`. Expo app kept intact.  
**Pinned editor:** Unity **6000.0.84f1** (Unity 6.0 LTS)  
**Slice theater:** India Partition (`hist-1947-radcliffe`); Thirteen Days JSON also exported.  
**PR branch:** `cursor/genesis-unity-aaa-f590`

## Why Expo / expo-gl cannot hit Bilal’s bar

Bilal asked for Medal of Honor / Assassin’s Creed–class **presentation** for a historical decision theater — not a polished quiz.

| Gap | Expo + three / expo-gl | Unity |
| --- | --- | --- |
| Lighting & post | Limited custom lights, weak bloom/volume stack on device | URP volumes, baked+realtime, cinematic grade |
| Terrain / board mesh | Procedural canvas / low-poly planes | Extruded geo, LODs, nav-ready meshes |
| Mobile packaging | WebView / RN bridge constraints | Native Android/iOS players, IL2CPP |
| Animation / FX | Manual tween + limited particles | Timeline, VFX Graph, Cinemachine |
| Art pipeline | Ad-hoc assets in JS | FBX/USD, Addressables, SO content |
| Perceived AAA | Reads as “3D quiz board” under pressure | Command theater when board is hero + world reacts |

Expo remains useful as a **content + monetization lab**. It is not the shipping presentation stack for the AAA bar.

## Architecture (v1)

```
unity/Genesis/
  Assets/
    Scenes/TheaterPlay.unity          # bootstrap → runtime wire
    Scripts/   Genesis.Runtime asmdef
      Core/     TheaterCatalogLoader, TheaterPlayBootstrap
      Data/     JSON models
      Theater/  BoardBuilder, Hotspot (+labels), Session, CameraRig
      UI/       OpsHud, OrderRail, ResolveBeat
      Effects/  WorldReactionFX (dual shock + ember)
    Editor/    Genesis.Editor asmdef + GenesisSceneBuilder
    Settings/  URP pipeline + volume (created by menu on first Rebuild)
    StreamingAssets/Theaters/*.json   # ported from Expo src/data
  Packages/manifest.json              # URP 17.0.4, Input System, uGUI
  ProjectSettings/ProjectVersion.txt  # 6000.0.84f1
```

**Loop:** load theater JSON → build full-bleed 3D map → tap hotspot / command strip → timer → **EXECUTE ORDER** → shockwave + lighting punch + beacon collapse → resolve card with viral challenge hook → next phase (slice = 3 phases).

**Design musts encoded in code**
- Map is hero full-bleed; orders live in a **rail below** the map (no A/B/C cards on geography)
- Zero overlapping labels on India; ops UI clear of coasts
- Dynamic world reaction on execute
- Thriller tone (fog, cinematic key/fill/rim/bounce, URP bloom/vignette/grain)
- Freemium/RC stubbed (`FreemiumStub`)
- Viral challenge line on resolve

## Content pipeline

1. Author / iterate theaters in Expo TypeScript (`src/data/historical/catalog.ts`, templates, geoAtlas).
2. Run `python3 scripts/export-unity-theaters.py` → `StreamingAssets/Theaters/`.
3. Unity loads JSON at runtime (ScriptableObject wrappers optional later).
4. Later: Addressables per theater + localized VO beds.

## Art / audio pipeline (next)

| Track | Approach |
| --- | --- |
| Board landmass | Extrude from geo JSON → replace with sculpted low-poly FBX per archetype |
| Water | URP water / simple reflective plane + foam strip |
| Hotspots | Military beacon prefabs (emissive + pulse Timeline) |
| HUD | Unity UI Toolkit or uGUI + Orbitron/Sora font assets |
| Music | Import existing royalty-safe beds from Expo `assets/`; add stingers on execute/resolve |
| Portrait / figure chips | Optional later — keep out of first viewport |

## Mobile build (Unity)

1. Install modules: **Android Build Support** (+ SDK/NDK/OpenJDK) and **iOS Build Support** on 6000.0.84f1.
2. Player Settings already seed `com.bilalashraf.genesis`, min Android API 24, iOS 13.
3. Android: **IL2CPP**, **ARM64**, App Bundle for Play (seeded in `ProjectSettings.asset`).
4. iOS: Xcode export from Unity on macOS.
5. Store billing: wire RevenueCat Unity SDK in a later milestone (stub OK for slice).

## Milestones

1. **M0 — Foundation (this branch)** — done  
   Project + Partition JSON + playable loop scripts + scene bootstrap + preview + plan.
2. **M1 — In-Editor playable** — repo polish done; **Play verification = Bilal local license**  
   Stronger lighting/URP volume defaults, hotspot labels, order rail, EXECUTE FX, Android settings. Press Play on `TheaterPlay` locally.
3. **M2 — Presentation pass**  
   Cinemachine shots, execute Timeline, authentic board mesh, audio stingers.
4. **M3 — Android internal track**  
   First AAB sideload; touch input polish; safe-area HUD.
5. **M4 — Content scale**  
   All 32 theaters via exporter; SO catalog; freemium gate.
6. **M5 — Retire Expo play surface**  
   Keep Expo only if still needed for content tooling; Unity becomes the player.

## Honest environment report

| Item | State on cloud agent VM |
| --- | --- |
| Unity Hub / Editor | Not available for licensed Play on this agent pass |
| License / auth | **None on VM** — do not invent credentials; Bilal licenses locally |
| Playable in-editor here | **No** — needs Bilal’s licensed Unity |
| Repo-side M1 polish | **Yes** — lighting, labels, rail, FX, URP menus, Android IL2CPP/ARM64 |
| Playable preview here | **Yes** — `unity/preview/` Three.js board using the same StreamingAssets JSON |
| Expo app | Intact at repo root |

## How Bilal opens the project

See `unity/Genesis/README.md` for the full Hub checklist. Short path:

1. Hub → install **6000.0.84f1** + **Android Build Support** (+ SDK/NDK/OpenJDK).
2. Hub → **Add** → `<repo>/unity/Genesis`.
3. Menu **Genesis → Rebuild Theater Play Slice**.
4. Press **Play** on `TheaterPlay`.

Re-export content anytime:

```bash
python3 scripts/export-unity-theaters.py
```

## Setup complete when… (Bilal ticks after local Play)

- [ ] Unity Hub opens `unity/Genesis` on **6000.0.84f1** without package errors
- [ ] Modules installed: **Android Build Support** (+ SDK/NDK/OpenJDK)
- [ ] Menu **Genesis → Rebuild Theater Play Slice** succeeds (URP assets under `Assets/Settings/`)
- [ ] Menu **Genesis → Validate Slice Integrity** logs OK
- [ ] Press **Play**: India Partition board fills the view (map hero, not quiz chrome)
- [ ] Hotspot labels readable; order rail sits **below** the map
- [ ] Tap order → **EXECUTE ORDER** → dual shockwave / ember / light punch → resolve + challenge line
- [ ] Three phases complete → “THEATER CLOSED”
- [ ] Player Settings show `com.bilalashraf.genesis`, IL2CPP, ARM64
- [ ] (Optional) Capture Play Mode screenshot for store media:  
      `media/genesis-unity-setup-play.png`

**Not claimed complete:** AAA MoH shipping bar, Android AAB on a device, Cinemachine/Timeline presentation pass (M2+).
