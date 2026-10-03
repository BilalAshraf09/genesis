/**
 * Professional ops-map painter: terrain underlay + readable coasts, cities, borders.
 * Produces a Three.js CanvasTexture source that looks like a modern strategy HUD map.
 */
import type { GeoRegion, GeoPoint } from '@/maps/geoAtlas';
import type { TheaterDef } from '@/data/theaters';
import { Image as RNImage } from 'react-native';
import { resolveMapArchetype, terrainSource } from '@/maps/terrainAssets';

function polyPath(ctx: CanvasRenderingContext2D, pts: GeoPoint[], w: number, h: number) {
  if (!pts.length) return;
  ctx.beginPath();
  ctx.moveTo((pts[0][0] / 100) * w, (pts[0][1] / 100) * h);
  for (let i = 1; i < pts.length; i++) {
    ctx.lineTo((pts[i][0] / 100) * w, (pts[i][1] / 100) * h);
  }
  ctx.closePath();
}

/** Resolve metro asset URI for an HTMLImageElement. */
export function terrainImageUri(theater: TheaterDef): string | null {
  try {
    const src = terrainSource(theater);
    const resolved = RNImage.resolveAssetSource(src as number);
    if (resolved?.uri) return resolved.uri;
  } catch {
    // fall through
  }
  // Expo web metro fallback — matches /assets/?unstable_path=./assets/maps/...
  const arch = resolveMapArchetype(theater);
  if (typeof window !== 'undefined' && window.location?.origin) {
    const path = encodeURIComponent(`./assets/maps/terrain_${arch}.jpg`);
    return `${window.location.origin}/assets/?unstable_path=${path}`;
  }
  return null;
}

export function loadTerrainHtmlImage(theater: TheaterDef): Promise<HTMLImageElement | null> {
  if (typeof document === 'undefined') return Promise.resolve(null);
  const arch = resolveMapArchetype(theater);
  const candidates: string[] = [];
  const primary = terrainImageUri(theater);
  if (primary) candidates.push(primary);
  if (typeof window !== 'undefined' && window.location?.origin) {
    const path = encodeURIComponent(`./assets/maps/terrain_${arch}.jpg`);
    const metro = `${window.location.origin}/assets/?unstable_path=${path}`;
    if (!candidates.includes(metro)) candidates.push(metro);
  }

  const tryLoad = (uri: string) =>
    new Promise<HTMLImageElement | null>((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = uri;
    });

  return (async () => {
    for (const uri of candidates) {
      const img = await tryLoad(uri);
      if (img) return img;
    }
    return null;
  })();
}

function paintRelief(ctx: CanvasRenderingContext2D, w: number, h: number, seed: number) {
  // Procedural satellite-ish relief into offscreen, then drawImage (respects clip)
  const off = document.createElement('canvas');
  off.width = w;
  off.height = h;
  const octx = off.getContext('2d');
  if (!octx) return;
  const img = octx.createImageData(w, h);
  const data = img.data;
  for (let y = 0; y < h; y += 2) {
    for (let x = 0; x < w; x += 2) {
      const nx = x / w;
      const ny = y / h;
      const n =
        Math.sin((nx * 11 + seed) * 3.1) * Math.cos((ny * 9 + seed) * 2.7) * 0.5 +
        Math.sin((nx * 23 + ny * 17) * 4.2) * 0.25 +
        Math.sin((nx + ny) * 40 + seed) * 0.12;
      const elev = 0.45 + n * 0.35;
      const r = Math.floor(48 + elev * 90 + (1 - ny) * 18);
      const g = Math.floor(72 + elev * 100 + ny * 10);
      const b = Math.floor(42 + elev * 40);
      for (let dy = 0; dy < 2; dy++) {
        for (let dx = 0; dx < 2; dx++) {
          const i = ((y + dy) * w + (x + dx)) * 4;
          if (i + 3 >= data.length) continue;
          data[i] = r;
          data[i + 1] = g;
          data[i + 2] = b;
          data[i + 3] = 255;
        }
      }
    }
  }
  octx.putImageData(img, 0, 0);
  ctx.drawImage(off, 0, 0);
}

/**
 * Paint a professional, identifiable geographic board texture.
 */
export function paintGeoCanvas(
  geo: GeoRegion,
  theater: TheaterDef,
  size = 1400,
  terrainImg?: HTMLImageElement | null,
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  const w = size;
  const h = size;

  // ── Water base (deep ops blue) ──
  const water = ctx.createRadialGradient(w * 0.48, h * 0.42, w * 0.05, w * 0.5, h * 0.55, w * 0.8);
  water.addColorStop(0, '#1A4A62');
  water.addColorStop(0.4, geo.water);
  water.addColorStop(1, '#040A12');
  ctx.fillStyle = water;
  ctx.fillRect(0, 0, w, h);

  // Bathymetry rings
  ctx.strokeStyle = 'rgba(120, 190, 210, 0.09)';
  ctx.lineWidth = 2;
  for (let i = 1; i <= 8; i++) {
    ctx.beginPath();
    ctx.ellipse(w * 0.5, h * 0.52, w * (0.1 * i), h * (0.085 * i), 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Lat/long tactical grid
  ctx.strokeStyle = 'rgba(160, 210, 230, 0.07)';
  ctx.lineWidth = 1;
  for (let i = 1; i < 14; i++) {
    ctx.beginPath();
    ctx.moveTo((i / 14) * w, 0);
    ctx.lineTo((i / 14) * w, h);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, (i / 14) * h);
    ctx.lineTo(w, (i / 14) * h);
    ctx.stroke();
  }

  const seed = geo.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 17;

  // ── Land with terrain / procedural relief (clipped to crisp coast) ──
  for (const land of geo.lands) {
    polyPath(ctx, land, w, h);
    ctx.save();
    ctx.clip();

    if (terrainImg) {
      const iw = terrainImg.naturalWidth || terrainImg.width || w;
      const ih = terrainImg.naturalHeight || terrainImg.height || h;
      const scale = Math.max(w / iw, h / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (w - dw) / 2;
      const dy = (h - dh) / 2;
      ctx.drawImage(terrainImg, dx, dy, dw, dh);
      // Ops color grade — keep relief readable
      ctx.fillStyle = 'rgba(12, 28, 22, 0.22)';
      ctx.fillRect(0, 0, w, h);
      const lift = ctx.createLinearGradient(0, 0, 0, h);
      lift.addColorStop(0, 'rgba(200, 210, 160, 0.1)');
      lift.addColorStop(1, 'rgba(10, 30, 40, 0.18)');
      ctx.fillStyle = lift;
      ctx.fillRect(0, 0, w, h);
    } else {
      paintRelief(ctx, w, h, seed);
      const lg = ctx.createRadialGradient(w * 0.45, h * 0.35, w * 0.1, w * 0.5, h * 0.55, w * 0.7);
      lg.addColorStop(0, `${geo.landHi}aa`);
      lg.addColorStop(0.55, `${geo.land}99`);
      lg.addColorStop(1, 'rgba(8, 18, 14, 0.5)');
      ctx.fillStyle = lg;
      ctx.fillRect(0, 0, w, h);
    }

    // Soft coastal wash (no hatch lines — those read as cheap banding)
    polyPath(ctx, land, w, h);
    ctx.strokeStyle = 'rgba(210, 230, 180, 0.16)';
    ctx.lineWidth = 32;
    ctx.stroke();

    ctx.restore();

    // Crisp coastline — dark outer + light inner (strategy-map read)
    polyPath(ctx, land, w, h);
    ctx.strokeStyle = 'rgba(6, 14, 18, 0.92)';
    ctx.lineWidth = 7;
    ctx.stroke();
    polyPath(ctx, land, w, h);
    ctx.strokeStyle = 'rgba(230, 240, 220, 0.88)';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    polyPath(ctx, land, w, h);
    ctx.strokeStyle = `${geo.accent}66`;
    ctx.lineWidth = 12;
    ctx.stroke();
  }

  // Inland waters
  for (const lake of geo.waters ?? []) {
    polyPath(ctx, lake, w, h);
    ctx.fillStyle = '#0A2434';
    ctx.fill();
    ctx.strokeStyle = 'rgba(140, 200, 220, 0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Rivers
  for (const river of geo.rivers ?? []) {
    if (river.length < 2) continue;
    ctx.beginPath();
    ctx.moveTo((river[0][0] / 100) * w, (river[0][1] / 100) * h);
    for (let i = 1; i < river.length; i++) {
      ctx.lineTo((river[i][0] / 100) * w, (river[i][1] / 100) * h);
    }
    ctx.strokeStyle = 'rgba(30, 70, 90, 0.75)';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    ctx.strokeStyle = 'rgba(130, 200, 220, 0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Borders / partition / DMZ
  for (const border of geo.borders ?? []) {
    if (border.length < 2) continue;
    ctx.beginPath();
    ctx.moveTo((border[0][0] / 100) * w, (border[0][1] / 100) * h);
    for (let i = 1; i < border.length; i++) {
      ctx.lineTo((border[i][0] / 100) * w, (border[i][1] / 100) * h);
    }
    ctx.strokeStyle = 'rgba(0,0,0,0.6)';
    ctx.lineWidth = 7;
    ctx.stroke();
    ctx.strokeStyle = geo.accent;
    ctx.lineWidth = 3.5;
    ctx.setLineDash([14, 10]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Theater corridors
  const byId = Object.fromEntries(theater.markers.map((m) => [m.id, m]));
  ctx.setLineDash([8, 8]);
  ctx.lineWidth = 2;
  ctx.strokeStyle = `${theater.accent}88`;
  for (const c of theater.corridors) {
    const a = byId[c.from];
    const b = byId[c.to];
    if (!a || !b) continue;
    ctx.beginPath();
    ctx.moveTo((a.x / 100) * w, (a.y / 100) * h);
    ctx.lineTo((b.x / 100) * w, (b.y / 100) * h);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  // Cities
  for (const city of geo.cities) {
    const cx = (city.x / 100) * w;
    const cy = (city.y / 100) * h;

    ctx.beginPath();
    ctx.arc(cx, cy, 12, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, 6.5, 0, Math.PI * 2);
    ctx.fillStyle = geo.accent;
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.95)';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    const label = city.name.toUpperCase();
    ctx.font = 'bold 26px Sora, IBM Plex Sans, system-ui, sans-serif';
    const tw = ctx.measureText(label).width;
    const lx = cx + 14;
    const ly = cy + 8;
    ctx.fillStyle = 'rgba(5,10,16,0.78)';
    ctx.fillRect(lx - 6, ly - 22, tw + 14, 30);
    ctx.strokeStyle = `${geo.accent}77`;
    ctx.lineWidth = 1;
    ctx.strokeRect(lx - 6, ly - 22, tw + 14, 30);
    ctx.fillStyle = '#F2F6FA';
    ctx.fillText(label, lx, ly);
  }

  // Title plate
  ctx.fillStyle = 'rgba(5,10,16,0.75)';
  ctx.fillRect(20, h - 70, Math.min(w * 0.62, 560), 48);
  ctx.strokeStyle = `${geo.accent}88`;
  ctx.strokeRect(20, h - 70, Math.min(w * 0.62, 560), 48);
  ctx.fillStyle = geo.accent;
  ctx.font = 'bold 22px Orbitron, Sora, system-ui, sans-serif';
  ctx.fillText(geo.label.toUpperCase(), 34, h - 40);

  // Corner ops ticks
  ctx.strokeStyle = 'rgba(110, 245, 222, 0.5)';
  ctx.lineWidth = 2;
  const tick = 28;
  ctx.beginPath();
  ctx.moveTo(12, 12 + tick);
  ctx.lineTo(12, 12);
  ctx.lineTo(12 + tick, 12);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(w - 12 - tick, 12);
  ctx.lineTo(w - 12, 12);
  ctx.lineTo(w - 12, 12 + tick);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(12, h - 12 - tick);
  ctx.lineTo(12, h - 12);
  ctx.lineTo(12 + tick, h - 12);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(w - 12 - tick, h - 12);
  ctx.lineTo(w - 12, h - 12);
  ctx.lineTo(w - 12, h - 12 - tick);
  ctx.stroke();

  return canvas;
}
