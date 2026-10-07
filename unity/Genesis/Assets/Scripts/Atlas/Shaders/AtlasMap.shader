// Genesis/AtlasMap — Night Atlas map surface shader
// URP Unlit pass. Supports Vulkan, GLES3, Metal.
// Samples: 1×mask + 4×relief(neighbours) + 1×terrain = 6 total.
// Hillshade computed from NW light across a height-map.
// Crisp coast edge via fwidth on the mask gradient.

Shader "Genesis/AtlasMap"
{
    Properties
    {
        [NoScaleOffset] _MaskTex    ("Land Mask (R=1 land)", 2D)        = "white" {}
        [NoScaleOffset] _ReliefTex  ("Relief / Height Map (R)", 2D)    = "gray"  {}
        [NoScaleOffset] _TerrainTex ("Terrain Albedo (desaturated)", 2D) = "gray" {}

        _LandLow      ("Land Low Colour",    Color) = (0.173, 0.227, 0.180, 1)
        _LandHigh     ("Land High Colour",   Color) = (0.420, 0.416, 0.333, 1)
        _Ocean        ("Ocean Colour",       Color) = (0.043, 0.071, 0.125, 1)
        _CoastColor   ("Coast Ring Colour",  Color) = (0.788, 0.725, 0.561, 0.55)
        _ShallowColor ("Shallow Water",      Color) = (0.071, 0.188, 0.286, 1)
        _HillshadeStr ("Hillshade Strength", Range(0, 3)) = 1.4
        _TerrainBlend ("Terrain Blend",      Range(0, 1)) = 0.22
    }

    SubShader
    {
        Tags
        {
            "RenderType"      = "Opaque"
            "RenderPipeline"  = "UniversalPipeline"
            "Queue"           = "Geometry"
            "IgnoreProjector" = "True"
        }
        LOD 100
        Cull Back
        ZWrite On
        ZTest LEqual

        Pass
        {
            Name "UniversalForward"
            Tags { "LightMode" = "UniversalForward" }

            HLSLPROGRAM
            #pragma vertex   Vert
            #pragma fragment Frag
            #pragma target 3.0
            #pragma prefer_hlslcc gles
            #pragma exclude_renderers d3d11_9x

            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Core.hlsl"

            // ── Texture declarations ───────────────────────────────────────
            TEXTURE2D(_MaskTex);    SAMPLER(sampler_MaskTex);
            TEXTURE2D(_ReliefTex);  SAMPLER(sampler_ReliefTex);
            TEXTURE2D(_TerrainTex); SAMPLER(sampler_TerrainTex);

            // ── Per-material CBUFFER ────────────────────────────────────────
            CBUFFER_START(UnityPerMaterial)
                float4 _LandLow;
                float4 _LandHigh;
                float4 _Ocean;
                float4 _CoastColor;
                float4 _ShallowColor;
                float  _HillshadeStr;
                float  _TerrainBlend;
                // Auto-populated by Unity from the texture: (1/w, 1/h, w, h)
                float4 _ReliefTex_TexelSize;
            CBUFFER_END

            // ── Vertex input/output ─────────────────────────────────────────
            struct Attributes
            {
                float4 positionOS : POSITION;
                float2 uv         : TEXCOORD0;
                UNITY_VERTEX_INPUT_INSTANCE_ID
            };

            struct Varyings
            {
                float4 positionHCS : SV_POSITION;
                float2 uv          : TEXCOORD0;
                UNITY_VERTEX_OUTPUT_STEREO
            };

            Varyings Vert(Attributes IN)
            {
                Varyings OUT;
                UNITY_SETUP_INSTANCE_ID(IN);
                UNITY_INITIALIZE_VERTEX_OUTPUT_STEREO(OUT);
                OUT.positionHCS = TransformObjectToHClip(IN.positionOS.xyz);
                OUT.uv = IN.uv;
                return OUT;
            }

            // ── Relief helper ───────────────────────────────────────────────
            inline float SampleH(float2 uv, float2 delta)
            {
                return SAMPLE_TEXTURE2D(_ReliefTex, sampler_ReliefTex, uv + delta).r;
            }

            // ── Fragment ────────────────────────────────────────────────────
            half4 Frag(Varyings IN) : SV_Target
            {
                float2 uv = IN.uv;

                // [Sample 1] Land mask: R=1 is land, R=0 is ocean
                float mask = SAMPLE_TEXTURE2D(_MaskTex, sampler_MaskTex, uv).r;

                // [Samples 2–5] Relief at 4 compass neighbours → hillshade
                float2 ts  = _ReliefTex_TexelSize.xy; // (1/w, 1/h)
                float h_l  = SampleH(uv, float2(-ts.x,  0.0));
                float h_r  = SampleH(uv, float2( ts.x,  0.0));
                float h_d  = SampleH(uv, float2( 0.0, -ts.y));
                float h_u  = SampleH(uv, float2( 0.0,  ts.y));

                float height = (h_l + h_r + h_d + h_u) * 0.25;

                // Normal from height gradient; NW light (negative X, slight +Z toward viewer)
                float3 nrm  = normalize(float3(
                    (h_l - h_r) * _HillshadeStr,
                    2.0,
                    (h_d - h_u) * _HillshadeStr));
                float3 ldir = normalize(float3(-0.6, 1.5, 0.5));
                // Remap shade so minimum is ~0.3 (no totally black cliffs on mobile)
                float shade = saturate(dot(nrm, ldir) * 0.45 + 0.72);

                // Land base: height → colour tint × hillshade
                float3 landBase = lerp(_LandLow.rgb, _LandHigh.rgb, saturate(height)) * shade;

                // [Sample 6] Terrain albedo — keep saturation when blend is high
                // (Blue Marble crops), mute grain textures when blend is low.
                float3 terr = SAMPLE_TEXTURE2D(_TerrainTex, sampler_TerrainTex, uv).rgb;
                float  lum  = dot(terr, float3(0.299, 0.587, 0.114));
                float  sat  = lerp(0.4, 1.0, saturate(_TerrainBlend));
                float  gain = lerp(0.65, 0.92, saturate(_TerrainBlend));
                terr = lerp(float3(lum, lum, lum), terr, sat) * gain;

                // ── Coast anti-aliasing via fwidth ──────────────────────────
                float mGrad   = max(fwidth(mask), 0.001);
                // coastal: smooth 0→1 transition from ocean to land
                float coastal = smoothstep(0.0, mGrad * 8.0, mask);
                // Nearshore shallow band (below the coastal edge)
                float shallow = smoothstep(0.0, 0.28, mask) * (1.0 - smoothstep(0.04, 0.36, mask));
                // Thin warm coast ring at the waterline
                float cring   = smoothstep(0.0, mGrad * 3.0, mask)
                              * (1.0 - smoothstep(mGrad * 4.0, mGrad * 22.0, mask));

                // Ocean: prefer Blue Marble water when terrain blend is high.
                float3 oceanCol = lerp(_Ocean.rgb, _ShallowColor.rgb, shallow * 0.75);
                oceanCol = lerp(oceanCol, terr, saturate(_TerrainBlend) * 0.88);

                // Land: hillshade base → realistic albedo
                float landShade = lerp(shade, lerp(0.88, 1.05, shade), saturate(_TerrainBlend));
                float3 landCol  = lerp(landBase, terr * landShade, _TerrainBlend * coastal);

                // Composite: ocean ↔ land, then coast ring overlay
                float3 col = lerp(oceanCol, landCol, coastal);
                // Soften coast ring when showing satellite albedo.
                col = lerp(col, _CoastColor.rgb, cring * _CoastColor.a * (1.0 - saturate(_TerrainBlend) * 0.7));

                // ── Modern Tactical Cartography Overlay (Subtle Lat/Lon Grid) ──
                // Generates an elegant, fine tactical coordinate grid (12x12 subdivisions)
                float2 gridUV = frac(uv * 12.0);
                float2 gridLine = smoothstep(0.02, 0.0, abs(gridUV - 0.5));
                float gridIntensity = max(gridLine.x, gridLine.y) * 0.035; // Whisper subtle
                col += float3(0.4, 0.6, 0.8) * gridIntensity;

                // Subtle vignette around the map edges
                float2 vigUV = uv * (1.0 - uv.yx);
                float vig = vigUV.x * vigUV.y * 15.0;
                vig = saturate(pow(vig, 0.15));
                col *= lerp(0.75, 1.0, vig);

                return half4(col, 1.0);
            }
            ENDHLSL
        }
    }
    Fallback Off
}
