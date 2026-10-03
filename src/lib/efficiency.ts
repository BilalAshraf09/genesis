import type { MeterFamily, Scenario } from '@/data/scenarios';
import type { DecisionRecord } from '@/lib/evaluate';

/**
 * Efficiency scoring model (not moral correctness):
 *
 * Axes (0–100 each, then weighted):
 * 1. Objective progress — meterFamily-weighted gains in diplomacy / deterrence /
 *    governability / market_stability (and related constructive tags).
 * 2. Cost discipline — penalize high escalation, civilian_cost, polarization,
 *    norm_erosion (and far_right_momentum when present).
 * 3. Option value preserved — reward diplomacy, time, alliance_cohesion (keeps
 *    future moves available).
 * 4. Path coherence — penalize large contradictory swings (e.g. stacking both
 *    heavy escalation and heavy de-escalatory diplomacy without bridging).
 *
 * Weights by meterFamily (progress / cost / option / coherence):
 *   conflict → 0.32 / 0.28 / 0.22 / 0.18
 *   politics → 0.30 / 0.26 / 0.24 / 0.20
 *   economy  → 0.34 / 0.24 / 0.24 / 0.18
 *
 * Total clamped 0–100. Grades: A≥90, A-≥85, B+≥80, B≥75, B-≥70,
 * C+≥65, C≥60, C-≥55, D≥45, else F.
 */

export type EfficiencyBreakdown = {
  total: number; // 0-100
  grade: string; // A+ .. F
  axes: { id: string; label: string; score: number; note: string }[];
  summary: string; // explains efficiency ≠ moral correctness
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function aggregateTags(decisions: DecisionRecord[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const d of decisions) {
    for (const effect of d.choice.effects) {
      map.set(effect.tag, (map.get(effect.tag) ?? 0) + effect.weight);
    }
  }
  return map;
}

function get(tags: Map<string, number>, tag: string) {
  return tags.get(tag) ?? 0;
}

function resolveFamily(scenario: Scenario): MeterFamily {
  if (scenario.meterFamily) return scenario.meterFamily;
  if (scenario.id === 'europe-far-right') return 'politics';
  return 'conflict';
}

function gradeFromTotal(total: number): string {
  if (total >= 90) return 'A';
  if (total >= 85) return 'A-';
  if (total >= 80) return 'B+';
  if (total >= 75) return 'B';
  if (total >= 70) return 'B-';
  if (total >= 65) return 'C+';
  if (total >= 60) return 'C';
  if (total >= 55) return 'C-';
  if (total >= 45) return 'D';
  return 'F';
}

function weightsFor(family: MeterFamily): [number, number, number, number] {
  if (family === 'politics') return [0.3, 0.26, 0.24, 0.2];
  if (family === 'economy') return [0.34, 0.24, 0.24, 0.18];
  return [0.32, 0.28, 0.22, 0.18];
}

function scoreObjectiveProgress(family: MeterFamily, tags: Map<string, number>): { score: number; note: string } {
  if (family === 'conflict') {
    const raw =
      get(tags, 'diplomacy') * 10 +
      get(tags, 'deterrence') * 9 +
      get(tags, 'credibility') * 4 +
      get(tags, 'alliance_cohesion') * 5 -
      Math.max(0, get(tags, 'escalation') - get(tags, 'deterrence')) * 3;
    const score = clamp(48 + raw, 5, 95);
    return {
      score,
      note:
        get(tags, 'diplomacy') + get(tags, 'deterrence') >= 4
          ? 'Crisis objectives advanced through a mix of bargaining and posture.'
          : 'Limited measurable progress on conflict objectives relative to costs taken.',
    };
  }

  if (family === 'economy') {
    const raw =
      get(tags, 'market_stability') * 12 +
      get(tags, 'credibility') * 6 +
      get(tags, 'diplomacy') * 4 +
      get(tags, 'alliance_cohesion') * 3 -
      Math.max(0, get(tags, 'economic_pressure')) * 2;
    const score = clamp(46 + raw, 5, 95);
    return {
      score,
      note:
        get(tags, 'market_stability') >= 2
          ? 'Liquidity and confidence instruments moved the tape toward order.'
          : 'Market and policy objectives remain only partially secured.',
    };
  }

  const raw =
    get(tags, 'governability') * 12 +
    get(tags, 'norm_protection') * 8 +
    get(tags, 'eu_cohesion') * 6 +
    get(tags, 'alliance_cohesion') * 4 +
    get(tags, 'liberal_trust') * 3 -
    get(tags, 'norm_erosion') * 5;
  const score = clamp(48 + raw, 5, 95);
  return {
    score,
    note:
      get(tags, 'governability') >= 2
        ? 'Institutional capacity and governing path improved across the run.'
        : 'Political objectives advanced unevenly; governability remains contested.',
  };
}

function scoreCostDiscipline(family: MeterFamily, tags: Map<string, number>): { score: number; note: string } {
  const cost =
    get(tags, 'escalation') * 8 +
    get(tags, 'civilian_cost') * 10 +
    get(tags, 'polarization') * 9 +
    get(tags, 'norm_erosion') * 9 +
    get(tags, 'far_right_momentum') * 7 +
    (family === 'economy' ? Math.max(0, -get(tags, 'social_calm')) * 6 : 0);
  const score = clamp(88 - cost, 5, 95);
  return {
    score,
    note:
      cost >= 20
        ? 'High spillover costs (escalation, civilians, norms, or polarization) dominate the path.'
        : cost >= 8
          ? 'Moderate cost accumulation; several choices spent credibility or social capital.'
          : 'Costs stayed comparatively contained relative to the crisis intensity.',
  };
}

function scoreOptionValue(tags: Map<string, number>): { score: number; note: string } {
  const raw =
    get(tags, 'diplomacy') * 9 +
    get(tags, 'time') * 10 +
    get(tags, 'alliance_cohesion') * 8 -
    Math.max(0, get(tags, 'escalation') - 2) * 4;
  const score = clamp(45 + raw, 5, 95);
  return {
    score,
    note:
      get(tags, 'diplomacy') + get(tags, 'time') + get(tags, 'alliance_cohesion') >= 4
        ? 'Off-ramps, clocks, and partner bandwidth remained usable late in the crisis.'
        : 'Option value narrowed; later beats had fewer reversible instruments.',
  };
}

function scorePathCoherence(decisions: DecisionRecord[], tags: Map<string, number>): { score: number; note: string } {
  if (decisions.length < 2) {
    return { score: 70, note: 'Too few decisions to judge path coherence.' };
  }

  let swingPenalty = 0;
  let priorEscalatory: number | null = null;

  for (const d of decisions) {
    let escalatory = 0;
    let deescalatory = 0;
    for (const e of d.choice.effects) {
      if (e.tag === 'escalation' || e.tag === 'economic_pressure' || e.tag === 'polarization') {
        escalatory += Math.max(0, e.weight);
      }
      if (e.tag === 'diplomacy' || e.tag === 'time' || e.tag === 'social_calm' || e.tag === 'norm_protection') {
        deescalatory += Math.max(0, e.weight);
      }
    }
    const net = escalatory - deescalatory;
    if (priorEscalatory !== null && Math.abs(net - priorEscalatory) >= 4) {
      swingPenalty += 8;
    }
    priorEscalatory = net;
  }

  // Simultaneous high escalation and high diplomacy without bridging time/alliance
  const contradiction =
    get(tags, 'escalation') >= 4 &&
    get(tags, 'diplomacy') >= 4 &&
    get(tags, 'time') + get(tags, 'alliance_cohesion') < 2
      ? 12
      : 0;

  const score = clamp(82 - swingPenalty - contradiction, 5, 95);
  return {
    score,
    note:
      swingPenalty + contradiction >= 16
        ? 'The path zig-zagged between incompatible postures without bridging moves.'
        : swingPenalty >= 8
          ? 'Some abrupt reversals reduced readability for partners and adversaries.'
          : 'Sequencing stayed reasonably coherent across beats.',
  };
}

export function scoreEfficiency(scenario: Scenario, decisions: DecisionRecord[]): EfficiencyBreakdown {
  const family = resolveFamily(scenario);
  const tags = aggregateTags(decisions);
  const [wProg, wCost, wOpt, wCoh] = weightsFor(family);

  const progress = scoreObjectiveProgress(family, tags);
  const cost = scoreCostDiscipline(family, tags);
  const option = scoreOptionValue(tags);
  const coherence = scorePathCoherence(decisions, tags);

  const total = clamp(
    Math.round(
      progress.score * wProg + cost.score * wCost + option.score * wOpt + coherence.score * wCoh,
    ),
    0,
    100,
  );

  const axes = [
    { id: 'progress', label: 'Objective progress', score: progress.score, note: progress.note },
    { id: 'cost', label: 'Cost discipline', score: cost.score, note: cost.note },
    { id: 'option', label: 'Option value preserved', score: option.score, note: option.note },
    { id: 'coherence', label: 'Path coherence', score: coherence.score, note: coherence.note },
  ];

  const summary =
    `Efficiency score ${total} (${gradeFromTotal(total)}) measures how cleanly this path advanced ` +
    `${family} objectives while conserving costs, future options, and coherent sequencing. ` +
    `It is not a verdict on moral correctness, justice, or which ideology should prevail — ` +
    `different cabinets can rationally prefer lower-efficiency paths that protect non-efficiency values.`;

  return {
    total,
    grade: gradeFromTotal(total),
    axes,
    summary,
  };
}
