/** Extra beats 5–10 — scenarios Suez through Coalition Aftershock. */
import { fx, ch, beat } from './hist-helpers.mjs';

/** @type {Record<string, ReturnType<typeof beat>[]>} */
export const extraBeatsPart3 = {
  'hist-1956-suez': [
    beat('hist-1956-5', 'Sterling crisis shock', 'Reserve drains accelerate as markets price a long fight. Washington’s quiet pressure arrives with a financing ultimatum.', 'Currency can end a war faster than armies.', [
      ch('hist-1956-5a', 'Seek emergency support conditioned on a ceasefire clock', 'Money for peace.', 'economic', 'insurer', 'STERLING', [fx('market_stability', 2, 'Reserve relief'), fx('diplomacy', 2, 'Ceasefire leverage'), fx('credibility', -1, 'Forced climbdown')]),
      ch('hist-1956-5b', 'Double down militarily before finances collapse', 'Win fast or break.', 'kinetic', 'chokepoint', 'FASTWIN', [fx('escalation', 3, 'Harder fight'), fx('market_stability', -3, 'Run worsens'), fx('deterrence', 1, 'Force show')]),
      ch('hist-1956-5c', 'Float a temporary capital control package at home', 'Buy hours.', 'economic', 'canal', 'CAPCTRL', [fx('market_stability', 1, 'Temporary brake'), fx('polarization', 1, 'Orthodoxy rage'), fx('time', 2, 'Hours bought')]),
    ]),
    beat('hist-1956-6', 'Domestic imperial hangover', 'Crowds cheer “teaching a lesson”; others call it anachronism. Your majority depends on which story you feed.', 'Post-imperial identity is a war aim.', [
      ch('hist-1956-6a', 'Frame withdrawal as rule-of-law victory if UN steps in', 'Multilateral cover.', 'political', 'port', 'UNCOVER', [fx('credibility', 1, 'Rules frame'), fx('domestic_support', -1, 'Empire faction mad'), fx('diplomacy', 2, 'UN path')]),
      ch('hist-1956-6b', 'Feed imperial pride rhetoric to hold the coalition', 'Glory politics.', 'civic', 'proxy', 'GLORY', [fx('domestic_support', 2, 'Rally'), fx('escalation', 1, 'Harder exit'), fx('alliance_cohesion', -2, 'US fury')]),
      ch('hist-1956-6c', 'Stay technocratic: shipping continuity only', 'Narrow mission.', 'diplomatic', 'escort', 'SHIPONLY', [fx('market_stability', 2, 'Lane focus'), fx('credibility', 1, 'Limited aims'), fx('domestic_support', -1, 'Uninspiring')]),
    ]),
    beat('hist-1956-7', 'Superpower ultimatum management', 'A superpower demands withdrawal timelines. Defiance risks financial war; compliance risks alliance humiliation.', 'Hierarchy inside the West becomes visible.', [
      ch('hist-1956-7a', 'Accept a timed withdrawal with salvage of salvageable aims', 'Climb down with schedule.', 'diplomatic', 'canal', 'TIMED', [fx('alliance_cohesion', 1, 'Senior partner eased'), fx('diplomacy', 2, 'Crisis cools'), fx('credibility', -1, 'Humiliation')]),
      ch('hist-1956-7b', 'Play for more days while consolidating positions', 'Delay compliance.', 'kinetic', 'chokepoint', 'DELAY3', [fx('time', 1, 'Days'), fx('escalation', 2, 'Friction'), fx('market_stability', -2, 'Pressure continues')]),
      ch('hist-1956-7c', 'Threaten independent European financial arrangements', 'Defiance via money.', 'economic', 'insurer', 'EURO$', [fx('alliance_cohesion', -3, 'Transatlantic split'), fx('credibility', 1, 'Autonomy show'), fx('market_stability', -1, 'Uncertainty')]),
    ]),
    beat('hist-1956-8', 'Collusion document fog', 'Allegations of prearranged scenarios leak. Denials collide with timelines. Your legal and political exposure rises together.', 'Secrecy debts come due mid-crisis.', [
      ch('hist-1956-8a', 'Authorize a narrow internal inquiry with classified findings', 'Containment of truth.', 'legal', 'port', 'INQ2', [fx('credibility', 1, 'Some process'), fx('norm_protection', 1, 'Inquiry exists'), fx('time', 1, 'Slows bleed')]),
      ch('hist-1956-8b', 'Issue categorical public denials', 'Hold the line.', 'political', 'proxy', 'DENY', [fx('domestic_support', 1, 'If believed'), fx('credibility', -2, 'If proven false'), fx('polarization', 1, 'Trust fracture')]),
      ch('hist-1956-8c', 'Quietly prepare a partial admission with ally coordination', 'Controlled disclosure.', 'diplomatic', 'escort', 'ADMIT', [fx('credibility', 2, 'Honesty bet'), fx('alliance_cohesion', -1, 'Partner exposure'), fx('diplomacy', 1, 'Reset chance')]),
    ]),
    beat('hist-1956-9', 'UN force off-ramp', 'A peacekeeping concept could cover withdrawal without total narrative defeat—if you accept constraints on future unilateralism.', 'Blue helmets as face-saving architecture.', [
      ch('hist-1956-9a', 'Champion a UN emergency force and exit under it', 'Institutional ladder down.', 'diplomatic', 'canal', 'UNEF', [fx('diplomacy', 3, 'Multilateral exit'), fx('escalation', -2, 'War winds down'), fx('credibility', 1, 'Rules turn')]),
      ch('hist-1956-9b', 'Accept UN observers only; keep national enclaves', 'Half measure.', 'naval', 'port', 'OBS3', [fx('deterrence', 1, 'Footprint remains'), fx('alliance_cohesion', -1, 'Suspicion'), fx('diplomacy', 1, 'Partial')]),
      ch('hist-1956-9c', 'Reject UN cover as infringement on sovereign action', 'Go it alone.', 'political', 'chokepoint', 'REJECT', [fx('credibility', -1, 'Isolation'), fx('escalation', 1, 'Continues'), fx('alliance_cohesion', -2, 'West split')]),
    ]),
    beat('hist-1956-10', 'Doctrine endgame', 'Cabinet wants a post-Suez rule: when force may seize strategic infrastructure, and when finance vetoes strategy.', 'The lesson memo becomes grand strategy.', [
      ch('hist-1956-10a', 'Codify no major op without reserve-currency clearance', 'Finance as brake.', 'economic', 'insurer', 'FINBRAKE', [fx('market_stability', 2, 'Money realism'), fx('credibility', 1, 'Learned limit'), fx('deterrence', -1, 'Less free hand')]),
      ch('hist-1956-10b', 'Reaffirm unilateral rights over vital lanes', 'Suez as doctrine, not error.', 'naval', 'escort', 'LANERIT', [fx('deterrence', 2, 'Hard claim'), fx('alliance_cohesion', -2, 'Partners alarmed'), fx('escalation', 1, 'Future fights')]),
      ch('hist-1956-10c', 'Pivot to alliance consultation mandates before force', 'Never alone again.', 'diplomatic', 'canal', 'CONSULT2', [fx('alliance_cohesion', 3, 'Process glue'), fx('diplomacy', 1, 'Multilateral habit'), fx('time', -1, 'Slower wars')]),
    ]),
  ],

  'hist-1962-cuba': [
    beat('hist-1962-5', 'U-2 shootdown shock', 'A reconnaissance aircraft is lost. Military demands retaliation; diplomats fear the escalation ladder has only one rung left.', 'A single loss can force the irrevocable.', [
      ch('hist-1962-5a', 'Absorb the loss; tighten rules, do not retaliate yet', 'Hold the ladder.', 'diplomatic', 'capital', 'ABSORB2', [fx('escalation', -2, 'Brake'), fx('diplomacy', 2, 'Talks survive'), fx('domestic_support', -1, 'Looks weak')]),
      ch('hist-1962-5b', 'Authorize a limited strike on the responsible site', 'Punish and risk.', 'kinetic', 'plaza', 'PUNISH', [fx('escalation', 3, 'Ladder climbs'), fx('deterrence', 2, 'Cost imposed'), fx('diplomacy', -2, 'Talks may die')]),
      ch('hist-1962-5c', 'Pause flights; rely on other intelligence for 48 hours', 'Blind briefly to live.', 'political', 'court', 'PAUSE3', [fx('time', 2, 'Cooling'), fx('deterrence', -1, 'Less awareness'), fx('credibility', 1, 'Controlled risk')]),
    ]),
    beat('hist-1962-6', 'Domestic hawk pressure', 'Senators demand invasion. Leaks portray quarantine as weakness. Your ExComm cohesion frays in public.', 'Democracy’s noise is part of the nuclear crisis.', [
      ch('hist-1962-6a', 'Brief select leaders under secrecy to hold the line', 'Bipartisan quiet.', 'political', 'capital', 'BRIEF3', [fx('governability', 2, 'Elite buy-in'), fx('domestic_support', 1, 'Managed'), fx('norm_protection', 1, 'Process')]),
      ch('hist-1962-6b', 'Harden public rhetoric while keeping private diplomacy', 'Two-level game.', 'civic', 'plaza', 'RHETOR', [fx('domestic_support', 2, 'Resolve optics'), fx('escalation', 1, 'Heat'), fx('diplomacy', 1, 'Private track')]),
      ch('hist-1962-6c', 'Threaten resignations to force cabinet unity', 'Personal leverage.', 'political', 'court', 'RESIGN', [fx('governability', 1, 'If it works'), fx('polarization', 1, 'Drama'), fx('credibility', -1, 'Instability show')]),
    ]),
    beat('hist-1962-7', 'Ally consultation gap', 'NATO capitals want voice before any air strike. Speed argues against it; legitimacy argues for it.', 'Alliance process versus nuclear minutes.', [
      ch('hist-1962-7a', 'Hold an emergency council brief before new kinetic steps', 'Legitimacy first.', 'diplomatic', 'imf', 'NATO', [fx('alliance_cohesion', 3, 'Partners included'), fx('time', -1, 'Hours spent'), fx('diplomacy', 1, 'Shared ownership')]),
      ch('hist-1962-7b', 'Inform after decisions; protect operational surprise', 'Speed first.', 'political', 'capital', 'AFTER', [fx('deterrence', 1, 'Surprise'), fx('alliance_cohesion', -2, 'Anger'), fx('time', 1, 'Faster')]),
      ch('hist-1962-7c', 'Offer allies a veto only on invasion, not quarantine', 'Split authorities.', 'diplomatic', 'port', 'SPLITV', [fx('alliance_cohesion', 1, 'Partial voice'), fx('escalation', -1, 'Invasion braked'), fx('credibility', 1, 'Clear lanes')]),
    ]),
    beat('hist-1962-8', 'Message channel fog', 'Formal notes and informal back channels disagree on withdrawal sequencing and Jupiter trade language. Misreading either could end cities.', 'Ambiguity is both tool and trap.', [
      ch('hist-1962-8a', 'Require identical text across public and private tracks', 'One message.', 'diplomatic', 'capital', 'ONETEXT', [fx('credibility', 2, 'Clarity'), fx('diplomacy', 1, 'Less confusion'), fx('time', -1, 'Harder drafting')]),
      ch('hist-1962-8b', 'Keep a secret Jupiter trade while denying it publicly', 'Classic bargain.', 'diplomatic', 'imf', 'JUPITER', [fx('diplomacy', 3, 'Deal space'), fx('credibility', -1, 'Dual track'), fx('alliance_cohesion', -1, 'Host ally unbriefed')]),
      ch('hist-1962-8c', 'Slow all replies until a single ExComm draft is locked', 'No freelance cables.', 'political', 'court', 'LOCKMSG', [fx('governability', 1, 'Control'), fx('time', -1, 'Lag'), fx('escalation', -1, 'Fewer accidents')]),
    ]),
    beat('hist-1962-9', 'Inspection off-ramp', 'A withdrawal-for-assurance package needs verification without humiliation. UN or Red Cross roles are on the table.', 'Verification is the peace.', [
      ch('hist-1962-9a', 'Accept UN-led verification with no occupation optics', 'Multilateral eyes.', 'diplomatic', 'port', 'UNEYES', [fx('diplomacy', 3, 'Deal workable'), fx('escalation', -2, 'Ladder down'), fx('credibility', 1, 'Process')]),
      ch('hist-1962-9b', 'Demand US aerial verification rights explicitly', 'National eyes.', 'naval', 'farm', 'USAIR', [fx('deterrence', 1, 'Assurance'), fx('diplomacy', -1, 'Harder accept'), fx('alliance_cohesion', 1, 'Some cheer')]),
      ch('hist-1962-9c', 'Trade a public non-invasion pledge for verified removal', 'Grand bargain.', 'diplomatic', 'capital', 'PLEDGE', [fx('diplomacy', 2, 'Core swap'), fx('escalation', -2, 'De-escalates'), fx('domestic_support', -1, 'Pledge politics')]),
    ]),
    beat('hist-1962-10', 'Nuclear crisis endgame', 'Missiles move—or don’t. You must set standing rules for quarantine, hotlines, and alliance notices for the next crisis.', 'Institutions after the brink.', [
      ch('hist-1962-10a', 'Institutionalize a direct leader hotline and notice rules', 'Plumbing for peace.', 'diplomatic', 'capital', 'HOTLINE', [fx('diplomacy', 2, 'Crisis pipes'), fx('escalation', -1, 'Fewer accidents'), fx('alliance_cohesion', 1, 'Predictability')]),
      ch('hist-1962-10b', 'Keep ad hoc ExComm as the model; avoid new bureaucracy', 'Flexibility doctrine.', 'political', 'court', 'ADHOC', [fx('time', 1, 'Agile'), fx('credibility', -1, 'No standing rules'), fx('governability', 1, 'Leader-centric')]),
      ch('hist-1962-10c', 'Publicly frame quarantine as a precedent for future blockades', 'Doctrine expansion.', 'naval', 'port', 'PRECED2', [fx('deterrence', 2, 'Tool normalized'), fx('escalation', 1, 'Future uses'), fx('diplomacy', -1, 'Legal fights')]),
    ]),
  ],

  'hist-1968-prague': [
    beat('hist-1968-5', 'Intervention night shock', 'Tanks cross. Your options are condemnation, sanctions, covert aid, or pragmatic silence. Each teaches Moscow and your public a different lesson.', 'Moral clarity and alliance security collide.', [
      ch('hist-1968-5a', 'Lead a sharp public condemnation with targeted sanctions', 'Voice and costs.', 'diplomatic', 'brussels', 'CONDEMN', [fx('credibility', 2, 'Moral signal'), fx('economic_pressure', 1, 'Costs'), fx('escalation', 1, 'East-West chill')]),
      ch('hist-1968-5b', 'Keep official silence; expand quiet refugee and radio support', 'Help without war.', 'civic', 'streets', 'RADIO2', [fx('civilian_cost', -1, 'People helped'), fx('diplomacy', 1, 'Deniable'), fx('credibility', -1, 'Looks passive')]),
      ch('hist-1968-5c', 'Raise military alerts to deter spillover', 'Posture response.', 'kinetic', 'districts', 'ALERT2', [fx('deterrence', 2, 'NATO ready'), fx('escalation', 2, 'Dangerous optics'), fx('alliance_cohesion', 1, 'Alliance woke')]),
    ]),
    beat('hist-1968-6', 'Street solidarity politics', 'Your cities fill with protests demanding action you cannot deliver without risking war. Managing hope becomes policy.', 'Public conscience without private means.', [
      ch('hist-1968-6a', 'Host visible solidarity without promising intervention', 'Speech not tanks.', 'civic', 'streets', 'SOLID', [fx('domestic_support', 2, 'Moral alignment'), fx('credibility', 1, 'Honest limits'), fx('escalation', -1, 'No force promise')]),
      ch('hist-1968-6b', 'Crack down on protests that block bases and ministries', 'Order over emotion.', 'legal', 'districts', 'CRACK', [fx('social_calm', 1, 'Short quiet'), fx('polarization', 2, 'Anger'), fx('norm_erosion', 1, 'Speech chill')]),
      ch('hist-1968-6c', 'Channel energy into refugee resettlement programs', 'Practical mercy.', 'civic', 'ballot', 'RESETTLE', [fx('civilian_cost', -2, 'Refugees aided'), fx('domestic_support', 1, 'Concrete help'), fx('alliance_cohesion', 1, 'Shared burden')]),
    ]),
    beat('hist-1968-7', 'Ally divergences', 'Some allies want trade as usual; others want a freeze. A split response weakens the signal.', 'Détente and deterrence argue in the same room.', [
      ch('hist-1968-7a', 'Forge a common Allied communiqué with graduated measures', 'Unity text.', 'diplomatic', 'brussels', 'COMMUNI', [fx('alliance_cohesion', 3, 'One voice'), fx('diplomacy', 1, 'Coordinated'), fx('time', -1, 'Drafting tax')]),
      ch('hist-1968-7b', 'Allow national measures à la carte', 'Flexibility.', 'political', 'capital', 'ALACARTE', [fx('time', 1, 'Faster nationals'), fx('alliance_cohesion', -2, 'Fragmented'), fx('credibility', -1, 'Muddy signal')]),
      ch('hist-1968-7c', 'Link any détente talks to a Prague human-rights annex', 'Conditionality.', 'diplomatic', 'parliament', 'ANNEX', [fx('norm_protection', 2, 'Rights linked'), fx('diplomacy', -1, 'Harder détente'), fx('credibility', 1, 'Principled')]),
    ]),
    beat('hist-1968-8', 'Normalization fog', 'Collaborator governments claim consent. Your intelligence and exiles disagree. Recognition choices follow the fog.', 'Recognizing a puppet is a policy, not a fact.', [
      ch('hist-1968-8a', 'Delay recognition; keep ties at chargé level', 'Ambiguous status.', 'diplomatic', 'capital', 'CHARGE', [fx('time', 2, 'Option kept'), fx('diplomacy', 1, 'Channel thin'), fx('credibility', 1, 'Non-blessing')]),
      ch('hist-1968-8b', 'Recognize quickly to preserve embassy access', 'Presence over purity.', 'political', 'brussels', 'RECOG', [fx('diplomacy', 1, 'Access'), fx('norm_erosion', 2, 'Consent fiction'), fx('credibility', -1, 'Cynical')]),
      ch('hist-1968-8c', 'Publish a legal memo rejecting consent claims', 'Lawfare.', 'legal', 'parliament', 'MEMO', [fx('norm_protection', 2, 'Legal line'), fx('escalation', 1, 'Diplomatic fight'), fx('alliance_cohesion', 1, 'Some join')]),
    ]),
    beat('hist-1968-9', 'Quiet off-ramp', 'Back channels hint at prisoner releases and softer occupation optics if public campaigns quiet. Buying people with silence is a trade.', 'Human lives versus public witness.', [
      ch('hist-1968-9a', 'Trade campaign volume for verified releases', 'Quiet diplomacy.', 'diplomatic', 'capital', 'QUIETDIP', [fx('civilian_cost', -2, 'Prisoners out'), fx('credibility', -1, 'Muted voice'), fx('diplomacy', 2, 'Deal')]),
      ch('hist-1968-9b', 'Refuse; keep maximal public pressure', 'Witness first.', 'civic', 'streets', 'WITNESS', [fx('credibility', 2, 'Moral clarity'), fx('civilian_cost', 1, 'Hostages linger'), fx('escalation', 1, 'Chill deepens')]),
      ch('hist-1968-9c', 'Split: quiet track for people, loud track for norms', 'Dual approach.', 'diplomatic', 'brussels', 'DUAL3', [fx('diplomacy', 1, 'Both tracks'), fx('time', 1, 'Complex'), fx('credibility', 1, 'If coordinated')]),
    ]),
    beat('hist-1968-10', 'Brezhnev doctrine endgame', 'You must write Western doctrine: spheres are real, illegitimate, or contestable only politically.', 'How you name the intervention shapes the 1970s.', [
      ch('hist-1968-10a', 'Reject spheres publicly; invest in long political contestation', 'Ideas war.', 'political', 'parliament', 'IDEAS', [fx('norm_protection', 2, 'Anti-sphere'), fx('diplomacy', 1, 'Long game'), fx('escalation', -1, 'Non-military')]),
      ch('hist-1968-10b', 'Accept a tacit sphere while hardening NATO core', 'Realism.', 'kinetic', 'districts', 'SPHERE', [fx('deterrence', 2, 'Core strong'), fx('credibility', -2, 'Eastern Europe written off'), fx('alliance_cohesion', 1, 'NATO focus')]),
      ch('hist-1968-10c', 'Tie future economic deals to free movement and press rules', 'Helsinki seed.', 'economic', 'brussels', 'HELSINKI', [fx('norm_protection', 2, 'Basket linkage'), fx('diplomacy', 2, 'Process'), fx('market_stability', -1, 'Deal friction')]),
    ]),
  ],

  'hist-1973-oil': [
    beat('hist-1973-5', 'Spot price spike shock', 'Prices gap beyond models. Rationing lines form. Your next 48 hours decide whether markets or politics allocate scarcity.', 'Allocation is legitimacy.', [
      ch('hist-1973-5a', 'Impose odd-even rationing with hardship exceptions', 'Administrative fairness.', 'political', 'energy', 'RATION', [fx('social_calm', 1, 'Perceived fairness'), fx('market_stability', -1, 'Distortion'), fx('civilian_cost', -1, 'Some equity')]),
      ch('hist-1973-5b', 'Let prices clear and expand targeted cash transfers', 'Market plus cushion.', 'economic', 'fed', 'PRICE', [fx('market_stability', 2, 'Clearing'), fx('polarization', 1, 'Anger at prices'), fx('credibility', 1, 'Coherent tool')]),
      ch('hist-1973-5c', 'Seize stocks and allocate to priority sectors by decree', 'Command allocation.', 'economic', 'treasury', 'SEIZE', [fx('governability', 1, 'Control'), fx('norm_erosion', 2, 'Property shock'), fx('market_stability', -2, 'Chaos premium')]),
    ]),
    beat('hist-1973-6', 'Domestic heating politics', 'Winter approaches. Regional equity fights erupt. Your coalition can break on thermostat politics.', 'Energy is federalism under stress.', [
      ch('hist-1973-6a', 'Create a national heating equalization fund', 'Share the cold.', 'economic', 'treasury', 'HEAT', [fx('social_calm', 2, 'Equity'), fx('polarization', -1, 'Less regional war'), fx('market_stability', -1, 'Fiscal cost')]),
      ch('hist-1973-6b', 'Leave allocation to states with federal guidance only', 'Federalism.', 'political', 'em', 'STATES', [fx('governability', -1, 'Patchwork'), fx('polarization', 1, 'Blame shifts'), fx('time', 1, 'Faster local')]),
      ch('hist-1973-6c', 'Prioritize industrial continuity over household comfort', 'Production first.', 'economic', 'desk', 'INDUSTRY', [fx('market_stability', 1, 'Output'), fx('civilian_cost', 2, 'Households suffer'), fx('polarization', 2, 'Class anger')]),
    ]),
    beat('hist-1973-7', 'Alliance recycling ask', 'Partners want petrodollar recycling and shared stock drawdowns. Free-riding accusations fly.', 'Consumer solidarity is hard under scarcity.', [
      ch('hist-1973-7a', 'Commit to proportional SPR-like draws with partners', 'Share the buffer.', 'diplomatic', 'energy', 'SPR', [fx('alliance_cohesion', 3, 'Consumer bloc'), fx('market_stability', 2, 'Coordinated calm'), fx('time', 1, 'Buys weeks')]),
      ch('hist-1973-7b', 'Hoard national stocks; offer only intelligence sharing', 'National first.', 'economic', 'fed', 'HOARD', [fx('market_stability', 1, 'National buffer'), fx('alliance_cohesion', -3, 'Partners bitter'), fx('credibility', -1, 'Selfish optics')]),
      ch('hist-1973-7c', 'Propose a joint purchasing agency to reduce bidding wars', 'Buyer power.', 'economic', 'desk', 'BUYER', [fx('market_stability', 2, 'Less frenzy'), fx('diplomacy', 1, 'Institution'), fx('time', -1, 'Setup')]),
    ]),
    beat('hist-1973-8', 'Force-option rumor fog', 'Rumors of seizure plans against fields circulate. Markets spike on the rumor alone. You must kill, confirm, or instrumentalize it.', 'Deterrence theater can become accidental policy.', [
      ch('hist-1973-8a', 'Publicly renounce seizure options; double diplomacy', 'Kill the rumor.', 'diplomatic', 'exchange', 'RENOUNCE', [fx('diplomacy', 2, 'Talks first'), fx('escalation', -2, 'War talk down'), fx('deterrence', -1, 'Less fear leverage')]),
      ch('hist-1973-8b', 'Keep ambiguity as bargaining leverage', 'Strategic silence.', 'political', 'treasury', 'AMBIG2', [fx('deterrence', 1, 'Fear premium'), fx('escalation', 1, 'Misread risk'), fx('market_stability', -2, 'Risk premium')]),
      ch('hist-1973-8c', 'Launch a leak probe and brief markets on continuity plans', 'Calm the tape.', 'economic', 'desk', 'PROBE2', [fx('market_stability', 2, 'Messaging'), fx('credibility', 1, 'Adult supervision'), fx('time', 1, 'Focus')]),
    ]),
    beat('hist-1973-9', 'Diplomatic off-ramp', 'A package links partial supply restoration to a negotiation calendar on the underlying conflict. Spoilers abound.', 'Energy peace is rarely only about energy.', [
      ch('hist-1973-9a', 'Endorse a linked calendar with verification on barrels', 'Oil for process.', 'diplomatic', 'energy', 'OILPROC', [fx('diplomacy', 3, 'Linked deal'), fx('market_stability', 2, 'Supply hope'), fx('alliance_cohesion', 1, 'Shared track')]),
      ch('hist-1973-9b', 'Insist on delinking energy from the political dispute', 'Separate tracks.', 'political', 'fed', 'DELINK', [fx('credibility', 1, 'Principle'), fx('diplomacy', -1, 'Harder bargain'), fx('market_stability', -1, 'Delay')]),
      ch('hist-1973-9c', 'Offer technology and food offsets for interim barrels', 'Side payments.', 'economic', 'em', 'OFFSET', [fx('diplomacy', 1, 'Sweeteners'), fx('market_stability', 1, 'Some barrels'), fx('credibility', -1, 'Transactional')]),
    ]),
    beat('hist-1973-10', 'New-normal endgame', 'You must choose whether to treat scarcity as temporary or to lock in efficiency, diversification, and strategic stocks as doctrine.', 'The shock becomes structure—or is forgotten.', [
      ch('hist-1973-10a', 'Mandate strategic stocks and efficiency standards', 'Institutionalize resilience.', 'economic', 'energy', 'RESIL', [fx('market_stability', 2, 'Buffers'), fx('credibility', 2, 'Learned lesson'), fx('polarization', 1, 'Regulation fights')]),
      ch('hist-1973-10b', 'Sunset emergency powers and return to pre-shock norms', 'Normalcy bias.', 'political', 'treasury', 'SUNSET2', [fx('norm_protection', 1, 'Emergency ends'), fx('market_stability', -1, 'Unprepared next time'), fx('domestic_support', 1, 'Relief')]),
      ch('hist-1973-10c', 'Prioritize producer-consumer conference architecture', 'Diplomacy as structure.', 'diplomatic', 'exchange', 'CONF', [fx('diplomacy', 2, 'Standing forum'), fx('alliance_cohesion', 1, 'Shared table'), fx('time', 1, 'Process')]),
    ]),
  ],

  'hist-1979-persian-pivot': [
    beat('hist-1979-5', 'Embassy seizure shock', 'Staff are hostages. Rescue planning, sanctions, and negotiation compete on the same clock. A failed raid could kill the channel—and the people.', 'Human lives versus strategic posture.', [
      ch('hist-1979-5a', 'Open a multilayer negotiation channel via third parties', 'Talk first.', 'diplomatic', 'oman', 'CHANNEL2', [fx('diplomacy', 3, 'Release path'), fx('time', 2, 'Patient'), fx('domestic_support', -1, 'Looks soft')]),
      ch('hist-1979-5b', 'Authorize contingency rescue planning to a ready state', 'Prepare the raid.', 'kinetic', 'base', 'RESCUE', [fx('deterrence', 1, 'Options ready'), fx('escalation', 2, 'If used, war risk'), fx('civilian_cost', 1, 'Hostage risk')]),
      ch('hist-1979-5c', 'Freeze assets and hitch release to sanctions relief design', 'Money track.', 'economic', 'dubai', 'FREEZE2', [fx('economic_pressure', 2, 'Leverage'), fx('diplomacy', 1, 'Bargaining chip'), fx('market_stability', -1, 'Gulf nerves')]),
    ]),
    beat('hist-1979-6', 'Domestic humiliation politics', 'Nightly news frames weakness. A public ultimatum may trap you; silence may trap the hostages’ families.', 'Television is a negotiating party.', [
      ch('hist-1979-6a', 'Brief families privately; keep public language restrained', 'Dignity without ultimatum.', 'civic', 'riyadh', 'FAMILIES', [fx('domestic_support', 1, 'Empathy'), fx('diplomacy', 1, 'Room to talk'), fx('credibility', 1, 'Adult tone')]),
      ch('hist-1979-6b', 'Issue a public deadline with implied force', 'Television resolve.', 'political', 'tehran', 'DEADLINE', [fx('domestic_support', 2, 'Resolve optics'), fx('escalation', 2, 'Clock trap'), fx('diplomacy', -2, 'Channel hardens')]),
      ch('hist-1979-6c', 'Flood the zone with process updates to manage attention', 'Information management.', 'political', 'oil', 'PROCESS2', [fx('time', 1, 'Attention managed'), fx('credibility', -1, 'Spin charge'), fx('social_calm', 1, 'Less panic')]),
    ]),
    beat('hist-1979-7', 'Gulf partner ask', 'Partners want a clear security umbrella and oil-lane escorts. Over-promising creates tripwires; under-promising invites Soviet or rival fills.', 'The Gulf security architecture is being rewritten in weeks.', [
      ch('hist-1979-7a', 'Offer consultative security and limited maritime escorts', 'Presence with limits.', 'naval', 'hormuz', 'ESCORT2', [fx('alliance_cohesion', 2, 'Partners steadied'), fx('deterrence', 2, 'Lane signal'), fx('escalation', 1, 'More hulls')]),
      ch('hist-1979-7b', 'Sell arms and intel, refuse new tripwires', 'Tools not guarantees.', 'diplomatic', 'riyadh', 'ARMS2', [fx('alliance_cohesion', 1, 'Useful'), fx('deterrence', 1, 'Partner teeth'), fx('credibility', -1, 'No umbrella')]),
      ch('hist-1979-7c', 'Propose a multilateral Gulf maritime regime', 'Institutionalize.', 'diplomatic', 'oman', 'REGIME', [fx('diplomacy', 2, 'Shared rules'), fx('alliance_cohesion', 1, 'Broad buy-in'), fx('time', -1, 'Slow build')]),
    ]),
    beat('hist-1979-8', 'Attribution and faction fog', 'Competing Iranian factions claim and deny authority over the hostages. Talking to the wrong node wastes leverage—or legitimizes radicals.', 'Who is the counterparty?', [
      ch('hist-1979-8a', 'Engage multiple nodes while recognizing none as sole authority', 'Mesh diplomacy.', 'diplomatic', 'tehran', 'MESH', [fx('diplomacy', 2, 'More paths'), fx('time', 1, 'Complex'), fx('credibility', -1, 'Mixed signals')]),
      ch('hist-1979-8b', 'Deal only with formal state ministries', 'Legal counterparty.', 'legal', 'dubai', 'FORMAL', [fx('credibility', 1, 'Clean channel'), fx('diplomacy', -1, 'May be powerless'), fx('time', -1, 'Slow')]),
      ch('hist-1979-8c', 'Amplify moderate claims to shape succession politics', 'Political warfare.', 'political', 'proxy', 'SHAPE2', [fx('escalation', 1, 'Factional fuel'), fx('diplomacy', 1, 'Influence bet'), fx('alliance_cohesion', -1, 'Partners uneasy')]),
    ]),
    beat('hist-1979-9', 'Release off-ramp', 'A sequenced release-for-assets-and-nonintervention package appears. Spoilers can still kill it on either side’s street.', 'Sequencing is everything.', [
      ch('hist-1979-9a', 'Accept phased releases with escrowed asset steps', 'Trust but escrow.', 'diplomatic', 'oman', 'ESCROW', [fx('diplomacy', 3, 'Deal path'), fx('escalation', -2, 'Crisis cools'), fx('credibility', 1, 'Craft')]),
      ch('hist-1979-9b', 'Demand all hostages before any asset movement', 'All or nothing.', 'political', 'tehran', 'ALLFIRST', [fx('credibility', 1, 'Hard clear'), fx('diplomacy', -1, 'Harder deal'), fx('time', -1, 'Stalemate risk')]),
      ch('hist-1979-9c', 'Add a public apology demand to satisfy home politics', 'Honor clause.', 'civic', 'oil', 'APOLOGY2', [fx('domestic_support', 2, 'Honor'), fx('diplomacy', -2, 'May kill deal'), fx('polarization', 1, 'Pride politics')]),
    ]),
    beat('hist-1979-10', 'Carter Doctrine endgame', 'Whether or not hostages are free, cabinet wants a Gulf security declaration. Words will be tested by the next tanker war.', 'Declaratory policy becomes geography.', [
      ch('hist-1979-10a', 'Declare vital-interest language for Gulf oil flow', 'Clear tripwire text.', 'political', 'strait', 'VITAL', [fx('deterrence', 3, 'Declaratory shield'), fx('alliance_cohesion', 2, 'Partners cheered'), fx('escalation', 1, 'Commitment risk')]),
      ch('hist-1979-10b', 'Keep interests vital but means ambiguous', 'Strategic ambiguity.', 'diplomatic', 'hormuz', 'AMBIG3', [fx('deterrence', 1, 'Some uncertainty'), fx('diplomacy', 1, 'Flexibility'), fx('alliance_cohesion', -1, 'Partners unsure')]),
      ch('hist-1979-10c', 'Prioritize energy transition investments over military pledges', 'Demand-side strategy.', 'economic', 'oil', 'TRANSIT2', [fx('market_stability', 1, 'Long resilience'), fx('deterrence', -1, 'Less force focus'), fx('credibility', 1, 'Structural fix')]),
    ]),
  ],

  'hist-1989-wall': [
    beat('hist-1989-5', 'Opening-night crowd shock', 'Borders become permeable faster than plans. Force against crowds could restart the Cold War; total passivity could create chaos and hardline backlash.', 'Crowd dynamics are strategy.', [
      ch('hist-1989-5a', 'Urge nonviolent crowd management and open crossing procedures', 'Channel the flood.', 'civic', 'streets', 'OPEN', [fx('civilian_cost', -2, 'Safer flow'), fx('diplomacy', 2, 'Peaceful change'), fx('escalation', -1, 'Less force')]),
      ch('hist-1989-5b', 'Advise temporary controlled closures to regain admin control', 'Order first.', 'political', 'capital', 'CLOSE', [fx('governability', 1, 'Admin breath'), fx('polarization', 2, 'Rage risk'), fx('escalation', 1, 'If forced')]),
      ch('hist-1989-5c', 'Flood humanitarian and transport support without political claims', 'Logistics as policy.', 'civic', 'districts', 'LOGIST', [fx('civilian_cost', -2, 'Aid'), fx('alliance_cohesion', 1, 'Helpful'), fx('time', 1, 'Stabilizes')]),
    ]),
    beat('hist-1989-6', 'Domestic reunification politics', 'Your public tastes reunification now; partners fear a giant. Speed versus reassurance is the fight.', 'National longing versus European architecture.', [
      ch('hist-1989-6a', 'Embrace reunification as goal with staged European embedding', 'Unity inside Europe.', 'political', 'parliament', 'EMBED', [fx('domestic_support', 2, 'National goal'), fx('eu_cohesion', 2, 'Embedded'), fx('diplomacy', 1, 'Partner frame')]),
      ch('hist-1989-6b', 'Slow-walk legal unity; prioritize confederation language', 'Calm neighbors.', 'diplomatic', 'brussels', 'CONFED', [fx('alliance_cohesion', 2, 'Neighbors eased'), fx('domestic_support', -2, 'Nationalists mad'), fx('time', 2, 'Slower')]),
      ch('hist-1989-6c', 'Let street politics set the pace; follow with law later', 'Democracy of the square.', 'civic', 'streets', 'SQUARE', [fx('norm_protection', 1, 'Popular will'), fx('governability', -1, 'Reactive state'), fx('escalation', 1, 'Improvised')]),
    ]),
    beat('hist-1989-7', 'Ally security map ask', 'Washington, Paris, and Moscow want incompatible alliance maps. Your answer shapes NATO’s future edge.', 'Architecture is the peace dividend—or its opposite.', [
      ch('hist-1989-7a', 'Propose unified Germany in NATO with special military limits', 'Classic bargain.', 'diplomatic', 'brussels', 'NATOGER', [fx('alliance_cohesion', 2, 'Western unity'), fx('diplomacy', 2, 'Negotiable limits'), fx('deterrence', 1, 'Alliance intact')]),
      ch('hist-1989-7b', 'Offer neutrality as a bridge concept', 'Finlandization risk.', 'diplomatic', 'capital', 'NEUTRAL', [fx('diplomacy', 1, 'Moscow easier'), fx('alliance_cohesion', -2, 'NATO hole'), fx('deterrence', -1, 'Ambiguous')]),
      ch('hist-1989-7c', 'Delay alliance talk until monetary union settles', 'Economics first.', 'economic', 'parliament', 'ECONF1', [fx('market_stability', 1, 'Money focus'), fx('time', 2, 'Security deferred'), fx('alliance_cohesion', -1, 'Uncertainty')]),
    ]),
    beat('hist-1989-8', 'Intelligence fog on hardliner coups', 'Reports of possible crackdowns conflict. Overreacting can provoke; underreacting can miss a massacre window.', 'Warning without panic.', [
      ch('hist-1989-8a', 'Quietly raise readiness and open crisis hotlines', 'Prepared restraint.', 'diplomatic', 'capital', 'HOTLINE2', [fx('deterrence', 1, 'Ready'), fx('diplomacy', 2, 'Talk pipes'), fx('escalation', -1, 'Channel cools')]),
      ch('hist-1989-8b', 'Publicly warn of consequences for any crackdown', 'Deterrent speech.', 'political', 'brussels', 'WARN2', [fx('credibility', 2, 'Clear cost'), fx('escalation', 1, 'Rhetoric heat'), fx('alliance_cohesion', 1, 'Shared line')]),
      ch('hist-1989-8c', 'Treat warnings as noise until multiply confirmed', 'Avoid cry-wolf.', 'political', 'parliament', 'NOISE', [fx('time', 1, 'Less false alarm'), fx('civilian_cost', 1, 'If real, late'), fx('credibility', -1, 'May look asleep')]),
    ]),
    beat('hist-1989-9', 'Monetary off-ramp', 'A rapid currency union could stabilize—or bankrupt. Conversion rates are class politics with foreign-policy stakes.', 'Exchange rates as statecraft.', [
      ch('hist-1989-9a', 'Choose a generous conversion to buy eastern consent', 'Political money.', 'economic', 'capital', 'GENEROUS', [fx('domestic_support', 2, 'Eastern buy-in'), fx('market_stability', -2, 'Costly'), fx('polarization', -1, 'Less revolt')]),
      ch('hist-1989-9b', 'Choose a strict conversion to protect monetary credibility', 'Hard money.', 'economic', 'brussels', 'STRICT', [fx('market_stability', 2, 'Credibility'), fx('civilian_cost', 2, 'Eastern pain'), fx('polarization', 2, 'Backlash')]),
      ch('hist-1989-9c', 'Stage conversion with EU support facilities', 'Europeanize the bill.', 'diplomatic', 'parliament', 'EUSUP', [fx('eu_cohesion', 2, 'Shared project'), fx('market_stability', 1, 'Buffered'), fx('diplomacy', 1, 'Partnered')]),
    ]),
    beat('hist-1989-10', 'Post-Wall endgame', 'You draft the “2+4” spirit note: borders final, rights secured, armies constrained. Spoilers still exist.', 'Settlements that last are boring on purpose.', [
      ch('hist-1989-10a', 'Lock final borders and minority rights in treaty language', 'Legal peace.', 'legal', 'brussels', 'BORDERS', [fx('norm_protection', 3, 'Rights and maps'), fx('diplomacy', 2, 'Settlement'), fx('escalation', -1, 'Less revisionism')]),
      ch('hist-1989-10b', 'Keep some border questions politically open', 'Flexibility trap.', 'political', 'capital', 'OPENQ', [fx('time', 1, 'Ambiguity'), fx('escalation', 1, 'Future fights'), fx('credibility', -1, 'Unsettled')]),
      ch('hist-1989-10c', 'Prioritize rapid Western economic absorption over legal niceties', 'Facts then law.', 'economic', 'districts', 'ABSORB3', [fx('market_stability', 1, 'Speed'), fx('norm_erosion', 1, 'Process thin'), fx('alliance_cohesion', 1, 'West integrates')]),
    ]),
  ],

  'hist-1991-union-end': [
    beat('hist-1991-5', 'Nuclear custody shock', 'Command authority fragments across republics. A single loose warhead is a civilization-scale failure mode.', 'Nukes make every other issue secondary.', [
      ch('hist-1991-5a', 'Prioritize centralized custody deals with technical aid', 'Secure the arsenal.', 'diplomatic', 'capital', 'CUSTODY', [fx('deterrence', 1, 'Control restored'), fx('diplomacy', 2, 'Technical path'), fx('alliance_cohesion', 2, 'West helps')]),
      ch('hist-1991-5b', 'Accept temporary multi-republic custody with monitors', 'Political reality.', 'diplomatic', 'brussels', 'MULTI', [fx('time', 1, 'Fits politics'), fx('escalation', 1, 'Control risk'), fx('credibility', -1, 'Messy')]),
      ch('hist-1991-5c', 'Threaten recognition freezes until custody is singular', 'Hard leverage.', 'political', 'parliament', 'FREEZE3', [fx('economic_pressure', 2, 'Leverage'), fx('diplomacy', -1, 'Resentment'), fx('escalation', -1, 'If it works, safer')]),
    ]),
    beat('hist-1991-6', 'Bread and voucher politics', 'Price liberalization without safety nets can topple reformers. Gradualism can empty shops slower—or forever.', 'Shock therapy is a security issue.', [
      ch('hist-1991-6a', 'Fund targeted safety nets alongside price reform', 'Cushion the shock.', 'economic', 'capital', 'NETS', [fx('social_calm', 2, 'Less revolt'), fx('market_stability', 1, 'Reform continues'), fx('civilian_cost', -1, 'Hardship cut')]),
      ch('hist-1991-6b', 'Push rapid liberalization to break shortages fast', 'Rip the bandage.', 'economic', 'brussels', 'SHOCK', [fx('market_stability', 1, 'If it works'), fx('civilian_cost', 3, 'Pain'), fx('polarization', 2, 'Backlash')]),
      ch('hist-1991-6c', 'Delay liberalization; flood food aid first', 'Calories before prices.', 'civic', 'streets', 'FOOD', [fx('civilian_cost', -2, 'Hunger eased'), fx('time', 2, 'Reform delayed'), fx('market_stability', -1, 'Shortages linger')]),
    ]),
    beat('hist-1991-7', 'Republic recognition ask', 'New flags want recognition now. Too fast risks nuclear and minority crises; too slow invites violence for facts on the ground.', 'Recognition timing is conflict management.', [
      ch('hist-1991-7a', 'Use criteria: custody, minorities, borders before recognition', 'Standards.', 'legal', 'parliament', 'CRITERIA', [fx('norm_protection', 2, 'Rule-based'), fx('diplomacy', 1, 'Incentives'), fx('time', 1, 'Sequenced')]),
      ch('hist-1991-7b', 'Recognize quickly to lock peaceful dissolution', 'Speed.', 'diplomatic', 'brussels', 'FASTREC', [fx('diplomacy', 1, 'Facts blessed'), fx('escalation', -1, 'Less fighting for recognition'), fx('credibility', -1, 'Thin criteria')]),
      ch('hist-1991-7c', 'Coordinate a single Western recognition wave', 'Unity.', 'diplomatic', 'capital', 'WAVE', [fx('alliance_cohesion', 3, 'One calendar'), fx('diplomacy', 2, 'Clear signal'), fx('time', -1, 'Coordination tax')]),
    ]),
    beat('hist-1991-8', 'Putsch information fog', 'During and after coup hours, who holds which ministry is unclear. Betting wrong can legitimize putschists—or strand reformers.', 'Fog is the coup’s friend.', [
      ch('hist-1991-8a', 'Refuse recognition of putsch authorities; keep reformer channel', 'Pick early.', 'diplomatic', 'capital', 'REFORMER', [fx('credibility', 2, 'Democratic signal'), fx('alliance_cohesion', 1, 'West aligned'), fx('escalation', 1, 'If putsch wins, exposure')]),
      ch('hist-1991-8b', 'Wait for force facts before any statement', 'Caution.', 'political', 'parliament', 'WAIT', [fx('time', 1, 'Less premature'), fx('credibility', -1, 'Vacillate charge'), fx('diplomacy', 1, 'Flexibility')]),
      ch('hist-1991-8c', 'Issue humanitarian-only statements avoiding legitimacy', 'Narrow voice.', 'civic', 'streets', 'HUM3', [fx('civilian_cost', -1, 'Aid frame'), fx('credibility', -1, 'Thin'), fx('diplomacy', 1, 'Low commitment')]),
    ]),
    beat('hist-1991-9', 'Debt and aid off-ramp', 'A grand bargain: aid and debt relief for reforms and arms control. Conditionality can save or sink reformers.', 'Money as midwife of a new order.', [
      ch('hist-1991-9a', 'Assemble a conditional grand bargain package', 'Big bang support.', 'economic', 'brussels', 'GRAND', [fx('market_stability', 2, 'Finance'), fx('diplomacy', 2, 'Linked deal'), fx('alliance_cohesion', 2, 'Western concert')]),
      ch('hist-1991-9b', 'Offer humanitarian aid only; avoid ownership of reforms', 'Distance.', 'economic', 'capital', 'HUMONLY', [fx('civilian_cost', -1, 'Some relief'), fx('credibility', 1, 'Limits clear'), fx('market_stability', -1, 'Weak macro help')]),
      ch('hist-1991-9c', 'Prioritize Nunn-Lugar-like security spending over macro aid', 'Nukes first.', 'diplomatic', 'districts', 'NUNN', [fx('deterrence', 2, 'Secure arms'), fx('diplomacy', 1, 'Security deal'), fx('social_calm', -1, 'Economy waits')]),
    ]),
    beat('hist-1991-10', 'Dissolution endgame', 'The union ends on paper. Your doctrine note chooses whether Russia is successor, first among equals, or just another republic.', 'Legal succession shapes decades.', [
      ch('hist-1991-10a', 'Treat Russia as primary successor for seats and weapons', 'Continuity bet.', 'diplomatic', 'capital', 'SUCCESS', [fx('diplomacy', 1, 'Clear desk'), fx('alliance_cohesion', 1, 'Workable'), fx('polarization', 1, 'Other republics resent')]),
      ch('hist-1991-10b', 'Push equitable succession formulas across key republics', 'Fairness.', 'legal', 'brussels', 'EQUITY', [fx('norm_protection', 2, 'Equal dignity'), fx('diplomacy', -1, 'Harder seats'), fx('time', -1, 'Complex')]),
      ch('hist-1991-10c', 'Leave succession messy; prioritize bilateral deals', 'Pragmatism.', 'political', 'parliament', 'MESSY', [fx('time', 1, 'Flexible'), fx('credibility', -1, 'Fog'), fx('alliance_cohesion', -1, 'Uneven')]),
    ]),
  ],

  'hist-1997-contagion': [
    beat('hist-1997-5', 'Won/baht second-wave shock', 'A new devaluation rumor hits before the first program bites. Your desk must choose deepen, redesign, or let float freely.', 'Programs die in the second week.', [
      ch('hist-1997-5a', 'Deepen the program with larger official financing', 'Bigger firewall.', 'economic', 'fed', 'DEEPEN', [fx('market_stability', 2, 'Firewall'), fx('credibility', 1, 'Commitment'), fx('polarization', 1, 'Austerity anger')]),
      ch('hist-1997-5b', 'Redesign toward bank restructuring first', 'Fix the pipes.', 'economic', 'treasury', 'BANKS', [fx('market_stability', 2, 'Solvency focus'), fx('time', 1, 'Sequence'), fx('domestic_support', -1, 'Closures')]),
      ch('hist-1997-5c', 'Allow a freer float and cut official money', 'Market purge.', 'economic', 'exchange', 'FLOAT', [fx('market_stability', -2, 'Overshoot risk'), fx('credibility', 1, 'Orthodox'), fx('civilian_cost', 2, 'Pain')]),
    ]),
    beat('hist-1997-6', 'Jakarta street politics', 'Riots threaten program ownership. Sidelining cronies can stabilize—or shatter the only implementers you have.', 'Politics is the IMF’s real collateral.', [
      ch('hist-1997-6a', 'Condition disbursements on transparent family-conglomerate cuts', 'Governance lever.', 'political', 'treasury', 'CRONY', [fx('credibility', 2, 'Reform signal'), fx('polarization', 1, 'Elite fight'), fx('market_stability', 1, 'If believed')]),
      ch('hist-1997-6b', 'Ease conditionality to preserve a governing coalition', 'Ownership first.', 'diplomatic', 'em', 'OWNER', [fx('governability', 2, 'Cabinet holds'), fx('credibility', -2, 'Soft program'), fx('alliance_cohesion', -1, 'Creditors wary')]),
      ch('hist-1997-6c', 'Fund social cash to buy calm while reforms proceed', 'Compensate losers.', 'economic', 'desk', 'CASH', [fx('social_calm', 2, 'Calm'), fx('civilian_cost', -1, 'Buffers'), fx('market_stability', 1, 'Space for reform')]),
    ]),
    beat('hist-1997-7', 'G7 coordination ask', 'Partners disagree on Japan’s role, US bilateral swaps, and Europe’s exposure talk. A split official sector is contagion’s friend.', 'Official sector unity is a market instrument.', [
      ch('hist-1997-7a', 'Broker a joint financing statement with clear burdens', 'One voice.', 'diplomatic', 'fed', 'JOINT$', [fx('alliance_cohesion', 3, 'Official unity'), fx('market_stability', 2, 'Confidence'), fx('diplomacy', 1, 'Deal')]),
      ch('hist-1997-7b', 'Lead bilaterally and let others free-ride', 'Speed over fairness.', 'economic', 'treasury', 'BILAT$', [fx('time', 2, 'Fast money'), fx('alliance_cohesion', -2, 'Resentment'), fx('market_stability', 1, 'Some firepower')]),
      ch('hist-1997-7c', 'Push a regional fund concept alongside the Fund', 'Asian architecture.', 'diplomatic', 'em', 'REGFUND', [fx('diplomacy', 1, 'Regional ownership'), fx('alliance_cohesion', -1, 'Rivalry risk'), fx('time', -1, 'Build lag')]),
    ]),
    beat('hist-1997-8', 'Data fog', 'True NPL ratios and offshore liabilities are guesses. Markets punish opacity; transparency can trigger the run you fear.', 'Accounting is crisis strategy.', [
      ch('hist-1997-8a', 'Force accelerated disclosure with official backstops ready', 'Sunlight plus net.', 'economic', 'exchange', 'DISCLOSE', [fx('credibility', 2, 'Transparency'), fx('market_stability', 1, 'If backstopped'), fx('time', -1, 'Shock day')]),
      ch('hist-1997-8b', 'Keep diagnostics private with creditors only', 'Quiet truth.', 'diplomatic', 'desk', 'PRIVATE', [fx('diplomacy', 1, 'Creditor room'), fx('credibility', -1, 'Public fog'), fx('market_stability', -1, 'Rumor premium')]),
      ch('hist-1997-8c', 'Publish stress ranges instead of point estimates', 'Honest uncertainty.', 'economic', 'fed', 'RANGES', [fx('credibility', 1, 'Epistemic honesty'), fx('market_stability', 1, 'Less fake precision'), fx('time', 1, 'Less cliff')]),
    ]),
    beat('hist-1997-9', 'Capital-controls off-ramp', 'A temporary controls proposal could stop outflow—or destroy credibility for a decade. Malaysia’s shadow hangs over the room.', 'Heresy that might work.', [
      ch('hist-1997-9a', 'Authorize time-bound outflow controls with a sunset', 'Emergency brake.', 'economic', 'em', 'CONTROLS', [fx('market_stability', 2, 'Outflow slowed'), fx('credibility', -1, 'Orthodoxy break'), fx('time', 2, 'Breathing room')]),
      ch('hist-1997-9b', 'Reject controls; raise rates and show pain tolerance', 'Classic defense.', 'economic', 'fed', 'RATES', [fx('credibility', 2, 'Orthodox'), fx('civilian_cost', 2, 'Pain'), fx('market_stability', -1, 'If it fails')]),
      ch('hist-1997-9c', 'Offer selective controls only on short-term flows', 'Surgical heresy.', 'economic', 'treasury', 'SELECT', [fx('market_stability', 1, 'Targeted'), fx('diplomacy', 1, 'Easier sell'), fx('credibility', -1, 'Still unorthodox')]),
    ]),
    beat('hist-1997-10', 'Architecture endgame', 'After the fires, cabinet asks whether to reform the Fund, build regional swaps, or preach self-insurance via reserves.', 'The next crisis is designed now.', [
      ch('hist-1997-10a', 'Push Fund reform on transparency and banking standards', 'Global plumbing.', 'diplomatic', 'fed', 'FUNDREF', [fx('credibility', 2, 'Lessons'), fx('market_stability', 1, 'Better rules'), fx('alliance_cohesion', 1, 'Shared project')]),
      ch('hist-1997-10b', 'Champion large national reserve accumulation', 'Self-insurance.', 'economic', 'em', 'RESERVES', [fx('market_stability', 1, 'National buffers'), fx('diplomacy', -1, 'Less pooling'), fx('credibility', 1, 'Never again')]),
      ch('hist-1997-10c', 'Build a standing regional swap network', 'Neighbors first.', 'diplomatic', 'desk', 'SWAPS', [fx('alliance_cohesion', 2, 'Regional glue'), fx('market_stability', 2, 'Liquidity net'), fx('time', -1, 'Negotiation')]),
    ]),
  ],

  'hist-2001-enduring': [
    beat('hist-2001-5', 'Northern front logistics shock', 'Supply lines through neighbors are fragile. Closing a route can stall the campaign; dependence creates vetoes.', 'Geography owns strategy.', [
      ch('hist-2001-5a', 'Diversify routes with costly air and alternate borders', 'Redundancy.', 'kinetic', 'convoy', 'DIVERSE', [fx('deterrence', 1, 'Ops continue'), fx('alliance_cohesion', 1, 'Less single veto'), fx('market_stability', -1, 'Cost')]),
      ch('hist-2001-5b', 'Deepen dependence on the primary neighbor with side payments', 'Buy the road.', 'diplomatic', 'border', 'BUYPASS', [fx('alliance_cohesion', 1, 'Neighbor held'), fx('credibility', -1, 'Transactional'), fx('escalation', 1, 'Leverage politics')]),
      ch('hist-2001-5c', 'Slow the campaign to match secure logistics only', 'Ops discipline.', 'political', 'capital', 'SLOW', [fx('time', 2, 'Safer pace'), fx('escalation', -1, 'Less stretch'), fx('domestic_support', -1, 'Looks hesitant')]),
    ]),
    beat('hist-2001-6', 'Home forever-war politics', 'Early unity fades into questions about ends. Defining success becomes the war.', 'Democracies need off-ramps in the brief.', [
      ch('hist-2001-6a', 'Publish measurable war aims short of nation-building', 'Finite goals.', 'political', 'radio', 'AIMS', [fx('credibility', 2, 'Clear ends'), fx('domestic_support', 1, 'Honest'), fx('alliance_cohesion', 1, 'Shared')]),
      ch('hist-2001-6b', 'Embrace transformative governance as the aim', 'Maximal.', 'civic', 'camp', 'NATION', [fx('credibility', 1, 'Ambition'), fx('civilian_cost', 1, 'Long occupation'), fx('escalation', 1, 'Deep fight')]),
      ch('hist-2001-6c', 'Keep aims ambiguous to preserve coalition and options', 'Fog as tool.', 'political', 'capital', 'FOG', [fx('time', 1, 'Flexibility'), fx('credibility', -2, 'Mission creep risk'), fx('alliance_cohesion', -1, 'Confusion')]),
    ]),
    beat('hist-2001-7', 'Neighbor intelligence ask', 'A neighbor offers targeting gold for political cover and aid. The deal can shorten the war—or own you.', 'Intelligence with a price tag.', [
      ch('hist-2001-7a', 'Take the intel with narrow, audited political concessions', 'Bounded bargain.', 'diplomatic', 'border', 'INTEL2', [fx('deterrence', 2, 'Better targeting'), fx('diplomacy', 1, 'Deal'), fx('credibility', -1, 'Compromise')]),
      ch('hist-2001-7b', 'Refuse conditionality; build unilateral collection', 'Independence.', 'kinetic', 'mine', 'UNILAT2', [fx('credibility', 1, 'Autonomy'), fx('time', -1, 'Slower intel'), fx('alliance_cohesion', -1, 'Neighbor cool')]),
      ch('hist-2001-7c', 'Multilateralize the intel bargain through coalition cover', 'Share the sin.', 'diplomatic', 'radio', 'MULTI2', [fx('alliance_cohesion', 2, 'Shared'), fx('diplomacy', 1, 'Cover'), fx('time', -1, 'Coordination')]),
    ]),
    beat('hist-2001-8', 'Civilian harm fog', 'Strike claims conflict. Local legitimacy can die from one wrong compound. Your ROE and story must match.', 'Precision without trust is still failure.', [
      ch('hist-2001-8a', 'Tighten ROE and fund rapid ex gratia payments', 'Restraint plus repair.', 'legal', 'camp', 'ROE2', [fx('civilian_cost', -2, 'Less harm'), fx('credibility', 1, 'Accountability'), fx('deterrence', -1, 'Slower ops')]),
      ch('hist-2001-8b', 'Prioritize tempo; accept higher collateral risk', 'Speed.', 'kinetic', 'mine', 'TEMPO', [fx('deterrence', 2, 'Pressure'), fx('civilian_cost', 3, 'Harm'), fx('polarization', 1, 'Local hatred')]),
      ch('hist-2001-8c', 'Invite partner observers on contested strikes', 'Shared eyes.', 'diplomatic', 'convoy', 'OBS4', [fx('alliance_cohesion', 1, 'Trust'), fx('credibility', 1, 'Process'), fx('time', -1, 'Friction')]),
    ]),
    beat('hist-2001-9', 'Day-after off-ramp', 'A transitional authority concept appears. Owning it means years; abandoning it means spoiler return.', 'Exit is a form of strategy.', [
      ch('hist-2001-9a', 'Back a broad transitional authority with UN scaffolding', 'Institutional day-after.', 'diplomatic', 'capital', 'TRANSIT', [fx('diplomacy', 2, 'Legitimacy path'), fx('alliance_cohesion', 1, 'Shared'), fx('time', 1, 'Process')]),
      ch('hist-2001-9b', 'Empower a narrow fighting coalition and exit combat role fast', 'Light footprint.', 'kinetic', 'border', 'LIGHT', [fx('time', 2, 'Faster exit'), fx('escalation', -1, 'Less own war'), fx('civilian_cost', 1, 'Governance gap')]),
      ch('hist-2001-9c', 'Commit to multi-year security assistance with metrics', 'Long leash.', 'political', 'camp', 'YEARS', [fx('deterrence', 1, 'Stay power'), fx('alliance_cohesion', 1, 'Partnering'), fx('domestic_support', -1, 'Forever fear')]),
    ]),
    beat('hist-2001-10', 'Intervention doctrine endgame', 'Cabinet wants rules for the next 9/11-like shock: punishment raids versus occupation, unilateral versus coalition.', 'Doctrine written in grief lasts.', [
      ch('hist-2001-10a', 'Codify coalition-first, limited aims, measurable exits', 'Restrained template.', 'political', 'capital', 'TEMPLATE', [fx('credibility', 2, 'Clear rules'), fx('alliance_cohesion', 2, 'Partners prefer'), fx('escalation', -1, 'Limits')]),
      ch('hist-2001-10b', 'Preserve unilateral freedom for imminent threats', 'Speed doctrine.', 'kinetic', 'mine', 'UNILAT3', [fx('deterrence', 2, 'Fast option'), fx('alliance_cohesion', -1, 'Suspicion'), fx('norm_erosion', 1, 'Fewer brakes')]),
      ch('hist-2001-10c', 'Shift primary effort to law enforcement and finance tools', 'Police the network.', 'legal', 'radio', 'LAWFARE', [fx('diplomacy', 1, 'Non-war tools'), fx('escalation', -1, 'Less kinetic'), fx('credibility', 1, 'Another toolkit')]),
    ]),
  ],

  'hist-2008-lehman': [
    beat('hist-2008-5', 'Money-market break-the-buck shock', 'A flagship fund breaks. Without a guarantee, the real economy’s cash management freezes.', 'Plumbing panic becomes Main Street.', [
      ch('hist-2008-5a', 'Guarantee money-market funds temporarily', 'Stop the run.', 'economic', 'fed', 'MMFG', [fx('market_stability', 3, 'Run stops'), fx('credibility', -1, 'Moral hazard'), fx('polarization', 1, 'Bailout politics')]),
      ch('hist-2008-5b', 'Let funds gate redemptions without a public guarantee', 'Private brake.', 'economic', 'desk', 'GATE', [fx('market_stability', -1, 'Friction'), fx('credibility', 1, 'Less taxpayer'), fx('civilian_cost', 1, 'Cash stuck')]),
      ch('hist-2008-5c', 'Force sponsor recapitalizations under threat of resolution', 'Accountability.', 'legal', 'treasury', 'SPONSOR', [fx('credibility', 2, 'Costs on owners'), fx('market_stability', 1, 'If it works'), fx('time', -1, 'Negotiation')]),
    ]),
    beat('hist-2008-6', 'Main Street rage politics', 'Taxpayers see Wall Street rescued first. Your fiscal package dies without a fairness story.', 'Political economy is the constraint set.', [
      ch('hist-2008-6a', 'Attach executive-pay and equity warrants to any aid', 'Fairness tools.', 'political', 'treasury', 'WARRANTS', [fx('domestic_support', 2, 'Fairness'), fx('market_stability', 1, 'Aid possible'), fx('credibility', 1, 'Skin in game')]),
      ch('hist-2008-6b', 'Prioritize speed; defer fairness conditions', 'Fire first.', 'economic', 'fed', 'SPEED', [fx('market_stability', 2, 'Fast'), fx('polarization', 2, 'Rage'), fx('domestic_support', -2, 'Bailout stain')]),
      ch('hist-2008-6c', 'Lead with household foreclosure relief optics first', 'Main Street first.', 'civic', 'em', 'HOUSING', [fx('social_calm', 2, 'Optics'), fx('civilian_cost', -1, 'Some relief'), fx('market_stability', -1, 'Banks wait')]),
    ]),
    beat('hist-2008-7', 'Cross-border coordination ask', 'Europe wants consistent guarantees; inconsistent national schemes pull deposits across borders.', 'One market, many treasuries.', [
      ch('hist-2008-7a', 'Align guarantee language in a 48-hour concert', 'One signal.', 'diplomatic', 'fed', 'CONCERT', [fx('alliance_cohesion', 3, 'Official unity'), fx('market_stability', 2, 'Less shopping'), fx('diplomacy', 1, 'Deal')]),
      ch('hist-2008-7b', 'Go national and accept temporary fragmentation', 'Sovereignty.', 'economic', 'treasury', 'NATL2', [fx('time', 1, 'Faster local'), fx('market_stability', -2, 'Fragmentation'), fx('alliance_cohesion', -2, 'Blame')]),
      ch('hist-2008-7c', 'Create a temporary FX and swap mega-facility first', 'Dollar liquidity.', 'economic', 'exchange', 'SWAPMEGA', [fx('market_stability', 3, 'Dollar calm'), fx('alliance_cohesion', 2, 'Shared pipes'), fx('credibility', 1, 'Central banks')]),
    ]),
    beat('hist-2008-8', 'Solvency versus liquidity fog', 'Some firms are illiquid; some are dead. Treating corpses as patients wastes capital; treating patients as corpses deepens panic.', 'Triage under uncertainty.', [
      ch('hist-2008-8a', 'Stand up a public-private triage facility with haircuts', 'Structured judgment.', 'economic', 'desk', 'TRIAGE2', [fx('market_stability', 2, 'Clearing'), fx('credibility', 1, 'Discipline'), fx('time', 1, 'Process')]),
      ch('hist-2008-8b', 'Assume systemic liquidity and flood broadly', 'Hose first.', 'economic', 'fed', 'HOSE', [fx('market_stability', 2, 'Calm'), fx('credibility', -1, 'Zombie risk'), fx('polarization', 1, 'Blank check fear')]),
      ch('hist-2008-8c', 'Resolve the weakest quickly to scare the rest into raising capital', 'Example.', 'legal', 'treasury', 'RESOLVE', [fx('credibility', 2, 'Discipline'), fx('market_stability', -2, 'Fear spike'), fx('escalation', 1, 'Contagion risk')]),
    ]),
    beat('hist-2008-9', 'Fiscal off-ramp', 'A stimulus-plus-stability package can pass if sold as temporary and audited. Spoilers want purity or revenge.', 'Congress is part of the crisis committee.', [
      ch('hist-2008-9a', 'Push a temporary, audited, bipartisan package', 'Grand bargain lite.', 'political', 'treasury', 'PACKAGE2', [fx('governability', 2, 'Votes'), fx('market_stability', 2, 'Fiscal backstop'), fx('domestic_support', 1, 'Process')]),
      ch('hist-2008-9b', 'Rely on monetary tools alone to avoid fiscal fight', 'Central bank only.', 'economic', 'fed', 'MONONLY', [fx('market_stability', 1, 'Some help'), fx('polarization', -1, 'Less congress war'), fx('credibility', -1, 'Limits of money')]),
      ch('hist-2008-9c', 'Attach industrial policy riders to buy votes', 'Logroll.', 'political', 'em', 'LOGROLL', [fx('governability', 1, 'Passes'), fx('credibility', -1, 'Pork'), fx('market_stability', 1, 'Something passes')]),
    ]),
    beat('hist-2008-10', 'Macroprudential endgame', 'After the fire, you choose: bigger capital, resolution regimes, or “never bail again” pledges that markets may not believe.', 'Credibility about the next bailout is the reform.', [
      ch('hist-2008-10a', 'Build living wills and resolution authority for giants', 'Failability.', 'legal', 'treasury', 'LIVING', [fx('credibility', 2, 'Can fail'), fx('market_stability', 1, 'Clearer'), fx('norm_protection', 1, 'Rule of law')]),
      ch('hist-2008-10b', 'Raise capital and liquidity ratios hard', 'Buffers.', 'economic', 'fed', 'BUFFERS', [fx('market_stability', 2, 'Safer banks'), fx('polarization', 1, 'Credit squeeze fight'), fx('credibility', 1, 'Prudence')]),
      ch('hist-2008-10c', 'Pledge no more bailouts without new tools to make it true', 'Words plus gears.', 'political', 'desk', 'NOMORE', [fx('domestic_support', 2, 'Popular'), fx('credibility', -1, 'If tools weak'), fx('market_stability', -1, 'Uncertainty')]),
    ]),
  ],

  'hist-2011-squares': [
    beat('hist-2011-5', 'Regime-violence shock', 'Live feeds show lethal force against crowds. Your recognition and intervention clocks accelerate under moral and strategic pressure.', 'Images collapse decision time.', [
      ch('hist-2011-5a', 'Lead a sanctions-plus-ICC referral package', 'Law and costs.', 'legal', 'port', 'ICC', [fx('norm_protection', 2, 'Accountability'), fx('economic_pressure', 2, 'Costs'), fx('diplomacy', 1, 'Coalition path')]),
      ch('hist-2011-5b', 'Move toward a no-fly / civilian-protection mandate', 'Air power.', 'kinetic', 'escort', 'NFZ', [fx('escalation', 2, 'War entry'), fx('civilian_cost', -1, 'Some protection'), fx('alliance_cohesion', 1, 'If authorized')]),
      ch('hist-2011-5c', 'Limit to evacuation and humanitarian corridors', 'Narrow duty.', 'diplomatic', 'canal', 'HUMCOR', [fx('civilian_cost', -2, 'People out'), fx('escalation', -1, 'Limited'), fx('credibility', -1, 'Inaction charge')]),
    ]),
    beat('hist-2011-6', 'Domestic war-appetite politics', 'Publics cheer values until body bags. Your mandate language must survive month three.', 'Democracies overpromise in week one.', [
      ch('hist-2011-6a', 'Write a narrow civilian-protection mandate with reporting', 'Limits in law.', 'political', 'insurer', 'NARROW2', [fx('credibility', 2, 'Honest scope'), fx('alliance_cohesion', 1, 'Sellable'), fx('deterrence', -1, 'Less regime change')]),
      ch('hist-2011-6b', 'Embrace regime-change rhetoric to match the street', 'Maximal story.', 'civic', 'proxy', 'REGIME', [fx('domestic_support', 2, 'Moral clarity'), fx('escalation', 2, 'Deeper war'), fx('diplomacy', -1, 'Harder end')]),
      ch('hist-2011-6c', 'Keep rhetoric vague to hold a fragile coalition', 'Ambiguity.', 'diplomatic', 'chokepoint', 'VAGUE', [fx('alliance_cohesion', 1, 'Holds for now'), fx('credibility', -2, 'Later whiplash'), fx('time', 1, 'Flexibility')]),
    ]),
    beat('hist-2011-7', 'Regional ally divergence', 'Partners split on Islamist electoral wins and monarchy stability. Your desk cannot please both.', 'The region’s order vs. the region’s ballot.', [
      ch('hist-2011-7a', 'Defend electoral outcomes if nonviolent and inclusive enough', 'Ballot preference.', 'diplomatic', 'port', 'BALLOT2', [fx('norm_protection', 2, 'Democracy'), fx('alliance_cohesion', -2, 'Monarchies cold'), fx('credibility', 1, 'Consistent')]),
      ch('hist-2011-7b', 'Back stability partners while urging reform timelines', 'Order with homework.', 'diplomatic', 'proxy', 'STABPART', [fx('alliance_cohesion', 2, 'Monarchies held'), fx('norm_erosion', 1, 'Democracy deferred'), fx('escalation', -1, 'Less chaos now')]),
      ch('hist-2011-7c', 'Stay neutral publicly; fund civil-society quietly', 'Deniable values.', 'civic', 'canal', 'CIVSOC', [fx('norm_protection', 1, 'Quiet help'), fx('credibility', -1, 'Hypocrisy risk'), fx('diplomacy', 1, 'Flexibility')]),
    ]),
    beat('hist-2011-8', 'Migration and energy fog', 'Displacement spikes and energy routes wobble. Numbers conflict; fear fills the gaps.', 'Secondary effects can outrun the original square.', [
      ch('hist-2011-8a', 'Stand up burden-sharing resettlement and search-and-rescue', 'Absorb humanely.', 'civic', 'port', 'RESETL2', [fx('civilian_cost', -2, 'Lives'), fx('alliance_cohesion', 1, 'Shared'), fx('polarization', 1, 'Home backlash')]),
      ch('hist-2011-8b', 'Harden borders and prioritize energy contracts', 'Control first.', 'economic', 'insurer', 'HARDEN', [fx('market_stability', 1, 'Energy'), fx('polarization', 2, 'Nativism'), fx('civilian_cost', 1, 'Stranded people')]),
      ch('hist-2011-8c', 'Publish verified flow and price dashboards weekly', 'Fight fog with data.', 'diplomatic', 'chokepoint', 'DASH2', [fx('credibility', 2, 'Facts'), fx('social_calm', 1, 'Less rumor'), fx('time', 1, 'Attention')]),
    ]),
    beat('hist-2011-9', 'Transition off-ramp', 'A negotiated exit for a wobbling ally appears—amnesty versus accountability. Spoilers prefer the battlefield.', 'Justice sequencing is the bargain.', [
      ch('hist-2011-9a', 'Broker exile-plus-asset deals to stop the killing', 'Ugly peace.', 'diplomatic', 'proxy', 'EXILE', [fx('escalation', -2, 'Guns down'), fx('norm_erosion', 1, 'Impunity'), fx('civilian_cost', -2, 'Lives saved')]),
      ch('hist-2011-9b', 'Insist on domestic trials before any exit deal', 'Accountability first.', 'legal', 'port', 'TRIALS2', [fx('norm_protection', 2, 'Justice'), fx('diplomacy', -1, 'Harder deal'), fx('escalation', 1, 'Fight continues')]),
      ch('hist-2011-9c', 'Support a technocratic interim without old elites or street vetoes', 'Neither side fully wins.', 'political', 'canal', 'TECHNO', [fx('governability', 1, 'Admin continuity'), fx('polarization', 1, 'Both camps mad'), fx('diplomacy', 1, 'Narrow path')]),
    ]),
    beat('hist-2011-10', 'Aftershock doctrine endgame', 'Cabinet asks whether 2011 was a freedom wave to repeat, a cautionary tale, or a region-specific exception.', 'The memo shapes the next square.', [
      ch('hist-2011-10a', 'Codify civilian-protection criteria and exit metrics', 'Rules for next time.', 'political', 'escort', 'CRIT2', [fx('credibility', 2, 'Learned limits'), fx('alliance_cohesion', 1, 'Shareable'), fx('escalation', -1, 'Clearer brakes')]),
      ch('hist-2011-10b', 'Declare non-intervention except for direct threats', 'Retrenchment.', 'diplomatic', 'chokepoint', 'RETRENCH', [fx('escalation', -2, 'Fewer wars'), fx('credibility', -1, 'Values gap'), fx('alliance_cohesion', -1, 'Partners alone')]),
      ch('hist-2011-10c', 'Invest in prevention: mediation, jobs, and broadcast pluralism', 'Upstream strategy.', 'civic', 'insurer', 'UPSTREAM', [fx('diplomacy', 2, 'Prevention'), fx('polarization', -1, 'Less fuel'), fx('time', 1, 'Long game')]),
    ]),
  ],

  'hist-2014-crimea': [
    beat('hist-2014-5', 'Little-green-men fog', 'Unmarked forces seize sites. Attribution is politically obvious and legally contested. Your first labeled word matters.', 'Ambiguity is the invasion’s armor.', [
      ch('hist-2014-5a', 'Attribute publicly with intelligence releases', 'Name the actor.', 'diplomatic', 'brussels', 'ATTRIB', [fx('credibility', 2, 'Clarity'), fx('escalation', 1, 'Confrontation'), fx('alliance_cohesion', 1, 'Shared fact')]),
      ch('hist-2014-5b', 'Keep language legalistic—“violations”—without naming', 'Slow escalation.', 'legal', 'parliament', 'LEGALIST', [fx('escalation', -1, 'Less heat'), fx('credibility', -1, 'Evasion charge'), fx('diplomacy', 1, 'Room')]),
      ch('hist-2014-5c', 'Demand immediate OSCE-like access as the test', 'Process tripwire.', 'diplomatic', 'capital', 'OSCE', [fx('diplomacy', 2, 'Access ask'), fx('norm_protection', 1, 'Monitors'), fx('time', 1, 'Clock')]),
    ]),
    beat('hist-2014-6', 'Energy and winter politics', 'Gas leverage hits households. Solidarity costs money; folding teaches the wrong lesson.', 'Pipelines are ballot issues.', [
      ch('hist-2014-6a', 'Coordinate reverse flows and winter storage solidarity', 'Share warmth.', 'economic', 'brussels', 'REVERSE', [fx('alliance_cohesion', 3, 'Energy union'), fx('market_stability', 2, 'Buffered'), fx('civilian_cost', -1, 'Homes warmer')]),
      ch('hist-2014-6b', 'Negotiate a narrow commercial gas deal separately', 'Delink.', 'economic', 'capital', 'GASDEAL', [fx('market_stability', 1, 'Supply'), fx('credibility', -1, 'Mixed signal'), fx('diplomacy', 1, 'Channel')]),
      ch('hist-2014-6c', 'Accept higher prices as the cost of principle', 'Pay for norms.', 'political', 'streets', 'PAY', [fx('credibility', 2, 'Principled'), fx('civilian_cost', 2, 'Bills'), fx('polarization', 1, 'Anger')]),
    ]),
    beat('hist-2014-7', 'Arming ask', 'Partners request defensive arms. Lethal aid can deter—or provide pretext. Training-only may be too little.', 'Weapons are messages.', [
      ch('hist-2014-7a', 'Authorize defensive lethal aid with end-use monitoring', 'Teeth with rules.', 'kinetic', 'districts', 'DEFENSE', [fx('deterrence', 2, 'Costly advance'), fx('escalation', 2, 'Aid as issue'), fx('alliance_cohesion', 1, 'Partner held')]),
      ch('hist-2014-7b', 'Limit to non-lethal and intelligence support', 'Soft help.', 'diplomatic', 'brussels', 'NONLETH', [fx('escalation', -1, 'Lower pretext'), fx('deterrence', -1, 'Weaker'), fx('alliance_cohesion', -1, 'Partner underwhelmed')]),
      ch('hist-2014-7c', 'Lead with sanctions intensity instead of arms', 'Economic theater.', 'economic', 'parliament', 'SANC2', [fx('economic_pressure', 3, 'Costs'), fx('alliance_cohesion', 1, 'If unified'), fx('market_stability', -1, 'Blowback')]),
    ]),
    beat('hist-2014-8', 'Referendum information fog', 'A hurried poll under occupation claims consent. Debunking is necessary; obsessing can distract from Donbas guns.', 'Fake consent still shapes narratives.', [
      ch('hist-2014-8a', 'Issue a legal non-recognition doctrine immediately', 'Paper shield.', 'legal', 'brussels', 'NONREC2', [fx('norm_protection', 3, 'Conquest denied'), fx('diplomacy', 1, 'Coalition tool'), fx('credibility', 2, 'Clear line')]),
      ch('hist-2014-8b', 'Flood counter-messaging but avoid mirror referenda talk', 'Narrative fight.', 'civic', 'streets', 'COUNTER', [fx('polarization', 1, 'Info war'), fx('credibility', 1, 'Rebuttal'), fx('time', 1, 'Attention')]),
      ch('hist-2014-8c', 'Ignore the spectacle; focus resources on the active front', 'Guns over ballots.', 'kinetic', 'districts', 'FRONT', [fx('deterrence', 1, 'Priority clear'), fx('norm_erosion', 1, 'Spectacle stands'), fx('alliance_cohesion', -1, 'Legalists uneasy')]),
    ]),
    beat('hist-2014-9', 'Minsk-like off-ramp', 'A ceasefire-plus-status formula appears. It can freeze gains or stop the dying. Spoilers prefer either purity or conquest.', 'Freezes are peaces with expiration dates.', [
      ch('hist-2014-9a', 'Back a ceasefire with monitors and delayed status talks', 'Stop the guns first.', 'diplomatic', 'brussels', 'CFIRST', [fx('escalation', -2, 'Pause'), fx('diplomacy', 2, 'Process'), fx('domestic_support', -1, 'Frozen injustice')]),
      ch('hist-2014-9b', 'Refuse any text that legitimizes territorial faits accomplis', 'Purity.', 'political', 'parliament', 'PURITY', [fx('norm_protection', 2, 'No reward'), fx('escalation', 1, 'Fight continues'), fx('diplomacy', -1, 'Less deal space')]),
      ch('hist-2014-9c', 'Accept a narrow local ceasefire only around critical cities', 'Surgical pause.', 'diplomatic', 'capital', 'LOCALCF', [fx('civilian_cost', -1, 'Some relief'), fx('time', 1, 'Partial'), fx('credibility', -1, 'Incomplete')]),
    ]),
    beat('hist-2014-10', 'European security endgame', 'You write whether this is a regional crisis or a systemic challenge to the post-1945 map—and what budgets follow.', 'Naming the problem funds the response.', [
      ch('hist-2014-10a', 'Treat annexation as systemic; fund long deterrence adaptation', 'Era marker.', 'political', 'brussels', 'SYSTEMIC', [fx('deterrence', 3, 'Long posture'), fx('alliance_cohesion', 2, 'NATO awaken'), fx('escalation', 1, 'New normal confrontation')]),
      ch('hist-2014-10b', 'Contain as regional; keep global agendas primary', 'Triage.', 'diplomatic', 'capital', 'REGIONAL', [fx('time', 1, 'Bandwidth'), fx('alliance_cohesion', -1, 'Frontline worry'), fx('credibility', -1, 'Underweight')]),
      ch('hist-2014-10c', 'Prioritize energy transition and financial isolation tools', 'Structural counters.', 'economic', 'parliament', 'STRUCT', [fx('economic_pressure', 2, 'Long squeeze'), fx('market_stability', 1, 'Transition'), fx('diplomacy', 1, 'Non-kinetic')]),
    ]),
  ],

  'hist-2020-lockdown': [
    beat('hist-2020-5', 'Hospital overflow shock', 'ICU capacity breaks in a major city. Your next order is triage policy wearing democratic clothes.', 'Scarcity forces explicit values.', [
      ch('hist-2020-5a', 'Surge field hospitals and reallocate staff nationally', 'Move capacity.', 'civic', 'capital', 'SURGE2', [fx('civilian_cost', -2, 'Lives'), fx('governability', 1, 'State capacity'), fx('market_stability', -1, 'Cost')]),
      ch('hist-2020-5b', 'Tighten stay-at-home orders in hotspots only', 'Targeted stringency.', 'political', 'plaza', 'HOTSPOT', [fx('civilian_cost', -1, 'Some reduction'), fx('polarization', 1, 'Rule fights'), fx('social_calm', -1, 'Anger')]),
      ch('hist-2020-5c', 'Publish transparent triage ethics guidelines', 'Honest scarcity.', 'legal', 'court', 'TRIAGE3', [fx('credibility', 2, 'Honesty'), fx('norm_protection', 1, 'Process'), fx('domestic_support', -1, 'Hard truths')]),
    ]),
    beat('hist-2020-6', 'Livelihood revolt politics', 'Small businesses and workers demand openings. Public health warns of a second wave. Consent is the scarce good.', 'A mandate without livelihoods collapses.', [
      ch('hist-2020-6a', 'Pair restrictions with enriched fiscal bridges', 'Pay for compliance.', 'economic', 'imf', 'BRIDGE3', [fx('social_calm', 2, 'Consent bought'), fx('market_stability', 1, 'Demand floor'), fx('polarization', -1, 'Less revolt')]),
      ch('hist-2020-6b', 'Open faster and bet on voluntary caution', 'Freedom frame.', 'political', 'plaza', 'OPEN2', [fx('domestic_support', 2, 'Relief'), fx('civilian_cost', 2, 'Health risk'), fx('credibility', -1, 'If wave returns')]),
      ch('hist-2020-6c', 'Differentiate rules by age and risk with clear metrics', 'Precision policy.', 'civic', 'farm', 'RISK', [fx('credibility', 1, 'Targeted'), fx('polarization', 1, 'Fairness fights'), fx('civilian_cost', -1, 'Protect vulnerable')]),
    ]),
    beat('hist-2020-7', 'Supply-chain ally ask', 'Partners want coordinated PPE and vaccine R&D sharing. Hoarding wins headlines and loses the pandemic.', 'Health security is collective or performative.', [
      ch('hist-2020-7a', 'Join a pooled procurement and export-restraint compact', 'Share scarce goods.', 'diplomatic', 'port', 'POOL2', [fx('alliance_cohesion', 3, 'Health alliance'), fx('civilian_cost', -1, 'Wider supply'), fx('diplomacy', 1, 'Rules')]),
      ch('hist-2020-7b', 'Prioritize national stockpiles; sell surplus later', 'Nation first.', 'economic', 'capital', 'STOCK', [fx('civilian_cost', -1, 'National buffer'), fx('alliance_cohesion', -2, 'Partners bitter'), fx('credibility', -1, 'Selfish')]),
      ch('hist-2020-7c', 'Fund joint vaccine platforms with IP flexibility clauses', 'Science diplomacy.', 'diplomatic', 'imf', 'VAX', [fx('diplomacy', 2, 'Shared R&D'), fx('civilian_cost', -2, 'Faster tools'), fx('time', 1, 'Horizon')]),
    ]),
    beat('hist-2020-8', 'Infodemic fog', 'False cures and conspiracy content outrun official guidance. Over-censorship breeds mistrust; under-response kills.', 'Speech governance under plague.', [
      ch('hist-2020-8a', 'Partner with platforms on labeled health misinformation', 'Friction, not bans only.', 'civic', 'plaza', 'LABEL', [fx('credibility', 1, 'Correctives'), fx('norm_erosion', 1, 'Speech fights'), fx('social_calm', 1, 'Less panic')]),
      ch('hist-2020-8b', 'Flood official channels with daily plain-language briefs', 'Compete on volume.', 'political', 'capital', 'BRIEFS', [fx('credibility', 2, 'Presence'), fx('time', 1, 'Attention'), fx('polarization', -1, 'If trusted')]),
      ch('hist-2020-8c', 'Criminalize harmful medical falsehoods broadly', 'Hard speech law.', 'legal', 'court', 'CRIM', [fx('social_calm', 1, 'Short term'), fx('norm_erosion', 2, 'Speech chill'), fx('polarization', 2, 'Martyrs')]),
    ]),
    beat('hist-2020-9', 'Exit off-ramp', 'A metrics-based reopening plan can restore consent—or become a political football if thresholds move.', 'Predictable rules are a public good.', [
      ch('hist-2020-9a', 'Lock a public dashboard with precommitted thresholds', 'Rules over vibes.', 'political', 'capital', 'DASH3', [fx('credibility', 3, 'Predictable'), fx('governability', 1, 'Less ad hoc'), fx('domestic_support', 1, 'Fairness')]),
      ch('hist-2020-9b', 'Keep executive discretion for fast pivots', 'Flexibility.', 'political', 'plaza', 'DISCRET', [fx('time', 2, 'Agile'), fx('credibility', -1, 'Arbitrary feel'), fx('polarization', 1, 'Trust fights')]),
      ch('hist-2020-9c', 'Regionalize exits with federal minimums only', 'Federalism.', 'civic', 'farm', 'REGN2', [fx('governability', 1, 'Local fit'), fx('polarization', 1, 'Patchwork anger'), fx('alliance_cohesion', -1, 'Uneven')]),
    ]),
    beat('hist-2020-10', 'Pandemic doctrine endgame', 'You archive whether emergency powers were necessary exceptions or a template—and how to audit them.', 'The next pathogen inherits your footnotes.', [
      ch('hist-2020-10a', 'Sunset emergency powers with a statutory review board', 'Democracy after plague.', 'legal', 'court', 'SUNSET3', [fx('norm_protection', 3, 'Emergency ends'), fx('credibility', 2, 'Self-limiting'), fx('governability', -1, 'Slower next time')]),
      ch('hist-2020-10b', 'Keep standing bio-preparedness authorities funded', 'Permanent capacity.', 'political', 'capital', 'PREPARE', [fx('civilian_cost', -1, 'Ready'), fx('governability', 1, 'Capacity'), fx('polarization', 1, 'State power fear')]),
      ch('hist-2020-10c', 'Prioritize global surveillance and WHO reform investments', 'Upstream international.', 'diplomatic', 'imf', 'WHO', [fx('diplomacy', 2, 'Global pipes'), fx('alliance_cohesion', 1, 'Shared'), fx('credibility', 1, 'Lessons')]),
    ]),
  ],

  'hist-2024-hormuz-relapse': [
    beat('hist-2024-5', 'Second seizure shock', 'Another hull is hit or held. Markets treat it as pattern, not incident. Your response must break the pattern without owning a war.', 'Repetition is the strategy.', [
      ch('hist-2024-5a', 'Expand multinational escort rotations immediately', 'Presence answer.', 'naval', 'hormuz', 'ROTATE', [fx('deterrence', 2, 'Lane covered'), fx('alliance_cohesion', 2, 'Shared risk'), fx('escalation', 1, 'Contact risk')]),
      ch('hist-2024-5b', 'Strike a related proxy depot after attribution', 'Cost imposition.', 'kinetic', 'proxy', 'DEPOT', [fx('deterrence', 2, 'Pain'), fx('escalation', 3, 'Ladder'), fx('diplomacy', -2, 'Talks freeze')]),
      ch('hist-2024-5c', 'Open a crisis cell with a cease-seizure proposal', 'Talk under fire.', 'diplomatic', 'oman', 'CELL', [fx('diplomacy', 2, 'Channel'), fx('time', 1, 'Window'), fx('domestic_support', -1, 'Soft charge')]),
    ]),
    beat('hist-2024-6', 'Insurance and pump politics', 'Premiums and pump prices leap. Legislators demand magic. Strategic reserves are finite politics.', 'Households are a Gulf theater.', [
      ch('hist-2024-6a', 'Authorize a measured SPR release with ally coordination', 'Calm the tape.', 'economic', 'oil', 'SPR2', [fx('market_stability', 3, 'Price relief'), fx('alliance_cohesion', 1, 'Coordinated'), fx('time', 1, 'Bought weeks')]),
      ch('hist-2024-6b', 'Hold SPR; let prices discipline demand', 'Orthodoxy.', 'economic', 'dubai', 'HOLDSPR', [fx('credibility', 1, 'Discipline'), fx('civilian_cost', 2, 'Pump pain'), fx('polarization', 1, 'Anger')]),
      ch('hist-2024-6c', 'Cap domestic prices temporarily and pay refiners', 'Political prices.', 'political', 'riyadh', 'CAP', [fx('domestic_support', 2, 'Relief optics'), fx('market_stability', -1, 'Distortion'), fx('credibility', -1, 'Fiscal cost')]),
    ]),
    beat('hist-2024-7', 'Partner tripwire ask', 'A Gulf partner wants a public security declaration. Ambiguity reassures you; clarity reassures them.', 'Words create war obligations.', [
      ch('hist-2024-7a', 'Issue consultative defense language short of automatic war', 'Near-tripwire.', 'diplomatic', 'riyadh', 'CONSDEF', [fx('alliance_cohesion', 2, 'Partner steadied'), fx('deterrence', 1, 'Signal'), fx('escalation', 1, 'Commitment')]),
      ch('hist-2024-7b', 'Offer more capability transfers, refuse new declarations', 'Tools not vows.', 'diplomatic', 'base', 'CAPXFER', [fx('deterrence', 1, 'Partner teeth'), fx('alliance_cohesion', -1, 'Wanted words'), fx('time', 1, 'Flexibility')]),
      ch('hist-2024-7c', 'Propose a multilateral maritime charter instead', 'Institutionalize.', 'naval', 'oman', 'CHARTER', [fx('diplomacy', 2, 'Rules'), fx('alliance_cohesion', 1, 'Broad'), fx('credibility', 1, 'Order frame')]),
    ]),
    beat('hist-2024-8', 'Attribution fog', 'A deniable attack hits a commercial node. Your intel is good enough for action, not courtroom certainty.', 'Acting on 70% is the job—and the risk.', [
      ch('hist-2024-8a', 'Release a high-confidence attribution package', 'Public case.', 'diplomatic', 'base', 'PACKAGE3', [fx('credibility', 2, 'Evidence'), fx('escalation', 1, 'Confrontation'), fx('alliance_cohesion', 1, 'Shareable')]),
      ch('hist-2024-8b', 'Respond proportionally without full public case', 'Quiet cost.', 'kinetic', 'proxy', 'QUIETHIT', [fx('deterrence', 2, 'Private pain'), fx('credibility', -1, 'Opacity'), fx('escalation', 2, 'Ladder risk')]),
      ch('hist-2024-8c', 'Hold fire; demand a joint investigation mechanism', 'Process first.', 'diplomatic', 'tehran', 'JOINTINV', [fx('diplomacy', 2, 'Table'), fx('time', 2, 'Delay'), fx('deterrence', -1, 'Looks hesitant')]),
    ]),
    beat('hist-2024-9', 'Off-ramp window', 'A third capital floats a prisoners-and-sanctions sequencing deal if seizures stop for 14 days. Spoilers on all sides load magazines.', 'Fourteen days can be a century in the Gulf.', [
      ch('hist-2024-9a', 'Accept the 14-day quiet-for-talks test', 'Prove control.', 'diplomatic', 'oman', '14DAY', [fx('diplomacy', 3, 'Off-ramp'), fx('escalation', -2, 'Pause'), fx('time', 2, 'Clock')]),
      ch('hist-2024-9b', 'Demand irreversible verification before any sanctions relief talk', 'Hard sequence.', 'economic', 'dubai', 'VERIFY2', [fx('credibility', 1, 'Tough'), fx('diplomacy', -1, 'Harder deal'), fx('economic_pressure', 1, 'Leverage held')]),
      ch('hist-2024-9c', 'Keep talks but maintain escort pressure throughout', 'Talk and sail.', 'naval', 'strait', 'BOTH', [fx('deterrence', 1, 'Pressure'), fx('diplomacy', 1, 'Channel'), fx('escalation', 1, 'Dual track risk')]),
    ]),
    beat('hist-2024-10', 'Lane doctrine endgame', 'Cabinet wants standing rules: escort thresholds, SPR policy, and when kinetic replies are pre-authorized.', 'Doctrine reduces 3 a.m. invention.', [
      ch('hist-2024-10a', 'Codify multinational escort triggers and ROE libraries', 'Standing maritime order.', 'naval', 'hormuz', 'ROE3', [fx('deterrence', 2, 'Ready rules'), fx('alliance_cohesion', 2, 'Shareable'), fx('escalation', -1, 'Less improv')]),
      ch('hist-2024-10b', 'Keep decisions case-by-case at leader level', 'Flexibility.', 'political', 'tehran', 'CASE', [fx('time', 1, 'Agile'), fx('credibility', -1, 'Unpredictable'), fx('alliance_cohesion', -1, 'Partners guess')]),
      ch('hist-2024-10c', 'Prioritize energy transition and demand destruction tools', 'Reduce the lane’s leverage.', 'economic', 'oil', 'DEMAND', [fx('market_stability', 1, 'Long resilience'), fx('diplomacy', 1, 'Structural'), fx('deterrence', -1, 'Less force focus')]),
    ]),
  ],

  'hist-2025-coalition-aftershock': [
    beat('hist-2025-5', 'No-confidence shock', 'A procedural ambush appears within days of formation. Your majority is arithmetic, not affection.', 'Governing starts as survival.', [
      ch('hist-2025-5a', 'Cut a narrow confidence deal on procedure only', 'Survive the week.', 'political', 'parliament', 'CONF', [fx('governability', 2, 'Cabinet lives'), fx('credibility', -1, 'Horse-trade'), fx('time', 1, 'Oxygen')]),
      ch('hist-2025-5b', 'Call the bluff and dare early elections', 'Mandate reset.', 'civic', 'ballot', 'ELECT2', [fx('norm_protection', 1, 'Voters decide'), fx('governability', -2, 'Chaos risk'), fx('polarization', 2, 'Campaign mode')]),
      ch('hist-2025-5c', 'Invite a technocratic confidence-and-supply arrangement', 'Shrink politics.', 'political', 'capital', 'TECH2', [fx('governability', 1, 'Admin path'), fx('domestic_support', -1, 'Unloved'), fx('eu_cohesion', 1, 'Predictable')]),
    ]),
    beat('hist-2025-6', 'Street and platform pressure', 'Coordinated protests and online campaigns demand you break a firewall—or strengthen it. Institutions become content.', 'Platforms are a second parliament.', [
      ch('hist-2025-6a', 'Reaffirm democratic firewalls with legal clarity', 'Norms speech.', 'legal', 'streets', 'FIREWALL', [fx('norm_protection', 3, 'Distance held'), fx('polarization', 1, 'Hardliners rage'), fx('credibility', 2, 'Clear line')]),
      ch('hist-2025-6b', 'Open exploratory talks with soft-edge factions only', 'Grey zone.', 'political', 'parliament', 'SOFTEDGE', [fx('governability', 1, 'Votes'), fx('norm_erosion', 2, 'Window shifts'), fx('liberal_trust', -2, 'Partners flee')]),
      ch('hist-2025-6c', 'Counter-mobilize civic coalitions without state coercion', 'Society answers society.', 'civic', 'districts', 'CIVIC2', [fx('social_calm', 1, 'Counterweight'), fx('polarization', 1, 'Camp politics'), fx('norm_protection', 1, 'Pluralism')]),
    ]),
    beat('hist-2025-7', 'Brussels conditionality ask', 'EU partners hint that funds and tone depend on rule-of-law markers. Defiance plays well at home; compliance funds the state.', 'External anchors versus domestic brand.', [
      ch('hist-2025-7a', 'Comply on core rule-of-law benchmarks', 'Money and club.', 'diplomatic', 'brussels', 'COMPLY2', [fx('eu_cohesion', 3, 'Club held'), fx('governability', 1, 'Funds'), fx('domestic_support', -1, 'Sovereignty charge')]),
      ch('hist-2025-7b', 'Stage a controlled clash for domestic branding', 'Theater.', 'political', 'capital', 'CLASH', [fx('domestic_support', 2, 'Brand'), fx('eu_cohesion', -3, 'Fight'), fx('credibility', -1, 'Costly')]),
      ch('hist-2025-7c', 'Negotiate phased benchmarks with visible wins both ways', 'Two-level deal.', 'diplomatic', 'parliament', 'PHASE2', [fx('diplomacy', 2, 'Bargain'), fx('eu_cohesion', 1, 'Path'), fx('time', 1, 'Staging')]),
    ]),
    beat('hist-2025-8', 'Disinformation fog around the cabinet', 'Forged chats allege secret pacts. Corrections lag. Your communications doctrine is now security policy.', 'Legitimacy is an information service.', [
      ch('hist-2025-8a', 'Publish authenticated timelines and invite press scrutiny', 'Radical transparency.', 'civic', 'ballot', 'TRANSP', [fx('credibility', 3, 'Sunlight'), fx('polarization', -1, 'If it works'), fx('time', -1, 'Ops cost')]),
      ch('hist-2025-8b', 'Pursue rapid legal takedowns of forged material', 'Lawfare.', 'legal', 'streets', 'TAKEDOWN', [fx('social_calm', 1, 'Less spread'), fx('norm_erosion', 1, 'Speech fights'), fx('credibility', -1, 'Censor charge')]),
      ch('hist-2025-8c', 'Ignore forgeries; flood governing delivery stories', 'Change the subject.', 'political', 'districts', 'DELIVER', [fx('governability', 1, 'Output focus'), fx('credibility', -1, 'Unanswered lies'), fx('time', 1, 'Bandwidth')]),
    ]),
    beat('hist-2025-9', 'Budget off-ramp', 'A skinny budget can pass without normative collapse—or starve the state. A fat bargain may require the very partners you excluded.', 'Arithmetic returns as destiny.', [
      ch('hist-2025-9a', 'Pass a narrow confidence budget with firewall intact', 'Govern small.', 'political', 'parliament', 'SKINNY', [fx('governability', 2, 'Something passes'), fx('norm_protection', 2, 'Firewall held'), fx('eu_cohesion', 1, 'Predictable')]),
      ch('hist-2025-9b', 'Expand the majority with costly normative concessions', 'Buy votes.', 'political', 'capital', 'EXPAND', [fx('governability', 3, 'Wider majority'), fx('norm_erosion', 3, 'Price paid'), fx('liberal_trust', -3, 'Break')]),
      ch('hist-2025-9c', 'Run a caretaker spend-as-before and renegotiate in 90 days', 'Kick the can carefully.', 'economic', 'brussels', 'CARETAKE', [fx('time', 2, 'Delay fight'), fx('governability', -1, 'Weak'), fx('market_stability', -1, 'Uncertainty')]),
    ]),
    beat('hist-2025-10', 'Democratic endurance endgame', 'You write the week’s doctrine: how centrist cabinets survive without becoming what they exclude—or dying of purity.', 'Efficiency here is governability with norms intact.', [
      ch('hist-2025-10a', 'Institutionalize cross-party procedural pacts for crises', 'Process democracy.', 'legal', 'parliament', 'PACTS', [fx('norm_protection', 2, 'Rules'), fx('governability', 2, 'Stability'), fx('polarization', -1, 'Some buy-in')]),
      ch('hist-2025-10b', 'Accept permanent campaign mode as the real constitution', 'Mobilize forever.', 'civic', 'streets', 'CAMPAIGN', [fx('domestic_support', 1, 'Base energy'), fx('governability', -2, 'No bandwidth'), fx('polarization', 3, 'Total politics')]),
      ch('hist-2025-10c', 'Anchor legitimacy in EU and court rules when majorities fail', 'External scaffolding.', 'diplomatic', 'brussels', 'ANCHOR', [fx('eu_cohesion', 2, 'Anchor'), fx('credibility', 1, 'Rules'), fx('domestic_support', -1, 'Elite charge')]),
    ]),
  ],
};
