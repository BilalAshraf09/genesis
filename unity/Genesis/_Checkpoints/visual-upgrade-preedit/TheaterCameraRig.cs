using System.Collections;
using UnityEngine;
#if GENESIS_URP
using UnityEngine.Rendering.Universal;
#endif
#if GENESIS_CINEMACHINE
using Unity.Cinemachine;
#endif

namespace Genesis.Theater
{
    /// <summary>
    /// Cinematic board camera — frames the full-bleed map, lerps on hotspot focus.
    /// Phase 2: CM PositionComposer framing + BasicMultiChannelPerlin idle noise + ImpulseDefinition.
    /// Phase 3 additions: 1.5s fly-in, one-finger pan + two-finger pinch zoom with bbox clamp,
    /// portrait framing for map-band (top 14% HUD / bottom 36% order sheet), fog neutralised.
    /// </summary>
    public class TheaterCameraRig : MonoBehaviour
    {
        public Camera cam;
        public bool is2DMode = true; // Default to 2D as requested by user
        public float frameDistance = 18f;
        public float focusDistance = 12f;
        public float lerpSpeed = 3.2f;
        public Vector3 frameOffset = new(0f, 13.2f, -10.2f);
        public Vector3 focusOffset = new(0f, 8.6f, -6.4f);
        [Range(0.01f, 0.05f)] public float frameFogDensity = 0.015f;
        [Range(0.01f, 0.06f)] public float focusFogDensity = 0.022f;
        [Range(4f, 12f)] public float punchFovKick = 5.5f;

        // ── 2D specific ────────────────────────────────────────────────────────
        public float baseOrthoSize = 12f;

        // ── Pan / Zoom state ────────────────────────────────────────────────────
        Vector3 _panOffset;
        float   _zoomFactor = 1f;
        const float ZoomMin = 0.25f; // Zoom in closer
        const float ZoomMax = 4.50f; // Zoom out further to see whole map
        // Pan clamped to board extents (set from GeoProjection after Build)
        float _panHalfX = 18f;
        float _panHalfZ = 12f;

        Vector3 _targetPos;
        Quaternion _targetRot;
        Vector3 _focusPoint;
        bool _focusing;
        float _baseFov = 38f;
        Transform _lookAt;
        Transform _follow;

#if GENESIS_CINEMACHINE
        CinemachineCamera _vcam;
        CinemachineImpulseSource _impulse;
        CinemachinePositionComposer _composer;
        CinemachineBasicMultiChannelPerlin _noise;
        NoiseSettings _idleNoiseProfile;
        bool _cmGrammarReady;
#endif

        void Awake()
        {
            if (cam == null) cam = Camera.main;
            ApplyPortraitFramingDefaults();
            EnsureLookTargets();
            EnsureCinemachineStack();
            
            if (is2DMode)
            {
                _targetPos = new Vector3(-0.5f, 30f, -3.2f);
                _targetRot = Quaternion.Euler(90f, 0f, 0f);
                _zoomFactor = 1.0f;
            }
            else
            {
                _targetPos = frameOffset;
                _targetRot = Quaternion.LookRotation(Vector3.zero - _targetPos, Vector3.up);
            }
        }

        /// <summary>
        /// Baseline §4.3 + clarity: theater fills ≥60% map viewport (chrome ≤40%).
        /// Prefer Screen portrait OR camera aspect ≤0.72 (Editor Game view can disagree).
        /// </summary>
        void ApplyPortraitFramingDefaults()
        {
            if (!WantPortraitBoardFraming()) return;
            
            if (is2DMode)
            {
                // Top-down 2D framing shifted south so the whole subcontinent is in the open map band
                frameOffset = new Vector3(-0.5f, 30f, -3.2f);
                focusOffset = new Vector3(0f, 15f, 0f);
                frameFogDensity = 0f;
                return;
            }

            // Closer + slightly lower south desk shot — board lands in the open map band
            // (bottom rail ≤26%, top HUD ≤14%) instead of clipping under the Order Rail.
            _baseFov = 44f;
            frameDistance = 19.2f;
            focusDistance = 13.4f;
            frameOffset = new Vector3(0f, 14.4f, -11.6f);
            focusOffset = new Vector3(0f, 9.1f, -7.4f);
            frameFogDensity = 0.01f;
        }

        /// <summary>
        /// Phone chrome / Game-view portrait RT — detected via aspect ratio or platform.
        /// </summary>
        public static bool WantPortraitBoardFraming()
        {
            // Portrait or narrow-phone check (inlined from deleted MobileCanvasDefaults).
            if (Screen.height >= Screen.width || Mathf.Min(Screen.width, Screen.height) <= 900) return true;
            var c = Camera.main;
            return c != null && c.aspect > 0.01f && c.aspect <= 0.72f;
        }

        void EnsureLookTargets()
        {
            if (_lookAt == null)
            {
                var go = GameObject.Find("CM_BoardLookAt") ?? new GameObject("CM_BoardLookAt");
                _lookAt = go.transform;
                _lookAt.position = Vector3.zero;
            }

            if (_follow == null)
            {
                var go = GameObject.Find("CM_BoardFollow") ?? new GameObject("CM_BoardFollow");
                _follow = go.transform;
                _follow.position = frameOffset;
            }
        }

        public void EnsureCinemachineStack()
        {
            if (cam == null) cam = Camera.main;
            if (cam == null) return;
            ApplyPortraitFramingDefaults();
            EnsureLookTargets();

            cam.allowHDR = true;
            cam.allowMSAA = true;
            cam.clearFlags = CameraClearFlags.SolidColor;
            if (cam.backgroundColor.a < 0.01f || cam.backgroundColor.maxColorComponent < 0.04f)
            {
                cam.backgroundColor = new Color(0.018f, 0.032f, 0.052f);
            }

#if GENESIS_URP
            var urpData = cam.GetComponent<UniversalAdditionalCameraData>();
            if (urpData == null) urpData = cam.gameObject.AddComponent<UniversalAdditionalCameraData>();
            urpData.renderPostProcessing = true;
            urpData.antialiasing = AntialiasingMode.FastApproximateAntialiasing;
            urpData.antialiasingQuality = AntialiasingQuality.High;
            urpData.renderShadows = true;
#endif

#if GENESIS_CINEMACHINE
            var brain = cam.GetComponent<CinemachineBrain>();
            if (brain == null) brain = cam.gameObject.AddComponent<CinemachineBrain>();

            // If 2D mode, we don't want CinemachineBrain fighting our top-down orthographic camera!
            if (is2DMode)
            {
                brain.enabled = false;
                cam.orthographic = true;
                cam.orthographicSize = baseOrthoSize * _zoomFactor;
                cam.nearClipPlane = 0.1f;
                cam.farClipPlane = 200f;
                cam.transform.position = new Vector3(_panOffset.x, 30f, _panOffset.z);
                cam.transform.rotation = Quaternion.Euler(90f, 0f, 0f);
                return;
            }
            brain.enabled = true;

            var cmGo = GameObject.Find("CM_TheaterCam");
            if (cmGo == null) cmGo = new GameObject("CM_TheaterCam");

            _vcam = cmGo.GetComponent<CinemachineCamera>() ?? cmGo.AddComponent<CinemachineCamera>();
            var lens = _vcam.Lens;
            lens.ModeOverride = LensSettings.OverrideModes.Perspective;
            lens.FieldOfView = _baseFov;
            lens.NearClipPlane = 0.15f;
            lens.FarClipPlane = 250f;
            _vcam.Lens = lens;

            _lookAt.position = Vector3.zero;
            _vcam.Target.TrackingTarget = _lookAt;
            _vcam.Target.LookAtTarget = _lookAt;

            _composer = cmGo.GetComponent<CinemachinePositionComposer>()
                        ?? cmGo.AddComponent<CinemachinePositionComposer>();
            
            _composer.CameraDistance = frameDistance * 0.92f;
            _composer.DeadZoneDepth = 0.35f;
            _composer.TargetOffset = WantPortraitBoardFraming()
                ? new Vector3(0f, 0.02f, -0.55f)
                : new Vector3(0f, 0.15f, 0f);
            
            ApplyPortraitScreenYBias(_composer);

            if (cmGo.GetComponent<CinemachineHardLookAt>() == null &&
                cmGo.GetComponent<CinemachineRotationComposer>() == null)
            {
                cmGo.AddComponent<CinemachineHardLookAt>();
            }

            _noise = cmGo.GetComponent<CinemachineBasicMultiChannelPerlin>()
                     ?? cmGo.AddComponent<CinemachineBasicMultiChannelPerlin>();
            if (_idleNoiseProfile == null)
            {
                _idleNoiseProfile = BuildIdleNoiseProfile();
            }

            _noise.NoiseProfile = _idleNoiseProfile;
            var noiseOn = Genesis.Core.GenesisPremiumVisuals.CmNoiseEnabled ||
                          QualitySettings.GetQualityLevel() >= 2;
            _noise.AmplitudeGain = noiseOn ? 0.22f : 0.06f;
            _noise.FrequencyGain = noiseOn ? 0.35f : 0.2f;

            if (cmGo.GetComponent<CinemachineImpulseListener>() == null)
            {
                cmGo.AddComponent<CinemachineImpulseListener>();
            }

            if (cam.GetComponent<CinemachineImpulseListener>() == null)
            {
                cam.gameObject.AddComponent<CinemachineImpulseListener>();
            }

            _impulse = cmGo.GetComponent<CinemachineImpulseSource>()
                       ?? cmGo.AddComponent<CinemachineImpulseSource>();
            ConfigureImpulseDefinition(_impulse);

            cmGo.transform.position = frameOffset;
            cmGo.transform.rotation = Quaternion.LookRotation(Vector3.zero - frameOffset, Vector3.up);
            _cmGrammarReady = true;
#endif
        }

#if GENESIS_CINEMACHINE
        /// <summary>
        /// Diagnosis P1.4 — place tracked subject in the portrait map hero band, not geometric screen center.
        /// CM Composition.ScreenPosition: (0,0)=center; +Y moves target toward top of frame.
        /// </summary>
        static void ApplyPortraitScreenYBias(CinemachinePositionComposer composer)
        {
            if (composer == null || !WantPortraitBoardFraming()) return;

            // Map band ~0.22–0.86 → center 0.54. Stronger +Y lifts desk out of the Order Rail.
            const float screenY = 0.16f;
            try
            {
                var compositionProp = typeof(CinemachinePositionComposer).GetProperty("Composition");
                if (compositionProp == null) return;
                var composition = compositionProp.GetValue(composer);
                if (composition == null) return;
                var screenProp = composition.GetType().GetProperty("ScreenPosition");
                if (screenProp == null || !screenProp.CanWrite) return;
                screenProp.SetValue(composition, new Vector2(0f, screenY));
                // Soft zone stays generous so focus lerps don't fight the bias.
                var softProp = composition.GetType().GetProperty("SoftZoneSize");
                if (softProp != null && softProp.CanWrite && softProp.PropertyType == typeof(Vector2))
                    softProp.SetValue(composition, new Vector2(0.7f, 0.55f));
                var deadProp = composition.GetType().GetProperty("DeadZoneSize");
                if (deadProp != null && deadProp.CanWrite && deadProp.PropertyType == typeof(Vector2))
                    deadProp.SetValue(composition, new Vector2(0.05f, 0.08f));
                compositionProp.SetValue(composer, composition);
            }
            catch (System.Exception ex)
            {
                Debug.LogWarning($"[Genesis] CM screen-Y bias skipped: {ex.Message}");
            }
        }

        static void ConfigureImpulseDefinition(CinemachineImpulseSource impulse)
        {
            if (impulse == null) return;
            // Authored ImpulseDefinition — short desk thump, not explosion.
            var def = impulse.ImpulseDefinition;
            if (def != null)
            {
                def.ImpulseDuration = 0.22f;
                def.DissipationDistance = 28f;
                def.DissipationRate = 0.35f;
            }

            impulse.DefaultVelocity = new Vector3(0f, -0.06f, 0.22f);
        }

        static NoiseSettings BuildIdleNoiseProfile()
        {
            var noise = ScriptableObject.CreateInstance<NoiseSettings>();
            noise.name = "GenesisDeskIdleNoise";
            noise.PositionNoise = new[]
            {
                new NoiseSettings.TransformNoiseParams
                {
                    X = new NoiseSettings.NoiseParams { Amplitude = 0.04f, Frequency = 0.18f },
                    Y = new NoiseSettings.NoiseParams { Amplitude = 0.03f, Frequency = 0.14f },
                    Z = new NoiseSettings.NoiseParams { Amplitude = 0.035f, Frequency = 0.16f },
                }
            };
            noise.OrientationNoise = new[]
            {
                new NoiseSettings.TransformNoiseParams
                {
                    X = new NoiseSettings.NoiseParams { Amplitude = 0.18f, Frequency = 0.12f },
                    Y = new NoiseSettings.NoiseParams { Amplitude = 0.12f, Frequency = 0.1f },
                    Z = new NoiseSettings.NoiseParams { Amplitude = 0.08f, Frequency = 0.14f },
                }
            };
            return noise;
        }
#endif

        void LateUpdate()
        {
            if (is2DMode)
            {
                if (cam == null) cam = Camera.main;
                if (cam != null)
                {
                    cam.orthographic = true;
                    cam.orthographicSize = Mathf.Lerp(cam.orthographicSize, baseOrthoSize * _zoomFactor, Time.deltaTime * lerpSpeed);
                    var targetPos = new Vector3(_targetPos.x + _panOffset.x, 30f, _targetPos.z + _panOffset.z);
                    cam.transform.position = Vector3.Lerp(cam.transform.position, targetPos, Time.deltaTime * lerpSpeed);
                    cam.transform.rotation = Quaternion.Euler(90f, 0f, 0f);
                }
                return;
            }

            // Apply pan offset to look-at target (Soft-drive CM look target).
            if (_lookAt != null)
            {
                var baseLook = _focusing
                    ? _focusPoint
                    : (WantPortraitBoardFraming() ? new Vector3(0f, 0f, -0.85f) : Vector3.zero);

                var look = baseLook + _panOffset;
                _lookAt.position = Vector3.Lerp(_lookAt.position, look, Time.deltaTime * lerpSpeed);
            }

#if GENESIS_CINEMACHINE
            if (_cmGrammarReady && _vcam != null)
            {
                if (is2DMode)
                {
                    // 2D zoom handling
                    var lens = _vcam.Lens;
                    lens.OrthographicSize = Mathf.Lerp(lens.OrthographicSize, baseOrthoSize * _zoomFactor, Time.deltaTime * lerpSpeed);
                    _vcam.Lens = lens;
                }

                if (_composer != null)
                {
                    // Idle portrait: drive the desk frame directly. Composer orbit drifts
                    // top-down on phone aspect and clips the map under the rail.
                    var leashPortrait = !_focusing && WantPortraitBoardFraming();
                    
                    if (is2DMode) leashPortrait = true; // Always leash in 2D mode for top-down lock

                    _composer.enabled = !leashPortrait;
                    if (!leashPortrait)
                    {
                        // Apply zoom factor to camera distance.
                        var baseDist = _focusing ? focusDistance * 0.95f : frameDistance * 0.92f;
                        var want     = baseDist * _zoomFactor;
                        _composer.CameraDistance = Mathf.Lerp(
                            _composer.CameraDistance, want, Time.deltaTime * lerpSpeed);
                    }
                }

                if (_noise != null)
                {
                    // Mute idle noise while focusing a pin so telegraph stays readable.
                    var wantAmp = _focusing ? 0.04f : (is2DMode ? 0.02f : 0.22f);
                    _noise.AmplitudeGain = Mathf.Lerp(
                        _noise.AmplitudeGain, wantAmp, Time.deltaTime * 4f);
                }

                // Portrait idle leash — HardLookAt still aims; body sits on frameOffset (+ pan).
                if (!_focusing && (WantPortraitBoardFraming() || is2DMode))
                {
                    var look    = _lookAt != null ? _lookAt.position : Vector3.zero;
                    var camPos  = frameOffset + _panOffset;
                    
                    if (is2DMode) camPos = new Vector3(_panOffset.x, frameOffset.y, _panOffset.z);

                    var wantRot = is2DMode ? Quaternion.Euler(90f, 0f, 0f) : Quaternion.LookRotation(look - camPos, Vector3.up);
                    
                    _vcam.transform.position = Vector3.Lerp(
                        _vcam.transform.position, camPos, Time.deltaTime * lerpSpeed);
                    _vcam.transform.rotation = Quaternion.Slerp(
                        _vcam.transform.rotation, wantRot, Time.deltaTime * lerpSpeed);
                }

                return;
            }
#endif

            // Fallback path when CM package/defines unavailable — drive camera transform directly.
            var driven = GetDrivenTransform();
            if (driven == null) return;
            
            if (is2DMode)
            {
                cam.orthographic = true;
                cam.orthographicSize = Mathf.Lerp(cam.orthographicSize, baseOrthoSize * _zoomFactor, Time.deltaTime * lerpSpeed);
            }

            var drivenTarget = is2DMode ? new Vector3(_panOffset.x, frameOffset.y, _panOffset.z) : (_targetPos + _panOffset);
            var targetRot = is2DMode ? Quaternion.Euler(90f, 0f, 0f) : _targetRot;

            driven.position = Vector3.Lerp(driven.position, drivenTarget, Time.deltaTime * lerpSpeed);
            driven.rotation = Quaternion.Slerp(driven.rotation, targetRot, Time.deltaTime * lerpSpeed);
        }

        Transform GetDrivenTransform()
        {
#if GENESIS_CINEMACHINE
            if (_vcam != null) return _vcam.transform;
#endif
            return cam != null ? cam.transform : null;
        }

        public void FrameBoard(TheaterBoardBuilder board)
        {
            EnsureCinemachineStack();
            _focusing   = false;
            _focusPoint = Vector3.zero;
            _panOffset  = Vector3.zero;
            _zoomFactor = 1f;

            // Update pan bounds from the board's GeoProjection
            if (board?.Projection != null)
            {
                var proj = board.Projection;
                _panHalfX = proj.BoardWidth  * 0.55f;
                _panHalfZ = proj.BoardDepth  * 0.55f;
                
                if (is2DMode)
                {
                    var aspect = cam != null ? cam.aspect : 0.5625f;
                    
                    // To truly "fit to screen" horizontally, the camera's half-width in world units 
                    // (orthoSize * aspect) should match the board's half-width (BoardWidth / 2).
                    // orthoSize = BoardWidth / (2 * aspect).
                    // We add a tiny 2% margin to prevent pixel-perfect edge flickering.
                    baseOrthoSize = (proj.BoardWidth * 0.51f) / aspect;
                    baseOrthoSize = Mathf.Clamp(baseOrthoSize, 18f, 30f);
                }
            }

            // In portrait 2D mode, the open map band is between HUD (top 14%) and Order Sheet (bottom ~38%).
            // The center of this open area is at screen Y ≈ 62% (above screen center).
            // Shifting the camera target to Z = -3.2f centers the entire subcontinent (pins center Z ≈ +2.8f)
            // right into the center of this open viewport!
            _targetPos = is2DMode ? new Vector3(-0.5f, 30f, -3.2f) : frameOffset;
            _panOffset = Vector3.zero;
            _zoomFactor = 1.0f; 

            // Neutralise fog for clean map read.
            RenderSettings.fog = false;

            if (_follow != null) _follow.position = _targetPos;
            if (_lookAt != null) _lookAt.position = is2DMode ? new Vector3(-0.5f, 0f, 2.5f) : Vector3.zero;

            var driven = GetDrivenTransform();
            if (driven != null)
            {
                driven.position = _targetPos;
                driven.rotation = is2DMode ? Quaternion.Euler(90f, 0f, 0f) : Quaternion.LookRotation(Vector3.zero - _targetPos, Vector3.up);
            }

            if (is2DMode && cam != null)
            {
                cam.orthographic = true;
                cam.orthographicSize = baseOrthoSize;
                cam.transform.position = _targetPos;
                cam.transform.rotation = Quaternion.Euler(90f, 0f, 0f);
            }

#if GENESIS_CINEMACHINE
            if (_composer != null)
            {
                _composer.CameraDistance = is2DMode ? 30f : (frameDistance * 0.92f);
                ApplyPortraitScreenYBias(_composer);
            }
#endif
            // 1.5s fly-in from wide regional view.
            if (isActiveAndEnabled)
                StartCoroutine(FlyInRoutine(1.5f));
        }

        // ── Fly-in ──────────────────────────────────────────────────────────────

        IEnumerator FlyInRoutine(float duration)
        {
            if (is2DMode)
            {
                if (cam == null) cam = Camera.main;
                var startOrtho = baseOrthoSize * 1.5f;
                var targetOrtho = baseOrthoSize;
                var t2d = 0f;
                while (t2d < duration)
                {
                    t2d += Time.deltaTime;
                    var k = Mathf.SmoothStep(0f, 1f, t2d / duration);
                    if (cam != null)
                    {
                        cam.orthographic = true;
                        cam.orthographicSize = Mathf.Lerp(startOrtho, targetOrtho, k);
                        cam.transform.position = new Vector3(_targetPos.x + _panOffset.x, 30f, _targetPos.z + _panOffset.z);
                        cam.transform.rotation = Quaternion.Euler(90f, 0f, 0f);
                    }
                    yield return null;
                }
                yield break;
            }

            // Start from a wider, more elevated position
            var widePos = new Vector3(_targetPos.x, _targetPos.y * 2.2f, _targetPos.z * 1.5f);
            var wideFov = _baseFov * 0.72f; 
            var driven  = GetDrivenTransform();
            if (driven != null) driven.position = widePos;
            SetFov(wideFov);

            var t = 0f;
            while (t < duration)
            {
                t += Time.deltaTime;
                var k = Mathf.SmoothStep(0f, 1f, t / duration);
                var curPos = Vector3.Lerp(widePos, _targetPos, k);
                var curFov = Mathf.Lerp(wideFov, _baseFov, k);

                if (driven != null)
                {
                    driven.position = curPos;
                    var rot = Quaternion.LookRotation(Vector3.zero - curPos, Vector3.up);
                    driven.rotation = rot;
                }
                SetFov(curFov);

#if GENESIS_CINEMACHINE
                if (_vcam != null)
                {
                    _vcam.transform.position = curPos;
                    _vcam.transform.rotation = Quaternion.LookRotation(Vector3.zero - curPos, Vector3.up);
                }
#endif
                yield return null;
            }
        }

        // ── Pan / Zoom public API (called by BoardPointerInput) ─────────────────

        /// <summary>
        /// Moves the camera look-at target by <paramref name="worldDelta"/> (world XZ units).
        /// Clamped to the board bbox.
        /// </summary>
        public void PanWorld(Vector2 worldDelta)
        {
            _panOffset.x = Mathf.Clamp(_panOffset.x + worldDelta.x, -_panHalfX, _panHalfX);
            _panOffset.z = Mathf.Clamp(_panOffset.z + worldDelta.y, -_panHalfZ, _panHalfZ);
        }

        /// <summary>
        /// Multiplies the zoom factor. Values > 1 zoom out; < 1 zoom in.
        /// Clamped to [ZoomMin, ZoomMax].
        /// </summary>
        public void ZoomBy(float factor)
        {
            _zoomFactor = Mathf.Clamp(_zoomFactor * factor, ZoomMin, ZoomMax);
        }

        public void FocusWorld(Vector3 worldPoint)
        {
            _focusing = true;
            _focusPoint = worldPoint;
            if (is2DMode)
            {
                // User requested a "fixed" map - do not pan the camera to the selection!
                // Panning while showing a tooltip makes the map feel like it's "floating".
                return;
            }
            _targetPos = worldPoint + focusOffset;
            _targetRot = Quaternion.LookRotation(worldPoint - _targetPos, Vector3.up);
            SetFov(Mathf.Lerp(GetFov(), _baseFov - 3.5f, 0.7f));
            if (RenderSettings.fog)
            {
                RenderSettings.fogDensity = Mathf.Lerp(RenderSettings.fogDensity, focusFogDensity, 0.35f);
            }
        }

        public void ResetFocus()
        {
            _focusing  = false;
            _panOffset = Vector3.zero;
            _zoomFactor = 1f;
            if (is2DMode)
            {
                // In 2D mode, targetPos is the framed position calculated in FrameBoard.
                // ResetFocus should return there.
                _targetPos = new Vector3(-0.5f, 30f, -3.2f);
                return;
            }
            _targetPos = frameOffset;
            _targetRot = Quaternion.LookRotation(Vector3.zero - _targetPos, Vector3.up);
            SetFov(_baseFov);
            RenderSettings.fog = false; // keep fog off for clean map read
        }

        /// <summary>
        /// EXECUTE camera punch — Cinemachine ImpulseDefinition when available, plus a short FOV kick.
        /// </summary>
        public void Punch(float intensity = 0.35f)
        {
            intensity = Mathf.Clamp(intensity, 0.05f, 2.5f);
#if GENESIS_CINEMACHINE
            if (_impulse == null) EnsureCinemachineStack();
            if (_impulse != null)
            {
                _impulse.GenerateImpulseWithVelocity(
                    new Vector3(0f, -0.08f, 0.28f) * intensity);
            }
#endif
            if (isActiveAndEnabled)
            {
                StartCoroutine(PunchRoutine(intensity));
            }
        }

        System.Collections.IEnumerator PunchRoutine(float intensity)
        {
            var t = 0f;
            var origin = GetFov();
            while (t < 0.38f)
            {
                t += Time.deltaTime;
                var kick = Mathf.Sin(t / 0.38f * Mathf.PI) * intensity * punchFovKick;
                SetFov(origin - kick);
                yield return null;
            }

            SetFov(origin);
        }

        float GetFov()
        {
#if GENESIS_CINEMACHINE
            if (_vcam != null) return _vcam.Lens.FieldOfView;
#endif
            return cam != null ? cam.fieldOfView : _baseFov;
        }

        void SetFov(float fov)
        {
#if GENESIS_CINEMACHINE
            if (_vcam != null)
            {
                var lens = _vcam.Lens;
                lens.FieldOfView = fov;
                _vcam.Lens = lens;
            }
#endif
            if (cam != null) cam.fieldOfView = fov;
        }
    }
}
