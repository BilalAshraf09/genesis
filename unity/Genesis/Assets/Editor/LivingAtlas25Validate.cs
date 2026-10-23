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
/// Living Atlas 25 validation: Game View captures for Atlas + July Wire
/// across the responsive matrix (390 / 430 / 900×1600 / 1920×1080).
/// </summary>
[InitializeOnLoad]
public static class LivingAtlas25Validate
{
    const string OutDir = "Assets/Plans";
    const string PendingKey = "Genesis.LivingAtlas25.Pending";
    const string ModeKey = "Genesis.LivingAtlas25.Mode"; // single | matrix
    const string TheaterSelectScene = "Assets/Scenes/TheaterSelect.unity";
    const string JulyWireId = "hist-1914-july-wire";

    static readonly (int w, int h, string tag)[] MatrixSizes =
    {
        (390, 844, "390"),
        (430, 932, "430"),
        (900, 1600, "900"),
        (1920, 1080, "1920"),
    };

    static LivingAtlas25Validate()
    {
        EditorApplication.playModeStateChanged += OnPlayModeStateChanged;
    }

    [MenuItem("Genesis/Verify/Living Atlas 25 (390)")]
    public static void Verify390()
    {
        ArmAndPlay("single");
    }

    [MenuItem("Genesis/Verify/Living Atlas 25 (Matrix)")]
    public static void VerifyMatrix()
    {
        ArmAndPlay("matrix");
    }

    static void ArmAndPlay(string mode)
    {
        Directory.CreateDirectory(OutDir);
        SessionState.SetString(ModeKey, mode);
        SessionState.SetBool(PendingKey, true);

        // Ensure freemium state (5 free / 20 locked) for validation
        PlayerPrefs.SetInt("Genesis.Iap.FullGameOwnedCache", 0);
        PlayerPrefs.Save();

        var active = SceneManager.GetActiveScene();
        if (active.path != TheaterSelectScene)
            EditorSceneManager.OpenScene(TheaterSelectScene, OpenSceneMode.Single);

        LayoutVerifyRunner.SetGameViewSize(390, 844);

        if (EditorApplication.isPlaying)
        {
            SessionState.SetBool(PendingKey, false);
            EditorCoroutine.Start(mode == "matrix" ? RunMatrixCoroutine() : RunSingle390Coroutine());
        }
        else
        {
            Debug.Log($"[LivingAtlas25] Arming {mode} validation; entering Play Mode…");
            EditorApplication.isPlaying = true;
        }
    }

    static void OnPlayModeStateChanged(PlayModeStateChange state)
    {
        if (state != PlayModeStateChange.EnteredPlayMode) return;
        if (!SessionState.GetBool(PendingKey, false)) return;

        SessionState.SetBool(PendingKey, false);
        string mode = SessionState.GetString(ModeKey, "single");
        Debug.Log($"[LivingAtlas25] EnteredPlayMode mode={mode}");
        EditorApplication.isPaused = false;
        EditorCoroutine.Start(mode == "matrix" ? RunMatrixCoroutine() : RunSingle390Coroutine());
    }

    static IEnumerator RunSingle390Coroutine()
    {
        yield return CaptureAtlasAt(390, 844, "390");
        yield return CapturePlayAt(390, 844, "390");
        Finish();
    }

    static IEnumerator RunMatrixCoroutine()
    {
        var summary = new StringBuilder();
        summary.AppendLine("=== Living Atlas 25 matrix ===");

        foreach (var (w, h, tag) in MatrixSizes)
        {
            yield return CaptureAtlasAt(w, h, tag);
            string metricsPath = Path.Combine(OutDir, $"living-atlas-{tag}-metrics.txt");
            if (File.Exists(Path.Combine(Application.dataPath, "Plans", $"living-atlas-{tag}-metrics.txt")))
                summary.AppendLine(File.ReadAllText(Path.Combine(Application.dataPath, "Plans", $"living-atlas-{tag}-metrics.txt")).Trim());
            summary.AppendLine("---");
        }

        foreach (var (w, h, tag) in MatrixSizes)
        {
            yield return CapturePlayAt(w, h, tag);
        }

        File.WriteAllText(Path.Combine(OutDir, "living-atlas-matrix-summary.txt"), summary.ToString());
        Finish();
    }

    static IEnumerator CaptureAtlasAt(int w, int h, string tag)
    {
        EditorApplication.isPaused = false;
        LayoutVerifyRunner.SetGameViewSize(w, h);
        for (int i = 0; i < 28; i++)
            yield return null;

        // Force geometry pass so RelayoutGridIfNeeded sees the new scale.
        foreach (var doc in UnityEngine.Object.FindObjectsByType<UIDocument>(FindObjectsInactive.Exclude))
            doc.rootVisualElement?.MarkDirtyRepaint();
        for (int i = 0; i < 12; i++)
            yield return null;

        int cards = CountQuery("theater-card");
        int locked = CountQuery("theater-card--locked");
        float gridW = 0f;
        float ppp = 0f;
        int sampleCols = EstimateColumns();
        int gridKids = -1;
        string gridKid0 = "-";
        int sliceCount = -1;
        try
        {
            var slice = TheaterCatalogLoader.LoadSelectionSlice();
            sliceCount = slice?.theaters?.Count ?? -1;
        }
        catch (Exception ex)
        {
            gridKid0 = "sliceEx:" + ex.Message;
        }

        foreach (var doc in UnityEngine.Object.FindObjectsByType<UIDocument>(FindObjectsInactive.Exclude))
        {
            var grid = doc.rootVisualElement?.Q(className: "theater-grid");
            if (grid == null) continue;
            gridW = grid.resolvedStyle.width;
            ppp = grid.panel?.scaledPixelsPerPoint ?? 0f;
            gridKids = grid.childCount;
            if (grid.childCount > 0)
            {
                var c0 = grid[0];
                gridKid0 = $"{c0.GetType().Name}|name={c0.name}";
            }
            break;
        }

        var ctrl = UnityEngine.Object.FindAnyObjectByType<TheaterSelectController>();

        string metrics =
            $"tag={tag}\nrequested={w}x{h}\nscreen={Screen.width}x{Screen.height}\n" +
            $"cards={cards} locked={locked} cols~={sampleCols}\n" +
            $"gridPanelW={gridW:F1} ppp={ppp:F3} screenW~={gridW * ppp:F1}\n" +
            $"gridKids={gridKids} kid0={gridKid0} sliceCount={sliceCount} ctrl={(ctrl != null)}\n" +
            $"scene={SceneManager.GetActiveScene().name}\n";
        File.WriteAllText(Path.Combine(OutDir, $"living-atlas-{tag}-metrics.txt"), metrics);

        yield return CaptureAndWait($"living-atlas-validate-{tag}.png");
        Debug.Log($"[LivingAtlas25] Atlas {tag} → cards={cards} locked={locked} cols~={sampleCols}");
    }

    static IEnumerator CapturePlayAt(int w, int h, string tag)
    {
        EditorApplication.isPaused = false;

        if (SceneManager.GetActiveScene().name != "TheaterPlay")
        {
            AppFlow.BeginTheater(JulyWireId);
            double start = EditorApplication.timeSinceStartup;
            while (SceneManager.GetActiveScene().name != "TheaterPlay"
                   && EditorApplication.timeSinceStartup - start < 12.0)
                yield return null;
        }

        LayoutVerifyRunner.SetGameViewSize(w, h);
        for (int i = 0; i < 60; i++)
            yield return null;

        int docs = UnityEngine.Object.FindObjectsByType<UIDocument>(FindObjectsInactive.Include).Length;
        File.WriteAllText(Path.Combine(OutDir, $"living-play-{tag}-metrics.txt"),
            $"tag={tag}\nrequested={w}x{h}\nscreen={Screen.width}x{Screen.height}\n" +
            $"uidocs={docs}\nscene={SceneManager.GetActiveScene().name}\n" +
            $"theater={AppFlow.SelectedTheaterId}\n");

        yield return CaptureAndWait($"living-play-validate-{tag}.png");
        Debug.Log($"[LivingAtlas25] Play {tag} → uidocs={docs}");
    }

    static void Finish()
    {
        EditorApplication.isPlaying = false;
        AssetDatabase.Refresh();
        Debug.Log("[LivingAtlas25] VALIDATION_COMPLETE");
    }

    /// <summary>Heuristic: count theater-cards whose marginRight is 0 in the first row stretch.</summary>
    static int EstimateColumns()
    {
        var widths = new List<float>();
        foreach (var doc in UnityEngine.Object.FindObjectsByType<UIDocument>(FindObjectsInactive.Exclude))
        {
            var root = doc.rootVisualElement;
            if (root == null) continue;
            foreach (var card in root.Query(className: "theater-card").ToList())
            {
                float mw = card.resolvedStyle.width;
                if (mw > 1f) widths.Add(mw);
                if (widths.Count >= 8) break;
            }
        }
        if (widths.Count < 2) return -1;
        // Cards in one row share roughly the same width; cols ≈ grid/card.
        float cardW = widths[0];
        foreach (var doc in UnityEngine.Object.FindObjectsByType<UIDocument>(FindObjectsInactive.Exclude))
        {
            var grid = doc.rootVisualElement?.Q(className: "theater-grid");
            if (grid == null) continue;
            float gw = grid.resolvedStyle.width;
            if (gw > 8f && cardW > 8f)
                return Mathf.Clamp(Mathf.RoundToInt(gw / cardW), 1, 6);
        }
        return -1;
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
                for (int i = 0; i < 6; i++)
                    yield return null;
                Debug.Log($"[LivingAtlas25] Wrote {abs} ({info.Length} bytes)");
                yield break;
            }
        }

        Debug.LogError($"[LivingAtlas25] Timed out waiting for screenshot {abs}");
    }

    static int CountQuery(string className)
    {
        int n = 0;
        foreach (var doc in UnityEngine.Object.FindObjectsByType<UIDocument>(FindObjectsInactive.Exclude))
        {
            var root = doc.rootVisualElement;
            if (root == null) continue;
            n += root.Query(className: className).ToList().Count;
        }
        return n;
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
                    Debug.LogError($"[LivingAtlas25] coroutine failed: {ex}");
                    EditorApplication.update -= Tick;
                    EditorApplication.isPlaying = false;
                }
            }
        }
    }
}
