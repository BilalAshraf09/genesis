import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { persistGet, persistSet } from '@/account/persist';
import { listHistoricalScenarios, type HistoricalScenario } from '@/data/historical';
import type { PathFamily } from '@/lib/evaluate';
import {
  applyPlayDayStreak,
  applyStreakFreezePatch,
  buildReturnBriefing,
  cliffhangerForTheater,
  deskTitleForStreak,
  pickCrisisOfTheDay,
  progressSnapshot,
  recommendNextPlay,
  streakBreakPending,
  streakRewardCopy,
  utcDayKey,
  weeklyPersonalDesk,
  type CrisisOfTheDay,
  type NextPlayRec,
  type ProgressSnapshot,
  type ReturnBriefing,
} from '@/retention/algo';
import { buildFomoUrgency, type FomoUrgency } from '@/retention/fomo';
import { saveLocalLeaderboardPb } from '@/retention/leaderboard';
import { disableCrisisReminder, enableCrisisReminder } from '@/retention/reminders';
import {
  EMPTY_RETENTION,
  WEEKLY_RUNS_CAP,
  type IncompleteRun,
  type PersonalBest,
  type ReminderStatus,
  type RetentionState,
  type WeeklyRunEntry,
} from '@/retention/types';

const STORAGE_KEY = 'genesis.retention.v1';

type RecordCompletionInput = {
  scenarioId: string;
  title: string;
  score: number;
  grade: string;
  pathFamily: PathFamily | string | null | undefined;
  dailyBonusApplied?: boolean;
  playerName?: string | null;
};

type RetentionApi = {
  ready: boolean;
  state: RetentionState;
  crisis: CrisisOfTheDay | null;
  progress: ProgressSnapshot;
  streakCopy: ReturnType<typeof streakRewardCopy>;
  nextPlay: NextPlayRec | null;
  returnBriefing: ReturnBriefing | null;
  weeklyDesk: WeeklyRunEntry[];
  fomo: FomoUrgency;
  streakBreak: ReturnType<typeof streakBreakPending>;
  theaters: HistoricalScenario[];
  getPersonalBest: (scenarioId: string) => PersonalBest | null;
  isDailyTheater: (scenarioId: string) => boolean;
  dailyMultiplier: (scenarioId: string) => number;
  cliffhanger: (scenarioId: string, lastFamily?: PathFamily | null) => ReturnType<typeof cliffhangerForTheater>;
  saveIncomplete: (run: IncompleteRun) => Promise<void>;
  clearIncomplete: () => Promise<void>;
  recordCompletion: (input: RecordCompletionInput) => Promise<{
    isNewBest: boolean;
    previousBest: PersonalBest | null;
    streak: number;
    deskTitle: string;
  }>;
  recommendAfter: (excludeId: string) => NextPlayRec | null;
  setReminderOptIn: (want: boolean) => Promise<{ status: ReminderStatus; detail?: string }>;
  /** Add one freeze charge after IAP. */
  grantStreakFreezeCharge: () => Promise<number>;
  /** Spend one freeze to repair a broken streak gap. */
  spendStreakFreeze: () => Promise<{ ok: boolean; charges: number; detail: string }>;
  setSoftWalled: (soft: boolean) => void;
};

const RetentionContext = createContext<RetentionApi | null>(null);

function normalizeState(raw: unknown): RetentionState {
  if (!raw || typeof raw !== 'object') return { ...EMPTY_RETENTION };
  const s = raw as Partial<RetentionState>;
  const reminderRaw = s.reminderStatus;
  const reminderStatus: ReminderStatus =
    reminderRaw === 'on' ||
    reminderRaw === 'denied' ||
    reminderRaw === 'unsupported' ||
    reminderRaw === 'unset'
      ? reminderRaw
      : 'unset';

  const weeklyRuns = Array.isArray(s.weeklyRuns)
    ? s.weeklyRuns.filter(
        (r): r is WeeklyRunEntry =>
          !!r &&
          typeof r === 'object' &&
          typeof (r as WeeklyRunEntry).day === 'string' &&
          typeof (r as WeeklyRunEntry).scenarioId === 'string' &&
          typeof (r as WeeklyRunEntry).title === 'string' &&
          typeof (r as WeeklyRunEntry).score === 'number' &&
          typeof (r as WeeklyRunEntry).grade === 'string',
      )
    : [];

  return {
    currentStreak: typeof s.currentStreak === 'number' ? s.currentStreak : 0,
    bestStreak: typeof s.bestStreak === 'number' ? s.bestStreak : 0,
    lastPlayDay: typeof s.lastPlayDay === 'string' ? s.lastPlayDay : null,
    deskTitle:
      typeof s.deskTitle === 'string' ? s.deskTitle : deskTitleForStreak(s.currentStreak ?? 0),
    completedTheaterIds: Array.isArray(s.completedTheaterIds)
      ? s.completedTheaterIds.filter((x): x is string => typeof x === 'string')
      : [],
    endingsUnlocked: Array.isArray(s.endingsUnlocked)
      ? (s.endingsUnlocked.filter((x) => typeof x === 'string') as PathFamily[])
      : [],
    theaterEndings:
      s.theaterEndings && typeof s.theaterEndings === 'object'
        ? (s.theaterEndings as Record<string, PathFamily[]>)
        : {},
    personalBests:
      s.personalBests && typeof s.personalBests === 'object'
        ? (s.personalBests as Record<string, PersonalBest>)
        : {},
    incompleteRun: s.incompleteRun && typeof s.incompleteRun === 'object' ? s.incompleteRun : null,
    lastCompletedTheaterId:
      typeof s.lastCompletedTheaterId === 'string' ? s.lastCompletedTheaterId : null,
    firstCompletionAt: typeof s.firstCompletionAt === 'string' ? s.firstCompletionAt : null,
    reminderStatus,
    weeklyRuns,
    streakFreezeCharges:
      typeof s.streakFreezeCharges === 'number' && s.streakFreezeCharges >= 0
        ? Math.floor(s.streakFreezeCharges)
        : 0,
  };
}

export function RetentionProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [state, setState] = useState<RetentionState>(EMPTY_RETENTION);
  const [softWalled, setSoftWalled] = useState(false);
  const [nowTick, setNowTick] = useState(() => Date.now());
  const theaters = useMemo(() => listHistoricalScenarios(), []);

  useEffect(() => {
    (async () => {
      try {
        const raw = await persistGet(STORAGE_KEY);
        if (raw) setState(normalizeState(JSON.parse(raw)));
      } catch {
        // ignore corrupt
      } finally {
        setReady(true);
      }
    })();
  }, []);

  // Refresh FOMO countdowns every minute (not every second — no spam).
  useEffect(() => {
    const id = setInterval(() => setNowTick(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const now = useMemo(() => new Date(nowTick), [nowTick]);
  const crisis = useMemo(() => pickCrisisOfTheDay(theaters, now), [theaters, now]);

  const progress = useMemo(() => progressSnapshot(state), [state]);

  const streakCopy = useMemo(
    () => streakRewardCopy(state.currentStreak, state.deskTitle),
    [state.currentStreak, state.deskTitle],
  );

  const nextPlay = useMemo(
    () => recommendNextPlay({ theaters, state, crisis }),
    [theaters, state, crisis],
  );

  const returnBriefing = useMemo(
    () => buildReturnBriefing({ state, theaters, now }),
    [state, theaters, now],
  );

  const weeklyDesk = useMemo(() => weeklyPersonalDesk(state.weeklyRuns, now), [state.weeklyRuns, now]);

  const fomo = useMemo(
    () => buildFomoUrgency({ crisis, state, softWalled, now }),
    [crisis, state, softWalled, now],
  );

  const streakBreak = useMemo(() => streakBreakPending(state, utcDayKey(now)), [state, now]);

  const getPersonalBest = useCallback(
    (scenarioId: string) => state.personalBests[scenarioId] ?? null,
    [state.personalBests],
  );

  const isDailyTheater = useCallback(
    (scenarioId: string) => crisis?.scenario.id === scenarioId,
    [crisis],
  );

  const dailyMultiplier = useCallback(
    (scenarioId: string) =>
      crisis?.scenario.id === scenarioId ? crisis.multiplier : 1,
    [crisis],
  );

  const cliffhanger = useCallback(
    (scenarioId: string, lastFamily?: PathFamily | null) =>
      cliffhangerForTheater(state, scenarioId, lastFamily),
    [state],
  );

  const saveIncomplete = useCallback(
    async (run: IncompleteRun) => {
      setState((prev) => {
        const same =
          prev.incompleteRun?.scenarioId === run.scenarioId &&
          prev.incompleteRun?.beatIndex === run.beatIndex &&
          prev.incompleteRun?.decisions.length === run.decisions.length;
        if (same) return prev;
        const next = { ...prev, incompleteRun: run };
        void persistSet(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    [],
  );

  const clearIncomplete = useCallback(async () => {
    setState((prev) => {
      if (!prev.incompleteRun) return prev;
      const next = { ...prev, incompleteRun: null };
      void persistSet(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const recordCompletion = useCallback(async (input: RecordCompletionInput) => {
    const day = utcDayKey();
    let snapshot: RetentionState | null = null;
    let result = {
      isNewBest: false,
      previousBest: null as PersonalBest | null,
      streak: 0,
      deskTitle: deskTitleForStreak(0),
    };

    setState((prev) => {
      if (snapshot) return snapshot; // Strict Mode double-invoke: reuse
      const streakPatch = applyPlayDayStreak(prev, day);
      const family =
        input.pathFamily && typeof input.pathFamily === 'string'
          ? (input.pathFamily as PathFamily)
          : null;

      const completed = prev.completedTheaterIds.includes(input.scenarioId)
        ? prev.completedTheaterIds
        : [...prev.completedTheaterIds, input.scenarioId];

      const endingsUnlocked =
        family && !prev.endingsUnlocked.includes(family)
          ? [...prev.endingsUnlocked, family]
          : prev.endingsUnlocked;

      const priorTheater = prev.theaterEndings[input.scenarioId] ?? [];
      const theaterEndings = { ...prev.theaterEndings };
      if (family && !priorTheater.includes(family)) {
        theaterEndings[input.scenarioId] = [...priorTheater, family];
      }

      const previousBest = prev.personalBests[input.scenarioId] ?? null;
      const isNewBest = !previousBest || input.score > previousBest.score;
      const personalBests = { ...prev.personalBests };
      if (isNewBest) {
        personalBests[input.scenarioId] = {
          score: input.score,
          grade: input.grade,
          pathFamily: family,
          at: new Date().toISOString(),
        };
      }

      const entry: WeeklyRunEntry = {
        day,
        scenarioId: input.scenarioId,
        title: input.title,
        score: input.score,
        grade: input.grade,
        at: new Date().toISOString(),
      };
      const weeklyRuns = [entry, ...prev.weeklyRuns].slice(0, WEEKLY_RUNS_CAP);

      snapshot = {
        ...prev,
        ...streakPatch,
        completedTheaterIds: completed,
        endingsUnlocked,
        theaterEndings,
        personalBests,
        incompleteRun: null,
        lastCompletedTheaterId: input.scenarioId,
        firstCompletionAt: prev.firstCompletionAt ?? new Date().toISOString(),
        weeklyRuns,
      };
      result = {
        isNewBest,
        previousBest,
        streak: snapshot.currentStreak,
        deskTitle: snapshot.deskTitle,
      };
      return snapshot;
    });

    if (snapshot) {
      await persistSet(STORAGE_KEY, JSON.stringify(snapshot));
      // Inject local PB into global board when this run is a theater best
      if (result.isNewBest) {
        const name = (input.playerName || 'You').slice(0, 24);
        await saveLocalLeaderboardPb({
          name,
          score: input.score,
          theater: input.title,
          path: (input.pathFamily as string) || 'mixed',
          at: new Date().toISOString(),
        });
      }
    }
    return result;
  }, []);

  const recommendAfter = useCallback(
    (excludeId: string) => recommendNextPlay({ theaters, state, crisis, excludeId }),
    [theaters, state, crisis],
  );

  const setReminderOptIn = useCallback(async (want: boolean) => {
    if (!want) {
      const res = await disableCrisisReminder();
      void res;
      setState((prev) => {
        const next = { ...prev, reminderStatus: 'unset' as ReminderStatus };
        void persistSet(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
      return { status: 'unset' as ReminderStatus, detail: 'Crisis alert cleared.' };
    }

    const res = await enableCrisisReminder();
    setState((prev) => {
      const next = { ...prev, reminderStatus: res.status };
      void persistSet(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    return res;
  }, []);

  const grantStreakFreezeCharge = useCallback(async () => {
    let charges = 0;
    setState((prev) => {
      charges = prev.streakFreezeCharges + 1;
      const next = { ...prev, streakFreezeCharges: charges };
      void persistSet(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    return charges;
  }, []);

  const spendStreakFreeze = useCallback(async () => {
    let out = { ok: false, charges: 0, detail: 'No freeze available.' };
    setState((prev) => {
      const patch = applyStreakFreezePatch(prev);
      if (!patch) {
        out = {
          ok: false,
          charges: prev.streakFreezeCharges,
          detail:
            prev.streakFreezeCharges < 1
              ? 'No streak-freeze charges. Buy one on the paywall.'
              : 'Streak is not broken — freeze not needed.',
        };
        return prev;
      }
      const next = { ...prev, ...patch };
      out = {
        ok: true,
        charges: next.streakFreezeCharges,
        detail: `Freeze spent · streak ${prev.currentStreak} preserved · ${next.streakFreezeCharges} left`,
      };
      void persistSet(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    return out;
  }, []);

  const value = useMemo<RetentionApi>(
    () => ({
      ready,
      state,
      crisis,
      progress,
      streakCopy,
      nextPlay,
      returnBriefing,
      weeklyDesk,
      fomo,
      streakBreak,
      theaters,
      getPersonalBest,
      isDailyTheater,
      dailyMultiplier,
      cliffhanger,
      saveIncomplete,
      clearIncomplete,
      recordCompletion,
      recommendAfter,
      setReminderOptIn,
      grantStreakFreezeCharge,
      spendStreakFreeze,
      setSoftWalled,
    }),
    [
      ready,
      state,
      crisis,
      progress,
      streakCopy,
      nextPlay,
      returnBriefing,
      weeklyDesk,
      fomo,
      streakBreak,
      theaters,
      getPersonalBest,
      isDailyTheater,
      dailyMultiplier,
      cliffhanger,
      saveIncomplete,
      clearIncomplete,
      recordCompletion,
      recommendAfter,
      setReminderOptIn,
      grantStreakFreezeCharge,
      spendStreakFreeze,
    ],
  );

  return <RetentionContext.Provider value={value}>{children}</RetentionContext.Provider>;
}

export function useRetention() {
  const ctx = useContext(RetentionContext);
  if (!ctx) throw new Error('useRetention must be used within RetentionProvider');
  return ctx;
}

/** Pure helper for scoring — apply Crisis of the Day multiplier. */
export function applyDailyScoreBonus(baseScore: number, multiplier: number): number {
  if (multiplier <= 1) return baseScore;
  return Math.min(99, Math.round(baseScore * multiplier));
}
