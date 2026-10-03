using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Text.RegularExpressions;
using Genesis.Data;
using UnityEngine;

namespace Genesis.Core
{
    /// <summary>
    /// Loads theater JSON exported from Expo src/data into StreamingAssets.
    /// JsonUtility cannot parse nested number arrays, so geo polygons use a light regex parse.
    /// </summary>
    public static class TheaterCatalogLoader
    {
        const string TheatersFolder = "Theaters";

        public static TheaterCatalog LoadCatalog()
        {
            var path = Path.Combine(Application.streamingAssetsPath, TheatersFolder, "catalog.json");
            // Android APK: File.Exists fails on jar StreamingAssets — diagnosis P1.1.
            var raw = StreamingAssetsIO.ReadAllText(path);
            if (string.IsNullOrWhiteSpace(raw))
            {
                Debug.LogError($"Missing or empty theater catalog at {path}");
                return new TheaterCatalog { sliceTheaterId = "hist-1947-radcliffe" };
            }

            try
            {

                var catalog = JsonUtility.FromJson<TheaterCatalog>(raw);
                if (catalog == null)
                {
                    Debug.LogError($"Malformed theater catalog at {path}");
                    return new TheaterCatalog { sliceTheaterId = "hist-1947-radcliffe" };
                }

                if (string.IsNullOrEmpty(catalog.sliceTheaterId))
                {
                    catalog.sliceTheaterId = "hist-1947-radcliffe";
                }

                catalog.theaters ??= new List<TheaterCatalogEntry>();
                return catalog;
            }
            catch (Exception ex)
            {
                Debug.LogError($"Failed to load theater catalog: {ex.Message}");
                return new TheaterCatalog { sliceTheaterId = "hist-1947-radcliffe" };
            }
        }

        public static TheaterBundle LoadTheater(string theaterId)
        {
            if (string.IsNullOrEmpty(theaterId))
            {
                theaterId = "hist-1947-radcliffe";
            }

            var catalog = LoadCatalog();
            var entry = catalog.theaters?.Find(t => t.id == theaterId);
            var file = entry?.file ?? $"{theaterId}.json";
            var path = Path.Combine(Application.streamingAssetsPath, TheatersFolder, file);
            var raw = StreamingAssetsIO.ReadAllText(path);
            if (string.IsNullOrWhiteSpace(raw))
            {
                throw new FileNotFoundException($"Theater JSON not found or empty: {path}");
            }

            var bundle = JsonUtility.FromJson<TheaterBundle>(raw);
            if (bundle == null)
            {
                throw new InvalidOperationException($"Theater JSON failed to parse: {path}");
            }

            if (bundle.board != null && bundle.board.geo == null)
            {
                bundle.board.geo = new GeoData();
            }

            // ROOT CAUSE FIX: Theater JSON lacks geometry. We must load it from the regional geo JSON.
            // The regional file is specified by board.id or entry.terrainKey.
            var regionKey = bundle.board?.id ?? entry?.terrainKey ?? "southasia";
            var geoPath = Path.Combine(Application.streamingAssetsPath, "Maps", "geo", $"{regionKey}.json");
            var geoRaw = StreamingAssetsIO.ReadAllText(geoPath);

            if (!string.IsNullOrWhiteSpace(geoRaw) && bundle.board != null)
            {
                bundle.board.geo ??= new GeoData();
                bundle.board.geo.bbox = ParseFloatArray(geoRaw, "bbox");
                bundle.board.geo.lands = ParseRings(geoRaw, "lands");
                bundle.board.geo.borders = ParseRings(geoRaw, "borders");
                bundle.board.geo.rivers = ParseRings(geoRaw, "rivers");
                if (bundle.board.geo.cities == null || bundle.board.geo.cities.Count == 0)
                {
                    bundle.board.geo.cities = ParseCities(geoRaw);
                }
            }

            NormalizeOrders(bundle);
            return bundle;
        }

        public static TheaterBundle LoadSliceTheater()
        {
            var catalog = LoadCatalog();
            var id = string.IsNullOrEmpty(catalog.sliceTheaterId)
                ? "hist-1947-radcliffe"
                : catalog.sliceTheaterId;
            return LoadTheater(id);
        }

        static void NormalizeOrders(TheaterBundle bundle)
        {
            if (bundle?.scenario?.beats == null) return;
            foreach (var beat in bundle.scenario.beats)
            {
                if (beat.choices == null) continue;
                foreach (var choice in beat.choices)
                {
                    if (string.IsNullOrEmpty(choice.callsign))
                    {
                        choice.callsign = DeriveCallsign(choice.label);
                    }

                    if (string.IsNullOrEmpty(choice.@short) && !string.IsNullOrEmpty(choice.shortName))
                    {
                        choice.@short = choice.shortName;
                    }

                    if (string.IsNullOrEmpty(choice.@short))
                    {
                        choice.@short = choice.callsign.Split(' ')[0];
                    }

                    if (string.IsNullOrEmpty(choice.kind))
                    {
                        choice.kind = "diplomatic";
                    }
                }
            }
        }

        static string DeriveCallsign(string label)
        {
            if (string.IsNullOrEmpty(label)) return "ORDER";
            var parts = label.Split(new[] { ' ', '-', '—' }, StringSplitOptions.RemoveEmptyEntries);
            if (parts.Length == 0) return "ORDER";
            if (parts.Length == 1) return parts[0].ToUpperInvariant();
            return $"{parts[0]} {parts[1]}".ToUpperInvariant();
        }

        static float[] ParseFloatArray(string raw, string field)
        {
            var match = Regex.Match(raw, $"\"{field}\"\\s*:\\s*\\[", RegexOptions.Multiline);
            if (!match.Success) return null;
            var body = ExtractBracket(raw, match.Index + match.Length - 1);
            if (string.IsNullOrEmpty(body)) return null;
            var parts = body.Split(new[] { ',', ' ', '\n', '\r', '\t' }, StringSplitOptions.RemoveEmptyEntries);
            var result = new float[parts.Length];
            for (var i = 0; i < parts.Length; i++)
            {
                if (float.TryParse(parts[i], NumberStyles.Float, CultureInfo.InvariantCulture, out var v))
                    result[i] = v;
            }
            return result;
        }

        static List<PolygonRing> ParseRings(string raw, string field)
        {
            var rings = new List<PolygonRing>();
            var fieldMatch = Regex.Match(raw, $"\"{field}\"\\s*:\\s*\\[", RegexOptions.Multiline);
            if (!fieldMatch.Success) return rings;

            var start = fieldMatch.Index + fieldMatch.Length - 1;
            var arrayBody = ExtractBracket(raw, start);
            if (arrayBody == null) return rings;

            // Each ring is [ [x,y], ... ]
            foreach (Match ringMatch in Regex.Matches(arrayBody, @"\[\s*(?:\[[^\]]+\]\s*,?\s*)+\]"))
            {
                var ring = new PolygonRing();
                foreach (Match pt in Regex.Matches(ringMatch.Value, @"\[\s*([0-9.]+)\s*,\s*([0-9.]+)\s*\]"))
                {
                    if (float.TryParse(pt.Groups[1].Value, NumberStyles.Float, CultureInfo.InvariantCulture, out var x) &&
                        float.TryParse(pt.Groups[2].Value, NumberStyles.Float, CultureInfo.InvariantCulture, out var y))
                    {
                        ring.points.Add(new Vector2(x, y));
                    }
                }

                if (ring.points.Count >= 3) rings.Add(ring);
            }

            return rings;
        }

        static List<GeoCity> ParseCities(string raw)
        {
            var cities = new List<GeoCity>();
            foreach (Match m in Regex.Matches(
                         raw,
                         "\"name\"\\s*:\\s*\"([^\"]+)\"\\s*,\\s*\"x\"\\s*:\\s*([0-9.]+)\\s*,\\s*\"y\"\\s*:\\s*([0-9.]+)"))
            {
                cities.Add(new GeoCity
                {
                    name = m.Groups[1].Value,
                    x = float.Parse(m.Groups[2].Value, CultureInfo.InvariantCulture),
                    y = float.Parse(m.Groups[3].Value, CultureInfo.InvariantCulture)
                });
            }

            return cities;
        }

        static string ExtractBracket(string src, int openIndex)
        {
            if (openIndex < 0 || openIndex >= src.Length || src[openIndex] != '[') return null;
            var depth = 0;
            for (var i = openIndex; i < src.Length; i++)
            {
                if (src[i] == '[') depth++;
                else if (src[i] == ']')
                {
                    depth--;
                    if (depth == 0) return src.Substring(openIndex + 1, i - openIndex - 1);
                }
            }

            return null;
        }
    }
}
