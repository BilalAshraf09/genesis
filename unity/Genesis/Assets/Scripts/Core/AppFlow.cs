using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

namespace Genesis.Core
{
    /// <summary>
    /// Cross-scene flow: Boot → MainMenu → TheaterSelect → TheaterPlay → Results → MainMenu.
    /// Theater id + run summary live here so Bilal can click through without Editor hacks.
    /// </summary>
    public static class AppFlow
    {
        public const string BootScene = "Boot";
        public const string MainMenuScene = "MainMenu";
        public const string TheaterSelectScene = "TheaterSelect";
        public const string TheaterPlayScene = "TheaterPlay";
        public const string ResultsScene = "Results";
        public const string SettingsScene = "Settings";

        const string PrefTheaterId = "Genesis.SelectedTheaterId";
        const string PrefActiveRunKey = "Genesis.ActiveRunData";
        const string PrefHasActiveRun = "Genesis.HasActiveRun";

        /// <summary>True only for the current Play session started via BeginTheater or ResumeActiveRun.</summary>
        public static bool CurrentPlayFromShell { get; private set; }
        public static bool IsResumingRun { get; private set; }

        public static string SelectedTheaterId
        {
            get
            {
                var id = PlayerPrefs.GetString(PrefTheaterId, "hist-1947-radcliffe");
                return string.IsNullOrEmpty(id) ? "hist-1947-radcliffe" : id;
            }
            set
            {
                PlayerPrefs.SetString(PrefTheaterId, value ?? "hist-1947-radcliffe");
                PlayerPrefs.Save();
            }
        }

        public static bool LaunchedFromShell => CurrentPlayFromShell;

        public static RunSummary LastRun { get; private set; }

        public static bool HasActiveRun => PlayerPrefs.GetInt(PrefHasActiveRun, 0) == 1;

        public static ActiveRunData GetActiveRunData()
        {
            if (!HasActiveRun) return null;
            var json = PlayerPrefs.GetString(PrefActiveRunKey, string.Empty);
            if (string.IsNullOrEmpty(json)) return null;
            try
            {
                return JsonUtility.FromJson<ActiveRunData>(json);
            }
            catch
            {
                ClearActiveRun();
                return null;
            }
        }

        public static void SaveActiveRun(
            string theaterId,
            string theaterTitle,
            int beatIndex,
            int totalBeats,
            List<string> executedCallsigns,
            List<RunScoreUtility.ExecutedOrder> executedOrders,
            List<string> scarLines)
        {
            if (string.IsNullOrEmpty(theaterId)) return;

            var data = new ActiveRunData
            {
                theaterId = theaterId,
                theaterTitle = theaterTitle ?? "THEATER",
                beatIndex = beatIndex,
                totalBeats = totalBeats
            };

            if (executedCallsigns != null) data.executedCallsigns.AddRange(executedCallsigns);
            if (scarLines != null) data.scarLines.AddRange(scarLines);

            if (executedOrders != null)
            {
                foreach (var ord in executedOrders)
                {
                    if (ord == null) continue;
                    data.orderCallsigns.Add(ord.callsign ?? "");
                    data.orderKinds.Add(ord.kind ?? "");
                    data.orderDetails.Add(ord.detail ?? "");
                }
            }

            var json = JsonUtility.ToJson(data);
            PlayerPrefs.SetString(PrefActiveRunKey, json);
            PlayerPrefs.SetInt(PrefHasActiveRun, 1);
            PlayerPrefs.Save();
        }

        public static void ClearActiveRun()
        {
            PlayerPrefs.SetInt(PrefHasActiveRun, 0);
            PlayerPrefs.DeleteKey(PrefActiveRunKey);
            PlayerPrefs.Save();
            IsResumingRun = false;
        }

        public static void ResumeActiveRun()
        {
            var data = GetActiveRunData();
            if (data == null)
            {
                BeginTheater("hist-1947-radcliffe");
                return;
            }

            SelectedTheaterId = data.theaterId;
            CurrentPlayFromShell = true;
            IsResumingRun = true;
            LastRun = new RunSummary { theaterId = data.theaterId, theaterTitle = data.theaterTitle };
            Load(TheaterPlayScene);
        }

        public static void BeginTheater(string theaterId)
        {
            ClearActiveRun();
            SelectedTheaterId = theaterId;
            CurrentPlayFromShell = true;
            IsResumingRun = false;
            LastRun = new RunSummary { theaterId = theaterId };
            Load(TheaterPlayScene);
        }

        public static void CompleteTheater(RunSummary summary)
        {
            ClearActiveRun();
            LastRun = summary ?? LastRun ?? new RunSummary();
            CurrentPlayFromShell = false;
            Load(ResultsScene);
        }

        public static void GoMainMenu()
        {
            CurrentPlayFromShell = false;
            Load(MainMenuScene);
        }

        public static void GoTheaterSelect()
        {
            CurrentPlayFromShell = false;
            Load(TheaterSelectScene);
        }

        public static void GoSettings()
        {
            CurrentPlayFromShell = false;
            Load(SettingsScene);
        }

        public static void Load(string sceneName)
        {
            if (string.IsNullOrEmpty(sceneName)) return;
            SceneManager.LoadScene(sceneName);
        }
    }

    [System.Serializable]
    public class ActiveRunData
    {
        public string theaterId;
        public string theaterTitle;
        public int beatIndex;
        public int totalBeats;
        public List<string> executedCallsigns = new();
        public List<string> orderCallsigns = new();
        public List<string> orderKinds = new();
        public List<string> orderDetails = new();
        public List<string> scarLines = new();
    }

    [System.Serializable]
    public class RunSummary
    {
        public string theaterId;
        public string theaterTitle;
        public int year;
        public int phasesCompleted;
        public int phasesTotal;
        public readonly List<string> ordersExecuted = new();
        public string closingLine;

        // Expo after-action parity (cabinet score + share/challenge).
        public int score = 50;
        public string grade = "C";
        public string pathFamily = "mixed";
        public string headline = "";
        public string topGainLine = "";
        public string topCostLine = "";
        public int netPolarity;
        public string challengeText = "";
        public string shareText = "";
        /// <summary>Phase 3 — final WorldVerb scars for After Action mini-map strip / share card.</summary>
        public readonly List<string> scarLines = new();
    }
}
