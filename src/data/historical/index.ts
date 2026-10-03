import type { TheaterArchetype } from '@/data/theaterTemplates';
import { historicalScenarios } from '@/data/historical/catalog';
import {
  buildHistoricalBundle,
  type HistoricalBundle,
  type HistoricalScenario,
} from '@/data/historical/build';

export type { HistoricalScenario, HistoricalBundle, HistoricalChoice, HistoricalBeat } from '@/data/historical/build';
export { historicalScenarios, getHistoricalScenario } from '@/data/historical/catalog';
export { buildHistoricalBundle } from '@/data/historical/build';

export const historicalBundle: HistoricalBundle = buildHistoricalBundle(historicalScenarios);

export function listHistoricalScenarios(): HistoricalScenario[] {
  return historicalScenarios;
}

export function listHistoricalByEra(era: string): HistoricalScenario[] {
  return historicalScenarios.filter((s) => s.era === era);
}

export const HISTORICAL_ERAS = [
  '1900–1914',
  '1914–1918',
  '1919–1939',
  '1939–1945',
  '1945–1962',
  '1962–1979',
  '1979–1991',
  '1991–2008',
  '2008–2026',
] as const;

export type HistoricalEra = (typeof HISTORICAL_ERAS)[number];

export function theaterArchetypeOf(scenario: HistoricalScenario): TheaterArchetype {
  return scenario.theaterArchetype;
}
