using UnityEngine;

namespace Genesis.Effects
{
    /// <summary>
    /// Phase C — High-tier desk dust resource. Prefer Resources/GenesisVFX/DeskDust;
    /// factory builds a richer ParticleSystem when the prefab is not yet authored.
    /// Mandatory Low/Med path remains WorldReactionFX DustPlume fallback.
    /// </summary>
    public static class GenesisDeskDustFactory
    {
        const string ResourcePath = "GenesisVFX/DeskDust";

        public static GameObject Spawn(Vector3 worldPos, float intensityMul = 1f)
        {
            var prefab = Resources.Load<GameObject>(ResourcePath);
            if (prefab != null)
            {
                var inst = Object.Instantiate(prefab, worldPos, Quaternion.identity);
                ScaleBurst(inst, intensityMul);
                Object.Destroy(inst, 2.6f);
                return inst;
            }

            var go = BuildRuntime(worldPos, intensityMul);
            Object.Destroy(go, 2.6f);
            return go;
        }

        /// <summary>Editor / Rebuild builds the Resources prefab from this same recipe.</summary>
        public static GameObject BuildRuntime(Vector3 worldPos, float intensityMul = 1f)
        {
            var go = new GameObject("DeskDust");
            go.transform.position = worldPos;
            var ps = go.AddComponent<ParticleSystem>();
            Configure(ps, intensityMul);

            var renderer = go.GetComponent<ParticleSystemRenderer>();
            if (renderer != null)
            {
                var mat = Resources.Load<Material>("GenesisMaterials/GenesisParticlesUnlitTemplate");
                if (mat != null) renderer.sharedMaterial = mat;
                renderer.renderMode = ParticleSystemRenderMode.Billboard;
            }

            ps.Play(true);
            return go;
        }

        public static void Configure(ParticleSystem ps, float intensityMul = 1f)
        {
            var mul = Mathf.Clamp(intensityMul, 0.35f, 1.6f);
            var main = ps.main;
            main.playOnAwake = true;
            main.loop = false;
            main.duration = 1.4f;
            main.startLifetime = new ParticleSystem.MinMaxCurve(0.7f, 1.35f);
            main.startSpeed = new ParticleSystem.MinMaxCurve(0.12f * mul, 0.95f * mul);
            main.startSize = new ParticleSystem.MinMaxCurve(0.06f, 0.32f * mul);
            main.startColor = new ParticleSystem.MinMaxGradient(
                new Color(0.55f, 0.44f, 0.3f, 0.55f),
                new Color(0.2f, 0.16f, 0.12f, 0.08f));
            main.maxParticles = 96;
            main.gravityModifier = 0.22f;
            main.simulationSpace = ParticleSystemSimulationSpace.World;
            main.startRotation = new ParticleSystem.MinMaxCurve(0f, Mathf.PI * 2f);

            var emission = ps.emission;
            emission.rateOverTime = 0f;
            var burst = Mathf.Clamp(Mathf.RoundToInt(42 * mul), 24, 72);
            emission.SetBursts(new[] { new ParticleSystem.Burst(0.02f, (short)burst) });

            var shape = ps.shape;
            shape.shapeType = ParticleSystemShapeType.Hemisphere;
            shape.radius = 0.28f * mul;

            var colorOverLife = ps.colorOverLifetime;
            colorOverLife.enabled = true;
            var grad = new Gradient();
            grad.SetKeys(
                new[]
                {
                    new GradientColorKey(new Color(0.62f, 0.5f, 0.34f), 0f),
                    new GradientColorKey(new Color(0.28f, 0.22f, 0.16f), 1f),
                },
                new[]
                {
                    new GradientAlphaKey(0.5f, 0f),
                    new GradientAlphaKey(0.22f, 0.45f),
                    new GradientAlphaKey(0f, 1f),
                });
            colorOverLife.color = new ParticleSystem.MinMaxGradient(grad);

            var sizeOverLife = ps.sizeOverLifetime;
            sizeOverLife.enabled = true;
            sizeOverLife.size = new ParticleSystem.MinMaxCurve(1f, AnimationCurve.Linear(0f, 1f, 1f, 0.35f));

            var noise = ps.noise;
            noise.enabled = true;
            noise.strength = 0.18f;
            noise.frequency = 0.35f;
            noise.scrollSpeed = 0.12f;
        }

        static void ScaleBurst(GameObject root, float mul)
        {
            var ps = root.GetComponent<ParticleSystem>();
            if (ps == null || Mathf.Approximately(mul, 1f)) return;
            var main = ps.main;
            main.startSize = new ParticleSystem.MinMaxCurve(0.06f * mul, 0.32f * mul);
            main.startSpeed = new ParticleSystem.MinMaxCurve(0.12f * mul, 0.95f * mul);
        }
    }
}
