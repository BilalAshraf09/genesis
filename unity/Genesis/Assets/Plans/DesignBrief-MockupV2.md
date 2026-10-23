# Design Brief — Mockup V2 (Locked Spec)

**Status:** Implementation target for iOS + Android. Do not redesign ad hoc — change the mockup first, then tokens/USS.

## Mockups (source of truth)

| File | Screen |
|------|--------|
| `mockup-v2-mainmenu-portrait.jpg` | Main Menu |
| `mockup-v2-atlas-portrait.jpg` | Atlas phone |
| `mockup-v2-atlas-landscape.jpg` | Atlas tablet / landscape |
| `mockup-v2-gameplay-portrait.jpg` | Command HUD + orders |
| `mockup-v2-order-commit-portrait.jpg` | Hold to commit |

## Cross-platform rules (pixel-stable)

1. **PanelSettings** `Genesis.PanelSettings`: ScaleWithScreenSize, ref **882×1784**, match **0.5**.
2. **Breakpoints** use `OrderSheetLayout.LogicalScreenWidth()` (Game View / iOS points / Android dp) — **never** raw retina pixels.
3. **Safe area** via `SafeAreaRootBehaviour` on Main Menu (`safeRoot`), Atlas (`atlasRoot`), Command HUD, Order Sheet (`safeRoot`).
4. **Brass CTA** = `#E5AD3F` only. Highlight = `#FFC95A`. Cost = `#E35D5B`.
5. **Atlas columns:** portrait phone 2 · tablet portrait 3 · landscape master–detail 3 · ultra-wide 5.
6. **Landscape Atlas** (≥900 logical px wide AND wider than tall): detail pane left (~38%), grid right.

## Acceptance matrix

| Size | Atlas | Play |
|------|-------|------|
| 390×844 | 2-col cards, horizontal Resume\|Abandon, safe insets | HUD + sheet, dimmed peers, hold ring |
| 430×932 | same as 390, no overflow | same |
| 900×1600 | 3-col | meters readable |
| 1920×1080 | master–detail landscape | HUD + sheet |

Validate: `Genesis → Verify → Living Atlas 25 (Matrix)`.

## Do not reopen without a mockup change

- Freemium 5 free / $5 unlock copy
- Meter colors STAB/CRED/TOLL/ESC
- Hold-only commit (early release cancels)
- Inter SemiBold / Regular SDF fonts
