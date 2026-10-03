import type { Scenario } from '@/data/scenarios';
import type { DecisionRecord, EvaluationResult } from '@/lib/evaluate';
import type { EfficiencyBreakdown } from '@/lib/efficiency';
import { buildShareableInviteLine } from '@/lib/inviteLinks';
import { buildChallengeShareText } from '@/retention/algo';

export type ScorePolarity = {
  tag: string;
  summary: string;
  weight: number;
  move: number;
};

export type OverallScore = {
  /** Memorable 0–100 overall score */
  score: number;
  grade: string;
  label: string;
  pathFamily: string | null;
  topGain: ScorePolarity | null;
  topCost: ScorePolarity | null;
  /** Ready-to-paste social blurb (challenge invite). */
  shareText: string;
  /** Explicit challenge line for viral CTA. */
  challengeText: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function gradeFromScore(total: number): string {
  if (total >= 93) return 'A+';
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

function topPolarities(decisions: DecisionRecord[]): {
  topGain: ScorePolarity | null;
  topCost: ScorePolarity | null;
  net: number;
} {
  let topGain: ScorePolarity | null = null;
  let topCost: ScorePolarity | null = null;
  let net = 0;

  decisions.forEach((d, i) => {
    for (const e of d.choice.effects) {
      net += e.weight;
      const pill: ScorePolarity = {
        tag: e.tag,
        summary: e.summary,
        weight: e.weight,
        move: i + 1,
      };
      if (e.weight > 0 && (!topGain || e.weight > topGain.weight)) topGain = pill;
      if (e.weight < 0 && (!topCost || e.weight < topCost.weight)) topCost = pill;
    }
  });

  return { topGain, topCost, net };
}

/** Small deterministic family fingerprint so paths with similar efficiency still diverge. */
function familyBias(pathFamily: string | undefined): number {
  switch (pathFamily) {
    case 'diplomatic':
      return 3;
    case 'delay':
      return 1;
    case 'kinetic':
    case 'force_order':
      return -2;
    case 'economic':
      return 2;
    case 'political_norms':
      return 2;
    case 'political_hardline':
      return -3;
    case 'political_stalemate':
      return -1;
    case 'mixed':
      return 0;
    default:
      return 0;
  }
}

/**
 * Overall cabinet score — memorable single number for share.
 * Weighted blend of efficiency, evaluation axes, and net gains/costs.
 * Deterministic for the same decisions.
 */
export function computeOverallScore(opts: {
  scenario: Scenario;
  decisions: DecisionRecord[];
  evaluation: EvaluationResult;
  efficiency: EfficiencyBreakdown;
  year: number;
  /** Crisis of the Day multiplier (default 1). */
  dailyMultiplier?: number;
}): OverallScore {
  const { scenario, decisions, evaluation, efficiency, year } = opts;
  const mult = opts.dailyMultiplier && opts.dailyMultiplier > 1 ? opts.dailyMultiplier : 1;
  const { topGain, topCost, net } = topPolarities(decisions);

  const axisAvg =
    evaluation.axes.length > 0
      ? evaluation.axes.reduce((s, a) => s + a.score, 0) / evaluation.axes.length
      : 50;

  // Net polarity: typical 10-move nets land roughly -20..+20
  const polarityScore = clamp(50 + net * 2.2, 8, 92);
  const bias = familyBias(evaluation.pathFamily);

  const raw =
    efficiency.total * 0.52 +
    axisAvg * 0.28 +
    polarityScore * 0.2 +
    bias;

  const base = clamp(Math.round(raw), 1, 99);
  const score = mult > 1 ? clamp(Math.round(base * mult), 1, 99) : base;
  const grade = gradeFromScore(score);
  const pathFamily = evaluation.pathFamily ?? null;

  const gainLine = topGain
    ? `▲ ${topGain.tag.replace(/_/g, ' ')} +${topGain.weight}`
    : '▲ no clear gain';
  const costLine = topCost
    ? `▼ ${topCost.tag.replace(/_/g, ' ')} ${topCost.weight}`
    : '▼ no hard cost';

  const bonusLine = mult > 1 ? `Crisis of the Day ×${mult.toFixed(2)}` : null;

  const inviteLine = buildShareableInviteLine({
    theaterId: scenario.id,
    score,
    pathFamily,
    year,
    title: scenario.title,
    from: 'cabinet',
  });

  const challengeText = buildChallengeShareText({
    theaterTitle: scenario.title,
    year,
    score,
    grade,
    pathFamily,
    headline: evaluation.headline,
    theaterId: scenario.id,
    inviteLine,
  });

  const shareText = [
    challengeText,
    bonusLine ? `Bonus applied: ${bonusLine}` : null,
    `${gainLine} · ${costLine}`,
  ]
    .filter(Boolean)
    .join('\n');

  return {
    score,
    grade,
    label: 'CABINET SCORE',
    pathFamily,
    topGain,
    topCost,
    shareText,
    challengeText,
  };
}
