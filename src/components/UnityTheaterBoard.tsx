import { useEffect, useMemo, useRef } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import { GLView, type ExpoWebGLRenderingContext } from 'expo-gl';
import * as THREE from 'three';
import type { Choice } from '@/data/scenarios';
import type { TheaterDef } from '@/data/theaters';
import { displayOpLabel } from '@/lib/layoutBoardNodes';
import { geoForScenario, geoForTheaterId } from '@/maps/geoAtlas';
import { loadTerrainHtmlImage, paintGeoCanvas } from '@/maps/paintGeoTexture';
import { colors, fonts, radii } from '@/theme/colors';

export type MapOp = {
  choice: Choice;
  markerId: string;
  short: string;
  kind: string;
};

type Props = {
  theater: TheaterDef;
  height?: number;
  availableOps?: MapOp[];
  selectedChoiceId?: string | null;
  onSelectOp?: (op: MapOp) => void;
  locked?: boolean;
  phaseKey?: string | number;
  urgency?: number;
  pressure?: number;
  commitFlash?: boolean;
  timerSeconds?: number;
  objectiveLine?: string;
};

const KIND_COLOR: Record<string, number> = {
  naval: 0x2a8a92,
  diplomatic: 0xb8882e,
  economic: 0x8a7a4a,
  kinetic: 0xb84a2a,
  political: 0x2e7a6a,
  legal: 0x4a7588,
  civic: 0x4a7a50,
};

const KIND_HEX: Record<string, string> = {
  naval: '#2EE6C8',
  diplomatic: '#FFB84D',
  economic: '#C4A878',
  kinetic: '#FF6B4A',
  political: '#2EE6C8',
  legal: '#8EB4C8',
  civic: '#9BC49A',
};

/** Near-overhead framing so coasts read as geography (not abstract tilt). */
const CAM = { y: 11.6, z: 1.15, fov: 36, lookY: 0 };
const MAP_SIZE = 11.8;
const OPS_RAIL_H = 132;

type Patrol = {
  mesh: THREE.Group;
  homeX: number;
  homeZ: number;
  phase: number;
  radius: number;
  speed: number;
};

type ShockRing = {
  mesh: THREE.Mesh;
  born: number;
  life: number;
};

/**
 * Dynamic thriller ops board (expo-gl + three).
 * - Full-bleed map stage with animated units, fog, focus lighting
 * - Camera + world react on select / EXECUTE
 * - Orders rail BELOW the map — never overlays geography (India-safe)
 */
export function UnityTheaterBoard({
  theater,
  height = 540,
  availableOps = [],
  selectedChoiceId,
  onSelectOp,
  locked = false,
  phaseKey,
  urgency = 0,
  pressure = 40,
  commitFlash = false,
  timerSeconds = 30,
  objectiveLine,
}: Props) {
  const sceneRef = useRef<{
    renderer?: THREE.WebGLRenderer;
    scene?: THREE.Scene;
    camera?: THREE.PerspectiveCamera;
    beacons: Map<string, THREE.Object3D>;
    rings: Map<string, THREE.Mesh>;
    focusHalos: Map<string, THREE.Mesh>;
    raycaster: THREE.Raycaster;
    pointer: THREE.Vector2;
    frame?: number;
    gl?: ExpoWebGLRenderingContext;
    boardSize: { w: number; h: number };
    flashLight?: THREE.PointLight;
    keyLight?: THREE.DirectionalLight;
    rimLight?: THREE.DirectionalLight;
    mapMat?: THREE.MeshStandardMaterial;
    fogPlane?: THREE.Mesh;
    pressureDome?: THREE.Mesh;
    patrols: Patrol[];
    shocks: ShockRing[];
    focusTarget: { x: number; z: number } | null;
    camOffset: { x: number; y: number; z: number };
    lastFlash: boolean;
  }>({
    beacons: new Map(),
    rings: new Map(),
    focusHalos: new Map(),
    raycaster: new THREE.Raycaster(),
    pointer: new THREE.Vector2(),
    boardSize: { w: 1, h: 1 },
    patrols: [],
    shocks: [],
    focusTarget: null,
    camOffset: { x: 0, y: 0, z: 0 },
    lastFlash: false,
  });

  const opsRef = useRef(availableOps);
  opsRef.current = availableOps;
  const selectedRef = useRef(selectedChoiceId);
  selectedRef.current = selectedChoiceId;
  const lockedRef = useRef(locked);
  lockedRef.current = locked;
  const urgencyRef = useRef(urgency);
  urgencyRef.current = urgency;
  const pressureRef = useRef(pressure);
  pressureRef.current = pressure;
  const flashRef = useRef(commitFlash);
  flashRef.current = commitFlash;

  const geo = useMemo(() => {
    if (theater.scenarioId) return geoForScenario(theater.scenarioId);
    return geoForTheaterId(theater.id);
  }, [theater.scenarioId, theater.id]);

  const markerById = useMemo(
    () => Object.fromEntries(theater.markers.map((m) => [m.id, m])),
    [theater.markers],
  );

  const selectOp = (op: MapOp) => {
    if (lockedRef.current) return;
    onSelectOp?.(op);
  };

  const toWorld = (xPct: number, yPct: number) => ({
    x: (xPct / 100) * MAP_SIZE - MAP_SIZE / 2,
    z: (yPct / 100) * MAP_SIZE - MAP_SIZE / 2,
  });

  const onContextCreate = async (gl: ExpoWebGLRenderingContext) => {
    const state = sceneRef.current;
    state.gl = gl;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x071018);
    scene.fog = new THREE.FogExp2(0x071018, 0.012);

    const camera = new THREE.PerspectiveCamera(
      CAM.fov,
      gl.drawingBufferWidth / Math.max(1, gl.drawingBufferHeight),
      0.1,
      100,
    );
    camera.position.set(0, CAM.y, CAM.z);
    camera.lookAt(0, CAM.lookY, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas: gl.canvas as unknown as HTMLCanvasElement,
      context: gl as unknown as WebGLRenderingContext,
      antialias: true,
      alpha: false,
    });
    renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    renderer.setPixelRatio(Math.min(2, typeof window !== 'undefined' ? window.devicePixelRatio : 1));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.32;

    scene.add(new THREE.HemisphereLight(0xb8d0e8, 0x1a1208, 0.55));

    const key = new THREE.DirectionalLight(0xffe0a8, 1.7);
    key.position.set(3.5, 12, 4);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    scene.add(key);
    state.keyLight = key;

    const rim = new THREE.DirectionalLight(0x5a90b8, 0.55);
    rim.position.set(-6, 5, -3);
    scene.add(rim);
    state.rimLight = rim;

    const flash = new THREE.PointLight(0xff6020, 0, 22, 2);
    flash.position.set(0, 3.2, 0);
    scene.add(flash);
    state.flashLight = flash;

    const half = MAP_SIZE / 2 + 0.35;
    const table = new THREE.Mesh(
      new THREE.BoxGeometry(MAP_SIZE + 0.7, 0.32, MAP_SIZE + 0.7),
      new THREE.MeshStandardMaterial({ color: 0x0a1016, roughness: 0.88, metalness: 0.08 }),
    );
    table.position.y = -0.26;
    table.receiveShadow = true;
    scene.add(table);

    let mapMat: THREE.MeshStandardMaterial;
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const terrainImg = await loadTerrainHtmlImage(theater);
      const canvas = paintGeoCanvas(geo, theater, 1400, terrainImg);
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 8;
      tex.needsUpdate = true;
      mapMat = new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.72,
        metalness: 0.05,
        emissive: new THREE.Color(0x0a1418),
        emissiveIntensity: 0.22,
      });
    } else {
      mapMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(geo.land),
        roughness: 0.85,
        metalness: 0.05,
      });
    }
    state.mapMat = mapMat;

    const mapMesh = new THREE.Mesh(new THREE.PlaneGeometry(MAP_SIZE, MAP_SIZE), mapMat);
    mapMesh.rotation.x = -Math.PI / 2;
    mapMesh.receiveShadow = true;
    mapMesh.position.y = 0.02;
    scene.add(mapMesh);

    // Atmospheric fog sheet — thickens with urgency/pressure
    const fogMat = new THREE.MeshStandardMaterial({
      color: 0x0c2030,
      transparent: true,
      opacity: 0.12,
      depthWrite: false,
      roughness: 1,
      metalness: 0,
    });
    const fogPlane = new THREE.Mesh(new THREE.PlaneGeometry(MAP_SIZE * 1.05, MAP_SIZE * 1.05), fogMat);
    fogPlane.rotation.x = -Math.PI / 2;
    fogPlane.position.y = 0.55;
    scene.add(fogPlane);
    state.fogPlane = fogPlane;

    // Pressure dome — subtle volumetric cue over hot theater
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(MAP_SIZE * 0.42, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.45),
      new THREE.MeshStandardMaterial({
        color: 0xff6b4a,
        emissive: 0xff6b4a,
        emissiveIntensity: 0.15,
        transparent: true,
        opacity: 0.04,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    dome.position.y = 0.2;
    scene.add(dome);
    state.pressureDome = dome;

    const railMat = new THREE.MeshStandardMaterial({
      color: 0xd4a04a,
      metalness: 0.65,
      roughness: 0.28,
      emissive: 0x3a2808,
      emissiveIntensity: 0.3,
    });
    const mkRail = (w: number, d: number, x: number, z: number) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, 0.12, d), railMat);
      m.position.set(x, 0.06, z);
      m.castShadow = true;
      scene.add(m);
    };
    mkRail(MAP_SIZE + 0.35, 0.11, 0, -half);
    mkRail(MAP_SIZE + 0.35, 0.11, 0, half);
    mkRail(0.11, MAP_SIZE + 0.35, -half, 0);
    mkRail(0.11, MAP_SIZE + 0.35, half, 0);

    // Idle patrol units — world feels alive even before select
    state.patrols = [];
    for (let i = 0; i < 5; i++) {
      const g = new THREE.Group();
      const hull = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.06, 0.28),
        new THREE.MeshStandardMaterial({
          color: 0x2a3848,
          metalness: 0.5,
          roughness: 0.4,
          emissive: 0x1a4050,
          emissiveIntensity: 0.4,
        }),
      );
      hull.castShadow = true;
      g.add(hull);
      const tip = new THREE.Mesh(
        new THREE.ConeGeometry(0.06, 0.14, 6),
        new THREE.MeshStandardMaterial({
          color: 0x2ee6c8,
          emissive: 0x2ee6c8,
          emissiveIntensity: 0.7,
        }),
      );
      tip.rotation.x = Math.PI / 2;
      tip.position.z = 0.18;
      g.add(tip);
      const hx = (Math.random() - 0.5) * MAP_SIZE * 0.7;
      const hz = (Math.random() - 0.5) * MAP_SIZE * 0.7;
      g.position.set(hx, 0.12, hz);
      scene.add(g);
      state.patrols.push({
        mesh: g,
        homeX: hx,
        homeZ: hz,
        phase: Math.random() * Math.PI * 2,
        radius: 0.55 + Math.random() * 0.9,
        speed: 0.35 + Math.random() * 0.45,
      });
    }

    state.renderer = renderer;
    state.scene = scene;
    state.camera = camera;

    const animate = () => {
      state.frame = requestAnimationFrame(animate);
      const t = performance.now() * 0.001;
      const urg = urgencyRef.current;
      const press = pressureRef.current / 100;
      const selId = selectedRef.current;
      const flashing = flashRef.current;

      // Spawn shockwave once per EXECUTE flash edge
      if (flashing && !state.lastFlash) {
        const focus = state.focusTarget ?? { x: 0, z: 0 };
        for (let i = 0; i < 3; i++) {
          const ring = new THREE.Mesh(
            new THREE.TorusGeometry(0.4 + i * 0.15, 0.035, 8, 48),
            new THREE.MeshStandardMaterial({
              color: 0xff6b4a,
              emissive: 0xff6b4a,
              emissiveIntensity: 1.6,
              transparent: true,
              opacity: 0.9,
              depthWrite: false,
            }),
          );
          ring.rotation.x = Math.PI / 2;
          ring.position.set(focus.x, 0.08 + i * 0.04, focus.z);
          scene.add(ring);
          state.shocks.push({ mesh: ring, born: t, life: 1.1 + i * 0.15 });
        }
        if (state.flashLight) {
          state.flashLight.position.set(focus.x, 3.2, focus.z);
        }
      }
      state.lastFlash = flashing;

      // Shockwave expand + fade
      state.shocks = state.shocks.filter((s) => {
        const age = t - s.born;
        const u = age / s.life;
        if (u >= 1) {
          scene.remove(s.mesh);
          (s.mesh.geometry as THREE.BufferGeometry).dispose();
          (s.mesh.material as THREE.Material).dispose();
          return false;
        }
        const scale = 1 + u * 6.5;
        s.mesh.scale.setScalar(scale);
        const mat = s.mesh.material as THREE.MeshStandardMaterial;
        mat.opacity = 0.85 * (1 - u);
        mat.emissiveIntensity = 1.4 * (1 - u);
        return true;
      });

      // Camera: idle drift + focus lerp toward selected hotspot
      const target = state.focusTarget;
      const wantX = target ? target.x * 0.22 : 0;
      const wantZ = target ? CAM.z + target.z * 0.08 : CAM.z;
      const wantY = target ? CAM.y - 0.55 : CAM.y;
      const punch = flashing ? Math.sin(t * 38) * 0.12 : 0;
      state.camOffset.x += (wantX - state.camOffset.x) * 0.06;
      state.camOffset.y += (wantY + punch - state.camOffset.y) * 0.06;
      state.camOffset.z += (wantZ - state.camOffset.z) * 0.06;
      camera.position.x = state.camOffset.x + Math.sin(t * 0.11) * 0.06;
      camera.position.y = state.camOffset.y + Math.sin(t * 0.13) * 0.03;
      camera.position.z = state.camOffset.z;
      const lookX = target ? target.x * 0.35 : 0;
      const lookZ = target ? target.z * 0.35 : 0;
      camera.lookAt(lookX, CAM.lookY, lookZ);

      if (state.keyLight) {
        state.keyLight.intensity = 1.55 + urg * 0.45 + (flashing ? 1.2 : 0);
        if (target) {
          state.keyLight.position.x = 3.5 + target.x * 0.15;
          state.keyLight.position.z = 4 + target.z * 0.15;
        }
      }
      if (state.rimLight) {
        state.rimLight.intensity = 0.45 + urg * 0.35;
        state.rimLight.color.setHex(urg > 0.6 ? 0xff6b4a : 0x5a90b8);
      }
      if (state.mapMat) {
        state.mapMat.emissiveIntensity = 0.22 + urg * 0.14 + press * 0.08;
      }
      if (state.flashLight) {
        if (flashing) state.flashLight.intensity = 8 + Math.sin(t * 40) * 2.5;
        else state.flashLight.intensity *= 0.86;
      }
      if (state.fogPlane) {
        const mat = state.fogPlane.material as THREE.MeshStandardMaterial;
        mat.opacity = 0.08 + urg * 0.18 + press * 0.1;
        state.fogPlane.position.y = 0.45 + Math.sin(t * 0.4) * 0.04;
      }
      if (state.pressureDome) {
        const mat = state.pressureDome.material as THREE.MeshStandardMaterial;
        mat.opacity = 0.02 + press * 0.12 + urg * 0.06;
        mat.emissiveIntensity = 0.1 + press * 0.55;
        state.pressureDome.rotation.y = t * 0.08;
      }
      if (scene.fog && scene.fog instanceof THREE.FogExp2) {
        scene.fog.density = 0.01 + urg * 0.012 + (flashing ? 0.008 : 0);
      }

      // Patrol units orbit / react to flash
      for (const p of state.patrols) {
        const ang = t * p.speed + p.phase;
        const rx = p.homeX + Math.cos(ang) * p.radius;
        const rz = p.homeZ + Math.sin(ang) * p.radius;
        p.mesh.position.x = rx;
        p.mesh.position.z = rz;
        p.mesh.position.y = flashing ? 0.22 + Math.sin(t * 20) * 0.04 : 0.12;
        p.mesh.rotation.y = -ang + Math.PI / 2;
        if (target) {
          const dx = target.x - rx;
          const dz = target.z - rz;
          if (Math.hypot(dx, dz) < 2.2) {
            p.mesh.position.y += 0.06;
          }
        }
      }

      for (const [id, obj] of state.beacons) {
        const sel = selId === id;
        const dim = selId && !sel && !flashing;
        obj.position.y = sel ? 0.12 + Math.sin(t * 5.5) * 0.04 : 0.05;
        obj.rotation.y = t * (sel ? 1.35 : 0.22);
        obj.visible = true;
        obj.scale.setScalar(sel ? 1.15 : dim ? 0.82 : 1);
        const beam = obj.getObjectByName('beam') as THREE.Mesh | undefined;
        if (beam) {
          const mat = beam.material as THREE.MeshStandardMaterial;
          mat.opacity = sel ? 0.38 : dim ? 0.04 : 0.1 + Math.sin(t * 3) * 0.03;
          mat.emissiveIntensity = sel ? 0.95 : 0.22;
        }
        if (flashing && sel) {
          obj.scale.setScalar(1.35 + Math.sin(t * 28) * 0.08);
        }
      }
      for (const [id, ring] of state.rings) {
        const sel = selId === id;
        const dim = selId && !sel;
        ring.scale.setScalar(sel ? 1.28 + Math.sin(t * 4.2) * 0.06 : dim ? 0.85 : 1 + Math.sin(t * 2) * 0.03);
        const mat = ring.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = sel ? 1.65 : dim ? 0.15 : 0.4 + Math.sin(t * 3) * 0.12;
        mat.opacity = dim ? 0.35 : 0.88;
      }
      for (const [id, halo] of state.focusHalos) {
        const sel = selId === id;
        halo.visible = !!sel || flashing;
        if (sel) {
          halo.scale.setScalar(1.4 + Math.sin(t * 3.5) * 0.12);
          const mat = halo.material as THREE.MeshStandardMaterial;
          mat.opacity = 0.22 + Math.sin(t * 4) * 0.06;
        }
      }

      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    animate();
  };

  // Sync camera focus target when selection changes
  useEffect(() => {
    const state = sceneRef.current;
    if (!selectedChoiceId) {
      state.focusTarget = null;
      return;
    }
    const op = availableOps.find((o) => o.choice.id === selectedChoiceId);
    if (!op) {
      state.focusTarget = null;
      return;
    }
    const marker = markerById[op.markerId];
    state.focusTarget = toWorld(marker?.x ?? 50, marker?.y ?? 50);
  }, [selectedChoiceId, availableOps, markerById]);

  // Compact pins at geographic anchors + focus halos
  useEffect(() => {
    const state = sceneRef.current;
    const scene = state.scene;
    if (!scene) return;

    for (const obj of state.beacons.values()) scene.remove(obj);
    for (const obj of state.rings.values()) scene.remove(obj);
    for (const obj of state.focusHalos.values()) scene.remove(obj);
    state.beacons.clear();
    state.rings.clear();
    state.focusHalos.clear();

    availableOps.forEach((op) => {
      const marker = markerById[op.markerId];
      const xPct = marker?.x ?? 50;
      const yPct = marker?.y ?? 50;
      const { x, z } = toWorld(xPct, yPct);
      const color = KIND_COLOR[op.kind] ?? 0x2e7a6a;

      const group = new THREE.Group();
      group.position.set(x, 0.05, z);
      group.userData = { choiceId: op.choice.id, kind: 'beacon' };

      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.28, 0.08, 16),
        new THREE.MeshStandardMaterial({
          color: 0x1a1814,
          metalness: 0.45,
          roughness: 0.35,
          emissive: color,
          emissiveIntensity: 0.4,
        }),
      );
      base.castShadow = true;
      group.add(base);

      const pillar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.1, 0.55, 10),
        new THREE.MeshStandardMaterial({
          color,
          metalness: 0.4,
          roughness: 0.3,
          emissive: color,
          emissiveIntensity: 0.9,
        }),
      );
      pillar.position.y = 0.3;
      pillar.castShadow = true;
      group.add(pillar);

      const beam = new THREE.Mesh(
        new THREE.ConeGeometry(0.22, 1.05, 16, 1, true),
        new THREE.MeshStandardMaterial({
          color,
          emissive: color,
          emissiveIntensity: 0.4,
          transparent: true,
          opacity: 0.14,
          side: THREE.DoubleSide,
          depthWrite: false,
        }),
      );
      beam.name = 'beam';
      beam.position.y = 1.15;
      beam.rotation.x = Math.PI;
      group.add(beam);

      const jewel = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.11, 0),
        new THREE.MeshStandardMaterial({
          color: 0xffe8a0,
          emissive: 0xffc040,
          emissiveIntensity: 1.2,
          metalness: 0.7,
          roughness: 0.2,
        }),
      );
      jewel.position.y = 0.58;
      group.add(jewel);

      scene.add(group);
      state.beacons.set(op.choice.id, group);

      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.38, 0.03, 8, 32),
        new THREE.MeshStandardMaterial({
          color,
          emissive: color,
          emissiveIntensity: 0.55,
          transparent: true,
          opacity: 0.88,
        }),
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.set(x, 0.045, z);
      ring.userData = { choiceId: op.choice.id, kind: 'ring' };
      scene.add(ring);
      state.rings.set(op.choice.id, ring);

      const halo = new THREE.Mesh(
        new THREE.CircleGeometry(0.85, 32),
        new THREE.MeshStandardMaterial({
          color,
          emissive: color,
          emissiveIntensity: 0.8,
          transparent: true,
          opacity: 0.2,
          side: THREE.DoubleSide,
          depthWrite: false,
        }),
      );
      halo.rotation.x = -Math.PI / 2;
      halo.position.set(x, 0.035, z);
      halo.visible = false;
      scene.add(halo);
      state.focusHalos.set(op.choice.id, halo);
    });
  }, [availableOps, phaseKey, theater.id, markerById]);

  useEffect(() => {
    return () => {
      const state = sceneRef.current;
      if (state.frame) cancelAnimationFrame(state.frame);
      state.renderer?.dispose();
    };
  }, []);

  const handleTap = (locationX: number, locationY: number) => {
    const state = sceneRef.current;
    if (!state.camera || !state.scene || lockedRef.current) return;
    const { w, h } = state.boardSize;
    if (w < 1 || h < 1) return;
    state.pointer.x = (locationX / w) * 2 - 1;
    state.pointer.y = -(locationY / h) * 2 + 1;
    state.raycaster.setFromCamera(state.pointer, state.camera);
    const targets = [...state.beacons.values(), ...state.rings.values()];
    const hits = state.raycaster.intersectObjects(targets, true);
    if (!hits.length) return;
    let obj: THREE.Object3D | null = hits[0].object;
    while (obj && !obj.userData?.choiceId) obj = obj.parent;
    const id = obj?.userData?.choiceId as string | undefined;
    if (!id) return;
    const op = opsRef.current.find((o) => o.choice.id === id);
    if (op) selectOp(op);
  };

  const onMapLayout = (e: LayoutChangeEvent) => {
    const { width, height: h } = e.nativeEvent.layout;
    sceneRef.current.boardSize = { w: width, h };
    const cam = sceneRef.current.camera;
    const ren = sceneRef.current.renderer;
    const gl = sceneRef.current.gl;
    if (cam && ren && gl) {
      cam.aspect = width / Math.max(1, h);
      cam.updateProjectionMatrix();
      ren.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
    }
  };

  const selected = availableOps.find((o) => o.choice.id === selectedChoiceId);
  const mapH = Math.max(240, height - OPS_RAIL_H);
  const pressPct = Math.max(0, Math.min(100, Math.round(pressure)));
  const critical = timerSeconds <= 10 || urgency > 0.7;

  return (
    <View style={[styles.wrap, { height }]} nativeID="interactive-theater-map">
      {/* 3D map only — no order tiles on this pane */}
      <View style={[styles.mapStage, { height: mapH }]} onLayout={onMapLayout}>
        <GLView style={styles.gl} onContextCreate={onContextCreate} />
        <Pressable
          style={StyleSheet.absoluteFill}
          disabled={locked}
          onPress={(e) => {
            const { locationX, locationY } = e.nativeEvent;
            handleTap(locationX, locationY);
          }}
        />

        {/* Cinematic objective ribbon — not a quiz prompt */}
        <View style={[styles.objRibbon, critical && styles.objRibbonHot]} pointerEvents="none">
          <Text style={styles.objKicker}>{geo.label.toUpperCase()} · LIVE THEATER</Text>
          <Text style={styles.objLine} numberOfLines={2}>
            {objectiveLine?.trim()
              ? objectiveLine.trim().toUpperCase()
              : selected
                ? `TARGET LOCK · ${selected.short.toUpperCase()} — AUTHORIZE BELOW`
                : critical
                  ? 'WINDOW CRITICAL — SELECT AN ORDER'
                  : 'SELECT A HOTSPOT OR ORDER BELOW'}
          </Text>
        </View>

        {/* Stakes / pressure strip — meters on the world, not pros/cons */}
        <View style={styles.stakesBar} pointerEvents="none" nativeID="board-stakes">
          <View style={styles.stakesMeta}>
            <Text style={styles.stakesKey}>PRESSURE</Text>
            <Text
              style={[
                styles.stakesVal,
                {
                  color:
                    pressPct >= 70
                      ? colors.alert
                      : pressPct >= 45
                        ? colors.amberHot
                        : colors.cyanHot,
                },
              ]}
            >
              {pressPct}
            </Text>
          </View>
          <View style={styles.stakesTrack}>
            <View
              style={[
                styles.stakesFill,
                {
                  width: `${pressPct}%`,
                  backgroundColor:
                    pressPct >= 70
                      ? colors.alert
                      : pressPct >= 45
                        ? colors.amber
                        : colors.cyan,
                },
              ]}
            />
          </View>
          <Text style={styles.stakesHint}>
            {commitFlash
              ? 'WORLD REACTING'
              : selected
                ? 'ORDER ARMED'
                : 'AWAITING ORDER'}
          </Text>
        </View>
      </View>

      {/* Orders rail OUTSIDE the 3D map — flex row = zero overlap */}
      <View style={styles.opsRail} nativeID="ops-rail">
        <Text style={styles.railLabel}>AVAILABLE ORDERS</Text>
        <View style={styles.railRow}>
          {availableOps.map((op) => {
            const on = selectedChoiceId === op.choice.id;
            const accent = KIND_HEX[op.kind] ?? colors.cyan;
            const place = markerById[op.markerId]?.label ?? op.markerId;
            return (
              <Pressable
                key={op.choice.id}
                disabled={locked}
                onPress={() => selectOp(op)}
                style={[
                  styles.railTile,
                  { borderLeftColor: on ? colors.amberHot : accent },
                  on && styles.railTileOn,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Order ${op.short}: ${op.choice.label}`}
              >
                <View style={styles.railHead}>
                  <Text style={[styles.objCode, { color: on ? colors.amberHot : accent }]}>
                    {op.short.toUpperCase()}
                  </Text>
                  <Text style={[styles.objCue, on && styles.objCueOn]}>
                    {on ? 'ARMED' : 'ENGAGE'}
                  </Text>
                </View>
                <Text style={styles.objKind}>
                  {(op.kind ?? 'op').toUpperCase()} · {place.toUpperCase()}
                </Text>
                <Text style={styles.objTitle} numberOfLines={2}>
                  {displayOpLabel(op.short, op.choice.label)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

/** Runtime helper for tests / capture scripts */
export function assertOpsRailNonOverlap(boxes: { x: number; y: number; w: number; h: number }[]) {
  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i];
      const b = boxes[j];
      const ox = a.x < b.x + b.w && a.x + a.w > b.x;
      const oy = a.y < b.y + b.h && a.y + a.h > b.y;
      if (ox && oy) return false;
    }
  }
  return true;
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    borderRadius: radii.lg,
    overflow: 'hidden',
    backgroundColor: '#05070C',
    borderWidth: 1,
    borderColor: colors.lineCyan,
  },
  mapStage: {
    width: '100%',
    position: 'relative',
    backgroundColor: '#071018',
  },
  gl: { ...StyleSheet.absoluteFill },
  objRibbon: {
    position: 'absolute',
    top: 10,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(5,7,12,0.88)',
    borderWidth: 1,
    borderColor: colors.lineCyan,
    borderRadius: radii.sm,
    paddingVertical: 10,
    paddingHorizontal: 14,
    gap: 3,
    zIndex: 4,
  },
  objRibbonHot: {
    borderColor: colors.alert,
    backgroundColor: 'rgba(40,12,8,0.9)',
  },
  objKicker: {
    fontFamily: fonts.bodyMed,
    fontSize: 10,
    letterSpacing: 2,
    color: colors.cyan,
  },
  objLine: {
    fontFamily: fonts.displayMed,
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: 0.6,
    color: colors.chalk,
  },
  stakesBar: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(5,7,12,0.86)',
    borderWidth: 1,
    borderColor: colors.steelEdge,
    borderRadius: radii.sm,
    paddingVertical: 8,
    paddingHorizontal: 12,
    zIndex: 4,
  },
  stakesMeta: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  stakesKey: {
    fontFamily: fonts.bodyMed,
    fontSize: 9,
    letterSpacing: 1.6,
    color: colors.fog,
  },
  stakesVal: {
    fontFamily: fonts.display,
    fontSize: 18,
    lineHeight: 20,
  },
  stakesTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  stakesFill: {
    height: '100%',
    borderRadius: 3,
  },
  stakesHint: {
    fontFamily: fonts.bodyBold,
    fontSize: 9,
    letterSpacing: 1.4,
    color: colors.mist,
  },
  opsRail: {
    height: OPS_RAIL_H,
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 10,
    backgroundColor: 'rgba(6,10,18,0.99)',
    borderTopWidth: 1,
    borderTopColor: colors.lineCyan,
    gap: 6,
  },
  railLabel: {
    fontFamily: fonts.bodyMed,
    fontSize: 9,
    letterSpacing: 2,
    color: colors.goldInk,
    paddingHorizontal: 2,
  },
  railRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 8,
  },
  railTile: {
    flex: 1,
    minWidth: 0,
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderLeftWidth: 3,
    borderRadius: 0,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 2,
    justifyContent: 'center',
  },
  railTileOn: {
    borderWidth: 0,
    borderLeftWidth: 4,
    backgroundColor: 'rgba(255,184,77,0.08)',
  },
  railHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  objCode: {
    fontFamily: fonts.display,
    fontSize: 18,
    letterSpacing: 2,
  },
  objIdx: {
    fontFamily: fonts.bodyMed,
    fontSize: 9,
    letterSpacing: 1,
    color: colors.fog,
  },
  objKind: {
    fontFamily: fonts.bodyMed,
    fontSize: 10,
    letterSpacing: 1.2,
    color: colors.cyanHot,
  },
  objTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    lineHeight: 17,
    color: colors.chalk,
  },
  objCue: {
    marginTop: 4,
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 2.2,
    color: colors.cyanHot,
  },
  objCueOn: { color: colors.amberHot },
});
