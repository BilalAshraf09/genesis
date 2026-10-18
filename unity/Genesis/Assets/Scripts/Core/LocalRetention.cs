using System;
using System.Collections.Generic;
using Genesis.Auth;
using Genesis.Data;
using Genesis.Monetization;
using UnityEngine;

namespace Genesis.Core
{
    /// <summary>
    /// Lightweight local retention stubs — PB + next-play recommend for After Action (Expo parity MVP).
    /// </summary>
    public static class LocalRetention
    {
        const string PrefPbPrefix = "Genesis.PB.";
        const string PrefLastFamilyPrefix = "Genesis.LastFamily.";
        const string PrefCompleted = "Genesis.CompletedTheaters";

        [Serializable]
        public class PersonalBest
        {
            public int score;
            public string grade;
            public string pathFamily;
        }

        public class Cliffhanger
        {
            public string path;
            public string blurb;
        }

        public class NextPlay
        {
            public string theaterId;
            public string title;
            public int year;
            public string headline;
            public string detail;
        }

        public static PersonalBest GetPersonalBest(string theaterId)
        {
            if (string.IsNullOrEmpty(theaterId)) return null;
            var raw = PlayerPrefs.GetString(PrefPbPrefix + theaterId, "");
            if (string.IsNullOrEmpty(raw)) return null;
            var parts = raw.Split('|');
            if (parts.Length < 2) return null;
            if (!int.TryParse(parts[0], out var score)) return null;
            return new PersonalBest
            {
                score = score,
                grade = parts[1],
                pathFamily = parts.Length > 2 ? parts[2] : "mixed"
            };
        }

        public static PersonalBest RecordCompletion(
            string theaterId,
            int score,
            string grade,
            string pathFamily,
            out bool isNewBest)
        {
            isNewBest = false;
            if (string.IsNullOrEmpty(theaterId)) return null;
            var prev = GetPersonalBest(theaterId);
            if (prev == null || score > prev.score)
            {
                isNewBest = true;
                var pbKey = PrefPbPrefix + theaterId;
                PlayerPrefs.SetString(
                    pbKey,
                    $"{score}|{grade ?? "C"}|{pathFamily ?? "mixed"}");
                ProgressMigration.TrackProgressKey(pbKey);
            }

            var familyKey = PrefLastFamilyPrefix + theaterId;
            PlayerPrefs.SetString(familyKey, pathFamily ?? "mixed");
            ProgressMigration.TrackProgressKey(familyKey);
            MarkCompleted(theaterId);
            PlayerPrefs.Save();
            return GetPersonalBest(theaterId);
        }

        public static Cliffhanger CliffhangerFor(string theaterId, string lastFamily)
        {
            var complementary = Complementary(lastFamily);
            if (string.IsNullOrEmpty(complementary)) return null;
            return new Cliffhanger
            {
                path = complementary,
                blurb = $"One fork still unexplored — try the {Label(complementary)} path."
            };
        }

        public static NextPlay RecommendNext(string excludeId)
        {
            var catalog = TheaterCatalogLoader.LoadCatalog();
            var theaters = catalog?.theaters;
            if (theaters == null || theaters.Count == 0) return null;

            var done = LoadCompleted();
            var access = TheaterAccessService.Instance;
            TheaterCatalogEntry last = null;
            if (!string.IsNullOrEmpty(excludeId))
                last = theaters.Find(t => t != null && t.id == excludeId);

            bool IsPlayable(TheaterCatalogEntry t) =>
                t != null &&
                !string.IsNullOrEmpty(t.id) &&
                t.id != excludeId &&
                access.CanAccessTheater(t.id);

            // Same era unfinished (accessible only — avoid cold paywall).
            if (last != null && !string.IsNullOrEmpty(last.era))
            {
                var peer = theaters.Find(t =>
                    IsPlayable(t) &&
                    t.era == last.era &&
                    !done.Contains(t.id));
                if (peer != null)
                {
                    return new NextPlay
                    {
                        theaterId = peer.id,
                        title = peer.title,
                        year = peer.year,
                        headline = $"Stay in {peer.era}",
                        detail = $"{peer.title} is still dark on your desk."
                    };
                }
            }

            // Any unplayed accessible desk.
            var unplayed = theaters.Find(t => IsPlayable(t) && !done.Contains(t.id));
            if (unplayed != null)
            {
                return new NextPlay
                {
                    theaterId = unplayed.id,
                    title = unplayed.title,
                    year = unplayed.year,
                    headline = "Open a new desk",
                    detail = $"{unplayed.title} ({unplayed.year}) awaits."
                };
            }

            // Replay another accessible theater.
            var replay = theaters.Find(IsPlayable);
            if (replay != null)
            {
                return new NextPlay
                {
                    theaterId = replay.id,
                    title = replay.title,
                    year = replay.year,
                    headline = "Redeploy another theater",
                    detail = $"Return to {replay.title}."
                };
            }

            return null;
        }

        static void MarkCompleted(string theaterId)
        {
            var set = LoadCompleted();
            if (set.Add(theaterId))
            {
                PlayerPrefs.SetString(PrefCompleted, string.Join(",", set));
                ProgressMigration.TrackProgressKey(PrefCompleted);
            }
        }

        static HashSet<string> LoadCompleted()
        {
            var set = new HashSet<string>(StringComparer.Ordinal);
            var raw = PlayerPrefs.GetString(PrefCompleted, "");
            if (string.IsNullOrEmpty(raw)) return set;
            foreach (var id in raw.Split(','))
            {
                if (!string.IsNullOrEmpty(id)) set.Add(id);
            }

            return set;
        }

        static string Complementary(string lastFamily)
        {
            var f = (lastFamily ?? "mixed").ToLowerInvariant();
            if (f.Contains("diplomat")) return "kinetic";
            if (f.Contains("kinet") || f.Contains("force")) return "diplomatic";
            if (f.Contains("delay")) return "economic";
            if (f.Contains("econ")) return "political_norms";
            if (f.Contains("covert")) return "diplomatic";
            if (f.Contains("polit")) return "kinetic";
            return "diplomatic";
        }

        static string Label(string path) =>
            string.IsNullOrEmpty(path) ? "ALT" : path.Replace('_', ' ').ToUpperInvariant();
    }
}
