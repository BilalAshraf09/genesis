using UnityEngine;
using UnityEngine.Rendering;
#if GENESIS_URP
using UnityEngine.Rendering.Universal;
#endif

namespace Genesis.Core
{
    /// <summary>
    /// Phase B Premium — tier-gated SSAO/bloom weight, decal scars, High-tier VFX preference.
    /// Does not touch P0 Render Scale / mesh / HUD (closed @ b51f18f).
    /// </summary>
    public static class GenesisPremiumVisuals
    {
        public enum Tier
        {
            Low = 0,
            Medium = 1,
            High = 2,
        }

        public static Tier Current { get; private set; } = Tier.Medium;

        public static bool DecalsEnabled => Current >= Tier.Medium;
        public static bool SsaoDesired => Current >= Tier.Medium;
        public static bool VfxGraphDesired => Current >= Tier.High;
        public static bool CmNoiseEnabled => Current >= Tier.Medium;

        public static void ApplyForCurrentQuality()
        {
            Current = ResolveTier();
            ApplyBloomByTier();
            ApplySsaoKeyword();
            Debug.Log($"[Genesis] Phase B premium visuals → {Current} (decals={DecalsEnabled}, ssao={SsaoDesired}, vfx={VfxGraphDesired})");
        }

        public static Tier ResolveTier()
        {
            var q = QualitySettings.GetQualityLevel();
            // Very Low=0 Low=1 Medium=2 High=3+
            if (q <= 1) return Tier.Low;
            if (q == 2) return Tier.Medium;
            return Tier.High;
        }

        static void ApplyBloomByTier()
        {
            var volumes = Object.FindObjectsByType<Volume>(FindObjectsSortMode.None);
            foreach (var volume in volumes)
            {
                if (volume == null) continue;
                var profile = volume.profile != null ? volume.profile : volume.sharedProfile;
                if (profile == null) continue;
#if GENESIS_URP
                if (!profile.TryGet(out Bloom bloom) || bloom == null) continue;
                var intensity = Current switch
                {
                    Tier.Low => 0.12f,
                    Tier.Medium => 0.28f,
                    _ => 0.34f,
                };
                bloom.intensity.Override(intensity);
                bloom.threshold.Override(Current == Tier.High ? 0.92f : 0.98f);
#endif
            }
        }

        static void ApplySsaoKeyword()
        {
            // Renderer-feature SSAO is authored on Genesis_URP_Renderer when present.
            // Runtime mirrors desire via global keyword / soft contact darkening fallback flag.
            if (SsaoDesired)
                Shader.EnableKeyword("GENESIS_SSAO_DESIRED");
            else
                Shader.DisableKeyword("GENESIS_SSAO_DESIRED");
        }
    }
}
