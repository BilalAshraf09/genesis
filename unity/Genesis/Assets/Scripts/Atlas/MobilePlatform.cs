using System;
using System.Collections.Generic;
using UnityEngine;

namespace Genesis.Atlas
{
    /// <summary>
    /// Shared Android + iOS helpers used by every UI Toolkit screen.
    ///  - Haptics: light tick / confirm pulse (no-op in Editor and on devices without vibration).
    ///  - Back routing: screens push a handler when they open (sheet, dialog, overlay) and pop it on close.
    ///    The Android system Back button (Escape key in Editor) invokes the top-most handler only.
    ///  - Share: native share sheet on device (via ShareCardRenderer where available), clipboard fallback.
    /// </summary>
    public static class MobilePlatform
    {
        static readonly List<Func<bool>> _backStack = new();
        static MobileBackPump _pump;

        /// <summary>Very light tick (selection / hold progress). Safe to call often.</summary>
        public static void HapticTick()
        {
#if (UNITY_ANDROID || UNITY_IOS) && !UNITY_EDITOR
            if (GenesisHapticsEnabled) Handheld.Vibrate();
#endif
        }

        /// <summary>Confirm pulse (order authorised, rank revealed).</summary>
        public static void HapticConfirm()
        {
#if (UNITY_ANDROID || UNITY_IOS) && !UNITY_EDITOR
            if (GenesisHapticsEnabled) Handheld.Vibrate();
#endif
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

        static void EnsurePump()
        {
            if (_pump != null) return;
            var go = new GameObject("[MobileBackPump]");
            UnityEngine.Object.DontDestroyOnLoad(go);
            go.hideFlags = HideFlags.HideInHierarchy;
            _pump = go.AddComponent<MobileBackPump>();
        }

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.SubsystemRegistration)]
        static void ResetStatics() { _backStack.Clear(); _pump = null; }

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
