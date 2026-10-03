using System.Collections.Generic;
using Genesis.Data;
using UnityEngine;
using UnityEngine.UIElements;

namespace Genesis.UI.Toolkit
{
    /// <summary>
    /// Drives the four meter-fill elements in the CommandHud top bar.
    /// Call <see cref="Animate"/> after an order is committed to update meters
    /// from the order's <see cref="ChoiceEffect"/> list.
    /// CSS <c>transition-duration: 0.4s</c> on <c>.meter__fill</c> provides easing.
    /// Values are maintained internally (0–1) and accumulated across phases.
    /// </summary>
    public sealed class MeterStrip
    {
        // ── Element references ────────────────────────────────────────────────
        readonly VisualElement _stabFill;
        readonly VisualElement _credFill;
        readonly VisualElement _tollFill;
        readonly VisualElement _escFill;

        // ── Internal state (0–1) ──────────────────────────────────────────────
        float _stab = 0.55f;
        float _cred = 0.50f;
        float _toll = 0.25f;
        float _esc  = 0.20f;

        // ── Constructor ───────────────────────────────────────────────────────
        public MeterStrip(VisualElement stabFill, VisualElement credFill,
                          VisualElement tollFill, VisualElement escFill)
        {
            _stabFill = stabFill;
            _credFill = credFill;
            _tollFill = tollFill;
            _escFill  = escFill;

            // Set baseline immediately (CSS transition will animate from 0 if
            // the fill starts at auto-width; that's acceptable on first render).
            ApplyAll();
        }

        // ── Public API ────────────────────────────────────────────────────────

        /// <summary>
        /// Updates internal meter values from the effect list and animates fills.
        /// Tags are matched loosely against common tag names from the scenario data.
        /// </summary>
        public void Animate(List<ChoiceEffect> effects)
        {
            if (effects != null)
            {
                foreach (var fx in effects)
                {
                    if (fx == null) continue;
                    ApplyEffect(fx);
                }
            }
            ApplyAll();
        }

        /// <summary>
        /// Directly set all four meter values (0–1). Bypasses effect calculation.
        /// Useful for resetting state at the start of a new theater.
        /// </summary>
        public void SetValues(float stab, float cred, float toll, float esc)
        {
            _stab = Mathf.Clamp01(stab);
            _cred = Mathf.Clamp01(cred);
            _toll = Mathf.Clamp01(toll);
            _esc  = Mathf.Clamp01(esc);
            ApplyAll();
        }

        // ── Private ───────────────────────────────────────────────────────────

        void ApplyEffect(ChoiceEffect fx)
        {
            string tag = (fx.tag ?? "").ToLowerInvariant();
            // Scale weight to ≤ 0.12 per step so a single +10 doesn't saturate a meter.
            float delta = Mathf.Clamp(fx.weight * 0.012f, -0.12f, 0.12f);

            if (tag.Contains("credib") || tag.Contains("diplomat") || tag.Contains("trust"))
            {
                _cred = Mathf.Clamp01(_cred + delta);
                _stab = Mathf.Clamp01(_stab + delta * 0.4f);
            }
            else if (tag.Contains("civilian") || tag.Contains("toll") || tag.Contains("refugee"))
            {
                // Positive "civilian" weight = bad for toll (toll meter rises)
                _toll = Mathf.Clamp01(_toll + Mathf.Abs(delta));
                _stab = Mathf.Clamp01(_stab - Mathf.Abs(delta) * 0.3f);
            }
            else if (tag.Contains("escal") || tag.Contains("tension") || tag.Contains("conflict"))
            {
                _esc  = Mathf.Clamp01(_esc  + Mathf.Abs(delta));
                _stab = Mathf.Clamp01(_stab - Mathf.Abs(delta) * 0.4f);
            }
            else if (tag.Contains("stab") || tag.Contains("peace") || tag.Contains("order"))
            {
                _stab = Mathf.Clamp01(_stab + delta);
                _esc  = Mathf.Clamp01(_esc  - delta * 0.3f);
            }
            else if (tag.Contains("time") || tag.Contains("delay"))
            {
                // Delay costs a little stability but buys credibility
                _stab = Mathf.Clamp01(_stab - 0.015f);
                _cred = Mathf.Clamp01(_cred + 0.01f);
            }
            else
            {
                // Generic effect: apply proportionally to stability
                _stab = Mathf.Clamp01(_stab + delta * 0.5f);
            }
        }

        void ApplyAll()
        {
            SetWidth(_stabFill, _stab);
            SetWidth(_credFill, _cred);
            SetWidth(_tollFill, _toll);
            SetWidth(_escFill,  _esc);
        }

        static void SetWidth(VisualElement el, float pct)
        {
            if (el == null) return;
            el.style.width = new StyleLength(new Length(Mathf.Clamp01(pct) * 100f, LengthUnit.Percent));
        }
    }
}
