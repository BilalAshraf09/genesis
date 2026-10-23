using System;
using System.Collections;
using System.IO;
using System.Text;
using Genesis.Core;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.UIElements;

/// <summary>
/// Repro: PLAY THEATER from Atlas → TheaterPlay. Survives domain reload via SessionState.
/// </summary>
[InitializeOnLoad]
public static class PlayTheaterRepro
{
    const string PendingKey = "Genesis.PlayTheaterRepro.Pending";
    const string TheaterIdKey = "Genesis.PlayTheaterRepro.TheaterId";
    const string OutDir = "Assets/Plans";
    const string SelectScene = "Assets/Scenes/TheaterSelect.unity";

    static PlayTheaterRepro()
    {
        EditorApplication.playModeStateChanged += OnPlayModeStateChanged;
    }

    [MenuItem("Genesis/Verify/Repro PLAY THEATER (Port Arthur)")]
    public static void ReproPortArthur()
    {
        ArmAndPlay("hist-1905-port-arthur");
    }

    [MenuItem("Genesis/Verify/Repro PLAY THEATER (July Wire)")]
    public static void ReproJulyWire()
    {
        ArmAndPlay("hist-1914-july-wire");
    }

    static void ArmAndPlay(string theaterId)
    {
        Directory.CreateDirectory(OutDir);
        SessionState.SetString(TheaterIdKey, theaterId);
        SessionState.SetBool(PendingKey, true);

        if (SceneManager.GetActiveScene().path != SelectScene)
            EditorSceneManager.OpenScene(SelectScene, OpenSceneMode.Single);

        LayoutVerifyRunner.SetGameViewSize(390, 844);

        if (EditorApplication.isPlaying)
        {
            SessionState.SetBool(PendingKey, false);
            EditorCoroutine.Start(RunCoroutine());
        }
        else
        {
            Debug.Log($"[PlayTheaterRepro] Arming {theaterId}; entering Play…");
            EditorApplication.isPlaying = true;
        }
    }

    static void OnPlayModeStateChanged(PlayModeStateChange state)
    {
        if (state != PlayModeStateChange.EnteredPlayMode) return;
        if (!SessionState.GetBool(PendingKey, false)) return;
        SessionState.SetBool(PendingKey, false);
        EditorApplication.isPaused = false;
        EditorCoroutine.Start(RunCoroutine());
    }

    static IEnumerator RunCoroutine()
    {
        string theaterId = SessionState.GetString(TheaterIdKey, "hist-1914-july-wire");
        for (int i = 0; i < 40; i++)
            yield return null;

        Debug.Log($"[PlayTheaterRepro] BeginTheater {theaterId}");
        try
        {
            AppFlow.BeginTheater(theaterId);
        }
        catch (Exception ex)
        {
            WriteResult("EXCEPTION on BeginTheater\n" + ex);
            Debug.LogError(ex);
            yield break;
        }

        double start = EditorApplication.timeSinceStartup;
        while (SceneManager.GetActiveScene().name != "TheaterPlay"
               && EditorApplication.timeSinceStartup - start < 15.0)
            yield return null;

        for (int i = 0; i < 90; i++)
            yield return null;

        var sb = new StringBuilder();
        sb.AppendLine("theaterId=" + theaterId);
        sb.AppendLine("scene=" + SceneManager.GetActiveScene().name);
        sb.AppendLine("selected=" + AppFlow.SelectedTheaterId);
        sb.AppendLine("fromShell=" + AppFlow.CurrentPlayFromShell);
        sb.AppendLine("screen=" + Screen.width + "x" + Screen.height);

        var docs = UnityEngine.Object.FindObjectsByType<UIDocument>(FindObjectsInactive.Include);
        sb.AppendLine("uidocs=" + docs.Length);
        foreach (var d in docs)
        {
            var root = d.rootVisualElement;
            var header = root?.Q(className: "command-header");
            var sheet = root?.Q(className: "order-sheet");
            sb.AppendLine(
                $"  {d.gameObject.name} active={d.gameObject.activeInHierarchy} " +
                $"header={(header != null)} sheet={(sheet != null)}");
        }

        var session = UnityEngine.Object.FindAnyObjectByType<Genesis.Theater.TheaterSession>();
        sb.AppendLine("TheaterSession=" + (session != null));

        WriteResult(sb.ToString());
        Debug.Log("[PlayTheaterRepro]\n" + sb);

        ScreenCapture.CaptureScreenshot("Assets/Plans/play-theater-break.png");
        for (int i = 0; i < 20; i++)
            yield return null;

        Debug.Log("[PlayTheaterRepro] DONE — see Assets/Plans/play-theater-repro.txt");
    }

    static void WriteResult(string text)
    {
        File.WriteAllText(Path.Combine(OutDir, "play-theater-repro.txt"), text);
    }

    static class EditorCoroutine
    {
        public static void Start(IEnumerator routine)
        {
            EditorApplication.update += Tick;
            void Tick()
            {
                try
                {
                    if (!routine.MoveNext())
                        EditorApplication.update -= Tick;
                }
                catch (Exception ex)
                {
                    Debug.LogError("[PlayTheaterRepro] " + ex);
                    WriteResult("EXCEPTION\n" + ex);
                    EditorApplication.update -= Tick;
                }
            }
        }
    }
}
