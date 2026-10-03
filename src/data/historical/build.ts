import type { Beat, Choice, Scenario } from '@/data/scenarios';
import type { OpKind, TheaterDef } from '@/data/theaters';
import {
  buildTheaterFromArchetype,
  type TheaterArchetype,
} from '@/data/theaterTemplates';

export type HistoricalChoice = Choice & {
  kind: OpKind;
  markerId: string;
  short: string;
};

export type HistoricalBeat = Omit<Beat, 'choices'> & {
  choices: HistoricalChoice[];
};

export type HistoricalScenario = Omit<Scenario, 'beats' | 'theaterArchetype'> & {
  year: number;
  era: string;
  theaterArchetype: TheaterArchetype;
  beats: HistoricalBeat[];
};

export type HistoricalBundle = {
  scenarios: Scenario[];
  theaters: TheaterDef[];
  ops: Record<string, { kind: OpKind; markerId: string; short: string }>;
};

function stripChoice(choice: HistoricalChoice): Choice {
  const { kind: _kind, markerId: _markerId, short: _short, ...rest } = choice;
  return rest;
}

export function buildHistoricalBundle(
  scenarios: HistoricalScenario[],
): HistoricalBundle {
  const ops: Record<string, { kind: OpKind; markerId: string; short: string }> = {};
  const cleaned: Scenario[] = [];
  const theaters: TheaterDef[] = [];

  for (const scenario of scenarios) {
    const archetype = scenario.theaterArchetype;
    for (const beat of scenario.beats) {
      for (const choice of beat.choices) {
        ops[choice.id] = {
          kind: choice.kind,
          markerId: choice.markerId,
          short: choice.short,
        };
      }
    }

    cleaned.push({
      id: scenario.id,
      title: scenario.title,
      region: scenario.region,
      premise: scenario.premise,
      role: scenario.role,
      tension: scenario.tension,
      meterFamily: scenario.meterFamily,
      theaterArchetype: archetype,
      evergreen: scenario.evergreen,
      packId: scenario.packId,
      generatedAt: scenario.generatedAt,
      beats: scenario.beats.map((beat) => ({
        id: beat.id,
        title: beat.title,
        briefing: beat.briefing,
        stakes: beat.stakes,
        choices: beat.choices.map(stripChoice),
      })),
    });

    const theater = buildTheaterFromArchetype(archetype, scenario.id, scenario.title);
    theater.subtitle = scenario.region.length > 48
      ? `${scenario.region.slice(0, 45).trim()}…`
      : scenario.region;
    theaters.push(theater);
  }

  return { scenarios: cleaned, theaters, ops };
}
