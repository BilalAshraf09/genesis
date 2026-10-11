using UnityEditor;
using UnityEngine;
using UnityEngine.UIElements;
using System.Collections.Generic;
using Genesis.Theater;
using Genesis.UI;
using Genesis.Atlas;

namespace Unity.AI.Assistant.PlayModeTest
{
    [InitializeOnLoad]
    internal static class PlayModeTestRunner
    {
        private const string StateKey = "PlayModeTest.State";
        private const string ResultKey = "PlayModeTest.Result";
        private const string ScriptPathKey = "PlayModeTest.ScriptPath";
        private const string SentinelLog = "PLAY_MODE_TEST_COMPLETE";

        private static readonly int WaitFrames = 15;

        private static List<string> _capturedLogs = new List<string>();
        private const int MaxCapturedLogs = 50;

        static PlayModeTestRunner()
        {
            string state = SessionState.GetString(StateKey, "Idle");

            switch (state)
            {
                case "Idle":
                    break;

                case "WaitingForCompile":
                    Debug.Log("[PlayModeTest] Bootstrap compiled. Scheduling Play Mode entry.");
                    EditorApplication.delayCall += () =>
                    {
                        SessionState.SetString(StateKey, "EnteringPlayMode");
                        EditorApplication.playModeStateChanged += OnPlayModeStateChanged;
                        EditorApplication.isPlaying = true;
                    };
                    break;

                case "EnteringPlayMode":
                    EditorApplication.playModeStateChanged += OnPlayModeStateChanged;
                    if (EditorApplication.isPlaying)
                    {
                        EditorApplication.playModeStateChanged -= OnPlayModeStateChanged;
                        SessionState.SetString(StateKey, "InPlayMode");
                        EditorApplication.update += WaitFramesThenRun;
                    }
                    break;

                case "InPlayMode":
                    if (EditorApplication.isPlaying)
                    {
                        EditorApplication.update += WaitFramesThenRun;
                    }
                    break;

                case "Done":
                    Debug.Log(SentinelLog);
                    if (string.IsNullOrEmpty(SessionState.GetString("PlayModeTest.ScreenshotPath", "")))
                    {
                        EditorApplication.delayCall += SelfDestruct;
                    }
                    break;
            }
        }

        private static void OnPlayModeStateChanged(PlayModeStateChange change)
        {
            if (change == PlayModeStateChange.EnteredPlayMode)
            {
                EditorApplication.playModeStateChanged -= OnPlayModeStateChanged;
                SessionState.SetString(StateKey, "InPlayMode");
                EditorApplication.update += WaitFramesThenRun;
            }
        }

        private static int _frameCount = 0;
        private static bool _hasRun = false;

        private static void WaitFramesThenRun()
        {
            _frameCount++;
            if (_frameCount < WaitFrames) return;

            if (_hasRun) return;
            _hasRun = true;
            EditorApplication.update -= WaitFramesThenRun;

            Application.logMessageReceived += OnLogMessage;
            string resultJson;
            try
            {
                resultJson = RunTestLogic();
            }
            catch (System.Exception e)
            {
                Debug.LogError("[PlayModeTest] Test threw exception: " + e);
                resultJson = JsonUtility.ToJson(new TestResult
                {
                    success = false,
                    error = e.ToString(),
                    logs = _capturedLogs.ToArray()
                });
            }
            finally
            {
                Application.logMessageReceived -= OnLogMessage;
            }

            SessionState.SetString(ResultKey, resultJson);
            SessionState.SetString(StateKey, "Done");
            EditorApplication.isPlaying = false;
        }

        private static void SelfDestruct()
        {
            string scriptPath = SessionState.GetString(ScriptPathKey, "");
            if (!string.IsNullOrEmpty(scriptPath) && AssetDatabase.AssetPathExists(scriptPath))
            {
                AssetDatabase.DeleteAsset(scriptPath);
            }
            SessionState.EraseString(StateKey);
            SessionState.EraseString(ScriptPathKey);
        }

        private static void OnLogMessage(string message, string stackTrace, LogType type)
        {
            if (_capturedLogs.Count >= MaxCapturedLogs) return;
            _capturedLogs.Add("[" + type + "] " + message);
        }

        [System.Serializable]
        private class TestResult
        {
            public bool success;
            public string error;
            public string details;
            public string[] logs;
        }

        private static string RunTestLogic()
        {
            var sb = new System.Text.StringBuilder();
            sb.AppendLine($"Screen: {Screen.width}x{Screen.height}");

            var session = TheaterSession.Instance;
            sb.AppendLine($"Session: {(session != null ? "found" : "NULL")}");
            if (session != null)
            {
                sb.AppendLine($"Session bundle: {(session.Bundle != null ? session.Bundle.scenario?.id : "NULL")}");
                sb.AppendLine($"Session current beat: {(session.CurrentBeat != null ? session.CurrentBeat.id : "NULL")}");
                if (session.CurrentBeat?.choices != null)
                {
                    sb.AppendLine($"Choices count: {session.CurrentBeat.choices.Count}");
                    foreach (var c in session.CurrentBeat.choices)
                        sb.AppendLine($"  choice: {c.id}, markerId={c.markerId}, label={c.label}");
                }
            }

            var rail = Object.FindAnyObjectByType<OrderRailController>();
            sb.AppendLine($"OrderRailController: {(rail != null ? "found" : "NULL")}");

            var docs = Object.FindObjectsByType<UIDocument>(FindObjectsInactive.Include);
            sb.AppendLine($"UIDocuments count: {docs.Length}");
            foreach (var d in docs)
            {
                var r = d.rootVisualElement;
                sb.AppendLine($"  Doc '{d.gameObject.name}' (active={d.gameObject.activeInHierarchy}, enabled={d.enabled}, sort={d.sortingOrder})");
                if (r != null)
                {
                    sb.AppendLine($"    root size={r.resolvedStyle.width}x{r.resolvedStyle.height}, picking={r.pickingMode}, children={r.childCount}");
                    var sheet = r.Q("sheet");
                    if (sheet != null)
                    {
                        sb.AppendLine($"    found sheet: classList={string.Join(" ", sheet.GetClasses())}, size={sheet.resolvedStyle.width}x{sheet.resolvedStyle.height}");
                        var cards = sheet.Query(null, "order-card").ToList();
                        sb.AppendLine($"    cards in sheet: {cards.Count}");
                    }
                    var cardRail = r.Q("cardRail");
                    if (cardRail != null)
                    {
                        sb.AppendLine($"    cardRail size={cardRail.resolvedStyle.width}x{cardRail.resolvedStyle.height}, children={cardRail.childCount}");
                    }
                    var hold = r.Q(null, "hold-btn");
                    if (hold != null)
                    {
                        sb.AppendLine($"    holdBtn size={hold.resolvedStyle.width}x{hold.resolvedStyle.height}");
                    }
                }
                else
                {
                    sb.AppendLine("    rootVisualElement is NULL");
                }
            }

            var builder = Object.FindAnyObjectByType<TheaterBoardBuilder>();
            sb.AppendLine($"BoardBuilder: {(builder != null ? "found" : "NULL")}");
            if (builder != null && builder.Hotspots != null)
            {
                sb.AppendLine($"Hotspots count: {builder.Hotspots.Count}");
                foreach (var kv in builder.Hotspots)
                    sb.AppendLine($"  hs {kv.Key}: selected={kv.Value?.IsSelected}");
            }

            var overlay = Object.FindAnyObjectByType<MapLabelOverlay>();
            sb.AppendLine($"MapLabelOverlay: {(overlay != null ? "found" : "NULL")}");

            Debug.Log("[Test] Runtime dump complete.");
            return JsonUtility.ToJson(new TestResult
            {
                success = true,
                details = sb.ToString(),
                logs = _capturedLogs.ToArray()
            });
        }
    }
}
