using System;
using System.Collections.Generic;
using UnityEngine;

namespace Genesis.Atlas
{
    /// <summary>
    /// Atlas Codex persistence: the set of real places the player has discovered, keyed
    /// "theaterId/markerId". Stored as JSON in PlayerPrefs. Public API is a shared contract —
    /// keep signatures stable.
    /// </summary>
    public static class AtlasCodex
    {
        const string PrefKey = "genesis.codex.v1";

        [Serializable]
        class Store { public List<string> keys = new(); }

        static Store _store;

        static Store Data
        {
            get
            {
                if (_store != null) return _store;
                var json = PlayerPrefs.GetString(PrefKey, "");
                _store = string.IsNullOrEmpty(json) ? new Store() : (JsonUtility.FromJson<Store>(json) ?? new Store());
                return _store;
            }
        }

        public static string Key(string theaterId, string markerId) => $"{theaterId}/{markerId}";

        /// <summary>Marks a place discovered. Returns true if it was new.</summary>
        public static bool Discover(string theaterId, string markerId)
        {
            if (string.IsNullOrEmpty(theaterId) || string.IsNullOrEmpty(markerId)) return false;
            var k = Key(theaterId, markerId);
            if (Data.keys.Contains(k)) return false;
            Data.keys.Add(k);
            PlayerPrefs.SetString(PrefKey, JsonUtility.ToJson(Data));
            PlayerPrefs.Save();
            return true;
        }

        public static bool IsDiscovered(string theaterId, string markerId) =>
            Data.keys.Contains(Key(theaterId, markerId));

        public static int CountFor(string theaterId)
        {
            int n = 0;
            var prefix = theaterId + "/";
            foreach (var k in Data.keys) if (k.StartsWith(prefix, StringComparison.Ordinal)) n++;
            return n;
        }

        public static IReadOnlyList<string> AllKeys => Data.keys;
    }
}
