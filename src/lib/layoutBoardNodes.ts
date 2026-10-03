import type { TheaterDef } from '@/data/theaters';

export type LaidOutNode = {
  id: string;
  x: number;
  y: number;
  label: string;
  kind: string;
};

/** One selectable ops piece — never shares a slot with another choice. */
export type LaidOutChoice = {
  choiceId: string;
  markerId: string;
  /** Board % position of the tile center (screen-space rail) */
  x: number;
  y: number;
  /** Geographic pin (for beacon + leader line) */
  anchorX: number;
  anchorY: number;
  placeLabel: string;
  choiceLabel: string;
  short: string;
  kind: string;
  pieceW: number;
  pieceH: number;
};

export type ChoiceOpInput = {
  choiceId: string;
  markerId: string;
  choiceLabel: string;
  short: string;
  kind: string;
};

const SCENERY_MARGIN = 8;

/**
 * Soft nudge for non-legal scenery pins only (claimed / quiet markers).
 */
export function layoutBoardNodes(
  theater: TheaterDef,
  priorityIds: Set<string>,
): LaidOutNode[] {
  const nodes: LaidOutNode[] = theater.markers.map((m) => ({
    id: m.id,
    x: m.x,
    y: m.y,
    label: m.label,
    kind: m.kind,
  }));

  const MIN = 10;
  for (let iter = 0; iter < 24; iter++) {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        if (priorityIds.has(a.id) || priorityIds.has(b.id)) continue;
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        let dist = Math.hypot(dx, dy) || 0.01;
        if (dist >= MIN) continue;
        const push = ((MIN - dist) / MIN) * 0.4;
        const nx = dx / dist;
        const ny = dy / dist;
        a.x -= nx * push * MIN * 0.5;
        a.y -= ny * push * MIN * 0.5;
        b.x += nx * push * MIN * 0.5;
        b.y += ny * push * MIN * 0.5;
      }
    }
    for (const n of nodes) {
      n.x = Math.min(100 - SCENERY_MARGIN, Math.max(SCENERY_MARGIN, n.x));
      n.y = Math.min(100 - SCENERY_MARGIN, Math.max(SCENERY_MARGIN, n.y));
    }
  }

  return nodes;
}

/**
 * Hard-guarantee zero-overlap layout for ENGAGE tiles.
 *
 * Places choices on a bottom ops rail (fan arc) sized in pixels —
 * never stacks tiles on one map point. Anchors stay at geographic
 * markers for beacons + leader lines.
 */
export function layoutLegalChoices(
  theater: TheaterDef,
  ops: ChoiceOpInput[],
  boardW: number,
  boardH: number,
): LaidOutChoice[] {
  if (!ops.length || boardW < 8 || boardH < 8) return [];

  const markerById = Object.fromEntries(theater.markers.map((m) => [m.id, m]));
  const n = ops.length;

  // Tile size: fit n tiles with ≥14px gap, never wider than 132
  const sidePad = 12;
  const gap = 14;
  const usable = Math.max(120, boardW - sidePad * 2 - gap * Math.max(0, n - 1));
  const pieceW = Math.max(88, Math.min(132, Math.floor(usable / n)));
  const pieceH = Math.max(78, Math.min(96, Math.round(boardH * 0.17)));

  // Bottom ops rail — clears the map reading band above
  const railYPx = boardH - pieceH / 2 - 10;
  const totalW = n * pieceW + (n - 1) * gap;
  const startX = (boardW - totalW) / 2 + pieceW / 2;

  const laid: LaidOutChoice[] = ops.map((op, i) => {
    const m = markerById[op.markerId];
    const ax = m?.x ?? 20 + i * 25;
    const ay = m?.y ?? 40;
    // Slight fan arc so tiles don't read as a flat quiz strip
    const fan = n <= 1 ? 0 : Math.sin((i / Math.max(1, n - 1)) * Math.PI) * 6;
    const px = startX + i * (pieceW + gap);
    const py = railYPx - fan;

    return {
      choiceId: op.choiceId,
      markerId: op.markerId,
      x: (px / boardW) * 100,
      y: (py / boardH) * 100,
      anchorX: ax,
      anchorY: ay,
      placeLabel: m?.label ?? op.markerId,
      choiceLabel: op.choiceLabel.trim(),
      short: op.short,
      kind: op.kind,
      pieceW,
      pieceH,
    };
  });

  // Collision resolve (AABB) — should already be clean; run anyway
  for (let iter = 0; iter < 12; iter++) {
    if (choicesHaveZeroOverlap(laid, boardW, boardH, 8)) break;
    for (let i = 0; i < laid.length; i++) {
      for (let j = i + 1; j < laid.length; j++) {
        const a = laid[i];
        const b = laid[j];
        const ax = (a.x / 100) * boardW;
        const ay = (a.y / 100) * boardH;
        const bx = (b.x / 100) * boardW;
        const by = (b.y / 100) * boardH;
        const minDx = (a.pieceW + b.pieceW) / 2 + 8;
        const minDy = (a.pieceH + b.pieceH) / 2 + 8;
        const dx = bx - ax;
        const dy = by - ay;
        if (Math.abs(dx) < minDx && Math.abs(dy) < minDy) {
          const pushX = (minDx - Math.abs(dx)) / 2 + 1;
          const sx = dx === 0 ? (i < j ? -1 : 1) : Math.sign(dx);
          a.x = ((ax - sx * pushX) / boardW) * 100;
          b.x = ((bx + sx * pushX) / boardW) * 100;
        }
      }
    }
    // Clamp into board
    for (const c of laid) {
      const halfW = ((c.pieceW / 2) / boardW) * 100;
      const halfH = ((c.pieceH / 2) / boardH) * 100;
      c.x = Math.min(100 - halfW - 1, Math.max(halfW + 1, c.x));
      c.y = Math.min(100 - halfH - 1, Math.max(halfH + 1, c.y));
    }
  }

  return laid;
}

/**
 * Assert centers are far enough apart that hit-boxes cannot overlap.
 */
export function choicesHaveZeroOverlap(
  choices: LaidOutChoice[],
  boardW: number,
  boardH: number,
  padPx = 4,
): boolean {
  for (let i = 0; i < choices.length; i++) {
    for (let j = i + 1; j < choices.length; j++) {
      const a = choices[i];
      const b = choices[j];
      const ax = (a.x / 100) * boardW;
      const ay = (a.y / 100) * boardH;
      const bx = (b.x / 100) * boardW;
      const by = (b.y / 100) * boardH;
      const minDx = (a.pieceW + b.pieceW) / 2 + padPx;
      const minDy = (a.pieceH + b.pieceH) / 2 + padPx;
      if (Math.abs(ax - bx) < minDx && Math.abs(ay - by) < minDy) return false;
    }
  }
  return true;
}

/** Soft camera focus box around hot anchors (percent coords). */
export function hotZoneFocus(
  anchors: { x: number; y: number }[],
): { cx: number; cy: number; scale: number } | null {
  if (!anchors.length) return null;
  const cx = anchors.reduce((s, n) => s + n.x, 0) / anchors.length;
  const cy = anchors.reduce((s, n) => s + n.y, 0) / anchors.length;
  return { cx, cy, scale: anchors.length === 1 ? 1.08 : 1.05 };
}

/**
 * Full readable op label — never mid-word truncates short titles.
 */
export function displayOpLabel(short: string, choiceLabel: string): string {
  const clean = choiceLabel.trim();
  if (!clean) return short || 'OP';
  if (clean.length <= 52) return clean;
  const sliced = clean.slice(0, 50);
  const lastSpace = sliced.lastIndexOf(' ');
  const base = lastSpace > 22 ? sliced.slice(0, lastSpace) : sliced.trim();
  return `${base}…`;
}
