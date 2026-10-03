import type { Choice, MeterFamily, Scenario } from '@/data/scenarios';
import type { DecisionRecord } from '@/lib/evaluate';

export type LiveMeter = {
  id: string;
  label: string;
  value: number;
  tone: 'neutral' | 'warn' | 'hot' | 'good';
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function tagWeight(decisions: DecisionRecord[], tag: string) {
  return decisions.reduce((sum, d) => {
    return (
      sum +
      d.choice.effects
        .filter((e) => e.tag === tag)
        .reduce((s, e) => s + e.weight, 0)
    );
  }, 0);
}

function familyOf(scenario: Scenario): MeterFamily {
  if (scenario.meterFamily) return scenario.meterFamily;
  if (scenario.id === 'europe-far-right') return 'politics';
  if (scenario.id === 'iran-escalation') return 'conflict';
  return 'conflict';
}

export function computeLiveMeters(
  scenario: Scenario,
  decisions: DecisionRecord[],
  pending?: Choice | null,
): LiveMeter[] {
  const all: DecisionRecord[] = pending
    ? [
        ...decisions,
        {
          beatId: '__pending__',
          beatTitle: 'pending',
          choice: pending,
        },
      ]
    : decisions;

  const get = (tag: string) => tagWeight(all, tag);
  const family = familyOf(scenario);

  if (family === 'politics') {
    const governability = get('governability');
    const norms = get('norm_protection') - get('norm_erosion');
    const polarization = get('polarization') + get('far_right_momentum');
    const external = get('eu_cohesion') + get('alliance_cohesion') + get('diplomacy') * 0.5;

    return [
      {
        id: 'governability',
        label: 'Govern',
        value: clamp(46 + governability * 13, 8, 96),
        tone: governability >= 2 ? 'good' : governability < 0 ? 'warn' : 'neutral',
      },
      {
        id: 'norms',
        label: 'Norms',
        value: clamp(50 + norms * 11 - get('far_right_momentum') * 5, 8, 96),
        tone: norms >= 1 ? 'good' : norms < 0 ? 'hot' : 'neutral',
      },
      {
        id: 'polarization',
        label: 'Polarize',
        value: clamp(36 + polarization * 10, 8, 96),
        tone: polarization >= 3 ? 'hot' : polarization >= 1 ? 'warn' : 'neutral',
      },
      {
        id: 'external',
        label: 'External',
        value: clamp(54 + external * 8, 8, 96),
        tone: external >= 2 ? 'good' : external < 0 ? 'warn' : 'neutral',
      },
    ];
  }

  if (family === 'economy') {
    const markets = get('market_stability');
    const pressure = get('economic_pressure');
    const social = get('social_calm') - get('polarization');
    const credibility = get('credibility') + get('diplomacy') * 0.5;

    return [
      {
        id: 'markets',
        label: 'Markets',
        value: clamp(48 + markets * 12 - pressure * 4, 8, 96),
        tone: markets >= 2 ? 'good' : markets < 0 ? 'hot' : 'neutral',
      },
      {
        id: 'liquidity',
        label: 'Liquidity',
        value: clamp(50 + markets * 8 + get('time') * 4, 8, 96),
        tone: markets >= 1 ? 'good' : 'warn',
      },
      {
        id: 'social',
        label: 'Social',
        value: clamp(48 + social * 10, 8, 96),
        tone: social >= 1 ? 'good' : social < 0 ? 'warn' : 'neutral',
      },
      {
        id: 'credibility',
        label: 'Credibility',
        value: clamp(50 + credibility * 8, 8, 96),
        tone: credibility >= 2 ? 'good' : credibility < 0 ? 'warn' : 'neutral',
      },
    ];
  }

  // conflict default
  const escalation = get('escalation');
  const diplomacy = get('diplomacy');
  const deterrence = get('deterrence');
  const markets = get('market_stability') + get('economic_pressure') * 0.3;
  const cohesion = get('alliance_cohesion');

  return [
    {
      id: 'escalation',
      label: 'Escalation',
      value: clamp(38 + escalation * 11 - diplomacy * 7, 8, 96),
      tone: escalation >= 3 ? 'hot' : escalation >= 1 ? 'warn' : 'neutral',
    },
    {
      id: 'deterrence',
      label: 'Deterrence',
      value: clamp(42 + deterrence * 10, 8, 96),
      tone: deterrence >= 2 ? 'good' : 'neutral',
    },
    {
      id: 'markets',
      label: 'Markets',
      value: clamp(52 + markets * 9 - escalation * 5, 8, 96),
      tone: markets >= 1 ? 'good' : escalation >= 2 ? 'warn' : 'neutral',
    },
    {
      id: 'cohesion',
      label: 'Cohesion',
      value: clamp(48 + cohesion * 12, 8, 96),
      tone: cohesion >= 2 ? 'good' : cohesion < 0 ? 'warn' : 'neutral',
    },
  ];
}
