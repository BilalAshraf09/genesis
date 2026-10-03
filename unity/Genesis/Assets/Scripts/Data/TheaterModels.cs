using System;
using System.Collections.Generic;
using UnityEngine;

namespace Genesis.Data
{
    [Serializable]
    public class TheaterCatalog
    {
        public string unityVersion;
        public string sliceTheaterId;
        public int theaterCount;
        public List<TheaterCatalogEntry> theaters = new();
    }

    [Serializable]
    public class TheaterCatalogEntry
    {
        public string id;
        public string title;
        public int year;
        public string era;
        public string region;
        public string archetype;
        public string file;
        public string terrainKey;
        public bool free;
    }

    [Serializable]
    public class TheaterBundle
    {
        public ScenarioData scenario;
        public BoardData board;
    }

    [Serializable]
    public class ScenarioData
    {
        public string id;
        public int year;
        public string era;
        public string title;
        public string region;
        public string meterFamily;
        public string theaterArchetype;
        public string premise;
        public string role;
        public string tension;
        public List<BeatData> beats = new();
    }

    [Serializable]
    public class BeatData
    {
        public string id;
        public string title;
        public string briefing;
        public string stakes;
        public List<OrderChoice> choices = new();
    }

    [Serializable]
    public class OrderChoice
    {
        public string id;
        public string label;
        public string detail;
        public string callsign;
        public string kind;
        public string markerId;
        public string shortName;
        public string @short;
        public List<ChoiceEffect> effects = new();

        public string ShortLabel => !string.IsNullOrEmpty(@short) ? @short : shortName;

        /// <summary>
        /// Ops-rail / EXECUTE display name. Repairs export-truncated callsigns like "PUBLISH THE".
        /// </summary>
        public string DisplayCallsign
        {
            get
            {
                var c = callsign?.Trim() ?? "";
                if (c.Length >= 4 && !LooksTruncatedCallsign(c))
                    return c.ToUpperInvariant();
                if (!string.IsNullOrEmpty(ShortLabel))
                    return ShortLabel.Trim().ToUpperInvariant();
                if (!string.IsNullOrEmpty(label))
                {
                    var words = label.Trim().Split(new[] { ' ' }, System.StringSplitOptions.RemoveEmptyEntries);
                    if (words.Length >= 2)
                        return $"{words[0]} {words[1]}".ToUpperInvariant();
                    if (words.Length == 1)
                        return words[0].ToUpperInvariant();
                }

                return string.IsNullOrEmpty(c) ? "ORDER" : c.ToUpperInvariant();
            }
        }

        static bool LooksTruncatedCallsign(string value)
        {
            var u = value.Trim().ToUpperInvariant();
            return u.EndsWith(" THE") || u.EndsWith(" A") || u.EndsWith(" AN") ||
                   u == "THE" || u == "A" || u == "AN";
        }
    }

    [Serializable]
    public class ChoiceEffect
    {
        public string tag;
        public int weight;
        public string summary;
    }

    [Serializable]
    public class BoardData
    {
        public string id;
        public string scenarioId;
        public string title;
        public string subtitle;
        public string water;
        public string land;
        public string landHi;
        public string accent;
        public string terrainKey;
        public List<MapMarker> markers = new();
        public List<Corridor> corridors = new();
        public List<MapZone> zones = new();
        public GeoData geo;
    }

    [Serializable]
    public class MapMarker
    {
        public string id;
        public string label;
        public float x;
        public float y;
        public string kind;
    }

    [Serializable]
    public class Corridor
    {
        public string from;
        public string to;
    }

    [Serializable]
    public class MapZone
    {
        public string id;
        public string label;
        public float x;
        public float y;
        public float w;
        public float h;
        public float tension;
    }

    [Serializable]
    public class GeoData
    {
        public string label;
        public string water;
        public string land;
        public string landHi;
        public string accent;
        public string source;
        public string terrainKey;
        public string reliefKey;
        public float[] bbox;
        public List<PolygonRing> lands = new();
        public List<PolygonRing> borders = new();
        public List<PolygonRing> rivers = new();
        public List<GeoCity> cities = new();
    }

    /// <summary>
    /// Unity JsonUtility cannot deserialize jagged float[][] — we store rings as
    /// sequential Vector2 after a custom parse step. Raw JSON keeps [[x,y],...].
    /// </summary>
    [Serializable]
    public class PolygonRing
    {
        public List<Vector2> points = new();
    }

    [Serializable]
    public class GeoCity
    {
        public string name;
        public float x;
        public float y;
    }
}
