import type { HistoricalScenario } from '@/data/historical';
import type { PathFamily } from '@/lib/evaluate';
import {
  COLLECTIBLE_ENDINGS,
  TOTAL_THEATERS,
  type DayKey,
  type RetentionState,
  type WeeklyRunEntry,
} from '@/retention/types';

export function utcDayKey(d: Date = new Date()): DayKey {
  return d.toISOString().slice(0, 10);
}

export function daysBetween(a: DayKey, b: DayKey): number {
  const ms = Date.parse(`${b}T00:00:00.000Z`) - Date.parse(`${a}T00:00:00.000Z`);
  return Math.round(ms / 86_400_000);
}

/** Stable hash for daily rotation. */
export function dayHash(day: DayKey): number {
  let h = 2166136261;
  for (let i = 0; i < day.length; i++) {
    h ^= day.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export type CrisisOfTheDay = {
  day: DayKey;
  scenario: HistoricalScenario;
  multiplier: number;
  teaser: string;
  hoursLeft: number;
};

export function hoursLeftInUtcDay(now: Date = new Date()): number {
  const end = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
    0,
    0,
    0,
  );
  return Math.max(0, Math.ceil((end - now.getTime()) / 3_600_000));
}

export function pickCrisisOfTheDay(
  theaters: HistoricalScenario[],
  now: Date = new Date(),
): CrisisOfTheDay | null {
  if (!theaters.length) return null;
  const day = utcDayKey(now);
  const idx = dayHash(day) % theaters.length;
  const scenario = theaters[idx]!;
  const teaser =
    scenario.tension?.trim() ||
    scenario.premise.split(/(?<=[.!?])\s+/)[0]?.slice(0, 140) ||
    'A cabinet window opens for twenty-four hours.';
  return {
    day,
    scenario,
    multiplier: 1.15,
    teaser,
    hoursLeft: hoursLeftInUtcDay(now),
  };
}

export function deskTitleForStreak(streak: number): string {
  if (streak >= 30) return 'Permanent Secretary';
  if (streak >= 14) return 'Cabinet Fixture';
  if (streak >= 7) return 'Crisis Regular';
  if (streak >= 3) return 'Night Watch';
  if (streak >= 1) return 'Desk Officer';
  return 'Cadet Analyst';
}

export function applyPlayDayStreak(
  state: RetentionState,
  day: DayKey = utcDayKey(),
): Pick<RetentionState, 'currentStreak' | 'bestStreak' | 'lastPlayDay' | 'deskTitle'> {
  if (state.lastPlayDay === day) {
    return {
      currentStreak: state.currentStreak,
      bestStreak: state.bestStreak,
      lastPlayDay: state.lastPlayDay,
      deskTitle: state.deskTitle,
    };
  }
  let next = 1;
  if (state.lastPlayDay) {
    const gap = daysBetween(state.lastPlayDay, day);
    if (gap === 1) next = state.currentStreak + 1;
    else next = 1;
  }
  const best = Math.max(state.bestStreak, next);
  return {
    currentStreak: next,
    bestStreak: best,
    lastPlayDay: day,
    deskTitle: deskTitleForStreak(next),
  };
}

export type ProgressSnapshot = {
  theatersDone: number;
  theatersTotal: number;
  endingsUnlocked: number;
  endingsTotal: number;
  collectionPct: number;
  label: string;
};

export function progressSnapshot(state: RetentionState): ProgressSnapshot {
  const theatersDone = state.completedTheaterIds.length;
  const endingsUnlocked = state.endingsUnlocked.length;
  const endingsTotal = COLLECTIBLE_ENDINGS.length;
  const theaterPct = theatersDone / TOTAL_THEATERS;
  const endingPct = endingsUnlocked / endingsTotal;
  const collectionPct = Math.round(((theaterPct + endingPct) / 2) * 100);
  return {
    theatersDone,
    theatersTotal: TOTAL_THEATERS,
    endingsUnlocked,
    endingsTotal,
    collectionPct,
    label: `${theatersDone}/${TOTAL_THEATERS} theaters · ${endingsUnlocked} endings unlocked`,
  };
}

export type NextPlayReason =
  | 'daily'
  | 'same_era'
  | 'complementary_path'
  | 'unplayed'
  | 'replay_best';

export type NextPlayRec = {
  scenario: HistoricalScenario;
  reason: NextPlayReason;
  headline: string;
  detail: string;
  suggestedPath?: PathFamily;
};

const PATH_LABEL: Record<string, string> = {
  kinetic: 'KINETIC',
  diplomatic: 'DIPLOMATIC',
  delay: 'DELAY',
  economic: 'ECONOMIC',
  mixed: 'MIXED',
  force_order: 'FORCE ORDER',
  political_hardline: 'HARDLINE',
  political_norms: 'NORMS',
  political_stalemate: 'STALEMATE',
};

export function pathLabel(family: string | null | undefined): string {
  if (!family) return 'MIXED';
  return PATH_LABEL[family] ?? family.replace(/_/g, ' ').toUpperCase();
}

/** Complementary path not yet tried on this theater (curiosity loop). */
export function complementaryPath(
  unlocked: PathFamily[],
  last?: PathFamily | null,
): PathFamily | null {
  const pool: PathFamily[] =
    last === 'kinetic' || last === 'force_order'
      ? ['diplomatic', 'delay', 'economic']
      : last === 'diplomatic' || last === 'political_norms'
        ? ['kinetic', 'delay', 'economic']
        : last === 'delay'
          ? ['kinetic', 'diplomatic', 'economic']
          : last === 'economic'
            ? ['diplomatic', 'delay', 'kinetic']
            : ['diplomatic', 'delay', 'kinetic', 'economic'];

  for (const p of pool) {
    if (!unlocked.includes(p)) return p;
  }
  for (const p of COLLECTIBLE_ENDINGS) {
    if (!unlocked.includes(p)) return p;
  }
  return null;
}

export function cliffhangerForTheater(
  state: RetentionState,
  scenarioId: string,
  lastFamily?: PathFamily | null,
): { path: PathFamily; blurb: string } | null {
  const unlocked = state.theaterEndings[scenarioId] ?? [];
  const path = complementaryPath(unlocked, lastFamily);
  if (!path) return null;
  const label = pathLabel(path);
  return {
    path,
    blurb: `One fork still unexplored — try the ${label} path.`,
  };
}

/**
 * Smart next-play:
 * 1) same era unfinished → 2) complementary path on a completed theater →
 * 3) daily feature → 4) any unplayed → 5) replay for personal best.
 */
export function recommendNextPlay(opts: {
  theaters: HistoricalScenario[];
  state: RetentionState;
  crisis: CrisisOfTheDay | null;
  excludeId?: string | null;
}): NextPlayRec | null {
  const { theaters, state, crisis, excludeId } = opts;
  if (!theaters.length) return null;

  const done = new Set(state.completedTheaterIds);
  const byId = Object.fromEntries(theaters.map((t) => [t.id, t]));

  const last = state.lastCompletedTheaterId
    ? byId[state.lastCompletedTheaterId]
    : undefined;

  // 1) Same era unfinished
  if (last) {
    const peer = theaters.find(
      (t) => t.era === last.era && t.id !== last.id && !done.has(t.id) && t.id !== excludeId,
    );
    if (peer) {
      return {
        scenario: peer,
        reason: 'same_era',
        headline: `Stay in ${peer.era}`,
        detail: `${peer.title} is still dark on your desk.`,
      };
    }
  }

  // 2) Complementary path on a finished theater
  for (const id of [...state.completedTheaterIds].reverse()) {
    if (id === excludeId) continue;
    const sc = byId[id];
    if (!sc) continue;
    const unlocked = state.theaterEndings[id] ?? [];
    const lastFam = unlocked[unlocked.length - 1] as PathFamily | undefined;
    const path = complementaryPath(unlocked, lastFam);
    if (path) {
      return {
        scenario: sc,
        reason: 'complementary_path',
        headline: `Replay ${sc.title}`,
        detail: `Unlock the ${pathLabel(path)} ending you haven’t seen.`,
        suggestedPath: path,
      };
    }
  }

  // 3) Daily feature (if not just finished)
  if (crisis && crisis.scenario.id !== excludeId) {
    return {
      scenario: crisis.scenario,
      reason: 'daily',
      headline: 'Crisis of the Day',
      detail: `${Math.round((crisis.multiplier - 1) * 100)}% score bonus · ${crisis.hoursLeft}h left`,
    };
  }

  // 4) Any unplayed
  const unplayed = theaters.find((t) => !done.has(t.id) && t.id !== excludeId);
  if (unplayed) {
    return {
      scenario: unplayed,
      reason: 'unplayed',
      headline: 'Uncharted theater',
      detail: unplayed.tension?.slice(0, 110) || unplayed.premise.slice(0, 110),
    };
  }

  // 5) Replay lowest personal best
  let weakest: HistoricalScenario | null = null;
  let weakScore = Infinity;
  for (const t of theaters) {
    if (t.id === excludeId) continue;
    const pb = state.personalBests[t.id];
    if (pb && pb.score < weakScore) {
      weakScore = pb.score;
      weakest = t;
    }
  }
  if (weakest) {
    return {
      scenario: weakest,
      reason: 'replay_best',
      headline: 'Beat your worst board',
      detail: `Personal best ${weakScore} on ${weakest.title} — push higher.`,
    };
  }

  return {
    scenario: theaters[0]!,
    reason: 'daily',
    headline: 'Redeploy',
    detail: 'Every path still writes a different after-action.',
  };
}

export function streakRewardCopy(streak: number, deskTitle: string): {
  badge: string;
  tip: string;
  cta: string;
} {
  if (streak <= 0) {
    return {
      badge: deskTitle,
      tip: 'Complete one theater today to light the streak.',
      cta: 'START TODAY’S RUN',
    };
  }
  if (streak === 1) {
    return {
      badge: deskTitle,
      tip: 'Streak lit. Come back tomorrow or it goes cold.',
      cta: 'KEEP THE STREAK',
    };
  }
  return {
    badge: `${streak}-DAY · ${deskTitle}`,
    tip: `Don’t break ${streak} days — tomorrow’s Crisis of the Day is waiting.`,
    cta: 'CONTINUE STREAK',
  };
}

/** Prefill for share-to-challenge — invite a peer to beat this path. */
export function buildChallengeShareText(opts: {
  theaterTitle: string;
  year: number;
  score: number;
  grade: string;
  pathFamily: string | null;
  headline?: string;
  /** Theater id for deep-link invite */
  theaterId?: string;
  from?: string | null;
  inviteLine?: string | null;
}): string {
  const family = opts.pathFamily
    ? opts.pathFamily.replace(/_/g, ' ').toUpperCase()
    : 'MIXED PATH';
  return [
    `GENESIS CHALLENGE · Beat my path`,
    `${opts.theaterTitle} (${opts.year})`,
    `Cabinet score ${opts.score} (${opts.grade}) · ${family}`,
    opts.headline?.trim() || null,
    `Can you clear a higher score on the same theater?`,
    opts.inviteLine?.trim() || null,
    `Play Genesis — historical decision theaters`,
  ]
    .filter(Boolean)
    .join('\n');
}

/**
 * Streak would break on next completion (missed ≥1 UTC day).
 * Offer spend freeze charge or buy IAP before recording.
 */
export function streakBreakPending(
  state: RetentionState,
  day: DayKey = utcDayKey(),
): { pending: boolean; gap: number; streakAtRisk: number } {
  if (!state.lastPlayDay || state.currentStreak < 1) {
    return { pending: false, gap: 0, streakAtRisk: 0 };
  }
  if (state.lastPlayDay === day) {
    return { pending: false, gap: 0, streakAtRisk: state.currentStreak };
  }
  const gap = daysBetween(state.lastPlayDay, day);
  if (gap <= 1) {
    return { pending: false, gap, streakAtRisk: state.currentStreak };
  }
  return { pending: true, gap, streakAtRisk: state.currentStreak };
}

/** Apply a freeze charge: set lastPlayDay to yesterday so gap===1 on next play. */
export function applyStreakFreezePatch(
  state: RetentionState,
  day: DayKey = utcDayKey(),
): Pick<RetentionState, 'lastPlayDay' | 'streakFreezeCharges'> | null {
  if (state.streakFreezeCharges < 1) return null;
  const breakInfo = streakBreakPending(state, day);
  if (!breakInfo.pending) return null;
  // Backdate last play to yesterday so applyPlayDayStreak continues the chain
  const yesterday = new Date(`${day}T00:00:00.000Z`);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const yKey = utcDayKey(yesterday);
  return {
    lastPlayDay: yKey,
    streakFreezeCharges: state.streakFreezeCharges - 1,
  };
}

/** Peek tomorrow’s Crisis (FOMO seed for D1 return). */
export function pickTomorrowCrisis(
  theaters: HistoricalScenario[],
  now: Date = new Date(),
): CrisisOfTheDay | null {
  const tomorrow = new Date(now.getTime() + 86_400_000);
  return pickCrisisOfTheDay(theaters, tomorrow);
}

export type ReturnBriefing = {
  kind: 'd1_seed' | 'streak_guard';
  headline: string;
  detail: string;
  tomorrowTitle: string;
  tomorrowYear: number;
  tomorrowId: string;
  cta: string;
};

/**
 * First-session → D1 hook: after ≥1 complete on a live streak day,
 * tease tomorrow’s Crisis so the desk feels unfinished.
 */
export function buildReturnBriefing(opts: {
  state: RetentionState;
  theaters: HistoricalScenario[];
  now?: Date;
}): ReturnBriefing | null {
  const { state, theaters } = opts;
  const now = opts.now ?? new Date();
  if (!state.firstCompletionAt || state.completedTheaterIds.length < 1) return null;
  if (state.currentStreak < 1) return null;

  const tomorrow = pickTomorrowCrisis(theaters, now);
  if (!tomorrow) return null;

  // Strong D0→D1: first play-day still open (streak === 1) or early mastery.
  if (state.currentStreak === 1 || state.completedTheaterIds.length <= 2) {
    return {
      kind: 'd1_seed',
      headline: 'RETURN BRIEFING · D+1',
      detail: `Streak lit as ${state.deskTitle}. Tomorrow’s Crisis window opens on ${tomorrow.scenario.title} — ×${tomorrow.multiplier.toFixed(2)} if you redeploy.`,
      tomorrowTitle: tomorrow.scenario.title,
      tomorrowYear: tomorrow.scenario.year,
      tomorrowId: tomorrow.scenario.id,
      cta: 'HOLD THE DESK',
    };
  }

  return {
    kind: 'streak_guard',
    headline: `${state.currentStreak}-DAY DESK · ${state.deskTitle}`,
    detail: `Best streak ${Math.max(state.bestStreak, state.currentStreak)}. Tomorrow: ${tomorrow.scenario.title} (${tomorrow.scenario.year}).`,
    tomorrowTitle: tomorrow.scenario.title,
    tomorrowYear: tomorrow.scenario.year,
    tomorrowId: tomorrow.scenario.id,
    cta: 'PROTECT STREAK',
  };
}

/** Personal weekly desk — local clears in the last 7 UTC days. */
export function weeklyPersonalDesk(
  runs: WeeklyRunEntry[],
  now: Date = new Date(),
): WeeklyRunEntry[] {
  const today = utcDayKey(now);
  return runs
    .filter((r) => {
      const gap = daysBetween(r.day, today);
      return gap >= 0 && gap < 7;
    })
    .slice(0, 7);
}
