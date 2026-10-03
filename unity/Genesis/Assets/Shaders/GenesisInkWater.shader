Shader "Genesis/InkWater"
{
    // Quiet ink basin + soft rim foam — URP-only.
    // Phase B Shader Graph water/foam contract as HLSL (Survival Kids coast lesson, stylized).
    // Property names stay stable for Editor Shader Graph re-author without material rewiring.
    Properties
    {
        _BaseColor ("Ink Color", Color) = (0.03, 0.06, 0.09, 1)
        _FoamColor ("Foam Color", Color) = (0.55, 0.5, 0.42, 0.35)
        _Smoothness ("Smoothness", Range(0,1)) = 0.82
        _FoamWidth ("Foam Width", Range(0.01, 0.4)) = 0.12
        _FoamSoft ("Foam Softness", Range(0.01, 0.5)) = 0.18
        _CoastMask ("Coast Mask", 2D) = "white" {}
        _UseMask ("Use Mask", Float) = 0
    }
    SubShader
    {
        Tags
        {
            "RenderType" = "Transparent"
            "Queue" = "Transparent"
            "RenderPipeline" = "UniversalPipeline"
        }
        LOD 100
        Blend SrcAlpha OneMinusSrcAlpha
        ZWrite Off
        Cull Back

        Pass
        {
            Name "Forward"
            Tags { "LightMode" = "UniversalForward" }

            HLSLPROGRAM
            #pragma vertex vert
            #pragma fragment frag
            #pragma multi_compile_fog
            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Core.hlsl"
            #include "Packages/com.unity.render-pipelines.universal/ShaderLibrary/Lighting.hlsl"

            CBUFFER_START(UnityPerMaterial)
                float4 _BaseColor;
                float4 _FoamColor;
                float _Smoothness;
                float _FoamWidth;
                float _FoamSoft;
                float4 _CoastMask_ST;
                float _UseMask;
            CBUFFER_END

            TEXTURE2D(_CoastMask);
            SAMPLER(sampler_CoastMask);

            struct Attributes
            {
                float4 positionOS : POSITION;
                float3 normalOS : NORMAL;
                float2 uv : TEXCOORD0;
            };

            struct Varyings
            {
                float4 positionCS : SV_POSITION;
                float3 normalWS : TEXCOORD0;
                float2 uv : TEXCOORD1;
                float fogFactor : TEXCOORD2;
                float3 viewDirWS : TEXCOORD3;
            };

            Varyings vert(Attributes input)
            {
                Varyings o;
                float3 posWS = TransformObjectToWorld(input.positionOS.xyz);
                o.positionCS = TransformWorldToHClip(posWS);
                o.normalWS = TransformObjectToWorldNormal(input.normalOS);
                o.uv = TRANSFORM_TEX(input.uv, _CoastMask);
                o.viewDirWS = GetWorldSpaceViewDir(posWS);
                o.fogFactor = ComputeFogFactor(o.positionCS.z);
                return o;
            }

            half4 frag(Varyings i) : SV_Target
            {
                float3 n = normalize(i.normalWS);
                float3 v = normalize(i.viewDirWS);
                float fresnel = pow(saturate(1.0 - saturate(dot(n, v))), 2.2);

                float mask = 1.0;
                if (_UseMask > 0.5)
                {
                    mask = SAMPLE_TEXTURE2D(_CoastMask, sampler_CoastMask, i.uv).r;
                }

                // Quiet foam near bright mask edge / fresnel rim — parchment, not cyan.
                float foamEdge = smoothstep(_FoamWidth, _FoamWidth + _FoamSoft, 1.0 - mask);
                if (_UseMask < 0.5)
                {
                    foamEdge = saturate(fresnel * 0.55);
                }

                float3 ink = _BaseColor.rgb;
                float3 foam = _FoamColor.rgb;
                float3 col = lerp(ink, foam, foamEdge * _FoamColor.a);
                // Specular kiss from main light.
                Light mainLight = GetMainLight();
                float ndl = saturate(dot(n, mainLight.direction));
                float3 halfDir = normalize(mainLight.direction + v);
                float spec = pow(saturate(dot(n, halfDir)), lerp(8.0, 64.0, _Smoothness));
                col += mainLight.color * spec * _Smoothness * 0.18;

                float alpha = saturate(_BaseColor.a + foamEdge * 0.25);
                col = MixFog(col, i.fogFactor);
                return half4(col, alpha);
            }
            ENDHLSL
        }
    }
    FallBack Off
}
