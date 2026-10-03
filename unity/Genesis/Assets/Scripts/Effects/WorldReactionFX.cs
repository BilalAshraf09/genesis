using System.Collections;
using Genesis.Atlas;
using Genesis.Data;
using Genesis.Theater;
using UnityEngine;

namespace Genesis.Effects
{
    /// <summary>
    /// EXECUTE orchestrator — map story FX first (via MapStoryFX + EffectToMapVerb),
    /// restrained desk juice second (camera punch + brief light warm).
    /// Hard bans kept: no fog pumps, no cyan blast, no cube washes.
    /// </summary>
    public class WorldReactionFX : MonoBehaviour
    {
        [Header("Wired lights (bootstrap fills if null)")]
        public Light keyLight;
        public Light rimLight;
        public Light accentLight;

        [Header("Desk juice (subtle support — never the FX hero)")]
        public Color executeFlash = new(1f, 0.52f, 0.22f);
        public float flashSeconds = 0.28f;
        [Range(0.1f, 1f)] public float lightPunchMul = 0.25f;
        [Range(0.1f, 1f)] public float cameraPunch   = 0.25f;

        // ── Cached light state ─────────────────────────────────────────────────
        Color _keyOrig;
        Color _rimOrig;
        Color _accentOrig;
        float _keyIntensity;
        float _rimIntensity;
        float _accentIntensity;

        // ── MapStoryFX (lazily obtained from boardBuilder.MapRoot) ─────────────
        MapStoryFX _mapFx;

        void Awake()
        {
            CacheLightOrigins();
        }

        void CacheLightOrigins()
        {
            if (keyLight != null)
            {
                _keyOrig      = keyLight.color;
                _keyIntensity = keyLight.intensity;
            }

            if (rimLight != null)
            {
                _rimOrig      = rimLight.color;
                _rimIntensity = rimLight.intensity;
            }

            if (accentLight != null)
            {
                _accentOrig      = accentLight.color;
                _accentIntensity = accentLight.intensity;
            }
        }

        // ────────────────────────────────────────────────────────────────────────
        // Primary entry point (called by TheaterSession — signature MUST NOT change)
        // ────────────────────────────────────────────────────────────────────────

        public IEnumerator PlayExecute(OrderChoice order, TheaterBoardBuilder board, TheaterCameraRig camera)
        {
            if (order == null)
            {
                yield return new WaitForSeconds(0.35f);
                yield break;
            }

            // Refresh light cache if it was never populated (lights added after Awake).
            if ((keyLight != null    && _keyIntensity    <= 0.01f) ||
                (accentLight != null && _accentIntensity <= 0.01f))
            {
                CacheLightOrigins();
            }

            // ── Resolve epicenter ────────────────────────────────────────────────
            HotspotMarker hotspot = null;
            Vector3 epicenter = Vector3.zero;
            if (!string.IsNullOrEmpty(order.markerId) &&
                board?.Hotspots != null &&
                board.Hotspots.TryGetValue(order.markerId, out hotspot) &&
                hotspot != null)
            {
                epicenter = hotspot.transform.position;
            }

            // ── Camera: punch + focus on the order's target ──────────────────────
            if (camera != null)
            {
                camera.Punch(cameraPunch);
                camera.FocusWorld(epicenter);
            }

            // ── MapStoryFX: clear previous, init, then run new FX ───────────────
            // FX coroutines run on mapFx so mapFx.Clear() stops them cleanly.
            _mapFx = GetOrCreateMapFx(board);
            if (_mapFx != null)
            {
                _mapFx.Clear();                        // stop old coroutines, return pool items
                var proj = board?.Projection;
                _mapFx.Init(board?.MapRoot ?? transform,
                             proj != null ? proj.BoardWidth : 24f);
            }

            // ── Fire desk juice in parallel (subtle support, not hero) ───────────
            StartCoroutine(LightingPunch(WorldVerbResolver.FromOrder(order)));
            if (hotspot != null) StartCoroutine(BeaconSettle(hotspot.transform));

            // ── Primary: map story FX (1.5–2.5 s hero, yielded here) ─────────────
            if (_mapFx != null)
            {
                yield return EffectToMapVerb.PlayAll(order, board, _mapFx);
            }
            else
            {
                // Legacy fallback when MapStoryFX couldn't be created.
                yield return LegacyPlayWorldVerb(WorldVerbResolver.FromOrder(order), order, board, hotspot, epicenter);
            }

            // Brief hold so the resolve card doesn't pop before FX settle.
            yield return new WaitForSeconds(0.2f);
        }

        // ── MapStoryFX lifecycle ──────────────────────────────────────────────────

        /// <summary>
        /// Returns (or creates) the <see cref="MapStoryFX"/> for <paramref name="board"/>.
        /// Safe to call at any time — creates and initialises the component when needed.
        /// Used by <see cref="Genesis.Theater.TheaterSession"/> to drive the selection link.
        /// </summary>
        public MapStoryFX AcquireMapFx(TheaterBoardBuilder board)
        {
            _mapFx = GetOrCreateMapFx(board);
            if (_mapFx != null && !_mapFx.IsInitialized)
            {
                var proj = board?.Projection;
                _mapFx.Init(board?.MapRoot ?? transform,
                            proj != null ? proj.BoardWidth : 24f);
            }
            return _mapFx;
        }

        MapStoryFX GetOrCreateMapFx(TheaterBoardBuilder board)
        {
            var root = board?.MapRoot;
            if (root == null) return null;

            // Reuse existing instance if alive on the same root.
            if (_mapFx != null && _mapFx.gameObject != null &&
                _mapFx.transform.IsChildOf(root))
            {
                return _mapFx;
            }

            // Check if one was already added.
            var existing = root.GetComponent<MapStoryFX>()
                           ?? root.GetComponentInChildren<MapStoryFX>();
            if (existing != null) return existing;

            // Add fresh instance.
            return root.gameObject.AddComponent<MapStoryFX>();
        }

        // ── Legacy fallback (used when MapStoryFX init fails) ────────────────────

        IEnumerator LegacyPlayWorldVerb(
            WorldVerb verb, OrderChoice order,
            TheaterBoardBuilder board, HotspotMarker hotspot, Vector3 epicenter)
        {
            if (board == null) { yield return new WaitForSeconds(0.35f); yield break; }

            switch (verb)
            {
                case WorldVerb.BorderShift:
                    yield return board.AnimateBorderShift(0.95f);
                    break;
                case WorldVerb.CorridorToggle:
                    yield return board.AnimateCorridorToggle(order.markerId, 0.95f);
                    break;
                case WorldVerb.ControlWash:
                    yield return board.AnimateControlWash(epicenter, MoodColor(order), 1.0f);
                    break;
                default:
                {
                    var level = WorldVerbResolver.StressFor(order);
                    if (hotspot != null) { hotspot.SetStress(level); hotspot.PulseMood(MoodColor(order), 1.0f); }
                    else board.ApplyNearestCityStress(epicenter, level);
                    yield return new WaitForSeconds(0.6f);
                    break;
                }
            }
        }

        static Color MoodColor(OrderChoice order)
        {
            var k = (order?.kind ?? "").ToLowerInvariant();
            if (k.Contains("diplom") || k.Contains("recog"))       return new Color(0.82f, 0.70f, 0.38f);
            if (k.Contains("suppress") || k.Contains("kinet") ||
                k.Contains("strike")  || k.Contains("force"))       return new Color(0.92f, 0.42f, 0.18f);
            if (k.Contains("publish") || k.Contains("media") ||
                k.Contains("polit")   || k.Contains("civic"))       return new Color(0.55f, 0.62f, 0.48f);
            if (k.Contains("naval")   || k.Contains("quarant") ||
                k.Contains("trade"))                                 return new Color(0.45f, 0.58f, 0.62f);
            if (k.Contains("cov")     || k.Contains("secret"))      return new Color(0.55f, 0.48f, 0.40f);
            return new Color(0.78f, 0.58f, 0.32f);
        }

        // ── Desk juice — subtle warm light punch only ─────────────────────────────

        IEnumerator LightingPunch(WorldVerb verb)
        {
            var warm = verb == WorldVerb.CityStress
                ? executeFlash
                : new Color(0.95f, 0.82f, 0.55f);
            var keyPeak = Mathf.Max(0.5f, _keyIntensity) * 1.28f * lightPunchMul;
            var rimPeak = Mathf.Max(0.4f, _rimIntensity) * 1.18f * lightPunchMul;
            if (keyLight != null)
            {
                keyLight.color = Color.Lerp(_keyOrig, warm, 0.4f);
                keyLight.intensity = keyPeak;
            }

            if (rimLight != null)
            {
                rimLight.color = Color.Lerp(_rimOrig, Color.white, 0.22f);
                rimLight.intensity = rimPeak;
            }

            var t = 0f;
            var dur = Mathf.Max(0.1f, flashSeconds);
            while (t < dur)
            {
                t += Time.deltaTime;
                var k = t / dur;
                if (keyLight != null)
                {
                    keyLight.color = Color.Lerp(Color.Lerp(_keyOrig, warm, 0.4f), _keyOrig, k);
                    keyLight.intensity = Mathf.Lerp(keyPeak, _keyIntensity, k);
                }

                if (rimLight != null)
                {
                    rimLight.color = Color.Lerp(Color.Lerp(_rimOrig, Color.white, 0.22f), _rimOrig, k);
                    rimLight.intensity = Mathf.Lerp(rimPeak, _rimIntensity, k);
                }

                yield return null;
            }
        }

        IEnumerator BeaconSettle(Transform hotspot)
        {
            if (hotspot == null) yield break;
            var beacon = hotspot.Find("Beacon");
            if (beacon == null) yield break;
            var start = beacon.localScale;
            var t = 0f;
            while (t < 0.35f)
            {
                t += Time.deltaTime;
                var k = t / 0.35f;
                beacon.localScale = Vector3.Lerp(start, start * 0.72f, k);
                yield return null;
            }

            beacon.localScale = start * 0.85f;
        }
    }
}
