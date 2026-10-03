import type { HistoricalScenario } from '@/data/historical/build';
import { extraPartitionScenarios } from '@/data/historical/extraPartitionTheaters';

/** Offline historical timeline — core theaters (1900–2026), 10 beats each. */
const coreHistoricalScenarios: HistoricalScenario[] = [
  {
    id: 'hist-1905-port-arthur',
    year: 1905,
    era: '1900–1914',
    title: 'Port Arthur Echo',
    region: 'Manchuria · Sea of Japan',
    meterFamily: 'conflict',
    theaterArchetype: 'pacific',
    premise:
      'After Japanese victories at sea and a grinding siege, European cabinets ask whether to mediate before a wider scramble for China accelerates.',
    role: 'Foreign ministry counselor to a European great power',
    tension:
      'Preserve the East Asian balance without owning either empire’s defeat.',
    beats: [
      {
        id: 'hist-1905-1',
        title: 'Mediation invite',
        briefing:
          'A neutral capital offers to host talks. Your admiralty wants naval observation continued; finance wants the war ended before silver drains.',
        stakes:
          'Early mediation can freeze gains or look like favoring the winner.',
        choices: [
          {
            id: 'hist-1905-1a',
            label: 'Accept mediation chair quietly',
            detail: 'Offer good offices without public pressure on either side.',
            kind: 'diplomatic',
            markerId: 'capital_a',
            short: 'CHAIR',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Opens a negotiated table' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Partners can join quietly' },
              { tag: 'credibility', weight: 1, summary: 'Looks responsible abroad' },
            ],
          },
          {
            id: 'hist-1905-1b',
            label: 'Delay; expand fleet observation',
            detail: 'Keep ships watching while “studying conditions.”',
            kind: 'naval',
            markerId: 'fleet',
            short: 'WATCH',
            effects: [
              { tag: 'deterrence', weight: 1, summary: 'Presence at sea' },
              { tag: 'escalation', weight: 1, summary: 'Risk of incident' },
              { tag: 'time', weight: 1, summary: 'Buys weeks' },
            ],
          },
          {
            id: 'hist-1905-1c',
            label: 'Push a public peace appeal',
            detail: 'Name broad terms in the open to force pace.',
            kind: 'political',
            markerId: 'capital_b',
            short: 'APPEAL',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Visible standard' },
              { tag: 'diplomacy', weight: -1, summary: 'May harden fronts' },
              { tag: 'escalation', weight: 1, summary: 'Raises rhetoric' },
            ],
          },
        ],
      },
      {
        id: 'hist-1905-2',
        title: 'Loan pressure',
        briefing:
          'Bankers ask whether to keep floating war loans. Cutting credit could end the fighting—or collapse a client.',
        stakes:
          'Finance is strategy by another name.',
        choices: [
          {
            id: 'hist-1905-2a',
            label: 'Condition new loans on talks',
            detail: 'No fresh paper without a mediation calendar.',
            kind: 'economic',
            markerId: 'cable',
            short: 'COND',
            effects: [
              { tag: 'economic_pressure', weight: 2, summary: 'Squeezes war finance' },
              { tag: 'diplomacy', weight: 1, summary: 'Links money to the table' },
              { tag: 'market_stability', weight: -1, summary: 'Credit nerves' },
            ],
          },
          {
            id: 'hist-1905-2b',
            label: 'Keep loans flowing quietly',
            detail: 'Stabilize your preferred party’s solvency.',
            kind: 'economic',
            markerId: 'island',
            short: 'FUND',
            effects: [
              { tag: 'alliance_cohesion', weight: 1, summary: 'Client reassured' },
              { tag: 'escalation', weight: 1, summary: 'War can continue' },
              { tag: 'credibility', weight: -1, summary: 'Looks partial' },
            ],
          },
          {
            id: 'hist-1905-2c',
            label: 'Freeze all war lending',
            detail: 'Force both sides toward scarcity.',
            kind: 'economic',
            markerId: 'strait',
            short: 'FREEZE',
            effects: [
              { tag: 'economic_pressure', weight: 3, summary: 'Hard stop on credit' },
              { tag: 'diplomacy', weight: -1, summary: 'Anger on both sides' },
              { tag: 'civilian_cost', weight: 1, summary: 'Social strain rises' },
            ],
          },
        ],
      },
      {
        id: 'hist-1905-3',
        title: 'Treaty draft leak',
        briefing:
          'A draft territorial clause leaks. Domestic papers demand you “not abandon Asia.”',
        stakes:
          'Public opinion versus a workable map.',
        choices: [
          {
            id: 'hist-1905-3a',
            label: 'Defend a status-quo corridor clause',
            detail: 'Prioritize open trade lanes over prestige lines.',
            kind: 'diplomatic',
            markerId: 'strait',
            short: 'LANE',
            effects: [
              { tag: 'market_stability', weight: 2, summary: 'Trade frame' },
              { tag: 'diplomacy', weight: 1, summary: 'Narrow bargain' },
              { tag: 'domestic_support', weight: -1, summary: 'Hawks unhappy' },
            ],
          },
          {
            id: 'hist-1905-3b',
            label: 'Echo nationalist map language',
            detail: 'Match the press; harden your brief.',
            kind: 'political',
            markerId: 'capital_a',
            short: 'MAP',
            effects: [
              { tag: 'domestic_support', weight: 2, summary: 'Press satisfied' },
              { tag: 'escalation', weight: 1, summary: 'Less room to deal' },
              { tag: 'diplomacy', weight: -1, summary: 'Partners wary' },
            ],
          },
          {
            id: 'hist-1905-3c',
            label: 'Stay silent until signature',
            detail: 'Starve the leak of official oxygen.',
            kind: 'diplomatic',
            markerId: 'capital_b',
            short: 'QUIET',
            effects: [
              { tag: 'time', weight: 1, summary: 'Space for negotiators' },
              { tag: 'credibility', weight: -1, summary: 'Vacuum of rumor' },
              { tag: 'diplomacy', weight: 1, summary: 'Keeps flexibility' },
            ],
          },
        ],
      },
      {
        id: 'hist-1905-4',
        title: 'Aftermath alignment',
        briefing:
          'With a settlement near, allies ask if you will join a new East Asian consultative group.',
        stakes:
          'Institutionalizing influence—or entanglement.',
        choices: [
          {
            id: 'hist-1905-4a',
            label: 'Join a limited consultative pact',
            detail: 'Information sharing only; no automatic force.',
            kind: 'diplomatic',
            markerId: 'fleet',
            short: 'PACT',
            effects: [
              { tag: 'alliance_cohesion', weight: 2, summary: 'Shared frame' },
              { tag: 'deterrence', weight: 1, summary: 'Signal of interest' },
              { tag: 'escalation', weight: -1, summary: 'Less improvisation' },
            ],
          },
          {
            id: 'hist-1905-4b',
            label: 'Remain bilateral only',
            detail: 'Refuse new standing machinery.',
            kind: 'political',
            markerId: 'capital_a',
            short: 'BILAT',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Clear limit' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Partners disappointed' },
              { tag: 'diplomacy', weight: -1, summary: 'Fewer forums' },
            ],
          },
          {
            id: 'hist-1905-4c',
            label: 'Propose open-door commercial rules',
            detail: 'Lead with trade norms, not security.',
            kind: 'economic',
            markerId: 'cable',
            short: 'DOOR',
            effects: [
              { tag: 'market_stability', weight: 2, summary: 'Commercial order' },
              { tag: 'diplomacy', weight: 1, summary: 'Inclusive pitch' },
              { tag: 'deterrence', weight: -1, summary: 'Security gap' },
            ],
          },
        ],
      },
      {
        id: 'hist-1905-5',
        title: 'Naval incident fog',
        briefing:
          'A collier and a destroyer exchange warning shots near a disputed roadstead. Admiralties demand ROE clarity before dawn cables harden into ultimata.',
        stakes:
          'An unclear incident can outrun your mediation track.',
        choices: [
          {
            id: 'hist-1905-5a',
            label: 'Issue restrictive ROE and notify both fleets',
            detail: 'Bound observation with no pursuit; copy both capitals.',
            kind: 'naval',
            markerId: 'fleet',
            short: 'ROE',
            effects: [
              { tag: 'escalation', weight: -2, summary: 'Lowers kinetic odds' },
              { tag: 'diplomacy', weight: 1, summary: 'Transparent restraint' },
              { tag: 'deterrence', weight: -1, summary: 'Presence looks softer' },
            ],
          },
          {
            id: 'hist-1905-5b',
            label: 'Escalate observation to armed escort of neutrals',
            detail: 'Protect commercial flags; accept higher contact risk.',
            kind: 'naval',
            markerId: 'strait',
            short: 'ESCORT',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Shows teeth at sea' },
              { tag: 'escalation', weight: 2, summary: 'Incident ladder rises' },
              { tag: 'market_stability', weight: 1, summary: 'Trade reassured' },
            ],
          },
          {
            id: 'hist-1905-5c',
            label: 'Demand joint inquiry before any further sorties',
            detail: 'Freeze narrative with a shared fact-finding clock.',
            kind: 'diplomatic',
            markerId: 'cable',
            short: 'INQUIRE',
            effects: [
              { tag: 'time', weight: 2, summary: 'Buys investigative days' },
              { tag: 'credibility', weight: 1, summary: 'Process looks fair' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Hawks call delay' },
            ],
          },
        ],
      },
      {
        id: 'hist-1905-6',
        title: 'Domestic loan revolt',
        briefing:
          'Parliamentarians and papers attack “Asian adventures” financed by your banks. Finance ministry warns of a confidence wobble if you stay silent.',
        stakes:
          'Home politics can yank the lending lever from your hand.',
        choices: [
          {
            id: 'hist-1905-6a',
            label: 'Brief a closed-session economic case for mediation',
            detail: 'Trade continuity as the public frame.',
            kind: 'political',
            markerId: 'capital_a',
            short: 'BRIEF',
            effects: [
              { tag: 'domestic_support', weight: 1, summary: 'Some oxygen' },
              { tag: 'diplomacy', weight: 1, summary: 'Links home to table' },
              { tag: 'credibility', weight: 1, summary: 'Looks deliberate' },
            ],
          },
          {
            id: 'hist-1905-6b',
            label: 'Announce a temporary war-loan moratorium at home',
            detail: 'Force markets and cabinets to feel scarcity.',
            kind: 'economic',
            markerId: 'cable',
            short: 'MORAT',
            effects: [
              { tag: 'economic_pressure', weight: 2, summary: 'Squeezes belligerents' },
              { tag: 'market_stability', weight: -2, summary: 'Domestic nerves' },
              { tag: 'civilian_cost', weight: 1, summary: 'Savings scare' },
            ],
          },
          {
            id: 'hist-1905-6c',
            label: 'Let the press run while you hold the line privately',
            detail: 'Absorb heat; change nothing publicly.',
            kind: 'political',
            markerId: 'capital_b',
            short: 'ABSORB',
            effects: [
              { tag: 'time', weight: 1, summary: 'Avoids hasty pivot' },
              { tag: 'domestic_support', weight: -2, summary: 'Anger builds' },
              { tag: 'credibility', weight: -1, summary: 'Looks evasive' },
            ],
          },
        ],
      },
      {
        id: 'hist-1905-7',
        title: 'Ally asks for a fleet signal',
        briefing:
          'A partner capital wants a joint naval demonstration “to keep the settlement honest.” Your admiralty is split between solidarity and entanglement.',
        stakes:
          'Visible solidarity can lock you into enforcement.',
        choices: [
          {
            id: 'hist-1905-7a',
            label: 'Offer a time-limited joint observation patrol',
            detail: 'Shared presence, no boarding mandate.',
            kind: 'naval',
            markerId: 'fleet',
            short: 'JOINT',
            effects: [
              { tag: 'alliance_cohesion', weight: 2, summary: 'Partner reassured' },
              { tag: 'deterrence', weight: 1, summary: 'Combined signal' },
              { tag: 'escalation', weight: 1, summary: 'More hulls in theater' },
            ],
          },
          {
            id: 'hist-1905-7b',
            label: 'Refuse demonstration; propose a commercial open-door note',
            detail: 'Lead with trade norms instead of guns.',
            kind: 'diplomatic',
            markerId: 'island',
            short: 'NOTE',
            effects: [
              { tag: 'market_stability', weight: 2, summary: 'Commercial frame' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Partner feels alone' },
              { tag: 'diplomacy', weight: 1, summary: 'Wider table' },
            ],
          },
          {
            id: 'hist-1905-7c',
            label: 'Commit only to intelligence sharing from cable stations',
            detail: 'Help without hulls.',
            kind: 'diplomatic',
            markerId: 'cable',
            short: 'INTEL',
            effects: [
              { tag: 'alliance_cohesion', weight: 1, summary: 'Useful but limited' },
              { tag: 'time', weight: 1, summary: 'Keeps options' },
              { tag: 'deterrence', weight: -1, summary: 'No force signal' },
            ],
          },
        ],
      },
      {
        id: 'hist-1905-8',
        title: 'Conflicting casualty cables',
        briefing:
          'Two rival wires disagree on whether a coastal town was shelled. Your press and partners demand a sided narrative before talks resume.',
        stakes:
          'Information fog is a weapon; owning a false map costs more later.',
        choices: [
          {
            id: 'hist-1905-8a',
            label: 'Publish only verified, timestamped facts',
            detail: 'Starve rumor; accept looking slow.',
            kind: 'diplomatic',
            markerId: 'cable',
            short: 'FACTS',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Truth discipline' },
              { tag: 'time', weight: 1, summary: 'Slower spin cycle' },
              { tag: 'domestic_support', weight: -1, summary: 'Press impatient' },
            ],
          },
          {
            id: 'hist-1905-8b',
            label: 'Amplify the version that favors your mediation brief',
            detail: 'Shape the room even if evidence is thin.',
            kind: 'political',
            markerId: 'capital_a',
            short: 'SHAPE',
            effects: [
              { tag: 'diplomacy', weight: 1, summary: 'Narrative leverage' },
              { tag: 'credibility', weight: -2, summary: 'Risk of exposure' },
              { tag: 'escalation', weight: 1, summary: 'Hardens blame' },
            ],
          },
          {
            id: 'hist-1905-8c',
            label: 'Convene a three-power telegraph board',
            detail: 'Force shared sourcing rules mid-crisis.',
            kind: 'diplomatic',
            markerId: 'capital_b',
            short: 'BOARD',
            effects: [
              { tag: 'alliance_cohesion', weight: 1, summary: 'Process shared' },
              { tag: 'diplomacy', weight: 2, summary: 'Rebuilds table' },
              { tag: 'time', weight: -1, summary: 'Coordination tax' },
            ],
          },
        ],
      },
      {
        id: 'hist-1905-9',
        title: 'Treaty off-ramp window',
        briefing:
          'A 72-hour pause appears: both sides hint they can accept a corridor-plus-indemnity formula if you guarantee quiet implementation.',
        stakes:
          'Windows close when prestige speeches begin.',
        choices: [
          {
            id: 'hist-1905-9a',
            label: 'Guarantee quiet implementation with observers only',
            detail: 'No flags, no occupation rhetoric.',
            kind: 'diplomatic',
            markerId: 'strait',
            short: 'OBSERV',
            effects: [
              { tag: 'diplomacy', weight: 3, summary: 'Locks a bargain' },
              { tag: 'escalation', weight: -1, summary: 'Lowers heat' },
              { tag: 'credibility', weight: 1, summary: 'Honest broker' },
            ],
          },
          {
            id: 'hist-1905-9b',
            label: 'Demand a public apology clause before signing',
            detail: 'Satisfy domestic honor politics.',
            kind: 'political',
            markerId: 'capital_a',
            short: 'APOLOGY',
            effects: [
              { tag: 'domestic_support', weight: 2, summary: 'Honor framed' },
              { tag: 'diplomacy', weight: -2, summary: 'May kill the window' },
              { tag: 'time', weight: -1, summary: 'Deadline risk' },
            ],
          },
          {
            id: 'hist-1905-9c',
            label: 'Tie the formula to a short-term credit bridge',
            detail: 'Money makes the map stick.',
            kind: 'economic',
            markerId: 'cable',
            short: 'BRIDGE',
            effects: [
              { tag: 'market_stability', weight: 2, summary: 'Settlement finance' },
              { tag: 'diplomacy', weight: 1, summary: 'Practical glue' },
              { tag: 'economic_pressure', weight: 1, summary: 'Conditional cash' },
            ],
          },
        ],
      },
      {
        id: 'hist-1905-10',
        title: 'Settlement enforcement endgame',
        briefing:
          'Signature is near. You must choose how hard to police the new map—and whether your navy becomes its guarantor.',
        stakes:
          'Enforcement defines whether peace is architecture or paper.',
        choices: [
          {
            id: 'hist-1905-10a',
            label: 'Accept a limited naval guarantee for the corridor',
            detail: 'Time-bounded patrol authority.',
            kind: 'naval',
            markerId: 'fleet',
            short: 'GUARANT',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Map has teeth' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Shared duty' },
              { tag: 'escalation', weight: 1, summary: 'Longer entanglement' },
            ],
          },
          {
            id: 'hist-1905-10b',
            label: 'Refuse force guarantees; push commercial arbitration',
            detail: 'Courts and tariffs, not hulls.',
            kind: 'legal',
            markerId: 'island',
            short: 'ARB',
            effects: [
              { tag: 'market_stability', weight: 2, summary: 'Rule-based trade' },
              { tag: 'deterrence', weight: -1, summary: 'Weak enforcement' },
              { tag: 'diplomacy', weight: 1, summary: 'Legal path' },
            ],
          },
          {
            id: 'hist-1905-10c',
            label: 'Declare mission complete and withdraw influence',
            detail: 'Exit before the next quarrel.',
            kind: 'political',
            markerId: 'capital_b',
            short: 'EXIT',
            effects: [
              { tag: 'time', weight: 1, summary: 'Clears bandwidth' },
              { tag: 'credibility', weight: -1, summary: 'Looks fickle' },
              { tag: 'alliance_cohesion', weight: -2, summary: 'Partners stranded' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'hist-1914-july-wire',
    year: 1914,
    era: '1914–1918',
    title: 'July Wire',
    region: 'Europe · Balkans · capitals',
    meterFamily: 'conflict',
    theaterArchetype: 'europe',
    premise:
      'After the Sarajevo assassination, ultimata and railway timetables compress days into hours. You advise a cabinet that can still choose restraint—or lock the continent into war.',
    role: 'Cabinet secretary for foreign and war coordination',
    tension:
      'Alliance credibility versus escalation control while the trains can still be stopped.',
    beats: [
      {
        id: 'hist-1914-1',
        title: 'Ultimatum hour',
        briefing:
          'An ally asks you to endorse a harsh ultimatum. Softening it may split the alliance; rubber-stamping it may make war automatic.',
        stakes:
          'Language now becomes mobilization logic.',
        choices: [
          {
            id: 'hist-1914-1a',
            label: 'Endorse with a 48-hour mediation rider',
            detail: 'Support firmness but force a pause clock.',
            kind: 'diplomatic',
            markerId: 'brussels',
            short: 'RIDER',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Inserts time' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Still visibly loyal' },
              { tag: 'escalation', weight: -1, summary: 'Slight brake' },
            ],
          },
          {
            id: 'hist-1914-1b',
            label: 'Full public endorsement',
            detail: 'Match the ally’s maximal text.',
            kind: 'political',
            markerId: 'capital',
            short: 'FULL',
            effects: [
              { tag: 'alliance_cohesion', weight: 3, summary: 'Unambiguous loyalty' },
              { tag: 'escalation', weight: 2, summary: 'War more likely' },
              { tag: 'credibility', weight: 1, summary: 'Clear signal' },
            ],
          },
          {
            id: 'hist-1914-1c',
            label: 'Quietly urge softer terms',
            detail: 'Private pressure, public silence.',
            kind: 'diplomatic',
            markerId: 'parliament',
            short: 'SOFT',
            effects: [
              { tag: 'diplomacy', weight: 1, summary: 'Off-ramp attempt' },
              { tag: 'alliance_cohesion', weight: -2, summary: 'Ally feels abandoned' },
              { tag: 'escalation', weight: -1, summary: 'May slow cascade' },
            ],
          },
        ],
      },
      {
        id: 'hist-1914-2',
        title: 'Partial mobilization ask',
        briefing:
          'The general staff wants partial mobilization “for defense.” Finance warns markets will read it as war.',
        stakes:
          'Military readiness and political signaling are identical tonight.',
        choices: [
          {
            id: 'hist-1914-2a',
            label: 'Authorize limited frontier measures only',
            detail: 'No general call-up yet.',
            kind: 'kinetic',
            markerId: 'streets',
            short: 'LIMIT',
            effects: [
              { tag: 'deterrence', weight: 1, summary: 'Some readiness' },
              { tag: 'escalation', weight: 1, summary: 'Still provocative' },
              { tag: 'market_stability', weight: -1, summary: 'Nerves' },
            ],
          },
          {
            id: 'hist-1914-2b',
            label: 'Refuse mobilization; push talks',
            detail: 'Keep the railway schedules cold.',
            kind: 'diplomatic',
            markerId: 'ballot',
            short: 'HOLD',
            effects: [
              { tag: 'escalation', weight: -2, summary: 'Brakes the machine' },
              { tag: 'deterrence', weight: -1, summary: 'Looks exposed' },
              { tag: 'diplomacy', weight: 2, summary: 'Talks first' },
            ],
          },
          {
            id: 'hist-1914-2c',
            label: 'Full mobilization with defensive frame',
            detail: 'Match the timetable; manage the narrative.',
            kind: 'political',
            markerId: 'capital',
            short: 'MOB',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Force ready' },
              { tag: 'escalation', weight: 3, summary: 'Locks war logic' },
              { tag: 'domestic_support', weight: 1, summary: 'Resolute optics' },
            ],
          },
        ],
      },
      {
        id: 'hist-1914-3',
        title: 'British question',
        briefing:
          'London’s ambiguity is the last major unknown. Do you seek a clear guarantee, accept fog, or act as if alone?',
        stakes:
          'Clarity can deter—or remove the last brake.',
        choices: [
          {
            id: 'hist-1914-3a',
            label: 'Demand a written guarantee tonight',
            detail: 'Force London to choose.',
            kind: 'diplomatic',
            markerId: 'brussels',
            short: 'ASK',
            effects: [
              { tag: 'alliance_cohesion', weight: 1, summary: 'If yes, stronger bloc' },
              { tag: 'diplomacy', weight: -1, summary: 'May push London away' },
              { tag: 'time', weight: -1, summary: 'Deadline pressure' },
            ],
          },
          {
            id: 'hist-1914-3b',
            label: 'Accept ambiguity; keep bilateral channels',
            detail: 'Do not force a premature British crisis.',
            kind: 'diplomatic',
            markerId: 'districts',
            short: 'FOG',
            effects: [
              { tag: 'diplomacy', weight: 1, summary: 'Keeps options' },
              { tag: 'credibility', weight: -1, summary: 'Unclear deterrent' },
              { tag: 'time', weight: 1, summary: 'Hours remain' },
            ],
          },
          {
            id: 'hist-1914-3c',
            label: 'Plan as if Britain stays out',
            detail: 'Optimize for a short continental war.',
            kind: 'political',
            markerId: 'parliament',
            short: 'ALONE',
            effects: [
              { tag: 'escalation', weight: 2, summary: 'War plan accelerates' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Anglo link weakens' },
              { tag: 'deterrence', weight: -1, summary: 'Misread possible' },
            ],
          },
        ],
      },
      {
        id: 'hist-1914-4',
        title: 'Final night',
        briefing:
          'Telegrams conflict. One path still offers a conference; another says the frontier is already crossed.',
        stakes:
          'You may be deciding with incomplete facts.',
        choices: [
          {
            id: 'hist-1914-4a',
            label: 'Order a 24-hour hold for conference',
            detail: 'Risk local disadvantage for a last table.',
            kind: 'diplomatic',
            markerId: 'capital',
            short: 'HOLD24',
            effects: [
              { tag: 'diplomacy', weight: 3, summary: 'Last off-ramp' },
              { tag: 'deterrence', weight: -1, summary: 'Military risk' },
              { tag: 'escalation', weight: -2, summary: 'Pause attempt' },
            ],
          },
          {
            id: 'hist-1914-4b',
            label: 'Execute war plan as briefed',
            detail: 'Treat delay as defeat.',
            kind: 'kinetic',
            markerId: 'streets',
            short: 'EXECUTE',
            effects: [
              { tag: 'escalation', weight: 3, summary: 'War begins' },
              { tag: 'deterrence', weight: 2, summary: 'Speed as strategy' },
              { tag: 'diplomacy', weight: -3, summary: 'Talks die' },
            ],
          },
          {
            id: 'hist-1914-4c',
            label: 'Localized response only',
            detail: 'Answer the frontier without the full machine.',
            kind: 'naval',
            markerId: 'ballot',
            short: 'LOCAL',
            effects: [
              { tag: 'escalation', weight: 1, summary: 'Limited clash' },
              { tag: 'diplomacy', weight: 1, summary: 'Room remains' },
              { tag: 'credibility', weight: 1, summary: 'Controlled force' },
            ],
          },
        ],
      },
      {
        id: 'hist-1914-5',
        title: 'Railway timetable shock',
        briefing:
          'General staffs report that once certain trains move, reversal costs days you may not have. A partial halt is still technically possible.',
        stakes:
          'Logistics can become destiny if cabinets sleep.',
        choices: [
          {
            id: 'hist-1914-5a',
            label: 'Order a 24-hour freeze on further rolling stock',
            detail: 'Buy one more night of talk.',
            kind: 'political',
            markerId: 'capital',
            short: 'FREEZE',
            effects: [
              { tag: 'time', weight: 2, summary: 'Clock pauses' },
              { tag: 'escalation', weight: -1, summary: 'Slows machine' },
              { tag: 'deterrence', weight: -1, summary: 'Looks exposed' },
            ],
          },
          {
            id: 'hist-1914-5b',
            label: 'Authorize masked concentration while denying mobilization',
            detail: 'Prepare without the word.',
            kind: 'kinetic',
            markerId: 'districts',
            short: 'MASK',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Hidden readiness' },
              { tag: 'escalation', weight: 2, summary: 'War logic advances' },
              { tag: 'credibility', weight: -1, summary: 'Partners smell deceit' },
            ],
          },
          {
            id: 'hist-1914-5c',
            label: 'Publish a joint civilian-military pause proposal',
            detail: 'Make restraint a public offer.',
            kind: 'diplomatic',
            markerId: 'brussels',
            short: 'PAUSE',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Visible off-ramp' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Shared ask' },
              { tag: 'domestic_support', weight: -1, summary: 'Hawks howl' },
            ],
          },
        ],
      },
      {
        id: 'hist-1914-6',
        title: 'Street and press pressure',
        briefing:
          'Crowds and papers demand “firmness.” Soft language is framed as betrayal of allies and of the dead in Sarajevo.',
        stakes:
          'Domestic theater can close diplomatic doors.',
        choices: [
          {
            id: 'hist-1914-6a',
            label: 'Address the chamber with conditional firmness',
            detail: 'Pledge defense of partners, not offense.',
            kind: 'political',
            markerId: 'parliament',
            short: 'COND',
            effects: [
              { tag: 'domestic_support', weight: 2, summary: 'Optics of resolve' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Partners hear loyalty' },
              { tag: 'escalation', weight: 1, summary: 'Less soft room' },
            ],
          },
          {
            id: 'hist-1914-6b',
            label: 'Impose temporary press guidelines on mobilization rumors',
            detail: 'Slow panic cascades.',
            kind: 'legal',
            markerId: 'streets',
            short: 'PRESS',
            effects: [
              { tag: 'social_calm', weight: 1, summary: 'Less stampede' },
              { tag: 'norm_erosion', weight: 1, summary: 'Speech friction' },
              { tag: 'credibility', weight: -1, summary: 'Censorship charge' },
            ],
          },
          {
            id: 'hist-1914-6c',
            label: 'Refuse spectacle; keep talks in closed cabinet',
            detail: 'Govern quietly.',
            kind: 'political',
            markerId: 'capital',
            short: 'CLOSED',
            effects: [
              { tag: 'diplomacy', weight: 1, summary: 'Room to bargain' },
              { tag: 'domestic_support', weight: -2, summary: 'Vacuum of leadership' },
              { tag: 'time', weight: 1, summary: 'Less theater tax' },
            ],
          },
        ],
      },
      {
        id: 'hist-1914-7',
        title: 'Ally’s blank-check ask',
        briefing:
          'Your principal ally wants an unambiguous public guarantee tonight. Ambiguity may keep peace—or invite miscalculation.',
        stakes:
          'Clarity can deter or compel.',
        choices: [
          {
            id: 'hist-1914-7a',
            label: 'Issue a narrow defensive guarantee only',
            detail: 'Attack on ally triggers aid; offensive wars do not.',
            kind: 'diplomatic',
            markerId: 'brussels',
            short: 'DEFONLY',
            effects: [
              { tag: 'alliance_cohesion', weight: 2, summary: 'Credible loyalty' },
              { tag: 'deterrence', weight: 1, summary: 'Clear tripwire' },
              { tag: 'escalation', weight: 1, summary: 'Harder to stay out' },
            ],
          },
          {
            id: 'hist-1914-7b',
            label: 'Give a private assurance, public ambiguity',
            detail: 'Two audiences, two texts.',
            kind: 'diplomatic',
            markerId: 'capital',
            short: 'DUAL',
            effects: [
              { tag: 'alliance_cohesion', weight: 1, summary: 'Private comfort' },
              { tag: 'credibility', weight: -1, summary: 'Mixed signals' },
              { tag: 'time', weight: 1, summary: 'Keeps flexibility' },
            ],
          },
          {
            id: 'hist-1914-7c',
            label: 'Refuse any new guarantee beyond existing treaties',
            detail: 'Hold the written line.',
            kind: 'political',
            markerId: 'parliament',
            short: 'HOLD',
            effects: [
              { tag: 'escalation', weight: -1, summary: 'Less automatic war' },
              { tag: 'alliance_cohesion', weight: -2, summary: 'Ally feels abandoned' },
              { tag: 'diplomacy', weight: 1, summary: 'Space for mediation' },
            ],
          },
        ],
      },
      {
        id: 'hist-1914-8',
        title: 'Conflicting Balkan reports',
        briefing:
          'One cable says local fighting has stopped; another claims artillery already moved. Your war office and foreign office brief opposite worlds.',
        stakes:
          'Bad maps make irrevocable choices.',
        choices: [
          {
            id: 'hist-1914-8a',
            label: 'Require dual-source confirmation before any military reply',
            detail: 'Slow the OODA loop deliberately.',
            kind: 'diplomatic',
            markerId: 'capital',
            short: 'DUALSRC',
            effects: [
              { tag: 'time', weight: 2, summary: 'Verification delay' },
              { tag: 'escalation', weight: -1, summary: 'Fewer hair-triggers' },
              { tag: 'deterrence', weight: -1, summary: 'Looks sluggish' },
            ],
          },
          {
            id: 'hist-1914-8b',
            label: 'Side with the war office picture and prep countermoves',
            detail: 'Assume the worst case.',
            kind: 'kinetic',
            markerId: 'districts',
            short: 'WORST',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Ready posture' },
              { tag: 'escalation', weight: 2, summary: 'Assumes war' },
              { tag: 'diplomacy', weight: -1, summary: 'Talks starved' },
            ],
          },
          {
            id: 'hist-1914-8c',
            label: 'Send a neutral military observer team if transit allows',
            detail: 'Buy independent eyes.',
            kind: 'diplomatic',
            markerId: 'brussels',
            short: 'OBS',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Independent view' },
              { tag: 'diplomacy', weight: 1, summary: 'Process signal' },
              { tag: 'time', weight: -1, summary: 'Transit risk' },
            ],
          },
        ],
      },
      {
        id: 'hist-1914-9',
        title: 'Last mediation window',
        briefing:
          'A neutral king offers a 12-hour conference if all partial mobilizations pause. Staffs say the pause is military suicide—or the only peace left.',
        stakes:
          'Honor and survival arguments collide at midnight.',
        choices: [
          {
            id: 'hist-1914-9a',
            label: 'Accept the conference and order a matching pause',
            detail: 'Risk exposure for a table.',
            kind: 'diplomatic',
            markerId: 'brussels',
            short: 'TABLE',
            effects: [
              { tag: 'diplomacy', weight: 3, summary: 'Last off-ramp' },
              { tag: 'escalation', weight: -2, summary: 'Trains may stop' },
              { tag: 'deterrence', weight: -1, summary: 'Temporary exposure' },
            ],
          },
          {
            id: 'hist-1914-9b',
            label: 'Accept talks but refuse any halt in preparations',
            detail: 'Talk while loading.',
            kind: 'political',
            markerId: 'capital',
            short: 'TALKARM',
            effects: [
              { tag: 'diplomacy', weight: 1, summary: 'Channel open' },
              { tag: 'escalation', weight: 1, summary: 'Prep continues' },
              { tag: 'credibility', weight: -1, summary: 'Looks insincere' },
            ],
          },
          {
            id: 'hist-1914-9c',
            label: 'Decline; prioritize alliance timetable discipline',
            detail: 'Do not let neutrals rewrite your war plan.',
            kind: 'kinetic',
            markerId: 'parliament',
            short: 'TIMETBL',
            effects: [
              { tag: 'alliance_cohesion', weight: 2, summary: 'Staffs aligned' },
              { tag: 'escalation', weight: 3, summary: 'War likelier' },
              { tag: 'diplomacy', weight: -2, summary: 'Window closed' },
            ],
          },
        ],
      },
      {
        id: 'hist-1914-10',
        title: 'Irrevocable night',
        briefing:
          'Either the first general mobilization orders go out, or you attempt a unilateral stand-down that may shatter alliances. There is no clean status quo.',
        stakes:
          'Endgame choices define the century’s opening.',
        choices: [
          {
            id: 'hist-1914-10a',
            label: 'Authorize general mobilization with a parallel peace note',
            detail: 'Sword and olive branch together.',
            kind: 'kinetic',
            markerId: 'capital',
            short: 'MOBPEACE',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Force massing' },
              { tag: 'escalation', weight: 3, summary: 'War machine live' },
              { tag: 'diplomacy', weight: 1, summary: 'Note still sent' },
            ],
          },
          {
            id: 'hist-1914-10b',
            label: 'Unilateral stand-down pending 48-hour talks',
            detail: 'Break the timetable alone if needed.',
            kind: 'diplomatic',
            markerId: 'brussels',
            short: 'STAND',
            effects: [
              { tag: 'escalation', weight: -3, summary: 'Hard brake' },
              { tag: 'alliance_cohesion', weight: -3, summary: 'Allies shocked' },
              { tag: 'diplomacy', weight: 2, summary: 'Peace bet' },
            ],
          },
          {
            id: 'hist-1914-10c',
            label: 'Seek a cabinet vote that splits war and diplomacy portfolios',
            detail: 'Institutionalize dual tracks.',
            kind: 'political',
            markerId: 'parliament',
            short: 'SPLIT',
            effects: [
              { tag: 'governability', weight: 1, summary: 'Process clarity' },
              { tag: 'time', weight: 1, summary: 'Hours bought' },
              { tag: 'credibility', weight: -1, summary: 'Looks divided' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'hist-1917-petrograd',
    year: 1917,
    era: '1914–1918',
    title: 'Petrograd Fracture',
    region: 'Russia · Eastern Front · Allied capitals',
    meterFamily: 'politics',
    theaterArchetype: 'europe',
    premise:
      'Dual power in Petrograd, desertions at the front, and Allied loans hanging on whether Russia stays in the war. You advise an Allied mission on whether to prop, pressure, or prepare for exit.',
    role: 'Allied liaison to the Provisional Government',
    tension:
      'Keep an eastern front without owning Russia’s internal collapse.',
    beats: [
      {
        id: 'hist-1917-1',
        title: 'Recognition question',
        briefing:
          'The Provisional Government asks for formal recognition and a loan tranche. Radical soviets call any endorsement foreign interference.',
        stakes:
          'Legitimacy abroad can become a weapon at home.',
        choices: [
          {
            id: 'hist-1917-1a',
            label: 'Recognize and condition loans on war continuity',
            detail: 'Tie money to staying in the coalition.',
            kind: 'diplomatic',
            markerId: 'capital',
            short: 'RECOG',
            effects: [
              { tag: 'alliance_cohesion', weight: 2, summary: 'Keeps Russia in the frame' },
              { tag: 'economic_pressure', weight: 1, summary: 'Leverage via credit' },
              { tag: 'governability', weight: -1, summary: 'Feeds nationalist resentment' },
            ],
          },
          {
            id: 'hist-1917-1b',
            label: 'Quiet aid; delay recognition',
            detail: 'Send grain and advisors without a public stamp.',
            kind: 'economic',
            markerId: 'brussels',
            short: 'QUIET',
            effects: [
              { tag: 'diplomacy', weight: 1, summary: 'Keeps options' },
              { tag: 'credibility', weight: -1, summary: 'Looks hesitant' },
              { tag: 'time', weight: 1, summary: 'Waits for clarity' },
            ],
          },
          {
            id: 'hist-1917-1c',
            label: 'Demand a war cabinet reshuffle first',
            detail: 'Make recognition contingent on personnel.',
            kind: 'political',
            markerId: 'parliament',
            short: 'RESHUF',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Shows standards' },
              { tag: 'governability', weight: -2, summary: 'Undermines hosts' },
              { tag: 'polarization', weight: 2, summary: 'Centers foreign meddling charge' },
            ],
          },
        ],
      },
      {
        id: 'hist-1917-2',
        title: 'Front collapse reports',
        briefing:
          'Staff cables say whole units are walking home. Generals want you to urge an offensive to restore discipline.',
        stakes:
          'An offensive can rally—or shatter—what remains.',
        choices: [
          {
            id: 'hist-1917-2a',
            label: 'Urge a limited offensive with Allied munitions',
            detail: 'Supply shells; insist on a narrow sector.',
            kind: 'kinetic',
            markerId: 'streets',
            short: 'OFFENS',
            effects: [
              { tag: 'deterrence', weight: 1, summary: 'Shows fight remains' },
              { tag: 'escalation', weight: 2, summary: 'Casualties risk revolt' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Front stays relevant' },
            ],
          },
          {
            id: 'hist-1917-2b',
            label: 'Counsel defensive consolidation only',
            detail: 'Hold lines; no glory push.',
            kind: 'diplomatic',
            markerId: 'districts',
            short: 'HOLD',
            effects: [
              { tag: 'escalation', weight: -1, summary: 'Lowers shock risk' },
              { tag: 'credibility', weight: -1, summary: 'Allies doubt resolve' },
              { tag: 'governability', weight: 1, summary: 'Less social rupture' },
            ],
          },
          {
            id: 'hist-1917-2c',
            label: 'Prepare contingency for separate peace',
            detail: 'Quietly draft exit assumptions.',
            kind: 'political',
            markerId: 'ballot',
            short: 'EXIT',
            effects: [
              { tag: 'diplomacy', weight: -2, summary: 'Signals abandonment' },
              { tag: 'alliance_cohesion', weight: -2, summary: 'Coalition shock' },
              { tag: 'time', weight: 1, summary: 'Plans for worst case' },
            ],
          },
        ],
      },
      {
        id: 'hist-1917-3',
        title: 'Street dual power',
        briefing:
          'Soviets seize telegraph nodes. Liberals beg for foreign marine guards at embassies; radicals call it invasion.',
        stakes:
          'Protecting diplomats can look like choosing sides in a civil conflict.',
        choices: [
          {
            id: 'hist-1917-3a',
            label: 'Deploy limited embassy guards',
            detail: 'Defensive posture only at compounds.',
            kind: 'kinetic',
            markerId: 'streets',
            short: 'GUARD',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Protects mission' },
              { tag: 'escalation', weight: 2, summary: 'Looks like intervention' },
              { tag: 'polarization', weight: 1, summary: 'Hardens camps' },
            ],
          },
          {
            id: 'hist-1917-3b',
            label: 'Evacuate nonessential staff',
            detail: 'Reduce exposure without force.',
            kind: 'diplomatic',
            markerId: 'capital',
            short: 'EVAC',
            effects: [
              { tag: 'escalation', weight: -1, summary: 'Lowers flashpoint' },
              { tag: 'credibility', weight: -1, summary: 'Looks like flight' },
              { tag: 'diplomacy', weight: 1, summary: 'Avoids clash' },
            ],
          },
          {
            id: 'hist-1917-3c',
            label: 'Mediate a soviet–cabinet protocol',
            detail: 'Broker shared messaging on order.',
            kind: 'civic',
            markerId: 'parliament',
            short: 'MEDIATE',
            effects: [
              { tag: 'governability', weight: 1, summary: 'Temporary bridge' },
              { tag: 'diplomacy', weight: 2, summary: 'Local ownership' },
              { tag: 'credibility', weight: -1, summary: 'May legitimize radicals' },
            ],
          },
        ],
      },
      {
        id: 'hist-1917-4',
        title: 'Loan cliff',
        briefing:
          'Treasury says the next tranche decides whether factories pay wages this month.',
        stakes:
          'Wages unpaid become politics overnight.',
        choices: [
          {
            id: 'hist-1917-4a',
            label: 'Release tranche with wage earmarks',
            detail: 'Money for workers, not just munitions.',
            kind: 'economic',
            markerId: 'brussels',
            short: 'WAGES',
            effects: [
              { tag: 'social_calm', weight: 2, summary: 'Buys short calm' },
              { tag: 'economic_pressure', weight: -1, summary: 'Spends leverage' },
              { tag: 'governability', weight: 1, summary: 'Cabinet breathes' },
            ],
          },
          {
            id: 'hist-1917-4b',
            label: 'Hold funds until a clear cabinet forms',
            detail: 'No blank check into chaos.',
            kind: 'economic',
            markerId: 'ballot',
            short: 'HOLD$',
            effects: [
              { tag: 'economic_pressure', weight: 2, summary: 'Forces choices' },
              { tag: 'polarization', weight: 2, summary: 'Blame foreigners' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Front at risk' },
            ],
          },
          {
            id: 'hist-1917-4c',
            label: 'Split aid: humanitarian now, military later',
            detail: 'Food first; shells after order returns.',
            kind: 'civic',
            markerId: 'districts',
            short: 'SPLIT',
            effects: [
              { tag: 'civilian_cost', weight: -1, summary: 'Eases hunger' },
              { tag: 'diplomacy', weight: 1, summary: 'Looks humane' },
              { tag: 'deterrence', weight: -1, summary: 'War effort softens' },
            ],
          },
        ],
      },
      {
        id: 'hist-1917-5',
        title: 'Front desertion cascade',
        briefing:
          'Reports of units melting westward collide with Allied demands that Russia hold. Your liaison can still shape whether aid is framed as rescue or leverage.',
        stakes:
          'A collapsing front can end your eastern strategy overnight.',
        choices: [
          {
            id: 'hist-1917-5a',
            label: 'Condition further munitions on a holding order only',
            detail: 'No offensive; stabilize lines.',
            kind: 'diplomatic',
            markerId: 'capital',
            short: 'HOLD',
            effects: [
              { tag: 'alliance_cohesion', weight: 1, summary: 'War effort framed' },
              { tag: 'escalation', weight: -1, summary: 'Less offensive push' },
              { tag: 'credibility', weight: 1, summary: 'Clear ask' },
            ],
          },
          {
            id: 'hist-1917-5b',
            label: 'Flood aid without political strings this week',
            detail: 'Prioritize keeping any eastern pressure.',
            kind: 'economic',
            markerId: 'brussels',
            short: 'FLOOD',
            effects: [
              { tag: 'alliance_cohesion', weight: 2, summary: 'Partners stay' },
              { tag: 'escalation', weight: 1, summary: 'War continues' },
              { tag: 'governability', weight: -1, summary: 'Props weak center' },
            ],
          },
          {
            id: 'hist-1917-5c',
            label: 'Open quiet talks on a separate armistice track',
            detail: 'Admit the front may be unsustainable.',
            kind: 'diplomatic',
            markerId: 'parliament',
            short: 'ARM',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Exit path' },
              { tag: 'alliance_cohesion', weight: -2, summary: 'Western fury' },
              { tag: 'time', weight: 1, summary: 'Space to rethink' },
            ],
          },
        ],
      },
      {
        id: 'hist-1917-6',
        title: 'Dual-power street night',
        briefing:
          'Soviets and ministers claim the same squares. Your embassy’s security detail asks whether to shelter liberals, stay neutral, or evacuate nonessentials.',
        stakes:
          'Choosing sides in a capital’s streets is a recognition act.',
        choices: [
          {
            id: 'hist-1917-6a',
            label: 'Shelter provisional ministers quietly',
            detail: 'Signal continuity preference without proclamation.',
            kind: 'diplomatic',
            markerId: 'capital',
            short: 'SHELTER',
            effects: [
              { tag: 'alliance_cohesion', weight: 1, summary: 'Continuity bias' },
              { tag: 'escalation', weight: 1, summary: 'Factional risk' },
              { tag: 'credibility', weight: -1, summary: 'Partial look' },
            ],
          },
          {
            id: 'hist-1917-6b',
            label: 'Evacuate nonessentials; keep political staff thin',
            detail: 'Reduce hostage and incident risk.',
            kind: 'political',
            markerId: 'streets',
            short: 'EVAC',
            effects: [
              { tag: 'civilian_cost', weight: -1, summary: 'People safer' },
              { tag: 'time', weight: 1, summary: 'Flexibility' },
              { tag: 'credibility', weight: -1, summary: 'Looks like flight' },
            ],
          },
          {
            id: 'hist-1917-6c',
            label: 'Issue a public call for civic order and legal transfer',
            detail: 'Moralize process over persons.',
            kind: 'civic',
            markerId: 'districts',
            short: 'ORDER',
            effects: [
              { tag: 'norm_protection', weight: 2, summary: 'Process frame' },
              { tag: 'polarization', weight: 1, summary: 'Both camps angered' },
              { tag: 'diplomacy', weight: 1, summary: 'Standards stated' },
            ],
          },
        ],
      },
      {
        id: 'hist-1917-7',
        title: 'Allied war-aims telegram',
        briefing:
          'London and Paris demand you press Petrograd to renounce a separate peace—publicly. Soft language may be read as greenlighting exit.',
        stakes:
          'Alliance discipline versus Russian survival politics.',
        choices: [
          {
            id: 'hist-1917-7a',
            label: 'Deliver the hard message privately, soft publicly',
            detail: 'Two-level game to save face.',
            kind: 'diplomatic',
            markerId: 'brussels',
            short: 'TWOLVL',
            effects: [
              { tag: 'alliance_cohesion', weight: 1, summary: 'Allies hear firmness' },
              { tag: 'diplomacy', weight: 1, summary: 'Local room' },
              { tag: 'credibility', weight: -1, summary: 'Dual text risk' },
            ],
          },
          {
            id: 'hist-1917-7b',
            label: 'Refuse to coerce; argue for conditional patience',
            detail: 'Protect any governable center.',
            kind: 'diplomatic',
            markerId: 'capital',
            short: 'PATIENT',
            effects: [
              { tag: 'governability', weight: 1, summary: 'Center oxygen' },
              { tag: 'alliance_cohesion', weight: -2, summary: 'Allies furious' },
              { tag: 'time', weight: 2, summary: 'Buys weeks' },
            ],
          },
          {
            id: 'hist-1917-7c',
            label: 'Threaten recognition withdrawal if separate peace proceeds',
            detail: 'Make exit expensive.',
            kind: 'political',
            markerId: 'parliament',
            short: 'THREAT',
            effects: [
              { tag: 'economic_pressure', weight: 2, summary: 'Recognition lever' },
              { tag: 'escalation', weight: 1, summary: 'Hardens radicals' },
              { tag: 'diplomacy', weight: -1, summary: 'Bridges burn' },
            ],
          },
        ],
      },
      {
        id: 'hist-1917-8',
        title: 'Propaganda fog',
        briefing:
          'Leaflets claim Allied gold buys the provisional cabinet. Your own cables are leaked and distorted. Clarity may require painful transparency.',
        stakes:
          'Information war can finish a government faster than armies.',
        choices: [
          {
            id: 'hist-1917-8a',
            label: 'Publish selected aid ledgers with redactions',
            detail: 'Transparency as inoculation.',
            kind: 'political',
            markerId: 'ballot',
            short: 'LEDGER',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Counters graft myth' },
              { tag: 'domestic_support', weight: -1, summary: 'Awkward numbers' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Allies can defend' },
            ],
          },
          {
            id: 'hist-1917-8b',
            label: 'Flood counter-propaganda through friendly papers',
            detail: 'Fight narrative with narrative.',
            kind: 'civic',
            markerId: 'streets',
            short: 'SPIN',
            effects: [
              { tag: 'polarization', weight: 2, summary: 'Info war heats' },
              { tag: 'credibility', weight: -1, summary: 'Looks manipulative' },
              { tag: 'time', weight: 1, summary: 'Buys a news cycle' },
            ],
          },
          {
            id: 'hist-1917-8c',
            label: 'Stay silent and tighten cable security',
            detail: 'Starve oxygen; fix the pipes.',
            kind: 'diplomatic',
            markerId: 'capital',
            short: 'SILENT',
            effects: [
              { tag: 'time', weight: 1, summary: 'Less fuel' },
              { tag: 'credibility', weight: -2, summary: 'Rumor wins' },
              { tag: 'diplomacy', weight: 1, summary: 'Quiet channels' },
            ],
          },
        ],
      },
      {
        id: 'hist-1917-9',
        title: 'Constituent assembly off-ramp',
        briefing:
          'A narrow window opens to schedule elections that might re-legitimize a center—if you fund logistics and accept messy results.',
        stakes:
          'Democracy as crisis tool is slow and risky—and sometimes the only glue.',
        choices: [
          {
            id: 'hist-1917-9a',
            label: 'Fund election logistics and secure printing',
            detail: 'Bet on procedural legitimacy.',
            kind: 'economic',
            markerId: 'ballot',
            short: 'ELECT',
            effects: [
              { tag: 'norm_protection', weight: 2, summary: 'Ballot path' },
              { tag: 'governability', weight: 1, summary: 'Future mandate' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'War desks impatient' },
            ],
          },
          {
            id: 'hist-1917-9b',
            label: 'Delay elections; prioritize front stabilization first',
            detail: 'Order before ballots.',
            kind: 'political',
            markerId: 'parliament',
            short: 'DELAY',
            effects: [
              { tag: 'governability', weight: 1, summary: 'Short-term control' },
              { tag: 'norm_erosion', weight: 1, summary: 'Mandate slips' },
              { tag: 'escalation', weight: 1, summary: 'Military priority' },
            ],
          },
          {
            id: 'hist-1917-9c',
            label: 'Condition aid on a cross-faction electoral compact',
            detail: 'Force power-sharing rules.',
            kind: 'diplomatic',
            markerId: 'brussels',
            short: 'COMPACT',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Brokered rules' },
              { tag: 'polarization', weight: -1, summary: 'Some buy-in' },
              { tag: 'time', weight: -1, summary: 'Hard bargaining' },
            ],
          },
        ],
      },
      {
        id: 'hist-1917-10',
        title: 'Recognition endgame',
        briefing:
          'A new authority claims the capital. You must recommend recognition, delay, or dual engagement before other capitals lock a bloc line.',
        stakes:
          'Recognition is strategy wearing legal clothes.',
        choices: [
          {
            id: 'hist-1917-10a',
            label: 'Delay recognition; keep consular channels only',
            detail: 'Buy time without blessing.',
            kind: 'diplomatic',
            markerId: 'capital',
            short: 'DELAYR',
            effects: [
              { tag: 'time', weight: 2, summary: 'Option value' },
              { tag: 'diplomacy', weight: 1, summary: 'Channel survives' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Bloc unclear' },
            ],
          },
          {
            id: 'hist-1917-10b',
            label: 'Recognize de facto control with human-rights riders',
            detail: 'Facts first, norms attached.',
            kind: 'legal',
            markerId: 'parliament',
            short: 'DEFACTO',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Reality-based' },
              { tag: 'norm_protection', weight: 1, summary: 'Riders stated' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Common line possible' },
            ],
          },
          {
            id: 'hist-1917-10c',
            label: 'Refuse recognition and pivot aid to non-Bolshevik regions',
            detail: 'Bet against the capital.',
            kind: 'political',
            markerId: 'districts',
            short: 'PIVOT',
            effects: [
              { tag: 'escalation', weight: 2, summary: 'Civil-war fuel' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Anti-radical bloc' },
              { tag: 'civilian_cost', weight: 2, summary: 'Fragmentation pain' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'hist-1920-anatolia',
    year: 1920,
    era: '1919–1939',
    title: 'Anatolian Mandate',
    region: 'Anatolia · Aegean · Allied occupation zones',
    meterFamily: 'conflict',
    theaterArchetype: 'redsea',
    premise:
      'Occupation zones, Greek advances, and a rising nationalist assembly collide. You advise an Allied high commission on whether to enforce partition maps or bargain with the new Ankara leadership.',
    role: 'Political officer, Allied High Commission',
    tension:
      'Treaty paper versus facts on the ground; minority protections versus endless war.',
    beats: [
      {
        id: 'hist-1920-1',
        title: 'Zone enforcement',
        briefing:
          'Nationalist irregulars disrupt a coastal zone. Admirals want a show of force; diplomats warn of a wider Anatolian war.',
        stakes:
          'Enforcement can make the treaty real—or obsolete.',
        choices: [
          {
            id: 'hist-1920-1a',
            label: 'Limited naval demonstration',
            detail: 'Shell empty water; signal presence.',
            kind: 'naval',
            markerId: 'escort',
            short: 'DEMO',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Shows capacity' },
              { tag: 'escalation', weight: 1, summary: 'Risk of misread' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Looks firm' },
            ],
          },
          {
            id: 'hist-1920-1b',
            label: 'Open talks with Ankara envoys',
            detail: 'Test whether maps can be revised quietly.',
            kind: 'diplomatic',
            markerId: 'port',
            short: 'TALKS',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Opens revision path' },
              { tag: 'credibility', weight: -1, summary: 'Treaty looks soft' },
              { tag: 'escalation', weight: -1, summary: 'Lowers clash odds' },
            ],
          },
          {
            id: 'hist-1920-1c',
            label: 'Back a local client advance',
            detail: 'Encourage a partner army to fill the vacuum.',
            kind: 'kinetic',
            markerId: 'proxy',
            short: 'PROXY',
            effects: [
              { tag: 'escalation', weight: 3, summary: 'War widens' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Partners diverge' },
              { tag: 'civilian_cost', weight: 2, summary: 'Displacement rises' },
            ],
          },
        ],
      },
      {
        id: 'hist-1920-2',
        title: 'Minority petitions',
        briefing:
          'Community leaders demand protected enclaves and Allied garrisons. Nationalists call them foreign footholds.',
        stakes:
          'Protection without partition language is hard to sell.',
        choices: [
          {
            id: 'hist-1920-2a',
            label: 'Guarantee minority courts and transit rights',
            detail: 'Rights without new borders.',
            kind: 'legal',
            markerId: 'canal',
            short: 'RIGHTS',
            effects: [
              { tag: 'norm_protection', weight: 2, summary: 'Legal shield' },
              { tag: 'diplomacy', weight: 1, summary: 'Bargainable' },
              { tag: 'polarization', weight: 1, summary: 'Both sides uneasy' },
            ],
          },
          {
            id: 'hist-1920-2b',
            label: 'Draw temporary protected districts',
            detail: 'Maps with sunset clauses.',
            kind: 'political',
            markerId: 'chokepoint',
            short: 'DISTRICT',
            effects: [
              { tag: 'civilian_cost', weight: -1, summary: 'Short-term shelter' },
              { tag: 'escalation', weight: 1, summary: 'Looks like partition' },
              { tag: 'credibility', weight: 1, summary: 'Visible action' },
            ],
          },
          {
            id: 'hist-1920-2c',
            label: 'Refer to a future League process',
            detail: 'Delay with institutional promise.',
            kind: 'diplomatic',
            markerId: 'insurer',
            short: 'LEAGUE',
            effects: [
              { tag: 'time', weight: 2, summary: 'Defers clash' },
              { tag: 'credibility', weight: -2, summary: 'Looks like evasion' },
              { tag: 'norm_erosion', weight: 1, summary: 'Rights deferred' },
            ],
          },
        ],
      },
      {
        id: 'hist-1920-3',
        title: 'Straits and trade',
        briefing:
          'Insurers freeze Black Sea traffic until the straits regime is clarified.',
        stakes:
          'Commerce will not wait for perfect sovereignty theory.',
        choices: [
          {
            id: 'hist-1920-3a',
            label: 'Propose internationalized straits rules',
            detail: 'Neutral traffic guarantees under commission.',
            kind: 'diplomatic',
            markerId: 'chokepoint',
            short: 'STRAITS',
            effects: [
              { tag: 'market_stability', weight: 2, summary: 'Traffic resumes' },
              { tag: 'credibility', weight: 1, summary: 'Clear regime' },
              { tag: 'domestic_support', weight: -1, summary: 'Nationalists object' },
            ],
          },
          {
            id: 'hist-1920-3b',
            label: 'Accept Ankara control with transit treaty',
            detail: 'Trade guarantees without foreign flags.',
            kind: 'diplomatic',
            markerId: 'port',
            short: 'TREATY',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Local ownership' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Allies split' },
              { tag: 'market_stability', weight: 1, summary: 'Partial calm' },
            ],
          },
          {
            id: 'hist-1920-3c',
            label: 'Keep occupation of key batteries',
            detail: 'Hold guns until a final peace.',
            kind: 'naval',
            markerId: 'escort',
            short: 'HOLDGUN',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Leverage retained' },
              { tag: 'escalation', weight: 2, summary: 'Target for attack' },
              { tag: 'market_stability', weight: -1, summary: 'Uncertainty persists' },
            ],
          },
        ],
      },
      {
        id: 'hist-1920-4',
        title: 'Settlement window',
        briefing:
          'A draft exchange-of-populations and border package appears. Humanitarians warn of trauma; soldiers say it ends the war.',
        stakes:
          'Ending fighting can create lasting grievance.',
        choices: [
          {
            id: 'hist-1920-4a',
            label: 'Support a supervised population exchange',
            detail: 'Orderly transfers with monitors.',
            kind: 'civic',
            markerId: 'port',
            short: 'EXCHANGE',
            effects: [
              { tag: 'escalation', weight: -2, summary: 'War winds down' },
              { tag: 'civilian_cost', weight: 2, summary: 'Mass upheaval' },
              { tag: 'diplomacy', weight: 1, summary: 'Deal exists' },
            ],
          },
          {
            id: 'hist-1920-4b',
            label: 'Reject exchange; insist on mixed citizenship guarantees',
            detail: 'Keep communities in place with rights.',
            kind: 'legal',
            markerId: 'canal',
            short: 'MIXED',
            effects: [
              { tag: 'norm_protection', weight: 2, summary: 'Pluralist frame' },
              { tag: 'escalation', weight: 1, summary: 'Fighting may continue' },
              { tag: 'governability', weight: -1, summary: 'Hard to enforce' },
            ],
          },
          {
            id: 'hist-1920-4c',
            label: 'Narrow military truce only; delay politics',
            detail: 'Stop guns; leave status unresolved.',
            kind: 'diplomatic',
            markerId: 'insurer',
            short: 'TRUCE',
            effects: [
              { tag: 'time', weight: 2, summary: 'Pause' },
              { tag: 'credibility', weight: -1, summary: 'No finality' },
              { tag: 'escalation', weight: -1, summary: 'Less killing now' },
            ],
          },
        ],
      },
      {
        id: 'hist-1920-5',
        title: 'Proxy clash at the zone edge',
        briefing:
          'Irregulars and occupation patrols exchange fire near a disputed district. Your escorts can reinforce, mediate, or pull back to ports.',
        stakes:
          'A local firefight can rewrite the mandate map.',
        choices: [
          {
            id: 'hist-1920-5a',
            label: 'Reinforce escort corridors only',
            detail: 'Protect lanes; avoid inland pursuit.',
            kind: 'naval',
            markerId: 'escort',
            short: 'CORRIDOR',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Lane security' },
              { tag: 'escalation', weight: 1, summary: 'More force present' },
              { tag: 'civilian_cost', weight: -1, summary: 'Trade safer' },
            ],
          },
          {
            id: 'hist-1920-5b',
            label: 'Convene an immediate local armistice board',
            detail: 'Stop fire before maps harden.',
            kind: 'diplomatic',
            markerId: 'port',
            short: 'ARMLOC',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Local table' },
              { tag: 'time', weight: 1, summary: 'Pause fighting' },
              { tag: 'credibility', weight: 1, summary: 'Honest broker' },
            ],
          },
          {
            id: 'hist-1920-5c',
            label: 'Authorize limited kinetic clearing of the edge',
            detail: 'Restore zone lines by force.',
            kind: 'kinetic',
            markerId: 'proxy',
            short: 'CLEAR',
            effects: [
              { tag: 'escalation', weight: 3, summary: 'War deepens' },
              { tag: 'deterrence', weight: 1, summary: 'Lines enforced' },
              { tag: 'civilian_cost', weight: 2, summary: 'Village harm' },
            ],
          },
        ],
      },
      {
        id: 'hist-1920-6',
        title: 'Home parliament revolt',
        briefing:
          'Deputies call occupation a “bleeding adventure.” Budget hawks want ships home; minority advocates demand you stay.',
        stakes:
          'Domestic consent is part of the theater.',
        choices: [
          {
            id: 'hist-1920-6a',
            label: 'Table a time-bound mandate renewal vote',
            detail: 'Ask for months, not forever.',
            kind: 'political',
            markerId: 'canal',
            short: 'RENEW',
            effects: [
              { tag: 'domestic_support', weight: 1, summary: 'Democratic cover' },
              { tag: 'time', weight: 2, summary: 'Defined horizon' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Partners see clock' },
            ],
          },
          {
            id: 'hist-1920-6b',
            label: 'Cut inland posts; keep only coastal enforcement',
            detail: 'Shrink footprint under fire.',
            kind: 'naval',
            markerId: 'port',
            short: 'SHRINK',
            effects: [
              { tag: 'escalation', weight: -1, summary: 'Less exposure' },
              { tag: 'civilian_cost', weight: 1, summary: 'Inland vacuum' },
              { tag: 'credibility', weight: -1, summary: 'Looks like retreat' },
            ],
          },
          {
            id: 'hist-1920-6c',
            label: 'Ignore the chamber; govern by cabinet decree',
            detail: 'Speed over consent.',
            kind: 'political',
            markerId: 'chokepoint',
            short: 'DECREE',
            effects: [
              { tag: 'governability', weight: 1, summary: 'Fast decisions' },
              { tag: 'norm_erosion', weight: 2, summary: 'Parliamentary bypass' },
              { tag: 'polarization', weight: 1, summary: 'Street anger' },
            ],
          },
        ],
      },
      {
        id: 'hist-1920-7',
        title: 'Allied split on the straits',
        briefing:
          'One ally wants internationalized straits with hard naval teeth; another wants commercial openness without occupation optics.',
        stakes:
          'Alliance unity can break on a waterway.',
        choices: [
          {
            id: 'hist-1920-7a',
            label: 'Broker a commercial-first straits statute',
            detail: 'Transit rules over flags.',
            kind: 'diplomatic',
            markerId: 'canal',
            short: 'STATUTE',
            effects: [
              { tag: 'market_stability', weight: 2, summary: 'Trade priority' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Compromise text' },
              { tag: 'deterrence', weight: -1, summary: 'Softer teeth' },
            ],
          },
          {
            id: 'hist-1920-7b',
            label: 'Back a standing international naval commission',
            detail: 'Hard multilateral control.',
            kind: 'naval',
            markerId: 'chokepoint',
            short: 'COMM',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Enforcement body' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Shared burden' },
              { tag: 'escalation', weight: 1, summary: 'Permanent friction' },
            ],
          },
          {
            id: 'hist-1920-7c',
            label: 'Side with your senior ally’s maximal brief',
            detail: 'Unity over refinement.',
            kind: 'political',
            markerId: 'insurer',
            short: 'SIDE',
            effects: [
              { tag: 'alliance_cohesion', weight: 2, summary: 'Senior partner happy' },
              { tag: 'diplomacy', weight: -1, summary: 'Others iced out' },
              { tag: 'credibility', weight: -1, summary: 'Looks vassal' },
            ],
          },
        ],
      },
      {
        id: 'hist-1920-8',
        title: 'Atrocity claim fog',
        briefing:
          'Competing wires allege massacres in different districts. Insurers halt coverage until a narrative settles.',
        stakes:
          'Markets and morals both demand a map of truth.',
        choices: [
          {
            id: 'hist-1920-8a',
            label: 'Deploy a mixed fact-finding mission',
            detail: 'Slow, credible, incomplete.',
            kind: 'diplomatic',
            markerId: 'port',
            short: 'FACT',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Process integrity' },
              { tag: 'time', weight: 1, summary: 'Investigation lag' },
              { tag: 'market_stability', weight: 1, summary: 'Insurers watch' },
            ],
          },
          {
            id: 'hist-1920-8b',
            label: 'Issue provisional sanctions on the accused party',
            detail: 'Act on first reports.',
            kind: 'economic',
            markerId: 'insurer',
            short: 'SANC',
            effects: [
              { tag: 'economic_pressure', weight: 2, summary: 'Punishment signal' },
              { tag: 'credibility', weight: -1, summary: 'May be wrong' },
              { tag: 'escalation', weight: 1, summary: 'Hardens camps' },
            ],
          },
          {
            id: 'hist-1920-8c',
            label: 'Quietly restore insurer backstops without judgment',
            detail: 'Trade first; truth later.',
            kind: 'economic',
            markerId: 'canal',
            short: 'BACKSTOP',
            effects: [
              { tag: 'market_stability', weight: 2, summary: 'Coverage returns' },
              { tag: 'norm_erosion', weight: 1, summary: 'Justice deferred' },
              { tag: 'civilian_cost', weight: 1, summary: 'Victims wait' },
            ],
          },
        ],
      },
      {
        id: 'hist-1920-9',
        title: 'Settlement conference window',
        briefing:
          'Nationalists and occupation powers hint at a treaty revision if minority clauses and demobilization are sequenced carefully.',
        stakes:
          'Sequencing is the bargain.',
        choices: [
          {
            id: 'hist-1920-9a',
            label: 'Sequence demobilization before final borders',
            detail: 'Guns down, then maps.',
            kind: 'diplomatic',
            markerId: 'chokepoint',
            short: 'SEQ',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Workable order' },
              { tag: 'escalation', weight: -1, summary: 'Force thins' },
              { tag: 'time', weight: 1, summary: 'Staged clock' },
            ],
          },
          {
            id: 'hist-1920-9b',
            label: 'Insist on minority courts before any troop cut',
            detail: 'Rights first.',
            kind: 'legal',
            markerId: 'proxy',
            short: 'COURTS',
            effects: [
              { tag: 'norm_protection', weight: 2, summary: 'Protections first' },
              { tag: 'diplomacy', weight: -1, summary: 'Harder deal' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Moral coalition' },
            ],
          },
          {
            id: 'hist-1920-9c',
            label: 'Offer trade preferences as the sweetener',
            detail: 'Commerce as glue.',
            kind: 'economic',
            markerId: 'insurer',
            short: 'PREF',
            effects: [
              { tag: 'market_stability', weight: 2, summary: 'Economic buy-in' },
              { tag: 'diplomacy', weight: 1, summary: 'Positive sum' },
              { tag: 'credibility', weight: -1, summary: 'Looks transactional' },
            ],
          },
        ],
      },
      {
        id: 'hist-1920-10',
        title: 'Mandate endgame',
        briefing:
          'Either you ratify a revised settlement and thin forces, or dig into indefinite occupation with rising costs.',
        stakes:
          'Paper peace or permanent garrison.',
        choices: [
          {
            id: 'hist-1920-10a',
            label: 'Ratify revision and announce phased withdrawal',
            detail: 'Own the transition.',
            kind: 'diplomatic',
            markerId: 'canal',
            short: 'PHASE',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Settlement locked' },
              { tag: 'escalation', weight: -2, summary: 'Occupation shrinks' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Shared exit' },
            ],
          },
          {
            id: 'hist-1920-10b',
            label: 'Hold coastal enclaves indefinitely',
            detail: 'Keep cards and costs.',
            kind: 'naval',
            markerId: 'port',
            short: 'ENCLAVE',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Permanent leverage' },
              { tag: 'escalation', weight: 1, summary: 'Chronic tension' },
              { tag: 'civilian_cost', weight: 1, summary: 'Local resentment' },
            ],
          },
          {
            id: 'hist-1920-10c',
            label: 'Transfer responsibility to a League-like commission',
            detail: 'Internationalize the problem.',
            kind: 'legal',
            markerId: 'escort',
            short: 'XFER',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Institutional path' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Burden shared' },
              { tag: 'time', weight: -1, summary: 'Slow machinery' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'hist-1919-versailles',
    year: 1919,
    era: '1919–1939',
    title: 'Versailles Table',
    region: 'Paris · Allied capitals · defeated Central Powers',
    meterFamily: 'politics',
    theaterArchetype: 'europe',
    premise:
      'Victors draft a peace that must demobilize armies, redraw borders, and sell the settlement at home. You staff a delegation balancing punishment, stability, and League hopes.',
    role: 'Delegation counselor at the peace conference',
    tension:
      'Justice narratives versus a Europe that can still function.',
    beats: [
      {
        id: 'hist-1919-1',
        title: 'War guilt clause',
        briefing:
          'Publics want blame named. Economists warn a moralized indemnity will poison recovery.',
        stakes:
          'Symbolic language can outlive the money.',
        choices: [
          {
            id: 'hist-1919-1a',
            label: 'Keep a guilt clause; soften payment schedule',
            detail: 'Symbol hard, cash flexible.',
            kind: 'political',
            markerId: 'parliament',
            short: 'GUILT',
            effects: [
              { tag: 'domestic_support', weight: 2, summary: 'Home press satisfied' },
              { tag: 'diplomacy', weight: -1, summary: 'Humiliation lingers' },
              { tag: 'market_stability', weight: 1, summary: 'Payable path' },
            ],
          },
          {
            id: 'hist-1919-1b',
            label: 'Drop guilt language; focus on repair costs',
            detail: 'Technical liability only.',
            kind: 'diplomatic',
            markerId: 'brussels',
            short: 'REPAIR',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Less poison' },
              { tag: 'domestic_support', weight: -2, summary: 'Voters feel cheated' },
              { tag: 'norm_protection', weight: 1, summary: 'Legalist frame' },
            ],
          },
          {
            id: 'hist-1919-1c',
            label: 'Maximal indemnity with occupation threat',
            detail: 'Pay or stay occupied.',
            kind: 'economic',
            markerId: 'capital',
            short: 'MAXIND',
            effects: [
              { tag: 'economic_pressure', weight: 3, summary: 'Heavy burden' },
              { tag: 'escalation', weight: 1, summary: 'Revisionism fuel' },
              { tag: 'credibility', weight: 1, summary: 'Hard victory' },
            ],
          },
        ],
      },
      {
        id: 'hist-1919-2',
        title: 'Border commissions',
        briefing:
          'Ethnic maps conflict with rail and coal geography. Minorities beg for plebiscites; generals want clean strategic lines.',
        stakes:
          'Every line creates a new revisionist.',
        choices: [
          {
            id: 'hist-1919-2a',
            label: 'Mandate plebiscites in contested belts',
            detail: 'Let local votes settle edges.',
            kind: 'civic',
            markerId: 'ballot',
            short: 'PLEB',
            effects: [
              { tag: 'democratic_mandate', weight: 2, summary: 'Consent frame' },
              { tag: 'time', weight: 1, summary: 'Delays finality' },
              { tag: 'polarization', weight: 1, summary: 'Campaigns harden' },
            ],
          },
          {
            id: 'hist-1919-2b',
            label: 'Draw strategic corridors for coal and rail',
            detail: 'Prioritize economic viability.',
            kind: 'economic',
            markerId: 'districts',
            short: 'CORRIDOR',
            effects: [
              { tag: 'market_stability', weight: 2, summary: 'Functional map' },
              { tag: 'norm_erosion', weight: 1, summary: 'Self-determination diluted' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Allies get resources' },
            ],
          },
          {
            id: 'hist-1919-2c',
            label: 'Create League mandates for flashpoint zones',
            detail: 'Internationalize the hardest scraps.',
            kind: 'diplomatic',
            markerId: 'brussels',
            short: 'MANDATE',
            effects: [
              { tag: 'norm_protection', weight: 1, summary: 'Institutional cover' },
              { tag: 'credibility', weight: -1, summary: 'Looks like empire 2.0' },
              { tag: 'escalation', weight: -1, summary: 'Buffers clash' },
            ],
          },
        ],
      },
      {
        id: 'hist-1919-3',
        title: 'League covenant fight',
        briefing:
          'Some partners want a strong League; others refuse any constraint on sovereignty.',
        stakes:
          'Without buy-in, the covenant is theater.',
        choices: [
          {
            id: 'hist-1919-3a',
            label: 'Push a strong collective-security article',
            detail: 'Automatic consultation on aggression.',
            kind: 'diplomatic',
            markerId: 'brussels',
            short: 'COLSEC',
            effects: [
              { tag: 'alliance_cohesion', weight: 2, summary: 'Shared deterrent idea' },
              { tag: 'credibility', weight: 1, summary: 'Ambitious order' },
              { tag: 'domestic_support', weight: -1, summary: 'Sovereignty hawks resist' },
            ],
          },
          {
            id: 'hist-1919-3b',
            label: 'Water down to a discussion forum',
            detail: 'Preserve signatures over teeth.',
            kind: 'political',
            markerId: 'parliament',
            short: 'FORUM',
            effects: [
              { tag: 'diplomacy', weight: 1, summary: 'More signatories' },
              { tag: 'deterrence', weight: -2, summary: 'Weak teeth' },
              { tag: 'governability', weight: 1, summary: 'Easier ratification' },
            ],
          },
          {
            id: 'hist-1919-3c',
            label: 'Bilateral guarantees instead of League primacy',
            detail: 'Old alliance logic in new clothes.',
            kind: 'diplomatic',
            markerId: 'capital',
            short: 'BILAT',
            effects: [
              { tag: 'deterrence', weight: 1, summary: 'Clear pledges' },
              { tag: 'norm_erosion', weight: 1, summary: 'Undercuts League' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Core partners tight' },
            ],
          },
        ],
      },
      {
        id: 'hist-1919-4',
        title: 'Signature day',
        briefing:
          'The defeated ask for revisions before signing. Refusing may create a martyr treaty; yielding may unravel the whole package.',
        stakes:
          'A signed bitter peace versus an unsigned vacuum.',
        choices: [
          {
            id: 'hist-1919-4a',
            label: 'Require signature as drafted',
            detail: 'Revisions only via future League petitions.',
            kind: 'political',
            markerId: 'capital',
            short: 'SIGN',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Finality' },
              { tag: 'diplomacy', weight: -2, summary: 'Resentment locked' },
              { tag: 'escalation', weight: 1, summary: 'Revisionist fuel' },
            ],
          },
          {
            id: 'hist-1919-4b',
            label: 'Allow narrow technical amendments',
            detail: 'Face-saving tweaks without reopening borders.',
            kind: 'diplomatic',
            markerId: 'parliament',
            short: 'TWEAK',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Slight off-ramp' },
              { tag: 'credibility', weight: -1, summary: 'Looks soft' },
              { tag: 'time', weight: 1, summary: 'Another round' },
            ],
          },
          {
            id: 'hist-1919-4c',
            label: 'Threaten renewed blockade if unsigned',
            detail: 'Pressure without new armies.',
            kind: 'economic',
            markerId: 'streets',
            short: 'BLOCK',
            effects: [
              { tag: 'economic_pressure', weight: 2, summary: 'Coercive continuity' },
              { tag: 'civilian_cost', weight: 2, summary: 'Hunger politics' },
              { tag: 'norm_erosion', weight: 1, summary: 'Peace by siege' },
            ],
          },
        ],
      },
      {
        id: 'hist-1919-5',
        title: 'Reparations arithmetic shock',
        briefing:
          'Experts produce incompatible totals. One path bankrupts the defeated; another looks like betrayal at home.',
        stakes:
          'Numbers are politics with decimal points.',
        choices: [
          {
            id: 'hist-1919-5a',
            label: 'Back a capacity-to-pay schedule with review clauses',
            detail: 'Solvency over vengeance.',
            kind: 'economic',
            markerId: 'brussels',
            short: 'CAPPAY',
            effects: [
              { tag: 'market_stability', weight: 2, summary: 'Payable path' },
              { tag: 'diplomacy', weight: 1, summary: 'Workable peace' },
              { tag: 'domestic_support', weight: -2, summary: 'Hawks furious' },
            ],
          },
          {
            id: 'hist-1919-5b',
            label: 'Insist on headline maximum with later “adjustments”',
            detail: 'Optics now, realism later.',
            kind: 'political',
            markerId: 'parliament',
            short: 'HEADLINE',
            effects: [
              { tag: 'domestic_support', weight: 2, summary: 'Victory framed' },
              { tag: 'credibility', weight: -1, summary: 'Known fiction' },
              { tag: 'market_stability', weight: -1, summary: 'Debt overhang' },
            ],
          },
          {
            id: 'hist-1919-5c',
            label: 'Park the number in a technical commission for six months',
            detail: 'Buy time.',
            kind: 'diplomatic',
            markerId: 'capital',
            short: 'PARK',
            effects: [
              { tag: 'time', weight: 2, summary: 'Delay fight' },
              { tag: 'diplomacy', weight: 1, summary: 'Keeps talks' },
              { tag: 'credibility', weight: -1, summary: 'Looks evasive' },
            ],
          },
        ],
      },
      {
        id: 'hist-1919-6',
        title: 'Street justice politics',
        briefing:
          'Crowds demand hangings and hard borders. Your delegation’s soft clauses are burned in effigy.',
        stakes:
          'Peace can die of applause.',
        choices: [
          {
            id: 'hist-1919-6a',
            label: 'Defend legal process over spectacle punishment',
            detail: 'Courts, not carnival.',
            kind: 'legal',
            markerId: 'streets',
            short: 'PROCESS',
            effects: [
              { tag: 'norm_protection', weight: 2, summary: 'Legal peace' },
              { tag: 'domestic_support', weight: -2, summary: 'Street rage' },
              { tag: 'credibility', weight: 1, summary: 'Rule of law' },
            ],
          },
          {
            id: 'hist-1919-6b',
            label: 'Add symbolic war-crime trials to buy clause space',
            detail: 'Trade symbolism for structure.',
            kind: 'political',
            markerId: 'parliament',
            short: 'TRIALS',
            effects: [
              { tag: 'domestic_support', weight: 1, summary: 'Some catharsis' },
              { tag: 'diplomacy', weight: -1, summary: 'Hardens losers' },
              { tag: 'polarization', weight: 1, summary: 'Revenge politics' },
            ],
          },
          {
            id: 'hist-1919-6c',
            label: 'Refuse to campaign on the treaty until signature',
            detail: 'Silence as strategy.',
            kind: 'civic',
            markerId: 'districts',
            short: 'QUIET',
            effects: [
              { tag: 'time', weight: 1, summary: 'Less theater' },
              { tag: 'domestic_support', weight: -1, summary: 'Vacuum' },
              { tag: 'governability', weight: 1, summary: 'Cabinet focus' },
            ],
          },
        ],
      },
      {
        id: 'hist-1919-7',
        title: 'Ally’s security ask',
        briefing:
          'A senior ally wants permanent occupation zones and automatic sanctions triggers. Another wants a leaner League.',
        stakes:
          'Security architecture is the real treaty.',
        choices: [
          {
            id: 'hist-1919-7a',
            label: 'Broker automatic economic sanctions, not occupation',
            detail: 'Teeth without garrisons.',
            kind: 'economic',
            markerId: 'brussels',
            short: 'AUTO',
            effects: [
              { tag: 'deterrence', weight: 1, summary: 'Costly violation' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Compromise' },
              { tag: 'market_stability', weight: -1, summary: 'Sanction risk premium' },
            ],
          },
          {
            id: 'hist-1919-7b',
            label: 'Accept limited occupation with a sunset clause',
            detail: 'Time-bound enforcement.',
            kind: 'political',
            markerId: 'capital',
            short: 'SUNSET',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'On-ground leverage' },
              { tag: 'escalation', weight: 1, summary: 'Friction baked in' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Ally satisfied' },
            ],
          },
          {
            id: 'hist-1919-7c',
            label: 'Push a thin covenant and bilateral side letters',
            detail: 'Paper unity, private deals.',
            kind: 'diplomatic',
            markerId: 'parliament',
            short: 'SIDE',
            effects: [
              { tag: 'diplomacy', weight: 1, summary: 'Flexibility' },
              { tag: 'credibility', weight: -1, summary: 'Opaque peace' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Uneven terms' },
            ],
          },
        ],
      },
      {
        id: 'hist-1919-8',
        title: 'Map commission leaks',
        briefing:
          'Border sketches leak showing minorities stranded. Your press and theirs demand incompatible fixes.',
        stakes:
          'Every line creates a future grievance.',
        choices: [
          {
            id: 'hist-1919-8a',
            label: 'Mandate minority treaties with monitoring',
            detail: 'Rights as border softener.',
            kind: 'legal',
            markerId: 'brussels',
            short: 'MINOR',
            effects: [
              { tag: 'norm_protection', weight: 2, summary: 'Protections written' },
              { tag: 'diplomacy', weight: 1, summary: 'Softer maps' },
              { tag: 'time', weight: -1, summary: 'Complex drafting' },
            ],
          },
          {
            id: 'hist-1919-8b',
            label: 'Redraw for strategic railways even if populations suffer',
            detail: 'Security topography first.',
            kind: 'political',
            markerId: 'districts',
            short: 'RAIL',
            effects: [
              { tag: 'deterrence', weight: 1, summary: 'Strategic depth' },
              { tag: 'civilian_cost', weight: 2, summary: 'Displaced communities' },
              { tag: 'polarization', weight: 1, summary: 'Ethnic anger' },
            ],
          },
          {
            id: 'hist-1919-8c',
            label: 'Call a short expert re-hearing before ink',
            detail: 'Slow the map.',
            kind: 'diplomatic',
            markerId: 'capital',
            short: 'REHEAR',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Due process' },
              { tag: 'time', weight: 1, summary: 'Revision window' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Partners impatient' },
            ],
          },
        ],
      },
      {
        id: 'hist-1919-9',
        title: 'Signature off-ramp',
        briefing:
          'The defeated hint they will sign under protest if reparations review and League entry paths are real. Hardliners want humiliation complete.',
        stakes:
          'A signed bad peace versus an unsigned worse one.',
        choices: [
          {
            id: 'hist-1919-9a',
            label: 'Offer review clauses and eventual League path',
            detail: 'Dignity enough to sign.',
            kind: 'diplomatic',
            markerId: 'brussels',
            short: 'PATH',
            effects: [
              { tag: 'diplomacy', weight: 3, summary: 'Signature likelier' },
              { tag: 'domestic_support', weight: -1, summary: 'Softness charge' },
              { tag: 'market_stability', weight: 1, summary: 'Certainty' },
            ],
          },
          {
            id: 'hist-1919-9b',
            label: 'Refuse revisions; demand unconditional signature',
            detail: 'Dictate the peace.',
            kind: 'political',
            markerId: 'parliament',
            short: 'DICTATE',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Hard line clear' },
              { tag: 'diplomacy', weight: -2, summary: 'May refuse' },
              { tag: 'escalation', weight: 1, summary: 'Future revision wars' },
            ],
          },
          {
            id: 'hist-1919-9c',
            label: 'Split: sign political clauses now, economics later',
            detail: 'Two-stage treaty.',
            kind: 'economic',
            markerId: 'capital',
            short: 'SPLIT',
            effects: [
              { tag: 'time', weight: 2, summary: 'Staged deal' },
              { tag: 'market_stability', weight: -1, summary: 'Uncertainty' },
              { tag: 'diplomacy', weight: 1, summary: 'Partial lock' },
            ],
          },
        ],
      },
      {
        id: 'hist-1919-10',
        title: 'Ratification endgame',
        briefing:
          'Home legislatures threaten to gut the League articles. You must choose what to salvage.',
        stakes:
          'The peace dies twice—at signature and at ratification.',
        choices: [
          {
            id: 'hist-1919-10a',
            label: 'Defend the covenant as a package',
            detail: 'All or renegotiate.',
            kind: 'political',
            markerId: 'parliament',
            short: 'PACKAGE',
            effects: [
              { tag: 'norm_protection', weight: 2, summary: 'Institution intact' },
              { tag: 'governability', weight: -1, summary: 'Legislative fight' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Internationalists cheer' },
            ],
          },
          {
            id: 'hist-1919-10b',
            label: 'Accept reservations to secure a majority',
            detail: 'Imperfect membership.',
            kind: 'legal',
            markerId: 'ballot',
            short: 'RESERVE',
            effects: [
              { tag: 'governability', weight: 2, summary: 'Votes secured' },
              { tag: 'credibility', weight: -1, summary: 'Hollowed pledge' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Partners wary' },
            ],
          },
          {
            id: 'hist-1919-10c',
            label: 'Let the League fail at home; keep bilateral enforcement',
            detail: 'Old diplomacy returns.',
            kind: 'diplomatic',
            markerId: 'capital',
            short: 'BILAT',
            effects: [
              { tag: 'diplomacy', weight: -1, summary: 'Weaker order' },
              { tag: 'deterrence', weight: 1, summary: 'Bilateral teeth' },
              { tag: 'eu_cohesion', weight: -1, summary: 'Multilateral loss' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'hist-1929-black-thursday',
    year: 1929,
    era: '1919–1939',
    title: 'Black Thursday Desk',
    region: 'New York · London · global credit',
    meterFamily: 'economy',
    theaterArchetype: 'markets',
    premise:
      'Equity panic spreads into bank runs and trade collapse. You advise a finance ministry on whether to stabilize banks, protect gold parity, or cushion labor—knowing each choice starves the others.',
    role: 'Treasury crisis counselor',
    tension:
      'Liquidity versus confidence versus the gold orthodoxy that still defines credibility.',
    beats: [
      {
        id: 'hist-1929-1',
        title: 'Exchange floor panic',
        briefing:
          'Brokers beg for a trading halt. Central bankers fear a halt signals insolvency.',
        stakes:
          'Stopping the tape can calm—or advertise fear.',
        choices: [
          {
            id: 'hist-1929-1a',
            label: 'Authorize a short trading halt',
            detail: 'Clear orders; reopen with rules.',
            kind: 'legal',
            markerId: 'exchange',
            short: 'HALT',
            effects: [
              { tag: 'market_stability', weight: 1, summary: 'Pause for clearing' },
              { tag: 'credibility', weight: -1, summary: 'Looks like panic' },
              { tag: 'time', weight: 1, summary: 'Hours to plan' },
            ],
          },
          {
            id: 'hist-1929-1b',
            label: 'Keep markets open; inject liquidity',
            detail: 'Discount window wide.',
            kind: 'economic',
            markerId: 'fed',
            short: 'LIQUID',
            effects: [
              { tag: 'market_stability', weight: 2, summary: 'Supports prices' },
              { tag: 'credibility', weight: 1, summary: 'Orthodox courage' },
              { tag: 'economic_pressure', weight: -1, summary: 'Spends reserves' },
            ],
          },
          {
            id: 'hist-1929-1c',
            label: 'Let prices find bottom without support',
            detail: 'Purge speculation.',
            kind: 'economic',
            markerId: 'desk',
            short: 'PURGE',
            effects: [
              { tag: 'market_stability', weight: -3, summary: 'Freefall' },
              { tag: 'credibility', weight: 1, summary: 'Hard money story' },
              { tag: 'civilian_cost', weight: 2, summary: 'Wealth shock' },
            ],
          },
        ],
      },
      {
        id: 'hist-1929-2',
        title: 'Bank run map',
        briefing:
          'Regional banks fail overnight. Depositors queue. Correspondents ask if you will backstop or ring-fence.',
        stakes:
          'Saving all banks may save none; saving none may save the system’s story.',
        choices: [
          {
            id: 'hist-1929-2a',
            label: 'Selective recapitalization of solvent banks',
            detail: 'Triage by books, not politics.',
            kind: 'economic',
            markerId: 'treasury',
            short: 'TRIAGE',
            effects: [
              { tag: 'market_stability', weight: 2, summary: 'Stops cascade' },
              { tag: 'credibility', weight: 1, summary: 'Technocratic' },
              { tag: 'polarization', weight: 1, summary: 'Losers cry favoritism' },
            ],
          },
          {
            id: 'hist-1929-2b',
            label: 'Blanket holiday and deposit guarantee sketch',
            detail: 'Freeze withdrawals; promise a backstop.',
            kind: 'political',
            markerId: 'exchange',
            short: 'HOLIDAY',
            effects: [
              { tag: 'social_calm', weight: 2, summary: 'Queues ease' },
              { tag: 'market_stability', weight: 1, summary: 'Breathing room' },
              { tag: 'credibility', weight: -1, summary: 'Radical for the era' },
            ],
          },
          {
            id: 'hist-1929-2c',
            label: 'Let weak banks fail; protect clearing houses only',
            detail: 'Core payments first.',
            kind: 'economic',
            markerId: 'fed',
            short: 'CORE',
            effects: [
              { tag: 'market_stability', weight: -1, summary: 'Regional pain' },
              { tag: 'credibility', weight: 1, summary: 'Clearing preserved' },
              { tag: 'civilian_cost', weight: 2, summary: 'Local ruin' },
            ],
          },
        ],
      },
      {
        id: 'hist-1929-3',
        title: 'Gold and tariffs',
        briefing:
          'Partners flirt with tariffs and gold drains. Orthodoxy says defend parity; industry says abandon it.',
        stakes:
          'The international monetary order is the crisis.',
        choices: [
          {
            id: 'hist-1929-3a',
            label: 'Defend gold with rate hikes',
            detail: 'Attract capital; crush domestic demand.',
            kind: 'economic',
            markerId: 'fed',
            short: 'GOLD',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Parity held' },
              { tag: 'market_stability', weight: -2, summary: 'Credit tighter' },
              { tag: 'civilian_cost', weight: 2, summary: 'Unemployment rises' },
            ],
          },
          {
            id: 'hist-1929-3b',
            label: 'Coordinate a temporary gold suspension',
            detail: 'Seek partner mirroring.',
            kind: 'diplomatic',
            markerId: 'em',
            short: 'SUSPEND',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Shared float idea' },
              { tag: 'market_stability', weight: 1, summary: 'Policy space' },
              { tag: 'credibility', weight: -1, summary: 'Orthodoxy broken' },
            ],
          },
          {
            id: 'hist-1929-3c',
            label: 'Raise tariffs to “protect employment”',
            detail: 'Beggar-thy-neighbor politics.',
            kind: 'political',
            markerId: 'treasury',
            short: 'TARIFF',
            effects: [
              { tag: 'domestic_support', weight: 2, summary: 'Industry cheers' },
              { tag: 'market_stability', weight: -2, summary: 'Trade shrinks' },
              { tag: 'alliance_cohesion', weight: -2, summary: 'Retaliation' },
            ],
          },
        ],
      },
      {
        id: 'hist-1929-4',
        title: 'Relief versus austerity',
        briefing:
          'Mayors report soup lines. Bond markets punish any deficit talk.',
        stakes:
          'Humanitarian relief and creditor confidence point opposite ways.',
        choices: [
          {
            id: 'hist-1929-4a',
            label: 'Fund emergency public works',
            detail: 'Wages for roads and rails.',
            kind: 'civic',
            markerId: 'energy',
            short: 'WORKS',
            effects: [
              { tag: 'social_calm', weight: 2, summary: 'Visible relief' },
              { tag: 'domestic_support', weight: 2, summary: 'Government acts' },
              { tag: 'market_stability', weight: -1, summary: 'Deficit fears' },
            ],
          },
          {
            id: 'hist-1929-4b',
            label: 'Balanced-budget signal with targeted relief only',
            detail: 'Tiny safety net; loud fiscal virtue.',
            kind: 'economic',
            markerId: 'treasury',
            short: 'BALANCE',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Bond calm' },
              { tag: 'civilian_cost', weight: 1, summary: 'Thin cushion' },
              { tag: 'polarization', weight: 1, summary: 'Left outraged' },
            ],
          },
          {
            id: 'hist-1929-4c',
            label: 'Push private charity coordination',
            detail: 'State as convener, not payer.',
            kind: 'civic',
            markerId: 'desk',
            short: 'CHARITY',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Limited state' },
              { tag: 'civilian_cost', weight: 2, summary: 'Gaps remain' },
              { tag: 'social_calm', weight: -1, summary: 'Uneven coverage' },
            ],
          },
        ],
      },
      {
        id: 'hist-1929-5',
        title: 'Correspondent bank freeze',
        briefing:
          'Interior banks lose New York lines. A regional collapse could cascade into payroll failures by Friday.',
        stakes:
          'Plumbing failure becomes social crisis.',
        choices: [
          {
            id: 'hist-1929-5a',
            label: 'Authorize targeted liquidity via clearing houses',
            detail: 'Backstop the pipes.',
            kind: 'economic',
            markerId: 'fed',
            short: 'LIQ',
            effects: [
              { tag: 'market_stability', weight: 3, summary: 'Pipes reopen' },
              { tag: 'credibility', weight: 1, summary: 'Adult supervision' },
              { tag: 'economic_pressure', weight: -1, summary: 'Moral hazard murmur' },
            ],
          },
          {
            id: 'hist-1929-5b',
            label: 'Force mergers of weak banks overnight',
            detail: 'Concentrate to survive.',
            kind: 'economic',
            markerId: 'desk',
            short: 'MERGE',
            effects: [
              { tag: 'market_stability', weight: 1, summary: 'Fewer failures' },
              { tag: 'polarization', weight: 1, summary: 'Anti-trust anger' },
              { tag: 'credibility', weight: -1, summary: 'Crony optics' },
            ],
          },
          {
            id: 'hist-1929-5c',
            label: 'Let market discipline cull insolvent names',
            detail: 'Purge the rot.',
            kind: 'economic',
            markerId: 'exchange',
            short: 'CULL',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Hard money orthodoxy' },
              { tag: 'market_stability', weight: -3, summary: 'Cascade risk' },
              { tag: 'civilian_cost', weight: 2, summary: 'Deposit panic' },
            ],
          },
        ],
      },
      {
        id: 'hist-1929-6',
        title: 'Street bread politics',
        briefing:
          'Unemployed marches hit downtown. Governors ask whether relief is federal, local, or “private charity.”',
        stakes:
          'Legitimacy follows the soup line.',
        choices: [
          {
            id: 'hist-1929-6a',
            label: 'Stand up emergency federal work relief pilots',
            detail: 'Buy social calm with payrolls.',
            kind: 'political',
            markerId: 'treasury',
            short: 'WORK',
            effects: [
              { tag: 'social_calm', weight: 2, summary: 'Visible relief' },
              { tag: 'market_stability', weight: 1, summary: 'Demand floor' },
              { tag: 'credibility', weight: -1, summary: 'Orthodoxy shocked' },
            ],
          },
          {
            id: 'hist-1929-6b',
            label: 'Push charity coordination and local bonds only',
            detail: 'Keep federal hands clean.',
            kind: 'civic',
            markerId: 'em',
            short: 'CHARITY',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Orthodox virtue' },
              { tag: 'civilian_cost', weight: 2, summary: 'Gaps widen' },
              { tag: 'polarization', weight: 1, summary: 'Class anger' },
            ],
          },
          {
            id: 'hist-1929-6c',
            label: 'Criminalize disruptive assembly near exchanges',
            detail: 'Order first.',
            kind: 'legal',
            markerId: 'exchange',
            short: 'ORDER',
            effects: [
              { tag: 'social_calm', weight: 1, summary: 'Short-term quiet' },
              { tag: 'norm_erosion', weight: 2, summary: 'Protest chill' },
              { tag: 'polarization', weight: 2, summary: 'Martyrs made' },
            ],
          },
        ],
      },
      {
        id: 'hist-1929-7',
        title: 'London coordination ask',
        briefing:
          'Sterling desks want a joint rate defense. Going alone may save gold parity—or burn reserves uselessly.',
        stakes:
          'Cross-Atlantic coordination is scarce and precious.',
        choices: [
          {
            id: 'hist-1929-7a',
            label: 'Join a coordinated rate-defense pool',
            detail: 'Share gold and messaging.',
            kind: 'diplomatic',
            markerId: 'fed',
            short: 'POOL',
            effects: [
              { tag: 'alliance_cohesion', weight: 2, summary: 'Transatlantic glue' },
              { tag: 'market_stability', weight: 2, summary: 'Parity defense' },
              { tag: 'time', weight: 1, summary: 'Buys weeks' },
            ],
          },
          {
            id: 'hist-1929-7b',
            label: 'Defend your parity alone; refuse gold swaps',
            detail: 'Sovereignty of the reserve.',
            kind: 'economic',
            markerId: 'treasury',
            short: 'ALONE',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Independent stance' },
              { tag: 'market_stability', weight: -1, summary: 'Heavier burden' },
              { tag: 'alliance_cohesion', weight: -2, summary: 'London cold' },
            ],
          },
          {
            id: 'hist-1929-7c',
            label: 'Signal willingness to reconsider gold orthodoxy',
            detail: 'Prepare mental off-ramp.',
            kind: 'political',
            markerId: 'desk',
            short: 'REGOLD',
            effects: [
              { tag: 'diplomacy', weight: 1, summary: 'New conversation' },
              { tag: 'market_stability', weight: -2, summary: 'Parity scare' },
              { tag: 'time', weight: 2, summary: 'Option opened' },
            ],
          },
        ],
      },
      {
        id: 'hist-1929-8',
        title: 'Rumor of treasury insolvency',
        briefing:
          'A forged memo claims the treasury cannot meet coupon payments. Desks price a sovereign scare in minutes.',
        stakes:
          'False insolvency can become real if unanswered.',
        choices: [
          {
            id: 'hist-1929-8a',
            label: 'Publish audited cash and coupon schedules immediately',
            detail: 'Kill the forge with math.',
            kind: 'economic',
            markerId: 'treasury',
            short: 'AUDIT',
            effects: [
              { tag: 'credibility', weight: 3, summary: 'Numbers public' },
              { tag: 'market_stability', weight: 2, summary: 'Scare fades' },
              { tag: 'time', weight: -1, summary: 'Ops scramble' },
            ],
          },
          {
            id: 'hist-1929-8b',
            label: 'Quietly buy the dip via intermediaries',
            detail: 'Stabilize without admitting fear.',
            kind: 'economic',
            markerId: 'desk',
            short: 'DIP',
            effects: [
              { tag: 'market_stability', weight: 1, summary: 'Tape supported' },
              { tag: 'credibility', weight: -1, summary: 'Opacity' },
              { tag: 'norm_erosion', weight: 1, summary: 'Hidden intervention' },
            ],
          },
          {
            id: 'hist-1929-8c',
            label: 'Launch a leak investigation and punish desks',
            detail: 'Politics of blame.',
            kind: 'legal',
            markerId: 'exchange',
            short: 'PROBE',
            effects: [
              { tag: 'polarization', weight: 1, summary: 'Witch-hunt risk' },
              { tag: 'credibility', weight: 1, summary: 'Accountability show' },
              { tag: 'market_stability', weight: -1, summary: 'Distraction' },
            ],
          },
        ],
      },
      {
        id: 'hist-1929-9',
        title: 'Tariff off-ramp debate',
        briefing:
          'A protectionist bill could “save jobs” or strangulate recovery. You have one hearing cycle to shape it.',
        stakes:
          'Trade policy can deepen a financial crisis into a depression.',
        choices: [
          {
            id: 'hist-1929-9a',
            label: 'Lobby for narrow, temporary safeguards only',
            detail: 'Limit the damage.',
            kind: 'political',
            markerId: 'treasury',
            short: 'NARROW',
            effects: [
              { tag: 'market_stability', weight: 1, summary: 'Less shock' },
              { tag: 'diplomacy', weight: 1, summary: 'Partners less angry' },
              { tag: 'domestic_support', weight: -1, summary: 'Lobbyists mad' },
            ],
          },
          {
            id: 'hist-1929-9b',
            label: 'Embrace broad tariffs as demand for home industry',
            detail: 'Politics over models.',
            kind: 'political',
            markerId: 'em',
            short: 'TARIFF',
            effects: [
              { tag: 'domestic_support', weight: 2, summary: 'Jobs frame' },
              { tag: 'market_stability', weight: -2, summary: 'Trade war risk' },
              { tag: 'alliance_cohesion', weight: -2, summary: 'Retaliation' },
            ],
          },
          {
            id: 'hist-1929-9c',
            label: 'Tie tariff restraint to reciprocal purchasing agreements',
            detail: 'Deals not walls.',
            kind: 'diplomatic',
            markerId: 'fed',
            short: 'RECIP',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Bargains open' },
              { tag: 'market_stability', weight: 1, summary: 'Trade paths' },
              { tag: 'time', weight: -1, summary: 'Negotiation lag' },
            ],
          },
        ],
      },
      {
        id: 'hist-1929-10',
        title: 'Doctrine endgame',
        briefing:
          'Cabinet asks whether this was a liquidity spasm or a solvency era requiring a new macro doctrine.',
        stakes:
          'The diagnosis becomes the next decade.',
        choices: [
          {
            id: 'hist-1929-10a',
            label: 'Declare a liquidity doctrine with standing facilities',
            detail: 'Permanent backstops.',
            kind: 'economic',
            markerId: 'fed',
            short: 'DOCTRINE',
            effects: [
              { tag: 'market_stability', weight: 2, summary: 'Institutional calm' },
              { tag: 'credibility', weight: 1, summary: 'Learned lesson' },
              { tag: 'economic_pressure', weight: -1, summary: 'Moral hazard' },
            ],
          },
          {
            id: 'hist-1929-10b',
            label: 'Reassert austerity-and-gold as credibility core',
            detail: 'Orthodoxy restored.',
            kind: 'economic',
            markerId: 'treasury',
            short: 'AUSTER',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Hard line' },
              { tag: 'civilian_cost', weight: 2, summary: 'Social pain' },
              { tag: 'social_calm', weight: -2, summary: 'Unrest risk' },
            ],
          },
          {
            id: 'hist-1929-10c',
            label: 'Launch a bipartisan commission before locking doctrine',
            detail: 'Study then choose.',
            kind: 'political',
            markerId: 'desk',
            short: 'COMMISH',
            effects: [
              { tag: 'time', weight: 2, summary: 'Deliberation' },
              { tag: 'governability', weight: 1, summary: 'Shared ownership' },
              { tag: 'market_stability', weight: -1, summary: 'Policy fog' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'hist-1931-mukden',
    year: 1931,
    era: '1919–1939',
    title: 'Mukden Hour',
    region: 'Manchuria · League of Nations · East Asia',
    meterFamily: 'conflict',
    theaterArchetype: 'pacific',
    premise:
      'A staged railway incident becomes a rapid occupation. You advise a League-aligned cabinet on whether to sanction, mediate, or look away while the map changes.',
    role: 'League desk director, foreign ministry',
    tension:
      'Collective security’s credibility versus appetite for another war.',
    beats: [
      {
        id: 'hist-1931-1',
        title: 'Incident fog',
        briefing:
          'Reports conflict on who blew the track. Your attaché says the occupation is already expanding.',
        stakes:
          'Waiting for perfect facts cedes the ground.',
        choices: [
          {
            id: 'hist-1931-1a',
            label: 'Call for immediate halt and inquiry',
            detail: 'Public League process.',
            kind: 'diplomatic',
            markerId: 'capital_a',
            short: 'INQUIRE',
            effects: [
              { tag: 'norm_protection', weight: 2, summary: 'Process first' },
              { tag: 'time', weight: 1, summary: 'Buys days' },
              { tag: 'deterrence', weight: -1, summary: 'No force yet' },
            ],
          },
          {
            id: 'hist-1931-1b',
            label: 'Quiet bilateral demarche only',
            detail: 'Avoid cornering anyone publicly.',
            kind: 'diplomatic',
            markerId: 'capital_b',
            short: 'DEMARCHE',
            effects: [
              { tag: 'diplomacy', weight: 1, summary: 'Channel open' },
              { tag: 'credibility', weight: -1, summary: 'League sidelined' },
              { tag: 'escalation', weight: -1, summary: 'Lower heat' },
            ],
          },
          {
            id: 'hist-1931-1c',
            label: 'Issue a condemnation without measures',
            detail: 'Words only.',
            kind: 'political',
            markerId: 'cable',
            short: 'CONDEMN',
            effects: [
              { tag: 'credibility', weight: -2, summary: 'Empty speech' },
              { tag: 'norm_erosion', weight: 1, summary: 'Shows toothless' },
              { tag: 'domestic_support', weight: 1, summary: 'Did something' },
            ],
          },
        ],
      },
      {
        id: 'hist-1931-2',
        title: 'Sanctions debate',
        briefing:
          'Economists say embargoes will hurt your exporters. Idealists say no cost means no League.',
        stakes:
          'Economic pain is the only non-war tool left.',
        choices: [
          {
            id: 'hist-1931-2a',
            label: 'Targeted arms and credit embargo',
            detail: 'Narrow coercion.',
            kind: 'economic',
            markerId: 'cable',
            short: 'EMBARGO',
            effects: [
              { tag: 'economic_pressure', weight: 2, summary: 'Squeezes campaign' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'If partners join' },
              { tag: 'market_stability', weight: -1, summary: 'Trade friction' },
            ],
          },
          {
            id: 'hist-1931-2b',
            label: 'Refuse sanctions; offer mediation committee',
            detail: 'Talks without teeth.',
            kind: 'diplomatic',
            markerId: 'island',
            short: 'MEDIATE',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Forum exists' },
              { tag: 'norm_erosion', weight: 1, summary: 'Aggression cheap' },
              { tag: 'credibility', weight: -1, summary: 'Weak response' },
            ],
          },
          {
            id: 'hist-1931-2c',
            label: 'Threaten recognition denial of any new state',
            detail: 'Legal isolation strategy.',
            kind: 'legal',
            markerId: 'strait',
            short: 'NOSTATE',
            effects: [
              { tag: 'norm_protection', weight: 2, summary: 'Non-recognition' },
              { tag: 'deterrence', weight: 1, summary: 'Future cost' },
              { tag: 'time', weight: 1, summary: 'Slow tool' },
            ],
          },
        ],
      },
      {
        id: 'hist-1931-3',
        title: 'China’s ask',
        briefing:
          'Chinese envoys want material aid and a hard deadline. Your military says you cannot fight in Manchuria.',
        stakes:
          'Aid without escort is symbolism; escort is war.',
        choices: [
          {
            id: 'hist-1931-3a',
            label: 'Send non-lethal aid and observers',
            detail: 'Presence without combat.',
            kind: 'diplomatic',
            markerId: 'fleet',
            short: 'OBSERVE',
            effects: [
              { tag: 'alliance_cohesion', weight: 1, summary: 'Shows up' },
              { tag: 'escalation', weight: 1, summary: 'Risk to personnel' },
              { tag: 'credibility', weight: 1, summary: 'Not absent' },
            ],
          },
          {
            id: 'hist-1931-3b',
            label: 'Promise only diplomatic support',
            detail: 'No matériel.',
            kind: 'political',
            markerId: 'capital_a',
            short: 'WORDS',
            effects: [
              { tag: 'escalation', weight: -1, summary: 'Safe' },
              { tag: 'credibility', weight: -2, summary: 'Abandonment feel' },
              { tag: 'diplomacy', weight: 1, summary: 'Keeps distance' },
            ],
          },
          {
            id: 'hist-1931-3c',
            label: 'Quietly accept a fait accompli buffer deal',
            detail: 'Trade silence for commercial access.',
            kind: 'economic',
            markerId: 'island',
            short: 'BUFFER',
            effects: [
              { tag: 'market_stability', weight: 1, summary: 'Business continuity' },
              { tag: 'norm_erosion', weight: 2, summary: 'Rewards force' },
              { tag: 'alliance_cohesion', weight: -2, summary: 'China betrayed' },
            ],
          },
        ],
      },
      {
        id: 'hist-1931-4',
        title: 'Assembly vote',
        briefing:
          'A League report lands. Voting to condemn without enforcement may advertise impotence.',
        stakes:
          'Procedure is now the message.',
        choices: [
          {
            id: 'hist-1931-4a',
            label: 'Vote to condemn and recommend withdrawal',
            detail: 'Full political isolation.',
            kind: 'political',
            markerId: 'capital_b',
            short: 'VOTE',
            effects: [
              { tag: 'norm_protection', weight: 2, summary: 'Names aggression' },
              { tag: 'credibility', weight: 1, summary: 'Clear record' },
              { tag: 'deterrence', weight: -1, summary: 'Still no force' },
            ],
          },
          {
            id: 'hist-1931-4b',
            label: 'Abstain to preserve mediator role',
            detail: 'Stay useful later.',
            kind: 'diplomatic',
            markerId: 'strait',
            short: 'ABSTAIN',
            effects: [
              { tag: 'diplomacy', weight: 1, summary: 'Flexibility' },
              { tag: 'credibility', weight: -1, summary: 'Fence-sitting' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Partners annoyed' },
            ],
          },
          {
            id: 'hist-1931-4c',
            label: 'Push a face-saving “international zone” compromise',
            detail: 'Rewrite the map surgically.',
            kind: 'diplomatic',
            markerId: 'fleet',
            short: 'ZONE',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Deal shape' },
              { tag: 'norm_erosion', weight: 1, summary: 'Legalizes gain' },
              { tag: 'escalation', weight: -1, summary: 'May freeze lines' },
            ],
          },
        ],
      },
      {
        id: 'hist-1931-5',
        title: 'Railway sabotage fog',
        briefing:
          'Competing claims about who blew the track arrive within hours. Your League brief needs a factual spine or it becomes theater.',
        stakes:
          'Fog favors the side that moves troops.',
        choices: [
          {
            id: 'hist-1931-5a',
            label: 'Demand an immediate international inquiry team',
            detail: 'Facts before resolutions.',
            kind: 'diplomatic',
            markerId: 'cable',
            short: 'INQ',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Process first' },
              { tag: 'time', weight: 1, summary: 'Investigation' },
              { tag: 'escalation', weight: -1, summary: 'Slows narrative war' },
            ],
          },
          {
            id: 'hist-1931-5b',
            label: 'Accept the stronger power’s provisional account',
            detail: 'Keep great-power peace.',
            kind: 'political',
            markerId: 'capital_a',
            short: 'ACCEPT',
            effects: [
              { tag: 'alliance_cohesion', weight: -1, summary: 'Weaker party betrayed' },
              { tag: 'escalation', weight: -1, summary: 'Less clash now' },
              { tag: 'credibility', weight: -2, summary: 'Collective security hollow' },
            ],
          },
          {
            id: 'hist-1931-5c',
            label: 'Publish your own intelligence assessment unilaterally',
            detail: 'Own a map.',
            kind: 'diplomatic',
            markerId: 'capital_b',
            short: 'UNILAT',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Independent voice' },
              { tag: 'diplomacy', weight: -1, summary: 'Angers someone' },
              { tag: 'time', weight: -1, summary: 'Exposure risk' },
            ],
          },
        ],
      },
      {
        id: 'hist-1931-6',
        title: 'Domestic isolationist surge',
        briefing:
          'Voters ask why Asian rails matter. Funding a League response looks like foreign adventurism.',
        stakes:
          'Collective security dies at the ballot if unexplained.',
        choices: [
          {
            id: 'hist-1931-6a',
            label: 'Frame Manchuria as a precedent for everyone’s borders',
            detail: 'Principle over distance.',
            kind: 'political',
            markerId: 'capital_a',
            short: 'PRECED',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Norm defense' },
              { tag: 'domestic_support', weight: -1, summary: 'Hard sell' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Small states cheer' },
            ],
          },
          {
            id: 'hist-1931-6b',
            label: 'Limit response to trade measures without force talk',
            detail: 'Cheap signal.',
            kind: 'economic',
            markerId: 'strait',
            short: 'TRADE',
            effects: [
              { tag: 'economic_pressure', weight: 1, summary: 'Mild cost' },
              { tag: 'domestic_support', weight: 1, summary: 'No body bags' },
              { tag: 'deterrence', weight: -1, summary: 'Weak teeth' },
            ],
          },
          {
            id: 'hist-1931-6c',
            label: 'Stay quiet and let the League secretariat speak',
            detail: 'Hide behind the institution.',
            kind: 'diplomatic',
            markerId: 'cable',
            short: 'HIDE',
            effects: [
              { tag: 'time', weight: 1, summary: 'Less heat' },
              { tag: 'credibility', weight: -1, summary: 'Leadership vacuum' },
              { tag: 'diplomacy', weight: 1, summary: 'Institutional path' },
            ],
          },
        ],
      },
      {
        id: 'hist-1931-7',
        title: 'China’s enforcement ask',
        briefing:
          'Nanjing wants arms, loans, and a naval demonstration. Anything kinetic risks a wider war; anything soft looks like abandonment.',
        stakes:
          'Helping without owning the war.',
        choices: [
          {
            id: 'hist-1931-7a',
            label: 'Offer credits and medical aid, not weapons',
            detail: 'Support without spark.',
            kind: 'economic',
            markerId: 'island',
            short: 'AID',
            effects: [
              { tag: 'alliance_cohesion', weight: 1, summary: 'Partner helped' },
              { tag: 'escalation', weight: -1, summary: 'Less kinetic' },
              { tag: 'civilian_cost', weight: -1, summary: 'Relief' },
            ],
          },
          {
            id: 'hist-1931-7b',
            label: 'Authorize a limited naval observation near ports',
            detail: 'Presence without blockade.',
            kind: 'naval',
            markerId: 'fleet',
            short: 'OBS',
            effects: [
              { tag: 'deterrence', weight: 1, summary: 'Visible interest' },
              { tag: 'escalation', weight: 1, summary: 'Incident risk' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Reassurance' },
            ],
          },
          {
            id: 'hist-1931-7c',
            label: 'Quietly approve arms via third parties',
            detail: 'Plausible distance.',
            kind: 'kinetic',
            markerId: 'capital_b',
            short: 'ARMS',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Hard help' },
              { tag: 'escalation', weight: 2, summary: 'War fuel' },
              { tag: 'credibility', weight: -1, summary: 'Covert stain' },
            ],
          },
        ],
      },
      {
        id: 'hist-1931-8',
        title: 'Cable censorship claims',
        briefing:
          'Each side alleges the other is forging League telegrams. Your own cipher clerks report anomalies.',
        stakes:
          'Institutions collapse when messages cannot be trusted.',
        choices: [
          {
            id: 'hist-1931-8a',
            label: 'Impose dual-key verification on League traffic',
            detail: 'Slow but authentic.',
            kind: 'diplomatic',
            markerId: 'cable',
            short: 'DUALKEY',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Trusted pipes' },
              { tag: 'time', weight: -1, summary: 'Friction' },
              { tag: 'diplomacy', weight: 1, summary: 'Process repair' },
            ],
          },
          {
            id: 'hist-1931-8b',
            label: 'Call out the alleged forger publicly',
            detail: 'Name and shame.',
            kind: 'political',
            markerId: 'capital_a',
            short: 'SHAME',
            effects: [
              { tag: 'escalation', weight: 1, summary: 'Diplomatic fight' },
              { tag: 'credibility', weight: 1, summary: 'Clarity attempt' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Splits assembly' },
            ],
          },
          {
            id: 'hist-1931-8c',
            label: 'Fall back to courier diplomacy for critical notes',
            detail: 'Pre-modern reliability.',
            kind: 'diplomatic',
            markerId: 'island',
            short: 'COURIER',
            effects: [
              { tag: 'time', weight: -2, summary: 'Slow' },
              { tag: 'credibility', weight: 1, summary: 'Harder to forge' },
              { tag: 'diplomacy', weight: 1, summary: 'Channel survives' },
            ],
          },
        ],
      },
      {
        id: 'hist-1931-9',
        title: 'Assembly off-ramp',
        briefing:
          'A draft resolution offers non-recognition of conquests plus a negotiation commission—if great powers do not veto by inaction.',
        stakes:
          'Paper can still matter if capitals mean it.',
        choices: [
          {
            id: 'hist-1931-9a',
            label: 'Champion non-recognition as the core norm',
            detail: 'Stimson logic.',
            kind: 'legal',
            markerId: 'capital_b',
            short: 'NONREC',
            effects: [
              { tag: 'norm_protection', weight: 3, summary: 'Conquest denied' },
              { tag: 'diplomacy', weight: 1, summary: 'Moral coalition' },
              { tag: 'deterrence', weight: -1, summary: 'No force behind' },
            ],
          },
          {
            id: 'hist-1931-9b',
            label: 'Water down to a fact-finding-only text',
            detail: 'Keep everyone in the room.',
            kind: 'diplomatic',
            markerId: 'cable',
            short: 'WATER',
            effects: [
              { tag: 'alliance_cohesion', weight: 1, summary: 'Broader yes' },
              { tag: 'credibility', weight: -2, summary: 'Toothless' },
              { tag: 'time', weight: 1, summary: 'Process continues' },
            ],
          },
          {
            id: 'hist-1931-9c',
            label: 'Add a sanctions timetable with triggers',
            detail: 'Give paper teeth.',
            kind: 'economic',
            markerId: 'strait',
            short: 'TRIG',
            effects: [
              { tag: 'economic_pressure', weight: 2, summary: 'Costly defiance' },
              { tag: 'escalation', weight: 1, summary: 'Confrontation' },
              { tag: 'market_stability', weight: -1, summary: 'Trade nerves' },
            ],
          },
        ],
      },
      {
        id: 'hist-1931-10',
        title: 'Collective security endgame',
        briefing:
          'Either the League draws a line that capitals will fund, or Manchuria becomes the template for the next seizure.',
        stakes:
          'Precedent is the strategic good.',
        choices: [
          {
            id: 'hist-1931-10a',
            label: 'Fund a standing League observation budget',
            detail: 'Pay for the norm.',
            kind: 'economic',
            markerId: 'fleet',
            short: 'FUND',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Institution lives' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Shared cost' },
              { tag: 'domestic_support', weight: -1, summary: 'Spending fight' },
            ],
          },
          {
            id: 'hist-1931-10b',
            label: 'Declare Asian crises outside your security perimeter',
            detail: 'Retreat to core.',
            kind: 'political',
            markerId: 'capital_a',
            short: 'PERIM',
            effects: [
              { tag: 'escalation', weight: -1, summary: 'Less exposure' },
              { tag: 'credibility', weight: -3, summary: 'Order hollow' },
              { tag: 'alliance_cohesion', weight: -2, summary: 'Small states flee' },
            ],
          },
          {
            id: 'hist-1931-10c',
            label: 'Pivot to a regional consultative pact outside the League',
            detail: 'New architecture.',
            kind: 'diplomatic',
            markerId: 'island',
            short: 'PACT',
            effects: [
              { tag: 'diplomacy', weight: 1, summary: 'Alternate forum' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Regional glue' },
              { tag: 'norm_erosion', weight: 1, summary: 'League bypassed' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'hist-1938-munich',
    year: 1938,
    era: '1919–1939',
    title: 'Munich Window',
    region: 'Czechoslovakia · Germany · Western capitals',
    meterFamily: 'conflict',
    theaterArchetype: 'europe',
    premise:
      'A crisis over the Sudetenland forces a choice between deterrent solidarity and a negotiated cession sold as peace. You advise a Western cabinet in the final week.',
    role: 'Prime ministerial foreign affairs secretary',
    tension:
      'Avoid war now without teaching that ultimata always work.',
    beats: [
      {
        id: 'hist-1938-1',
        title: 'Alliance test',
        briefing:
          'Prague asks whether your guarantee is real. Generals say you are unready; public opinion fears another bloodbath.',
        stakes:
          'Readiness and credibility are the same question.',
        choices: [
          {
            id: 'hist-1938-1a',
            label: 'Reaffirm the guarantee publicly',
            detail: 'Tie your standing to Czech borders.',
            kind: 'diplomatic',
            markerId: 'brussels',
            short: 'GUARANT',
            effects: [
              { tag: 'alliance_cohesion', weight: 3, summary: 'Partner steadied' },
              { tag: 'escalation', weight: 2, summary: 'Raises stakes' },
              { tag: 'credibility', weight: 2, summary: 'Clear red line' },
            ],
          },
          {
            id: 'hist-1938-1b',
            label: 'Quietly urge Prague to concede districts',
            detail: 'Trade land for time.',
            kind: 'diplomatic',
            markerId: 'capital',
            short: 'CONCEDE',
            effects: [
              { tag: 'escalation', weight: -2, summary: 'War delayed' },
              { tag: 'credibility', weight: -2, summary: 'Guarantee hollow' },
              { tag: 'diplomacy', weight: 1, summary: 'Talks path' },
            ],
          },
          {
            id: 'hist-1938-1c',
            label: 'Accelerate partial mobilization as signal',
            detail: 'Ready without declaring.',
            kind: 'kinetic',
            markerId: 'streets',
            short: 'MOBILE',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Shows teeth' },
              { tag: 'escalation', weight: 2, summary: 'Crisis heat' },
              { tag: 'market_stability', weight: -1, summary: 'War scare' },
            ],
          },
        ],
      },
      {
        id: 'hist-1938-2',
        title: 'Conference invitation',
        briefing:
          'A four-power meeting is offered—without Prague in the room. Refusing may mean no talks; accepting may mean carving a democracy in absentia.',
        stakes:
          'Procedure is already a concession.',
        choices: [
          {
            id: 'hist-1938-2a',
            label: 'Attend only if Prague is seated',
            detail: 'No settlement over their head.',
            kind: 'diplomatic',
            markerId: 'parliament',
            short: 'SEAT',
            effects: [
              { tag: 'norm_protection', weight: 2, summary: 'Consent principle' },
              { tag: 'diplomacy', weight: -1, summary: 'May kill talks' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Czech trust' },
            ],
          },
          {
            id: 'hist-1938-2b',
            label: 'Attend and bargain borders',
            detail: 'Seek “peace in our time” map.',
            kind: 'political',
            markerId: 'ballot',
            short: 'BARGAIN',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Deal possible' },
              { tag: 'norm_erosion', weight: 2, summary: 'Absent victim' },
              { tag: 'escalation', weight: -2, summary: 'War postponed' },
            ],
          },
          {
            id: 'hist-1938-2c',
            label: 'Refuse conference; prepare sanctions package',
            detail: 'Pressure outside the room.',
            kind: 'economic',
            markerId: 'districts',
            short: 'SANCT',
            effects: [
              { tag: 'economic_pressure', weight: 2, summary: 'Costly defiance' },
              { tag: 'escalation', weight: 1, summary: 'Fewer off-ramps' },
              { tag: 'credibility', weight: 1, summary: 'Firm stance' },
            ],
          },
        ],
      },
      {
        id: 'hist-1938-3',
        title: 'Military readiness gap',
        briefing:
          'Staff briefings show months before real readiness. Industry wants stockpiles; politicians want a triumph.',
        stakes:
          'Buying time can look like buying humiliation.',
        choices: [
          {
            id: 'hist-1938-3a',
            label: 'Trade cession for a binding non-aggression pledge',
            detail: 'Paper guarantees plus land.',
            kind: 'diplomatic',
            markerId: 'brussels',
            short: 'PLEDGE',
            effects: [
              { tag: 'escalation', weight: -2, summary: 'Immediate calm' },
              { tag: 'credibility', weight: -1, summary: 'Paper trusted' },
              { tag: 'time', weight: 2, summary: 'Rearm window' },
            ],
          },
          {
            id: 'hist-1938-3b',
            label: 'Refuse cession; start crash rearmament',
            detail: 'Guns over map.',
            kind: 'economic',
            markerId: 'capital',
            short: 'REARM',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Future strength' },
              { tag: 'escalation', weight: 2, summary: 'Near-term risk' },
              { tag: 'domestic_support', weight: -1, summary: 'Fear of war' },
            ],
          },
          {
            id: 'hist-1938-3c',
            label: 'Seek Soviet alignment as third balancer',
            detail: 'Widen the coalition.',
            kind: 'diplomatic',
            markerId: 'parliament',
            short: 'EAST',
            effects: [
              { tag: 'alliance_cohesion', weight: 1, summary: 'New weight' },
              { tag: 'polarization', weight: 2, summary: 'Domestic scare' },
              { tag: 'deterrence', weight: 1, summary: 'Extra front' },
            ],
          },
        ],
      },
      {
        id: 'hist-1938-4',
        title: 'Homecoming speech',
        briefing:
          'Whatever you signed or refused, the public wants a story: peace, honor, or betrayal.',
        stakes:
          'Narrative locks the next crisis.',
        choices: [
          {
            id: 'hist-1938-4a',
            label: 'Sell peace as strategic pause',
            detail: 'Admit cost; promise readiness.',
            kind: 'political',
            markerId: 'ballot',
            short: 'PAUSE',
            effects: [
              { tag: 'domestic_support', weight: 1, summary: 'Honest frame' },
              { tag: 'credibility', weight: 1, summary: 'No triumph lie' },
              { tag: 'time', weight: 1, summary: 'Political space' },
            ],
          },
          {
            id: 'hist-1938-4b',
            label: 'Declare a triumph of diplomacy',
            detail: 'Maximize calm; minimize doubt.',
            kind: 'political',
            markerId: 'capital',
            short: 'TRIUMPH',
            effects: [
              { tag: 'social_calm', weight: 2, summary: 'Relief' },
              { tag: 'credibility', weight: -2, summary: 'Overclaim risk' },
              { tag: 'deterrence', weight: -1, summary: 'Complacency' },
            ],
          },
          {
            id: 'hist-1938-4c',
            label: 'Condemn the settlement and resign posture',
            detail: 'Moral clarity over office unity.',
            kind: 'civic',
            markerId: 'streets',
            short: 'DISSENT',
            effects: [
              { tag: 'norm_protection', weight: 2, summary: 'Names coercion' },
              { tag: 'governability', weight: -2, summary: 'Cabinet crisis' },
              { tag: 'polarization', weight: 2, summary: 'Country splits' },
            ],
          },
        ],
      },
      {
        id: 'hist-1938-5',
        title: 'Partial mobilization shock',
        briefing:
          'Neighboring staffs begin masked moves. Your own readiness gap is public knowledge; delay looks like exposure, speed looks like warmongering.',
        stakes:
          'Readiness is a diplomatic message.',
        choices: [
          {
            id: 'hist-1938-5a',
            label: 'Quietly fill readiness gaps without proclamation',
            detail: 'Prepare without panic.',
            kind: 'kinetic',
            markerId: 'districts',
            short: 'QUIETR',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Hidden teeth' },
              { tag: 'escalation', weight: 1, summary: 'Adversary notices' },
              { tag: 'domestic_support', weight: -1, summary: 'If leaked, scare' },
            ],
          },
          {
            id: 'hist-1938-5b',
            label: 'Public partial mobilization to signal resolve',
            detail: 'Make the cost visible.',
            kind: 'political',
            markerId: 'parliament',
            short: 'PARTMOB',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Public resolve' },
              { tag: 'escalation', weight: 2, summary: 'Crisis heats' },
              { tag: 'market_stability', weight: -1, summary: 'Nerves' },
            ],
          },
          {
            id: 'hist-1938-5c',
            label: 'Propose mutual demobilization as a conference precondition',
            detail: 'Talks first.',
            kind: 'diplomatic',
            markerId: 'brussels',
            short: 'DEMOB',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'De-escalatory ask' },
              { tag: 'deterrence', weight: -1, summary: 'Exposure risk' },
              { tag: 'time', weight: 1, summary: 'Window' },
            ],
          },
        ],
      },
      {
        id: 'hist-1938-6',
        title: 'Parliamentary war scare',
        briefing:
          'Opposition calls any concession treason; another faction calls rearmament bankruptcy. Your majority is soft.',
        stakes:
          'Home politics can veto strategy.',
        choices: [
          {
            id: 'hist-1938-6a',
            label: 'Seek a cross-party national government for the crisis',
            detail: 'Share ownership.',
            kind: 'political',
            markerId: 'parliament',
            short: 'NATGOV',
            effects: [
              { tag: 'governability', weight: 2, summary: 'Broader mandate' },
              { tag: 'domestic_support', weight: 1, summary: 'Unity optics' },
              { tag: 'time', weight: -1, summary: 'Bargaining delay' },
            ],
          },
          {
            id: 'hist-1938-6b',
            label: 'Campaign on peace-with-honor language',
            detail: 'Own the Munich frame early.',
            kind: 'civic',
            markerId: 'ballot',
            short: 'PEACE',
            effects: [
              { tag: 'domestic_support', weight: 2, summary: 'Peace brand' },
              { tag: 'credibility', weight: -1, summary: 'May look weak abroad' },
              { tag: 'diplomacy', weight: 1, summary: 'Room to deal' },
            ],
          },
          {
            id: 'hist-1938-6c',
            label: 'Leak readiness shortfalls to force a rearmament vote',
            detail: 'Scare the chamber into funds.',
            kind: 'political',
            markerId: 'streets',
            short: 'LEAK',
            effects: [
              { tag: 'deterrence', weight: 1, summary: 'Money for force' },
              { tag: 'credibility', weight: -2, summary: 'Self-exposure' },
              { tag: 'polarization', weight: 1, summary: 'Panic politics' },
            ],
          },
        ],
      },
      {
        id: 'hist-1938-7',
        title: 'Ally’s guarantee ask',
        briefing:
          'A threatened democracy wants a public tripwire. Granting it may deter—or drag you into a fight you cannot yet win.',
        stakes:
          'Guarantees are mortgages on future force.',
        choices: [
          {
            id: 'hist-1938-7a',
            label: 'Issue a conditional guarantee tied to League/conference process',
            detail: 'Tripwire with diplomacy.',
            kind: 'diplomatic',
            markerId: 'brussels',
            short: 'CONDG',
            effects: [
              { tag: 'alliance_cohesion', weight: 2, summary: 'Partner held' },
              { tag: 'deterrence', weight: 1, summary: 'Clearer line' },
              { tag: 'escalation', weight: 1, summary: 'Commitment risk' },
            ],
          },
          {
            id: 'hist-1938-7b',
            label: 'Offer staff talks and munitions, not a public guarantee',
            detail: 'Help without the word.',
            kind: 'kinetic',
            markerId: 'capital',
            short: 'STAFF',
            effects: [
              { tag: 'alliance_cohesion', weight: 1, summary: 'Practical help' },
              { tag: 'deterrence', weight: 1, summary: 'Quiet teeth' },
              { tag: 'credibility', weight: -1, summary: 'Ambiguous' },
            ],
          },
          {
            id: 'hist-1938-7c',
            label: 'Refuse new guarantees until rearmament milestones hit',
            detail: 'Capability first.',
            kind: 'political',
            markerId: 'parliament',
            short: 'MILE',
            effects: [
              { tag: 'time', weight: 1, summary: 'Sequenced' },
              { tag: 'alliance_cohesion', weight: -2, summary: 'Partner exposed' },
              { tag: 'credibility', weight: 1, summary: 'Honest limits' },
            ],
          },
        ],
      },
      {
        id: 'hist-1938-8',
        title: 'Sudeten information fog',
        briefing:
          'Atrocity stories and denial cables arrive together. Your conference brief depends on which map of suffering you believe.',
        stakes:
          'Bad facts make permanent borders.',
        choices: [
          {
            id: 'hist-1938-8a',
            label: 'Require consular spot-checks before map talks',
            detail: 'Verify first.',
            kind: 'diplomatic',
            markerId: 'capital',
            short: 'SPOT',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Evidence-based' },
              { tag: 'time', weight: 1, summary: 'Slower deal' },
              { tag: 'diplomacy', weight: 1, summary: 'Fair process' },
            ],
          },
          {
            id: 'hist-1938-8b',
            label: 'Accept the stronger power’s dossier to keep talks alive',
            detail: 'Peace over precision.',
            kind: 'political',
            markerId: 'brussels',
            short: 'DOSSIER',
            effects: [
              { tag: 'diplomacy', weight: 1, summary: 'Talks continue' },
              { tag: 'credibility', weight: -2, summary: 'Captive narrative' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Victim state bitter' },
            ],
          },
          {
            id: 'hist-1938-8c',
            label: 'Flood your press with chosen victim narratives',
            detail: 'Shape home consent.',
            kind: 'civic',
            markerId: 'streets',
            short: 'NARR',
            effects: [
              { tag: 'domestic_support', weight: 2, summary: 'Mobilized public' },
              { tag: 'polarization', weight: 1, summary: 'Harder compromise' },
              { tag: 'diplomacy', weight: -1, summary: 'Less flexibility' },
            ],
          },
        ],
      },
      {
        id: 'hist-1938-9',
        title: 'Conference off-ramp',
        briefing:
          'A formula trades border revision for international guarantees and demobilization. Critics call it surrender; supporters call it time bought.',
        stakes:
          'Buying time only works if you spend it on strength.',
        choices: [
          {
            id: 'hist-1938-9a',
            label: 'Accept the formula and announce a rearmament surge',
            detail: 'Peace now, power later.',
            kind: 'political',
            markerId: 'parliament',
            short: 'BUYTIME',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'War deferred' },
              { tag: 'deterrence', weight: 1, summary: 'Rearm starts' },
              { tag: 'credibility', weight: -1, summary: 'Appease charge' },
            ],
          },
          {
            id: 'hist-1938-9b',
            label: 'Reject and threaten war unless status quo restored',
            detail: 'Line in the sand.',
            kind: 'kinetic',
            markerId: 'districts',
            short: 'LINE',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Hard clear' },
              { tag: 'escalation', weight: 3, summary: 'War risk spikes' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Some cheer resolve' },
            ],
          },
          {
            id: 'hist-1938-9c',
            label: 'Accept borders but refuse to guarantee them yourself',
            detail: 'Revision without your tripwire.',
            kind: 'diplomatic',
            markerId: 'brussels',
            short: 'NOG',
            effects: [
              { tag: 'escalation', weight: -1, summary: 'Less commitment' },
              { tag: 'alliance_cohesion', weight: -2, summary: 'Hollow deal' },
              { tag: 'diplomacy', weight: 1, summary: 'Partial bargain' },
            ],
          },
        ],
      },
      {
        id: 'hist-1938-10',
        title: 'Homecoming endgame',
        briefing:
          'You return to crowds that will make your words lasting doctrine. Understatement, triumph, or warning will define the next year.',
        stakes:
          'Rhetoric after Munich is strategy.',
        choices: [
          {
            id: 'hist-1938-10a',
            label: 'Deliver a sober “time to rearm” speech',
            detail: 'No triumphalism.',
            kind: 'civic',
            markerId: 'streets',
            short: 'REARM',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Public program' },
              { tag: 'domestic_support', weight: 1, summary: 'Serious tone' },
              { tag: 'diplomacy', weight: -1, summary: 'Adversary warned' },
            ],
          },
          {
            id: 'hist-1938-10b',
            label: 'Claim “peace for our time” to lock political capital',
            detail: 'Spend the cheer.',
            kind: 'political',
            markerId: 'ballot',
            short: 'PEACE4',
            effects: [
              { tag: 'domestic_support', weight: 3, summary: 'Mass relief' },
              { tag: 'credibility', weight: -2, summary: 'Brittle claim' },
              { tag: 'deterrence', weight: -1, summary: 'Complacency' },
            ],
          },
          {
            id: 'hist-1938-10c',
            label: 'Warn that the settlement is temporary and fragile',
            detail: 'Refuse false comfort.',
            kind: 'political',
            markerId: 'parliament',
            short: 'FRAGILE',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Honest framing' },
              { tag: 'domestic_support', weight: -1, summary: 'Anxiety' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Partners prepare' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'hist-1939-corridor',
    year: 1939,
    era: '1939–1945',
    title: 'Corridor Ultimatum',
    region: 'Poland · Germany · Allied capitals',
    meterFamily: 'conflict',
    theaterArchetype: 'europe',
    premise:
      'Demands over Danzig and the Polish corridor collide with new alliance pledges. You advise whether to deter with clarity, buy days with talks, or accept that war has already been chosen.',
    role: 'War cabinet coordinator',
    tension:
      'Honor a guarantee without sleepwalking into a fight you still might shape.',
    beats: [
      {
        id: 'hist-1939-1',
        title: 'Pledge language',
        briefing:
          'Allies ask how automatic your response is. Ambiguity may invite probing; clarity may remove brakes.',
        stakes:
          'Deterrence lives in the verbs.',
        choices: [
          {
            id: 'hist-1939-1a',
            label: 'Issue an automatic assistance pledge',
            detail: 'Attack on Poland means war.',
            kind: 'diplomatic',
            markerId: 'brussels',
            short: 'AUTO',
            effects: [
              { tag: 'deterrence', weight: 3, summary: 'Hard signal' },
              { tag: 'escalation', weight: 2, summary: 'Less flexibility' },
              { tag: 'alliance_cohesion', weight: 2, summary: 'Warsaw steadied' },
            ],
          },
          {
            id: 'hist-1939-1b',
            label: 'Keep “grave consequences” wording',
            detail: 'Room to interpret.',
            kind: 'diplomatic',
            markerId: 'capital',
            short: 'GRAVE',
            effects: [
              { tag: 'diplomacy', weight: 1, summary: 'Wiggle room' },
              { tag: 'credibility', weight: -1, summary: 'Maybe bluff' },
              { tag: 'time', weight: 1, summary: 'Talks possible' },
            ],
          },
          {
            id: 'hist-1939-1c',
            label: 'Condition aid on Polish negotiating flexibility',
            detail: 'Pressure your partner too.',
            kind: 'political',
            markerId: 'parliament',
            short: 'COND',
            effects: [
              { tag: 'diplomacy', weight: 1, summary: 'Bargain path' },
              { tag: 'alliance_cohesion', weight: -2, summary: 'Partner feels alone' },
              { tag: 'escalation', weight: -1, summary: 'May delay' },
            ],
          },
        ],
      },
      {
        id: 'hist-1939-2',
        title: 'Mobilization clocks',
        briefing:
          'Staffs want full mobilization. Markets crash on rumor alone.',
        stakes:
          'Timetables outrun speeches.',
        choices: [
          {
            id: 'hist-1939-2a',
            label: 'Full mobilization with public defensive frame',
            detail: 'Match the machine.',
            kind: 'kinetic',
            markerId: 'streets',
            short: 'FULLMOB',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Ready force' },
              { tag: 'escalation', weight: 3, summary: 'War logic' },
              { tag: 'market_stability', weight: -2, summary: 'Panic' },
            ],
          },
          {
            id: 'hist-1939-2b',
            label: 'Covert readiness; public calm',
            detail: 'Prepare quietly.',
            kind: 'political',
            markerId: 'districts',
            short: 'COVERT',
            effects: [
              { tag: 'deterrence', weight: 1, summary: 'Some readiness' },
              { tag: 'credibility', weight: -1, summary: 'Mixed signals' },
              { tag: 'market_stability', weight: 1, summary: 'Less panic' },
            ],
          },
          {
            id: 'hist-1939-2c',
            label: 'Freeze mobilization; last mediation sprint',
            detail: 'All chips on talks.',
            kind: 'diplomatic',
            markerId: 'ballot',
            short: 'SPRINT',
            effects: [
              { tag: 'diplomacy', weight: 3, summary: 'Final push' },
              { tag: 'deterrence', weight: -2, summary: 'Looks exposed' },
              { tag: 'escalation', weight: -1, summary: 'If others pause' },
            ],
          },
        ],
      },
      {
        id: 'hist-1939-3',
        title: 'Neutral commerce',
        briefing:
          'Neutrals ask if you will respect trade even after fighting starts. Blockade planners want early lists.',
        stakes:
          'Economic war begins before the first shot.',
        choices: [
          {
            id: 'hist-1939-3a',
            label: 'Publish a narrow contraband list',
            detail: 'Predictable rules.',
            kind: 'legal',
            markerId: 'brussels',
            short: 'LIST',
            effects: [
              { tag: 'norm_protection', weight: 1, summary: 'Rules framing' },
              { tag: 'economic_pressure', weight: 1, summary: 'Some squeeze' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Partners can align' },
            ],
          },
          {
            id: 'hist-1939-3b',
            label: 'Prepare total blockade authority',
            detail: 'Maximum pressure.',
            kind: 'economic',
            markerId: 'capital',
            short: 'BLOCK',
            effects: [
              { tag: 'economic_pressure', weight: 3, summary: 'Hard squeeze' },
              { tag: 'civilian_cost', weight: 2, summary: 'Neutral pain' },
              { tag: 'escalation', weight: 1, summary: 'Widens war' },
            ],
          },
          {
            id: 'hist-1939-3c',
            label: 'Delay economic measures to keep neutrals sweet',
            detail: 'Diplomacy first.',
            kind: 'diplomatic',
            markerId: 'parliament',
            short: 'DELAY$',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Neutral goodwill' },
              { tag: 'economic_pressure', weight: -2, summary: 'Weak lever' },
              { tag: 'time', weight: 1, summary: 'Slow coercion' },
            ],
          },
        ],
      },
      {
        id: 'hist-1939-4',
        title: 'Invasion reports',
        briefing:
          'Frontier posts go dark. You must choose the first public act of war—or a last query.',
        stakes:
          'Hesitation and resolve will both be judged.',
        choices: [
          {
            id: 'hist-1939-4a',
            label: 'Declare war on confirmed invasion',
            detail: 'Honor the pledge.',
            kind: 'political',
            markerId: 'capital',
            short: 'DECLARE',
            effects: [
              { tag: 'credibility', weight: 3, summary: 'Word kept' },
              { tag: 'escalation', weight: 3, summary: 'General war' },
              { tag: 'alliance_cohesion', weight: 2, summary: 'Coalition born' },
            ],
          },
          {
            id: 'hist-1939-4b',
            label: 'Ultimatum with a short clock',
            detail: 'Demand withdrawal first.',
            kind: 'diplomatic',
            markerId: 'brussels',
            short: 'CLOCK',
            effects: [
              { tag: 'diplomacy', weight: 1, summary: 'Last formality' },
              { tag: 'credibility', weight: 1, summary: 'Process kept' },
              { tag: 'time', weight: -1, summary: 'Hours only' },
            ],
          },
          {
            id: 'hist-1939-4c',
            label: 'Limited military aid without full declaration',
            detail: 'Support without formal war.',
            kind: 'kinetic',
            markerId: 'streets',
            short: 'AID',
            effects: [
              { tag: 'escalation', weight: 1, summary: 'Partial war' },
              { tag: 'credibility', weight: -2, summary: 'Pledge diluted' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Partner doubts' },
            ],
          },
        ],
      },
      {
        id: 'hist-1939-5',
        title: 'False-flag fog at the border',
        briefing:
          'Incidents multiply; attribution is murky. Your guarantee clock starts whether facts are clean or not.',
        stakes:
          'Ambiguous sparks still burn treaties.',
        choices: [
          {
            id: 'hist-1939-5a',
            label: 'Require dual confirmation before invoking the guarantee',
            detail: 'Protect against traps.',
            kind: 'diplomatic',
            markerId: 'capital',
            short: 'DUALCF',
            effects: [
              { tag: 'time', weight: 1, summary: 'Verification' },
              { tag: 'credibility', weight: 1, summary: 'Careful ally' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Guaranteed state nervous' },
            ],
          },
          {
            id: 'hist-1939-5b',
            label: 'Treat armed cross-border fire as casus enough',
            detail: 'Speed over certainty.',
            kind: 'kinetic',
            markerId: 'districts',
            short: 'CASUS',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Tripwire live' },
              { tag: 'escalation', weight: 3, summary: 'War nearer' },
              { tag: 'diplomacy', weight: -1, summary: 'Talks die' },
            ],
          },
          {
            id: 'hist-1939-5c',
            label: 'Propose an immediate neutral observer corridor',
            detail: 'Internationalize the spark.',
            kind: 'diplomatic',
            markerId: 'brussels',
            short: 'OBSCOR',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Process' },
              { tag: 'escalation', weight: -1, summary: 'Cooling' },
              { tag: 'time', weight: -1, summary: 'Hard to deploy' },
            ],
          },
        ],
      },
      {
        id: 'hist-1939-6',
        title: 'Evacuation and morale politics',
        briefing:
          'Cities ask about shelters and children. Panic can empty factories you need for deterrence.',
        stakes:
          'Civil defense is strategic messaging.',
        choices: [
          {
            id: 'hist-1939-6a',
            label: 'Order limited priority evacuations and shelter drills',
            detail: 'Prepare without full flight.',
            kind: 'civic',
            markerId: 'streets',
            short: 'DRILL',
            effects: [
              { tag: 'civilian_cost', weight: -1, summary: 'Some protection' },
              { tag: 'domestic_support', weight: 1, summary: 'Seen as caring' },
              { tag: 'market_stability', weight: -1, summary: 'Disruption' },
            ],
          },
          {
            id: 'hist-1939-6b',
            label: 'Keep calm messaging; postpone mass movement',
            detail: 'Avoid looking like war is certain.',
            kind: 'political',
            markerId: 'ballot',
            short: 'CALM',
            effects: [
              { tag: 'social_calm', weight: 1, summary: 'Less panic' },
              { tag: 'credibility', weight: -1, summary: 'If bombs fall' },
              { tag: 'time', weight: 1, summary: 'Normalcy bias' },
            ],
          },
          {
            id: 'hist-1939-6c',
            label: 'Nationalize key transport for military priority',
            detail: 'Logistics first.',
            kind: 'political',
            markerId: 'districts',
            short: 'NATL',
            effects: [
              { tag: 'deterrence', weight: 1, summary: 'Mobilization aid' },
              { tag: 'polarization', weight: 1, summary: 'Civil friction' },
              { tag: 'market_stability', weight: -1, summary: 'Commerce hit' },
            ],
          },
        ],
      },
      {
        id: 'hist-1939-7',
        title: 'Neutral commerce squeeze',
        briefing:
          'Neutrals want trade assurances; your navy wants contraband lists. Too soft funds the adversary; too hard makes new enemies.',
        stakes:
          'Blockade law is coalition politics.',
        choices: [
          {
            id: 'hist-1939-7a',
            label: 'Publish a narrow contraband list with prize courts',
            detail: 'Lawful pressure.',
            kind: 'legal',
            markerId: 'brussels',
            short: 'PRIZE',
            effects: [
              { tag: 'economic_pressure', weight: 2, summary: 'Legal squeeze' },
              { tag: 'credibility', weight: 1, summary: 'Rule-bound' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Neutrals less angry' },
            ],
          },
          {
            id: 'hist-1939-7b',
            label: 'Impose a broad embargo and dare challenges',
            detail: 'Maximal denial.',
            kind: 'naval',
            markerId: 'capital',
            short: 'EMBARGO',
            effects: [
              { tag: 'economic_pressure', weight: 3, summary: 'Hard denial' },
              { tag: 'escalation', weight: 2, summary: 'Incident risk' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Neutral fury' },
            ],
          },
          {
            id: 'hist-1939-7c',
            label: 'Exempt food and medicine explicitly',
            detail: 'Humanitarian carve-out.',
            kind: 'diplomatic',
            markerId: 'parliament',
            short: 'HUM',
            effects: [
              { tag: 'civilian_cost', weight: -2, summary: 'Less hunger weapon' },
              { tag: 'economic_pressure', weight: -1, summary: 'Weaker squeeze' },
              { tag: 'credibility', weight: 1, summary: 'Moral signal' },
            ],
          },
        ],
      },
      {
        id: 'hist-1939-8',
        title: 'Intelligence contradiction',
        briefing:
          'One service says invasion is days away; another says coercion theater. Your force generation depends on the call.',
        stakes:
          'Wrong clocks waste armies or lose countries.',
        choices: [
          {
            id: 'hist-1939-8a',
            label: 'Split the difference: elevate alert, hold declaration',
            detail: 'Ready without irrevocable words.',
            kind: 'kinetic',
            markerId: 'capital',
            short: 'ALERT',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Ready posture' },
              { tag: 'time', weight: 1, summary: 'Declaration delayed' },
              { tag: 'escalation', weight: 1, summary: 'Higher readiness' },
            ],
          },
          {
            id: 'hist-1939-8b',
            label: 'Side with the early-invasion estimate',
            detail: 'Assume worst.',
            kind: 'kinetic',
            markerId: 'districts',
            short: 'WORST2',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Max prep' },
              { tag: 'escalation', weight: 2, summary: 'War footing' },
              { tag: 'market_stability', weight: -2, summary: 'Panic' },
            ],
          },
          {
            id: 'hist-1939-8c',
            label: 'Demand a joint intelligence estimate before action',
            detail: 'Force a single brief.',
            kind: 'diplomatic',
            markerId: 'brussels',
            short: 'JIE',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Unified picture' },
              { tag: 'time', weight: -1, summary: 'Coordination tax' },
              { tag: 'diplomacy', weight: 1, summary: 'Shared facts' },
            ],
          },
        ],
      },
      {
        id: 'hist-1939-9',
        title: 'Last bargaining window',
        briefing:
          'A last proposal trades corridor access regimes for demobilization and talks. Hardliners call it a second Munich.',
        stakes:
          'Naming the lesson of Munich can close the window that lesson was meant to buy.',
        choices: [
          {
            id: 'hist-1939-9a',
            label: 'Explore access regimes under international board',
            detail: 'Technocratic off-ramp.',
            kind: 'diplomatic',
            markerId: 'brussels',
            short: 'ACCESS',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Last talk' },
              { tag: 'escalation', weight: -1, summary: 'Cooling chance' },
              { tag: 'domestic_support', weight: -1, summary: 'Appease fear' },
            ],
          },
          {
            id: 'hist-1939-9b',
            label: 'Refuse any territorial discussion under threat',
            detail: 'No negotiation at gunpoint.',
            kind: 'political',
            markerId: 'parliament',
            short: 'NOGUN',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Anti-ultimatum norm' },
              { tag: 'escalation', weight: 1, summary: 'Less deal space' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Guaranteed state steadied' },
            ],
          },
          {
            id: 'hist-1939-9c',
            label: 'Accept talks only after partial demobilization verified',
            detail: 'Sequence safety.',
            kind: 'diplomatic',
            markerId: 'capital',
            short: 'VERIF',
            effects: [
              { tag: 'diplomacy', weight: 1, summary: 'Conditional table' },
              { tag: 'time', weight: 1, summary: 'Verification' },
              { tag: 'deterrence', weight: 1, summary: 'Safety first' },
            ],
          },
        ],
      },
      {
        id: 'hist-1939-10',
        title: 'Guarantee endgame',
        briefing:
          'Invasion reports arrive. You must recommend war declaration timing, limited aid, or a pause for one more note.',
        stakes:
          'The guarantee’s value is proven or spent tonight.',
        choices: [
          {
            id: 'hist-1939-10a',
            label: 'Recommend immediate war declaration with allies',
            detail: 'Honor the tripwire.',
            kind: 'political',
            markerId: 'parliament',
            short: 'DECLARE',
            effects: [
              { tag: 'alliance_cohesion', weight: 3, summary: 'Guarantee kept' },
              { tag: 'escalation', weight: 3, summary: 'General war' },
              { tag: 'credibility', weight: 2, summary: 'Word is bond' },
            ],
          },
          {
            id: 'hist-1939-10b',
            label: 'Send an ultimatum with a short clock before declaring',
            detail: 'One last note.',
            kind: 'diplomatic',
            markerId: 'brussels',
            short: 'ULTIM',
            effects: [
              { tag: 'diplomacy', weight: 1, summary: 'Formal last step' },
              { tag: 'time', weight: -1, summary: 'Hours only' },
              { tag: 'escalation', weight: 2, summary: 'War likely' },
            ],
          },
          {
            id: 'hist-1939-10c',
            label: 'Lead with material aid and delay declaration',
            detail: 'Help without full war yet.',
            kind: 'kinetic',
            markerId: 'districts',
            short: 'AIDONLY',
            effects: [
              { tag: 'alliance_cohesion', weight: -2, summary: 'Ally feels alone' },
              { tag: 'escalation', weight: 1, summary: 'Limited war risk' },
              { tag: 'credibility', weight: -2, summary: 'Guarantee doubted' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'hist-1941-pacific-entry',
    year: 1941,
    era: '1939–1945',
    title: 'Pacific Threshold',
    region: 'Pacific · Embargo desks · Allied coordination',
    meterFamily: 'conflict',
    theaterArchetype: 'pacific',
    premise:
      'Oil embargoes, frozen assets, and fleet movements push a Pacific confrontation toward open war. You advise on whether to negotiate, tighten coercion, or prepare the public for a two-ocean fight.',
    role: 'National security advisor to a Pacific-facing democracy',
    tension:
      'Coerce a settlement without forcing a surprise you cannot absorb.',
    beats: [
      {
        id: 'hist-1941-1',
        title: 'Embargo intensity',
        briefing:
          'Energy sanctions are biting. Hawks want a total cut; traders warn of a cornered adversary.',
        stakes:
          'Maximum pressure can mean maximum desperation.',
        choices: [
          {
            id: 'hist-1941-1a',
            label: 'Tighten to a full oil cutoff',
            detail: 'No exceptions.',
            kind: 'economic',
            markerId: 'cable',
            short: 'OILOFF',
            effects: [
              { tag: 'economic_pressure', weight: 3, summary: 'Severe squeeze' },
              { tag: 'escalation', weight: 2, summary: 'Cornering risk' },
              { tag: 'credibility', weight: 1, summary: 'Resolve shown' },
            ],
          },
          {
            id: 'hist-1941-1b',
            label: 'Offer a phased oil for withdrawal deal',
            detail: 'Sequence relief with pullbacks.',
            kind: 'diplomatic',
            markerId: 'capital_a',
            short: 'PHASE',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Bargain frame' },
              { tag: 'economic_pressure', weight: -1, summary: 'Softens leverage' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Partners can sell it' },
            ],
          },
          {
            id: 'hist-1941-1c',
            label: 'Hold current sanctions; surge fleet presence',
            detail: 'Show force without new paper.',
            kind: 'naval',
            markerId: 'fleet',
            short: 'SURGE',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Visible navy' },
              { tag: 'escalation', weight: 2, summary: 'Incident risk' },
              { tag: 'market_stability', weight: -1, summary: 'Insurance spikes' },
            ],
          },
        ],
      },
      {
        id: 'hist-1941-2',
        title: 'Negotiating brief',
        briefing:
          'Envoys still talk. Your draft can demand full rollback or accept a temporary freeze in place.',
        stakes:
          'A freeze can become the new map.',
        choices: [
          {
            id: 'hist-1941-2a',
            label: 'Demand full withdrawal as precondition',
            detail: 'No partials.',
            kind: 'diplomatic',
            markerId: 'capital_b',
            short: 'FULLWD',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Hard standard' },
              { tag: 'diplomacy', weight: -2, summary: 'Talks may die' },
              { tag: 'escalation', weight: 1, summary: 'Fewer exits' },
            ],
          },
          {
            id: 'hist-1941-2b',
            label: 'Accept a freeze-in-place for six months',
            detail: 'Buy time; keep talking.',
            kind: 'diplomatic',
            markerId: 'island',
            short: 'FREEZE',
            effects: [
              { tag: 'time', weight: 2, summary: 'Window' },
              { tag: 'norm_erosion', weight: 1, summary: 'Gains linger' },
              { tag: 'escalation', weight: -1, summary: 'Pause' },
            ],
          },
          {
            id: 'hist-1941-2c',
            label: 'Link Pacific talks to European lend-lease tempo',
            detail: 'One war economy logic.',
            kind: 'political',
            markerId: 'strait',
            short: 'LINK',
            effects: [
              { tag: 'alliance_cohesion', weight: 2, summary: 'Grand strategy' },
              { tag: 'escalation', weight: 1, summary: 'Widens stakes' },
              { tag: 'domestic_support', weight: -1, summary: 'Complexity' },
            ],
          },
        ],
      },
      {
        id: 'hist-1941-3',
        title: 'Warning indicators',
        briefing:
          'Intelligence flags unusual fleet radio silence. You can disperse assets, wait for proof, or publicize a warning.',
        stakes:
          'Acting early looks alarmist; acting late looks negligent.',
        choices: [
          {
            id: 'hist-1941-3a',
            label: 'Disperse fleet and raise alert',
            detail: 'Assume the worst.',
            kind: 'naval',
            markerId: 'fleet',
            short: 'ALERT',
            effects: [
              { tag: 'deterrence', weight: 1, summary: 'Harder target' },
              { tag: 'escalation', weight: 1, summary: 'Visible prep' },
              { tag: 'credibility', weight: 1, summary: 'Prudence' },
            ],
          },
          {
            id: 'hist-1941-3b',
            label: 'Wait for confirmatory intercepts',
            detail: 'Avoid false alarm.',
            kind: 'diplomatic',
            markerId: 'cable',
            short: 'WAIT',
            effects: [
              { tag: 'time', weight: -1, summary: 'Delay' },
              { tag: 'escalation', weight: -1, summary: 'Calm optics' },
              { tag: 'credibility', weight: -1, summary: 'If wrong' },
            ],
          },
          {
            id: 'hist-1941-3c',
            label: 'Public warning to adversaries and publics',
            detail: 'Remove surprise premium.',
            kind: 'political',
            markerId: 'capital_a',
            short: 'WARN',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'On record' },
              { tag: 'escalation', weight: 2, summary: 'May accelerate' },
              { tag: 'domestic_support', weight: 1, summary: 'Prepares public' },
            ],
          },
        ],
      },
      {
        id: 'hist-1941-4',
        title: 'After the first strike',
        briefing:
          'Reports of attacks arrive. Cabinet asks for the first 48-hour package: limited retaliation, full war declaration, or coalition-first diplomacy.',
        stakes:
          'The opening response shapes a years-long war.',
        choices: [
          {
            id: 'hist-1941-4a',
            label: 'Full declaration and coalition summons',
            detail: 'Total war frame.',
            kind: 'political',
            markerId: 'capital_b',
            short: 'DECLARE',
            effects: [
              { tag: 'alliance_cohesion', weight: 3, summary: 'Coalition forms' },
              { tag: 'escalation', weight: 3, summary: 'Unlimited war' },
              { tag: 'domestic_support', weight: 2, summary: 'Unity surge' },
            ],
          },
          {
            id: 'hist-1941-4b',
            label: 'Limited retaliatory strikes only',
            detail: 'Keep options.',
            kind: 'kinetic',
            markerId: 'island',
            short: 'LIMIT',
            effects: [
              { tag: 'escalation', weight: 1, summary: 'Controlled reply' },
              { tag: 'credibility', weight: -1, summary: 'May look weak' },
              { tag: 'diplomacy', weight: 1, summary: 'Room left' },
            ],
          },
          {
            id: 'hist-1941-4c',
            label: 'Secure sea lanes before offensive action',
            detail: 'Logistics first.',
            kind: 'naval',
            markerId: 'strait',
            short: 'LANES',
            effects: [
              { tag: 'deterrence', weight: 1, summary: 'Sustainment' },
              { tag: 'time', weight: 1, summary: 'Slower revenge' },
              { tag: 'market_stability', weight: 1, summary: 'Trade arteries' },
            ],
          },
        ],
      },
      {
        id: 'hist-1941-5',
        title: 'Embargo leakage shock',
        briefing:
          'Third-party tankers and shell companies blunt your oil squeeze. Enforcement means confronting neutrals—or admitting the tool is dull.',
        stakes:
          'Sanctions fail quietly before they fail loudly.',
        choices: [
          {
            id: 'hist-1941-5a',
            label: 'Tighten end-use enforcement with neutral registries',
            detail: 'Close the leaks.',
            kind: 'economic',
            markerId: 'cable',
            short: 'LEAK',
            effects: [
              { tag: 'economic_pressure', weight: 2, summary: 'Squeeze restores' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Neutral anger' },
              { tag: 'escalation', weight: 1, summary: 'Confrontation' },
            ],
          },
          {
            id: 'hist-1941-5b',
            label: 'Offer a staged oil tranche for verified talks',
            detail: 'Conditionality with a carrot.',
            kind: 'diplomatic',
            markerId: 'capital_a',
            short: 'TRANCHE',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Bargain fuel' },
              { tag: 'economic_pressure', weight: -1, summary: 'Relief offered' },
              { tag: 'time', weight: 1, summary: 'Talks window' },
            ],
          },
          {
            id: 'hist-1941-5c',
            label: 'Ignore leakage; escalate naval presence instead',
            detail: 'Guns over customs.',
            kind: 'naval',
            markerId: 'fleet',
            short: 'PRESENCE',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Hard signal' },
              { tag: 'escalation', weight: 2, summary: 'Incident risk' },
              { tag: 'market_stability', weight: -1, summary: 'Insurance up' },
            ],
          },
        ],
      },
      {
        id: 'hist-1941-6',
        title: 'Domestic Asia-first politics',
        briefing:
          'Public opinion splits between Europe-first and Pacific revenge narratives. Your brief must pick a sequencing story.',
        stakes:
          'Strategy without a home story dies in hearings.',
        choices: [
          {
            id: 'hist-1941-6a',
            label: 'Argue Germany-first with Pacific holding actions',
            detail: 'Sequence the wars.',
            kind: 'political',
            markerId: 'capital_b',
            short: 'SEQWAR',
            effects: [
              { tag: 'alliance_cohesion', weight: 2, summary: 'Atlantic partners glad' },
              { tag: 'domestic_support', weight: -1, summary: 'Pacific hawks mad' },
              { tag: 'credibility', weight: 1, summary: 'Clear strategy' },
            ],
          },
          {
            id: 'hist-1941-6b',
            label: 'Elevate Pacific as co-equal theater immediately',
            detail: 'Two-ocean politics.',
            kind: 'political',
            markerId: 'capital_a',
            short: '2OCEAN',
            effects: [
              { tag: 'domestic_support', weight: 2, summary: 'Matches anger' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Europe worried' },
              { tag: 'deterrence', weight: 1, summary: 'Pacific focus' },
            ],
          },
          {
            id: 'hist-1941-6c',
            label: 'Keep strategy classified; sell only unity themes',
            detail: 'Ambiguity at home.',
            kind: 'civic',
            markerId: 'island',
            short: 'UNITY',
            effects: [
              { tag: 'social_calm', weight: 1, summary: 'Less faction' },
              { tag: 'credibility', weight: -1, summary: 'Opaque aims' },
              { tag: 'time', weight: 1, summary: 'Flexibility' },
            ],
          },
        ],
      },
      {
        id: 'hist-1941-7',
        title: 'Ally’s basing ask',
        briefing:
          'A partner wants emergency basing and shared codebreaking. Help deepens entanglement; refusal leaves you blind.',
        stakes:
          'Intelligence sharing is alliance glue and risk.',
        choices: [
          {
            id: 'hist-1941-7a',
            label: 'Grant temporary basing with status-of-forces rules',
            detail: 'Legalized presence.',
            kind: 'naval',
            markerId: 'island',
            short: 'BASE',
            effects: [
              { tag: 'alliance_cohesion', weight: 2, summary: 'Partner held' },
              { tag: 'deterrence', weight: 2, summary: 'Forward posture' },
              { tag: 'escalation', weight: 1, summary: 'Target value up' },
            ],
          },
          {
            id: 'hist-1941-7b',
            label: 'Share warning product only, no basing',
            detail: 'Eyes without footprint.',
            kind: 'diplomatic',
            markerId: 'cable',
            short: 'WARN',
            effects: [
              { tag: 'alliance_cohesion', weight: 1, summary: 'Useful help' },
              { tag: 'deterrence', weight: 1, summary: 'Better awareness' },
              { tag: 'time', weight: 1, summary: 'Less lock-in' },
            ],
          },
          {
            id: 'hist-1941-7c',
            label: 'Refuse until a formal treaty is ratified',
            detail: 'Politics before ops.',
            kind: 'legal',
            markerId: 'capital_b',
            short: 'TREATY',
            effects: [
              { tag: 'norm_protection', weight: 1, summary: 'Constitutional care' },
              { tag: 'alliance_cohesion', weight: -2, summary: 'Delay hurts' },
              { tag: 'time', weight: -1, summary: 'Slow' },
            ],
          },
        ],
      },
      {
        id: 'hist-1941-8',
        title: 'Indicator contradiction',
        briefing:
          'Signals suggest both a southern resource grab and a northern feint. Your fleet dispositions cannot cover every theory.',
        stakes:
          'Wrong deployment is a strategic gift.',
        choices: [
          {
            id: 'hist-1941-8a',
            label: 'Weight dispositions to the southern resource axis',
            detail: 'Protect the oil logic.',
            kind: 'naval',
            markerId: 'strait',
            short: 'SOUTH',
            effects: [
              { tag: 'deterrence', weight: 1, summary: 'Covers likely path' },
              { tag: 'escalation', weight: 1, summary: 'Concentrated risk' },
              { tag: 'credibility', weight: 1, summary: 'Clear priority' },
            ],
          },
          {
            id: 'hist-1941-8b',
            label: 'Keep a balanced but thinner screen everywhere',
            detail: 'Avoid a single wrong bet.',
            kind: 'naval',
            markerId: 'fleet',
            short: 'BALANCE',
            effects: [
              { tag: 'deterrence', weight: 1, summary: 'Presence wide' },
              { tag: 'time', weight: 1, summary: 'Flexibility' },
              { tag: 'escalation', weight: -1, summary: 'Less mass anywhere' },
            ],
          },
          {
            id: 'hist-1941-8c',
            label: 'Demand a red-team brief before moving capital ships',
            detail: 'Challenge consensus.',
            kind: 'diplomatic',
            markerId: 'capital_a',
            short: 'REDTEAM',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Better judgment' },
              { tag: 'time', weight: -1, summary: 'Decision lag' },
              { tag: 'diplomacy', weight: 1, summary: 'Process rigor' },
            ],
          },
        ],
      },
      {
        id: 'hist-1941-9',
        title: 'Negotiation last window',
        briefing:
          'A final note exchange could delay conflict—or be used as cover for a first strike. Trust is nearly gone.',
        stakes:
          'Talks under suspicion still change clocks.',
        choices: [
          {
            id: 'hist-1941-9a',
            label: 'Keep negotiators in place with a short clock',
            detail: 'Talk while watching.',
            kind: 'diplomatic',
            markerId: 'capital_b',
            short: 'CLOCK',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Channel open' },
              { tag: 'time', weight: 1, summary: 'Days bought' },
              { tag: 'credibility', weight: -1, summary: 'May be played' },
            ],
          },
          {
            id: 'hist-1941-9b',
            label: 'Suspend talks until verifiable force freezes',
            detail: 'Verification first.',
            kind: 'diplomatic',
            markerId: 'cable',
            short: 'FREEZE2',
            effects: [
              { tag: 'deterrence', weight: 1, summary: 'Safety ask' },
              { tag: 'diplomacy', weight: -1, summary: 'Talks pause' },
              { tag: 'escalation', weight: -1, summary: 'If accepted, cooler' },
            ],
          },
          {
            id: 'hist-1941-9c',
            label: 'Issue a final public warning of war if strikes occur',
            detail: 'Clarity for history and home.',
            kind: 'political',
            markerId: 'capital_a',
            short: 'WARNPUB',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Clear red line' },
              { tag: 'escalation', weight: 1, summary: 'Rhetoric heat' },
              { tag: 'domestic_support', weight: 1, summary: 'Public braced' },
            ],
          },
        ],
      },
      {
        id: 'hist-1941-10',
        title: 'After-first-strike endgame',
        briefing:
          'Whether or not the opening blow has landed, cabinet needs war aims: punishment, rollback, or unconditional surrender doctrine.',
        stakes:
          'Aims decide duration and alliances.',
        choices: [
          {
            id: 'hist-1941-10a',
            label: 'Define limited aims: halt aggression and restore status quo',
            detail: 'Finite war.',
            kind: 'political',
            markerId: 'capital_a',
            short: 'LIMIT',
            effects: [
              { tag: 'diplomacy', weight: 1, summary: 'Negotiable end' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Partners can join' },
              { tag: 'deterrence', weight: -1, summary: 'May look soft' },
            ],
          },
          {
            id: 'hist-1941-10b',
            label: 'Adopt unconditional surrender as public doctrine',
            detail: 'Total war frame.',
            kind: 'political',
            markerId: 'capital_b',
            short: 'UNCOND',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Absolute aim' },
              { tag: 'escalation', weight: 2, summary: 'Longer war' },
              { tag: 'diplomacy', weight: -2, summary: 'No early exit' },
            ],
          },
          {
            id: 'hist-1941-10c',
            label: 'Prioritize coalition-building before locking aims',
            detail: 'Partners first.',
            kind: 'diplomatic',
            markerId: 'island',
            short: 'COAL',
            effects: [
              { tag: 'alliance_cohesion', weight: 3, summary: 'Broad war' },
              { tag: 'time', weight: 1, summary: 'Coordination' },
              { tag: 'credibility', weight: -1, summary: 'Aims foggy' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'hist-1945-trinity',
    year: 1945,
    era: '1939–1945',
    title: 'Trinity Choice',
    region: 'Pacific endgame · Allied high command',
    meterFamily: 'conflict',
    theaterArchetype: 'pacific',
    premise:
      'With Germany defeated and Japan still fighting, you advise on invasion plans, blockade, Soviet entry timing, and whether to use a new weapon that will redefine warfare.',
    role: 'Senior civilian counselor to the war cabinet',
    tension:
      'End the war quickly without normalizing annihilation as ordinary policy.',
    beats: [
      {
        id: 'hist-1945-1',
        title: 'Invasion versus strangulation',
        briefing:
          'Staffs present Olympic-scale invasion casualties versus a prolonged blockade and bombardment.',
        stakes:
          'Speed and body counts trade against each other.',
        choices: [
          {
            id: 'hist-1945-1a',
            label: 'Authorize invasion planning as primary path',
            detail: 'Prepare the landing.',
            kind: 'kinetic',
            markerId: 'island',
            short: 'INVADE',
            effects: [
              { tag: 'escalation', weight: 2, summary: 'Massive campaign' },
              { tag: 'civilian_cost', weight: 2, summary: 'High toll likely' },
              { tag: 'deterrence', weight: 1, summary: 'Shows will' },
            ],
          },
          {
            id: 'hist-1945-1b',
            label: 'Prioritize blockade and precision bombardment',
            detail: 'Starve the war machine.',
            kind: 'naval',
            markerId: 'strait',
            short: 'BLOCK',
            effects: [
              { tag: 'economic_pressure', weight: 2, summary: 'Squeezes supply' },
              { tag: 'time', weight: 2, summary: 'Longer war' },
              { tag: 'civilian_cost', weight: 2, summary: 'Hunger spreads' },
            ],
          },
          {
            id: 'hist-1945-1c',
            label: 'Delay choice; maximize diplomatic surrender track',
            detail: 'Clarify emperor status terms.',
            kind: 'diplomatic',
            markerId: 'capital_a',
            short: 'TERMS',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Off-ramp language' },
              { tag: 'time', weight: 1, summary: 'Talks window' },
              { tag: 'credibility', weight: -1, summary: 'Looks soft to hawks' },
            ],
          },
        ],
      },
      {
        id: 'hist-1945-2',
        title: 'Soviet timetable',
        briefing:
          'Allies ask whether to encourage early Soviet entry into the Pacific war.',
        stakes:
          'Another front ends fighting faster—and redraws the postwar map.',
        choices: [
          {
            id: 'hist-1945-2a',
            label: 'Urge early Soviet entry',
            detail: 'Pressure from north.',
            kind: 'diplomatic',
            markerId: 'capital_b',
            short: 'SOVIET',
            effects: [
              { tag: 'escalation', weight: 1, summary: 'New front' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Coalition utility' },
              { tag: 'credibility', weight: -1, summary: 'Postwar leverage lost' },
            ],
          },
          {
            id: 'hist-1945-2b',
            label: 'Keep Soviet entry limited and late',
            detail: 'Minimize postwar claims.',
            kind: 'political',
            markerId: 'cable',
            short: 'LIMITSV',
            effects: [
              { tag: 'diplomacy', weight: 1, summary: 'Map control' },
              { tag: 'time', weight: -1, summary: 'Slower end' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Friction' },
            ],
          },
          {
            id: 'hist-1945-2c',
            label: 'Trade European concessions for Pacific restraint',
            detail: 'Grand bargain.',
            kind: 'diplomatic',
            markerId: 'fleet',
            short: 'TRADE',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Package deal' },
              { tag: 'norm_erosion', weight: 1, summary: 'Spheres logic' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'If accepted' },
            ],
          },
        ],
      },
      {
        id: 'hist-1945-3',
        title: 'Weapon decision',
        briefing:
          'Scientists confirm a usable device. Options: demonstration on empty terrain, use on a military-industrial city, or withhold while invasion prep continues.',
        stakes:
          'A demonstration may fail; use may succeed and haunt.',
        choices: [
          {
            id: 'hist-1945-3a',
            label: 'Authorize use against a military-industrial target',
            detail: 'Shock to compel surrender.',
            kind: 'kinetic',
            markerId: 'island',
            short: 'USE',
            effects: [
              { tag: 'escalation', weight: 3, summary: 'New warfare tier' },
              { tag: 'civilian_cost', weight: 3, summary: 'Mass harm' },
              { tag: 'time', weight: -2, summary: 'May end war fast' },
            ],
          },
          {
            id: 'hist-1945-3b',
            label: 'Order an observed demonstration first',
            detail: 'Prove capability without a city.',
            kind: 'diplomatic',
            markerId: 'strait',
            short: 'DEMO',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Shows power' },
              { tag: 'diplomacy', weight: 1, summary: 'Surrender space' },
              { tag: 'time', weight: 1, summary: 'If ignored, delay' },
            ],
          },
          {
            id: 'hist-1945-3c',
            label: 'Withhold; continue conventional pressure',
            detail: 'Keep the taboo intact.',
            kind: 'political',
            markerId: 'capital_a',
            short: 'WITHHOLD',
            effects: [
              { tag: 'norm_protection', weight: 3, summary: 'Taboo held' },
              { tag: 'civilian_cost', weight: 2, summary: 'Conventional toll' },
              { tag: 'time', weight: 2, summary: 'War continues' },
            ],
          },
        ],
      },
      {
        id: 'hist-1945-4',
        title: 'Surrender terms',
        briefing:
          'Tokyo probes about the throne and occupation. Maximal terms may prolong fighting; soft terms may look like wasted sacrifice.',
        stakes:
          'The end must also begin the occupation.',
        choices: [
          {
            id: 'hist-1945-4a',
            label: 'Allow conditional throne retention under occupation',
            detail: 'Institutional continuity.',
            kind: 'diplomatic',
            markerId: 'capital_b',
            short: 'THRONE',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Faster end' },
              { tag: 'domestic_support', weight: -1, summary: 'Hawks angry' },
              { tag: 'governability', weight: 2, summary: 'Occupation smoother' },
            ],
          },
          {
            id: 'hist-1945-4b',
            label: 'Insist on unconditional terms only',
            detail: 'No bargains.',
            kind: 'political',
            markerId: 'fleet',
            short: 'UNCOND',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Hard victory' },
              { tag: 'escalation', weight: 1, summary: 'May prolong' },
              { tag: 'civilian_cost', weight: 1, summary: 'More fighting' },
            ],
          },
          {
            id: 'hist-1945-4c',
            label: 'Internationalize occupation authority',
            detail: 'Share control with allies.',
            kind: 'diplomatic',
            markerId: 'cable',
            short: 'SHARE',
            effects: [
              { tag: 'alliance_cohesion', weight: 2, summary: 'Shared burden' },
              { tag: 'governability', weight: -1, summary: 'Coordination friction' },
              { tag: 'credibility', weight: 1, summary: 'Multilateral face' },
            ],
          },
        ],
      },
      {
        id: 'hist-1945-5',
        title: 'Casualty estimate shock',
        briefing:
          'Invasion planners produce numbers that stun the cabinet. Alternatives—blockade, bombardment, demonstration—carry their own moral and strategic costs.',
        stakes:
          'Arithmetic forces doctrine.',
        choices: [
          {
            id: 'hist-1945-5a',
            label: 'Order a comparative options paper with civilian effects',
            detail: 'Force a full ledger.',
            kind: 'political',
            markerId: 'capital_a',
            short: 'LEDGER2',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Serious process' },
              { tag: 'time', weight: 1, summary: 'Deliberation' },
              { tag: 'diplomacy', weight: 1, summary: 'Room for counsel' },
            ],
          },
          {
            id: 'hist-1945-5b',
            label: 'Accept invasion as baseline and accelerate preparations',
            detail: 'Commit to the costly path.',
            kind: 'kinetic',
            markerId: 'fleet',
            short: 'INVBASE',
            effects: [
              { tag: 'deterrence', weight: 1, summary: 'Conventional pressure' },
              { tag: 'civilian_cost', weight: 2, summary: 'Projected toll' },
              { tag: 'escalation', weight: 2, summary: 'Operation locks' },
            ],
          },
          {
            id: 'hist-1945-5c',
            label: 'Elevate strangulation blockade as primary',
            detail: 'Time and hunger as weapons.',
            kind: 'naval',
            markerId: 'strait',
            short: 'STRANGLE',
            effects: [
              { tag: 'economic_pressure', weight: 3, summary: 'Siege logic' },
              { tag: 'civilian_cost', weight: 3, summary: 'Famine risk' },
              { tag: 'time', weight: 2, summary: 'Slow end' },
            ],
          },
        ],
      },
      {
        id: 'hist-1945-6',
        title: 'Scientist petition politics',
        briefing:
          'Petitions urge demonstration or delay. Military secrecy boards want silence. Leaks could panic allies—or force a better debate.',
        stakes:
          'Expertise enters the war room as politics.',
        choices: [
          {
            id: 'hist-1945-6a',
            label: 'Convene a closed advisory panel including dissenters',
            detail: 'Institutionalize argument.',
            kind: 'political',
            markerId: 'capital_b',
            short: 'PANEL',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Due diligence' },
              { tag: 'time', weight: 1, summary: 'Deliberation' },
              { tag: 'norm_protection', weight: 1, summary: 'Civilian input' },
            ],
          },
          {
            id: 'hist-1945-6b',
            label: 'Suppress petitions under wartime secrecy rules',
            detail: 'Ops security first.',
            kind: 'legal',
            markerId: 'cable',
            short: 'SUPPRESS',
            effects: [
              { tag: 'deterrence', weight: 1, summary: 'Surprise preserved' },
              { tag: 'norm_erosion', weight: 2, summary: 'Speech chill' },
              { tag: 'credibility', weight: -1, summary: 'Later backlash' },
            ],
          },
          {
            id: 'hist-1945-6c',
            label: 'Leak a framed “demonstration option” to test reaction',
            detail: 'Trial balloon.',
            kind: 'civic',
            markerId: 'island',
            short: 'BALLOON',
            effects: [
              { tag: 'diplomacy', weight: 1, summary: 'Signals restraint option' },
              { tag: 'credibility', weight: -1, summary: 'Manipulation' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Allies surprised' },
            ],
          },
        ],
      },
      {
        id: 'hist-1945-7',
        title: 'Soviet timetable ask',
        briefing:
          'Allies want clarity on entry timing and occupation zones. Sharing the weapon secret could shape Yalta follow-through—or accelerate a race.',
        stakes:
          'Secrecy versus coalition management.',
        choices: [
          {
            id: 'hist-1945-7a',
            label: 'Brief the ally at leadership level only',
            detail: 'Minimal necessary share.',
            kind: 'diplomatic',
            markerId: 'capital_a',
            short: 'BRIEF2',
            effects: [
              { tag: 'alliance_cohesion', weight: 2, summary: 'Trust gesture' },
              { tag: 'diplomacy', weight: 1, summary: 'Coordination' },
              { tag: 'escalation', weight: 1, summary: 'Race risk' },
            ],
          },
          {
            id: 'hist-1945-7b',
            label: 'Keep the weapon secret; coordinate conventional only',
            detail: 'Compartments hold.',
            kind: 'political',
            markerId: 'cable',
            short: 'SECRET',
            effects: [
              { tag: 'deterrence', weight: 1, summary: 'Surprise kept' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Later resentment' },
              { tag: 'time', weight: 1, summary: 'Independent clock' },
            ],
          },
          {
            id: 'hist-1945-7c',
            label: 'Trade zone understandings for earlier Soviet entry',
            detail: 'Bargaining chip.',
            kind: 'diplomatic',
            markerId: 'capital_b',
            short: 'ZONES',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Map deal' },
              { tag: 'escalation', weight: 1, summary: 'Faster northern war' },
              { tag: 'civilian_cost', weight: 1, summary: 'More fronts' },
            ],
          },
        ],
      },
      {
        id: 'hist-1945-8',
        title: 'Targeting information fog',
        briefing:
          'Target folders mix military value, psychological shock, and civilian density. Weather and intelligence gaps remain.',
        stakes:
          'Choosing a city is choosing a doctrine.',
        choices: [
          {
            id: 'hist-1945-8a',
            label: 'Prioritize purely military-industrial nodes if feasible',
            detail: 'Narrow the moral blast.',
            kind: 'kinetic',
            markerId: 'island',
            short: 'MILNODE',
            effects: [
              { tag: 'civilian_cost', weight: -1, summary: 'Relative restraint' },
              { tag: 'deterrence', weight: 1, summary: 'Still devastating' },
              { tag: 'credibility', weight: 1, summary: 'Discrimination claim' },
            ],
          },
          {
            id: 'hist-1945-8b',
            label: 'Accept psychological-shock targeting criteria',
            detail: 'End the war faster by terror calculus.',
            kind: 'kinetic',
            markerId: 'capital_a',
            short: 'SHOCK',
            effects: [
              { tag: 'escalation', weight: 3, summary: 'Annihilation norm' },
              { tag: 'civilian_cost', weight: 3, summary: 'Mass harm' },
              { tag: 'diplomacy', weight: -1, summary: 'Postwar stain' },
            ],
          },
          {
            id: 'hist-1945-8c',
            label: 'Require a weather-and-verify abort authority',
            detail: 'Give aircrews a brake.',
            kind: 'naval',
            markerId: 'fleet',
            short: 'ABORT',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Control retained' },
              { tag: 'time', weight: 1, summary: 'May delay' },
              { tag: 'deterrence', weight: -1, summary: 'Less certainty' },
            ],
          },
        ],
      },
      {
        id: 'hist-1945-9',
        title: 'Surrender-terms window',
        briefing:
          'A clarification on emperor status might unlock capitulation—or prolong fighting if read as weakness. Your note is the off-ramp.',
        stakes:
          'Words can spare cities or lose them.',
        choices: [
          {
            id: 'hist-1945-9a',
            label: 'Clarify that the imperial institution can survive under reform',
            detail: 'Narrow dignity path.',
            kind: 'diplomatic',
            markerId: 'capital_b',
            short: 'EMPEROR',
            effects: [
              { tag: 'diplomacy', weight: 3, summary: 'Surrender likelier' },
              { tag: 'domestic_support', weight: -1, summary: 'Hardliners mad' },
              { tag: 'escalation', weight: -1, summary: 'War may end' },
            ],
          },
          {
            id: 'hist-1945-9b',
            label: 'Refuse any clarification; keep unconditional absolute',
            detail: 'No ambiguity.',
            kind: 'political',
            markerId: 'capital_a',
            short: 'ABSOLUTE',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Hard clarity' },
              { tag: 'diplomacy', weight: -2, summary: 'Harder exit' },
              { tag: 'escalation', weight: 1, summary: 'Fight continues' },
            ],
          },
          {
            id: 'hist-1945-9c',
            label: 'Offer clarification only after a demonstration shot',
            detail: 'Shock then bargain.',
            kind: 'kinetic',
            markerId: 'island',
            short: 'DEMO',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Proof of power' },
              { tag: 'civilian_cost', weight: 1, summary: 'Still a nuclear use' },
              { tag: 'diplomacy', weight: 1, summary: 'Follow-on talk' },
            ],
          },
        ],
      },
      {
        id: 'hist-1945-10',
        title: 'Post-use doctrine endgame',
        briefing:
          'Cabinet asks how to describe the weapon afterward: exclusive deterrent, international control push, or normalized tool.',
        stakes:
          'Narrative after Trinity shapes the nuclear age.',
        choices: [
          {
            id: 'hist-1945-10a',
            label: 'Propose international scientific control talks',
            detail: 'Share the burden of the genie.',
            kind: 'diplomatic',
            markerId: 'cable',
            short: 'INTLCTL',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Control agenda' },
              { tag: 'norm_protection', weight: 2, summary: 'Anti-prolif seed' },
              { tag: 'deterrence', weight: -1, summary: 'Exclusive edge softens' },
            ],
          },
          {
            id: 'hist-1945-10b',
            label: 'Keep exclusive national deterrent doctrine',
            detail: 'Monopoly as peace.',
            kind: 'political',
            markerId: 'capital_a',
            short: 'MONOPOLY',
            effects: [
              { tag: 'deterrence', weight: 3, summary: 'Unique threat' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Allies uneasy' },
              { tag: 'escalation', weight: 1, summary: 'Arms race seed' },
            ],
          },
          {
            id: 'hist-1945-10c',
            label: 'Classify nearly everything; defer doctrine a year',
            detail: 'Silence first.',
            kind: 'political',
            markerId: 'capital_b',
            short: 'DEFER',
            effects: [
              { tag: 'time', weight: 2, summary: 'Delay debate' },
              { tag: 'credibility', weight: -1, summary: 'Policy fog' },
              { tag: 'norm_erosion', weight: 1, summary: 'No public rules' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'hist-1947-radcliffe',
    year: 1947,
    era: '1945–1962',
    title: 'India Partition',
    region: 'India · Pakistan · Punjab · Bengal · Radcliffe Award',
    meterFamily: 'politics',
    theaterArchetype: 'southasia',
    premise:
      'The subcontinent is being partitioned into India and Pakistan on a compressed calendar. Boundary awards (the Radcliffe Line), refugee corridors, princely accession, and communal violence are all unresolved as sovereignty transfers. You advise the outgoing authority on sequencing that keeps two states standing without a continental massacre.',
    role: 'Partition transfer counselor',
    tension:
      'Independence now versus the time needed to draw borders, move populations, and prevent communal breakdown.',
    beats: [
      {
        id: 'hist-1947-1',
        title: 'Transfer date — Partition clock',
        briefing:
          'Congress and League leaders demand an early transfer that will birth India and Pakistan together. Administrators warn that Punjab and Bengal border forces, refugee plans, and the Radcliffe boundary award are not ready.',
        stakes:
          'A calendar for two new states can become a casualty count.',
        choices: [
          {
            id: 'hist-1947-1a',
            label: 'Hold the early date; surge boundary forces',
            detail: 'Meet politics with security.',
            kind: 'kinetic',
            markerId: 'loc',
            short: 'SURGE',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Date kept' },
              { tag: 'civilian_cost', weight: 1, summary: 'Thin prep' },
              { tag: 'escalation', weight: 1, summary: 'Force posture up' },
            ],
          },
          {
            id: 'hist-1947-1b',
            label: 'Delay transfer twelve weeks',
            detail: 'Buy admin time.',
            kind: 'political',
            markerId: 'capital_a',
            short: 'DELAY',
            effects: [
              { tag: 'time', weight: 2, summary: 'Prep window' },
              { tag: 'polarization', weight: 2, summary: 'Betrayal charges' },
              { tag: 'governability', weight: 1, summary: 'More planning' },
            ],
          },
          {
            id: 'hist-1947-1c',
            label: 'Phased transfer by province',
            detail: 'Stagger the map.',
            kind: 'diplomatic',
            markerId: 'capital_b',
            short: 'PHASE',
            effects: [
              { tag: 'governability', weight: 1, summary: 'Incremental' },
              { tag: 'polarization', weight: 1, summary: 'Uneven legitimacy' },
              { tag: 'diplomacy', weight: 1, summary: 'Negotiation space' },
            ],
          },
        ],
      },
      {
        id: 'hist-1947-2',
        title: 'Radcliffe Award leak',
        briefing:
          'Draft Partition lines for Punjab and Bengal leak early. Crowds begin moving in anticipation of ending up on the wrong side of India or Pakistan.',
        stakes:
          'Boundary information becomes migration—and massacre risk.',
        choices: [
          {
            id: 'hist-1947-2a',
            label: 'Publish the award immediately with safe-corridor plans',
            detail: 'Clarity plus logistics.',
            kind: 'civic',
            markerId: 'media',
            short: 'PUBLISH',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Transparency' },
              { tag: 'social_calm', weight: -1, summary: 'Shock' },
              { tag: 'civilian_cost', weight: -1, summary: 'Corridors help' },
            ],
          },
          {
            id: 'hist-1947-2b',
            label: 'Suppress the leak; finish quiet demarcation',
            detail: 'Control the timeline.',
            kind: 'political',
            markerId: 'valley',
            short: 'SUPPRESS',
            effects: [
              { tag: 'time', weight: 1, summary: 'Admin space' },
              { tag: 'credibility', weight: -2, summary: 'Secrecy backlash' },
              { tag: 'polarization', weight: 1, summary: 'Rumor fills gap' },
            ],
          },
          {
            id: 'hist-1947-2c',
            label: 'Open renegotiation of the worst flashpoint segments',
            detail: 'Adjust edges.',
            kind: 'diplomatic',
            markerId: 'third',
            short: 'RENEG',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Local buy-in hope' },
              { tag: 'time', weight: -1, summary: 'Delay' },
              { tag: 'escalation', weight: 1, summary: 'Everyone lobbies' },
            ],
          },
        ],
      },
      {
        id: 'hist-1947-3',
        title: 'Princely states',
        briefing:
          'A key state hesitates on accession. Arms brokers smell opportunity.',
        stakes:
          'One holdout can ignite a wider war.',
        choices: [
          {
            id: 'hist-1947-3a',
            label: 'Mediate a standstill then accession path',
            detail: 'Legal bridge.',
            kind: 'diplomatic',
            markerId: 'third',
            short: 'STAND',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Process' },
              { tag: 'escalation', weight: -1, summary: 'Cooler' },
              { tag: 'time', weight: 1, summary: 'Talks' },
            ],
          },
          {
            id: 'hist-1947-3b',
            label: 'Recognize local self-determination plebiscite',
            detail: 'Vote first.',
            kind: 'civic',
            markerId: 'media',
            short: 'PLEB',
            effects: [
              { tag: 'democratic_mandate', weight: 2, summary: 'Consent' },
              { tag: 'polarization', weight: 2, summary: 'Campaign violence risk' },
              { tag: 'time', weight: 2, summary: 'Longer limbo' },
            ],
          },
          {
            id: 'hist-1947-3c',
            label: 'Back a rapid security cordon around the capital',
            detail: 'Facts on ground.',
            kind: 'kinetic',
            markerId: 'loc',
            short: 'CORDON',
            effects: [
              { tag: 'escalation', weight: 2, summary: 'Coercion' },
              { tag: 'governability', weight: 1, summary: 'Control' },
              { tag: 'credibility', weight: -1, summary: 'Imperial echo' },
            ],
          },
        ],
      },
      {
        id: 'hist-1947-4',
        title: 'Refugee tide',
        briefing:
          'Trains and roads overflow. Food and medical capacity collapse in border belts.',
        stakes:
          'Relief is now the core state function.',
        choices: [
          {
            id: 'hist-1947-4a',
            label: 'Joint refugee corridor under neutral observers',
            detail: 'Shared logistics.',
            kind: 'civic',
            markerId: 'valley',
            short: 'CORRIDOR',
            effects: [
              { tag: 'civilian_cost', weight: -2, summary: 'Safer passage' },
              { tag: 'diplomacy', weight: 2, summary: 'Cooperation' },
              { tag: 'social_calm', weight: 1, summary: 'Some order' },
            ],
          },
          {
            id: 'hist-1947-4b',
            label: 'Unilateral relief on your side only',
            detail: 'Control what you can.',
            kind: 'political',
            markerId: 'capital_a',
            short: 'UNI',
            effects: [
              { tag: 'civilian_cost', weight: -1, summary: 'Partial help' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Blame game' },
              { tag: 'polarization', weight: 1, summary: 'Us-vs-them' },
            ],
          },
          {
            id: 'hist-1947-4c',
            label: 'Military escort priority for strategic routes only',
            detail: 'Secure arteries; accept gaps.',
            kind: 'kinetic',
            markerId: 'loc',
            short: 'ESCORT',
            effects: [
              { tag: 'escalation', weight: 1, summary: 'Armed presence' },
              { tag: 'civilian_cost', weight: 1, summary: 'Uneven protection' },
              { tag: 'governability', weight: 1, summary: 'Key roads held' },
            ],
          },
        ],
      },
      {
        id: 'hist-1947-5',
        title: 'Boundary riot cascade',
        briefing:
          'Award rumors spark killings along contested tehsils. Troops are thin; delay can mean massacres, speed can mean unjust lines.',
        stakes:
          'Maps written in blood still govern.',
        choices: [
          {
            id: 'hist-1947-5a',
            label: 'Deploy joint patrols on provisional lines only',
            detail: 'Stabilize before final ink.',
            kind: 'kinetic',
            markerId: 'loc',
            short: 'PATROL',
            effects: [
              { tag: 'civilian_cost', weight: -2, summary: 'Some protection' },
              { tag: 'escalation', weight: 1, summary: 'Force presence' },
              { tag: 'time', weight: 1, summary: 'Order first' },
            ],
          },
          {
            id: 'hist-1947-5b',
            label: 'Publish the award immediately to end rumor',
            detail: 'Certainty over perfection.',
            kind: 'political',
            markerId: 'media',
            short: 'PUBLISH',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Clear line' },
              { tag: 'polarization', weight: 2, summary: 'Instant grievance' },
              { tag: 'time', weight: -1, summary: 'No soft landing' },
            ],
          },
          {
            id: 'hist-1947-5c',
            label: 'Delay publication; flood relief and mediation teams',
            detail: 'Humanize the vacuum.',
            kind: 'civic',
            markerId: 'valley',
            short: 'RELIEF',
            effects: [
              { tag: 'civilian_cost', weight: -1, summary: 'Aid arrives' },
              { tag: 'time', weight: 2, summary: 'Delay' },
              { tag: 'credibility', weight: -1, summary: 'Uncertainty persists' },
            ],
          },
        ],
      },
      {
        id: 'hist-1947-6',
        title: 'Dominion politics at home',
        briefing:
          'London and local cabinets trade blame for speed. Your counsel can still reshape the handover calendar.',
        stakes:
          'Imperial exit timing is a moral choice with body counts.',
        choices: [
          {
            id: 'hist-1947-6a',
            label: 'Recommend a short calendar slip for security staging',
            detail: 'Days for logistics.',
            kind: 'political',
            markerId: 'third',
            short: 'SLIP',
            effects: [
              { tag: 'time', weight: 2, summary: 'Staging room' },
              { tag: 'civilian_cost', weight: -1, summary: 'Better prep' },
              { tag: 'credibility', weight: -1, summary: 'Promise broken' },
            ],
          },
          {
            id: 'hist-1947-6b',
            label: 'Hold the date; surge temporary forces instead',
            detail: 'Speed with muscle.',
            kind: 'kinetic',
            markerId: 'loc',
            short: 'SURGE',
            effects: [
              { tag: 'deterrence', weight: 1, summary: 'Order signal' },
              { tag: 'escalation', weight: 1, summary: 'Force friction' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Date kept' },
            ],
          },
          {
            id: 'hist-1947-6c',
            label: 'Push responsibility publicly onto successor cabinets',
            detail: 'Political offload.',
            kind: 'political',
            markerId: 'capital_a',
            short: 'OFFLOAD',
            effects: [
              { tag: 'credibility', weight: -2, summary: 'Blame game' },
              { tag: 'polarization', weight: 1, summary: 'Anger shifts' },
              { tag: 'governability', weight: -1, summary: 'Authority gaps' },
            ],
          },
        ],
      },
      {
        id: 'hist-1947-7',
        title: 'Princely accession ask',
        briefing:
          'A holdout state wants arms and recognition games. Intervention risks war between new dominions.',
        stakes:
          'One palace can ignite two armies.',
        choices: [
          {
            id: 'hist-1947-7a',
            label: 'Insist on popular consultation before accession',
            detail: 'People over princes.',
            kind: 'diplomatic',
            markerId: 'capital_b',
            short: 'CONSULT',
            effects: [
              { tag: 'norm_protection', weight: 2, summary: 'Consent frame' },
              { tag: 'diplomacy', weight: 1, summary: 'Process' },
              { tag: 'time', weight: -1, summary: 'Delay conflict' },
            ],
          },
          {
            id: 'hist-1947-7b',
            label: 'Broker a standstill and third-party mediation',
            detail: 'Freeze the fuse.',
            kind: 'diplomatic',
            markerId: 'third',
            short: 'STAND2',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Off-ramp' },
              { tag: 'escalation', weight: -1, summary: 'Pause' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Shared process' },
            ],
          },
          {
            id: 'hist-1947-7c',
            label: 'Quietly favor the strategically preferred accession',
            detail: 'Pick a side.',
            kind: 'political',
            markerId: 'capital_a',
            short: 'FAVOR',
            effects: [
              { tag: 'alliance_cohesion', weight: -1, summary: 'Other dominion bitter' },
              { tag: 'escalation', weight: 2, summary: 'War risk' },
              { tag: 'credibility', weight: -1, summary: 'Partial broker' },
            ],
          },
        ],
      },
      {
        id: 'hist-1947-8',
        title: 'Refugee information fog',
        briefing:
          'Casualty and flow numbers diverge by orders of magnitude. Aid allocation follows the wrong map if you guess.',
        stakes:
          'Statistics are logistics.',
        choices: [
          {
            id: 'hist-1947-8a',
            label: 'Create a joint statistical cell with both dominions',
            detail: 'Shared numbers.',
            kind: 'diplomatic',
            markerId: 'media',
            short: 'STATS',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Common facts' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Cooperation' },
              { tag: 'time', weight: -1, summary: 'Setup cost' },
            ],
          },
          {
            id: 'hist-1947-8b',
            label: 'Allocate aid on worst-case assumptions',
            detail: 'Over-prepare.',
            kind: 'civic',
            markerId: 'valley',
            short: 'WORSTAID',
            effects: [
              { tag: 'civilian_cost', weight: -2, summary: 'Coverage' },
              { tag: 'market_stability', weight: -1, summary: 'Cost spike' },
              { tag: 'credibility', weight: 1, summary: 'Duty of care' },
            ],
          },
          {
            id: 'hist-1947-8c',
            label: 'Publicize higher figures to force international help',
            detail: 'Shock diplomacy.',
            kind: 'political',
            markerId: 'third',
            short: 'SHOCK2',
            effects: [
              { tag: 'diplomacy', weight: 1, summary: 'Aid magnetism' },
              { tag: 'polarization', weight: 1, summary: 'Blame politics' },
              { tag: 'credibility', weight: -1, summary: 'If wrong' },
            ],
          },
        ],
      },
      {
        id: 'hist-1947-9',
        title: 'Corridor off-ramp',
        briefing:
          'A guarded refugee corridor proposal appears. Escorting it may look like choosing sides; refusing it accepts slaughter.',
        stakes:
          'Human corridors are political acts.',
        choices: [
          {
            id: 'hist-1947-9a',
            label: 'Authorize internationally observed corridors',
            detail: 'Protect movement.',
            kind: 'kinetic',
            markerId: 'loc',
            short: 'CORRID2',
            effects: [
              { tag: 'civilian_cost', weight: -3, summary: 'Lives saved' },
              { tag: 'escalation', weight: 1, summary: 'Escort risk' },
              { tag: 'diplomacy', weight: 1, summary: 'Humanitarian frame' },
            ],
          },
          {
            id: 'hist-1947-9b',
            label: 'Fund local escorts only; no foreign uniforms',
            detail: 'Distance optics.',
            kind: 'civic',
            markerId: 'valley',
            short: 'LOCAL',
            effects: [
              { tag: 'civilian_cost', weight: -1, summary: 'Some help' },
              { tag: 'credibility', weight: 1, summary: 'Less imperial look' },
              { tag: 'escalation', weight: -1, summary: 'Lower profile' },
            ],
          },
          {
            id: 'hist-1947-9c',
            label: 'Refuse corridors as “population engineering”',
            detail: 'Avoid owning transfers.',
            kind: 'political',
            markerId: 'capital_b',
            short: 'REFUSE',
            effects: [
              { tag: 'credibility', weight: -1, summary: 'Cold legality' },
              { tag: 'civilian_cost', weight: 3, summary: 'Exposure continues' },
              { tag: 'polarization', weight: 1, summary: 'Outrage' },
            ],
          },
        ],
      },
      {
        id: 'hist-1947-10',
        title: 'Transfer endgame',
        briefing:
          'Flags change. Your last brief sets whether remaining British authority mediates, exits clean, or retains bases.',
        stakes:
          'Exit style becomes the origin story of two states.',
        choices: [
          {
            id: 'hist-1947-10a',
            label: 'Exit cleanly; leave mediation to new dominions and UN path',
            detail: 'Full transfer.',
            kind: 'diplomatic',
            markerId: 'third',
            short: 'CLEAN',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Promise kept' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Sovereignty honored' },
              { tag: 'time', weight: 1, summary: 'Ends entanglement' },
            ],
          },
          {
            id: 'hist-1947-10b',
            label: 'Retain temporary base rights for evacuation logistics',
            detail: 'Linger for order.',
            kind: 'kinetic',
            markerId: 'loc',
            short: 'BASE2',
            effects: [
              { tag: 'civilian_cost', weight: -1, summary: 'Logistics aid' },
              { tag: 'escalation', weight: 1, summary: 'Friction' },
              { tag: 'credibility', weight: -1, summary: 'Semi-exit' },
            ],
          },
          {
            id: 'hist-1947-10c',
            label: 'Offer a standing arbitration role on unfinished disputes',
            detail: 'Remain the referee.',
            kind: 'legal',
            markerId: 'media',
            short: 'REFEREE',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Dispute channel' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Both may resent' },
              { tag: 'norm_protection', weight: 1, summary: 'Legal path' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'hist-1948-marshall',
    year: 1948,
    era: '1945–1962',
    title: 'ERP Bargain',
    region: 'Western Europe · Washington · reconstruction desks',
    meterFamily: 'economy',
    theaterArchetype: 'europe',
    premise:
      'A reconstruction package can rebuild markets—or become a Cold War loyalty test. You advise on conditionality, inclusion, and how hard to push integration.',
    role: 'Reconstruction program director',
    tension:
      'Recovery speed versus political strings that may split Europe further.',
    beats: [
      {
        id: 'hist-1948-1',
        title: 'Eligibility map',
        briefing:
          'Should aid be offered east of the new divide, knowing refusal is likely but the offer is the message?',
        stakes:
          'Inclusion theater versus bloc hardening.',
        choices: [
          {
            id: 'hist-1948-1a',
            label: 'Make a public open offer including the East',
            detail: 'Let refusal be on them.',
            kind: 'diplomatic',
            markerId: 'brussels',
            short: 'OPEN',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Inclusive frame' },
              { tag: 'polarization', weight: 1, summary: 'Bloc politics' },
              { tag: 'diplomacy', weight: 1, summary: 'Propaganda win if refused' },
            ],
          },
          {
            id: 'hist-1948-1b',
            label: 'Limit eligibility to committed partners',
            detail: 'No wasted capital.',
            kind: 'political',
            markerId: 'capital',
            short: 'LIMIT',
            effects: [
              { tag: 'alliance_cohesion', weight: 2, summary: 'Core tight' },
              { tag: 'norm_erosion', weight: 1, summary: 'Sphere logic' },
              { tag: 'market_stability', weight: 1, summary: 'Focused spend' },
            ],
          },
          {
            id: 'hist-1948-1c',
            label: 'Quiet bilateral packages only',
            detail: 'Avoid a grand design.',
            kind: 'economic',
            markerId: 'parliament',
            short: 'BILAT',
            effects: [
              { tag: 'diplomacy', weight: 1, summary: 'Flexible' },
              { tag: 'credibility', weight: -1, summary: 'No vision' },
              { tag: 'eu_cohesion', weight: -1, summary: 'Integration stalls' },
            ],
          },
        ],
      },
      {
        id: 'hist-1948-2',
        title: 'Conditionality',
        briefing:
          'Treasury wants reforms; foreign ministries want gratitude without humiliation.',
        stakes:
          'Strings can rebuild or poison.',
        choices: [
          {
            id: 'hist-1948-2a',
            label: 'Require trade liberalization milestones',
            detail: 'Markets first.',
            kind: 'economic',
            markerId: 'brussels',
            short: 'TRADE',
            effects: [
              { tag: 'market_stability', weight: 2, summary: 'Open flows' },
              { tag: 'domestic_support', weight: -1, summary: 'Local industry pain' },
              { tag: 'eu_cohesion', weight: 1, summary: 'Shared rules' },
            ],
          },
          {
            id: 'hist-1948-2b',
            label: 'Soft conditions; prioritize speed of disbursement',
            detail: 'Cash now.',
            kind: 'economic',
            markerId: 'capital',
            short: 'SPEED',
            effects: [
              { tag: 'social_calm', weight: 2, summary: 'Relief fast' },
              { tag: 'credibility', weight: -1, summary: 'Waste risk' },
              { tag: 'governability', weight: 1, summary: 'Cabinets breathe' },
            ],
          },
          {
            id: 'hist-1948-2c',
            label: 'Tie aid to defense coordination pledges',
            detail: 'Security bundle.',
            kind: 'political',
            markerId: 'ballot',
            short: 'DEFENSE',
            effects: [
              { tag: 'alliance_cohesion', weight: 2, summary: 'Security link' },
              { tag: 'escalation', weight: 1, summary: 'Bloc militarized' },
              { tag: 'diplomacy', weight: -1, summary: 'Looks like payment for bases' },
            ],
          },
        ],
      },
      {
        id: 'hist-1948-3',
        title: 'Currency and cartels',
        briefing:
          'Local elites resist breaking cartels. Your economists say recovery fails without competition.',
        stakes:
          'Reform without ownership fails.',
        choices: [
          {
            id: 'hist-1948-3a',
            label: 'Insist on anti-cartel benchmarks',
            detail: 'Hard reform.',
            kind: 'legal',
            markerId: 'parliament',
            short: 'CARTEL',
            effects: [
              { tag: 'market_stability', weight: 2, summary: 'Competition' },
              { tag: 'polarization', weight: 1, summary: 'Elite resistance' },
              { tag: 'credibility', weight: 1, summary: 'Standards' },
            ],
          },
          {
            id: 'hist-1948-3b',
            label: 'Accept gradualism with monitoring',
            detail: 'Pace with politics.',
            kind: 'diplomatic',
            markerId: 'districts',
            short: 'GRADUAL',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Buy-in' },
              { tag: 'time', weight: 1, summary: 'Slower reform' },
              { tag: 'market_stability', weight: 1, summary: 'Partial' },
            ],
          },
          {
            id: 'hist-1948-3c',
            label: 'Bypass elites via municipal projects',
            detail: 'Local visible wins.',
            kind: 'civic',
            markerId: 'streets',
            short: 'LOCAL',
            effects: [
              { tag: 'social_calm', weight: 2, summary: 'Visible rebuild' },
              { tag: 'governability', weight: -1, summary: 'Center weakened' },
              { tag: 'domestic_support', weight: 1, summary: 'Popular' },
            ],
          },
        ],
      },
      {
        id: 'hist-1948-4',
        title: 'Integration pitch',
        briefing:
          'Some partners want a customs union; others fear loss of sovereignty.',
        stakes:
          'Economics is constitution-making.',
        choices: [
          {
            id: 'hist-1948-4a',
            label: 'Champion a customs-union track',
            detail: 'Deep integration.',
            kind: 'diplomatic',
            markerId: 'brussels',
            short: 'UNION',
            effects: [
              { tag: 'eu_cohesion', weight: 3, summary: 'Integration leap' },
              { tag: 'market_stability', weight: 2, summary: 'Larger market' },
              { tag: 'domestic_support', weight: -1, summary: 'Sovereignty fears' },
            ],
          },
          {
            id: 'hist-1948-4b',
            label: 'Prefer OEEC coordination only',
            detail: 'Talk shop plus aid.',
            kind: 'political',
            markerId: 'capital',
            short: 'OEEC',
            effects: [
              { tag: 'diplomacy', weight: 1, summary: 'Light touch' },
              { tag: 'eu_cohesion', weight: -1, summary: 'Shallow' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Broad tent' },
            ],
          },
          {
            id: 'hist-1948-4c',
            label: 'Bilateral productivity missions as the brand',
            detail: 'American know-how narrative.',
            kind: 'economic',
            markerId: 'parliament',
            short: 'MISSION',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Soft power' },
              { tag: 'market_stability', weight: 1, summary: 'Technics' },
              { tag: 'eu_cohesion', weight: -1, summary: 'Less European ownership' },
            ],
          },
        ],
      },
      {
        id: 'hist-1948-5',
        title: 'Currency collapse shock',
        briefing:
          'A recipient’s soft currency free-falls. Stabilization may require painful reforms that topple coalitions.',
        stakes:
          'Aid without money doctoring can vanish into inflation.',
        choices: [
          {
            id: 'hist-1948-5a',
            label: 'Condition next tranche on a stabilization program',
            detail: 'Reform for cash.',
            kind: 'economic',
            markerId: 'brussels',
            short: 'STAB',
            effects: [
              { tag: 'market_stability', weight: 2, summary: 'Money repaired' },
              { tag: 'polarization', weight: 1, summary: 'Reform pain' },
              { tag: 'credibility', weight: 1, summary: 'Serious program' },
            ],
          },
          {
            id: 'hist-1948-5b',
            label: 'Bridge with soft conditionality for ninety days',
            detail: 'Politics first.',
            kind: 'economic',
            markerId: 'capital',
            short: 'BRIDGE2',
            effects: [
              { tag: 'alliance_cohesion', weight: 1, summary: 'Partner held' },
              { tag: 'market_stability', weight: -1, summary: 'Drift continues' },
              { tag: 'time', weight: 2, summary: 'Window' },
            ],
          },
          {
            id: 'hist-1948-5c',
            label: 'Pause disbursements until a new cabinet forms',
            detail: 'Wait for governability.',
            kind: 'political',
            markerId: 'parliament',
            short: 'PAUSE2',
            effects: [
              { tag: 'governability', weight: 1, summary: 'Incentivizes cabinet' },
              { tag: 'civilian_cost', weight: 1, summary: 'Aid gap' },
              { tag: 'diplomacy', weight: -1, summary: 'Resentment' },
            ],
          },
        ],
      },
      {
        id: 'hist-1948-6',
        title: 'Labor unrest at home and abroad',
        briefing:
          'Dock strikes threaten to block aid ships; recipient strikes protest wage freezes. Your program is on both picket lines.',
        stakes:
          'Reconstruction is class politics internationally.',
        choices: [
          {
            id: 'hist-1948-6a',
            label: 'Mediate a temporary dock truce for aid cargoes',
            detail: 'Carve out humanitarian freight.',
            kind: 'civic',
            markerId: 'streets',
            short: 'TRUCE',
            effects: [
              { tag: 'alliance_cohesion', weight: 1, summary: 'Aid flows' },
              { tag: 'social_calm', weight: 1, summary: 'Narrow peace' },
              { tag: 'time', weight: 1, summary: 'Bought weeks' },
            ],
          },
          {
            id: 'hist-1948-6b',
            label: 'Use legal injunctions to move cargoes',
            detail: 'Force the docks.',
            kind: 'legal',
            markerId: 'districts',
            short: 'INJUNCT',
            effects: [
              { tag: 'market_stability', weight: 1, summary: 'Ships move' },
              { tag: 'polarization', weight: 2, summary: 'Labor war' },
              { tag: 'norm_erosion', weight: 1, summary: 'Strike chill' },
            ],
          },
          {
            id: 'hist-1948-6c',
            label: 'Retarget aid toward food and fuel, delay industry',
            detail: 'Basics first.',
            kind: 'economic',
            markerId: 'capital',
            short: 'BASICS',
            effects: [
              { tag: 'civilian_cost', weight: -2, summary: 'Households helped' },
              { tag: 'market_stability', weight: -1, summary: 'Industry waits' },
              { tag: 'domestic_support', weight: 1, summary: 'Moral clarity' },
            ],
          },
        ],
      },
      {
        id: 'hist-1948-7',
        title: 'Ally’s strategic strings',
        briefing:
          'Defense desks want recipients to align on bases and export controls. Purely economic framing is under pressure.',
        stakes:
          'ERP can become containment by another name.',
        choices: [
          {
            id: 'hist-1948-7a',
            label: 'Keep formal conditions economic; park security in side talks',
            detail: 'Two tracks.',
            kind: 'diplomatic',
            markerId: 'brussels',
            short: '2TRACK',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Separates issues' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Defense still talked' },
              { tag: 'credibility', weight: 1, summary: 'Honest packaging' },
            ],
          },
          {
            id: 'hist-1948-7b',
            label: 'Accept explicit strategic conditionality',
            detail: 'Aid as alliance.',
            kind: 'political',
            markerId: 'parliament',
            short: 'STRAT',
            effects: [
              { tag: 'alliance_cohesion', weight: 2, summary: 'Bloc building' },
              { tag: 'polarization', weight: 1, summary: 'Left backlash' },
              { tag: 'diplomacy', weight: -1, summary: 'Neutrals flee' },
            ],
          },
          {
            id: 'hist-1948-7c',
            label: 'Refuse security strings to preserve program legitimacy',
            detail: 'Economics only.',
            kind: 'economic',
            markerId: 'capital',
            short: 'ECONONLY',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Clean brand' },
              { tag: 'alliance_cohesion', weight: -2, summary: 'Hawks angry' },
              { tag: 'market_stability', weight: 1, summary: 'Broader uptake' },
            ],
          },
        ],
      },
      {
        id: 'hist-1948-8',
        title: 'Cartel and counterpart-fund fog',
        briefing:
          'Auditors disagree whether local elites capture counterpart funds. Over-policing kills recovery; under-policing breeds scandal.',
        stakes:
          'Corruption control is a recovery instrument.',
        choices: [
          {
            id: 'hist-1948-8a',
            label: 'Impose transparent counterpart-fund boards',
            detail: 'Sunlight rules.',
            kind: 'legal',
            markerId: 'brussels',
            short: 'BOARD2',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Anti-capture' },
              { tag: 'governability', weight: 1, summary: 'Institutions' },
              { tag: 'time', weight: -1, summary: 'Setup lag' },
            ],
          },
          {
            id: 'hist-1948-8b',
            label: 'Tolerate opacity to keep investment velocity',
            detail: 'Speed over purity.',
            kind: 'economic',
            markerId: 'capital',
            short: 'VELOCITY',
            effects: [
              { tag: 'market_stability', weight: 1, summary: 'Faster spend' },
              { tag: 'credibility', weight: -2, summary: 'Scandal risk' },
              { tag: 'polarization', weight: 1, summary: 'Elite anger' },
            ],
          },
          {
            id: 'hist-1948-8c',
            label: 'Publish selective audits to deter without freezing all funds',
            detail: 'Targeted sunlight.',
            kind: 'political',
            markerId: 'parliament',
            short: 'SELAUD',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Deterrent audits' },
              { tag: 'diplomacy', weight: -1, summary: 'Named parties mad' },
              { tag: 'market_stability', weight: 1, summary: 'Most flows continue' },
            ],
          },
        ],
      },
      {
        id: 'hist-1948-9',
        title: 'Integration off-ramp',
        briefing:
          'A customs-union pitch could multiply growth—or frighten sovereignty politics. You can make ERP the midwife of integration.',
        stakes:
          'Architecture after money.',
        choices: [
          {
            id: 'hist-1948-9a',
            label: 'Tie later tranches to measurable trade liberalization',
            detail: 'Integration incentives.',
            kind: 'economic',
            markerId: 'brussels',
            short: 'LIBERAL',
            effects: [
              { tag: 'market_stability', weight: 2, summary: 'Open markets' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Shared project' },
              { tag: 'polarization', weight: 1, summary: 'Sovereignty fights' },
            ],
          },
          {
            id: 'hist-1948-9b',
            label: 'Keep aid national and defer integration politics',
            detail: 'Money without maps.',
            kind: 'political',
            markerId: 'capital',
            short: 'NATIONAL',
            effects: [
              { tag: 'governability', weight: 1, summary: 'Less EU fight' },
              { tag: 'market_stability', weight: -1, summary: 'Fragmented recovery' },
              { tag: 'eu_cohesion', weight: -1, summary: 'Slow union' },
            ],
          },
          {
            id: 'hist-1948-9c',
            label: 'Fund cross-border infrastructure first as soft integration',
            detail: 'Concrete before treaties.',
            kind: 'economic',
            markerId: 'districts',
            short: 'INFRA',
            effects: [
              { tag: 'alliance_cohesion', weight: 2, summary: 'Shared assets' },
              { tag: 'market_stability', weight: 1, summary: 'Connectivity' },
              { tag: 'time', weight: 1, summary: 'Gradualism' },
            ],
          },
        ],
      },
      {
        id: 'hist-1948-10',
        title: 'Program endgame',
        briefing:
          'Congress asks for a success metric: tons shipped, votes won, or a Europe that can stand. Your doctrine note will outlast the appropriations.',
        stakes:
          'What you measure becomes the peace.',
        choices: [
          {
            id: 'hist-1948-10a',
            label: 'Define success as self-sustaining growth within four years',
            detail: 'Exit metric.',
            kind: 'economic',
            markerId: 'brussels',
            short: 'EXITM',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Clear goal' },
              { tag: 'market_stability', weight: 1, summary: 'Growth focus' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Shared horizon' },
            ],
          },
          {
            id: 'hist-1948-10b',
            label: 'Define success as durable anti-communist coalitions',
            detail: 'Political metric.',
            kind: 'political',
            markerId: 'parliament',
            short: 'COALM',
            effects: [
              { tag: 'alliance_cohesion', weight: 2, summary: 'Bloc metric' },
              { tag: 'polarization', weight: 1, summary: 'Ideological aid' },
              { tag: 'credibility', weight: -1, summary: 'Cynical read' },
            ],
          },
          {
            id: 'hist-1948-10c',
            label: 'Refuse a single metric; publish a dashboard of tradeoffs',
            detail: 'Honest complexity.',
            kind: 'civic',
            markerId: 'ballot',
            short: 'DASH',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Transparency' },
              { tag: 'governability', weight: -1, summary: 'Harder messaging' },
              { tag: 'diplomacy', weight: 1, summary: 'Nuanced story' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'hist-1949-october',
    year: 1949,
    era: '1945–1962',
    title: 'October Mandate',
    region: 'China · Taiwan Strait · recognition desks',
    meterFamily: 'politics',
    theaterArchetype: 'pacific',
    premise:
      'A new government in Beijing forces recognition choices, trade continuity, and alliance signaling across Asia. You advise a major capital on the first ninety days.',
    role: 'Asia desk director, foreign ministry',
    tension:
      'Acknowledge facts without surrendering partners who fled the mainland.',
    beats: [
      {
        id: 'hist-1949-1',
        title: 'Recognition timing',
        briefing:
          'Do you recognize immediately, wait for peers, or maintain the old credentials?',
        stakes:
          'Recognition is a strategic act, not a notarization.',
        choices: [
          {
            id: 'hist-1949-1a',
            label: 'Recognize promptly with conditions on treaties',
            detail: 'Facts plus continuity clauses.',
            kind: 'diplomatic',
            markerId: 'capital_a',
            short: 'RECOG',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Channel opens' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Some partners angered' },
              { tag: 'credibility', weight: 1, summary: 'Realist clarity' },
            ],
          },
          {
            id: 'hist-1949-1b',
            label: 'Delay; coordinate a joint allied stance',
            detail: 'No one alone.',
            kind: 'diplomatic',
            markerId: 'capital_b',
            short: 'COORD',
            effects: [
              { tag: 'alliance_cohesion', weight: 2, summary: 'Unity' },
              { tag: 'time', weight: 1, summary: 'Wait' },
              { tag: 'diplomacy', weight: -1, summary: 'Beijing may freeze' },
            ],
          },
          {
            id: 'hist-1949-1c',
            label: 'Refuse recognition; keep old embassy fiction',
            detail: 'Non-recognition as policy.',
            kind: 'political',
            markerId: 'cable',
            short: 'REFUSE',
            effects: [
              { tag: 'alliance_cohesion', weight: 1, summary: 'With die-hards' },
              { tag: 'diplomacy', weight: -2, summary: 'No channel' },
              { tag: 'credibility', weight: -1, summary: 'Denies map' },
            ],
          },
        ],
      },
      {
        id: 'hist-1949-2',
        title: 'Trade and missionaries',
        briefing:
          'Businesses want access; security services fear technology leakage.',
        stakes:
          'Commerce without a political frame becomes a vulnerability.',
        choices: [
          {
            id: 'hist-1949-2a',
            label: 'Allow non-strategic trade under license',
            detail: 'Controlled opening.',
            kind: 'economic',
            markerId: 'strait',
            short: 'LICENSE',
            effects: [
              { tag: 'market_stability', weight: 2, summary: 'Trade resumes' },
              { tag: 'credibility', weight: 1, summary: 'Controlled' },
              { tag: 'deterrence', weight: -1, summary: 'Less isolation' },
            ],
          },
          {
            id: 'hist-1949-2b',
            label: 'Embargo until political concessions',
            detail: 'Pressure first.',
            kind: 'economic',
            markerId: 'cable',
            short: 'EMBARGO',
            effects: [
              { tag: 'economic_pressure', weight: 2, summary: 'Squeeze' },
              { tag: 'diplomacy', weight: -1, summary: 'Hardens' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'If partners cheat' },
            ],
          },
          {
            id: 'hist-1949-2c',
            label: 'Quiet humanitarian and cultural corridors only',
            detail: 'People first.',
            kind: 'civic',
            markerId: 'island',
            short: 'HUMANE',
            effects: [
              { tag: 'diplomacy', weight: 1, summary: 'Soft channel' },
              { tag: 'civilian_cost', weight: -1, summary: 'Some relief' },
              { tag: 'market_stability', weight: -1, summary: 'Commerce limited' },
            ],
          },
        ],
      },
      {
        id: 'hist-1949-3',
        title: 'Island partner',
        briefing:
          'The retreated government asks for a defense guarantee. Granting it may freeze a civil war into an international one.',
        stakes:
          'A guarantee can deter—or invite tests.',
        choices: [
          {
            id: 'hist-1949-3a',
            label: 'Issue a limited defensive guarantee',
            detail: 'Island only.',
            kind: 'diplomatic',
            markerId: 'island',
            short: 'GUARD',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Clear shield' },
              { tag: 'escalation', weight: 1, summary: 'Tripwire' },
              { tag: 'alliance_cohesion', weight: 2, summary: 'Partner held' },
            ],
          },
          {
            id: 'hist-1949-3b',
            label: 'Arms sales without a treaty',
            detail: 'Capacity, not pledge.',
            kind: 'economic',
            markerId: 'fleet',
            short: 'ARMS',
            effects: [
              { tag: 'deterrence', weight: 1, summary: 'Some teeth' },
              { tag: 'escalation', weight: 1, summary: 'Fuel' },
              { tag: 'diplomacy', weight: 1, summary: 'Ambiguity left' },
            ],
          },
          {
            id: 'hist-1949-3c',
            label: 'Encourage negotiated dual representation ideas',
            detail: 'Diplomatic creativity.',
            kind: 'diplomatic',
            markerId: 'capital_a',
            short: 'DUAL',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Forum ideas' },
              { tag: 'credibility', weight: -1, summary: 'May please none' },
              { tag: 'polarization', weight: 1, summary: 'Domestic fight' },
            ],
          },
        ],
      },
      {
        id: 'hist-1949-4',
        title: 'UN seat fight',
        briefing:
          'Credentials contests begin. Your vote will be remembered for decades.',
        stakes:
          'Procedure is power.',
        choices: [
          {
            id: 'hist-1949-4a',
            label: 'Vote to seat Beijing',
            detail: 'Match recognition to the UN.',
            kind: 'political',
            markerId: 'capital_b',
            short: 'SEAT',
            effects: [
              { tag: 'norm_protection', weight: 1, summary: 'Effective control' },
              { tag: 'alliance_cohesion', weight: -2, summary: 'Splits coalition' },
              { tag: 'diplomacy', weight: 1, summary: 'UN channel' },
            ],
          },
          {
            id: 'hist-1949-4b',
            label: 'Vote to keep the old credentials',
            detail: 'Hold the line.',
            kind: 'political',
            markerId: 'cable',
            short: 'HOLDUN',
            effects: [
              { tag: 'alliance_cohesion', weight: 1, summary: 'With non-recognizers' },
              { tag: 'credibility', weight: -1, summary: 'Fiction' },
              { tag: 'diplomacy', weight: -1, summary: 'Beijing frozen out' },
            ],
          },
          {
            id: 'hist-1949-4c',
            label: 'Push a study committee delay',
            detail: 'Kick the can.',
            kind: 'diplomatic',
            markerId: 'strait',
            short: 'STUDY',
            effects: [
              { tag: 'time', weight: 2, summary: 'Defer' },
              { tag: 'credibility', weight: -1, summary: 'Evasion' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Avoids rupture now' },
            ],
          },
        ],
      },
      {
        id: 'hist-1949-5',
        title: 'Embassy scramble shock',
        briefing:
          'Staff and archives must move as recognition realities shift. A botched evacuation becomes a hostage crisis; haste looks like betrayal of the island partner.',
        stakes:
          'Logistics is recognition policy.',
        choices: [
          {
            id: 'hist-1949-5a',
            label: 'Execute orderly drawdown with third-country custody of consular functions',
            detail: 'Managed exit.',
            kind: 'diplomatic',
            markerId: 'capital_a',
            short: 'DRAWDOWN',
            effects: [
              { tag: 'diplomacy', weight: 1, summary: 'Orderly' },
              { tag: 'civilian_cost', weight: -1, summary: 'Staff safer' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Island partner uneasy' },
            ],
          },
          {
            id: 'hist-1949-5b',
            label: 'Hold the embassy as a recognition bargaining chip',
            detail: 'Presence as leverage.',
            kind: 'political',
            markerId: 'capital_b',
            short: 'HOLDCHIP',
            effects: [
              { tag: 'diplomacy', weight: 1, summary: 'Leverage' },
              { tag: 'escalation', weight: 2, summary: 'Incident risk' },
              { tag: 'credibility', weight: -1, summary: 'Hostage optics' },
            ],
          },
          {
            id: 'hist-1949-5c',
            label: 'Split: keep a listening post, move formal mission offshore',
            detail: 'Ambiguous footprint.',
            kind: 'diplomatic',
            markerId: 'island',
            short: 'SPLIT2',
            effects: [
              { tag: 'time', weight: 2, summary: 'Flexibility' },
              { tag: 'credibility', weight: -1, summary: 'Muddy status' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Some continuity' },
            ],
          },
        ],
      },
      {
        id: 'hist-1949-6',
        title: 'China lobby at home',
        briefing:
          'Domestic factions demand you never “lose China.” Trade desks want reality. Your speech will set decades of posture.',
        stakes:
          'Home myth versus map.',
        choices: [
          {
            id: 'hist-1949-6a',
            label: 'Acknowledge mainland control without full political recognition yet',
            detail: 'Facts without blessing.',
            kind: 'political',
            markerId: 'capital_a',
            short: 'FACTS2',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Reality-based' },
              { tag: 'domestic_support', weight: -2, summary: 'Lobby fury' },
              { tag: 'diplomacy', weight: 1, summary: 'Room later' },
            ],
          },
          {
            id: 'hist-1949-6b',
            label: 'Refuse any acknowledgment; double support to the island',
            detail: 'Loyalty politics.',
            kind: 'political',
            markerId: 'island',
            short: 'LOYAL',
            effects: [
              { tag: 'alliance_cohesion', weight: 2, summary: 'Partner held' },
              { tag: 'diplomacy', weight: -2, summary: 'Mainland freeze' },
              { tag: 'domestic_support', weight: 2, summary: 'Lobby pleased' },
            ],
          },
          {
            id: 'hist-1949-6c',
            label: 'Kick the question to a bipartisan commission',
            detail: 'Delay doctrine.',
            kind: 'civic',
            markerId: 'cable',
            short: 'COMMISH2',
            effects: [
              { tag: 'time', weight: 2, summary: 'Buys months' },
              { tag: 'governability', weight: 1, summary: 'Shared ownership' },
              { tag: 'credibility', weight: -1, summary: 'Indecision' },
            ],
          },
        ],
      },
      {
        id: 'hist-1949-7',
        title: 'Ally’s UN credentials ask',
        briefing:
          'Partners want a coordinated seat strategy. Splitting the vote could isolate you—or preserve a principle.',
        stakes:
          'The UN seat is the recognition war’s cathedral.',
        choices: [
          {
            id: 'hist-1949-7a',
            label: 'Coordinate a delay-and-study credentials approach',
            detail: 'Buy time multilaterally.',
            kind: 'diplomatic',
            markerId: 'capital_b',
            short: 'CREDDEL',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Process' },
              { tag: 'time', weight: 2, summary: 'Deferred fight' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Common line' },
            ],
          },
          {
            id: 'hist-1949-7b',
            label: 'Fight to keep the island’s seat at all costs',
            detail: 'Symbolic redoubt.',
            kind: 'political',
            markerId: 'island',
            short: 'SEAT',
            effects: [
              { tag: 'alliance_cohesion', weight: 1, summary: 'Partner priority' },
              { tag: 'credibility', weight: -1, summary: 'Majority against' },
              { tag: 'polarization', weight: 1, summary: 'UN theater' },
            ],
          },
          {
            id: 'hist-1949-7c',
            label: 'Quietly prepare a dual-representation formula',
            detail: 'Creative ambiguity.',
            kind: 'diplomatic',
            markerId: 'strait',
            short: 'DUALREP',
            effects: [
              { tag: 'diplomacy', weight: 1, summary: 'Novel path' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Both may reject' },
              { tag: 'norm_protection', weight: 1, summary: 'Inclusive try' },
            ],
          },
        ],
      },
      {
        id: 'hist-1949-8',
        title: 'Trade-mission fog',
        briefing:
          'Business lobbies report informal mainland deals while your controls say otherwise. Enforcement theater versus porous reality.',
        stakes:
          'Commercial facts outrun decrees.',
        choices: [
          {
            id: 'hist-1949-8a',
            label: 'Legalize limited nonstrategic trade with reporting',
            detail: 'Regulate reality.',
            kind: 'economic',
            markerId: 'cable',
            short: 'TRADE2',
            effects: [
              { tag: 'market_stability', weight: 2, summary: 'Clear rules' },
              { tag: 'diplomacy', weight: 1, summary: 'Channel' },
              { tag: 'domestic_support', weight: -1, summary: 'Hawks mad' },
            ],
          },
          {
            id: 'hist-1949-8b',
            label: 'Tighten controls and prosecute leakers',
            detail: 'Law over leakage.',
            kind: 'legal',
            markerId: 'capital_a',
            short: 'TIGHT',
            effects: [
              { tag: 'economic_pressure', weight: 2, summary: 'Denial' },
              { tag: 'credibility', weight: 1, summary: 'Enforcement' },
              { tag: 'market_stability', weight: -1, summary: 'Friction' },
            ],
          },
          {
            id: 'hist-1949-8c',
            label: 'Look the other way while studying a new regime',
            detail: 'Ambiguous interim.',
            kind: 'political',
            markerId: 'fleet',
            short: 'LOOK',
            effects: [
              { tag: 'time', weight: 1, summary: 'Flexibility' },
              { tag: 'credibility', weight: -2, summary: 'Hypocrisy' },
              { tag: 'market_stability', weight: 1, summary: 'Deals continue' },
            ],
          },
        ],
      },
      {
        id: 'hist-1949-9',
        title: 'Strait off-ramp',
        briefing:
          'A quiet proposal: non-invasion assurances for trade contacts. Too soft abandons a partner; too hard kills the channel.',
        stakes:
          'Assurances are the new recognition.',
        choices: [
          {
            id: 'hist-1949-9a',
            label: 'Explore mutual non-use-of-force language without recognition',
            detail: 'Security without seals.',
            kind: 'diplomatic',
            markerId: 'strait',
            short: 'NUF',
            effects: [
              { tag: 'diplomacy', weight: 3, summary: 'Off-ramp' },
              { tag: 'escalation', weight: -1, summary: 'Lower heat' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Partner wary' },
            ],
          },
          {
            id: 'hist-1949-9b',
            label: 'Refuse any assurance that implies two Chinas forever',
            detail: 'One-China politics.',
            kind: 'political',
            markerId: 'capital_b',
            short: 'ONE',
            effects: [
              { tag: 'alliance_cohesion', weight: 1, summary: 'Some partners' },
              { tag: 'diplomacy', weight: -1, summary: 'Channel cools' },
              { tag: 'credibility', weight: 1, summary: 'Clear theory' },
            ],
          },
          {
            id: 'hist-1949-9c',
            label: 'Offer assurances only with verified demilitarization steps',
            detail: 'Reciprocity.',
            kind: 'naval',
            markerId: 'fleet',
            short: 'RECIP2',
            effects: [
              { tag: 'deterrence', weight: 1, summary: 'Linked to force' },
              { tag: 'diplomacy', weight: 1, summary: 'Conditional' },
              { tag: 'time', weight: 1, summary: 'Verification' },
            ],
          },
        ],
      },
      {
        id: 'hist-1949-10',
        title: 'Recognition endgame',
        briefing:
          'You must freeze a standing guidance: when, whether, and how to recognize—and what the island guarantee becomes.',
        stakes:
          'Guidance outlives cabinets.',
        choices: [
          {
            id: 'hist-1949-10a',
            label: 'Adopt “strategic ambiguity” as formal guidance',
            detail: 'Deter without clarity.',
            kind: 'diplomatic',
            markerId: 'strait',
            short: 'AMBIG',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Uncertainty as tool' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Partner not abandoned' },
              { tag: 'credibility', weight: -1, summary: 'Ambiguous pledge' },
            ],
          },
          {
            id: 'hist-1949-10b',
            label: 'Set a dated path to recognition tied to behavior tests',
            detail: 'Conditionality calendar.',
            kind: 'diplomatic',
            markerId: 'capital_a',
            short: 'PATH2',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Incentives' },
              { tag: 'time', weight: 1, summary: 'Horizon' },
              { tag: 'domestic_support', weight: -1, summary: 'Lobby fight' },
            ],
          },
          {
            id: 'hist-1949-10c',
            label: 'Lock non-recognition and a clear defense commitment to the island',
            detail: 'Hard choice.',
            kind: 'naval',
            markerId: 'island',
            short: 'LOCK',
            effects: [
              { tag: 'alliance_cohesion', weight: 2, summary: 'Partner locked' },
              { tag: 'escalation', weight: 2, summary: 'War risk' },
              { tag: 'diplomacy', weight: -2, summary: 'Mainland freeze' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'hist-1950-korea',
    year: 1950,
    era: '1945–1962',
    title: 'Parallel War',
    region: 'Korean War · UN Command · 38th Parallel combat',
    meterFamily: 'conflict',
    theaterArchetype: 'pacific',
    premise:
      'This is the Korean War theater—not the founding of two states. North Korean forces have crossed the 38th parallel; UN collective-security machinery must prove it exists. You advise on authorization, war aims, Chinese intervention risk, and whether to carry the fight north of the parallel.',
    role: 'UN coalition strategy counselor',
    tension:
      'Repel aggression and restore the parallel without turning a limited war into a continental war with China.',
    beats: [
      {
        id: 'hist-1950-1',
        title: 'First response',
        briefing:
          'Forces reeling south. Options: emergency air cover, full ground commitment, or diplomatic condemnation only.',
        stakes:
          'Hours matter more than communiqués.',
        choices: [
          {
            id: 'hist-1950-1a',
            label: 'Authorize emergency air and naval support',
            detail: 'Stabilize the perimeter.',
            kind: 'naval',
            markerId: 'fleet',
            short: 'AIRNAV',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Immediate aid' },
              { tag: 'escalation', weight: 1, summary: 'War joined' },
              { tag: 'alliance_cohesion', weight: 2, summary: 'UN acts' },
            ],
          },
          {
            id: 'hist-1950-1b',
            label: 'Full ground expedition under UN flag',
            detail: 'Commit troops.',
            kind: 'kinetic',
            markerId: 'island',
            short: 'GROUND',
            effects: [
              { tag: 'escalation', weight: 2, summary: 'Major war' },
              { tag: 'alliance_cohesion', weight: 2, summary: 'Coalition war' },
              { tag: 'civilian_cost', weight: 1, summary: 'Battlefield toll' },
            ],
          },
          {
            id: 'hist-1950-1c',
            label: 'Condemn and seek mediation first',
            detail: 'Words before armies.',
            kind: 'diplomatic',
            markerId: 'capital_a',
            short: 'MEDIATE',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Talks try' },
              { tag: 'credibility', weight: -2, summary: 'Slow' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Partner panic' },
            ],
          },
        ],
      },
      {
        id: 'hist-1950-2',
        title: 'War aims',
        briefing:
          'Some want restoration of the parallel only; others want reunification by force.',
        stakes:
          'Aims decide whether China intervenes.',
        choices: [
          {
            id: 'hist-1950-2a',
            label: 'Limit aim to restoring the status quo ante',
            detail: 'Push back to the parallel.',
            kind: 'political',
            markerId: 'strait',
            short: 'STATUS',
            effects: [
              { tag: 'escalation', weight: -1, summary: 'Limited' },
              { tag: 'credibility', weight: 1, summary: 'Clear aim' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Easier coalition' },
            ],
          },
          {
            id: 'hist-1950-2b',
            label: 'Authorize advance north for reunification',
            detail: 'End the division.',
            kind: 'kinetic',
            markerId: 'capital_b',
            short: 'NORTH',
            effects: [
              { tag: 'escalation', weight: 3, summary: 'Wider war risk' },
              { tag: 'deterrence', weight: 1, summary: 'Total victory bid' },
              { tag: 'diplomacy', weight: -2, summary: 'Neighbors alarmed' },
            ],
          },
          {
            id: 'hist-1950-2c',
            label: 'Seek a ceasefire in place wherever lines settle',
            detail: 'Freeze early.',
            kind: 'diplomatic',
            markerId: 'cable',
            short: 'FREEZE',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Stop bleeding' },
              { tag: 'credibility', weight: -1, summary: 'Aggression rewarded?' },
              { tag: 'time', weight: 1, summary: 'Talks' },
            ],
          },
        ],
      },
      {
        id: 'hist-1950-3',
        title: 'Neighbor warning',
        briefing:
          'Intelligence suggests a great-power neighbor may intervene if you approach its border.',
        stakes:
          'Ignoring the warning may be catastrophic; heeding it may forfeit initiative.',
        choices: [
          {
            id: 'hist-1950-3a',
            label: 'Halt short of the sensitive belt',
            detail: 'Geographic self-limit.',
            kind: 'diplomatic',
            markerId: 'island',
            short: 'HALT',
            effects: [
              { tag: 'escalation', weight: -2, summary: 'Reduces intervention odds' },
              { tag: 'deterrence', weight: -1, summary: 'Looks cautious' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Coalition relief' },
            ],
          },
          {
            id: 'hist-1950-3b',
            label: 'Continue; issue private reassurances of limited aims',
            detail: 'Talk while moving.',
            kind: 'diplomatic',
            markerId: 'capital_a',
            short: 'ASSURE',
            effects: [
              { tag: 'diplomacy', weight: 1, summary: 'Channel' },
              { tag: 'escalation', weight: 2, summary: 'Still advancing' },
              { tag: 'credibility', weight: 1, summary: 'Tries both' },
            ],
          },
          {
            id: 'hist-1950-3c',
            label: 'Dare the intervention; accelerate',
            detail: 'Speed as strategy.',
            kind: 'kinetic',
            markerId: 'fleet',
            short: 'DASH',
            effects: [
              { tag: 'escalation', weight: 3, summary: 'Intervention likelier' },
              { tag: 'deterrence', weight: 1, summary: 'Resolve' },
              { tag: 'civilian_cost', weight: 2, summary: 'Wider fight' },
            ],
          },
        ],
      },
      {
        id: 'hist-1950-4',
        title: 'Armistice politics',
        briefing:
          'After months of grinding war, a prisoner and border package is on the table.',
        stakes:
          'Peace can look like betrayal to those who paid.',
        choices: [
          {
            id: 'hist-1950-4a',
            label: 'Accept an armistice near the parallel',
            detail: 'Stop the meat grinder.',
            kind: 'diplomatic',
            markerId: 'strait',
            short: 'ARMIST',
            effects: [
              { tag: 'escalation', weight: -3, summary: 'Guns quiet' },
              { tag: 'credibility', weight: 1, summary: 'Limited success' },
              { tag: 'domestic_support', weight: -1, summary: 'No victory parade' },
            ],
          },
          {
            id: 'hist-1950-4b',
            label: 'Hold out for forced repatriation terms',
            detail: 'Principle over speed.',
            kind: 'political',
            markerId: 'capital_b',
            short: 'POWS',
            effects: [
              { tag: 'norm_protection', weight: 2, summary: 'Choice principle' },
              { tag: 'time', weight: 2, summary: 'War continues' },
              { tag: 'civilian_cost', weight: 1, summary: 'More losses' },
            ],
          },
          {
            id: 'hist-1950-4c',
            label: 'Threaten escalation to compel better terms',
            detail: 'Raise the shadow.',
            kind: 'kinetic',
            markerId: 'cable',
            short: 'THREAT',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Pressure' },
              { tag: 'escalation', weight: 2, summary: 'Dangerous bluff' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Partners nervous' },
            ],
          },
        ],
      },
      {
        id: 'hist-1950-5',
        title: 'Chinese warning shock',
        briefing:
          'Neighbor signals that crossing a parallel invites intervention. Your war aims speech must choose limited restoration or rollback.',
        stakes:
          'Geography is a red line written in another capital.',
        choices: [
          {
            id: 'hist-1950-5a',
            label: 'Reaffirm limited aims: restore the status quo ante',
            detail: 'Finite war.',
            kind: 'diplomatic',
            markerId: 'capital_a',
            short: 'SQA',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Limited frame' },
              { tag: 'escalation', weight: -1, summary: 'Lower intervention odds' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Coalition comfort' },
            ],
          },
          {
            id: 'hist-1950-5b',
            label: 'Authorize operational pursuit beyond the parallel',
            detail: 'Rollback.',
            kind: 'kinetic',
            markerId: 'strait',
            short: 'ROLLBACK',
            effects: [
              { tag: 'deterrence', weight: 1, summary: 'Offense' },
              { tag: 'escalation', weight: 3, summary: 'Wider war risk' },
              { tag: 'credibility', weight: 1, summary: 'Total victory frame' },
            ],
          },
          {
            id: 'hist-1950-5c',
            label: 'Pause offensives and seek a buffer demilitarized concept',
            detail: 'Geography as bargain.',
            kind: 'diplomatic',
            markerId: 'island',
            short: 'BUFFER',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Map talk' },
              { tag: 'time', weight: 1, summary: 'Pause' },
              { tag: 'domestic_support', weight: -1, summary: 'Incomplete win' },
            ],
          },
        ],
      },
      {
        id: 'hist-1950-6',
        title: 'Home casualty politics',
        briefing:
          'Lists lengthen. A draft expansion vote looms. Limited war is hard to explain at funerals.',
        stakes:
          'Democratic consent is a logistics constraint.',
        choices: [
          {
            id: 'hist-1950-6a',
            label: 'Define and broadcast clear limited objectives weekly',
            detail: 'Narrative discipline.',
            kind: 'civic',
            markerId: 'cable',
            short: 'OBJECT',
            effects: [
              { tag: 'domestic_support', weight: 1, summary: 'Clarity helps' },
              { tag: 'credibility', weight: 1, summary: 'Honest war' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Shared story' },
            ],
          },
          {
            id: 'hist-1950-6b',
            label: 'Expand the draft and ask for sacrifice without new aims',
            detail: 'More force, same speech.',
            kind: 'political',
            markerId: 'capital_b',
            short: 'DRAFT',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Manpower' },
              { tag: 'polarization', weight: 2, summary: 'Draft anger' },
              { tag: 'civilian_cost', weight: 1, summary: 'Social strain' },
            ],
          },
          {
            id: 'hist-1950-6c',
            label: 'Open an armistice track publicly to show an exit',
            detail: 'Peace politics.',
            kind: 'diplomatic',
            markerId: 'capital_a',
            short: 'ARMPUB',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Exit visible' },
              { tag: 'domestic_support', weight: 1, summary: 'Hope' },
              { tag: 'deterrence', weight: -1, summary: 'Looks eager' },
            ],
          },
        ],
      },
      {
        id: 'hist-1950-7',
        title: 'UN coalition ask',
        briefing:
          'Partners want rules on bombing, prisoners, and national caveats. Unity requires constraint.',
        stakes:
          'Coalitions fight at the speed of the most cautious capital.',
        choices: [
          {
            id: 'hist-1950-7a',
            label: 'Accept tighter targeting rules for coalition cohesion',
            detail: 'Restraint as glue.',
            kind: 'diplomatic',
            markerId: 'fleet',
            short: 'RULES',
            effects: [
              { tag: 'alliance_cohesion', weight: 3, summary: 'Partners stay' },
              { tag: 'escalation', weight: -1, summary: 'Less blast' },
              { tag: 'deterrence', weight: -1, summary: 'Reduced options' },
            ],
          },
          {
            id: 'hist-1950-7b',
            label: 'Lead with national command exceptions when needed',
            detail: 'Freedom of action.',
            kind: 'kinetic',
            markerId: 'strait',
            short: 'EXCEPT',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Flexible force' },
              { tag: 'alliance_cohesion', weight: -2, summary: 'Caveat wars' },
              { tag: 'escalation', weight: 1, summary: 'National ops' },
            ],
          },
          {
            id: 'hist-1950-7c',
            label: 'Create a coalition targeting board with vetoes',
            detail: 'Institutionalize argument.',
            kind: 'legal',
            markerId: 'cable',
            short: 'BOARD3',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Process' },
              { tag: 'time', weight: -1, summary: 'Slower strikes' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Shared ownership' },
            ],
          },
        ],
      },
      {
        id: 'hist-1950-8',
        title: 'Atrocity and POW fog',
        briefing:
          'Competing claims about prisoners and civilian deaths threaten the moral frame of a UN war.',
        stakes:
          'Information is a second front.',
        choices: [
          {
            id: 'hist-1950-8a',
            label: 'Invite ICRC-like access and publish what you can verify',
            detail: 'Transparency offensive.',
            kind: 'diplomatic',
            markerId: 'island',
            short: 'ICRC',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Moral high ground' },
              { tag: 'time', weight: 1, summary: 'Verification' },
              { tag: 'diplomacy', weight: 1, summary: 'Norms' },
            ],
          },
          {
            id: 'hist-1950-8b',
            label: 'Counter with rapid propaganda before facts settle',
            detail: 'Speed over certainty.',
            kind: 'civic',
            markerId: 'cable',
            short: 'PROP',
            effects: [
              { tag: 'polarization', weight: 1, summary: 'Info war' },
              { tag: 'credibility', weight: -2, summary: 'Risk of falsehood' },
              { tag: 'domestic_support', weight: 1, summary: 'Rally' },
            ],
          },
          {
            id: 'hist-1950-8c',
            label: 'Quietly improve camp conditions; stay silent publicly',
            detail: 'Fix first, speak later.',
            kind: 'political',
            markerId: 'capital_b',
            short: 'CAMPS',
            effects: [
              { tag: 'civilian_cost', weight: -1, summary: 'Better treatment' },
              { tag: 'credibility', weight: -1, summary: 'Silence read badly' },
              { tag: 'norm_protection', weight: 1, summary: 'Quiet compliance' },
            ],
          },
        ],
      },
      {
        id: 'hist-1950-9',
        title: 'Armistice off-ramp',
        briefing:
          'A ceasefire-in-place proposal appears. Hardliners want more ground; partners want an end.',
        stakes:
          'Stopping can look like losing.',
        choices: [
          {
            id: 'hist-1950-9a',
            label: 'Accept ceasefire-in-place with inspection machinery',
            detail: 'Lock the line.',
            kind: 'diplomatic',
            markerId: 'strait',
            short: 'CFIP',
            effects: [
              { tag: 'diplomacy', weight: 3, summary: 'War paused' },
              { tag: 'escalation', weight: -2, summary: 'Guns quiet' },
              { tag: 'domestic_support', weight: -1, summary: 'Incomplete' },
            ],
          },
          {
            id: 'hist-1950-9b',
            label: 'Demand territorial improvements before any pause',
            detail: 'Better map first.',
            kind: 'kinetic',
            markerId: 'fleet',
            short: 'BETMAP',
            effects: [
              { tag: 'escalation', weight: 2, summary: 'Fight continues' },
              { tag: 'deterrence', weight: 1, summary: 'Pressure' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Partners tire' },
            ],
          },
          {
            id: 'hist-1950-9c',
            label: 'Seek a temporary humanitarian pause only',
            detail: 'Narrow mercy.',
            kind: 'diplomatic',
            markerId: 'island',
            short: 'HUM2',
            effects: [
              { tag: 'civilian_cost', weight: -2, summary: 'Relief window' },
              { tag: 'time', weight: 1, summary: 'Days' },
              { tag: 'diplomacy', weight: 1, summary: 'Channel' },
            ],
          },
        ],
      },
      {
        id: 'hist-1950-10',
        title: 'Limited-war endgame',
        briefing:
          'You must write the doctrine: Korea as exception, template, or warning against land wars in Asia.',
        stakes:
          'Doctrine is how the next cabinet fights.',
        choices: [
          {
            id: 'hist-1950-10a',
            label: 'Codify limited-war rules and nuclear non-use thresholds',
            detail: 'Boundaries in writing.',
            kind: 'political',
            markerId: 'capital_a',
            short: 'LIMITDOC',
            effects: [
              { tag: 'norm_protection', weight: 2, summary: 'Restraints' },
              { tag: 'escalation', weight: -1, summary: 'Clearer brakes' },
              { tag: 'credibility', weight: 1, summary: 'Doctrine clarity' },
            ],
          },
          {
            id: 'hist-1950-10b',
            label: 'Treat Korea as unique; refuse general doctrine',
            detail: 'Case-by-case.',
            kind: 'political',
            markerId: 'capital_b',
            short: 'UNIQUE',
            effects: [
              { tag: 'time', weight: 1, summary: 'Flexibility' },
              { tag: 'credibility', weight: -1, summary: 'Fog for allies' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Uncertainty' },
            ],
          },
          {
            id: 'hist-1950-10c',
            label: 'Pivot resources to other theaters and accept a frozen line',
            detail: 'Strategic triage.',
            kind: 'diplomatic',
            markerId: 'cable',
            short: 'TRIAGE',
            effects: [
              { tag: 'alliance_cohesion', weight: 1, summary: 'Global balance' },
              { tag: 'diplomacy', weight: 1, summary: 'Freeze accepted' },
              { tag: 'domestic_support', weight: -1, summary: 'Abandoned feel' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'hist-1956-suez',
    year: 1956,
    era: '1945–1962',
    title: 'Canal Crisis',
    region: 'Suez · Middle East · UN · financial markets',
    meterFamily: 'conflict',
    theaterArchetype: 'redsea',
    premise:
      'Nationalization of the canal and secret war plans collide with Cold War pressures and sterling vulnerability. You advise a cabinet that can still choose law, force, or finance.',
    role: 'Cabinet crisis secretary',
    tension:
      'Imperial habits versus postwar rules—and a currency that may not survive a long fight.',
    beats: [
      {
        id: 'hist-1956-1',
        title: 'Legal versus kinetic',
        briefing:
          'Admirals want a rapid seizure plan. Lawyers want UN cover you may not get.',
        stakes:
          'Speed without legitimacy may forfeit alliances.',
        choices: [
          {
            id: 'hist-1956-1a',
            label: 'Pursue UN Users’ Association track',
            detail: 'Multilateral legal frame.',
            kind: 'diplomatic',
            markerId: 'canal',
            short: 'USERS',
            effects: [
              { tag: 'norm_protection', weight: 2, summary: 'Legal path' },
              { tag: 'time', weight: 1, summary: 'Slower' },
              { tag: 'credibility', weight: 1, summary: 'Rules story' },
            ],
          },
          {
            id: 'hist-1956-1b',
            label: 'Authorize a limited airborne-naval operation',
            detail: 'Facts on water.',
            kind: 'kinetic',
            markerId: 'chokepoint',
            short: 'SEIZE',
            effects: [
              { tag: 'escalation', weight: 3, summary: 'War opens' },
              { tag: 'deterrence', weight: 1, summary: 'Shows force' },
              { tag: 'alliance_cohesion', weight: -2, summary: 'Partners split' },
            ],
          },
          {
            id: 'hist-1956-1c',
            label: 'Freeze related financial assets first',
            detail: 'Money before marines.',
            kind: 'economic',
            markerId: 'insurer',
            short: 'FREEZE',
            effects: [
              { tag: 'economic_pressure', weight: 2, summary: 'Squeeze' },
              { tag: 'escalation', weight: -1, summary: 'Less kinetic' },
              { tag: 'market_stability', weight: -1, summary: 'Nerves' },
            ],
          },
        ],
      },
      {
        id: 'hist-1956-2',
        title: 'Collusion risk',
        briefing:
          'A partner proposes timing your move with a third party’s campaign. Intelligence deniability is thin.',
        stakes:
          'Secret coordination can become a scandal that ends cabinets.',
        choices: [
          {
            id: 'hist-1956-2a',
            label: 'Refuse collusion; keep an independent track',
            detail: 'Clean hands.',
            kind: 'diplomatic',
            markerId: 'port',
            short: 'CLEAN',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Integrity' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Partner anger' },
              { tag: 'diplomacy', weight: 1, summary: 'UN space' },
            ],
          },
          {
            id: 'hist-1956-2b',
            label: 'Accept covert coordination',
            detail: 'Synchronize.',
            kind: 'political',
            markerId: 'proxy',
            short: 'COVERT',
            effects: [
              { tag: 'escalation', weight: 2, summary: 'Wider plot' },
              { tag: 'credibility', weight: -2, summary: 'If exposed' },
              { tag: 'deterrence', weight: 1, summary: 'Operational sync' },
            ],
          },
          {
            id: 'hist-1956-2c',
            label: 'Leak the proposal to kill it',
            detail: 'Force sunlight.',
            kind: 'civic',
            markerId: 'insurer',
            short: 'LEAK',
            effects: [
              { tag: 'norm_protection', weight: 1, summary: 'Exposes scheme' },
              { tag: 'alliance_cohesion', weight: -3, summary: 'Betrayal' },
              { tag: 'polarization', weight: 2, summary: 'Political storm' },
            ],
          },
        ],
      },
      {
        id: 'hist-1956-3',
        title: 'Superpower ultimatum',
        briefing:
          'A great-power partner demands ceasefire and ties it to your currency support.',
        stakes:
          'Empire ends at the discount window.',
        choices: [
          {
            id: 'hist-1956-3a',
            label: 'Ceasefire to save the currency',
            detail: 'Finance first.',
            kind: 'economic',
            markerId: 'insurer',
            short: 'STERLING',
            effects: [
              { tag: 'market_stability', weight: 3, summary: 'Currency held' },
              { tag: 'credibility', weight: -2, summary: 'Climb-down' },
              { tag: 'escalation', weight: -2, summary: 'Fight stops' },
            ],
          },
          {
            id: 'hist-1956-3b',
            label: 'Defy and seek alternative financing',
            detail: 'Hold the course.',
            kind: 'political',
            markerId: 'port',
            short: 'DEFY',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Resolve' },
              { tag: 'market_stability', weight: -3, summary: 'Sterling crisis' },
              { tag: 'alliance_cohesion', weight: -2, summary: 'Isolation' },
            ],
          },
          {
            id: 'hist-1956-3c',
            label: 'Trade phased withdrawal for face-saving UN force',
            detail: 'Exit with cover.',
            kind: 'diplomatic',
            markerId: 'canal',
            short: 'UNFORCE',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Institutional exit' },
              { tag: 'credibility', weight: -1, summary: 'Partial loss' },
              { tag: 'norm_protection', weight: 1, summary: 'UN role' },
            ],
          },
        ],
      },
      {
        id: 'hist-1956-4',
        title: 'Aftermath doctrine',
        briefing:
          'After withdrawal, cabinets ask what Suez means for future interventions.',
        stakes:
          'Doctrine is how you lose the next time—or don’t.',
        choices: [
          {
            id: 'hist-1956-4a',
            label: 'Adopt a strict multilateral-only rule',
            detail: 'No more solo imperial wars.',
            kind: 'legal',
            markerId: 'canal',
            short: 'MULTI',
            effects: [
              { tag: 'norm_protection', weight: 2, summary: 'Rules turn' },
              { tag: 'deterrence', weight: -1, summary: 'Less freedom' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'UN-aligned' },
            ],
          },
          {
            id: 'hist-1956-4b',
            label: 'Rebuild independent expeditionary capacity',
            detail: 'Never again dependent.',
            kind: 'kinetic',
            markerId: 'escort',
            short: 'REBUILD',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Autonomy' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Distancing' },
              { tag: 'economic_pressure', weight: 1, summary: 'Costly' },
            ],
          },
          {
            id: 'hist-1956-4c',
            label: 'Pivot to economic statecraft in the region',
            detail: 'Aid and markets.',
            kind: 'economic',
            markerId: 'port',
            short: 'PIVOT',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Soft reset' },
              { tag: 'market_stability', weight: 1, summary: 'Commerce' },
              { tag: 'credibility', weight: 1, summary: 'New brand' },
            ],
          },
        ],
      },
      {
        id: 'hist-1956-5',
        title: 'Sterling crisis shock',
        briefing:
          'Reserve drains accelerate as markets price a long fight. Washington’s quiet pressure arrives with a financing ultimatum.',
        stakes:
          'Currency can end a war faster than armies.',
        choices: [
          {
            id: 'hist-1956-5a',
            label: 'Seek emergency support conditioned on a ceasefire clock',
            detail: 'Money for peace.',
            kind: 'economic',
            markerId: 'insurer',
            short: 'STERLING',
            effects: [
              { tag: 'market_stability', weight: 2, summary: 'Reserve relief' },
              { tag: 'diplomacy', weight: 2, summary: 'Ceasefire leverage' },
              { tag: 'credibility', weight: -1, summary: 'Forced climbdown' },
            ],
          },
          {
            id: 'hist-1956-5b',
            label: 'Double down militarily before finances collapse',
            detail: 'Win fast or break.',
            kind: 'kinetic',
            markerId: 'chokepoint',
            short: 'FASTWIN',
            effects: [
              { tag: 'escalation', weight: 3, summary: 'Harder fight' },
              { tag: 'market_stability', weight: -3, summary: 'Run worsens' },
              { tag: 'deterrence', weight: 1, summary: 'Force show' },
            ],
          },
          {
            id: 'hist-1956-5c',
            label: 'Float a temporary capital control package at home',
            detail: 'Buy hours.',
            kind: 'economic',
            markerId: 'canal',
            short: 'CAPCTRL',
            effects: [
              { tag: 'market_stability', weight: 1, summary: 'Temporary brake' },
              { tag: 'polarization', weight: 1, summary: 'Orthodoxy rage' },
              { tag: 'time', weight: 2, summary: 'Hours bought' },
            ],
          },
        ],
      },
      {
        id: 'hist-1956-6',
        title: 'Domestic imperial hangover',
        briefing:
          'Crowds cheer “teaching a lesson”; others call it anachronism. Your majority depends on which story you feed.',
        stakes:
          'Post-imperial identity is a war aim.',
        choices: [
          {
            id: 'hist-1956-6a',
            label: 'Frame withdrawal as rule-of-law victory if UN steps in',
            detail: 'Multilateral cover.',
            kind: 'political',
            markerId: 'port',
            short: 'UNCOVER',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Rules frame' },
              { tag: 'domestic_support', weight: -1, summary: 'Empire faction mad' },
              { tag: 'diplomacy', weight: 2, summary: 'UN path' },
            ],
          },
          {
            id: 'hist-1956-6b',
            label: 'Feed imperial pride rhetoric to hold the coalition',
            detail: 'Glory politics.',
            kind: 'civic',
            markerId: 'proxy',
            short: 'GLORY',
            effects: [
              { tag: 'domestic_support', weight: 2, summary: 'Rally' },
              { tag: 'escalation', weight: 1, summary: 'Harder exit' },
              { tag: 'alliance_cohesion', weight: -2, summary: 'US fury' },
            ],
          },
          {
            id: 'hist-1956-6c',
            label: 'Stay technocratic: shipping continuity only',
            detail: 'Narrow mission.',
            kind: 'diplomatic',
            markerId: 'escort',
            short: 'SHIPONLY',
            effects: [
              { tag: 'market_stability', weight: 2, summary: 'Lane focus' },
              { tag: 'credibility', weight: 1, summary: 'Limited aims' },
              { tag: 'domestic_support', weight: -1, summary: 'Uninspiring' },
            ],
          },
        ],
      },
      {
        id: 'hist-1956-7',
        title: 'Superpower ultimatum management',
        briefing:
          'A superpower demands withdrawal timelines. Defiance risks financial war; compliance risks alliance humiliation.',
        stakes:
          'Hierarchy inside the West becomes visible.',
        choices: [
          {
            id: 'hist-1956-7a',
            label: 'Accept a timed withdrawal with salvage of salvageable aims',
            detail: 'Climb down with schedule.',
            kind: 'diplomatic',
            markerId: 'canal',
            short: 'TIMED',
            effects: [
              { tag: 'alliance_cohesion', weight: 1, summary: 'Senior partner eased' },
              { tag: 'diplomacy', weight: 2, summary: 'Crisis cools' },
              { tag: 'credibility', weight: -1, summary: 'Humiliation' },
            ],
          },
          {
            id: 'hist-1956-7b',
            label: 'Play for more days while consolidating positions',
            detail: 'Delay compliance.',
            kind: 'kinetic',
            markerId: 'chokepoint',
            short: 'DELAY3',
            effects: [
              { tag: 'time', weight: 1, summary: 'Days' },
              { tag: 'escalation', weight: 2, summary: 'Friction' },
              { tag: 'market_stability', weight: -2, summary: 'Pressure continues' },
            ],
          },
          {
            id: 'hist-1956-7c',
            label: 'Threaten independent European financial arrangements',
            detail: 'Defiance via money.',
            kind: 'economic',
            markerId: 'insurer',
            short: 'EURO$',
            effects: [
              { tag: 'alliance_cohesion', weight: -3, summary: 'Transatlantic split' },
              { tag: 'credibility', weight: 1, summary: 'Autonomy show' },
              { tag: 'market_stability', weight: -1, summary: 'Uncertainty' },
            ],
          },
        ],
      },
      {
        id: 'hist-1956-8',
        title: 'Collusion document fog',
        briefing:
          'Allegations of prearranged scenarios leak. Denials collide with timelines. Your legal and political exposure rises together.',
        stakes:
          'Secrecy debts come due mid-crisis.',
        choices: [
          {
            id: 'hist-1956-8a',
            label: 'Authorize a narrow internal inquiry with classified findings',
            detail: 'Containment of truth.',
            kind: 'legal',
            markerId: 'port',
            short: 'INQ2',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Some process' },
              { tag: 'norm_protection', weight: 1, summary: 'Inquiry exists' },
              { tag: 'time', weight: 1, summary: 'Slows bleed' },
            ],
          },
          {
            id: 'hist-1956-8b',
            label: 'Issue categorical public denials',
            detail: 'Hold the line.',
            kind: 'political',
            markerId: 'proxy',
            short: 'DENY',
            effects: [
              { tag: 'domestic_support', weight: 1, summary: 'If believed' },
              { tag: 'credibility', weight: -2, summary: 'If proven false' },
              { tag: 'polarization', weight: 1, summary: 'Trust fracture' },
            ],
          },
          {
            id: 'hist-1956-8c',
            label: 'Quietly prepare a partial admission with ally coordination',
            detail: 'Controlled disclosure.',
            kind: 'diplomatic',
            markerId: 'escort',
            short: 'ADMIT',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Honesty bet' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Partner exposure' },
              { tag: 'diplomacy', weight: 1, summary: 'Reset chance' },
            ],
          },
        ],
      },
      {
        id: 'hist-1956-9',
        title: 'UN force off-ramp',
        briefing:
          'A peacekeeping concept could cover withdrawal without total narrative defeat—if you accept constraints on future unilateralism.',
        stakes:
          'Blue helmets as face-saving architecture.',
        choices: [
          {
            id: 'hist-1956-9a',
            label: 'Champion a UN emergency force and exit under it',
            detail: 'Institutional ladder down.',
            kind: 'diplomatic',
            markerId: 'canal',
            short: 'UNEF',
            effects: [
              { tag: 'diplomacy', weight: 3, summary: 'Multilateral exit' },
              { tag: 'escalation', weight: -2, summary: 'War winds down' },
              { tag: 'credibility', weight: 1, summary: 'Rules turn' },
            ],
          },
          {
            id: 'hist-1956-9b',
            label: 'Accept UN observers only; keep national enclaves',
            detail: 'Half measure.',
            kind: 'naval',
            markerId: 'port',
            short: 'OBS3',
            effects: [
              { tag: 'deterrence', weight: 1, summary: 'Footprint remains' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Suspicion' },
              { tag: 'diplomacy', weight: 1, summary: 'Partial' },
            ],
          },
          {
            id: 'hist-1956-9c',
            label: 'Reject UN cover as infringement on sovereign action',
            detail: 'Go it alone.',
            kind: 'political',
            markerId: 'chokepoint',
            short: 'REJECT',
            effects: [
              { tag: 'credibility', weight: -1, summary: 'Isolation' },
              { tag: 'escalation', weight: 1, summary: 'Continues' },
              { tag: 'alliance_cohesion', weight: -2, summary: 'West split' },
            ],
          },
        ],
      },
      {
        id: 'hist-1956-10',
        title: 'Doctrine endgame',
        briefing:
          'Cabinet wants a post-Suez rule: when force may seize strategic infrastructure, and when finance vetoes strategy.',
        stakes:
          'The lesson memo becomes grand strategy.',
        choices: [
          {
            id: 'hist-1956-10a',
            label: 'Codify no major op without reserve-currency clearance',
            detail: 'Finance as brake.',
            kind: 'economic',
            markerId: 'insurer',
            short: 'FINBRAKE',
            effects: [
              { tag: 'market_stability', weight: 2, summary: 'Money realism' },
              { tag: 'credibility', weight: 1, summary: 'Learned limit' },
              { tag: 'deterrence', weight: -1, summary: 'Less free hand' },
            ],
          },
          {
            id: 'hist-1956-10b',
            label: 'Reaffirm unilateral rights over vital lanes',
            detail: 'Suez as doctrine, not error.',
            kind: 'naval',
            markerId: 'escort',
            short: 'LANERIT',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Hard claim' },
              { tag: 'alliance_cohesion', weight: -2, summary: 'Partners alarmed' },
              { tag: 'escalation', weight: 1, summary: 'Future fights' },
            ],
          },
          {
            id: 'hist-1956-10c',
            label: 'Pivot to alliance consultation mandates before force',
            detail: 'Never alone again.',
            kind: 'diplomatic',
            markerId: 'canal',
            short: 'CONSULT2',
            effects: [
              { tag: 'alliance_cohesion', weight: 3, summary: 'Process glue' },
              { tag: 'diplomacy', weight: 1, summary: 'Multilateral habit' },
              { tag: 'time', weight: -1, summary: 'Slower wars' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'hist-1962-cuba',
    year: 1962,
    era: '1962–1979',
    title: 'Thirteen Days',
    region: 'Caribbean · Atlantic · nuclear command',
    meterFamily: 'conflict',
    theaterArchetype: 'americas',
    premise:
      'Nuclear missiles appear offshore. You advise an executive on blockade, strike, bargain, and how to keep allies and adversaries from misreading a single move as general war.',
    role: 'Executive committee counselor',
    tension:
      'Remove the missiles without a nuclear exchange.',
    beats: [
      {
        id: 'hist-1962-1',
        title: 'Opening move',
        briefing:
          'Options: surgical air strike, naval quarantine, or secret diplomacy first.',
        stakes:
          'The first public act sets the escalation ladder.',
        choices: [
          {
            id: 'hist-1962-1a',
            label: 'Announce a naval quarantine',
            detail: 'Interdict military shipments.',
            kind: 'naval',
            markerId: 'port',
            short: 'QUARANT',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Draws a line' },
              { tag: 'escalation', weight: 1, summary: 'Sea confrontation' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Allies can join' },
            ],
          },
          {
            id: 'hist-1962-1b',
            label: 'Authorize a surprise strike on sites',
            detail: 'Facts before talks.',
            kind: 'kinetic',
            markerId: 'plaza',
            short: 'STRIKE',
            effects: [
              { tag: 'escalation', weight: 3, summary: 'War risk' },
              { tag: 'deterrence', weight: 2, summary: 'Removes hardware' },
              { tag: 'diplomacy', weight: -3, summary: 'Talks poisoned' },
            ],
          },
          {
            id: 'hist-1962-1c',
            label: 'Open a secret channel before any public act',
            detail: 'Probe a trade.',
            kind: 'diplomatic',
            markerId: 'capital',
            short: 'SECRET',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Off-ramp' },
              { tag: 'time', weight: -1, summary: 'Missiles mature' },
              { tag: 'credibility', weight: -1, summary: 'If leaks as weakness' },
            ],
          },
        ],
      },
      {
        id: 'hist-1962-2',
        title: 'Alliance management',
        briefing:
          'Partners demand consultation; some want toughness, others dread cities as hostages.',
        stakes:
          'NATO solidarity is a second theater.',
        choices: [
          {
            id: 'hist-1962-2a',
            label: 'Full briefing and shared quarantine rules',
            detail: 'Coalition ownership.',
            kind: 'diplomatic',
            markerId: 'imf',
            short: 'BRIEF',
            effects: [
              { tag: 'alliance_cohesion', weight: 3, summary: 'Shared ops' },
              { tag: 'credibility', weight: 1, summary: 'Transparent' },
              { tag: 'time', weight: 1, summary: 'Coordination cost' },
            ],
          },
          {
            id: 'hist-1962-2b',
            label: 'Inform after decisions are set',
            detail: 'Speed over process.',
            kind: 'political',
            markerId: 'capital',
            short: 'AFTER',
            effects: [
              { tag: 'time', weight: -1, summary: 'Faster' },
              { tag: 'alliance_cohesion', weight: -2, summary: 'Resentment' },
              { tag: 'deterrence', weight: 1, summary: 'Unity of command' },
            ],
          },
          {
            id: 'hist-1962-2c',
            label: 'Offer a European missile trade discussion privately',
            detail: 'Link theaters.',
            kind: 'diplomatic',
            markerId: 'court',
            short: 'LINK',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Bargain space' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Host nations uneasy' },
              { tag: 'escalation', weight: -1, summary: 'Trade possible' },
            ],
          },
        ],
      },
      {
        id: 'hist-1962-3',
        title: 'Ship challenge',
        briefing:
          'A freighter approaches the line. Boarding may spark war; waving it through may unravel the quarantine.',
        stakes:
          'A single hull is now strategic.',
        choices: [
          {
            id: 'hist-1962-3a',
            label: 'Board and inspect',
            detail: 'Enforce the line.',
            kind: 'naval',
            markerId: 'port',
            short: 'BOARD',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Line real' },
              { tag: 'escalation', weight: 2, summary: 'Incident risk' },
              { tag: 'deterrence', weight: 2, summary: 'Shown' },
            ],
          },
          {
            id: 'hist-1962-3b',
            label: 'Shadow but do not board yet',
            detail: 'Buy hours for cables.',
            kind: 'naval',
            markerId: 'farm',
            short: 'SHADOW',
            effects: [
              { tag: 'time', weight: 1, summary: 'Space' },
              { tag: 'credibility', weight: -1, summary: 'Looks soft' },
              { tag: 'diplomacy', weight: 1, summary: 'Room for deal' },
            ],
          },
          {
            id: 'hist-1962-3c',
            label: 'Publicly divert via warning shots doctrine',
            detail: 'Signal without seizure.',
            kind: 'kinetic',
            markerId: 'plaza',
            short: 'WARN',
            effects: [
              { tag: 'deterrence', weight: 1, summary: 'Signal' },
              { tag: 'escalation', weight: 1, summary: 'Dangerous' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Visible resolve' },
            ],
          },
        ],
      },
      {
        id: 'hist-1962-4',
        title: 'Trade package',
        briefing:
          'A deal shape appears: withdraw missiles for a no-invasion pledge—and maybe a quiet reciprocal removal elsewhere.',
        stakes:
          'Public victory versus private symmetry.',
        choices: [
          {
            id: 'hist-1962-4a',
            label: 'Accept public pledge; keep reciprocal removal secret',
            detail: 'Dual track.',
            kind: 'diplomatic',
            markerId: 'capital',
            short: 'DUAL',
            effects: [
              { tag: 'diplomacy', weight: 3, summary: 'Crisis ends' },
              { tag: 'credibility', weight: 1, summary: 'Public win' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'If secret later leaks' },
            ],
          },
          {
            id: 'hist-1962-4b',
            label: 'Demand public symmetry on all removals',
            detail: 'No secret trades.',
            kind: 'political',
            markerId: 'court',
            short: 'PUBLIC',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Transparency' },
              { tag: 'diplomacy', weight: -1, summary: 'Harder yes' },
              { tag: 'escalation', weight: 1, summary: 'Deal may fail' },
            ],
          },
          {
            id: 'hist-1962-4c',
            label: 'Reject; prepare strike while quarantine holds',
            detail: 'Force the removal.',
            kind: 'kinetic',
            markerId: 'plaza',
            short: 'REJECT',
            effects: [
              { tag: 'escalation', weight: 3, summary: 'War nearer' },
              { tag: 'deterrence', weight: 1, summary: 'Pressure' },
              { tag: 'diplomacy', weight: -2, summary: 'Channel burns' },
            ],
          },
        ],
      },
      {
        id: 'hist-1962-5',
        title: 'U-2 shootdown shock',
        briefing:
          'A reconnaissance aircraft is lost. Military demands retaliation; diplomats fear the escalation ladder has only one rung left.',
        stakes:
          'A single loss can force the irrevocable.',
        choices: [
          {
            id: 'hist-1962-5a',
            label: 'Absorb the loss; tighten rules, do not retaliate yet',
            detail: 'Hold the ladder.',
            kind: 'diplomatic',
            markerId: 'capital',
            short: 'ABSORB2',
            effects: [
              { tag: 'escalation', weight: -2, summary: 'Brake' },
              { tag: 'diplomacy', weight: 2, summary: 'Talks survive' },
              { tag: 'domestic_support', weight: -1, summary: 'Looks weak' },
            ],
          },
          {
            id: 'hist-1962-5b',
            label: 'Authorize a limited strike on the responsible site',
            detail: 'Punish and risk.',
            kind: 'kinetic',
            markerId: 'plaza',
            short: 'PUNISH',
            effects: [
              { tag: 'escalation', weight: 3, summary: 'Ladder climbs' },
              { tag: 'deterrence', weight: 2, summary: 'Cost imposed' },
              { tag: 'diplomacy', weight: -2, summary: 'Talks may die' },
            ],
          },
          {
            id: 'hist-1962-5c',
            label: 'Pause flights; rely on other intelligence for 48 hours',
            detail: 'Blind briefly to live.',
            kind: 'political',
            markerId: 'court',
            short: 'PAUSE3',
            effects: [
              { tag: 'time', weight: 2, summary: 'Cooling' },
              { tag: 'deterrence', weight: -1, summary: 'Less awareness' },
              { tag: 'credibility', weight: 1, summary: 'Controlled risk' },
            ],
          },
        ],
      },
      {
        id: 'hist-1962-6',
        title: 'Domestic hawk pressure',
        briefing:
          'Senators demand invasion. Leaks portray quarantine as weakness. Your ExComm cohesion frays in public.',
        stakes:
          'Democracy’s noise is part of the nuclear crisis.',
        choices: [
          {
            id: 'hist-1962-6a',
            label: 'Brief select leaders under secrecy to hold the line',
            detail: 'Bipartisan quiet.',
            kind: 'political',
            markerId: 'capital',
            short: 'BRIEF3',
            effects: [
              { tag: 'governability', weight: 2, summary: 'Elite buy-in' },
              { tag: 'domestic_support', weight: 1, summary: 'Managed' },
              { tag: 'norm_protection', weight: 1, summary: 'Process' },
            ],
          },
          {
            id: 'hist-1962-6b',
            label: 'Harden public rhetoric while keeping private diplomacy',
            detail: 'Two-level game.',
            kind: 'civic',
            markerId: 'plaza',
            short: 'RHETOR',
            effects: [
              { tag: 'domestic_support', weight: 2, summary: 'Resolve optics' },
              { tag: 'escalation', weight: 1, summary: 'Heat' },
              { tag: 'diplomacy', weight: 1, summary: 'Private track' },
            ],
          },
          {
            id: 'hist-1962-6c',
            label: 'Threaten resignations to force cabinet unity',
            detail: 'Personal leverage.',
            kind: 'political',
            markerId: 'court',
            short: 'RESIGN',
            effects: [
              { tag: 'governability', weight: 1, summary: 'If it works' },
              { tag: 'polarization', weight: 1, summary: 'Drama' },
              { tag: 'credibility', weight: -1, summary: 'Instability show' },
            ],
          },
        ],
      },
      {
        id: 'hist-1962-7',
        title: 'Ally consultation gap',
        briefing:
          'NATO capitals want voice before any air strike. Speed argues against it; legitimacy argues for it.',
        stakes:
          'Alliance process versus nuclear minutes.',
        choices: [
          {
            id: 'hist-1962-7a',
            label: 'Hold an emergency council brief before new kinetic steps',
            detail: 'Legitimacy first.',
            kind: 'diplomatic',
            markerId: 'imf',
            short: 'NATO',
            effects: [
              { tag: 'alliance_cohesion', weight: 3, summary: 'Partners included' },
              { tag: 'time', weight: -1, summary: 'Hours spent' },
              { tag: 'diplomacy', weight: 1, summary: 'Shared ownership' },
            ],
          },
          {
            id: 'hist-1962-7b',
            label: 'Inform after decisions; protect operational surprise',
            detail: 'Speed first.',
            kind: 'political',
            markerId: 'capital',
            short: 'AFTER',
            effects: [
              { tag: 'deterrence', weight: 1, summary: 'Surprise' },
              { tag: 'alliance_cohesion', weight: -2, summary: 'Anger' },
              { tag: 'time', weight: 1, summary: 'Faster' },
            ],
          },
          {
            id: 'hist-1962-7c',
            label: 'Offer allies a veto only on invasion, not quarantine',
            detail: 'Split authorities.',
            kind: 'diplomatic',
            markerId: 'port',
            short: 'SPLITV',
            effects: [
              { tag: 'alliance_cohesion', weight: 1, summary: 'Partial voice' },
              { tag: 'escalation', weight: -1, summary: 'Invasion braked' },
              { tag: 'credibility', weight: 1, summary: 'Clear lanes' },
            ],
          },
        ],
      },
      {
        id: 'hist-1962-8',
        title: 'Message channel fog',
        briefing:
          'Formal notes and informal back channels disagree on withdrawal sequencing and Jupiter trade language. Misreading either could end cities.',
        stakes:
          'Ambiguity is both tool and trap.',
        choices: [
          {
            id: 'hist-1962-8a',
            label: 'Require identical text across public and private tracks',
            detail: 'One message.',
            kind: 'diplomatic',
            markerId: 'capital',
            short: 'ONETEXT',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Clarity' },
              { tag: 'diplomacy', weight: 1, summary: 'Less confusion' },
              { tag: 'time', weight: -1, summary: 'Harder drafting' },
            ],
          },
          {
            id: 'hist-1962-8b',
            label: 'Keep a secret Jupiter trade while denying it publicly',
            detail: 'Classic bargain.',
            kind: 'diplomatic',
            markerId: 'imf',
            short: 'JUPITER',
            effects: [
              { tag: 'diplomacy', weight: 3, summary: 'Deal space' },
              { tag: 'credibility', weight: -1, summary: 'Dual track' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Host ally unbriefed' },
            ],
          },
          {
            id: 'hist-1962-8c',
            label: 'Slow all replies until a single ExComm draft is locked',
            detail: 'No freelance cables.',
            kind: 'political',
            markerId: 'court',
            short: 'LOCKMSG',
            effects: [
              { tag: 'governability', weight: 1, summary: 'Control' },
              { tag: 'time', weight: -1, summary: 'Lag' },
              { tag: 'escalation', weight: -1, summary: 'Fewer accidents' },
            ],
          },
        ],
      },
      {
        id: 'hist-1962-9',
        title: 'Inspection off-ramp',
        briefing:
          'A withdrawal-for-assurance package needs verification without humiliation. UN or Red Cross roles are on the table.',
        stakes:
          'Verification is the peace.',
        choices: [
          {
            id: 'hist-1962-9a',
            label: 'Accept UN-led verification with no occupation optics',
            detail: 'Multilateral eyes.',
            kind: 'diplomatic',
            markerId: 'port',
            short: 'UNEYES',
            effects: [
              { tag: 'diplomacy', weight: 3, summary: 'Deal workable' },
              { tag: 'escalation', weight: -2, summary: 'Ladder down' },
              { tag: 'credibility', weight: 1, summary: 'Process' },
            ],
          },
          {
            id: 'hist-1962-9b',
            label: 'Demand US aerial verification rights explicitly',
            detail: 'National eyes.',
            kind: 'naval',
            markerId: 'farm',
            short: 'USAIR',
            effects: [
              { tag: 'deterrence', weight: 1, summary: 'Assurance' },
              { tag: 'diplomacy', weight: -1, summary: 'Harder accept' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Some cheer' },
            ],
          },
          {
            id: 'hist-1962-9c',
            label: 'Trade a public non-invasion pledge for verified removal',
            detail: 'Grand bargain.',
            kind: 'diplomatic',
            markerId: 'capital',
            short: 'PLEDGE',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Core swap' },
              { tag: 'escalation', weight: -2, summary: 'De-escalates' },
              { tag: 'domestic_support', weight: -1, summary: 'Pledge politics' },
            ],
          },
        ],
      },
      {
        id: 'hist-1962-10',
        title: 'Nuclear crisis endgame',
        briefing:
          'Missiles move—or don’t. You must set standing rules for quarantine, hotlines, and alliance notices for the next crisis.',
        stakes:
          'Institutions after the brink.',
        choices: [
          {
            id: 'hist-1962-10a',
            label: 'Institutionalize a direct leader hotline and notice rules',
            detail: 'Plumbing for peace.',
            kind: 'diplomatic',
            markerId: 'capital',
            short: 'HOTLINE',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Crisis pipes' },
              { tag: 'escalation', weight: -1, summary: 'Fewer accidents' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Predictability' },
            ],
          },
          {
            id: 'hist-1962-10b',
            label: 'Keep ad hoc ExComm as the model; avoid new bureaucracy',
            detail: 'Flexibility doctrine.',
            kind: 'political',
            markerId: 'court',
            short: 'ADHOC',
            effects: [
              { tag: 'time', weight: 1, summary: 'Agile' },
              { tag: 'credibility', weight: -1, summary: 'No standing rules' },
              { tag: 'governability', weight: 1, summary: 'Leader-centric' },
            ],
          },
          {
            id: 'hist-1962-10c',
            label: 'Publicly frame quarantine as a precedent for future blockades',
            detail: 'Doctrine expansion.',
            kind: 'naval',
            markerId: 'port',
            short: 'PRECED2',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Tool normalized' },
              { tag: 'escalation', weight: 1, summary: 'Future uses' },
              { tag: 'diplomacy', weight: -1, summary: 'Legal fights' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'hist-1968-prague',
    year: 1968,
    era: '1962–1979',
    title: 'Prague Spring Desk',
    region: 'Czechoslovakia · Warsaw Pact · Western capitals',
    meterFamily: 'politics',
    theaterArchetype: 'europe',
    premise:
      'Reform in Prague triggers alliance intervention threats. You advise a Western cabinet on signaling, refugees, and whether any help crosses the line into direct confrontation.',
    role: 'European security director',
    tension:
      'Moral support without a NATO–Warsaw war.',
    beats: [
      {
        id: 'hist-1968-1',
        title: 'Public posture',
        briefing:
          'Reformers want loud solidarity. Your military warns that loudness without force is cruelty.',
        stakes:
          'Words create expectations you may not meet.',
        choices: [
          {
            id: 'hist-1968-1a',
            label: 'Loud political solidarity; no military hints',
            detail: 'Voice without tripwire.',
            kind: 'political',
            markerId: 'brussels',
            short: 'VOICE',
            effects: [
              { tag: 'norm_protection', weight: 2, summary: 'Names reform' },
              { tag: 'credibility', weight: -1, summary: 'No teeth' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'West speaks' },
            ],
          },
          {
            id: 'hist-1968-1b',
            label: 'Quiet channel urging restraint to Moscow',
            detail: 'Private diplomacy.',
            kind: 'diplomatic',
            markerId: 'capital',
            short: 'QUIET',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Channel' },
              { tag: 'credibility', weight: -1, summary: 'Public silence' },
              { tag: 'escalation', weight: -1, summary: 'Lower heat' },
            ],
          },
          {
            id: 'hist-1968-1c',
            label: 'Hint at economic costs for intervention',
            detail: 'Sanctions shadow.',
            kind: 'economic',
            markerId: 'parliament',
            short: 'COST',
            effects: [
              { tag: 'economic_pressure', weight: 1, summary: 'Warning' },
              { tag: 'escalation', weight: 1, summary: 'May harden' },
              { tag: 'deterrence', weight: 1, summary: 'Some price' },
            ],
          },
        ],
      },
      {
        id: 'hist-1968-2',
        title: 'Intervention night',
        briefing:
          'Tanks cross. Refugees head west. Allies ask for an emergency meeting.',
        stakes:
          'The map just changed; your doctrine must answer.',
        choices: [
          {
            id: 'hist-1968-2a',
            label: 'Emergency NATO consult; raise alert carefully',
            detail: 'Alliance theater.',
            kind: 'diplomatic',
            markerId: 'brussels',
            short: 'NATO',
            effects: [
              { tag: 'alliance_cohesion', weight: 2, summary: 'Unity' },
              { tag: 'escalation', weight: 1, summary: 'Alert risk' },
              { tag: 'deterrence', weight: 1, summary: 'Signal' },
            ],
          },
          {
            id: 'hist-1968-2b',
            label: 'Open borders and refugee corridors',
            detail: 'Humanitarian first.',
            kind: 'civic',
            markerId: 'streets',
            short: 'REFUGE',
            effects: [
              { tag: 'civilian_cost', weight: -2, summary: 'Shelter' },
              { tag: 'social_calm', weight: 1, summary: 'Orderly aid' },
              { tag: 'polarization', weight: 1, summary: 'Domestic politics' },
            ],
          },
          {
            id: 'hist-1968-2c',
            label: 'Covert aid to reformers',
            detail: 'Radios, funds, exfil.',
            kind: 'kinetic',
            markerId: 'districts',
            short: 'COVERT',
            effects: [
              { tag: 'escalation', weight: 2, summary: 'Proxy risk' },
              { tag: 'credibility', weight: 1, summary: 'Not passive' },
              { tag: 'diplomacy', weight: -1, summary: 'If exposed' },
            ],
          },
        ],
      },
      {
        id: 'hist-1968-3',
        title: 'Normalization pressure',
        briefing:
          'Occupiers demand Western acceptance of a restored hard line as the price of “stability.”',
        stakes:
          'Recognition can become complicity.',
        choices: [
          {
            id: 'hist-1968-3a',
            label: 'Refuse business-as-usual summits',
            detail: 'Diplomatic chill.',
            kind: 'diplomatic',
            markerId: 'capital',
            short: 'CHILL',
            effects: [
              { tag: 'norm_protection', weight: 2, summary: 'Non-acceptance' },
              { tag: 'diplomacy', weight: -1, summary: 'Channels thin' },
              { tag: 'credibility', weight: 1, summary: 'Principled' },
            ],
          },
          {
            id: 'hist-1968-3b',
            label: 'Continue arms-control tracks anyway',
            detail: 'Separate issues.',
            kind: 'diplomatic',
            markerId: 'ballot',
            short: 'ARMS',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Big stakes saved' },
              { tag: 'norm_erosion', weight: 1, summary: 'Looks cynical' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Moral camp splits' },
            ],
          },
          {
            id: 'hist-1968-3c',
            label: 'Targeted cultural and academic boycotts',
            detail: 'Soft isolation.',
            kind: 'civic',
            markerId: 'districts',
            short: 'BOYCOTT',
            effects: [
              { tag: 'polarization', weight: 1, summary: 'Symbolic fight' },
              { tag: 'credibility', weight: 1, summary: 'Visible stand' },
              { tag: 'diplomacy', weight: -1, summary: 'Irritant' },
            ],
          },
        ],
      },
      {
        id: 'hist-1968-4',
        title: 'Doctrine memo',
        briefing:
          'You must write what this means for future Eastern reform movements.',
        stakes:
          'Doctrine teaches the next Prague—or Hungary.',
        choices: [
          {
            id: 'hist-1968-4a',
            label: 'Codify non-intervention beyond rhetoric aid',
            detail: 'Clear limits.',
            kind: 'political',
            markerId: 'parliament',
            short: 'LIMITS',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Honest bounds' },
              { tag: 'deterrence', weight: -1, summary: 'Less fear' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Shared realism' },
            ],
          },
          {
            id: 'hist-1968-4b',
            label: 'Promise future linkage to Helsinki-style rights baskets',
            detail: 'Long game.',
            kind: 'legal',
            markerId: 'brussels',
            short: 'RIGHTS',
            effects: [
              { tag: 'norm_protection', weight: 2, summary: 'Rights track' },
              { tag: 'time', weight: 2, summary: 'Slow tool' },
              { tag: 'diplomacy', weight: 1, summary: 'Agenda set' },
            ],
          },
          {
            id: 'hist-1968-4c',
            label: 'Accelerate conventional forces on the central front',
            detail: 'Hard answer.',
            kind: 'kinetic',
            markerId: 'streets',
            short: 'FORCE',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Teeth' },
              { tag: 'escalation', weight: 1, summary: 'Arms race' },
              { tag: 'market_stability', weight: -1, summary: 'Spend' },
            ],
          },
        ],
      },
      {
        id: 'hist-1968-5',
        title: 'Intervention night shock',
        briefing:
          'Tanks cross. Your options are condemnation, sanctions, covert aid, or pragmatic silence. Each teaches Moscow and your public a different lesson.',
        stakes:
          'Moral clarity and alliance security collide.',
        choices: [
          {
            id: 'hist-1968-5a',
            label: 'Lead a sharp public condemnation with targeted sanctions',
            detail: 'Voice and costs.',
            kind: 'diplomatic',
            markerId: 'brussels',
            short: 'CONDEMN',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Moral signal' },
              { tag: 'economic_pressure', weight: 1, summary: 'Costs' },
              { tag: 'escalation', weight: 1, summary: 'East-West chill' },
            ],
          },
          {
            id: 'hist-1968-5b',
            label: 'Keep official silence; expand quiet refugee and radio support',
            detail: 'Help without war.',
            kind: 'civic',
            markerId: 'streets',
            short: 'RADIO2',
            effects: [
              { tag: 'civilian_cost', weight: -1, summary: 'People helped' },
              { tag: 'diplomacy', weight: 1, summary: 'Deniable' },
              { tag: 'credibility', weight: -1, summary: 'Looks passive' },
            ],
          },
          {
            id: 'hist-1968-5c',
            label: 'Raise military alerts to deter spillover',
            detail: 'Posture response.',
            kind: 'kinetic',
            markerId: 'districts',
            short: 'ALERT2',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'NATO ready' },
              { tag: 'escalation', weight: 2, summary: 'Dangerous optics' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Alliance woke' },
            ],
          },
        ],
      },
      {
        id: 'hist-1968-6',
        title: 'Street solidarity politics',
        briefing:
          'Your cities fill with protests demanding action you cannot deliver without risking war. Managing hope becomes policy.',
        stakes:
          'Public conscience without private means.',
        choices: [
          {
            id: 'hist-1968-6a',
            label: 'Host visible solidarity without promising intervention',
            detail: 'Speech not tanks.',
            kind: 'civic',
            markerId: 'streets',
            short: 'SOLID',
            effects: [
              { tag: 'domestic_support', weight: 2, summary: 'Moral alignment' },
              { tag: 'credibility', weight: 1, summary: 'Honest limits' },
              { tag: 'escalation', weight: -1, summary: 'No force promise' },
            ],
          },
          {
            id: 'hist-1968-6b',
            label: 'Crack down on protests that block bases and ministries',
            detail: 'Order over emotion.',
            kind: 'legal',
            markerId: 'districts',
            short: 'CRACK',
            effects: [
              { tag: 'social_calm', weight: 1, summary: 'Short quiet' },
              { tag: 'polarization', weight: 2, summary: 'Anger' },
              { tag: 'norm_erosion', weight: 1, summary: 'Speech chill' },
            ],
          },
          {
            id: 'hist-1968-6c',
            label: 'Channel energy into refugee resettlement programs',
            detail: 'Practical mercy.',
            kind: 'civic',
            markerId: 'ballot',
            short: 'RESETTLE',
            effects: [
              { tag: 'civilian_cost', weight: -2, summary: 'Refugees aided' },
              { tag: 'domestic_support', weight: 1, summary: 'Concrete help' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Shared burden' },
            ],
          },
        ],
      },
      {
        id: 'hist-1968-7',
        title: 'Ally divergences',
        briefing:
          'Some allies want trade as usual; others want a freeze. A split response weakens the signal.',
        stakes:
          'Détente and deterrence argue in the same room.',
        choices: [
          {
            id: 'hist-1968-7a',
            label: 'Forge a common Allied communiqué with graduated measures',
            detail: 'Unity text.',
            kind: 'diplomatic',
            markerId: 'brussels',
            short: 'COMMUNI',
            effects: [
              { tag: 'alliance_cohesion', weight: 3, summary: 'One voice' },
              { tag: 'diplomacy', weight: 1, summary: 'Coordinated' },
              { tag: 'time', weight: -1, summary: 'Drafting tax' },
            ],
          },
          {
            id: 'hist-1968-7b',
            label: 'Allow national measures à la carte',
            detail: 'Flexibility.',
            kind: 'political',
            markerId: 'capital',
            short: 'ALACARTE',
            effects: [
              { tag: 'time', weight: 1, summary: 'Faster nationals' },
              { tag: 'alliance_cohesion', weight: -2, summary: 'Fragmented' },
              { tag: 'credibility', weight: -1, summary: 'Muddy signal' },
            ],
          },
          {
            id: 'hist-1968-7c',
            label: 'Link any détente talks to a Prague human-rights annex',
            detail: 'Conditionality.',
            kind: 'diplomatic',
            markerId: 'parliament',
            short: 'ANNEX',
            effects: [
              { tag: 'norm_protection', weight: 2, summary: 'Rights linked' },
              { tag: 'diplomacy', weight: -1, summary: 'Harder détente' },
              { tag: 'credibility', weight: 1, summary: 'Principled' },
            ],
          },
        ],
      },
      {
        id: 'hist-1968-8',
        title: 'Normalization fog',
        briefing:
          'Collaborator governments claim consent. Your intelligence and exiles disagree. Recognition choices follow the fog.',
        stakes:
          'Recognizing a puppet is a policy, not a fact.',
        choices: [
          {
            id: 'hist-1968-8a',
            label: 'Delay recognition; keep ties at chargé level',
            detail: 'Ambiguous status.',
            kind: 'diplomatic',
            markerId: 'capital',
            short: 'CHARGE',
            effects: [
              { tag: 'time', weight: 2, summary: 'Option kept' },
              { tag: 'diplomacy', weight: 1, summary: 'Channel thin' },
              { tag: 'credibility', weight: 1, summary: 'Non-blessing' },
            ],
          },
          {
            id: 'hist-1968-8b',
            label: 'Recognize quickly to preserve embassy access',
            detail: 'Presence over purity.',
            kind: 'political',
            markerId: 'brussels',
            short: 'RECOG',
            effects: [
              { tag: 'diplomacy', weight: 1, summary: 'Access' },
              { tag: 'norm_erosion', weight: 2, summary: 'Consent fiction' },
              { tag: 'credibility', weight: -1, summary: 'Cynical' },
            ],
          },
          {
            id: 'hist-1968-8c',
            label: 'Publish a legal memo rejecting consent claims',
            detail: 'Lawfare.',
            kind: 'legal',
            markerId: 'parliament',
            short: 'MEMO',
            effects: [
              { tag: 'norm_protection', weight: 2, summary: 'Legal line' },
              { tag: 'escalation', weight: 1, summary: 'Diplomatic fight' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Some join' },
            ],
          },
        ],
      },
      {
        id: 'hist-1968-9',
        title: 'Quiet off-ramp',
        briefing:
          'Back channels hint at prisoner releases and softer occupation optics if public campaigns quiet. Buying people with silence is a trade.',
        stakes:
          'Human lives versus public witness.',
        choices: [
          {
            id: 'hist-1968-9a',
            label: 'Trade campaign volume for verified releases',
            detail: 'Quiet diplomacy.',
            kind: 'diplomatic',
            markerId: 'capital',
            short: 'QUIETDIP',
            effects: [
              { tag: 'civilian_cost', weight: -2, summary: 'Prisoners out' },
              { tag: 'credibility', weight: -1, summary: 'Muted voice' },
              { tag: 'diplomacy', weight: 2, summary: 'Deal' },
            ],
          },
          {
            id: 'hist-1968-9b',
            label: 'Refuse; keep maximal public pressure',
            detail: 'Witness first.',
            kind: 'civic',
            markerId: 'streets',
            short: 'WITNESS',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Moral clarity' },
              { tag: 'civilian_cost', weight: 1, summary: 'Hostages linger' },
              { tag: 'escalation', weight: 1, summary: 'Chill deepens' },
            ],
          },
          {
            id: 'hist-1968-9c',
            label: 'Split: quiet track for people, loud track for norms',
            detail: 'Dual approach.',
            kind: 'diplomatic',
            markerId: 'brussels',
            short: 'DUAL3',
            effects: [
              { tag: 'diplomacy', weight: 1, summary: 'Both tracks' },
              { tag: 'time', weight: 1, summary: 'Complex' },
              { tag: 'credibility', weight: 1, summary: 'If coordinated' },
            ],
          },
        ],
      },
      {
        id: 'hist-1968-10',
        title: 'Brezhnev doctrine endgame',
        briefing:
          'You must write Western doctrine: spheres are real, illegitimate, or contestable only politically.',
        stakes:
          'How you name the intervention shapes the 1970s.',
        choices: [
          {
            id: 'hist-1968-10a',
            label: 'Reject spheres publicly; invest in long political contestation',
            detail: 'Ideas war.',
            kind: 'political',
            markerId: 'parliament',
            short: 'IDEAS',
            effects: [
              { tag: 'norm_protection', weight: 2, summary: 'Anti-sphere' },
              { tag: 'diplomacy', weight: 1, summary: 'Long game' },
              { tag: 'escalation', weight: -1, summary: 'Non-military' },
            ],
          },
          {
            id: 'hist-1968-10b',
            label: 'Accept a tacit sphere while hardening NATO core',
            detail: 'Realism.',
            kind: 'kinetic',
            markerId: 'districts',
            short: 'SPHERE',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Core strong' },
              { tag: 'credibility', weight: -2, summary: 'Eastern Europe written off' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'NATO focus' },
            ],
          },
          {
            id: 'hist-1968-10c',
            label: 'Tie future economic deals to free movement and press rules',
            detail: 'Helsinki seed.',
            kind: 'economic',
            markerId: 'brussels',
            short: 'HELSINKI',
            effects: [
              { tag: 'norm_protection', weight: 2, summary: 'Basket linkage' },
              { tag: 'diplomacy', weight: 2, summary: 'Process' },
              { tag: 'market_stability', weight: -1, summary: 'Deal friction' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'hist-1973-oil',
    year: 1973,
    era: '1962–1979',
    title: 'Embargo Shock',
    region: 'Gulf producers · OPEC · consumer economies',
    meterFamily: 'economy',
    theaterArchetype: 'markets',
    premise:
      'An oil embargo and price spike hit growth, alliances, and domestic order. You advise a consumer-government crisis cell on rationing, diplomacy, and whether to threaten force for supply.',
    role: 'Energy and economy crisis director',
    tension:
      'Keep society functioning without turning energy into open war.',
    beats: [
      {
        id: 'hist-1973-1',
        title: 'Rationing politics',
        briefing:
          'Queues form. Industry wants priority; voters want fairness.',
        stakes:
          'Allocation is legitimacy.',
        choices: [
          {
            id: 'hist-1973-1a',
            label: 'Odd-even rationing with industrial priority carve-outs',
            detail: 'Hybrid fairness.',
            kind: 'civic',
            markerId: 'energy',
            short: 'RATION',
            effects: [
              { tag: 'social_calm', weight: 1, summary: 'Some order' },
              { tag: 'market_stability', weight: 1, summary: 'Industry held' },
              { tag: 'polarization', weight: 1, summary: 'Carve-out anger' },
            ],
          },
          {
            id: 'hist-1973-1b',
            label: 'Price liberalization to clear queues',
            detail: 'Let prices ration.',
            kind: 'economic',
            markerId: 'exchange',
            short: 'PRICE',
            effects: [
              { tag: 'market_stability', weight: 2, summary: 'Queues shrink' },
              { tag: 'civilian_cost', weight: 2, summary: 'Cost shock' },
              { tag: 'domestic_support', weight: -2, summary: 'Voters hurt' },
            ],
          },
          {
            id: 'hist-1973-1c',
            label: 'Strategic reserve release for essentials only',
            detail: 'Targeted calm.',
            kind: 'economic',
            markerId: 'treasury',
            short: 'SPR',
            effects: [
              { tag: 'market_stability', weight: 2, summary: 'Blunts spike' },
              { tag: 'time', weight: 1, summary: 'Buys weeks' },
              { tag: 'credibility', weight: -1, summary: 'Finite card' },
            ],
          },
        ],
      },
      {
        id: 'hist-1973-2',
        title: 'Alliance split',
        briefing:
          'Partners cut separate deals with producers. Your unity message is failing.',
        stakes:
          'Every bilateral deal weakens the next negotiation.',
        choices: [
          {
            id: 'hist-1973-2a',
            label: 'Propose a consumers’ cartel coordination desk',
            detail: 'Joint purchasing.',
            kind: 'diplomatic',
            markerId: 'em',
            short: 'CARTEL',
            effects: [
              { tag: 'alliance_cohesion', weight: 2, summary: 'Shared frame' },
              { tag: 'economic_pressure', weight: 1, summary: 'Buyer power' },
              { tag: 'diplomacy', weight: 1, summary: 'Counter-table' },
            ],
          },
          {
            id: 'hist-1973-2b',
            label: 'Authorize your own bilateral supply deal',
            detail: 'Secure your barrels.',
            kind: 'economic',
            markerId: 'energy',
            short: 'BILAT',
            effects: [
              { tag: 'market_stability', weight: 1, summary: 'Your supply' },
              { tag: 'alliance_cohesion', weight: -2, summary: 'Defect' },
              { tag: 'credibility', weight: -1, summary: 'Lectures ring hollow' },
            ],
          },
          {
            id: 'hist-1973-2c',
            label: 'Tie diplomacy to a Middle East ceasefire push',
            detail: 'Politics for oil.',
            kind: 'diplomatic',
            markerId: 'fed',
            short: 'PEACE',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Linkage' },
              { tag: 'escalation', weight: -1, summary: 'If it works' },
              { tag: 'time', weight: 1, summary: 'Complex talks' },
            ],
          },
        ],
      },
      {
        id: 'hist-1973-3',
        title: 'Force talk',
        briefing:
          'Admirals float contingency plans to seize fields. Leak risk is extreme.',
        stakes:
          'Even studying force can explode the crisis.',
        choices: [
          {
            id: 'hist-1973-3a',
            label: 'Kill force planning; invest in efficiency mandates',
            detail: 'Demand destruction.',
            kind: 'civic',
            markerId: 'desk',
            short: 'EFFIC',
            effects: [
              { tag: 'market_stability', weight: 1, summary: 'Longer fix' },
              { tag: 'escalation', weight: -2, summary: 'No war path' },
              { tag: 'domestic_support', weight: -1, summary: 'Lifestyle hit' },
            ],
          },
          {
            id: 'hist-1973-3b',
            label: 'Keep planning secret as deterrent only',
            detail: 'Shadow option.',
            kind: 'kinetic',
            markerId: 'energy',
            short: 'SHADOW',
            effects: [
              { tag: 'deterrence', weight: 1, summary: 'Unknown risk' },
              { tag: 'escalation', weight: 1, summary: 'If leaked' },
              { tag: 'credibility', weight: -1, summary: 'Hypocrisy risk' },
            ],
          },
          {
            id: 'hist-1973-3c',
            label: 'Publicly rule out seizure; seek producer investment deals',
            detail: 'Interdependence.',
            kind: 'diplomatic',
            markerId: 'em',
            short: 'INVEST',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Positive sum pitch' },
              { tag: 'market_stability', weight: 1, summary: 'Capital flows' },
              { tag: 'deterrence', weight: -1, summary: 'No stick' },
            ],
          },
        ],
      },
      {
        id: 'hist-1973-4',
        title: 'New normal',
        briefing:
          'Prices may not return. You need a multi-year energy doctrine.',
        stakes:
          'Crisis policy becomes industrial policy.',
        choices: [
          {
            id: 'hist-1973-4a',
            label: 'Crash program for domestic supply and nuclear',
            detail: 'Independence bid.',
            kind: 'economic',
            markerId: 'treasury',
            short: 'DOMESTIC',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Long game' },
              { tag: 'market_stability', weight: 1, summary: 'Future supply' },
              { tag: 'polarization', weight: 1, summary: 'Siting fights' },
            ],
          },
          {
            id: 'hist-1973-4b',
            label: 'International energy agency with shared stocks',
            detail: 'Institutionalize buffers.',
            kind: 'diplomatic',
            markerId: 'fed',
            short: 'IEA',
            effects: [
              { tag: 'alliance_cohesion', weight: 2, summary: 'Shared stocks' },
              { tag: 'market_stability', weight: 2, summary: 'Buffers' },
              { tag: 'diplomacy', weight: 1, summary: 'Rules' },
            ],
          },
          {
            id: 'hist-1973-4c',
            label: 'Accept higher prices; protect poorest with transfers',
            detail: 'Adaptation.',
            kind: 'civic',
            markerId: 'exchange',
            short: 'TRANSFER',
            effects: [
              { tag: 'social_calm', weight: 2, summary: 'Targeted help' },
              { tag: 'civilian_cost', weight: -1, summary: 'Cushion' },
              { tag: 'market_stability', weight: 1, summary: 'Prices work' },
            ],
          },
        ],
      },
      {
        id: 'hist-1973-5',
        title: 'Spot price spike shock',
        briefing:
          'Prices gap beyond models. Rationing lines form. Your next 48 hours decide whether markets or politics allocate scarcity.',
        stakes:
          'Allocation is legitimacy.',
        choices: [
          {
            id: 'hist-1973-5a',
            label: 'Impose odd-even rationing with hardship exceptions',
            detail: 'Administrative fairness.',
            kind: 'political',
            markerId: 'energy',
            short: 'RATION',
            effects: [
              { tag: 'social_calm', weight: 1, summary: 'Perceived fairness' },
              { tag: 'market_stability', weight: -1, summary: 'Distortion' },
              { tag: 'civilian_cost', weight: -1, summary: 'Some equity' },
            ],
          },
          {
            id: 'hist-1973-5b',
            label: 'Let prices clear and expand targeted cash transfers',
            detail: 'Market plus cushion.',
            kind: 'economic',
            markerId: 'fed',
            short: 'PRICE',
            effects: [
              { tag: 'market_stability', weight: 2, summary: 'Clearing' },
              { tag: 'polarization', weight: 1, summary: 'Anger at prices' },
              { tag: 'credibility', weight: 1, summary: 'Coherent tool' },
            ],
          },
          {
            id: 'hist-1973-5c',
            label: 'Seize stocks and allocate to priority sectors by decree',
            detail: 'Command allocation.',
            kind: 'economic',
            markerId: 'treasury',
            short: 'SEIZE',
            effects: [
              { tag: 'governability', weight: 1, summary: 'Control' },
              { tag: 'norm_erosion', weight: 2, summary: 'Property shock' },
              { tag: 'market_stability', weight: -2, summary: 'Chaos premium' },
            ],
          },
        ],
      },
      {
        id: 'hist-1973-6',
        title: 'Domestic heating politics',
        briefing:
          'Winter approaches. Regional equity fights erupt. Your coalition can break on thermostat politics.',
        stakes:
          'Energy is federalism under stress.',
        choices: [
          {
            id: 'hist-1973-6a',
            label: 'Create a national heating equalization fund',
            detail: 'Share the cold.',
            kind: 'economic',
            markerId: 'treasury',
            short: 'HEAT',
            effects: [
              { tag: 'social_calm', weight: 2, summary: 'Equity' },
              { tag: 'polarization', weight: -1, summary: 'Less regional war' },
              { tag: 'market_stability', weight: -1, summary: 'Fiscal cost' },
            ],
          },
          {
            id: 'hist-1973-6b',
            label: 'Leave allocation to states with federal guidance only',
            detail: 'Federalism.',
            kind: 'political',
            markerId: 'em',
            short: 'STATES',
            effects: [
              { tag: 'governability', weight: -1, summary: 'Patchwork' },
              { tag: 'polarization', weight: 1, summary: 'Blame shifts' },
              { tag: 'time', weight: 1, summary: 'Faster local' },
            ],
          },
          {
            id: 'hist-1973-6c',
            label: 'Prioritize industrial continuity over household comfort',
            detail: 'Production first.',
            kind: 'economic',
            markerId: 'desk',
            short: 'INDUSTRY',
            effects: [
              { tag: 'market_stability', weight: 1, summary: 'Output' },
              { tag: 'civilian_cost', weight: 2, summary: 'Households suffer' },
              { tag: 'polarization', weight: 2, summary: 'Class anger' },
            ],
          },
        ],
      },
      {
        id: 'hist-1973-7',
        title: 'Alliance recycling ask',
        briefing:
          'Partners want petrodollar recycling and shared stock drawdowns. Free-riding accusations fly.',
        stakes:
          'Consumer solidarity is hard under scarcity.',
        choices: [
          {
            id: 'hist-1973-7a',
            label: 'Commit to proportional SPR-like draws with partners',
            detail: 'Share the buffer.',
            kind: 'diplomatic',
            markerId: 'energy',
            short: 'SPR',
            effects: [
              { tag: 'alliance_cohesion', weight: 3, summary: 'Consumer bloc' },
              { tag: 'market_stability', weight: 2, summary: 'Coordinated calm' },
              { tag: 'time', weight: 1, summary: 'Buys weeks' },
            ],
          },
          {
            id: 'hist-1973-7b',
            label: 'Hoard national stocks; offer only intelligence sharing',
            detail: 'National first.',
            kind: 'economic',
            markerId: 'fed',
            short: 'HOARD',
            effects: [
              { tag: 'market_stability', weight: 1, summary: 'National buffer' },
              { tag: 'alliance_cohesion', weight: -3, summary: 'Partners bitter' },
              { tag: 'credibility', weight: -1, summary: 'Selfish optics' },
            ],
          },
          {
            id: 'hist-1973-7c',
            label: 'Propose a joint purchasing agency to reduce bidding wars',
            detail: 'Buyer power.',
            kind: 'economic',
            markerId: 'desk',
            short: 'BUYER',
            effects: [
              { tag: 'market_stability', weight: 2, summary: 'Less frenzy' },
              { tag: 'diplomacy', weight: 1, summary: 'Institution' },
              { tag: 'time', weight: -1, summary: 'Setup' },
            ],
          },
        ],
      },
      {
        id: 'hist-1973-8',
        title: 'Force-option rumor fog',
        briefing:
          'Rumors of seizure plans against fields circulate. Markets spike on the rumor alone. You must kill, confirm, or instrumentalize it.',
        stakes:
          'Deterrence theater can become accidental policy.',
        choices: [
          {
            id: 'hist-1973-8a',
            label: 'Publicly renounce seizure options; double diplomacy',
            detail: 'Kill the rumor.',
            kind: 'diplomatic',
            markerId: 'exchange',
            short: 'RENOUNCE',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Talks first' },
              { tag: 'escalation', weight: -2, summary: 'War talk down' },
              { tag: 'deterrence', weight: -1, summary: 'Less fear leverage' },
            ],
          },
          {
            id: 'hist-1973-8b',
            label: 'Keep ambiguity as bargaining leverage',
            detail: 'Strategic silence.',
            kind: 'political',
            markerId: 'treasury',
            short: 'AMBIG2',
            effects: [
              { tag: 'deterrence', weight: 1, summary: 'Fear premium' },
              { tag: 'escalation', weight: 1, summary: 'Misread risk' },
              { tag: 'market_stability', weight: -2, summary: 'Risk premium' },
            ],
          },
          {
            id: 'hist-1973-8c',
            label: 'Launch a leak probe and brief markets on continuity plans',
            detail: 'Calm the tape.',
            kind: 'economic',
            markerId: 'desk',
            short: 'PROBE2',
            effects: [
              { tag: 'market_stability', weight: 2, summary: 'Messaging' },
              { tag: 'credibility', weight: 1, summary: 'Adult supervision' },
              { tag: 'time', weight: 1, summary: 'Focus' },
            ],
          },
        ],
      },
      {
        id: 'hist-1973-9',
        title: 'Diplomatic off-ramp',
        briefing:
          'A package links partial supply restoration to a negotiation calendar on the underlying conflict. Spoilers abound.',
        stakes:
          'Energy peace is rarely only about energy.',
        choices: [
          {
            id: 'hist-1973-9a',
            label: 'Endorse a linked calendar with verification on barrels',
            detail: 'Oil for process.',
            kind: 'diplomatic',
            markerId: 'energy',
            short: 'OILPROC',
            effects: [
              { tag: 'diplomacy', weight: 3, summary: 'Linked deal' },
              { tag: 'market_stability', weight: 2, summary: 'Supply hope' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Shared track' },
            ],
          },
          {
            id: 'hist-1973-9b',
            label: 'Insist on delinking energy from the political dispute',
            detail: 'Separate tracks.',
            kind: 'political',
            markerId: 'fed',
            short: 'DELINK',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Principle' },
              { tag: 'diplomacy', weight: -1, summary: 'Harder bargain' },
              { tag: 'market_stability', weight: -1, summary: 'Delay' },
            ],
          },
          {
            id: 'hist-1973-9c',
            label: 'Offer technology and food offsets for interim barrels',
            detail: 'Side payments.',
            kind: 'economic',
            markerId: 'em',
            short: 'OFFSET',
            effects: [
              { tag: 'diplomacy', weight: 1, summary: 'Sweeteners' },
              { tag: 'market_stability', weight: 1, summary: 'Some barrels' },
              { tag: 'credibility', weight: -1, summary: 'Transactional' },
            ],
          },
        ],
      },
      {
        id: 'hist-1973-10',
        title: 'New-normal endgame',
        briefing:
          'You must choose whether to treat scarcity as temporary or to lock in efficiency, diversification, and strategic stocks as doctrine.',
        stakes:
          'The shock becomes structure—or is forgotten.',
        choices: [
          {
            id: 'hist-1973-10a',
            label: 'Mandate strategic stocks and efficiency standards',
            detail: 'Institutionalize resilience.',
            kind: 'economic',
            markerId: 'energy',
            short: 'RESIL',
            effects: [
              { tag: 'market_stability', weight: 2, summary: 'Buffers' },
              { tag: 'credibility', weight: 2, summary: 'Learned lesson' },
              { tag: 'polarization', weight: 1, summary: 'Regulation fights' },
            ],
          },
          {
            id: 'hist-1973-10b',
            label: 'Sunset emergency powers and return to pre-shock norms',
            detail: 'Normalcy bias.',
            kind: 'political',
            markerId: 'treasury',
            short: 'SUNSET2',
            effects: [
              { tag: 'norm_protection', weight: 1, summary: 'Emergency ends' },
              { tag: 'market_stability', weight: -1, summary: 'Unprepared next time' },
              { tag: 'domestic_support', weight: 1, summary: 'Relief' },
            ],
          },
          {
            id: 'hist-1973-10c',
            label: 'Prioritize producer-consumer conference architecture',
            detail: 'Diplomacy as structure.',
            kind: 'diplomatic',
            markerId: 'exchange',
            short: 'CONF',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Standing forum' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Shared table' },
              { tag: 'time', weight: 1, summary: 'Process' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'hist-1979-persian-pivot',
    year: 1979,
    era: '1979–1991',
    title: 'Persian Pivot',
    region: 'Iran · Gulf · embassy networks',
    meterFamily: 'conflict',
    theaterArchetype: 'gulf',
    premise:
      'A revolutionary upheaval topples a pillar ally. Hostages, oil, and regional balance collide. You advise on rescue, negotiation, and whether to court new regional partners.',
    role: 'National security advisor',
    tension:
      'Recover people and standing without a wider Gulf war.',
    beats: [
      {
        id: 'hist-1979-1',
        title: 'Ally collapse',
        briefing:
          'The old government falls. Do you evacuate early, recognize new authorities, or bet on a restoration?',
        stakes:
          'Timing decides who owns the narrative of abandonment.',
        choices: [
          {
            id: 'hist-1979-1a',
            label: 'Full noncombatant evacuation now',
            detail: 'People first.',
            kind: 'diplomatic',
            markerId: 'base',
            short: 'EVAC',
            effects: [
              { tag: 'civilian_cost', weight: -2, summary: 'Staff safe' },
              { tag: 'credibility', weight: -1, summary: 'Looks like flight' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Local allies panic' },
            ],
          },
          {
            id: 'hist-1979-1b',
            label: 'Recognize a transitional authority if it forms',
            detail: 'Engage facts.',
            kind: 'diplomatic',
            markerId: 'tehran',
            short: 'RECOG',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Channel' },
              { tag: 'credibility', weight: -1, summary: 'Betrays old clients' },
              { tag: 'time', weight: 1, summary: 'Talks' },
            ],
          },
          {
            id: 'hist-1979-1c',
            label: 'Covertly back remnants',
            detail: 'Restoration bid.',
            kind: 'kinetic',
            markerId: 'proxy',
            short: 'REMNANT',
            effects: [
              { tag: 'escalation', weight: 2, summary: 'Civil war fuel' },
              { tag: 'credibility', weight: 1, summary: 'Loyalty story' },
              { tag: 'diplomacy', weight: -2, summary: 'Revolution hardens' },
            ],
          },
        ],
      },
      {
        id: 'hist-1979-2',
        title: 'Embassy crisis',
        briefing:
          'Diplomats are seized. Options: quiet negotiation, sanctions, or a rescue attempt.',
        stakes:
          'Each path risks the hostages differently.',
        choices: [
          {
            id: 'hist-1979-2a',
            label: 'Open a multilateral negotiation track',
            detail: 'Third-party mediation.',
            kind: 'diplomatic',
            markerId: 'oman',
            short: 'MEDIATE',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Off-ramp' },
              { tag: 'time', weight: 1, summary: 'Slow' },
              { tag: 'domestic_support', weight: -1, summary: 'Looks passive' },
            ],
          },
          {
            id: 'hist-1979-2b',
            label: 'Freeze assets and sanction oil liftings',
            detail: 'Pressure.',
            kind: 'economic',
            markerId: 'dubai',
            short: 'SANCT',
            effects: [
              { tag: 'economic_pressure', weight: 2, summary: 'Squeeze' },
              { tag: 'market_stability', weight: -1, summary: 'Oil spike' },
              { tag: 'escalation', weight: 1, summary: 'Hardens captors' },
            ],
          },
          {
            id: 'hist-1979-2c',
            label: 'Authorize a high-risk rescue mission',
            detail: 'Force recovery.',
            kind: 'kinetic',
            markerId: 'base',
            short: 'RESCUE',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Action' },
              { tag: 'escalation', weight: 3, summary: 'If it fails' },
              { tag: 'civilian_cost', weight: 2, summary: 'Hostage risk' },
            ],
          },
        ],
      },
      {
        id: 'hist-1979-3',
        title: 'Gulf partners',
        briefing:
          'Neighboring monarchies want new security guarantees and weapons.',
        stakes:
          'Replacing one pillar with a chain of dependencies.',
        choices: [
          {
            id: 'hist-1979-3a',
            label: 'Offer a regional security umbrella statement',
            detail: 'Public shield.',
            kind: 'diplomatic',
            markerId: 'riyadh',
            short: 'UMBRELLA',
            effects: [
              { tag: 'alliance_cohesion', weight: 2, summary: 'Partners held' },
              { tag: 'deterrence', weight: 2, summary: 'Signal' },
              { tag: 'escalation', weight: 1, summary: 'Tripwires grow' },
            ],
          },
          {
            id: 'hist-1979-3b',
            label: 'Arms packages without new treaties',
            detail: 'Capacity only.',
            kind: 'economic',
            markerId: 'oil',
            short: 'ARMS',
            effects: [
              { tag: 'deterrence', weight: 1, summary: 'Local teeth' },
              { tag: 'escalation', weight: 1, summary: 'Arms race' },
              { tag: 'market_stability', weight: 1, summary: 'Recycling petrodollars' },
            ],
          },
          {
            id: 'hist-1979-3c',
            label: 'Push a Gulf collective self-defense forum',
            detail: 'Local ownership.',
            kind: 'diplomatic',
            markerId: 'oman',
            short: 'FORUM',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Regional frame' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'If it works' },
              { tag: 'credibility', weight: 1, summary: 'Not only bilateral' },
            ],
          },
        ],
      },
      {
        id: 'hist-1979-4',
        title: 'Doctrine aftershock',
        briefing:
          'You must decide whether revolution ends the old dual-pillar strategy.',
        stakes:
          'Strategy is grieving in public.',
        choices: [
          {
            id: 'hist-1979-4a',
            label: 'Write a dual-containment posture',
            detail: 'Pressure both rivals.',
            kind: 'political',
            markerId: 'tehran',
            short: 'CONTAIN',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Hard line' },
              { tag: 'diplomacy', weight: -1, summary: 'Fewer talks' },
              { tag: 'escalation', weight: 1, summary: 'Chronic tension' },
            ],
          },
          {
            id: 'hist-1979-4b',
            label: 'Keep a back channel for eventual normalization',
            detail: 'Long game.',
            kind: 'diplomatic',
            markerId: 'oman',
            short: 'CHANNEL',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Future path' },
              { tag: 'credibility', weight: -1, summary: 'Hawks object' },
              { tag: 'time', weight: 1, summary: 'Strategic patience' },
            ],
          },
          {
            id: 'hist-1979-4c',
            label: 'Pivot energy strategy away from the Gulf premium',
            detail: 'Reduce exposure.',
            kind: 'economic',
            markerId: 'oil',
            short: 'DIVERSE',
            effects: [
              { tag: 'market_stability', weight: 1, summary: 'Longer resilience' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Partners feel dropped' },
              { tag: 'credibility', weight: 1, summary: 'Structural fix' },
            ],
          },
        ],
      },
      {
        id: 'hist-1979-5',
        title: 'Embassy seizure shock',
        briefing:
          'Staff are hostages. Rescue planning, sanctions, and negotiation compete on the same clock. A failed raid could kill the channel—and the people.',
        stakes:
          'Human lives versus strategic posture.',
        choices: [
          {
            id: 'hist-1979-5a',
            label: 'Open a multilayer negotiation channel via third parties',
            detail: 'Talk first.',
            kind: 'diplomatic',
            markerId: 'oman',
            short: 'CHANNEL2',
            effects: [
              { tag: 'diplomacy', weight: 3, summary: 'Release path' },
              { tag: 'time', weight: 2, summary: 'Patient' },
              { tag: 'domestic_support', weight: -1, summary: 'Looks soft' },
            ],
          },
          {
            id: 'hist-1979-5b',
            label: 'Authorize contingency rescue planning to a ready state',
            detail: 'Prepare the raid.',
            kind: 'kinetic',
            markerId: 'base',
            short: 'RESCUE',
            effects: [
              { tag: 'deterrence', weight: 1, summary: 'Options ready' },
              { tag: 'escalation', weight: 2, summary: 'If used, war risk' },
              { tag: 'civilian_cost', weight: 1, summary: 'Hostage risk' },
            ],
          },
          {
            id: 'hist-1979-5c',
            label: 'Freeze assets and hitch release to sanctions relief design',
            detail: 'Money track.',
            kind: 'economic',
            markerId: 'dubai',
            short: 'FREEZE2',
            effects: [
              { tag: 'economic_pressure', weight: 2, summary: 'Leverage' },
              { tag: 'diplomacy', weight: 1, summary: 'Bargaining chip' },
              { tag: 'market_stability', weight: -1, summary: 'Gulf nerves' },
            ],
          },
        ],
      },
      {
        id: 'hist-1979-6',
        title: 'Domestic humiliation politics',
        briefing:
          'Nightly news frames weakness. A public ultimatum may trap you; silence may trap the hostages’ families.',
        stakes:
          'Television is a negotiating party.',
        choices: [
          {
            id: 'hist-1979-6a',
            label: 'Brief families privately; keep public language restrained',
            detail: 'Dignity without ultimatum.',
            kind: 'civic',
            markerId: 'riyadh',
            short: 'FAMILIES',
            effects: [
              { tag: 'domestic_support', weight: 1, summary: 'Empathy' },
              { tag: 'diplomacy', weight: 1, summary: 'Room to talk' },
              { tag: 'credibility', weight: 1, summary: 'Adult tone' },
            ],
          },
          {
            id: 'hist-1979-6b',
            label: 'Issue a public deadline with implied force',
            detail: 'Television resolve.',
            kind: 'political',
            markerId: 'tehran',
            short: 'DEADLINE',
            effects: [
              { tag: 'domestic_support', weight: 2, summary: 'Resolve optics' },
              { tag: 'escalation', weight: 2, summary: 'Clock trap' },
              { tag: 'diplomacy', weight: -2, summary: 'Channel hardens' },
            ],
          },
          {
            id: 'hist-1979-6c',
            label: 'Flood the zone with process updates to manage attention',
            detail: 'Information management.',
            kind: 'political',
            markerId: 'oil',
            short: 'PROCESS2',
            effects: [
              { tag: 'time', weight: 1, summary: 'Attention managed' },
              { tag: 'credibility', weight: -1, summary: 'Spin charge' },
              { tag: 'social_calm', weight: 1, summary: 'Less panic' },
            ],
          },
        ],
      },
      {
        id: 'hist-1979-7',
        title: 'Gulf partner ask',
        briefing:
          'Partners want a clear security umbrella and oil-lane escorts. Over-promising creates tripwires; under-promising invites Soviet or rival fills.',
        stakes:
          'The Gulf security architecture is being rewritten in weeks.',
        choices: [
          {
            id: 'hist-1979-7a',
            label: 'Offer consultative security and limited maritime escorts',
            detail: 'Presence with limits.',
            kind: 'naval',
            markerId: 'hormuz',
            short: 'ESCORT2',
            effects: [
              { tag: 'alliance_cohesion', weight: 2, summary: 'Partners steadied' },
              { tag: 'deterrence', weight: 2, summary: 'Lane signal' },
              { tag: 'escalation', weight: 1, summary: 'More hulls' },
            ],
          },
          {
            id: 'hist-1979-7b',
            label: 'Sell arms and intel, refuse new tripwires',
            detail: 'Tools not guarantees.',
            kind: 'diplomatic',
            markerId: 'riyadh',
            short: 'ARMS2',
            effects: [
              { tag: 'alliance_cohesion', weight: 1, summary: 'Useful' },
              { tag: 'deterrence', weight: 1, summary: 'Partner teeth' },
              { tag: 'credibility', weight: -1, summary: 'No umbrella' },
            ],
          },
          {
            id: 'hist-1979-7c',
            label: 'Propose a multilateral Gulf maritime regime',
            detail: 'Institutionalize.',
            kind: 'diplomatic',
            markerId: 'oman',
            short: 'REGIME',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Shared rules' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Broad buy-in' },
              { tag: 'time', weight: -1, summary: 'Slow build' },
            ],
          },
        ],
      },
      {
        id: 'hist-1979-8',
        title: 'Attribution and faction fog',
        briefing:
          'Competing Iranian factions claim and deny authority over the hostages. Talking to the wrong node wastes leverage—or legitimizes radicals.',
        stakes:
          'Who is the counterparty?',
        choices: [
          {
            id: 'hist-1979-8a',
            label: 'Engage multiple nodes while recognizing none as sole authority',
            detail: 'Mesh diplomacy.',
            kind: 'diplomatic',
            markerId: 'tehran',
            short: 'MESH',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'More paths' },
              { tag: 'time', weight: 1, summary: 'Complex' },
              { tag: 'credibility', weight: -1, summary: 'Mixed signals' },
            ],
          },
          {
            id: 'hist-1979-8b',
            label: 'Deal only with formal state ministries',
            detail: 'Legal counterparty.',
            kind: 'legal',
            markerId: 'dubai',
            short: 'FORMAL',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Clean channel' },
              { tag: 'diplomacy', weight: -1, summary: 'May be powerless' },
              { tag: 'time', weight: -1, summary: 'Slow' },
            ],
          },
          {
            id: 'hist-1979-8c',
            label: 'Amplify moderate claims to shape succession politics',
            detail: 'Political warfare.',
            kind: 'political',
            markerId: 'proxy',
            short: 'SHAPE2',
            effects: [
              { tag: 'escalation', weight: 1, summary: 'Factional fuel' },
              { tag: 'diplomacy', weight: 1, summary: 'Influence bet' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Partners uneasy' },
            ],
          },
        ],
      },
      {
        id: 'hist-1979-9',
        title: 'Release off-ramp',
        briefing:
          'A sequenced release-for-assets-and-nonintervention package appears. Spoilers can still kill it on either side’s street.',
        stakes:
          'Sequencing is everything.',
        choices: [
          {
            id: 'hist-1979-9a',
            label: 'Accept phased releases with escrowed asset steps',
            detail: 'Trust but escrow.',
            kind: 'diplomatic',
            markerId: 'oman',
            short: 'ESCROW',
            effects: [
              { tag: 'diplomacy', weight: 3, summary: 'Deal path' },
              { tag: 'escalation', weight: -2, summary: 'Crisis cools' },
              { tag: 'credibility', weight: 1, summary: 'Craft' },
            ],
          },
          {
            id: 'hist-1979-9b',
            label: 'Demand all hostages before any asset movement',
            detail: 'All or nothing.',
            kind: 'political',
            markerId: 'tehran',
            short: 'ALLFIRST',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Hard clear' },
              { tag: 'diplomacy', weight: -1, summary: 'Harder deal' },
              { tag: 'time', weight: -1, summary: 'Stalemate risk' },
            ],
          },
          {
            id: 'hist-1979-9c',
            label: 'Add a public apology demand to satisfy home politics',
            detail: 'Honor clause.',
            kind: 'civic',
            markerId: 'oil',
            short: 'APOLOGY2',
            effects: [
              { tag: 'domestic_support', weight: 2, summary: 'Honor' },
              { tag: 'diplomacy', weight: -2, summary: 'May kill deal' },
              { tag: 'polarization', weight: 1, summary: 'Pride politics' },
            ],
          },
        ],
      },
      {
        id: 'hist-1979-10',
        title: 'Carter Doctrine endgame',
        briefing:
          'Whether or not hostages are free, cabinet wants a Gulf security declaration. Words will be tested by the next tanker war.',
        stakes:
          'Declaratory policy becomes geography.',
        choices: [
          {
            id: 'hist-1979-10a',
            label: 'Declare vital-interest language for Gulf oil flow',
            detail: 'Clear tripwire text.',
            kind: 'political',
            markerId: 'strait',
            short: 'VITAL',
            effects: [
              { tag: 'deterrence', weight: 3, summary: 'Declaratory shield' },
              { tag: 'alliance_cohesion', weight: 2, summary: 'Partners cheered' },
              { tag: 'escalation', weight: 1, summary: 'Commitment risk' },
            ],
          },
          {
            id: 'hist-1979-10b',
            label: 'Keep interests vital but means ambiguous',
            detail: 'Strategic ambiguity.',
            kind: 'diplomatic',
            markerId: 'hormuz',
            short: 'AMBIG3',
            effects: [
              { tag: 'deterrence', weight: 1, summary: 'Some uncertainty' },
              { tag: 'diplomacy', weight: 1, summary: 'Flexibility' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Partners unsure' },
            ],
          },
          {
            id: 'hist-1979-10c',
            label: 'Prioritize energy transition investments over military pledges',
            detail: 'Demand-side strategy.',
            kind: 'economic',
            markerId: 'oil',
            short: 'TRANSIT2',
            effects: [
              { tag: 'market_stability', weight: 1, summary: 'Long resilience' },
              { tag: 'deterrence', weight: -1, summary: 'Less force focus' },
              { tag: 'credibility', weight: 1, summary: 'Structural fix' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'hist-1989-wall',
    year: 1989,
    era: '1979–1991',
    title: 'Wall Night',
    region: 'Berlin · Central Europe · alliance desks',
    meterFamily: 'politics',
    theaterArchetype: 'europe',
    premise:
      'Crowds and confused border guards open a sealed city. You advise on recognition, monetary union speed, and how fast a divided continent should reunify without triggering a security spiral.',
    role: 'German and European affairs counselor',
    tension:
      'Seize a peaceful opening without frightening a nuclear-armed neighbor into backlash.',
    beats: [
      {
        id: 'hist-1989-1',
        title: 'Opening night',
        briefing:
          'Borders are porous. Do you surge police for order, celebrate publicly, or coordinate quietly with Moscow?',
        stakes:
          'Images will outrun policy memos.',
        choices: [
          {
            id: 'hist-1989-1a',
            label: 'Public celebration with calm policing guidance',
            detail: 'Joy plus order.',
            kind: 'civic',
            markerId: 'streets',
            short: 'OPEN',
            effects: [
              { tag: 'social_calm', weight: 2, summary: 'Orderly joy' },
              { tag: 'domestic_support', weight: 2, summary: 'Historic moment' },
              { tag: 'escalation', weight: -1, summary: 'Less panic' },
            ],
          },
          {
            id: 'hist-1989-1b',
            label: 'Quiet coordination call to Moscow first',
            detail: 'Manage great-power nerves.',
            kind: 'diplomatic',
            markerId: 'brussels',
            short: 'CALL',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Reassurance' },
              { tag: 'credibility', weight: -1, summary: 'Looks hesitant' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Alliance consulted' },
            ],
          },
          {
            id: 'hist-1989-1c',
            label: 'Freeze crossings until a legal protocol',
            detail: 'Control first.',
            kind: 'legal',
            markerId: 'parliament',
            short: 'FREEZE',
            effects: [
              { tag: 'governability', weight: 1, summary: 'Procedure' },
              { tag: 'social_calm', weight: -2, summary: 'Crowd anger' },
              { tag: 'polarization', weight: 2, summary: 'Missed moment' },
            ],
          },
        ],
      },
      {
        id: 'hist-1989-2',
        title: 'Recognition cascade',
        briefing:
          'Eastern cabinets fall like dominoes. Partners ask whether to recognize new governments before elections.',
        stakes:
          'Speed legitimizes; delay creates vacuums.',
        choices: [
          {
            id: 'hist-1989-2a',
            label: 'Recognize after election calendars are set',
            detail: 'Process condition.',
            kind: 'diplomatic',
            markerId: 'ballot',
            short: 'ELECT',
            effects: [
              { tag: 'democratic_mandate', weight: 2, summary: 'Elections first' },
              { tag: 'time', weight: 1, summary: 'Wait' },
              { tag: 'diplomacy', weight: 1, summary: 'Standards' },
            ],
          },
          {
            id: 'hist-1989-2b',
            label: 'Immediate recognition to lock peaceful transitions',
            detail: 'Facts forward.',
            kind: 'political',
            markerId: 'capital',
            short: 'NOW',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Steadies transitions' },
              { tag: 'credibility', weight: 1, summary: 'Decisive' },
              { tag: 'norm_erosion', weight: 1, summary: 'Pre-election stamp' },
            ],
          },
          {
            id: 'hist-1989-2c',
            label: 'Tie recognition to alliance non-expansion assurances',
            detail: 'Security bargain.',
            kind: 'diplomatic',
            markerId: 'brussels',
            short: 'ASSURE',
            effects: [
              { tag: 'escalation', weight: -1, summary: 'Reassures East' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Future fight seeded' },
              { tag: 'diplomacy', weight: 2, summary: 'Grand bargain try' },
            ],
          },
        ],
      },
      {
        id: 'hist-1989-3',
        title: 'Monetary rush',
        briefing:
          'Currency union talk accelerates. Economists warn of shock; politics wants unity symbols.',
        stakes:
          'A currency can unify—or impoverish.',
        choices: [
          {
            id: 'hist-1989-3a',
            label: 'Fast currency union with conversion generosity',
            detail: 'Political price.',
            kind: 'economic',
            markerId: 'parliament',
            short: 'DMFAST',
            effects: [
              { tag: 'eu_cohesion', weight: 2, summary: 'Unity symbol' },
              { tag: 'market_stability', weight: -1, summary: 'Shock risk' },
              { tag: 'domestic_support', weight: 2, summary: 'East cheered' },
            ],
          },
          {
            id: 'hist-1989-3b',
            label: 'Staged convertibility with reform benchmarks',
            detail: 'Economists’ path.',
            kind: 'economic',
            markerId: 'districts',
            short: 'STAGED',
            effects: [
              { tag: 'market_stability', weight: 2, summary: 'Less shock' },
              { tag: 'time', weight: 2, summary: 'Slower unity' },
              { tag: 'polarization', weight: 1, summary: 'Impatience' },
            ],
          },
          {
            id: 'hist-1989-3c',
            label: 'Keep separate currencies; deepen trade only',
            detail: 'Minimal.',
            kind: 'political',
            markerId: 'capital',
            short: 'TRADE',
            effects: [
              { tag: 'market_stability', weight: 1, summary: 'Buffers' },
              { tag: 'eu_cohesion', weight: -2, summary: 'Thin unity' },
              { tag: 'credibility', weight: -1, summary: 'Missed historic' },
            ],
          },
        ],
      },
      {
        id: 'hist-1989-4',
        title: 'Alliance map',
        briefing:
          'Will a reunified center stay in the Western alliance? Neutrality proposals appear.',
        stakes:
          'The security architecture is the real treaty.',
        choices: [
          {
            id: 'hist-1989-4a',
            label: 'Reunified state remains in the alliance',
            detail: 'No special status.',
            kind: 'diplomatic',
            markerId: 'brussels',
            short: 'NATOIN',
            effects: [
              { tag: 'alliance_cohesion', weight: 2, summary: 'Clear' },
              { tag: 'escalation', weight: 1, summary: 'Neighbor nervous' },
              { tag: 'deterrence', weight: 2, summary: 'Continuity' },
            ],
          },
          {
            id: 'hist-1989-4b',
            label: 'Temporary non-nuclear special status in the East',
            detail: 'Compromise geography.',
            kind: 'diplomatic',
            markerId: 'ballot',
            short: 'SPECIAL',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Face-saver' },
              { tag: 'deterrence', weight: -1, summary: 'Complexity' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'If accepted' },
            ],
          },
          {
            id: 'hist-1989-4c',
            label: 'Push a new pan-European security treaty first',
            detail: 'Architecture before membership.',
            kind: 'political',
            markerId: 'parliament',
            short: 'CSCE',
            effects: [
              { tag: 'norm_protection', weight: 1, summary: 'Inclusive order' },
              { tag: 'time', weight: 2, summary: 'Slow' },
              { tag: 'credibility', weight: 1, summary: 'Visionary' },
            ],
          },
        ],
      },
      {
        id: 'hist-1989-5',
        title: 'Opening-night crowd shock',
        briefing:
          'Borders become permeable faster than plans. Force against crowds could restart the Cold War; total passivity could create chaos and hardline backlash.',
        stakes:
          'Crowd dynamics are strategy.',
        choices: [
          {
            id: 'hist-1989-5a',
            label: 'Urge nonviolent crowd management and open crossing procedures',
            detail: 'Channel the flood.',
            kind: 'civic',
            markerId: 'streets',
            short: 'OPEN',
            effects: [
              { tag: 'civilian_cost', weight: -2, summary: 'Safer flow' },
              { tag: 'diplomacy', weight: 2, summary: 'Peaceful change' },
              { tag: 'escalation', weight: -1, summary: 'Less force' },
            ],
          },
          {
            id: 'hist-1989-5b',
            label: 'Advise temporary controlled closures to regain admin control',
            detail: 'Order first.',
            kind: 'political',
            markerId: 'capital',
            short: 'CLOSE',
            effects: [
              { tag: 'governability', weight: 1, summary: 'Admin breath' },
              { tag: 'polarization', weight: 2, summary: 'Rage risk' },
              { tag: 'escalation', weight: 1, summary: 'If forced' },
            ],
          },
          {
            id: 'hist-1989-5c',
            label: 'Flood humanitarian and transport support without political claims',
            detail: 'Logistics as policy.',
            kind: 'civic',
            markerId: 'districts',
            short: 'LOGIST',
            effects: [
              { tag: 'civilian_cost', weight: -2, summary: 'Aid' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Helpful' },
              { tag: 'time', weight: 1, summary: 'Stabilizes' },
            ],
          },
        ],
      },
      {
        id: 'hist-1989-6',
        title: 'Domestic reunification politics',
        briefing:
          'Your public tastes reunification now; partners fear a giant. Speed versus reassurance is the fight.',
        stakes:
          'National longing versus European architecture.',
        choices: [
          {
            id: 'hist-1989-6a',
            label: 'Embrace reunification as goal with staged European embedding',
            detail: 'Unity inside Europe.',
            kind: 'political',
            markerId: 'parliament',
            short: 'EMBED',
            effects: [
              { tag: 'domestic_support', weight: 2, summary: 'National goal' },
              { tag: 'eu_cohesion', weight: 2, summary: 'Embedded' },
              { tag: 'diplomacy', weight: 1, summary: 'Partner frame' },
            ],
          },
          {
            id: 'hist-1989-6b',
            label: 'Slow-walk legal unity; prioritize confederation language',
            detail: 'Calm neighbors.',
            kind: 'diplomatic',
            markerId: 'brussels',
            short: 'CONFED',
            effects: [
              { tag: 'alliance_cohesion', weight: 2, summary: 'Neighbors eased' },
              { tag: 'domestic_support', weight: -2, summary: 'Nationalists mad' },
              { tag: 'time', weight: 2, summary: 'Slower' },
            ],
          },
          {
            id: 'hist-1989-6c',
            label: 'Let street politics set the pace; follow with law later',
            detail: 'Democracy of the square.',
            kind: 'civic',
            markerId: 'streets',
            short: 'SQUARE',
            effects: [
              { tag: 'norm_protection', weight: 1, summary: 'Popular will' },
              { tag: 'governability', weight: -1, summary: 'Reactive state' },
              { tag: 'escalation', weight: 1, summary: 'Improvised' },
            ],
          },
        ],
      },
      {
        id: 'hist-1989-7',
        title: 'Ally security map ask',
        briefing:
          'Washington, Paris, and Moscow want incompatible alliance maps. Your answer shapes NATO’s future edge.',
        stakes:
          'Architecture is the peace dividend—or its opposite.',
        choices: [
          {
            id: 'hist-1989-7a',
            label: 'Propose unified Germany in NATO with special military limits',
            detail: 'Classic bargain.',
            kind: 'diplomatic',
            markerId: 'brussels',
            short: 'NATOGER',
            effects: [
              { tag: 'alliance_cohesion', weight: 2, summary: 'Western unity' },
              { tag: 'diplomacy', weight: 2, summary: 'Negotiable limits' },
              { tag: 'deterrence', weight: 1, summary: 'Alliance intact' },
            ],
          },
          {
            id: 'hist-1989-7b',
            label: 'Offer neutrality as a bridge concept',
            detail: 'Finlandization risk.',
            kind: 'diplomatic',
            markerId: 'capital',
            short: 'NEUTRAL',
            effects: [
              { tag: 'diplomacy', weight: 1, summary: 'Moscow easier' },
              { tag: 'alliance_cohesion', weight: -2, summary: 'NATO hole' },
              { tag: 'deterrence', weight: -1, summary: 'Ambiguous' },
            ],
          },
          {
            id: 'hist-1989-7c',
            label: 'Delay alliance talk until monetary union settles',
            detail: 'Economics first.',
            kind: 'economic',
            markerId: 'parliament',
            short: 'ECONF1',
            effects: [
              { tag: 'market_stability', weight: 1, summary: 'Money focus' },
              { tag: 'time', weight: 2, summary: 'Security deferred' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Uncertainty' },
            ],
          },
        ],
      },
      {
        id: 'hist-1989-8',
        title: 'Intelligence fog on hardliner coups',
        briefing:
          'Reports of possible crackdowns conflict. Overreacting can provoke; underreacting can miss a massacre window.',
        stakes:
          'Warning without panic.',
        choices: [
          {
            id: 'hist-1989-8a',
            label: 'Quietly raise readiness and open crisis hotlines',
            detail: 'Prepared restraint.',
            kind: 'diplomatic',
            markerId: 'capital',
            short: 'HOTLINE2',
            effects: [
              { tag: 'deterrence', weight: 1, summary: 'Ready' },
              { tag: 'diplomacy', weight: 2, summary: 'Talk pipes' },
              { tag: 'escalation', weight: -1, summary: 'Channel cools' },
            ],
          },
          {
            id: 'hist-1989-8b',
            label: 'Publicly warn of consequences for any crackdown',
            detail: 'Deterrent speech.',
            kind: 'political',
            markerId: 'brussels',
            short: 'WARN2',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Clear cost' },
              { tag: 'escalation', weight: 1, summary: 'Rhetoric heat' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Shared line' },
            ],
          },
          {
            id: 'hist-1989-8c',
            label: 'Treat warnings as noise until multiply confirmed',
            detail: 'Avoid cry-wolf.',
            kind: 'political',
            markerId: 'parliament',
            short: 'NOISE',
            effects: [
              { tag: 'time', weight: 1, summary: 'Less false alarm' },
              { tag: 'civilian_cost', weight: 1, summary: 'If real, late' },
              { tag: 'credibility', weight: -1, summary: 'May look asleep' },
            ],
          },
        ],
      },
      {
        id: 'hist-1989-9',
        title: 'Monetary off-ramp',
        briefing:
          'A rapid currency union could stabilize—or bankrupt. Conversion rates are class politics with foreign-policy stakes.',
        stakes:
          'Exchange rates as statecraft.',
        choices: [
          {
            id: 'hist-1989-9a',
            label: 'Choose a generous conversion to buy eastern consent',
            detail: 'Political money.',
            kind: 'economic',
            markerId: 'capital',
            short: 'GENEROUS',
            effects: [
              { tag: 'domestic_support', weight: 2, summary: 'Eastern buy-in' },
              { tag: 'market_stability', weight: -2, summary: 'Costly' },
              { tag: 'polarization', weight: -1, summary: 'Less revolt' },
            ],
          },
          {
            id: 'hist-1989-9b',
            label: 'Choose a strict conversion to protect monetary credibility',
            detail: 'Hard money.',
            kind: 'economic',
            markerId: 'brussels',
            short: 'STRICT',
            effects: [
              { tag: 'market_stability', weight: 2, summary: 'Credibility' },
              { tag: 'civilian_cost', weight: 2, summary: 'Eastern pain' },
              { tag: 'polarization', weight: 2, summary: 'Backlash' },
            ],
          },
          {
            id: 'hist-1989-9c',
            label: 'Stage conversion with EU support facilities',
            detail: 'Europeanize the bill.',
            kind: 'diplomatic',
            markerId: 'parliament',
            short: 'EUSUP',
            effects: [
              { tag: 'eu_cohesion', weight: 2, summary: 'Shared project' },
              { tag: 'market_stability', weight: 1, summary: 'Buffered' },
              { tag: 'diplomacy', weight: 1, summary: 'Partnered' },
            ],
          },
        ],
      },
      {
        id: 'hist-1989-10',
        title: 'Post-Wall endgame',
        briefing:
          'You draft the “2+4” spirit note: borders final, rights secured, armies constrained. Spoilers still exist.',
        stakes:
          'Settlements that last are boring on purpose.',
        choices: [
          {
            id: 'hist-1989-10a',
            label: 'Lock final borders and minority rights in treaty language',
            detail: 'Legal peace.',
            kind: 'legal',
            markerId: 'brussels',
            short: 'BORDERS',
            effects: [
              { tag: 'norm_protection', weight: 3, summary: 'Rights and maps' },
              { tag: 'diplomacy', weight: 2, summary: 'Settlement' },
              { tag: 'escalation', weight: -1, summary: 'Less revisionism' },
            ],
          },
          {
            id: 'hist-1989-10b',
            label: 'Keep some border questions politically open',
            detail: 'Flexibility trap.',
            kind: 'political',
            markerId: 'capital',
            short: 'OPENQ',
            effects: [
              { tag: 'time', weight: 1, summary: 'Ambiguity' },
              { tag: 'escalation', weight: 1, summary: 'Future fights' },
              { tag: 'credibility', weight: -1, summary: 'Unsettled' },
            ],
          },
          {
            id: 'hist-1989-10c',
            label: 'Prioritize rapid Western economic absorption over legal niceties',
            detail: 'Facts then law.',
            kind: 'economic',
            markerId: 'districts',
            short: 'ABSORB3',
            effects: [
              { tag: 'market_stability', weight: 1, summary: 'Speed' },
              { tag: 'norm_erosion', weight: 1, summary: 'Process thin' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'West integrates' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'hist-1991-union-end',
    year: 1991,
    era: '1991–2008',
    title: 'Union Dissolution',
    region: 'Moscow · republics · nuclear command',
    meterFamily: 'politics',
    theaterArchetype: 'europe',
    premise:
      'A failed putsch, republic declarations, and nuclear custody questions end a superpower. You advise on recognition sequencing, weapons control, and economic shock therapy timing.',
    role: 'Post-Soviet transition director',
    tension:
      'Midwife a peaceful breakup without loose nukes or famine politics.',
    beats: [
      {
        id: 'hist-1991-1',
        title: 'Putsch hours',
        briefing:
          'Tanks in the capital. Do you back the elected center, stay silent, or prepare exile contacts?',
        stakes:
          'Early bets become lasting alignments.',
        choices: [
          {
            id: 'hist-1991-1a',
            label: 'Publicly back elected authorities',
            detail: 'Clear side.',
            kind: 'political',
            markerId: 'capital',
            short: 'BACK',
            effects: [
              { tag: 'democratic_mandate', weight: 2, summary: 'Elected line' },
              { tag: 'escalation', weight: 1, summary: 'If putsch wins' },
              { tag: 'credibility', weight: 2, summary: 'On record' },
            ],
          },
          {
            id: 'hist-1991-1b',
            label: 'Silent watch; protect embassy and citizens',
            detail: 'Minimal.',
            kind: 'diplomatic',
            markerId: 'brussels',
            short: 'WATCH',
            effects: [
              { tag: 'escalation', weight: -1, summary: 'Low profile' },
              { tag: 'credibility', weight: -1, summary: 'Ambiguous' },
              { tag: 'civilian_cost', weight: -1, summary: 'Staff focus' },
            ],
          },
          {
            id: 'hist-1991-1c',
            label: 'Quietly contact multiple factions',
            detail: 'Hedge.',
            kind: 'diplomatic',
            markerId: 'parliament',
            short: 'HEDGE',
            effects: [
              { tag: 'diplomacy', weight: 1, summary: 'Options' },
              { tag: 'credibility', weight: -2, summary: 'If exposed' },
              { tag: 'time', weight: 1, summary: 'Waits' },
            ],
          },
        ],
      },
      {
        id: 'hist-1991-2',
        title: 'Nuclear custody',
        briefing:
          'Republics host warheads. You need inventory, dismantlement aid, and command clarity.',
        stakes:
          'The most important map is the weapons map.',
        choices: [
          {
            id: 'hist-1991-2a',
            label: 'Fund Nunn-Lugar style secure-and-dismantle aid',
            detail: 'Pay for safety.',
            kind: 'economic',
            markerId: 'districts',
            short: 'NUNN',
            effects: [
              { tag: 'deterrence', weight: 1, summary: 'Secure stockpiles' },
              { tag: 'diplomacy', weight: 2, summary: 'Cooperative threat reduction' },
              { tag: 'market_stability', weight: -1, summary: 'Spend' },
            ],
          },
          {
            id: 'hist-1991-2b',
            label: 'Demand central monopoly as recognition price',
            detail: 'One finger on the button.',
            kind: 'diplomatic',
            markerId: 'capital',
            short: 'MONOPOLY',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Clear standard' },
              { tag: 'diplomacy', weight: -1, summary: 'Republic anger' },
              { tag: 'escalation', weight: -1, summary: 'If it works' },
            ],
          },
          {
            id: 'hist-1991-2c',
            label: 'Offer security guarantees for denuclearizing republics',
            detail: 'Budapest-style bargains.',
            kind: 'diplomatic',
            markerId: 'ballot',
            short: 'GUARANT',
            effects: [
              { tag: 'norm_protection', weight: 1, summary: 'Nonproliferation' },
              { tag: 'diplomacy', weight: 2, summary: 'Deal shape' },
              { tag: 'deterrence', weight: -1, summary: 'Guarantees’ future test' },
            ],
          },
        ],
      },
      {
        id: 'hist-1991-3',
        title: 'Economic shock',
        briefing:
          'Price liberalization proposals meet empty shelves. Aid can cushion—or be stolen.',
        stakes:
          'Reform without food is a coup risk.',
        choices: [
          {
            id: 'hist-1991-3a',
            label: 'Support shock therapy with a large stabilization fund',
            detail: 'Fast markets.',
            kind: 'economic',
            markerId: 'brussels',
            short: 'SHOCK',
            effects: [
              { tag: 'market_stability', weight: 1, summary: 'If it works' },
              { tag: 'civilian_cost', weight: 2, summary: 'Painful transition' },
              { tag: 'polarization', weight: 2, summary: 'Backlash politics' },
            ],
          },
          {
            id: 'hist-1991-3b',
            label: 'Gradual reforms with food aid corridors',
            detail: 'Soft landing try.',
            kind: 'civic',
            markerId: 'streets',
            short: 'FOOD',
            effects: [
              { tag: 'social_calm', weight: 2, summary: 'Cushion' },
              { tag: 'time', weight: 2, summary: 'Slower markets' },
              { tag: 'credibility', weight: 1, summary: 'Humane' },
            ],
          },
          {
            id: 'hist-1991-3c',
            label: 'Condition aid on anti-corruption monitors',
            detail: 'Governance first.',
            kind: 'legal',
            markerId: 'parliament',
            short: 'MONITOR',
            effects: [
              { tag: 'governability', weight: 2, summary: 'Accountability' },
              { tag: 'diplomacy', weight: -1, summary: 'Sovereignty friction' },
              { tag: 'market_stability', weight: 1, summary: 'Less theft' },
            ],
          },
        ],
      },
      {
        id: 'hist-1991-4',
        title: 'Recognition of independence',
        briefing:
          'Republics ask for seats and borders. Russia asks you not to “encourage disintegration.”',
        stakes:
          'You are choosing the successor map.',
        choices: [
          {
            id: 'hist-1991-4a',
            label: 'Recognize independence on uti possidetis borders',
            detail: 'Admin lines become international.',
            kind: 'diplomatic',
            markerId: 'capital',
            short: 'UTI',
            effects: [
              { tag: 'norm_protection', weight: 1, summary: 'Border stability idea' },
              { tag: 'diplomacy', weight: 1, summary: 'Clear rule' },
              { tag: 'escalation', weight: 1, summary: 'Local disputes remain' },
            ],
          },
          {
            id: 'hist-1991-4b',
            label: 'Delay recognition pending union treaty salvage',
            detail: 'One more try.',
            kind: 'political',
            markerId: 'brussels',
            short: 'SALVAGE',
            effects: [
              { tag: 'time', weight: 1, summary: 'Delay' },
              { tag: 'credibility', weight: -1, summary: 'Denies facts' },
              { tag: 'escalation', weight: -1, summary: 'If it calms' },
            ],
          },
          {
            id: 'hist-1991-4c',
            label: 'Case-by-case recognition with minority treaties',
            detail: 'Rights for recognition.',
            kind: 'legal',
            markerId: 'ballot',
            short: 'MINORITY',
            effects: [
              { tag: 'norm_protection', weight: 2, summary: 'Rights link' },
              { tag: 'time', weight: 2, summary: 'Complex' },
              { tag: 'polarization', weight: 1, summary: 'Each case a fight' },
            ],
          },
        ],
      },
      {
        id: 'hist-1991-5',
        title: 'Nuclear custody shock',
        briefing:
          'Command authority fragments across republics. A single loose warhead is a civilization-scale failure mode.',
        stakes:
          'Nukes make every other issue secondary.',
        choices: [
          {
            id: 'hist-1991-5a',
            label: 'Prioritize centralized custody deals with technical aid',
            detail: 'Secure the arsenal.',
            kind: 'diplomatic',
            markerId: 'capital',
            short: 'CUSTODY',
            effects: [
              { tag: 'deterrence', weight: 1, summary: 'Control restored' },
              { tag: 'diplomacy', weight: 2, summary: 'Technical path' },
              { tag: 'alliance_cohesion', weight: 2, summary: 'West helps' },
            ],
          },
          {
            id: 'hist-1991-5b',
            label: 'Accept temporary multi-republic custody with monitors',
            detail: 'Political reality.',
            kind: 'diplomatic',
            markerId: 'brussels',
            short: 'MULTI',
            effects: [
              { tag: 'time', weight: 1, summary: 'Fits politics' },
              { tag: 'escalation', weight: 1, summary: 'Control risk' },
              { tag: 'credibility', weight: -1, summary: 'Messy' },
            ],
          },
          {
            id: 'hist-1991-5c',
            label: 'Threaten recognition freezes until custody is singular',
            detail: 'Hard leverage.',
            kind: 'political',
            markerId: 'parliament',
            short: 'FREEZE3',
            effects: [
              { tag: 'economic_pressure', weight: 2, summary: 'Leverage' },
              { tag: 'diplomacy', weight: -1, summary: 'Resentment' },
              { tag: 'escalation', weight: -1, summary: 'If it works, safer' },
            ],
          },
        ],
      },
      {
        id: 'hist-1991-6',
        title: 'Bread and voucher politics',
        briefing:
          'Price liberalization without safety nets can topple reformers. Gradualism can empty shops slower—or forever.',
        stakes:
          'Shock therapy is a security issue.',
        choices: [
          {
            id: 'hist-1991-6a',
            label: 'Fund targeted safety nets alongside price reform',
            detail: 'Cushion the shock.',
            kind: 'economic',
            markerId: 'capital',
            short: 'NETS',
            effects: [
              { tag: 'social_calm', weight: 2, summary: 'Less revolt' },
              { tag: 'market_stability', weight: 1, summary: 'Reform continues' },
              { tag: 'civilian_cost', weight: -1, summary: 'Hardship cut' },
            ],
          },
          {
            id: 'hist-1991-6b',
            label: 'Push rapid liberalization to break shortages fast',
            detail: 'Rip the bandage.',
            kind: 'economic',
            markerId: 'brussels',
            short: 'SHOCK',
            effects: [
              { tag: 'market_stability', weight: 1, summary: 'If it works' },
              { tag: 'civilian_cost', weight: 3, summary: 'Pain' },
              { tag: 'polarization', weight: 2, summary: 'Backlash' },
            ],
          },
          {
            id: 'hist-1991-6c',
            label: 'Delay liberalization; flood food aid first',
            detail: 'Calories before prices.',
            kind: 'civic',
            markerId: 'streets',
            short: 'FOOD',
            effects: [
              { tag: 'civilian_cost', weight: -2, summary: 'Hunger eased' },
              { tag: 'time', weight: 2, summary: 'Reform delayed' },
              { tag: 'market_stability', weight: -1, summary: 'Shortages linger' },
            ],
          },
        ],
      },
      {
        id: 'hist-1991-7',
        title: 'Republic recognition ask',
        briefing:
          'New flags want recognition now. Too fast risks nuclear and minority crises; too slow invites violence for facts on the ground.',
        stakes:
          'Recognition timing is conflict management.',
        choices: [
          {
            id: 'hist-1991-7a',
            label: 'Use criteria: custody, minorities, borders before recognition',
            detail: 'Standards.',
            kind: 'legal',
            markerId: 'parliament',
            short: 'CRITERIA',
            effects: [
              { tag: 'norm_protection', weight: 2, summary: 'Rule-based' },
              { tag: 'diplomacy', weight: 1, summary: 'Incentives' },
              { tag: 'time', weight: 1, summary: 'Sequenced' },
            ],
          },
          {
            id: 'hist-1991-7b',
            label: 'Recognize quickly to lock peaceful dissolution',
            detail: 'Speed.',
            kind: 'diplomatic',
            markerId: 'brussels',
            short: 'FASTREC',
            effects: [
              { tag: 'diplomacy', weight: 1, summary: 'Facts blessed' },
              { tag: 'escalation', weight: -1, summary: 'Less fighting for recognition' },
              { tag: 'credibility', weight: -1, summary: 'Thin criteria' },
            ],
          },
          {
            id: 'hist-1991-7c',
            label: 'Coordinate a single Western recognition wave',
            detail: 'Unity.',
            kind: 'diplomatic',
            markerId: 'capital',
            short: 'WAVE',
            effects: [
              { tag: 'alliance_cohesion', weight: 3, summary: 'One calendar' },
              { tag: 'diplomacy', weight: 2, summary: 'Clear signal' },
              { tag: 'time', weight: -1, summary: 'Coordination tax' },
            ],
          },
        ],
      },
      {
        id: 'hist-1991-8',
        title: 'Putsch information fog',
        briefing:
          'During and after coup hours, who holds which ministry is unclear. Betting wrong can legitimize putschists—or strand reformers.',
        stakes:
          'Fog is the coup’s friend.',
        choices: [
          {
            id: 'hist-1991-8a',
            label: 'Refuse recognition of putsch authorities; keep reformer channel',
            detail: 'Pick early.',
            kind: 'diplomatic',
            markerId: 'capital',
            short: 'REFORMER',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Democratic signal' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'West aligned' },
              { tag: 'escalation', weight: 1, summary: 'If putsch wins, exposure' },
            ],
          },
          {
            id: 'hist-1991-8b',
            label: 'Wait for force facts before any statement',
            detail: 'Caution.',
            kind: 'political',
            markerId: 'parliament',
            short: 'WAIT',
            effects: [
              { tag: 'time', weight: 1, summary: 'Less premature' },
              { tag: 'credibility', weight: -1, summary: 'Vacillate charge' },
              { tag: 'diplomacy', weight: 1, summary: 'Flexibility' },
            ],
          },
          {
            id: 'hist-1991-8c',
            label: 'Issue humanitarian-only statements avoiding legitimacy',
            detail: 'Narrow voice.',
            kind: 'civic',
            markerId: 'streets',
            short: 'HUM3',
            effects: [
              { tag: 'civilian_cost', weight: -1, summary: 'Aid frame' },
              { tag: 'credibility', weight: -1, summary: 'Thin' },
              { tag: 'diplomacy', weight: 1, summary: 'Low commitment' },
            ],
          },
        ],
      },
      {
        id: 'hist-1991-9',
        title: 'Debt and aid off-ramp',
        briefing:
          'A grand bargain: aid and debt relief for reforms and arms control. Conditionality can save or sink reformers.',
        stakes:
          'Money as midwife of a new order.',
        choices: [
          {
            id: 'hist-1991-9a',
            label: 'Assemble a conditional grand bargain package',
            detail: 'Big bang support.',
            kind: 'economic',
            markerId: 'brussels',
            short: 'GRAND',
            effects: [
              { tag: 'market_stability', weight: 2, summary: 'Finance' },
              { tag: 'diplomacy', weight: 2, summary: 'Linked deal' },
              { tag: 'alliance_cohesion', weight: 2, summary: 'Western concert' },
            ],
          },
          {
            id: 'hist-1991-9b',
            label: 'Offer humanitarian aid only; avoid ownership of reforms',
            detail: 'Distance.',
            kind: 'economic',
            markerId: 'capital',
            short: 'HUMONLY',
            effects: [
              { tag: 'civilian_cost', weight: -1, summary: 'Some relief' },
              { tag: 'credibility', weight: 1, summary: 'Limits clear' },
              { tag: 'market_stability', weight: -1, summary: 'Weak macro help' },
            ],
          },
          {
            id: 'hist-1991-9c',
            label: 'Prioritize Nunn-Lugar-like security spending over macro aid',
            detail: 'Nukes first.',
            kind: 'diplomatic',
            markerId: 'districts',
            short: 'NUNN',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Secure arms' },
              { tag: 'diplomacy', weight: 1, summary: 'Security deal' },
              { tag: 'social_calm', weight: -1, summary: 'Economy waits' },
            ],
          },
        ],
      },
      {
        id: 'hist-1991-10',
        title: 'Dissolution endgame',
        briefing:
          'The union ends on paper. Your doctrine note chooses whether Russia is successor, first among equals, or just another republic.',
        stakes:
          'Legal succession shapes decades.',
        choices: [
          {
            id: 'hist-1991-10a',
            label: 'Treat Russia as primary successor for seats and weapons',
            detail: 'Continuity bet.',
            kind: 'diplomatic',
            markerId: 'capital',
            short: 'SUCCESS',
            effects: [
              { tag: 'diplomacy', weight: 1, summary: 'Clear desk' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Workable' },
              { tag: 'polarization', weight: 1, summary: 'Other republics resent' },
            ],
          },
          {
            id: 'hist-1991-10b',
            label: 'Push equitable succession formulas across key republics',
            detail: 'Fairness.',
            kind: 'legal',
            markerId: 'brussels',
            short: 'EQUITY',
            effects: [
              { tag: 'norm_protection', weight: 2, summary: 'Equal dignity' },
              { tag: 'diplomacy', weight: -1, summary: 'Harder seats' },
              { tag: 'time', weight: -1, summary: 'Complex' },
            ],
          },
          {
            id: 'hist-1991-10c',
            label: 'Leave succession messy; prioritize bilateral deals',
            detail: 'Pragmatism.',
            kind: 'political',
            markerId: 'parliament',
            short: 'MESSY',
            effects: [
              { tag: 'time', weight: 1, summary: 'Flexible' },
              { tag: 'credibility', weight: -1, summary: 'Fog' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Uneven' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'hist-1997-contagion',
    year: 1997,
    era: '1991–2008',
    title: 'Contagion Desk',
    region: 'Thailand · Indonesia · Korea · global capital',
    meterFamily: 'economy',
    theaterArchetype: 'markets',
    premise:
      'Currency crashes cascade through Asia. You advise an IMF-facing cabinet on bailout size, conditionality, and whether to let a major firm fail as a lesson.',
    role: 'International finance crisis counselor',
    tension:
      'Stop contagion without writing a moral-hazard blank check.',
    beats: [
      {
        id: 'hist-1997-1',
        title: 'First bailout terms',
        briefing:
          'A program draft demands austerity and bank closures. Streets may burn; markets may stabilize.',
        stakes:
          'Conditionality is politics with decimals.',
        choices: [
          {
            id: 'hist-1997-1a',
            label: 'Hard conditionality; front-load closures',
            detail: 'Orthodox shock.',
            kind: 'economic',
            markerId: 'fed',
            short: 'HARD',
            effects: [
              { tag: 'market_stability', weight: 1, summary: 'Creditor calm' },
              { tag: 'civilian_cost', weight: 2, summary: 'Social pain' },
              { tag: 'polarization', weight: 2, summary: 'Anti-IMF politics' },
            ],
          },
          {
            id: 'hist-1997-1b',
            label: 'Larger fund with softer fiscal path',
            detail: 'Buy social peace.',
            kind: 'economic',
            markerId: 'fed',
            short: 'SOFT',
            effects: [
              { tag: 'social_calm', weight: 2, summary: 'Less unrest' },
              { tag: 'credibility', weight: -1, summary: 'Moral hazard fear' },
              { tag: 'market_stability', weight: 1, summary: 'Liquidity' },
            ],
          },
          {
            id: 'hist-1997-1c',
            label: 'Stand aside; let the float purge',
            detail: 'No program.',
            kind: 'political',
            markerId: 'exchange',
            short: 'ASIDE',
            effects: [
              { tag: 'market_stability', weight: -3, summary: 'Deeper crash' },
              { tag: 'credibility', weight: 1, summary: 'No bailout' },
              { tag: 'civilian_cost', weight: 3, summary: 'Severe pain' },
            ],
          },
        ],
      },
      {
        id: 'hist-1997-2',
        title: 'Contagion hop',
        briefing:
          'Korea and Indonesia wobble. Partners beg for a regional fund without Western vetoes.',
        stakes:
          'Architecture fights break out mid-fire.',
        choices: [
          {
            id: 'hist-1997-2a',
            label: 'Support an IMF-centered package only',
            detail: 'One doctor.',
            kind: 'diplomatic',
            markerId: 'fed',
            short: 'IMFONLY',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Central role' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Asian resentment' },
              { tag: 'market_stability', weight: 1, summary: 'Familiar tool' },
            ],
          },
          {
            id: 'hist-1997-2b',
            label: 'Endorse a regional swap network alongside IMF',
            detail: 'Both layers.',
            kind: 'diplomatic',
            markerId: 'em',
            short: 'SWAP',
            effects: [
              { tag: 'alliance_cohesion', weight: 2, summary: 'Regional ownership' },
              { tag: 'market_stability', weight: 2, summary: 'More backstops' },
              { tag: 'credibility', weight: -1, summary: 'Dilutes IMF brand' },
            ],
          },
          {
            id: 'hist-1997-2c',
            label: 'Bilateral swap to a key ally only',
            detail: 'Pick winners.',
            kind: 'economic',
            markerId: 'treasury',
            short: 'BILAT',
            effects: [
              { tag: 'alliance_cohesion', weight: 1, summary: 'One partner saved' },
              { tag: 'market_stability', weight: -1, summary: 'Others panic' },
              { tag: 'polarization', weight: 1, summary: 'Favoritism' },
            ],
          },
        ],
      },
      {
        id: 'hist-1997-3',
        title: 'Chaebol / connected firm',
        briefing:
          'A national champion is insolvent. Closing it teaches markets; saving it teaches politics.',
        stakes:
          'Lessons are expensive either way.',
        choices: [
          {
            id: 'hist-1997-3a',
            label: 'Force restructuring with foreign participation',
            detail: 'Open the books.',
            kind: 'legal',
            markerId: 'desk',
            short: 'RESTRUCT',
            effects: [
              { tag: 'market_stability', weight: 2, summary: 'Cleanup' },
              { tag: 'domestic_support', weight: -2, summary: 'Nationalist anger' },
              { tag: 'credibility', weight: 1, summary: 'Rules' },
            ],
          },
          {
            id: 'hist-1997-3b',
            label: 'Bridge loan with political oversight board',
            detail: 'Save and supervise.',
            kind: 'political',
            markerId: 'treasury',
            short: 'BRIDGE',
            effects: [
              { tag: 'social_calm', weight: 1, summary: 'Jobs held' },
              { tag: 'norm_erosion', weight: 1, summary: 'Bailout politics' },
              { tag: 'market_stability', weight: -1, summary: 'Zombie risk' },
            ],
          },
          {
            id: 'hist-1997-3c',
            label: 'Order orderly failure with deposit protections',
            detail: 'Let it die safely.',
            kind: 'economic',
            markerId: 'exchange',
            short: 'FAIL',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'No sacred firms' },
              { tag: 'civilian_cost', weight: 1, summary: 'Job losses' },
              { tag: 'market_stability', weight: 1, summary: 'Clears deadwood' },
            ],
          },
        ],
      },
      {
        id: 'hist-1997-4',
        title: 'Capital controls debate',
        briefing:
          'Some economists urge temporary controls; markets call it heresy.',
        stakes:
          'Heresy can be a tourniquet.',
        choices: [
          {
            id: 'hist-1997-4a',
            label: 'Authorize temporary outflow controls',
            detail: 'Stop the bleed.',
            kind: 'legal',
            markerId: 'em',
            short: 'CONTROLS',
            effects: [
              { tag: 'market_stability', weight: 2, summary: 'Breathing room' },
              { tag: 'credibility', weight: -1, summary: 'Orthodoxy break' },
              { tag: 'time', weight: 2, summary: 'Policy space' },
            ],
          },
          {
            id: 'hist-1997-4b',
            label: 'Reject controls; hike rates to defend',
            detail: 'Classic defense.',
            kind: 'economic',
            markerId: 'fed',
            short: 'HIRE',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Orthodox' },
              { tag: 'civilian_cost', weight: 2, summary: 'Credit crunch' },
              { tag: 'market_stability', weight: -1, summary: 'If it fails' },
            ],
          },
          {
            id: 'hist-1997-4c',
            label: 'Voluntary rollover roundtables with banks',
            detail: 'Jawbone creditors.',
            kind: 'diplomatic',
            markerId: 'desk',
            short: 'ROLLOVER',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Private deal' },
              { tag: 'market_stability', weight: 1, summary: 'If honored' },
              { tag: 'time', weight: 1, summary: 'Negotiation' },
            ],
          },
        ],
      },
      {
        id: 'hist-1997-5',
        title: 'Won/baht second-wave shock',
        briefing:
          'A new devaluation rumor hits before the first program bites. Your desk must choose deepen, redesign, or let float freely.',
        stakes:
          'Programs die in the second week.',
        choices: [
          {
            id: 'hist-1997-5a',
            label: 'Deepen the program with larger official financing',
            detail: 'Bigger firewall.',
            kind: 'economic',
            markerId: 'fed',
            short: 'DEEPEN',
            effects: [
              { tag: 'market_stability', weight: 2, summary: 'Firewall' },
              { tag: 'credibility', weight: 1, summary: 'Commitment' },
              { tag: 'polarization', weight: 1, summary: 'Austerity anger' },
            ],
          },
          {
            id: 'hist-1997-5b',
            label: 'Redesign toward bank restructuring first',
            detail: 'Fix the pipes.',
            kind: 'economic',
            markerId: 'treasury',
            short: 'BANKS',
            effects: [
              { tag: 'market_stability', weight: 2, summary: 'Solvency focus' },
              { tag: 'time', weight: 1, summary: 'Sequence' },
              { tag: 'domestic_support', weight: -1, summary: 'Closures' },
            ],
          },
          {
            id: 'hist-1997-5c',
            label: 'Allow a freer float and cut official money',
            detail: 'Market purge.',
            kind: 'economic',
            markerId: 'exchange',
            short: 'FLOAT',
            effects: [
              { tag: 'market_stability', weight: -2, summary: 'Overshoot risk' },
              { tag: 'credibility', weight: 1, summary: 'Orthodox' },
              { tag: 'civilian_cost', weight: 2, summary: 'Pain' },
            ],
          },
        ],
      },
      {
        id: 'hist-1997-6',
        title: 'Jakarta street politics',
        briefing:
          'Riots threaten program ownership. Sidelining cronies can stabilize—or shatter the only implementers you have.',
        stakes:
          'Politics is the IMF’s real collateral.',
        choices: [
          {
            id: 'hist-1997-6a',
            label: 'Condition disbursements on transparent family-conglomerate cuts',
            detail: 'Governance lever.',
            kind: 'political',
            markerId: 'treasury',
            short: 'CRONY',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Reform signal' },
              { tag: 'polarization', weight: 1, summary: 'Elite fight' },
              { tag: 'market_stability', weight: 1, summary: 'If believed' },
            ],
          },
          {
            id: 'hist-1997-6b',
            label: 'Ease conditionality to preserve a governing coalition',
            detail: 'Ownership first.',
            kind: 'diplomatic',
            markerId: 'em',
            short: 'OWNER',
            effects: [
              { tag: 'governability', weight: 2, summary: 'Cabinet holds' },
              { tag: 'credibility', weight: -2, summary: 'Soft program' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Creditors wary' },
            ],
          },
          {
            id: 'hist-1997-6c',
            label: 'Fund social cash to buy calm while reforms proceed',
            detail: 'Compensate losers.',
            kind: 'economic',
            markerId: 'desk',
            short: 'CASH',
            effects: [
              { tag: 'social_calm', weight: 2, summary: 'Calm' },
              { tag: 'civilian_cost', weight: -1, summary: 'Buffers' },
              { tag: 'market_stability', weight: 1, summary: 'Space for reform' },
            ],
          },
        ],
      },
      {
        id: 'hist-1997-7',
        title: 'G7 coordination ask',
        briefing:
          'Partners disagree on Japan’s role, US bilateral swaps, and Europe’s exposure talk. A split official sector is contagion’s friend.',
        stakes:
          'Official sector unity is a market instrument.',
        choices: [
          {
            id: 'hist-1997-7a',
            label: 'Broker a joint financing statement with clear burdens',
            detail: 'One voice.',
            kind: 'diplomatic',
            markerId: 'fed',
            short: 'JOINT$',
            effects: [
              { tag: 'alliance_cohesion', weight: 3, summary: 'Official unity' },
              { tag: 'market_stability', weight: 2, summary: 'Confidence' },
              { tag: 'diplomacy', weight: 1, summary: 'Deal' },
            ],
          },
          {
            id: 'hist-1997-7b',
            label: 'Lead bilaterally and let others free-ride',
            detail: 'Speed over fairness.',
            kind: 'economic',
            markerId: 'treasury',
            short: 'BILAT$',
            effects: [
              { tag: 'time', weight: 2, summary: 'Fast money' },
              { tag: 'alliance_cohesion', weight: -2, summary: 'Resentment' },
              { tag: 'market_stability', weight: 1, summary: 'Some firepower' },
            ],
          },
          {
            id: 'hist-1997-7c',
            label: 'Push a regional fund concept alongside the Fund',
            detail: 'Asian architecture.',
            kind: 'diplomatic',
            markerId: 'em',
            short: 'REGFUND',
            effects: [
              { tag: 'diplomacy', weight: 1, summary: 'Regional ownership' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Rivalry risk' },
              { tag: 'time', weight: -1, summary: 'Build lag' },
            ],
          },
        ],
      },
      {
        id: 'hist-1997-8',
        title: 'Data fog',
        briefing:
          'True NPL ratios and offshore liabilities are guesses. Markets punish opacity; transparency can trigger the run you fear.',
        stakes:
          'Accounting is crisis strategy.',
        choices: [
          {
            id: 'hist-1997-8a',
            label: 'Force accelerated disclosure with official backstops ready',
            detail: 'Sunlight plus net.',
            kind: 'economic',
            markerId: 'exchange',
            short: 'DISCLOSE',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Transparency' },
              { tag: 'market_stability', weight: 1, summary: 'If backstopped' },
              { tag: 'time', weight: -1, summary: 'Shock day' },
            ],
          },
          {
            id: 'hist-1997-8b',
            label: 'Keep diagnostics private with creditors only',
            detail: 'Quiet truth.',
            kind: 'diplomatic',
            markerId: 'desk',
            short: 'PRIVATE',
            effects: [
              { tag: 'diplomacy', weight: 1, summary: 'Creditor room' },
              { tag: 'credibility', weight: -1, summary: 'Public fog' },
              { tag: 'market_stability', weight: -1, summary: 'Rumor premium' },
            ],
          },
          {
            id: 'hist-1997-8c',
            label: 'Publish stress ranges instead of point estimates',
            detail: 'Honest uncertainty.',
            kind: 'economic',
            markerId: 'fed',
            short: 'RANGES',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Epistemic honesty' },
              { tag: 'market_stability', weight: 1, summary: 'Less fake precision' },
              { tag: 'time', weight: 1, summary: 'Less cliff' },
            ],
          },
        ],
      },
      {
        id: 'hist-1997-9',
        title: 'Capital-controls off-ramp',
        briefing:
          'A temporary controls proposal could stop outflow—or destroy credibility for a decade. Malaysia’s shadow hangs over the room.',
        stakes:
          'Heresy that might work.',
        choices: [
          {
            id: 'hist-1997-9a',
            label: 'Authorize time-bound outflow controls with a sunset',
            detail: 'Emergency brake.',
            kind: 'economic',
            markerId: 'em',
            short: 'CONTROLS',
            effects: [
              { tag: 'market_stability', weight: 2, summary: 'Outflow slowed' },
              { tag: 'credibility', weight: -1, summary: 'Orthodoxy break' },
              { tag: 'time', weight: 2, summary: 'Breathing room' },
            ],
          },
          {
            id: 'hist-1997-9b',
            label: 'Reject controls; raise rates and show pain tolerance',
            detail: 'Classic defense.',
            kind: 'economic',
            markerId: 'fed',
            short: 'RATES',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Orthodox' },
              { tag: 'civilian_cost', weight: 2, summary: 'Pain' },
              { tag: 'market_stability', weight: -1, summary: 'If it fails' },
            ],
          },
          {
            id: 'hist-1997-9c',
            label: 'Offer selective controls only on short-term flows',
            detail: 'Surgical heresy.',
            kind: 'economic',
            markerId: 'treasury',
            short: 'SELECT',
            effects: [
              { tag: 'market_stability', weight: 1, summary: 'Targeted' },
              { tag: 'diplomacy', weight: 1, summary: 'Easier sell' },
              { tag: 'credibility', weight: -1, summary: 'Still unorthodox' },
            ],
          },
        ],
      },
      {
        id: 'hist-1997-10',
        title: 'Architecture endgame',
        briefing:
          'After the fires, cabinet asks whether to reform the Fund, build regional swaps, or preach self-insurance via reserves.',
        stakes:
          'The next crisis is designed now.',
        choices: [
          {
            id: 'hist-1997-10a',
            label: 'Push Fund reform on transparency and banking standards',
            detail: 'Global plumbing.',
            kind: 'diplomatic',
            markerId: 'fed',
            short: 'FUNDREF',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Lessons' },
              { tag: 'market_stability', weight: 1, summary: 'Better rules' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Shared project' },
            ],
          },
          {
            id: 'hist-1997-10b',
            label: 'Champion large national reserve accumulation',
            detail: 'Self-insurance.',
            kind: 'economic',
            markerId: 'em',
            short: 'RESERVES',
            effects: [
              { tag: 'market_stability', weight: 1, summary: 'National buffers' },
              { tag: 'diplomacy', weight: -1, summary: 'Less pooling' },
              { tag: 'credibility', weight: 1, summary: 'Never again' },
            ],
          },
          {
            id: 'hist-1997-10c',
            label: 'Build a standing regional swap network',
            detail: 'Neighbors first.',
            kind: 'diplomatic',
            markerId: 'desk',
            short: 'SWAPS',
            effects: [
              { tag: 'alliance_cohesion', weight: 2, summary: 'Regional glue' },
              { tag: 'market_stability', weight: 2, summary: 'Liquidity net' },
              { tag: 'time', weight: -1, summary: 'Negotiation' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'hist-2001-enduring',
    year: 2001,
    era: '1991–2008',
    title: 'Enduring Decision',
    region: 'Afghanistan · Pakistan · coalition capitals',
    meterFamily: 'conflict',
    theaterArchetype: 'sahel',
    premise:
      'After a mass-casualty attack, a cabinet must choose aims in Afghanistan: narrow counterterror, regime change, or a long nation-building writ—while managing a difficult neighbor’s dual game.',
    role: 'War cabinet strategist',
    tension:
      'Punish perpetrators without owning an ungovernable forever war.',
    beats: [
      {
        id: 'hist-2001-1',
        title: 'War aim draft',
        briefing:
          'Speechwriters want maximal language. Generals want achievable objectives.',
        stakes:
          'Words become missions.',
        choices: [
          {
            id: 'hist-2001-1a',
            label: 'Narrow aim: dismantle the attack network',
            detail: 'Counterterror first.',
            kind: 'political',
            markerId: 'capital',
            short: 'NARROW',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Achievable' },
              { tag: 'escalation', weight: -1, summary: 'Limited' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Easier coalition' },
            ],
          },
          {
            id: 'hist-2001-1b',
            label: 'Regime change plus democratic reconstruction',
            detail: 'Maximal writ.',
            kind: 'political',
            markerId: 'radio',
            short: 'REGIME',
            effects: [
              { tag: 'escalation', weight: 2, summary: 'Long war' },
              { tag: 'norm_protection', weight: 1, summary: 'Democracy frame' },
              { tag: 'civilian_cost', weight: 2, summary: 'Heavy footprint' },
            ],
          },
          {
            id: 'hist-2001-1c',
            label: 'Ultimatum to hosts with a short clock',
            detail: 'One last diplomatic door.',
            kind: 'diplomatic',
            markerId: 'border',
            short: 'ULTIM',
            effects: [
              { tag: 'diplomacy', weight: 1, summary: 'Formal chance' },
              { tag: 'credibility', weight: 2, summary: 'Clear demand' },
              { tag: 'time', weight: -1, summary: 'Short fuse' },
            ],
          },
        ],
      },
      {
        id: 'hist-2001-2',
        title: 'Neighbor leverage',
        briefing:
          'A key neighbor offers intel and air access—while hedging with proxies.',
        stakes:
          'You need the airport and distrust the ground.',
        choices: [
          {
            id: 'hist-2001-2a',
            label: 'Accept cooperation; build parallel verification',
            detail: 'Use and watch.',
            kind: 'diplomatic',
            markerId: 'border',
            short: 'USE',
            effects: [
              { tag: 'alliance_cohesion', weight: 1, summary: 'Access gained' },
              { tag: 'credibility', weight: -1, summary: 'Enables hedge' },
              { tag: 'deterrence', weight: 1, summary: 'Ops enabled' },
            ],
          },
          {
            id: 'hist-2001-2b',
            label: 'Condition aid on verifiable proxy cutoffs',
            detail: 'Hard bargain.',
            kind: 'economic',
            markerId: 'mine',
            short: 'COND',
            effects: [
              { tag: 'economic_pressure', weight: 2, summary: 'Leverage' },
              { tag: 'diplomacy', weight: -1, summary: 'Friction' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Access risk' },
            ],
          },
          {
            id: 'hist-2001-2c',
            label: 'Minimize dependence; longer logistics chains',
            detail: 'Autonomy.',
            kind: 'kinetic',
            markerId: 'convoy',
            short: 'AUTON',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Independence' },
              { tag: 'time', weight: 2, summary: 'Slower campaign' },
              { tag: 'escalation', weight: 1, summary: 'Harder ops' },
            ],
          },
        ],
      },
      {
        id: 'hist-2001-3',
        title: 'Northern allies',
        briefing:
          'Local armed factions offer to take cities. Human rights officers warn about tomorrow’s warlords.',
        stakes:
          'Tactical friends become strategic problems.',
        choices: [
          {
            id: 'hist-2001-3a',
            label: 'Partner tightly; plan DDR later',
            detail: 'Win first.',
            kind: 'kinetic',
            markerId: 'camp',
            short: 'PARTNER',
            effects: [
              { tag: 'escalation', weight: -1, summary: 'Faster fall of regime' },
              { tag: 'norm_erosion', weight: 2, summary: 'Warlord empowerment' },
              { tag: 'time', weight: -1, summary: 'Speed' },
            ],
          },
          {
            id: 'hist-2001-3b',
            label: 'Limit partners; prioritize international force presence',
            detail: 'Own the aftermath.',
            kind: 'diplomatic',
            markerId: 'capital',
            short: 'ISAF',
            effects: [
              { tag: 'norm_protection', weight: 1, summary: 'Accountability hope' },
              { tag: 'alliance_cohesion', weight: 2, summary: 'Coalition heavy' },
              { tag: 'civilian_cost', weight: 1, summary: 'Slower clearing' },
            ],
          },
          {
            id: 'hist-2001-3c',
            label: 'Airpower-heavy; minimal local patronage',
            detail: 'Stand-off.',
            kind: 'naval',
            markerId: 'radio',
            short: 'AIR',
            effects: [
              { tag: 'civilian_cost', weight: 1, summary: 'Strike risk' },
              { tag: 'escalation', weight: 1, summary: 'Limited ground' },
              { tag: 'credibility', weight: -1, summary: 'Thin control' },
            ],
          },
        ],
      },
      {
        id: 'hist-2001-4',
        title: 'Day-after governance',
        briefing:
          'Kabul’s politics open. Do you midwife a big tent, a strongman shortcut, or a long Bonn-style process?',
        stakes:
          'The political settlement is the real endstate.',
        choices: [
          {
            id: 'hist-2001-4a',
            label: 'Big-tent conference with international guarantors',
            detail: 'Inclusive process.',
            kind: 'diplomatic',
            markerId: 'capital',
            short: 'BONN',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Settlement frame' },
              { tag: 'governability', weight: 1, summary: 'Broad buy-in hope' },
              { tag: 'time', weight: 1, summary: 'Slow' },
            ],
          },
          {
            id: 'hist-2001-4b',
            label: 'Back a security-first strong executive',
            detail: 'Order over pluralism.',
            kind: 'political',
            markerId: 'camp',
            short: 'STRONG',
            effects: [
              { tag: 'governability', weight: 2, summary: 'Short-term order' },
              { tag: 'norm_erosion', weight: 2, summary: 'Centralized force' },
              { tag: 'polarization', weight: 1, summary: 'Excluded factions' },
            ],
          },
          {
            id: 'hist-2001-4c',
            label: 'Light footprint; local arrangements only',
            detail: 'Avoid ownership.',
            kind: 'civic',
            markerId: 'border',
            short: 'LIGHT',
            effects: [
              { tag: 'escalation', weight: -1, summary: 'Smaller presence' },
              { tag: 'credibility', weight: -1, summary: 'Vacuum risk' },
              { tag: 'civilian_cost', weight: 1, summary: 'Local predation risk' },
            ],
          },
        ],
      },
      {
        id: 'hist-2001-5',
        title: 'Northern front logistics shock',
        briefing:
          'Supply lines through neighbors are fragile. Closing a route can stall the campaign; dependence creates vetoes.',
        stakes:
          'Geography owns strategy.',
        choices: [
          {
            id: 'hist-2001-5a',
            label: 'Diversify routes with costly air and alternate borders',
            detail: 'Redundancy.',
            kind: 'kinetic',
            markerId: 'convoy',
            short: 'DIVERSE',
            effects: [
              { tag: 'deterrence', weight: 1, summary: 'Ops continue' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Less single veto' },
              { tag: 'market_stability', weight: -1, summary: 'Cost' },
            ],
          },
          {
            id: 'hist-2001-5b',
            label: 'Deepen dependence on the primary neighbor with side payments',
            detail: 'Buy the road.',
            kind: 'diplomatic',
            markerId: 'border',
            short: 'BUYPASS',
            effects: [
              { tag: 'alliance_cohesion', weight: 1, summary: 'Neighbor held' },
              { tag: 'credibility', weight: -1, summary: 'Transactional' },
              { tag: 'escalation', weight: 1, summary: 'Leverage politics' },
            ],
          },
          {
            id: 'hist-2001-5c',
            label: 'Slow the campaign to match secure logistics only',
            detail: 'Ops discipline.',
            kind: 'political',
            markerId: 'capital',
            short: 'SLOW',
            effects: [
              { tag: 'time', weight: 2, summary: 'Safer pace' },
              { tag: 'escalation', weight: -1, summary: 'Less stretch' },
              { tag: 'domestic_support', weight: -1, summary: 'Looks hesitant' },
            ],
          },
        ],
      },
      {
        id: 'hist-2001-6',
        title: 'Home forever-war politics',
        briefing:
          'Early unity fades into questions about ends. Defining success becomes the war.',
        stakes:
          'Democracies need off-ramps in the brief.',
        choices: [
          {
            id: 'hist-2001-6a',
            label: 'Publish measurable war aims short of nation-building',
            detail: 'Finite goals.',
            kind: 'political',
            markerId: 'radio',
            short: 'AIMS',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Clear ends' },
              { tag: 'domestic_support', weight: 1, summary: 'Honest' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Shared' },
            ],
          },
          {
            id: 'hist-2001-6b',
            label: 'Embrace transformative governance as the aim',
            detail: 'Maximal.',
            kind: 'civic',
            markerId: 'camp',
            short: 'NATION',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Ambition' },
              { tag: 'civilian_cost', weight: 1, summary: 'Long occupation' },
              { tag: 'escalation', weight: 1, summary: 'Deep fight' },
            ],
          },
          {
            id: 'hist-2001-6c',
            label: 'Keep aims ambiguous to preserve coalition and options',
            detail: 'Fog as tool.',
            kind: 'political',
            markerId: 'capital',
            short: 'FOG',
            effects: [
              { tag: 'time', weight: 1, summary: 'Flexibility' },
              { tag: 'credibility', weight: -2, summary: 'Mission creep risk' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Confusion' },
            ],
          },
        ],
      },
      {
        id: 'hist-2001-7',
        title: 'Neighbor intelligence ask',
        briefing:
          'A neighbor offers targeting gold for political cover and aid. The deal can shorten the war—or own you.',
        stakes:
          'Intelligence with a price tag.',
        choices: [
          {
            id: 'hist-2001-7a',
            label: 'Take the intel with narrow, audited political concessions',
            detail: 'Bounded bargain.',
            kind: 'diplomatic',
            markerId: 'border',
            short: 'INTEL2',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Better targeting' },
              { tag: 'diplomacy', weight: 1, summary: 'Deal' },
              { tag: 'credibility', weight: -1, summary: 'Compromise' },
            ],
          },
          {
            id: 'hist-2001-7b',
            label: 'Refuse conditionality; build unilateral collection',
            detail: 'Independence.',
            kind: 'kinetic',
            markerId: 'mine',
            short: 'UNILAT2',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Autonomy' },
              { tag: 'time', weight: -1, summary: 'Slower intel' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Neighbor cool' },
            ],
          },
          {
            id: 'hist-2001-7c',
            label: 'Multilateralize the intel bargain through coalition cover',
            detail: 'Share the sin.',
            kind: 'diplomatic',
            markerId: 'radio',
            short: 'MULTI2',
            effects: [
              { tag: 'alliance_cohesion', weight: 2, summary: 'Shared' },
              { tag: 'diplomacy', weight: 1, summary: 'Cover' },
              { tag: 'time', weight: -1, summary: 'Coordination' },
            ],
          },
        ],
      },
      {
        id: 'hist-2001-8',
        title: 'Civilian harm fog',
        briefing:
          'Strike claims conflict. Local legitimacy can die from one wrong compound. Your ROE and story must match.',
        stakes:
          'Precision without trust is still failure.',
        choices: [
          {
            id: 'hist-2001-8a',
            label: 'Tighten ROE and fund rapid ex gratia payments',
            detail: 'Restraint plus repair.',
            kind: 'legal',
            markerId: 'camp',
            short: 'ROE2',
            effects: [
              { tag: 'civilian_cost', weight: -2, summary: 'Less harm' },
              { tag: 'credibility', weight: 1, summary: 'Accountability' },
              { tag: 'deterrence', weight: -1, summary: 'Slower ops' },
            ],
          },
          {
            id: 'hist-2001-8b',
            label: 'Prioritize tempo; accept higher collateral risk',
            detail: 'Speed.',
            kind: 'kinetic',
            markerId: 'mine',
            short: 'TEMPO',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Pressure' },
              { tag: 'civilian_cost', weight: 3, summary: 'Harm' },
              { tag: 'polarization', weight: 1, summary: 'Local hatred' },
            ],
          },
          {
            id: 'hist-2001-8c',
            label: 'Invite partner observers on contested strikes',
            detail: 'Shared eyes.',
            kind: 'diplomatic',
            markerId: 'convoy',
            short: 'OBS4',
            effects: [
              { tag: 'alliance_cohesion', weight: 1, summary: 'Trust' },
              { tag: 'credibility', weight: 1, summary: 'Process' },
              { tag: 'time', weight: -1, summary: 'Friction' },
            ],
          },
        ],
      },
      {
        id: 'hist-2001-9',
        title: 'Day-after off-ramp',
        briefing:
          'A transitional authority concept appears. Owning it means years; abandoning it means spoiler return.',
        stakes:
          'Exit is a form of strategy.',
        choices: [
          {
            id: 'hist-2001-9a',
            label: 'Back a broad transitional authority with UN scaffolding',
            detail: 'Institutional day-after.',
            kind: 'diplomatic',
            markerId: 'capital',
            short: 'TRANSIT',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Legitimacy path' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Shared' },
              { tag: 'time', weight: 1, summary: 'Process' },
            ],
          },
          {
            id: 'hist-2001-9b',
            label: 'Empower a narrow fighting coalition and exit combat role fast',
            detail: 'Light footprint.',
            kind: 'kinetic',
            markerId: 'border',
            short: 'LIGHT',
            effects: [
              { tag: 'time', weight: 2, summary: 'Faster exit' },
              { tag: 'escalation', weight: -1, summary: 'Less own war' },
              { tag: 'civilian_cost', weight: 1, summary: 'Governance gap' },
            ],
          },
          {
            id: 'hist-2001-9c',
            label: 'Commit to multi-year security assistance with metrics',
            detail: 'Long leash.',
            kind: 'political',
            markerId: 'camp',
            short: 'YEARS',
            effects: [
              { tag: 'deterrence', weight: 1, summary: 'Stay power' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Partnering' },
              { tag: 'domestic_support', weight: -1, summary: 'Forever fear' },
            ],
          },
        ],
      },
      {
        id: 'hist-2001-10',
        title: 'Intervention doctrine endgame',
        briefing:
          'Cabinet wants rules for the next 9/11-like shock: punishment raids versus occupation, unilateral versus coalition.',
        stakes:
          'Doctrine written in grief lasts.',
        choices: [
          {
            id: 'hist-2001-10a',
            label: 'Codify coalition-first, limited aims, measurable exits',
            detail: 'Restrained template.',
            kind: 'political',
            markerId: 'capital',
            short: 'TEMPLATE',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Clear rules' },
              { tag: 'alliance_cohesion', weight: 2, summary: 'Partners prefer' },
              { tag: 'escalation', weight: -1, summary: 'Limits' },
            ],
          },
          {
            id: 'hist-2001-10b',
            label: 'Preserve unilateral freedom for imminent threats',
            detail: 'Speed doctrine.',
            kind: 'kinetic',
            markerId: 'mine',
            short: 'UNILAT3',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Fast option' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Suspicion' },
              { tag: 'norm_erosion', weight: 1, summary: 'Fewer brakes' },
            ],
          },
          {
            id: 'hist-2001-10c',
            label: 'Shift primary effort to law enforcement and finance tools',
            detail: 'Police the network.',
            kind: 'legal',
            markerId: 'radio',
            short: 'LAWFARE',
            effects: [
              { tag: 'diplomacy', weight: 1, summary: 'Non-war tools' },
              { tag: 'escalation', weight: -1, summary: 'Less kinetic' },
              { tag: 'credibility', weight: 1, summary: 'Another toolkit' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'hist-2008-lehman',
    year: 2008,
    era: '2008–2026',
    title: 'Lehman Weekend',
    region: 'Wall Street · Treasuries · global interbank',
    meterFamily: 'economy',
    theaterArchetype: 'markets',
    premise:
      'A cascading financial failure forces choices on bailouts, nationalizations, and whether to let a legendary firm die. You advise a finance ministry through a weekend that will define a decade.',
    role: 'Treasury crisis chief of staff',
    tension:
      'Prevent systemic collapse without making failure costless for the powerful.',
    beats: [
      {
        id: 'hist-2008-1',
        title: 'Sunday night firm',
        briefing:
          'A major investment bank cannot open Monday. Buyers want government guarantees.',
        stakes:
          'Guarantees socialize risk in hours.',
        choices: [
          {
            id: 'hist-2008-1a',
            label: 'Broker a sale with temporary public guarantees',
            detail: 'Private face, public balance sheet.',
            kind: 'economic',
            markerId: 'exchange',
            short: 'SALE',
            effects: [
              { tag: 'market_stability', weight: 2, summary: 'Opens Monday' },
              { tag: 'credibility', weight: -1, summary: 'Bailout politics' },
              { tag: 'norm_erosion', weight: 1, summary: 'Moral hazard' },
            ],
          },
          {
            id: 'hist-2008-1b',
            label: 'Refuse guarantees; allow orderly bankruptcy',
            detail: 'Let it fail.',
            kind: 'legal',
            markerId: 'treasury',
            short: 'FAIL',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'No blank check' },
              { tag: 'market_stability', weight: -3, summary: 'Contagion risk' },
              { tag: 'polarization', weight: 1, summary: 'Populist fuel later' },
            ],
          },
          {
            id: 'hist-2008-1c',
            label: 'Temporary public conservatorship',
            detail: 'Nationalize bridge.',
            kind: 'political',
            markerId: 'fed',
            short: 'CONSERV',
            effects: [
              { tag: 'market_stability', weight: 2, summary: 'Stabilizes' },
              { tag: 'governability', weight: 1, summary: 'Control' },
              { tag: 'domestic_support', weight: -2, summary: 'Socialism charge' },
            ],
          },
        ],
      },
      {
        id: 'hist-2008-2',
        title: 'Interbank freeze',
        briefing:
          'Banks stop lending to each other. Commercial paper dies.',
        stakes:
          'The real economy is days from payroll failure.',
        choices: [
          {
            id: 'hist-2008-2a',
            label: 'Unlimited liquidity to solvent banks',
            detail: 'Open the window wide.',
            kind: 'economic',
            markerId: 'fed',
            short: 'LIQUID',
            effects: [
              { tag: 'market_stability', weight: 3, summary: 'Thaws markets' },
              { tag: 'credibility', weight: -1, summary: 'Inflation fears' },
              { tag: 'time', weight: 1, summary: 'Buys days' },
            ],
          },
          {
            id: 'hist-2008-2b',
            label: 'Guarantee money-market funds',
            detail: 'Stop the retail run.',
            kind: 'economic',
            markerId: 'desk',
            short: 'MMF',
            effects: [
              { tag: 'social_calm', weight: 2, summary: 'Household calm' },
              { tag: 'market_stability', weight: 2, summary: 'Stops run' },
              { tag: 'norm_erosion', weight: 1, summary: 'New backstop' },
            ],
          },
          {
            id: 'hist-2008-2c',
            label: 'Targeted paper facility only; no broad guarantees',
            detail: 'Narrow tool.',
            kind: 'economic',
            markerId: 'treasury',
            short: 'PAPER',
            effects: [
              { tag: 'market_stability', weight: 1, summary: 'Partial' },
              { tag: 'credibility', weight: 1, summary: 'Limited' },
              { tag: 'civilian_cost', weight: 1, summary: 'Some payroll risk' },
            ],
          },
        ],
      },
      {
        id: 'hist-2008-3',
        title: 'Fiscal package fight',
        briefing:
          'Congress wants limits, clawbacks, and homeowner relief. Banks want capital fast and quiet.',
        stakes:
          'Speed and fairness collide.',
        choices: [
          {
            id: 'hist-2008-3a',
            label: 'Capital injections with warrants and executive caps',
            detail: 'Tough aid.',
            kind: 'legal',
            markerId: 'treasury',
            short: 'CAPITAL',
            effects: [
              { tag: 'market_stability', weight: 2, summary: 'Recap' },
              { tag: 'credibility', weight: 1, summary: 'Accountability' },
              { tag: 'domestic_support', weight: 1, summary: 'Caps land' },
            ],
          },
          {
            id: 'hist-2008-3b',
            label: 'Asset purchases to clear toxic books',
            detail: 'Buy the sludge.',
            kind: 'economic',
            markerId: 'exchange',
            short: 'TARP',
            effects: [
              { tag: 'market_stability', weight: 2, summary: 'Clears uncertainty' },
              { tag: 'credibility', weight: -1, summary: 'Opaque pricing' },
              { tag: 'polarization', weight: 1, summary: 'Wall Street first' },
            ],
          },
          {
            id: 'hist-2008-3c',
            label: 'Homeowner restructuring mandate first',
            detail: 'Main Street optics.',
            kind: 'civic',
            markerId: 'em',
            short: 'HOMES',
            effects: [
              { tag: 'social_calm', weight: 2, summary: 'Households' },
              { tag: 'market_stability', weight: -1, summary: 'Slower bank fix' },
              { tag: 'domestic_support', weight: 2, summary: 'Fairness story' },
            ],
          },
        ],
      },
      {
        id: 'hist-2008-4',
        title: 'Global coordination',
        briefing:
          'Partners want a joint statement on deposit guarantees and stimulus. Defecting looks tempting.',
        stakes:
          'A crisis is a coordination game.',
        choices: [
          {
            id: 'hist-2008-4a',
            label: 'Lead a synchronized guarantee and stimulus pledge',
            detail: 'No beggar-thy-neighbor.',
            kind: 'diplomatic',
            markerId: 'fed',
            short: 'SYNC',
            effects: [
              { tag: 'alliance_cohesion', weight: 2, summary: 'G-joint action' },
              { tag: 'market_stability', weight: 2, summary: 'Confidence' },
              { tag: 'diplomacy', weight: 1, summary: 'Leadership' },
            ],
          },
          {
            id: 'hist-2008-4b',
            label: 'National measures first; coordinate later',
            detail: 'Own voters first.',
            kind: 'political',
            markerId: 'treasury',
            short: 'NATIONAL',
            effects: [
              { tag: 'domestic_support', weight: 1, summary: 'Sovereignty' },
              { tag: 'market_stability', weight: -1, summary: 'Fragmentation' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Partners annoyed' },
            ],
          },
          {
            id: 'hist-2008-4c',
            label: 'Push banking union / joint supervision ideas',
            detail: 'Institutional leap.',
            kind: 'legal',
            markerId: 'desk',
            short: 'UNION',
            effects: [
              { tag: 'eu_cohesion', weight: 2, summary: 'If Europe follows' },
              { tag: 'time', weight: 2, summary: 'Slow build' },
              { tag: 'credibility', weight: 1, summary: 'Architecture' },
            ],
          },
        ],
      },
      {
        id: 'hist-2008-5',
        title: 'Money-market break-the-buck shock',
        briefing:
          'A flagship fund breaks. Without a guarantee, the real economy’s cash management freezes.',
        stakes:
          'Plumbing panic becomes Main Street.',
        choices: [
          {
            id: 'hist-2008-5a',
            label: 'Guarantee money-market funds temporarily',
            detail: 'Stop the run.',
            kind: 'economic',
            markerId: 'fed',
            short: 'MMFG',
            effects: [
              { tag: 'market_stability', weight: 3, summary: 'Run stops' },
              { tag: 'credibility', weight: -1, summary: 'Moral hazard' },
              { tag: 'polarization', weight: 1, summary: 'Bailout politics' },
            ],
          },
          {
            id: 'hist-2008-5b',
            label: 'Let funds gate redemptions without a public guarantee',
            detail: 'Private brake.',
            kind: 'economic',
            markerId: 'desk',
            short: 'GATE',
            effects: [
              { tag: 'market_stability', weight: -1, summary: 'Friction' },
              { tag: 'credibility', weight: 1, summary: 'Less taxpayer' },
              { tag: 'civilian_cost', weight: 1, summary: 'Cash stuck' },
            ],
          },
          {
            id: 'hist-2008-5c',
            label: 'Force sponsor recapitalizations under threat of resolution',
            detail: 'Accountability.',
            kind: 'legal',
            markerId: 'treasury',
            short: 'SPONSOR',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Costs on owners' },
              { tag: 'market_stability', weight: 1, summary: 'If it works' },
              { tag: 'time', weight: -1, summary: 'Negotiation' },
            ],
          },
        ],
      },
      {
        id: 'hist-2008-6',
        title: 'Main Street rage politics',
        briefing:
          'Taxpayers see Wall Street rescued first. Your fiscal package dies without a fairness story.',
        stakes:
          'Political economy is the constraint set.',
        choices: [
          {
            id: 'hist-2008-6a',
            label: 'Attach executive-pay and equity warrants to any aid',
            detail: 'Fairness tools.',
            kind: 'political',
            markerId: 'treasury',
            short: 'WARRANTS',
            effects: [
              { tag: 'domestic_support', weight: 2, summary: 'Fairness' },
              { tag: 'market_stability', weight: 1, summary: 'Aid possible' },
              { tag: 'credibility', weight: 1, summary: 'Skin in game' },
            ],
          },
          {
            id: 'hist-2008-6b',
            label: 'Prioritize speed; defer fairness conditions',
            detail: 'Fire first.',
            kind: 'economic',
            markerId: 'fed',
            short: 'SPEED',
            effects: [
              { tag: 'market_stability', weight: 2, summary: 'Fast' },
              { tag: 'polarization', weight: 2, summary: 'Rage' },
              { tag: 'domestic_support', weight: -2, summary: 'Bailout stain' },
            ],
          },
          {
            id: 'hist-2008-6c',
            label: 'Lead with household foreclosure relief optics first',
            detail: 'Main Street first.',
            kind: 'civic',
            markerId: 'em',
            short: 'HOUSING',
            effects: [
              { tag: 'social_calm', weight: 2, summary: 'Optics' },
              { tag: 'civilian_cost', weight: -1, summary: 'Some relief' },
              { tag: 'market_stability', weight: -1, summary: 'Banks wait' },
            ],
          },
        ],
      },
      {
        id: 'hist-2008-7',
        title: 'Cross-border coordination ask',
        briefing:
          'Europe wants consistent guarantees; inconsistent national schemes pull deposits across borders.',
        stakes:
          'One market, many treasuries.',
        choices: [
          {
            id: 'hist-2008-7a',
            label: 'Align guarantee language in a 48-hour concert',
            detail: 'One signal.',
            kind: 'diplomatic',
            markerId: 'fed',
            short: 'CONCERT',
            effects: [
              { tag: 'alliance_cohesion', weight: 3, summary: 'Official unity' },
              { tag: 'market_stability', weight: 2, summary: 'Less shopping' },
              { tag: 'diplomacy', weight: 1, summary: 'Deal' },
            ],
          },
          {
            id: 'hist-2008-7b',
            label: 'Go national and accept temporary fragmentation',
            detail: 'Sovereignty.',
            kind: 'economic',
            markerId: 'treasury',
            short: 'NATL2',
            effects: [
              { tag: 'time', weight: 1, summary: 'Faster local' },
              { tag: 'market_stability', weight: -2, summary: 'Fragmentation' },
              { tag: 'alliance_cohesion', weight: -2, summary: 'Blame' },
            ],
          },
          {
            id: 'hist-2008-7c',
            label: 'Create a temporary FX and swap mega-facility first',
            detail: 'Dollar liquidity.',
            kind: 'economic',
            markerId: 'exchange',
            short: 'SWAPMEGA',
            effects: [
              { tag: 'market_stability', weight: 3, summary: 'Dollar calm' },
              { tag: 'alliance_cohesion', weight: 2, summary: 'Shared pipes' },
              { tag: 'credibility', weight: 1, summary: 'Central banks' },
            ],
          },
        ],
      },
      {
        id: 'hist-2008-8',
        title: 'Solvency versus liquidity fog',
        briefing:
          'Some firms are illiquid; some are dead. Treating corpses as patients wastes capital; treating patients as corpses deepens panic.',
        stakes:
          'Triage under uncertainty.',
        choices: [
          {
            id: 'hist-2008-8a',
            label: 'Stand up a public-private triage facility with haircuts',
            detail: 'Structured judgment.',
            kind: 'economic',
            markerId: 'desk',
            short: 'TRIAGE2',
            effects: [
              { tag: 'market_stability', weight: 2, summary: 'Clearing' },
              { tag: 'credibility', weight: 1, summary: 'Discipline' },
              { tag: 'time', weight: 1, summary: 'Process' },
            ],
          },
          {
            id: 'hist-2008-8b',
            label: 'Assume systemic liquidity and flood broadly',
            detail: 'Hose first.',
            kind: 'economic',
            markerId: 'fed',
            short: 'HOSE',
            effects: [
              { tag: 'market_stability', weight: 2, summary: 'Calm' },
              { tag: 'credibility', weight: -1, summary: 'Zombie risk' },
              { tag: 'polarization', weight: 1, summary: 'Blank check fear' },
            ],
          },
          {
            id: 'hist-2008-8c',
            label: 'Resolve the weakest quickly to scare the rest into raising capital',
            detail: 'Example.',
            kind: 'legal',
            markerId: 'treasury',
            short: 'RESOLVE',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Discipline' },
              { tag: 'market_stability', weight: -2, summary: 'Fear spike' },
              { tag: 'escalation', weight: 1, summary: 'Contagion risk' },
            ],
          },
        ],
      },
      {
        id: 'hist-2008-9',
        title: 'Fiscal off-ramp',
        briefing:
          'A stimulus-plus-stability package can pass if sold as temporary and audited. Spoilers want purity or revenge.',
        stakes:
          'Congress is part of the crisis committee.',
        choices: [
          {
            id: 'hist-2008-9a',
            label: 'Push a temporary, audited, bipartisan package',
            detail: 'Grand bargain lite.',
            kind: 'political',
            markerId: 'treasury',
            short: 'PACKAGE2',
            effects: [
              { tag: 'governability', weight: 2, summary: 'Votes' },
              { tag: 'market_stability', weight: 2, summary: 'Fiscal backstop' },
              { tag: 'domestic_support', weight: 1, summary: 'Process' },
            ],
          },
          {
            id: 'hist-2008-9b',
            label: 'Rely on monetary tools alone to avoid fiscal fight',
            detail: 'Central bank only.',
            kind: 'economic',
            markerId: 'fed',
            short: 'MONONLY',
            effects: [
              { tag: 'market_stability', weight: 1, summary: 'Some help' },
              { tag: 'polarization', weight: -1, summary: 'Less congress war' },
              { tag: 'credibility', weight: -1, summary: 'Limits of money' },
            ],
          },
          {
            id: 'hist-2008-9c',
            label: 'Attach industrial policy riders to buy votes',
            detail: 'Logroll.',
            kind: 'political',
            markerId: 'em',
            short: 'LOGROLL',
            effects: [
              { tag: 'governability', weight: 1, summary: 'Passes' },
              { tag: 'credibility', weight: -1, summary: 'Pork' },
              { tag: 'market_stability', weight: 1, summary: 'Something passes' },
            ],
          },
        ],
      },
      {
        id: 'hist-2008-10',
        title: 'Macroprudential endgame',
        briefing:
          'After the fire, you choose: bigger capital, resolution regimes, or “never bail again” pledges that markets may not believe.',
        stakes:
          'Credibility about the next bailout is the reform.',
        choices: [
          {
            id: 'hist-2008-10a',
            label: 'Build living wills and resolution authority for giants',
            detail: 'Failability.',
            kind: 'legal',
            markerId: 'treasury',
            short: 'LIVING',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Can fail' },
              { tag: 'market_stability', weight: 1, summary: 'Clearer' },
              { tag: 'norm_protection', weight: 1, summary: 'Rule of law' },
            ],
          },
          {
            id: 'hist-2008-10b',
            label: 'Raise capital and liquidity ratios hard',
            detail: 'Buffers.',
            kind: 'economic',
            markerId: 'fed',
            short: 'BUFFERS',
            effects: [
              { tag: 'market_stability', weight: 2, summary: 'Safer banks' },
              { tag: 'polarization', weight: 1, summary: 'Credit squeeze fight' },
              { tag: 'credibility', weight: 1, summary: 'Prudence' },
            ],
          },
          {
            id: 'hist-2008-10c',
            label: 'Pledge no more bailouts without new tools to make it true',
            detail: 'Words plus gears.',
            kind: 'political',
            markerId: 'desk',
            short: 'NOMORE',
            effects: [
              { tag: 'domestic_support', weight: 2, summary: 'Popular' },
              { tag: 'credibility', weight: -1, summary: 'If tools weak' },
              { tag: 'market_stability', weight: -1, summary: 'Uncertainty' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'hist-2011-squares',
    year: 2011,
    era: '2008–2026',
    title: 'Square and Square',
    region: 'Arab capitals · Mediterranean · alliance desks',
    meterFamily: 'politics',
    theaterArchetype: 'redsea',
    premise:
      'Mass protests topple and threaten regimes across the region. You advise on when to endorse transitions, whether to intervene from the air, and how to handle migrant and energy shocks.',
    role: 'Regional crisis director',
    tension:
      'Support dignity politics without owning chaos—or backing endless strongmen.',
    beats: [
      {
        id: 'hist-2011-1',
        title: 'First ally wobbles',
        briefing:
          'A long-standing partner uses live fire on crowds. Your public line will be replayed for years.',
        stakes:
          'Silence is a side.',
        choices: [
          {
            id: 'hist-2011-1a',
            label: 'Publicly condemn violence; urge orderly transition',
            detail: 'Break with the old.',
            kind: 'diplomatic',
            markerId: 'port',
            short: 'CONDEMN',
            effects: [
              { tag: 'norm_protection', weight: 2, summary: 'Rights line' },
              { tag: 'alliance_cohesion', weight: -2, summary: 'Other autocrats nervous' },
              { tag: 'credibility', weight: 1, summary: 'Clear' },
            ],
          },
          {
            id: 'hist-2011-1b',
            label: 'Private pressure; public caution',
            detail: 'Preserve channel.',
            kind: 'diplomatic',
            markerId: 'canal',
            short: 'PRIVATE',
            effects: [
              { tag: 'diplomacy', weight: 1, summary: 'Channel held' },
              { tag: 'credibility', weight: -1, summary: 'Looks complicit' },
              { tag: 'time', weight: 1, summary: 'Options' },
            ],
          },
          {
            id: 'hist-2011-1c',
            label: 'Back the partner as bulwark against chaos',
            detail: 'Order narrative.',
            kind: 'political',
            markerId: 'proxy',
            short: 'ORDER',
            effects: [
              { tag: 'escalation', weight: -1, summary: 'If it holds' },
              { tag: 'norm_erosion', weight: 2, summary: 'Repression enabled' },
              { tag: 'polarization', weight: 2, summary: 'Street rage' },
            ],
          },
        ],
      },
      {
        id: 'hist-2011-2',
        title: 'No-fly debate',
        briefing:
          'A coastal civil war triggers calls for air intervention under humanitarian cover.',
        stakes:
          'Airpower can stop a massacre and start an ownership problem.',
        choices: [
          {
            id: 'hist-2011-2a',
            label: 'Support a UN-mandated no-fly / civilian protection mission',
            detail: 'Multilateral force.',
            kind: 'kinetic',
            markerId: 'escort',
            short: 'NOFLY',
            effects: [
              { tag: 'norm_protection', weight: 2, summary: 'Protection claim' },
              { tag: 'escalation', weight: 2, summary: 'War joined' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'If authorized' },
            ],
          },
          {
            id: 'hist-2011-2b',
            label: 'Arms and intel to rebels only',
            detail: 'Indirect.',
            kind: 'economic',
            markerId: 'proxy',
            short: 'ARMS',
            effects: [
              { tag: 'escalation', weight: 2, summary: 'Proxy war' },
              { tag: 'credibility', weight: 1, summary: 'Not absent' },
              { tag: 'civilian_cost', weight: 1, summary: 'Weapon spread' },
            ],
          },
          {
            id: 'hist-2011-2c',
            label: 'Refuse intervention; maximize humanitarian corridors',
            detail: 'Aid not bombs.',
            kind: 'civic',
            markerId: 'port',
            short: 'AID',
            effects: [
              { tag: 'civilian_cost', weight: -1, summary: 'Some relief' },
              { tag: 'credibility', weight: -1, summary: 'Inaction charge' },
              { tag: 'diplomacy', weight: 1, summary: 'Humanitarian frame' },
            ],
          },
        ],
      },
      {
        id: 'hist-2011-3',
        title: 'Islamist victories at ballot boxes',
        briefing:
          'Elections produce winners your publics distrust. Do you respect results, condition aid, or cultivate deep-state alternatives?',
        stakes:
          'Democracy is a stress test of your preferences.',
        choices: [
          {
            id: 'hist-2011-3a',
            label: 'Recognize results; condition aid on rights benchmarks',
            detail: 'Engage and bind.',
            kind: 'diplomatic',
            markerId: 'canal',
            short: 'ENGAGE',
            effects: [
              { tag: 'democratic_mandate', weight: 2, summary: 'Respect votes' },
              { tag: 'norm_protection', weight: 1, summary: 'Rights link' },
              { tag: 'domestic_support', weight: -1, summary: 'Home skeptics' },
            ],
          },
          {
            id: 'hist-2011-3b',
            label: 'Freeze aid until cabinets exclude hardliners',
            detail: 'Shape politics.',
            kind: 'economic',
            markerId: 'insurer',
            short: 'FREEZE',
            effects: [
              { tag: 'economic_pressure', weight: 2, summary: 'Leverage' },
              { tag: 'democratic_mandate', weight: -2, summary: 'Undercuts vote' },
              { tag: 'polarization', weight: 2, summary: 'Foreign hand charge' },
            ],
          },
          {
            id: 'hist-2011-3c',
            label: 'Quietly back secular security elites',
            detail: 'Insurance policy.',
            kind: 'political',
            markerId: 'proxy',
            short: 'DEEP',
            effects: [
              { tag: 'governability', weight: 1, summary: 'Short order' },
              { tag: 'norm_erosion', weight: 2, summary: 'Anti-democratic' },
              { tag: 'credibility', weight: -1, summary: 'Hypocrisy' },
            ],
          },
        ],
      },
      {
        id: 'hist-2011-4',
        title: 'Migration and energy aftershock',
        briefing:
          'Flows across the sea and price spikes hit your domestic politics.',
        stakes:
          'Foreign policy becomes home politics overnight.',
        choices: [
          {
            id: 'hist-2011-4a',
            label: 'EU-style burden-sharing and search-and-rescue surge',
            detail: 'Collective response.',
            kind: 'civic',
            markerId: 'chokepoint',
            short: 'RESCUE',
            effects: [
              { tag: 'eu_cohesion', weight: 2, summary: 'Shared burden' },
              { tag: 'social_calm', weight: 1, summary: 'Managed flows' },
              { tag: 'civilian_cost', weight: -1, summary: 'Lives saved' },
            ],
          },
          {
            id: 'hist-2011-4b',
            label: 'Bilateral interception deals with origin/transit states',
            detail: 'Externalize.',
            kind: 'diplomatic',
            markerId: 'port',
            short: 'DEALS',
            effects: [
              { tag: 'social_calm', weight: 1, summary: 'Lower arrivals' },
              { tag: 'norm_erosion', weight: 1, summary: 'Rights risk' },
              { tag: 'credibility', weight: -1, summary: 'Cynical optics' },
            ],
          },
          {
            id: 'hist-2011-4c',
            label: 'Strategic petroleum + targeted resettlement quota',
            detail: 'Dual cushion.',
            kind: 'economic',
            markerId: 'insurer',
            short: 'DUAL',
            effects: [
              { tag: 'market_stability', weight: 2, summary: 'Energy calm' },
              { tag: 'liberal_trust', weight: 1, summary: 'Quota openness' },
              { tag: 'domestic_support', weight: -1, summary: 'Quota politics' },
            ],
          },
        ],
      },
      {
        id: 'hist-2011-5',
        title: 'Regime-violence shock',
        briefing:
          'Live feeds show lethal force against crowds. Your recognition and intervention clocks accelerate under moral and strategic pressure.',
        stakes:
          'Images collapse decision time.',
        choices: [
          {
            id: 'hist-2011-5a',
            label: 'Lead a sanctions-plus-ICC referral package',
            detail: 'Law and costs.',
            kind: 'legal',
            markerId: 'port',
            short: 'ICC',
            effects: [
              { tag: 'norm_protection', weight: 2, summary: 'Accountability' },
              { tag: 'economic_pressure', weight: 2, summary: 'Costs' },
              { tag: 'diplomacy', weight: 1, summary: 'Coalition path' },
            ],
          },
          {
            id: 'hist-2011-5b',
            label: 'Move toward a no-fly / civilian-protection mandate',
            detail: 'Air power.',
            kind: 'kinetic',
            markerId: 'escort',
            short: 'NFZ',
            effects: [
              { tag: 'escalation', weight: 2, summary: 'War entry' },
              { tag: 'civilian_cost', weight: -1, summary: 'Some protection' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'If authorized' },
            ],
          },
          {
            id: 'hist-2011-5c',
            label: 'Limit to evacuation and humanitarian corridors',
            detail: 'Narrow duty.',
            kind: 'diplomatic',
            markerId: 'canal',
            short: 'HUMCOR',
            effects: [
              { tag: 'civilian_cost', weight: -2, summary: 'People out' },
              { tag: 'escalation', weight: -1, summary: 'Limited' },
              { tag: 'credibility', weight: -1, summary: 'Inaction charge' },
            ],
          },
        ],
      },
      {
        id: 'hist-2011-6',
        title: 'Domestic war-appetite politics',
        briefing:
          'Publics cheer values until body bags. Your mandate language must survive month three.',
        stakes:
          'Democracies overpromise in week one.',
        choices: [
          {
            id: 'hist-2011-6a',
            label: 'Write a narrow civilian-protection mandate with reporting',
            detail: 'Limits in law.',
            kind: 'political',
            markerId: 'insurer',
            short: 'NARROW2',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Honest scope' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Sellable' },
              { tag: 'deterrence', weight: -1, summary: 'Less regime change' },
            ],
          },
          {
            id: 'hist-2011-6b',
            label: 'Embrace regime-change rhetoric to match the street',
            detail: 'Maximal story.',
            kind: 'civic',
            markerId: 'proxy',
            short: 'REGIME',
            effects: [
              { tag: 'domestic_support', weight: 2, summary: 'Moral clarity' },
              { tag: 'escalation', weight: 2, summary: 'Deeper war' },
              { tag: 'diplomacy', weight: -1, summary: 'Harder end' },
            ],
          },
          {
            id: 'hist-2011-6c',
            label: 'Keep rhetoric vague to hold a fragile coalition',
            detail: 'Ambiguity.',
            kind: 'diplomatic',
            markerId: 'chokepoint',
            short: 'VAGUE',
            effects: [
              { tag: 'alliance_cohesion', weight: 1, summary: 'Holds for now' },
              { tag: 'credibility', weight: -2, summary: 'Later whiplash' },
              { tag: 'time', weight: 1, summary: 'Flexibility' },
            ],
          },
        ],
      },
      {
        id: 'hist-2011-7',
        title: 'Regional ally divergence',
        briefing:
          'Partners split on Islamist electoral wins and monarchy stability. Your desk cannot please both.',
        stakes:
          'The region’s order vs. the region’s ballot.',
        choices: [
          {
            id: 'hist-2011-7a',
            label: 'Defend electoral outcomes if nonviolent and inclusive enough',
            detail: 'Ballot preference.',
            kind: 'diplomatic',
            markerId: 'port',
            short: 'BALLOT2',
            effects: [
              { tag: 'norm_protection', weight: 2, summary: 'Democracy' },
              { tag: 'alliance_cohesion', weight: -2, summary: 'Monarchies cold' },
              { tag: 'credibility', weight: 1, summary: 'Consistent' },
            ],
          },
          {
            id: 'hist-2011-7b',
            label: 'Back stability partners while urging reform timelines',
            detail: 'Order with homework.',
            kind: 'diplomatic',
            markerId: 'proxy',
            short: 'STABPART',
            effects: [
              { tag: 'alliance_cohesion', weight: 2, summary: 'Monarchies held' },
              { tag: 'norm_erosion', weight: 1, summary: 'Democracy deferred' },
              { tag: 'escalation', weight: -1, summary: 'Less chaos now' },
            ],
          },
          {
            id: 'hist-2011-7c',
            label: 'Stay neutral publicly; fund civil-society quietly',
            detail: 'Deniable values.',
            kind: 'civic',
            markerId: 'canal',
            short: 'CIVSOC',
            effects: [
              { tag: 'norm_protection', weight: 1, summary: 'Quiet help' },
              { tag: 'credibility', weight: -1, summary: 'Hypocrisy risk' },
              { tag: 'diplomacy', weight: 1, summary: 'Flexibility' },
            ],
          },
        ],
      },
      {
        id: 'hist-2011-8',
        title: 'Migration and energy fog',
        briefing:
          'Displacement spikes and energy routes wobble. Numbers conflict; fear fills the gaps.',
        stakes:
          'Secondary effects can outrun the original square.',
        choices: [
          {
            id: 'hist-2011-8a',
            label: 'Stand up burden-sharing resettlement and search-and-rescue',
            detail: 'Absorb humanely.',
            kind: 'civic',
            markerId: 'port',
            short: 'RESETL2',
            effects: [
              { tag: 'civilian_cost', weight: -2, summary: 'Lives' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Shared' },
              { tag: 'polarization', weight: 1, summary: 'Home backlash' },
            ],
          },
          {
            id: 'hist-2011-8b',
            label: 'Harden borders and prioritize energy contracts',
            detail: 'Control first.',
            kind: 'economic',
            markerId: 'insurer',
            short: 'HARDEN',
            effects: [
              { tag: 'market_stability', weight: 1, summary: 'Energy' },
              { tag: 'polarization', weight: 2, summary: 'Nativism' },
              { tag: 'civilian_cost', weight: 1, summary: 'Stranded people' },
            ],
          },
          {
            id: 'hist-2011-8c',
            label: 'Publish verified flow and price dashboards weekly',
            detail: 'Fight fog with data.',
            kind: 'diplomatic',
            markerId: 'chokepoint',
            short: 'DASH2',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Facts' },
              { tag: 'social_calm', weight: 1, summary: 'Less rumor' },
              { tag: 'time', weight: 1, summary: 'Attention' },
            ],
          },
        ],
      },
      {
        id: 'hist-2011-9',
        title: 'Transition off-ramp',
        briefing:
          'A negotiated exit for a wobbling ally appears—amnesty versus accountability. Spoilers prefer the battlefield.',
        stakes:
          'Justice sequencing is the bargain.',
        choices: [
          {
            id: 'hist-2011-9a',
            label: 'Broker exile-plus-asset deals to stop the killing',
            detail: 'Ugly peace.',
            kind: 'diplomatic',
            markerId: 'proxy',
            short: 'EXILE',
            effects: [
              { tag: 'escalation', weight: -2, summary: 'Guns down' },
              { tag: 'norm_erosion', weight: 1, summary: 'Impunity' },
              { tag: 'civilian_cost', weight: -2, summary: 'Lives saved' },
            ],
          },
          {
            id: 'hist-2011-9b',
            label: 'Insist on domestic trials before any exit deal',
            detail: 'Accountability first.',
            kind: 'legal',
            markerId: 'port',
            short: 'TRIALS2',
            effects: [
              { tag: 'norm_protection', weight: 2, summary: 'Justice' },
              { tag: 'diplomacy', weight: -1, summary: 'Harder deal' },
              { tag: 'escalation', weight: 1, summary: 'Fight continues' },
            ],
          },
          {
            id: 'hist-2011-9c',
            label: 'Support a technocratic interim without old elites or street vetoes',
            detail: 'Neither side fully wins.',
            kind: 'political',
            markerId: 'canal',
            short: 'TECHNO',
            effects: [
              { tag: 'governability', weight: 1, summary: 'Admin continuity' },
              { tag: 'polarization', weight: 1, summary: 'Both camps mad' },
              { tag: 'diplomacy', weight: 1, summary: 'Narrow path' },
            ],
          },
        ],
      },
      {
        id: 'hist-2011-10',
        title: 'Aftershock doctrine endgame',
        briefing:
          'Cabinet asks whether 2011 was a freedom wave to repeat, a cautionary tale, or a region-specific exception.',
        stakes:
          'The memo shapes the next square.',
        choices: [
          {
            id: 'hist-2011-10a',
            label: 'Codify civilian-protection criteria and exit metrics',
            detail: 'Rules for next time.',
            kind: 'political',
            markerId: 'escort',
            short: 'CRIT2',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Learned limits' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Shareable' },
              { tag: 'escalation', weight: -1, summary: 'Clearer brakes' },
            ],
          },
          {
            id: 'hist-2011-10b',
            label: 'Declare non-intervention except for direct threats',
            detail: 'Retrenchment.',
            kind: 'diplomatic',
            markerId: 'chokepoint',
            short: 'RETRENCH',
            effects: [
              { tag: 'escalation', weight: -2, summary: 'Fewer wars' },
              { tag: 'credibility', weight: -1, summary: 'Values gap' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Partners alone' },
            ],
          },
          {
            id: 'hist-2011-10c',
            label: 'Invest in prevention: mediation, jobs, and broadcast pluralism',
            detail: 'Upstream strategy.',
            kind: 'civic',
            markerId: 'insurer',
            short: 'UPSTREAM',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Prevention' },
              { tag: 'polarization', weight: -1, summary: 'Less fuel' },
              { tag: 'time', weight: 1, summary: 'Long game' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'hist-2014-crimea',
    year: 2014,
    era: '2008–2026',
    title: 'Peninsula Shock',
    region: 'Crimea · Donbas · NATO · energy corridors',
    meterFamily: 'conflict',
    theaterArchetype: 'europe',
    premise:
      'Unmarked forces and a snap referendum rewrite a European border. You advise on sanctions design, military reassurance, and whether to arm a partner under fire.',
    role: 'European security advisor',
    tension:
      'Impose costs for annexation without a direct great-power war.',
    beats: [
      {
        id: 'hist-2014-1',
        title: 'First 72 hours',
        briefing:
          'Facts on the ground harden. Options: sanctions sprint, military deployment to allies, or a diplomatic contact group.',
        stakes:
          'Speed signals whether borders still matter.',
        choices: [
          {
            id: 'hist-2014-1a',
            label: 'Immediate targeted sanctions on decision-makers',
            detail: 'Name and freeze.',
            kind: 'economic',
            markerId: 'brussels',
            short: 'SANCT',
            effects: [
              { tag: 'economic_pressure', weight: 2, summary: 'Personal cost' },
              { tag: 'credibility', weight: 1, summary: 'Fast' },
              { tag: 'escalation', weight: -1, summary: 'Non-kinetic' },
            ],
          },
          {
            id: 'hist-2014-1b',
            label: 'Surge reassurance forces to exposed allies',
            detail: 'Tripwire politics.',
            kind: 'kinetic',
            markerId: 'streets',
            short: 'SURGE',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Alliance real' },
              { tag: 'alliance_cohesion', weight: 2, summary: 'Reassured' },
              { tag: 'escalation', weight: 1, summary: 'Posture up' },
            ],
          },
          {
            id: 'hist-2014-1c',
            label: 'Propose an emergency contact group including the aggressor',
            detail: 'Talk first.',
            kind: 'diplomatic',
            markerId: 'capital',
            short: 'CONTACT',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Table' },
              { tag: 'credibility', weight: -1, summary: 'Looks soft' },
              { tag: 'time', weight: 1, summary: 'Process' },
            ],
          },
        ],
      },
      {
        id: 'hist-2014-2',
        title: 'Energy leverage',
        briefing:
          'Pipeline politics cut both ways. Your industry fears winter; partners fear dependence.',
        stakes:
          'Sanctions without energy strategy leak.',
        choices: [
          {
            id: 'hist-2014-2a',
            label: 'Exempt energy; hit finance and tech',
            detail: 'Surgical pain.',
            kind: 'economic',
            markerId: 'parliament',
            short: 'EXEMPT',
            effects: [
              { tag: 'market_stability', weight: 1, summary: 'Winter cushion' },
              { tag: 'economic_pressure', weight: 1, summary: 'Partial' },
              { tag: 'credibility', weight: -1, summary: 'Half-measure charge' },
            ],
          },
          {
            id: 'hist-2014-2b',
            label: 'Phase energy import cuts with shared storage',
            detail: 'Collective wean.',
            kind: 'diplomatic',
            markerId: 'brussels',
            short: 'WEAN',
            effects: [
              { tag: 'alliance_cohesion', weight: 2, summary: 'Shared cost' },
              { tag: 'economic_pressure', weight: 2, summary: 'Real squeeze' },
              { tag: 'market_stability', weight: -1, summary: 'Price risk' },
            ],
          },
          {
            id: 'hist-2014-2c',
            label: 'Threaten full embargo immediately',
            detail: 'Maximal.',
            kind: 'economic',
            markerId: 'districts',
            short: 'EMBARGO',
            effects: [
              { tag: 'economic_pressure', weight: 3, summary: 'Hard hit' },
              { tag: 'market_stability', weight: -3, summary: 'Shock' },
              { tag: 'domestic_support', weight: -2, summary: 'Bills spike' },
            ],
          },
        ],
      },
      {
        id: 'hist-2014-3',
        title: 'Arming decision',
        briefing:
          'The partner asks for defensive heavy weapons. Some allies fear escalation; others fear another frozen defeat.',
        stakes:
          'Weapons are a strategy, not a gesture.',
        choices: [
          {
            id: 'hist-2014-3a',
            label: 'Provide defensive arms with training',
            detail: 'Raise cost of advance.',
            kind: 'kinetic',
            markerId: 'streets',
            short: 'ARMS',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Defense aided' },
              { tag: 'escalation', weight: 1, summary: 'Aid as stake' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'If coordinated' },
            ],
          },
          {
            id: 'hist-2014-3b',
            label: 'Non-lethal aid only',
            detail: 'Helmets and radars.',
            kind: 'diplomatic',
            markerId: 'ballot',
            short: 'NLETHAL',
            effects: [
              { tag: 'escalation', weight: -1, summary: 'Lower' },
              { tag: 'credibility', weight: -1, summary: 'Thin support' },
              { tag: 'civilian_cost', weight: -1, summary: 'Some protection' },
            ],
          },
          {
            id: 'hist-2014-3c',
            label: 'Condition arms on negotiation track participation',
            detail: 'Link tracks.',
            kind: 'diplomatic',
            markerId: 'capital',
            short: 'LINK',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Talks leverage' },
              { tag: 'deterrence', weight: -1, summary: 'Slower aid' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Partner frustration' },
            ],
          },
        ],
      },
      {
        id: 'hist-2014-4',
        title: 'Minsk-like bargain',
        briefing:
          'A ceasefire draft freezes lines and promises political status talks. Spoilers abound.',
        stakes:
          'A bad freeze can become the new border.',
        choices: [
          {
            id: 'hist-2014-4a',
            label: 'Back the ceasefire with monitoring mission',
            detail: 'Stop the killing first.',
            kind: 'diplomatic',
            markerId: 'brussels',
            short: 'MONITOR',
            effects: [
              { tag: 'escalation', weight: -2, summary: 'Quieter lines' },
              { tag: 'diplomacy', weight: 2, summary: 'Process' },
              { tag: 'credibility', weight: -1, summary: 'Frozen gains' },
            ],
          },
          {
            id: 'hist-2014-4b',
            label: 'Reject while occupation stands',
            detail: 'No legitimizing.',
            kind: 'political',
            markerId: 'parliament',
            short: 'REJECT',
            effects: [
              { tag: 'norm_protection', weight: 2, summary: 'No reward' },
              { tag: 'escalation', weight: 1, summary: 'Fight continues' },
              { tag: 'civilian_cost', weight: 1, summary: 'Ongoing toll' },
            ],
          },
          {
            id: 'hist-2014-4c',
            label: 'Accept freeze; escalate sanctions if violated',
            detail: 'Snapback logic.',
            kind: 'economic',
            markerId: 'districts',
            short: 'SNAP',
            effects: [
              { tag: 'economic_pressure', weight: 1, summary: 'Leverage held' },
              { tag: 'diplomacy', weight: 1, summary: 'Conditional' },
              { tag: 'time', weight: 1, summary: 'Tests compliance' },
            ],
          },
        ],
      },
      {
        id: 'hist-2014-5',
        title: 'Little-green-men fog',
        briefing:
          'Unmarked forces seize sites. Attribution is politically obvious and legally contested. Your first labeled word matters.',
        stakes:
          'Ambiguity is the invasion’s armor.',
        choices: [
          {
            id: 'hist-2014-5a',
            label: 'Attribute publicly with intelligence releases',
            detail: 'Name the actor.',
            kind: 'diplomatic',
            markerId: 'brussels',
            short: 'ATTRIB',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Clarity' },
              { tag: 'escalation', weight: 1, summary: 'Confrontation' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Shared fact' },
            ],
          },
          {
            id: 'hist-2014-5b',
            label: 'Keep language legalistic—“violations”—without naming',
            detail: 'Slow escalation.',
            kind: 'legal',
            markerId: 'parliament',
            short: 'LEGALIST',
            effects: [
              { tag: 'escalation', weight: -1, summary: 'Less heat' },
              { tag: 'credibility', weight: -1, summary: 'Evasion charge' },
              { tag: 'diplomacy', weight: 1, summary: 'Room' },
            ],
          },
          {
            id: 'hist-2014-5c',
            label: 'Demand immediate OSCE-like access as the test',
            detail: 'Process tripwire.',
            kind: 'diplomatic',
            markerId: 'capital',
            short: 'OSCE',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Access ask' },
              { tag: 'norm_protection', weight: 1, summary: 'Monitors' },
              { tag: 'time', weight: 1, summary: 'Clock' },
            ],
          },
        ],
      },
      {
        id: 'hist-2014-6',
        title: 'Energy and winter politics',
        briefing:
          'Gas leverage hits households. Solidarity costs money; folding teaches the wrong lesson.',
        stakes:
          'Pipelines are ballot issues.',
        choices: [
          {
            id: 'hist-2014-6a',
            label: 'Coordinate reverse flows and winter storage solidarity',
            detail: 'Share warmth.',
            kind: 'economic',
            markerId: 'brussels',
            short: 'REVERSE',
            effects: [
              { tag: 'alliance_cohesion', weight: 3, summary: 'Energy union' },
              { tag: 'market_stability', weight: 2, summary: 'Buffered' },
              { tag: 'civilian_cost', weight: -1, summary: 'Homes warmer' },
            ],
          },
          {
            id: 'hist-2014-6b',
            label: 'Negotiate a narrow commercial gas deal separately',
            detail: 'Delink.',
            kind: 'economic',
            markerId: 'capital',
            short: 'GASDEAL',
            effects: [
              { tag: 'market_stability', weight: 1, summary: 'Supply' },
              { tag: 'credibility', weight: -1, summary: 'Mixed signal' },
              { tag: 'diplomacy', weight: 1, summary: 'Channel' },
            ],
          },
          {
            id: 'hist-2014-6c',
            label: 'Accept higher prices as the cost of principle',
            detail: 'Pay for norms.',
            kind: 'political',
            markerId: 'streets',
            short: 'PAY',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Principled' },
              { tag: 'civilian_cost', weight: 2, summary: 'Bills' },
              { tag: 'polarization', weight: 1, summary: 'Anger' },
            ],
          },
        ],
      },
      {
        id: 'hist-2014-7',
        title: 'Arming ask',
        briefing:
          'Partners request defensive arms. Lethal aid can deter—or provide pretext. Training-only may be too little.',
        stakes:
          'Weapons are messages.',
        choices: [
          {
            id: 'hist-2014-7a',
            label: 'Authorize defensive lethal aid with end-use monitoring',
            detail: 'Teeth with rules.',
            kind: 'kinetic',
            markerId: 'districts',
            short: 'DEFENSE',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Costly advance' },
              { tag: 'escalation', weight: 2, summary: 'Aid as issue' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Partner held' },
            ],
          },
          {
            id: 'hist-2014-7b',
            label: 'Limit to non-lethal and intelligence support',
            detail: 'Soft help.',
            kind: 'diplomatic',
            markerId: 'brussels',
            short: 'NONLETH',
            effects: [
              { tag: 'escalation', weight: -1, summary: 'Lower pretext' },
              { tag: 'deterrence', weight: -1, summary: 'Weaker' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Partner underwhelmed' },
            ],
          },
          {
            id: 'hist-2014-7c',
            label: 'Lead with sanctions intensity instead of arms',
            detail: 'Economic theater.',
            kind: 'economic',
            markerId: 'parliament',
            short: 'SANC2',
            effects: [
              { tag: 'economic_pressure', weight: 3, summary: 'Costs' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'If unified' },
              { tag: 'market_stability', weight: -1, summary: 'Blowback' },
            ],
          },
        ],
      },
      {
        id: 'hist-2014-8',
        title: 'Referendum information fog',
        briefing:
          'A hurried poll under occupation claims consent. Debunking is necessary; obsessing can distract from Donbas guns.',
        stakes:
          'Fake consent still shapes narratives.',
        choices: [
          {
            id: 'hist-2014-8a',
            label: 'Issue a legal non-recognition doctrine immediately',
            detail: 'Paper shield.',
            kind: 'legal',
            markerId: 'brussels',
            short: 'NONREC2',
            effects: [
              { tag: 'norm_protection', weight: 3, summary: 'Conquest denied' },
              { tag: 'diplomacy', weight: 1, summary: 'Coalition tool' },
              { tag: 'credibility', weight: 2, summary: 'Clear line' },
            ],
          },
          {
            id: 'hist-2014-8b',
            label: 'Flood counter-messaging but avoid mirror referenda talk',
            detail: 'Narrative fight.',
            kind: 'civic',
            markerId: 'streets',
            short: 'COUNTER',
            effects: [
              { tag: 'polarization', weight: 1, summary: 'Info war' },
              { tag: 'credibility', weight: 1, summary: 'Rebuttal' },
              { tag: 'time', weight: 1, summary: 'Attention' },
            ],
          },
          {
            id: 'hist-2014-8c',
            label: 'Ignore the spectacle; focus resources on the active front',
            detail: 'Guns over ballots.',
            kind: 'kinetic',
            markerId: 'districts',
            short: 'FRONT',
            effects: [
              { tag: 'deterrence', weight: 1, summary: 'Priority clear' },
              { tag: 'norm_erosion', weight: 1, summary: 'Spectacle stands' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Legalists uneasy' },
            ],
          },
        ],
      },
      {
        id: 'hist-2014-9',
        title: 'Minsk-like off-ramp',
        briefing:
          'A ceasefire-plus-status formula appears. It can freeze gains or stop the dying. Spoilers prefer either purity or conquest.',
        stakes:
          'Freezes are peaces with expiration dates.',
        choices: [
          {
            id: 'hist-2014-9a',
            label: 'Back a ceasefire with monitors and delayed status talks',
            detail: 'Stop the guns first.',
            kind: 'diplomatic',
            markerId: 'brussels',
            short: 'CFIRST',
            effects: [
              { tag: 'escalation', weight: -2, summary: 'Pause' },
              { tag: 'diplomacy', weight: 2, summary: 'Process' },
              { tag: 'domestic_support', weight: -1, summary: 'Frozen injustice' },
            ],
          },
          {
            id: 'hist-2014-9b',
            label: 'Refuse any text that legitimizes territorial faits accomplis',
            detail: 'Purity.',
            kind: 'political',
            markerId: 'parliament',
            short: 'PURITY',
            effects: [
              { tag: 'norm_protection', weight: 2, summary: 'No reward' },
              { tag: 'escalation', weight: 1, summary: 'Fight continues' },
              { tag: 'diplomacy', weight: -1, summary: 'Less deal space' },
            ],
          },
          {
            id: 'hist-2014-9c',
            label: 'Accept a narrow local ceasefire only around critical cities',
            detail: 'Surgical pause.',
            kind: 'diplomatic',
            markerId: 'capital',
            short: 'LOCALCF',
            effects: [
              { tag: 'civilian_cost', weight: -1, summary: 'Some relief' },
              { tag: 'time', weight: 1, summary: 'Partial' },
              { tag: 'credibility', weight: -1, summary: 'Incomplete' },
            ],
          },
        ],
      },
      {
        id: 'hist-2014-10',
        title: 'European security endgame',
        briefing:
          'You write whether this is a regional crisis or a systemic challenge to the post-1945 map—and what budgets follow.',
        stakes:
          'Naming the problem funds the response.',
        choices: [
          {
            id: 'hist-2014-10a',
            label: 'Treat annexation as systemic; fund long deterrence adaptation',
            detail: 'Era marker.',
            kind: 'political',
            markerId: 'brussels',
            short: 'SYSTEMIC',
            effects: [
              { tag: 'deterrence', weight: 3, summary: 'Long posture' },
              { tag: 'alliance_cohesion', weight: 2, summary: 'NATO awaken' },
              { tag: 'escalation', weight: 1, summary: 'New normal confrontation' },
            ],
          },
          {
            id: 'hist-2014-10b',
            label: 'Contain as regional; keep global agendas primary',
            detail: 'Triage.',
            kind: 'diplomatic',
            markerId: 'capital',
            short: 'REGIONAL',
            effects: [
              { tag: 'time', weight: 1, summary: 'Bandwidth' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Frontline worry' },
              { tag: 'credibility', weight: -1, summary: 'Underweight' },
            ],
          },
          {
            id: 'hist-2014-10c',
            label: 'Prioritize energy transition and financial isolation tools',
            detail: 'Structural counters.',
            kind: 'economic',
            markerId: 'parliament',
            short: 'STRUCT',
            effects: [
              { tag: 'economic_pressure', weight: 2, summary: 'Long squeeze' },
              { tag: 'market_stability', weight: 1, summary: 'Transition' },
              { tag: 'diplomacy', weight: 1, summary: 'Non-kinetic' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'hist-2020-lockdown',
    year: 2020,
    era: '2008–2026',
    title: 'Lockdown Mandate',
    region: 'Global capitals · WHO · supply chains',
    meterFamily: 'politics',
    theaterArchetype: 'americas',
    premise:
      'A novel pathogen forces tradeoffs among mobility, livelihoods, and trust in institutions. You advise a national crisis cabinet on restrictions, fiscal bridges, and information integrity.',
    role: 'National pandemic coordinator',
    tension:
      'Save lives and livelihoods without shattering democratic consent.',
    beats: [
      {
        id: 'hist-2020-1',
        title: 'Restriction trigger',
        briefing:
          'Hospitals near capacity. Options: targeted limits, wide stay-home orders, or voluntary guidance only.',
        stakes:
          'Timing decides whether policy looks prudent or panicked.',
        choices: [
          {
            id: 'hist-2020-1a',
            label: 'Wide stay-home order with essential carve-outs',
            detail: 'Hard brake.',
            kind: 'civic',
            markerId: 'plaza',
            short: 'LOCK',
            effects: [
              { tag: 'civilian_cost', weight: -2, summary: 'Lives saved likely' },
              { tag: 'market_stability', weight: -2, summary: 'Output shock' },
              { tag: 'social_calm', weight: -1, summary: 'Compliance strain' },
            ],
          },
          {
            id: 'hist-2020-1b',
            label: 'Targeted limits by age/risk and venue',
            detail: 'Surgical.',
            kind: 'legal',
            markerId: 'court',
            short: 'TARGET',
            effects: [
              { tag: 'civilian_cost', weight: -1, summary: 'Partial protection' },
              { tag: 'market_stability', weight: -1, summary: 'Less shock' },
              { tag: 'credibility', weight: 1, summary: 'Proportionate try' },
            ],
          },
          {
            id: 'hist-2020-1c',
            label: 'Guidance only; protect hospitals via surge funding',
            detail: 'Voluntary.',
            kind: 'economic',
            markerId: 'imf',
            short: 'GUIDE',
            effects: [
              { tag: 'liberal_trust', weight: 1, summary: 'Freedom frame' },
              { tag: 'civilian_cost', weight: 2, summary: 'Higher spread risk' },
              { tag: 'domestic_support', weight: 1, summary: 'Anti-mandate voters' },
            ],
          },
        ],
      },
      {
        id: 'hist-2020-2',
        title: 'Fiscal bridge',
        briefing:
          'Unemployment spikes. Do you send cash broadly, bail sectors, or insist on austerity to protect debt markets?',
        stakes:
          'The cheque is a social contract.',
        choices: [
          {
            id: 'hist-2020-2a',
            label: 'Broad household cash transfers',
            detail: 'People first.',
            kind: 'economic',
            markerId: 'capital',
            short: 'CASH',
            effects: [
              { tag: 'social_calm', weight: 2, summary: 'Households held' },
              { tag: 'domestic_support', weight: 2, summary: 'Visible help' },
              { tag: 'market_stability', weight: -1, summary: 'Debt rise' },
            ],
          },
          {
            id: 'hist-2020-2b',
            label: 'Sector bailouts with worker retention conditions',
            detail: 'Firms as vehicles.',
            kind: 'economic',
            markerId: 'port',
            short: 'SECTOR',
            effects: [
              { tag: 'market_stability', weight: 2, summary: 'Payrolls' },
              { tag: 'credibility', weight: -1, summary: 'Corporate aid optics' },
              { tag: 'governability', weight: 1, summary: 'Admin channel' },
            ],
          },
          {
            id: 'hist-2020-2c',
            label: 'Narrow aid; prioritize debt and inflation optics',
            detail: 'Hard money story.',
            kind: 'political',
            markerId: 'imf',
            short: 'AUSTER',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Bond calm' },
              { tag: 'civilian_cost', weight: 2, summary: 'Hardship' },
              { tag: 'polarization', weight: 2, summary: 'Anger' },
            ],
          },
        ],
      },
      {
        id: 'hist-2020-3',
        title: 'Information integrity',
        briefing:
          'Rumors and foreign influence mix with genuine uncertainty. Platforms ask for guidance.',
        stakes:
          'Censorship fears versus harm reduction.',
        choices: [
          {
            id: 'hist-2020-3a',
            label: 'Public health board labels; no criminal speech rules',
            detail: 'Transparency tools.',
            kind: 'civic',
            markerId: 'plaza',
            short: 'LABEL',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Clear science' },
              { tag: 'liberal_trust', weight: 1, summary: 'Limited coercion' },
              { tag: 'polarization', weight: 1, summary: 'Label wars' },
            ],
          },
          {
            id: 'hist-2020-3b',
            label: 'Emergency takedown mandates for medical falsehoods',
            detail: 'Hard moderation.',
            kind: 'legal',
            markerId: 'court',
            short: 'TAKE',
            effects: [
              { tag: 'social_calm', weight: 1, summary: 'Less panic content' },
              { tag: 'liberal_trust', weight: -2, summary: 'Speech fear' },
              { tag: 'polarization', weight: 2, summary: 'Censorship narrative' },
            ],
          },
          {
            id: 'hist-2020-3c',
            label: 'Flood the zone with official briefings only',
            detail: 'Compete, don’t ban.',
            kind: 'political',
            markerId: 'capital',
            short: 'BRIEF',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'If consistent' },
              { tag: 'time', weight: 1, summary: 'Cadence' },
              { tag: 'polarization', weight: -1, summary: 'If trusted' },
            ],
          },
        ],
      },
      {
        id: 'hist-2020-4',
        title: 'Exit and equity',
        briefing:
          'Vaccines or treatments near. Distribution politics will define trust for a generation.',
        stakes:
          'The last mile is the legitimacy mile.',
        choices: [
          {
            id: 'hist-2020-4a',
            label: 'Risk-priority schedule with global COVAX contribution',
            detail: 'Domestic + global.',
            kind: 'diplomatic',
            markerId: 'imf',
            short: 'COVAX',
            effects: [
              { tag: 'norm_protection', weight: 1, summary: 'Global equity' },
              { tag: 'civilian_cost', weight: -2, summary: 'Protects vulnerable' },
              { tag: 'domestic_support', weight: -1, summary: 'Nationalist critique' },
            ],
          },
          {
            id: 'hist-2020-4b',
            label: 'Domestic-first until surplus',
            detail: 'Own citizens first.',
            kind: 'political',
            markerId: 'farm',
            short: 'FIRST',
            effects: [
              { tag: 'domestic_support', weight: 2, summary: 'National priority' },
              { tag: 'alliance_cohesion', weight: -2, summary: 'Partners bitter' },
              { tag: 'credibility', weight: -1, summary: 'Global leadership hit' },
            ],
          },
          {
            id: 'hist-2020-4c',
            label: 'Lottery plus essential-worker priority hybrid',
            detail: 'Fairness theater that works.',
            kind: 'civic',
            markerId: 'plaza',
            short: 'LOTTERY',
            effects: [
              { tag: 'social_calm', weight: 1, summary: 'Perceived fairness' },
              { tag: 'credibility', weight: 1, summary: 'Transparent' },
              { tag: 'polarization', weight: -1, summary: 'Less queue rage' },
            ],
          },
        ],
      },
      {
        id: 'hist-2020-5',
        title: 'Hospital overflow shock',
        briefing:
          'ICU capacity breaks in a major city. Your next order is triage policy wearing democratic clothes.',
        stakes:
          'Scarcity forces explicit values.',
        choices: [
          {
            id: 'hist-2020-5a',
            label: 'Surge field hospitals and reallocate staff nationally',
            detail: 'Move capacity.',
            kind: 'civic',
            markerId: 'capital',
            short: 'SURGE2',
            effects: [
              { tag: 'civilian_cost', weight: -2, summary: 'Lives' },
              { tag: 'governability', weight: 1, summary: 'State capacity' },
              { tag: 'market_stability', weight: -1, summary: 'Cost' },
            ],
          },
          {
            id: 'hist-2020-5b',
            label: 'Tighten stay-at-home orders in hotspots only',
            detail: 'Targeted stringency.',
            kind: 'political',
            markerId: 'plaza',
            short: 'HOTSPOT',
            effects: [
              { tag: 'civilian_cost', weight: -1, summary: 'Some reduction' },
              { tag: 'polarization', weight: 1, summary: 'Rule fights' },
              { tag: 'social_calm', weight: -1, summary: 'Anger' },
            ],
          },
          {
            id: 'hist-2020-5c',
            label: 'Publish transparent triage ethics guidelines',
            detail: 'Honest scarcity.',
            kind: 'legal',
            markerId: 'court',
            short: 'TRIAGE3',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Honesty' },
              { tag: 'norm_protection', weight: 1, summary: 'Process' },
              { tag: 'domestic_support', weight: -1, summary: 'Hard truths' },
            ],
          },
        ],
      },
      {
        id: 'hist-2020-6',
        title: 'Livelihood revolt politics',
        briefing:
          'Small businesses and workers demand openings. Public health warns of a second wave. Consent is the scarce good.',
        stakes:
          'A mandate without livelihoods collapses.',
        choices: [
          {
            id: 'hist-2020-6a',
            label: 'Pair restrictions with enriched fiscal bridges',
            detail: 'Pay for compliance.',
            kind: 'economic',
            markerId: 'imf',
            short: 'BRIDGE3',
            effects: [
              { tag: 'social_calm', weight: 2, summary: 'Consent bought' },
              { tag: 'market_stability', weight: 1, summary: 'Demand floor' },
              { tag: 'polarization', weight: -1, summary: 'Less revolt' },
            ],
          },
          {
            id: 'hist-2020-6b',
            label: 'Open faster and bet on voluntary caution',
            detail: 'Freedom frame.',
            kind: 'political',
            markerId: 'plaza',
            short: 'OPEN2',
            effects: [
              { tag: 'domestic_support', weight: 2, summary: 'Relief' },
              { tag: 'civilian_cost', weight: 2, summary: 'Health risk' },
              { tag: 'credibility', weight: -1, summary: 'If wave returns' },
            ],
          },
          {
            id: 'hist-2020-6c',
            label: 'Differentiate rules by age and risk with clear metrics',
            detail: 'Precision policy.',
            kind: 'civic',
            markerId: 'farm',
            short: 'RISK',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Targeted' },
              { tag: 'polarization', weight: 1, summary: 'Fairness fights' },
              { tag: 'civilian_cost', weight: -1, summary: 'Protect vulnerable' },
            ],
          },
        ],
      },
      {
        id: 'hist-2020-7',
        title: 'Supply-chain ally ask',
        briefing:
          'Partners want coordinated PPE and vaccine R&D sharing. Hoarding wins headlines and loses the pandemic.',
        stakes:
          'Health security is collective or performative.',
        choices: [
          {
            id: 'hist-2020-7a',
            label: 'Join a pooled procurement and export-restraint compact',
            detail: 'Share scarce goods.',
            kind: 'diplomatic',
            markerId: 'port',
            short: 'POOL2',
            effects: [
              { tag: 'alliance_cohesion', weight: 3, summary: 'Health alliance' },
              { tag: 'civilian_cost', weight: -1, summary: 'Wider supply' },
              { tag: 'diplomacy', weight: 1, summary: 'Rules' },
            ],
          },
          {
            id: 'hist-2020-7b',
            label: 'Prioritize national stockpiles; sell surplus later',
            detail: 'Nation first.',
            kind: 'economic',
            markerId: 'capital',
            short: 'STOCK',
            effects: [
              { tag: 'civilian_cost', weight: -1, summary: 'National buffer' },
              { tag: 'alliance_cohesion', weight: -2, summary: 'Partners bitter' },
              { tag: 'credibility', weight: -1, summary: 'Selfish' },
            ],
          },
          {
            id: 'hist-2020-7c',
            label: 'Fund joint vaccine platforms with IP flexibility clauses',
            detail: 'Science diplomacy.',
            kind: 'diplomatic',
            markerId: 'imf',
            short: 'VAX',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Shared R&D' },
              { tag: 'civilian_cost', weight: -2, summary: 'Faster tools' },
              { tag: 'time', weight: 1, summary: 'Horizon' },
            ],
          },
        ],
      },
      {
        id: 'hist-2020-8',
        title: 'Infodemic fog',
        briefing:
          'False cures and conspiracy content outrun official guidance. Over-censorship breeds mistrust; under-response kills.',
        stakes:
          'Speech governance under plague.',
        choices: [
          {
            id: 'hist-2020-8a',
            label: 'Partner with platforms on labeled health misinformation',
            detail: 'Friction, not bans only.',
            kind: 'civic',
            markerId: 'plaza',
            short: 'LABEL',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Correctives' },
              { tag: 'norm_erosion', weight: 1, summary: 'Speech fights' },
              { tag: 'social_calm', weight: 1, summary: 'Less panic' },
            ],
          },
          {
            id: 'hist-2020-8b',
            label: 'Flood official channels with daily plain-language briefs',
            detail: 'Compete on volume.',
            kind: 'political',
            markerId: 'capital',
            short: 'BRIEFS',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Presence' },
              { tag: 'time', weight: 1, summary: 'Attention' },
              { tag: 'polarization', weight: -1, summary: 'If trusted' },
            ],
          },
          {
            id: 'hist-2020-8c',
            label: 'Criminalize harmful medical falsehoods broadly',
            detail: 'Hard speech law.',
            kind: 'legal',
            markerId: 'court',
            short: 'CRIM',
            effects: [
              { tag: 'social_calm', weight: 1, summary: 'Short term' },
              { tag: 'norm_erosion', weight: 2, summary: 'Speech chill' },
              { tag: 'polarization', weight: 2, summary: 'Martyrs' },
            ],
          },
        ],
      },
      {
        id: 'hist-2020-9',
        title: 'Exit off-ramp',
        briefing:
          'A metrics-based reopening plan can restore consent—or become a political football if thresholds move.',
        stakes:
          'Predictable rules are a public good.',
        choices: [
          {
            id: 'hist-2020-9a',
            label: 'Lock a public dashboard with precommitted thresholds',
            detail: 'Rules over vibes.',
            kind: 'political',
            markerId: 'capital',
            short: 'DASH3',
            effects: [
              { tag: 'credibility', weight: 3, summary: 'Predictable' },
              { tag: 'governability', weight: 1, summary: 'Less ad hoc' },
              { tag: 'domestic_support', weight: 1, summary: 'Fairness' },
            ],
          },
          {
            id: 'hist-2020-9b',
            label: 'Keep executive discretion for fast pivots',
            detail: 'Flexibility.',
            kind: 'political',
            markerId: 'plaza',
            short: 'DISCRET',
            effects: [
              { tag: 'time', weight: 2, summary: 'Agile' },
              { tag: 'credibility', weight: -1, summary: 'Arbitrary feel' },
              { tag: 'polarization', weight: 1, summary: 'Trust fights' },
            ],
          },
          {
            id: 'hist-2020-9c',
            label: 'Regionalize exits with federal minimums only',
            detail: 'Federalism.',
            kind: 'civic',
            markerId: 'farm',
            short: 'REGN2',
            effects: [
              { tag: 'governability', weight: 1, summary: 'Local fit' },
              { tag: 'polarization', weight: 1, summary: 'Patchwork anger' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Uneven' },
            ],
          },
        ],
      },
      {
        id: 'hist-2020-10',
        title: 'Pandemic doctrine endgame',
        briefing:
          'You archive whether emergency powers were necessary exceptions or a template—and how to audit them.',
        stakes:
          'The next pathogen inherits your footnotes.',
        choices: [
          {
            id: 'hist-2020-10a',
            label: 'Sunset emergency powers with a statutory review board',
            detail: 'Democracy after plague.',
            kind: 'legal',
            markerId: 'court',
            short: 'SUNSET3',
            effects: [
              { tag: 'norm_protection', weight: 3, summary: 'Emergency ends' },
              { tag: 'credibility', weight: 2, summary: 'Self-limiting' },
              { tag: 'governability', weight: -1, summary: 'Slower next time' },
            ],
          },
          {
            id: 'hist-2020-10b',
            label: 'Keep standing bio-preparedness authorities funded',
            detail: 'Permanent capacity.',
            kind: 'political',
            markerId: 'capital',
            short: 'PREPARE',
            effects: [
              { tag: 'civilian_cost', weight: -1, summary: 'Ready' },
              { tag: 'governability', weight: 1, summary: 'Capacity' },
              { tag: 'polarization', weight: 1, summary: 'State power fear' },
            ],
          },
          {
            id: 'hist-2020-10c',
            label: 'Prioritize global surveillance and WHO reform investments',
            detail: 'Upstream international.',
            kind: 'diplomatic',
            markerId: 'imf',
            short: 'WHO',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Global pipes' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Shared' },
              { tag: 'credibility', weight: 1, summary: 'Lessons' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'hist-2024-hormuz-relapse',
    year: 2024,
    era: '2008–2026',
    title: 'Hormuz Relapse',
    region: 'Iran · Gulf · maritime corridors',
    meterFamily: 'conflict',
    theaterArchetype: 'gulf',
    premise:
      'After a strike cycle and reciprocal seizures at sea, tanker insurance rates spike and regional capitals demand clarity. You advise a coalition cabinet on the next 72 hours.',
    role: 'National security advisor to a coalition government',
    tension:
      'Deterrence without open war; energy markets without appearing to abandon partners.',
    beats: [
      {
        id: 'hist-2024-1',
        title: 'First move after the seizure',
        briefing:
          'A commercial tanker linked to a partner flag is held near the Strait. Your military can interdict the escort, your diplomats can open a quiet channel, or you can freeze related assets and wait for market pressure to speak.',
        stakes:
          'Speed signals resolve; restraint preserves off-ramps; economic pressure is slower but harder to reverse.',
        choices: [
          {
            id: 'hist-2024-1a',
            label: 'Authorize a limited interdiction escort',
            detail: 'Naval assets shadow and challenge the holding force. Rules of engagement stay defensive.',
            kind: 'naval',
            markerId: 'strait',
            short: 'ESCORT',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Shows willingness to contest the maritime commons' },
              { tag: 'escalation', weight: 2, summary: 'Raises risk of a kinetic incident at sea' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Reassures partners who feared paralysis' },
            ],
          },
          {
            id: 'hist-2024-1b',
            label: 'Open a quiet back channel',
            detail: 'Use a third-party capital to propose release in exchange for de-escalatory guarantees.',
            kind: 'diplomatic',
            markerId: 'tehran',
            short: 'CHANNEL',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Keeps a negotiated off-ramp alive' },
              { tag: 'credibility', weight: -1, summary: 'Some partners read delay as weakness' },
              { tag: 'escalation', weight: -1, summary: 'Lowers near-term kinetic risk' },
            ],
          },
          {
            id: 'hist-2024-1c',
            label: 'Freeze linked financial conduits',
            detail: 'Target insurers, ship managers, and payment rails without new kinetic posture.',
            kind: 'economic',
            markerId: 'dubai',
            short: 'FREEZE',
            effects: [
              { tag: 'economic_pressure', weight: 2, summary: 'Squeezes the seizure’s logistics chain' },
              { tag: 'civilian_cost', weight: 1, summary: 'Raises friction for regional trade more broadly' },
              { tag: 'time', weight: 1, summary: 'Buys days while markets reprice risk' },
            ],
          },
        ],
      },
      {
        id: 'hist-2024-2',
        title: 'Energy corridor panic',
        briefing:
          'Benchmark crude jumps. Domestic industry lobbies for emergency releases from strategic reserves. Partners ask whether you will join a coordinated naval traffic corridor.',
        stakes:
          'Market calm can reduce crisis leverage for spoilers — or signal that you will always absorb the shock.',
        choices: [
          {
            id: 'hist-2024-2a',
            label: 'Join a multinational traffic corridor',
            detail: 'Share escorts and routing intel with willing partners under a temporary charter.',
            kind: 'naval',
            markerId: 'hormuz',
            short: 'CORRIDOR',
            effects: [
              { tag: 'alliance_cohesion', weight: 2, summary: 'Locks partners into a shared operational frame' },
              { tag: 'deterrence', weight: 1, summary: 'Raises the cost of further seizures' },
              { tag: 'escalation', weight: 1, summary: 'Puts more ships in a contested lane' },
            ],
          },
          {
            id: 'hist-2024-2b',
            label: 'Release strategic petroleum quietly',
            detail: 'Calm prices without a public military announcement.',
            kind: 'economic',
            markerId: 'oil',
            short: 'SPR',
            effects: [
              { tag: 'market_stability', weight: 2, summary: 'Blunts panic premiums' },
              { tag: 'credibility', weight: -1, summary: 'Adversaries may treat you as shock absorber' },
              { tag: 'domestic_support', weight: 1, summary: 'Eases pressure from industry and consumers' },
            ],
          },
          {
            id: 'hist-2024-2c',
            label: 'Hold reserves; demand partner burden-sharing',
            detail: 'Condition any release on matching contributions and a joint statement of red lines.',
            kind: 'diplomatic',
            markerId: 'riyadh',
            short: 'SHARE',
            effects: [
              { tag: 'alliance_cohesion', weight: -1, summary: 'Frays goodwill among energy-importing partners' },
              { tag: 'credibility', weight: 1, summary: 'Signals you will not underwrite alone' },
              { tag: 'market_stability', weight: -1, summary: 'Leaves volatility unresolved longer' },
            ],
          },
        ],
      },
      {
        id: 'hist-2024-3',
        title: 'Proxy strike attribution',
        briefing:
          'A drone attack hits a logistics node used by your contractors. Intelligence leans toward a proxy network with Iranian material support, but the chain of command is contested.',
        stakes:
          'Public attribution shapes domestic politics; private signaling shapes adversary calculations.',
        choices: [
          {
            id: 'hist-2024-3a',
            label: 'Attribute publicly and threaten calibrated response',
            detail: 'Name the supporting network and set a 48-hour window for de-escalation.',
            kind: 'diplomatic',
            markerId: 'base',
            short: 'ATTRIB',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Creates a clear public standard' },
              { tag: 'escalation', weight: 2, summary: 'Narrows room to climb down quietly' },
              { tag: 'domestic_support', weight: 1, summary: 'Satisfies calls for visibility' },
            ],
          },
          {
            id: 'hist-2024-3b',
            label: 'Share evidence privately; demand proxy restraint',
            detail: 'Use intelligence channels and a mediator to warn without locking into a public test.',
            kind: 'diplomatic',
            markerId: 'tehran',
            short: 'PRIVATE',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Preserves deniable off-ramps' },
              { tag: 'deterrence', weight: 1, summary: 'Signals knowledge without spectacle' },
              { tag: 'domestic_support', weight: -1, summary: 'Looks opaque to a rattled public' },
            ],
          },
          {
            id: 'hist-2024-3c',
            label: 'Strike a related proxy depot',
            detail: 'Limited-duration action against a warehouse assessed as low-civilian-risk.',
            kind: 'kinetic',
            markerId: 'proxy',
            short: 'STRIKE',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Imposes immediate cost on the network' },
              { tag: 'escalation', weight: 3, summary: 'Invites reciprocal targeting cycles' },
              { tag: 'civilian_cost', weight: 1, summary: 'Even “limited” strikes risk spillover' },
            ],
          },
        ],
      },
      {
        id: 'hist-2024-4',
        title: 'Off-ramp window',
        briefing:
          'A regional intermediary offers a package: tanker release, temporary pause on proxy launches, and technical talks on maritime notifications — if you pause new sanctions designations for 30 days.',
        stakes:
          'Accepting looks like bargaining with coercion; refusing may close the only near-term exit.',
        choices: [
          {
            id: 'hist-2024-4a',
            label: 'Accept with verification milestones',
            detail: 'Pause designations only after staged releases and third-party monitoring.',
            kind: 'diplomatic',
            markerId: 'oman',
            short: 'DEAL',
            effects: [
              { tag: 'diplomacy', weight: 3, summary: 'Converts crisis into sequenced bargaining' },
              { tag: 'credibility', weight: -1, summary: 'Hardliners at home call it concession' },
              { tag: 'escalation', weight: -2, summary: 'Lowers odds of immediate wider war' },
            ],
          },
          {
            id: 'hist-2024-4b',
            label: 'Reject; keep sanctions tempo',
            detail: 'Treat the offer as an attempt to buy time while consolidating gains at sea.',
            kind: 'economic',
            markerId: 'dubai',
            short: 'HOLD',
            effects: [
              { tag: 'economic_pressure', weight: 2, summary: 'Maintains coercive continuity' },
              { tag: 'escalation', weight: 1, summary: 'Leaves kinetic pathways open' },
              { tag: 'diplomacy', weight: -2, summary: 'Burns the intermediary’s political capital' },
            ],
          },
          {
            id: 'hist-2024-4c',
            label: 'Counter with a narrower swap',
            detail: 'Tanker release now for a shorter sanctions pause and a maritime hotline only.',
            kind: 'diplomatic',
            markerId: 'oman',
            short: 'SWAP',
            effects: [
              { tag: 'diplomacy', weight: 1, summary: 'Keeps talks alive without full buy-in' },
              { tag: 'time', weight: 1, summary: 'Creates another negotiation cycle' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Partners can endorse a limited deal' },
            ],
          },
        ],
      },
      {
        id: 'hist-2024-5',
        title: 'Second seizure shock',
        briefing:
          'Another hull is hit or held. Markets treat it as pattern, not incident. Your response must break the pattern without owning a war.',
        stakes:
          'Repetition is the strategy.',
        choices: [
          {
            id: 'hist-2024-5a',
            label: 'Expand multinational escort rotations immediately',
            detail: 'Presence answer.',
            kind: 'naval',
            markerId: 'hormuz',
            short: 'ROTATE',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Lane covered' },
              { tag: 'alliance_cohesion', weight: 2, summary: 'Shared risk' },
              { tag: 'escalation', weight: 1, summary: 'Contact risk' },
            ],
          },
          {
            id: 'hist-2024-5b',
            label: 'Strike a related proxy depot after attribution',
            detail: 'Cost imposition.',
            kind: 'kinetic',
            markerId: 'proxy',
            short: 'DEPOT',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Pain' },
              { tag: 'escalation', weight: 3, summary: 'Ladder' },
              { tag: 'diplomacy', weight: -2, summary: 'Talks freeze' },
            ],
          },
          {
            id: 'hist-2024-5c',
            label: 'Open a crisis cell with a cease-seizure proposal',
            detail: 'Talk under fire.',
            kind: 'diplomatic',
            markerId: 'oman',
            short: 'CELL',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Channel' },
              { tag: 'time', weight: 1, summary: 'Window' },
              { tag: 'domestic_support', weight: -1, summary: 'Soft charge' },
            ],
          },
        ],
      },
      {
        id: 'hist-2024-6',
        title: 'Insurance and pump politics',
        briefing:
          'Premiums and pump prices leap. Legislators demand magic. Strategic reserves are finite politics.',
        stakes:
          'Households are a Gulf theater.',
        choices: [
          {
            id: 'hist-2024-6a',
            label: 'Authorize a measured SPR release with ally coordination',
            detail: 'Calm the tape.',
            kind: 'economic',
            markerId: 'oil',
            short: 'SPR2',
            effects: [
              { tag: 'market_stability', weight: 3, summary: 'Price relief' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Coordinated' },
              { tag: 'time', weight: 1, summary: 'Bought weeks' },
            ],
          },
          {
            id: 'hist-2024-6b',
            label: 'Hold SPR; let prices discipline demand',
            detail: 'Orthodoxy.',
            kind: 'economic',
            markerId: 'dubai',
            short: 'HOLDSPR',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Discipline' },
              { tag: 'civilian_cost', weight: 2, summary: 'Pump pain' },
              { tag: 'polarization', weight: 1, summary: 'Anger' },
            ],
          },
          {
            id: 'hist-2024-6c',
            label: 'Cap domestic prices temporarily and pay refiners',
            detail: 'Political prices.',
            kind: 'political',
            markerId: 'riyadh',
            short: 'CAP',
            effects: [
              { tag: 'domestic_support', weight: 2, summary: 'Relief optics' },
              { tag: 'market_stability', weight: -1, summary: 'Distortion' },
              { tag: 'credibility', weight: -1, summary: 'Fiscal cost' },
            ],
          },
        ],
      },
      {
        id: 'hist-2024-7',
        title: 'Partner tripwire ask',
        briefing:
          'A Gulf partner wants a public security declaration. Ambiguity reassures you; clarity reassures them.',
        stakes:
          'Words create war obligations.',
        choices: [
          {
            id: 'hist-2024-7a',
            label: 'Issue consultative defense language short of automatic war',
            detail: 'Near-tripwire.',
            kind: 'diplomatic',
            markerId: 'riyadh',
            short: 'CONSDEF',
            effects: [
              { tag: 'alliance_cohesion', weight: 2, summary: 'Partner steadied' },
              { tag: 'deterrence', weight: 1, summary: 'Signal' },
              { tag: 'escalation', weight: 1, summary: 'Commitment' },
            ],
          },
          {
            id: 'hist-2024-7b',
            label: 'Offer more capability transfers, refuse new declarations',
            detail: 'Tools not vows.',
            kind: 'diplomatic',
            markerId: 'base',
            short: 'CAPXFER',
            effects: [
              { tag: 'deterrence', weight: 1, summary: 'Partner teeth' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Wanted words' },
              { tag: 'time', weight: 1, summary: 'Flexibility' },
            ],
          },
          {
            id: 'hist-2024-7c',
            label: 'Propose a multilateral maritime charter instead',
            detail: 'Institutionalize.',
            kind: 'naval',
            markerId: 'oman',
            short: 'CHARTER',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Rules' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Broad' },
              { tag: 'credibility', weight: 1, summary: 'Order frame' },
            ],
          },
        ],
      },
      {
        id: 'hist-2024-8',
        title: 'Attribution fog',
        briefing:
          'A deniable attack hits a commercial node. Your intel is good enough for action, not courtroom certainty.',
        stakes:
          'Acting on 70% is the job—and the risk.',
        choices: [
          {
            id: 'hist-2024-8a',
            label: 'Release a high-confidence attribution package',
            detail: 'Public case.',
            kind: 'diplomatic',
            markerId: 'base',
            short: 'PACKAGE3',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Evidence' },
              { tag: 'escalation', weight: 1, summary: 'Confrontation' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Shareable' },
            ],
          },
          {
            id: 'hist-2024-8b',
            label: 'Respond proportionally without full public case',
            detail: 'Quiet cost.',
            kind: 'kinetic',
            markerId: 'proxy',
            short: 'QUIETHIT',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Private pain' },
              { tag: 'credibility', weight: -1, summary: 'Opacity' },
              { tag: 'escalation', weight: 2, summary: 'Ladder risk' },
            ],
          },
          {
            id: 'hist-2024-8c',
            label: 'Hold fire; demand a joint investigation mechanism',
            detail: 'Process first.',
            kind: 'diplomatic',
            markerId: 'tehran',
            short: 'JOINTINV',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Table' },
              { tag: 'time', weight: 2, summary: 'Delay' },
              { tag: 'deterrence', weight: -1, summary: 'Looks hesitant' },
            ],
          },
        ],
      },
      {
        id: 'hist-2024-9',
        title: 'Off-ramp window',
        briefing:
          'A third capital floats a prisoners-and-sanctions sequencing deal if seizures stop for 14 days. Spoilers on all sides load magazines.',
        stakes:
          'Fourteen days can be a century in the Gulf.',
        choices: [
          {
            id: 'hist-2024-9a',
            label: 'Accept the 14-day quiet-for-talks test',
            detail: 'Prove control.',
            kind: 'diplomatic',
            markerId: 'oman',
            short: '14DAY',
            effects: [
              { tag: 'diplomacy', weight: 3, summary: 'Off-ramp' },
              { tag: 'escalation', weight: -2, summary: 'Pause' },
              { tag: 'time', weight: 2, summary: 'Clock' },
            ],
          },
          {
            id: 'hist-2024-9b',
            label: 'Demand irreversible verification before any sanctions relief talk',
            detail: 'Hard sequence.',
            kind: 'economic',
            markerId: 'dubai',
            short: 'VERIFY2',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Tough' },
              { tag: 'diplomacy', weight: -1, summary: 'Harder deal' },
              { tag: 'economic_pressure', weight: 1, summary: 'Leverage held' },
            ],
          },
          {
            id: 'hist-2024-9c',
            label: 'Keep talks but maintain escort pressure throughout',
            detail: 'Talk and sail.',
            kind: 'naval',
            markerId: 'strait',
            short: 'BOTH',
            effects: [
              { tag: 'deterrence', weight: 1, summary: 'Pressure' },
              { tag: 'diplomacy', weight: 1, summary: 'Channel' },
              { tag: 'escalation', weight: 1, summary: 'Dual track risk' },
            ],
          },
        ],
      },
      {
        id: 'hist-2024-10',
        title: 'Lane doctrine endgame',
        briefing:
          'Cabinet wants standing rules: escort thresholds, SPR policy, and when kinetic replies are pre-authorized.',
        stakes:
          'Doctrine reduces 3 a.m. invention.',
        choices: [
          {
            id: 'hist-2024-10a',
            label: 'Codify multinational escort triggers and ROE libraries',
            detail: 'Standing maritime order.',
            kind: 'naval',
            markerId: 'hormuz',
            short: 'ROE3',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Ready rules' },
              { tag: 'alliance_cohesion', weight: 2, summary: 'Shareable' },
              { tag: 'escalation', weight: -1, summary: 'Less improv' },
            ],
          },
          {
            id: 'hist-2024-10b',
            label: 'Keep decisions case-by-case at leader level',
            detail: 'Flexibility.',
            kind: 'political',
            markerId: 'tehran',
            short: 'CASE',
            effects: [
              { tag: 'time', weight: 1, summary: 'Agile' },
              { tag: 'credibility', weight: -1, summary: 'Unpredictable' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Partners guess' },
            ],
          },
          {
            id: 'hist-2024-10c',
            label: 'Prioritize energy transition and demand destruction tools',
            detail: 'Reduce the lane’s leverage.',
            kind: 'economic',
            markerId: 'oil',
            short: 'DEMAND',
            effects: [
              { tag: 'market_stability', weight: 1, summary: 'Long resilience' },
              { tag: 'diplomacy', weight: 1, summary: 'Structural' },
              { tag: 'deterrence', weight: -1, summary: 'Less force focus' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'hist-2025-coalition-aftershock',
    year: 2025,
    era: '2008–2026',
    title: 'Coalition Aftershock',
    region: 'European Union · national capitals',
    meterFamily: 'politics',
    theaterArchetype: 'europe',
    premise:
      'After national elections, a far-right bloc becomes kingmaker in a major member state. Markets, minority communities, and Brussels all watch your first week of coalition management.',
    role: 'Chief of staff to a centrist prime minister–designate',
    tension:
      'Governability versus democratic norms; EU cohesion versus domestic mandate claims.',
    beats: [
      {
        id: 'hist-2025-1',
        title: 'Coalition arithmetic',
        briefing:
          'Without the far-right party, you lack a majority. They demand the interior ministry and a freeze on new asylum reception capacity. Smaller liberal partners threaten to walk if you concede either.',
        stakes:
          'Office without norms risks hollow legitimacy; purity without numbers risks snap elections.',
        choices: [
          {
            id: 'hist-2025-1a',
            label: 'Grand bargain with red-line ministries',
            detail: 'Offer junior portfolios but keep interior, justice, and foreign affairs out of their hands.',
            kind: 'political',
            markerId: 'capital',
            short: 'CABINET',
            effects: [
              { tag: 'governability', weight: 2, summary: 'Secures a working majority' },
              { tag: 'norm_erosion', weight: 1, summary: 'Normalizes the bloc inside cabinet politics' },
              { tag: 'liberal_trust', weight: -1, summary: 'Strains partners who wanted a cordon' },
            ],
          },
          {
            id: 'hist-2025-1b',
            label: 'Minority government with issue-by-issue votes',
            detail: 'Refuse a formal deal; negotiate budgets and security votes ad hoc.',
            kind: 'political',
            markerId: 'capital',
            short: 'MINORITY',
            effects: [
              { tag: 'norm_protection', weight: 2, summary: 'Avoids formal cohabitation with the far right' },
              { tag: 'governability', weight: -2, summary: 'Every bill becomes a crisis' },
              { tag: 'market_stability', weight: -1, summary: 'Investors price political fragility' },
            ],
          },
          {
            id: 'hist-2025-1c',
            label: 'Force a second election',
            detail: 'Tell the president no stable democratic majority exists and seek a fresh mandate.',
            kind: 'civic',
            markerId: 'ballot',
            short: 'REELECT',
            effects: [
              { tag: 'democratic_mandate', weight: 1, summary: 'Returns the question to voters' },
              { tag: 'polarization', weight: 2, summary: 'Campaigns harden identities further' },
              { tag: 'far_right_momentum', weight: 1, summary: 'Gives them months as opposition tribune' },
            ],
          },
        ],
      },
      {
        id: 'hist-2025-2',
        title: 'Street and speech',
        briefing:
          'After a far-right rally, clashes injure protesters and two officers. Civil society demands a ban on the party’s youth wing. The party calls it a political persecution test.',
        stakes:
          'Rule-of-law tools used unevenly can feed the narrative they campaign on.',
        choices: [
          {
            id: 'hist-2025-2a',
            label: 'Independent inquiry + targeted bans on violent cadres',
            detail: 'Separate criminal accountability from collective political bans.',
            kind: 'legal',
            markerId: 'streets',
            short: 'INQUIRE',
            effects: [
              { tag: 'norm_protection', weight: 2, summary: 'Centers evidence over spectacle' },
              { tag: 'social_calm', weight: 1, summary: 'Offers both camps a procedural path' },
              { tag: 'time', weight: 1, summary: 'Slows politics while facts are gathered' },
            ],
          },
          {
            id: 'hist-2025-2b',
            label: 'Broad organizational ban push',
            detail: 'Ask courts to dissolve the youth wing for pattern of intimidation.',
            kind: 'legal',
            markerId: 'streets',
            short: 'BAN',
            effects: [
              { tag: 'norm_protection', weight: 1, summary: 'Draws a hard line against street coercion' },
              { tag: 'polarization', weight: 2, summary: 'Fuels martyr narratives' },
              { tag: 'liberal_trust', weight: 1, summary: 'Reassures threatened communities short-term' },
            ],
          },
          {
            id: 'hist-2025-2c',
            label: 'De-escalate rhetoric; expand local mediation',
            detail: 'Quiet policing posture and funded local dialogue teams in hot districts.',
            kind: 'civic',
            markerId: 'districts',
            short: 'MEDIATE',
            effects: [
              { tag: 'social_calm', weight: 2, summary: 'Reduces immediate confrontation cycles' },
              { tag: 'credibility', weight: -1, summary: 'Critics call it soft on intimidation' },
              { tag: 'far_right_momentum', weight: 1, summary: 'They claim the state blinked' },
            ],
          },
        ],
      },
      {
        id: 'hist-2025-3',
        title: 'Brussels pressure',
        briefing:
          'The Commission warns that proposed asylum freezes may breach common rules. Farmers and logistics firms want you to protect EU funds. Your far-right interlocutors want a sovereignty confrontation.',
        stakes:
          'EU funds and legal standing are leverage — and a domestic campaign prop.',
        choices: [
          {
            id: 'hist-2025-3a',
            label: 'Negotiate a compliance timeline',
            detail: 'Trade phased reception capacity for technical assistance and fund certainty.',
            kind: 'diplomatic',
            markerId: 'brussels',
            short: 'COMPLY',
            effects: [
              { tag: 'eu_cohesion', weight: 2, summary: 'Keeps you inside the legal community' },
              { tag: 'governability', weight: 1, summary: 'Avoids an immediate funds crisis' },
              { tag: 'far_right_momentum', weight: -1, summary: 'Undercuts their confrontation script' },
            ],
          },
          {
            id: 'hist-2025-3b',
            label: 'Public clash over “national competence”',
            detail: 'Frame Brussels as overriding the election; dare infringement.',
            kind: 'political',
            markerId: 'brussels',
            short: 'CLASH',
            effects: [
              { tag: 'far_right_momentum', weight: 2, summary: 'Aligns executive branding with their voters' },
              { tag: 'eu_cohesion', weight: -3, summary: 'Opens a lasting rule-of-law fight' },
              { tag: 'market_stability', weight: -1, summary: 'Risks funding and investment nerves' },
            ],
          },
          {
            id: 'hist-2025-3c',
            label: 'Quiet legal tweak; loud domestic theater',
            detail: 'Meet minimum legal thresholds while messaging toughness at home.',
            kind: 'political',
            markerId: 'capital',
            short: 'THEATER',
            effects: [
              { tag: 'eu_cohesion', weight: 1, summary: 'Technically stays compliant' },
              { tag: 'credibility', weight: -1, summary: 'Both camps may call it cynical' },
              { tag: 'polarization', weight: 1, summary: 'Theater still heats the information space' },
            ],
          },
        ],
      },
      {
        id: 'hist-2025-4',
        title: 'Budget night',
        briefing:
          'The finance bill needs votes. The far-right offers support if you cut civic-education grants and raise police overtime budgets. Liberals demand the opposite trade.',
        stakes:
          'One night can redefine who owns the state’s coercive and civic tools.',
        choices: [
          {
            id: 'hist-2025-4a',
            label: 'Pass a narrow confidence budget',
            detail: 'Strip culture-war riders; fund core services and a review commission.',
            kind: 'political',
            markerId: 'parliament',
            short: 'NARROW',
            effects: [
              { tag: 'governability', weight: 2, summary: 'Keeps the lights on without an identity bargain' },
              { tag: 'liberal_trust', weight: 1, summary: 'Avoids gutting civic programs' },
              { tag: 'far_right_momentum', weight: -1, summary: 'Denies them a trophy in the bill' },
            ],
          },
          {
            id: 'hist-2025-4b',
            label: 'Take the far-right security package',
            detail: 'Accept overtime surge and civic-grant cuts to lock votes.',
            kind: 'political',
            markerId: 'parliament',
            short: 'SECURITY',
            effects: [
              { tag: 'governability', weight: 2, summary: 'Gets the bill through' },
              { tag: 'norm_erosion', weight: 2, summary: 'Trades civic capacity for order optics' },
              { tag: 'social_calm', weight: -1, summary: 'Minority organizations feel abandoned' },
            ],
          },
          {
            id: 'hist-2025-4c',
            label: 'Risk defeat; mobilize street legitimacy',
            detail: 'Refuse both extremes and dare a failed vote while calling supporters to peaceful vigils.',
            kind: 'civic',
            markerId: 'streets',
            short: 'VIGIL',
            effects: [
              { tag: 'democratic_mandate', weight: 1, summary: 'Frames integrity over dealmaking' },
              { tag: 'governability', weight: -3, summary: 'May collapse the government project' },
              { tag: 'polarization', weight: 2, summary: 'Moves conflict from parliament to streets' },
            ],
          },
        ],
      },
      {
        id: 'hist-2025-5',
        title: 'No-confidence shock',
        briefing:
          'A procedural ambush appears within days of formation. Your majority is arithmetic, not affection.',
        stakes:
          'Governing starts as survival.',
        choices: [
          {
            id: 'hist-2025-5a',
            label: 'Cut a narrow confidence deal on procedure only',
            detail: 'Survive the week.',
            kind: 'political',
            markerId: 'parliament',
            short: 'CONF',
            effects: [
              { tag: 'governability', weight: 2, summary: 'Cabinet lives' },
              { tag: 'credibility', weight: -1, summary: 'Horse-trade' },
              { tag: 'time', weight: 1, summary: 'Oxygen' },
            ],
          },
          {
            id: 'hist-2025-5b',
            label: 'Call the bluff and dare early elections',
            detail: 'Mandate reset.',
            kind: 'civic',
            markerId: 'ballot',
            short: 'ELECT2',
            effects: [
              { tag: 'norm_protection', weight: 1, summary: 'Voters decide' },
              { tag: 'governability', weight: -2, summary: 'Chaos risk' },
              { tag: 'polarization', weight: 2, summary: 'Campaign mode' },
            ],
          },
          {
            id: 'hist-2025-5c',
            label: 'Invite a technocratic confidence-and-supply arrangement',
            detail: 'Shrink politics.',
            kind: 'political',
            markerId: 'capital',
            short: 'TECH2',
            effects: [
              { tag: 'governability', weight: 1, summary: 'Admin path' },
              { tag: 'domestic_support', weight: -1, summary: 'Unloved' },
              { tag: 'eu_cohesion', weight: 1, summary: 'Predictable' },
            ],
          },
        ],
      },
      {
        id: 'hist-2025-6',
        title: 'Street and platform pressure',
        briefing:
          'Coordinated protests and online campaigns demand you break a firewall—or strengthen it. Institutions become content.',
        stakes:
          'Platforms are a second parliament.',
        choices: [
          {
            id: 'hist-2025-6a',
            label: 'Reaffirm democratic firewalls with legal clarity',
            detail: 'Norms speech.',
            kind: 'legal',
            markerId: 'streets',
            short: 'FIREWALL',
            effects: [
              { tag: 'norm_protection', weight: 3, summary: 'Distance held' },
              { tag: 'polarization', weight: 1, summary: 'Hardliners rage' },
              { tag: 'credibility', weight: 2, summary: 'Clear line' },
            ],
          },
          {
            id: 'hist-2025-6b',
            label: 'Open exploratory talks with soft-edge factions only',
            detail: 'Grey zone.',
            kind: 'political',
            markerId: 'parliament',
            short: 'SOFTEDGE',
            effects: [
              { tag: 'governability', weight: 1, summary: 'Votes' },
              { tag: 'norm_erosion', weight: 2, summary: 'Window shifts' },
              { tag: 'liberal_trust', weight: -2, summary: 'Partners flee' },
            ],
          },
          {
            id: 'hist-2025-6c',
            label: 'Counter-mobilize civic coalitions without state coercion',
            detail: 'Society answers society.',
            kind: 'civic',
            markerId: 'districts',
            short: 'CIVIC2',
            effects: [
              { tag: 'social_calm', weight: 1, summary: 'Counterweight' },
              { tag: 'polarization', weight: 1, summary: 'Camp politics' },
              { tag: 'norm_protection', weight: 1, summary: 'Pluralism' },
            ],
          },
        ],
      },
      {
        id: 'hist-2025-7',
        title: 'Brussels conditionality ask',
        briefing:
          'EU partners hint that funds and tone depend on rule-of-law markers. Defiance plays well at home; compliance funds the state.',
        stakes:
          'External anchors versus domestic brand.',
        choices: [
          {
            id: 'hist-2025-7a',
            label: 'Comply on core rule-of-law benchmarks',
            detail: 'Money and club.',
            kind: 'diplomatic',
            markerId: 'brussels',
            short: 'COMPLY2',
            effects: [
              { tag: 'eu_cohesion', weight: 3, summary: 'Club held' },
              { tag: 'governability', weight: 1, summary: 'Funds' },
              { tag: 'domestic_support', weight: -1, summary: 'Sovereignty charge' },
            ],
          },
          {
            id: 'hist-2025-7b',
            label: 'Stage a controlled clash for domestic branding',
            detail: 'Theater.',
            kind: 'political',
            markerId: 'capital',
            short: 'CLASH',
            effects: [
              { tag: 'domestic_support', weight: 2, summary: 'Brand' },
              { tag: 'eu_cohesion', weight: -3, summary: 'Fight' },
              { tag: 'credibility', weight: -1, summary: 'Costly' },
            ],
          },
          {
            id: 'hist-2025-7c',
            label: 'Negotiate phased benchmarks with visible wins both ways',
            detail: 'Two-level deal.',
            kind: 'diplomatic',
            markerId: 'parliament',
            short: 'PHASE2',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Bargain' },
              { tag: 'eu_cohesion', weight: 1, summary: 'Path' },
              { tag: 'time', weight: 1, summary: 'Staging' },
            ],
          },
        ],
      },
      {
        id: 'hist-2025-8',
        title: 'Disinformation fog around the cabinet',
        briefing:
          'Forged chats allege secret pacts. Corrections lag. Your communications doctrine is now security policy.',
        stakes:
          'Legitimacy is an information service.',
        choices: [
          {
            id: 'hist-2025-8a',
            label: 'Publish authenticated timelines and invite press scrutiny',
            detail: 'Radical transparency.',
            kind: 'civic',
            markerId: 'ballot',
            short: 'TRANSP',
            effects: [
              { tag: 'credibility', weight: 3, summary: 'Sunlight' },
              { tag: 'polarization', weight: -1, summary: 'If it works' },
              { tag: 'time', weight: -1, summary: 'Ops cost' },
            ],
          },
          {
            id: 'hist-2025-8b',
            label: 'Pursue rapid legal takedowns of forged material',
            detail: 'Lawfare.',
            kind: 'legal',
            markerId: 'streets',
            short: 'TAKEDOWN',
            effects: [
              { tag: 'social_calm', weight: 1, summary: 'Less spread' },
              { tag: 'norm_erosion', weight: 1, summary: 'Speech fights' },
              { tag: 'credibility', weight: -1, summary: 'Censor charge' },
            ],
          },
          {
            id: 'hist-2025-8c',
            label: 'Ignore forgeries; flood governing delivery stories',
            detail: 'Change the subject.',
            kind: 'political',
            markerId: 'districts',
            short: 'DELIVER',
            effects: [
              { tag: 'governability', weight: 1, summary: 'Output focus' },
              { tag: 'credibility', weight: -1, summary: 'Unanswered lies' },
              { tag: 'time', weight: 1, summary: 'Bandwidth' },
            ],
          },
        ],
      },
      {
        id: 'hist-2025-9',
        title: 'Budget off-ramp',
        briefing:
          'A skinny budget can pass without normative collapse—or starve the state. A fat bargain may require the very partners you excluded.',
        stakes:
          'Arithmetic returns as destiny.',
        choices: [
          {
            id: 'hist-2025-9a',
            label: 'Pass a narrow confidence budget with firewall intact',
            detail: 'Govern small.',
            kind: 'political',
            markerId: 'parliament',
            short: 'SKINNY',
            effects: [
              { tag: 'governability', weight: 2, summary: 'Something passes' },
              { tag: 'norm_protection', weight: 2, summary: 'Firewall held' },
              { tag: 'eu_cohesion', weight: 1, summary: 'Predictable' },
            ],
          },
          {
            id: 'hist-2025-9b',
            label: 'Expand the majority with costly normative concessions',
            detail: 'Buy votes.',
            kind: 'political',
            markerId: 'capital',
            short: 'EXPAND',
            effects: [
              { tag: 'governability', weight: 3, summary: 'Wider majority' },
              { tag: 'norm_erosion', weight: 3, summary: 'Price paid' },
              { tag: 'liberal_trust', weight: -3, summary: 'Break' },
            ],
          },
          {
            id: 'hist-2025-9c',
            label: 'Run a caretaker spend-as-before and renegotiate in 90 days',
            detail: 'Kick the can carefully.',
            kind: 'economic',
            markerId: 'brussels',
            short: 'CARETAKE',
            effects: [
              { tag: 'time', weight: 2, summary: 'Delay fight' },
              { tag: 'governability', weight: -1, summary: 'Weak' },
              { tag: 'market_stability', weight: -1, summary: 'Uncertainty' },
            ],
          },
        ],
      },
      {
        id: 'hist-2025-10',
        title: 'Democratic endurance endgame',
        briefing:
          'You write the week’s doctrine: how centrist cabinets survive without becoming what they exclude—or dying of purity.',
        stakes:
          'Efficiency here is governability with norms intact.',
        choices: [
          {
            id: 'hist-2025-10a',
            label: 'Institutionalize cross-party procedural pacts for crises',
            detail: 'Process democracy.',
            kind: 'legal',
            markerId: 'parliament',
            short: 'PACTS',
            effects: [
              { tag: 'norm_protection', weight: 2, summary: 'Rules' },
              { tag: 'governability', weight: 2, summary: 'Stability' },
              { tag: 'polarization', weight: -1, summary: 'Some buy-in' },
            ],
          },
          {
            id: 'hist-2025-10b',
            label: 'Accept permanent campaign mode as the real constitution',
            detail: 'Mobilize forever.',
            kind: 'civic',
            markerId: 'streets',
            short: 'CAMPAIGN',
            effects: [
              { tag: 'domestic_support', weight: 1, summary: 'Base energy' },
              { tag: 'governability', weight: -2, summary: 'No bandwidth' },
              { tag: 'polarization', weight: 3, summary: 'Total politics' },
            ],
          },
          {
            id: 'hist-2025-10c',
            label: 'Anchor legitimacy in EU and court rules when majorities fail',
            detail: 'External scaffolding.',
            kind: 'diplomatic',
            markerId: 'brussels',
            short: 'ANCHOR',
            effects: [
              { tag: 'eu_cohesion', weight: 2, summary: 'Anchor' },
              { tag: 'credibility', weight: 1, summary: 'Rules' },
              { tag: 'domestic_support', weight: -1, summary: 'Elite charge' },
            ],
          },
        ],
      },
    ],
  },
];

/** Core + partition/Balfour extras, sorted by year then id. */
export const historicalScenarios: HistoricalScenario[] = [
  ...coreHistoricalScenarios,
  ...extraPartitionScenarios,
].sort((a, b) => a.year - b.year || a.id.localeCompare(b.id));

export function getHistoricalScenario(id: string): HistoricalScenario | undefined {
  return historicalScenarios.find((s) => s.id === id);
}
