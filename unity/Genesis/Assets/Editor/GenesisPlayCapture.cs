#if UNITY_EDITOR
using System.Collections;
using System.Collections.Generic;
using System.IO;
using Genesis.Core;
using Genesis.Theater;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.UI;

namespace Genesis.EditorTools
{
    /// <summary>
    /// Automates Rebuild → Play → select → EXECUTE → stills + frames.
    /// Captures via Camera.Render → RenderTexture (works without Game-view focus).
    /// Overlay canvases are temporarily switched to Screen Space Camera for the grab.
    /// Set GENESIS_AUTO_CAPTURE=1 to start after domain reload.
    /// </summary>
    public static class GenesisPlayCapture
    {
        const string ScenePath = "Assets/Scenes/TheaterPlay.unity";
        const string CaptureDir = "Temp/GenesisCapture";
        const string FramesDir = "Temp/GenesisCapture/frames";
        const string DoneMarker = "Temp/GenesisCapture/DONE.txt";
        const string AttemptMarker = "Temp/GenesisCapture/ATTEMPTS.txt";
        // Survives domain reload between menu/CLI invoke and EnteredPlayMode.
        const string RequestMarker = "Temp/GenesisCapture/CAPTURE_REQUEST.txt";
        const string PipelinePath = "Assets/Settings/Genesis_URP_Pipeline.asset";
        const string PartitionTheaterId = "hist-1947-radcliffe";
        const int CaptureWidth = 1280;
        const int CaptureHeight = 720;
        const int ClarityWidth = 1080;
        const int ClarityHeight = 1920;

        static bool _runnerAlive;
        static bool _publishQueued;
        static bool _forceHighForCapture;
        static bool _premiumStoreNames;
        static bool _clarityGate;
        static bool _leavePlayAfterPublish;
        static int _captureW = CaptureWidth;
        static int _captureH = CaptureHeight;

        static void WriteCaptureRequest()
        {
            try
            {
                Directory.CreateDirectory(CaptureDir);
                var mode = _clarityGate ? "clarity" : _premiumStoreNames ? "premium" : "worldclass";
                File.WriteAllText(
                    RequestMarker,
                    $"{mode}\n{_captureW}x{_captureH}\nforceHigh={(_forceHighForCapture ? 1 : 0)}\nleavePlay={(_leavePlayAfterPublish ? 1 : 0)}\n");
            }
            catch { /* ignore */ }
        }

        static void LoadCaptureRequest()
        {
            try
            {
                if (!File.Exists(RequestMarker)) return;
                var lines = File.ReadAllLines(RequestMarker);
                if (lines.Length == 0) return;
                var mode = lines[0].Trim().ToLowerInvariant();
                _clarityGate = mode == "clarity";
                _premiumStoreNames = mode == "premium";
                if (lines.Length > 1)
                {
                    var dim = lines[1].Trim().Split('x');
                    if (dim.Length == 2 &&
                        int.TryParse(dim[0], out var w) &&
                        int.TryParse(dim[1], out var h) &&
                        w > 0 && h > 0)
                    {
                        _captureW = w;
                        _captureH = h;
                    }
                }

                foreach (var line in lines)
                {
                    if (line.StartsWith("forceHigh=1")) _forceHighForCapture = true;
                    if (line.StartsWith("leavePlay=1")) _leavePlayAfterPublish = true;
                }
            }
            catch { /* ignore */ }
        }

        static void ClearCaptureRequest()
        {
            try { if (File.Exists(RequestMarker)) File.Delete(RequestMarker); }
            catch { /* ignore */ }
        }

        static int ReadAttempts()
        {
            try
            {
                if (!File.Exists(AttemptMarker)) return 0;
                return int.TryParse(File.ReadAllText(AttemptMarker).Trim(), out var n) ? n : 0;
            }
            catch { return 0; }
        }

        static void WriteAttempts(int n)
        {
            try
            {
                Directory.CreateDirectory(CaptureDir);
                File.WriteAllText(AttemptMarker, n.ToString());
            }
            catch { /* ignore */ }
        }

        [InitializeOnLoadMethod]
        static void AutoCaptureHook()
        {
            // Always re-bind after domain reload — Play Mode clears prior subscriptions.
            EditorApplication.playModeStateChanged -= OnPlayModeChanged;
            EditorApplication.playModeStateChanged += OnPlayModeChanged;

            // If we entered Play with a pending request but missed EnteredPlayMode (reload race),
            // poll once scripts settle and spawn the runner.
            EditorApplication.update -= TryPendingRequestWhilePlaying;
            EditorApplication.update += TryPendingRequestWhilePlaying;

            var flag = System.Environment.GetEnvironmentVariable("GENESIS_AUTO_CAPTURE");
            if (string.IsNullOrEmpty(flag)) return;
            if (flag != "1" && !flag.Equals("true", System.StringComparison.OrdinalIgnoreCase)) return;
            if (File.Exists(DoneMarker)) return;
            // Poll until compile/import settles — delayCall is lost on domain reload.
            EditorApplication.update -= TryAutoCaptureTick;
            EditorApplication.update += TryAutoCaptureTick;
        }

        static void TryPendingRequestWhilePlaying()
        {
            if (EditorApplication.isCompiling || EditorApplication.isUpdating) return;
            if (!EditorApplication.isPlaying) return;
            if (!File.Exists(RequestMarker)) return;
            if (_runnerAlive) return;
            if (Object.FindFirstObjectByType<PlayCaptureRunner>() != null)
            {
                _runnerAlive = true;
                return;
            }

            Debug.Log("[Genesis] Pending CAPTURE_REQUEST while already Playing — starting runner.");
            StartCaptureRunnerFromRequest();
        }

        static void StartCaptureRunnerFromRequest()
        {
            LoadCaptureRequest();
            ClearCaptureRequest();

            if (_forceHighForCapture)
            {
                TheaterPlayBootstrap.ForceHighQualityForStore();
                _forceHighForCapture = false;
            }

            if (_clarityGate)
            {
                AppFlow.SelectedTheaterId = PartitionTheaterId;
                var boot = Object.FindFirstObjectByType<TheaterPlayBootstrap>();
                if (boot != null) boot.theaterId = PartitionTheaterId;
            }

            var host = new GameObject("GenesisPlayCaptureHost");
            Object.DontDestroyOnLoad(host);
            _runnerAlive = true;
            var leavePlay = _leavePlayAfterPublish;
            host.AddComponent<PlayCaptureRunner>().Begin(
                CaptureDir, FramesDir, () => FinishAndPublish(leavePlay),
                _premiumStoreNames, _clarityGate, _captureW, _captureH);
            _premiumStoreNames = false;
            _clarityGate = false;
            _leavePlayAfterPublish = false;
            _captureW = CaptureWidth;
            _captureH = CaptureHeight;
        }

        static void TryAutoCaptureTick()
        {
            if (EditorApplication.isCompiling || EditorApplication.isUpdating) return;
            if (EditorApplication.isPlayingOrWillChangePlaymode) return;
            if (File.Exists(DoneMarker))
            {
                EditorApplication.update -= TryAutoCaptureTick;
                return;
            }

            var attempts = ReadAttempts();
            if (attempts >= 3)
            {
                EditorApplication.update -= TryAutoCaptureTick;
                Debug.LogError("[Genesis] Auto-capture gave up after 3 Play Mode attempts.");
                return;
            }

            EditorApplication.update -= TryAutoCaptureTick;
            Debug.Log("[Genesis] GENESIS_AUTO_CAPTURE — starting worldclass capture.");
            PrepareAndEnterPlay();
        }

        [MenuItem("Genesis/Batch Rebuild (CLI)")]
        public static void BatchRebuild()
        {
            GenesisSceneBuilder.EnsureUrpPipelineAssets();
            GenesisSceneBuilder.Rebuild();
            GenesisSceneBuilder.ValidateSlice();
            Debug.Log("[Genesis] BatchRebuild complete.");
        }

        [MenuItem("Genesis/Capture Worldclass Play Demo")]
        public static void CaptureWorldclassFromMenu()
        {
            WriteAttempts(0);
            _clarityGate = false;
            _premiumStoreNames = false;
            _leavePlayAfterPublish = false;
            _captureW = CaptureWidth;
            _captureH = CaptureHeight;
            WriteCaptureRequest();
            PrepareAndEnterPlay();
        }

        /// <summary>
        /// Legacy Phase 2/3 hero stills — landscape modern filenames.
        /// Prefer Clarity Gate for Bilal readable gate.
        /// </summary>
        [MenuItem("Genesis/Capture Phase 2-3 Modern Board Stills")]
        public static void CaptureModernBoardFromMenu()
        {
            WriteAttempts(0);
            _clarityGate = false;
            _premiumStoreNames = false;
            _leavePlayAfterPublish = false;
            _captureW = CaptureWidth;
            _captureH = CaptureHeight;
            WriteCaptureRequest();
            PrepareAndEnterPlay();
        }

        /// <summary>
        /// AAA Phase 2 clarity gate — portrait Partition A/B/C stills (1080×1920).
        /// Output: Temp/GenesisCapture/genesis-unity-mobile-clarity-{A,B,C}.png
        /// Publishes into Agent Store media/ (GENESIS_STORE_MEDIA or default Mac/cloud paths).
        /// Cloud Linux VMs without a licensed Editor cannot run this — Bilal Mac only.
        /// </summary>
        [MenuItem("Genesis/Capture/Clarity Gate Stills (A/B/C Partition)")]
        public static void CaptureClarityGateFromMenu()
        {
            WriteAttempts(0);
            _forceHighForCapture = true;
            _premiumStoreNames = false;
            _clarityGate = true;
            _leavePlayAfterPublish = true;
            _captureW = ClarityWidth;
            _captureH = ClarityHeight;
            AppFlow.SelectedTheaterId = PartitionTheaterId;
            WriteCaptureRequest();
            PrepareAndEnterPlay();
        }

        /// <summary>
        /// Phase C store readiness — force High, capture premium board/execute/results stills.
        /// Output: Temp/GenesisCapture/genesis-unity-premium-{board,execute,results}.png
        /// Publish copies into Agent Store media/ when GENESIS_STORE_MEDIA is set.
        /// </summary>
        [MenuItem("Genesis/Capture/Store High Stills (Premium)")]
        public static void CaptureStoreHighStillsFromMenu()
        {
            WriteAttempts(0);
            _forceHighForCapture = true;
            _premiumStoreNames = true;
            _clarityGate = false;
            _leavePlayAfterPublish = false;
            _captureW = CaptureWidth;
            _captureH = CaptureHeight;
            WriteCaptureRequest();
            PrepareAndEnterPlay();
        }

        [MenuItem("Genesis/Capture/Force High Quality Now")]
        public static void ForceHighQualityNow()
        {
            TheaterPlayBootstrap.ForceHighQualityForStore();
            Debug.Log("[Genesis] Editor quality forced to High for store / flagship review.");
        }

        [MenuItem("Genesis/Capture/Open Capture Output Folder")]
        public static void OpenCaptureOutputFolder()
        {
            var projectRoot = Path.GetFullPath(Path.Combine(Application.dataPath, ".."));
            var abs = Path.Combine(projectRoot, CaptureDir);
            Directory.CreateDirectory(abs);
            EditorUtility.RevealInFinder(abs);
            Debug.Log($"[Genesis] Capture output: {abs}");
        }

        public static void BatchPlayCapture()
        {
            WriteAttempts(0);
            PrepareAndEnterPlay();
        }

        static void PrepareAndEnterPlay()
        {
            Directory.CreateDirectory(CaptureDir);
            Directory.CreateDirectory(FramesDir);
            foreach (var f in Directory.GetFiles(FramesDir, "*.png")) File.Delete(f);
            if (File.Exists(DoneMarker)) File.Delete(DoneMarker);

            // Avoid dirtying URP assets right before Play — that triggers a domain reload
            // which aborts Play Mode and kills the capture runner.
            if (!File.Exists(PipelinePath))
            {
                GenesisSceneBuilder.EnsureUrpPipelineAssets();
                AssetDatabase.SaveAssets();
            }

            if (!File.Exists(ScenePath)) GenesisSceneBuilder.Rebuild();
            else EditorSceneManager.OpenScene(ScenePath);

            // Wait one more editor tick after scene open so imports settle.
            EditorApplication.delayCall += EnterPlayWhenSettled;
        }

        static void EnterPlayWhenSettled()
        {
            if (EditorApplication.isCompiling || EditorApplication.isUpdating)
            {
                EditorApplication.delayCall += EnterPlayWhenSettled;
                return;
            }

            var attempts = ReadAttempts() + 1;
            WriteAttempts(attempts);
            _runnerAlive = false;
            _publishQueued = false;
            EditorApplication.playModeStateChanged -= OnPlayModeChanged;
            EditorApplication.playModeStateChanged += OnPlayModeChanged;
            Debug.Log($"[Genesis] Entering Play Mode for worldclass capture (attempt {attempts})…");
            EditorApplication.isPlaying = true;
        }

        static void OnPlayModeChanged(PlayModeStateChange state)
        {
            if (state == PlayModeStateChange.EnteredPlayMode)
            {
                if (!File.Exists(RequestMarker) && !_runnerAlive)
                    return;
                if (_runnerAlive || Object.FindFirstObjectByType<PlayCaptureRunner>() != null)
                    return;

                StartCaptureRunnerFromRequest();
                return;
            }

            if (state == PlayModeStateChange.ExitingPlayMode || state == PlayModeStateChange.EnteredEditMode)
            {
                if (_publishQueued || File.Exists(DoneMarker)) return;
                if (!_runnerAlive && File.Exists(RequestMarker) && ReadAttempts() < 3)
                {
                    Debug.LogWarning("[Genesis] Play Mode exited before capture finished — will retry.");
                    EditorApplication.update -= TryAutoCaptureTick;
                    EditorApplication.update += TryAutoCaptureTick;
                }
            }
        }

        static void FinishAndPublish(bool leavePlayRunning = false)
        {
            _publishQueued = true;
            // Publish while still in Play when requested (clarity gate leaves board visible).
            if (!leavePlayRunning)
                EditorApplication.isPlaying = false;

            void PublishWork()
            {
                try { PublishToStoreMedia(); }
                catch (System.Exception ex) { Debug.LogError($"[Genesis] Publish media failed: {ex}"); }

                try
                {
                    Directory.CreateDirectory(CaptureDir);
                    File.WriteAllText(DoneMarker, System.DateTime.UtcNow.ToString("o") + "\n");
                }
                catch { /* ignore */ }

                EditorApplication.playModeStateChanged -= OnPlayModeChanged;
                Debug.Log("[Genesis] Worldclass Play capture finished.");

                if (System.Environment.GetEnvironmentVariable("GENESIS_AUTO_QUIT") == "1")
                {
                    EditorApplication.delayCall += () => EditorApplication.Exit(0);
                }
            }

            if (leavePlayRunning)
                PublishWork();
            else
                EditorApplication.delayCall += PublishWork;
        }

        static string ResolveStoreMedia()
        {
            var env = System.Environment.GetEnvironmentVariable("GENESIS_STORE_MEDIA");
            if (!string.IsNullOrEmpty(env)) return env;

            foreach (var candidate in new[]
                     {
                         "/cursor/stores/bc-0056b9ef-d437-43fa-8b4a-34853da57a5f/media",
                         "/cursor/stores/self/media",
                     })
            {
                if (Directory.Exists(Path.GetDirectoryName(candidate)) || Directory.Exists(candidate))
                    return candidate;
            }

            var home = System.Environment.GetFolderPath(System.Environment.SpecialFolder.UserProfile);
            return Path.Combine(
                home,
                "Library/Application Support/Cursor/AgentStores/cursor_agent_stores",
                "bc-0056b9ef-d437-43fa-8b4a-34853da57a5f/files/media");
        }

        static void PublishToStoreMedia()
        {
            var media = ResolveStoreMedia();
            Directory.CreateDirectory(media);
            var projectRoot = Path.GetFullPath(Path.Combine(Application.dataPath, ".."));

            foreach (var name in new[]
                     {
                         "genesis-unity-mobile-clarity-A.png",
                         "genesis-unity-mobile-clarity-B.png",
                         "genesis-unity-mobile-clarity-C.png",
                         "genesis-unity-worldclass-01.png",
                         "genesis-unity-worldclass-02.png",
                         "genesis-unity-worldclass-03.png",
                         "genesis-unity-worldclass-resolve.png",
                         "genesis-unity-modern-board.png",
                         "genesis-unity-modern-execute.png",
                         "genesis-unity-modern-resolve.png",
                         "genesis-unity-premium-board.png",
                         "genesis-unity-premium-execute.png",
                         "genesis-unity-premium-results.png"
                     })
            {
                var candidates = new[]
                {
                    Path.Combine(projectRoot, CaptureDir, name),
                    Path.Combine(CaptureDir, name),
                    Path.Combine(projectRoot, name)
                };
                string src = null;
                foreach (var c in candidates)
                {
                    if (File.Exists(c)) { src = c; break; }
                }

                if (src == null)
                {
                    // Optional unless that capture menu was used.
                    if (name.Contains("premium") || name.Contains("clarity") || name.Contains("worldclass")
                        || name.Contains("modern"))
                        continue;
                    Debug.LogWarning($"[Genesis] Missing still {name}");
                    continue;
                }

                var dst = Path.Combine(media, name);
                File.Copy(src, dst, true);
                Debug.Log($"[Genesis] Published still → {dst}");
            }

            // Skip video assemble for clarity-only runs (no frame strip required).
            if (Directory.Exists(Path.Combine(projectRoot, FramesDir))
                && Directory.GetFiles(Path.Combine(projectRoot, FramesDir), "frame_*.png").Length >= 3)
                AssembleVideo(media, projectRoot);
        }

        static void AssembleVideo(string media, string projectRoot)
        {
            var frames = Path.Combine(projectRoot, FramesDir);
            if (!Directory.Exists(frames)) return;
            var frameFiles = Directory.GetFiles(frames, "frame_*.png");
            if (frameFiles.Length < 3)
            {
                Debug.LogWarning($"[Genesis] Only {frameFiles.Length} frames — skip video.");
                return;
            }

            var outMp4 = Path.Combine(media, "genesis-unity-worldclass-play.mp4");
            var ffmpeg = FindFfmpeg();
            if (ffmpeg != null)
            {
                var args =
                    $"-y -framerate 12 -i \"{frames}/frame_%03d.png\" -c:v libx264 -pix_fmt yuv420p -crf 20 \"{outMp4}\"";
                var psi = new System.Diagnostics.ProcessStartInfo
                {
                    FileName = ffmpeg,
                    Arguments = args,
                    UseShellExecute = false,
                    RedirectStandardError = true,
                    CreateNoWindow = true
                };
                using var p = System.Diagnostics.Process.Start(psi);
                p?.WaitForExit(90000);
                if (File.Exists(outMp4))
                {
                    Debug.Log($"[Genesis] Published video → {outMp4}");
                    return;
                }
            }

            TryPythonMp4(frames, outMp4);
        }

        static void TryPythonMp4(string frames, string outMp4)
        {
            var script = Path.Combine(Path.GetTempPath(), "genesis_frames_to_mp4.py");
            File.WriteAllText(script, @"
import sys, glob, os
frames = sorted(glob.glob(os.path.join(sys.argv[1], 'frame_*.png')))
out = sys.argv[2]
if not frames:
    sys.exit(1)
try:
    import imageio.v2 as imageio
    imgs = [imageio.imread(f) for f in frames]
    imageio.mimsave(out, imgs, fps=12)
    print('ok', out)
except Exception as e:
    try:
        import cv2
        im0 = cv2.imread(frames[0])
        h, w = im0.shape[:2]
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        vw = cv2.VideoWriter(out, fourcc, 12.0, (w, h))
        for f in frames:
            vw.write(cv2.imread(f))
        vw.release()
        print('ok-cv2', out)
    except Exception as e2:
        print('fail', e, e2)
        sys.exit(2)
");
            var psi = new System.Diagnostics.ProcessStartInfo
            {
                FileName = "/usr/bin/python3",
                Arguments = $"\"{script}\" \"{frames}\" \"{outMp4}\"",
                UseShellExecute = false,
                RedirectStandardOutput = true,
                RedirectStandardError = true
            };
            using var p = System.Diagnostics.Process.Start(psi);
            p?.WaitForExit(60000);
            Debug.Log($"[Genesis] Python video: {(File.Exists(outMp4) ? outMp4 : "failed")}");
        }

        static string FindFfmpeg()
        {
            foreach (var c in new[]
                     {
                         "/opt/homebrew/bin/ffmpeg",
                         "/usr/local/bin/ffmpeg",
                         "/Users/bilalashraf/.local/bin/ffmpeg",
                         "/tmp/ffmpeg"
                     })
                if (File.Exists(c)) return c;
            return null;
        }

        /// <summary>Write camera (+ UI canvases forced onto that camera) into a PNG.</summary>
        public static void CaptureCameraPng(string absolutePath, int width = 0, int height = 0)
        {
            if (width <= 0) width = _captureW > 0 ? _captureW : CaptureWidth;
            if (height <= 0) height = _captureH > 0 ? _captureH : CaptureHeight;

            var cam = Camera.main;
            if (cam == null)
            {
                Debug.LogError("[Genesis] CaptureCameraPng: no Main Camera.");
                return;
            }

            var rt = new RenderTexture(width, height, 24, RenderTextureFormat.ARGB32);
            // AA1 avoids Metal present stalls seen with MSAA2 during Play Mode capture.
            rt.antiAliasing = 1;
            var prevTarget = cam.targetTexture;
            var prevActive = RenderTexture.active;
            var prevAspect = cam.aspect;
            var prevEnabled = cam.enabled;
            cam.aspect = (float)width / height;
            cam.enabled = true;

            var canvasRestore = new List<(Canvas c, RenderMode mode, Camera worldCam)>();
            foreach (var canvas in Object.FindObjectsByType<Canvas>(FindObjectsSortMode.None))
            {
                if (!canvas.isActiveAndEnabled) continue;
                canvasRestore.Add((canvas, canvas.renderMode, canvas.worldCamera));
                canvas.renderMode = RenderMode.ScreenSpaceCamera;
                canvas.worldCamera = cam;
                canvas.planeDistance = 1.05f;
            }

            try
            {
                cam.targetTexture = rt;
                // URP: Render() alone can stall waiting on Game-view present — force a clean draw.
                cam.Render();
                RenderTexture.active = rt;
                var tex = new Texture2D(width, height, TextureFormat.RGB24, false);
                tex.ReadPixels(new Rect(0, 0, width, height), 0, 0);
                tex.Apply();
                Directory.CreateDirectory(Path.GetDirectoryName(absolutePath) ?? ".");
                File.WriteAllBytes(absolutePath, tex.EncodeToPNG());
                Object.DestroyImmediate(tex);
                Debug.Log($"[Genesis] Captured RT → {absolutePath}");
            }
            finally
            {
                cam.targetTexture = prevTarget;
                cam.aspect = prevAspect;
                cam.enabled = prevEnabled;
                RenderTexture.active = prevActive;
                rt.Release();
                Object.DestroyImmediate(rt);
                foreach (var (c, mode, worldCam) in canvasRestore)
                {
                    if (c == null) continue;
                    c.renderMode = mode;
                    c.worldCamera = worldCam;
                }
            }
        }
    }

    /// <summary>Runs inside Play Mode with real Unity coroutines.</summary>
    public sealed class PlayCaptureRunner : MonoBehaviour
    {
        string _captureDir;
        string _framesDir;
        System.Action _onDone;
        bool _premiumNames;
        bool _clarityGate;
        int _width;
        int _height;

        public void Begin(
            string captureDir,
            string framesDir,
            System.Action onDone,
            bool premiumNames = false,
            bool clarityGate = false,
            int width = 0,
            int height = 0)
        {
            _captureDir = captureDir;
            _framesDir = framesDir;
            _onDone = onDone;
            _premiumNames = premiumNames;
            _clarityGate = clarityGate;
            _width = width > 0 ? width : 1280;
            _height = height > 0 ? height : 720;
            StartCoroutine(Run());
        }

        IEnumerator Run()
        {
            Directory.CreateDirectory(_captureDir);
            Directory.CreateDirectory(_framesDir);

            // Wait for bootstrap + board + HUD.
            yield return new WaitForSeconds(3.2f);

            if (_clarityGate)
            {
                yield return RunClarityGate();
                _onDone?.Invoke();
                yield break;
            }

            // Phase 2 hero board still (preferred store: media/genesis-unity-modern-board.png).
            yield return CaptureStill("genesis-unity-modern-board.png");
            yield return CaptureStill("genesis-unity-worldclass-01.png");
            if (_premiumNames)
                yield return CaptureStill("genesis-unity-premium-board.png");

            var session = Object.FindFirstObjectByType<TheaterSession>();
            if (session == null || session.CurrentBeat?.choices == null || session.CurrentBeat.choices.Count == 0)
            {
                Debug.LogError("[Genesis] No TheaterSession / choices — aborting capture.");
                // Still grab whatever is on screen for diagnosis.
                yield return CaptureStill("genesis-unity-modern-board.png");
                yield return CaptureStill("genesis-unity-worldclass-01.png");
                if (_premiumNames)
                    yield return CaptureStill("genesis-unity-premium-board.png");
                _onDone?.Invoke();
                yield break;
            }

            session.OnOrderSelected(session.CurrentBeat.choices[0]);
            yield return new WaitForSeconds(1.2f);
            yield return CaptureStill("genesis-unity-worldclass-02.png");

            session.OnExecutePressed();

            for (var i = 0; i < 30; i++)
            {
                yield return new WaitForSeconds(0.09f);
                var framePath = Path.Combine(_framesDir, $"frame_{i:D3}.png");
                var abs = Path.GetFullPath(Path.Combine(Application.dataPath, "..", framePath));
                GenesisPlayCapture.CaptureCameraPng(abs, _width, _height);
                // Peak EXECUTE still mid-burst (~frame 8).
                if (i == 8)
                {
                    yield return CaptureStill("genesis-unity-modern-execute.png");
                    if (_premiumNames)
                        yield return CaptureStill("genesis-unity-premium-execute.png");
                }

                yield return null;
            }

            yield return new WaitForSeconds(0.5f);
            yield return CaptureStill("genesis-unity-worldclass-03.png");
            yield return new WaitForSeconds(1.1f);
            // Phase 3 resolve card still (preferred store: media/genesis-unity-modern-resolve.png).
            yield return CaptureStill("genesis-unity-modern-resolve.png");
            yield return CaptureStill("genesis-unity-worldclass-resolve.png");
            if (_premiumNames)
                yield return CaptureStill("genesis-unity-premium-results.png");
            yield return new WaitForSeconds(0.4f);

            _onDone?.Invoke();
        }

        /// <summary>
        /// AAA Phase 2 — portrait Partition idle / select / post-EXECUTE stills.
        /// </summary>
        IEnumerator RunClarityGate()
        {
            Debug.Log("[Genesis] Clarity gate capture — Partition portrait 1080×1920 A/B/C.");

            // A — idle board
            yield return CaptureStill("genesis-unity-mobile-clarity-A.png");

            var session = Object.FindFirstObjectByType<TheaterSession>();
            if (session == null || session.CurrentBeat?.choices == null || session.CurrentBeat.choices.Count == 0)
            {
                Debug.LogError("[Genesis] Clarity gate: no TheaterSession / choices — A only.");
                yield break;
            }

            // Prefer a hotspot that is on-map if choices expose marker ids; else first order.
            session.OnOrderSelected(session.CurrentBeat.choices[0]);
            yield return new WaitForSeconds(1.15f);
            // B — select + armed
            yield return CaptureStill("genesis-unity-mobile-clarity-B.png");

            session.OnExecutePressed();
            // C — post-EXECUTE ≤1s hold (board change / WorldVerb on map)
            yield return new WaitForSeconds(0.85f);
            yield return CaptureStill("genesis-unity-mobile-clarity-C.png");
            yield return new WaitForSeconds(0.25f);
        }

        IEnumerator CaptureStill(string fileName)
        {
            // End-of-frame avoids Camera.Render ↔ Game-view present deadlock on Metal.
            yield return new WaitForEndOfFrame();
            var projectRoot = Path.GetFullPath(Path.Combine(Application.dataPath, ".."));
            var path = Path.Combine(projectRoot, _captureDir, fileName);
            GenesisPlayCapture.CaptureCameraPng(path, _width, _height);
            yield return null;
            yield return new WaitForSeconds(0.05f);
        }
    }
}
#endif
