# Implementation Checklist — Living Atlas 25

Architecture: extend existing Genesis Atlas + July Wire HUD (no `Assets/EuropeInFlames/`).
Catalog: 25 desks = `catalog.json` entries 1–25; freemium keeps first 5 free.

## Phases

- [x] Phase 1 — This checklist
- [x] Phase 2 — Theme token alignment (`tokens.uss`)
- [x] Phase 3 — `selection-1914.json` → 25 desks + loader fallback
- [x] Phase 4 — `TheaterCardElement` + Atlas responsive polish + UNLOCK CTA
- [x] Phase 5 — Light CommandHud / OrderSheet polish
- [x] Phase 6 — Setup guide
- [x] Phase 7 — Unity validate (compile + captures)

## Key files

| Area | Path |
|------|------|
| Selection slice | `Assets/StreamingAssets/Theaters/selection-1914.json` |
| Catalog (unchanged free flags) | `Assets/StreamingAssets/Theaters/catalog.json` |
| Atlas UI | `Assets/UI/Screens/Atlas.uxml`, `Atlas.uss` |
| Atlas controller | `Assets/Scripts/Core/TheaterSelectController.cs` |
| Card component | `Assets/Scripts/UI/Toolkit/TheaterCardElement.cs` |
| Loader | `Assets/Scripts/Core/TheaterCatalogLoader.cs` |
| Theme | `Assets/UI/Theme/tokens.uss` |
| Gameplay HUD | `Assets/UI/Screens/CommandHud.*`, `OrderSheet.*` |
| Validate menu | `Assets/Editor/LivingAtlas25Validate.cs` → Genesis/Verify/Living Atlas 25 (390) |

## Do not change

- `AppFlow` / `TheaterSession` campaign loop
- IAP product ids / `TheaterAccessService` freemium model
- `catalog.json` free flags
- 3D `HotspotMarker` map (no flat UITK map replacement)

## Validation matrix

| Resolution | Atlas | July Wire |
|------------|-------|-----------|
| 390 × 844 | ✓ `living-atlas-validate-390.png` (25 cards / 20 locked, 2 cols) | ✓ `living-play-validate-390.png` (5 UIDocs) |
| 430 × 932 | ✓ `living-atlas-validate-430.png` (25 cards / 20 locked, 2 cols) | ✓ `living-play-validate-430.png` (5 UIDocs) |
| 900 × 1600 | ✓ `living-atlas-validate-900.png` (25 cards / 20 locked, 3 cols) | ✓ `living-play-validate-900.png` (5 UIDocs) |
| 1920 × 1080 | ✓ `living-atlas-validate-1920.png` (25 cards / 20 locked, master–detail) | ✓ `living-play-validate-1920.png` (5 UIDocs) |

## Known limitations

- Resource meters baseline (72/58/34/21) remains cosmetic until scenario state binds them.
- Desks 26–32 exist in catalog but are not shown on Atlas.
- Game View `Screen.width` may report editor window size; captures still use FixedResolution 390×844.
