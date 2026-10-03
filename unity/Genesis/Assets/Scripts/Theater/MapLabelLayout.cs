using System.Collections.Generic;
using UnityEngine;

namespace Genesis.Theater
{
    /// <summary>
    /// Label deconfliction — clarity reset: ≤4 plates, hide extras, never overlap.
    /// </summary>
    public static class MapLabelLayout
    {
        public const int MaxVisibleLabels = 4;

        public class Site
        {
            public Transform pin;
            public Transform labelRoot;
            public float halfWidth = 1.2f;
            public float halfHeight = 0.34f;
            public int priority; // lower = place first (hotspots before cities)
            public bool selected;
            public Vector3 placedWorld;
            public bool placed;
            public bool visible = true;
        }

        // Prefer north / east / west — skip deep-south (bottom order rail) and extreme board edges.
        static readonly Vector2[] SlotDirs =
        {
            new(0f, 1.45f),
            new(1.25f, 1.1f),
            new(-1.25f, 1.1f),
            new(1.55f, 0.25f),
            new(-1.55f, 0.25f),
            new(1.25f, -0.45f),
            new(-1.25f, -0.45f),
            new(0.75f, 1.85f),
            new(-0.75f, 1.85f),
            new(1.85f, 0.65f),
            new(-1.85f, 0.65f),
            new(0.55f, -0.85f),
            new(-0.55f, -0.85f),
            new(2.1f, -0.1f),
            new(-2.1f, -0.1f),
            new(0f, 2.15f),
            new(1.5f, 1.55f),
            new(-1.5f, 1.55f),
        };

        public static void Resolve(IList<Site> sites, float boardWidth, float landHeight)
        {
            if (sites == null || sites.Count == 0) return;

            var ordered = new List<Site>(sites);
            ordered.Sort((a, b) =>
            {
                if (a.selected != b.selected) return a.selected ? -1 : 1;
                return a.priority.CompareTo(b.priority);
            });

            // Density cap: keep pin masts, hide lowest-priority full labels beyond MaxVisibleLabels.
            for (var i = 0; i < ordered.Count; i++)
            {
                ordered[i].visible = i < MaxVisibleLabels || ordered[i].selected;
                if (ordered[i].labelRoot != null)
                    ordered[i].labelRoot.gameObject.SetActive(ordered[i].visible);
            }

            var halfBoardX = boardWidth * 0.46f;
            var halfBoardZ = Mathf.Max(boardWidth, 16f) * 0.3f;
            var pad = 0.55f;
            var placed = new List<Site>();
            foreach (var site in ordered)
            {
                if (!site.visible || site.pin == null || site.labelRoot == null) continue;
                // Inflate AABB slightly so plate shadows / stress chips don't kiss.
                site.halfWidth = Mathf.Max(site.halfWidth, 0.95f) + 0.08f;
                site.halfHeight = Mathf.Max(site.halfHeight, 0.3f) + 0.06f;

                var pinPos = site.pin.position;
                var bestLocal = new Vector3(0f, 0.08f, 1.25f);
                var bestWorld = pinPos + site.pin.TransformDirection(bestLocal);
                var bestScore = float.MaxValue;
                var found = false;
                var spread = Mathf.Lerp(1.35f, 1.95f, Mathf.Clamp01((boardWidth - 18f) / 14f));

                for (var i = 0; i < SlotDirs.Length; i++)
                {
                    var dir = SlotDirs[i];
                    if (dir.y < -0.95f) continue;
                    var local = new Vector3(dir.x * spread, 0.08f + Mathf.Abs(dir.y) * 0.02f, dir.y * spread);
                    var world = pinPos + site.pin.TransformDirection(local);
                    world.y = landHeight + 0.55f;
                    if (!InsideDesk(world, halfBoardX, halfBoardZ)) continue;
                    if (Overlaps(world, site.halfWidth, site.halfHeight, placed, pad))
                        continue;

                    var edgePenalty = EdgePenalty(world, halfBoardX, halfBoardZ);
                    var prefer = i * 0.05f + local.magnitude * 0.08f + (dir.y < 0f ? 0.55f : 0f) + edgePenalty;
                    if (prefer < bestScore)
                    {
                        bestScore = prefer;
                        bestLocal = local;
                        bestWorld = world;
                        found = true;
                    }
                }

                if (!found)
                {
                    for (var radius = 1.9f; radius <= 4.4f && !found; radius += 0.28f)
                    {
                        for (var i = 0; i < SlotDirs.Length; i++)
                        {
                            if (SlotDirs[i].y < -0.95f) continue;
                            var dir = SlotDirs[i].normalized * radius;
                            var local = new Vector3(dir.x, 0.1f, dir.y);
                            var world = pinPos + site.pin.TransformDirection(local);
                            world.y = landHeight + 0.55f;
                            if (!InsideDesk(world, halfBoardX, halfBoardZ)) continue;
                            if (Overlaps(world, site.halfWidth, site.halfHeight, placed, pad))
                                continue;
                            bestLocal = local;
                            bestWorld = world;
                            found = true;
                            break;
                        }
                    }
                }

                if (!found)
                {
                    // Still no clear slot — hide label (pin mast stays). Selected always kept.
                    if (!site.selected)
                    {
                        site.visible = false;
                        site.placed = false;
                        if (site.labelRoot != null)
                            site.labelRoot.gameObject.SetActive(false);
                        continue;
                    }
                }

                site.labelRoot.localPosition = bestLocal;
                site.placedWorld = bestWorld;
                site.placed = true;
                placed.Add(site);
                EnsureLeaderLine(site.pin, site.labelRoot, bestLocal.magnitude > 0.85f);
            }

            // Iterative AABB push — more iters + stronger pad for zero-overlap acceptance.
            for (var iter = 0; iter < 20; iter++)
            {
                if (HaveZeroOverlap(placed, pad)) break;
                for (var i = 0; i < placed.Count; i++)
                {
                    for (var j = i + 1; j < placed.Count; j++)
                    {
                        var a = placed[i];
                        var b = placed[j];
                        var dx = b.placedWorld.x - a.placedWorld.x;
                        var dz = b.placedWorld.z - a.placedWorld.z;
                        var minDx = a.halfWidth + b.halfWidth + pad;
                        var minDz = a.halfHeight + b.halfHeight + pad + 0.1f;
                        if (Mathf.Abs(dx) >= minDx || Mathf.Abs(dz) >= minDz) continue;

                        var pushX = (minDx - Mathf.Abs(dx)) * 0.55f + 0.06f;
                        var pushZ = (minDz - Mathf.Abs(dz)) * 0.3f + 0.04f;
                        var sx = dx == 0f ? (i < j ? -1f : 1f) : Mathf.Sign(dx);
                        var sz = dz == 0f ? 1f : Mathf.Sign(dz);
                        if (sz < 0f) sz = -sz;
                        ShiftSite(a, new Vector3(-sx * pushX, 0f, -sz * pushZ * 0.4f), landHeight, halfBoardX, halfBoardZ);
                        ShiftSite(b, new Vector3(sx * pushX, 0f, sz * pushZ * 0.4f), landHeight, halfBoardX, halfBoardZ);
                    }
                }
            }

            // Final pass: hide lowest-priority labels that still collide (never selected).
            for (var i = placed.Count - 1; i >= 0; i--)
            {
                var site = placed[i];
                if (site.selected || !site.visible) continue;
                var stillHits = false;
                for (var j = 0; j < placed.Count; j++)
                {
                    if (i == j || !placed[j].visible || !placed[j].placed) continue;
                    var other = placed[j];
                    var dx = Mathf.Abs(site.placedWorld.x - other.placedWorld.x);
                    var dz = Mathf.Abs(site.placedWorld.z - other.placedWorld.z);
                    if (dx < site.halfWidth + other.halfWidth + pad * 0.9f &&
                        dz < site.halfHeight + other.halfHeight + pad * 0.9f)
                    {
                        stillHits = true;
                        break;
                    }
                }

                if (!stillHits) continue;
                site.visible = false;
                site.placed = false;
                if (site.labelRoot != null)
                    site.labelRoot.gameObject.SetActive(false);
                placed.RemoveAt(i);
            }
        }

        static bool InsideDesk(Vector3 world, float halfX, float halfZ)
        {
            return Mathf.Abs(world.x) <= halfX && world.z <= halfZ && world.z >= -halfZ * 0.65f;
        }

        static float EdgePenalty(Vector3 world, float halfX, float halfZ)
        {
            var px = Mathf.Abs(world.x) / Mathf.Max(0.01f, halfX);
            var pzSouth = world.z < 0f ? Mathf.Abs(world.z) / Mathf.Max(0.01f, halfZ) : 0f;
            return Mathf.Max(0f, px - 0.72f) * 1.4f + pzSouth * 1.1f;
        }

        static void ShiftSite(Site site, Vector3 worldDelta, float landHeight, float halfX, float halfZ)
        {
            if (site?.pin == null || site.labelRoot == null) return;
            var world = site.placedWorld + worldDelta;
            world.y = landHeight + 0.55f;
            if (!InsideDesk(world, halfX, halfZ))
            {
                world.x = Mathf.Clamp(world.x, -halfX, halfX);
                world.z = Mathf.Clamp(world.z, -halfZ * 0.65f, halfZ);
            }

            var local = site.pin.InverseTransformPoint(world);
            if (local.z < -1.55f) local.z = -1.55f;
            site.labelRoot.localPosition = local;
            site.placedWorld = site.pin.TransformPoint(local);
            site.placedWorld.y = landHeight + 0.55f;
            EnsureLeaderLine(site.pin, site.labelRoot, local.magnitude > 0.85f);
        }

        static bool HaveZeroOverlap(List<Site> placed, float pad)
        {
            for (var i = 0; i < placed.Count; i++)
            {
                for (var j = i + 1; j < placed.Count; j++)
                {
                    var a = placed[i];
                    var b = placed[j];
                    var dx = Mathf.Abs(a.placedWorld.x - b.placedWorld.x);
                    var dz = Mathf.Abs(a.placedWorld.z - b.placedWorld.z);
                    if (dx < a.halfWidth + b.halfWidth + pad * 0.9f &&
                        dz < a.halfHeight + b.halfHeight + pad * 0.95f)
                        return false;
                }
            }

            return true;
        }

        static bool Overlaps(Vector3 world, float halfW, float halfH, List<Site> placed, float pad)
        {
            foreach (var other in placed)
            {
                if (!other.placed) continue;
                var dx = Mathf.Abs(world.x - other.placedWorld.x);
                var dz = Mathf.Abs(world.z - other.placedWorld.z);
                if (dx < halfW + other.halfWidth + pad &&
                    dz < halfH + other.halfHeight + pad)
                    return true;
            }

            return false;
        }

        static void EnsureLeaderLine(Transform pin, Transform labelRoot, bool enabled)
        {
            if (pin == null || labelRoot == null) return;
            var existing = labelRoot.Find("LeaderLine");
            if (!enabled)
            {
                if (existing != null)
                {
                    if (Application.isPlaying) Object.Destroy(existing.gameObject);
                    else Object.DestroyImmediate(existing.gameObject);
                }

                return;
            }

            Transform lineTf = existing;
            if (lineTf == null)
            {
                var go = GameObject.CreatePrimitive(PrimitiveType.Cube);
                go.name = "LeaderLine";
                lineTf = go.transform;
                lineTf.SetParent(labelRoot, false);
                var col = go.GetComponent<Collider>();
                if (col != null)
                {
                    if (Application.isPlaying) Object.Destroy(col);
                    else Object.DestroyImmediate(col);
                }

                var mr = go.GetComponent<MeshRenderer>();
                if (mr != null)
                {
                    mr.sharedMaterial = TheaterMaterialFactory.Unlit(
                        new Color(0.42f, 0.36f, 0.26f, 0.72f), "GenesisLeader");
                }
            }

            var tip = Vector3.zero;
            var pinLocal = labelRoot.InverseTransformPoint(pin.position + Vector3.up * 0.05f);
            var mid = (tip + pinLocal) * 0.5f;
            var len = Vector3.Distance(tip, pinLocal);
            lineTf.localPosition = mid;
            lineTf.localRotation = len > 0.001f
                ? Quaternion.LookRotation(pinLocal - tip, Vector3.up)
                : Quaternion.identity;
            lineTf.localScale = new Vector3(0.022f, 0.022f, Mathf.Max(0.05f, len));
        }
    }
}
