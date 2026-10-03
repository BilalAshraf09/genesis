#if UNITY_EDITOR
using System.IO;
using System.Linq;
using UnityEditor;
using UnityEditor.Build;
using UnityEditor.Build.Reporting;
using UnityEngine;
using UnityEngine.Rendering;

namespace Genesis.EditorTools
{
    /// <summary>
    /// Mobile Player Settings harden + Android AAB / iOS Xcode export stubs.
    /// Credentials (keystore, Apple Team, provisioning) stay on Bilal's machine —
    /// see docs/unity-mobile-release.md in the project store.
    /// </summary>
    public static class GenesisMobileBuild
    {
        const string PackageId = "com.bilalashraf.genesis";
        const string AndroidOutDir = "Builds/Android";
        const string IosOutDir = "Builds/iOS";
        const string PipelinePath = "Assets/Settings/Genesis_URP_Pipeline.asset";

        [MenuItem("Genesis/Mobile/Apply Mobile Player Settings")]
        public static void ApplyMobilePlayerSettings()
        {
            PlayerSettings.companyName = "Bilal Ashraf";
            PlayerSettings.productName = "Genesis";
            PlayerSettings.bundleVersion = string.IsNullOrWhiteSpace(PlayerSettings.bundleVersion)
                ? "0.1.0"
                : PlayerSettings.bundleVersion;

            PlayerSettings.SetApplicationIdentifier(NamedBuildTarget.Android, PackageId);
            PlayerSettings.SetApplicationIdentifier(NamedBuildTarget.iOS, PackageId);

            // Portrait-first war desk (Ops HUD is 1080×1920).
            PlayerSettings.defaultInterfaceOrientation = UIOrientation.Portrait;
            PlayerSettings.allowedAutorotateToPortrait = true;
            PlayerSettings.allowedAutorotateToPortraitUpsideDown = false;
            PlayerSettings.allowedAutorotateToLandscapeLeft = false;
            PlayerSettings.allowedAutorotateToLandscapeRight = false;

            PlayerSettings.SetScriptingBackend(NamedBuildTarget.Android, ScriptingImplementation.IL2CPP);
            PlayerSettings.SetScriptingBackend(NamedBuildTarget.iOS, ScriptingImplementation.IL2CPP);
            PlayerSettings.Android.targetArchitectures = AndroidArchitecture.ARM64;
            PlayerSettings.Android.minSdkVersion = AndroidSdkVersions.AndroidApiLevel26;
            // 0 = highest installed SDK / Play requirement at build time.
            PlayerSettings.Android.targetSdkVersion = AndroidSdkVersions.AndroidApiLevelAuto;
            PlayerSettings.iOS.targetOSVersionString = "15.0";
            PlayerSettings.iOS.sdkVersion = iOSSdkVersion.DeviceSDK;

            PlayerSettings.SetGraphicsAPIs(BuildTarget.Android, new[]
            {
                GraphicsDeviceType.Vulkan,
                GraphicsDeviceType.OpenGLES3,
            });
            PlayerSettings.SetUseDefaultGraphicsAPIs(BuildTarget.Android, false);

            EditorUserBuildSettings.buildAppBundle = true;
            EditorUserBuildSettings.androidBuildSystem = AndroidBuildSystem.Gradle;

            EnsureQualityPipelinesOnAllTiers();
            AssetDatabase.SaveAssets();
            Debug.Log(
                "[Genesis] Mobile Player Settings applied — " +
                $"{PackageId}, Portrait, IL2CPP, Android ARM64, minAPI 26, iOS 15+, AAB flag on. " +
                "Quality defaults (Android/iPhone → Medium floor; flagship runtime → High; Standalone/Editor → High) live in QualitySettings.asset. " +
                "URP Render Scale 1.0 on Mid/High — see docs/unity-sota-visual-plan.md. " +
                "Rebuild Full App Shell enables SSAO + DeskDust. Signing / Team ID still Bilal.");
        }

        [MenuItem("Genesis/Mobile/Build Android AAB (internal)")]
        public static void BuildAndroidAab()
        {
            ApplyMobilePlayerSettings();

            if (!BuildPipeline.IsBuildTargetSupported(BuildTargetGroup.Android, BuildTarget.Android))
            {
                Debug.LogError(
                    "[Genesis] Android build support not installed in this Editor. " +
                    "Hub → Installs → Add Modules → Android Build Support (SDK+NDK+OpenJDK). " +
                    "Then re-run Genesis → Mobile → Build Android AAB.");
                return;
            }

            Directory.CreateDirectory(AndroidOutDir);
            var path = Path.Combine(AndroidOutDir, $"Genesis-{PlayerSettings.bundleVersion}.aab");
            EditorUserBuildSettings.buildAppBundle = true;

            var scenes = EnabledScenes();
            if (scenes.Length == 0)
            {
                Debug.LogError("[Genesis] No enabled scenes in Build Settings. Run Genesis → Rebuild Full App Shell.");
                return;
            }

            var opts = new BuildPlayerOptions
            {
                scenes = scenes,
                locationPathName = path,
                target = BuildTarget.Android,
                options = BuildOptions.None,
            };

            Debug.Log($"[Genesis] Building Android AAB → {path}");
            var report = BuildPipeline.BuildPlayer(opts);
            LogReport(report, "Android AAB");

            if (report.summary.result == BuildResult.Succeeded)
            {
                Debug.Log(
                    "[Genesis] AAB ready. Upload to Play Console → Testing → Internal testing. " +
                    "If unsigned/debug-signed, Bilal must create a upload keystore (see unity-mobile-release.md).");
                EditorUtility.RevealInFinder(path);
            }
        }

        [MenuItem("Genesis/Mobile/Export iOS Xcode Project")]
        public static void ExportIosXcode()
        {
            ApplyMobilePlayerSettings();

            if (!BuildPipeline.IsBuildTargetSupported(BuildTargetGroup.iOS, BuildTarget.iOS))
            {
                Debug.LogError(
                    "[Genesis] iOS build support not installed (requires macOS Editor + iOS module). " +
                    "On Mac: Hub → Add Modules → iOS Build Support, then re-run this menu.");
                return;
            }

            Directory.CreateDirectory(IosOutDir);
            var path = IosOutDir;
            var scenes = EnabledScenes();
            if (scenes.Length == 0)
            {
                Debug.LogError("[Genesis] No enabled scenes in Build Settings. Run Genesis → Rebuild Full App Shell.");
                return;
            }

            var opts = new BuildPlayerOptions
            {
                scenes = scenes,
                locationPathName = path,
                target = BuildTarget.iOS,
                options = BuildOptions.None,
            };

            Debug.Log($"[Genesis] Exporting iOS Xcode project → {path}");
            var report = BuildPipeline.BuildPlayer(opts);
            LogReport(report, "iOS Xcode");

            if (report.summary.result == BuildResult.Succeeded)
            {
                Debug.Log(
                    "[Genesis] Xcode project exported. Open in Xcode → Signing & Capabilities " +
                    "(Team + Automatic) → Archive → Distribute → TestFlight. " +
                    "Apple credentials are Bilal-only — see unity-mobile-release.md.");
                EditorUtility.RevealInFinder(path);
            }
        }

        [MenuItem("Genesis/Mobile/Open Release Doc Notes")]
        public static void OpenReleaseDocNotes()
        {
            Debug.Log(
                "[Genesis] Mobile release checklist:\n" +
                "1) Genesis → Mobile → Apply Mobile Player Settings\n" +
                "2) Assign icons under Player Settings → Android/iOS Icon (placeholders empty)\n" +
                "3) Android: create upload keystore OR use Play App Signing\n" +
                "4) Genesis → Mobile → Build Android AAB → Play Console Internal testing\n" +
                "5) Mac: Genesis → Mobile → Export iOS Xcode → Xcode Archive → TestFlight\n" +
                "Full steps: project store docs/unity-mobile-release.md");
        }

        static string[] EnabledScenes()
        {
            return EditorBuildSettings.scenes
                .Where(s => s.enabled && !string.IsNullOrEmpty(s.path))
                .Select(s => s.path)
                .ToArray();
        }

        static void LogReport(BuildReport report, string label)
        {
            var s = report.summary;
            if (s.result == BuildResult.Succeeded)
            {
                Debug.Log($"[Genesis] {label} SUCCEEDED — {s.totalSize} bytes, {s.totalTime}");
            }
            else
            {
                Debug.LogError($"[Genesis] {label} {s.result} — errors={s.totalErrors} warnings={s.totalWarnings}");
            }
        }

        static void EnsureQualityPipelinesOnAllTiers()
        {
            var pipeline = AssetDatabase.LoadAssetAtPath<RenderPipelineAsset>(PipelinePath);
            if (pipeline == null)
            {
                Debug.LogWarning(
                    $"[Genesis] Missing {PipelinePath}. Run Genesis → Ensure URP Pipeline Assets first.");
                return;
            }

            GraphicsSettings.defaultRenderPipeline = pipeline;
            var count = QualitySettings.names.Length;
            GenesisSceneBuilder.AssignUrpToAllQualityTiers(pipeline);

            // Keep Very Low wired even if someone clears the current-tier slot.
            QualitySettings.renderPipeline = pipeline;
            Debug.Log($"[Genesis] URP assigned to all {count} quality tiers (incl. Very Low).");
        }
    }
}
#endif
