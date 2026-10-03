using UnityEngine;

namespace Genesis.Atlas
{
    /// <summary>
    /// Equirectangular projection for a bounded map region (bbox).
    /// <para>
    /// Converts between:
    ///   • Lat/lon degrees   (geographic)
    ///   • 0–100 percent     (the normalised space used by geo JSON / MapMarker)
    ///   • World units (XZ)  (consistent with TheaterBoardBuilder.MapToWorld)
    /// </para>
    /// <para>
    /// BoardDepth is derived from boardWidth × latSpan / (lonSpan × cos(midLat))
    /// so the region renders with natural (undistorted) proportions.
    /// </para>
    /// </summary>
    public sealed class GeoProjection
    {
        // Bbox in geographic degrees
        public readonly float LonMin;
        public readonly float LonMax;
        public readonly float LatMin;
        public readonly float LatMax;

        public readonly float BoardWidth;
        /// <summary>Computed depth that gives the region natural proportions.</summary>
        public readonly float BoardDepth;

        /// <param name="lonMin">Western edge (degrees)</param>
        /// <param name="lonMax">Eastern edge (degrees)</param>
        /// <param name="latMin">Southern edge (degrees)</param>
        /// <param name="latMax">Northern edge (degrees)</param>
        /// <param name="boardWidth">Desired board width in world units (default 24)</param>
        public GeoProjection(
            float lonMin, float lonMax,
            float latMin, float latMax,
            float boardWidth = 24f)
        {
            LonMin = lonMin; LonMax = lonMax;
            LatMin = latMin; LatMax = latMax;
            BoardWidth = boardWidth;

            var lonSpan = Mathf.Max(0.001f, lonMax - lonMin);
            var latSpan = Mathf.Max(0.001f, latMax - latMin);
            var midLat  = (latMin + latMax) * 0.5f;
            var cosLat  = Mathf.Max(0.01f, Mathf.Cos(midLat * Mathf.Deg2Rad));

            // Equirectangular: 1° lon is cos(lat) shorter than 1° lat at midpoint.
            BoardDepth = boardWidth * latSpan / (lonSpan * cosLat);
        }

        // ─── Conversion: Lat/Lon → 0–100 percent ───────────────────────────────

        /// <summary>
        /// Converts a geographic lat/lon to the 0–100 percent space used by geo JSON.
        /// x=0 = west, x=100 = east; y=0 = north, y=100 = south.
        /// </summary>
        public Vector2 LatLonToPercent(float lat, float lon)
        {
            var lonSpan = Mathf.Max(0.001f, LonMax - LonMin);
            var latSpan = Mathf.Max(0.001f, LatMax - LatMin);
            return new Vector2(
                (lon - LonMin) / lonSpan * 100f,
                (LatMax - lat) / latSpan * 100f);
        }

        /// <summary>
        /// Converts 0–100 percent to geographic lat/lon.
        /// Returns Vector2(lat, lon).
        /// </summary>
        public Vector2 PercentToLatLon(float xPercent, float yPercent)
        {
            var lon = LonMin + xPercent / 100f * (LonMax - LonMin);
            var lat = LatMax - yPercent / 100f * (LatMax - LatMin);
            return new Vector2(lat, lon);
        }

        // ─── Conversion: 0–100 percent → world XZ ───────────────────────────────

        /// <summary>
        /// Maps 0–100 percent to a 3-D world position.
        /// Identical formula to TheaterBoardBuilder.MapToWorld but uses THIS projection's dimensions.
        ///   x%=0   → X = -boardWidth/2  (west)
        ///   x%=100 → X = +boardWidth/2  (east)
        ///   y%=0   → Z = +boardDepth/2  (north)
        ///   y%=100 → Z = -boardDepth/2  (south)
        /// </summary>
        public Vector3 PercentToWorld(float xPercent, float yPercent, float worldY = 0f)
        {
            return new Vector3(
                (xPercent / 100f - 0.5f) * BoardWidth,
                worldY,
                (0.5f - yPercent / 100f) * BoardDepth);
        }

        /// <summary>
        /// Converts geographic lat/lon directly to a 3-D world position.
        /// </summary>
        public Vector3 LatLonToWorld(float lat, float lon, float worldY = 0f)
        {
            var pct = LatLonToPercent(lat, lon);
            return PercentToWorld(pct.x, pct.y, worldY);
        }

        /// <summary>
        /// Identity projection: 0–100 percent maps to a boardWidth×boardDepth board with no geographic
        /// bbox. Returned when no bbox data is available; boardDepth = the supplied fallback value.
        /// </summary>
        public static GeoProjection Identity(float boardWidth, float boardDepth)
        {
            // Fake bbox so computed boardDepth comes out exactly right:
            // boardDepth = boardWidth * latSpan / (lonSpan * cos(midLat))
            // Set all spans to 1° and midLat=0 so cos=1, then scale the ratio.
            var span = boardDepth / boardWidth;
            return new GeoProjection(
                lonMin: 0f, lonMax: 100f,
                latMin: 0f, latMax: 100f * span,
                boardWidth: boardWidth);
        }
    }
}
