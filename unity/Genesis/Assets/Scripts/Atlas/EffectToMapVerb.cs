using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using Genesis.Data;
using Genesis.Theater;

namespace Genesis.Atlas
{
    /// <summary>
    /// Stage 3.1 — Maps an <see cref="OrderChoice"/>'s effect tags / WorldVerb to
    /// <see cref="MapStoryFX"/> coroutines so executing an order visibly changes the real map.
    ///
    /// Tag → FX mapping (Night Atlas palette, no neon/bloom):
    ///   escalation          → PulseRings(red) + RegionTint(red)
    ///   civilian_cost/refugee → FlowArrows(amber/red) along corridor or StoryLine route
    ///   credibility/diplomacy → GoldArc between target pin and nearest capital
    ///   time                → ClockSweep on the pin
    ///   border StoryLine present → DrawLine of polyline (e.g. Radcliffe Line)
    ///   fallback            → PulseRings(amber) — always at least one visible FX
    ///
    /// All coroutines are started on <paramref name="mapFx"/> so that
    /// <see cref="MapStoryFX.Clear"/> cleanly stops them at the next execute.
    /// </summary>
    public static class EffectToMapVerb
    {
        // ── Night Atlas effect palette ─────────────────────────────────────────
        /// <summary>#D9534F — escalation / civilian cost.</summary>
        public static readonly Color EscalationRed  = new(0.851f, 0.325f, 0.306f, 1f);
        /// <summary>#E8A33D — refugee flow / signal amber.</summary>
        public static readonly Color RefugeeAmber   = new(0.910f, 0.639f, 0.239f, 1f);
        /// <summary>Warm parchment — historical border lines drawn on the map.</summary>
        public static readonly Color BorderCream    = new(0.930f, 0.882f, 0.784f, 1f);
        /// <summary>Fallback accent amber when no specific tag matched.</summary>
        public static readonly Color FallbackAmber  = MapStoryFX.AccentAmber;

        // ── FX durations (total PlayAll ≈ 1.5–2.5s) ──────────────────────────
        const float DurRegionTint = 2.2f;
        const float DurFlow       = 2.0f;
        const float DurArc        = 1.8f;
        const float DurDraw       = 2.5f;
        const float DurClock      = 1.6f;
        const float DurFallback   = 1.5f;

        // ── Tag fingerprints (lower-case; substring-matched) ──────────────────
        static readonly string[] EscalationTags = {
            "escalation", "escalate", "war", "conflict", "tension", "military" };
        static readonly string[] CivilianTags = {
            "civilian_cost", "civilian", "refugee", "displacement",
            "migration", "humanitarian", "population" };
        static readonly string[] DiplomacyTags = {
            "credibility", "diplomacy", "diplomatic", "recognition",
            "alliance", "legitimacy", "accord", "treaty" };
        static readonly string[] TimeTags = {
            "time", "delay", "tempo", "timeline", "deadline", "clock" };
        static readonly string[] BorderTags = {
            "border", "partition", "line", "demarcation",
            "division", "boundary", "radcliffe", "wall" };

        // ──────────────────────────────────────────────────────────────────────
        // Entry point
        // ──────────────────────────────────────────────────────────────────────

        /// <summary>
        /// Resolve and start all map FX for <paramref name="order"/> in parallel,
        /// with all coroutines running on <paramref name="mapFx"/> so that
        /// <see cref="MapStoryFX.Clear"/> stops them cleanly.
        /// Yields until the longest-running primary FX completes (~1.5–2.5 s total).
        /// </summary>
        public static IEnumerator PlayAll(
            OrderChoice          order,
            TheaterBoardBuilder  board,
            MapStoryFX           mapFx)
        {
            if (mapFx == null || board == null || order == null) yield break;

            var epicenter  = ResolveEpicenter(order, board);
            var content    = AtlasContent.ForTheater(board.TheaterId ?? "");
            var beatId     = ExtractBeatId(order.id);
            var storyLines = content.StoryLinesFor(beatId);

            // If no beat-specific storyLines, fall back to the full theater set
            // (the Radcliffe / Berlin Wall / Quarantine line should always be available).
            if (storyLines.Count == 0)
                storyLines = content.AllStoryLines;

            var tags             = GatherTags(order);
            float longestDur     = 0f;
            bool  anyFxPlayed    = false;

            // ── 1. Border / DrawLine ─────────────────────────────────────────
            // Highest visual priority: progressive line draw of historical border.
            bool hasBorderTag  = HasAny(tags, BorderTags);
            bool hasBorderLine = FindBorderStoryLine(storyLines, out var borderSL);

            if (hasBorderTag || hasBorderLine)
            {
                var pts = ProjectPolyline(borderSL, board);
                if (pts != null && pts.Count >= 2)
                {
                    // Red when combined with escalation; paper-white for calm border draws.
                    var lineColor = HasAny(tags, EscalationTags) ? EscalationRed : BorderCream;
                    mapFx.StartCoroutine(mapFx.DrawLine(pts, lineColor, DurDraw));
                    longestDur  = Mathf.Max(longestDur, DurDraw);
                    anyFxPlayed = true;
                }
            }

            // ── 2. Escalation: PulseRings + RegionTint ──────────────────────
            if (HasAny(tags, EscalationTags))
            {
                float tintRadius = board.Projection != null
                    ? board.Projection.BoardWidth * 0.20f
                    : 4.8f;
                mapFx.StartCoroutine(mapFx.PulseRings(epicenter, EscalationRed, 3));
                mapFx.StartCoroutine(mapFx.RegionTint(epicenter, tintRadius, EscalationRed, DurRegionTint));
                longestDur  = Mathf.Max(longestDur, DurRegionTint);
                anyFxPlayed = true;
            }

            // ── 3. Civilian cost / Refugee: FlowArrows ──────────────────────
            if (HasAny(tags, CivilianTags))
            {
                var (fromPt, toPt, arrowColor) =
                    ResolveFlowPoints(order, board, storyLines, epicenter);
                if ((fromPt - toPt).sqrMagnitude > 0.01f)
                {
                    mapFx.StartCoroutine(mapFx.FlowArrows(fromPt, toPt, arrowColor, DurFlow));
                    longestDur  = Mathf.Max(longestDur, DurFlow);
                    anyFxPlayed = true;
                }
            }

            // ── 4. Credibility / Diplomacy: GoldArc ─────────────────────────
            if (HasAny(tags, DiplomacyTags))
            {
                var otherPt = FindCapitalOrNearestOtherPin(epicenter, order, board, content);
                if ((otherPt - epicenter).sqrMagnitude > 0.01f)
                {
                    mapFx.StartCoroutine(mapFx.GoldArc(epicenter, otherPt, DurArc));
                    longestDur  = Mathf.Max(longestDur, DurArc);
                    anyFxPlayed = true;
                }
            }

            // ── 5. Time: ClockSweep ──────────────────────────────────────────
            if (HasAny(tags, TimeTags))
            {
                mapFx.StartCoroutine(mapFx.ClockSweep(epicenter, DurClock));
                longestDur  = Mathf.Max(longestDur, DurClock);
                anyFxPlayed = true;
            }

            // ── Fallback: always at least one visible FX ─────────────────────
            if (!anyFxPlayed)
            {
                var fallbackColor = DeriveColorFromVerb(order);
                mapFx.StartCoroutine(mapFx.PulseRings(epicenter, fallbackColor, 3));
                longestDur = Mathf.Max(longestDur, DurFallback);
            }

            // Wait for longest-running FX (frame-accurate, no WaitForSeconds alloc)
            float elapsed = 0f;
            while (elapsed < longestDur)
            {
                elapsed += Time.deltaTime;
                yield return null;
            }
        }

        // ──────────────────────────────────────────────────────────────────────
        // Helpers
        // ──────────────────────────────────────────────────────────────────────

        static Vector3 ResolveEpicenter(OrderChoice order, TheaterBoardBuilder board)
        {
            if (!string.IsNullOrEmpty(order.markerId) &&
                board.Hotspots != null &&
                board.Hotspots.TryGetValue(order.markerId, out var hs) &&
                hs != null)
            {
                return hs.transform.position;
            }
            return Vector3.zero;
        }

        /// <summary>
        /// Extract "beat-01" from "beat-01-hold-date" so we can look up StoryLines.
        /// Handles patterns: "beat-01-...", "beat01-...", "phase1-beat2-...".
        /// </summary>
        static string ExtractBeatId(string orderId)
        {
            if (string.IsNullOrEmpty(orderId)) return "";
            var parts = orderId.Split('-');
            // Pattern "beat-01-..." → "beat-01"
            if (parts.Length >= 2 &&
                parts[0].ToLowerInvariant().StartsWith("beat"))
            {
                // Check if second part looks like a number
                if (int.TryParse(parts[1], out _))
                    return $"{parts[0]}-{parts[1]}";
            }
            // Fallback: first segment alone (e.g. "beat01")
            if (parts.Length >= 1 && parts[0].ToLowerInvariant().StartsWith("beat"))
                return parts[0];
            // Give up — return original id; StoryLinesFor will return empty gracefully
            return orderId;
        }

        /// <summary>
        /// Collect all lower-case tag strings from effects, order.kind, and order.label.
        /// </summary>
        static List<string> GatherTags(OrderChoice order)
        {
            var result = new List<string>();
            if (order.effects != null)
            {
                foreach (var e in order.effects)
                    if (!string.IsNullOrEmpty(e.tag))
                        result.Add(e.tag.ToLowerInvariant());
            }

            if (!string.IsNullOrEmpty(order.kind))
                result.Add(order.kind.ToLowerInvariant());

            // Include the label words as extra hints
            var combined = ((order.callsign ?? "") + " " + (order.label ?? "")).ToLowerInvariant();
            result.Add(combined);
            return result;
        }

        /// <summary>Substring-match any tag string against any candidate keyword.</summary>
        static bool HasAny(List<string> tags, string[] candidates)
        {
            foreach (var t in tags)
                foreach (var c in candidates)
                    if (t.Contains(c) || c.Contains(t))
                        return true;
            return false;
        }

        /// <summary>
        /// Find the most suitable border/partition StoryLine (Radcliffe Line, Berlin Wall, etc.).
        /// Prefers id/label containing "line", "border", "partition", "wall", "radcliffe".
        /// </summary>
        static bool FindBorderStoryLine(
            IReadOnlyList<StoryLine> storyLines, out StoryLine result)
        {
            result = null;
            if (storyLines == null) return false;
            foreach (var sl in storyLines)
            {
                if (sl?.points == null || sl.points.Count < 2) continue;
                var label = (sl.label ?? "").ToLowerInvariant();
                var id    = (sl.id    ?? "").ToLowerInvariant();
                if (label.Contains("line")       || label.Contains("border")  ||
                    label.Contains("partition")  || label.Contains("wall")    ||
                    label.Contains("radcliffe")  || label.Contains("quarantine") ||
                    id.Contains("line")          || id.Contains("border")     ||
                    id.Contains("radcliffe")     || id.Contains("wall"))
                {
                    result = sl;
                    return true;
                }
            }
            // Looser fallback: any storyLine with ≥2 points that isn't a refugee route
            foreach (var sl in storyLines)
            {
                if (sl?.points == null || sl.points.Count < 2) continue;
                var label = (sl.label ?? "").ToLowerInvariant();
                if (label.Contains("refugee") || label.Contains("route")) continue;
                result = sl;
                return true;
            }
            return false;
        }

        /// <summary>Project StoryLine lat/lon points to world space via the theater's GeoProjection.</summary>
        static List<Vector3> ProjectPolyline(StoryLine sl, TheaterBoardBuilder board)
        {
            if (sl?.points == null || board?.Projection == null) return null;
            var pts = new List<Vector3>(sl.points.Count);
            const float y = 0.05f; // slightly above map surface
            foreach (var p in sl.points)
                pts.Add(board.Projection.LatLonToWorld(p.lat, p.lon, y));
            return pts;
        }

        /// <summary>
        /// Determine the from/to world positions for FlowArrows.
        /// Priority: (1) refugee/route StoryLine  (2) board corridor  (3) nearest other pin.
        /// </summary>
        static (Vector3 from, Vector3 to, Color color) ResolveFlowPoints(
            OrderChoice              order,
            TheaterBoardBuilder      board,
            IReadOnlyList<StoryLine> storyLines,
            Vector3                  epicenter)
        {
            const float y = 0.05f;

            // 1. Refugee or corridor StoryLine
            foreach (var sl in storyLines)
            {
                if (sl?.points == null || sl.points.Count < 2) continue;
                var label = (sl.label ?? "").ToLowerInvariant();
                var id    = (sl.id    ?? "").ToLowerInvariant();
                if (label.Contains("refugee") || label.Contains("route") ||
                    label.Contains("corridor") || label.Contains("migr") ||
                    id.Contains("refugee")     || id.Contains("route"))
                {
                    if (board.Projection != null)
                    {
                        var first = sl.points[0];
                        var last  = sl.points[sl.points.Count - 1];
                        return (
                            board.Projection.LatLonToWorld(first.lat, first.lon, y),
                            board.Projection.LatLonToWorld(last.lat,  last.lon,  y),
                            EscalationRed);
                    }
                }
            }

            // 2. Board corridor touching the ordered marker
            if (board.Board?.corridors != null && !string.IsNullOrEmpty(order.markerId))
            {
                foreach (var corridor in board.Board.corridors)
                {
                    if (corridor == null) continue;
                    string otherId = null;
                    if (corridor.from == order.markerId)      otherId = corridor.to;
                    else if (corridor.to == order.markerId)   otherId = corridor.from;
                    if (otherId == null) continue;

                    if (board.Hotspots != null &&
                        board.Hotspots.TryGetValue(otherId, out var otherHs) &&
                        otherHs != null)
                    {
                        return (epicenter, otherHs.transform.position, RefugeeAmber);
                    }
                }
            }

            // 3. Nearest other pin
            return (epicenter, FindNearestOtherPinPos(epicenter, order.markerId, board), RefugeeAmber);
        }

        /// <summary>
        /// Find the GoldArc endpoint: prefer a gazetteer capital, then a capital-kind
        /// HotspotMarker, then any nearest other pin.
        /// </summary>
        static Vector3 FindCapitalOrNearestOtherPin(
            Vector3              epicenter,
            OrderChoice          order,
            TheaterBoardBuilder  board,
            AtlasTheaterContent  content)
        {
            // (a) GazetteerCountry label positions (country centroids / capitals)
            if (content?.Countries != null && board?.Projection != null)
            {
                Vector3 best  = epicenter;
                float   bestD = float.MaxValue;
                foreach (var country in content.Countries)
                {
                    var worldPos = board.Projection.LatLonToWorld(country.lat, country.lon, 0.05f);
                    var d = (worldPos - epicenter).sqrMagnitude;
                    if (d > 0.01f && d < bestD) { bestD = d; best = worldPos; }
                }
                if ((best - epicenter).sqrMagnitude > 0.01f) return best;
            }

            // (b) HotspotMarker gazetteer place with kind == "capital"
            if (board?.Hotspots != null && content != null)
            {
                foreach (var kv in board.Hotspots)
                {
                    if (kv.Value == null || kv.Key == order.markerId) continue;
                    if (content.TryGetPlace(kv.Key, out var place) &&
                        string.Equals(place.kind, "capital", System.StringComparison.OrdinalIgnoreCase))
                    {
                        return kv.Value.transform.position;
                    }
                }
            }

            // (c) Nearest other pin
            return FindNearestOtherPinPos(epicenter, order.markerId, board);
        }

        static Vector3 FindNearestOtherPinPos(
            Vector3 from, string excludeMarkerId, TheaterBoardBuilder board)
        {
            if (board?.Hotspots == null) return from;
            var best  = from;
            var bestD = float.MaxValue;
            foreach (var kv in board.Hotspots)
            {
                if (kv.Value == null || kv.Key == excludeMarkerId) continue;
                var d = (kv.Value.transform.position - from).sqrMagnitude;
                if (d < bestD && d > 0.01f) { bestD = d; best = kv.Value.transform.position; }
            }
            return best;
        }

        /// <summary>Fallback color derived from WorldVerb when no effect tags were found.</summary>
        static Color DeriveColorFromVerb(OrderChoice order)
        {
            var verb = WorldVerbResolver.FromOrder(order);
            return verb switch
            {
                WorldVerb.BorderShift    => RefugeeAmber,
                WorldVerb.CorridorToggle => RefugeeAmber,
                WorldVerb.ControlWash    => FallbackAmber,
                WorldVerb.CityStress     => EscalationRed,
                _                        => FallbackAmber
            };
        }
    }
}
