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
    /// <para>Desk rim is built; zone cubes / TextMesh labels stay off the play path.</para>
    /// </summary>
    public sealed class RealMapBoard : MonoBehaviour
    {
        // ── Y-layer heights ──────────────────────────────────────────────────
        const float OceanY      = -0.008f;  // ocean backdrop sits just below
        const float LandQuadY   = 0f;       // main map surface
        const float CoastY      = 0.012f;   // coastline lines just above
        const float BorderY     = 0.022f;   // crisis borders higher
        const float RiverY      = 0.006f;   // rivers slightly above land
        const float DeskLipY    = -0.035f;

        // ── Line widths (world units at boardWidth 24) ───────────────────────
        const float CoastWidth  = 0.042f;
        const float BorderWidth = 0.062f;
        const float RiverWidth  = 0.02f;

        // Stored references so Animate* helpers in TheaterBoardBuilder can reach them.
        public Transform BordersRoot  { get; private set; }
        public Transform CoastRoot    { get; private set; }
        public Transform DeskRimRoot  { get; private set; }

        // ── Public entry point ───────────────────────────────────────────────

        /// <summary>
        /// Builds the full map under this MonoBehaviour's transform.
        /// </summary>
        public void Build(BoardData board, GeoProjection proj,
                          Texture2D relief, Texture2D mask, Texture2D terrain)
        {
            var w = proj.BoardWidth;
            var d = proj.BoardDepth;

            BuildOcean(w, d, mask, board);
            BuildLandQuad(board, proj, w, d, relief, mask, terrain);
            BuildDeskRim(w, d);
            BuildCoastLines(board.geo?.lands, proj);
            BuildCrisisBorders(board.geo?.borders, proj);
            BuildRivers(board.geo?.rivers, proj);
        }

        // ── Ocean backdrop ───────────────────────────────────────────────────

        void BuildOcean(float w, float d, Texture2D mask, BoardData board)
        {
            var go = new GameObject("OceanBackdrop");
            go.transform.SetParent(transform, false);

            var mf = go.AddComponent<MeshFilter>();
            var mr = go.AddComponent<MeshRenderer>();

            // Ocean fills the open map band behind the land quad. Do NOT stamp the coast
            // mask here — that produced the giant jagged land silhouette outside the map
            // viewport. Land silhouette belongs only on LandSurface via Genesis/AtlasMap.
            mf.sharedMesh = CreateFlatQuadMesh(w * 2.4f, d * 2.4f);
            go.transform.localPosition = new Vector3(0f, OceanY, 0f);

            var water = ParseHex(board?.water ?? board?.geo?.water, new Color(0.024f, 0.075f, 0.129f, 1f));
            // Solid deep navy basin — mask unused on purpose (see note above).
            var mat = TheaterMaterialFactory.InkWater(water, coastMask: null);
            mat.name = "AtlasOceanInk";
            mr.sharedMaterial = mat;
            mr.shadowCastingMode = ShadowCastingMode.Off;
            mr.receiveShadows    = true;
        }

        // ── Restrained antique-brass desk rim around the map bbox ─────────────

        void BuildDeskRim(float w, float d)
        {
            DeskRimRoot = new GameObject("DeskRim").transform;
            DeskRimRoot.SetParent(transform, false);
            DeskRimRoot.localPosition = new Vector3(0f, DeskLipY, 0f);

            // Hairline brass lip — mockup map viewport, not a heavy desk slab.
            float margin = Mathf.Max(w, d) * 0.010f;
            float thickness = Mathf.Clamp(Mathf.Min(w, d) * 0.008f, 0.06f, 0.14f);
            float outerW = w + margin * 2f;
            float outerD = d + margin * 2f;
            var mat = TheaterMaterialFactory.TableLip();

            // Four lip slabs: N/S/E/W — thin geometry, desk edge without visual dominance.
            SpawnLipSlab(DeskRimRoot, "LipN", new Vector3(0f, 0f,  (d + thickness) * 0.5f),
                new Vector3(outerW + thickness * 2f, thickness * 0.42f, thickness), mat);
            SpawnLipSlab(DeskRimRoot, "LipS", new Vector3(0f, 0f, -(d + thickness) * 0.5f),
                new Vector3(outerW + thickness * 2f, thickness * 0.42f, thickness), mat);
            SpawnLipSlab(DeskRimRoot, "LipE", new Vector3( (w + thickness) * 0.5f, 0f, 0f),
                new Vector3(thickness, thickness * 0.42f, d), mat);
            SpawnLipSlab(DeskRimRoot, "LipW", new Vector3(-(w + thickness) * 0.5f, 0f, 0f),
                new Vector3(thickness, thickness * 0.42f, d), mat);

            // No oversized void skirt — it read as a second terrain slab around the map.
            // Ocean backdrop + camera clear color already cover pan edges.
        }

        static void SpawnLipSlab(Transform parent, string name, Vector3 localPos, Vector3 scale, Material mat)
        {
            var go = GameObject.CreatePrimitive(PrimitiveType.Cube);
            go.name = name;
            go.transform.SetParent(parent, false);
            go.transform.localPosition = localPos;
            go.transform.localScale = scale;
            Object.Destroy(go.GetComponent<Collider>());
            var mr = go.GetComponent<MeshRenderer>();
            if (mr != null)
            {
                mr.sharedMaterial = mat;
                mr.shadowCastingMode = ShadowCastingMode.On;
                mr.receiveShadows = true;
            }
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

            // Blue Marble crops carry their own oceans/land — lean on terrain albedo.
            // Slightly stronger hillshade so relief reads as a physical desk surface.
            bool realisticAlbedo = terrain != null &&
                terrain.name.IndexOf("terrain_", System.StringComparison.OrdinalIgnoreCase) < 0;
            if (mat.HasProperty("_TerrainBlend"))
                mat.SetFloat("_TerrainBlend", realisticAlbedo ? 0.88f : 0.28f);
            if (mat.HasProperty("_HillshadeStr"))
                mat.SetFloat("_HillshadeStr", realisticAlbedo ? 0.82f : 1.85f);

            mr.sharedMaterial = mat;
            mr.shadowCastingMode = ShadowCastingMode.Off;
            // Soft contact from teak lip — physical desk read at the map edge.
            mr.receiveShadows    = true;
        }

        // ── Coastline LineRenderers ──────────────────────────────────────────

        void BuildCoastLines(List<PolygonRing> lands, GeoProjection proj)
        {
            if (lands == null || lands.Count == 0) return;

            CoastRoot = new GameObject("CoastLines").transform;
            CoastRoot.SetParent(transform, false);
            // Rotate -90° around X so local Z points to world Y (up) → TransformZ is flat.
            CoastRoot.localRotation = Quaternion.Euler(-90f, 0f, 0f);

            // Parchment foam rim — stronger alpha so land silhouette reads in ≤2s.
            var mat = TheaterMaterialFactory.Unlit(
                new Color(0.88f, 0.78f, 0.56f, 0.78f),
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

            // Contested ink — warm amber, opaque enough to read as crisis, never neon.
            var mat = TheaterMaterialFactory.Unlit(
                new Color(0.94f, 0.58f, 0.18f, 0.92f),
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
    }
}
