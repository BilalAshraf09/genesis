namespace Genesis.Monetization
{
    /// <summary>
    /// Central store product configuration. Product IDs must match App Store Connect
    /// and Google Play Console exactly and must not change after publishing.
    /// </summary>
    public static class IapProductIds
    {
        /// <summary>Non-consumable full-game unlock. Bundle: com.bilalashraf.genesis</summary>
        public const string UnlockAllTheaters = "com.bilalashraf.genesis.unlock_all_theaters";

        public const string DisplayName = "Full Game Unlock";
        public const string Description = "Permanently unlock all theaters.";

        /// <summary>Dashboard target only — never show as authoritative UI price.</summary>
        public const string TargetUsdPriceHint = "$4.99";
    }
}
