/**
 * Plausible global weekly leaderboard — mock seed + local player PB overwrite.
 * Set EXPO_PUBLIC_LEADERBOARD_API_URL to hit a real API later (same shape).
 */

import { persistGet, persistSet } from '@/account/persist';
import { dayHash, utcDayKey } from '@/retention/algo';

export const LEADERBOARD_API_URL =
  (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_LEADERBOARD_API_URL?.trim()) || '';

export type LeaderboardRow = {
  rank: number;
  name: string;
  score: number;
  theater: string;
  path: string;
  isYou?: boolean;
};

const LOCAL_PB_KEY = 'genesis.leaderboard.localPb.v1';

const FAKE_NAMES = [
  'NightWatch_KR',
  'CabinetFox',
  'PartitionDesk',
  'MunichGhost',
  'HormuzWire',
  'BerlinRail',
  'SaigonShadow',
  'TehranBrief',
  'HavanaPulse',
  'DelhiForge',
  'OpsCadet_9',
  'ColdWarInk',
  'Flashpoint_X',
  'SuezOperator',
  'YaltaClerk',
  'IronCurtain',
  'ProxyHand',
  'NullHypothesis',
  'DeskOfficer_M',
  'CrisisRegular',
  'PermanentSec',
  'RedLineOps',
  'NeutralZone',
  'SignalLoss',
];

const FAKE_THEATERS = [
  'Munich 1938',
  'Cuban Missile',
  'Partition 1947',
  'Korean Parallel',
  'Hormuz Chokepoint',
  'Berlin Airlift',
  'Suez 1956',
  'Prague Spring',
  'Tiananmen Watch',
  'Gulf Fog',
  'Balfour Wire',
  'Two Koreas',
];

const FAKE_PATHS = [
  'diplomatic',
  'kinetic',
  'delay',
  'economic',
  'mixed',
  'force_order',
  'political_hardline',
  'political_norms',
];

function seededScore(day: string, i: number): number {
  const h = dayHash(`${day}:lb:${i}`);
  // Top of board clusters 88–99; tail drifts to 55+
  const band = Math.max(0, 22 - i);
  return Math.min(99, 55 + band * 2 + (h % 7));
}

/** Deterministic mock global roster for the UTC week bucket. */
export function mockGlobalRoster(now: Date = new Date(), count = 24): Omit<LeaderboardRow, 'rank' | 'isYou'>[] {
  const day = utcDayKey(now);
  // Week bucket so ranks feel stable within a week
  const week = day.slice(0, 8) + String(Math.floor(Number(day.slice(8)) / 7));
  const rows: Omit<LeaderboardRow, 'rank' | 'isYou'>[] = [];
  for (let i = 0; i < count; i++) {
    const nh = dayHash(`${week}:name:${i}`);
    const th = dayHash(`${week}:th:${i}`);
    const ph = dayHash(`${week}:path:${i}`);
    rows.push({
      name: FAKE_NAMES[nh % FAKE_NAMES.length]!,
      score: seededScore(week, i),
      theater: FAKE_THEATERS[th % FAKE_THEATERS.length]!,
      path: FAKE_PATHS[ph % FAKE_PATHS.length]!,
    });
  }
  return rows.sort((a, b) => b.score - a.score);
}

export type LocalLeaderboardPb = {
  name: string;
  score: number;
  theater: string;
  path: string;
  at: string;
};

export async function loadLocalLeaderboardPb(): Promise<LocalLeaderboardPb | null> {
  try {
    const raw = await persistGet(LOCAL_PB_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as LocalLeaderboardPb;
    if (typeof p.score !== 'number' || typeof p.name !== 'string') return null;
    return p;
  } catch {
    return null;
  }
}

export async function saveLocalLeaderboardPb(pb: LocalLeaderboardPb): Promise<void> {
  await persistSet(LOCAL_PB_KEY, JSON.stringify(pb));
}

/**
 * Merge mock roster with local player PB. Returns top N + your rank (may be > N).
 */
export function mergeLeaderboard(opts: {
  roster: Omit<LeaderboardRow, 'rank' | 'isYou'>[];
  local: LocalLeaderboardPb | null;
  topN?: number;
}): { top: LeaderboardRow[]; yourRank: number | null; yourRow: LeaderboardRow | null } {
  const topN = opts.topN ?? 20;
  const pool = opts.roster.map((r) => ({ ...r, isYou: false as boolean }));

  if (opts.local) {
    // Remove any prior "you" stub by name collision then inject
    const filtered = pool.filter((r) => r.name !== opts.local!.name);
    filtered.push({
      name: opts.local.name,
      score: opts.local.score,
      theater: opts.local.theater,
      path: opts.local.path,
      isYou: true,
    });
    filtered.sort((a, b) => b.score - a.score || (a.isYou ? -1 : 1));
    const ranked = filtered.map((r, i) => ({ ...r, rank: i + 1 }));
    const you = ranked.find((r) => r.isYou) ?? null;
    return {
      top: ranked.slice(0, topN),
      yourRank: you?.rank ?? null,
      yourRow: you,
    };
  }

  const ranked = pool.map((r, i) => ({ ...r, rank: i + 1 }));
  return { top: ranked.slice(0, topN), yourRank: null, yourRow: null };
}

/**
 * Optional remote fetch stub. Falls back to mock when URL empty or request fails.
 */
export async function fetchLeaderboardRoster(): Promise<Omit<LeaderboardRow, 'rank' | 'isYou'>[]> {
  if (!LEADERBOARD_API_URL) {
    return mockGlobalRoster();
  }
  try {
    const res = await fetch(LEADERBOARD_API_URL, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return mockGlobalRoster();
    const data = (await res.json()) as { rows?: Omit<LeaderboardRow, 'rank' | 'isYou'>[] };
    if (Array.isArray(data.rows) && data.rows.length) return data.rows;
    return mockGlobalRoster();
  } catch {
    return mockGlobalRoster();
  }
}

export async function buildWeeklyLeaderboard(opts?: {
  playerName?: string | null;
  playerScore?: number | null;
  theater?: string | null;
  path?: string | null;
}): Promise<{
  top: LeaderboardRow[];
  yourRank: number | null;
  yourRow: LeaderboardRow | null;
  source: 'api' | 'mock';
}> {
  const roster = await fetchLeaderboardRoster();
  let local = await loadLocalLeaderboardPb();

  // Live inject from current session PB if stronger
  if (
    opts?.playerName &&
    typeof opts.playerScore === 'number' &&
    opts.playerScore > 0 &&
    (!local || opts.playerScore >= local.score)
  ) {
    local = {
      name: opts.playerName.slice(0, 24),
      score: opts.playerScore,
      theater: opts.theater || local?.theater || 'Ops desk',
      path: opts.path || local?.path || 'mixed',
      at: new Date().toISOString(),
    };
    await saveLocalLeaderboardPb(local);
  }

  const merged = mergeLeaderboard({ roster, local });
  return {
    ...merged,
    source: LEADERBOARD_API_URL ? 'api' : 'mock',
  };
}
