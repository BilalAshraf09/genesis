/**
 * Expands all 30 historical scenarios from 4 → 10 beats and rewrites catalog.ts.
 * Run: node scripts/expand-to-ten-beats.mjs
 *
 * Keeps existing beats 1–4 intact; appends authored beats 5–10 from hist-beats-5-10-*.mjs.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { early } from './hist-scenarios-early.mjs';
import { rest } from './hist-scenarios-rest.mjs';
import { mid } from './hist-scenarios-mid.mjs';
import { late } from './hist-scenarios-late.mjs';
import { extraBeatsByScenarioId as part1 } from './hist-beats-5-10-part1.mjs';
import { extraBeatsPart2 as part2 } from './hist-beats-5-10-part2.mjs';
import { extraBeatsPart3 as part3 } from './hist-beats-5-10-part3.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outPath = path.join(__dirname, '../src/data/historical/catalog.ts');
const theaterPath = path.join(__dirname, '../src/data/theaterTemplates.ts');

const ARCHETYPE_MARKERS = {
  pacific: ['strait', 'capital_a', 'capital_b', 'fleet', 'cable', 'island'],
  sahel: ['capital', 'border', 'mine', 'convoy', 'radio', 'camp'],
  redsea: ['chokepoint', 'port', 'escort', 'proxy', 'insurer', 'canal'],
  americas: ['capital', 'port', 'plaza', 'imf', 'farm', 'court'],
  southasia: ['loc', 'capital_a', 'capital_b', 'valley', 'media', 'third'],
  markets: ['exchange', 'fed', 'desk', 'treasury', 'em', 'energy'],
  arctic: ['route', 'claim', 'base', 'rig', 'council', 'cable'],
  gulf: ['strait', 'hormuz', 'tehran', 'dubai', 'riyadh', 'oman', 'oil', 'base', 'proxy'],
  europe: ['capital', 'brussels', 'parliament', 'streets', 'districts', 'ballot'],
};

const extraAll = { ...part1, ...part2, ...part3 };
const scenarios = [...early, ...rest, ...mid, ...late];

if (scenarios.length !== 30) {
  console.error(`Expected 30 base scenarios, got ${scenarios.length}`);
  process.exit(1);
}

const expanded = [];
const errors = [];

for (const s of scenarios) {
  const extra = extraAll[s.id];
  if (!extra || extra.length !== 6) {
    errors.push(`${s.id}: expected 6 extra beats, got ${extra?.length ?? 0}`);
    continue;
  }
  if (s.beats.length !== 4) {
    errors.push(`${s.id}: base beats ${s.beats.length}, expected 4`);
    continue;
  }

  const markers = new Set(ARCHETYPE_MARKERS[s.theaterArchetype] ?? []);
  const beats = [...s.beats, ...extra];

  if (beats.length !== 10) {
    errors.push(`${s.id}: total beats ${beats.length}`);
    continue;
  }

  for (let i = 0; i < beats.length; i++) {
    const b = beats[i];
    if (b.choices.length !== 3) {
      errors.push(`${b.id}: ${b.choices.length} choices`);
    }
    for (const c of b.choices) {
      if (!c.short || c.short.length > 8) {
        errors.push(`${c.id}: short invalid (${c.short})`);
      }
      if (!c.effects || c.effects.length < 2 || c.effects.length > 3) {
        errors.push(`${c.id}: effects count ${c.effects?.length}`);
      }
      if (!markers.has(c.markerId)) {
        errors.push(`${c.id}: markerId '${c.markerId}' not in ${s.theaterArchetype}`);
      }
    }
  }

  // Beat id suffix check for 5–10
  for (let n = 5; n <= 10; n++) {
    const b = beats[n - 1];
    if (!b.id.endsWith(`-${n}`)) {
      errors.push(`${s.id}: beat ${n} id ${b.id} should end with -${n}`);
    }
  }

  expanded.push({ ...s, beats });
}

if (errors.length) {
  console.error('Validation errors:');
  for (const e of errors) console.error(' -', e);
  process.exit(1);
}

if (Object.keys(extraAll).length !== 30) {
  console.error(`Extra beat maps cover ${Object.keys(extraAll).length} scenarios, expected 30`);
  process.exit(1);
}

function esc(str) {
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n');
}

function emitFx(e) {
  return `{ tag: '${esc(e.tag)}', weight: ${e.weight}, summary: '${esc(e.summary)}' }`;
}

function emitChoice(c) {
  const effects = c.effects.map(emitFx).join(',\n              ');
  return `{
            id: '${esc(c.id)}',
            label: '${esc(c.label)}',
            detail: '${esc(c.detail)}',
            kind: '${esc(c.kind)}',
            markerId: '${esc(c.markerId)}',
            short: '${esc(c.short)}',
            effects: [
              ${effects},
            ],
          }`;
}

function emitBeat(b) {
  const choices = b.choices.map(emitChoice).join(',\n          ');
  return `{
        id: '${esc(b.id)}',
        title: '${esc(b.title)}',
        briefing:
          '${esc(b.briefing)}',
        stakes:
          '${esc(b.stakes)}',
        choices: [
          ${choices},
        ],
      }`;
}

function emitScenario(s) {
  const beats = s.beats.map(emitBeat).join(',\n      ');
  return `{
    id: '${esc(s.id)}',
    year: ${s.year},
    era: '${esc(s.era)}',
    title: '${esc(s.title)}',
    region: '${esc(s.region)}',
    meterFamily: '${esc(s.meterFamily)}',
    theaterArchetype: '${esc(s.theaterArchetype)}',
    premise:
      '${esc(s.premise)}',
    role: '${esc(s.role)}',
    tension:
      '${esc(s.tension)}',
    beats: [
      ${beats},
    ],
  }`;
}

const body = expanded.map(emitScenario).join(',\n  ');

const file = `import type { HistoricalScenario } from '@/data/historical/build';

/** Offline historical timeline — 30 authored scenarios (1900–2026), 10 beats each. */
export const historicalScenarios: HistoricalScenario[] = [
  ${body},
];

export function getHistoricalScenario(id: string): HistoricalScenario | undefined {
  return historicalScenarios.find((s) => s.id === id);
}
`;

fs.writeFileSync(outPath, file);
console.log(`Wrote ${expanded.length} scenarios × 10 beats → ${path.relative(process.cwd(), outPath)}`);

// Sanity: theaterTemplates still present
if (!fs.existsSync(theaterPath)) {
  console.warn('theaterTemplates.ts missing — marker validation used hardcoded map');
}
