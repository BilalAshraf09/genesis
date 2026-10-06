using Genesis.Data;
using UnityEngine;

namespace Genesis.Core
{
    /// <summary>
    /// Mobile-safe audio skeleton — procedural clips, three buses (ambience / UI / world).
    /// No StreamingAssets dependency; mute via Settings (<see cref="GenesisAudioEnabled"/>).
    /// </summary>
    public sealed class GenesisAudio : MonoBehaviour
    {
        public static GenesisAudio Instance { get; private set; }

        AudioSource _ambience;
        AudioSource _ui;
        AudioSource _world;

        AudioClip _ambienceLoop;
        AudioClip _uiSelect;
        AudioClip _uiHoldComplete;
        AudioClip _uiCancel;
        AudioClip _timerTick;
        AudioClip _stingerBorder;
        AudioClip _stingerCorridor;
        AudioClip _stingerControl;
        AudioClip _stingerStress;

        bool _ambienceWanted;

        public static bool GenesisAudioEnabled
        {
            get => PlayerPrefs.GetInt("genesis.audio", 1) == 1;
            set
            {
                PlayerPrefs.SetInt("genesis.audio", value ? 1 : 0);
                PlayerPrefs.Save();
                if (Instance != null) Instance.ApplyMuteState();
            }
        }

        public static GenesisAudio Ensure()
        {
            if (Instance != null) return Instance;
            var go = new GameObject("GenesisAudio");
            DontDestroyOnLoad(go);
            return go.AddComponent<GenesisAudio>();
        }

        void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }

            Instance = this;
            DontDestroyOnLoad(gameObject);
            BuildSources();
            BuildClips();
            ApplyMuteState();
        }

        void OnDestroy()
        {
            if (Instance == this) Instance = null;
        }

        void OnApplicationPause(bool pauseStatus)
        {
            if (pauseStatus) PauseAmbience();
            else if (_ambienceWanted) ResumeAmbience();
        }

        void OnApplicationFocus(bool hasFocus)
        {
            if (!hasFocus) PauseAmbience();
            else if (_ambienceWanted) ResumeAmbience();
        }

        public void StartAmbience()
        {
            _ambienceWanted = true;
            if (!GenesisAudioEnabled || _ambience == null || _ambienceLoop == null) return;
            if (_ambience.isPlaying) return;
            _ambience.clip = _ambienceLoop;
            _ambience.loop = true;
            _ambience.volume = 0.22f;
            _ambience.Play();
        }

        public void StopAmbience()
        {
            _ambienceWanted = false;
            if (_ambience != null && _ambience.isPlaying) _ambience.Stop();
        }

        public void PauseAmbience()
        {
            if (_ambience != null && _ambience.isPlaying) _ambience.Pause();
        }

        public void ResumeAmbience()
        {
            if (!GenesisAudioEnabled || !_ambienceWanted || _ambience == null) return;
            if (!_ambience.isPlaying) _ambience.UnPause();
            if (!_ambience.isPlaying && _ambienceLoop != null)
            {
                _ambience.clip = _ambienceLoop;
                _ambience.loop = true;
                _ambience.Play();
            }
        }

        public void PlaySelect() => PlayUi(_uiSelect, 0.55f);
        public void PlayHoldComplete() => PlayUi(_uiHoldComplete, 0.7f);
        public void PlayCancel() => PlayUi(_uiCancel, 0.4f);
        public void PlayTimerTick() => PlayUi(_timerTick, 0.35f);

        public void PlayExecuteStinger(WorldVerb verb)
        {
            if (!GenesisAudioEnabled || _world == null) return;
            var clip = verb switch
            {
                WorldVerb.BorderShift => _stingerBorder,
                WorldVerb.CorridorToggle => _stingerCorridor,
                WorldVerb.ControlWash => _stingerControl,
                WorldVerb.CityStress => _stingerStress,
                _ => _stingerControl
            };
            if (clip == null) return;
            // Brief duck of ambience under world hit.
            if (_ambience != null && _ambience.isPlaying)
                _ambience.volume = 0.08f;
            _world.PlayOneShot(clip, 0.85f);
            if (_ambience != null)
                Invoke(nameof(RestoreAmbienceVolume), 0.55f);
        }

        void RestoreAmbienceVolume()
        {
            if (_ambience != null) _ambience.volume = GenesisAudioEnabled ? 0.22f : 0f;
        }

        void PlayUi(AudioClip clip, float volume)
        {
            if (!GenesisAudioEnabled || _ui == null || clip == null) return;
            _ui.PlayOneShot(clip, volume);
        }

        void ApplyMuteState()
        {
            bool on = GenesisAudioEnabled;
            if (_ambience != null) _ambience.mute = !on;
            if (_ui != null) _ui.mute = !on;
            if (_world != null) _world.mute = !on;
            if (!on) PauseAmbience();
            else if (_ambienceWanted) ResumeAmbience();
        }

        void BuildSources()
        {
            _ambience = gameObject.AddComponent<AudioSource>();
            _ambience.playOnAwake = false;
            _ambience.loop = true;
            _ambience.spatialBlend = 0f;
            _ambience.priority = 64;

            _ui = gameObject.AddComponent<AudioSource>();
            _ui.playOnAwake = false;
            _ui.loop = false;
            _ui.spatialBlend = 0f;
            _ui.priority = 128;

            _world = gameObject.AddComponent<AudioSource>();
            _world.playOnAwake = false;
            _world.loop = false;
            _world.spatialBlend = 0f;
            _world.priority = 96;
        }

        void BuildClips()
        {
            _ambienceLoop = MakeAmbienceLoop();
            _uiSelect = MakeClick(920f, 0.045f, 0.55f);
            _uiHoldComplete = MakeClunk(140f, 0.12f, 0.8f);
            _uiCancel = MakeClick(280f, 0.04f, 0.35f);
            _timerTick = MakeClick(1100f, 0.03f, 0.28f);
            _stingerBorder = MakeStinger(180f, 240f, 0.32f);
            _stingerCorridor = MakeStinger(220f, 160f, 0.3f);
            _stingerControl = MakeStinger(150f, 300f, 0.34f);
            _stingerStress = MakeStinger(110f, 90f, 0.36f);
        }

        static AudioClip MakeAmbienceLoop()
        {
            const int sampleRate = 22050;
            const float duration = 4f;
            int samples = Mathf.RoundToInt(sampleRate * duration);
            var data = new float[samples];
            var rng = new System.Random(1947);
            for (int i = 0; i < samples; i++)
            {
                float t = i / (float)sampleRate;
                // Soft room tone: low sine + filtered noise
                float hum = Mathf.Sin(2f * Mathf.PI * 62f * t) * 0.04f
                            + Mathf.Sin(2f * Mathf.PI * 93f * t) * 0.025f;
                float noise = ((float)rng.NextDouble() * 2f - 1f) * 0.018f;
                // Crossfade loop ends
                float fade = 1f;
                float edge = 0.12f;
                if (t < edge) fade = t / edge;
                float end = duration - t;
                if (end < edge) fade = Mathf.Min(fade, end / edge);
                data[i] = (hum + noise) * fade;
            }

            var clip = AudioClip.Create("GenesisAmbience", samples, 1, sampleRate, false);
            clip.SetData(data, 0);
            return clip;
        }

        static AudioClip MakeClick(float freq, float duration, float amp)
        {
            const int sampleRate = 22050;
            int samples = Mathf.Max(8, Mathf.RoundToInt(sampleRate * duration));
            var data = new float[samples];
            for (int i = 0; i < samples; i++)
            {
                float t = i / (float)sampleRate;
                float env = Mathf.Exp(-t * 55f);
                data[i] = Mathf.Sin(2f * Mathf.PI * freq * t) * env * amp;
            }

            var clip = AudioClip.Create($"GenesisClick_{freq:0}", samples, 1, sampleRate, false);
            clip.SetData(data, 0);
            return clip;
        }

        static AudioClip MakeClunk(float freq, float duration, float amp)
        {
            const int sampleRate = 22050;
            int samples = Mathf.Max(8, Mathf.RoundToInt(sampleRate * duration));
            var data = new float[samples];
            var rng = new System.Random(71);
            for (int i = 0; i < samples; i++)
            {
                float t = i / (float)sampleRate;
                float env = Mathf.Exp(-t * 28f);
                float tone = Mathf.Sin(2f * Mathf.PI * freq * t) * 0.7f
                             + Mathf.Sin(2f * Mathf.PI * (freq * 0.5f) * t) * 0.3f;
                float noise = ((float)rng.NextDouble() * 2f - 1f) * 0.25f * env;
                data[i] = (tone * env + noise) * amp;
            }

            var clip = AudioClip.Create($"GenesisClunk_{freq:0}", samples, 1, sampleRate, false);
            clip.SetData(data, 0);
            return clip;
        }

        static AudioClip MakeStinger(float f0, float f1, float duration)
        {
            const int sampleRate = 22050;
            int samples = Mathf.Max(16, Mathf.RoundToInt(sampleRate * duration));
            var data = new float[samples];
            for (int i = 0; i < samples; i++)
            {
                float t = i / (float)sampleRate;
                float u = t / duration;
                float freq = Mathf.Lerp(f0, f1, u);
                float env = Mathf.Sin(Mathf.PI * Mathf.Clamp01(u * 1.15f)) * Mathf.Exp(-u * 1.8f);
                data[i] = Mathf.Sin(2f * Mathf.PI * freq * t) * env * 0.7f
                          + Mathf.Sin(2f * Mathf.PI * freq * 1.5f * t) * env * 0.2f;
            }

            var clip = AudioClip.Create($"GenesisStinger_{f0:0}_{f1:0}", samples, 1, sampleRate, false);
            clip.SetData(data, 0);
            return clip;
        }

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.SubsystemRegistration)]
        static void ResetStatics() => Instance = null;
    }
}
