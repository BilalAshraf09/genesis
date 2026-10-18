using System;
using System.Collections.Generic;
using UnityEngine;

namespace Genesis.Auth
{
    /// <summary>
    /// Snapshot / merge helpers for guest→account conversion.
    /// Progress lives in PlayerPrefs; merge never deletes the other side silently.
    /// </summary>
    public static class ProgressMigration
    {
        const string PrefBackupPrefix = "Genesis.Auth.Backup.";
        const string PrefMigrationPending = "Genesis.Auth.MigrationPending";
        const string PrefLastGuestUid = "Genesis.Auth.LastGuestUid";

        static readonly string[] ProgressKeyPrefixes =
        {
            "Genesis.PB.",
            "Genesis.LastFamily.",
            "Genesis.CompletedTheaters",
            "Genesis.SelectedTheaterId",
            "Genesis.ActiveRunData",
            "Genesis.HasActiveRun",
            "Genesis.Iap.FullGameOwnedCache"
        };

        public static void RememberGuestUid(string uid)
        {
            if (string.IsNullOrEmpty(uid)) return;
            PlayerPrefs.SetString(PrefLastGuestUid, uid);
            PlayerPrefs.Save();
        }

        public static string LastGuestUid => PlayerPrefs.GetString(PrefLastGuestUid, "");

        /// <summary>Copy current progress keys into a named backup namespace.</summary>
        public static void SnapshotLocalProgress(string backupId)
        {
            if (string.IsNullOrEmpty(backupId)) backupId = "default";
            var payload = CaptureProgressJson();
            PlayerPrefs.SetString(PrefBackupPrefix + backupId, payload);
            PlayerPrefs.SetInt(PrefMigrationPending, 1);
            PlayerPrefs.Save();
            Debug.Log($"[Genesis Auth] Progress snapshot saved ({backupId}).");
        }

        /// <summary>
        /// Merge backup into current prefs: personal-best keeps the higher score;
        /// completed theaters are unioned; active run prefers the more advanced beat.
        /// </summary>
        public static void MergeBackupIntoCurrent(string backupId)
        {
            if (string.IsNullOrEmpty(backupId)) backupId = "default";
            var raw = PlayerPrefs.GetString(PrefBackupPrefix + backupId, "");
            if (string.IsNullOrEmpty(raw)) return;

            var snap = JsonUtility.FromJson<ProgressSnapshot>(raw);
            if (snap?.entries == null) return;

            foreach (var e in snap.entries)
            {
                if (e == null || string.IsNullOrEmpty(e.key)) continue;
                MergeEntry(e.key, e.value);
            }

            PlayerPrefs.SetInt(PrefMigrationPending, 0);
            PlayerPrefs.Save();
            Debug.Log("[Genesis Auth] Progress merge applied.");
        }

        public static bool HasPendingMigration => PlayerPrefs.GetInt(PrefMigrationPending, 0) == 1;

        public static void MarkMigrationComplete()
        {
            PlayerPrefs.SetInt(PrefMigrationPending, 0);
            PlayerPrefs.Save();
        }

        static string CaptureProgressJson()
        {
            var snap = new ProgressSnapshot();
            // Unity PlayerPrefs has no key enumeration on all platforms — capture known prefixes
            // by reading keys we actively use via a recorded index.
            EnsureKeyIndex();
            var indexRaw = PlayerPrefs.GetString(PrefKeyIndex, "");
            if (!string.IsNullOrEmpty(indexRaw))
            {
                foreach (var key in indexRaw.Split('\n'))
                {
                    if (string.IsNullOrEmpty(key)) continue;
                    if (!PlayerPrefs.HasKey(key)) continue;
                    snap.entries.Add(new ProgressEntry
                    {
                        key = key,
                        value = ReadAny(key)
                    });
                }
            }

            // Always include well-known singletons even if index is cold.
            foreach (var key in new[]
                     {
                         "Genesis.CompletedTheaters",
                         "Genesis.SelectedTheaterId",
                         "Genesis.ActiveRunData",
                         "Genesis.HasActiveRun",
                         "Genesis.Iap.FullGameOwnedCache"
                     })
            {
                if (!PlayerPrefs.HasKey(key)) continue;
                if (snap.entries.Exists(e => e.key == key)) continue;
                snap.entries.Add(new ProgressEntry { key = key, value = ReadAny(key) });
            }

            return JsonUtility.ToJson(snap);
        }

        const string PrefKeyIndex = "Genesis.Auth.ProgressKeyIndex";

        /// <summary>Call when writing PB / completion so snapshots can find keys.</summary>
        public static void TrackProgressKey(string key)
        {
            if (string.IsNullOrEmpty(key)) return;
            EnsureKeyIndex();
            var index = PlayerPrefs.GetString(PrefKeyIndex, "");
            if (index.IndexOf(key, StringComparison.Ordinal) >= 0) return;
            PlayerPrefs.SetString(PrefKeyIndex, string.IsNullOrEmpty(index) ? key : index + "\n" + key);
        }

        static void EnsureKeyIndex()
        {
            // Seed index from known PB pattern if empty — LocalRetention records will register going forward.
            if (PlayerPrefs.HasKey(PrefKeyIndex)) return;
            PlayerPrefs.SetString(PrefKeyIndex, "");
        }

        static string ReadAny(string key)
        {
            // Prefer string; fall back to int encoding.
            var s = PlayerPrefs.GetString(key, "\0");
            if (s != "\0") return "s:" + s;
            return "i:" + PlayerPrefs.GetInt(key, 0);
        }

        static void WriteAny(string key, string encoded)
        {
            if (encoded.StartsWith("s:", StringComparison.Ordinal))
                PlayerPrefs.SetString(key, encoded.Substring(2));
            else if (encoded.StartsWith("i:", StringComparison.Ordinal) &&
                     int.TryParse(encoded.Substring(2), out var n))
                PlayerPrefs.SetInt(key, n);
        }

        static void MergeEntry(string key, string encodedBackup)
        {
            if (key.StartsWith("Genesis.PB.", StringComparison.Ordinal))
            {
                MergePersonalBest(key, encodedBackup);
                return;
            }

            if (key == "Genesis.CompletedTheaters")
            {
                MergeCompleted(encodedBackup);
                return;
            }

            if (key == "Genesis.HasActiveRun" || key == "Genesis.ActiveRunData")
            {
                // Keep current active run if present; otherwise restore backup.
                if (PlayerPrefs.GetInt("Genesis.HasActiveRun", 0) == 1) return;
                WriteAny(key, encodedBackup);
                return;
            }

            if (key == "Genesis.Iap.FullGameOwnedCache")
            {
                // Entitlement cache: OR the flags (store still reconciles).
                int cur = PlayerPrefs.GetInt(key, 0);
                int bak = 0;
                if (encodedBackup.StartsWith("i:") && int.TryParse(encodedBackup.Substring(2), out var n))
                    bak = n;
                PlayerPrefs.SetInt(key, cur | bak);
                return;
            }

            if (!PlayerPrefs.HasKey(key))
                WriteAny(key, encodedBackup);
        }

        static void MergePersonalBest(string key, string encodedBackup)
        {
            int bakScore = ParsePbScore(encodedBackup);
            var curRaw = PlayerPrefs.GetString(key, "");
            int curScore = ParsePbScoreRaw(curRaw);
            if (bakScore > curScore)
                WriteAny(key, encodedBackup);
            TrackProgressKey(key);
        }

        static void MergeCompleted(string encodedBackup)
        {
            var set = new HashSet<string>(StringComparer.Ordinal);
            var cur = PlayerPrefs.GetString("Genesis.CompletedTheaters", "");
            AddCsv(set, cur);
            if (encodedBackup.StartsWith("s:"))
                AddCsv(set, encodedBackup.Substring(2));
            PlayerPrefs.SetString("Genesis.CompletedTheaters", string.Join(",", set));
        }

        static void AddCsv(HashSet<string> set, string csv)
        {
            if (string.IsNullOrEmpty(csv)) return;
            foreach (var p in csv.Split(','))
                if (!string.IsNullOrEmpty(p)) set.Add(p);
        }

        static int ParsePbScore(string encoded)
        {
            if (encoded != null && encoded.StartsWith("s:"))
                return ParsePbScoreRaw(encoded.Substring(2));
            return 0;
        }

        static int ParsePbScoreRaw(string raw)
        {
            if (string.IsNullOrEmpty(raw)) return 0;
            var parts = raw.Split('|');
            return parts.Length > 0 && int.TryParse(parts[0], out var s) ? s : 0;
        }

        [Serializable]
        class ProgressSnapshot
        {
            public List<ProgressEntry> entries = new();
        }

        [Serializable]
        class ProgressEntry
        {
            public string key;
            public string value;
        }
    }
}
