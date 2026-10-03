import type { Scenario } from '@/data/scenarios';
import type { OpKind, TheaterDef } from '@/data/theaters';
import { historicalBundle, listHistoricalScenarios, type HistoricalScenario } from '@/data/historical';

export function listTimelineScenarios(): HistoricalScenario[] {
  return listHistoricalScenarios();
}

export function resolveScenario(id: string): Scenario | undefined {
  return historicalBundle.scenarios.find((s) => s.id === id);
}

export function resolveTheater(scenarioId: string): TheaterDef | undefined {
  return historicalBundle.theaters.find((t) => t.scenarioId === scenarioId);
}

export function resolveChoiceOp(
  choiceId: string,
): { kind: OpKind; markerId: string; short: string } | undefined {
  return historicalBundle.ops[choiceId];
}

/** @deprecated World desk removed — kept as no-op for any stray imports. */
export function setRotationBundle(_bundle: unknown) {}
export function listEvergreenScenarios(): Scenario[] {
  return [];
}
export function listRotationScenarios(): Scenario[] {
  return [];
}
