using System;
using System.Collections.Generic;
using System.Text;
using Genesis.Data;
using UnityEngine;

namespace Genesis.Core
{
    /// <summary>
    /// Unity parity for Expo <c>computeOverallScore</c> — memorable cabinet score + challenge share text.
    /// Deterministic from executed orders/effects (no daily multiplier stub).
    /// </summary>
    public static class RunScoreUtility
    {
        [Serializable]
        public class Polarity
        {
            public string tag;
            public string summary;
            public int weight;
            public int move;
        }

        [Serializable]
        public class Result
        {
            public int score = 50;
            public string grade = "C";
            public string label = "CABINET SCORE";
            public string pathFamily = "mixed";
            public string headline = "Course locked.";
            public Polarity topGain;
            public Polarity topCost;
            public int netPolarity;
            public int ordersCommitted;
            public string shareText = "";
            public string challengeText = "";
        }

        public class ExecutedOrder
        {
            public string callsign;
            public string kind;
            public string detail;
            public readonly List<ChoiceEffect> effects = new();
        }

        public static Result Compute(
            string theaterId,
            string theaterTitle,
            int year,
            IList<ExecutedOrder> orders)
        {
            var result = new Result
            {
                ordersCommitted = orders?.Count ?? 0,
                pathFamily = InferPathFamily(orders)
            };

            Polarity topGain = null;
            Polarity topCost = null;
            var net = 0;
            if (orders != null)
            {
                for (var i = 0; i < orders.Count; i++)
                {
                    var o = orders[i];
                    if (o?.effects == null) continue;
                    foreach (var e in o.effects)
                    {
                        if (e == null) continue;
                        net += e.weight;
                        var pill = new Polarity
                        {
                            tag = string.IsNullOrEmpty(e.tag) ? "axis" : e.tag,
                            summary = e.summary ?? "",
                            weight = e.weight,
                            move = i + 1
                        };
                        if (e.weight > 0 && (topGain == null || e.weight > topGain.weight))
                            topGain = pill;
                        if (e.weight < 0 && (topCost == null || e.weight < topCost.weight))
                            topCost = pill;
                    }
                }
            }

            result.topGain = topGain;
            result.topCost = topCost;
            result.netPolarity = net;

            // Expo blend simplified: polarity + family bias + completion weight.
            var polarityScore = Mathf.Clamp(50f + net * 2.2f, 8f, 92f);
            var efficiencyProxy = Mathf.Clamp(48f + result.ordersCommitted * 3.2f, 30f, 88f);
            var axisProxy = Mathf.Clamp(50f + net * 1.1f, 20f, 90f);
            var bias = FamilyBias(result.pathFamily);
            var raw = efficiencyProxy * 0.52f + axisProxy * 0.28f + polarityScore * 0.2f + bias;
            result.score = Mathf.Clamp(Mathf.RoundToInt(raw), 1, 99);
            result.grade = GradeFromScore(result.score);
            result.headline = BuildHeadline(theaterTitle, result);
            result.challengeText = BuildChallengeText(theaterTitle, year, result);
            result.shareText = BuildShareText(result);
            return result;
        }

        static string InferPathFamily(IList<ExecutedOrder> orders)
        {
            if (orders == null || orders.Count == 0) return "mixed";
            var counts = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
            foreach (var o in orders)
            {
                var fam = NormalizeFamily(o?.kind);
                counts.TryGetValue(fam, out var n);
                counts[fam] = n + 1;
            }

            string best = "mixed";
            var bestN = 0;
            foreach (var kv in counts)
            {
                if (kv.Value > bestN)
                {
                    bestN = kv.Value;
                    best = kv.Key;
                }
            }

            return bestN <= 1 && counts.Count > 2 ? "mixed" : best;
        }

        static string NormalizeFamily(string kind)
        {
            if (string.IsNullOrEmpty(kind)) return "mixed";
            var k = kind.ToLowerInvariant();
            if (k.Contains("diplom") || k.Contains("negot") || k.Contains("recog")) return "diplomatic";
            if (k.Contains("delay") || k.Contains("refer") || k.Contains("wait")) return "delay";
            if (k.Contains("kinet") || k.Contains("mil") || k.Contains("force") ||
                k.Contains("suppress") || k.Contains("strike") || k.Contains("naval"))
                return "kinetic";
            if (k.Contains("econ") || k.Contains("trade") || k.Contains("sanc")) return "economic";
            if (k.Contains("polit") || k.Contains("civic") || k.Contains("publish") || k.Contains("media"))
                return "political_norms";
            if (k.Contains("cov") || k.Contains("secret") || k.Contains("intel")) return "covert";
            return "mixed";
        }

        static int FamilyBias(string pathFamily)
        {
            switch (pathFamily)
            {
                case "diplomatic": return 3;
                case "delay": return 1;
                case "kinetic": return -2;
                case "economic": return 2;
                case "political_norms": return 2;
                case "covert": return -1;
                default: return 0;
            }
        }

        static string GradeFromScore(int total)
        {
            if (total >= 90) return "S";
            if (total >= 85) return "A+";
            if (total >= 78) return "A";
            if (total >= 70) return "B+";
            if (total >= 62) return "B";
            if (total >= 54) return "C";
            return "D";
        }

        static string BuildHeadline(string theaterTitle, Result result)
        {
            var title = string.IsNullOrEmpty(theaterTitle) ? "Theater" : theaterTitle;
            var fam = (result.pathFamily ?? "mixed").Replace('_', ' ').ToUpperInvariant();
            if (result.score >= 80)
                return $"{title} desk held — {fam} path clears the board.";
            if (result.score >= 60)
                return $"{title} course locked on a {fam} line.";
            return $"{title} closes under pressure — {fam} path leaves scars.";
        }

        static string BuildChallengeText(string theaterTitle, int year, Result result)
        {
            var fam = (result.pathFamily ?? "mixed").Replace('_', ' ').ToUpperInvariant();
            var y = year > 0 ? year.ToString() : "—";
            return string.Join("\n", new[]
            {
                "GENESIS CHALLENGE · Beat my path",
                $"{theaterTitle} ({y})",
                $"Cabinet score {result.score} ({result.grade}) · {fam}",
                result.headline,
                "Can you clear a higher score on the same theater?",
                "Play Genesis — historical decision theaters"
            });
        }

        static string BuildShareText(Result result)
        {
            var gain = result.topGain != null
                ? $"▲ {result.topGain.tag.Replace('_', ' ')} +{result.topGain.weight}"
                : "▲ no clear gain";
            var cost = result.topCost != null
                ? $"▼ {result.topCost.tag.Replace('_', ' ')} {result.topCost.weight}"
                : "▼ no hard cost";
            var sb = new StringBuilder();
            sb.Append(result.challengeText);
            sb.Append('\n');
            sb.Append(gain);
            sb.Append(" · ");
            sb.Append(cost);
            return sb.ToString();
        }
    }
}
