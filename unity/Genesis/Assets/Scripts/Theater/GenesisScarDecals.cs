using Genesis.Core;
using UnityEngine;
#if GENESIS_URP
using UnityEngine.Rendering.Universal;
#endif

namespace Genesis.Theater
{
    /// <summary>
    /// Phase B contested-ink / scar decals — URP DecalProjector when available (Med+),
    /// else a grounded ink blot mesh that reads on every tier.
    /// </summary>
    public static class GenesisScarDecals
    {
        public static GameObject SpawnInkScar(Transform parent, Vector3 worldPos, float radius, Color ink)
        {
            if (GenesisPremiumVisuals.DecalsEnabled && TrySpawnDecalProjector(parent, worldPos, radius, ink, out var decal))
                return decal;

            return SpawnMeshScar(parent, worldPos, radius, ink);
        }

        static bool TrySpawnDecalProjector(
            Transform parent, Vector3 worldPos, float radius, Color ink, out GameObject go)
        {
            go = null;
#if GENESIS_URP
            // DecalProjector requires a Decal renderer feature on the URP asset.
            // Probe type without hard compile dependency when feature missing at runtime.
            var decalType = System.Type.GetType(
                "UnityEngine.Rendering.Universal.DecalProjector, Unity.RenderPipelines.Universal.Runtime");
            if (decalType == null) return false;

            go = new GameObject("ScarDecal");
            go.transform.SetParent(parent, false);
            go.transform.position = worldPos + Vector3.up * 0.35f;
            go.transform.rotation = Quaternion.Euler(90f, 0f, 0f);

            var projector = go.AddComponent(decalType);
            // Size / UV via reflection — keeps compile safe if API shifts.
            TrySet(projector, "size", new Vector3(radius * 2.2f, 1.2f, radius * 2.2f));
            TrySet(projector, "fadeScale", 0.85f);
            TrySet(projector, "startAngleFade", 0.1f);
            TrySet(projector, "endAngleFade", 0.6f);

            var mat = TheaterMaterialFactory.Unlit(
                new Color(ink.r, ink.g, ink.b, 0.55f), "GenesisScarDecalMat");
            TrySet(projector, "material", mat);
            return true;
#else
            return false;
#endif
        }

        static GameObject SpawnMeshScar(Transform parent, Vector3 worldPos, float radius, Color ink)
        {
            var go = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            go.name = "ScarInkBlot";
            go.transform.SetParent(parent, false);
            go.transform.position = worldPos + Vector3.up * 0.04f;
            go.transform.localScale = new Vector3(radius * 2f, 0.012f, radius * 2f);
            var col = go.GetComponent<Collider>();
            if (col != null) Object.Destroy(col);
            var mr = go.GetComponent<MeshRenderer>();
            if (mr != null)
            {
                var c = ink;
                c.a = 0.55f;
                mr.sharedMaterial = TheaterMaterialFactory.Lit(
                    c, metallic: 0.05f, smoothness: 0.25f, emission: ink * 0.08f, alpha: c.a);
            }

            return go;
        }

        static void TrySet(object target, string property, object value)
        {
            if (target == null) return;
            var p = target.GetType().GetProperty(property,
                System.Reflection.BindingFlags.Instance |
                System.Reflection.BindingFlags.Public |
                System.Reflection.BindingFlags.IgnoreCase);
            if (p != null && p.CanWrite)
            {
                try { p.SetValue(target, value); }
                catch { /* ignore */ }
                return;
            }

            var f = target.GetType().GetField(property,
                System.Reflection.BindingFlags.Instance |
                System.Reflection.BindingFlags.Public |
                System.Reflection.BindingFlags.IgnoreCase);
            if (f != null)
            {
                try { f.SetValue(target, value); }
                catch { /* ignore */ }
            }
        }
    }
}
