using System;
using System.Collections;
using System.IO;
using Genesis.Atlas;
using Genesis.Core;
using UnityEngine;

namespace Genesis.Sharing
{
    public enum ShareResultState
    {
        Idle,
        Generating,
        Sharing,
        Success,
        Cancelled,
        Failed
    }

    /// <summary>
    /// Reusable share pipeline: generate branded PNG → native share sheet → delayed cleanup.
    /// Does not touch auth, IAP, or save data. Guests can share freely.
    /// </summary>
    public sealed class ShareResultService : MonoBehaviour
    {
        const float CleanupDelaySeconds = 120f;

        static ShareResultService _instance;

        bool _busy;
        ShareResultState _state = ShareResultState.Idle;
        string _lastError = "";
        string _lastImagePath = "";

        public static ShareResultService Instance
        {
            get
            {
                if (_instance != null) return _instance;
                _instance = FindAnyObjectByType<ShareResultService>();
                if (_instance != null) return _instance;
                var go = new GameObject("ShareResultService");
                if (Application.isPlaying) DontDestroyOnLoad(go);
                _instance = go.AddComponent<ShareResultService>();
                return _instance;
            }
        }

        public bool IsBusy => _busy;
        public ShareResultState State => _state;
        public string LastError => _lastError ?? "";
        public string LastImagePath => _lastImagePath ?? "";

        public event Action StateChanged;

        void Awake()
        {
            if (_instance != null && _instance != this)
            {
                Destroy(gameObject);
                return;
            }

            _instance = this;
            if (Application.isPlaying) DontDestroyOnLoad(gameObject);
        }

        /// <summary>Generate a branded result PNG from real RunSummary fields only.</summary>
        public string GenerateResultShareImage(RunSummary resultData)
        {
            _state = ShareResultState.Generating;
            _lastError = "";
            Raise();
            try
            {
                var path = ShareCardRenderer.Render(resultData ?? new RunSummary());
                if (string.IsNullOrEmpty(path) || !File.Exists(path))
                    throw new IOException("Share card file was not written.");

                // Ensure flush before callers open the share sheet.
                using (var fs = File.OpenRead(path))
                {
                    if (fs.Length < 64)
                        throw new IOException("Share card file is empty or incomplete.");
                }

                _lastImagePath = path;
                _state = ShareResultState.Idle;
                Raise();
                return path;
            }
            catch (Exception ex)
            {
                _lastError = ex.Message;
                _state = ShareResultState.Failed;
                Raise();
                Debug.LogWarning($"[Genesis Share] Generate failed: {ex.Message}");
                return null;
            }
        }

        /// <summary>
        /// Opens the native share sheet with image + optional text.
        /// Does not claim the post was published — sheet open/close is not proof of share.
        /// </summary>
        public void ShareResult(string imagePath, string shareText)
        {
            if (_busy) return;
            if (string.IsNullOrEmpty(imagePath) || !File.Exists(imagePath))
            {
                Fail("Share image is missing.");
                return;
            }

            _busy = true;
            _state = ShareResultState.Sharing;
            _lastError = "";
            Raise();

            try
            {
                bool opened = MobilePlatform.ShareImageAndText(
                    imagePath,
                    shareText ?? "",
                    "Genesis — After Action");

                if (!opened)
                {
                    // Editor / fallback: clipboard already set inside MobilePlatform when needed.
                    _state = ShareResultState.Success;
                    _lastError = Application.isEditor
                        ? "Share card saved. Native share sheet runs on device."
                        : "Share sheet unavailable — text copied.";
                }
                else
                {
                    // Sheet presented; we cannot know if the user posted.
                    _state = ShareResultState.Success;
                }

                ScheduleCleanup(imagePath);
            }
            catch (Exception ex)
            {
                Fail(ex.Message);
                return;
            }
            finally
            {
                _busy = false;
                Raise();
            }
        }

        /// <summary>Full flow used by the results screen.</summary>
        public void ShareRun(RunSummary run, Action<ShareResultState, string> onComplete = null)
        {
            if (_busy)
            {
                onComplete?.Invoke(ShareResultState.Failed, "Share already in progress.");
                return;
            }

            StartCoroutine(ShareRunRoutine(run, onComplete));
        }

        IEnumerator ShareRunRoutine(RunSummary run, Action<ShareResultState, string> onComplete)
        {
            _busy = true;
            _state = ShareResultState.Generating;
            _lastError = "";
            Raise();

            string path = null;
            string error = null;
            try
            {
                path = ShareCardRenderer.Render(run ?? new RunSummary());
                if (string.IsNullOrEmpty(path) || !File.Exists(path))
                    error = "Could not create share card.";
                else
                {
                    using var fs = File.OpenRead(path);
                    if (fs.Length < 64)
                        error = "Share card file is incomplete.";
                }

                _lastImagePath = path ?? "";
            }
            catch (Exception ex)
            {
                error = ex.Message;
            }

            // Yield so PNG is fully flushed before the OS share sheet reads it.
            yield return null;
            yield return null;

            if (!string.IsNullOrEmpty(error) || string.IsNullOrEmpty(path))
            {
                _busy = false;
                Fail(error ?? "Could not create share card.");
                onComplete?.Invoke(ShareResultState.Failed, _lastError);
                yield break;
            }

            string text = BuildShareText(run);
            _state = ShareResultState.Sharing;
            Raise();

            try
            {
                bool opened = MobilePlatform.ShareImageAndText(path, text, "Genesis — After Action");
                ScheduleCleanup(path);
                _state = ShareResultState.Success;
                _lastError = (!opened && Application.isEditor)
                    ? "Share card saved. Native share sheet runs on iOS/Android."
                    : "";
            }
            catch (Exception ex)
            {
                _busy = false;
                Fail(ex.Message);
                onComplete?.Invoke(ShareResultState.Failed, _lastError);
                yield break;
            }

            _busy = false;
            Raise();
            onComplete?.Invoke(_state, _lastError);
        }

        public void CleanupTemporaryShareFiles()
        {
            try
            {
                var dir = ShareCardRenderer.ShareDirectory;
                if (!Directory.Exists(dir)) return;
                foreach (var file in Directory.GetFiles(dir, "genesis-*.png"))
                {
                    try { File.Delete(file); }
                    catch (Exception ex)
                    {
                        Debug.LogWarning($"[Genesis Share] Cleanup skip {file}: {ex.Message}");
                    }
                }
            }
            catch (Exception ex)
            {
                Debug.LogWarning($"[Genesis Share] Cleanup failed: {ex.Message}");
            }
        }

        void ScheduleCleanup(string path)
        {
            if (string.IsNullOrEmpty(path)) return;
            StartCoroutine(DelayedDelete(path, CleanupDelaySeconds));
        }

        static IEnumerator DelayedDelete(string path, float delay)
        {
            yield return new WaitForSecondsRealtime(delay);
            try
            {
                if (File.Exists(path))
                    File.Delete(path);
            }
            catch (Exception ex)
            {
                Debug.LogWarning($"[Genesis Share] Delayed delete: {ex.Message}");
            }
        }

        public static string BuildShareText(RunSummary run)
        {
            run ??= new RunSummary();
            if (!string.IsNullOrEmpty(run.shareText))
                return run.shareText;

            string theater = string.IsNullOrEmpty(run.theaterTitle) ? "a theater" : run.theaterTitle;
            return $"I completed {theater} with a score of {run.score}! Play Genesis — Living Atlas.";
        }

        void Fail(string message)
        {
            _state = ShareResultState.Failed;
            _lastError = message ?? "Share failed.";
            _busy = false;
            Raise();
        }

        void Raise() => StateChanged?.Invoke();
    }
}
