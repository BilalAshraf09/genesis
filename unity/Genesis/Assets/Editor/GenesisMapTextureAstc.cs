using UnityEditor;
using UnityEngine;

namespace Genesis.EditorTools
{
    /// <summary>
    /// SOTA Foundation — authoring path for map textures: no artificial downsample ceiling,
    /// Android/iOS ASTC, high aniso. StreamingAssets runtime still uses LoadImage;
    /// this covers any imported copies + documents the ship compression target.
    /// </summary>
    public static class GenesisMapTextureAstc
    {
        const int MaxSize = 2048;

        [MenuItem("Genesis/Maps/Apply ASTC + 2K Import Settings (Maps folder)")]
        public static void ApplyAstcImportSettings()
        {
            var guids = AssetDatabase.FindAssets("t:Texture2D", new[]
            {
                "Assets/StreamingAssets/Maps",
                "Assets/Maps",
            });
            var count = 0;
            foreach (var guid in guids)
            {
                var path = AssetDatabase.GUIDToAssetPath(guid);
                if (string.IsNullOrEmpty(path)) continue;
                var importer = AssetImporter.GetAtPath(path) as TextureImporter;
                if (importer == null) continue;
                Apply(importer);
                importer.SaveAndReimport();
                count++;
            }

            Debug.Log($"[Genesis] ASTC/2K import settings applied to {count} map texture(s).");
        }

        public static void Apply(TextureImporter importer)
        {
            importer.maxTextureSize = MaxSize;
            importer.mipmapEnabled = true;
            importer.streamingMipmaps = false;
            importer.anisoLevel = 8;
            importer.filterMode = FilterMode.Trilinear;
            importer.textureCompression = TextureImporterCompression.CompressedHQ;
            importer.compressionQuality = 50;

            SetPlatform(importer, "Android", TextureImporterFormat.ASTC_6x6);
            SetPlatform(importer, "iPhone", TextureImporterFormat.ASTC_6x6);
            SetPlatform(importer, "Default", TextureImporterFormat.Automatic);
        }

        static void SetPlatform(TextureImporter importer, string platform, TextureImporterFormat format)
        {
            var settings = new TextureImporterPlatformSettings
            {
                name = platform,
                overridden = platform != "Default",
                maxTextureSize = MaxSize,
                format = format,
                compressionQuality = 50,
                allowsAlphaSplitting = false,
            };
            importer.SetPlatformTextureSettings(settings);
        }
    }
}
