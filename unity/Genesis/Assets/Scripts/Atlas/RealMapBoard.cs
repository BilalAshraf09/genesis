using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Rendering;
using Genesis.Data;
using Genesis.Theater;

namespace Genesis.Atlas
{
    /// <summary>
    /// Builds the "Living Atlas" map surface under a BoardRoot transform.
    /// Owned by <see cref="Genesis.Theater.TheaterBoardBuilder"/>.
    /// <para>
    /// Creates (in order):
    ///   1. Ocean backdrop quad (large, behind the bbox)
    ///   2. Land surface quad (exactly the bbox, Genesis/AtlasMap shader)
    ///   3. Coastline LineRenderers (one per lands[] ring)
    ///   4. Crisis border LineRenderers (non-empty borders only, amber dashed)
    ///   5. River LineRenderers (thin blue, if any)
    /// </para>
    /// <para>Zone cubes, table lip, TextMesh city labels and corridor beams are NOT built here.</para>
    /// </summary>
    public sealed class RealMapBoard : MonoBehaviour
    {
        // ── Y-layer heights ──────────────────────────────────────────────────
        const float OceanY      = -0.008f;  // ocean backdrop sits just below
        const float LandQuadY   = 0f;       // main map surface
        const float CoastY      = 0.012f;   // coastline lines just above
        const float BorderY     = 0.022f;   // crisis borders higher
        const float RiverY      = 0.006f;   // rivers slightly above land

        // ── Line widths (world units at boardWidth 24) ───────────────────────
        const float CoastWidth  = 0.03f;
        const float BorderWidth = 0.05f;
        const float RiverWidth  = 0.018f;

        // Stored references so Animate* helpers in TheaterBoardBuilder can reach them.
        public Transform BordersRoot  { get; private set; }
        public Transform CoastRoot    { get; private set; }

        // ── Public entry point ───────────────────────────────────────────────

        /// <summary>
        /// Builds the full map under this MonoBehaviour's transform.
        /// </summary>
        public void Build(BoardData board, GeoProjection proj,
                          Texture2D relief, Texture2D mask, Texture2D terrain)
        {
            var w = proj.BoardWidth;
            var d = proj.BoardDepth;

            BuildOcean(w, d);
            BuildLandQuad(board, proj, w, d, relief, mask, terrain);
            BuildCoastLines(board.geo?.lands, proj);
            BuildCrisisBorders(board.geo?.borders, proj);
            BuildRivers(board.geo?.rivers, proj);
        }

        // ── Ocean backdrop ───────────────────────────────────────────────────

        void BuildOcean(float w, float d)
        {
            var go = new GameObject("OceanBackdrop");
            go.transform.SetParent(transform, false);

            var mf = go.AddComponent<MeshFilter>();
            var mr = go.AddComponent<MeshRenderer>();

            // Ocean extends well beyond the bbox so camera pan never sees void.
            mf.sharedMesh = CreateFlatQuadMesh(w * 3.5f, d * 3.5f);
            go.transform.localPosition = new Vector3(0f, OceanY, 0f);

            // Subtle gradient: shader is URP/Unlit, colour #0B1220
            var shader = Shader.Find("Universal Render Pipeline/Unlit");
            if (shader == null) shader = Shader.Find("Hidden/InternalErrorShader");
            var mat = new Material(shader) { name = "AtlasOcean" };
            SetMatColor(mat, new Color(0.043f, 0.071f, 0.125f, 1f)); // #0B1220
            mr.sharedMaterial = mat;
            mr.shadowCastingMode = ShadowCastingMode.Off;
            mr.receiveShadows    = false;
        }

        // ── Land surface quad ────────────────────────────────────────────────

        void BuildLandQuad(BoardData board, GeoProjection proj, float w, float d,
                           Texture2D relief, Texture2D mask, Texture2D terrain)
        {
            var go = new GameObject("LandSurface");
            go.transform.SetParent(transform, false);

            var mf = go.AddComponent<MeshFilter>();
            var mr = go.AddComponent<MeshRenderer>();

            // UV: u = west→east, v = south→north (texture v=0=south as confirmed)
            mf.sharedMesh = CreateMapUVQuadMesh(w, d);
            go.transform.localPosition = new Vector3(0f, LandQuadY, 0f);

            var shader = Shader.Find("Genesis/AtlasMap");
            if (shader == null || !shader.isSupported)
            {
                Debug.LogError("[Atlas] Genesis/AtlasMap shader not found – check shader import.");
                shader = Shader.Find("Universal Render Pipeline/Unlit");
            }

            var mat = new Material(shader) { name = "AtlasMapMaterial" };

            if (mask    != null) mat.SetTexture("_MaskTex",    mask);
            if (relief  != null) mat.SetTexture("_ReliefTex",  relief);
            if (terrain != null) mat.SetTexture("_TerrainTex", terrain);

            // Land colours: prefer theater root board colors, then geo colors, then spec defaults.
            mat.SetColor("_LandLow",
                ParseHex(board.land ?? board.geo?.land,   new Color(0.173f, 0.227f, 0.180f)));
            mat.SetColor("_LandHigh",
                ParseHex(board.landHi ?? board.geo?.landHi, new Color(0.420f, 0.416f, 0.333f)));
            mat.SetColor("_Ocean",
                ParseHex(board.water ?? board.geo?.water,   new Color(0.043f, 0.071f, 0.125f)));

            mr.sharedMaterial = mat;
            mr.shadowCastingMode = ShadowCastingMode.Off;
            mr.receiveShadows    = false;
        }

        // ── Coastline LineRenderers ──────────────────────────────────────────

        void BuildCoastLines(List<PolygonRing> lands, GeoProjection proj)
        {
            if (lands == null || lands.Count == 0) return;

            CoastRoot = new GameObject("CoastLines").transform;
            CoastRoot.SetParent(transform, false);
            // Rotate -90° around X so local Z points to world Y (up) → TransformZ is flat.
            CoastRoot.localRotation = Quaternion.Euler(-90f, 0f, 0f);

            var mat = TheaterMaterialFactory.Unlit(
                new Color(0.847f, 0.796f, 0.647f, 0.55f), // #D8CBA5
                "AtlasCoastLine");

            foreach (var ring in lands)
            {
                if (ring?.points == null || ring.points.Count < 3) continue;
                SpawnLineRenderer(
                    CoastRoot, ring.points, proj, CoastY,
                    mat, CoastWidth, loop: true, "CoastRing");
            }
        }

        // ── Crisis border LineRenderers (dashed via alternating segments) ────

        void BuildCrisisBorders(List<PolygonRing> borders, GeoProjection proj)
        {
            if (borders == null) return;

            // Filter out placeholder empty-ring entries (most theaters have [[]])
            var realBorders = new List<PolygonRing>();
            foreach (var r in borders)
            {
                if (r?.points != null && r.points.Count >= 2) realBorders.Add(r);
            }
            if (realBorders.Count == 0) return;

            BordersRoot = new GameObject("Borders").transform;
            BordersRoot.SetParent(transform, false);
            BordersRoot.localRotation = Quaternion.Euler(-90f, 0f, 0f);

            var mat = TheaterMaterialFactory.Unlit(
                new Color(0.961f, 0.647f, 0.141f, 0.85f), // #F5A524
                "AtlasCrisisBorder");

            foreach (var ring in realBorders)
            {
                // Dashed: emit only even-index segments (skip odd → visual gap)
                for (var i = 0; i + 1 < ring.points.Count; i += 2)
                {
                    var seg = new List<Vector2> { ring.points[i], ring.points[i + 1] };
                    // If there are more points, extend the segment slightly
                    if (i + 2 < ring.points.Count) seg.Add(ring.points[i + 1]);
                    SpawnLineRenderer(
                        BordersRoot, seg, proj, BorderY,
                        mat, BorderWidth, loop: false, $"Border_{i}");
                }
            }
        }

        // ── River LineRenderers ──────────────────────────────────────────────

        void BuildRivers(List<PolygonRing> rivers, GeoProjection proj)
        {
            if (rivers == null) return;
            var realRivers = new List<PolygonRing>();
            foreach (var r in rivers)
            {
                if (r?.points != null && r.points.Count >= 2) realRivers.Add(r);
            }
            if (realRivers.Count == 0) return;

            var root = new GameObject("Rivers").transform;
            root.SetParent(transform, false);
            root.localRotation = Quaternion.Euler(-90f, 0f, 0f);

            var mat = TheaterMaterialFactory.Unlit(
                new Color(0.231f, 0.431f, 0.569f, 0.75f), // #3B6E91
                "AtlasRiver");

            foreach (var ring in realRivers)
            {
                SpawnLineRenderer(root, ring.points, proj, RiverY, mat, RiverWidth, loop: false, "River");
            }
        }

        // ── LineRenderer helper ──────────────────────────────────────────────

        static void SpawnLineRenderer(
            Transform parent, List<Vector2> pts, GeoProjection proj,
            float worldY, Material mat, float width, bool loop, string label)
        {
            var go = new GameObject(label);
            go.transform.SetParent(parent, false);

            var lr = go.AddComponent<LineRenderer>();
            lr.useWorldSpace      = true;
            lr.alignment          = LineAlignment.TransformZ;
            lr.loop               = loop;
            lr.widthMultiplier    = width;
            lr.sharedMaterial     = mat;
            lr.shadowCastingMode  = ShadowCastingMode.Off;
            lr.receiveShadows     = false;
            lr.generateLightingData = false;
            lr.positionCount      = pts.Count;

            for (var i = 0; i < pts.Count; i++)
            {
                // Polygon ring points are real lon/lat degrees: pts[i].x = lon, pts[i].y = lat.
                // Use LatLonToWorld for correct geographic placement (NOT PercentToWorld).
                lr.SetPosition(i, proj.LatLonToWorld(pts[i].y, pts[i].x, worldY));
            }
        }

        // ── Mesh helpers ─────────────────────────────────────────────────────

        /// <summary>Creates a flat quad in the XZ plane with uniform (0,0)→(1,1) UV.</summary>
        static Mesh CreateFlatQuadMesh(float w, float d)
        {
            var mesh = new Mesh { name = "FlatQuad" };
            mesh.vertices  = new[] {
                new Vector3(-w * 0.5f, 0, -d * 0.5f), // SW
                new Vector3(-w * 0.5f, 0,  d * 0.5f), // NW
                new Vector3( w * 0.5f, 0, -d * 0.5f), // SE
                new Vector3( w * 0.5f, 0,  d * 0.5f), // NE
            };
            mesh.uv        = new[] { Vector2.zero, Vector2.up, Vector2.right, Vector2.one };
            mesh.triangles = new[] { 0, 1, 2, 2, 1, 3 };
            mesh.normals   = new[] { Vector3.up, Vector3.up, Vector3.up, Vector3.up };
            mesh.RecalculateBounds();
            return mesh;
        }

        /// <summary>
        /// Creates a flat quad with UV correctly mapped to the equirectangular texture:
        ///   SW corner -> UV (0, 0)
        ///   NE corner -> UV (1, 1)
        /// </summary>
        static Mesh CreateMapUVQuadMesh(float w, float d)
        {
            var mesh = new Mesh { name = "MapSurfaceQuad" };
            mesh.vertices = new[] {
                new Vector3(-w * 0.5f, 0, -d * 0.5f), // 0 SW
                new Vector3(-w * 0.5f, 0,  d * 0.5f), // 1 NW
                new Vector3( w * 0.5f, 0, -d * 0.5f), // 2 SE
                new Vector3( w * 0.5f, 0,  d * 0.5f), // 3 NE
            };
            mesh.uv        = new[] {
                new Vector2(0, 0), // SW
                new Vector2(0, 1), // NW
                new Vector2(1, 0), // SE
                new Vector2(1, 1), // NE
            };
            mesh.triangles = new[] { 0, 1, 2, 2, 1, 3 };
            mesh.normals   = new[] { Vector3.up, Vector3.up, Vector3.up, Vector3.up };
            mesh.RecalculateBounds();
            return mesh;
        }

        // ── Colour helper ─────────────────────────────────────────────────────

        static Color ParseHex(string hex, Color fallback)
        {
            if (string.IsNullOrEmpty(hex)) return fallback;
            return ColorUtility.TryParseHtmlString(hex, out var c) ? c : fallback;
        }

        static void SetMatColor(Material mat, Color c)
        {
            if (mat == null) return;
            if (mat.HasProperty("_BaseColor")) mat.SetColor("_BaseColor", c);
            else if (mat.HasProperty("_Color")) mat.SetColor("_Color", c);
        }
    }
}
