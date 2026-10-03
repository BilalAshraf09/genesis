using UnityEngine;

namespace Genesis.Atlas
{
    /// <summary>Classifies a label site on the map for priority and styling.</summary>
    public enum MapLabelKind
    {
        Country, // Large letter-spaced country name (from gazetteer.countries)
        City,    // City dot label (geo.cities or gazetteer.extraCities)
        Pin,     // HotspotMarker place name (resolved via gazetteer or marker.label)
    }

    /// <summary>
    /// A resolved map label site passed from TheaterBoardBuilder to Stage 1b MapLabelOverlay.
    /// Carries world position + metadata so the UI Toolkit overlay can project and prioritise.
    /// </summary>
    public struct MapLabelSite
    {
        /// <summary>Display text (never null/empty).</summary>
        public string text;
        /// <summary>World-space position the label points to.</summary>
        public Vector3 world;
        /// <summary>Higher = shown first when culling for limited slots. Pins=0, Country=1, City=2.</summary>
        public int priority;
        /// <summary>Determines font size / styling in the UI overlay.</summary>
        public MapLabelKind kind;
        /// <summary>Non-null for Pin sites; the HotspotMarker.Marker.id this label belongs to.</summary>
        public string markerId;
    }
}
