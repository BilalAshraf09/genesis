Genesis store icons — PLACEHOLDERS
==================================

Player Settings → Android / iOS Icon slots are empty until Bilal drops art here
(or assigns in the Inspector). Do not block AAB/IPA test builds on final art —
Unity falls back to the default Unity cube for internal tracks.

Recommended sizes (square PNG, no alpha for App Store 1024):

  App Store / Play high-res   1024 × 1024
  Android adaptive foreground 432 × 432 (safe zone ~66% center)
  iOS App Icon set            leave to Xcode Asset Catalog or Unity Auto

Suggested filenames once ready:
  genesis-icon-1024.png
  genesis-adaptive-fg.png
  genesis-adaptive-bg.png   (solid #0A0908 teak void)

Assign: Edit → Project Settings → Player → Android / iOS → Icon.
