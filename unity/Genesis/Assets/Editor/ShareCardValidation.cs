using System.IO;
using Genesis.Core;
using Genesis.Sharing;
using UnityEditor;
using UnityEngine;

namespace Genesis.EditorTools
{
    public static class ShareCardValidation
    {
        [MenuItem("Genesis/Share/Generate Test Share Card")]
        public static void GenerateTestCard()
        {
            var run = new RunSummary
            {
                theaterId = "hist-1905-port-arthur",
                theaterTitle = "Port Arthur Echo",
                year = 1905,
                score = 84,
                grade = "B",
                pathFamily = "diplomatic",
                headline = "Course locked on the Pacific desk.",
                phasesCompleted = 3,
                phasesTotal = 4,
                topGainLine = "Coalition trust",
                topCostLine = "Tempo lost"
            };
            run.scarLines.Add("Harbor mines left in place");
            run.ordersExecuted.Add("WIRE CONVOY");

            try
            {
                var path = ShareCardRenderer.Render(run);
                var ok = !string.IsNullOrEmpty(path) && File.Exists(path) &&
                         new FileInfo(path).Length > 64;
                var msg = ok
                    ? $"Share card OK\n{path}\n{new FileInfo(path).Length} bytes\nText: {ShareResultService.BuildShareText(run)}"
                    : "Share card generation failed.";
                if (ok) Debug.Log("[ShareTest] " + msg);
                else Debug.LogError("[ShareTest] " + msg);
                EditorUtility.DisplayDialog("Share Card", msg, "OK");
                if (ok) EditorUtility.RevealInFinder(path);
            }
            catch (System.Exception ex)
            {
                Debug.LogError("[ShareTest] " + ex);
                EditorUtility.DisplayDialog("Share Card", "Failed: " + ex.Message, "OK");
            }
        }
    }
}
