import type { Choice, MeterFamily, Scenario } from '@/data/scenarios';
import { resolveChoiceOp } from '@/lib/scenarioRegistry';

export type DecisionRecord = {
  beatId: string;
  beatTitle: string;
  choice: Choice;
};

export type EvaluationResult = {
  headline: string;
  narrative: string;
  axes: { label: string; score: number; note: string }[];
  warnings: string[];
  source: 'mock' | 'api';
  /** Deterministic path family id — useful for tests / debugging */
  pathFamily?: string;
};

/**
 * Distinct after-action families players can hit.
 * Conflict theaters: kinetic / diplomatic / delay / economic / mixed
 * Politics theaters: also force_order + the political_* set
 */
export type PathFamily =
  | 'kinetic'
  | 'diplomatic'
  | 'delay'
  | 'economic'
  | 'mixed'
  | 'force_order'
  | 'political_hardline'
  | 'political_norms'
  | 'political_stalemate';

function aggregateTags(decisions: DecisionRecord[]): Map<string, { weight: number; notes: string[] }> {
  const map = new Map<string, { weight: number; notes: string[] }>();
  for (const d of decisions) {
    for (const effect of d.choice.effects) {
      const existing = map.get(effect.tag) ?? { weight: 0, notes: [] };
      existing.weight += effect.weight;
      existing.notes.push(effect.summary);
      map.set(effect.tag, existing);
    }
  }
  return map;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function getW(tags: Map<string, { weight: number; notes: string[] }>, tag: string) {
  return tags.get(tag)?.weight ?? 0;
}

function resolveFamily(scenario: Scenario): MeterFamily {
  if (scenario.meterFamily) return scenario.meterFamily;
  if (scenario.id === 'europe-far-right') return 'politics';
  if (scenario.id === 'iran-escalation') return 'conflict';
  return 'conflict';
}

/** Prefer ops-registry kind (historical strip kind off Choice). */
function choiceKind(choice: Choice): string {
  const op = resolveChoiceOp(choice.id);
  if (op?.kind) return op.kind;
  return (choice as Choice & { kind?: string }).kind ?? 'unknown';
}

function kindCounts(decisions: DecisionRecord[]) {
  const counts: Record<string, number> = {};
  for (const d of decisions) {
    const k = choiceKind(d.choice);
    counts[k] = (counts[k] ?? 0) + 1;
  }
  return counts;
}

type Signal = {
  kinetic: number;
  diplomatic: number;
  delay: number;
  economic: number;
  politicalHard: number;
  politicalNorm: number;
  forceOrder: number;
};

function buildSignals(
  tags: Map<string, { weight: number; notes: string[] }>,
  decisions: DecisionRecord[],
): Signal {
  const kinds = kindCounts(decisions);
  const kineticKind = (kinds.kinetic ?? 0) + (kinds.naval ?? 0) * 0.65;
  const diploKind = (kinds.diplomatic ?? 0) + (kinds.political ?? 0) * 0.3;
  const delayKind = (kinds.legal ?? 0) * 0.8 + (kinds.civic ?? 0) * 0.5;
  const econKind = kinds.economic ?? 0;

  // Label heuristics when kinds are sparse
  let labelKinetic = 0;
  let labelDiplo = 0;
  let labelDelay = 0;
  for (const d of decisions) {
    const t = `${d.choice.label} ${d.choice.detail}`.toLowerCase();
    if (/surge|force|strike|troop|army|fire|combat|ground|kinetic|raid/.test(t)) labelKinetic += 1;
    if (/diplom|mediat|negot|talk|appeal|pact|forum|table/.test(t)) labelDiplo += 1;
    if (/delay|phase|wait|pause|investig|hedge|quiet|time|defer/.test(t)) labelDelay += 1;
  }

  const escalation = getW(tags, 'escalation');
  const deterrence = getW(tags, 'deterrence');
  const diplomacy = getW(tags, 'diplomacy');
  const time = getW(tags, 'time');
  const alliance = getW(tags, 'alliance_cohesion');
  const pressure = getW(tags, 'economic_pressure');
  const markets = getW(tags, 'market_stability');
  const civilian = getW(tags, 'civilian_cost');
  const polar = getW(tags, 'polarization') + getW(tags, 'far_right_momentum');
  const norms = getW(tags, 'norm_protection') - getW(tags, 'norm_erosion');
  const govern = getW(tags, 'governability');

  const kinetic =
    escalation * 1.35 +
    deterrence * 0.55 +
    Math.max(0, civilian) * 0.45 +
    kineticKind * 2.4 +
    labelKinetic * 1.6 -
    diplomacy * 0.25 -
    Math.max(0, -escalation) * 0.4;

  // Pure process/forums — not the same as armistice/pause clocks
  const diplomatic =
    diplomacy * 1.25 +
    alliance * 0.9 +
    getW(tags, 'credibility') * 0.35 +
    diploKind * 1.7 +
    labelDiplo * 1.3 -
    Math.max(0, escalation) * 0.35 -
    Math.max(0, -escalation) * 0.45 -
    time * 0.25;

  // Clocks, freezes, pauses, inquiry — distinct from “thicker diplomatic ladder”
  const delay =
    time * 2.1 +
    Math.max(0, -escalation) * 1.7 +
    delayKind * 2.4 +
    labelDelay * 2.1 +
    (kinds.diplomatic ?? 0) * 0.15 -
    kineticKind * 1.1 -
    labelKinetic * 0.7 -
    Math.max(0, escalation) * 0.6;

  return {
    kinetic,
    diplomatic,
    delay,
    economic: pressure * 1.25 + markets * 1.05 + econKind * 2.3,
    politicalHard: polar * 1.35 + getW(tags, 'norm_erosion') * 1.4 + Math.max(0, -norms) * 1.1 + govern * 0.35,
    politicalNorm: Math.max(0, norms) * 1.5 + getW(tags, 'liberal_trust') * 1 + getW(tags, 'eu_cohesion') * 0.8 - polar * 0.45,
    // Politics theaters with kinetic ops (e.g. Partition SURGE)
    forceOrder: kinetic * 0.85 + Math.max(0, -civilian) * 0.4 + govern * 0.5 - polar * 0.3,
  };
}

function leadOf(
  ranked: { id: PathFamily; v: number }[],
  minLead = 1.6,
  minAbs = 3.2,
): PathFamily {
  ranked.sort((a, b) => b.v - a.v);
  const top = ranked[0];
  const second = ranked[1];
  if (top.v < minAbs) return 'mixed';
  if (top.v - second.v < minLead) return 'mixed';
  return top.id;
}

function pickConflictFamily(
  s: Signal,
  tags?: Map<string, { weight: number; notes: string[] }>,
): PathFamily {
  // Explicit restraint/clock path — armistice/pause stacks are not “diplomatic ladder”
  if (tags) {
    const time = getW(tags, 'time');
    const esc = getW(tags, 'escalation');
    if (time >= 5 && esc <= 0 && s.kinetic < 7) {
      return 'delay';
    }
    if (time >= 4 && esc <= -4 && s.kinetic < 8) {
      return 'delay';
    }
    if (
      time >= 3 &&
      esc <= -3 &&
      s.delay >= s.diplomatic * 0.82 &&
      s.delay >= s.kinetic &&
      s.delay + 1 >= s.economic
    ) {
      return 'delay';
    }
  }
  return leadOf([
    { id: 'kinetic', v: s.kinetic },
    { id: 'diplomatic', v: s.diplomatic },
    { id: 'delay', v: s.delay },
    { id: 'economic', v: s.economic },
  ]);
}

function pickPoliticsFamily(s: Signal, tags: Map<string, { weight: number; notes: string[] }>): PathFamily {
  // Crisis-politics (Partition etc.): allow instrument families first when strong
  const instrument = leadOf(
    [
      { id: 'force_order', v: s.forceOrder },
      { id: 'diplomatic', v: s.diplomatic },
      { id: 'delay', v: s.delay },
      { id: 'economic', v: s.economic },
      { id: 'political_hardline', v: s.politicalHard },
      { id: 'political_norms', v: s.politicalNorm },
    ],
    1.4,
    3.0,
  );
  if (instrument !== 'mixed') return instrument;

  const govern = getW(tags, 'governability');
  if (s.politicalHard >= s.politicalNorm + 1.5 && s.politicalHard >= 2.5) return 'political_hardline';
  if (s.politicalNorm >= s.politicalHard + 1.2 && s.politicalNorm >= 2) return 'political_norms';
  if (govern <= -1) return 'political_stalemate';
  if (s.politicalHard > s.politicalNorm) return 'political_hardline';
  if (s.politicalNorm > s.politicalHard) return 'political_norms';
  return 'political_stalemate';
}

function pickEconomyFamily(s: Signal): PathFamily {
  return leadOf([
    { id: 'economic', v: s.economic + 0.5 },
    { id: 'diplomatic', v: s.diplomatic },
    { id: 'delay', v: s.delay },
    { id: 'kinetic', v: s.kinetic },
  ]);
}

type FamilyCopy = {
  headline: string;
  lead: string;
  polarity: string;
  warnings: string[];
};

function conflictCopy(
  family: PathFamily,
  scenario: Scenario,
  tags: Map<string, { weight: number; notes: string[] }>,
  decisions: DecisionRecord[],
): FamilyCopy {
  const esc = getW(tags, 'escalation');
  const dip = getW(tags, 'diplomacy');
  const time = getW(tags, 'time');
  const civ = getW(tags, 'civilian_cost');

  switch (family) {
    case 'kinetic':
    case 'force_order':
      return {
        headline:
          family === 'force_order'
            ? 'You enforced order with visible force — legitimacy trailed the baton'
            : 'Visible force set the tempo — bargaining trailed the guns',
        lead: `Across ${decisions.length} orders in “${scenario.title},” kinetic and deterrent moves outran sequenced talks.`,
        polarity:
          civ >= 2 || esc >= 5
            ? 'The path reads hot: thresholds blurred and civilian exposure climbed.'
            : 'Force posture dominated; partners read resolve more than patience.',
        warnings: [
          'A single ROE misread can outrun your political timeline.',
          esc >= 5
            ? 'Escalation ladder is crowded — off-ramps need explicit cover.'
            : 'Adversaries may answer posture with posture before your next note arrives.',
        ],
      };
    case 'diplomatic':
      return {
        headline: 'You banked legitimacy and process — and spent reaction speed',
        lead: `Across ${decisions.length} orders in “${scenario.title},” diplomatic sequencing and partner framing carried the week.`,
        polarity: dip >= 5
          ? 'The table stayed open; hawks will call it hesitation.'
          : 'Process thick enough to matter, thin enough to keep options alive.',
        warnings: [
          'Adversaries may test whether restraint is durable or temporary.',
          dip >= 6 && esc <= 1
            ? 'Without a visible deterrent floor, talks can be read as absorption.'
            : 'Watch coalition fatigue if forums multiply without milestones.',
        ],
      };
    case 'delay':
      return {
        headline: 'You bought clocks and fog — and deferred the hard fork',
        lead: `Across ${decisions.length} orders in “${scenario.title},” delay, inquiry, and sequencing instruments dominated.`,
        polarity: time >= 4
          ? 'Time purchased was real; clarity for publics and partners was not.'
          : 'Hedging preserved reversibility at the cost of a crisp story.',
        warnings: [
          'Deferred forks rarely stay deferred — spoilers fill vacuums.',
          time >= 5
            ? 'Each bought week raises the price of the eventual decision.'
            : 'Domestic audiences may punish silence harder than a contested call.',
        ],
      };
    case 'economic':
      return {
        headline: 'Pressure ran through ledgers and lanes — not just lines on a map',
        lead: `Across ${decisions.length} orders in “${scenario.title},” economic and market instruments set the crisis grammar.`,
        polarity:
          getW(tags, 'economic_pressure') >= 3
            ? 'Squeeze was real; rebound risk onto households and partners remains.'
            : 'Corridors and liquidity moves tried to keep secondary battlefields quiet.',
        warnings: [
          'Sanctions or credit stops without buffers can rebound domestically.',
          'Market calm can mask political powder already spent.',
        ],
      };
    default:
      return {
        headline: 'A mixed cabinet: deterrence, delay, and deal-making without a single brand',
        lead: `Across ${decisions.length} orders in “${scenario.title},” no single instrument owned the path.`,
        polarity:
          'Partners and adversaries can read resolve or hesitation from the same tape — depending on which move they spotlight.',
        warnings: [
          'Incoherent sequencing is its own escalatory risk.',
          'Pick a public story before the next shock picks one for you.',
        ],
      };
  }
}

function politicsCopy(
  family: PathFamily,
  scenario: Scenario,
  tags: Map<string, { weight: number; notes: string[] }>,
  decisions: DecisionRecord[],
): FamilyCopy {
  // Instrument-led politics crises (Partition etc.) reuse conflict framing
  if (
    family === 'kinetic' ||
    family === 'force_order' ||
    family === 'diplomatic' ||
    family === 'delay' ||
    family === 'economic' ||
    family === 'mixed'
  ) {
    return conflictCopy(family, scenario, tags, decisions);
  }

  switch (family) {
    case 'political_hardline':
      return {
        headline: 'You bought governing room by spending normative distance',
        lead: `In “${scenario.title},” hardline and polarizing bargains set the week’s Overton window.`,
        polarity: 'Majorities may form; firewalls and cross-bloc trust thinned.',
        warnings: [
          'Once cabinet norms shift, reversing them costs more than preventing the shift.',
          'Street incentives can outrun elite bargains within a single news cycle.',
        ],
      };
    case 'political_norms':
      return {
        headline: 'You protected distance from hardliners — and paid in governing capacity',
        lead: `In “${scenario.title},” norm protection and liberal cohesion outranked raw majority arithmetic.`,
        polarity: 'Firewall held; legislation and coalition math got harder.',
        warnings: [
          'Repeated minority crises hand initiative to permanent-campaign actors.',
          'External partners may cheer norms while your domestic bandwidth collapses.',
        ],
      };
    default:
      return {
        headline: 'A fragile, contested equilibrium — neither majority nor firewall owned the week',
        lead: `In “${scenario.title},” your ${decisions.length} moves produced stalemate more than settlement.`,
        polarity:
          getW(tags, 'governability') < 0
            ? 'Institutional deadlock remains the central risk.'
            : 'Contested balance; the next shock decides who claims it.',
        warnings: [
          'Watch local flashpoints — national bargains do not calm districts automatically.',
          'Ambiguity invites spoilers on both flanks.',
        ],
      };
  }
}

function economyCopy(
  family: PathFamily,
  scenario: Scenario,
  tags: Map<string, { weight: number; notes: string[] }>,
  decisions: DecisionRecord[],
): FamilyCopy {
  const markets = getW(tags, 'market_stability');
  if (family === 'economic' || markets >= 2) {
    return {
      headline: 'You bought market calm — and spent political powder to do it',
      lead: `In “${scenario.title},” finance and politics shared one clock across ${decisions.length} orders.`,
      polarity: 'Desks cheered; distributional pain may still surface off-exchange.',
      warnings: [
        'Watch secondary effects on households even when desks cheer.',
        'Calm bought with promises can reverse faster than it arrived.',
      ],
    };
  }
  if (family === 'diplomatic') {
    return {
      headline: 'You coordinated partners first — and accepted a rougher tape',
      lead: `In “${scenario.title},” coalition and messaging moves led; price discovery stayed disorderly.`,
      polarity: 'Political cover thickened while markets waited on instruments.',
      warnings: ['Disorderly markets can force worse political bargains tomorrow.'],
    };
  }
  if (family === 'delay') {
    return {
      headline: 'You waited for clearer books — and let rumor set the premium',
      lead: `In “${scenario.title},” delay and inquiry bought information at the cost of confidence.`,
      polarity: 'Fog favored whoever thrives on volatility.',
      warnings: ['Each quiet day raises the cost of the eventual intervention.'],
    };
  }
  return {
    headline: 'You protected a principle and accepted a rougher tape',
    lead: `In “${scenario.title},” principle and politics outranked smooth price discovery.`,
    polarity: 'Credibility with one audience; nerves with another.',
    warnings: ['Disorderly markets can force worse political bargains tomorrow.'],
  };
}

function buildConflictAxes(
  family: PathFamily,
  tags: Map<string, { weight: number; notes: string[] }>,
) {
  const escalation = getW(tags, 'escalation');
  const diplomacy = getW(tags, 'diplomacy');
  const deterrence = getW(tags, 'deterrence');
  const markets = getW(tags, 'market_stability') + getW(tags, 'economic_pressure') * 0.3;

  const familyBias =
    family === 'kinetic'
      ? { esc: 8, det: 4, mkt: -4, all: -2 }
      : family === 'diplomatic'
        ? { esc: -6, det: 2, mkt: 2, all: 6 }
        : family === 'delay'
          ? { esc: -4, det: -2, mkt: 0, all: 2 }
          : family === 'economic'
            ? { esc: 0, det: 0, mkt: 8, all: 2 }
            : { esc: 0, det: 0, mkt: 0, all: 0 };

  return [
    {
      label: 'Escalation risk',
      score: clamp(40 + escalation * 10 - diplomacy * 6 + familyBias.esc, 5, 95),
      note:
        family === 'kinetic'
          ? 'Kinetic stack raised incident and threshold risk.'
          : family === 'diplomatic'
            ? 'Diplomatic sequencing kept several off-ramps open.'
            : family === 'delay'
              ? 'Delay lowered immediate heat but left ambiguity on red lines.'
              : 'Mixed signals left adversaries guessing about thresholds.',
    },
    {
      label: 'Deterrent clarity',
      score: clamp(45 + deterrence * 10 - Math.abs(escalation - deterrence) * 3 + familyBias.det, 5, 95),
      note:
        family === 'kinetic'
          ? 'Force was visible — conditional vs impulsive is still contested.'
          : family === 'delay'
            ? 'Hedging blurred whether restraint is policy or pause.'
            : deterrence > escalation
              ? 'Force posture mostly read as conditional, not impulsive.'
              : 'Deterrence and escalation blurred in partner briefings.',
    },
    {
      label: 'Market shock absorption',
      score: clamp(50 + markets * 9 - escalation * 5 + familyBias.mkt, 5, 95),
      note:
        family === 'economic'
          ? 'Ledger and corridor tools were the primary shock absorbers.'
          : markets > 1
            ? 'Price interventions and corridors limited panic premiums.'
            : 'Energy and trade volatility remained a secondary battlefield.',
    },
    {
      label: 'Alliance cohesion',
      score: clamp(
        50 + getW(tags, 'alliance_cohesion') * 11 + getW(tags, 'credibility') * 2 + familyBias.all,
        5,
        95,
      ),
      note:
        family === 'diplomatic'
          ? 'Partners could describe a shared operational story.'
          : family === 'kinetic'
            ? 'Some allies cheer resolve; others fear entrapment.'
            : getW(tags, 'alliance_cohesion') >= 2
              ? 'Coalition narrative held under pressure.'
              : 'Burden-sharing arguments left gaps in the coalition narrative.',
    },
  ];
}

function buildPoliticsAxes(tags: Map<string, { weight: number; notes: string[] }>) {
  const governability = getW(tags, 'governability');
  const norms = getW(tags, 'norm_protection') - getW(tags, 'norm_erosion');
  const polarization = getW(tags, 'polarization') + getW(tags, 'far_right_momentum');
  const eu = getW(tags, 'eu_cohesion') + getW(tags, 'alliance_cohesion') * 0.5;

  return [
    {
      label: 'Governability',
      score: clamp(48 + governability * 14, 5, 95),
      note:
        governability >= 2
          ? 'You kept a path to pass core legislation.'
          : 'Institutional stalemate remains the central risk.',
    },
    {
      label: 'Democratic-norm resilience',
      score: clamp(50 + norms * 12 - getW(tags, 'far_right_momentum') * 6, 5, 95),
      note:
        norms >= 1
          ? 'You avoided the most direct normalization trades.'
          : 'Cabinet and budget bargains shifted the Overton window.',
    },
    {
      label: 'Social polarization',
      score: clamp(40 + polarization * 10, 5, 95),
      note:
        polarization >= 3
          ? 'Street and campaign incentives now dominate elite bargaining.'
          : 'Procedural moves bought some civic oxygen.',
    },
    {
      label: 'External / bloc cohesion',
      score: clamp(55 + eu * 12 - getW(tags, 'far_right_momentum') * 4, 5, 95),
      note:
        eu >= 1
          ? 'External partners and rules stayed workable.'
          : 'An external-rules fight would consume your bandwidth.',
    },
  ];
}

function buildEconomyAxes(tags: Map<string, { weight: number; notes: string[] }>) {
  const markets = getW(tags, 'market_stability');
  const pressure = getW(tags, 'economic_pressure');
  const social = getW(tags, 'social_calm') - getW(tags, 'polarization');
  const credibility = getW(tags, 'credibility') + getW(tags, 'diplomacy') * 0.5;

  return [
    {
      label: 'Market stability',
      score: clamp(45 + markets * 12 - pressure * 5, 5, 95),
      note: markets >= 2 ? 'Liquidity and messaging limited panic.' : 'Price discovery stayed disorderly.',
    },
    {
      label: 'Policy credibility',
      score: clamp(48 + credibility * 10, 5, 95),
      note: credibility >= 2 ? 'Desks believed the path.' : 'Promises outran instruments.',
    },
    {
      label: 'Social absorption',
      score: clamp(50 + social * 11, 5, 95),
      note: social >= 1 ? 'Street pressure stayed manageable.' : 'Distributional pain fed unrest.',
    },
    {
      label: 'External finance room',
      score: clamp(
        50 + getW(tags, 'alliance_cohesion') * 8 + getW(tags, 'diplomacy') * 6 - pressure * 4,
        5,
        95,
      ),
      note: 'Access depends on both politics and plumbing.',
    },
  ];
}

/** Exported for tests — classify a finished run into a path family. */
export function classifyPathFamily(scenario: Scenario, decisions: DecisionRecord[]): PathFamily {
  const tags = aggregateTags(decisions);
  const signals = buildSignals(tags, decisions);
  const meter = resolveFamily(scenario);
  if (meter === 'politics') return pickPoliticsFamily(signals, tags);
  if (meter === 'economy') return pickEconomyFamily(signals);
  return pickConflictFamily(signals, tags);
}

function mockEvaluate(scenario: Scenario, decisions: DecisionRecord[]): EvaluationResult {
  const tags = aggregateTags(decisions);
  const meter = resolveFamily(scenario);
  const signals = buildSignals(tags, decisions);

  let pathFamily: PathFamily;
  let copy: FamilyCopy;
  let axes: EvaluationResult['axes'];

  if (meter === 'politics') {
    pathFamily = pickPoliticsFamily(signals, tags);
    copy = politicsCopy(pathFamily, scenario, tags, decisions);
    // Instrument-led politics still show conflict-style axes when force/diplo dominate
    axes =
      pathFamily === 'force_order' ||
      pathFamily === 'kinetic' ||
      pathFamily === 'diplomatic' ||
      pathFamily === 'delay' ||
      pathFamily === 'economic' ||
      pathFamily === 'mixed'
        ? buildConflictAxes(pathFamily === 'force_order' ? 'kinetic' : pathFamily, tags)
        : buildPoliticsAxes(tags);
  } else if (meter === 'economy') {
    pathFamily = pickEconomyFamily(signals);
    copy = economyCopy(pathFamily, scenario, tags, decisions);
    axes = buildEconomyAxes(tags);
  } else {
    pathFamily = pickConflictFamily(signals, tags);
    copy = conflictCopy(pathFamily, scenario, tags, decisions);
    axes = buildConflictAxes(pathFamily, tags);
  }

  const moveLine = decisions
    .map((d) => `At “${d.beatTitle},” you chose “${d.choice.label}.”`)
    .join(' ');

  const spill =
    getW(tags, 'civilian_cost') >= 2
      ? 'Secondary effects include wider commercial friction and civilian exposure beyond the opening shock.'
      : getW(tags, 'civilian_cost') <= -2
        ? 'Civilian spillover stayed comparatively contained on this path.'
        : 'Spillover stayed uneven — some districts absorbed shock better than others.';

  const narrative = [
    copy.lead,
    copy.polarity,
    moveLine,
    spill,
    'This is a simulation of tradeoffs, not a verdict on which ideology is correct — different capitals would weight these axes differently.',
  ].join(' ');

  return {
    headline: copy.headline,
    narrative,
    axes,
    warnings: copy.warnings.slice(0, 3),
    source: 'mock',
    pathFamily,
  };
}

async function apiEvaluate(scenario: Scenario, decisions: DecisionRecord[]): Promise<EvaluationResult | null> {
  const key = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  if (!key) return null;

  const pathFamily = classifyPathFamily(scenario, decisions);
  const prompt = {
    scenario: {
      id: scenario.id,
      title: scenario.title,
      premise: scenario.premise,
      role: scenario.role,
    },
    pathFamilyHint: pathFamily,
    decisions: decisions.map((d) => ({
      beat: d.beatTitle,
      choice: d.choice.label,
      detail: d.choice.detail,
      effects: d.choice.effects,
      kind: (d.choice as Choice & { kind?: string }).kind,
    })),
    instructions:
      'You are evaluating a serious geopolitical decision simulation. Return JSON with keys: headline (string), narrative (string), axes (array of {label, score 0-100, note}), warnings (string[]). Headline MUST reflect the pathFamilyHint distinctly (kinetic vs diplomatic vs delay vs economic vs mixed / politics variants). Do not moralize as partisan propaganda; emphasize tradeoffs and consequences. Same decisions must yield the same framing.',
  };

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        temperature: 0.2,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              'You evaluate branching geopolitical decision games. Serious simulation tone. JSON only. Vary headlines by path family.',
          },
          { role: 'user', content: JSON.stringify(prompt) },
        ],
      }),
    });

    if (!res.ok) return null;
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;
    const parsed = JSON.parse(content) as Omit<EvaluationResult, 'source'>;
    if (!parsed.headline || !parsed.narrative || !Array.isArray(parsed.axes)) return null;
    return { ...parsed, source: 'api', pathFamily };
  } catch {
    return null;
  }
}

export async function evaluateRun(
  scenario: Scenario,
  decisions: DecisionRecord[],
): Promise<EvaluationResult> {
  const api = await apiEvaluate(scenario, decisions);
  if (api) return api;
  await new Promise((r) => setTimeout(r, 900));
  return mockEvaluate(scenario, decisions);
}

/** Build a full decision path for a strategy — used by QA seed + screenshots. */
export function buildStrategyDecisions(
  scenario: Scenario,
  strategy: 'kinetic' | 'diplomatic' | 'delay' | 'polar',
): DecisionRecord[] {
  const scoreChoice = (choice: Choice, strat: typeof strategy): number => {
    const kind = choiceKind(choice);
    const label = `${choice.label} ${choice.detail}`.toLowerCase();
    const tag = (t: string) => choice.effects.find((e) => e.tag === t)?.weight ?? 0;
    if (strat === 'kinetic') {
      return (
        (kind === 'kinetic' ? 5 : 0) +
        (kind === 'naval' ? 3 : 0) +
        tag('escalation') * 2 +
        tag('deterrence') +
        (/surge|force|strike|ground|fire|combat|raid/i.test(label) ? 3 : 0)
      );
    }
    if (strat === 'diplomatic') {
      return (
        (kind === 'diplomatic' ? 4 : 0) +
        tag('diplomacy') * 2.5 -
        Math.max(0, -tag('escalation')) * 1.2 -
        tag('time') +
        (/mediat|diplom|talk|appeal|pact|phase|forum/i.test(label) ? 2 : 0)
      );
    }
    if (strat === 'delay') {
      return (
        tag('time') * 3 +
        Math.max(0, -tag('escalation')) * 2.5 +
        (/delay|pause|freeze|buffer|armist|cease|investig|quiet|phase|wait/i.test(label) ? 3 : 0)
      );
    }
    // polar
    return tag('polarization') * 3 + tag('norm_erosion') * 3 + tag('far_right_momentum') * 2;
  };

  return scenario.beats.map((beat) => {
    const ranked = [...beat.choices].sort(
      (a, b) => scoreChoice(b, strategy) - scoreChoice(a, strategy),
    );
    return {
      beatId: beat.id,
      beatTitle: beat.title,
      choice: ranked[0] ?? beat.choices[0],
    };
  });
}

/** Sync mock path — for screenshots / unit checks without delay. */
export function evaluateRunSync(scenario: Scenario, decisions: DecisionRecord[]): EvaluationResult {
  return mockEvaluate(scenario, decisions);
}
