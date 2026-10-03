# Genesis Shaders — Phase B Premium

Shader Graph **visual contracts** ship as URP HLSL first (matches prior `Genesis/InkWater` precedent).
Property names are stable so Editor can re-author as `.shadergraph` without rematerializing boards.

| Shader | Role |
| --- | --- |
| `Genesis/Land` | Parchment albedo × relief normal/AO × coast mask + micro grain |
| `Genesis/InkWater` | Quiet ink water + foam rim from coast mask / fresnel |

Menu: **Genesis → Maps → Apply ASTC + 2K Import Settings** for importer ASTC on map textures.
StreamingAssets runtime still uses `LoadImage` (RGBA) via `StreamingAssetsIO` (Android UWR).
