using System;
using System.Collections.Generic;
using UnityEngine;

namespace Genesis.Atlas
{
    /// <summary>
    /// Shared Android + iOS helpers used by every UI Toolkit screen.
    ///  - Haptics: short patterned pulses with cooldowns (no continuous buzz).
    ///  - Back routing: screens push a handler when they open and pop on close.
    ///  - Share: native share sheet on device, clipboard fallback.
    /// </summary>
    public static class MobilePlatform
    {
        static readonly List<Func<bool>> _backStack = new();
        static MobileBackPump _pump;

        static float _nextTickAt;
        static float _nextProgressAt;
        static float _nextConfirmAt;

        const float TickCooldown = 0.045f;
        const float ProgressCooldown = 0.09f;
        const float ConfirmCooldown = 0.28f;

        /// <summary>Very light tick (selection / UI). Safe to call often.</summary>
        public static void HapticTick()
        {
            if (!GenesisHapticsEnabled) return;
            if (Time.unscaledTime < _nextTickAt) return;
            _nextTickAt = Time.unscaledTime + TickCooldown;
            Pulse(HapticKind.Tick);
        }

        /// <summary>Hold-progress ticks — slightly heavier, throttled.</summary>
        public static void HapticProgress()
        {
            if (!GenesisHapticsEnabled) return;
            if (Time.unscaledTime < _nextProgressAt) return;
            _nextProgressAt = Time.unscaledTime + ProgressCooldown;
            Pulse(HapticKind.Progress);
        }

        /// <summary>Confirm pulse (order authorised, rank revealed).</summary>
        public static void HapticConfirm()
        {
            if (!GenesisHapticsEnabled) return;
            if (Time.unscaledTime < _nextConfirmAt) return;
            _nextConfirmAt = Time.unscaledTime + ConfirmCooldown;
            Pulse(HapticKind.Confirm);
        }

        public static bool GenesisHapticsEnabled
        {
            get => PlayerPrefs.GetInt("genesis.haptics", 1) == 1;
            set { PlayerPrefs.SetInt("genesis.haptics", value ? 1 : 0); PlayerPrefs.Save(); }
        }

        /// <summary>
        /// Register a Back handler. Return true from the handler if it consumed Back.
        /// Call PopBack with the same delegate when the screen/sheet closes.
        /// </summary>
        public static void PushBack(Func<bool> handler)
        {
            if (handler == null) return;
            EnsurePump();
            _backStack.Remove(handler);
            _backStack.Add(handler);
        }

        public static void PopBack(Func<bool> handler)
        {
            if (handler != null) _backStack.Remove(handler);
        }

        /// <summary>Invoke Back as if the system button was pressed. Returns true if something handled it.</summary>
        public static bool InvokeBack()
        {
            for (int i = _backStack.Count - 1; i >= 0; i--)
            {
                var h = _backStack[i];
                if (h == null) { _backStack.RemoveAt(i); continue; }
                try { if (h()) return true; }
                catch (Exception e) { Debug.LogException(e); }
            }
            return false;
        }

        /// <summary>Native share of text (and optional PNG path). Falls back to clipboard.</summary>
        public static void ShareText(string text, string subject = "Genesis — Living Atlas")
        {
#if UNITY_ANDROID && !UNITY_EDITOR
            try
            {
                using var intentClass = new AndroidJavaClass("android.content.Intent");
                using var intent = new AndroidJavaObject("android.content.Intent");
                intent.Call<AndroidJavaObject>("setAction", intentClass.GetStatic<string>("ACTION_SEND"));
                intent.Call<AndroidJavaObject>("setType", "text/plain");
                intent.Call<AndroidJavaObject>("putExtra", intentClass.GetStatic<string>("EXTRA_SUBJECT"), subject);
                intent.Call<AndroidJavaObject>("putExtra", intentClass.GetStatic<string>("EXTRA_TEXT"), text);
                using var unity = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
                using var activity = unity.GetStatic<AndroidJavaObject>("currentActivity");
                using var chooser = intentClass.CallStatic<AndroidJavaObject>("createChooser", intent, "Share via");
                activity.Call("startActivity", chooser);
                return;
            }
            catch (Exception e) { Debug.LogWarning("[Genesis] Native share failed, using clipboard: " + e.Message); }
#endif
            GUIUtility.systemCopyBuffer = text;
            Debug.Log("[Genesis] Share text copied to clipboard.");
        }

        enum HapticKind { Tick, Progress, Confirm }

        static void Pulse(HapticKind kind)
        {
#if UNITY_EDITOR
            return;
#elif UNITY_ANDROID
            if (TryAndroidVibrate(kind)) return;
            if (kind == HapticKind.Confirm) Handheld.Vibrate();
#elif UNITY_IOS
            // No Core Haptics plugin — keep confirms rare; skip micro-ticks to avoid long buzz spam.
            if (kind == HapticKind.Confirm || kind == HapticKind.Progress)
                Handheld.Vibrate();
#endif
        }

#if UNITY_ANDROID && !UNITY_EDITOR
        static bool TryAndroidVibrate(HapticKind kind)
        {
            try
            {
                using var unityPlayer = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
                using var activity = unityPlayer.GetStatic<AndroidJavaObject>("currentActivity");
                if (activity == null) return false;
                using var vibrator = activity.Call<AndroidJavaObject>("getSystemService", "vibrator");
                if (vibrator == null || !vibrator.Call<bool>("hasVibrator")) return false;

                using var version = new AndroidJavaClass("android.os.Build$VERSION");
                int sdk = version.GetStatic<int>("SDK_INT");

                if (sdk >= 26)
                {
                    using var effectClass = new AndroidJavaClass("android.os.VibrationEffect");
                    if (kind == HapticKind.Confirm)
                    {
                        // Double pulse: short-gap-short
                        long[] timings = { 0L, 18L, 40L, 28L };
                        int[] amplitudes = { 0, 140, 0, 200 };
                        using var effect = effectClass.CallStatic<AndroidJavaObject>(
                            "createWaveform", timings, amplitudes, -1);
                        vibrator.Call("vibrate", effect);
                    }
                    else
                    {
                        long ms = kind == HapticKind.Progress ? 14L : 10L;
                        int amp = kind == HapticKind.Progress ? 90 : 55;
                        using var effect = effectClass.CallStatic<AndroidJavaObject>(
                            "createOneShot", ms, amp);
                        vibrator.Call("vibrate", effect);
                    }
                    return true;
                }

                // Pre-Oreo
                long duration = kind switch
                {
                    HapticKind.Confirm => 40L,
                    HapticKind.Progress => 20L,
                    _ => 12L
                };
                vibrator.Call("vibrate", duration);
                return true;
            }
            catch (Exception e)
            {
                Debug.LogWarning("[Genesis] Android haptic failed: " + e.Message);
                return false;
            }
        }
#endif

        static void EnsurePump()
        {
            if (_pump != null) return;
            var go = new GameObject("[MobileBackPump]");
            UnityEngine.Object.DontDestroyOnLoad(go);
            go.hideFlags = HideFlags.HideInHierarchy;
            _pump = go.AddComponent<MobileBackPump>();
        }

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.SubsystemRegistration)]
        static void ResetStatics()
        {
            _backStack.Clear();
            _pump = null;
            _nextTickAt = 0f;
            _nextProgressAt = 0f;
            _nextConfirmAt = 0f;
        }

        sealed class MobileBackPump : MonoBehaviour
        {
            void Update()
            {
                bool pressed = false;
#if ENABLE_INPUT_SYSTEM
                var kb = UnityEngine.InputSystem.Keyboard.current;
                if (kb != null && kb.escapeKey.wasPressedThisFrame) pressed = true;
#endif
#if ENABLE_LEGACY_INPUT_MANAGER
                if (!pressed && Input.GetKeyDown(KeyCode.Escape)) pressed = true;
#endif
                if (pressed) InvokeBack();
            }
        }
    }
}
