#!/usr/bin/env python3
"""Crop NASA Blue Marble (topo + bathymetry) into per-region realistic map previews.

Writes:
  unity/Genesis/Assets/StreamingAssets/Maps/realistic/<region>.jpg

Source: NASA Visible Earth Blue Marble Next Generation (public domain).
Used for Atlas card thumbs, Main Menu hero, and theater land albedo.
"""
from __future__ import annotations

import json
import subprocess
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "unity/Genesis/Assets/StreamingAssets/Maps/realistic"
GEO = ROOT / "unity/Genesis/Assets/StreamingAssets/Maps/geo"
CACHE = Path("/tmp/ne/world.topo.bathy.200412.3x5400x2700.jpg")
BM_URL = (
    "https://eoimages.gsfc.nasa.gov/images/imagerecords/73000/73909/"
    "world.topo.bathy.200412.3x5400x2700.jpg"
)
SIZE = 1024


def ensure_pillow():
    try:
        import PIL  # noqa: F401
    except ImportError:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "pillow", "-q"])


def ensure_blue_marble() -> Path:
    CACHE.parent.mkdir(parents=True, exist_ok=True)
    if CACHE.exists() and CACHE.stat().st_size > 1_000_000:
        return CACHE
    print(f"Downloading Blue Marble → {CACHE}")
    urllib.request.urlretrieve(BM_URL, CACHE)
    return CACHE


def lonlat_to_px(lon: float, lat: float, w: int, h: int) -> tuple[float, float]:
    x = (lon + 180.0) / 360.0 * w
    y = (90.0 - lat) / 180.0 * h
    return x, y


def crop_region(world, bbox, size: int):
    from PIL import Image

    lon_min, lon_max, lat_min, lat_max = bbox
    w, h = world.size

    # Handle dateline wrap by taking the shorter eastward span.
    if lon_max < lon_min:
        lon_max += 360.0

    x0, y0 = lonlat_to_px(lon_min, lat_max, w, h)  # NW
    x1, y1 = lonlat_to_px(lon_max, lat_min, w, h)  # SE

    y0 = max(0, min(h - 1, y0))
    y1 = max(1, min(h, y1))
    if y1 <= y0:
        y0, y1 = 0, h

    if x1 <= w:
        x0i, x1i = int(max(0, x0)), int(min(w, max(x0 + 1, x1)))
        crop = world.crop((x0i, int(y0), x1i, int(y1)))
    else:
        left = world.crop((int(max(0, x0)), int(y0), w, int(y1)))
        right = world.crop((0, int(y0), int(x1 - w), int(y1)))
        crop = Image.new("RGB", (left.width + right.width, left.height))
        crop.paste(left, (0, 0))
        crop.paste(right, (left.width, 0))

    # Stretch bbox → square to match mask/relief UV (full board 0–100).
    return crop.resize((size, size), Image.Resampling.LANCZOS)


def write_meta(path: Path):
    meta = path.with_suffix(path.suffix + ".meta")
    if meta.exists():
        return
    import hashlib

    rel = str(path.relative_to(ROOT))
    g = hashlib.md5(rel.encode()).hexdigest()
    meta.write_text(
        "fileFormatVersion: 2\n"
        f"guid: {g}\n"
        "TextureImporter:\n"
        "  internalIDToNameTable: []\n"
        "  externalObjects: {}\n"
        "  serializedVersion: 13\n"
        "  mipmaps:\n"
        "    mipMapMode: 0\n"
        "    enableMipMap: 1\n"
        "    sRGBTexture: 1\n"
        "    linearTexture: 0\n"
        "    fadeOut: 0\n"
        "    borderMipMap: 0\n"
        "    mipMapsPreserveCoverage: 0\n"
        "    alphaTestReferenceValue: 0.5\n"
        "    mipMapFadeDistanceStart: 1\n"
        "    mipMapFadeDistanceEnd: 3\n"
        "  bumpmap:\n"
        "    convertToNormalMap: 0\n"
        "    externalNormalMap: 0\n"
        "    heightScale: 0.25\n"
        "    normalMapFilter: 0\n"
        "    flipGreenChannel: 0\n"
        "  isReadable: 1\n"
        "  streamingMipmaps: 0\n"
        "  streamingMipmapsPriority: 0\n"
        "  vTOnly: 0\n"
        "  ignoreMipmapLimit: 0\n"
        "  grayScaleToAlpha: 0\n"
        "  generateCubemap: 6\n"
        "  cubemapConvolution: 0\n"
        "  seamlessCubemap: 0\n"
        "  textureFormat: 1\n"
        "  maxTextureSize: 2048\n"
        "  textureSettings:\n"
        "    serializedVersion: 2\n"
        "    filterMode: 1\n"
        "    aniso: 1\n"
        "    mipBias: 0\n"
        "    wrapU: 1\n"
        "    wrapV: 1\n"
        "    wrapW: 1\n"
        "  nPOTScale: 1\n"
        "  lightmap: 0\n"
        "  compressionQuality: 50\n"
        "  spriteMode: 0\n"
        "  spriteExtrude: 1\n"
        "  spriteMeshType: 1\n"
        "  alignment: 0\n"
        "  spritePivot: {x: 0.5, y: 0.5}\n"
        "  spritePixelsToUnits: 100\n"
        "  spriteBorder: {x: 0, y: 0, z: 0, w: 0}\n"
        "  spriteGenerateFallbackPhysicsShape: 1\n"
        "  alphaUsage: 1\n"
        "  alphaIsTransparency: 0\n"
        "  spriteTessellationDetail: -1\n"
        "  textureType: 0\n"
        "  textureShape: 1\n"
        "  singleChannelComponent: 0\n"
        "  flipbookRows: 1\n"
        "  flipbookColumns: 1\n"
        "  maxTextureSizeSet: 0\n"
        "  compressionQualitySet: 0\n"
        "  textureFormatSet: 0\n"
        "  ignorePngGamma: 0\n"
        "  applyGammaDecoding: 0\n"
        "  swizzle: 50462976\n"
        "  cookieLightType: 0\n"
        "  platformSettings: []\n"
        "  userData: \n"
        "  assetBundleName: \n"
        "  assetBundleVariant: \n"
    )


def main():
    ensure_pillow()
    from PIL import Image

    world_path = ensure_blue_marble()
    world = Image.open(world_path).convert("RGB")
    OUT.mkdir(parents=True, exist_ok=True)

    realistic_meta = OUT.parent / "realistic.meta"
    if not realistic_meta.exists():
        import hashlib

        g = hashlib.md5(b"StreamingAssets/Maps/realistic").hexdigest()
        realistic_meta.write_text(
            "fileFormatVersion: 2\n"
            f"guid: {g}\n"
            "folderAsset: yes\n"
            "DefaultImporter:\n"
            "  externalObjects: {}\n"
            "  userData: \n"
            "  assetBundleName: \n"
            "  assetBundleVariant: \n"
        )

    count = 0
    for geo_path in sorted(GEO.glob("*.json")):
        region_id = geo_path.stem
        data = json.loads(geo_path.read_text())
        bbox = data.get("bbox")
        if not bbox or len(bbox) != 4:
            print(f"skip {region_id}: no bbox")
            continue
        img = crop_region(world, bbox, SIZE)
        out = OUT / f"{region_id}.jpg"
        img.save(out, "JPEG", quality=88, optimize=True)
        write_meta(out)
        count += 1
        print(f"{region_id}: {out.stat().st_size // 1024} KB  bbox={bbox}")

    print(f"Wrote {count} realistic map preview(s) → {OUT}")


if __name__ == "__main__":
    main()
