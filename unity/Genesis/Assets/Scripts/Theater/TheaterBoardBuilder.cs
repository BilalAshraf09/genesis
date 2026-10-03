using System.Collections;
using System.Collections.Generic;
using Genesis.Atlas;
using Genesis.Data;
using UnityEngine;
using Genesis.UI;

namespace Genesis.Theater
{
    /// <summary>
    /// Thin adapter over <see cref="Genesis.Atlas.RealMapBoard"/>.
    /// Builds a cartographic map surface + flat map pins at real geographic coordinates.
    /// Removed from the build path: void skirt, table lip, extruded land, zone cubes,
    /// corridor beams, TextMesh city labels, label collision code.
    /// All public members keep the same signatures so TheaterSession, WorldReactionFX,
    /// TheaterCameraRig, MapLabelLayout, BoardPointerInput, and any Editor scripts continue
    /// to compile without changes.
    /// </summary>
    public class TheaterBoardBuilder : MonoBehaviour
    {
        // ── Inspector tunables (kept for backward compat; Atlas board ignores most) ──
        [Header("Board scale (reference — actual depth derived from geo bbox)")]
        public float boardWidth = 24f;
        public float boardDepth = 16f;   // overridden by GeoProjection once bbox is known
        public float landHeight = 0f;    // map is flat; kept for API
        public float waterY    = 0f;

        [Header("Materials (unused by RealMapBoard — kept for scene refs)")]
        public Material waterMaterial;
        public Material landMaterial;
        public Material landHiMaterial;
        public Material accentMaterial;
        public Material hotspotMaterial;
        public Material selectedHotspotMaterial;
        public Material landCliffMaterial;
        public Material borderMaterial;
        public Material cityPinMaterial;

        // ── Internal state ──────────────────────────────────────────────────────
        readonly Dictionary<string, HotspotMarker> _hotspots = new();
        BoardData  _board;
        Transform  _boardRoot;
        Transform  _hotspotRoot;
        RealMapBoard _realMap;

        // ── Public contract (same names / signatures as before) ─────────────────
        public IReadOnlyDictionary<string, HotspotMarker> Hotspots => _hotspots;
        public BoardData Board    => _board;

        /// <summary>lon/lat ↔ world projection for the current board.</summary>
        public GeoProjection Projection { get; protected set; }

        /// <summary>Theater id used for AtlasContent lookups.</summary>
        public string TheaterId { get; set; }

        /// <summary>Root transform under which map FX may parent objects.</summary>
        public Transform MapRoot => _boardRoot;

        // ── Build / Clear ───────────────────────────────────────────────────────

        public void Build(BoardData board)
        {
            Clear();
            if (board == null)
            {
                Debug.LogError("[Genesis] TheaterBoardBuilder.Build called with null board.");
                return;
            }

            _board = board;
            _boardRoot = new GameObject("BoardRoot").transform;
            _boardRoot.SetParent(transform, false);
            _hotspotRoot = new GameObject("Hotspots").transform;
            _hotspotRoot.SetParent(_boardRoot, false);

            // TheaterId should already be set by TheaterSession; fall back here.
            if (string.IsNullOrEmpty(TheaterId))
                TheaterId = TheaterSession.Instance?.Bundle?.scenario?.id ?? board.id;

            // Build GeoProjection from the polygon data in the theater geo JSON.
            Projection = BuildProjection(board);
            // Keep boardDepth in sync so callers using MapToWorld still get sane values.
            boardDepth = Projection.BoardDepth;

            // Load map textures from StreamingAssets.
            var regionKey = MapTextureLibrary.ResolveRegionKey(TheaterId,
                board.geo?.terrainKey ?? board.terrainKey);
            var relief  = MapTextureLibrary.LoadRelief(regionKey, TheaterId);
            var mask    = MapTextureLibrary.LoadMask(regionKey, TheaterId);
            var terrain = MapTextureLibrary.LoadTerrainAlbedo(
                board.geo?.terrainKey ?? board.terrainKey ?? "southasia");

            // Disable fog — clean map read is more important than atmosphere.
            RenderSettings.fog = false;

            // Build the real cartographic map surface (RealMapBoard owns ocean, land, lines).
            var mapGo = new GameObject("RealMap");
            mapGo.transform.SetParent(_boardRoot, false);
            _realMap = mapGo.AddComponent<RealMapBoard>();
            _realMap.Build(board, Projection, relief, mask, terrain);

            Debug.Log($"[Genesis] Board built: {TheaterId}. Bounds: Lon [{Projection.LonMin}, {Projection.LonMax}], Lat [{Projection.LatMin}, {Projection.LatMax}]. Size: {Projection.BoardWidth}x{Projection.BoardDepth}");

            // Build hotspot pins at real geographic coordinates.
            BuildHotspots(board);

            // Build UI Toolkit label overlay for country + pin names.
            SpawnMapLabelOverlay();
        }

        public void Clear()
        {
            _hotspots.Clear();
            if (_boardRoot != null)
            {
                if (Application.isPlaying) Destroy(_boardRoot.gameObject);
                else DestroyImmediate(_boardRoot.gameObject);
            }
            _boardRoot   = null;
            _hotspotRoot = null;
            _realMap     = null;
        }

        // ── Hotspot building ────────────────────────────────────────────────────

        void BuildHotspots(BoardData board)
        {
            if (board.markers == null) return;
            var content = AtlasContent.ForTheater(TheaterId ?? "");

            foreach (var marker in board.markers)
            {
                if (marker == null || string.IsNullOrEmpty(marker.id)) continue;

                var go = new GameObject($"Hotspot_{marker.id}");
                go.transform.SetParent(_hotspotRoot, false);

                // Resolve world position: prefer real lat/lon from gazetteer.
                Vector3 pos;
                if (content.TryGetPlace(marker.id, out var place))
                    pos = Projection.LatLonToWorld(place.lat, place.lon, 0.05f);
                else
                    pos = Projection.PercentToWorld(marker.x, marker.y, 0.05f);

                go.transform.position = pos;

                // HotspotMarker attaches its own SphereCollider in Initialize.
                var hs = go.AddComponent<HotspotMarker>();
                hs.Initialize(marker, null, null);
                _hotspots[marker.id] = hs;
            }
        }

        void SpawnMapLabelOverlay()
        {
            var go = new GameObject("MapLabelOverlay");
            go.transform.SetParent(_boardRoot, false);
            var overlay = go.AddComponent<MapLabelOverlay>();
            overlay.Initialize(this, Camera.main);
        }

        // ── Legacy MapToWorld (kept so old callers compile) ─────────────────────

        /// <summary>Maps 0–100 percent to a world position using the current GeoProjection.</summary>
        public Vector3 MapToWorld(float xPercent, float yPercent)
        {
            if (Projection != null)
                return Projection.PercentToWorld(xPercent, yPercent, landHeight);
            var x = (xPercent / 100f - 0.5f) * boardWidth;
            var z = (0.5f - yPercent / 100f) * boardDepth;
            return new Vector3(x, landHeight, z);
        }

        // ── Selected marker ─────────────────────────────────────────────────────

        public void SetSelectedMarker(string markerId)
        {
            foreach (var kv in _hotspots)
            {
                if (kv.Value == null) continue;
                kv.Value.SetSelected(kv.Key == markerId);
            }
        }

        // ── Animate* — lightweight no-ops / thin implementations ─────────────────
        // WorldReactionFX calls these. The Effects/ developer owns the new
        // WorldReactionFX / MapStoryFX implementations; we yield-break safely.

        public IEnumerator AnimateBorderShift(float duration)
        {
            // Thin: flash the border line renderers in RealMapBoard if present.
            var borderRoot = _realMap != null ? _realMap.BordersRoot : null;
            if (borderRoot != null)
            {
                var lrs = borderRoot.GetComponentsInChildren<LineRenderer>();
                var hotAmber = new Color(0.95f, 0.55f, 0.18f, 0.95f);
                var t = 0f;
                while (t < duration)
                {
                    t += Time.deltaTime;
                    var k = Mathf.Sin(Mathf.Clamp01(t / duration) * Mathf.PI);
                    foreach (var lr in lrs)
                    {
                        if (lr == null) continue;
                        lr.startColor = Color.Lerp(new Color(0.96f, 0.65f, 0.14f, 0.85f), hotAmber, k);
                        lr.endColor   = lr.startColor;
                        lr.widthMultiplier = Mathf.Lerp(0.05f, 0.09f, k);
                    }
                    yield return null;
                }
                // Restore
                foreach (var lr in lrs)
                {
                    if (lr == null) continue;
                    lr.startColor = lr.endColor = new Color(0.96f, 0.65f, 0.14f, 0.85f);
                    lr.widthMultiplier = 0.05f;
                }
            }
            else
            {
                yield return new WaitForSeconds(duration * 0.5f);
            }
        }

        public IEnumerator AnimateCorridorToggle(string markerId, float duration)
        {
            // Hotspot pulse when no corridor beams exist.
            if (!string.IsNullOrEmpty(markerId) &&
                _hotspots.TryGetValue(markerId, out var hs) && hs != null)
            {
                hs.PulseMood(new Color(0.45f, 0.62f, 0.78f, 0.9f), duration * 0.7f);
            }
            yield return new WaitForSeconds(duration * 0.35f);
        }

        public IEnumerator AnimateControlWash(Vector3 epicenter, Color tint, float duration)
        {
            // Simple pulse on nearest hotspot; full FX handed to WorldReactionFX / MapStoryFX.
            HotspotMarker nearest = null;
            var bestD = float.MaxValue;
            foreach (var kv in _hotspots)
            {
                if (kv.Value == null) continue;
                var d = (kv.Value.transform.position - epicenter).sqrMagnitude;
                if (d < bestD) { bestD = d; nearest = kv.Value; }
            }
            nearest?.PulseMood(tint, duration * 0.6f);
            yield return new WaitForSeconds(duration * 0.4f);
        }

        public void ApplyNearestCityStress(Vector3 world, CityStressLevel level)
        {
            HotspotMarker best = null;
            var bestD = float.MaxValue;
            foreach (var kv in _hotspots)
            {
                if (kv.Value == null) continue;
                var d = (kv.Value.transform.position - world).sqrMagnitude;
                if (d < bestD) { bestD = d; best = kv.Value; }
            }
            best?.SetStress(level);
        }

        // ── GeoProjection factory ───────────────────────────────────────────────

        GeoProjection BuildProjection(BoardData board)
        {
            // ROOT CAUSE FIX: The texture bounds are defined by the explicit bbox in the JSON.
            // Using all polygon points causes the world board to stretch over a massive area 
            // (e.g. including points at lon 2.0 when the texture starts at lon 60.0), 
            // resulting in the blurry green "zoomed in" appearance.
            if (board?.geo?.bbox != null && board.geo.bbox.Length == 4)
            {
                var b = board.geo.bbox;
                // lonMin, lonMax, latMin, latMax
                return new GeoProjection(b[0], b[1], b[2], b[3], boardWidth);
            }

            // Fallback: derive lon/lat bbox from the polygon ring data ONLY if bbox is missing.
            var lands = board?.geo?.lands;
            if (lands != null && lands.Count > 0)
            {
                var lonMin = float.MaxValue;
                var lonMax = float.MinValue;
                var latMin = float.MaxValue;
                var latMax = float.MinValue;
                foreach (var ring in lands)
                {
                    if (ring?.points == null) continue;
                    foreach (var pt in ring.points)
                    {
                        if (pt.x < lonMin) lonMin = pt.x;
                        if (pt.x > lonMax) lonMax = pt.x;
                        if (pt.y < latMin) latMin = pt.y;
                        if (pt.y > latMax) latMax = pt.y;
                    }
                }

                if (lonMax > lonMin && latMax > latMin)
                {
                    var lonPad = (lonMax - lonMin) * 0.04f;
                    var latPad = (latMax - latMin) * 0.04f;
                    return new GeoProjection(
                        lonMin - lonPad, lonMax + lonPad,
                        latMin - latPad, latMax + latPad,
                        boardWidth);
                }
            }

            return GeoProjection.Identity(boardWidth, boardDepth);
        }

        // ── GenesisScarDecals compat bridge ─────────────────────────────────────
        Transform EnsureScarRoot()
        {
            if (_boardRoot == null) return null;
            var existing = _boardRoot.Find("Scars");
            if (existing != null) return existing;
            var go = new GameObject("Scars");
            go.transform.SetParent(_boardRoot, false);
            return go.transform;
        }
    }
}
