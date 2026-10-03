import type { DecisionRecord, PathFamily } from '@/lib/evaluate';

/** UTC calendar day key YYYY-MM-DD */
export type DayKey = string;

export type PersonalBest = {
  score: number;
  grade: string;
  pathFamily: string | null;
  at: string;
};

export type IncompleteRun = {
  scenarioId: string;
  title: string;
  year: number;
  beatIndex: number;
  totalBeats: number;
  decisions: DecisionRecord[];
  updatedAt: string;
};

/** One cleared run logged for local weekly desk (no server). */
export type WeeklyRunEntry = {
  day: DayKey;
  scenarioId: string;
  title: string;
  score: number;
  grade: string;
  at: string;
};

export type ReminderStatus = 'unset' | 'on' | 'denied' | 'unsupported';

export type RetentionState = {
  /** Play-day streak (UTC days with ≥1 completed run). */
  currentStreak: number;
  bestStreak: number;
  lastPlayDay: DayKey | null;
  /** Cosmetic desk title from streak. */
  deskTitle: string;
  /** Theaters with ≥1 completed after-action. */
  completedTheaterIds: string[];
  /** Path families discovered globally. */
  endingsUnlocked: PathFamily[];
  /** Path families discovered per theater. */
  theaterEndings: Record<string, PathFamily[]>;
  /** Best cabinet score per theater. */
  personalBests: Record<string, PersonalBest>;
  /** Mid-run snapshot for resume. */
  incompleteRun: IncompleteRun | null;
  /** Last completed theater (for same-era recommend). */
  lastCompletedTheaterId: string | null;
  /** ISO timestamp of first ever completion — seeds D0→D1 hook. */
  firstCompletionAt: string | null;
  /** Crisis-of-Day local reminder preference. */
  reminderStatus: ReminderStatus;
  /** Recent clears for personal weekly desk (newest first, capped). */
  weeklyRuns: WeeklyRunEntry[];
  /** Consumable streak-freeze charges (IAP `genesis_streak_freeze`). */
  streakFreezeCharges: number;
};

export const EMPTY_RETENTION: RetentionState = {
  currentStreak: 0,
  bestStreak: 0,
  lastPlayDay: null,
  deskTitle: 'Cadet Analyst',
  completedTheaterIds: [],
  endingsUnlocked: [],
  theaterEndings: {},
  personalBests: {},
  incompleteRun: null,
  lastCompletedTheaterId: null,
  firstCompletionAt: null,
  reminderStatus: 'unset',
  weeklyRuns: [],
  streakFreezeCharges: 0,
};

export const WEEKLY_RUNS_CAP = 14;

/** Core outcome families players can collect. */
export const COLLECTIBLE_ENDINGS: PathFamily[] = [
  'kinetic',
  'diplomatic',
  'delay',
  'economic',
  'mixed',
  'force_order',
  'political_hardline',
  'political_norms',
  'political_stalemate',
];

export const TOTAL_THEATERS = 32;
