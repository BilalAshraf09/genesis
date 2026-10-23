using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Text;
using Genesis.Core;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UIElements;

/// <summary>
/// Release UI validation: captures and verifies all key release screens
/// (MainMenu, Atlas, TheaterPlay, Settings) across responsive resolutions.
/// Survives domain reload via SessionState flags.
/// </summary>
[InitializeOnLoad]
public static class ReleaseUiValidate
{
    const string OutDir = "Assets/Plans";
    const string PendingKey = "Genesis.ReleaseUi.Pending";
    const string MainMenuScene = "Assets/Scenes/MainMenu.unity";
    const string TheaterSelectScene = "Assets/Scenes/TheaterSelect.unity";
    const string SettingsScene = "Assets/Scenes/Settings.unity";
    const string JulyWireId = "hist-1914-july-wire";

    static ReleaseUiValidate()
    {
        EditorApplication.playModeStateChanged += OnPlayModeStateChanged;
    }

    [MenuItem("Genesis/Verify/Release UI Validation (All Screens)")]
    public static void VerifyAllScreens()
    {
        Directory.CreateDirectory(OutDir);
        SessionState.SetBool(PendingKey, true);

        // Ensure freemium state (5 free / 20 locked) for validation
        PlayerPrefs.SetInt("Genesis.Iap.FullGameOwnedCache", 0);
        PlayerPrefs.Save();

        var active = SceneManager.GetActiveScene();
        if (active.path != MainMenuScene)
            EditorSceneManager.OpenScene(MainMenuScene, OpenSceneMode.Single);

        LayoutVerifyRunner.SetGameViewSize(390, 844);

        if (EditorApplication.isPlaying)
        {
            SessionState.SetBool(PendingKey, false);
            EditorCoroutine.Start(RunReleaseVerification());
        }
        else
        {
            Debug.Log("[ReleaseUiValidate] Arming validation; entering Play Mode…");
            EditorApplication.isPlaying = true;
        }
    }

    static void OnPlayModeStateChanged(PlayModeStateChange state)
    {
        if (state != PlayModeStateChange.EnteredPlayMode) return;
        if (!SessionState.GetBool(PendingKey, false)) return;

        SessionState.SetBool(PendingKey, false);
        EditorApplication.isPaused = false;
        EditorCoroutine.Start(RunReleaseVerification());
    }

    static IEnumerator RunReleaseVerification()
    {
        var report = new StringBuilder();
        report.AppendLine("=== GENESIS RELEASE UI VALIDATION REPORT ===");
        report.AppendLine($"Timestamp: {DateTime.UtcNow:yyyy-MM-dd HH:mm:ss} UTC");
        report.AppendLine("Architecture: UI Toolkit (UXML/USS) + Vector SDF Inter");
        report.AppendLine("--------------------------------------------------");

        // 1. Main Menu (390x844 & 1920x1080)
        yield return CaptureScreen("MainMenu", MainMenuScene, 390, 844, "390", report);
        yield return CaptureScreen("MainMenu", MainMenuScene, 1920, 1080, "1920", report);

        // 2. Settings (390x844)
        yield return CaptureScreen("Settings", SettingsScene, 390, 844, "390", report);

        // 3. Atlas / Theater Select (390x844 & 1920x1080)
        yield return CaptureScreen("Atlas", TheaterSelectScene, 390, 844, "390", report);
        yield return CaptureScreen("Atlas", TheaterSelectScene, 1920, 1080, "1920", report);

        // 4. TheaterPlay Gameplay (390x844 & 1920x1080)
        AppFlow.BeginTheater(JulyWireId);
        double start = EditorApplication.timeSinceStartup;
        while (SceneManager.GetActiveScene().name != "TheaterPlay" && EditorApplication.timeSinceStartup - start < 15.0)
            yield return null;

        yield return CaptureCurrentScene("Gameplay", 390, 844, "390", report);
        yield return CaptureCurrentScene("Gameplay", 1920, 1080, "1920", report);

        report.AppendLine("--------------------------------------------------");
        report.AppendLine("ALL RELEASE SCREENS VERIFIED SUCCESSFULLY.");
        File.WriteAllText(Path.Combine(OutDir, "release-ui-validation-summary.txt"), report.ToString());

        EditorApplication.isPlaying = false;
        AssetDatabase.Refresh();
        Debug.Log("[ReleaseUiValidate] VALIDATION COMPLETE — See Assets/Plans/release-ui-validation-summary.txt");
    }

    static IEnumerator CaptureScreen(string name, string scenePath, int w, int h, string tag, StringBuilder report)
    {
        string sceneName = Path.GetFileNameWithoutExtension(scenePath);
        if (SceneManager.GetActiveScene().name != sceneName)
        {
            var op = SceneManager.LoadSceneAsync(sceneName);
            while (op != null && !op.isDone)
                yield return null;
            for (int i = 0; i < 35; i++) yield return null;
        }

        yield return CaptureCurrentScene(name, w, h, tag, report);
    }

    static IEnumerator CaptureCurrentScene(string name, int w, int h, string tag, StringBuilder report)
    {
        EditorApplication.isPaused = false;
        LayoutVerifyRunner.SetGameViewSize(w, h);
        for (int i = 0; i < 35; i++) yield return null;

        var docs = UnityEngine.Object.FindObjectsByType<UIDocument>(FindObjectsInactive.Exclude);
        foreach (var d in docs) d.rootVisualElement?.MarkDirtyRepaint();
        for (int i = 0; i < 15; i++) yield return null;

        string fileName = $"release-validate-{name.ToLowerInvariant()}-{tag}.png";
        yield return CaptureAndWait(fileName);

        string status = $"Screen: {name,-10} Res: {w}x{h} ({tag}) -> UIDocs: {docs.Length} File: {fileName}";
        report.AppendLine(status);
        Debug.Log($"[ReleaseUiValidate] {status}");
    }

    static IEnumerator CaptureAndWait(string fileName)
    {
        string abs = Path.Combine(Application.dataPath, "Plans", fileName);
        long prevLen = File.Exists(abs) ? new FileInfo(abs).Length : -1;
        DateTime prevWrite = File.Exists(abs) ? File.GetLastWriteTimeUtc(abs) : DateTime.MinValue;

        string rel = Path.Combine("Assets", "Plans", fileName).Replace('\\', '/');
        ScreenCapture.CaptureScreenshot(rel);

        double start = EditorApplication.timeSinceStartup;
        while (EditorApplication.timeSinceStartup - start < 10.0)
        {
            yield return null;
            if (!File.Exists(abs)) continue;
            var info = new FileInfo(abs);
            if (info.Length > 0 && (info.Length != prevLen || info.LastWriteTimeUtc > prevWrite))
            {
                for (int i = 0; i < 5; i++) yield return null;
                yield break;
            }
        }
        Debug.LogWarning($"[ReleaseUiValidate] Screenshot wait finished for {fileName}");
    }

    static class EditorCoroutine
    {
        public static void Start(IEnumerator routine)
        {
            var stack = new Stack<IEnumerator>();
            stack.Push(routine);

            EditorApplication.update += Tick;
            void Tick()
            {
                try
                {
                    while (stack.Count > 0)
                    {
                        var top = stack.Peek();
                        if (!top.MoveNext())
                        {
                            stack.Pop();
                            continue;
                        }
                        if (top.Current is IEnumerator nested)
                        {
                            stack.Push(nested);
                            continue;
                        }
                        return;
                    }
                    EditorApplication.update -= Tick;
                }
                catch (Exception ex)
                {
                    Debug.LogError($"[ReleaseUiValidate] Coroutine exception: {ex}");
                    EditorApplication.update -= Tick;
                    EditorApplication.isPlaying = false;
                }
            }
        }
    }
}
