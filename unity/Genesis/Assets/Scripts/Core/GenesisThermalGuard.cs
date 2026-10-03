using UnityEngine;

namespace Genesis.Core
{
    /// <summary>
    /// Phase C polish — sustained frame-time heat steps High→Med→Low before the desk becomes unplayable.
    /// Does not touch Mid/High Render Scale 1.0 while still on those tiers (P0 locked).
    /// </summary>
    public sealed class GenesisThermalGuard : MonoBehaviour
    {
        const float SampleWindowSeconds = 8f;
        const float HotFrameMs = 28f; // ~35 FPS sustained → step down
        const float CoolFrameMs = 18f; // recovery headroom (no auto-up; user/Settings only)
        const int MinSamples = 45;

        float _accumMs;
        int _samples;
        float _windowLeft;
        int _dropsThisSession;

        public static GenesisThermalGuard Ensure()
        {
            var existing = Object.FindFirstObjectByType<GenesisThermalGuard>();
            if (existing != null) return existing;
            var go = new GameObject("GenesisThermalGuard");
            Object.DontDestroyOnLoad(go);
            return go.AddComponent<GenesisThermalGuard>();
        }

        void Awake()
        {
            _windowLeft = SampleWindowSeconds;
        }

        void Update()
        {
            // Device-only — Editor store captures must stay on High.
            if (!Application.isMobilePlatform) return;

            var dtMs = Time.unscaledDeltaTime * 1000f;
            // Ignore hitch spikes / first frames.
            if (dtMs > 80f || Time.frameCount < 30) return;

            _accumMs += dtMs;
            _samples++;
            _windowLeft -= Time.unscaledDeltaTime;
            if (_windowLeft > 0f || _samples < MinSamples) return;

            var avg = _accumMs / _samples;
            _accumMs = 0f;
            _samples = 0;
            _windowLeft = SampleWindowSeconds;

            if (avg >= HotFrameMs)
            {
                TryStepDown(avg);
            }
            else if (avg <= CoolFrameMs)
            {
                // Stay put — recovery is manual / next cold launch so store stills stay stable.
            }
        }

        void TryStepDown(float avgMs)
        {
            var q = QualitySettings.GetQualityLevel();
            // Very Low=0 … High=3+. Never climb; only drop.
            if (q <= 1) return;
            var next = q - 1;
            // Cap session thrash — at most two automatic drops.
            if (_dropsThisSession >= 2) return;
            QualitySettings.SetQualityLevel(next, true);
            _dropsThisSession++;
            GenesisPremiumVisuals.ApplyForCurrentQuality();
            Debug.LogWarning(
                $"[Genesis] Thermal guard: avg frame {avgMs:0.0}ms → quality {QualitySettings.names[next]} " +
                $"(drop {_dropsThisSession}/2). Mid/High scale stays 1.0 while on those tiers.");
        }
    }
}
