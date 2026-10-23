# Setup Guide — Living Atlas 25

## Open the screens

1. **Theater Selection (Atlas)**  
   Play mode from `MainMenu` → Atlas, or open the `TheaterSelect` scene and enter Play.
2. **July Wire gameplay**  
   From Atlas, tap **PLAY THEATER →** on a free desk (e.g. July Wire), or call `AppFlow.BeginTheater("hist-1914-july-wire")`.

## Data

- Atlas cards come from `Assets/StreamingAssets/Theaters/selection-1914.json` (25 desks).
- Entitlement / free flags come from `catalog.json` via `TheaterAccessService`.
- To add desk 26+ later: append to both `catalog.json` and the selection slice (keep free set at 5 unless product changes).

## Map previews

Card and detail thumbnails use `MapTextureLibrary.LoadUiMapPreview(launchId, terrainKey)`.  
Assign or extend terrain keys on each selection entry; do not bake UI into map textures.

## Theme

Shared tokens live in `Assets/UI/Theme/tokens.uss`. Screen-specific styles: `Atlas.uss`, `CommandHud.uss`, `OrderSheet.uss`.

## Responsive checks

Use Game View / Device Simulator at:

- 390 × 844 (portrait phone)
- 430 × 932 (portrait phone)
- 900 × 1600 (tablet portrait)
- 1920 × 1080 (landscape)

Confirm: no overlapping card text/CTA, scroll reaches all 25 desks, OrderSheet cards stack on narrow widths, safe-area padding holds.

## Known limitation

STAB / CRED / TOLL / ESC meters start at a cosmetic baseline (72 / 58 / 34 / 21) and animate on commit; they are not yet full run-state persistence.
