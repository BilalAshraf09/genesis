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
