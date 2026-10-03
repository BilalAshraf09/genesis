namespace Genesis.Data
{
    /// <summary>Primary map consequence on EXECUTE — desk FX is secondary support only.</summary>
    public enum WorldVerb
    {
        None = 0,
        BorderShift = 1,
        CityStress = 2,
        CorridorToggle = 3,
        ControlWash = 4
    }

    public enum CityStressLevel
    {
        Calm = 0,
        Secure = 1,
        Strained = 2,
        Closed = 3
    }

    public static class WorldVerbResolver
    {
        public static WorldVerb FromOrder(OrderChoice order)
        {
            if (order == null) return WorldVerb.None;
            var k = (order.kind ?? "").ToLowerInvariant();
            var label = ((order.callsign ?? "") + " " + (order.label ?? "")).ToLowerInvariant();

            if (k.Contains("naval") || k.Contains("trade") || k.Contains("quarant") ||
                label.Contains("corridor") || label.Contains("blockade") || label.Contains("relief"))
                return WorldVerb.CorridorToggle;

            if (k.Contains("diplom") || k.Contains("recog") || k.Contains("refus") ||
                label.Contains("border") || label.Contains("annex") || label.Contains("radcliffe") ||
                label.Contains("line"))
                return WorldVerb.BorderShift;

            if (k.Contains("polit") || k.Contains("civic") || k.Contains("publish") ||
                k.Contains("media") || label.Contains("recognize") || label.Contains("accession"))
                return WorldVerb.ControlWash;

            if (k.Contains("kinet") || k.Contains("mil") || k.Contains("force") ||
                k.Contains("suppress") || k.Contains("strike") || k.Contains("secret") ||
                k.Contains("cov") || k.Contains("intel"))
                return WorldVerb.CityStress;

            // Default: stress the ordered city — still a map verb, never blast-only.
            return string.IsNullOrEmpty(order.markerId) ? WorldVerb.ControlWash : WorldVerb.CityStress;
        }

        public static CityStressLevel StressFor(OrderChoice order)
        {
            var k = (order?.kind ?? "").ToLowerInvariant();
            if (k.Contains("suppress") || k.Contains("strike") || k.Contains("force") || k.Contains("kinet"))
                return CityStressLevel.Closed;
            if (k.Contains("diplom") || k.Contains("recog") || k.Contains("secure"))
                return CityStressLevel.Secure;
            if (k.Contains("cov") || k.Contains("secret") || k.Contains("publish") || k.Contains("polit"))
                return CityStressLevel.Strained;
            return CityStressLevel.Strained;
        }
    }
}
