using System.Collections.Generic;
using Genesis.Data;
using UnityEngine;
using UnityEngine.UIElements;

namespace Genesis.UI.Toolkit
{
    /// <summary>
    /// Drives the four meter fills + percentage labels in the CommandHud.
    /// Call <see cref="Animate"/> after an order is committed to update meters
    /// from the order's <see cref="ChoiceEffect"/> list.
    /// </summary>
    public sealed class MeterStrip
    {
        readonly VisualElement _stabFill;
        readonly VisualElement _credFill;
        readonly VisualElement _tollFill;
        readonly VisualElement _escFill;
        readonly Label _stabValue;
        readonly Label _credValue;
        readonly Label _tollValue;
        readonly Label _escValue;

        // Baseline matches Europe Desk reference (72 / 58 / 34 / 21).
        float _stab = 0.72f;
        float _cred = 0.58f;
        float _toll = 0.34f;
        float _esc  = 0.21f;
        float _prevStab = -1f, _prevCred = -1f, _prevToll = -1f, _prevEsc = -1f;

        public MeterStrip(VisualElement stabFill, VisualElement credFill,
                          VisualElement tollFill, VisualElement escFill,
                          Label stabValue = null, Label credValue = null,
                          Label tollValue = null, Label escValue = null)
        {
            _stabFill = stabFill;
            _credFill = credFill;
            _tollFill = tollFill;
            _escFill  = escFill;
            _stabValue = stabValue;
            _credValue = credValue;
            _tollValue = tollValue;
            _escValue  = escValue;
            ApplyAll();
        }

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

        public void SetValues(float stab, float cred, float toll, float esc)
        {
            _stab = Mathf.Clamp01(stab);
            _cred = Mathf.Clamp01(cred);
            _toll = Mathf.Clamp01(toll);
            _esc  = Mathf.Clamp01(esc);
            ApplyAll();
        }

        void ApplyEffect(ChoiceEffect fx)
        {
            string tag = (fx.tag ?? "").ToLowerInvariant();
            float delta = Mathf.Clamp(fx.weight * 0.012f, -0.12f, 0.12f);

            if (tag.Contains("credib") || tag.Contains("diplomat") || tag.Contains("trust"))
            {
                _cred = Mathf.Clamp01(_cred + delta);
                _stab = Mathf.Clamp01(_stab + delta * 0.4f);
            }
            else if (tag.Contains("civilian") || tag.Contains("toll") || tag.Contains("refugee"))
            {
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
                _stab = Mathf.Clamp01(_stab - 0.015f);
                _cred = Mathf.Clamp01(_cred + 0.01f);
            }
            else
            {
                _stab = Mathf.Clamp01(_stab + delta * 0.5f);
            }
        }

        void ApplyAll()
        {
            FlashIfChanged(_stabFill, _stab, ref _prevStab);
            FlashIfChanged(_credFill, _cred, ref _prevCred);
            FlashIfChanged(_tollFill, _toll, ref _prevToll);
            FlashIfChanged(_escFill,  _esc,  ref _prevEsc);
            SetWidth(_stabFill, _stab);
            SetWidth(_credFill, _cred);
            SetWidth(_tollFill, _toll);
            SetWidth(_escFill,  _esc);
            SetPct(_stabValue, _stab);
            SetPct(_credValue, _cred);
            SetPct(_tollValue, _toll);
            SetPct(_escValue,  _esc);
        }

        static void FlashIfChanged(VisualElement el, float next, ref float prev)
        {
            if (el == null) return;
            if (prev >= 0f && Mathf.Abs(next - prev) > 0.004f)
            {
                el.AddToClassList("ops-meter-fill--flash");
                el.schedule.Execute(() => el.RemoveFromClassList("ops-meter-fill--flash")).StartingIn(280);
            }
            prev = next;
        }

        static void SetWidth(VisualElement el, float pct)
        {
            if (el == null) return;
            el.style.width = new StyleLength(new Length(Mathf.Clamp01(pct) * 100f, LengthUnit.Percent));
        }

        static void SetPct(Label label, float pct)
        {
            if (label == null) return;
            label.text = $"{Mathf.RoundToInt(Mathf.Clamp01(pct) * 100f)}%";
        }
    }
}
