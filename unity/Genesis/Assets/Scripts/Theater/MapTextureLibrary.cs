using System.Collections.Generic;
using System.IO;
using Genesis.Core;
using UnityEngine;

namespace Genesis.Theater
{
    /// <summary>
    /// Loads public-domain / Expo terrain + Natural Earth relief from StreamingAssets/Maps.
    /// Runtime Texture2D — URP Lit base map only (no Built-in).
    /// P1.1: Android jar StreamingAssets via <see cref="StreamingAssetsIO"/>.
    /// </summary>
    public static class MapTextureLibrary
    {
        static readonly Dictionary<string, Texture2D> Cache = new();

        /// <summary>Known relief stems — avoids File.Exists probes that fail inside Android APKs.</summary>
        static readonly HashSet<string> KnownRegions = new(System.StringComparer.OrdinalIgnoreCase)
        {
            "afghanistan", "anatolia", "atlantic-finance", "berlin", "black-sea",
            "caribbean", "china-east", "europe-central", "europe-east", "europe-west",
            "gulf", "korea", "levant", "maghreb-east", "manchuria",
            "pacific-hawaii", "pacific-japan", "poland-corridor", "russia-west",
            "se-asia", "southasia", "suez", "world-hubs",
        };

        public static Texture2D LoadTerrainAlbedo(string terrainKey)
        {
            if (string.IsNullOrEmpty(terrainKey)) terrainKey = "europe";
            var key = $"terrain:{terrainKey}";
            if (Cache.TryGetValue(key, out var cached) && cached != null) return cached;

            var path = Path.Combine(Application.streamingAssetsPath, "Maps", "terrain",
                $"terrain_{terrainKey}.jpg");
            var tex = LoadFile(path);
            if (tex == null)
            {
                // Fallback: try common terrain keys (Directory.GetFiles fails on Android jar).
                foreach (var fallback in new[]
                         {
                             "southasia", "europe", "pacific", "gulf", "americas",
                             "markets", "arctic", "redsea", "sahel",
                         })
                {
                    if (fallback == terrainKey) continue;
                    var alt = Path.Combine(Application.streamingAssetsPath, "Maps", "terrain",
                        $"terrain_{fallback}.jpg");
                    tex = LoadFile(alt);
                    if (tex != null) break;
                }
            }

            if (tex != null) Cache[key] = tex;
            return tex;
        }

        public static Texture2D LoadRelief(string regionOrTerrainKey, string theaterId = null)
        {
            var resolved = ResolveRegionKey(theaterId, regionOrTerrainKey);
            if (string.IsNullOrEmpty(resolved)) return null;
            var key = $"relief:{resolved}";
            if (Cache.TryGetValue(key, out var cached) && cached != null) return cached;

            var path = Path.Combine(Application.streamingAssetsPath, "Maps", "relief", $"{resolved}.png");
            var tex = LoadFile(path);
            if (tex != null) Cache[key] = tex;
            return tex;
        }

        /// <summary>
        /// Geo-aligned NASA Blue Marble crop for a region (StreamingAssets/Maps/realistic).
        /// Preferred albedo for theater boards and UI previews.
        /// </summary>
        public static Texture2D LoadRealistic(string regionOrTerrainKey, string theaterId = null)
        {
            var resolved = ResolveRegionKey(theaterId, regionOrTerrainKey);
            if (string.IsNullOrEmpty(resolved)) return null;
            var key = $"realistic:{resolved}";
            if (Cache.TryGetValue(key, out var cached) && cached != null) return cached;

            var path = Path.Combine(Application.streamingAssetsPath, "Maps", "realistic",
                $"{resolved}.jpg");
            var tex = LoadFile(path);
            if (tex != null) Cache[key] = tex;
            return tex;
        }

        /// <summary>
        /// Cartographic preview for Atlas cards / Main Menu / Results.
        /// Prefers NASA Blue Marble region crops; falls back to hypsometric bake.
        /// </summary>
        public static Texture2D LoadUiMapPreview(string theaterId, string regionOrTerrainKey = null,
            int size = 512)
        {
            var resolved = ResolveRegionKey(theaterId, regionOrTerrainKey);
            if (string.IsNullOrEmpty(resolved)) return null;

            size = Mathf.Clamp(size, 160, 768);
            var key = $"uipreview:{resolved}:{size}";
            if (Cache.TryGetValue(key, out var cached) && cached != null) return cached;

            // Prefer geo-aligned satellite crop — already square and board-UV matched.
            var realistic = LoadRealistic(resolved, theaterId);
            if (realistic != null)
            {
                Cache[key] = realistic;
                return realistic;
            }

            var relief  = LoadRelief(resolved, theaterId);
            var mask    = LoadMask(resolved, theaterId);
            var terrain = LoadTerrainAlbedo(RegionToTerrainKey(resolved));
            var baked   = BakeUiMapPreview(relief, mask, terrain, size, resolved);
            if (baked != null)
            {
                Cache[key] = baked;
                return baked;
            }

            return relief ?? terrain;
        }

        static string RegionToTerrainKey(string region)
        {
            return (region ?? "").ToLowerInvariant() switch
            {
                "manchuria" or "korea" or "china-east" or "pacific-japan"
                    or "pacific-hawaii" or "se-asia" => "pacific",
                "southasia" or "afghanistan" => "southasia",
                "gulf" or "levant" or "suez" or "anatolia" => "gulf",
                "maghreb-east" => "redsea",
                "caribbean" => "americas",
                "atlantic-finance" or "world-hubs" => "markets",
                "europe-central" or "europe-east" or "europe-west"
                    or "berlin" or "poland-corridor" or "russia-west"
                    or "black-sea" => "europe",
                _ => "europe"
            };
        }

        static Texture2D BakeUiMapPreview(Texture2D relief, Texture2D mask, Texture2D terrain,
            int size, string nameStem)
        {
            if (relief == null && mask == null && terrain == null) return null;

            Color32[] rPix = null, mPix = null, tPix = null;
            int rw = 1, rh = 1, mw = 1, mh = 1, tw = 1, th = 1;
            try
            {
                if (relief != null)  { rPix = relief.GetPixels32();  rw = relief.width;  rh = relief.height; }
                if (mask != null)    { mPix = mask.GetPixels32();    mw = mask.width;    mh = mask.height; }
                if (terrain != null) { tPix = terrain.GetPixels32(); tw = terrain.width; th = terrain.height; }
            }
            catch
            {
                return null;
            }

            var dst = new Texture2D(size, size, TextureFormat.RGB24, mipChain: true);
            var outPix = new Color32[size * size];

            // Cabinet hypsometric tints (land) + deep ink basin (water).
            var waterDeep = new Color(0.035f, 0.07f, 0.12f);
            var waterShallow = new Color(0.08f, 0.16f, 0.24f);
            var landLow = new Color(0.42f, 0.48f, 0.32f);
            var landMid = new Color(0.62f, 0.55f, 0.36f);
            var landHigh = new Color(0.82f, 0.76f, 0.58f);
            var landPeak = new Color(0.92f, 0.90f, 0.84f);
            var parchment = new Color(0.78f, 0.70f, 0.52f);

            for (int y = 0; y < size; y++)
            {
                float v = (y + 0.5f) / size;
                for (int x = 0; x < size; x++)
                {
                    float u = (x + 0.5f) / size;

                    float h = rPix != null ? SampleLuma(rPix, rw, rh, u, v) : 0.45f;
                    float land = mPix != null
                        ? SampleLuma(mPix, mw, mh, u, v)
                        : Mathf.SmoothStep(0.22f, 0.48f, h);

                    // Soft coast falloff — crisp enough to read geography.
                    land = Mathf.SmoothStep(0.28f, 0.62f, land);

                    Color water = Color.Lerp(waterDeep, waterShallow, Mathf.Clamp01(h * 1.2f));
                    // Subtle wave grain from terrain tile on water.
                    if (tPix != null)
                    {
                        float g = SampleLuma(tPix, tw, th, u * 2.1f, v * 2.1f);
                        water = Color.Lerp(water, water * (0.85f + g * 0.3f), 0.35f);
                    }

                    Color elev = h < 0.35f ? Color.Lerp(landLow, landMid, h / 0.35f)
                        : h < 0.65f ? Color.Lerp(landMid, landHigh, (h - 0.35f) / 0.3f)
                        : Color.Lerp(landHigh, landPeak, (h - 0.65f) / 0.35f);

                    // Blend parchment + terrain grain so land feels material, not flat fill.
                    Color landCol = Color.Lerp(elev, parchment, 0.22f);
                    if (tPix != null)
                    {
                        Color grain = SampleColor(tPix, tw, th, u, v);
                        landCol = Color.Lerp(landCol, landCol * (0.55f + grain.g * 0.7f), 0.4f);
                    }

                    // Hillshade from relief neighbors for depth.
                    float hx = rPix != null
                        ? SampleLuma(rPix, rw, rh, u + 1.5f / size, v)
                          - SampleLuma(rPix, rw, rh, u - 1.5f / size, v)
                        : 0f;
                    float hy = rPix != null
                        ? SampleLuma(rPix, rw, rh, u, v + 1.5f / size)
                          - SampleLuma(rPix, rw, rh, u, v - 1.5f / size)
                        : 0f;
                    float shade = Mathf.Clamp01(0.55f + (-hx * 1.8f + hy * 1.1f) * 1.6f);
                    landCol *= Mathf.Lerp(0.72f, 1.12f, shade);

                    Color c = Color.Lerp(water, landCol, land);

                    // Soft vignette — desk-lamp focus, not a heavy letterbox.
                    float dx = u - 0.5f, dy = v - 0.5f;
                    float vig = 1f - Mathf.Clamp01((dx * dx + dy * dy) * 1.55f) * 0.28f;
                    c *= vig;

                    // Warm cabinet grade.
                    c.r = Mathf.Clamp01(c.r * 1.04f + 0.01f);
                    c.b = Mathf.Clamp01(c.b * 0.94f);

                    outPix[y * size + x] = (Color32)c;
                }
            }

            dst.SetPixels32(outPix);
            dst.Apply(true, true);
            dst.name = (nameStem ?? "map") + "_ui";
            ApplyMapSampling(dst, linear: false);
            return dst;
        }

        static float SampleLuma(Color32[] pix, int w, int h, float u, float v)
        {
            u = Mathf.Repeat(u, 1f);
            v = Mathf.Clamp01(v);
            int x = Mathf.Clamp(Mathf.FloorToInt(u * (w - 1)), 0, w - 1);
            int y = Mathf.Clamp(Mathf.FloorToInt(v * (h - 1)), 0, h - 1);
            var c = pix[y * w + x];
            return (c.r + c.g + c.b) / (3f * 255f);
        }

        static Color SampleColor(Color32[] pix, int w, int h, float u, float v)
        {
            u = Mathf.Repeat(u, 1f);
            v = Mathf.Clamp01(v);
            int x = Mathf.Clamp(Mathf.FloorToInt(u * (w - 1)), 0, w - 1);
            int y = Mathf.Clamp(Mathf.FloorToInt(v * (h - 1)), 0, h - 1);
            return pix[y * w + x];
        }

        /// <summary>
        /// Land silhouette masks (StreamingAssets/Maps/mask) — previously dead inventory.
        /// Used for coast/foam alpha and land silhouette crispness.
        /// </summary>
        public static Texture2D LoadMask(string regionOrTerrainKey, string theaterId = null)
        {
            var resolved = ResolveRegionKey(theaterId, regionOrTerrainKey);
            if (string.IsNullOrEmpty(resolved)) return null;
            var key = $"mask:{resolved}";
            if (Cache.TryGetValue(key, out var cached) && cached != null) return cached;

            var path = Path.Combine(Application.streamingAssetsPath, "Maps", "mask", $"{resolved}.png");
            var tex = LoadFile(path);
            if (tex != null) Cache[key] = tex;
            return tex;
        }

        /// <summary>
        /// Map any theater / terrain / relief key onto a StreamingAssets region PNG stem.
        /// Phase 1 finish applies to all 32 desks — prefer per-theater geography over coarse terrain buckets.
        /// </summary>
        public static string ResolveRegionKey(string theaterId, string regionOrTerrainKey)
        {
            if (!string.IsNullOrEmpty(theaterId))
            {
                var byTheater = TheaterToRegion(theaterId);
                if (!string.IsNullOrEmpty(byTheater)) return byTheater;
            }

            if (!string.IsNullOrEmpty(regionOrTerrainKey))
            {
                if (IsKnownRegion(regionOrTerrainKey)) return regionOrTerrainKey;
                var mapped = TerrainToRegion(regionOrTerrainKey);
                if (IsKnownRegion(mapped)) return mapped;
                return mapped;
            }

            return "europe-central";
        }

        static bool IsKnownRegion(string key)
        {
            if (string.IsNullOrEmpty(key)) return false;
            if (KnownRegions.Contains(key)) return true;
            var relief = Path.Combine(Application.streamingAssetsPath, "Maps", "relief", $"{key}.png");
            return StreamingAssetsIO.Exists(relief);
        }

        static string TheaterToRegion(string theaterId)
        {
            return theaterId switch
            {
                "hist-1905-port-arthur" => "manchuria",
                "hist-1914-july-wire" => "europe-central",
                "hist-1917-balfour" => "levant",
                "hist-1917-petrograd" => "russia-west",
                "hist-1919-versailles" => "europe-west",
                "hist-1920-anatolia" => "anatolia",
                "hist-1929-black-thursday" => "atlantic-finance",
                "hist-1931-mukden" => "manchuria",
                "hist-1938-munich" => "europe-central",
                "hist-1939-corridor" => "poland-corridor",
                "hist-1941-pacific-entry" => "pacific-hawaii",
                "hist-1945-trinity" => "pacific-japan",
                "hist-1947-radcliffe" => "southasia",
                "hist-1948-marshall" => "europe-west",
                "hist-1948-two-koreas" => "korea",
                "hist-1949-october" => "china-east",
                "hist-1950-korea" => "korea",
                "hist-1956-suez" => "suez",
                "hist-1962-cuba" => "caribbean",
                "hist-1968-prague" => "europe-central",
                "hist-1973-oil" => "gulf",
                "hist-1979-persian-pivot" => "gulf",
                "hist-1989-wall" => "berlin",
                "hist-1991-union-end" => "russia-west",
                "hist-1997-contagion" => "se-asia",
                "hist-2001-enduring" => "afghanistan",
                "hist-2008-lehman" => "atlantic-finance",
                "hist-2011-squares" => "maghreb-east",
                "hist-2014-crimea" => "black-sea",
                "hist-2020-lockdown" => "world-hubs",
                "hist-2024-hormuz-relapse" => "gulf",
                "hist-2025-coalition-aftershock" => "europe-central",
                _ => null
            };
        }

        /// <summary>
        /// Derive a tangent-space normal from a soft relief/height PNG for URP Lit _BumpMap.
        /// Cached per source texture instance.
        /// </summary>
        public static Texture2D ReliefToNormal(Texture2D relief, float strength = 2.4f)
        {
            if (relief == null) return null;
            var key = $"normal:{relief.name}:{System.Runtime.CompilerServices.RuntimeHelpers.GetHashCode(relief)}:{strength:F1}";
            if (Cache.TryGetValue(key, out var cached) && cached != null) return cached;

            var w = relief.width;
            var h = relief.height;
            if (w < 2 || h < 2) return null;

            Color32[] src;
            try { src = relief.GetPixels32(); }
            catch
            {
                // Non-readable — skip normal bake.
                return null;
            }

            var dst = new Texture2D(w, h, TextureFormat.RGBA32, true, true);
            var pixels = new Color32[w * h];
            for (var y = 0; y < h; y++)
            {
                for (var x = 0; x < w; x++)
                {
                    var l = HeightAt(src, w, h, x - 1, y);
                    var r = HeightAt(src, w, h, x + 1, y);
                    var d = HeightAt(src, w, h, x, y - 1);
                    var u = HeightAt(src, w, h, x, y + 1);
                    var dx = (l - r) * strength;
                    var dy = (d - u) * strength;
                    var n = new Vector3(dx, dy, 1f).normalized;
                    pixels[y * w + x] = new Color32(
                        (byte)Mathf.Clamp(Mathf.RoundToInt((n.x * 0.5f + 0.5f) * 255f), 0, 255),
                        (byte)Mathf.Clamp(Mathf.RoundToInt((n.y * 0.5f + 0.5f) * 255f), 0, 255),
                        (byte)Mathf.Clamp(Mathf.RoundToInt((n.z * 0.5f + 0.5f) * 255f), 0, 255),
                        255);
                }
            }

            dst.SetPixels32(pixels);
            dst.Apply(true, true);
            dst.name = (relief.name ?? "relief") + "_N";
            ApplyMapSampling(dst, linear: true);
            Cache[key] = dst;
            return dst;
        }

        static float HeightAt(Color32[] src, int w, int h, int x, int y)
        {
            x = Mathf.Clamp(x, 0, w - 1);
            y = Mathf.Clamp(y, 0, h - 1);
            var c = src[y * w + x];
            return (c.r + c.g + c.b) / (3f * 255f);
        }

        static string TerrainToRegion(string terrainKey)
        {
            return terrainKey switch
            {
                "southasia" => "southasia",
                "americas" => "caribbean",
                "pacific" => "korea",
                "gulf" => "gulf",
                "redsea" => "suez",
                "sahel" => "afghanistan",
                "markets" => "atlantic-finance",
                "arctic" => "europe-central",
                "europe" => "europe-central",
                _ => terrainKey
            };
        }

        static Texture2D LoadFile(string path)
        {
            if (string.IsNullOrEmpty(path)) return null;
            try
            {
                var bytes = StreamingAssetsIO.ReadAllBytes(path);
                if (bytes == null || bytes.Length == 0) return null;

                var tex = new Texture2D(2, 2, TextureFormat.RGBA32, mipChain: true);
                if (!tex.LoadImage(bytes))
                {
                    Object.Destroy(tex);
                    return null;
                }

                tex.name = Path.GetFileNameWithoutExtension(path);
                ApplyMapSampling(tex, linear: false);
                return tex;
            }
            catch (System.Exception ex)
            {
                Debug.LogWarning($"[Genesis] Map texture load failed ({path}): {ex.Message}");
                return null;
            }
        }

        /// <summary>
        /// SOTA sampling: trilinear + high aniso + slight negative mip bias.
        /// No artificial max-size ceiling — keep native decode resolution (now 2K StreamingAssets).
        /// </summary>
        static void ApplyMapSampling(Texture2D tex, bool linear)
        {
            if (tex == null) return;
            tex.wrapMode = TextureWrapMode.Clamp;
            tex.filterMode = FilterMode.Trilinear;
            tex.anisoLevel = 8;
            tex.mipMapBias = -0.5f;
            if (linear) { /* normals already linear via Texture2D ctor */ }
        }
    }
}
