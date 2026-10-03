export type ChoiceEffect = {
  tag: string;
  weight: number;
  summary: string;
};

export type Choice = {
  id: string;
  label: string;
  detail: string;
  effects: ChoiceEffect[];
};

export type Beat = {
  id: string;
  title: string;
  briefing: string;
  stakes: string;
  choices: Choice[];
};

export type MeterFamily = 'conflict' | 'politics' | 'economy';

export type Scenario = {
  id: string;
  title: string;
  region: string;
  premise: string;
  role: string;
  tension: string;
  beats: Beat[];
  evergreen?: boolean;
  meterFamily?: MeterFamily;
  packId?: string;
  generatedAt?: string;
  theaterArchetype?: string;
};

export const scenarios: Scenario[] = [
  {
    id: 'iran-escalation',
    title: 'Strait Pressure',
    region: 'Iran · Gulf · maritime corridors',
    evergreen: true,
    meterFamily: 'conflict',
    premise:
      'After a strike cycle and reciprocal seizures at sea, tanker insurance rates spike and regional capitals demand clarity. You advise a coalition cabinet on the next 72 hours.',
    role: 'National security advisor to a coalition government',
    tension:
      'Deterrence without open war; energy markets without appearing to abandon partners.',
    beats: [
      {
        id: 'iran-1',
        title: 'First move after the seizure',
        briefing:
          'A commercial tanker linked to a partner flag is held near the Strait. Your military can interdict the escort, your diplomats can open a quiet channel, or you can freeze related assets and wait for market pressure to speak.',
        stakes:
          'Speed signals resolve; restraint preserves off-ramps; economic pressure is slower but harder to reverse.',
        choices: [
          {
            id: 'iran-1a',
            label: 'Authorize a limited interdiction escort',
            detail:
              'Naval assets shadow and challenge the holding force. Rules of engagement stay defensive.',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Shows willingness to contest the maritime commons' },
              { tag: 'escalation', weight: 2, summary: 'Raises risk of a kinetic incident at sea' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Reassures partners who feared paralysis' },
            ],
          },
          {
            id: 'iran-1b',
            label: 'Open a quiet back channel',
            detail:
              'Use a third-party capital to propose release in exchange for de-escalatory guarantees.',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Keeps a negotiated off-ramp alive' },
              { tag: 'credibility', weight: -1, summary: 'Some partners read delay as weakness' },
              { tag: 'escalation', weight: -1, summary: 'Lowers near-term kinetic risk' },
            ],
          },
          {
            id: 'iran-1c',
            label: 'Freeze linked financial conduits',
            detail:
              'Target insurers, ship managers, and payment rails without new kinetic posture.',
            effects: [
              { tag: 'economic_pressure', weight: 2, summary: 'Squeezes the seizure’s logistics chain' },
              { tag: 'civilian_cost', weight: 1, summary: 'Raises friction for regional trade more broadly' },
              { tag: 'time', weight: 1, summary: 'Buys days while markets reprice risk' },
            ],
          },
        ],
      },
      {
        id: 'iran-2',
        title: 'Energy corridor panic',
        briefing:
          'Benchmark crude jumps. Domestic industry lobbies for emergency releases from strategic reserves. Partners ask whether you will join a coordinated naval traffic corridor.',
        stakes:
          'Market calm can reduce crisis leverage for spoilers — or signal that you will always absorb the shock.',
        choices: [
          {
            id: 'iran-2a',
            label: 'Join a multinational traffic corridor',
            detail:
              'Share escorts and routing intel with willing partners under a temporary charter.',
            effects: [
              { tag: 'alliance_cohesion', weight: 2, summary: 'Locks partners into a shared operational frame' },
              { tag: 'deterrence', weight: 1, summary: 'Raises the cost of further seizures' },
              { tag: 'escalation', weight: 1, summary: 'Puts more ships in a contested lane' },
            ],
          },
          {
            id: 'iran-2b',
            label: 'Release strategic petroleum quietly',
            detail:
              'Calm prices without a public military announcement.',
            effects: [
              { tag: 'market_stability', weight: 2, summary: 'Blunts panic premiums' },
              { tag: 'credibility', weight: -1, summary: 'Adversaries may treat you as shock absorber' },
              { tag: 'domestic_support', weight: 1, summary: 'Eases pressure from industry and consumers' },
            ],
          },
          {
            id: 'iran-2c',
            label: 'Hold reserves; demand partner burden-sharing',
            detail:
              'Condition any release on matching contributions and a joint statement of red lines.',
            effects: [
              { tag: 'alliance_cohesion', weight: -1, summary: 'Frays goodwill among energy-importing partners' },
              { tag: 'credibility', weight: 1, summary: 'Signals you will not underwrite alone' },
              { tag: 'market_stability', weight: -1, summary: 'Leaves volatility unresolved longer' },
            ],
          },
        ],
      },
      {
        id: 'iran-3',
        title: 'Proxy strike attribution',
        briefing:
          'A drone attack hits a logistics node used by your contractors. Intelligence leans toward a proxy network with Iranian material support, but the chain of command is contested.',
        stakes:
          'Public attribution shapes domestic politics; private signaling shapes adversary calculations.',
        choices: [
          {
            id: 'iran-3a',
            label: 'Attribute publicly and threaten calibrated response',
            detail:
              'Name the supporting network and set a 48-hour window for de-escalation.',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Creates a clear public standard' },
              { tag: 'escalation', weight: 2, summary: 'Narrows room to climb down quietly' },
              { tag: 'domestic_support', weight: 1, summary: 'Satisfies calls for visibility' },
            ],
          },
          {
            id: 'iran-3b',
            label: 'Share evidence privately; demand proxy restraint',
            detail:
              'Use intelligence channels and a mediator to warn without locking into a public test.',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Preserves deniable off-ramps' },
              { tag: 'deterrence', weight: 1, summary: 'Signals knowledge without spectacle' },
              { tag: 'domestic_support', weight: -1, summary: 'Looks opaque to a rattled public' },
            ],
          },
          {
            id: 'iran-3c',
            label: 'Strike a related proxy depot',
            detail:
              'Limited-duration action against a warehouse assessed as low-civilian-risk.',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Imposes immediate cost on the network' },
              { tag: 'escalation', weight: 3, summary: 'Invites reciprocal targeting cycles' },
              { tag: 'civilian_cost', weight: 1, summary: 'Even “limited” strikes risk spillover' },
            ],
          },
        ],
      },
      {
        id: 'iran-4',
        title: 'Off-ramp window',
        briefing:
          'A regional intermediary offers a package: tanker release, temporary pause on proxy launches, and technical talks on maritime notifications — if you pause new sanctions designations for 30 days.',
        stakes:
          'Accepting looks like bargaining with coercion; refusing may close the only near-term exit.',
        choices: [
          {
            id: 'iran-4a',
            label: 'Accept with verification milestones',
            detail:
              'Pause designations only after staged releases and third-party monitoring.',
            effects: [
              { tag: 'diplomacy', weight: 3, summary: 'Converts crisis into sequenced bargaining' },
              { tag: 'credibility', weight: -1, summary: 'Hardliners at home call it concession' },
              { tag: 'escalation', weight: -2, summary: 'Lowers odds of immediate wider war' },
            ],
          },
          {
            id: 'iran-4b',
            label: 'Reject; keep sanctions tempo',
            detail:
              'Treat the offer as an attempt to buy time while consolidating gains at sea.',
            effects: [
              { tag: 'economic_pressure', weight: 2, summary: 'Maintains coercive continuity' },
              { tag: 'escalation', weight: 1, summary: 'Leaves kinetic pathways open' },
              { tag: 'diplomacy', weight: -2, summary: 'Burns the intermediary’s political capital' },
            ],
          },
          {
            id: 'iran-4c',
            label: 'Counter with a narrower swap',
            detail:
              'Tanker release now for a shorter sanctions pause and a maritime hotline only.',
            effects: [
              { tag: 'diplomacy', weight: 1, summary: 'Keeps talks alive without full buy-in' },
              { tag: 'time', weight: 1, summary: 'Creates another negotiation cycle' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Partners can endorse a limited deal' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'europe-far-right',
    title: 'Ballot Aftershock',
    region: 'European Union · national capitals',
    evergreen: true,
    meterFamily: 'politics',
    premise:
      'After national elections, a far-right bloc becomes kingmaker in a major member state. Markets, minority communities, and Brussels all watch your first week of coalition management.',
    role: 'Chief of staff to a centrist prime minister–designate',
    tension:
      'Governability versus democratic norms; EU cohesion versus domestic mandate claims.',
    beats: [
      {
        id: 'eu-1',
        title: 'Coalition arithmetic',
        briefing:
          'Without the far-right party, you lack a majority. They demand the interior ministry and a freeze on new asylum reception capacity. Smaller liberal partners threaten to walk if you concede either.',
        stakes:
          'Office without norms risks hollow legitimacy; purity without numbers risks snap elections.',
        choices: [
          {
            id: 'eu-1a',
            label: 'Grand bargain with red-line ministries',
            detail:
              'Offer junior portfolios but keep interior, justice, and foreign affairs out of their hands.',
            effects: [
              { tag: 'governability', weight: 2, summary: 'Secures a working majority' },
              { tag: 'norm_erosion', weight: 1, summary: 'Normalizes the bloc inside cabinet politics' },
              { tag: 'liberal_trust', weight: -1, summary: 'Strains partners who wanted a cordon' },
            ],
          },
          {
            id: 'eu-1b',
            label: 'Minority government with issue-by-issue votes',
            detail:
              'Refuse a formal deal; negotiate budgets and security votes ad hoc.',
            effects: [
              { tag: 'norm_protection', weight: 2, summary: 'Avoids formal cohabitation with the far right' },
              { tag: 'governability', weight: -2, summary: 'Every bill becomes a crisis' },
              { tag: 'market_stability', weight: -1, summary: 'Investors price political fragility' },
            ],
          },
          {
            id: 'eu-1c',
            label: 'Force a second election',
            detail:
              'Tell the president no stable democratic majority exists and seek a fresh mandate.',
            effects: [
              { tag: 'democratic_mandate', weight: 1, summary: 'Returns the question to voters' },
              { tag: 'polarization', weight: 2, summary: 'Campaigns harden identities further' },
              { tag: 'far_right_momentum', weight: 1, summary: 'Gives them months as opposition tribune' },
            ],
          },
        ],
      },
      {
        id: 'eu-2',
        title: 'Street and speech',
        briefing:
          'After a far-right rally, clashes injure protesters and two officers. Civil society demands a ban on the party’s youth wing. The party calls it a political persecution test.',
        stakes:
          'Rule-of-law tools used unevenly can feed the narrative they campaign on.',
        choices: [
          {
            id: 'eu-2a',
            label: 'Independent inquiry + targeted bans on violent cadres',
            detail:
              'Separate criminal accountability from collective political bans.',
            effects: [
              { tag: 'rule_of_law', weight: 2, summary: 'Centers evidence over spectacle' },
              { tag: 'social_calm', weight: 1, summary: 'Offers both camps a procedural path' },
              { tag: 'time', weight: 1, summary: 'Slows politics while facts are gathered' },
            ],
          },
          {
            id: 'eu-2b',
            label: 'Broad organizational ban push',
            detail:
              'Ask courts to dissolve the youth wing for pattern of intimidation.',
            effects: [
              { tag: 'norm_protection', weight: 1, summary: 'Draws a hard line against street coercion' },
              { tag: 'polarization', weight: 2, summary: 'Fuels martyr narratives' },
              { tag: 'liberal_trust', weight: 1, summary: 'Reassures threatened communities short-term' },
            ],
          },
          {
            id: 'eu-2c',
            label: 'De-escalate rhetoric; expand local mediation',
            detail:
              'Quiet policing posture and funded local dialogue teams in hot districts.',
            effects: [
              { tag: 'social_calm', weight: 2, summary: 'Reduces immediate confrontation cycles' },
              { tag: 'credibility', weight: -1, summary: 'Critics call it soft on intimidation' },
              { tag: 'far_right_momentum', weight: 1, summary: 'They claim the state blinked' },
            ],
          },
        ],
      },
      {
        id: 'eu-3',
        title: 'Brussels pressure',
        briefing:
          'The Commission warns that proposed asylum freezes may breach common rules. Farmers and logistics firms want you to protect EU funds. Your far-right interlocutors want a sovereignty confrontation.',
        stakes:
          'EU funds and legal standing are leverage — and a domestic campaign prop.',
        choices: [
          {
            id: 'eu-3a',
            label: 'Negotiate a compliance timeline',
            detail:
              'Trade phased reception capacity for technical assistance and fund certainty.',
            effects: [
              { tag: 'eu_cohesion', weight: 2, summary: 'Keeps you inside the legal community' },
              { tag: 'governability', weight: 1, summary: 'Avoids an immediate funds crisis' },
              { tag: 'far_right_momentum', weight: -1, summary: 'Undercuts their confrontation script' },
            ],
          },
          {
            id: 'eu-3b',
            label: 'Public clash over “national competence”',
            detail:
              'Frame Brussels as overriding the election; dare infringement.',
            effects: [
              { tag: 'far_right_momentum', weight: 2, summary: 'Aligns executive branding with their voters' },
              { tag: 'eu_cohesion', weight: -3, summary: 'Opens a lasting rule-of-law fight' },
              { tag: 'market_stability', weight: -1, summary: 'Risks funding and investment nerves' },
            ],
          },
          {
            id: 'eu-3c',
            label: 'Quiet legal tweak; loud domestic theater',
            detail:
              'Meet minimum legal thresholds while messaging toughness at home.',
            effects: [
              { tag: 'eu_cohesion', weight: 1, summary: 'Technically stays compliant' },
              { tag: 'credibility', weight: -1, summary: 'Both camps may call it cynical' },
              { tag: 'polarization', weight: 1, summary: 'Theater still heats the information space' },
            ],
          },
        ],
      },
      {
        id: 'eu-4',
        title: 'Budget night',
        briefing:
          'The finance bill needs votes. The far-right offers support if you cut civic-education grants and raise police overtime budgets. Liberals demand the opposite trade.',
        stakes:
          'One night can redefine who owns the state’s coercive and civic tools.',
        choices: [
          {
            id: 'eu-4a',
            label: 'Pass a narrow confidence budget',
            detail:
              'Strip culture-war riders; fund core services and a review commission.',
            effects: [
              { tag: 'governability', weight: 2, summary: 'Keeps the lights on without a identity bargain' },
              { tag: 'liberal_trust', weight: 1, summary: 'Avoids gutting civic programs' },
              { tag: 'far_right_momentum', weight: -1, summary: 'Denies them a trophy in the bill' },
            ],
          },
          {
            id: 'eu-4b',
            label: 'Take the far-right security package',
            detail:
              'Accept overtime surge and civic-grant cuts to lock votes.',
            effects: [
              { tag: 'governability', weight: 2, summary: 'Gets the bill through' },
              { tag: 'norm_erosion', weight: 2, summary: 'Trades civic capacity for order optics' },
              { tag: 'social_calm', weight: -1, summary: 'Minority organizations feel abandoned' },
            ],
          },
          {
            id: 'eu-4c',
            label: 'Risk defeat; mobilize street legitimacy',
            detail:
              'Refuse both extremes and dare a failed vote while calling supporters to peaceful vigils.',
            effects: [
              { tag: 'democratic_mandate', weight: 1, summary: 'Frames integrity over dealmaking' },
              { tag: 'governability', weight: -3, summary: 'May collapse the government project' },
              { tag: 'polarization', weight: 2, summary: 'Moves conflict from parliament to streets' },
            ],
          },
        ],
      },
    ],
  },
];

export function getScenario(id: string): Scenario | undefined {
  return scenarios.find((s) => s.id === id);
}
