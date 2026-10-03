import AsyncStorage from '@react-native-async-storage/async-storage';
import { packForEpoch, type RotationBundle } from '@/data/mockRotationPacks';
import { buildTheaterFromArchetype, type TheaterArchetype } from '@/data/theaterTemplates';
import type { MeterFamily, Scenario } from '@/data/scenarios';
import type { OpKind } from '@/data/theaters';

export const WORLD_DESK_CADENCE_MS = 3 * 24 * 60 * 60 * 1000;

const KEYS = {
  lastRefresh: 'genesis.worldDesk.lastRefreshAt',
  packJson: 'genesis.worldDesk.pack',
  source: 'genesis.worldDesk.source',
  seen: 'genesis.worldDesk.seenIds',
};

export type DeskSource = 'mock' | 'api';

export type WorldDeskSnapshot = {
  lastRefreshAt: number;
  nextRefreshAt: number;
  source: DeskSource;
  bundle: RotationBundle;
  seenIds: string[];
};

export function epochIndexAt(timeMs: number): number {
  return Math.floor(timeMs / WORLD_DESK_CADENCE_MS);
}

export function formatUpdatedAgo(lastRefreshAt: number, now = Date.now()): string {
  const diff = Math.max(0, now - lastRefreshAt);
  const hours = Math.floor(diff / (60 * 60 * 1000));
  if (hours < 1) return 'updated just now';
  if (hours < 48) return `updated ${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `updated ${days}d ago`;
}

export function formatCountdown(nextRefreshAt: number, now = Date.now()): string {
  const diff = Math.max(0, nextRefreshAt - now);
  const totalHours = Math.floor(diff / (60 * 60 * 1000));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  if (days <= 0 && hours <= 0) return 'refresh due';
  if (days <= 0) return `next refresh in ${hours}h`;
  return `next refresh in ${days}d ${hours}h`;
}

async function readSeen(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(KEYS.seen);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function markScenarioSeen(id: string): Promise<string[]> {
  const seen = await readSeen();
  if (seen.includes(id)) return seen;
  const next = [...seen, id];
  await AsyncStorage.setItem(KEYS.seen, JSON.stringify(next));
  return next;
}

function stampBundle(bundle: RotationBundle, generatedAt: string): RotationBundle {
  return {
    ...bundle,
    scenarios: bundle.scenarios.map((s) => ({
      ...s,
      generatedAt,
      packId: bundle.packId,
    })),
  };
}

function mockBundleForNow(now: number): RotationBundle {
  const generatedAt = new Date(now).toISOString();
  return stampBundle(packForEpoch(epochIndexAt(now)), generatedAt);
}

type GeneratedScenarioJson = {
  id: string;
  title: string;
  region: string;
  premise: string;
  role: string;
  tension: string;
  meterFamily: MeterFamily;
  theaterArchetype: TheaterArchetype;
  beats: Scenario['beats'];
  ops: { choiceId: string; kind: OpKind; markerId: string; short: string }[];
};

async function fetchHeadlines(): Promise<string[]> {
  const newsKey = process.env.EXPO_PUBLIC_NEWS_API_KEY;
  if (!newsKey) return [];
  try {
    const url = `https://newsapi.org/v2/top-headlines?language=en&pageSize=8&apiKey=${newsKey}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = (await res.json()) as { articles?: { title?: string }[] };
    return (data.articles ?? []).map((a) => a.title).filter(Boolean) as string[];
  } catch {
    return [];
  }
}

async function generateApiBundle(now: number): Promise<RotationBundle | null> {
  const key = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  if (!key) return null;

  const headlines = await fetchHeadlines();
  const prompt = {
    date: new Date(now).toISOString().slice(0, 10),
    headlines,
    instructions:
      'Create exactly 2 serious geopolitical decision scenarios for a strategy game. Tone: tradeoffs and consequences, not partisan propaganda. Each scenario needs 4 beats, each beat 3 choices with effects tags (escalation,diplomacy,deterrence,market_stability,alliance_cohesion,credibility,governability,norm_protection,norm_erosion,polarization,eu_cohesion,economic_pressure,social_calm,time,domestic_support,liberal_trust,far_right_momentum,civilian_cost,democratic_mandate) and integer weights. theaterArchetype must be one of: pacific,sahel,redsea,americas,southasia,markets,arctic. ops: one entry per choiceId referencing a markerId that exists on that archetype (use generic markers like capital,strait,border,exchange,port,fleet). Return JSON { packLabel, hook, scenarios: GeneratedScenarioJson[] }.',
  };

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.5,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              'You generate playable geopolitical decision scenarios for Genesis. JSON only. Serious simulation tone.',
          },
          { role: 'user', content: JSON.stringify(prompt) },
        ],
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;
    const parsed = JSON.parse(content) as {
      packLabel?: string;
      hook?: string;
      scenarios?: GeneratedScenarioJson[];
    };
    if (!parsed.scenarios || parsed.scenarios.length < 1) return null;

    const generatedAt = new Date(now).toISOString();
    const scenarios: Scenario[] = [];
    const theaters = [];
    const ops: RotationBundle['ops'] = {};

    for (const raw of parsed.scenarios.slice(0, 2)) {
      if (!raw.id || !raw.beats || raw.beats.length < 4) continue;
      const scenario: Scenario = {
        id: raw.id.startsWith('rot-') ? raw.id : `rot-${raw.id}`,
        title: raw.title,
        region: raw.region,
        premise: raw.premise,
        role: raw.role,
        tension: raw.tension,
        beats: raw.beats.slice(0, 4),
        meterFamily: raw.meterFamily ?? 'conflict',
        theaterArchetype: raw.theaterArchetype,
        packId: `api-${epochIndexAt(now)}`,
        generatedAt,
        evergreen: false,
      };
      scenarios.push(scenario);
      theaters.push(
        buildTheaterFromArchetype(
          raw.theaterArchetype ?? 'pacific',
          scenario.id,
          scenario.title,
        ),
      );
      for (const o of raw.ops ?? []) {
        ops[o.choiceId] = { kind: o.kind, markerId: o.markerId, short: o.short };
      }
      // Fallback ops if model omitted them
      for (const beat of scenario.beats) {
        for (const choice of beat.choices) {
          if (!ops[choice.id]) {
            ops[choice.id] = {
              kind: 'political',
              markerId: 'capital',
              short: 'OP',
            };
          }
        }
      }
    }

    if (scenarios.length === 0) return null;

    return {
      packId: `api-${epochIndexAt(now)}`,
      label: parsed.packLabel ?? 'Live world desk',
      hook: parsed.hook ?? 'Generated from the current wire.',
      scenarios,
      theaters,
      ops,
    };
  } catch {
    return null;
  }
}

export async function loadWorldDesk(now = Date.now()): Promise<WorldDeskSnapshot> {
  const seenIds = await readSeen();
  try {
    const lastRaw = await AsyncStorage.getItem(KEYS.lastRefresh);
    const packRaw = await AsyncStorage.getItem(KEYS.packJson);
    const sourceRaw = (await AsyncStorage.getItem(KEYS.source)) as DeskSource | null;
    const lastRefreshAt = lastRaw ? Number(lastRaw) : 0;
    const due = !lastRefreshAt || now - lastRefreshAt >= WORLD_DESK_CADENCE_MS;

    if (!due && packRaw) {
      const bundle = JSON.parse(packRaw) as RotationBundle;
      return {
        lastRefreshAt,
        nextRefreshAt: lastRefreshAt + WORLD_DESK_CADENCE_MS,
        source: sourceRaw ?? 'mock',
        bundle,
        seenIds,
      };
    }

    return refreshWorldDesk(now, seenIds);
  } catch {
    const bundle = mockBundleForNow(now);
    return {
      lastRefreshAt: now,
      nextRefreshAt: now + WORLD_DESK_CADENCE_MS,
      source: 'mock',
      bundle,
      seenIds,
    };
  }
}

export async function refreshWorldDesk(
  now = Date.now(),
  seenIds?: string[],
): Promise<WorldDeskSnapshot> {
  const seen = seenIds ?? (await readSeen());
  const api = await generateApiBundle(now);
  const bundle = api ?? mockBundleForNow(now);
  const source: DeskSource = api ? 'api' : 'mock';

  await AsyncStorage.setItem(KEYS.lastRefresh, String(now));
  await AsyncStorage.setItem(KEYS.packJson, JSON.stringify(bundle));
  await AsyncStorage.setItem(KEYS.source, source);

  return {
    lastRefreshAt: now,
    nextRefreshAt: now + WORLD_DESK_CADENCE_MS,
    source,
    bundle,
    seenIds: seen,
  };
}
