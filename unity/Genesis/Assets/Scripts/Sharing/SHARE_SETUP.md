# Genesis Share Result — Setup & Limits

## What ships in the client

| Piece | Role |
| --- | --- |
| `ShareResultService` | Generate PNG → native share → delayed cleanup |
| `ShareCardRenderer` | 1080×1350 branded card from `RunSummary` only |
| `MobilePlatform.ShareImageAndText` | Android / iOS share sheet bridge |
| `Plugins/Android/GenesisShare.java` | `ACTION_SEND` image + text via FileProvider |
| `Plugins/iOS/GenesisNativeShare.mm` | `UIActivityViewController` |
| Results **SHARE RESULT** button | Wired in `ResultsController` (no login required) |

No third-party store plugin. Native code is MIT-style project-owned.

## Android

1. Confirm package id `com.bilalashraf.genesis` matches FileProvider authority in:
   - [`AndroidManifest.xml`](../../Plugins/Android/AndroidManifest.xml)
   - `GenesisShare.java` (`getPackageName() + ".genesis.fileprovider"`)
2. **AndroidX Core** must be on the classpath (`androidx.core.content.FileProvider`). Unity 6 Gradle templates usually include it; if the build fails on `FileProvider`, add to custom Gradle dependencies:

```gradle
implementation 'androidx.core:core:1.13.1'
```

3. Share cards are written under `Application.persistentDataPath/ShareCards/` (external files path — covered by `genesis_file_paths.xml`).
4. Temporary PNGs are deleted ~120s after share (so the receiving app can read them first).

## iOS

1. No extra entitlements for the system share sheet.
2. Plugin: `Plugins/iOS/GenesisNativeShare.mm` (automatically compiled into the Xcode project).
3. iPad uses a centered popover anchor.

## Platform limits (document honestly)

- Opening or closing the share sheet does **not** prove a post was published.
- WhatsApp / Instagram / Messages / etc. may ignore caption text and use only the image (or the reverse).
- Instagram Stories often needs the image alone; text may be dropped by the destination app.
- Editor Play Mode saves the PNG and copies text — it does **not** open a real OS share sheet.
- Guest and registered users can both share; sharing never unlocks theaters or changes IAP.

## Manual device checks

1. High-score result → card shows theater, score, grade title, real scars only  
2. Low-score / “Volatile Standoff” → same fields, no invented victory  
3. Guest share without logging in  
4. Cancel share sheet → back on After Action with Redeploy / Next intact  
5. Share to Messages / WhatsApp / Files  
6. Confirm temp PNG eventually cleaned from `ShareCards/`
