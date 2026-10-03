#if UNITY_EDITOR
using System.IO;
using Genesis.Core;
using Genesis.Theater;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.Rendering;
using UnityEngine.SceneManagement;

#if GENESIS_URP
using UnityEngine.Rendering.Universal;
#endif

namespace Genesis.EditorTools
{
    /// <summary>
    /// One-click scene wiring + URP pipeline ensure for the full Genesis Unity path
    /// (Boot → Menu → Select → TheaterPlay → Results) and Partition theater board.
    /// </summary>
    public static class GenesisSceneBuilder
    {
        const string ScenePath = "Assets/Scenes/TheaterPlay.unity";
        const string BootScenePath = "Assets/Scenes/Boot.unity";
        const string MainMenuScenePath = "Assets/Scenes/MainMenu.unity";
        const string TheaterSelectScenePath = "Assets/Scenes/TheaterSelect.unity";
        const string ResultsScenePath = "Assets/Scenes/Results.unity";
        const string SettingsScenePath = "Assets/Scenes/Settings.unity";
        const string SettingsFolder = "Assets/Settings";
        const string RendererPath = "Assets/Settings/Genesis_URP_Renderer.asset";
        const string PipelinePath = "Assets/Settings/Genesis_URP_Pipeline.asset";
        const string VolumePath = "Assets/Settings/Genesis_TheaterVolume.asset";
        const string CaptureFolder = "Temp/GenesisCapture";

        [MenuItem("Genesis/Rebuild Full App Shell")]
        public static void RebuildFullAppShell()
        {
            EnsureUrpPipelineAssets();
            // Phase C — SSAO + DeskDust land with every shell rebuild (no orphan Visuals menus).
            GenesisSsaoSetup.EnableSsao();
            GenesisDeskDustSetup.BuildDeskDustResource();
            Directory.CreateDirectory("Assets/Scenes");

            BuildControllerScene(BootScenePath, "BootRoot", typeof(BootController));
            BuildControllerScene(MainMenuScenePath, "MainMenuRoot", typeof(MainMenuController));
            BuildControllerScene(TheaterSelectScenePath, "TheaterSelectRoot", typeof(TheaterSelectController));
            BuildControllerScene(ResultsScenePath, "ResultsRoot", typeof(ResultsController));
            BuildControllerScene(SettingsScenePath, "SettingsRoot", typeof(SettingsController));

            // Theater play keeps the rich bootstrap path.
            RebuildTheaterPlayInternal(registerBuildSettings: false);

            EditorBuildSettings.scenes = new[]
            {
                new EditorBuildSettingsScene(BootScenePath, true),
                new EditorBuildSettingsScene(MainMenuScenePath, true),
                new EditorBuildSettingsScene(TheaterSelectScenePath, true),
                new EditorBuildSettingsScene(ScenePath, true),
                new EditorBuildSettingsScene(ResultsScenePath, true),
                new EditorBuildSettingsScene(SettingsScenePath, true),
            };

            AssetDatabase.SaveAssets();
            AssetDatabase.Refresh();

            var catalog = Path.Combine(Application.streamingAssetsPath, "Theaters", "catalog.json");
            var count = 0;
            if (File.Exists(catalog))
            {
                var raw = File.ReadAllText(catalog);
                count = System.Text.RegularExpressions.Regex.Matches(raw, "\"id\"\\s*:\\s*\"hist-").Count;
            }

            Debug.Log(
                $"[Genesis] Full app shell rebuilt — Boot→Menu→Select→Play→Results. " +
                $"Catalog theaters≈{count}. Open Boot and press Play (or File → Build Settings).");
            var boot = AssetDatabase.LoadAssetAtPath<SceneAsset>(BootScenePath);
            if (boot != null) Selection.activeObject = boot;
        }

        static void BuildControllerScene(string scenePath, string rootName, System.Type controllerType)
        {
            var scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
            var root = new GameObject(rootName);
            root.AddComponent(controllerType);
            EditorSceneManager.MarkSceneDirty(scene);
            EditorSceneManager.SaveScene(scene, scenePath);
        }

        [MenuItem("Genesis/Rebuild Theater Play Slice")]
        public static void Rebuild()
        {
            RebuildTheaterPlayInternal(registerBuildSettings: true);
        }

        static void RebuildTheaterPlayInternal(bool registerBuildSettings)
        {
            EnsureUrpPipelineAssets();
            GenesisSsaoSetup.EnableSsao();
            GenesisDeskDustSetup.BuildDeskDustResource();

            var scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
            var bootstrapGo = new GameObject("TheaterPlayBootstrap");
            var bootstrap = bootstrapGo.AddComponent<TheaterPlayBootstrap>();
            // Prefer shell selection when present; default Partition for direct Play.
            bootstrap.theaterId = string.IsNullOrEmpty(AppFlow.SelectedTheaterId)
                ? "hist-1947-radcliffe"
                : AppFlow.SelectedTheaterId;
            bootstrap.EnsureSceneGraph();

            // Prefer the authored asset volume profile over a transient runtime instance.
#if GENESIS_URP
            var authored = AssetDatabase.LoadAssetAtPath<VolumeProfile>(VolumePath);
            if (authored != null)
            {
                TheaterPlayBootstrap.ApplyTheaterGrade(authored);
                EditorUtility.SetDirty(authored);
                TheaterPlayBootstrap.EnsureVolume(authored);
            }
#endif

            // Make sure CM stack + pointer survive empty-scene rebuild.
            var rig = Object.FindFirstObjectByType<TheaterCameraRig>();
            rig?.EnsureCinemachineStack();

            Directory.CreateDirectory("Assets/Scenes");
            EditorSceneManager.MarkSceneDirty(scene);
            EditorSceneManager.SaveScene(scene, ScenePath);

            if (registerBuildSettings)
            {
                // Keep full shell order if scenes already exist; otherwise TheaterPlay-only.
                var existing = EditorBuildSettings.scenes;
                var hasBoot = false;
                foreach (var s in existing)
                {
                    if (s != null && s.path == BootScenePath)
                    {
                        hasBoot = true;
                        break;
                    }
                }

                if (!hasBoot)
                {
                    EditorBuildSettings.scenes = new[] { new EditorBuildSettingsScene(ScenePath, true) };
                }
            }

            AssetDatabase.SaveAssets();
            AssetDatabase.Refresh();

            var streaming = Path.Combine(Application.streamingAssetsPath, "Theaters", "hist-1947-radcliffe.json");
            if (!File.Exists(streaming))
            {
                Debug.LogWarning(
                    "[Genesis] Missing StreamingAssets theater JSON. Run: python3 scripts/export-unity-theaters.py");
            }

            Debug.Log(
                "[Genesis] TheaterPlay rebuilt — URP + volume grade + Cinemachine stack wired. " +
                "Prefer Genesis → Rebuild Full App Shell for Boot→Results flow.");
            var sceneAsset = AssetDatabase.LoadAssetAtPath<SceneAsset>(ScenePath);
            if (sceneAsset != null && registerBuildSettings)
            {
                Selection.activeObject = sceneAsset;
            }
        }

        [MenuItem("Genesis/Ensure URP Pipeline Assets")]
        public static void EnsureUrpPipelineAssetsMenu()
        {
            EnsureUrpPipelineAssets();
            AssetDatabase.SaveAssets();
            AssetDatabase.Refresh();
            Debug.Log("[Genesis] URP pipeline assets ensured under Assets/Settings/.");
        }

        [MenuItem("Genesis/Open StreamingAssets Theaters Folder")]
        public static void RevealTheaters()
        {
            var path = Path.Combine(Application.streamingAssetsPath, "Theaters");
            Directory.CreateDirectory(path);
            EditorUtility.RevealInFinder(path);
        }

        [MenuItem("Genesis/Validate Slice Integrity")]
        public static void ValidateSlice()
        {
            var ok = true;
            void Need(string path, string label)
            {
                if (File.Exists(path) || AssetDatabase.LoadAssetAtPath<Object>(path) != null) return;
                Debug.LogError($"[Genesis] Missing {label}: {path}");
                ok = false;
            }

            Need("ProjectSettings/ProjectVersion.txt", "ProjectVersion");
            Need("Packages/manifest.json", "Packages manifest");
            Need(ScenePath, "TheaterPlay scene");
            Need(BootScenePath, "Boot scene");
            Need(MainMenuScenePath, "MainMenu scene");
            Need(TheaterSelectScenePath, "TheaterSelect scene");
            Need(ResultsScenePath, "Results scene");
            Need("Assets/StreamingAssets/Theaters/catalog.json", "theater catalog");
            Need("Assets/StreamingAssets/Theaters/hist-1947-radcliffe.json", "India Partition JSON");
            Need("Assets/Scripts/Core/TheaterPlayBootstrap.cs", "bootstrap script");
            Need("Assets/Scripts/Core/AppFlow.cs", "app flow");
            Need("Assets/Scripts/Core/BootController.cs", "boot controller");
            Need("Assets/Scripts/Core/MainMenuController.cs", "main menu");
            Need("Assets/Scripts/Core/TheaterSelectController.cs", "theater select");
            Need("Assets/Scripts/Core/ResultsController.cs", "results");
            Need("Assets/Scripts/Theater/MapTextureLibrary.cs", "map texture library");
            Need("Assets/Scripts/Theater/BoardPointerInput.cs", "board pointer input");
            Need("Assets/Scripts/Theater/TheaterCameraRig.cs", "camera rig");
            Need("Assets/Scripts/Effects/WorldReactionFX.cs", "world reaction FX");
            Need("Assets/Scripts/Theater/TheaterMaterialFactory.cs", "material factory");
            Need("Assets/Scripts/UI/OpsHudController.cs", "ops HUD");
            Need("Assets/Scripts/UI/OrderRailController.cs", "order rail");
            Need("Assets/Resources/GenesisMaterials/GenesisLitTemplate.mat", "URP Lit template");
            Need("Assets/Resources/GenesisMaterials/GenesisUnlitTemplate.mat", "URP Unlit template");
            Need("Assets/Resources/GenesisMaterials/GenesisParticlesUnlitTemplate.mat", "URP Particles Unlit template");

            var catalogPath = "Assets/StreamingAssets/Theaters/catalog.json";
            if (File.Exists(catalogPath))
            {
                var raw = File.ReadAllText(catalogPath);
                var n = System.Text.RegularExpressions.Regex.Matches(raw, "\"id\"\\s*:\\s*\"hist-").Count;
                if (n < 30)
                {
                    Debug.LogError($"[Genesis] Catalog only has {n} theaters — expect 32. Re-run export-unity-theaters.py");
                    ok = false;
                }
                else
                {
                    Debug.Log($"[Genesis] Catalog lists {n} theaters.");
                }
            }

            var southasiaGeo = "Assets/StreamingAssets/Maps/geo/southasia.json";
            if (!File.Exists(southasiaGeo))
            {
                Debug.LogWarning(
                    "[Genesis] Missing Natural Earth southasia geo — run scripts/generate-unity-map-assets.py");
            }
            var manifest = File.Exists("Packages/manifest.json")
                ? File.ReadAllText("Packages/manifest.json")
                : "";
            if (!manifest.Contains("com.unity.render-pipelines.universal"))
            {
                Debug.LogError("[Genesis] URP missing from Packages/manifest.json");
                ok = false;
            }

            if (!manifest.Contains("com.unity.cinemachine"))
            {
                Debug.LogError("[Genesis] Cinemachine missing from Packages/manifest.json");
                ok = false;
            }

            if (!manifest.Contains("com.unity.inputsystem"))
            {
                Debug.LogError("[Genesis] Input System missing from Packages/manifest.json");
                ok = false;
            }

            // Fail hard on Built-in fallbacks still present in source (magenta under URP).
            if (!ValidateMaterialSourceGuards(log: true))
            {
                ok = false;
            }

            if (ok)
            {
                Debug.Log("[Genesis] Slice integrity OK — Rebuild Full App Shell → Play Boot for complete game.");
            }
        }

        /// <summary>
        /// Fail on Error/magenta/Built-in shaders in project materials + factory source guards.
        /// Menu: Genesis → Validate Materials (no magenta).
        /// </summary>
        [MenuItem("Genesis/Validate Materials (no magenta)")]
        public static void ValidateMaterialsMenu()
        {
            TheaterMaterialFactory.ClearShaderCache();

            var ok = ValidateMaterialSourceGuards(log: true);
            var matOk = ValidateProjectMaterials(log: true);
            var shaderOk = ValidateUrpShadersResolvable(log: true);
            var qualityOk = ValidateQualityPipelines(log: true);

            if (ok && matOk && shaderOk && qualityOk)
            {
                Debug.Log(
                    "[Genesis] Validate Materials PASS — no Built-in/Error shaders in Resources mats; " +
                    "factory source clean; URP shaders resolve; all quality tiers reference Genesis URP.");
            }
            else
            {
                Debug.LogError(
                    "[Genesis] Validate Materials FAIL — fix magenta risks before Play/publish. " +
                    "See errors above.");
            }
        }

        static bool ValidateMaterialSourceGuards(bool log)
        {
            var ok = true;
            var factoryPath = "Assets/Scripts/Theater/TheaterMaterialFactory.cs";
            var fxPath = "Assets/Scripts/Effects/WorldReactionFX.cs";
            var forbidden = new[]
            {
                "Shader.Find(\"Standard\")",
                "Shader.Find(\"Unlit/Color\")",
                "Shader.Find(\"Particles/Standard Unlit\")",
                "Shader.Find(\"Particles/Standard Surface\")",
                "Shader.Find(\"Legacy Shaders/",
            };

            foreach (var path in new[] { factoryPath, fxPath })
            {
                if (!File.Exists(path))
                {
                    if (log) Debug.LogError($"[Genesis] Missing source for material validate: {path}");
                    ok = false;
                    continue;
                }

                var src = File.ReadAllText(path);
                foreach (var bad in forbidden)
                {
                    if (!src.Contains(bad)) continue;
                    if (log)
                    {
                        Debug.LogError(
                            $"[Genesis] Magenta risk: {path} still contains Built-in Find `{bad}`. " +
                            "Use Universal Render Pipeline/Lit|Unlit|Particles/Unlit only.");
                    }

                    ok = false;
                }
            }

            return ok;
        }

        static bool ValidateProjectMaterials(bool log)
        {
            var ok = true;
            var guids = AssetDatabase.FindAssets("t:Material", new[] { "Assets" });
            foreach (var guid in guids)
            {
                var path = AssetDatabase.GUIDToAssetPath(guid);
                var mat = AssetDatabase.LoadAssetAtPath<Material>(path);
                if (mat == null) continue;
                if (!TheaterMaterialFactory.IsBrokenOrBuiltIn(mat)) continue;
                if (log)
                {
                    var shaderName = mat.shader != null ? mat.shader.name : "<null>";
                    Debug.LogError(
                        $"[Genesis] Magenta/Error material: {path} shader='{shaderName}'. " +
                        "Assign Universal Render Pipeline/Lit or Unlit.");
                }

                ok = false;
            }

            if (ok && log && guids.Length == 0)
            {
                Debug.LogWarning("[Genesis] No Material assets under Assets/ — runtime factory only.");
            }

            return ok;
        }

        static bool ValidateUrpShadersResolvable(bool log)
        {
            var ok = true;
            string[] required =
            {
                TheaterMaterialFactory.LitShaderNameForValidate(),
                TheaterMaterialFactory.UnlitShaderNameForValidate(),
                TheaterMaterialFactory.ParticlesShaderNameForValidate(),
            };

            foreach (var name in required)
            {
                var s = Shader.Find(name);
                if (s != null && !string.IsNullOrEmpty(s.name) && !s.name.Contains("InternalError"))
                {
                    continue;
                }

                // Resources templates can still keep the shader in builds even if Find fails here
                // before package import finishes — warn but also check template mats.
                var templateHint = name.Contains("Particles")
                    ? "Assets/Resources/GenesisMaterials/GenesisParticlesUnlitTemplate.mat"
                    : name.Contains("Unlit")
                        ? "Assets/Resources/GenesisMaterials/GenesisUnlitTemplate.mat"
                        : "Assets/Resources/GenesisMaterials/GenesisLitTemplate.mat";
                var template = AssetDatabase.LoadAssetAtPath<Material>(templateHint);
                if (template != null && template.shader != null &&
                    !TheaterMaterialFactory.IsBrokenOrBuiltIn(template))
                {
                    if (log)
                    {
                        Debug.LogWarning(
                            $"[Genesis] Shader.Find('{name}') missed in Editor, but Resources template OK ({templateHint}).");
                    }

                    continue;
                }

                if (log)
                {
                    Debug.LogError(
                        $"[Genesis] Required URP shader not resolvable: '{name}'. " +
                        "Import com.unity.render-pipelines.universal and re-run Ensure URP Pipeline Assets.");
                }

                ok = false;
            }

            return ok;
        }

        static bool ValidateQualityPipelines(bool log)
        {
            var ok = true;
            var pipeline = AssetDatabase.LoadAssetAtPath<RenderPipelineAsset>(PipelinePath);
            if (pipeline == null)
            {
                if (log) Debug.LogError($"[Genesis] Missing URP pipeline asset at {PipelinePath}");
                return false;
            }

            var names = QualitySettings.names;
            for (var i = 0; i < names.Length; i++)
            {
                var qPipe = QualitySettings.GetRenderPipelineAssetAt(i);
                if (qPipe != null) continue;
                // Null means inherit GraphicsSettings — acceptable if Graphics has URP.
                if (GraphicsSettings.defaultRenderPipeline != null) continue;
                if (log)
                {
                    Debug.LogError(
                        $"[Genesis] Quality '{names[i]}' has no URP pipeline and Graphics default is null.");
                }

                ok = false;
            }

            if (GraphicsSettings.defaultRenderPipeline == null)
            {
                if (log) Debug.LogError("[Genesis] GraphicsSettings.defaultRenderPipeline is null — assign Genesis URP.");
                ok = false;
            }

            return ok;
        }

        [MenuItem("Genesis/Capture Play Mode Screenshots", true)]
        static bool CapturePlayModeValidate() => EditorApplication.isPlaying;

        [MenuItem("Genesis/Capture Play Mode Screenshots")]
        public static void CapturePlayModeScreenshots()
        {
            if (!EditorApplication.isPlaying)
            {
                Debug.LogWarning("[Genesis] Enter Play Mode first, then run Capture Play Mode Screenshots.");
                return;
            }

            Directory.CreateDirectory(CaptureFolder);
            // Manual Play captures — Bilal: rename/copy to store media/ preferred names:
            //   genesis-unity-modern-board.png | genesis-unity-modern-execute.png | genesis-unity-modern-resolve.png
            // Or use Genesis → Capture Phase 2-3 Modern Board Stills for the automated loop.
            ScreenCapture.CaptureScreenshot(Path.Combine(CaptureFolder, "genesis-unity-modern-board.png"));
            Debug.Log(
                "[Genesis] Screenshot queued → Temp/GenesisCapture/genesis-unity-modern-board.png. " +
                "For execute/resolve, use Genesis → Capture Phase 2-3 Modern Board Stills (licensed Editor).");
        }

        public static void EnsureUrpPipelineAssets()
        {
            Directory.CreateDirectory(SettingsFolder);

#if GENESIS_URP
            var renderer = AssetDatabase.LoadAssetAtPath<UniversalRendererData>(RendererPath);
            if (renderer == null)
            {
                renderer = ScriptableObject.CreateInstance<UniversalRendererData>();
                AssetDatabase.CreateAsset(renderer, RendererPath);
            }

            TuneRenderer(renderer);

            var pipeline = AssetDatabase.LoadAssetAtPath<UniversalRenderPipelineAsset>(PipelinePath);
            if (pipeline == null)
            {
                try
                {
                    pipeline = UniversalRenderPipelineAsset.Create(renderer);
                }
                catch (System.Exception ex)
                {
                    Debug.LogWarning($"[Genesis] URP Create() failed ({ex.Message}); using ScriptableObject fallback.");
                    pipeline = ScriptableObject.CreateInstance<UniversalRenderPipelineAsset>();
                }

                AssetDatabase.CreateAsset(pipeline, PipelinePath);
            }

            // Keep renderer reference healthy after rebuilds / fallback Create.
            {
                var so = new SerializedObject(pipeline);
                var prop = so.FindProperty("m_RendererDataList");
                if (prop != null)
                {
                    if (prop.arraySize < 1) prop.arraySize = 1;
                    prop.GetArrayElementAtIndex(0).objectReferenceValue = renderer;
                    so.ApplyModifiedPropertiesWithoutUndo();
                }

                var defaultIndex = so.FindProperty("m_DefaultRendererIndex");
                if (defaultIndex != null) defaultIndex.intValue = 0;

                SetFloat(so, "m_RenderScale", 1f);
                SetFloat(so, "m_ShadowDistance", 55f);
                SetInt(so, "m_ShadowCascadeCount", 2);
                SetInt(so, "m_MainLightShadowsSupported", 1);
                SetInt(so, "m_AdditionalLightsRenderingMode", 1); // PerPixel
                SetInt(so, "m_AdditionalLightsShadowResolutionTier", 1);
                SetBool(so, "m_SupportsHDR", true);
                SetInt(so, "m_MSAA", 2);
                SetBool(so, "m_SupportsMainLightShadows", true);
                SetBool(so, "m_SupportsAdditionalLightShadows", true);
                // Phase 1 Cabinet War Table — contact shadows sell the desk.
                SetBool(so, "m_AdditionalLightShadowsSupported", true);
                SetBool(so, "m_SoftShadowsSupported", true);
                SetBool(so, "m_RequireDepthTexture", true);
                SetInt(so, "m_SoftShadowQuality", 2); // High
                so.ApplyModifiedPropertiesWithoutUndo();
            }

            GraphicsSettings.defaultRenderPipeline = pipeline;
            QualitySettings.renderPipeline = pipeline;
            // Every quality tier (incl. Very Low) must reference Genesis URP — never null.
            // Unity 6000.6: SetRenderPipelineAssetAt may be absent — reflect, else current-tier only.
            AssignUrpToAllQualityTiers(pipeline);

            EnsureVolumeProfile();
            // Phase C — keep SSAO on the theater renderer whenever URP assets are ensured.
            GenesisSsaoSetup.EnableSsao();
            EditorUtility.SetDirty(pipeline);
            EditorUtility.SetDirty(renderer);
#else
            Debug.LogWarning(
                "[Genesis] URP package not resolved yet — open project once so Package Manager imports com.unity.render-pipelines.universal, then re-run Genesis → Ensure URP Pipeline Assets.");
#endif
        }

        /// <summary>
        /// Wire URP to every quality tier. Prefer SetRenderPipelineAssetAt when present (Unity 6+);
        /// otherwise fall back to current-tier QualitySettings.renderPipeline only.
        /// </summary>
        public static void AssignUrpToAllQualityTiers(RenderPipelineAsset pipeline)
        {
            if (pipeline == null) return;
            QualitySettings.renderPipeline = pipeline;
            var mi = typeof(QualitySettings).GetMethod(
                "SetRenderPipelineAssetAt",
                System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Static,
                null,
                new[] { typeof(int), typeof(RenderPipelineAsset) },
                null);
            if (mi == null) return;
            for (var i = 0; i < QualitySettings.names.Length; i++)
                mi.Invoke(null, new object[] { i, pipeline });
        }

#if GENESIS_URP
        static void TuneRenderer(UniversalRendererData renderer)
        {
            var so = new SerializedObject(renderer);
            // Forward+ / Forward — leave mode default; enable post-processing path hints via depth priming off for mobile.
            SetBool(so, "m_DepthPrimingMode", false);
            SetBool(so, "m_AccurateGbufferNormals", false);
            so.ApplyModifiedPropertiesWithoutUndo();
            EditorUtility.SetDirty(renderer);
        }

        static void EnsureVolumeProfile()
        {
            var profile = AssetDatabase.LoadAssetAtPath<VolumeProfile>(VolumePath);
            if (profile == null)
            {
                profile = ScriptableObject.CreateInstance<VolumeProfile>();
                AssetDatabase.CreateAsset(profile, VolumePath);
            }

            TheaterPlayBootstrap.StripNullVolumeComponents(profile);
            TheaterPlayBootstrap.ApplyTheaterGrade(profile);
            // Persist each component as a sub-asset so the YAML is no longer an empty shell.
            if (profile.components != null)
            {
                foreach (var c in profile.components)
                {
                    if (c == null) continue;
                    if (!AssetDatabase.Contains(c) && !AssetDatabase.IsSubAsset(c))
                        AssetDatabase.AddObjectToAsset(c, profile);
                }
            }

            EditorUtility.SetDirty(profile);
            AssetDatabase.SaveAssets();
        }

        [MenuItem("Genesis/Persist Theater Volume Grade")]
        public static void PersistTheaterVolumeMenu()
        {
            EnsureVolumeProfile();
            Debug.Log("[Genesis] Genesis_TheaterVolume authored — Bloom/Vignette/Grain/ACES/SMH/LGG persisted.");
        }
#endif

        static void SetFloat(SerializedObject so, string name, float value)
        {
            var p = so.FindProperty(name);
            if (p != null) p.floatValue = value;
        }

        static void SetInt(SerializedObject so, string name, int value)
        {
            var p = so.FindProperty(name);
            if (p != null) p.intValue = value;
        }

        static void SetBool(SerializedObject so, string name, bool value)
        {
            var p = so.FindProperty(name);
            if (p != null) p.boolValue = value;
        }
    }
}
#endif
