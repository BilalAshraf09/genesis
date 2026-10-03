/** Extra beats 5–10 — scenarios Anatolia through Korea. */
import { fx, ch, beat } from './hist-helpers.mjs';

/** @type {Record<string, ReturnType<typeof beat>[]>} */
export const extraBeatsPart2 = {
  'hist-1920-anatolia': [
    beat('hist-1920-5', 'Proxy clash at the zone edge', 'Irregulars and occupation patrols exchange fire near a disputed district. Your escorts can reinforce, mediate, or pull back to ports.', 'A local firefight can rewrite the mandate map.', [
      ch('hist-1920-5a', 'Reinforce escort corridors only', 'Protect lanes; avoid inland pursuit.', 'naval', 'escort', 'CORRIDOR', [fx('deterrence', 2, 'Lane security'), fx('escalation', 1, 'More force present'), fx('civilian_cost', -1, 'Trade safer')]),
      ch('hist-1920-5b', 'Convene an immediate local armistice board', 'Stop fire before maps harden.', 'diplomatic', 'port', 'ARMLOC', [fx('diplomacy', 2, 'Local table'), fx('time', 1, 'Pause fighting'), fx('credibility', 1, 'Honest broker')]),
      ch('hist-1920-5c', 'Authorize limited kinetic clearing of the edge', 'Restore zone lines by force.', 'kinetic', 'proxy', 'CLEAR', [fx('escalation', 3, 'War deepens'), fx('deterrence', 1, 'Lines enforced'), fx('civilian_cost', 2, 'Village harm')]),
    ]),
    beat('hist-1920-6', 'Home parliament revolt', 'Deputies call occupation a “bleeding adventure.” Budget hawks want ships home; minority advocates demand you stay.', 'Domestic consent is part of the theater.', [
      ch('hist-1920-6a', 'Table a time-bound mandate renewal vote', 'Ask for months, not forever.', 'political', 'canal', 'RENEW', [fx('domestic_support', 1, 'Democratic cover'), fx('time', 2, 'Defined horizon'), fx('alliance_cohesion', 1, 'Partners see clock')]),
      ch('hist-1920-6b', 'Cut inland posts; keep only coastal enforcement', 'Shrink footprint under fire.', 'naval', 'port', 'SHRINK', [fx('escalation', -1, 'Less exposure'), fx('civilian_cost', 1, 'Inland vacuum'), fx('credibility', -1, 'Looks like retreat')]),
      ch('hist-1920-6c', 'Ignore the chamber; govern by cabinet decree', 'Speed over consent.', 'political', 'chokepoint', 'DECREE', [fx('governability', 1, 'Fast decisions'), fx('norm_erosion', 2, 'Parliamentary bypass'), fx('polarization', 1, 'Street anger')]),
    ]),
    beat('hist-1920-7', 'Allied split on the straits', 'One ally wants internationalized straits with hard naval teeth; another wants commercial openness without occupation optics.', 'Alliance unity can break on a waterway.', [
      ch('hist-1920-7a', 'Broker a commercial-first straits statute', 'Transit rules over flags.', 'diplomatic', 'canal', 'STATUTE', [fx('market_stability', 2, 'Trade priority'), fx('alliance_cohesion', 1, 'Compromise text'), fx('deterrence', -1, 'Softer teeth')]),
      ch('hist-1920-7b', 'Back a standing international naval commission', 'Hard multilateral control.', 'naval', 'chokepoint', 'COMM', [fx('deterrence', 2, 'Enforcement body'), fx('alliance_cohesion', 1, 'Shared burden'), fx('escalation', 1, 'Permanent friction')]),
      ch('hist-1920-7c', 'Side with your senior ally’s maximal brief', 'Unity over refinement.', 'political', 'insurer', 'SIDE', [fx('alliance_cohesion', 2, 'Senior partner happy'), fx('diplomacy', -1, 'Others iced out'), fx('credibility', -1, 'Looks vassal')]),
    ]),
    beat('hist-1920-8', 'Atrocity claim fog', 'Competing wires allege massacres in different districts. Insurers halt coverage until a narrative settles.', 'Markets and morals both demand a map of truth.', [
      ch('hist-1920-8a', 'Deploy a mixed fact-finding mission', 'Slow, credible, incomplete.', 'diplomatic', 'port', 'FACT', [fx('credibility', 2, 'Process integrity'), fx('time', 1, 'Investigation lag'), fx('market_stability', 1, 'Insurers watch')]),
      ch('hist-1920-8b', 'Issue provisional sanctions on the accused party', 'Act on first reports.', 'economic', 'insurer', 'SANC', [fx('economic_pressure', 2, 'Punishment signal'), fx('credibility', -1, 'May be wrong'), fx('escalation', 1, 'Hardens camps')]),
      ch('hist-1920-8c', 'Quietly restore insurer backstops without judgment', 'Trade first; truth later.', 'economic', 'canal', 'BACKSTOP', [fx('market_stability', 2, 'Coverage returns'), fx('norm_erosion', 1, 'Justice deferred'), fx('civilian_cost', 1, 'Victims wait')]),
    ]),
    beat('hist-1920-9', 'Settlement conference window', 'Nationalists and occupation powers hint at a treaty revision if minority clauses and demobilization are sequenced carefully.', 'Sequencing is the bargain.', [
      ch('hist-1920-9a', 'Sequence demobilization before final borders', 'Guns down, then maps.', 'diplomatic', 'chokepoint', 'SEQ', [fx('diplomacy', 2, 'Workable order'), fx('escalation', -1, 'Force thins'), fx('time', 1, 'Staged clock')]),
      ch('hist-1920-9b', 'Insist on minority courts before any troop cut', 'Rights first.', 'legal', 'proxy', 'COURTS', [fx('norm_protection', 2, 'Protections first'), fx('diplomacy', -1, 'Harder deal'), fx('alliance_cohesion', 1, 'Moral coalition')]),
      ch('hist-1920-9c', 'Offer trade preferences as the sweetener', 'Commerce as glue.', 'economic', 'insurer', 'PREF', [fx('market_stability', 2, 'Economic buy-in'), fx('diplomacy', 1, 'Positive sum'), fx('credibility', -1, 'Looks transactional')]),
    ]),
    beat('hist-1920-10', 'Mandate endgame', 'Either you ratify a revised settlement and thin forces, or dig into indefinite occupation with rising costs.', 'Paper peace or permanent garrison.', [
      ch('hist-1920-10a', 'Ratify revision and announce phased withdrawal', 'Own the transition.', 'diplomatic', 'canal', 'PHASE', [fx('diplomacy', 2, 'Settlement locked'), fx('escalation', -2, 'Occupation shrinks'), fx('alliance_cohesion', 1, 'Shared exit')]),
      ch('hist-1920-10b', 'Hold coastal enclaves indefinitely', 'Keep cards and costs.', 'naval', 'port', 'ENCLAVE', [fx('deterrence', 2, 'Permanent leverage'), fx('escalation', 1, 'Chronic tension'), fx('civilian_cost', 1, 'Local resentment')]),
      ch('hist-1920-10c', 'Transfer responsibility to a League-like commission', 'Internationalize the problem.', 'legal', 'escort', 'XFER', [fx('credibility', 1, 'Institutional path'), fx('alliance_cohesion', 1, 'Burden shared'), fx('time', -1, 'Slow machinery')]),
    ]),
  ],

  'hist-1919-versailles': [
    beat('hist-1919-5', 'Reparations arithmetic shock', 'Experts produce incompatible totals. One path bankrupts the defeated; another looks like betrayal at home.', 'Numbers are politics with decimal points.', [
      ch('hist-1919-5a', 'Back a capacity-to-pay schedule with review clauses', 'Solvency over vengeance.', 'economic', 'brussels', 'CAPPAY', [fx('market_stability', 2, 'Payable path'), fx('diplomacy', 1, 'Workable peace'), fx('domestic_support', -2, 'Hawks furious')]),
      ch('hist-1919-5b', 'Insist on headline maximum with later “adjustments”', 'Optics now, realism later.', 'political', 'parliament', 'HEADLINE', [fx('domestic_support', 2, 'Victory framed'), fx('credibility', -1, 'Known fiction'), fx('market_stability', -1, 'Debt overhang')]),
      ch('hist-1919-5c', 'Park the number in a technical commission for six months', 'Buy time.', 'diplomatic', 'capital', 'PARK', [fx('time', 2, 'Delay fight'), fx('diplomacy', 1, 'Keeps talks'), fx('credibility', -1, 'Looks evasive')]),
    ]),
    beat('hist-1919-6', 'Street justice politics', 'Crowds demand hangings and hard borders. Your delegation’s soft clauses are burned in effigy.', 'Peace can die of applause.', [
      ch('hist-1919-6a', 'Defend legal process over spectacle punishment', 'Courts, not carnival.', 'legal', 'streets', 'PROCESS', [fx('norm_protection', 2, 'Legal peace'), fx('domestic_support', -2, 'Street rage'), fx('credibility', 1, 'Rule of law')]),
      ch('hist-1919-6b', 'Add symbolic war-crime trials to buy clause space', 'Trade symbolism for structure.', 'political', 'parliament', 'TRIALS', [fx('domestic_support', 1, 'Some catharsis'), fx('diplomacy', -1, 'Hardens losers'), fx('polarization', 1, 'Revenge politics')]),
      ch('hist-1919-6c', 'Refuse to campaign on the treaty until signature', 'Silence as strategy.', 'civic', 'districts', 'QUIET', [fx('time', 1, 'Less theater'), fx('domestic_support', -1, 'Vacuum'), fx('governability', 1, 'Cabinet focus')]),
    ]),
    beat('hist-1919-7', 'Ally’s security ask', 'A senior ally wants permanent occupation zones and automatic sanctions triggers. Another wants a leaner League.', 'Security architecture is the real treaty.', [
      ch('hist-1919-7a', 'Broker automatic economic sanctions, not occupation', 'Teeth without garrisons.', 'economic', 'brussels', 'AUTO', [fx('deterrence', 1, 'Costly violation'), fx('alliance_cohesion', 1, 'Compromise'), fx('market_stability', -1, 'Sanction risk premium')]),
      ch('hist-1919-7b', 'Accept limited occupation with a sunset clause', 'Time-bound enforcement.', 'political', 'capital', 'SUNSET', [fx('deterrence', 2, 'On-ground leverage'), fx('escalation', 1, 'Friction baked in'), fx('alliance_cohesion', 1, 'Ally satisfied')]),
      ch('hist-1919-7c', 'Push a thin covenant and bilateral side letters', 'Paper unity, private deals.', 'diplomatic', 'parliament', 'SIDE', [fx('diplomacy', 1, 'Flexibility'), fx('credibility', -1, 'Opaque peace'), fx('alliance_cohesion', -1, 'Uneven terms')]),
    ]),
    beat('hist-1919-8', 'Map commission leaks', 'Border sketches leak showing minorities stranded. Your press and theirs demand incompatible fixes.', 'Every line creates a future grievance.', [
      ch('hist-1919-8a', 'Mandate minority treaties with monitoring', 'Rights as border softener.', 'legal', 'brussels', 'MINOR', [fx('norm_protection', 2, 'Protections written'), fx('diplomacy', 1, 'Softer maps'), fx('time', -1, 'Complex drafting')]),
      ch('hist-1919-8b', 'Redraw for strategic railways even if populations suffer', 'Security topography first.', 'political', 'districts', 'RAIL', [fx('deterrence', 1, 'Strategic depth'), fx('civilian_cost', 2, 'Displaced communities'), fx('polarization', 1, 'Ethnic anger')]),
      ch('hist-1919-8c', 'Call a short expert re-hearing before ink', 'Slow the map.', 'diplomatic', 'capital', 'REHEAR', [fx('credibility', 1, 'Due process'), fx('time', 1, 'Revision window'), fx('alliance_cohesion', -1, 'Partners impatient')]),
    ]),
    beat('hist-1919-9', 'Signature off-ramp', 'The defeated hint they will sign under protest if reparations review and League entry paths are real. Hardliners want humiliation complete.', 'A signed bad peace versus an unsigned worse one.', [
      ch('hist-1919-9a', 'Offer review clauses and eventual League path', 'Dignity enough to sign.', 'diplomatic', 'brussels', 'PATH', [fx('diplomacy', 3, 'Signature likelier'), fx('domestic_support', -1, 'Softness charge'), fx('market_stability', 1, 'Certainty')]),
      ch('hist-1919-9b', 'Refuse revisions; demand unconditional signature', 'Dictate the peace.', 'political', 'parliament', 'DICTATE', [fx('credibility', 1, 'Hard line clear'), fx('diplomacy', -2, 'May refuse'), fx('escalation', 1, 'Future revision wars')]),
      ch('hist-1919-9c', 'Split: sign political clauses now, economics later', 'Two-stage treaty.', 'economic', 'capital', 'SPLIT', [fx('time', 2, 'Staged deal'), fx('market_stability', -1, 'Uncertainty'), fx('diplomacy', 1, 'Partial lock')]),
    ]),
    beat('hist-1919-10', 'Ratification endgame', 'Home legislatures threaten to gut the League articles. You must choose what to salvage.', 'The peace dies twice—at signature and at ratification.', [
      ch('hist-1919-10a', 'Defend the covenant as a package', 'All or renegotiate.', 'political', 'parliament', 'PACKAGE', [fx('norm_protection', 2, 'Institution intact'), fx('governability', -1, 'Legislative fight'), fx('alliance_cohesion', 1, 'Internationalists cheer')]),
      ch('hist-1919-10b', 'Accept reservations to secure a majority', 'Imperfect membership.', 'legal', 'ballot', 'RESERVE', [fx('governability', 2, 'Votes secured'), fx('credibility', -1, 'Hollowed pledge'), fx('alliance_cohesion', -1, 'Partners wary')]),
      ch('hist-1919-10c', 'Let the League fail at home; keep bilateral enforcement', 'Old diplomacy returns.', 'diplomatic', 'capital', 'BILAT', [fx('diplomacy', -1, 'Weaker order'), fx('deterrence', 1, 'Bilateral teeth'), fx('eu_cohesion', -1, 'Multilateral loss')]),
    ]),
  ],

  'hist-1929-black-thursday': [
    beat('hist-1929-5', 'Correspondent bank freeze', 'Interior banks lose New York lines. A regional collapse could cascade into payroll failures by Friday.', 'Plumbing failure becomes social crisis.', [
      ch('hist-1929-5a', 'Authorize targeted liquidity via clearing houses', 'Backstop the pipes.', 'economic', 'fed', 'LIQ', [fx('market_stability', 3, 'Pipes reopen'), fx('credibility', 1, 'Adult supervision'), fx('economic_pressure', -1, 'Moral hazard murmur')]),
      ch('hist-1929-5b', 'Force mergers of weak banks overnight', 'Concentrate to survive.', 'economic', 'desk', 'MERGE', [fx('market_stability', 1, 'Fewer failures'), fx('polarization', 1, 'Anti-trust anger'), fx('credibility', -1, 'Crony optics')]),
      ch('hist-1929-5c', 'Let market discipline cull insolvent names', 'Purge the rot.', 'economic', 'exchange', 'CULL', [fx('credibility', 1, 'Hard money orthodoxy'), fx('market_stability', -3, 'Cascade risk'), fx('civilian_cost', 2, 'Deposit panic')]),
    ]),
    beat('hist-1929-6', 'Street bread politics', 'Unemployed marches hit downtown. Governors ask whether relief is federal, local, or “private charity.”', 'Legitimacy follows the soup line.', [
      ch('hist-1929-6a', 'Stand up emergency federal work relief pilots', 'Buy social calm with payrolls.', 'political', 'treasury', 'WORK', [fx('social_calm', 2, 'Visible relief'), fx('market_stability', 1, 'Demand floor'), fx('credibility', -1, 'Orthodoxy shocked')]),
      ch('hist-1929-6b', 'Push charity coordination and local bonds only', 'Keep federal hands clean.', 'civic', 'em', 'CHARITY', [fx('credibility', 1, 'Orthodox virtue'), fx('civilian_cost', 2, 'Gaps widen'), fx('polarization', 1, 'Class anger')]),
      ch('hist-1929-6c', 'Criminalize disruptive assembly near exchanges', 'Order first.', 'legal', 'exchange', 'ORDER', [fx('social_calm', 1, 'Short-term quiet'), fx('norm_erosion', 2, 'Protest chill'), fx('polarization', 2, 'Martyrs made')]),
    ]),
    beat('hist-1929-7', 'London coordination ask', 'Sterling desks want a joint rate defense. Going alone may save gold parity—or burn reserves uselessly.', 'Cross-Atlantic coordination is scarce and precious.', [
      ch('hist-1929-7a', 'Join a coordinated rate-defense pool', 'Share gold and messaging.', 'diplomatic', 'fed', 'POOL', [fx('alliance_cohesion', 2, 'Transatlantic glue'), fx('market_stability', 2, 'Parity defense'), fx('time', 1, 'Buys weeks')]),
      ch('hist-1929-7b', 'Defend your parity alone; refuse gold swaps', 'Sovereignty of the reserve.', 'economic', 'treasury', 'ALONE', [fx('credibility', 1, 'Independent stance'), fx('market_stability', -1, 'Heavier burden'), fx('alliance_cohesion', -2, 'London cold')]),
      ch('hist-1929-7c', 'Signal willingness to reconsider gold orthodoxy', 'Prepare mental off-ramp.', 'political', 'desk', 'REGOLD', [fx('diplomacy', 1, 'New conversation'), fx('market_stability', -2, 'Parity scare'), fx('time', 2, 'Option opened')]),
    ]),
    beat('hist-1929-8', 'Rumor of treasury insolvency', 'A forged memo claims the treasury cannot meet coupon payments. Desks price a sovereign scare in minutes.', 'False insolvency can become real if unanswered.', [
      ch('hist-1929-8a', 'Publish audited cash and coupon schedules immediately', 'Kill the forge with math.', 'economic', 'treasury', 'AUDIT', [fx('credibility', 3, 'Numbers public'), fx('market_stability', 2, 'Scare fades'), fx('time', -1, 'Ops scramble')]),
      ch('hist-1929-8b', 'Quietly buy the dip via intermediaries', 'Stabilize without admitting fear.', 'economic', 'desk', 'DIP', [fx('market_stability', 1, 'Tape supported'), fx('credibility', -1, 'Opacity'), fx('norm_erosion', 1, 'Hidden intervention')]),
      ch('hist-1929-8c', 'Launch a leak investigation and punish desks', 'Politics of blame.', 'legal', 'exchange', 'PROBE', [fx('polarization', 1, 'Witch-hunt risk'), fx('credibility', 1, 'Accountability show'), fx('market_stability', -1, 'Distraction')]),
    ]),
    beat('hist-1929-9', 'Tariff off-ramp debate', 'A protectionist bill could “save jobs” or strangulate recovery. You have one hearing cycle to shape it.', 'Trade policy can deepen a financial crisis into a depression.', [
      ch('hist-1929-9a', 'Lobby for narrow, temporary safeguards only', 'Limit the damage.', 'political', 'treasury', 'NARROW', [fx('market_stability', 1, 'Less shock'), fx('diplomacy', 1, 'Partners less angry'), fx('domestic_support', -1, 'Lobbyists mad')]),
      ch('hist-1929-9b', 'Embrace broad tariffs as demand for home industry', 'Politics over models.', 'political', 'em', 'TARIFF', [fx('domestic_support', 2, 'Jobs frame'), fx('market_stability', -2, 'Trade war risk'), fx('alliance_cohesion', -2, 'Retaliation')]),
      ch('hist-1929-9c', 'Tie tariff restraint to reciprocal purchasing agreements', 'Deals not walls.', 'diplomatic', 'fed', 'RECIP', [fx('diplomacy', 2, 'Bargains open'), fx('market_stability', 1, 'Trade paths'), fx('time', -1, 'Negotiation lag')]),
    ]),
    beat('hist-1929-10', 'Doctrine endgame', 'Cabinet asks whether this was a liquidity spasm or a solvency era requiring a new macro doctrine.', 'The diagnosis becomes the next decade.', [
      ch('hist-1929-10a', 'Declare a liquidity doctrine with standing facilities', 'Permanent backstops.', 'economic', 'fed', 'DOCTRINE', [fx('market_stability', 2, 'Institutional calm'), fx('credibility', 1, 'Learned lesson'), fx('economic_pressure', -1, 'Moral hazard')]),
      ch('hist-1929-10b', 'Reassert austerity-and-gold as credibility core', 'Orthodoxy restored.', 'economic', 'treasury', 'AUSTER', [fx('credibility', 1, 'Hard line'), fx('civilian_cost', 2, 'Social pain'), fx('social_calm', -2, 'Unrest risk')]),
      ch('hist-1929-10c', 'Launch a bipartisan commission before locking doctrine', 'Study then choose.', 'political', 'desk', 'COMMISH', [fx('time', 2, 'Deliberation'), fx('governability', 1, 'Shared ownership'), fx('market_stability', -1, 'Policy fog')]),
    ]),
  ],

  'hist-1931-mukden': [
    beat('hist-1931-5', 'Railway sabotage fog', 'Competing claims about who blew the track arrive within hours. Your League brief needs a factual spine or it becomes theater.', 'Fog favors the side that moves troops.', [
      ch('hist-1931-5a', 'Demand an immediate international inquiry team', 'Facts before resolutions.', 'diplomatic', 'cable', 'INQ', [fx('credibility', 2, 'Process first'), fx('time', 1, 'Investigation'), fx('escalation', -1, 'Slows narrative war')]),
      ch('hist-1931-5b', 'Accept the stronger power’s provisional account', 'Keep great-power peace.', 'political', 'capital_a', 'ACCEPT', [fx('alliance_cohesion', -1, 'Weaker party betrayed'), fx('escalation', -1, 'Less clash now'), fx('credibility', -2, 'Collective security hollow')]),
      ch('hist-1931-5c', 'Publish your own intelligence assessment unilaterally', 'Own a map.', 'diplomatic', 'capital_b', 'UNILAT', [fx('credibility', 1, 'Independent voice'), fx('diplomacy', -1, 'Angers someone'), fx('time', -1, 'Exposure risk')]),
    ]),
    beat('hist-1931-6', 'Domestic isolationist surge', 'Voters ask why Asian rails matter. Funding a League response looks like foreign adventurism.', 'Collective security dies at the ballot if unexplained.', [
      ch('hist-1931-6a', 'Frame Manchuria as a precedent for everyone’s borders', 'Principle over distance.', 'political', 'capital_a', 'PRECED', [fx('credibility', 2, 'Norm defense'), fx('domestic_support', -1, 'Hard sell'), fx('alliance_cohesion', 1, 'Small states cheer')]),
      ch('hist-1931-6b', 'Limit response to trade measures without force talk', 'Cheap signal.', 'economic', 'strait', 'TRADE', [fx('economic_pressure', 1, 'Mild cost'), fx('domestic_support', 1, 'No body bags'), fx('deterrence', -1, 'Weak teeth')]),
      ch('hist-1931-6c', 'Stay quiet and let the League secretariat speak', 'Hide behind the institution.', 'diplomatic', 'cable', 'HIDE', [fx('time', 1, 'Less heat'), fx('credibility', -1, 'Leadership vacuum'), fx('diplomacy', 1, 'Institutional path')]),
    ]),
    beat('hist-1931-7', 'China’s enforcement ask', 'Nanjing wants arms, loans, and a naval demonstration. Anything kinetic risks a wider war; anything soft looks like abandonment.', 'Helping without owning the war.', [
      ch('hist-1931-7a', 'Offer credits and medical aid, not weapons', 'Support without spark.', 'economic', 'island', 'AID', [fx('alliance_cohesion', 1, 'Partner helped'), fx('escalation', -1, 'Less kinetic'), fx('civilian_cost', -1, 'Relief')]),
      ch('hist-1931-7b', 'Authorize a limited naval observation near ports', 'Presence without blockade.', 'naval', 'fleet', 'OBS', [fx('deterrence', 1, 'Visible interest'), fx('escalation', 1, 'Incident risk'), fx('alliance_cohesion', 1, 'Reassurance')]),
      ch('hist-1931-7c', 'Quietly approve arms via third parties', 'Plausible distance.', 'kinetic', 'capital_b', 'ARMS', [fx('deterrence', 2, 'Hard help'), fx('escalation', 2, 'War fuel'), fx('credibility', -1, 'Covert stain')]),
    ]),
    beat('hist-1931-8', 'Cable censorship claims', 'Each side alleges the other is forging League telegrams. Your own cipher clerks report anomalies.', 'Institutions collapse when messages cannot be trusted.', [
      ch('hist-1931-8a', 'Impose dual-key verification on League traffic', 'Slow but authentic.', 'diplomatic', 'cable', 'DUALKEY', [fx('credibility', 2, 'Trusted pipes'), fx('time', -1, 'Friction'), fx('diplomacy', 1, 'Process repair')]),
      ch('hist-1931-8b', 'Call out the alleged forger publicly', 'Name and shame.', 'political', 'capital_a', 'SHAME', [fx('escalation', 1, 'Diplomatic fight'), fx('credibility', 1, 'Clarity attempt'), fx('alliance_cohesion', -1, 'Splits assembly')]),
      ch('hist-1931-8c', 'Fall back to courier diplomacy for critical notes', 'Pre-modern reliability.', 'diplomatic', 'island', 'COURIER', [fx('time', -2, 'Slow'), fx('credibility', 1, 'Harder to forge'), fx('diplomacy', 1, 'Channel survives')]),
    ]),
    beat('hist-1931-9', 'Assembly off-ramp', 'A draft resolution offers non-recognition of conquests plus a negotiation commission—if great powers do not veto by inaction.', 'Paper can still matter if capitals mean it.', [
      ch('hist-1931-9a', 'Champion non-recognition as the core norm', 'Stimson logic.', 'legal', 'capital_b', 'NONREC', [fx('norm_protection', 3, 'Conquest denied'), fx('diplomacy', 1, 'Moral coalition'), fx('deterrence', -1, 'No force behind')]),
      ch('hist-1931-9b', 'Water down to a fact-finding-only text', 'Keep everyone in the room.', 'diplomatic', 'cable', 'WATER', [fx('alliance_cohesion', 1, 'Broader yes'), fx('credibility', -2, 'Toothless'), fx('time', 1, 'Process continues')]),
      ch('hist-1931-9c', 'Add a sanctions timetable with triggers', 'Give paper teeth.', 'economic', 'strait', 'TRIG', [fx('economic_pressure', 2, 'Costly defiance'), fx('escalation', 1, 'Confrontation'), fx('market_stability', -1, 'Trade nerves')]),
    ]),
    beat('hist-1931-10', 'Collective security endgame', 'Either the League draws a line that capitals will fund, or Manchuria becomes the template for the next seizure.', 'Precedent is the strategic good.', [
      ch('hist-1931-10a', 'Fund a standing League observation budget', 'Pay for the norm.', 'economic', 'fleet', 'FUND', [fx('credibility', 2, 'Institution lives'), fx('alliance_cohesion', 1, 'Shared cost'), fx('domestic_support', -1, 'Spending fight')]),
      ch('hist-1931-10b', 'Declare Asian crises outside your security perimeter', 'Retreat to core.', 'political', 'capital_a', 'PERIM', [fx('escalation', -1, 'Less exposure'), fx('credibility', -3, 'Order hollow'), fx('alliance_cohesion', -2, 'Small states flee')]),
      ch('hist-1931-10c', 'Pivot to a regional consultative pact outside the League', 'New architecture.', 'diplomatic', 'island', 'PACT', [fx('diplomacy', 1, 'Alternate forum'), fx('alliance_cohesion', 1, 'Regional glue'), fx('norm_erosion', 1, 'League bypassed')]),
    ]),
  ],

  'hist-1938-munich': [
    beat('hist-1938-5', 'Partial mobilization shock', 'Neighboring staffs begin masked moves. Your own readiness gap is public knowledge; delay looks like exposure, speed looks like warmongering.', 'Readiness is a diplomatic message.', [
      ch('hist-1938-5a', 'Quietly fill readiness gaps without proclamation', 'Prepare without panic.', 'kinetic', 'districts', 'QUIETR', [fx('deterrence', 2, 'Hidden teeth'), fx('escalation', 1, 'Adversary notices'), fx('domestic_support', -1, 'If leaked, scare')]),
      ch('hist-1938-5b', 'Public partial mobilization to signal resolve', 'Make the cost visible.', 'political', 'parliament', 'PARTMOB', [fx('deterrence', 2, 'Public resolve'), fx('escalation', 2, 'Crisis heats'), fx('market_stability', -1, 'Nerves')]),
      ch('hist-1938-5c', 'Propose mutual demobilization as a conference precondition', 'Talks first.', 'diplomatic', 'brussels', 'DEMOB', [fx('diplomacy', 2, 'De-escalatory ask'), fx('deterrence', -1, 'Exposure risk'), fx('time', 1, 'Window')]),
    ]),
    beat('hist-1938-6', 'Parliamentary war scare', 'Opposition calls any concession treason; another faction calls rearmament bankruptcy. Your majority is soft.', 'Home politics can veto strategy.', [
      ch('hist-1938-6a', 'Seek a cross-party national government for the crisis', 'Share ownership.', 'political', 'parliament', 'NATGOV', [fx('governability', 2, 'Broader mandate'), fx('domestic_support', 1, 'Unity optics'), fx('time', -1, 'Bargaining delay')]),
      ch('hist-1938-6b', 'Campaign on peace-with-honor language', 'Own the Munich frame early.', 'civic', 'ballot', 'PEACE', [fx('domestic_support', 2, 'Peace brand'), fx('credibility', -1, 'May look weak abroad'), fx('diplomacy', 1, 'Room to deal')]),
      ch('hist-1938-6c', 'Leak readiness shortfalls to force a rearmament vote', 'Scare the chamber into funds.', 'political', 'streets', 'LEAK', [fx('deterrence', 1, 'Money for force'), fx('credibility', -2, 'Self-exposure'), fx('polarization', 1, 'Panic politics')]),
    ]),
    beat('hist-1938-7', 'Ally’s guarantee ask', 'A threatened democracy wants a public tripwire. Granting it may deter—or drag you into a fight you cannot yet win.', 'Guarantees are mortgages on future force.', [
      ch('hist-1938-7a', 'Issue a conditional guarantee tied to League/conference process', 'Tripwire with diplomacy.', 'diplomatic', 'brussels', 'CONDG', [fx('alliance_cohesion', 2, 'Partner held'), fx('deterrence', 1, 'Clearer line'), fx('escalation', 1, 'Commitment risk')]),
      ch('hist-1938-7b', 'Offer staff talks and munitions, not a public guarantee', 'Help without the word.', 'kinetic', 'capital', 'STAFF', [fx('alliance_cohesion', 1, 'Practical help'), fx('deterrence', 1, 'Quiet teeth'), fx('credibility', -1, 'Ambiguous')]),
      ch('hist-1938-7c', 'Refuse new guarantees until rearmament milestones hit', 'Capability first.', 'political', 'parliament', 'MILE', [fx('time', 1, 'Sequenced'), fx('alliance_cohesion', -2, 'Partner exposed'), fx('credibility', 1, 'Honest limits')]),
    ]),
    beat('hist-1938-8', 'Sudeten information fog', 'Atrocity stories and denial cables arrive together. Your conference brief depends on which map of suffering you believe.', 'Bad facts make permanent borders.', [
      ch('hist-1938-8a', 'Require consular spot-checks before map talks', 'Verify first.', 'diplomatic', 'capital', 'SPOT', [fx('credibility', 2, 'Evidence-based'), fx('time', 1, 'Slower deal'), fx('diplomacy', 1, 'Fair process')]),
      ch('hist-1938-8b', 'Accept the stronger power’s dossier to keep talks alive', 'Peace over precision.', 'political', 'brussels', 'DOSSIER', [fx('diplomacy', 1, 'Talks continue'), fx('credibility', -2, 'Captive narrative'), fx('alliance_cohesion', -1, 'Victim state bitter')]),
      ch('hist-1938-8c', 'Flood your press with chosen victim narratives', 'Shape home consent.', 'civic', 'streets', 'NARR', [fx('domestic_support', 2, 'Mobilized public'), fx('polarization', 1, 'Harder compromise'), fx('diplomacy', -1, 'Less flexibility')]),
    ]),
    beat('hist-1938-9', 'Conference off-ramp', 'A formula trades border revision for international guarantees and demobilization. Critics call it surrender; supporters call it time bought.', 'Buying time only works if you spend it on strength.', [
      ch('hist-1938-9a', 'Accept the formula and announce a rearmament surge', 'Peace now, power later.', 'political', 'parliament', 'BUYTIME', [fx('diplomacy', 2, 'War deferred'), fx('deterrence', 1, 'Rearm starts'), fx('credibility', -1, 'Appease charge')]),
      ch('hist-1938-9b', 'Reject and threaten war unless status quo restored', 'Line in the sand.', 'kinetic', 'districts', 'LINE', [fx('deterrence', 2, 'Hard clear'), fx('escalation', 3, 'War risk spikes'), fx('alliance_cohesion', 1, 'Some cheer resolve')]),
      ch('hist-1938-9c', 'Accept borders but refuse to guarantee them yourself', 'Revision without your tripwire.', 'diplomatic', 'brussels', 'NOG', [fx('escalation', -1, 'Less commitment'), fx('alliance_cohesion', -2, 'Hollow deal'), fx('diplomacy', 1, 'Partial bargain')]),
    ]),
    beat('hist-1938-10', 'Homecoming endgame', 'You return to crowds that will make your words lasting doctrine. Understatement, triumph, or warning will define the next year.', 'Rhetoric after Munich is strategy.', [
      ch('hist-1938-10a', 'Deliver a sober “time to rearm” speech', 'No triumphalism.', 'civic', 'streets', 'REARM', [fx('deterrence', 2, 'Public program'), fx('domestic_support', 1, 'Serious tone'), fx('diplomacy', -1, 'Adversary warned')]),
      ch('hist-1938-10b', 'Claim “peace for our time” to lock political capital', 'Spend the cheer.', 'political', 'ballot', 'PEACE4', [fx('domestic_support', 3, 'Mass relief'), fx('credibility', -2, 'Brittle claim'), fx('deterrence', -1, 'Complacency')]),
      ch('hist-1938-10c', 'Warn that the settlement is temporary and fragile', 'Refuse false comfort.', 'political', 'parliament', 'FRAGILE', [fx('credibility', 2, 'Honest framing'), fx('domestic_support', -1, 'Anxiety'), fx('alliance_cohesion', 1, 'Partners prepare')]),
    ]),
  ],

  'hist-1939-corridor': [
    beat('hist-1939-5', 'False-flag fog at the border', 'Incidents multiply; attribution is murky. Your guarantee clock starts whether facts are clean or not.', 'Ambiguous sparks still burn treaties.', [
      ch('hist-1939-5a', 'Require dual confirmation before invoking the guarantee', 'Protect against traps.', 'diplomatic', 'capital', 'DUALCF', [fx('time', 1, 'Verification'), fx('credibility', 1, 'Careful ally'), fx('alliance_cohesion', -1, 'Guaranteed state nervous')]),
      ch('hist-1939-5b', 'Treat armed cross-border fire as casus enough', 'Speed over certainty.', 'kinetic', 'districts', 'CASUS', [fx('deterrence', 2, 'Tripwire live'), fx('escalation', 3, 'War nearer'), fx('diplomacy', -1, 'Talks die')]),
      ch('hist-1939-5c', 'Propose an immediate neutral observer corridor', 'Internationalize the spark.', 'diplomatic', 'brussels', 'OBSCOR', [fx('diplomacy', 2, 'Process'), fx('escalation', -1, 'Cooling'), fx('time', -1, 'Hard to deploy')]),
    ]),
    beat('hist-1939-6', 'Evacuation and morale politics', 'Cities ask about shelters and children. Panic can empty factories you need for deterrence.', 'Civil defense is strategic messaging.', [
      ch('hist-1939-6a', 'Order limited priority evacuations and shelter drills', 'Prepare without full flight.', 'civic', 'streets', 'DRILL', [fx('civilian_cost', -1, 'Some protection'), fx('domestic_support', 1, 'Seen as caring'), fx('market_stability', -1, 'Disruption')]),
      ch('hist-1939-6b', 'Keep calm messaging; postpone mass movement', 'Avoid looking like war is certain.', 'political', 'ballot', 'CALM', [fx('social_calm', 1, 'Less panic'), fx('credibility', -1, 'If bombs fall'), fx('time', 1, 'Normalcy bias')]),
      ch('hist-1939-6c', 'Nationalize key transport for military priority', 'Logistics first.', 'political', 'districts', 'NATL', [fx('deterrence', 1, 'Mobilization aid'), fx('polarization', 1, 'Civil friction'), fx('market_stability', -1, 'Commerce hit')]),
    ]),
    beat('hist-1939-7', 'Neutral commerce squeeze', 'Neutrals want trade assurances; your navy wants contraband lists. Too soft funds the adversary; too hard makes new enemies.', 'Blockade law is coalition politics.', [
      ch('hist-1939-7a', 'Publish a narrow contraband list with prize courts', 'Lawful pressure.', 'legal', 'brussels', 'PRIZE', [fx('economic_pressure', 2, 'Legal squeeze'), fx('credibility', 1, 'Rule-bound'), fx('alliance_cohesion', 1, 'Neutrals less angry')]),
      ch('hist-1939-7b', 'Impose a broad embargo and dare challenges', 'Maximal denial.', 'naval', 'capital', 'EMBARGO', [fx('economic_pressure', 3, 'Hard denial'), fx('escalation', 2, 'Incident risk'), fx('alliance_cohesion', -1, 'Neutral fury')]),
      ch('hist-1939-7c', 'Exempt food and medicine explicitly', 'Humanitarian carve-out.', 'diplomatic', 'parliament', 'HUM', [fx('civilian_cost', -2, 'Less hunger weapon'), fx('economic_pressure', -1, 'Weaker squeeze'), fx('credibility', 1, 'Moral signal')]),
    ]),
    beat('hist-1939-8', 'Intelligence contradiction', 'One service says invasion is days away; another says coercion theater. Your force generation depends on the call.', 'Wrong clocks waste armies or lose countries.', [
      ch('hist-1939-8a', 'Split the difference: elevate alert, hold declaration', 'Ready without irrevocable words.', 'kinetic', 'capital', 'ALERT', [fx('deterrence', 2, 'Ready posture'), fx('time', 1, 'Declaration delayed'), fx('escalation', 1, 'Higher readiness')]),
      ch('hist-1939-8b', 'Side with the early-invasion estimate', 'Assume worst.', 'kinetic', 'districts', 'WORST2', [fx('deterrence', 2, 'Max prep'), fx('escalation', 2, 'War footing'), fx('market_stability', -2, 'Panic')]),
      ch('hist-1939-8c', 'Demand a joint intelligence estimate before action', 'Force a single brief.', 'diplomatic', 'brussels', 'JIE', [fx('credibility', 1, 'Unified picture'), fx('time', -1, 'Coordination tax'), fx('diplomacy', 1, 'Shared facts')]),
    ]),
    beat('hist-1939-9', 'Last bargaining window', 'A last proposal trades corridor access regimes for demobilization and talks. Hardliners call it a second Munich.', 'Naming the lesson of Munich can close the window that lesson was meant to buy.', [
      ch('hist-1939-9a', 'Explore access regimes under international board', 'Technocratic off-ramp.', 'diplomatic', 'brussels', 'ACCESS', [fx('diplomacy', 2, 'Last talk'), fx('escalation', -1, 'Cooling chance'), fx('domestic_support', -1, 'Appease fear')]),
      ch('hist-1939-9b', 'Refuse any territorial discussion under threat', 'No negotiation at gunpoint.', 'political', 'parliament', 'NOGUN', [fx('credibility', 2, 'Anti-ultimatum norm'), fx('escalation', 1, 'Less deal space'), fx('alliance_cohesion', 1, 'Guaranteed state steadied')]),
      ch('hist-1939-9c', 'Accept talks only after partial demobilization verified', 'Sequence safety.', 'diplomatic', 'capital', 'VERIF', [fx('diplomacy', 1, 'Conditional table'), fx('time', 1, 'Verification'), fx('deterrence', 1, 'Safety first')]),
    ]),
    beat('hist-1939-10', 'Guarantee endgame', 'Invasion reports arrive. You must recommend war declaration timing, limited aid, or a pause for one more note.', 'The guarantee’s value is proven or spent tonight.', [
      ch('hist-1939-10a', 'Recommend immediate war declaration with allies', 'Honor the tripwire.', 'political', 'parliament', 'DECLARE', [fx('alliance_cohesion', 3, 'Guarantee kept'), fx('escalation', 3, 'General war'), fx('credibility', 2, 'Word is bond')]),
      ch('hist-1939-10b', 'Send an ultimatum with a short clock before declaring', 'One last note.', 'diplomatic', 'brussels', 'ULTIM', [fx('diplomacy', 1, 'Formal last step'), fx('time', -1, 'Hours only'), fx('escalation', 2, 'War likely')]),
      ch('hist-1939-10c', 'Lead with material aid and delay declaration', 'Help without full war yet.', 'kinetic', 'districts', 'AIDONLY', [fx('alliance_cohesion', -2, 'Ally feels alone'), fx('escalation', 1, 'Limited war risk'), fx('credibility', -2, 'Guarantee doubted')]),
    ]),
  ],

  'hist-1941-pacific-entry': [
    beat('hist-1941-5', 'Embargo leakage shock', 'Third-party tankers and shell companies blunt your oil squeeze. Enforcement means confronting neutrals—or admitting the tool is dull.', 'Sanctions fail quietly before they fail loudly.', [
      ch('hist-1941-5a', 'Tighten end-use enforcement with neutral registries', 'Close the leaks.', 'economic', 'cable', 'LEAK', [fx('economic_pressure', 2, 'Squeeze restores'), fx('alliance_cohesion', -1, 'Neutral anger'), fx('escalation', 1, 'Confrontation')]),
      ch('hist-1941-5b', 'Offer a staged oil tranche for verified talks', 'Conditionality with a carrot.', 'diplomatic', 'capital_a', 'TRANCHE', [fx('diplomacy', 2, 'Bargain fuel'), fx('economic_pressure', -1, 'Relief offered'), fx('time', 1, 'Talks window')]),
      ch('hist-1941-5c', 'Ignore leakage; escalate naval presence instead', 'Guns over customs.', 'naval', 'fleet', 'PRESENCE', [fx('deterrence', 2, 'Hard signal'), fx('escalation', 2, 'Incident risk'), fx('market_stability', -1, 'Insurance up')]),
    ]),
    beat('hist-1941-6', 'Domestic Asia-first politics', 'Public opinion splits between Europe-first and Pacific revenge narratives. Your brief must pick a sequencing story.', 'Strategy without a home story dies in hearings.', [
      ch('hist-1941-6a', 'Argue Germany-first with Pacific holding actions', 'Sequence the wars.', 'political', 'capital_b', 'SEQWAR', [fx('alliance_cohesion', 2, 'Atlantic partners glad'), fx('domestic_support', -1, 'Pacific hawks mad'), fx('credibility', 1, 'Clear strategy')]),
      ch('hist-1941-6b', 'Elevate Pacific as co-equal theater immediately', 'Two-ocean politics.', 'political', 'capital_a', '2OCEAN', [fx('domestic_support', 2, 'Matches anger'), fx('alliance_cohesion', -1, 'Europe worried'), fx('deterrence', 1, 'Pacific focus')]),
      ch('hist-1941-6c', 'Keep strategy classified; sell only unity themes', 'Ambiguity at home.', 'civic', 'island', 'UNITY', [fx('social_calm', 1, 'Less faction'), fx('credibility', -1, 'Opaque aims'), fx('time', 1, 'Flexibility')]),
    ]),
    beat('hist-1941-7', 'Ally’s basing ask', 'A partner wants emergency basing and shared codebreaking. Help deepens entanglement; refusal leaves you blind.', 'Intelligence sharing is alliance glue and risk.', [
      ch('hist-1941-7a', 'Grant temporary basing with status-of-forces rules', 'Legalized presence.', 'naval', 'island', 'BASE', [fx('alliance_cohesion', 2, 'Partner held'), fx('deterrence', 2, 'Forward posture'), fx('escalation', 1, 'Target value up')]),
      ch('hist-1941-7b', 'Share warning product only, no basing', 'Eyes without footprint.', 'diplomatic', 'cable', 'WARN', [fx('alliance_cohesion', 1, 'Useful help'), fx('deterrence', 1, 'Better awareness'), fx('time', 1, 'Less lock-in')]),
      ch('hist-1941-7c', 'Refuse until a formal treaty is ratified', 'Politics before ops.', 'legal', 'capital_b', 'TREATY', [fx('norm_protection', 1, 'Constitutional care'), fx('alliance_cohesion', -2, 'Delay hurts'), fx('time', -1, 'Slow')]),
    ]),
    beat('hist-1941-8', 'Indicator contradiction', 'Signals suggest both a southern resource grab and a northern feint. Your fleet dispositions cannot cover every theory.', 'Wrong deployment is a strategic gift.', [
      ch('hist-1941-8a', 'Weight dispositions to the southern resource axis', 'Protect the oil logic.', 'naval', 'strait', 'SOUTH', [fx('deterrence', 1, 'Covers likely path'), fx('escalation', 1, 'Concentrated risk'), fx('credibility', 1, 'Clear priority')]),
      ch('hist-1941-8b', 'Keep a balanced but thinner screen everywhere', 'Avoid a single wrong bet.', 'naval', 'fleet', 'BALANCE', [fx('deterrence', 1, 'Presence wide'), fx('time', 1, 'Flexibility'), fx('escalation', -1, 'Less mass anywhere')]),
      ch('hist-1941-8c', 'Demand a red-team brief before moving capital ships', 'Challenge consensus.', 'diplomatic', 'capital_a', 'REDTEAM', [fx('credibility', 1, 'Better judgment'), fx('time', -1, 'Decision lag'), fx('diplomacy', 1, 'Process rigor')]),
    ]),
    beat('hist-1941-9', 'Negotiation last window', 'A final note exchange could delay conflict—or be used as cover for a first strike. Trust is nearly gone.', 'Talks under suspicion still change clocks.', [
      ch('hist-1941-9a', 'Keep negotiators in place with a short clock', 'Talk while watching.', 'diplomatic', 'capital_b', 'CLOCK', [fx('diplomacy', 2, 'Channel open'), fx('time', 1, 'Days bought'), fx('credibility', -1, 'May be played')]),
      ch('hist-1941-9b', 'Suspend talks until verifiable force freezes', 'Verification first.', 'diplomatic', 'cable', 'FREEZE2', [fx('deterrence', 1, 'Safety ask'), fx('diplomacy', -1, 'Talks pause'), fx('escalation', -1, 'If accepted, cooler')]),
      ch('hist-1941-9c', 'Issue a final public warning of war if strikes occur', 'Clarity for history and home.', 'political', 'capital_a', 'WARNPUB', [fx('credibility', 2, 'Clear red line'), fx('escalation', 1, 'Rhetoric heat'), fx('domestic_support', 1, 'Public braced')]),
    ]),
    beat('hist-1941-10', 'After-first-strike endgame', 'Whether or not the opening blow has landed, cabinet needs war aims: punishment, rollback, or unconditional surrender doctrine.', 'Aims decide duration and alliances.', [
      ch('hist-1941-10a', 'Define limited aims: halt aggression and restore status quo', 'Finite war.', 'political', 'capital_a', 'LIMIT', [fx('diplomacy', 1, 'Negotiable end'), fx('alliance_cohesion', 1, 'Partners can join'), fx('deterrence', -1, 'May look soft')]),
      ch('hist-1941-10b', 'Adopt unconditional surrender as public doctrine', 'Total war frame.', 'political', 'capital_b', 'UNCOND', [fx('credibility', 2, 'Absolute aim'), fx('escalation', 2, 'Longer war'), fx('diplomacy', -2, 'No early exit')]),
      ch('hist-1941-10c', 'Prioritize coalition-building before locking aims', 'Partners first.', 'diplomatic', 'island', 'COAL', [fx('alliance_cohesion', 3, 'Broad war'), fx('time', 1, 'Coordination'), fx('credibility', -1, 'Aims foggy')]),
    ]),
  ],

  'hist-1945-trinity': [
    beat('hist-1945-5', 'Casualty estimate shock', 'Invasion planners produce numbers that stun the cabinet. Alternatives—blockade, bombardment, demonstration—carry their own moral and strategic costs.', 'Arithmetic forces doctrine.', [
      ch('hist-1945-5a', 'Order a comparative options paper with civilian effects', 'Force a full ledger.', 'political', 'capital_a', 'LEDGER2', [fx('credibility', 2, 'Serious process'), fx('time', 1, 'Deliberation'), fx('diplomacy', 1, 'Room for counsel')]),
      ch('hist-1945-5b', 'Accept invasion as baseline and accelerate preparations', 'Commit to the costly path.', 'kinetic', 'fleet', 'INVBASE', [fx('deterrence', 1, 'Conventional pressure'), fx('civilian_cost', 2, 'Projected toll'), fx('escalation', 2, 'Operation locks')]),
      ch('hist-1945-5c', 'Elevate strangulation blockade as primary', 'Time and hunger as weapons.', 'naval', 'strait', 'STRANGLE', [fx('economic_pressure', 3, 'Siege logic'), fx('civilian_cost', 3, 'Famine risk'), fx('time', 2, 'Slow end')]),
    ]),
    beat('hist-1945-6', 'Scientist petition politics', 'Petitions urge demonstration or delay. Military secrecy boards want silence. Leaks could panic allies—or force a better debate.', 'Expertise enters the war room as politics.', [
      ch('hist-1945-6a', 'Convene a closed advisory panel including dissenters', 'Institutionalize argument.', 'political', 'capital_b', 'PANEL', [fx('credibility', 1, 'Due diligence'), fx('time', 1, 'Deliberation'), fx('norm_protection', 1, 'Civilian input')]),
      ch('hist-1945-6b', 'Suppress petitions under wartime secrecy rules', 'Ops security first.', 'legal', 'cable', 'SUPPRESS', [fx('deterrence', 1, 'Surprise preserved'), fx('norm_erosion', 2, 'Speech chill'), fx('credibility', -1, 'Later backlash')]),
      ch('hist-1945-6c', 'Leak a framed “demonstration option” to test reaction', 'Trial balloon.', 'civic', 'island', 'BALLOON', [fx('diplomacy', 1, 'Signals restraint option'), fx('credibility', -1, 'Manipulation'), fx('alliance_cohesion', -1, 'Allies surprised')]),
    ]),
    beat('hist-1945-7', 'Soviet timetable ask', 'Allies want clarity on entry timing and occupation zones. Sharing the weapon secret could shape Yalta follow-through—or accelerate a race.', 'Secrecy versus coalition management.', [
      ch('hist-1945-7a', 'Brief the ally at leadership level only', 'Minimal necessary share.', 'diplomatic', 'capital_a', 'BRIEF2', [fx('alliance_cohesion', 2, 'Trust gesture'), fx('diplomacy', 1, 'Coordination'), fx('escalation', 1, 'Race risk')]),
      ch('hist-1945-7b', 'Keep the weapon secret; coordinate conventional only', 'Compartments hold.', 'political', 'cable', 'SECRET', [fx('deterrence', 1, 'Surprise kept'), fx('alliance_cohesion', -1, 'Later resentment'), fx('time', 1, 'Independent clock')]),
      ch('hist-1945-7c', 'Trade zone understandings for earlier Soviet entry', 'Bargaining chip.', 'diplomatic', 'capital_b', 'ZONES', [fx('diplomacy', 2, 'Map deal'), fx('escalation', 1, 'Faster northern war'), fx('civilian_cost', 1, 'More fronts')]),
    ]),
    beat('hist-1945-8', 'Targeting information fog', 'Target folders mix military value, psychological shock, and civilian density. Weather and intelligence gaps remain.', 'Choosing a city is choosing a doctrine.', [
      ch('hist-1945-8a', 'Prioritize purely military-industrial nodes if feasible', 'Narrow the moral blast.', 'kinetic', 'island', 'MILNODE', [fx('civilian_cost', -1, 'Relative restraint'), fx('deterrence', 1, 'Still devastating'), fx('credibility', 1, 'Discrimination claim')]),
      ch('hist-1945-8b', 'Accept psychological-shock targeting criteria', 'End the war faster by terror calculus.', 'kinetic', 'capital_a', 'SHOCK', [fx('escalation', 3, 'Annihilation norm'), fx('civilian_cost', 3, 'Mass harm'), fx('diplomacy', -1, 'Postwar stain')]),
      ch('hist-1945-8c', 'Require a weather-and-verify abort authority', 'Give aircrews a brake.', 'naval', 'fleet', 'ABORT', [fx('credibility', 1, 'Control retained'), fx('time', 1, 'May delay'), fx('deterrence', -1, 'Less certainty')]),
    ]),
    beat('hist-1945-9', 'Surrender-terms window', 'A clarification on emperor status might unlock capitulation—or prolong fighting if read as weakness. Your note is the off-ramp.', 'Words can spare cities or lose them.', [
      ch('hist-1945-9a', 'Clarify that the imperial institution can survive under reform', 'Narrow dignity path.', 'diplomatic', 'capital_b', 'EMPEROR', [fx('diplomacy', 3, 'Surrender likelier'), fx('domestic_support', -1, 'Hardliners mad'), fx('escalation', -1, 'War may end')]),
      ch('hist-1945-9b', 'Refuse any clarification; keep unconditional absolute', 'No ambiguity.', 'political', 'capital_a', 'ABSOLUTE', [fx('credibility', 1, 'Hard clarity'), fx('diplomacy', -2, 'Harder exit'), fx('escalation', 1, 'Fight continues')]),
      ch('hist-1945-9c', 'Offer clarification only after a demonstration shot', 'Shock then bargain.', 'kinetic', 'island', 'DEMO', [fx('deterrence', 2, 'Proof of power'), fx('civilian_cost', 1, 'Still a nuclear use'), fx('diplomacy', 1, 'Follow-on talk')]),
    ]),
    beat('hist-1945-10', 'Post-use doctrine endgame', 'Cabinet asks how to describe the weapon afterward: exclusive deterrent, international control push, or normalized tool.', 'Narrative after Trinity shapes the nuclear age.', [
      ch('hist-1945-10a', 'Propose international scientific control talks', 'Share the burden of the genie.', 'diplomatic', 'cable', 'INTLCTL', [fx('diplomacy', 2, 'Control agenda'), fx('norm_protection', 2, 'Anti-prolif seed'), fx('deterrence', -1, 'Exclusive edge softens')]),
      ch('hist-1945-10b', 'Keep exclusive national deterrent doctrine', 'Monopoly as peace.', 'political', 'capital_a', 'MONOPOLY', [fx('deterrence', 3, 'Unique threat'), fx('alliance_cohesion', -1, 'Allies uneasy'), fx('escalation', 1, 'Arms race seed')]),
      ch('hist-1945-10c', 'Classify nearly everything; defer doctrine a year', 'Silence first.', 'political', 'capital_b', 'DEFER', [fx('time', 2, 'Delay debate'), fx('credibility', -1, 'Policy fog'), fx('norm_erosion', 1, 'No public rules')]),
    ]),
  ],

  'hist-1947-radcliffe': [
    beat('hist-1947-5', 'Boundary riot cascade', 'Award rumors spark killings along contested tehsils. Troops are thin; delay can mean massacres, speed can mean unjust lines.', 'Maps written in blood still govern.', [
      ch('hist-1947-5a', 'Deploy joint patrols on provisional lines only', 'Stabilize before final ink.', 'kinetic', 'loc', 'PATROL', [fx('civilian_cost', -2, 'Some protection'), fx('escalation', 1, 'Force presence'), fx('time', 1, 'Order first')]),
      ch('hist-1947-5b', 'Publish the award immediately to end rumor', 'Certainty over perfection.', 'political', 'media', 'PUBLISH', [fx('credibility', 1, 'Clear line'), fx('polarization', 2, 'Instant grievance'), fx('time', -1, 'No soft landing')]),
      ch('hist-1947-5c', 'Delay publication; flood relief and mediation teams', 'Humanize the vacuum.', 'civic', 'valley', 'RELIEF', [fx('civilian_cost', -1, 'Aid arrives'), fx('time', 2, 'Delay'), fx('credibility', -1, 'Uncertainty persists')]),
    ]),
    beat('hist-1947-6', 'Dominion politics at home', 'London and local cabinets trade blame for speed. Your counsel can still reshape the handover calendar.', 'Imperial exit timing is a moral choice with body counts.', [
      ch('hist-1947-6a', 'Recommend a short calendar slip for security staging', 'Days for logistics.', 'political', 'third', 'SLIP', [fx('time', 2, 'Staging room'), fx('civilian_cost', -1, 'Better prep'), fx('credibility', -1, 'Promise broken')]),
      ch('hist-1947-6b', 'Hold the date; surge temporary forces instead', 'Speed with muscle.', 'kinetic', 'loc', 'SURGE', [fx('deterrence', 1, 'Order signal'), fx('escalation', 1, 'Force friction'), fx('alliance_cohesion', 1, 'Date kept')]),
      ch('hist-1947-6c', 'Push responsibility publicly onto successor cabinets', 'Political offload.', 'political', 'capital_a', 'OFFLOAD', [fx('credibility', -2, 'Blame game'), fx('polarization', 1, 'Anger shifts'), fx('governability', -1, 'Authority gaps')]),
    ]),
    beat('hist-1947-7', 'Princely accession ask', 'A holdout state wants arms and recognition games. Intervention risks war between new dominions.', 'One palace can ignite two armies.', [
      ch('hist-1947-7a', 'Insist on popular consultation before accession', 'People over princes.', 'diplomatic', 'capital_b', 'CONSULT', [fx('norm_protection', 2, 'Consent frame'), fx('diplomacy', 1, 'Process'), fx('time', -1, 'Delay conflict')]),
      ch('hist-1947-7b', 'Broker a standstill and third-party mediation', 'Freeze the fuse.', 'diplomatic', 'third', 'STAND2', [fx('diplomacy', 2, 'Off-ramp'), fx('escalation', -1, 'Pause'), fx('alliance_cohesion', 1, 'Shared process')]),
      ch('hist-1947-7c', 'Quietly favor the strategically preferred accession', 'Pick a side.', 'political', 'capital_a', 'FAVOR', [fx('alliance_cohesion', -1, 'Other dominion bitter'), fx('escalation', 2, 'War risk'), fx('credibility', -1, 'Partial broker')]),
    ]),
    beat('hist-1947-8', 'Refugee information fog', 'Casualty and flow numbers diverge by orders of magnitude. Aid allocation follows the wrong map if you guess.', 'Statistics are logistics.', [
      ch('hist-1947-8a', 'Create a joint statistical cell with both dominions', 'Shared numbers.', 'diplomatic', 'media', 'STATS', [fx('credibility', 2, 'Common facts'), fx('alliance_cohesion', 1, 'Cooperation'), fx('time', -1, 'Setup cost')]),
      ch('hist-1947-8b', 'Allocate aid on worst-case assumptions', 'Over-prepare.', 'civic', 'valley', 'WORSTAID', [fx('civilian_cost', -2, 'Coverage'), fx('market_stability', -1, 'Cost spike'), fx('credibility', 1, 'Duty of care')]),
      ch('hist-1947-8c', 'Publicize higher figures to force international help', 'Shock diplomacy.', 'political', 'third', 'SHOCK2', [fx('diplomacy', 1, 'Aid magnetism'), fx('polarization', 1, 'Blame politics'), fx('credibility', -1, 'If wrong')]),
    ]),
    beat('hist-1947-9', 'Corridor off-ramp', 'A guarded refugee corridor proposal appears. Escorting it may look like choosing sides; refusing it accepts slaughter.', 'Human corridors are political acts.', [
      ch('hist-1947-9a', 'Authorize internationally observed corridors', 'Protect movement.', 'kinetic', 'loc', 'CORRID2', [fx('civilian_cost', -3, 'Lives saved'), fx('escalation', 1, 'Escort risk'), fx('diplomacy', 1, 'Humanitarian frame')]),
      ch('hist-1947-9b', 'Fund local escorts only; no foreign uniforms', 'Distance optics.', 'civic', 'valley', 'LOCAL', [fx('civilian_cost', -1, 'Some help'), fx('credibility', 1, 'Less imperial look'), fx('escalation', -1, 'Lower profile')]),
      ch('hist-1947-9c', 'Refuse corridors as “population engineering”', 'Avoid owning transfers.', 'political', 'capital_b', 'REFUSE', [fx('credibility', -1, 'Cold legality'), fx('civilian_cost', 3, 'Exposure continues'), fx('polarization', 1, 'Outrage')]),
    ]),
    beat('hist-1947-10', 'Transfer endgame', 'Flags change. Your last brief sets whether remaining British authority mediates, exits clean, or retains bases.', 'Exit style becomes the origin story of two states.', [
      ch('hist-1947-10a', 'Exit cleanly; leave mediation to new dominions and UN path', 'Full transfer.', 'diplomatic', 'third', 'CLEAN', [fx('credibility', 1, 'Promise kept'), fx('alliance_cohesion', 1, 'Sovereignty honored'), fx('time', 1, 'Ends entanglement')]),
      ch('hist-1947-10b', 'Retain temporary base rights for evacuation logistics', 'Linger for order.', 'kinetic', 'loc', 'BASE2', [fx('civilian_cost', -1, 'Logistics aid'), fx('escalation', 1, 'Friction'), fx('credibility', -1, 'Semi-exit')]),
      ch('hist-1947-10c', 'Offer a standing arbitration role on unfinished disputes', 'Remain the referee.', 'legal', 'media', 'REFEREE', [fx('diplomacy', 2, 'Dispute channel'), fx('alliance_cohesion', -1, 'Both may resent'), fx('norm_protection', 1, 'Legal path')]),
    ]),
  ],

  'hist-1948-marshall': [
    beat('hist-1948-5', 'Currency collapse shock', 'A recipient’s soft currency free-falls. Stabilization may require painful reforms that topple coalitions.', 'Aid without money doctoring can vanish into inflation.', [
      ch('hist-1948-5a', 'Condition next tranche on a stabilization program', 'Reform for cash.', 'economic', 'brussels', 'STAB', [fx('market_stability', 2, 'Money repaired'), fx('polarization', 1, 'Reform pain'), fx('credibility', 1, 'Serious program')]),
      ch('hist-1948-5b', 'Bridge with soft conditionality for ninety days', 'Politics first.', 'economic', 'capital', 'BRIDGE2', [fx('alliance_cohesion', 1, 'Partner held'), fx('market_stability', -1, 'Drift continues'), fx('time', 2, 'Window')]),
      ch('hist-1948-5c', 'Pause disbursements until a new cabinet forms', 'Wait for governability.', 'political', 'parliament', 'PAUSE2', [fx('governability', 1, 'Incentivizes cabinet'), fx('civilian_cost', 1, 'Aid gap'), fx('diplomacy', -1, 'Resentment')]),
    ]),
    beat('hist-1948-6', 'Labor unrest at home and abroad', 'Dock strikes threaten to block aid ships; recipient strikes protest wage freezes. Your program is on both picket lines.', 'Reconstruction is class politics internationally.', [
      ch('hist-1948-6a', 'Mediate a temporary dock truce for aid cargoes', 'Carve out humanitarian freight.', 'civic', 'streets', 'TRUCE', [fx('alliance_cohesion', 1, 'Aid flows'), fx('social_calm', 1, 'Narrow peace'), fx('time', 1, 'Bought weeks')]),
      ch('hist-1948-6b', 'Use legal injunctions to move cargoes', 'Force the docks.', 'legal', 'districts', 'INJUNCT', [fx('market_stability', 1, 'Ships move'), fx('polarization', 2, 'Labor war'), fx('norm_erosion', 1, 'Strike chill')]),
      ch('hist-1948-6c', 'Retarget aid toward food and fuel, delay industry', 'Basics first.', 'economic', 'capital', 'BASICS', [fx('civilian_cost', -2, 'Households helped'), fx('market_stability', -1, 'Industry waits'), fx('domestic_support', 1, 'Moral clarity')]),
    ]),
    beat('hist-1948-7', 'Ally’s strategic strings', 'Defense desks want recipients to align on bases and export controls. Purely economic framing is under pressure.', 'ERP can become containment by another name.', [
      ch('hist-1948-7a', 'Keep formal conditions economic; park security in side talks', 'Two tracks.', 'diplomatic', 'brussels', '2TRACK', [fx('diplomacy', 2, 'Separates issues'), fx('alliance_cohesion', 1, 'Defense still talked'), fx('credibility', 1, 'Honest packaging')]),
      ch('hist-1948-7b', 'Accept explicit strategic conditionality', 'Aid as alliance.', 'political', 'parliament', 'STRAT', [fx('alliance_cohesion', 2, 'Bloc building'), fx('polarization', 1, 'Left backlash'), fx('diplomacy', -1, 'Neutrals flee')]),
      ch('hist-1948-7c', 'Refuse security strings to preserve program legitimacy', 'Economics only.', 'economic', 'capital', 'ECONONLY', [fx('credibility', 2, 'Clean brand'), fx('alliance_cohesion', -2, 'Hawks angry'), fx('market_stability', 1, 'Broader uptake')]),
    ]),
    beat('hist-1948-8', 'Cartel and counterpart-fund fog', 'Auditors disagree whether local elites capture counterpart funds. Over-policing kills recovery; under-policing breeds scandal.', 'Corruption control is a recovery instrument.', [
      ch('hist-1948-8a', 'Impose transparent counterpart-fund boards', 'Sunlight rules.', 'legal', 'brussels', 'BOARD2', [fx('credibility', 2, 'Anti-capture'), fx('governability', 1, 'Institutions'), fx('time', -1, 'Setup lag')]),
      ch('hist-1948-8b', 'Tolerate opacity to keep investment velocity', 'Speed over purity.', 'economic', 'capital', 'VELOCITY', [fx('market_stability', 1, 'Faster spend'), fx('credibility', -2, 'Scandal risk'), fx('polarization', 1, 'Elite anger')]),
      ch('hist-1948-8c', 'Publish selective audits to deter without freezing all funds', 'Targeted sunlight.', 'political', 'parliament', 'SELAUD', [fx('credibility', 1, 'Deterrent audits'), fx('diplomacy', -1, 'Named parties mad'), fx('market_stability', 1, 'Most flows continue')]),
    ]),
    beat('hist-1948-9', 'Integration off-ramp', 'A customs-union pitch could multiply growth—or frighten sovereignty politics. You can make ERP the midwife of integration.', 'Architecture after money.', [
      ch('hist-1948-9a', 'Tie later tranches to measurable trade liberalization', 'Integration incentives.', 'economic', 'brussels', 'LIBERAL', [fx('market_stability', 2, 'Open markets'), fx('alliance_cohesion', 1, 'Shared project'), fx('polarization', 1, 'Sovereignty fights')]),
      ch('hist-1948-9b', 'Keep aid national and defer integration politics', 'Money without maps.', 'political', 'capital', 'NATIONAL', [fx('governability', 1, 'Less EU fight'), fx('market_stability', -1, 'Fragmented recovery'), fx('eu_cohesion', -1, 'Slow union')]),
      ch('hist-1948-9c', 'Fund cross-border infrastructure first as soft integration', 'Concrete before treaties.', 'economic', 'districts', 'INFRA', [fx('alliance_cohesion', 2, 'Shared assets'), fx('market_stability', 1, 'Connectivity'), fx('time', 1, 'Gradualism')]),
    ]),
    beat('hist-1948-10', 'Program endgame', 'Congress asks for a success metric: tons shipped, votes won, or a Europe that can stand. Your doctrine note will outlast the appropriations.', 'What you measure becomes the peace.', [
      ch('hist-1948-10a', 'Define success as self-sustaining growth within four years', 'Exit metric.', 'economic', 'brussels', 'EXITM', [fx('credibility', 2, 'Clear goal'), fx('market_stability', 1, 'Growth focus'), fx('alliance_cohesion', 1, 'Shared horizon')]),
      ch('hist-1948-10b', 'Define success as durable anti-communist coalitions', 'Political metric.', 'political', 'parliament', 'COALM', [fx('alliance_cohesion', 2, 'Bloc metric'), fx('polarization', 1, 'Ideological aid'), fx('credibility', -1, 'Cynical read')]),
      ch('hist-1948-10c', 'Refuse a single metric; publish a dashboard of tradeoffs', 'Honest complexity.', 'civic', 'ballot', 'DASH', [fx('credibility', 1, 'Transparency'), fx('governability', -1, 'Harder messaging'), fx('diplomacy', 1, 'Nuanced story')]),
    ]),
  ],

  'hist-1949-october': [
    beat('hist-1949-5', 'Embassy scramble shock', 'Staff and archives must move as recognition realities shift. A botched evacuation becomes a hostage crisis; haste looks like betrayal of the island partner.', 'Logistics is recognition policy.', [
      ch('hist-1949-5a', 'Execute orderly drawdown with third-country custody of consular functions', 'Managed exit.', 'diplomatic', 'capital_a', 'DRAWDOWN', [fx('diplomacy', 1, 'Orderly'), fx('civilian_cost', -1, 'Staff safer'), fx('alliance_cohesion', -1, 'Island partner uneasy')]),
      ch('hist-1949-5b', 'Hold the embassy as a recognition bargaining chip', 'Presence as leverage.', 'political', 'capital_b', 'HOLDCHIP', [fx('diplomacy', 1, 'Leverage'), fx('escalation', 2, 'Incident risk'), fx('credibility', -1, 'Hostage optics')]),
      ch('hist-1949-5c', 'Split: keep a listening post, move formal mission offshore', 'Ambiguous footprint.', 'diplomatic', 'island', 'SPLIT2', [fx('time', 2, 'Flexibility'), fx('credibility', -1, 'Muddy status'), fx('alliance_cohesion', 1, 'Some continuity')]),
    ]),
    beat('hist-1949-6', 'China lobby at home', 'Domestic factions demand you never “lose China.” Trade desks want reality. Your speech will set decades of posture.', 'Home myth versus map.', [
      ch('hist-1949-6a', 'Acknowledge mainland control without full political recognition yet', 'Facts without blessing.', 'political', 'capital_a', 'FACTS2', [fx('credibility', 2, 'Reality-based'), fx('domestic_support', -2, 'Lobby fury'), fx('diplomacy', 1, 'Room later')]),
      ch('hist-1949-6b', 'Refuse any acknowledgment; double support to the island', 'Loyalty politics.', 'political', 'island', 'LOYAL', [fx('alliance_cohesion', 2, 'Partner held'), fx('diplomacy', -2, 'Mainland freeze'), fx('domestic_support', 2, 'Lobby pleased')]),
      ch('hist-1949-6c', 'Kick the question to a bipartisan commission', 'Delay doctrine.', 'civic', 'cable', 'COMMISH2', [fx('time', 2, 'Buys months'), fx('governability', 1, 'Shared ownership'), fx('credibility', -1, 'Indecision')]),
    ]),
    beat('hist-1949-7', 'Ally’s UN credentials ask', 'Partners want a coordinated seat strategy. Splitting the vote could isolate you—or preserve a principle.', 'The UN seat is the recognition war’s cathedral.', [
      ch('hist-1949-7a', 'Coordinate a delay-and-study credentials approach', 'Buy time multilaterally.', 'diplomatic', 'capital_b', 'CREDDEL', [fx('diplomacy', 2, 'Process'), fx('time', 2, 'Deferred fight'), fx('alliance_cohesion', 1, 'Common line')]),
      ch('hist-1949-7b', 'Fight to keep the island’s seat at all costs', 'Symbolic redoubt.', 'political', 'island', 'SEAT', [fx('alliance_cohesion', 1, 'Partner priority'), fx('credibility', -1, 'Majority against'), fx('polarization', 1, 'UN theater')]),
      ch('hist-1949-7c', 'Quietly prepare a dual-representation formula', 'Creative ambiguity.', 'diplomatic', 'strait', 'DUALREP', [fx('diplomacy', 1, 'Novel path'), fx('alliance_cohesion', -1, 'Both may reject'), fx('norm_protection', 1, 'Inclusive try')]),
    ]),
    beat('hist-1949-8', 'Trade-mission fog', 'Business lobbies report informal mainland deals while your controls say otherwise. Enforcement theater versus porous reality.', 'Commercial facts outrun decrees.', [
      ch('hist-1949-8a', 'Legalize limited nonstrategic trade with reporting', 'Regulate reality.', 'economic', 'cable', 'TRADE2', [fx('market_stability', 2, 'Clear rules'), fx('diplomacy', 1, 'Channel'), fx('domestic_support', -1, 'Hawks mad')]),
      ch('hist-1949-8b', 'Tighten controls and prosecute leakers', 'Law over leakage.', 'legal', 'capital_a', 'TIGHT', [fx('economic_pressure', 2, 'Denial'), fx('credibility', 1, 'Enforcement'), fx('market_stability', -1, 'Friction')]),
      ch('hist-1949-8c', 'Look the other way while studying a new regime', 'Ambiguous interim.', 'political', 'fleet', 'LOOK', [fx('time', 1, 'Flexibility'), fx('credibility', -2, 'Hypocrisy'), fx('market_stability', 1, 'Deals continue')]),
    ]),
    beat('hist-1949-9', 'Strait off-ramp', 'A quiet proposal: non-invasion assurances for trade contacts. Too soft abandons a partner; too hard kills the channel.', 'Assurances are the new recognition.', [
      ch('hist-1949-9a', 'Explore mutual non-use-of-force language without recognition', 'Security without seals.', 'diplomatic', 'strait', 'NUF', [fx('diplomacy', 3, 'Off-ramp'), fx('escalation', -1, 'Lower heat'), fx('alliance_cohesion', -1, 'Partner wary')]),
      ch('hist-1949-9b', 'Refuse any assurance that implies two Chinas forever', 'One-China politics.', 'political', 'capital_b', 'ONE', [fx('alliance_cohesion', 1, 'Some partners'), fx('diplomacy', -1, 'Channel cools'), fx('credibility', 1, 'Clear theory')]),
      ch('hist-1949-9c', 'Offer assurances only with verified demilitarization steps', 'Reciprocity.', 'naval', 'fleet', 'RECIP2', [fx('deterrence', 1, 'Linked to force'), fx('diplomacy', 1, 'Conditional'), fx('time', 1, 'Verification')]),
    ]),
    beat('hist-1949-10', 'Recognition endgame', 'You must freeze a standing guidance: when, whether, and how to recognize—and what the island guarantee becomes.', 'Guidance outlives cabinets.', [
      ch('hist-1949-10a', 'Adopt “strategic ambiguity” as formal guidance', 'Deter without clarity.', 'diplomatic', 'strait', 'AMBIG', [fx('deterrence', 2, 'Uncertainty as tool'), fx('alliance_cohesion', 1, 'Partner not abandoned'), fx('credibility', -1, 'Ambiguous pledge')]),
      ch('hist-1949-10b', 'Set a dated path to recognition tied to behavior tests', 'Conditionality calendar.', 'diplomatic', 'capital_a', 'PATH2', [fx('diplomacy', 2, 'Incentives'), fx('time', 1, 'Horizon'), fx('domestic_support', -1, 'Lobby fight')]),
      ch('hist-1949-10c', 'Lock non-recognition and a clear defense commitment to the island', 'Hard choice.', 'naval', 'island', 'LOCK', [fx('alliance_cohesion', 2, 'Partner locked'), fx('escalation', 2, 'War risk'), fx('diplomacy', -2, 'Mainland freeze')]),
    ]),
  ],

  'hist-1950-korea': [
    beat('hist-1950-5', 'Chinese warning shock', 'Neighbor signals that crossing a parallel invites intervention. Your war aims speech must choose limited restoration or rollback.', 'Geography is a red line written in another capital.', [
      ch('hist-1950-5a', 'Reaffirm limited aims: restore the status quo ante', 'Finite war.', 'diplomatic', 'capital_a', 'SQA', [fx('diplomacy', 2, 'Limited frame'), fx('escalation', -1, 'Lower intervention odds'), fx('alliance_cohesion', 1, 'Coalition comfort')]),
      ch('hist-1950-5b', 'Authorize operational pursuit beyond the parallel', 'Rollback.', 'kinetic', 'strait', 'ROLLBACK', [fx('deterrence', 1, 'Offense'), fx('escalation', 3, 'Wider war risk'), fx('credibility', 1, 'Total victory frame')]),
      ch('hist-1950-5c', 'Pause offensives and seek a buffer demilitarized concept', 'Geography as bargain.', 'diplomatic', 'island', 'BUFFER', [fx('diplomacy', 2, 'Map talk'), fx('time', 1, 'Pause'), fx('domestic_support', -1, 'Incomplete win')]),
    ]),
    beat('hist-1950-6', 'Home casualty politics', 'Lists lengthen. A draft expansion vote looms. Limited war is hard to explain at funerals.', 'Democratic consent is a logistics constraint.', [
      ch('hist-1950-6a', 'Define and broadcast clear limited objectives weekly', 'Narrative discipline.', 'civic', 'cable', 'OBJECT', [fx('domestic_support', 1, 'Clarity helps'), fx('credibility', 1, 'Honest war'), fx('alliance_cohesion', 1, 'Shared story')]),
      ch('hist-1950-6b', 'Expand the draft and ask for sacrifice without new aims', 'More force, same speech.', 'political', 'capital_b', 'DRAFT', [fx('deterrence', 2, 'Manpower'), fx('polarization', 2, 'Draft anger'), fx('civilian_cost', 1, 'Social strain')]),
      ch('hist-1950-6c', 'Open an armistice track publicly to show an exit', 'Peace politics.', 'diplomatic', 'capital_a', 'ARMPUB', [fx('diplomacy', 2, 'Exit visible'), fx('domestic_support', 1, 'Hope'), fx('deterrence', -1, 'Looks eager')]),
    ]),
    beat('hist-1950-7', 'UN coalition ask', 'Partners want rules on bombing, prisoners, and national caveats. Unity requires constraint.', 'Coalitions fight at the speed of the most cautious capital.', [
      ch('hist-1950-7a', 'Accept tighter targeting rules for coalition cohesion', 'Restraint as glue.', 'diplomatic', 'fleet', 'RULES', [fx('alliance_cohesion', 3, 'Partners stay'), fx('escalation', -1, 'Less blast'), fx('deterrence', -1, 'Reduced options')]),
      ch('hist-1950-7b', 'Lead with national command exceptions when needed', 'Freedom of action.', 'kinetic', 'strait', 'EXCEPT', [fx('deterrence', 2, 'Flexible force'), fx('alliance_cohesion', -2, 'Caveat wars'), fx('escalation', 1, 'National ops')]),
      ch('hist-1950-7c', 'Create a coalition targeting board with vetoes', 'Institutionalize argument.', 'legal', 'cable', 'BOARD3', [fx('credibility', 1, 'Process'), fx('time', -1, 'Slower strikes'), fx('alliance_cohesion', 1, 'Shared ownership')]),
    ]),
    beat('hist-1950-8', 'Atrocity and POW fog', 'Competing claims about prisoners and civilian deaths threaten the moral frame of a UN war.', 'Information is a second front.', [
      ch('hist-1950-8a', 'Invite ICRC-like access and publish what you can verify', 'Transparency offensive.', 'diplomatic', 'island', 'ICRC', [fx('credibility', 2, 'Moral high ground'), fx('time', 1, 'Verification'), fx('diplomacy', 1, 'Norms')]),
      ch('hist-1950-8b', 'Counter with rapid propaganda before facts settle', 'Speed over certainty.', 'civic', 'cable', 'PROP', [fx('polarization', 1, 'Info war'), fx('credibility', -2, 'Risk of falsehood'), fx('domestic_support', 1, 'Rally')]),
      ch('hist-1950-8c', 'Quietly improve camp conditions; stay silent publicly', 'Fix first, speak later.', 'political', 'capital_b', 'CAMPS', [fx('civilian_cost', -1, 'Better treatment'), fx('credibility', -1, 'Silence read badly'), fx('norm_protection', 1, 'Quiet compliance')]),
    ]),
    beat('hist-1950-9', 'Armistice off-ramp', 'A ceasefire-in-place proposal appears. Hardliners want more ground; partners want an end.', 'Stopping can look like losing.', [
      ch('hist-1950-9a', 'Accept ceasefire-in-place with inspection machinery', 'Lock the line.', 'diplomatic', 'strait', 'CFIP', [fx('diplomacy', 3, 'War paused'), fx('escalation', -2, 'Guns quiet'), fx('domestic_support', -1, 'Incomplete')]),
      ch('hist-1950-9b', 'Demand territorial improvements before any pause', 'Better map first.', 'kinetic', 'fleet', 'BETMAP', [fx('escalation', 2, 'Fight continues'), fx('deterrence', 1, 'Pressure'), fx('alliance_cohesion', -1, 'Partners tire')]),
      ch('hist-1950-9c', 'Seek a temporary humanitarian pause only', 'Narrow mercy.', 'diplomatic', 'island', 'HUM2', [fx('civilian_cost', -2, 'Relief window'), fx('time', 1, 'Days'), fx('diplomacy', 1, 'Channel')]),
    ]),
    beat('hist-1950-10', 'Limited-war endgame', 'You must write the doctrine: Korea as exception, template, or warning against land wars in Asia.', 'Doctrine is how the next cabinet fights.', [
      ch('hist-1950-10a', 'Codify limited-war rules and nuclear non-use thresholds', 'Boundaries in writing.', 'political', 'capital_a', 'LIMITDOC', [fx('norm_protection', 2, 'Restraints'), fx('escalation', -1, 'Clearer brakes'), fx('credibility', 1, 'Doctrine clarity')]),
      ch('hist-1950-10b', 'Treat Korea as unique; refuse general doctrine', 'Case-by-case.', 'political', 'capital_b', 'UNIQUE', [fx('time', 1, 'Flexibility'), fx('credibility', -1, 'Fog for allies'), fx('alliance_cohesion', -1, 'Uncertainty')]),
      ch('hist-1950-10c', 'Pivot resources to other theaters and accept a frozen line', 'Strategic triage.', 'diplomatic', 'cable', 'TRIAGE', [fx('alliance_cohesion', 1, 'Global balance'), fx('diplomacy', 1, 'Freeze accepted'), fx('domestic_support', -1, 'Abandoned feel')]),
    ]),
  ],
};
