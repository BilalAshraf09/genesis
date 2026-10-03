using UnityEngine;

namespace Genesis.Theater
{
    /// <summary>
    /// Authored desk props — lathed brass pins, grounded plates, teak lip segments.
    /// Replaces CreatePrimitive toy language on hero intel units while staying URP Lit factory.
    /// </summary>
    public static class TheaterPropFactory
    {
        static Mesh _pinShaft;
        static Mesh _pinHead;
        static Mesh _plateDisk;
        static Mesh _haloRing;

        public static GameObject SpawnIntelPin(Transform parent, Material brass, string name = "AuthoredPin")
        {
            var root = new GameObject(name);
            root.transform.SetParent(parent, false);

            // LOD0 High — full brass family (shaft, beacon, mast, plate, halo, cone).
            var lod0 = new GameObject("LOD0");
            lod0.transform.SetParent(root.transform, false);
            Make("Shaft", lod0.transform, PinShaftMesh(), brass, Vector3.zero, Vector3.one);
            Make("Beacon", lod0.transform, PinHeadMesh(), brass, new Vector3(0f, 0.52f, 0f), Vector3.one * 0.95f);
            Make("Mast", lod0.transform, PinShaftMesh(), brass,
                new Vector3(0f, 0.28f, 0f), new Vector3(0.55f, 0.85f, 0.55f));
            Make("BasePlate", lod0.transform, PlateDiskMesh(),
                TheaterMaterialFactory.HotspotPlate(false),
                new Vector3(0f, -0.26f, 0f), new Vector3(1.05f, 1f, 1.05f));
            Make("Halo", lod0.transform, HaloRingMesh(), brass,
                new Vector3(0f, -0.24f, 0f), new Vector3(1.12f, 1f, 1.12f));
            Make("SearchCone", lod0.transform, PlateDiskMesh(),
                TheaterMaterialFactory.BeaconCone(false),
                new Vector3(0f, -0.18f, 0f), new Vector3(1.2f, 1f, 1.2f));

            // LOD1 Medium — drop mast + halo.
            var lod1 = new GameObject("LOD1");
            lod1.transform.SetParent(root.transform, false);
            Make("Shaft", lod1.transform, PinShaftMesh(), brass, Vector3.zero, Vector3.one);
            Make("Beacon", lod1.transform, PinHeadMesh(), brass, new Vector3(0f, 0.52f, 0f), Vector3.one * 0.95f);
            Make("BasePlate", lod1.transform, PlateDiskMesh(),
                TheaterMaterialFactory.HotspotPlate(false),
                new Vector3(0f, -0.26f, 0f), new Vector3(1.05f, 1f, 1.05f));
            Make("SearchCone", lod1.transform, PlateDiskMesh(),
                TheaterMaterialFactory.BeaconCone(false),
                new Vector3(0f, -0.18f, 0f), new Vector3(1.2f, 1f, 1.2f));

            // LOD2 Low — pin head + plate only.
            var lod2 = new GameObject("LOD2");
            lod2.transform.SetParent(root.transform, false);
            Make("Beacon", lod2.transform, PinHeadMesh(), brass, new Vector3(0f, 0.4f, 0f), Vector3.one);
            Make("BasePlate", lod2.transform, PlateDiskMesh(),
                TheaterMaterialFactory.HotspotPlate(false),
                new Vector3(0f, -0.26f, 0f), new Vector3(1.1f, 1f, 1.1f));

            var lod = root.AddComponent<LODGroup>();
            lod.SetLODs(new[]
            {
                new LOD(0.45f, lod0.GetComponentsInChildren<Renderer>()),
                new LOD(0.18f, lod1.GetComponentsInChildren<Renderer>()),
                new LOD(0.03f, lod2.GetComponentsInChildren<Renderer>()),
            });
            lod.RecalculateBounds();
            return root;
        }

        public static GameObject SpawnCityPin(Transform parent, Material brass, string name = "CityPin")
        {
            var root = new GameObject(name);
            root.transform.SetParent(parent, false);
            Make("Shaft", root.transform, PinShaftMesh(), brass, Vector3.zero, new Vector3(0.85f, 0.55f, 0.85f));
            Make("CityHead", root.transform, PinHeadMesh(), brass, new Vector3(0f, 0.28f, 0f), Vector3.one * 0.7f);
            Make("CityBase", root.transform, PlateDiskMesh(),
                TheaterMaterialFactory.CityPlate(),
                new Vector3(0f, -0.22f, 0f), new Vector3(1.35f, 1f, 1.35f));
            return root;
        }

        public static GameObject SpawnTeakLipEdge(
            Transform parent, string name, Vector3 pos, Vector3 scale, Material teak)
        {
            var go = new GameObject(name);
            go.transform.SetParent(parent, false);
            go.transform.localPosition = pos;
            go.transform.localScale = scale;
            var mf = go.AddComponent<MeshFilter>();
            // Phase C — authored molding profile (not CreatePrimitive / flat box).
            mf.sharedMesh = TeakLipMoldingMesh();
            var mr = go.AddComponent<MeshRenderer>();
            mr.sharedMaterial = teak;
            return go;
        }

        static GameObject Make(
            string name, Transform parent, Mesh mesh, Material mat, Vector3 localPos, Vector3 localScale)
        {
            var go = new GameObject(name);
            go.transform.SetParent(parent, false);
            go.transform.localPosition = localPos;
            go.transform.localScale = localScale;
            var mf = go.AddComponent<MeshFilter>();
            mf.sharedMesh = mesh;
            var mr = go.AddComponent<MeshRenderer>();
            if (mat != null) mr.sharedMaterial = mat;
            return go;
        }

        static Mesh PinShaftMesh()
        {
            if (_pinShaft != null) return _pinShaft;
            _pinShaft = Lathe(
                "GenesisPinShaft",
                new[]
                {
                    new Vector2(0.00f, -0.28f),
                    new Vector2(0.055f, -0.26f),
                    new Vector2(0.048f, 0.22f),
                    new Vector2(0.035f, 0.28f),
                },
                12);
            return _pinShaft;
        }

        static Mesh PinHeadMesh()
        {
            if (_pinHead != null) return _pinHead;
            _pinHead = Lathe(
                "GenesisPinHead",
                new[]
                {
                    new Vector2(0.00f, -0.06f),
                    new Vector2(0.07f, -0.04f),
                    new Vector2(0.085f, 0.02f),
                    new Vector2(0.05f, 0.08f),
                    new Vector2(0.00f, 0.09f),
                },
                14);
            return _pinHead;
        }

        static Mesh PlateDiskMesh()
        {
            if (_plateDisk != null) return _plateDisk;
            _plateDisk = Lathe(
                "GenesisPlateDisk",
                new[]
                {
                    new Vector2(0.00f, -0.02f),
                    new Vector2(0.42f, -0.02f),
                    new Vector2(0.45f, 0.00f),
                    new Vector2(0.42f, 0.02f),
                    new Vector2(0.00f, 0.02f),
                },
                20);
            return _plateDisk;
        }

        static Mesh HaloRingMesh()
        {
            if (_haloRing != null) return _haloRing;
            _haloRing = Lathe(
                "GenesisHaloRing",
                new[]
                {
                    new Vector2(0.38f, -0.006f),
                    new Vector2(0.48f, -0.006f),
                    new Vector2(0.50f, 0.000f),
                    new Vector2(0.48f, 0.006f),
                    new Vector2(0.38f, 0.006f),
                },
                22);
            return _haloRing;
        }

        static Mesh _bevelBox;
        static Mesh _teakMolding;

        /// <summary>
        /// Phase C authored teak lip — XZ unit square extruded with a cabinet molding profile in Y/Z
        /// (inner undercut → top fillet → outer cascade). Keeps P0 clockwise winding fix.
        /// </summary>
        static Mesh TeakLipMoldingMesh()
        {
            if (_teakMolding != null) return _teakMolding;

            // Cross-section in (z,y) — outer edge toward +z, top toward +y. Extruded along X.
            var profile = new[]
            {
                new Vector2(-0.50f, -0.50f), // outer bottom
                new Vector2(0.42f, -0.50f),  // inner bottom
                new Vector2(0.48f, -0.18f),  // inner undercut
                new Vector2(0.40f, 0.18f),   // rise
                new Vector2(0.28f, 0.42f),   // inner top fillet
                new Vector2(-0.10f, 0.50f),  // crown
                new Vector2(-0.38f, 0.46f),  // outer top bevel
                new Vector2(-0.50f, 0.20f),  // outer cascade
            };

            const int segs = 2; // thin extrusion along X; scale handles length
            var ring = profile.Length;
            var verts = new Vector3[ring * 2];
            var uvs = new Vector2[ring * 2];
            for (var i = 0; i < ring; i++)
            {
                var p = profile[i];
                verts[i] = new Vector3(-0.5f, p.y, p.x);
                verts[i + ring] = new Vector3(0.5f, p.y, p.x);
                uvs[i] = new Vector2(0f, i / (float)(ring - 1));
                uvs[i + ring] = new Vector2(1f, i / (float)(ring - 1));
            }

            var tris = new System.Collections.Generic.List<int>(ring * 6 + 24);
            // Side walls — clockwise from outside (P0 anti-ref winding).
            for (var i = 0; i < ring; i++)
            {
                var j = (i + 1) % ring;
                var a = i;
                var b = j;
                var c = j + ring;
                var d = i + ring;
                tris.Add(a); tris.Add(d); tris.Add(c);
                tris.Add(a); tris.Add(c); tris.Add(b);
            }

            // Cap ends (approx fan) — keep outward winding.
            for (var i = 1; i < ring - 1; i++)
            {
                tris.Add(0); tris.Add(i); tris.Add(i + 1);
                tris.Add(ring); tris.Add(ring + i + 1); tris.Add(ring + i);
            }

            _ = segs;
            _teakMolding = new Mesh { name = "GenesisTeakLipMolding" };
            _teakMolding.SetVertices(verts);
            _teakMolding.SetUVs(0, uvs);
            _teakMolding.SetTriangles(tris, 0);
            _teakMolding.RecalculateNormals();
            _teakMolding.RecalculateBounds();
            return _teakMolding;
        }

        /// <summary>Legacy bevel box — retained for any residual callers; prefer TeakLipMoldingMesh.</summary>
        static Mesh BeveledBoxMesh()
        {
            if (_bevelBox != null) return _bevelBox;
            // Unit cube with slight top bevel — Unity front faces = clockwise from outside.
            var verts = new Vector3[]
            {
                new(-0.5f, -0.5f, -0.5f), new(0.5f, -0.5f, -0.5f), new(0.5f, -0.5f, 0.5f), new(-0.5f, -0.5f, 0.5f),
                new(-0.48f, 0.45f, -0.48f), new(0.48f, 0.45f, -0.48f), new(0.48f, 0.45f, 0.48f), new(-0.48f, 0.45f, 0.48f),
                new(-0.46f, 0.5f, -0.46f), new(0.46f, 0.5f, -0.46f), new(0.46f, 0.5f, 0.46f), new(-0.46f, 0.5f, 0.46f),
            };
            // Winding flipped vs the prior CCW authoring that RecalculateNormals() turned into
            // inward normals → black jagged lip silhouettes on phone (halfcooked anti-ref).
            var tris = new int[]
            {
                0,2,1, 0,3,2,
                8,9,10, 8,10,11,
                0,5,4, 0,1,5,
                1,6,5, 1,2,6,
                2,7,6, 2,3,7,
                3,4,7, 3,0,4,
                4,9,8, 4,5,9,
                5,10,9, 5,6,10,
                6,11,10, 6,7,11,
                7,8,11, 7,4,8,
            };
            _bevelBox = new Mesh { name = "GenesisTeakLip" };
            _bevelBox.SetVertices(verts);
            _bevelBox.SetTriangles(tris, 0);
            _bevelBox.RecalculateNormals();
            _bevelBox.RecalculateBounds();
            return _bevelBox;
        }

        /// <summary>Simple lathe around Y — profile is (radius, y).</summary>
        static Mesh Lathe(string name, Vector2[] profile, int segments)
        {
            segments = Mathf.Clamp(segments, 8, 32);
            var vertCount = profile.Length * segments;
            var verts = new Vector3[vertCount];
            var uvs = new Vector2[vertCount];
            for (var i = 0; i < profile.Length; i++)
            {
                for (var s = 0; s < segments; s++)
                {
                    var ang = (s / (float)segments) * Mathf.PI * 2f;
                    var idx = i * segments + s;
                    verts[idx] = new Vector3(
                        Mathf.Cos(ang) * profile[i].x,
                        profile[i].y,
                        Mathf.Sin(ang) * profile[i].x);
                    uvs[idx] = new Vector2(s / (float)segments, i / (float)(profile.Length - 1));
                }
            }

            var tris = new System.Collections.Generic.List<int>();
            for (var i = 0; i < profile.Length - 1; i++)
            {
                for (var s = 0; s < segments; s++)
                {
                    var s2 = (s + 1) % segments;
                    var a = i * segments + s;
                    var b = i * segments + s2;
                    var c = (i + 1) * segments + s2;
                    var d = (i + 1) * segments + s;
                    tris.Add(a); tris.Add(d); tris.Add(c);
                    tris.Add(a); tris.Add(c); tris.Add(b);
                }
            }

            var mesh = new Mesh { name = name };
            mesh.SetVertices(verts);
            mesh.SetUVs(0, uvs);
            mesh.SetTriangles(tris, 0);
            mesh.RecalculateNormals();
            mesh.RecalculateBounds();
            return mesh;
        }
    }
}
