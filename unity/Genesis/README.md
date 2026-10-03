# Genesis — Unity AAA (full game path)

Pinned editor: **Unity 6000.0.84f1** (Unity 6.0 LTS)  
Package id: `com.bilalashraf.genesis` · Android IL2CPP · ARM64

Expo at the repo root stays intact. This folder is the Unity playable track: **app shell + all 32 theaters + geographic maps**.

---

## Play the complete game (Bilal)

1. Install [Unity Hub](https://unity.com/download) → Editor **6000.0.84f1** (Personal OK).
2. Hub → **Projects** → **Add** → `<repo>/unity/Genesis`
3. Open project; wait for URP / Input System / Cinemachine / uGUI import.
4. Menu **Genesis → Rebuild Full App Shell**  
   (Boot, MainMenu, TheaterSelect, TheaterPlay, Results, Settings + build settings + URP).
5. Open **`Assets/Scenes/Boot.unity`** (or press Play with Boot as first scene).
6. Click through: **Boot → Main Menu → All Theaters → pick any → Play → Results → Menu**.

### Featured shortcut

Main Menu → **DEPLOY FEATURED** opens **India Partition** (`hist-1947-radcliffe`) immediately.

### Direct theater debug (optional)

Open `TheaterPlay.unity` and Press Play — still works (Partition by default). Full shell is preferred for the complete experience.

### Play checklist

| Step | Expect |
| --- | --- |
| Boot | GENESIS brand splash → Main Menu |
| Main Menu | Deploy / All Theaters / Settings stub |
| Theater select | **32** historical theaters listed (1905–2025) |
| Play | Geographic land silhouette + terrain albedo, brass pins, ink HUD |
| Loop | Hotspot → order rail → **EXECUTE ORDER** → resolve → **all beats** (10) |
| Results | After-action summary → Main Menu / All Theaters |
| Materials | **No magenta**, **no cyan torus** markers (brass/intel pins) |

### Refresh content after Expo edits

```bash
python3 scripts/generate-unity-map-assets.py   # Natural Earth silhouettes + relief
python3 scripts/export-unity-theaters.py       # all theaters → StreamingAssets
```

Then Unity: **Genesis → Validate Slice Integrity**.

---

## Maps

- **Partition (hero):** Natural Earth 110m India/Pakistan/Bangladesh/Sri Lanka rings + Expo cities + Radcliffe axis + `terrain_southasia.jpg` albedo + relief PNG.
- **Other theaters:** Natural Earth region crops (where available) + matching terrain JPG + same hotspot/EXECUTE contract.
- Materials: **URP Lit only** via `TheaterMaterialFactory` (keep `18fa3b2` fix).

---

## Editor menus

| Menu | Purpose |
| --- | --- |
| **Genesis → Rebuild Full App Shell** | Boot→Results scenes + build settings + TheaterPlay + SSAO + DeskDust |
| **Genesis → Rebuild Theater Play Slice** | TheaterPlay only (+ SSAO + DeskDust) |
| **Genesis → Ensure URP Pipeline Assets** | URP + volume grade (all quality tiers) + SSAO |
| **Genesis → Visuals → Enable SSAO on Theater Renderer** | URP SSAO feature (also via Rebuild) |
| **Genesis → Visuals → Build DeskDust VFX Resource** | `Resources/GenesisVFX/DeskDust` High dust |
| **Genesis → Visuals → Look Freeze Checklist** | Console gate vs halfcooked anti-ref (clarity A/B/C) |
| **Genesis → Capture → Clarity Gate Stills (A/B/C Partition)** | Portrait 1080×1920 Partition idle/select/post-EXECUTE → `media/genesis-unity-mobile-clarity-A\|B\|C.png` |
| **Genesis → Capture → Store High Stills (Premium)** | Force High → premium board/execute/results PNGs |
| **Genesis → Capture → Open Capture Output Folder** | Reveal `Temp/GenesisCapture/` |
| **Genesis → Validate Slice Integrity** | JSON / scenes / scripts / 32-theater catalog |
| **Genesis → Validate Materials (no magenta)** | Ban Built-in / Error shaders |
| **Genesis → Capture Worldclass Play Demo** | Play stills (licensed Editor) |
| **Genesis → Mobile → Apply Mobile Player Settings** | Package id, Portrait, IL2CPP, ARM64, iOS 15+, URP tiers |
| **Genesis → Mobile → Build Android AAB (internal)** | Writes `Builds/Android/Genesis-*.aab` (needs Android module + keystore for Play) |
| **Genesis → Mobile → Export iOS Xcode Project** | Writes `Builds/iOS/` (macOS + iOS module; Bilal signs in Xcode) |

Android / iOS release steps (Play Internal + TestFlight): project store `docs/unity-mobile-release.md`.

---

## Layout

```
unity/Genesis/
  Assets/
    Scenes/Boot|MainMenu|TheaterSelect|TheaterPlay|Results|Settings.unity
    Scripts/          # shell + theater loop (Genesis.Runtime)
    Editor/           # Rebuild / Validate
    StreamingAssets/
      Theaters/*.json           # 32 theaters + catalog
      Maps/terrain/*.jpg        # Expo terrain albedo
      Maps/geo/*.json           # Natural Earth board rings
      Maps/relief|mask/*.png
    Settings/         # URP + volume
```

---

## This cloud VM

Unity Editor is **not licensed** here. Open on Bilal’s machine for Play Mode. Content export + shell + maps are committed and ready.

Keep playability (`bcc2ffa`) and URP materials (`18fa3b2`). Look frozen per `unity-board-visual-redesign.md` — maps upgraded to real geography without cyan/magenta regression.
