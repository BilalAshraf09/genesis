import type { Scenario } from '@/data/scenarios';
import type { OpKind } from '@/data/theaters';
import type { TheaterDef } from '@/data/theaters';
import { buildTheaterFromArchetype, type TheaterArchetype } from '@/data/theaterTemplates';

export type RotationBundle = {
  packId: string;
  label: string;
  hook: string;
  scenarios: Scenario[];
  theaters: TheaterDef[];
  ops: Record<string, { kind: OpKind; markerId: string; short: string }>;
};

function op(
  id: string,
  kind: OpKind,
  markerId: string,
  short: string,
): Record<string, { kind: OpKind; markerId: string; short: string }> {
  return { [id]: { kind, markerId, short } };
}

function pack(
  packId: string,
  label: string,
  hook: string,
  items: {
    scenario: Scenario;
    archetype: TheaterArchetype;
    ops: Record<string, { kind: OpKind; markerId: string; short: string }>;
  }[],
): RotationBundle {
  return {
    packId,
    label,
    hook,
    scenarios: items.map((i) => ({
      ...i.scenario,
      packId,
      theaterArchetype: i.archetype,
      evergreen: false,
    })),
    theaters: items.map((i) =>
      buildTheaterFromArchetype(i.archetype, i.scenario.id, i.scenario.title),
    ),
    ops: Object.assign({}, ...items.map((i) => i.ops)),
  };
}

/** Offline catalog — indexed by 3-day epoch so the desk always has dated, playable content. */
export const MOCK_ROTATION_PACKS: RotationBundle[] = [
  pack(
    'desk-pacific-sahel',
    'Pacific & Sahel desk',
    'Strait drills and junta-border friction top the wire.',
    [
      {
        archetype: 'pacific',
        scenario: {
          id: 'rot-taiwan-lane',
          title: 'Gray Zone Lane',
          region: 'Taiwan Strait · Indo-Pacific',
          meterFamily: 'conflict',
          premise:
            'Unannounced coast-guard “inspections” slow commercial traffic while a partner legislature debates a weapons package. You staff a crisis cell for the next 96 hours.',
          role: 'Indo-Pacific director, national security staff',
          tension: 'Presence without kinetic spillover; reassure markets without locking into a red-line trap.',
          beats: [
            {
              id: 'tw-1',
              title: 'First boarding incident',
              briefing:
                'A flagged freighter is delayed near the median line. Partners ask whether you will issue a public protest, surge escorts, or keep the response in quiet channels.',
              stakes: 'Visibility calms some allies and hardens others.',
              choices: [
                {
                  id: 'tw-1a',
                  label: 'Surge a limited escort package',
                  detail: 'Naval assets shadow commercial traffic under defensive ROE.',
                  effects: [
                    { tag: 'deterrence', weight: 2, summary: 'Raises cost of further boardings' },
                    { tag: 'escalation', weight: 2, summary: 'Puts hulls in a contested lane' },
                    { tag: 'alliance_cohesion', weight: 1, summary: 'Signals partners you will show up' },
                  ],
                },
                {
                  id: 'tw-1b',
                  label: 'Quiet demarche + insurance pool',
                  detail: 'Private protest with a temporary reinsurance facility for delayed hulls.',
                  effects: [
                    { tag: 'diplomacy', weight: 2, summary: 'Keeps off-ramps open' },
                    { tag: 'market_stability', weight: 1, summary: 'Blunts panic premiums' },
                    { tag: 'credibility', weight: -1, summary: 'Some read silence as soft' },
                  ],
                },
                {
                  id: 'tw-1c',
                  label: 'Public attribution and timeline',
                  detail: 'Name the pattern and set a 72-hour expectation for traffic normalization.',
                  effects: [
                    { tag: 'credibility', weight: 2, summary: 'Creates a clear public standard' },
                    { tag: 'escalation', weight: 1, summary: 'Narrows quiet climb-downs' },
                    { tag: 'alliance_cohesion', weight: 1, summary: 'Gives partners a shared script' },
                  ],
                },
              ],
            },
            {
              id: 'tw-2',
              title: 'Legislature vote pressure',
              briefing:
                'A weapons-package vote slips. Lobbyists want a presidential statement; diplomats warn it will be read as linkage to the strait incidents.',
              stakes: 'Domestic politics and theater signaling are now the same sentence.',
              choices: [
                {
                  id: 'tw-2a',
                  label: 'Tie the vote to lane security publicly',
                  detail: 'Frame the package as deterring gray-zone coercion at sea.',
                  effects: [
                    { tag: 'deterrence', weight: 2, summary: 'Connects hardware to the crisis narrative' },
                    { tag: 'escalation', weight: 1, summary: 'Raises political temperature across the strait' },
                    { tag: 'domestic_support', weight: 1, summary: 'Mobilizes hawks at home' },
                  ],
                },
                {
                  id: 'tw-2b',
                  label: 'Separate tracks: vote quiet, lane loud',
                  detail: 'Push the package privately; keep maritime messaging technical.',
                  effects: [
                    { tag: 'diplomacy', weight: 1, summary: 'Avoids a single escalatory narrative' },
                    { tag: 'credibility', weight: 1, summary: 'Looks controlled to partners' },
                    { tag: 'time', weight: 1, summary: 'Buys hours for whip counts' },
                  ],
                },
                {
                  id: 'tw-2c',
                  label: 'Delay the vote; surge commercial escorts only',
                  detail: 'Remove the political accelerant while hardening the lane.',
                  effects: [
                    { tag: 'escalation', weight: -1, summary: 'Lowers rhetorical heat' },
                    { tag: 'deterrence', weight: 1, summary: 'Keeps operational presence' },
                    { tag: 'domestic_support', weight: -1, summary: 'Angers package sponsors' },
                  ],
                },
              ],
            },
            {
              id: 'tw-3',
              title: 'Cable cut rumor',
              briefing:
                'A subsea cable near the lane reports an outage. Attribution is murky; markets price connectivity risk.',
              stakes: 'Over-claiming without evidence can become the crisis.',
              choices: [
                {
                  id: 'tw-3a',
                  label: 'Joint forensic team with partners',
                  detail: 'Share sensors and withhold public blame until evidence clears.',
                  effects: [
                    { tag: 'alliance_cohesion', weight: 2, summary: 'Builds a shared factual base' },
                    { tag: 'diplomacy', weight: 1, summary: 'Avoids a premature narrative war' },
                    { tag: 'time', weight: 1, summary: 'Slows the information spiral' },
                  ],
                },
                {
                  id: 'tw-3b',
                  label: 'Immediate public finger-pointing',
                  detail: 'Treat the outage as part of a coercion pattern.',
                  effects: [
                    { tag: 'escalation', weight: 2, summary: 'Hardens positions before facts settle' },
                    { tag: 'credibility', weight: -1, summary: 'Risk of walking back if forensics differ' },
                    { tag: 'domestic_support', weight: 1, summary: 'Satisfies demand for clarity' },
                  ],
                },
                {
                  id: 'tw-3c',
                  label: 'Silent reroute + commercial messaging',
                  detail: 'Stabilize traffic and bandwidth without a diplomatic blast.',
                  effects: [
                    { tag: 'market_stability', weight: 2, summary: 'Limits secondary shock' },
                    { tag: 'deterrence', weight: -1, summary: 'May look like absorption of costs' },
                    { tag: 'diplomacy', weight: 1, summary: 'Preserves room to bargain' },
                  ],
                },
              ],
            },
            {
              id: 'tw-4',
              title: 'Off-ramp proposal',
              briefing:
                'A third capital offers: pause boardings for 14 days if escorts pull back to a notification zone.',
              stakes: 'Accepting looks like rewarding coercion; refusing may lock a patrol cycle.',
              choices: [
                {
                  id: 'tw-4a',
                  label: 'Accept with verification milestones',
                  detail: 'Staged pullback only after monitored traffic normalizes.',
                  effects: [
                    { tag: 'diplomacy', weight: 3, summary: 'Converts crisis into sequenced bargain' },
                    { tag: 'escalation', weight: -2, summary: 'Lowers near-term kinetic risk' },
                    { tag: 'credibility', weight: -1, summary: 'Hardliners call it concession' },
                  ],
                },
                {
                  id: 'tw-4b',
                  label: 'Reject; hold escort posture',
                  detail: 'Treat the offer as buying time to reset the gray zone.',
                  effects: [
                    { tag: 'deterrence', weight: 2, summary: 'Maintains presence continuity' },
                    { tag: 'escalation', weight: 1, summary: 'Leaves incident pathways open' },
                    { tag: 'diplomacy', weight: -2, summary: 'Burns the intermediary' },
                  ],
                },
                {
                  id: 'tw-4c',
                  label: 'Counter with a narrower hotline deal',
                  detail: 'Traffic notifications only; escorts stay but announce lanes.',
                  effects: [
                    { tag: 'diplomacy', weight: 1, summary: 'Keeps talks alive' },
                    { tag: 'alliance_cohesion', weight: 1, summary: 'Partners can endorse limited terms' },
                    { tag: 'time', weight: 1, summary: 'Creates another negotiation cycle' },
                  ],
                },
              ],
            },
          ],
        },
        ops: {
          ...op('tw-1a', 'naval', 'fleet', 'ESCORT'),
          ...op('tw-1b', 'economic', 'cable', 'INSURE'),
          ...op('tw-1c', 'diplomatic', 'capital_a', 'ATTRIB'),
          ...op('tw-2a', 'political', 'capital_b', 'LINK'),
          ...op('tw-2b', 'diplomatic', 'capital_a', 'SPLIT'),
          ...op('tw-2c', 'naval', 'strait', 'HOLD'),
          ...op('tw-3a', 'diplomatic', 'island', 'FORENS'),
          ...op('tw-3b', 'political', 'capital_a', 'BLAME'),
          ...op('tw-3c', 'economic', 'cable', 'REROUTE'),
          ...op('tw-4a', 'diplomatic', 'capital_b', 'DEAL'),
          ...op('tw-4b', 'naval', 'fleet', 'HOLD'),
          ...op('tw-4c', 'diplomatic', 'strait', 'HOTLINE'),
        },
      },
      {
        archetype: 'sahel',
        scenario: {
          id: 'rot-sahel-corridor',
          title: 'Corridor Mandate',
          region: 'Sahel · border states',
          meterFamily: 'politics',
          premise:
            'A transitional junta closes a mineral corridor after a border clash. Neighbors threaten sanctions; civilians need the road open within days.',
          role: 'Special envoy for regional security',
          tension: 'Access and legitimacy without becoming a party to the next coup narrative.',
          beats: [
            {
              id: 'sh-1',
              title: 'First demarche',
              briefing:
                'The junta wants recognition language; neighbors want a deadline for corridor reopening.',
              stakes: 'Words now become bargaining chips later.',
              choices: [
                {
                  id: 'sh-1a',
                  label: 'Conditional engagement formula',
                  detail: 'Talks without recognition; corridor access as the first deliverable.',
                  effects: [
                    { tag: 'diplomacy', weight: 2, summary: 'Keeps a channel without legitimizing' },
                    { tag: 'governability', weight: 1, summary: 'Creates a workable ask' },
                    { tag: 'credibility', weight: 1, summary: 'Neighbors see a standard' },
                  ],
                },
                {
                  id: 'sh-1b',
                  label: 'Join the sanctions clock',
                  detail: 'Align with neighbors on timed economic pressure.',
                  effects: [
                    { tag: 'economic_pressure', weight: 2, summary: 'Raises cost of closure' },
                    { tag: 'polarization', weight: 1, summary: 'Hardens junta messaging at home' },
                    { tag: 'eu_cohesion', weight: 1, summary: 'Keeps regional bloc alignment' },
                  ],
                },
                {
                  id: 'sh-1c',
                  label: 'Humanitarian corridor only',
                  detail: 'Narrow ask for aid convoys; defer politics.',
                  effects: [
                    { tag: 'social_calm', weight: 2, summary: 'Prioritizes civilian access' },
                    { tag: 'credibility', weight: -1, summary: 'May look like ducking the mandate fight' },
                    { tag: 'time', weight: 1, summary: 'Buys days without a full deal' },
                  ],
                },
              ],
            },
            {
              id: 'sh-2',
              title: 'Convoy ambush',
              briefing:
                'An aid convoy is hit near the border. Attribution points to a splinter group; the junta blames foreign meddling.',
              stakes: 'Security guarantees and narrative warfare collide.',
              choices: [
                {
                  id: 'sh-2a',
                  label: 'Pause convoys; demand joint patrols',
                  detail: 'No movement until a verified escort protocol exists.',
                  effects: [
                    { tag: 'norm_protection', weight: 1, summary: 'Refuses to normalize unprotected runs' },
                    { tag: 'social_calm', weight: -1, summary: 'Aid delay hits civilians' },
                    { tag: 'governability', weight: 1, summary: 'Forces a security bargain' },
                  ],
                },
                {
                  id: 'sh-2b',
                  label: 'Quietly contract third-party escorts',
                  detail: 'Keep aid moving with private security under observer rules.',
                  effects: [
                    { tag: 'social_calm', weight: 2, summary: 'Restores flow faster' },
                    { tag: 'credibility', weight: -1, summary: 'Opacity feeds conspiracy narratives' },
                    { tag: 'escalation', weight: 1, summary: 'Armed escorts raise incident risk' },
                  ],
                },
                {
                  id: 'sh-2c',
                  label: 'Public blame + targeted designations',
                  detail: 'Name facilitators and freeze related logistics firms.',
                  effects: [
                    { tag: 'economic_pressure', weight: 2, summary: 'Hits the support network' },
                    { tag: 'polarization', weight: 2, summary: 'Fuels nationalist backlash' },
                    { tag: 'diplomacy', weight: -1, summary: 'Complicates the table' },
                  ],
                },
              ],
            },
            {
              id: 'sh-3',
              title: 'Election timeline ask',
              briefing:
                'Donors want a published election calendar before releasing budget support. The junta offers local consultations instead.',
              stakes: 'Process legitimacy vs. immediate stability cash.',
              choices: [
                {
                  id: 'sh-3a',
                  label: 'Hard link: calendar or no funds',
                  detail: 'Publish dates with AU/ECOWAS monitors as the unlock.',
                  effects: [
                    { tag: 'norm_protection', weight: 2, summary: 'Keeps a democratic benchmark' },
                    { tag: 'governability', weight: -1, summary: 'May prolong standoff' },
                    { tag: 'far_right_momentum', weight: 0, summary: 'N/A' },
                    { tag: 'eu_cohesion', weight: 1, summary: 'Matches regional org scripts' },
                  ],
                },
                {
                  id: 'sh-3b',
                  label: 'Phased funds for corridor + talks',
                  detail: 'Release a tranche for access milestones, hold the rest.',
                  effects: [
                    { tag: 'governability', weight: 2, summary: 'Creates incremental compliance' },
                    { tag: 'norm_erosion', weight: 1, summary: 'Softens the election ask' },
                    { tag: 'diplomacy', weight: 1, summary: 'Keeps bargaining alive' },
                  ],
                },
                {
                  id: 'sh-3c',
                  label: 'Accept consultations as enough for now',
                  detail: 'Prioritize corridor opening over electoral form.',
                  effects: [
                    { tag: 'social_calm', weight: 1, summary: 'Unblocks goods sooner' },
                    { tag: 'norm_erosion', weight: 2, summary: 'Weakens transition standards' },
                    { tag: 'liberal_trust', weight: -1, summary: 'Civil society feels abandoned' },
                  ],
                },
              ],
            },
            {
              id: 'sh-4',
              title: 'Neighbor ultimatum',
              briefing:
                'A neighbor threatens to close their side of the border in 48 hours unless you endorse a harder line.',
              stakes: 'Regional solidarity can become competitive coercion.',
              choices: [
                {
                  id: 'sh-4a',
                  label: 'Broker a trilateral border protocol',
                  detail: 'Shared customs hours and observer posts instead of a shutdown.',
                  effects: [
                    { tag: 'diplomacy', weight: 2, summary: 'Converts ultimatum into process' },
                    { tag: 'eu_cohesion', weight: 2, summary: 'Keeps the neighborhood in one frame' },
                    { tag: 'governability', weight: 1, summary: 'Gives all sides a face-saving win' },
                  ],
                },
                {
                  id: 'sh-4b',
                  label: 'Side with the neighbor publicly',
                  detail: 'Endorse the harder line to preserve the coalition.',
                  effects: [
                    { tag: 'alliance_cohesion', weight: 2, summary: 'Satisfies the impatient partner' },
                    { tag: 'escalation', weight: 2, summary: 'Raises odds of a prolonged closure' },
                    { tag: 'diplomacy', weight: -2, summary: 'Burns the junta channel' },
                  ],
                },
                {
                  id: 'sh-4c',
                  label: 'Stay neutral; expand airlift',
                  detail: 'Bypass the road fight with temporary air corridors.',
                  effects: [
                    { tag: 'social_calm', weight: 1, summary: 'Partial relief for critical goods' },
                    { tag: 'market_stability', weight: -1, summary: 'Costly and incomplete substitute' },
                    { tag: 'credibility', weight: -1, summary: 'Looks like avoiding the hard bargain' },
                  ],
                },
              ],
            },
          ],
        },
        ops: {
          ...op('sh-1a', 'diplomatic', 'capital', 'ENGAGE'),
          ...op('sh-1b', 'economic', 'mine', 'SANCT'),
          ...op('sh-1c', 'civic', 'convoy', 'AID'),
          ...op('sh-2a', 'political', 'border', 'PAUSE'),
          ...op('sh-2b', 'naval', 'convoy', 'ESCORT'),
          ...op('sh-2c', 'economic', 'radio', 'DESIGN'),
          ...op('sh-3a', 'legal', 'capital', 'CALENDAR'),
          ...op('sh-3b', 'economic', 'mine', 'PHASE'),
          ...op('sh-3c', 'political', 'capital', 'DEFER'),
          ...op('sh-4a', 'diplomatic', 'border', 'TRI'),
          ...op('sh-4b', 'political', 'camp', 'ALIGN'),
          ...op('sh-4c', 'civic', 'convoy', 'AIRLIFT'),
        },
      },
    ],
  ),
  pack(
    'desk-redsea-markets',
    'Red Sea & Markets desk',
    'Shipping insurance spikes while a major treasury auction wobbles.',
    [
      {
        archetype: 'redsea',
        scenario: {
          id: 'rot-redsea-lane',
          title: 'Insurance Fire',
          region: 'Red Sea · Bab el-Mandeb',
          meterFamily: 'conflict',
          premise:
            'After a week of drone harassment, war-risk premiums jump and a major carrier suspends transits. You coordinate a maritime response cell.',
          role: 'Maritime security coordinator',
          tension: 'Keep trade moving without owning an open-ended escort war.',
          beats: [
            {
              id: 'rs-1',
              title: 'Carrier suspension',
              briefing: 'A top carrier exits the lane. Shippers ask for naval cover or an alternate Cape route subsidy.',
              stakes: 'Who absorbs the cost of coercion?',
              choices: [
                {
                  id: 'rs-1a',
                  label: 'Stand up a multinational escort slot',
                  detail: 'Shared escorts on announced windows.',
                  effects: [
                    { tag: 'deterrence', weight: 2, summary: 'Raises cost of harassment' },
                    { tag: 'alliance_cohesion', weight: 2, summary: 'Spreads burden' },
                    { tag: 'escalation', weight: 1, summary: 'More hulls in the lane' },
                  ],
                },
                {
                  id: 'rs-1b',
                  label: 'Temporary war-risk reinsurance',
                  detail: 'Public facility to reclaim premiums without new escorts.',
                  effects: [
                    { tag: 'market_stability', weight: 2, summary: 'Keeps some carriers pricing in' },
                    { tag: 'credibility', weight: -1, summary: 'May look like paying the tax' },
                    { tag: 'economic_pressure', weight: -1, summary: 'Does not hit perpetrators directly' },
                  ],
                },
                {
                  id: 'rs-1c',
                  label: 'Cape subsidy for critical cargo only',
                  detail: 'Reroute energy and meds; leave other cargo to market.',
                  effects: [
                    { tag: 'market_stability', weight: 1, summary: 'Protects priority flows' },
                    { tag: 'civilian_cost', weight: 1, summary: 'Broader goods still disrupted' },
                    { tag: 'time', weight: 1, summary: 'Buys planning days' },
                  ],
                },
              ],
            },
            {
              id: 'rs-2',
              title: 'Shore strike option',
              briefing: 'Intelligence offers a limited strike on a launch site assessed as low-civilian-risk.',
              stakes: 'A clean hit is rare; a dirty one owns the news cycle.',
              choices: [
                {
                  id: 'rs-2a',
                  label: 'Authorize the limited strike',
                  detail: 'Single-wave action with published legal rationale.',
                  effects: [
                    { tag: 'deterrence', weight: 2, summary: 'Imposes immediate cost' },
                    { tag: 'escalation', weight: 3, summary: 'Invites reciprocal cycles' },
                    { tag: 'civilian_cost', weight: 1, summary: 'Spillover risk remains' },
                  ],
                },
                {
                  id: 'rs-2b',
                  label: 'Hold kinetic; expand interception',
                  detail: 'Ship-based defense and ISR surge only.',
                  effects: [
                    { tag: 'deterrence', weight: 1, summary: 'Hardens the lane defensively' },
                    { tag: 'escalation', weight: -1, summary: 'Avoids a new strike threshold' },
                    { tag: 'alliance_cohesion', weight: 1, summary: 'Easier for partners to join' },
                  ],
                },
                {
                  id: 'rs-2c',
                  label: 'Private warning via mediator',
                  detail: 'Demand a pause with evidence packets, no public ultimatum.',
                  effects: [
                    { tag: 'diplomacy', weight: 2, summary: 'Preserves deniable off-ramp' },
                    { tag: 'domestic_support', weight: -1, summary: 'Looks opaque at home' },
                    { tag: 'time', weight: 1, summary: 'Creates a short clock' },
                  ],
                },
              ],
            },
            {
              id: 'rs-3',
              title: 'Canal authority call',
              briefing: 'A canal authority asks you to discourage panic messaging that is cutting their toll revenue.',
              stakes: 'Partner economics vs. honest risk communication.',
              choices: [
                {
                  id: 'rs-3a',
                  label: 'Joint risk bulletin with them',
                  detail: 'Shared facts, shared tone, updated twice daily.',
                  effects: [
                    { tag: 'alliance_cohesion', weight: 2, summary: 'Aligns messaging' },
                    { tag: 'market_stability', weight: 1, summary: 'Reduces rumor spikes' },
                    { tag: 'credibility', weight: 1, summary: 'Looks disciplined' },
                  ],
                },
                {
                  id: 'rs-3b',
                  label: 'Keep independent advisories',
                  detail: 'Refuse to soften language for toll optics.',
                  effects: [
                    { tag: 'credibility', weight: 1, summary: 'Keeps warning integrity' },
                    { tag: 'alliance_cohesion', weight: -1, summary: 'Frays the authority relationship' },
                    { tag: 'market_stability', weight: -1, summary: 'Mixed signals linger' },
                  ],
                },
                {
                  id: 'rs-3c',
                  label: 'Quiet toll relief fund',
                  detail: 'Compensate authority shortfalls while keeping frank advisories.',
                  effects: [
                    { tag: 'diplomacy', weight: 1, summary: 'Buys goodwill' },
                    { tag: 'economic_pressure', weight: 1, summary: 'Spends scarce political capital at home' },
                    { tag: 'market_stability', weight: 1, summary: 'Stabilizes a key node' },
                  ],
                },
              ],
            },
            {
              id: 'rs-4',
              title: 'Pause offer',
              briefing: 'An intermediary offers a ten-day launch pause if escort density drops and sanctions designations freeze.',
              stakes: 'Sequencing verification against political appetite.',
              choices: [
                {
                  id: 'rs-4a',
                  label: 'Accept staged verification',
                  detail: 'Escort trim only after 72 quiet hours.',
                  effects: [
                    { tag: 'diplomacy', weight: 3, summary: 'Opens a monitored pause' },
                    { tag: 'escalation', weight: -2, summary: 'Lowers near-term attack odds' },
                    { tag: 'credibility', weight: -1, summary: 'Hardliners call it a climb-down' },
                  ],
                },
                {
                  id: 'rs-4b',
                  label: 'Reject; keep escort density',
                  detail: 'Treat the offer as relief-seeking without compliance.',
                  effects: [
                    { tag: 'deterrence', weight: 2, summary: 'Maintains posture' },
                    { tag: 'escalation', weight: 1, summary: 'Conflict tempo continues' },
                    { tag: 'diplomacy', weight: -2, summary: 'Intermediary loses face' },
                  ],
                },
                {
                  id: 'rs-4c',
                  label: 'Narrow swap: pause for insurance relief only',
                  detail: 'No escort cut; temporary reinsurance if launches stop.',
                  effects: [
                    { tag: 'market_stability', weight: 2, summary: 'Attacks premiums directly' },
                    { tag: 'diplomacy', weight: 1, summary: 'Keeps a thin deal alive' },
                    { tag: 'deterrence', weight: 1, summary: 'Escorts remain' },
                  ],
                },
              ],
            },
          ],
        },
        ops: {
          ...op('rs-1a', 'naval', 'escort', 'ESCORT'),
          ...op('rs-1b', 'economic', 'insurer', 'REINS'),
          ...op('rs-1c', 'economic', 'canal', 'CAPE'),
          ...op('rs-2a', 'kinetic', 'proxy', 'STRIKE'),
          ...op('rs-2b', 'naval', 'chokepoint', 'INTERCEPT'),
          ...op('rs-2c', 'diplomatic', 'port', 'WARN'),
          ...op('rs-3a', 'diplomatic', 'canal', 'JOINT'),
          ...op('rs-3b', 'political', 'insurer', 'INDEP'),
          ...op('rs-3c', 'economic', 'canal', 'RELIEF'),
          ...op('rs-4a', 'diplomatic', 'port', 'PAUSE'),
          ...op('rs-4b', 'naval', 'escort', 'HOLD'),
          ...op('rs-4c', 'economic', 'insurer', 'SWAP'),
        },
      },
      {
        archetype: 'markets',
        scenario: {
          id: 'rot-auction-wobble',
          title: 'Auction Wobble',
          region: 'Global markets · sovereign desk',
          meterFamily: 'economy',
          premise:
            'A G7 treasury auction softens sharply while an emerging-market currency slides. You advise a finance minister through the next open.',
          role: 'Chief markets advisor to the finance minister',
          tension: 'Stabilize without promising a put that markets will test forever.',
          beats: [
            {
              id: 'mk-1',
              title: 'Opening gap',
              briefing: 'Futures imply a disorderly open. Banks want a liquidity statement; politicians want blame language.',
              stakes: 'Tone is a policy instrument.',
              choices: [
                {
                  id: 'mk-1a',
                  label: 'Technical liquidity readiness note',
                  detail: 'Emphasize tools without naming a backstop size.',
                  effects: [
                    { tag: 'market_stability', weight: 2, summary: 'Reduces gap-down panic' },
                    { tag: 'credibility', weight: 1, summary: 'Sounds competent to desks' },
                    { tag: 'domestic_support', weight: -1, summary: 'Too quiet for political theater' },
                  ],
                },
                {
                  id: 'mk-1b',
                  label: 'Hard verbal intervention',
                  detail: 'Promise decisive action if dysfunction continues.',
                  effects: [
                    { tag: 'market_stability', weight: 1, summary: 'Short covering possible' },
                    { tag: 'credibility', weight: -1, summary: 'Creates a testable put' },
                    { tag: 'escalation', weight: 1, summary: 'Raises stakes for the next print' },
                  ],
                },
                {
                  id: 'mk-1c',
                  label: 'Blame foreign flows; float capital tools',
                  detail: 'Signal possible temporary inflow frictions.',
                  effects: [
                    { tag: 'economic_pressure', weight: 1, summary: 'Threatens hot money' },
                    { tag: 'market_stability', weight: -2, summary: 'Uncertainty hits EM harder' },
                    { tag: 'polarization', weight: 1, summary: 'Domestic politics heat up' },
                  ],
                },
              ],
            },
            {
              id: 'mk-2',
              title: 'EM call',
              briefing: 'An EM partner asks for a swap line mention. Your central bank is wary of moral hazard.',
              stakes: 'Solidarity vs. balance-sheet risk.',
              choices: [
                {
                  id: 'mk-2a',
                  label: 'Technical swap readiness with limits',
                  detail: 'Narrow, collateralized, time-boxed.',
                  effects: [
                    { tag: 'alliance_cohesion', weight: 2, summary: 'Reassures the partner' },
                    { tag: 'market_stability', weight: 2, summary: 'Caps contagion odds' },
                    { tag: 'credibility', weight: 1, summary: 'Looks prepared' },
                  ],
                },
                {
                  id: 'mk-2b',
                  label: 'Refuse swap talk; offer surveillance only',
                  detail: 'Share data, not liquidity.',
                  effects: [
                    { tag: 'credibility', weight: 1, summary: 'Protects the balance sheet narrative' },
                    { tag: 'alliance_cohesion', weight: -2, summary: 'Partner feels exposed' },
                    { tag: 'market_stability', weight: -1, summary: 'Contagion channel stays open' },
                  ],
                },
                {
                  id: 'mk-2c',
                  label: 'Multilateral fund bridge instead',
                  detail: 'Push a regional/IMF-shaped facility as the first door.',
                  effects: [
                    { tag: 'diplomacy', weight: 2, summary: 'Multilateralizes the risk' },
                    { tag: 'time', weight: 1, summary: 'Slower than a bilateral swap' },
                    { tag: 'market_stability', weight: 1, summary: 'Partial confidence effect' },
                  ],
                },
              ],
            },
            {
              id: 'mk-3',
              title: 'Energy spike crosswind',
              briefing: 'A shipping scare lifts oil just as your auction needs calm. Industry wants SPR chatter.',
              stakes: 'Two crises sharing one attention budget.',
              choices: [
                {
                  id: 'mk-3a',
                  label: 'Quiet SPR optionality language',
                  detail: 'Signal readiness without a dump.',
                  effects: [
                    { tag: 'market_stability', weight: 2, summary: 'Caps energy panic premium' },
                    { tag: 'credibility', weight: 1, summary: 'Looks coordinated across desks' },
                    { tag: 'deterrence', weight: 0, summary: 'N/A' },
                  ],
                },
                {
                  id: 'mk-3b',
                  label: 'Ignore energy; focus only on rates',
                  detail: 'Avoid mixing theaters in one statement.',
                  effects: [
                    { tag: 'credibility', weight: 1, summary: 'Keeps a clean rates narrative' },
                    { tag: 'market_stability', weight: -1, summary: 'Leaves oil as a second shock' },
                    { tag: 'domestic_support', weight: -1, summary: 'Consumers feel unseen' },
                  ],
                },
                {
                  id: 'mk-3c',
                  label: 'Joint energy-finance war room',
                  detail: 'One briefing linking shipping, oil, and auction optics.',
                  effects: [
                    { tag: 'alliance_cohesion', weight: 1, summary: 'Pulls agencies into one frame' },
                    { tag: 'time', weight: -1, summary: 'Coordination tax' },
                    { tag: 'market_stability', weight: 1, summary: 'Reduces mixed messaging' },
                  ],
                },
              ],
            },
            {
              id: 'mk-4',
              title: 'Post-auction choice',
              briefing: 'The auction clears weakly. Do you lean into buybacks, accept higher yields, or scold primary dealers?',
              stakes: 'Market function vs. political humiliation.',
              choices: [
                {
                  id: 'mk-4a',
                  label: 'Limited buyback / liquidity op',
                  detail: 'Target dysfunctional tenors only.',
                  effects: [
                    { tag: 'market_stability', weight: 3, summary: 'Repairs plumbing' },
                    { tag: 'credibility', weight: 1, summary: 'Shows tool use under stress' },
                    { tag: 'economic_pressure', weight: 1, summary: 'Spends policy powder' },
                  ],
                },
                {
                  id: 'mk-4b',
                  label: 'Accept the print; no ops',
                  detail: 'Let price discover without a backstop.',
                  effects: [
                    { tag: 'credibility', weight: 1, summary: 'Avoids a permanent put' },
                    { tag: 'market_stability', weight: -2, summary: 'Volatility may persist' },
                    { tag: 'domestic_support', weight: -1, summary: 'Looks passive' },
                  ],
                },
                {
                  id: 'mk-4c',
                  label: 'Public pressure on dealers',
                  detail: 'Call out balance-sheet retreat in the open.',
                  effects: [
                    { tag: 'polarization', weight: 2, summary: 'Turns plumbing into politics' },
                    { tag: 'market_stability', weight: -1, summary: 'Dealers may step further back' },
                    { tag: 'domestic_support', weight: 1, summary: 'Scapegoat narrative lands' },
                  ],
                },
              ],
            },
          ],
        },
        ops: {
          ...op('mk-1a', 'economic', 'fed', 'LIQ'),
          ...op('mk-1b', 'political', 'treasury', 'PUT'),
          ...op('mk-1c', 'economic', 'em', 'FRICTION'),
          ...op('mk-2a', 'diplomatic', 'em', 'SWAP'),
          ...op('mk-2b', 'economic', 'fed', 'WATCH'),
          ...op('mk-2c', 'diplomatic', 'exchange', 'MULTI'),
          ...op('mk-3a', 'economic', 'energy', 'SPR'),
          ...op('mk-3b', 'economic', 'desk', 'RATES'),
          ...op('mk-3c', 'political', 'treasury', 'WARROOM'),
          ...op('mk-4a', 'economic', 'exchange', 'BUYBACK'),
          ...op('mk-4b', 'economic', 'desk', 'PASS'),
          ...op('mk-4c', 'political', 'treasury', 'PRESS'),
        },
      },
    ],
  ),
  pack(
    'desk-southasia-americas',
    'South Asia & Americas desk',
    'A border firefight and a creditor showdown land on the same overnight brief.',
    [
      {
        archetype: 'southasia',
        scenario: {
          id: 'rot-loc-firefight',
          title: 'Line of Control',
          region: 'South Asia · contested border',
          meterFamily: 'conflict',
          premise:
            'A firefight along a contested line kills soldiers on both sides. Domestic media demand retaliation; third parties offer talks.',
          role: 'Crisis manager to the national security advisor',
          tension: 'Honor domestic pressure without losing escalation control.',
          beats: [
            {
              id: 'sa-1',
              title: 'First night',
              briefing: 'Rules of engagement requests land on your desk: proportionate fire, local raid, or hold and investigate.',
              stakes: 'Speed vs. evidence.',
              choices: [
                {
                  id: 'sa-1a',
                  label: 'Authorize proportionate counter-battery',
                  detail: 'Limited fires against identified positions.',
                  effects: [
                    { tag: 'deterrence', weight: 2, summary: 'Shows ability to answer' },
                    { tag: 'escalation', weight: 2, summary: 'Risks ladder climb' },
                    { tag: 'domestic_support', weight: 1, summary: 'Meets retaliation demand' },
                  ],
                },
                {
                  id: 'sa-1b',
                  label: 'Hold fire; open hotline',
                  detail: 'Demand an immediate call and joint fact sheet.',
                  effects: [
                    { tag: 'diplomacy', weight: 2, summary: 'Creates an off-ramp channel' },
                    { tag: 'credibility', weight: -1, summary: 'Domestic critics call it weak' },
                    { tag: 'escalation', weight: -1, summary: 'Lowers near-term fire' },
                  ],
                },
                {
                  id: 'sa-1c',
                  label: 'Information surge first',
                  detail: 'Release imagery and timelines before kinetic choices.',
                  effects: [
                    { tag: 'credibility', weight: 2, summary: 'Shapes the narrative with evidence' },
                    { tag: 'time', weight: 1, summary: 'Buys decision space' },
                    { tag: 'escalation', weight: 0, summary: 'Keeps kinetic options open' },
                  ],
                },
              ],
            },
            {
              id: 'sa-2',
              title: 'Third-party offer',
              briefing: 'A major capital offers to host DGMO-level talks in 48 hours if both sides pause artillery.',
              stakes: 'Accepting invites mediation politics; refusing may trap you in fire.',
              choices: [
                {
                  id: 'sa-2a',
                  label: 'Accept talks with a verified pause',
                  detail: 'Monitors for a 48-hour quiet period.',
                  effects: [
                    { tag: 'diplomacy', weight: 3, summary: 'Moves conflict to a table' },
                    { tag: 'escalation', weight: -2, summary: 'Reduces fire intensity' },
                    { tag: 'domestic_support', weight: -1, summary: 'Looks externally managed' },
                  ],
                },
                {
                  id: 'sa-2b',
                  label: 'Reject mediation; bilateral only',
                  detail: 'Keep the third party out of the frame.',
                  effects: [
                    { tag: 'credibility', weight: 1, summary: 'Protects bilateral preference' },
                    { tag: 'diplomacy', weight: -1, summary: 'Fewer brokers available' },
                    { tag: 'escalation', weight: 1, summary: 'Pause less likely' },
                  ],
                },
                {
                  id: 'sa-2c',
                  label: 'Counter: talks after a fact-finding visit',
                  detail: 'Neutral observers first, politics second.',
                  effects: [
                    { tag: 'diplomacy', weight: 1, summary: 'Keeps a path without full mediation' },
                    { tag: 'time', weight: 1, summary: 'Adds a procedural step' },
                    { tag: 'alliance_cohesion', weight: 1, summary: 'Partners can endorse process' },
                  ],
                },
              ],
            },
            {
              id: 'sa-3',
              title: 'Market and diaspora noise',
              briefing: 'Your currency wobbles and diaspora protests surge. Finance wants calm language; activists want solidarity rhetoric.',
              stakes: 'Two audiences, one microphone.',
              choices: [
                {
                  id: 'sa-3a',
                  label: 'Split messages: calm markets, firm security',
                  detail: 'Finance and security spokespeople with distinct lanes.',
                  effects: [
                    { tag: 'market_stability', weight: 2, summary: 'Limits FX overshoot' },
                    { tag: 'credibility', weight: 1, summary: 'Looks organized' },
                    { tag: 'domestic_support', weight: 1, summary: 'Security ethos stays visible' },
                  ],
                },
                {
                  id: 'sa-3b',
                  label: 'Single maximalist speech',
                  detail: 'One address that prioritizes resolve over market tone.',
                  effects: [
                    { tag: 'domestic_support', weight: 2, summary: 'Energizes the base' },
                    { tag: 'market_stability', weight: -2, summary: 'Risk premium jumps' },
                    { tag: 'escalation', weight: 1, summary: 'Raises rhetorical temperature' },
                  ],
                },
                {
                  id: 'sa-3c',
                  label: 'Quiet everything for 24 hours',
                  detail: 'Minimize official comment while facts firm up.',
                  effects: [
                    { tag: 'escalation', weight: -1, summary: 'Avoids verbal fuel' },
                    { tag: 'credibility', weight: -1, summary: 'Vacuum fills with rumor' },
                    { tag: 'time', weight: 1, summary: 'Creates a brief quiet window' },
                  ],
                },
              ],
            },
            {
              id: 'sa-4',
              title: 'Disengagement map',
              briefing: 'Military staff propose a temporary pullback from two posts if the other side mirrors.',
              stakes: 'Tactical space for political oxygen.',
              choices: [
                {
                  id: 'sa-4a',
                  label: 'Accept mirrored disengagement',
                  detail: 'Written, time-bound, with verification.',
                  effects: [
                    { tag: 'diplomacy', weight: 2, summary: 'Creates breathing room' },
                    { tag: 'escalation', weight: -2, summary: 'Lowers contact risk' },
                    { tag: 'deterrence', weight: -1, summary: 'Some read it as yielding ground' },
                  ],
                },
                {
                  id: 'sa-4b',
                  label: 'Refuse pullback; fortify posts',
                  detail: 'Hold terrain and improve defenses.',
                  effects: [
                    { tag: 'deterrence', weight: 2, summary: 'Signals permanence of presence' },
                    { tag: 'escalation', weight: 1, summary: 'Keeps forces in contact range' },
                    { tag: 'diplomacy', weight: -1, summary: 'Harder to sell a pause' },
                  ],
                },
                {
                  id: 'sa-4c',
                  label: 'Partial: cameras and buffer only',
                  detail: 'No pullback; shared sensors on the contact line.',
                  effects: [
                    { tag: 'diplomacy', weight: 1, summary: 'A thinner confidence measure' },
                    { tag: 'alliance_cohesion', weight: 1, summary: 'Third parties can help monitor' },
                    { tag: 'escalation', weight: -1, summary: 'Slightly reduces surprise risk' },
                  ],
                },
              ],
            },
          ],
        },
        ops: {
          ...op('sa-1a', 'kinetic', 'loc', 'FIRE'),
          ...op('sa-1b', 'diplomatic', 'capital_a', 'HOTLINE'),
          ...op('sa-1c', 'political', 'media', 'EVIDENCE'),
          ...op('sa-2a', 'diplomatic', 'third', 'TALKS'),
          ...op('sa-2b', 'political', 'capital_b', 'BILAT'),
          ...op('sa-2c', 'diplomatic', 'valley', 'FACTS'),
          ...op('sa-3a', 'economic', 'capital_a', 'SPLIT'),
          ...op('sa-3b', 'political', 'media', 'SPEECH'),
          ...op('sa-3c', 'diplomatic', 'capital_a', 'QUIET'),
          ...op('sa-4a', 'diplomatic', 'loc', 'PULL'),
          ...op('sa-4b', 'kinetic', 'loc', 'HOLD'),
          ...op('sa-4c', 'diplomatic', 'valley', 'SENSOR'),
        },
      },
      {
        archetype: 'americas',
        scenario: {
          id: 'rot-creditor-showdown',
          title: 'Creditor Clock',
          region: 'Americas · sovereign finance',
          meterFamily: 'economy',
          premise:
            'A middle-income government faces a creditor committee deadline while street protests hit the capital. You advise the economy ministry.',
          role: 'Deputy minister for finance strategy',
          tension: 'Social peace vs. market access — both are scarce.',
          beats: [
            {
              id: 'am-1',
              title: 'Committee ask',
              briefing: 'Creditors want deeper primary surplus. Unions want the opposite. Markets want clarity by Friday.',
              stakes: 'Distributional pain is the policy.',
              choices: [
                {
                  id: 'am-1a',
                  label: 'Offer a staged surplus path',
                  detail: 'Front-load credible measures; back-load social offsets.',
                  effects: [
                    { tag: 'market_stability', weight: 2, summary: 'Gives markets a path' },
                    { tag: 'diplomacy', weight: 1, summary: 'Keeps creditors at the table' },
                    { tag: 'social_calm', weight: -1, summary: 'Near-term pain remains' },
                  ],
                },
                {
                  id: 'am-1b',
                  label: 'Hard refusal; threaten unilateral reprofile',
                  detail: 'Force a take-it-or-leave-it political moment.',
                  effects: [
                    { tag: 'economic_pressure', weight: 2, summary: 'Raises creditor losses odds' },
                    { tag: 'market_stability', weight: -3, summary: 'Risks a disorderly spiral' },
                    { tag: 'domestic_support', weight: 1, summary: 'Populist frame lands' },
                  ],
                },
                {
                  id: 'am-1c',
                  label: 'Buy time with a bridge loan narrative',
                  detail: 'Signal a short facility while talks continue.',
                  effects: [
                    { tag: 'time', weight: 2, summary: 'Extends the runway' },
                    { tag: 'market_stability', weight: 1, summary: 'Partial relief' },
                    { tag: 'credibility', weight: -1, summary: 'Bridge without reform looks thin' },
                  ],
                },
              ],
            },
            {
              id: 'am-2',
              title: 'Plaza night',
              briefing: 'Protests swell after a leaked austerity annex. Police ask for a tougher perimeter.',
              stakes: 'Order vs. legitimacy on camera.',
              choices: [
                {
                  id: 'am-2a',
                  label: 'Protect protest corridors; limit force',
                  detail: 'Negotiated routes and visible de-escalation units.',
                  effects: [
                    { tag: 'social_calm', weight: 2, summary: 'Reduces clash odds' },
                    { tag: 'liberal_trust', weight: 1, summary: 'Civil society reads restraint' },
                    { tag: 'governability', weight: -1, summary: 'Some ministries feel exposed' },
                  ],
                },
                {
                  id: 'am-2b',
                  label: 'Hard perimeter and curfew talk',
                  detail: 'Prioritize ministry security and market optics.',
                  effects: [
                    { tag: 'governability', weight: 1, summary: 'Keeps the buildings open' },
                    { tag: 'polarization', weight: 2, summary: 'Feeds repression narrative' },
                    { tag: 'social_calm', weight: -2, summary: 'May escalate nights ahead' },
                  ],
                },
                {
                  id: 'am-2c',
                  label: 'Withdraw the annex; restart talks',
                  detail: 'Sacrifice the leak to reset bargaining.',
                  effects: [
                    { tag: 'social_calm', weight: 2, summary: 'Takes heat off the plaza' },
                    { tag: 'market_stability', weight: -1, summary: 'Looks like backtracking' },
                    { tag: 'diplomacy', weight: 1, summary: 'Creates space with creditors later' },
                  ],
                },
              ],
            },
            {
              id: 'am-3',
              title: 'Export shock',
              briefing: 'Commodity prices dip, undercutting your revenue story mid-negotiation.',
              stakes: 'Numbers moved under your feet.',
              choices: [
                {
                  id: 'am-3a',
                  label: 'Update the IMF/creditor baseline honestly',
                  detail: 'Re-cut numbers in the open.',
                  effects: [
                    { tag: 'credibility', weight: 2, summary: 'Honesty premium with desks' },
                    { tag: 'market_stability', weight: -1, summary: 'Ugly print still hurts' },
                    { tag: 'diplomacy', weight: 1, summary: 'Keeps technocratic trust' },
                  ],
                },
                {
                  id: 'am-3b',
                  label: 'Hold the old baseline; hope for a rebound',
                  detail: 'Avoid reopening settled annexes.',
                  effects: [
                    { tag: 'time', weight: 1, summary: 'Avoids immediate reopen' },
                    { tag: 'credibility', weight: -2, summary: 'If wrong, trust collapses' },
                    { tag: 'market_stability', weight: -1, summary: 'Skepticism rises' },
                  ],
                },
                {
                  id: 'am-3c',
                  label: 'Ask for a commodity contingency clause',
                  detail: 'Automatic adjusters if prices stay low.',
                  effects: [
                    { tag: 'diplomacy', weight: 2, summary: 'Shares risk with creditors' },
                    { tag: 'market_stability', weight: 1, summary: 'Makes the path more believable' },
                    { tag: 'governability', weight: 1, summary: 'Gives domestic cover' },
                  ],
                },
              ],
            },
            {
              id: 'am-4',
              title: 'Deadline night',
              briefing: 'Creditors present a near-final term sheet. Signing calms markets but may ignite the plaza again.',
              stakes: 'You can almost certainly not optimize both tonight.',
              choices: [
                {
                  id: 'am-4a',
                  label: 'Sign with a social compensation package',
                  detail: 'Pair the deal with targeted transfers announced the same hour.',
                  effects: [
                    { tag: 'market_stability', weight: 3, summary: 'Unlocks access narrative' },
                    { tag: 'social_calm', weight: 1, summary: 'Softens the landing' },
                    { tag: 'economic_pressure', weight: 1, summary: 'Fiscal room shrinks' },
                  ],
                },
                {
                  id: 'am-4b',
                  label: 'Walk away; call a popular consultation',
                  detail: 'Politicize the mandate before signing.',
                  effects: [
                    { tag: 'democratic_mandate', weight: 2, summary: 'Returns the question to publics' },
                    { tag: 'market_stability', weight: -3, summary: 'Immediate risk-off' },
                    { tag: 'polarization', weight: 2, summary: 'Campaign mode begins' },
                  ],
                },
                {
                  id: 'am-4c',
                  label: 'Sign narrowly; leave controversial annexes out',
                  detail: 'A thinner deal to survive the week.',
                  effects: [
                    { tag: 'market_stability', weight: 1, summary: 'Partial calm' },
                    { tag: 'time', weight: 2, summary: 'Pushes fights into the next round' },
                    { tag: 'credibility', weight: -1, summary: 'Both camps may call it incomplete' },
                  ],
                },
              ],
            },
          ],
        },
        ops: {
          ...op('am-1a', 'economic', 'imf', 'STAGED'),
          ...op('am-1b', 'political', 'capital', 'REFUSE'),
          ...op('am-1c', 'economic', 'imf', 'BRIDGE'),
          ...op('am-2a', 'civic', 'plaza', 'CORRIDOR'),
          ...op('am-2b', 'political', 'capital', 'CURFEW'),
          ...op('am-2c', 'political', 'court', 'WITHDRAW'),
          ...op('am-3a', 'economic', 'farm', 'REBASE'),
          ...op('am-3b', 'economic', 'desk', 'HOLD'),
          ...op('am-3c', 'diplomatic', 'imf', 'CLAUSE'),
          ...op('am-4a', 'economic', 'imf', 'SIGN'),
          ...op('am-4b', 'civic', 'plaza', 'CONSULT'),
          ...op('am-4c', 'economic', 'port', 'THIN'),
        },
      },
    ],
  ),
];

export function packForEpoch(epochIndex: number): RotationBundle {
  const i = ((epochIndex % MOCK_ROTATION_PACKS.length) + MOCK_ROTATION_PACKS.length) % MOCK_ROTATION_PACKS.length;
  return MOCK_ROTATION_PACKS[i];
}
