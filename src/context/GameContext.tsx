import React, { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Choice } from '@/data/scenarios';
import type { DecisionRecord, EvaluationResult } from '@/lib/evaluate';

type GameState = {
  scenarioId: string | null;
  decisions: DecisionRecord[];
  evaluation: EvaluationResult | null;
  setScenario: (id: string) => void;
  /** Resume an unfinished theater without wiping mid-run decisions. */
  resumeScenario: (id: string, decisions: DecisionRecord[]) => void;
  recordDecision: (beatId: string, beatTitle: string, choice: Choice) => void;
  replaceDecisions: (next: DecisionRecord[]) => void;
  setEvaluation: (result: EvaluationResult | null) => void;
  resetRun: () => void;
};

const GameContext = createContext<GameState | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [decisions, setDecisions] = useState<DecisionRecord[]>([]);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  const value = useMemo<GameState>(
    () => ({
      scenarioId,
      decisions,
      evaluation,
      setScenario: (id: string) => {
        setScenarioId(id);
        setDecisions([]);
        setEvaluation(null);
      },
      resumeScenario: (id, next) => {
        setScenarioId(id);
        setDecisions(next);
        setEvaluation(null);
      },
      recordDecision: (beatId, beatTitle, choice) => {
        setDecisions((prev) => {
          const without = prev.filter((d) => d.beatId !== beatId);
          return [...without, { beatId, beatTitle, choice }];
        });
      },
      replaceDecisions: (next) => setDecisions(next),
      setEvaluation,
      resetRun: () => {
        setScenarioId(null);
        setDecisions([]);
        setEvaluation(null);
      },
    }),
    [scenarioId, decisions, evaluation],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
