import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Scenario } from '@/data/scenarios';
import type { OpKind, TheaterDef } from '@/data/theaters';
import {
  formatCountdown,
  formatUpdatedAgo,
  loadWorldDesk,
  markScenarioSeen,
  refreshWorldDesk,
  type DeskSource,
} from '@/lib/worldDesk';
import {
  listEvergreenScenarios,
  resolveChoiceOp,
  resolveScenario,
  resolveTheater,
  setRotationBundle,
} from '@/lib/scenarioRegistry';

type WorldDeskState = {
  status: 'loading' | 'ready' | 'error';
  lastRefreshAt: number;
  nextRefreshAt: number;
  source: DeskSource;
  packLabel: string;
  packHook: string;
  updatedLabel: string;
  countdownLabel: string;
  evergreen: Scenario[];
  rotation: Scenario[];
  isNew: (scenarioId: string) => boolean;
  markSeen: (scenarioId: string) => Promise<void>;
  getScenario: (id: string) => Scenario | undefined;
  getTheater: (scenarioId: string) => TheaterDef | undefined;
  getChoiceOp: (choiceId: string) => { kind: OpKind; markerId: string; short: string } | undefined;
  refresh: () => Promise<void>;
};

const WorldDeskContext = createContext<WorldDeskState | null>(null);

export function WorldDeskProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [lastRefreshAt, setLastRefreshAt] = useState(0);
  const [nextRefreshAt, setNextRefreshAt] = useState(0);
  const [source, setSource] = useState<DeskSource>('mock');
  const [packLabel, setPackLabel] = useState('World desk');
  const [packHook, setPackHook] = useState('');
  const [rotation, setRotation] = useState<Scenario[]>([]);
  const [seenIds, setSeenIds] = useState<string[]>([]);
  const [tick, setTick] = useState(0);

  const applySnapshot = useCallback(
    (snap: Awaited<ReturnType<typeof loadWorldDesk>>) => {
      setRotationBundle(snap.bundle);
      setLastRefreshAt(snap.lastRefreshAt);
      setNextRefreshAt(snap.nextRefreshAt);
      setSource(snap.source);
      setPackLabel(snap.bundle.label);
      setPackHook(snap.bundle.hook);
      setRotation(snap.bundle.scenarios);
      setSeenIds(snap.seenIds);
      setStatus('ready');
    },
    [],
  );

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const snap = await loadWorldDesk();
        if (!alive) return;
        applySnapshot(snap);
      } catch {
        if (alive) setStatus('error');
      }
    })();
    return () => {
      alive = false;
    };
  }, [applySnapshot]);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  const refresh = useCallback(async () => {
    setStatus('loading');
    try {
      const snap = await refreshWorldDesk();
      applySnapshot(snap);
    } catch {
      setStatus('error');
    }
  }, [applySnapshot]);

  const markSeen = useCallback(async (scenarioId: string) => {
    const next = await markScenarioSeen(scenarioId);
    setSeenIds(next);
  }, []);

  const value = useMemo<WorldDeskState>(() => {
    void tick;
    const now = Date.now();
    return {
      status,
      lastRefreshAt,
      nextRefreshAt,
      source,
      packLabel,
      packHook,
      updatedLabel: lastRefreshAt ? formatUpdatedAgo(lastRefreshAt, now) : 'warming up',
      countdownLabel: nextRefreshAt ? formatCountdown(nextRefreshAt, now) : '…',
      evergreen: listEvergreenScenarios(),
      rotation,
      isNew: (id) => rotation.some((s) => s.id === id) && !seenIds.includes(id),
      markSeen,
      getScenario: resolveScenario,
      getTheater: resolveTheater,
      getChoiceOp: resolveChoiceOp,
      refresh,
    };
  }, [
    status,
    lastRefreshAt,
    nextRefreshAt,
    source,
    packLabel,
    packHook,
    rotation,
    seenIds,
    markSeen,
    refresh,
    tick,
  ]);

  return <WorldDeskContext.Provider value={value}>{children}</WorldDeskContext.Provider>;
}

export function useWorldDesk() {
  const ctx = useContext(WorldDeskContext);
  if (!ctx) throw new Error('useWorldDesk must be used within WorldDeskProvider');
  return ctx;
}
