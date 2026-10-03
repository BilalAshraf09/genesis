/** Scenarios 1–7 */
import { fx, ch, beat, scenario } from './hist-helpers.mjs';

export const early = [
  scenario({
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
    tension: 'Preserve the East Asian balance without owning either empire’s defeat.',
    beats: [
      beat('hist-1905-1', 'Mediation invite', 'A neutral capital offers to host talks. Your admiralty wants naval observation continued; finance wants the war ended before silver drains.', 'Early mediation can freeze gains or look like favoring the winner.', [
        ch('hist-1905-1a', 'Accept mediation chair quietly', 'Offer good offices without public pressure on either side.', 'diplomatic', 'capital_a', 'CHAIR', [fx('diplomacy', 2, 'Opens a negotiated table'), fx('alliance_cohesion', 1, 'Partners can join quietly'), fx('credibility', 1, 'Looks responsible abroad')]),
        ch('hist-1905-1b', 'Delay; expand fleet observation', 'Keep ships watching while “studying conditions.”', 'naval', 'fleet', 'WATCH', [fx('deterrence', 1, 'Presence at sea'), fx('escalation', 1, 'Risk of incident'), fx('time', 1, 'Buys weeks')]),
        ch('hist-1905-1c', 'Push a public peace appeal', 'Name broad terms in the open to force pace.', 'political', 'capital_b', 'APPEAL', [fx('credibility', 1, 'Visible standard'), fx('diplomacy', -1, 'May harden fronts'), fx('escalation', 1, 'Raises rhetoric')]),
      ]),
      beat('hist-1905-2', 'Loan pressure', 'Bankers ask whether to keep floating war loans. Cutting credit could end the fighting—or collapse a client.', 'Finance is strategy by another name.', [
        ch('hist-1905-2a', 'Condition new loans on talks', 'No fresh paper without a mediation calendar.', 'economic', 'cable', 'COND', [fx('economic_pressure', 2, 'Squeezes war finance'), fx('diplomacy', 1, 'Links money to the table'), fx('market_stability', -1, 'Credit nerves')]),
        ch('hist-1905-2b', 'Keep loans flowing quietly', 'Stabilize your preferred party’s solvency.', 'economic', 'island', 'FUND', [fx('alliance_cohesion', 1, 'Client reassured'), fx('escalation', 1, 'War can continue'), fx('credibility', -1, 'Looks partial')]),
        ch('hist-1905-2c', 'Freeze all war lending', 'Force both sides toward scarcity.', 'economic', 'strait', 'FREEZE', [fx('economic_pressure', 3, 'Hard stop on credit'), fx('diplomacy', -1, 'Anger on both sides'), fx('civilian_cost', 1, 'Social strain rises')]),
      ]),
      beat('hist-1905-3', 'Treaty draft leak', 'A draft territorial clause leaks. Domestic papers demand you “not abandon Asia.”', 'Public opinion versus a workable map.', [
        ch('hist-1905-3a', 'Defend a status-quo corridor clause', 'Prioritize open trade lanes over prestige lines.', 'diplomatic', 'strait', 'LANE', [fx('market_stability', 2, 'Trade frame'), fx('diplomacy', 1, 'Narrow bargain'), fx('domestic_support', -1, 'Hawks unhappy')]),
        ch('hist-1905-3b', 'Echo nationalist map language', 'Match the press; harden your brief.', 'political', 'capital_a', 'MAP', [fx('domestic_support', 2, 'Press satisfied'), fx('escalation', 1, 'Less room to deal'), fx('diplomacy', -1, 'Partners wary')]),
        ch('hist-1905-3c', 'Stay silent until signature', 'Starve the leak of official oxygen.', 'diplomatic', 'capital_b', 'QUIET', [fx('time', 1, 'Space for negotiators'), fx('credibility', -1, 'Vacuum of rumor'), fx('diplomacy', 1, 'Keeps flexibility')]),
      ]),
      beat('hist-1905-4', 'Aftermath alignment', 'With a settlement near, allies ask if you will join a new East Asian consultative group.', 'Institutionalizing influence—or entanglement.', [
        ch('hist-1905-4a', 'Join a limited consultative pact', 'Information sharing only; no automatic force.', 'diplomatic', 'fleet', 'PACT', [fx('alliance_cohesion', 2, 'Shared frame'), fx('deterrence', 1, 'Signal of interest'), fx('escalation', -1, 'Less improvisation')]),
        ch('hist-1905-4b', 'Remain bilateral only', 'Refuse new standing machinery.', 'political', 'capital_a', 'BILAT', [fx('credibility', 1, 'Clear limit'), fx('alliance_cohesion', -1, 'Partners disappointed'), fx('diplomacy', -1, 'Fewer forums')]),
        ch('hist-1905-4c', 'Propose open-door commercial rules', 'Lead with trade norms, not security.', 'economic', 'cable', 'DOOR', [fx('market_stability', 2, 'Commercial order'), fx('diplomacy', 1, 'Inclusive pitch'), fx('deterrence', -1, 'Security gap')]),
      ]),
    ],
  }),

  scenario({
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
    tension: 'Alliance credibility versus escalation control while the trains can still be stopped.',
    beats: [
      beat('hist-1914-1', 'Ultimatum hour', 'An ally asks you to endorse a harsh ultimatum. Softening it may split the alliance; rubber-stamping it may make war automatic.', 'Language now becomes mobilization logic.', [
        ch('hist-1914-1a', 'Endorse with a 48-hour mediation rider', 'Support firmness but force a pause clock.', 'diplomatic', 'brussels', 'RIDER', [fx('diplomacy', 2, 'Inserts time'), fx('alliance_cohesion', 1, 'Still visibly loyal'), fx('escalation', -1, 'Slight brake')]),
        ch('hist-1914-1b', 'Full public endorsement', 'Match the ally’s maximal text.', 'political', 'capital', 'FULL', [fx('alliance_cohesion', 3, 'Unambiguous loyalty'), fx('escalation', 2, 'War more likely'), fx('credibility', 1, 'Clear signal')]),
        ch('hist-1914-1c', 'Quietly urge softer terms', 'Private pressure, public silence.', 'diplomatic', 'parliament', 'SOFT', [fx('diplomacy', 1, 'Off-ramp attempt'), fx('alliance_cohesion', -2, 'Ally feels abandoned'), fx('escalation', -1, 'May slow cascade')]),
      ]),
      beat('hist-1914-2', 'Partial mobilization ask', 'The general staff wants partial mobilization “for defense.” Finance warns markets will read it as war.', 'Military readiness and political signaling are identical tonight.', [
        ch('hist-1914-2a', 'Authorize limited frontier measures only', 'No general call-up yet.', 'kinetic', 'streets', 'LIMIT', [fx('deterrence', 1, 'Some readiness'), fx('escalation', 1, 'Still provocative'), fx('market_stability', -1, 'Nerves')]),
        ch('hist-1914-2b', 'Refuse mobilization; push talks', 'Keep the railway schedules cold.', 'diplomatic', 'ballot', 'HOLD', [fx('escalation', -2, 'Brakes the machine'), fx('deterrence', -1, 'Looks exposed'), fx('diplomacy', 2, 'Talks first')]),
        ch('hist-1914-2c', 'Full mobilization with defensive frame', 'Match the timetable; manage the narrative.', 'political', 'capital', 'MOB', [fx('deterrence', 2, 'Force ready'), fx('escalation', 3, 'Locks war logic'), fx('domestic_support', 1, 'Resolute optics')]),
      ]),
      beat('hist-1914-3', 'British question', 'London’s ambiguity is the last major unknown. Do you seek a clear guarantee, accept fog, or act as if alone?', 'Clarity can deter—or remove the last brake.', [
        ch('hist-1914-3a', 'Demand a written guarantee tonight', 'Force London to choose.', 'diplomatic', 'brussels', 'ASK', [fx('alliance_cohesion', 1, 'If yes, stronger bloc'), fx('diplomacy', -1, 'May push London away'), fx('time', -1, 'Deadline pressure')]),
        ch('hist-1914-3b', 'Accept ambiguity; keep bilateral channels', 'Do not force a premature British crisis.', 'diplomatic', 'districts', 'FOG', [fx('diplomacy', 1, 'Keeps options'), fx('credibility', -1, 'Unclear deterrent'), fx('time', 1, 'Hours remain')]),
        ch('hist-1914-3c', 'Plan as if Britain stays out', 'Optimize for a short continental war.', 'political', 'parliament', 'ALONE', [fx('escalation', 2, 'War plan accelerates'), fx('alliance_cohesion', -1, 'Anglo link weakens'), fx('deterrence', -1, 'Misread possible')]),
      ]),
      beat('hist-1914-4', 'Final night', 'Telegrams conflict. One path still offers a conference; another says the frontier is already crossed.', 'You may be deciding with incomplete facts.', [
        ch('hist-1914-4a', 'Order a 24-hour hold for conference', 'Risk local disadvantage for a last table.', 'diplomatic', 'capital', 'HOLD24', [fx('diplomacy', 3, 'Last off-ramp'), fx('deterrence', -1, 'Military risk'), fx('escalation', -2, 'Pause attempt')]),
        ch('hist-1914-4b', 'Execute war plan as briefed', 'Treat delay as defeat.', 'kinetic', 'streets', 'EXECUTE', [fx('escalation', 3, 'War begins'), fx('deterrence', 2, 'Speed as strategy'), fx('diplomacy', -3, 'Talks die')]),
        ch('hist-1914-4c', 'Localized response only', 'Answer the frontier without the full machine.', 'naval', 'ballot', 'LOCAL', [fx('escalation', 1, 'Limited clash'), fx('diplomacy', 1, 'Room remains'), fx('credibility', 1, 'Controlled force')]),
      ]),
    ],
  }),

  scenario({
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
    tension: 'Keep an eastern front without owning Russia’s internal collapse.',
    beats: [
      beat('hist-1917-1', 'Recognition question', 'The Provisional Government asks for formal recognition and a loan tranche. Radical soviets call any endorsement foreign interference.', 'Legitimacy abroad can become a weapon at home.', [
        ch('hist-1917-1a', 'Recognize and condition loans on war continuity', 'Tie money to staying in the coalition.', 'diplomatic', 'capital', 'RECOG', [fx('alliance_cohesion', 2, 'Keeps Russia in the frame'), fx('economic_pressure', 1, 'Leverage via credit'), fx('governability', -1, 'Feeds nationalist resentment')]),
        ch('hist-1917-1b', 'Quiet aid; delay recognition', 'Send grain and advisors without a public stamp.', 'economic', 'brussels', 'QUIET', [fx('diplomacy', 1, 'Keeps options'), fx('credibility', -1, 'Looks hesitant'), fx('time', 1, 'Waits for clarity')]),
        ch('hist-1917-1c', 'Demand a war cabinet reshuffle first', 'Make recognition contingent on personnel.', 'political', 'parliament', 'RESHUF', [fx('credibility', 1, 'Shows standards'), fx('governability', -2, 'Undermines hosts'), fx('polarization', 2, 'Centers foreign meddling charge')]),
      ]),
      beat('hist-1917-2', 'Front collapse reports', 'Staff cables say whole units are walking home. Generals want you to urge an offensive to restore discipline.', 'An offensive can rally—or shatter—what remains.', [
        ch('hist-1917-2a', 'Urge a limited offensive with Allied munitions', 'Supply shells; insist on a narrow sector.', 'kinetic', 'streets', 'OFFENS', [fx('deterrence', 1, 'Shows fight remains'), fx('escalation', 2, 'Casualties risk revolt'), fx('alliance_cohesion', 1, 'Front stays relevant')]),
        ch('hist-1917-2b', 'Counsel defensive consolidation only', 'Hold lines; no glory push.', 'diplomatic', 'districts', 'HOLD', [fx('escalation', -1, 'Lowers shock risk'), fx('credibility', -1, 'Allies doubt resolve'), fx('governability', 1, 'Less social rupture')]),
        ch('hist-1917-2c', 'Prepare contingency for separate peace', 'Quietly draft exit assumptions.', 'political', 'ballot', 'EXIT', [fx('diplomacy', -2, 'Signals abandonment'), fx('alliance_cohesion', -2, 'Coalition shock'), fx('time', 1, 'Plans for worst case')]),
      ]),
      beat('hist-1917-3', 'Street dual power', 'Soviets seize telegraph nodes. Liberals beg for foreign marine guards at embassies; radicals call it invasion.', 'Protecting diplomats can look like choosing sides in a civil conflict.', [
        ch('hist-1917-3a', 'Deploy limited embassy guards', 'Defensive posture only at compounds.', 'kinetic', 'streets', 'GUARD', [fx('credibility', 1, 'Protects mission'), fx('escalation', 2, 'Looks like intervention'), fx('polarization', 1, 'Hardens camps')]),
        ch('hist-1917-3b', 'Evacuate nonessential staff', 'Reduce exposure without force.', 'diplomatic', 'capital', 'EVAC', [fx('escalation', -1, 'Lowers flashpoint'), fx('credibility', -1, 'Looks like flight'), fx('diplomacy', 1, 'Avoids clash')]),
        ch('hist-1917-3c', 'Mediate a soviet–cabinet protocol', 'Broker shared messaging on order.', 'civic', 'parliament', 'MEDIATE', [fx('governability', 1, 'Temporary bridge'), fx('diplomacy', 2, 'Local ownership'), fx('credibility', -1, 'May legitimize radicals')]),
      ]),
      beat('hist-1917-4', 'Loan cliff', 'Treasury says the next tranche decides whether factories pay wages this month.', 'Wages unpaid become politics overnight.', [
        ch('hist-1917-4a', 'Release tranche with wage earmarks', 'Money for workers, not just munitions.', 'economic', 'brussels', 'WAGES', [fx('social_calm', 2, 'Buys short calm'), fx('economic_pressure', -1, 'Spends leverage'), fx('governability', 1, 'Cabinet breathes')]),
        ch('hist-1917-4b', 'Hold funds until a clear cabinet forms', 'No blank check into chaos.', 'economic', 'ballot', 'HOLD$', [fx('economic_pressure', 2, 'Forces choices'), fx('polarization', 2, 'Blame foreigners'), fx('alliance_cohesion', -1, 'Front at risk')]),
        ch('hist-1917-4c', 'Split aid: humanitarian now, military later', 'Food first; shells after order returns.', 'civic', 'districts', 'SPLIT', [fx('civilian_cost', -1, 'Eases hunger'), fx('diplomacy', 1, 'Looks humane'), fx('deterrence', -1, 'War effort softens')]),
      ]),
    ],
  }),

  scenario({
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
    tension: 'Treaty paper versus facts on the ground; minority protections versus endless war.',
    beats: [
      beat('hist-1920-1', 'Zone enforcement', 'Nationalist irregulars disrupt a coastal zone. Admirals want a show of force; diplomats warn of a wider Anatolian war.', 'Enforcement can make the treaty real—or obsolete.', [
        ch('hist-1920-1a', 'Limited naval demonstration', 'Shell empty water; signal presence.', 'naval', 'escort', 'DEMO', [fx('deterrence', 2, 'Shows capacity'), fx('escalation', 1, 'Risk of misread'), fx('alliance_cohesion', 1, 'Looks firm')]),
        ch('hist-1920-1b', 'Open talks with Ankara envoys', 'Test whether maps can be revised quietly.', 'diplomatic', 'port', 'TALKS', [fx('diplomacy', 2, 'Opens revision path'), fx('credibility', -1, 'Treaty looks soft'), fx('escalation', -1, 'Lowers clash odds')]),
        ch('hist-1920-1c', 'Back a local client advance', 'Encourage a partner army to fill the vacuum.', 'kinetic', 'proxy', 'PROXY', [fx('escalation', 3, 'War widens'), fx('alliance_cohesion', -1, 'Partners diverge'), fx('civilian_cost', 2, 'Displacement rises')]),
      ]),
      beat('hist-1920-2', 'Minority petitions', 'Community leaders demand protected enclaves and Allied garrisons. Nationalists call them foreign footholds.', 'Protection without partition language is hard to sell.', [
        ch('hist-1920-2a', 'Guarantee minority courts and transit rights', 'Rights without new borders.', 'legal', 'canal', 'RIGHTS', [fx('norm_protection', 2, 'Legal shield'), fx('diplomacy', 1, 'Bargainable'), fx('polarization', 1, 'Both sides uneasy')]),
        ch('hist-1920-2b', 'Draw temporary protected districts', 'Maps with sunset clauses.', 'political', 'chokepoint', 'DISTRICT', [fx('civilian_cost', -1, 'Short-term shelter'), fx('escalation', 1, 'Looks like partition'), fx('credibility', 1, 'Visible action')]),
        ch('hist-1920-2c', 'Refer to a future League process', 'Delay with institutional promise.', 'diplomatic', 'insurer', 'LEAGUE', [fx('time', 2, 'Defers clash'), fx('credibility', -2, 'Looks like evasion'), fx('norm_erosion', 1, 'Rights deferred')]),
      ]),
      beat('hist-1920-3', 'Straits and trade', 'Insurers freeze Black Sea traffic until the straits regime is clarified.', 'Commerce will not wait for perfect sovereignty theory.', [
        ch('hist-1920-3a', 'Propose internationalized straits rules', 'Neutral traffic guarantees under commission.', 'diplomatic', 'chokepoint', 'STRAITS', [fx('market_stability', 2, 'Traffic resumes'), fx('credibility', 1, 'Clear regime'), fx('domestic_support', -1, 'Nationalists object')]),
        ch('hist-1920-3b', 'Accept Ankara control with transit treaty', 'Trade guarantees without foreign flags.', 'diplomatic', 'port', 'TREATY', [fx('diplomacy', 2, 'Local ownership'), fx('alliance_cohesion', -1, 'Allies split'), fx('market_stability', 1, 'Partial calm')]),
        ch('hist-1920-3c', 'Keep occupation of key batteries', 'Hold guns until a final peace.', 'naval', 'escort', 'HOLDGUN', [fx('deterrence', 2, 'Leverage retained'), fx('escalation', 2, 'Target for attack'), fx('market_stability', -1, 'Uncertainty persists')]),
      ]),
      beat('hist-1920-4', 'Settlement window', 'A draft exchange-of-populations and border package appears. Humanitarians warn of trauma; soldiers say it ends the war.', 'Ending fighting can create lasting grievance.', [
        ch('hist-1920-4a', 'Support a supervised population exchange', 'Orderly transfers with monitors.', 'civic', 'port', 'EXCHANGE', [fx('escalation', -2, 'War winds down'), fx('civilian_cost', 2, 'Mass upheaval'), fx('diplomacy', 1, 'Deal exists')]),
        ch('hist-1920-4b', 'Reject exchange; insist on mixed citizenship guarantees', 'Keep communities in place with rights.', 'legal', 'canal', 'MIXED', [fx('norm_protection', 2, 'Pluralist frame'), fx('escalation', 1, 'Fighting may continue'), fx('governability', -1, 'Hard to enforce')]),
        ch('hist-1920-4c', 'Narrow military truce only; delay politics', 'Stop guns; leave status unresolved.', 'diplomatic', 'insurer', 'TRUCE', [fx('time', 2, 'Pause'), fx('credibility', -1, 'No finality'), fx('escalation', -1, 'Less killing now')]),
      ]),
    ],
  }),

  scenario({
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
    tension: 'Justice narratives versus a Europe that can still function.',
    beats: [
      beat('hist-1919-1', 'War guilt clause', 'Publics want blame named. Economists warn a moralized indemnity will poison recovery.', 'Symbolic language can outlive the money.', [
        ch('hist-1919-1a', 'Keep a guilt clause; soften payment schedule', 'Symbol hard, cash flexible.', 'political', 'parliament', 'GUILT', [fx('domestic_support', 2, 'Home press satisfied'), fx('diplomacy', -1, 'Humiliation lingers'), fx('market_stability', 1, 'Payable path')]),
        ch('hist-1919-1b', 'Drop guilt language; focus on repair costs', 'Technical liability only.', 'diplomatic', 'brussels', 'REPAIR', [fx('diplomacy', 2, 'Less poison'), fx('domestic_support', -2, 'Voters feel cheated'), fx('norm_protection', 1, 'Legalist frame')]),
        ch('hist-1919-1c', 'Maximal indemnity with occupation threat', 'Pay or stay occupied.', 'economic', 'capital', 'MAXIND', [fx('economic_pressure', 3, 'Heavy burden'), fx('escalation', 1, 'Revisionism fuel'), fx('credibility', 1, 'Hard victory')]),
      ]),
      beat('hist-1919-2', 'Border commissions', 'Ethnic maps conflict with rail and coal geography. Minorities beg for plebiscites; generals want clean strategic lines.', 'Every line creates a new revisionist.', [
        ch('hist-1919-2a', 'Mandate plebiscites in contested belts', 'Let local votes settle edges.', 'civic', 'ballot', 'PLEB', [fx('democratic_mandate', 2, 'Consent frame'), fx('time', 1, 'Delays finality'), fx('polarization', 1, 'Campaigns harden')]),
        ch('hist-1919-2b', 'Draw strategic corridors for coal and rail', 'Prioritize economic viability.', 'economic', 'districts', 'CORRIDOR', [fx('market_stability', 2, 'Functional map'), fx('norm_erosion', 1, 'Self-determination diluted'), fx('alliance_cohesion', 1, 'Allies get resources')]),
        ch('hist-1919-2c', 'Create League mandates for flashpoint zones', 'Internationalize the hardest scraps.', 'diplomatic', 'brussels', 'MANDATE', [fx('norm_protection', 1, 'Institutional cover'), fx('credibility', -1, 'Looks like empire 2.0'), fx('escalation', -1, 'Buffers clash')]),
      ]),
      beat('hist-1919-3', 'League covenant fight', 'Some partners want a strong League; others refuse any constraint on sovereignty.', 'Without buy-in, the covenant is theater.', [
        ch('hist-1919-3a', 'Push a strong collective-security article', 'Automatic consultation on aggression.', 'diplomatic', 'brussels', 'COLSEC', [fx('alliance_cohesion', 2, 'Shared deterrent idea'), fx('credibility', 1, 'Ambitious order'), fx('domestic_support', -1, 'Sovereignty hawks resist')]),
        ch('hist-1919-3b', 'Water down to a discussion forum', 'Preserve signatures over teeth.', 'political', 'parliament', 'FORUM', [fx('diplomacy', 1, 'More signatories'), fx('deterrence', -2, 'Weak teeth'), fx('governability', 1, 'Easier ratification')]),
        ch('hist-1919-3c', 'Bilateral guarantees instead of League primacy', 'Old alliance logic in new clothes.', 'diplomatic', 'capital', 'BILAT', [fx('deterrence', 1, 'Clear pledges'), fx('norm_erosion', 1, 'Undercuts League'), fx('alliance_cohesion', 1, 'Core partners tight')]),
      ]),
      beat('hist-1919-4', 'Signature day', 'The defeated ask for revisions before signing. Refusing may create a martyr treaty; yielding may unravel the whole package.', 'A signed bitter peace versus an unsigned vacuum.', [
        ch('hist-1919-4a', 'Require signature as drafted', 'Revisions only via future League petitions.', 'political', 'capital', 'SIGN', [fx('credibility', 2, 'Finality'), fx('diplomacy', -2, 'Resentment locked'), fx('escalation', 1, 'Revisionist fuel')]),
        ch('hist-1919-4b', 'Allow narrow technical amendments', 'Face-saving tweaks without reopening borders.', 'diplomatic', 'parliament', 'TWEAK', [fx('diplomacy', 2, 'Slight off-ramp'), fx('credibility', -1, 'Looks soft'), fx('time', 1, 'Another round')]),
        ch('hist-1919-4c', 'Threaten renewed blockade if unsigned', 'Pressure without new armies.', 'economic', 'streets', 'BLOCK', [fx('economic_pressure', 2, 'Coercive continuity'), fx('civilian_cost', 2, 'Hunger politics'), fx('norm_erosion', 1, 'Peace by siege')]),
      ]),
    ],
  }),

  scenario({
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
    tension: 'Liquidity versus confidence versus the gold orthodoxy that still defines credibility.',
    beats: [
      beat('hist-1929-1', 'Exchange floor panic', 'Brokers beg for a trading halt. Central bankers fear a halt signals insolvency.', 'Stopping the tape can calm—or advertise fear.', [
        ch('hist-1929-1a', 'Authorize a short trading halt', 'Clear orders; reopen with rules.', 'legal', 'exchange', 'HALT', [fx('market_stability', 1, 'Pause for clearing'), fx('credibility', -1, 'Looks like panic'), fx('time', 1, 'Hours to plan')]),
        ch('hist-1929-1b', 'Keep markets open; inject liquidity', 'Discount window wide.', 'economic', 'fed', 'LIQUID', [fx('market_stability', 2, 'Supports prices'), fx('credibility', 1, 'Orthodox courage'), fx('economic_pressure', -1, 'Spends reserves')]),
        ch('hist-1929-1c', 'Let prices find bottom without support', 'Purge speculation.', 'economic', 'desk', 'PURGE', [fx('market_stability', -3, 'Freefall'), fx('credibility', 1, 'Hard money story'), fx('civilian_cost', 2, 'Wealth shock')]),
      ]),
      beat('hist-1929-2', 'Bank run map', 'Regional banks fail overnight. Depositors queue. Correspondents ask if you will backstop or ring-fence.', 'Saving all banks may save none; saving none may save the system’s story.', [
        ch('hist-1929-2a', 'Selective recapitalization of solvent banks', 'Triage by books, not politics.', 'economic', 'treasury', 'TRIAGE', [fx('market_stability', 2, 'Stops cascade'), fx('credibility', 1, 'Technocratic'), fx('polarization', 1, 'Losers cry favoritism')]),
        ch('hist-1929-2b', 'Blanket holiday and deposit guarantee sketch', 'Freeze withdrawals; promise a backstop.', 'political', 'exchange', 'HOLIDAY', [fx('social_calm', 2, 'Queues ease'), fx('market_stability', 1, 'Breathing room'), fx('credibility', -1, 'Radical for the era')]),
        ch('hist-1929-2c', 'Let weak banks fail; protect clearing houses only', 'Core payments first.', 'economic', 'fed', 'CORE', [fx('market_stability', -1, 'Regional pain'), fx('credibility', 1, 'Clearing preserved'), fx('civilian_cost', 2, 'Local ruin')]),
      ]),
      beat('hist-1929-3', 'Gold and tariffs', 'Partners flirt with tariffs and gold drains. Orthodoxy says defend parity; industry says abandon it.', 'The international monetary order is the crisis.', [
        ch('hist-1929-3a', 'Defend gold with rate hikes', 'Attract capital; crush domestic demand.', 'economic', 'fed', 'GOLD', [fx('credibility', 2, 'Parity held'), fx('market_stability', -2, 'Credit tighter'), fx('civilian_cost', 2, 'Unemployment rises')]),
        ch('hist-1929-3b', 'Coordinate a temporary gold suspension', 'Seek partner mirroring.', 'diplomatic', 'em', 'SUSPEND', [fx('diplomacy', 2, 'Shared float idea'), fx('market_stability', 1, 'Policy space'), fx('credibility', -1, 'Orthodoxy broken')]),
        ch('hist-1929-3c', 'Raise tariffs to “protect employment”', 'Beggar-thy-neighbor politics.', 'political', 'treasury', 'TARIFF', [fx('domestic_support', 2, 'Industry cheers'), fx('market_stability', -2, 'Trade shrinks'), fx('alliance_cohesion', -2, 'Retaliation')]),
      ]),
      beat('hist-1929-4', 'Relief versus austerity', 'Mayors report soup lines. Bond markets punish any deficit talk.', 'Humanitarian relief and creditor confidence point opposite ways.', [
        ch('hist-1929-4a', 'Fund emergency public works', 'Wages for roads and rails.', 'civic', 'energy', 'WORKS', [fx('social_calm', 2, 'Visible relief'), fx('domestic_support', 2, 'Government acts'), fx('market_stability', -1, 'Deficit fears')]),
        ch('hist-1929-4b', 'Balanced-budget signal with targeted relief only', 'Tiny safety net; loud fiscal virtue.', 'economic', 'treasury', 'BALANCE', [fx('credibility', 2, 'Bond calm'), fx('civilian_cost', 1, 'Thin cushion'), fx('polarization', 1, 'Left outraged')]),
        ch('hist-1929-4c', 'Push private charity coordination', 'State as convener, not payer.', 'civic', 'desk', 'CHARITY', [fx('credibility', 1, 'Limited state'), fx('civilian_cost', 2, 'Gaps remain'), fx('social_calm', -1, 'Uneven coverage')]),
      ]),
    ],
  }),

  scenario({
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
    tension: 'Collective security’s credibility versus appetite for another war.',
    beats: [
      beat('hist-1931-1', 'Incident fog', 'Reports conflict on who blew the track. Your attaché says the occupation is already expanding.', 'Waiting for perfect facts cedes the ground.', [
        ch('hist-1931-1a', 'Call for immediate halt and inquiry', 'Public League process.', 'diplomatic', 'capital_a', 'INQUIRE', [fx('norm_protection', 2, 'Process first'), fx('time', 1, 'Buys days'), fx('deterrence', -1, 'No force yet')]),
        ch('hist-1931-1b', 'Quiet bilateral demarche only', 'Avoid cornering anyone publicly.', 'diplomatic', 'capital_b', 'DEMARCHE', [fx('diplomacy', 1, 'Channel open'), fx('credibility', -1, 'League sidelined'), fx('escalation', -1, 'Lower heat')]),
        ch('hist-1931-1c', 'Issue a condemnation without measures', 'Words only.', 'political', 'cable', 'CONDEMN', [fx('credibility', -2, 'Empty speech'), fx('norm_erosion', 1, 'Shows toothless'), fx('domestic_support', 1, 'Did something')]),
      ]),
      beat('hist-1931-2', 'Sanctions debate', 'Economists say embargoes will hurt your exporters. Idealists say no cost means no League.', 'Economic pain is the only non-war tool left.', [
        ch('hist-1931-2a', 'Targeted arms and credit embargo', 'Narrow coercion.', 'economic', 'cable', 'EMBARGO', [fx('economic_pressure', 2, 'Squeezes campaign'), fx('alliance_cohesion', 1, 'If partners join'), fx('market_stability', -1, 'Trade friction')]),
        ch('hist-1931-2b', 'Refuse sanctions; offer mediation committee', 'Talks without teeth.', 'diplomatic', 'island', 'MEDIATE', [fx('diplomacy', 2, 'Forum exists'), fx('norm_erosion', 1, 'Aggression cheap'), fx('credibility', -1, 'Weak response')]),
        ch('hist-1931-2c', 'Threaten recognition denial of any new state', 'Legal isolation strategy.', 'legal', 'strait', 'NOSTATE', [fx('norm_protection', 2, 'Non-recognition'), fx('deterrence', 1, 'Future cost'), fx('time', 1, 'Slow tool')]),
      ]),
      beat('hist-1931-3', 'China’s ask', 'Chinese envoys want material aid and a hard deadline. Your military says you cannot fight in Manchuria.', 'Aid without escort is symbolism; escort is war.', [
        ch('hist-1931-3a', 'Send non-lethal aid and observers', 'Presence without combat.', 'diplomatic', 'fleet', 'OBSERVE', [fx('alliance_cohesion', 1, 'Shows up'), fx('escalation', 1, 'Risk to personnel'), fx('credibility', 1, 'Not absent')]),
        ch('hist-1931-3b', 'Promise only diplomatic support', 'No matériel.', 'political', 'capital_a', 'WORDS', [fx('escalation', -1, 'Safe'), fx('credibility', -2, 'Abandonment feel'), fx('diplomacy', 1, 'Keeps distance')]),
        ch('hist-1931-3c', 'Quietly accept a fait accompli buffer deal', 'Trade silence for commercial access.', 'economic', 'island', 'BUFFER', [fx('market_stability', 1, 'Business continuity'), fx('norm_erosion', 2, 'Rewards force'), fx('alliance_cohesion', -2, 'China betrayed')]),
      ]),
      beat('hist-1931-4', 'Assembly vote', 'A League report lands. Voting to condemn without enforcement may advertise impotence.', 'Procedure is now the message.', [
        ch('hist-1931-4a', 'Vote to condemn and recommend withdrawal', 'Full political isolation.', 'political', 'capital_b', 'VOTE', [fx('norm_protection', 2, 'Names aggression'), fx('credibility', 1, 'Clear record'), fx('deterrence', -1, 'Still no force')]),
        ch('hist-1931-4b', 'Abstain to preserve mediator role', 'Stay useful later.', 'diplomatic', 'strait', 'ABSTAIN', [fx('diplomacy', 1, 'Flexibility'), fx('credibility', -1, 'Fence-sitting'), fx('alliance_cohesion', -1, 'Partners annoyed')]),
        ch('hist-1931-4c', 'Push a face-saving “international zone” compromise', 'Rewrite the map surgically.', 'diplomatic', 'fleet', 'ZONE', [fx('diplomacy', 2, 'Deal shape'), fx('norm_erosion', 1, 'Legalizes gain'), fx('escalation', -1, 'May freeze lines')]),
      ]),
    ],
  }),
];
