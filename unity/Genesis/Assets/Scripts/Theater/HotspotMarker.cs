using Genesis.Data;
using UnityEngine;
using Genesis.UI;

namespace Genesis.Theater
{
    /// <summary>
    /// Tap target on the Living Atlas map board.
    /// Brass beacon pin: lit idle/selected materials + soft ground cone + pulse ring.
    /// Labels are driven by MapLabelOverlay (UI Toolkit) — no TextMesh here.
    /// </summary>
    [RequireComponent(typeof(SphereCollider))]
    public class HotspotMarker : MonoBehaviour
    {
        public MapMarker       Marker       { get; private set; }
        public bool            IsSelected   { get; private set; }
        public bool            LabelVisible { get; private set; } = true;
        public CityStressLevel Stress       => _stress;

        public Transform LabelRoot       => _labelRoot;
        public float     LabelHalfWidth  => 1.1f;
        public float     LabelHalfHeight => 0.28f;

        const float OutlineRadius  = 0.20f;
        const float DotRadius      = 0.13f;
        const float RingIdleRadius = 0.48f;
        const float RingSelRadius  = 0.82f;
        const float ConeIdleRadius = 0.55f;
        const float ConeSelRadius  = 0.95f;
        const float DiscHeight     = 0.01f;
        const float ColliderRadius = 1.2f;

        static readonly Color ColRingIdle     = new(0.77f, 0.64f, 0.35f, 0.32f);
        static readonly Color ColRingActive   = new(0.77f, 0.64f, 0.35f, 0.48f);
        static readonly Color ColRingSel      = new(0.85f, 0.72f, 0.40f, 0.88f);
        static readonly Color ColStressGreen  = new(0.25f, 0.72f, 0.48f, 1f);
        static readonly Color ColStressOrange = new(0.96f, 0.65f, 0.14f, 1f);
        static readonly Color ColStressRed    = new(0.90f, 0.33f, 0.29f, 1f);

        MeshRenderer    _dotRenderer;
        MeshRenderer    _ringRenderer;
        MeshRenderer    _coneRenderer;
        Transform       _beacon;
        Transform       _labelRoot;
        float           _moodUntil;
        Color           _moodTint = Color.clear;
        CityStressLevel _stress   = CityStressLevel.Calm;
        Material        _idleMat;
        Material        _selectedMat;
        Material        _ringMat;
        MaterialPropertyBlock _mpb;
        static readonly int BaseColorId = Shader.PropertyToID("_BaseColor");
        static readonly int ColorId = Shader.PropertyToID("_Color");

        public void Initialize(MapMarker marker, Material idle, Material selected)
        {
            Marker = marker;
            _idleMat = idle != null ? idle : TheaterMaterialFactory.BeaconIdle();
            _selectedMat = selected != null ? selected : TheaterMaterialFactory.BeaconSelected();
            SetupCollider();
            BuildVisuals();

            var lr = new GameObject("LabelRoot");
            _labelRoot = lr.transform;
            _labelRoot.SetParent(transform, false);

            SetSelected(false);
        }

        void SetupCollider()
        {
            var sc = GetComponent<SphereCollider>();
            if (sc == null) sc = gameObject.AddComponent<SphereCollider>();
            sc.radius  = ColliderRadius;
            sc.center  = new Vector3(0f, 0.05f, 0f);
            sc.isTrigger = false;
        }

        void BuildVisuals()
        {
            // Named "Beacon" so WorldReactionFX.BeaconSettle finds it.
            var beaconGo = new GameObject("Beacon");
            _beacon = beaconGo.transform;
            _beacon.SetParent(transform, false);

            SpawnDisc(_beacon, "Outline", OutlineRadius, DiscHeight, 0.000f,
                TheaterMaterialFactory.Unlit(new Color(0.04f, 0.07f, 0.12f, 0.92f), "PinOutline"), out _);
            SpawnDisc(_beacon, "Dot", DotRadius, DiscHeight * 1.6f, 0.004f, _idleMat, out _dotRenderer);
            _ringMat = TheaterMaterialFactory.Unlit(ColRingIdle, "PinRing");
            SpawnDisc(_beacon, "Ring", RingIdleRadius, DiscHeight * 0.5f, -0.002f,
                _ringMat, out _ringRenderer);
            _mpb = new MaterialPropertyBlock();

            // Soft ground wash — selected pins cast a brass cone read on the desk.
            var cone = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            cone.name = "Cone";
            cone.transform.SetParent(_beacon, false);
            cone.transform.localPosition = new Vector3(0f, -0.006f, 0f);
            cone.transform.localScale = new Vector3(ConeIdleRadius * 2f, DiscHeight * 0.35f, ConeIdleRadius * 2f);
            Object.Destroy(cone.GetComponent<Collider>());
            _coneRenderer = cone.GetComponent<MeshRenderer>();
            if (_coneRenderer != null)
            {
                _coneRenderer.sharedMaterial = TheaterMaterialFactory.BeaconCone(false);
                _coneRenderer.shadowCastingMode = UnityEngine.Rendering.ShadowCastingMode.Off;
                _coneRenderer.receiveShadows = false;
            }
        }

        static void SpawnDisc(Transform parent, string goName, float radius, float height, float yOff,
                              Material mat, out MeshRenderer mr)
        {
            var go = GameObject.CreatePrimitive(PrimitiveType.Cylinder);
            go.name = goName;
            go.transform.SetParent(parent, false);
            go.transform.localPosition = new Vector3(0f, yOff, 0f);
            go.transform.localScale    = new Vector3(radius * 2f, height, radius * 2f);
            var c = go.GetComponent<Collider>();
            if (c != null) Object.Destroy(c);
            mr = go.GetComponent<MeshRenderer>();
            if (mr != null)
            {
                mr.sharedMaterial    = mat;
                mr.shadowCastingMode = UnityEngine.Rendering.ShadowCastingMode.Off;
                mr.receiveShadows    = false;
            }
        }

        public void ApplyLabelLocalOffset(Vector3 localOffset) { }

        public void PulseMood(Color tint, float seconds = 1.05f)
        {
            _moodTint  = tint;
            _moodUntil = Time.time + Mathf.Max(0.2f, seconds);
            if (_dotRenderer != null)
            {
                _dotRenderer.sharedMaterial = TheaterMaterialFactory.Lit(
                    new Color(tint.r, tint.g, tint.b, 1f),
                    metallic: 0.55f,
                    smoothness: 0.45f,
                    emission: tint * 0.35f);
            }

            if (_ringRenderer != null)
                SetRingColor(new Color(tint.r, tint.g, tint.b, 0.7f));
        }

        public void SetStress(CityStressLevel level)
        {
            _stress = level;
            if (!IsSelected) ApplyDotMaterial();
        }

        public void SetLabelVisible(bool visible)
        {
            LabelVisible = visible;
            if (_labelRoot != null) _labelRoot.gameObject.SetActive(visible);
        }

        public void SetSelected(bool selected)
        {
            IsSelected = selected;
            ApplyDotMaterial();

            if (_ringRenderer != null)
            {
                var r = selected ? RingSelRadius : RingIdleRadius;
                _ringRenderer.transform.localScale = new Vector3(r * 2f, DiscHeight * 0.5f, r * 2f);
                SetRingColor(selected ? ColRingSel : ColRingIdle);
            }

            if (_coneRenderer != null)
            {
                var cr = selected ? ConeSelRadius : ConeIdleRadius;
                _coneRenderer.transform.localScale = new Vector3(cr * 2f, DiscHeight * 0.35f, cr * 2f);
                _coneRenderer.sharedMaterial = TheaterMaterialFactory.BeaconCone(selected);
            }
        }

        void ApplyDotMaterial()
        {
            if (_dotRenderer == null) return;
            if (IsSelected)
            {
                _dotRenderer.sharedMaterial = _selectedMat != null
                    ? _selectedMat
                    : TheaterMaterialFactory.BeaconSelected();
                return;
            }

            if (_stress == CityStressLevel.Calm)
            {
                _dotRenderer.sharedMaterial = _idleMat != null
                    ? _idleMat
                    : TheaterMaterialFactory.BeaconIdle();
                return;
            }

            Color col = _stress == CityStressLevel.Secure   ? ColStressGreen
                      : _stress == CityStressLevel.Strained ? ColStressOrange
                      : ColStressRed;
            _dotRenderer.sharedMaterial = TheaterMaterialFactory.Lit(
                col, metallic: 0.55f, smoothness: 0.4f, emission: col * 0.2f);
        }

        void Update()
        {
            if (_ringRenderer == null) return;

            if (_moodTint.a > 0.01f && Time.time >= _moodUntil)
            {
                _moodTint = Color.clear;
                ApplyDotMaterial();
            }

            var mood   = _moodTint.a > 0.01f;
            // Restrained pulse — readable selection without constant neon throb.
            var pulse  = Mathf.Sin(Time.time * (IsSelected ? 2.8f : 1.6f)) * 0.5f + 0.5f;
            var baseR  = IsSelected ? RingSelRadius : RingIdleRadius;
            var pulsedR = baseR * (1f + pulse * (IsSelected ? 0.12f : 0.06f));
            _ringRenderer.transform.localScale = new Vector3(pulsedR * 2f, DiscHeight * 0.5f, pulsedR * 2f);

            var baseCol = mood ? new Color(_moodTint.r, _moodTint.g, _moodTint.b, 0.70f)
                               : (IsSelected ? ColRingSel : ColRingActive);
            var a = IsSelected ? Mathf.Lerp(0.70f, 0.92f, pulse)
                               : Mathf.Lerp(0.28f, 0.48f, pulse);
            SetRingColor(new Color(baseCol.r, baseCol.g, baseCol.b, a));
        }

        void SetRingColor(Color c)
        {
            if (_ringRenderer == null) return;
            if (_ringMat == null)
            {
                _ringMat = TheaterMaterialFactory.Unlit(c, "PinRing");
                _ringRenderer.sharedMaterial = _ringMat;
            }

            _mpb ??= new MaterialPropertyBlock();
            _ringRenderer.GetPropertyBlock(_mpb);
            _mpb.SetColor(BaseColorId, c);
            _mpb.SetColor(ColorId, c);
            _ringRenderer.SetPropertyBlock(_mpb);
        }

        void OnMouseDown()
        {
            if (FindAnyObjectByType<BoardPointerInput>() != null) return;
            TheaterSession.Instance?.OnHotspotTapped(this);
        }
    }
}
