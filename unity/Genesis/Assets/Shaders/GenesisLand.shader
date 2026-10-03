Shader "Genesis/Land"
{
    // Parchment land × relief bump/AO × coast mask — URP Forward.
    // Phase B Shader Graph land contract authored as HLSL (same stack as Genesis/InkWater;
    // Editor may re-author as Shader Graph without changing material property names).
    Properties
    {
        _BaseMap ("Albedo", 2D) = "white" {}
        _BaseColor ("Parchment Tint", Color) = (0.42, 0.36, 0.26, 1)
        _BumpMap ("Relief Normal", 2D) = "bump" {}
        _BumpScale ("Bump Scale", Range(0, 2)) = 0.9
        _OcclusionMap ("Relief AO", 2D) = "white" {}
        _OcclusionStrength ("AO Strength", Range(0, 1)) = 0.6
        _CoastMask ("Coast Mask", 2D) = "white" {}
        _UseMask ("Use Mask", Float) = 0
        _CoastDarken ("Coast Darken", Range(0, 1)) = 0.22
        _MicroDetail ("Micro Detail", Range(0, 1)) = 0.12
        _Smoothness ("Smoothness", Range(0, 1)) = 0.18
        _Metallic ("Metallic", Range(0, 1)) = 0.04
    }
    SubShader
    {
        Tags
        {
            "RenderType" = "Opaque"
            "Queue" = "Geometry"
            "RenderPipeline" = "UniversalPipeline"
        }
        LOD 200
        Cull Back
        ZWrite On

        Pass
        {
            Name "Forward"
            Tags { "LightMode" = "UniversalForward" }

            HLSLPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #pragma multi_compile _ _MAIN_LIGHT_SHADOWS _MAIN_LIGHT_SHADOWS_CASCADE
            #pragma multi_compile_fragment _ _SHADOWS_SOFT
            #pragma multi_compile_fog
            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Core.hlsl"
            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Lighting.hlsl"

            CBUFFER_START(UnityPerMaterial)
                float4 _BaseMap_ST;
                float4 _BaseColor;
                float _BumpScale;
                float _OcclusionStrength;
                float4 _CoastMask_ST;
                float _UseMask;
                float _CoastDarken;
                float _MicroDetail;
                float _Smoothness;
                float _Metallic;
            CBUFFER_END

            TEXTURE2D(_BaseMap);        SAMPLER(sampler_BaseMap);
            TEXTURE2D(_BumpMap);        SAMPLER(sampler_BumpMap);
            TEXTURE2D(_OcclusionMap);   SAMPLER(sampler_OcclusionMap);
            TEXTURE2D(_CoastMask);      SAMPLER(sampler_CoastMask);

            struct Attributes
            {
                float4 positionOS : POSITION;
                float3 normalOS : NORMAL;
                float4 tangentOS : TANGENT;
                float2 uv : TEXCOORD0;
            };

            struct Varyings
            {
                float4 positionCS : SV_POSITION;
                float2 uv : TEXCOORD0;
                float3 normalWS : TEXCOORD1;
                float3 tangentWS : TEXCOORD2;
                float3 bitangentWS : TEXCOORD3;
                float3 positionWS : TEXCOORD4;
                float fogFactor : TEXCOORD5;
            };

            Varyings vert(Attributes input)
            {
                Varyings o;
                VertexPositionInputs pos = GetVertexPositionInputs(input.positionOS.xyz);
                VertexNormalInputs nrm = GetVertexNormalInputs(input.normalOS, input.tangentOS);
                o.positionCS = pos.positionCS;
                o.positionWS = pos.positionWS;
                o.uv = TRANSFORM_TEX(input.uv, _BaseMap);
                o.normalWS = nrm.normalWS;
                o.tangentWS = nrm.tangentWS;
                o.bitangentWS = nrm.bitangentWS;
                o.fogFactor = ComputeFogFactor(pos.positionCS.z);
                return o;
            }

            half4 frag(Varyings i) : SV_Target
            {
                float2 uv = i.uv;
                half4 albedoSample = SAMPLE_TEXTURE2D(_BaseMap, sampler_BaseMap, uv);
                half3 albedo = albedoSample.rgb * _BaseColor.rgb;

                // Soft micro parchment grain from UV — cheap, no extra texture.
                float grain = frac(sin(dot(uv * 180.0, float2(12.9898, 78.233))) * 43758.5453);
                albedo = lerp(albedo, albedo * (0.92 + grain * 0.16), _MicroDetail);

                half3 normalTS = UnpackNormalScale(
                    SAMPLE_TEXTURE2D(_BumpMap, sampler_BumpMap, uv), _BumpScale);
                float3x3 tbn = float3x3(normalize(i.tangentWS), normalize(i.bitangentWS), normalize(i.normalWS));
                half3 normalWS = NormalizeNormalPerPixel(mul(normalTS, tbn));

                half ao = SAMPLE_TEXTURE2D(_OcclusionMap, sampler_OcclusionMap, uv).g;
                ao = lerp(1.0h, ao, _OcclusionStrength);

                if (_UseMask > 0.5)
                {
                    half mask = SAMPLE_TEXTURE2D(_CoastMask, sampler_CoastMask, TRANSFORM_TEX(uv, _CoastMask)).r;
                    // Soft nation-edge darkening along mask silhouette.
                    half edge = smoothstep(0.35, 0.65, mask) * (1.0h - smoothstep(0.65, 0.95, mask));
                    albedo *= 1.0h - edge * _CoastDarken;
                    // Outside land silhouette — slightly cooler/darker shelf read.
                    albedo = lerp(albedo * 0.55h, albedo, saturate(mask + 0.15h));
                }

                float4 shadowCoord = TransformWorldToShadowCoord(i.positionWS);
                Light mainLight = GetMainLight(shadowCoord);
                half ndl = saturate(dot(normalWS, mainLight.direction));
                half3 lighting = mainLight.color * (ndl * mainLight.shadowAttenuation);

                // Cool fill from ambient — desk lamp language without second shadow caster.
                half3 ambient = SampleSH(normalWS) * 0.55h;
                half3 col = albedo * (ambient + lighting) * ao;

                // Quiet specular kiss — parchment, not wet plastic.
                half3 viewDir = GetWorldSpaceNormalizeViewDir(i.positionWS);
                half3 halfDir = SafeNormalize(mainLight.direction + viewDir);
                half spec = pow(saturate(dot(normalWS, halfDir)), lerp(8.0h, 48.0h, _Smoothness));
                col += mainLight.color * spec * _Smoothness * (0.12h + _Metallic * 0.1h) * mainLight.shadowAttenuation;

                col = MixFog(col, i.fogFactor);
                return half4(col, 1);
            }
            ENDHLSL
        }
    }
    FallBack Off
}
