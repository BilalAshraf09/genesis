/** Scenarios 8–30 for historical catalog generator. */
import { fx, ch, beat, scenario } from './hist-helpers.mjs';

export const rest = [
  scenario({
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
    tension: 'Avoid war now without teaching that ultimata always work.',
    beats: [
      beat('hist-1938-1', 'Alliance test', 'Prague asks whether your guarantee is real. Generals say you are unready; public opinion fears another bloodbath.', 'Readiness and credibility are the same question.', [
        ch('hist-1938-1a', 'Reaffirm the guarantee publicly', 'Tie your standing to Czech borders.', 'diplomatic', 'brussels', 'GUARANT', [fx('alliance_cohesion', 3, 'Partner steadied'), fx('escalation', 2, 'Raises stakes'), fx('credibility', 2, 'Clear red line')]),
        ch('hist-1938-1b', 'Quietly urge Prague to concede districts', 'Trade land for time.', 'diplomatic', 'capital', 'CONCEDE', [fx('escalation', -2, 'War delayed'), fx('credibility', -2, 'Guarantee hollow'), fx('diplomacy', 1, 'Talks path')]),
        ch('hist-1938-1c', 'Accelerate partial mobilization as signal', 'Ready without declaring.', 'kinetic', 'streets', 'MOBILE', [fx('deterrence', 2, 'Shows teeth'), fx('escalation', 2, 'Crisis heat'), fx('market_stability', -1, 'War scare')]),
      ]),
      beat('hist-1938-2', 'Conference invitation', 'A four-power meeting is offered—without Prague in the room. Refusing may mean no talks; accepting may mean carving a democracy in absentia.', 'Procedure is already a concession.', [
        ch('hist-1938-2a', 'Attend only if Prague is seated', 'No settlement over their head.', 'diplomatic', 'parliament', 'SEAT', [fx('norm_protection', 2, 'Consent principle'), fx('diplomacy', -1, 'May kill talks'), fx('alliance_cohesion', 1, 'Czech trust')]),
        ch('hist-1938-2b', 'Attend and bargain borders', 'Seek “peace in our time” map.', 'political', 'ballot', 'BARGAIN', [fx('diplomacy', 2, 'Deal possible'), fx('norm_erosion', 2, 'Absent victim'), fx('escalation', -2, 'War postponed')]),
        ch('hist-1938-2c', 'Refuse conference; prepare sanctions package', 'Pressure outside the room.', 'economic', 'districts', 'SANCT', [fx('economic_pressure', 2, 'Costly defiance'), fx('escalation', 1, 'Fewer off-ramps'), fx('credibility', 1, 'Firm stance')]),
      ]),
      beat('hist-1938-3', 'Military readiness gap', 'Staff briefings show months before real readiness. Industry wants stockpiles; politicians want a triumph.', 'Buying time can look like buying humiliation.', [
        ch('hist-1938-3a', 'Trade cession for a binding non-aggression pledge', 'Paper guarantees plus land.', 'diplomatic', 'brussels', 'PLEDGE', [fx('escalation', -2, 'Immediate calm'), fx('credibility', -1, 'Paper trusted'), fx('time', 2, 'Rearm window')]),
        ch('hist-1938-3b', 'Refuse cession; start crash rearmament', 'Guns over map.', 'economic', 'capital', 'REARM', [fx('deterrence', 2, 'Future strength'), fx('escalation', 2, 'Near-term risk'), fx('domestic_support', -1, 'Fear of war')]),
        ch('hist-1938-3c', 'Seek Soviet alignment as third balancer', 'Widen the coalition.', 'diplomatic', 'parliament', 'EAST', [fx('alliance_cohesion', 1, 'New weight'), fx('polarization', 2, 'Domestic scare'), fx('deterrence', 1, 'Extra front')]),
      ]),
      beat('hist-1938-4', 'Homecoming speech', 'Whatever you signed or refused, the public wants a story: peace, honor, or betrayal.', 'Narrative locks the next crisis.', [
        ch('hist-1938-4a', 'Sell peace as strategic pause', 'Admit cost; promise readiness.', 'political', 'ballot', 'PAUSE', [fx('domestic_support', 1, 'Honest frame'), fx('credibility', 1, 'No triumph lie'), fx('time', 1, 'Political space')]),
        ch('hist-1938-4b', 'Declare a triumph of diplomacy', 'Maximize calm; minimize doubt.', 'political', 'capital', 'TRIUMPH', [fx('social_calm', 2, 'Relief'), fx('credibility', -2, 'Overclaim risk'), fx('deterrence', -1, 'Complacency')]),
        ch('hist-1938-4c', 'Condemn the settlement and resign posture', 'Moral clarity over office unity.', 'civic', 'streets', 'DISSENT', [fx('norm_protection', 2, 'Names coercion'), fx('governability', -2, 'Cabinet crisis'), fx('polarization', 2, 'Country splits')]),
      ]),
    ],
  }),

  scenario({
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
    tension: 'Honor a guarantee without sleepwalking into a fight you still might shape.',
    beats: [
      beat('hist-1939-1', 'Pledge language', 'Allies ask how automatic your response is. Ambiguity may invite probing; clarity may remove brakes.', 'Deterrence lives in the verbs.', [
        ch('hist-1939-1a', 'Issue an automatic assistance pledge', 'Attack on Poland means war.', 'diplomatic', 'brussels', 'AUTO', [fx('deterrence', 3, 'Hard signal'), fx('escalation', 2, 'Less flexibility'), fx('alliance_cohesion', 2, 'Warsaw steadied')]),
        ch('hist-1939-1b', 'Keep “grave consequences” wording', 'Room to interpret.', 'diplomatic', 'capital', 'GRAVE', [fx('diplomacy', 1, 'Wiggle room'), fx('credibility', -1, 'Maybe bluff'), fx('time', 1, 'Talks possible')]),
        ch('hist-1939-1c', 'Condition aid on Polish negotiating flexibility', 'Pressure your partner too.', 'political', 'parliament', 'COND', [fx('diplomacy', 1, 'Bargain path'), fx('alliance_cohesion', -2, 'Partner feels alone'), fx('escalation', -1, 'May delay')]),
      ]),
      beat('hist-1939-2', 'Mobilization clocks', 'Staffs want full mobilization. Markets crash on rumor alone.', 'Timetables outrun speeches.', [
        ch('hist-1939-2a', 'Full mobilization with public defensive frame', 'Match the machine.', 'kinetic', 'streets', 'FULLMOB', [fx('deterrence', 2, 'Ready force'), fx('escalation', 3, 'War logic'), fx('market_stability', -2, 'Panic')]),
        ch('hist-1939-2b', 'Covert readiness; public calm', 'Prepare quietly.', 'political', 'districts', 'COVERT', [fx('deterrence', 1, 'Some readiness'), fx('credibility', -1, 'Mixed signals'), fx('market_stability', 1, 'Less panic')]),
        ch('hist-1939-2c', 'Freeze mobilization; last mediation sprint', 'All chips on talks.', 'diplomatic', 'ballot', 'SPRINT', [fx('diplomacy', 3, 'Final push'), fx('deterrence', -2, 'Looks exposed'), fx('escalation', -1, 'If others pause')]),
      ]),
      beat('hist-1939-3', 'Neutral commerce', 'Neutrals ask if you will respect trade even after fighting starts. Blockade planners want early lists.', 'Economic war begins before the first shot.', [
        ch('hist-1939-3a', 'Publish a narrow contraband list', 'Predictable rules.', 'legal', 'brussels', 'LIST', [fx('norm_protection', 1, 'Rules framing'), fx('economic_pressure', 1, 'Some squeeze'), fx('alliance_cohesion', 1, 'Partners can align')]),
        ch('hist-1939-3b', 'Prepare total blockade authority', 'Maximum pressure.', 'economic', 'capital', 'BLOCK', [fx('economic_pressure', 3, 'Hard squeeze'), fx('civilian_cost', 2, 'Neutral pain'), fx('escalation', 1, 'Widens war')]),
        ch('hist-1939-3c', 'Delay economic measures to keep neutrals sweet', 'Diplomacy first.', 'diplomatic', 'parliament', 'DELAY$', [fx('diplomacy', 2, 'Neutral goodwill'), fx('economic_pressure', -2, 'Weak lever'), fx('time', 1, 'Slow coercion')]),
      ]),
      beat('hist-1939-4', 'Invasion reports', 'Frontier posts go dark. You must choose the first public act of war—or a last query.', 'Hesitation and resolve will both be judged.', [
        ch('hist-1939-4a', 'Declare war on confirmed invasion', 'Honor the pledge.', 'political', 'capital', 'DECLARE', [fx('credibility', 3, 'Word kept'), fx('escalation', 3, 'General war'), fx('alliance_cohesion', 2, 'Coalition born')]),
        ch('hist-1939-4b', 'Ultimatum with a short clock', 'Demand withdrawal first.', 'diplomatic', 'brussels', 'CLOCK', [fx('diplomacy', 1, 'Last formality'), fx('credibility', 1, 'Process kept'), fx('time', -1, 'Hours only')]),
        ch('hist-1939-4c', 'Limited military aid without full declaration', 'Support without formal war.', 'kinetic', 'streets', 'AID', [fx('escalation', 1, 'Partial war'), fx('credibility', -2, 'Pledge diluted'), fx('alliance_cohesion', -1, 'Partner doubts')]),
      ]),
    ],
  }),

  scenario({
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
    tension: 'Coerce a settlement without forcing a surprise you cannot absorb.',
    beats: [
      beat('hist-1941-1', 'Embargo intensity', 'Energy sanctions are biting. Hawks want a total cut; traders warn of a cornered adversary.', 'Maximum pressure can mean maximum desperation.', [
        ch('hist-1941-1a', 'Tighten to a full oil cutoff', 'No exceptions.', 'economic', 'cable', 'OILOFF', [fx('economic_pressure', 3, 'Severe squeeze'), fx('escalation', 2, 'Cornering risk'), fx('credibility', 1, 'Resolve shown')]),
        ch('hist-1941-1b', 'Offer a phased oil for withdrawal deal', 'Sequence relief with pullbacks.', 'diplomatic', 'capital_a', 'PHASE', [fx('diplomacy', 2, 'Bargain frame'), fx('economic_pressure', -1, 'Softens leverage'), fx('alliance_cohesion', 1, 'Partners can sell it')]),
        ch('hist-1941-1c', 'Hold current sanctions; surge fleet presence', 'Show force without new paper.', 'naval', 'fleet', 'SURGE', [fx('deterrence', 2, 'Visible navy'), fx('escalation', 2, 'Incident risk'), fx('market_stability', -1, 'Insurance spikes')]),
      ]),
      beat('hist-1941-2', 'Negotiating brief', 'Envoys still talk. Your draft can demand full rollback or accept a temporary freeze in place.', 'A freeze can become the new map.', [
        ch('hist-1941-2a', 'Demand full withdrawal as precondition', 'No partials.', 'diplomatic', 'capital_b', 'FULLWD', [fx('credibility', 2, 'Hard standard'), fx('diplomacy', -2, 'Talks may die'), fx('escalation', 1, 'Fewer exits')]),
        ch('hist-1941-2b', 'Accept a freeze-in-place for six months', 'Buy time; keep talking.', 'diplomatic', 'island', 'FREEZE', [fx('time', 2, 'Window'), fx('norm_erosion', 1, 'Gains linger'), fx('escalation', -1, 'Pause')]),
        ch('hist-1941-2c', 'Link Pacific talks to European lend-lease tempo', 'One war economy logic.', 'political', 'strait', 'LINK', [fx('alliance_cohesion', 2, 'Grand strategy'), fx('escalation', 1, 'Widens stakes'), fx('domestic_support', -1, 'Complexity')]),
      ]),
      beat('hist-1941-3', 'Warning indicators', 'Intelligence flags unusual fleet radio silence. You can disperse assets, wait for proof, or publicize a warning.', 'Acting early looks alarmist; acting late looks negligent.', [
        ch('hist-1941-3a', 'Disperse fleet and raise alert', 'Assume the worst.', 'naval', 'fleet', 'ALERT', [fx('deterrence', 1, 'Harder target'), fx('escalation', 1, 'Visible prep'), fx('credibility', 1, 'Prudence')]),
        ch('hist-1941-3b', 'Wait for confirmatory intercepts', 'Avoid false alarm.', 'diplomatic', 'cable', 'WAIT', [fx('time', -1, 'Delay'), fx('escalation', -1, 'Calm optics'), fx('credibility', -1, 'If wrong')]),
        ch('hist-1941-3c', 'Public warning to adversaries and publics', 'Remove surprise premium.', 'political', 'capital_a', 'WARN', [fx('credibility', 2, 'On record'), fx('escalation', 2, 'May accelerate'), fx('domestic_support', 1, 'Prepares public')]),
      ]),
      beat('hist-1941-4', 'After the first strike', 'Reports of attacks arrive. Cabinet asks for the first 48-hour package: limited retaliation, full war declaration, or coalition-first diplomacy.', 'The opening response shapes a years-long war.', [
        ch('hist-1941-4a', 'Full declaration and coalition summons', 'Total war frame.', 'political', 'capital_b', 'DECLARE', [fx('alliance_cohesion', 3, 'Coalition forms'), fx('escalation', 3, 'Unlimited war'), fx('domestic_support', 2, 'Unity surge')]),
        ch('hist-1941-4b', 'Limited retaliatory strikes only', 'Keep options.', 'kinetic', 'island', 'LIMIT', [fx('escalation', 1, 'Controlled reply'), fx('credibility', -1, 'May look weak'), fx('diplomacy', 1, 'Room left')]),
        ch('hist-1941-4c', 'Secure sea lanes before offensive action', 'Logistics first.', 'naval', 'strait', 'LANES', [fx('deterrence', 1, 'Sustainment'), fx('time', 1, 'Slower revenge'), fx('market_stability', 1, 'Trade arteries')]),
      ]),
    ],
  }),

  scenario({
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
    tension: 'End the war quickly without normalizing annihilation as ordinary policy.',
    beats: [
      beat('hist-1945-1', 'Invasion versus strangulation', 'Staffs present Olympic-scale invasion casualties versus a prolonged blockade and bombardment.', 'Speed and body counts trade against each other.', [
        ch('hist-1945-1a', 'Authorize invasion planning as primary path', 'Prepare the landing.', 'kinetic', 'island', 'INVADE', [fx('escalation', 2, 'Massive campaign'), fx('civilian_cost', 2, 'High toll likely'), fx('deterrence', 1, 'Shows will')]),
        ch('hist-1945-1b', 'Prioritize blockade and precision bombardment', 'Starve the war machine.', 'naval', 'strait', 'BLOCK', [fx('economic_pressure', 2, 'Squeezes supply'), fx('time', 2, 'Longer war'), fx('civilian_cost', 2, 'Hunger spreads')]),
        ch('hist-1945-1c', 'Delay choice; maximize diplomatic surrender track', 'Clarify emperor status terms.', 'diplomatic', 'capital_a', 'TERMS', [fx('diplomacy', 2, 'Off-ramp language'), fx('time', 1, 'Talks window'), fx('credibility', -1, 'Looks soft to hawks')]),
      ]),
      beat('hist-1945-2', 'Soviet timetable', 'Allies ask whether to encourage early Soviet entry into the Pacific war.', 'Another front ends fighting faster—and redraws the postwar map.', [
        ch('hist-1945-2a', 'Urge early Soviet entry', 'Pressure from north.', 'diplomatic', 'capital_b', 'SOVIET', [fx('escalation', 1, 'New front'), fx('alliance_cohesion', 1, 'Coalition utility'), fx('credibility', -1, 'Postwar leverage lost')]),
        ch('hist-1945-2b', 'Keep Soviet entry limited and late', 'Minimize postwar claims.', 'political', 'cable', 'LIMITSV', [fx('diplomacy', 1, 'Map control'), fx('time', -1, 'Slower end'), fx('alliance_cohesion', -1, 'Friction')]),
        ch('hist-1945-2c', 'Trade European concessions for Pacific restraint', 'Grand bargain.', 'diplomatic', 'fleet', 'TRADE', [fx('diplomacy', 2, 'Package deal'), fx('norm_erosion', 1, 'Spheres logic'), fx('alliance_cohesion', 1, 'If accepted')]),
      ]),
      beat('hist-1945-3', 'Weapon decision', 'Scientists confirm a usable device. Options: demonstration on empty terrain, use on a military-industrial city, or withhold while invasion prep continues.', 'A demonstration may fail; use may succeed and haunt.', [
        ch('hist-1945-3a', 'Authorize use against a military-industrial target', 'Shock to compel surrender.', 'kinetic', 'island', 'USE', [fx('escalation', 3, 'New warfare tier'), fx('civilian_cost', 3, 'Mass harm'), fx('time', -2, 'May end war fast')]),
        ch('hist-1945-3b', 'Order an observed demonstration first', 'Prove capability without a city.', 'diplomatic', 'strait', 'DEMO', [fx('credibility', 2, 'Shows power'), fx('diplomacy', 1, 'Surrender space'), fx('time', 1, 'If ignored, delay')]),
        ch('hist-1945-3c', 'Withhold; continue conventional pressure', 'Keep the taboo intact.', 'political', 'capital_a', 'WITHHOLD', [fx('norm_protection', 3, 'Taboo held'), fx('civilian_cost', 2, 'Conventional toll'), fx('time', 2, 'War continues')]),
      ]),
      beat('hist-1945-4', 'Surrender terms', 'Tokyo probes about the throne and occupation. Maximal terms may prolong fighting; soft terms may look like wasted sacrifice.', 'The end must also begin the occupation.', [
        ch('hist-1945-4a', 'Allow conditional throne retention under occupation', 'Institutional continuity.', 'diplomatic', 'capital_b', 'THRONE', [fx('diplomacy', 2, 'Faster end'), fx('domestic_support', -1, 'Hawks angry'), fx('governability', 2, 'Occupation smoother')]),
        ch('hist-1945-4b', 'Insist on unconditional terms only', 'No bargains.', 'political', 'fleet', 'UNCOND', [fx('credibility', 2, 'Hard victory'), fx('escalation', 1, 'May prolong'), fx('civilian_cost', 1, 'More fighting')]),
        ch('hist-1945-4c', 'Internationalize occupation authority', 'Share control with allies.', 'diplomatic', 'cable', 'SHARE', [fx('alliance_cohesion', 2, 'Shared burden'), fx('governability', -1, 'Coordination friction'), fx('credibility', 1, 'Multilateral face')]),
      ]),
    ],
  }),

  scenario({
    id: 'hist-1947-radcliffe',
    year: 1947,
    era: '1945–1962',
    title: 'Radcliffe Line',
    region: 'India · Pakistan · Punjab · Bengal',
    meterFamily: 'politics',
    theaterArchetype: 'southasia',
    premise:
      'Transfer of power accelerates while boundary awards, refugee flows, and princely states remain unresolved. You advise the outgoing authority on sequencing that minimizes collapse.',
    role: 'Transfer-of-power crisis counselor',
    tension: 'Speed of independence versus time needed to prevent communal breakdown.',
    beats: [
      beat('hist-1947-1', 'Date pressure', 'Political leaders demand an early transfer date. Administrators say border forces are not ready.', 'A calendar can become a casualty count.', [
        ch('hist-1947-1a', 'Hold the early date; surge boundary forces', 'Meet politics with security.', 'kinetic', 'loc', 'SURGE', [fx('credibility', 1, 'Date kept'), fx('civilian_cost', 1, 'Thin prep'), fx('escalation', 1, 'Force posture up')]),
        ch('hist-1947-1b', 'Delay transfer twelve weeks', 'Buy admin time.', 'political', 'capital_a', 'DELAY', [fx('time', 2, 'Prep window'), fx('polarization', 2, 'Betrayal charges'), fx('governability', 1, 'More planning')]),
        ch('hist-1947-1c', 'Phased transfer by province', 'Stagger the map.', 'diplomatic', 'capital_b', 'PHASE', [fx('governability', 1, 'Incremental'), fx('polarization', 1, 'Uneven legitimacy'), fx('diplomacy', 1, 'Negotiation space')]),
      ]),
      beat('hist-1947-2', 'Boundary award leak', 'Draft lines leak early. Crowds move in anticipation of ending up on the wrong side.', 'Information becomes migration.', [
        ch('hist-1947-2a', 'Publish the award immediately with safe-corridor plans', 'Clarity plus logistics.', 'civic', 'media', 'PUBLISH', [fx('credibility', 1, 'Transparency'), fx('social_calm', -1, 'Shock'), fx('civilian_cost', -1, 'Corridors help')]),
        ch('hist-1947-2b', 'Suppress the leak; finish quiet demarcation', 'Control the timeline.', 'political', 'valley', 'SUPPRESS', [fx('time', 1, 'Admin space'), fx('credibility', -2, 'Secrecy backlash'), fx('polarization', 1, 'Rumor fills gap')]),
        ch('hist-1947-2c', 'Open renegotiation of the worst flashpoint segments', 'Adjust edges.', 'diplomatic', 'third', 'RENEG', [fx('diplomacy', 2, 'Local buy-in hope'), fx('time', -1, 'Delay'), fx('escalation', 1, 'Everyone lobbies')]),
      ]),
      beat('hist-1947-3', 'Princely states', 'A key state hesitates on accession. Arms brokers smell opportunity.', 'One holdout can ignite a wider war.', [
        ch('hist-1947-3a', 'Mediate a standstill then accession path', 'Legal bridge.', 'diplomatic', 'third', 'STAND', [fx('diplomacy', 2, 'Process'), fx('escalation', -1, 'Cooler'), fx('time', 1, 'Talks')]),
        ch('hist-1947-3b', 'Recognize local self-determination plebiscite', 'Vote first.', 'civic', 'media', 'PLEB', [fx('democratic_mandate', 2, 'Consent'), fx('polarization', 2, 'Campaign violence risk'), fx('time', 2, 'Longer limbo')]),
        ch('hist-1947-3c', 'Back a rapid security cordon around the capital', 'Facts on ground.', 'kinetic', 'loc', 'CORDON', [fx('escalation', 2, 'Coercion'), fx('governability', 1, 'Control'), fx('credibility', -1, 'Imperial echo')]),
      ]),
      beat('hist-1947-4', 'Refugee tide', 'Trains and roads overflow. Food and medical capacity collapse in border belts.', 'Relief is now the core state function.', [
        ch('hist-1947-4a', 'Joint refugee corridor under neutral observers', 'Shared logistics.', 'civic', 'valley', 'CORRIDOR', [fx('civilian_cost', -2, 'Safer passage'), fx('diplomacy', 2, 'Cooperation'), fx('social_calm', 1, 'Some order')]),
        ch('hist-1947-4b', 'Unilateral relief on your side only', 'Control what you can.', 'political', 'capital_a', 'UNI', [fx('civilian_cost', -1, 'Partial help'), fx('alliance_cohesion', -1, 'Blame game'), fx('polarization', 1, 'Us-vs-them')]),
        ch('hist-1947-4c', 'Military escort priority for strategic routes only', 'Secure arteries; accept gaps.', 'kinetic', 'loc', 'ESCORT', [fx('escalation', 1, 'Armed presence'), fx('civilian_cost', 1, 'Uneven protection'), fx('governability', 1, 'Key roads held')]),
      ]),
    ],
  }),
];
