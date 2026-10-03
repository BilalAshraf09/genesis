#if UNITY_EDITOR
using System.IO;
using System.Text;
using UnityEditor;
using UnityEngine;

namespace Genesis.EditorTools
{
    /// <summary>
    /// Clarity gate + look freeze checklist vs anti-ref media/genesis-unity-mobile-halfcooked.png.
    /// Logs a ship gate; does not mutate gameplay / P0 scale / theater JSON.
    /// </summary>
    public static class GenesisLookFreeze
    {
        [MenuItem("Genesis/Visuals/Look Freeze Checklist (vs anti-ref)")]
        public static void PrintLookFreezeChecklist()
        {
            var sb = new StringBuilder();
            sb.AppendLine("=== Genesis Look Freeze — Clarity gate vs halfcooked anti-ref ===");
            sb.AppendLine("Anti-ref: media/genesis-unity-mobile-halfcooked.png");
            sb.AppendLine("Clarity law: docs/unity-board-clarity-reset.md §2");
            sb.AppendLine("Stills: media/genesis-unity-mobile-clarity-A|B|C.png");
            sb.AppendLine("Menu: Genesis → Capture → Clarity Gate Stills (A/B/C Partition)");
            sb.AppendLine();

            void Row(string gate, bool ok, string evidence)
            {
                sb.AppendLine($"{(ok ? "PASS" : "CHECK")} | {gate}");
                sb.AppendLine($"       {evidence}");
            }

            var qNames = QualitySettings.names;
            var mid = IndexOf(qNames, "Medium");
            var high = IndexOf(qNames, "High");
            Row("Mid/High exist", mid >= 0 && high >= 0, $"levels={string.Join(",", qNames)}");
            Row("Clarity capture menu",
                File.Exists("Assets/Editor/GenesisPlayCapture.cs"),
                "Genesis → Capture → Clarity Gate Stills (A/B/C Partition)");
            Row("Store High capture menu",
                File.Exists("Assets/Editor/GenesisPlayCapture.cs"),
                "Genesis → Capture → Store High Stills (Premium)");
            Row("SSAO menu present (FROZEN until readable)",
                File.Exists("Assets/Editor/GenesisSsaoSetup.cs"),
                "Do not enable for clarity gate — SOTA freeze");
            Row("DeskDust factory present (FROZEN until readable)",
                File.Exists("Assets/Scripts/Effects/GenesisDeskDustFactory.cs"),
                "Do not rebuild dust for clarity gate");
            Row("Authored teak / pin factories",
                File.Exists("Assets/Scripts/Theater/TheaterPropFactory.cs"),
                "Phase 1 silhouette contrast on tip");
            Row("Thermal step-down",
                File.Exists("Assets/Scripts/Core/GenesisThermalGuard.cs"),
                "High→Med→Low on sustained >28ms");

            sb.AppendLine();
            sb.AppendLine("Human stills gate (Bilal — portrait Partition Mid+/High @ scale 1.0):");
            sb.AppendLine("  A Idle — place named ≤2s; silhouette; map ≥60%; ≤4 labels; no TL void wedge");
            sb.AppendLine("  B Select — selected pin + intel readable; order title arm’s-length; taps ≥48pt");
            sb.AppendLine("  C Post-EXECUTE ≤1s — board/scar/WorldVerb on map; no blast modal steal");
            sb.AppendLine("  D Optional desat of A — land / water / teak lip still parse");
            sb.AppendLine("  Side-by-side must beat media/genesis-unity-mobile-halfcooked.png");
            sb.AppendLine();
            sb.AppendLine("FREEZE RULE: no visual thrash / SSAO / bloom / FX reopen without Bilal “readable” + reopen ticket.");

            Debug.Log(sb.ToString());
            EditorUtility.DisplayDialog(
                "Genesis Look Freeze",
                "Checklist printed to Console.\nCapture Clarity A/B/C, then compare to halfcooked anti-ref.\nGameplay / theater JSON stay frozen.",
                "OK");
        }

        static int IndexOf(string[] names, string want)
        {
            if (names == null) return -1;
            for (var i = 0; i < names.Length; i++)
                if (names[i] == want) return i;
            return -1;
        }
    }
}
#endif
