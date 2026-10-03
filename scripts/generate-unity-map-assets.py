#!/usr/bin/env python3
"""Generate Natural Earth–style board silhouettes + relief textures for Unity.

Downloads public-domain Natural Earth 110m admin polygons, crops them into
theater board space (0–100), and writes:
  unity/Genesis/Assets/StreamingAssets/Maps/geo/<region>.json
  unity/Genesis/Assets/StreamingAssets/Maps/relief/<region>.png
  unity/Genesis/Assets/StreamingAssets/Maps/mask/<region>.png

Partition (southasia) is hero-quality with denser rings + India/Pakistan/Bangladesh.
"""
from __future__ import annotations

import json
import math
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "unity/Genesis/Assets/StreamingAssets/Maps"
NE_URL = (
    "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/"
    "geojson/ne_110m_admin_0_countries.geojson"
)
CACHE = Path("/tmp/ne/ne_110m.geojson")

# region_id → (lon_min, lon_max, lat_min, lat_max, country_names, hero)
REGIONS = {
    "southasia": {
        "bbox": (60.0, 98.0, 5.0, 38.0),
        "countries": ["India", "Pakistan", "Bangladesh", "Sri Lanka", "Nepal", "Bhutan"],
        "hero": True,
        "label": "Indian subcontinent (Natural Earth)",
        "cities": [
            {"name": "Delhi", "lon": 77.2, "lat": 28.6},
            {"name": "Lahore", "lon": 74.3, "lat": 31.5},
            {"name": "Calcutta", "lon": 88.4, "lat": 22.6},
            {"name": "Karachi", "lon": 67.0, "lat": 24.9},
            {"name": "Dhaka", "lon": 90.4, "lat": 23.8},
            {"name": "Mumbai", "lon": 72.9, "lat": 19.1},
        ],
        # Radcliffe-ish contested axis in lon/lat then projected
        "border_ll": [
            (70.0, 32.5),
            (72.5, 30.0),
            (74.5, 27.5),
            (77.0, 25.0),
            (82.0, 24.0),
            (88.0, 24.5),
            (92.0, 25.5),
        ],
    },
    "caribbean": {
        "bbox": (-100.0, -65.0, 10.0, 35.0),
        "countries": ["Cuba", "United States of America", "Mexico", "Haiti", "Dominican Republic"],
        "hero": False,
        "label": "Caribbean · Cuba (Natural Earth)",
        "cities": [
            {"name": "Havana", "lon": -82.4, "lat": 23.1},
            {"name": "Miami", "lon": -80.2, "lat": 25.8},
            {"name": "Guantánamo", "lon": -75.2, "lat": 20.1},
        ],
    },
    "korea": {
        "bbox": (120.0, 145.0, 30.0, 46.0),
        "countries": ["South Korea", "North Korea", "Japan", "China"],
        "hero": False,
        "label": "Korean Peninsula (Natural Earth)",
        "cities": [
            {"name": "Seoul", "lon": 126.98, "lat": 37.57},
            {"name": "Pyongyang", "lon": 125.75, "lat": 39.04},
            {"name": "Busan", "lon": 129.08, "lat": 35.18},
        ],
        "border_ll": [(124.5, 38.3), (130.0, 38.5)],
    },
    "gulf": {
        "bbox": (44.0, 66.0, 20.0, 38.0),
        "countries": ["Iran", "Saudi Arabia", "United Arab Emirates", "Oman", "Qatar", "Kuwait", "Iraq"],
        "hero": False,
        "label": "Persian Gulf · Hormuz (Natural Earth)",
        "cities": [
            {"name": "Hormuz", "lon": 56.5, "lat": 27.1},
            {"name": "Tehran", "lon": 51.4, "lat": 35.7},
            {"name": "Riyadh", "lon": 46.7, "lat": 24.7},
            {"name": "Dubai", "lon": 55.3, "lat": 25.2},
        ],
    },
    "manchuria": {
        "bbox": (115.0, 140.0, 30.0, 50.0),
        "countries": ["China", "North Korea", "South Korea", "Japan", "Russia"],
        "hero": False,
        "label": "Manchuria · Sea of Japan (Natural Earth)",
        "cities": [
            {"name": "Mukden", "lon": 123.4, "lat": 41.8},
            {"name": "Port Arthur", "lon": 121.3, "lat": 38.9},
            {"name": "Seoul", "lon": 126.98, "lat": 37.57},
        ],
    },
    "europe-central": {
        "bbox": (0.0, 30.0, 42.0, 58.0),
        "countries": ["Germany", "Poland", "Czechia", "Austria", "Hungary", "Slovakia", "France"],
        "hero": False,
        "label": "Central Europe (Natural Earth)",
        "cities": [
            {"name": "Berlin", "lon": 13.4, "lat": 52.5},
            {"name": "Munich", "lon": 11.6, "lat": 48.1},
            {"name": "Prague", "lon": 14.4, "lat": 50.1},
            {"name": "Vienna", "lon": 16.4, "lat": 48.2},
        ],
    },
    "europe-west": {
        "bbox": (-10.0, 15.0, 42.0, 58.0),
        "countries": ["France", "United Kingdom", "Belgium", "Netherlands", "Germany", "Spain"],
        "hero": False,
        "label": "Western Europe (Natural Earth)",
        "cities": [
            {"name": "Paris", "lon": 2.35, "lat": 48.86},
            {"name": "London", "lon": -0.13, "lat": 51.5},
            {"name": "Brussels", "lon": 4.35, "lat": 50.85},
        ],
    },
    "europe-east": {
        "bbox": (10.0, 40.0, 42.0, 60.0),
        "countries": ["Poland", "Ukraine", "Germany", "Romania", "Hungary", "Belarus"],
        "hero": False,
        "label": "Eastern Europe (Natural Earth)",
        "cities": [
            {"name": "Warsaw", "lon": 21.0, "lat": 52.2},
            {"name": "Kyiv", "lon": 30.5, "lat": 50.45},
            {"name": "Bucharest", "lon": 26.1, "lat": 44.4},
        ],
    },
    "russia-west": {
        "bbox": (20.0, 55.0, 45.0, 65.0),
        "countries": ["Russia", "Ukraine", "Belarus", "Finland", "Poland"],
        "hero": False,
        "label": "Western Russia (Natural Earth)",
        "cities": [
            {"name": "Petrograd", "lon": 30.3, "lat": 59.9},
            {"name": "Moscow", "lon": 37.6, "lat": 55.75},
            {"name": "Kyiv", "lon": 30.5, "lat": 50.45},
        ],
    },
    "pacific-japan": {
        "bbox": (125.0, 150.0, 28.0, 48.0),
        "countries": ["Japan", "South Korea", "North Korea"],
        "hero": False,
        "label": "Japan · Pacific (Natural Earth)",
        "cities": [
            {"name": "Tokyo", "lon": 139.7, "lat": 35.7},
            {"name": "Hiroshima", "lon": 132.5, "lat": 34.4},
            {"name": "Nagasaki", "lon": 129.9, "lat": 32.7},
        ],
    },
    "china-east": {
        "bbox": (100.0, 130.0, 18.0, 45.0),
        "countries": ["China", "Taiwan", "South Korea", "North Korea", "Vietnam"],
        "hero": False,
        "label": "East China (Natural Earth)",
        "cities": [
            {"name": "Beijing", "lon": 116.4, "lat": 39.9},
            {"name": "Shanghai", "lon": 121.5, "lat": 31.2},
            {"name": "Nanjing", "lon": 118.8, "lat": 32.1},
        ],
    },
    "suez": {
        "bbox": (28.0, 42.0, 22.0, 36.0),
        "countries": ["Egypt", "Israel", "Jordan", "Saudi Arabia"],
        "hero": False,
        "label": "Suez · Levant (Natural Earth)",
        "cities": [
            {"name": "Suez", "lon": 32.5, "lat": 29.97},
            {"name": "Cairo", "lon": 31.2, "lat": 30.0},
            {"name": "Tel Aviv", "lon": 34.8, "lat": 32.1},
        ],
    },
    "levant": {
        "bbox": (30.0, 42.0, 28.0, 38.0),
        "countries": ["Israel", "Lebanon", "Syria", "Jordan", "Egypt"],
        "hero": False,
        "label": "Levant (Natural Earth)",
        "cities": [
            {"name": "Jerusalem", "lon": 35.2, "lat": 31.8},
            {"name": "Beirut", "lon": 35.5, "lat": 33.9},
            {"name": "Damascus", "lon": 36.3, "lat": 33.5},
        ],
    },
    "anatolia": {
        "bbox": (24.0, 48.0, 34.0, 44.0),
        "countries": ["Turkey", "Greece", "Cyprus", "Syria", "Iraq"],
        "hero": False,
        "label": "Anatolia (Natural Earth)",
        "cities": [
            {"name": "Ankara", "lon": 32.9, "lat": 39.9},
            {"name": "Istanbul", "lon": 28.98, "lat": 41.0},
            {"name": "Izmir", "lon": 27.1, "lat": 38.4},
        ],
    },
    "black-sea": {
        "bbox": (26.0, 48.0, 40.0, 52.0),
        "countries": ["Ukraine", "Russia", "Romania", "Turkey", "Moldova"],
        "hero": False,
        "label": "Black Sea (Natural Earth)",
        "cities": [
            {"name": "Sevastopol", "lon": 33.5, "lat": 44.6},
            {"name": "Kyiv", "lon": 30.5, "lat": 50.45},
            {"name": "Odessa", "lon": 30.7, "lat": 46.5},
        ],
    },
    "afghanistan": {
        "bbox": (58.0, 78.0, 28.0, 42.0),
        "countries": ["Afghanistan", "Pakistan", "Iran", "Turkmenistan", "Uzbekistan"],
        "hero": False,
        "label": "Afghanistan (Natural Earth)",
        "cities": [
            {"name": "Kabul", "lon": 69.2, "lat": 34.5},
            {"name": "Kandahar", "lon": 65.7, "lat": 31.6},
            {"name": "Herat", "lon": 62.2, "lat": 34.3},
        ],
    },
    "se-asia": {
        "bbox": (95.0, 125.0, -10.0, 25.0),
        "countries": ["Indonesia", "Malaysia", "Thailand", "Vietnam", "Philippines", "Singapore"],
        "hero": False,
        "label": "SE Asia (Natural Earth)",
        "cities": [
            {"name": "Jakarta", "lon": 106.8, "lat": -6.2},
            {"name": "Bangkok", "lon": 100.5, "lat": 13.8},
            {"name": "Singapore", "lon": 103.8, "lat": 1.3},
        ],
    },
    "poland-corridor": {
        "bbox": (10.0, 28.0, 48.0, 58.0),
        "countries": ["Poland", "Germany", "Lithuania", "Czechia"],
        "hero": False,
        "label": "Polish Corridor (Natural Earth)",
        "cities": [
            {"name": "Danzig", "lon": 18.6, "lat": 54.4},
            {"name": "Warsaw", "lon": 21.0, "lat": 52.2},
            {"name": "Berlin", "lon": 13.4, "lat": 52.5},
        ],
    },
    "pacific-hawaii": {
        "bbox": (-180.0, -140.0, 10.0, 35.0),
        "countries": ["United States of America"],
        "hero": False,
        "label": "Pacific · Hawaii (Natural Earth)",
        "cities": [
            {"name": "Pearl Harbor", "lon": -157.98, "lat": 21.35},
            {"name": "Honolulu", "lon": -157.86, "lat": 21.31},
        ],
    },
    "berlin": {
        "bbox": (5.0, 20.0, 48.0, 56.0),
        "countries": ["Germany", "Poland", "Czechia"],
        "hero": False,
        "label": "Berlin theater (Natural Earth)",
        "cities": [
            {"name": "Berlin", "lon": 13.4, "lat": 52.5},
            {"name": "Potsdam", "lon": 13.1, "lat": 52.4},
        ],
        "border_ll": [(13.4, 52.3), (13.4, 52.7)],
    },
    "atlantic-finance": {
        "bbox": (-80.0, 10.0, 25.0, 55.0),
        "countries": ["United States of America", "United Kingdom", "France", "Canada"],
        "hero": False,
        "label": "Atlantic finance desks (Natural Earth)",
        "cities": [
            {"name": "New York", "lon": -74.0, "lat": 40.7},
            {"name": "London", "lon": -0.13, "lat": 51.5},
            {"name": "Washington", "lon": -77.0, "lat": 38.9},
        ],
    },
    "maghreb-east": {
        "bbox": (-10.0, 40.0, 15.0, 38.0),
        "countries": ["Egypt", "Libya", "Tunisia", "Algeria", "Morocco", "Sudan"],
        "hero": False,
        "label": "Maghreb · East Med (Natural Earth)",
        "cities": [
            {"name": "Cairo", "lon": 31.2, "lat": 30.0},
            {"name": "Tunis", "lon": 10.2, "lat": 36.8},
            {"name": "Algiers", "lon": 3.06, "lat": 36.75},
        ],
    },
    "world-hubs": {
        "bbox": (-130.0, 150.0, -40.0, 60.0),
        "countries": [
            "United States of America",
            "China",
            "India",
            "Brazil",
            "United Kingdom",
            "Japan",
            "Germany",
            "Australia",
        ],
        "hero": False,
        "label": "World hubs (Natural Earth)",
        "cities": [
            {"name": "New York", "lon": -74.0, "lat": 40.7},
            {"name": "London", "lon": -0.13, "lat": 51.5},
            {"name": "Beijing", "lon": 116.4, "lat": 39.9},
            {"name": "Delhi", "lon": 77.2, "lat": 28.6},
        ],
    },
}


def ensure_ne() -> dict:
    CACHE.parent.mkdir(parents=True, exist_ok=True)
    if not CACHE.exists() or CACHE.stat().st_size < 10000:
        print(f"Downloading Natural Earth → {CACHE}")
        urllib.request.urlretrieve(NE_URL, CACHE)
    return json.loads(CACHE.read_text())


def project(lon: float, lat: float, bbox: tuple[float, float, float, float]) -> list[float]:
    lon0, lon1, lat0, lat1 = bbox
    # Handle antimeridian wraps for Hawaii-ish boxes
    if lon0 < -170 and lon < 0:
        pass
    x = (lon - lon0) / (lon1 - lon0) * 100.0
    # board y increases southward (matches existing geoAtlas convention)
    y = (lat1 - lat) / (lat1 - lat0) * 100.0
    return [round(x, 2), round(y, 2)]


def ring_in_bbox(coords, bbox, min_pts=8, max_pts=180, hero=False):
    """Project exterior ring; clip to board; downsample."""
    pts = []
    for lon, lat, *_ in coords:
        if lon < bbox[0] - 2 or lon > bbox[1] + 2 or lat < bbox[2] - 2 or lat > bbox[3] + 2:
            continue
        pts.append(project(lon, lat, bbox))
    if len(pts) < 3:
        return None
    # Keep points inside slightly expanded board
    clipped = []
    for x, y in pts:
        if -5 <= x <= 105 and -5 <= y <= 105:
            clipped.append([max(0.5, min(99.5, x)), max(0.5, min(99.5, y))])
    if len(clipped) < 3:
        return None
    # Decimate
    target = max_pts if hero else min(max_pts, 90)
    if len(clipped) > target:
        step = max(1, len(clipped) // target)
        clipped = clipped[::step]
    if clipped[0] != clipped[-1]:
        clipped.append(clipped[0][:])
    if len(clipped) < min_pts:
        return None
    return clipped


def extract_country_rings(feature, bbox, hero=False):
    geom = feature["geometry"]
    rings = []
    if geom["type"] == "Polygon":
        polys = [geom["coordinates"]]
    elif geom["type"] == "MultiPolygon":
        polys = geom["coordinates"]
    else:
        return rings
    for poly in polys:
        if not poly:
            continue
        ring = ring_in_bbox(poly[0], bbox, hero=hero)
        if ring:
            rings.append(ring)
    return rings


def simplify_area(ring):
    # shoelace approx for sorting largest landmass first
    if len(ring) < 3:
        return 0
    a = 0.0
    for i in range(len(ring) - 1):
        x1, y1 = ring[i]
        x2, y2 = ring[i + 1]
        a += x1 * y2 - x2 * y1
    return abs(a) * 0.5


def build_region(ne: dict, region_id: str, cfg: dict) -> dict:
    bbox = cfg["bbox"]
    want = set(cfg["countries"])
    rings = []
    for f in ne["features"]:
        props = f["properties"]
        name = props.get("NAME") or props.get("ADMIN")
        if name not in want:
            continue
        rings.extend(extract_country_rings(f, bbox, hero=cfg.get("hero", False)))

    rings.sort(key=simplify_area, reverse=True)
    # Cap ring count — keep biggest pieces for readable board
    cap = 8 if cfg.get("hero") else 5
    rings = rings[:cap]

    cities = []
    for c in cfg.get("cities", []):
        x, y = project(c["lon"], c["lat"], bbox)
        if 0 <= x <= 100 and 0 <= y <= 100:
            cities.append({"name": c["name"], "x": round(x, 2), "y": round(y, 2)})

    borders = []
    if cfg.get("border_ll"):
        borders.append([project(lon, lat, bbox) for lon, lat in cfg["border_ll"]])

    return {
        "id": region_id,
        "label": cfg.get("label", region_id),
        "source": "natural-earth-110m",
        "license": "public domain (Natural Earth)",
        "bbox": list(bbox),
        "lands": rings,
        "borders": borders,
        "cities": cities,
        "water": "#0A2434",
        "land": "#2A3A24" if region_id == "southasia" else "#1E3340",
        "landHi": "#3A4A34",
        "accent": "#D4A04A",
    }


def write_png_mask(region: dict, path: Path, size=512, relief=False):
    """Write a simple land mask / fake relief PNG without Pillow if needed."""
    try:
        from PIL import Image, ImageDraw, ImageFilter
    except ImportError:
        # Fallback: write a tiny PPM then skip — caller may still use JPG terrains
        path.parent.mkdir(parents=True, exist_ok=True)
        return False

    img = Image.new("L", (size, size), 0)
    draw = ImageDraw.Draw(img)
    for ring in region.get("lands") or []:
        pts = [(p[0] / 100.0 * (size - 1), p[1] / 100.0 * (size - 1)) for p in ring]
        if len(pts) >= 3:
            draw.polygon(pts, fill=210 if not relief else 180)

    if relief:
        # Soft height: blur land + add inland brightening
        img = img.filter(ImageFilter.GaussianBlur(radius=2.5))
        # Edge darken for coast cliff read
        edge = img.point(lambda v: 255 if v > 20 else 0).filter(ImageFilter.FIND_EDGES)
        edge = edge.point(lambda v: min(255, v * 2))
        img = Image.blend(img, Image.eval(edge, lambda v: 40 if v > 10 else 0), 0.35)
        # Convert to RGB parchment relief
        rgb = Image.merge(
            "RGB",
            (
                img.point(lambda v: int(40 + v * 0.55)),
                img.point(lambda v: int(34 + v * 0.48)),
                img.point(lambda v: int(24 + v * 0.35)),
            ),
        )
        path.parent.mkdir(parents=True, exist_ok=True)
        rgb.save(path, "PNG")
    else:
        path.parent.mkdir(parents=True, exist_ok=True)
        img.save(path, "PNG")
    return True


def write_meta(path: Path):
    meta = path.with_suffix(path.suffix + ".meta")
    if meta.exists():
        return
    import hashlib

    g = hashlib.md5(str(path.relative_to(ROOT)).encode()).hexdigest()
    # Textures need TextureImporter; JSON uses DefaultImporter
    if path.suffix.lower() in (".png", ".jpg", ".jpeg"):
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
            "    wrapU: 0\n"
            "    wrapV: 0\n"
            "    wrapW: 0\n"
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
    else:
        meta.write_text(
            "fileFormatVersion: 2\n"
            f"guid: {g}\n"
            "DefaultImporter:\n"
            "  externalObjects: {}\n"
            "  userData: \n"
            "  assetBundleName: \n"
            "  assetBundleVariant: \n"
        )


def main():
    ne = ensure_ne()
    geo_dir = OUT / "geo"
    relief_dir = OUT / "relief"
    mask_dir = OUT / "mask"
    for d in (geo_dir, relief_dir, mask_dir):
        d.mkdir(parents=True, exist_ok=True)

    # Ensure pillow
    try:
        import PIL  # noqa: F401
    except ImportError:
        import subprocess
        import sys

        subprocess.check_call([sys.executable, "-m", "pip", "install", "pillow", "-q"])

    for region_id, cfg in REGIONS.items():
        region = build_region(ne, region_id, cfg)
        path = geo_dir / f"{region_id}.json"
        path.write_text(json.dumps(region, indent=2))
        write_meta(path)
        write_png_mask(region, mask_dir / f"{region_id}.png", size=512 if cfg.get("hero") else 384)
        write_png_mask(
            region,
            relief_dir / f"{region_id}.png",
            size=768 if cfg.get("hero") else 512,
            relief=True,
        )
        write_meta(mask_dir / f"{region_id}.png")
        write_meta(relief_dir / f"{region_id}.png")
        n = len(region.get("lands") or [])
        pts = sum(len(r) for r in region.get("lands") or [])
        print(f"{region_id}: {n} rings, {pts} pts, cities={len(region.get('cities') or [])}")

    print(f"Wrote Natural Earth map assets → {OUT}")


if __name__ == "__main__":
    main()
