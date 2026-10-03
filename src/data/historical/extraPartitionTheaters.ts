import type { HistoricalScenario } from '@/data/historical/build';

/**
 * Extra theaters requested beyond the original 30:
 * - Balfour Declaration (1917)
 * - Two Koreas / peninsula partition (1948) — distinct from Parallel War (1950 combat)
 */
export const extraPartitionScenarios: HistoricalScenario[] = [
  {
    id: 'hist-1917-balfour',
    year: 1917,
    era: '1914–1918',
    title: 'Balfour Declaration',
    region: 'Palestine · London · Arab Revolt · wartime diplomacy',
    meterFamily: 'conflict',
    theaterArchetype: 'redsea',
    premise:
      'In the middle of a world war, Britain weighs a public declaration favoring a Jewish national home in Palestine while already courting Arab partners against the Ottomans and negotiating secretly with France over postwar spoils. You advise the War Cabinet on wording, timing, and how much contradiction the empire can absorb.',
    role: 'War Cabinet Near East counselor',
    tension:
      'A wartime pledge can win allies now and mortgage the postwar map for generations.',
    beats: [
      {
        id: 'hist-1917-balfour-1',
        title: 'Draft language',
        briefing:
          'Zionist envoys press for a clear national-home pledge. India Office and Arab Bureau warn that absolutist wording will detonate promises already made to Arab leaders.',
        stakes:
          'One paragraph will be read as a charter—or a betrayal—for decades.',
        choices: [
          {
            id: 'hist-1917-balfour-1a',
            label: 'Issue a firm national-home declaration',
            detail: 'Clarity over hedge.',
            kind: 'diplomatic',
            markerId: 'port',
            short: 'DECLARE',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Zionist alignment' },
              { tag: 'alliance_cohesion', weight: -2, summary: 'Arab partners shaken' },
              { tag: 'credibility', weight: 1, summary: 'Public line set' },
            ],
          },
          {
            id: 'hist-1917-balfour-1b',
            label: 'Hedge: national home subject to existing civil rights',
            detail: 'Qualified pledge.',
            kind: 'political',
            markerId: 'insurer',
            short: 'HEDGE',
            effects: [
              { tag: 'diplomacy', weight: 1, summary: 'Balanced text' },
              { tag: 'credibility', weight: -1, summary: 'Ambiguity weaponized' },
              { tag: 'norm_protection', weight: 1, summary: 'Rights clause' },
            ],
          },
          {
            id: 'hist-1917-balfour-1c',
            label: 'Delay any public letter until after the next offensive',
            detail: 'Silence as policy.',
            kind: 'political',
            markerId: 'canal',
            short: 'DELAY',
            effects: [
              { tag: 'time', weight: 1, summary: 'Room to bargain' },
              { tag: 'credibility', weight: -1, summary: 'Lobby pressure builds' },
              { tag: 'escalation', weight: -1, summary: 'No new spark yet' },
            ],
          },
        ],
      },
      {
        id: 'hist-1917-balfour-2',
        title: 'Arab liaison',
        briefing:
          'Sharifian contacts demand to know whether London still honors independence understandings. A vague cable will not hold the desert flank.',
        stakes:
          'The revolt’s loyalty is transactional and watching London’s ink.',
        choices: [
          {
            id: 'hist-1917-balfour-2a',
            label: 'Reaffirm Arab independence pledges in a parallel note',
            detail: 'Two tracks, same week.',
            kind: 'diplomatic',
            markerId: 'proxy',
            short: 'PARNOTE',
            effects: [
              { tag: 'alliance_cohesion', weight: 2, summary: 'Revolt steadied' },
              { tag: 'credibility', weight: -2, summary: 'Contradictory pledges' },
              { tag: 'diplomacy', weight: 1, summary: 'Dual outreach' },
            ],
          },
          {
            id: 'hist-1917-balfour-2b',
            label: 'Tell Arab partners the declaration is wartime propaganda only',
            detail: 'Downplay in private.',
            kind: 'diplomatic',
            markerId: 'escort',
            short: 'PRIVATE',
            effects: [
              { tag: 'alliance_cohesion', weight: 1, summary: 'Short-term calm' },
              { tag: 'credibility', weight: -3, summary: 'Bad faith risk' },
              { tag: 'escalation', weight: 1, summary: 'Later explosion' },
            ],
          },
          {
            id: 'hist-1917-balfour-2c',
            label: 'Offer postwar conference seats instead of textual fixes',
            detail: 'Process as substitute.',
            kind: 'political',
            markerId: 'insurer',
            short: 'FORUM',
            effects: [
              { tag: 'diplomacy', weight: 1, summary: 'Talks path' },
              { tag: 'time', weight: 1, summary: 'Defers clash' },
              { tag: 'polarization', weight: 1, summary: 'Expectations diverge' },
            ],
          },
        ],
      },
      {
        id: 'hist-1917-balfour-3',
        title: 'French factor',
        briefing:
          'Paris reminds you of Sykes–Picot maps. A unilateral British letter on Palestine can be read as reneging on the carve-up.',
        stakes:
          'Ally management is as sharp as local politics.',
        choices: [
          {
            id: 'hist-1917-balfour-3a',
            label: 'Brief France before publication; offer joint stewardship language',
            detail: 'Share the burden.',
            kind: 'diplomatic',
            markerId: 'port',
            short: 'BRIEF',
            effects: [
              { tag: 'alliance_cohesion', weight: 2, summary: 'Entente soothed' },
              { tag: 'diplomacy', weight: 1, summary: 'Coordinated text' },
              { tag: 'time', weight: -1, summary: 'Negotiating delay' },
            ],
          },
          {
            id: 'hist-1917-balfour-3b',
            label: 'Publish unilaterally; treat Picot as obsolete wartime sketch',
            detail: 'British lead.',
            kind: 'political',
            markerId: 'chokepoint',
            short: 'SOLO',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Decisive' },
              { tag: 'alliance_cohesion', weight: -2, summary: 'Paris slighted' },
              { tag: 'escalation', weight: 1, summary: 'Mandate fight later' },
            ],
          },
          {
            id: 'hist-1917-balfour-3c',
            label: 'Fold Palestine into a wider Levant condominium proposal',
            detail: 'Enlarge the deal.',
            kind: 'diplomatic',
            markerId: 'escort',
            short: 'CONDO',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Grand bargain try' },
              { tag: 'governability', weight: -1, summary: 'Complex map' },
              { tag: 'polarization', weight: 1, summary: 'More claimants' },
            ],
          },
        ],
      },
      {
        id: 'hist-1917-balfour-4',
        title: 'Domestic cabinet split',
        briefing:
          'Some ministers want the letter as a war measure; others fear imperial overstretch and Indian Muslim reaction.',
        stakes:
          'Cabinet unity is the launch pad—or the veto.',
        choices: [
          {
            id: 'hist-1917-balfour-4a',
            label: 'Force a Cabinet vote and publish with majority backing',
            detail: 'Own the decision.',
            kind: 'political',
            markerId: 'insurer',
            short: 'VOTE',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Cabinet seal' },
              { tag: 'polarization', weight: 1, summary: 'Losers resent' },
              { tag: 'domestic_support', weight: 1, summary: 'Clear mandate' },
            ],
          },
          {
            id: 'hist-1917-balfour-4b',
            label: 'Issue as Foreign Office note without full Cabinet drama',
            detail: 'Bureaucratic path.',
            kind: 'legal',
            markerId: 'canal',
            short: 'FO-NOTE',
            effects: [
              { tag: 'time', weight: 1, summary: 'Faster release' },
              { tag: 'credibility', weight: -1, summary: 'Thin legitimacy' },
              { tag: 'governability', weight: 1, summary: 'Less theater' },
            ],
          },
          {
            id: 'hist-1917-balfour-4c',
            label: 'Water down further to keep India Office onboard',
            detail: 'Empire first.',
            kind: 'political',
            markerId: 'escort',
            short: 'DILUTE',
            effects: [
              { tag: 'alliance_cohesion', weight: 1, summary: 'India soothed' },
              { tag: 'diplomacy', weight: -2, summary: 'Zionist disillusion' },
              { tag: 'escalation', weight: -1, summary: 'Less heat now' },
            ],
          },
        ],
      },
      {
        id: 'hist-1917-balfour-5',
        title: 'Jerusalem approach',
        briefing:
          'Allenby’s forces near the city. Military government will inherit whatever political text you just floated.',
        stakes:
          'Occupation policy must match the letter—or expose it.',
        choices: [
          {
            id: 'hist-1917-balfour-5a',
            label: 'Instruct military admin to protect all communities equally',
            detail: 'Neutral occupation.',
            kind: 'civic',
            markerId: 'port',
            short: 'EQUAL',
            effects: [
              { tag: 'norm_protection', weight: 2, summary: 'Equal protection' },
              { tag: 'social_calm', weight: 1, summary: 'Street steadier' },
              { tag: 'polarization', weight: -1, summary: 'Neither side fully won' },
            ],
          },
          {
            id: 'hist-1917-balfour-5b',
            label: 'Prioritize Jewish immigration facilitation under arms',
            detail: 'Implement the spirit.',
            kind: 'kinetic',
            markerId: 'proxy',
            short: 'FACIL',
            effects: [
              { tag: 'diplomacy', weight: 1, summary: 'Pledge made real' },
              { tag: 'escalation', weight: 2, summary: 'Arab unrest' },
              { tag: 'civilian_cost', weight: 1, summary: 'Clash risk' },
            ],
          },
          {
            id: 'hist-1917-balfour-5c',
            label: 'Freeze demographic change until a peace conference',
            detail: 'Hold the map.',
            kind: 'legal',
            markerId: 'chokepoint',
            short: 'FREEZE',
            effects: [
              { tag: 'time', weight: 2, summary: 'Conference window' },
              { tag: 'credibility', weight: -1, summary: 'Pledge hollowed' },
              { tag: 'escalation', weight: -1, summary: 'Short-term quiet' },
            ],
          },
        ],
      },
      {
        id: 'hist-1917-balfour-6',
        title: 'American opinion',
        briefing:
          'Washington’s sympathy matters for loans and postwar settlement. Zionist networks and missionary lobbies pull opposite ways.',
        stakes:
          'Transatlantic narrative can lock your text in place.',
        choices: [
          {
            id: 'hist-1917-balfour-6a',
            label: 'Coordinate messaging with Wilson’s advisors',
            detail: 'Align the allies.',
            kind: 'diplomatic',
            markerId: 'escort',
            short: 'WILSON',
            effects: [
              { tag: 'alliance_cohesion', weight: 2, summary: 'US cover' },
              { tag: 'diplomacy', weight: 1, summary: 'Shared frame' },
              { tag: 'time', weight: -1, summary: 'Coordination lag' },
            ],
          },
          {
            id: 'hist-1917-balfour-6b',
            label: 'Keep the declaration a British initiative',
            detail: 'Own the brand.',
            kind: 'political',
            markerId: 'insurer',
            short: 'BRITISH',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Imperial lead' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Less US buy-in' },
              { tag: 'diplomacy', weight: 0, summary: 'Solo path' },
            ],
          },
          {
            id: 'hist-1917-balfour-6c',
            label: 'Leak competing drafts to test US reaction',
            detail: 'Trial balloons.',
            kind: 'civic',
            markerId: 'canal',
            short: 'LEAK',
            effects: [
              { tag: 'diplomacy', weight: 1, summary: 'Signal read' },
              { tag: 'credibility', weight: -2, summary: 'Chaos of drafts' },
              { tag: 'polarization', weight: 1, summary: 'Lobbies mobilize' },
            ],
          },
        ],
      },
      {
        id: 'hist-1917-balfour-7',
        title: 'Holy sites crisis',
        briefing:
          'Rumors of temple-mount and church status changes spark riots in waiting. Clerics demand written guarantees.',
        stakes:
          'Sacred geography can override any cabinet minute.',
        choices: [
          {
            id: 'hist-1917-balfour-7a',
            label: 'Issue a multi-faith holy-sites guarantee',
            detail: 'Sacred status quo.',
            kind: 'legal',
            markerId: 'port',
            short: 'SITES',
            effects: [
              { tag: 'social_calm', weight: 2, summary: 'Clerics eased' },
              { tag: 'norm_protection', weight: 2, summary: 'Status quo' },
              { tag: 'diplomacy', weight: 1, summary: 'Broader buy-in' },
            ],
          },
          {
            id: 'hist-1917-balfour-7b',
            label: 'Leave holy sites to future commission',
            detail: 'Defer the fuse.',
            kind: 'political',
            markerId: 'escort',
            short: 'DEFER',
            effects: [
              { tag: 'time', weight: 1, summary: 'Kicks down road' },
              { tag: 'escalation', weight: 1, summary: 'Uncertainty' },
              { tag: 'credibility', weight: -1, summary: 'Evades core' },
            ],
          },
          {
            id: 'hist-1917-balfour-7c',
            label: 'Place sites under international trusteeship language',
            detail: 'Internationalize.',
            kind: 'diplomatic',
            markerId: 'chokepoint',
            short: 'TRUST',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Shared custody idea' },
              { tag: 'governability', weight: -1, summary: 'Who governs?' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Partners interested' },
            ],
          },
        ],
      },
      {
        id: 'hist-1917-balfour-8',
        title: 'Immigration numbers',
        briefing:
          'Activists want large entry quotas now; officers on the ground say ports and villages cannot absorb a surge mid-war.',
        stakes:
          'Demography is strategy wearing a passenger list.',
        choices: [
          {
            id: 'hist-1917-balfour-8a',
            label: 'Authorize controlled wartime immigration corridors',
            detail: 'Managed flow.',
            kind: 'civic',
            markerId: 'proxy',
            short: 'CORRIDOR',
            effects: [
              { tag: 'diplomacy', weight: 1, summary: 'Pledge tangible' },
              { tag: 'civilian_cost', weight: 1, summary: 'Strain on ground' },
              { tag: 'escalation', weight: 1, summary: 'Local backlash' },
            ],
          },
          {
            id: 'hist-1917-balfour-8b',
            label: 'Cap entry tightly until armistice',
            detail: 'Numbers later.',
            kind: 'political',
            markerId: 'port',
            short: 'CAP',
            effects: [
              { tag: 'escalation', weight: -1, summary: 'Less shock' },
              { tag: 'credibility', weight: -2, summary: 'Hollow home' },
              { tag: 'time', weight: 1, summary: 'Admin breathing room' },
            ],
          },
          {
            id: 'hist-1917-balfour-8c',
            label: 'Tie immigration to land-purchase transparency rules',
            detail: 'Law before volume.',
            kind: 'legal',
            markerId: 'insurer',
            short: 'LANDLAW',
            effects: [
              { tag: 'norm_protection', weight: 2, summary: 'Rule of law frame' },
              { tag: 'governability', weight: 1, summary: 'Clearer titles' },
              { tag: 'polarization', weight: 1, summary: 'Both sides litigate' },
            ],
          },
        ],
      },
      {
        id: 'hist-1917-balfour-9',
        title: 'Postwar mandate ask',
        briefing:
          'Peace planners want to know: is Palestine a British mandate, international zone, or Arab federation member with special clauses?',
        stakes:
          'The declaration must attach to a governing form—or it floats as myth.',
        choices: [
          {
            id: 'hist-1917-balfour-9a',
            label: 'Push for a British Mandate with national-home article',
            detail: 'Empire as guarantor.',
            kind: 'political',
            markerId: 'chokepoint',
            short: 'MANDATE',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Enforceable frame' },
              { tag: 'escalation', weight: 1, summary: 'Imperial load' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Rivals object' },
            ],
          },
          {
            id: 'hist-1917-balfour-9b',
            label: 'Propose international administration under a new league',
            detail: 'Collective custody.',
            kind: 'diplomatic',
            markerId: 'escort',
            short: 'LEAGUE',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Multilateral' },
              { tag: 'governability', weight: -2, summary: 'Diffuse authority' },
              { tag: 'norm_protection', weight: 1, summary: 'Institutional path' },
            ],
          },
          {
            id: 'hist-1917-balfour-9c',
            label: 'Nest special Jewish rights inside a wider Arab state',
            detail: 'Autonomy clause.',
            kind: 'diplomatic',
            markerId: 'proxy',
            short: 'AUTONOMY',
            effects: [
              { tag: 'alliance_cohesion', weight: 1, summary: 'Arab frame' },
              { tag: 'diplomacy', weight: -1, summary: 'Zionist rejection risk' },
              { tag: 'polarization', weight: 2, summary: 'Both claim betrayal' },
            ],
          },
        ],
      },
      {
        id: 'hist-1917-balfour-10',
        title: 'Legacy brief',
        briefing:
          'You must write the standing guidance: was the declaration a war expedient, a moral commitment, or a reversible instrument?',
        stakes:
          'How Whitehall remembers this letter becomes the next century’s opening move.',
        choices: [
          {
            id: 'hist-1917-balfour-10a',
            label: 'Codify it as a binding national commitment',
            detail: 'Irreversible line.',
            kind: 'legal',
            markerId: 'insurer',
            short: 'BIND',
            effects: [
              { tag: 'credibility', weight: 3, summary: 'Hard pledge' },
              { tag: 'escalation', weight: 2, summary: 'Conflict locked in' },
              { tag: 'diplomacy', weight: 1, summary: 'Clear for allies' },
            ],
          },
          {
            id: 'hist-1917-balfour-10b',
            label: 'File it as wartime expediency subject to peace conference',
            detail: 'Contingent tool.',
            kind: 'political',
            markerId: 'canal',
            short: 'WARTIME',
            effects: [
              { tag: 'time', weight: 2, summary: 'Reopen at peace' },
              { tag: 'credibility', weight: -2, summary: 'Bad-faith charge' },
              { tag: 'diplomacy', weight: 1, summary: 'Negotiating room' },
            ],
          },
          {
            id: 'hist-1917-balfour-10c',
            label: 'Pair the letter with a public Arab-rights charter of equal weight',
            detail: 'Twin pillars.',
            kind: 'civic',
            markerId: 'port',
            short: 'TWIN',
            effects: [
              { tag: 'norm_protection', weight: 2, summary: 'Dual rights' },
              { tag: 'diplomacy', weight: 2, summary: 'Balanced record' },
              { tag: 'polarization', weight: 1, summary: 'Both enforce maximal' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'hist-1948-two-koreas',
    year: 1948,
    era: '1945–1962',
    title: 'Two Koreas',
    region: 'Korean Peninsula · 38th Parallel · occupation zones · state founding',
    meterFamily: 'politics',
    theaterArchetype: 'pacific',
    premise:
      'This is the peninsula partition theater—not the 1950 war. US and Soviet occupation zones harden into rival governments around the 38th parallel. Trusteeship talks have failed; separate elections and recognition fights will create two states. You advise on whether to freeze division, force a peninsula-wide process, or accept two Koreas as the least-bad map.',
    role: 'Occupation political counselor',
    tension:
      'Unity rhetoric versus the reality that two armies, two parties, and two patrons already face each other across a line.',
    beats: [
      {
        id: 'hist-1948-two-koreas-1',
        title: 'Trusteeship autopsy',
        briefing:
          'Joint trusteeship is dead in practice. Moscow and Washington blame each other. Seoul and Pyongyang factions already behave like capitals.',
        stakes:
          'Admit partition—or keep performing unity while building two states.',
        choices: [
          {
            id: 'hist-1948-two-koreas-1a',
            label: 'Declare trusteeship failed; prepare separate elections south',
            detail: 'Own the split.',
            kind: 'political',
            markerId: 'capital_a',
            short: 'SPLIT',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Clear south path' },
              { tag: 'polarization', weight: 2, summary: 'Unity camp broken' },
              { tag: 'escalation', weight: 1, summary: 'North hardens' },
            ],
          },
          {
            id: 'hist-1948-two-koreas-1b',
            label: 'One more joint commission round with a hard deadline',
            detail: 'Last unity try.',
            kind: 'diplomatic',
            markerId: 'strait',
            short: 'JOINT',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Talks revived' },
              { tag: 'time', weight: -1, summary: 'Calendar burns' },
              { tag: 'credibility', weight: -1, summary: 'Seen as stall' },
            ],
          },
          {
            id: 'hist-1948-two-koreas-1c',
            label: 'Propose UN temporary administration for the whole peninsula',
            detail: 'Internationalize.',
            kind: 'diplomatic',
            markerId: 'capital_b',
            short: 'UN-TEMP',
            effects: [
              { tag: 'norm_protection', weight: 2, summary: 'UN frame' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Soviets resist' },
              { tag: 'governability', weight: -1, summary: 'Authority vacuum' },
            ],
          },
        ],
      },
      {
        id: 'hist-1948-two-koreas-2',
        title: 'Election geometry',
        briefing:
          'UN commissioners can observe the south. The north will not admit them. Holding a “national” election only in one zone invents a state.',
        stakes:
          'Ballots can create a republic—or a permanent half-nation.',
        choices: [
          {
            id: 'hist-1948-two-koreas-2a',
            label: 'Hold UN-observed elections in the south only',
            detail: 'Build ROK now.',
            kind: 'civic',
            markerId: 'island',
            short: 'S-VOTE',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Government born' },
              { tag: 'polarization', weight: 2, summary: 'North excluded' },
              { tag: 'escalation', weight: 1, summary: 'Rival state answer' },
            ],
          },
          {
            id: 'hist-1948-two-koreas-2b',
            label: 'Refuse elections until north access is guaranteed',
            detail: 'No half-mandate.',
            kind: 'legal',
            markerId: 'cable',
            short: 'WAIT',
            effects: [
              { tag: 'norm_protection', weight: 2, summary: 'Whole-peninsula rule' },
              { tag: 'time', weight: -2, summary: 'Drift' },
              { tag: 'governability', weight: -2, summary: 'No civilian gov' },
            ],
          },
          {
            id: 'hist-1948-two-koreas-2c',
            label: 'Local councils first; national vote later',
            detail: 'Bottom-up delay.',
            kind: 'political',
            markerId: 'fleet',
            short: 'LOCAL',
            effects: [
              { tag: 'governability', weight: 1, summary: 'Admin capacity' },
              { tag: 'diplomacy', weight: 1, summary: 'Flexible path' },
              { tag: 'credibility', weight: -1, summary: 'Weak center' },
            ],
          },
        ],
      },
      {
        id: 'hist-1948-two-koreas-3',
        title: 'Police and youth leagues',
        briefing:
          'Rightist youth groups and leftist cells both arm. Occupation police cannot be everywhere. A crackdown looks like choosing a faction.',
        stakes:
          'Street force becomes the real constitution.',
        choices: [
          {
            id: 'hist-1948-two-koreas-3a',
            label: 'Disarm irregulars; build a single national police',
            detail: 'Monopoly of force.',
            kind: 'kinetic',
            markerId: 'strait',
            short: 'DISARM',
            effects: [
              { tag: 'governability', weight: 2, summary: 'Order attempt' },
              { tag: 'civilian_cost', weight: 1, summary: 'Clash during disarm' },
              { tag: 'polarization', weight: 1, summary: 'Faction anger' },
            ],
          },
          {
            id: 'hist-1948-two-koreas-3b',
            label: 'Tolerate aligned youth leagues as anti-communist auxiliaries',
            detail: 'Outsource muscle.',
            kind: 'political',
            markerId: 'capital_a',
            short: 'AUX',
            effects: [
              { tag: 'escalation', weight: 2, summary: 'Militias rise' },
              { tag: 'credibility', weight: -2, summary: 'Rule of law hit' },
              { tag: 'deterrence', weight: 1, summary: 'Left intimidated' },
            ],
          },
          {
            id: 'hist-1948-two-koreas-3c',
            label: 'Amnesty and integrate defectors into civil admin',
            detail: 'Co-opt.',
            kind: 'civic',
            markerId: 'island',
            short: 'AMNESTY',
            effects: [
              { tag: 'social_calm', weight: 1, summary: 'Some cooling' },
              { tag: 'governability', weight: 1, summary: 'Talent in' },
              { tag: 'polarization', weight: 1, summary: 'Purists scream' },
            ],
          },
        ],
      },
      {
        id: 'hist-1948-two-koreas-4',
        title: 'Recognition race',
        briefing:
          'A southern republic and a northern people’s republic both seek recognition. First movers set the diplomatic map.',
        stakes:
          'Who is “Korea” in foreign ministries?',
        choices: [
          {
            id: 'hist-1948-two-koreas-4a',
            label: 'Recognize the southern republic as Korea’s sole government',
            detail: 'Exclusive claim.',
            kind: 'diplomatic',
            markerId: 'capital_a',
            short: 'SOLE',
            effects: [
              { tag: 'credibility', weight: 2, summary: 'Clear recognition' },
              { tag: 'escalation', weight: 2, summary: 'Zero-sum Korea' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Bloc clarity' },
            ],
          },
          {
            id: 'hist-1948-two-koreas-4b',
            label: 'Recognize both as provisional authorities in their zones',
            detail: 'Dual realism.',
            kind: 'diplomatic',
            markerId: 'capital_b',
            short: 'DUAL',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Two-state fact' },
              { tag: 'credibility', weight: -1, summary: 'Unity abandoned' },
              { tag: 'escalation', weight: -1, summary: 'Less all-or-nothing' },
            ],
          },
          {
            id: 'hist-1948-two-koreas-4c',
            label: 'Withhold recognition; keep occupation legal cover',
            detail: 'No seals yet.',
            kind: 'legal',
            markerId: 'cable',
            short: 'WITHHOLD',
            effects: [
              { tag: 'time', weight: 1, summary: 'Flexibility' },
              { tag: 'governability', weight: -2, summary: 'Legitimacy gap' },
              { tag: 'diplomacy', weight: -1, summary: 'Partners confused' },
            ],
          },
        ],
      },
      {
        id: 'hist-1948-two-koreas-5',
        title: 'Parallel fortification',
        briefing:
          'Both zones dig in along the 38th. Advisors want heavier weapons “for defense.” Each shipment teaches the other to race.',
        stakes:
          'The line becomes a front before anyone declares war.',
        choices: [
          {
            id: 'hist-1948-two-koreas-5a',
            label: 'Limit southern forces to light constabulary arms',
            detail: 'Deny invasion kit.',
            kind: 'political',
            markerId: 'fleet',
            short: 'LIGHT',
            effects: [
              { tag: 'escalation', weight: -2, summary: 'Less offensive kit' },
              { tag: 'deterrence', weight: -2, summary: 'South feels naked' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Seoul anger' },
            ],
          },
          {
            id: 'hist-1948-two-koreas-5b',
            label: 'Match northern armor with defensive heavy weapons',
            detail: 'Balance the parallel.',
            kind: 'kinetic',
            markerId: 'strait',
            short: 'MATCH',
            effects: [
              { tag: 'deterrence', weight: 2, summary: 'Harder to overrun' },
              { tag: 'escalation', weight: 2, summary: 'Arms race' },
              { tag: 'civilian_cost', weight: 1, summary: 'Militarized line' },
            ],
          },
          {
            id: 'hist-1948-two-koreas-5c',
            label: 'Propose a demilitarized buffer monitored by neutrals',
            detail: 'Thin the fuse.',
            kind: 'diplomatic',
            markerId: 'island',
            short: 'BUFFER',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'DMZ concept' },
              { tag: 'escalation', weight: -1, summary: 'If accepted' },
              { tag: 'credibility', weight: -1, summary: 'Likely rejected' },
            ],
          },
        ],
      },
      {
        id: 'hist-1948-two-koreas-6',
        title: 'Refugees across the parallel',
        briefing:
          'Families flee both ways. Border commanders want shoot-to-stop orders; humanitarians want open gates.',
        stakes:
          'Population movement redraws politics faster than treaties.',
        choices: [
          {
            id: 'hist-1948-two-koreas-6a',
            label: 'Open supervised refugee corridors with screening',
            detail: 'Managed haven.',
            kind: 'civic',
            markerId: 'cable',
            short: 'CORRIDOR',
            effects: [
              { tag: 'civilian_cost', weight: -2, summary: 'Lives saved' },
              { tag: 'social_calm', weight: -1, summary: 'Absorption stress' },
              { tag: 'credibility', weight: 1, summary: 'Humane posture' },
            ],
          },
          {
            id: 'hist-1948-two-koreas-6b',
            label: 'Seal the parallel; treat crossings as infiltration',
            detail: 'Hard border.',
            kind: 'kinetic',
            markerId: 'strait',
            short: 'SEAL',
            effects: [
              { tag: 'escalation', weight: 2, summary: 'Shots on line' },
              { tag: 'civilian_cost', weight: 2, summary: 'Trapped civilians' },
              { tag: 'deterrence', weight: 1, summary: 'Infiltration down' },
            ],
          },
          {
            id: 'hist-1948-two-koreas-6c',
            label: 'Family-reunion windows under Red Cross mediation',
            detail: 'Thin human bridge.',
            kind: 'diplomatic',
            markerId: 'capital_b',
            short: 'FAMILY',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Contact channel' },
              { tag: 'social_calm', weight: 1, summary: 'Hope valve' },
              { tag: 'time', weight: 1, summary: 'Slow confidence' },
            ],
          },
        ],
      },
      {
        id: 'hist-1948-two-koreas-7',
        title: 'Japanese residual assets',
        briefing:
          'Colonial-era plants, rails, and titles sit in both zones. Who inherits them shapes each state’s economy—and grievance.',
        stakes:
          'Property maps become sovereignty maps.',
        choices: [
          {
            id: 'hist-1948-two-koreas-7a',
            label: 'Nationalize key industry under southern civilian board',
            detail: 'State core.',
            kind: 'economic',
            markerId: 'capital_a',
            short: 'NATL',
            effects: [
              { tag: 'governability', weight: 2, summary: 'Economic spine' },
              { tag: 'market_stability', weight: -1, summary: 'Investor scare' },
              { tag: 'polarization', weight: 1, summary: 'Owners vs state' },
            ],
          },
          {
            id: 'hist-1948-two-koreas-7b',
            label: 'Sell assets fast to fund police and elections',
            detail: 'Cash now.',
            kind: 'economic',
            markerId: 'fleet',
            short: 'SELL',
            effects: [
              { tag: 'time', weight: 1, summary: 'Liquidity' },
              { tag: 'credibility', weight: -1, summary: 'Fire sale optics' },
              { tag: 'governability', weight: 1, summary: 'Funded admin' },
            ],
          },
          {
            id: 'hist-1948-two-koreas-7c',
            label: 'Escrow contested assets pending a unity settlement',
            detail: 'Freeze wealth.',
            kind: 'legal',
            markerId: 'cable',
            short: 'ESCROW',
            effects: [
              { tag: 'norm_protection', weight: 2, summary: 'Legal hold' },
              { tag: 'governability', weight: -2, summary: 'Idle capacity' },
              { tag: 'diplomacy', weight: 1, summary: 'Bargain chip' },
            ],
          },
        ],
      },
      {
        id: 'hist-1948-two-koreas-8',
        title: 'Patron directives',
        briefing:
          'Washington wants a reliable anti-communist state; Moscow wants a reliable northern counterpart. Both urge “no compromise that looks like defeat.”',
        stakes:
          'Patron impatience can erase local off-ramps.',
        choices: [
          {
            id: 'hist-1948-two-koreas-8a',
            label: 'Accept two-state reality; negotiate non-aggression notes',
            detail: 'Partition with brakes.',
            kind: 'diplomatic',
            markerId: 'strait',
            short: 'TWOSTATE',
            effects: [
              { tag: 'escalation', weight: -2, summary: 'Formal coexistence try' },
              { tag: 'credibility', weight: -1, summary: 'Unity shelved' },
              { tag: 'diplomacy', weight: 2, summary: 'Channel opens' },
            ],
          },
          {
            id: 'hist-1948-two-koreas-8b',
            label: 'Double down on sole legitimacy; reject northern sovereignty',
            detail: 'Zero-sum Korea.',
            kind: 'political',
            markerId: 'capital_a',
            short: 'ZERO-SUM',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Hard line' },
              { tag: 'escalation', weight: 3, summary: 'War more likely' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'Patron pleased' },
            ],
          },
          {
            id: 'hist-1948-two-koreas-8c',
            label: 'Quietly explore confederation language without recognition',
            detail: 'Foggy middle.',
            kind: 'diplomatic',
            markerId: 'island',
            short: 'CONFED',
            effects: [
              { tag: 'diplomacy', weight: 1, summary: 'Ambiguous bridge' },
              { tag: 'time', weight: 1, summary: 'Talks without seals' },
              { tag: 'polarization', weight: 1, summary: 'Hardliners attack' },
            ],
          },
        ],
      },
      {
        id: 'hist-1948-two-koreas-9',
        title: 'Border incidents',
        briefing:
          'Patrol clashes kill soldiers on both sides. Each capital calls it proof of the other’s intent to invade.',
        stakes:
          'Incidents can become casus belli before 1950 arrives.',
        choices: [
          {
            id: 'hist-1948-two-koreas-9a',
            label: 'Joint investigation with third-party observers',
            detail: 'Facts before guns.',
            kind: 'diplomatic',
            markerId: 'cable',
            short: 'INVEST',
            effects: [
              { tag: 'diplomacy', weight: 2, summary: 'Incident channel' },
              { tag: 'escalation', weight: -1, summary: 'Cooling try' },
              { tag: 'credibility', weight: 1, summary: 'Process over rumor' },
            ],
          },
          {
            id: 'hist-1948-two-koreas-9b',
            label: 'Retaliatory raid to restore deterrence',
            detail: 'Answer in kind.',
            kind: 'kinetic',
            markerId: 'strait',
            short: 'RAID',
            effects: [
              { tag: 'deterrence', weight: 1, summary: 'Shows teeth' },
              { tag: 'escalation', weight: 3, summary: 'Cycle starts' },
              { tag: 'civilian_cost', weight: 1, summary: 'Border toll' },
            ],
          },
          {
            id: 'hist-1948-two-koreas-9c',
            label: 'Pull forward posts back; thicken observation only',
            detail: 'Create space.',
            kind: 'political',
            markerId: 'fleet',
            short: 'PULLBACK',
            effects: [
              { tag: 'escalation', weight: -2, summary: 'Less contact' },
              { tag: 'deterrence', weight: -1, summary: 'Looks weak' },
              { tag: 'alliance_cohesion', weight: -1, summary: 'Local command fumes' },
            ],
          },
        ],
      },
      {
        id: 'hist-1948-two-koreas-10',
        title: 'Doctrine of the divide',
        briefing:
          'You must write the standing guidance before the next crisis: is the 38th parallel a temporary scar, a legal border, or a fuse?',
        stakes:
          'How you name the line shapes whether 1950 becomes inevitable.',
        choices: [
          {
            id: 'hist-1948-two-koreas-10a',
            label: 'Treat the parallel as an interim armistice line only',
            detail: 'Unity remains the aim.',
            kind: 'political',
            markerId: 'capital_a',
            short: 'INTERIM',
            effects: [
              { tag: 'credibility', weight: 1, summary: 'Unity doctrine' },
              { tag: 'escalation', weight: 2, summary: 'Revisionist pressure' },
              { tag: 'diplomacy', weight: -1, summary: 'No settlement' },
            ],
          },
          {
            id: 'hist-1948-two-koreas-10b',
            label: 'Accept two states; build deterrence and hotlines',
            detail: 'Partition with brakes.',
            kind: 'diplomatic',
            markerId: 'strait',
            short: 'ACCEPT',
            effects: [
              { tag: 'escalation', weight: -2, summary: 'Stabilizing honesty' },
              { tag: 'deterrence', weight: 2, summary: 'Managed rivalry' },
              { tag: 'credibility', weight: -1, summary: 'Dream of unity ends' },
            ],
          },
          {
            id: 'hist-1948-two-koreas-10c',
            label: 'Internationalize the parallel under standing UN watch',
            detail: 'Line as institution.',
            kind: 'legal',
            markerId: 'island',
            short: 'UNLINE',
            effects: [
              { tag: 'norm_protection', weight: 2, summary: 'Institutional line' },
              { tag: 'alliance_cohesion', weight: 1, summary: 'UN role' },
              { tag: 'governability', weight: -1, summary: 'Sovereignty blur' },
            ],
          },
        ],
      },
    ],
  },
];
