using System;
using System.Collections.Generic;
using System.IO;
using UnityEngine;
using Genesis.Core;

namespace Genesis.Atlas
{
    // ─── Schema classes (JsonUtility serialisable) ───────────────────────────

    [Serializable]
    public class GazetteerPlace
    {
        public string markerId;
        public string label;
        public float  lat;
        public float  lon;
        public string kind; // "capital", "flashpoint", "hotspot", etc.
    }

    [Serializable]
    public class GazetteerCountry
    {
        public string name;
        public float  lat;
        public float  lon;
    }

    [Serializable]
    public class GazetteerExtraCity
    {
        public string label;
        public float  lat;
        public float  lon;
    }

    [Serializable]
    class GazetteerTheaterEntry
    {
        public string theaterId;
        public List<GazetteerPlace>     places      = new();
        public List<GazetteerCountry>   countries   = new();
        public List<GazetteerExtraCity> extraCities = new();
    }

    [Serializable]
    class GazetteerRoot
    {
        public List<GazetteerTheaterEntry> theaters = new();
    }

    // ─── Learn sidecar schema ────────────────────────────────────────────────

    [Serializable]
    class PlaceFactEntry
    {
        public string markerId;
        public string fact;
    }

    [Serializable]
    class BeatHistoryEntry
    {
        public string beatId;
        public string history;
    }

    [Serializable]
    public class FieldBrief
    {
        public string beatId;
        public string markerId;
        public string headline;
        public string fact;
    }

    [Serializable]
    public class StoryLinePoint
    {
        public float lat;
        public float lon;
    }

    [Serializable]
    public class StoryLine
    {
        public string       id;
        public string       label;
        public List<string> beatIds = new();
        public string       color;
        public List<StoryLinePoint> points = new();
    }

    [Serializable]
    class LearnData
    {
        public string theaterId;
        public string regionName;
        public List<PlaceFactEntry>  placeFacts  = new();
        public List<BeatHistoryEntry> beatHistory = new();
        public List<FieldBrief>      fieldBriefs = new();
        public List<StoryLine>       storyLines  = new();
    }

    // ─── Public API ──────────────────────────────────────────────────────────

    /// <summary>
    /// Per-theater view over gazetteer + learn sidecar data.
    /// Loaded once and cached by <see cref="AtlasContent.ForTheater"/>.
    /// All lookups are O(n) on small lists — safe for runtime.
    /// </summary>
    public sealed class AtlasTheaterContent
    {
        readonly GazetteerTheaterEntry _gaz;
        readonly LearnData             _learn;

        static readonly IReadOnlyList<GazetteerPlace>    _emptyPlaces      = new List<GazetteerPlace>();
        static readonly IReadOnlyList<GazetteerCountry>   _emptyCountries   = new List<GazetteerCountry>();
        static readonly IReadOnlyList<GazetteerExtraCity> _emptyExtraCities = new List<GazetteerExtraCity>();
        static readonly IReadOnlyList<StoryLine>          _emptyStoryLines  = new List<StoryLine>();

        // ── Exposed collections ──────────────────────────────────────────────

        /// <summary>All named places (flashpoints, capitals, hotspots) for this theater from the gazetteer.</summary>
        public IReadOnlyList<GazetteerPlace> Places =>
            (_gaz?.places != null && _gaz.places.Count > 0)
                ? _gaz.places
                : _emptyPlaces;

        public string RegionName =>
            !string.IsNullOrEmpty(_learn?.regionName) ? _learn.regionName : "";

        public IReadOnlyList<GazetteerCountry> Countries =>
            (_gaz?.countries != null && _gaz.countries.Count > 0)
                ? _gaz.countries
                : _emptyCountries;

        public IReadOnlyList<GazetteerExtraCity> ExtraCities =>
            (_gaz?.extraCities != null && _gaz.extraCities.Count > 0)
                ? _gaz.extraCities
                : _emptyExtraCities;

        // ── Lookups ──────────────────────────────────────────────────────────

        /// <summary>Returns the gazetteer place for a given marker ID, if present.</summary>
        public bool TryGetPlace(string markerId, out GazetteerPlace place)
        {
            place = null;
            if (_gaz?.places == null || string.IsNullOrEmpty(markerId)) return false;
            foreach (var p in _gaz.places)
            {
                if (string.Equals(p.markerId, markerId, StringComparison.OrdinalIgnoreCase))
                {
                    place = p;
                    return true;
                }
            }
            return false;
        }

        /// <summary>Returns a place fact for the marker, or empty string.</summary>
        public string FactFor(string markerId)
        {
            if (_learn?.placeFacts == null || string.IsNullOrEmpty(markerId)) return "";
            foreach (var e in _learn.placeFacts)
            {
                if (string.Equals(e.markerId, markerId, StringComparison.OrdinalIgnoreCase))
                    return e.fact ?? "";
            }
            return "";
        }

        /// <summary>Returns the "In history" text for a beat, or empty string.</summary>
        public string HistoryFor(string beatId)
        {
            if (_learn?.beatHistory == null || string.IsNullOrEmpty(beatId)) return "";
            foreach (var e in _learn.beatHistory)
            {
                if (string.Equals(e.beatId, beatId, StringComparison.OrdinalIgnoreCase))
                    return e.history ?? "";
            }
            return "";
        }

        /// <summary>Returns the field brief (headline + fact) for a beat, or null.</summary>
        public FieldBrief BriefFor(string beatId)
        {
            if (_learn?.fieldBriefs == null || string.IsNullOrEmpty(beatId)) return null;
            foreach (var b in _learn.fieldBriefs)
            {
                if (string.Equals(b.beatId, beatId, StringComparison.OrdinalIgnoreCase))
                    return b;
            }
            return null;
        }

        /// <summary>All story lines in this theater (regardless of beat). Useful for border/polyline fallbacks.</summary>
        public IReadOnlyList<StoryLine> AllStoryLines =>
            (_learn?.storyLines != null && _learn.storyLines.Count > 0)
                ? _learn.storyLines
                : _emptyStoryLines;

        /// <summary>Returns all story lines whose beatIds include the given beat.</summary>
        public IReadOnlyList<StoryLine> StoryLinesFor(string beatId)
        {
            if (_learn?.storyLines == null || string.IsNullOrEmpty(beatId))
                return _emptyStoryLines;
            var result = new List<StoryLine>();
            foreach (var sl in _learn.storyLines)
            {
                if (sl.beatIds == null) continue;
                foreach (var bid in sl.beatIds)
                {
                    if (string.Equals(bid, beatId, StringComparison.OrdinalIgnoreCase))
                    {
                        result.Add(sl);
                        break;
                    }
                }
            }
            return result;
        }

        // ── Internal construction ────────────────────────────────────────────

        internal AtlasTheaterContent(string theaterId)
        {
            _gaz   = LoadGazetteerEntry(theaterId);
            _learn = LoadLearnData(theaterId);
        }

        static GazetteerTheaterEntry LoadGazetteerEntry(string theaterId)
        {
            var path = Path.Combine(Application.streamingAssetsPath, "Atlas", "gazetteer.json");
            var raw  = StreamingAssetsIO.ReadAllText(path);
            if (string.IsNullOrWhiteSpace(raw)) return null;
            try
            {
                var root = JsonUtility.FromJson<GazetteerRoot>(raw);
                if (root?.theaters == null) return null;
                foreach (var entry in root.theaters)
                {
                    if (string.Equals(entry.theaterId, theaterId, StringComparison.OrdinalIgnoreCase))
                        return entry;
                }
            }
            catch (Exception ex)
            {
                Debug.LogWarning($"[Atlas] Failed to parse gazetteer: {ex.Message}");
            }
            return null;
        }

        static LearnData LoadLearnData(string theaterId)
        {
            var path = Path.Combine(
                Application.streamingAssetsPath, "Atlas", "learn", $"{theaterId}.json");
            var raw  = StreamingAssetsIO.ReadAllText(path);
            if (string.IsNullOrWhiteSpace(raw)) return null;
            try
            {
                return JsonUtility.FromJson<LearnData>(raw);
            }
            catch (Exception ex)
            {
                Debug.LogWarning($"[Atlas] Failed to parse learn/{theaterId}.json: {ex.Message}");
                return null;
            }
        }
    }

    // ─── Entry-point ─────────────────────────────────────────────────────────

    /// <summary>
    /// Static cache + factory for <see cref="AtlasTheaterContent"/>.
    /// Thread-safe for read-only access after initial load (main-thread load, then cached).
    /// </summary>
    public static class AtlasContent
    {
        static readonly Dictionary<string, AtlasTheaterContent> Cache = new();

        /// <summary>
        /// Returns the content object for a theater (loads and caches on first call).
        /// Gracefully returns an empty content if the sidecar files are missing.
        /// </summary>
        public static AtlasTheaterContent ForTheater(string theaterId)
        {
            if (string.IsNullOrEmpty(theaterId))
                theaterId = "hist-1947-radcliffe";

            if (Cache.TryGetValue(theaterId, out var cached))
                return cached;

            var content = new AtlasTheaterContent(theaterId);
            Cache[theaterId] = content;
            return content;
        }

        /// <summary>Clears the in-memory cache (call between scenes if needed).</summary>
        public static void ClearCache() => Cache.Clear();
    }
}
