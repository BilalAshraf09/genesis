using UnityEngine;
using UnityEngine.Rendering;

namespace Genesis.Theater
{
    /// <summary>
    /// Shared URP material presets for the command-theater board.
    /// Runtime-only — never falls back to Built-in Standard / Unlit/Color (magenta under URP).
    /// </summary>
    public static class TheaterMaterialFactory
    {
        const string UrpLitName = "Universal Render Pipeline/Lit";
        const string UrpSimpleLitName = "Universal Render Pipeline/Simple Lit";
        const string UrpUnlitName = "Universal Render Pipeline/Unlit";
        const string UrpParticlesUnlitName = "Universal Render Pipeline/Particles/Unlit";
        const string SpritesDefaultName = "Sprites/Default";

        // Stable URP package shader GUIDs (Lit / Unlit / Particles Unlit) — used when Find misses.
        const string UrpLitGuid = "933532a4fcc9baf4fa0491de14d08ed7";
        const string UrpUnlitGuid = "650dd9526735d5b46b79224bc6e94025";
        const string UrpParticlesUnlitGuid = "0406db5a47d1d014ebf53d13ed9d1d5f";

        static Shader _lit;
        static Shader _unlit;
        static Shader _particlesUnlit;
        static bool _litWarned;
        static bool _unlitWarned;
        static bool _particlesWarned;

        public static Material Lit(
            Color baseColor,
            float metallic = 0.2f,
            float smoothness = 0.45f,
            Color? emission = null,
            float alpha = 1f)
        {
            var c = baseColor;
            c.a = alpha;
            var shader = ResolveLitShader();
            var mat = new Material(shader) { name = "GenesisLit" };
            SetColor(mat, c);
            if (mat.HasProperty("_Metallic")) mat.SetFloat("_Metallic", metallic);
            if (mat.HasProperty("_Smoothness")) mat.SetFloat("_Smoothness", smoothness);
            if (emission.HasValue)
            {
                ApplyEmission(mat, emission.Value);
            }

            if (alpha < 0.99f)
            {
                ApplyTransparentSurface(mat);
            }

            return mat;
        }

        public static Material Unlit(Color tint, string name = "GenesisUnlit")
        {
            var shader = ResolveUnlitShader();
            var mat = new Material(shader) { name = name };
            SetColor(mat, tint);
            if (tint.a < 0.99f)
            {
                ApplyTransparentSurface(mat);
            }

            return mat;
        }

        /// <summary>URP Particles/Unlit — never Built-in Particles/Standard Unlit.</summary>
        public static Material ParticlesUnlit(Color tint, string name = "GenesisParticlesUnlit")
        {
            var shader = ResolveParticlesUnlitShader();
            var mat = new Material(shader) { name = name };
            SetColor(mat, tint);
            return mat;
        }

        public static Material DeepWater(Color water)
        {
            // AAA Phase 1: deep ink basin — land/water value step must survive desat silhouette.
            var ink = Color.Lerp(water, new Color(0.012f, 0.03f, 0.06f, 1f), 0.68f);
            ink = Color.Lerp(ink, new Color(0.008f, 0.022f, 0.048f, 1f), 0.45f);
            return Lit(ink, metallic: 0.035f, smoothness: 0.76f, emission: Color.black);
        }

        /// <summary>
        /// Prefer Genesis/InkWater (quiet foam rim) when shader is present; else DeepWater Lit.
        /// Shader Graph coast deferred — HLSL URP shader ships the same visual job without Editor graphs.
        /// </summary>
        public static Material InkWater(Color water, Texture2D coastMask = null)
        {
            var shader = Shader.Find("Genesis/InkWater");
            if (shader == null || !shader.isSupported)
            {
                return DeepWater(water);
            }

            var ink = Color.Lerp(water, new Color(0.012f, 0.03f, 0.06f, 1f), 0.68f);
            ink = Color.Lerp(ink, new Color(0.008f, 0.022f, 0.048f, 1f), 0.45f);
            ink.a = 0.99f;
            var mat = new Material(shader) { name = "GenesisInkWater" };
            if (mat.HasProperty("_BaseColor")) mat.SetColor("_BaseColor", ink);
            if (mat.HasProperty("_FoamColor"))
                mat.SetColor("_FoamColor", new Color(0.82f, 0.72f, 0.52f, 0.62f));
            if (mat.HasProperty("_Smoothness")) mat.SetFloat("_Smoothness", 0.76f);
            if (mat.HasProperty("_FoamWidth")) mat.SetFloat("_FoamWidth", coastMask != null ? 0.14f : 0.2f);
            if (mat.HasProperty("_FoamSoft")) mat.SetFloat("_FoamSoft", 0.16f);
            if (coastMask != null && mat.HasProperty("_CoastMask"))
            {
                mat.SetTexture("_CoastMask", coastMask);
                if (mat.HasProperty("_UseMask")) mat.SetFloat("_UseMask", 1f);
            }
            else if (mat.HasProperty("_UseMask"))
            {
                mat.SetFloat("_UseMask", 0f);
            }

            return mat;
        }

        /// <summary>Outer shelf under coast foam — darker, quieter read past the coast rim.</summary>
        public static Material DeepShelf()
        {
            return Lit(
                new Color(0.008f, 0.02f, 0.042f, 1f),
                metallic: 0.035f,
                smoothness: 0.74f,
                emission: Color.black);
        }

        /// <summary>Warm parchment foam — bright coast rim so India outline reads ≤2s.</summary>
        public static Material CoastFoam(Texture2D mask = null)
        {
            var alpha = mask != null ? 0.36f : 0.48f;
            var mat = Lit(
                new Color(0.84f, 0.74f, 0.54f, alpha),
                metallic: 0.02f,
                smoothness: 0.48f,
                emission: Color.black,
                alpha: alpha);
            if (mask != null)
            {
                ApplyBaseMap(mat, mask);
                if (mat.HasProperty("_Cutoff")) mat.SetFloat("_Cutoff", 0.3f);
                if (mat.HasProperty("_AlphaClip"))
                {
                    mat.SetFloat("_AlphaClip", 1f);
                    mat.EnableKeyword("_ALPHATEST_ON");
                }
            }

            return mat;
        }

        /// <summary>Warm teak lip — wood frame reads vs ink basin; never void-black wedge.</summary>
        public static Material TableLip()
        {
            return Lit(
                new Color(0.4f, 0.26f, 0.13f, 1f),
                metallic: 0.08f,
                smoothness: 0.34f,
                emission: Color.black);
        }

        /// <summary>Matte void skirt under the table — kept dark but off the map strip.</summary>
        public static Material VoidSkirt()
        {
            return Lit(
                new Color(0.04f, 0.035f, 0.038f, 1f),
                metallic: 0.02f,
                smoothness: 0.08f,
                emission: Color.black);
        }

        public static Material OpsGrid()
        {
            // Phase 1: mute to near-zero — toy HUD grid fights the ops table.
            return Lit(
                new Color(0.2f, 0.22f, 0.2f, 0.01f),
                metallic: 0.02f,
                smoothness: 0.2f,
                emission: Color.black,
                alpha: 0.01f);
        }

        /// <summary>Tension zone wash — transparent ops highlight over geography.</summary>
        public static Material ZoneWash(Color wash, float tension)
        {
            var t = Mathf.Clamp01(tension);
            // Warm ink wash — no cyan/neon bloom fuel.
            wash = Color.Lerp(wash, new Color(0.45f, 0.32f, 0.18f), 0.45f);
            wash.a = 0.1f + t * 0.06f;
            return Lit(
                wash,
                metallic: 0.08f,
                smoothness: 0.35f,
                emission: wash * (0.08f + t * 0.12f),
                alpha: wash.a);
        }

        /// <summary>
        /// Idle intel pin — deep brass BELOW parchment midtones (clear value step vs land).
        /// Half-cooked anti-ref failed because bronze pegs melted into olive land.
        /// </summary>
        public static Material BeaconIdle()
        {
            // Slightly lifted brass vs olive land — holds under squint without neon.
            return Lit(
                new Color(0.34f, 0.22f, 0.09f, 1f),
                metallic: 0.76f,
                smoothness: 0.5f,
                emission: new Color(0.5f, 0.34f, 0.12f) * 0.22f);
        }

        /// <summary>Selected intel pin — bright ember ABOVE land; restrained emission, no neon.</summary>
        public static Material BeaconSelected()
        {
            return Lit(
                new Color(0.82f, 0.56f, 0.24f, 1f),
                metallic: 0.72f,
                smoothness: 0.46f,
                emission: new Color(0.9f, 0.5f, 0.16f) * 0.34f);
        }

        /// <summary>Matte parchment/clay land — lifted midtones so India silhouette survives desat.</summary>
        public static Material LandOps(Color land)
        {
            // AAA Phase 1: parchment lifts vs deep ink; brass pins read darker against this band.
            var parchment = Color.Lerp(land, new Color(0.6f, 0.5f, 0.34f), 0.64f);
            parchment = Color.Lerp(parchment, new Color(0.66f, 0.56f, 0.38f), 0.34f);
            return Lit(parchment, metallic: 0.03f, smoothness: 0.16f);
        }

        /// <summary>
        /// Geographic land: terrain albedo muted into parchment, relief as bump + occlusion.
        /// Prefers Genesis/Land (Phase B Shader Graph contract) when present; else URP Lit.
        /// </summary>
        public static Material LandOpsTextured(
            Color land, Texture2D albedo, Texture2D relief = null, Texture2D mask = null)
        {
            var landShader = Shader.Find("Genesis/Land");
            if (landShader != null && landShader.isSupported)
                return LandShaderGraph(land, albedo, relief, mask, landShader);

            var mat = LandOps(land);
            if (albedo != null)
            {
                ApplyBaseMap(mat, albedo);
                // Keep parchment read — multiply tint so JPG doesn't go neon-photo.
                var parchment = Color.Lerp(land, new Color(0.62f, 0.52f, 0.34f), 0.52f);
                parchment.a = 1f;
                SetColor(mat, parchment);
            }
            else if (relief != null)
            {
                ApplyBaseMap(mat, relief);
            }

            // Always consume relief when present — biggest free map upgrade.
            ApplyReliefMaps(mat, relief);
            ApplyLandMask(mat, mask);

            if (mat.HasProperty("_Smoothness")) mat.SetFloat("_Smoothness", 0.16f);
            if (mat.HasProperty("_Metallic")) mat.SetFloat("_Metallic", 0.03f);
            return mat;
        }

        /// <summary>Phase B Genesis/Land — parchment × relief × coast mask.</summary>
        public static Material LandShaderGraph(
            Color land, Texture2D albedo, Texture2D relief, Texture2D mask, Shader shader = null)
        {
            shader ??= Shader.Find("Genesis/Land");
            if (shader == null || !shader.isSupported)
                return LandOps(land);

            var parchment = Color.Lerp(land, new Color(0.62f, 0.52f, 0.34f), 0.52f);
            parchment.a = 1f;
            var mat = new Material(shader) { name = "GenesisLand" };
            if (mat.HasProperty("_BaseColor")) mat.SetColor("_BaseColor", parchment);
            if (albedo != null && mat.HasProperty("_BaseMap")) mat.SetTexture("_BaseMap", albedo);
            else if (relief != null && mat.HasProperty("_BaseMap")) mat.SetTexture("_BaseMap", relief);

            var normal = relief != null ? MapTextureLibrary.ReliefToNormal(relief, 2.8f) : null;
            if (normal != null && mat.HasProperty("_BumpMap"))
            {
                mat.SetTexture("_BumpMap", normal);
                if (mat.HasProperty("_BumpScale")) mat.SetFloat("_BumpScale", 0.95f);
            }

            if (relief != null && mat.HasProperty("_OcclusionMap"))
            {
                mat.SetTexture("_OcclusionMap", relief);
                if (mat.HasProperty("_OcclusionStrength")) mat.SetFloat("_OcclusionStrength", 0.62f);
            }

            if (mask != null && mat.HasProperty("_CoastMask"))
            {
                mat.SetTexture("_CoastMask", mask);
                if (mat.HasProperty("_UseMask")) mat.SetFloat("_UseMask", 1f);
            }
            else if (mat.HasProperty("_UseMask"))
            {
                mat.SetFloat("_UseMask", 0f);
            }

            if (mat.HasProperty("_Smoothness")) mat.SetFloat("_Smoothness", 0.16f);
            if (mat.HasProperty("_Metallic")) mat.SetFloat("_Metallic", 0.03f);
            if (mat.HasProperty("_MicroDetail")) mat.SetFloat("_MicroDetail", 0.12f);
            return mat;
        }

        /// <summary>Drive URP Lit bump + occlusion from soft relief height PNGs.</summary>
        public static void ApplyReliefMaps(Material mat, Texture2D relief)
        {
            if (mat == null || relief == null) return;

            var normal = MapTextureLibrary.ReliefToNormal(relief, 2.6f);
            if (normal != null && mat.HasProperty("_BumpMap"))
            {
                mat.SetTexture("_BumpMap", normal);
                mat.EnableKeyword("_NORMALMAP");
                if (mat.HasProperty("_BumpScale")) mat.SetFloat("_BumpScale", 0.85f);
            }

            // Soft AO from the same height field — lands pop under the desk lamp.
            if (mat.HasProperty("_OcclusionMap"))
            {
                mat.SetTexture("_OcclusionMap", relief);
                if (mat.HasProperty("_OcclusionStrength")) mat.SetFloat("_OcclusionStrength", 0.55f);
            }
        }

        /// <summary>
        /// Consume mask PNGs for silhouette crispness (occlusion / detail).
        /// Avoid alpha-clip on extruded geo — UVs won't match mask space.
        /// </summary>
        public static void ApplyLandMask(Material mat, Texture2D mask)
        {
            if (mat == null || mask == null) return;

            // Prefer occlusion when relief didn't claim it; else multiply as detail albedo.
            if (mat.HasProperty("_OcclusionMap") && mat.GetTexture("_OcclusionMap") == null)
            {
                mat.SetTexture("_OcclusionMap", mask);
                if (mat.HasProperty("_OcclusionStrength")) mat.SetFloat("_OcclusionStrength", 0.45f);
                return;
            }

            if (mat.HasProperty("_DetailAlbedoMap"))
            {
                mat.SetTexture("_DetailAlbedoMap", mask);
                mat.EnableKeyword("_DETAIL_MULX2");
                if (mat.HasProperty("_DetailAlbedoMapScale")) mat.SetFloat("_DetailAlbedoMapScale", 0.35f);
            }
        }

        public static void ApplyBaseMap(Material mat, Texture tex)
        {
            if (mat == null || tex == null) return;
            if (mat.HasProperty("_BaseMap")) mat.SetTexture("_BaseMap", tex);
            if (mat.HasProperty("_MainTex")) mat.SetTexture("_MainTex", tex);
            mat.mainTexture = tex;
        }

        /// <summary>Cliff/edge strip under extruded land — dark undercut sells coast silhouette.</summary>
        public static Material LandCliff(Color land)
        {
            var cliff = Color.Lerp(land, new Color(0.05f, 0.038f, 0.028f), 0.72f);
            return Lit(cliff, metallic: 0.08f, smoothness: 0.16f, emission: Color.black);
        }

        /// <summary>Border / corridor — soft ink line, not neon tube.</summary>
        public static Material BorderGlow(Color accent)
        {
            var ink = Color.Lerp(accent, new Color(0.28f, 0.16f, 0.08f), 0.42f);
            return Lit(
                ink,
                metallic: 0.18f,
                smoothness: 0.3f,
                emission: ink * 0.14f);
        }

        /// <summary>Soft ground wash under a selected pin (transparent) — brass, never cyan.</summary>
        public static Material BeaconCone(bool selected)
        {
            var tint = selected
                ? new Color(0.58f, 0.4f, 0.16f, 0.12f)
                : new Color(0.16f, 0.12f, 0.07f, 0.03f);
            return Lit(
                tint,
                metallic: 0.05f,
                smoothness: 0.35f,
                emission: (selected
                    ? new Color(0.5f, 0.3f, 0.1f)
                    : Color.black) * 0.1f,
                alpha: tint.a);
        }

        /// <summary>City pin — deep bronze chip darker than lifted parchment land.</summary>
        public static Material CityPin(Color landHi)
        {
            var pin = Color.Lerp(landHi, new Color(0.3f, 0.2f, 0.09f), 0.72f);
            return Lit(pin, metallic: 0.7f, smoothness: 0.44f, emission: pin * 0.06f);
        }

        /// <summary>Quiet city name plate — opaque ink for parchment contrast.</summary>
        public static Material CityPlate()
        {
            return Unlit(new Color(0.03f, 0.025f, 0.018f, 0.86f), "CityPlate");
        }

        /// <summary>Hotspot label plate — grounded ink; selected warm parchment dark.</summary>
        public static Material HotspotPlate(bool selected)
        {
            var c = selected
                ? new Color(0.14f, 0.09f, 0.04f, 0.94f)
                : new Color(0.035f, 0.03f, 0.022f, 0.92f);
            return Unlit(c, selected ? "HotspotPlateSelected" : "HotspotPlate");
        }

        public static void SetColor(Material mat, Color c)
        {
            if (mat == null) return;
            if (mat.HasProperty("_BaseColor")) mat.SetColor("_BaseColor", c);
            if (mat.HasProperty("_Color")) mat.SetColor("_Color", c);
            // Avoid Material.color when neither property exists (Sprites/Default uses _Color).
            try { mat.color = c; } catch { /* some emergency shaders reject .color */ }
        }

        public static void ApplyEmission(Material mat, Color e)
        {
            if (mat == null) return;
            if (!mat.HasProperty("_EmissionColor")) return;
            mat.EnableKeyword("_EMISSION");
            mat.SetColor("_EmissionColor", e);
            mat.globalIlluminationFlags = MaterialGlobalIlluminationFlags.RealtimeEmissive;
        }

        /// <summary>
        /// Replace any Built-in / Error / missing shaders on renderers under root with valid URP mats.
        /// Call after board Build so CreatePrimitive defaults cannot leave magenta.
        /// </summary>
        public static int SanitizeRenderers(Transform root)
        {
            if (root == null) return 0;
            var fixedCount = 0;
            var renderers = root.GetComponentsInChildren<Renderer>(true);
            foreach (var r in renderers)
            {
                if (r == null) continue;
                var mats = r.sharedMaterials;
                if (mats == null || mats.Length == 0)
                {
                    r.sharedMaterial = DeepWater(new Color(0.03f, 0.11f, 0.18f));
                    fixedCount++;
                    continue;
                }

                var dirty = false;
                for (var i = 0; i < mats.Length; i++)
                {
                    if (!IsBrokenOrBuiltIn(mats[i])) continue;
                    mats[i] = CloneSafeReplacement(mats[i], r.name);
                    dirty = true;
                    fixedCount++;
                }

                if (dirty) r.sharedMaterials = mats;
            }

            return fixedCount;
        }

        public static bool IsBrokenOrBuiltIn(Material mat)
        {
            if (mat == null) return true;
            var shader = mat.shader;
            if (shader == null) return true;
            var n = shader.name ?? "";
            if (string.IsNullOrEmpty(n)) return true;
            if (n.Contains("InternalError") || n.Contains("Hidden/InternalError")) return true;
            // Built-in names that render magenta under URP.
            if (n == "Standard" || n == "Standard (Specular setup)" || n == "Standard (Roughness setup)")
                return true;
            if (n == "Unlit/Color" || n == "Unlit/Texture" || n == "Unlit/Transparent")
                return true;
            if (n.StartsWith("Particles/Standard") || n == "Particles/Standard Unlit")
                return true;
            if (n.StartsWith("Legacy Shaders/")) return true;
            if (n == "Hidden/InternalErrorShader") return true;
            return false;
        }

        static Material CloneSafeReplacement(Material broken, string contextName)
        {
            var tint = new Color(0.03f, 0.11f, 0.18f, 1f);
            if (broken != null)
            {
                if (broken.HasProperty("_BaseColor")) tint = broken.GetColor("_BaseColor");
                else if (broken.HasProperty("_Color")) tint = broken.GetColor("_Color");
            }

            // Prefer unlit for transparent-ish / plate-like; lit for opaque board surfaces.
            if (tint.a < 0.95f)
            {
                var u = Unlit(tint, $"SanitizedUnlit_{contextName}");
                return u;
            }

            return Lit(tint, metallic: 0.1f, smoothness: 0.4f);
        }

        static void ApplyTransparentSurface(Material mat)
        {
            if (mat == null) return;
            if (mat.HasProperty("_Surface")) mat.SetFloat("_Surface", 1f);
            if (mat.HasProperty("_Blend")) mat.SetFloat("_Blend", 0f);
            if (mat.HasProperty("_SrcBlend")) mat.SetFloat("_SrcBlend", (float)BlendMode.SrcAlpha);
            if (mat.HasProperty("_DstBlend")) mat.SetFloat("_DstBlend", (float)BlendMode.OneMinusSrcAlpha);
            if (mat.HasProperty("_SrcBlendAlpha")) mat.SetFloat("_SrcBlendAlpha", (float)BlendMode.One);
            if (mat.HasProperty("_DstBlendAlpha")) mat.SetFloat("_DstBlendAlpha", (float)BlendMode.OneMinusSrcAlpha);
            if (mat.HasProperty("_ZWrite")) mat.SetFloat("_ZWrite", 0f);
            mat.SetOverrideTag("RenderType", "Transparent");
            mat.renderQueue = (int)RenderQueue.Transparent;
            mat.EnableKeyword("_SURFACE_TYPE_TRANSPARENT");
            mat.DisableKeyword("_ALPHAPREMULTIPLY_ON");
        }

        static Shader ResolveLitShader()
        {
            if (IsUsable(_lit)) return _lit;

            _lit = FindUrpShader(UrpLitName)
                   ?? FindUrpShader(UrpSimpleLitName)
                   ?? LoadFromResourcesTemplate("GenesisMaterials/GenesisLitTemplate")
                   ?? FindUrpShader(SpritesDefaultName);

            if (!IsUsable(_lit))
            {
                if (!_litWarned)
                {
                    _litWarned = true;
                    Debug.LogError(
                        "[Genesis] URP Lit shader missing — theater materials will use Sprites/Default. " +
                        "Open project with URP imported, then Genesis → Ensure URP Pipeline Assets.");
                }

                _lit = FindUrpShader(SpritesDefaultName);
            }

            if (!IsUsable(_lit))
            {
                // Absolute last resort: create a stub that still won't be Built-in Standard.
                _lit = Shader.Find(SpritesDefaultName);
            }

            return _lit;
        }

        static Shader ResolveUnlitShader()
        {
            if (IsUsable(_unlit)) return _unlit;

            _unlit = FindUrpShader(UrpUnlitName)
                     ?? LoadFromResourcesTemplate("GenesisMaterials/GenesisUnlitTemplate")
                     ?? FindUrpShader(SpritesDefaultName);

            if (!IsUsable(_unlit))
            {
                if (!_unlitWarned)
                {
                    _unlitWarned = true;
                    Debug.LogError("[Genesis] URP Unlit shader missing — plates fall back to Sprites/Default.");
                }

                _unlit = FindUrpShader(SpritesDefaultName);
            }

            return _unlit;
        }

        static Shader ResolveParticlesUnlitShader()
        {
            if (IsUsable(_particlesUnlit)) return _particlesUnlit;

            _particlesUnlit = FindUrpShader(UrpParticlesUnlitName)
                              ?? LoadFromResourcesTemplate("GenesisMaterials/GenesisParticlesUnlitTemplate")
                              ?? ResolveUnlitShader();

            if (!IsUsable(_particlesUnlit))
            {
                if (!_particlesWarned)
                {
                    _particlesWarned = true;
                    Debug.LogError("[Genesis] URP Particles/Unlit missing — EXECUTE FX uses Unlit fallback.");
                }

                _particlesUnlit = ResolveUnlitShader();
            }

            return _particlesUnlit;
        }

        static Shader FindUrpShader(string name)
        {
            if (string.IsNullOrEmpty(name)) return null;
            var s = Shader.Find(name);
            if (!IsUsable(s)) return null;
            // Reject Built-in names even if somehow returned.
            var n = s.name ?? "";
            if (n == "Standard" || n.StartsWith("Unlit/") || n.StartsWith("Particles/Standard") ||
                n.StartsWith("Legacy Shaders/") || n.Contains("InternalError"))
            {
                return null;
            }

            return s;
        }

        static Shader LoadFromResourcesTemplate(string resourcesPath)
        {
            var mat = Resources.Load<Material>(resourcesPath);
            if (mat != null && IsUsable(mat.shader) && !IsBrokenOrBuiltIn(mat))
            {
                return mat.shader;
            }

            return null;
        }

        static bool IsUsable(Shader shader)
        {
            return shader != null && !string.IsNullOrEmpty(shader.name) &&
                   !shader.name.Contains("InternalError");
        }

#if UNITY_EDITOR
        /// <summary>Editor-only: force shader cache refresh after package import.</summary>
        public static void ClearShaderCache()
        {
            _lit = null;
            _unlit = null;
            _particlesUnlit = null;
            _litWarned = false;
            _unlitWarned = false;
            _particlesWarned = false;
        }

        public static string LitShaderNameForValidate() => UrpLitName;
        public static string UnlitShaderNameForValidate() => UrpUnlitName;
        public static string ParticlesShaderNameForValidate() => UrpParticlesUnlitName;
        public static string LitGuidForValidate() => UrpLitGuid;
        public static string UnlitGuidForValidate() => UrpUnlitGuid;
        public static string ParticlesGuidForValidate() => UrpParticlesUnlitGuid;
#endif
    }
}
