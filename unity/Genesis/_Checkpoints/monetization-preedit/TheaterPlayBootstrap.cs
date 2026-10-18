using Genesis.Effects;
using Genesis.Theater;
using Genesis.UI;
using UnityEngine;
using UnityEngine.Rendering;
#if GENESIS_URP
using UnityEngine.Rendering.Universal;
#endif

namespace Genesis.Core
{
    /// <summary>
    /// Runtime bootstrap for TheaterPlay — builds lighting, camera, board, HUD, URP volume if scene is empty.
    /// Menu: Genesis → Rebuild Theater Play Slice (editor) also wires this.
    /// </summary>
    public class TheaterPlayBootstrap : MonoBehaviour
    {
        public string theaterId = "hist-1947-radcliffe";

        void Awake()
        {
            Application.targetFrameRate = 60;
            QualitySettings.vSyncCount = 0;
            EnsureMobileVisualFloor();
            GenesisPremiumVisuals.ApplyForCurrentQuality();
            GenesisThermalGuard.Ensure();
            // Shell-selected theater wins when Boot → Menu → Select launched play.
            if (AppFlow.CurrentPlayFromShell && !string.IsNullOrEmpty(AppFlow.SelectedTheaterId))
            {
                theaterId = AppFlow.SelectedTheaterId;
            }

            EnsureSceneGraph();
            GenesisPremiumVisuals.ApplyForCurrentQuality();
        }

        /// <summary>
        /// Bilal SOTA: Medium floor, High on modern devices, URP Render Scale 1.0 on Mid/High.
        /// Never re-cap Mid/High at 0.75 — diagnosis + unity-sota-visual-plan coordination.
        /// </summary>
        static void EnsureMobileVisualFloor()
        {
            // Very Low=0, Low=1, Medium=2, High=3
            const int medium = 2;
            const int high = 3;
            // Clarity: Editor Game view always High — Bilal must never see muddy Low in Play.
#if UNITY_EDITOR
            if (QualitySettings.GetQualityLevel() < high)
                QualitySettings.SetQualityLevel(high, true);
#else
            if (Application.isMobilePlatform)
            {
                var want = PreferHighOnModernDevice() ? high : medium;
                if (QualitySettings.GetQualityLevel() < want)
                    QualitySettings.SetQualityLevel(want, true);
            }
#endif

#if GENESIS_URP
            var urp = GraphicsSettings.currentRenderPipeline as UniversalRenderPipelineAsset;
            if (urp == null)
                urp = QualitySettings.renderPipeline as UniversalRenderPipelineAsset;
            if (urp != null)
            {
                var q = QualitySettings.GetQualityLevel();
                // Emergency thermal only on Very Low / Low. Mid+ stays native 1.0.
                urp.renderScale = q <= 0 ? 0.7f : q == 1 ? 0.85f : 1f;
                urp.useAdaptivePerformance = false;
                if (q >= medium)
                {
                    urp.shadowDistance = q >= high ? 48f : 40f;
                    urp.msaaSampleCount = 2;
                    urp.mainLightShadowmapResolution = 2048;
                    urp.shadowCascadeCount = 1;
                }
            }
#endif
        }

        /// <summary>
        /// Phase C — High is the flagship / store default when hardware qualifies.
        /// Editor always High for store stills. Phone: ≥4GB + ≥6 cores + Metal/Vulkan path.
        /// </summary>
        public static bool PreferHighOnModernDevice()
        {
#if UNITY_EDITOR
            return true;
#else
            // Snapdragon 7/8 / A14–A15-class and up: RAM + cores + modern GPU API.
            if (SystemInfo.systemMemorySize < 4096 || SystemInfo.processorCount < 6)
                return false;
            var api = SystemInfo.graphicsDeviceType;
            var modernApi =
                api == UnityEngine.Rendering.GraphicsDeviceType.Metal
                || api == UnityEngine.Rendering.GraphicsDeviceType.Vulkan
                || api == UnityEngine.Rendering.GraphicsDeviceType.Direct3D12
                || api == UnityEngine.Rendering.GraphicsDeviceType.Direct3D11;
            // GLES-only older Androids stay Medium even with RAM headroom.
            return modernApi;
#endif
        }

        /// <summary>Force High for store capture / Bilal phone verify (Settings / capture menus).</summary>
        public static void ForceHighQualityForStore()
        {
            const int high = 3;
            if (QualitySettings.GetQualityLevel() < high)
                QualitySettings.SetQualityLevel(high, true);
            EnsureMobileVisualFloor();
            GenesisPremiumVisuals.ApplyForCurrentQuality();
            Debug.Log("[Genesis] Forced High quality for store / flagship verify.");
        }

        public void EnsureSceneGraph()
        {
            var session = FindFirstObjectByType<TheaterSession>();
            if (session == null)
            {
                var root = new GameObject("GenesisTheater");
                session = root.AddComponent<TheaterSession>();
            }

            session.theaterIdOverride = theaterId;

            if (session.boardBuilder == null)
            {
                var boardGo = GameObject.Find("TheaterBoard") ?? new GameObject("TheaterBoard");
                session.boardBuilder = boardGo.GetComponent<TheaterBoardBuilder>()
                                       ?? boardGo.AddComponent<TheaterBoardBuilder>();
            }

            if (session.cameraRig == null)
            {
                var cam = Camera.main;
                if (cam == null)
                {
                    var camGo = new GameObject("Main Camera");
                    cam = camGo.AddComponent<Camera>();
                    cam.tag = "MainCamera";
                    cam.clearFlags = CameraClearFlags.SolidColor;
                    cam.backgroundColor = new Color(0.012f, 0.028f, 0.045f);
                    cam.allowHDR = true;
                    cam.allowMSAA = true;
                    cam.fieldOfView = 38f;
                    camGo.AddComponent<AudioListener>();
                }

                session.cameraRig = cam.GetComponent<TheaterCameraRig>() ?? cam.gameObject.AddComponent<TheaterCameraRig>();
                session.cameraRig.cam = cam;
            }

            session.cameraRig.EnsureCinemachineStack();

            EnsureBoardPointer(session.cameraRig.cam);
            EnsureLighting();
            EnsureVolume();

            if (session.hud == null)
            {
                var hudGo = GameObject.Find("OpsHUDRoot") ?? new GameObject("OpsHUDRoot");
                session.hud = hudGo.GetComponent<OpsHudController>() ?? hudGo.AddComponent<OpsHudController>();
            }

            if (session.orderRail == null)
            {
                var railGo = GameObject.Find("OrderRailRoot") ?? new GameObject("OrderRailRoot");
                session.orderRail = railGo.GetComponent<OrderRailController>() ?? railGo.AddComponent<OrderRailController>();
            }

            if (session.worldFx == null)
            {
                var fxGo = GameObject.Find("WorldFX") ?? new GameObject("WorldFX");
                session.worldFx = fxGo.GetComponent<WorldReactionFX>() ?? fxGo.AddComponent<WorldReactionFX>();
            }

            WireFxLights(session.worldFx);

            if (session.resolveBeat == null)
            {
                var resolveGo = GameObject.Find("ResolveBeatRoot") ?? new GameObject("ResolveBeatRoot");
                session.resolveBeat = resolveGo.GetComponent<ResolveBeatController>()
                                      ?? resolveGo.AddComponent<ResolveBeatController>();
            }

            if (session.freemium == null)
            {
                session.freemium = session.GetComponent<FreemiumStub>() ?? session.gameObject.AddComponent<FreemiumStub>();
            }

            EnsureEventSystem();
        }

        static void EnsureBoardPointer(Camera cam)
        {
            var existing = FindFirstObjectByType<BoardPointerInput>();
            if (existing != null)
            {
                if (existing.rayCamera == null) existing.rayCamera = cam;
                return;
            }

            var go = GameObject.Find("BoardPointerInput") ?? new GameObject("BoardPointerInput");
            var input = go.GetComponent<BoardPointerInput>() ?? go.AddComponent<BoardPointerInput>();
            input.rayCamera = cam;
        }

        static void WireFxLights(WorldReactionFX fx)
        {
            if (fx == null) return;
            var lights = FindObjectsByType<Light>(FindObjectsSortMode.None);
            foreach (var l in lights)
            {
                if (l == null) continue;
                if (l.type == LightType.Directional && fx.keyLight == null && l.gameObject.name.Contains("Key"))
                    fx.keyLight = l;
                else if (l.type == LightType.Spot && fx.rimLight == null)
                    fx.rimLight = l;
                else if (fx.accentLight == null && l.gameObject.name.Contains("OpsAccent"))
                    fx.accentLight = l;
            }

            // Fallbacks if names differ after Rebuild.
            if (fx.keyLight == null)
            {
                foreach (var l in lights)
                {
                    if (l != null && l.type == LightType.Directional)
                    {
                        fx.keyLight = l;
                        break;
                    }
                }
            }

            if (fx.rimLight == null)
            {
                foreach (var l in lights)
                {
                    if (l != null && (l.type == LightType.Spot || l.type == LightType.Point))
                    {
                        fx.rimLight = l;
                        break;
                    }
                }
            }

            if (fx.accentLight == null)
            {
                foreach (var l in lights)
                {
                    if (l != null && l.type == LightType.Point && l != fx.rimLight)
                    {
                        fx.accentLight = l;
                        break;
                    }
                }
            }
        }

        static void EnsureEventSystem()
        {
            if (FindFirstObjectByType<UnityEngine.EventSystems.EventSystem>() != null) return;

            var es = new GameObject("EventSystem");
            es.AddComponent<UnityEngine.EventSystems.EventSystem>();
#if GENESIS_INPUT_SYSTEM || ENABLE_INPUT_SYSTEM
            es.AddComponent<UnityEngine.InputSystem.UI.InputSystemUIInputModule>();
#else
            es.AddComponent<UnityEngine.EventSystems.StandaloneInputModule>();
#endif
        }

        static void EnsureLighting()
        {
            // AAA Phase 1 silhouette: exposure/midtone lift only — no new lights / FX.
            // Key owns soft contact shadows; fill stays shadowless (P0.5).
            var key = GameObject.Find("KeyLight");
            if (key == null)
            {
                key = new GameObject("KeyLight");
                var l = key.AddComponent<Light>();
                l.type = LightType.Directional;
                l.color = new Color(1f, 0.88f, 0.7f);
                l.intensity = 1.88f;
                l.shadows = LightShadows.Soft;
                l.shadowStrength = 0.68f;
                l.shadowBias = 0.04f;
                l.shadowNormalBias = 0.35f;
                key.transform.rotation = Quaternion.Euler(44f, -34f, 0f);
            }
            else
            {
                var l = key.GetComponent<Light>();
                if (l != null)
                {
                    l.intensity = 1.88f;
                    l.shadows = LightShadows.Soft;
                    l.shadowStrength = 0.68f;
                    l.shadowBias = 0.04f;
                    l.shadowNormalBias = 0.35f;
                    l.color = new Color(1f, 0.88f, 0.7f);
                    key.transform.rotation = Quaternion.Euler(44f, -34f, 0f);
                }
            }

            var fill = GameObject.Find("FillLight");
            if (fill == null)
            {
                fill = new GameObject("FillLight");
                var l = fill.AddComponent<Light>();
                l.type = LightType.Directional;
                // Cool room fill — baseline §4.4: shadowless (tile GPU budget); lifts mud without flat wash.
                l.color = new Color(0.4f, 0.5f, 0.64f);
                l.intensity = 0.82f;
                l.shadows = LightShadows.None;
                fill.transform.rotation = Quaternion.Euler(22f, 148f, 0f);
            }
            else
            {
                var l = fill.GetComponent<Light>();
                if (l != null)
                {
                    l.intensity = 0.82f;
                    l.color = new Color(0.4f, 0.5f, 0.64f);
                    l.shadows = LightShadows.None;
                    fill.transform.rotation = Quaternion.Euler(22f, 148f, 0f);
                }
            }

            var rim = GameObject.Find("RimLight");
            if (rim == null)
            {
                rim = new GameObject("RimLight");
                var l = rim.AddComponent<Light>();
                l.type = LightType.Spot;
                l.color = new Color(0.92f, 0.78f, 0.55f);
                l.intensity = 2.1f;
                l.range = 48f;
                l.spotAngle = 62f;
                l.shadows = LightShadows.None;
                rim.transform.position = new Vector3(5.5f, 15f, -3.5f);
                rim.transform.LookAt(Vector3.zero);
            }
            else
            {
                var l = rim.GetComponent<Light>();
                if (l != null)
                {
                    l.intensity = Mathf.Clamp(l.intensity, 1.6f, 2.1f);
                    l.color = new Color(0.92f, 0.78f, 0.55f);
                    l.range = Mathf.Min(Mathf.Max(l.range, 40f), 48f);
                    l.spotAngle = 62f;
                }
            }

            var bounce = GameObject.Find("BounceLight");
            if (bounce == null)
            {
                bounce = new GameObject("BounceLight");
                var l = bounce.AddComponent<Light>();
                l.type = LightType.Point;
                l.color = new Color(0.42f, 0.46f, 0.5f);
                l.intensity = 1.05f;
                l.range = 30f;
                bounce.transform.position = new Vector3(-6.5f, 4.2f, 5.2f);
            }
            else
            {
                var l = bounce.GetComponent<Light>();
                if (l != null)
                {
                    l.intensity = Mathf.Clamp(l.intensity, 0.7f, 1.05f);
                    l.color = new Color(0.42f, 0.46f, 0.5f);
                    l.range = Mathf.Min(Mathf.Max(l.range, 24f), 30f);
                }
            }

            // Low horizon under-light — cool room edge, not cyan wash.
            var horizon = GameObject.Find("HorizonLight");
            if (horizon == null)
            {
                horizon = new GameObject("HorizonLight");
                var l = horizon.AddComponent<Light>();
                l.type = LightType.Directional;
                l.color = new Color(0.22f, 0.3f, 0.38f);
                l.intensity = 0.28f;
                l.shadows = LightShadows.None;
                horizon.transform.rotation = Quaternion.Euler(-8f, 20f, 0f);
            }
            else
            {
                var l = horizon.GetComponent<Light>();
                if (l != null)
                {
                    l.intensity = Mathf.Min(Mathf.Max(l.intensity, 0.22f), 0.28f);
                    l.color = new Color(0.22f, 0.3f, 0.38f);
                }
            }

            // Phase 1: mute OpsAccent — pink/orange floor tint was a hard ban.
            var accent = GameObject.Find("OpsAccentLight");
            if (accent == null)
            {
                accent = new GameObject("OpsAccentLight");
                var l = accent.AddComponent<Light>();
                l.type = LightType.Point;
                l.color = new Color(0.55f, 0.5f, 0.42f);
                l.intensity = 0.12f;
                l.range = 12f;
                l.shadows = LightShadows.None;
                l.enabled = false;
                accent.transform.position = new Vector3(0.8f, 8f, 1.2f);
            }
            else
            {
                var l = accent.GetComponent<Light>();
                if (l != null)
                {
                    l.color = new Color(0.55f, 0.5f, 0.42f);
                    l.intensity = 0.12f;
                    l.range = 12f;
                    l.enabled = false;
                }
            }

            RenderSettings.ambientMode = AmbientMode.Trilight;
            RenderSettings.ambientSkyColor = new Color(0.18f, 0.19f, 0.22f);
            RenderSettings.ambientEquatorColor = new Color(0.12f, 0.11f, 0.1f);
            RenderSettings.ambientGroundColor = new Color(0.055f, 0.048f, 0.04f);
            RenderSettings.ambientIntensity = 1.18f;
            RenderSettings.fog = true;
            RenderSettings.fogMode = FogMode.ExponentialSquared;
            RenderSettings.fogColor = new Color(0.04f, 0.048f, 0.055f);
            // Portrait: lighter fog so parchment/coast silhouette stays in the map band.
            // Portrait = lighter fog so parchment/coast silhouette stays in the map band.
            RenderSettings.fogDensity = Screen.height >= Screen.width ? 0.0075f : 0.011f;
            RenderSettings.reflectionIntensity = 0.34f;
            RenderSettings.subtractiveShadowColor = new Color(0.15f, 0.13f, 0.12f);
        }

        /// <summary>
        /// Prefer the Rebuild-authored asset profile when present and populated;
        /// empty-shell assets get grade authored so the volume is never a dead stub.
        /// </summary>
        public static void EnsureVolume(VolumeProfile preferredProfile = null)
        {
            var go = GameObject.Find("TheaterVolume");
            if (go == null)
            {
                go = new GameObject("TheaterVolume");
            }

            var volume = go.GetComponent<Volume>() ?? go.AddComponent<Volume>();
            volume.isGlobal = true;
            volume.priority = 10f;
            volume.weight = 1f;

#if GENESIS_URP
            if (preferredProfile != null)
            {
                StripNullVolumeComponents(preferredProfile);
                if (!ProfileHasLiveComponents(preferredProfile))
                    ApplyTheaterGrade(preferredProfile);
                volume.sharedProfile = preferredProfile;
                PersistVolumeIfEditor(preferredProfile);
                return;
            }

            // Shared Genesis asset — finish it if still an empty shell (do NOT early-return).
            if (volume.sharedProfile != null && volume.sharedProfile.name.Contains("Genesis"))
            {
                StripNullVolumeComponents(volume.sharedProfile);
                if (!ProfileHasLiveComponents(volume.sharedProfile))
                {
                    ApplyTheaterGrade(volume.sharedProfile);
                    PersistVolumeIfEditor(volume.sharedProfile);
                }

                return;
            }

            if (volume.profile == null)
            {
                var profile = ScriptableObject.CreateInstance<VolumeProfile>();
                ApplyTheaterGrade(profile);
                volume.profile = profile;
            }
            else
            {
                StripNullVolumeComponents(volume.profile);
                ApplyTheaterGrade(volume.profile);
            }
#else
            volume.weight = 1f;
#endif
        }

        public static void StripNullVolumeComponents(VolumeProfile profile)
        {
            if (profile?.components == null) return;
            for (var i = profile.components.Count - 1; i >= 0; i--)
            {
                if (profile.components[i] == null)
                    profile.components.RemoveAt(i);
            }
        }

        public static bool ProfileHasLiveComponents(VolumeProfile profile)
        {
            if (profile?.components == null || profile.components.Count == 0) return false;
            for (var i = 0; i < profile.components.Count; i++)
            {
                if (profile.components[i] != null) return true;
            }

            return false;
        }

        static void PersistVolumeIfEditor(VolumeProfile profile)
        {
#if UNITY_EDITOR && GENESIS_URP
            if (profile == null) return;
            if (profile.components != null)
            {
                foreach (var c in profile.components)
                {
                    if (c == null) continue;
                    if (!UnityEditor.AssetDatabase.Contains(c) &&
                        UnityEditor.AssetDatabase.Contains(profile))
                    {
                        UnityEditor.AssetDatabase.AddObjectToAsset(c, profile);
                    }
                }
            }

            UnityEditor.EditorUtility.SetDirty(profile);
            UnityEditor.AssetDatabase.SaveAssets();
#endif
        }

#if GENESIS_URP
        public static void ApplyTheaterGrade(VolumeProfile profile)
        {
            if (profile == null) return;
            StripNullVolumeComponents(profile);

            Upsert(profile, (Bloom bloom) =>
            {
                // Restrained bloom — brass pins / land never glow plastic neon.
                bloom.intensity.Override(0.28f);
                bloom.threshold.Override(0.95f);
                bloom.scatter.Override(0.5f);
            });
            Upsert(profile, (Vignette vignette) =>
            {
                // Softer vignette — silhouette edges must not crush into void.
                vignette.intensity.Override(0.2f);
                vignette.smoothness.Override(0.52f);
                vignette.color.Override(new Color(0.02f, 0.02f, 0.025f));
            });
            Upsert(profile, (ColorAdjustments color) =>
            {
                // AAA Phase 1 exposure — lift murky desk midtones for 2-second place read.
                color.postExposure.Override(0.3f);
                color.contrast.Override(16f);
                color.saturation.Override(3f);
                color.colorFilter.Override(new Color(1f, 0.96f, 0.9f));
            });
            Upsert(profile, (FilmGrain grain) =>
            {
                grain.intensity.Override(0.16f);
                grain.response.Override(0.7f);
            });
            Upsert(profile, (LiftGammaGain lgg) =>
            {
                lgg.lift.Override(new Vector4(0.99f, 0.99f, 1.0f, -0.01f));
                lgg.gamma.Override(new Vector4(1f, 0.99f, 0.96f, -0.02f));
                lgg.gain.Override(new Vector4(1.05f, 1.01f, 0.94f, 0.05f));
            });
            Upsert(profile, (Tonemapping tone) =>
            {
                tone.mode.Override(TonemappingMode.ACES);
            });
            Upsert(profile, (ShadowsMidtonesHighlights smh) =>
            {
                // Phase 1: lift midtones so parchment/pins separate under ACES.
                smh.shadows.Override(new Vector4(0.93f, 0.94f, 1.0f, -0.04f));
                smh.midtones.Override(new Vector4(1.04f, 1.01f, 0.96f, 0.04f));
                smh.highlights.Override(new Vector4(1.04f, 1.0f, 0.92f, 0.03f));
            });
        }

        static void Upsert<T>(VolumeProfile profile, System.Action<T> configure) where T : VolumeComponent
        {
            if (!profile.TryGet(out T component) || component == null)
            {
                component = profile.Add<T>(true);
            }

            configure?.Invoke(component);
        }
#endif
    }
}
