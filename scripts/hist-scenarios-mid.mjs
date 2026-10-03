/** Scenarios 13–21 */
import { fx, ch, beat, scenario } from './hist-helpers.mjs';

export const mid = [
  scenario({
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
    tension: 'Recovery speed versus political strings that may split Europe further.',
    beats: [
      beat('hist-1948-1', 'Eligibility map', 'Should aid be offered east of the new divide, knowing refusal is likely but the offer is the message?', 'Inclusion theater versus bloc hardening.', [
        ch('hist-1948-1a', 'Make a public open offer including the East', 'Let refusal be on them.', 'diplomatic', 'brussels', 'OPEN', [fx('credibility', 2, 'Inclusive frame'), fx('polarization', 1, 'Bloc politics'), fx('diplomacy', 1, 'Propaganda win if refused')]),
        ch('hist-1948-1b', 'Limit eligibility to committed partners', 'No wasted capital.', 'political', 'capital', 'LIMIT', [fx('alliance_cohesion', 2, 'Core tight'), fx('norm_erosion', 1, 'Sphere logic'), fx('market_stability', 1, 'Focused spend')]),
        ch('hist-1948-1c', 'Quiet bilateral packages only', 'Avoid a grand design.', 'economic', 'parliament', 'BILAT', [fx('diplomacy', 1, 'Flexible'), fx('credibility', -1, 'No vision'), fx('eu_cohesion', -1, 'Integration stalls')]),
      ]),
      beat('hist-1948-2', 'Conditionality', 'Treasury wants reforms; foreign ministries want gratitude without humiliation.', 'Strings can rebuild or poison.', [
        ch('hist-1948-2a', 'Require trade liberalization milestones', 'Markets first.', 'economic', 'brussels', 'TRADE', [fx('market_stability', 2, 'Open flows'), fx('domestic_support', -1, 'Local industry pain'), fx('eu_cohesion', 1, 'Shared rules')]),
        ch('hist-1948-2b', 'Soft conditions; prioritize speed of disbursement', 'Cash now.', 'economic', 'capital', 'SPEED', [fx('social_calm', 2, 'Relief fast'), fx('credibility', -1, 'Waste risk'), fx('governability', 1, 'Cabinets breathe')]),
        ch('hist-1948-2c', 'Tie aid to defense coordination pledges', 'Security bundle.', 'political', 'ballot', 'DEFENSE', [fx('alliance_cohesion', 2, 'Security link'), fx('escalation', 1, 'Bloc militarized'), fx('diplomacy', -1, 'Looks like payment for bases')]),
      ]),
      beat('hist-1948-3', 'Currency and cartels', 'Local elites resist breaking cartels. Your economists say recovery fails without competition.', 'Reform without ownership fails.', [
        ch('hist-1948-3a', 'Insist on anti-cartel benchmarks', 'Hard reform.', 'legal', 'parliament', 'CARTEL', [fx('market_stability', 2, 'Competition'), fx('polarization', 1, 'Elite resistance'), fx('credibility', 1, 'Standards')]),
        ch('hist-1948-3b', 'Accept gradualism with monitoring', 'Pace with politics.', 'diplomatic', 'districts', 'GRADUAL', [fx('diplomacy', 2, 'Buy-in'), fx('time', 1, 'Slower reform'), fx('market_stability', 1, 'Partial')]),
        ch('hist-1948-3c', 'Bypass elites via municipal projects', 'Local visible wins.', 'civic', 'streets', 'LOCAL', [fx('social_calm', 2, 'Visible rebuild'), fx('governability', -1, 'Center weakened'), fx('domestic_support', 1, 'Popular')]),
      ]),
      beat('hist-1948-4', 'Integration pitch', 'Some partners want a customs union; others fear loss of sovereignty.', 'Economics is constitution-making.', [
        ch('hist-1948-4a', 'Champion a customs-union track', 'Deep integration.', 'diplomatic', 'brussels', 'UNION', [fx('eu_cohesion', 3, 'Integration leap'), fx('market_stability', 2, 'Larger market'), fx('domestic_support', -1, 'Sovereignty fears')]),
        ch('hist-1948-4b', 'Prefer OEEC coordination only', 'Talk shop plus aid.', 'political', 'capital', 'OEEC', [fx('diplomacy', 1, 'Light touch'), fx('eu_cohesion', -1, 'Shallow'), fx('alliance_cohesion', 1, 'Broad tent')]),
        ch('hist-1948-4c', 'Bilateral productivity missions as the brand', 'American know-how narrative.', 'economic', 'parliament', 'MISSION', [fx('credibility', 1, 'Soft power'), fx('market_stability', 1, 'Technics'), fx('eu_cohesion', -1, 'Less European ownership')]),
      ]),
    ],
  }),

  scenario({
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
    tension: 'Acknowledge facts without surrendering partners who fled the mainland.',
    beats: [
      beat('hist-1949-1', 'Recognition timing', 'Do you recognize immediately, wait for peers, or maintain the old credentials?', 'Recognition is a strategic act, not a notarization.', [
        ch('hist-1949-1a', 'Recognize promptly with conditions on treaties', 'Facts plus continuity clauses.', 'diplomatic', 'capital_a', 'RECOG', [fx('diplomacy', 2, 'Channel opens'), fx('alliance_cohesion', -1, 'Some partners angered'), fx('credibility', 1, 'Realist clarity')]),
        ch('hist-1949-1b', 'Delay; coordinate a joint allied stance', 'No one alone.', 'diplomatic', 'capital_b', 'COORD', [fx('alliance_cohesion', 2, 'Unity'), fx('time', 1, 'Wait'), fx('diplomacy', -1, 'Beijing may freeze')]),
        ch('hist-1949-1c', 'Refuse recognition; keep old embassy fiction', 'Non-recognition as policy.', 'political', 'cable', 'REFUSE', [fx('alliance_cohesion', 1, 'With die-hards'), fx('diplomacy', -2, 'No channel'), fx('credibility', -1, 'Denies map')]),
      ]),
      beat('hist-1949-2', 'Trade and missionaries', 'Businesses want access; security services fear technology leakage.', 'Commerce without a political frame becomes a vulnerability.', [
        ch('hist-1949-2a', 'Allow non-strategic trade under license', 'Controlled opening.', 'economic', 'strait', 'LICENSE', [fx('market_stability', 2, 'Trade resumes'), fx('credibility', 1, 'Controlled'), fx('deterrence', -1, 'Less isolation')]),
        ch('hist-1949-2b', 'Embargo until political concessions', 'Pressure first.', 'economic', 'cable', 'EMBARGO', [fx('economic_pressure', 2, 'Squeeze'), fx('diplomacy', -1, 'Hardens'), fx('alliance_cohesion', -1, 'If partners cheat')]),
        ch('hist-1949-2c', 'Quiet humanitarian and cultural corridors only', 'People first.', 'civic', 'island', 'HUMANE', [fx('diplomacy', 1, 'Soft channel'), fx('civilian_cost', -1, 'Some relief'), fx('market_stability', -1, 'Commerce limited')]),
      ]),
      beat('hist-1949-3', 'Island partner', 'The retreated government asks for a defense guarantee. Granting it may freeze a civil war into an international one.', 'A guarantee can deter—or invite tests.', [
        ch('hist-1949-3a', 'Issue a limited defensive guarantee', 'Island only.', 'diplomatic', 'island', 'GUARD', [fx('deterrence', 2, 'Clear shield'), fx('escalation', 1, 'Tripwire'), fx('alliance_cohesion', 2, 'Partner held')]),
        ch('hist-1949-3b', 'Arms sales without a treaty', 'Capacity, not pledge.', 'economic', 'fleet', 'ARMS', [fx('deterrence', 1, 'Some teeth'), fx('escalation', 1, 'Fuel'), fx('diplomacy', 1, 'Ambiguity left')]),
        ch('hist-1949-3c', 'Encourage negotiated dual representation ideas', 'Diplomatic creativity.', 'diplomatic', 'capital_a', 'DUAL', [fx('diplomacy', 2, 'Forum ideas'), fx('credibility', -1, 'May please none'), fx('polarization', 1, 'Domestic fight')]),
      ]),
      beat('hist-1949-4', 'UN seat fight', 'Credentials contests begin. Your vote will be remembered for decades.', 'Procedure is power.', [
        ch('hist-1949-4a', 'Vote to seat Beijing', 'Match recognition to the UN.', 'political', 'capital_b', 'SEAT', [fx('norm_protection', 1, 'Effective control'), fx('alliance_cohesion', -2, 'Splits coalition'), fx('diplomacy', 1, 'UN channel')]),
        ch('hist-1949-4b', 'Vote to keep the old credentials', 'Hold the line.', 'political', 'cable', 'HOLDUN', [fx('alliance_cohesion', 1, 'With non-recognizers'), fx('credibility', -1, 'Fiction'), fx('diplomacy', -1, 'Beijing frozen out')]),
        ch('hist-1949-4c', 'Push a study committee delay', 'Kick the can.', 'diplomatic', 'strait', 'STUDY', [fx('time', 2, 'Defer'), fx('credibility', -1, 'Evasion'), fx('alliance_cohesion', 1, 'Avoids rupture now')]),
      ]),
    ],
  }),

  scenario({
    id: 'hist-1950-korea',
    year: 1950,
    era: '1945–1962',
    title: 'Parallel War',
    region: 'Korean Peninsula · UN · great-power desks',
    meterFamily: 'conflict',
    theaterArchetype: 'pacific',
    premise:
      'A sudden crossing of the parallel forces collective-security machinery to prove it exists. You advise on authorization, aims, and whether to cross north.',
    role: 'UN coalition strategy counselor',
    tension: 'Repel aggression without turning a limited war into a continental one.',
    beats: [
      beat('hist-1950-1', 'First response', 'Forces reeling south. Options: emergency air cover, full ground commitment, or diplomatic condemnation only.', 'Hours matter more than communiqués.', [
        ch('hist-1950-1a', 'Authorize emergency air and naval support', 'Stabilize the perimeter.', 'naval', 'fleet', 'AIRNAV', [fx('deterrence', 2, 'Immediate aid'), fx('escalation', 1, 'War joined'), fx('alliance_cohesion', 2, 'UN acts')]),
        ch('hist-1950-1b', 'Full ground expedition under UN flag', 'Commit troops.', 'kinetic', 'island', 'GROUND', [fx('escalation', 2, 'Major war'), fx('alliance_cohesion', 2, 'Coalition war'), fx('civilian_cost', 1, 'Battlefield toll')]),
        ch('hist-1950-1c', 'Condemn and seek mediation first', 'Words before armies.', 'diplomatic', 'capital_a', 'MEDIATE', [fx('diplomacy', 2, 'Talks try'), fx('credibility', -2, 'Slow'), fx('alliance_cohesion', -1, 'Partner panic')]),
      ]),
      beat('hist-1950-2', 'War aims', 'Some want restoration of the parallel only; others want reunification by force.', 'Aims decide whether China intervenes.', [
        ch('hist-1950-2a', 'Limit aim to restoring the status quo ante', 'Push back to the parallel.', 'political', 'strait', 'STATUS', [fx('escalation', -1, 'Limited'), fx('credibility', 1, 'Clear aim'), fx('alliance_cohesion', 1, 'Easier coalition')]),
        ch('hist-1950-2b', 'Authorize advance north for reunification', 'End the division.', 'kinetic', 'capital_b', 'NORTH', [fx('escalation', 3, 'Wider war risk'), fx('deterrence', 1, 'Total victory bid'), fx('diplomacy', -2, 'Neighbors alarmed')]),
        ch('hist-1950-2c', 'Seek a ceasefire in place wherever lines settle', 'Freeze early.', 'diplomatic', 'cable', 'FREEZE', [fx('diplomacy', 2, 'Stop bleeding'), fx('credibility', -1, 'Aggression rewarded?'), fx('time', 1, 'Talks')]),
      ]),
      beat('hist-1950-3', 'Neighbor warning', 'Intelligence suggests a great-power neighbor may intervene if you approach its border.', 'Ignoring the warning may be catastrophic; heeding it may forfeit initiative.', [
        ch('hist-1950-3a', 'Halt short of the sensitive belt', 'Geographic self-limit.', 'diplomatic', 'island', 'HALT', [fx('escalation', -2, 'Reduces intervention odds'), fx('deterrence', -1, 'Looks cautious'), fx('alliance_cohesion', 1, 'Coalition relief')]),
        ch('hist-1950-3b', 'Continue; issue private reassurances of limited aims', 'Talk while moving.', 'diplomatic', 'capital_a', 'ASSURE', [fx('diplomacy', 1, 'Channel'), fx('escalation', 2, 'Still advancing'), fx('credibility', 1, 'Tries both')]),
        ch('hist-1950-3c', 'Dare the intervention; accelerate', 'Speed as strategy.', 'kinetic', 'fleet', 'DASH', [fx('escalation', 3, 'Intervention likelier'), fx('deterrence', 1, 'Resolve'), fx('civilian_cost', 2, 'Wider fight')]),
      ]),
      beat('hist-1950-4', 'Armistice politics', 'After months of grinding war, a prisoner and border package is on the table.', 'Peace can look like betrayal to those who paid.', [
        ch('hist-1950-4a', 'Accept an armistice near the parallel', 'Stop the meat grinder.', 'diplomatic', 'strait', 'ARMIST', [fx('escalation', -3, 'Guns quiet'), fx('credibility', 1, 'Limited success'), fx('domestic_support', -1, 'No victory parade')]),
        ch('hist-1950-4b', 'Hold out for forced repatriation terms', 'Principle over speed.', 'political', 'capital_b', 'POWS', [fx('norm_protection', 2, 'Choice principle'), fx('time', 2, 'War continues'), fx('civilian_cost', 1, 'More losses')]),
        ch('hist-1950-4c', 'Threaten escalation to compel better terms', 'Raise the shadow.', 'kinetic', 'cable', 'THREAT', [fx('deterrence', 2, 'Pressure'), fx('escalation', 2, 'Dangerous bluff'), fx('alliance_cohesion', -1, 'Partners nervous')]),
      ]),
    ],
  }),

  scenario({
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
    tension: 'Imperial habits versus postwar rules—and a currency that may not survive a long fight.',
    beats: [
      beat('hist-1956-1', 'Legal versus kinetic', 'Admirals want a rapid seizure plan. Lawyers want UN cover you may not get.', 'Speed without legitimacy may forfeit alliances.', [
        ch('hist-1956-1a', 'Pursue UN Users’ Association track', 'Multilateral legal frame.', 'diplomatic', 'canal', 'USERS', [fx('norm_protection', 2, 'Legal path'), fx('time', 1, 'Slower'), fx('credibility', 1, 'Rules story')]),
        ch('hist-1956-1b', 'Authorize a limited airborne-naval operation', 'Facts on water.', 'kinetic', 'chokepoint', 'SEIZE', [fx('escalation', 3, 'War opens'), fx('deterrence', 1, 'Shows force'), fx('alliance_cohesion', -2, 'Partners split')]),
        ch('hist-1956-1c', 'Freeze related financial assets first', 'Money before marines.', 'economic', 'insurer', 'FREEZE', [fx('economic_pressure', 2, 'Squeeze'), fx('escalation', -1, 'Less kinetic'), fx('market_stability', -1, 'Nerves')]),
      ]),
      beat('hist-1956-2', 'Collusion risk', 'A partner proposes timing your move with a third party’s campaign. Intelligence deniability is thin.', 'Secret coordination can become a scandal that ends cabinets.', [
        ch('hist-1956-2a', 'Refuse collusion; keep an independent track', 'Clean hands.', 'diplomatic', 'port', 'CLEAN', [fx('credibility', 2, 'Integrity'), fx('alliance_cohesion', -1, 'Partner anger'), fx('diplomacy', 1, 'UN space')]),
        ch('hist-1956-2b', 'Accept covert coordination', 'Synchronize.', 'political', 'proxy', 'COVERT', [fx('escalation', 2, 'Wider plot'), fx('credibility', -2, 'If exposed'), fx('deterrence', 1, 'Operational sync')]),
        ch('hist-1956-2c', 'Leak the proposal to kill it', 'Force sunlight.', 'civic', 'insurer', 'LEAK', [fx('norm_protection', 1, 'Exposes scheme'), fx('alliance_cohesion', -3, 'Betrayal'), fx('polarization', 2, 'Political storm')]),
      ]),
      beat('hist-1956-3', 'Superpower ultimatum', 'A great-power partner demands ceasefire and ties it to your currency support.', 'Empire ends at the discount window.', [
        ch('hist-1956-3a', 'Ceasefire to save the currency', 'Finance first.', 'economic', 'insurer', 'STERLING', [fx('market_stability', 3, 'Currency held'), fx('credibility', -2, 'Climb-down'), fx('escalation', -2, 'Fight stops')]),
        ch('hist-1956-3b', 'Defy and seek alternative financing', 'Hold the course.', 'political', 'port', 'DEFY', [fx('credibility', 1, 'Resolve'), fx('market_stability', -3, 'Sterling crisis'), fx('alliance_cohesion', -2, 'Isolation')]),
        ch('hist-1956-3c', 'Trade phased withdrawal for face-saving UN force', 'Exit with cover.', 'diplomatic', 'canal', 'UNFORCE', [fx('diplomacy', 2, 'Institutional exit'), fx('credibility', -1, 'Partial loss'), fx('norm_protection', 1, 'UN role')]),
      ]),
      beat('hist-1956-4', 'Aftermath doctrine', 'After withdrawal, cabinets ask what Suez means for future interventions.', 'Doctrine is how you lose the next time—or don’t.', [
        ch('hist-1956-4a', 'Adopt a strict multilateral-only rule', 'No more solo imperial wars.', 'legal', 'canal', 'MULTI', [fx('norm_protection', 2, 'Rules turn'), fx('deterrence', -1, 'Less freedom'), fx('alliance_cohesion', 1, 'UN-aligned')]),
        ch('hist-1956-4b', 'Rebuild independent expeditionary capacity', 'Never again dependent.', 'kinetic', 'escort', 'REBUILD', [fx('deterrence', 2, 'Autonomy'), fx('alliance_cohesion', -1, 'Distancing'), fx('economic_pressure', 1, 'Costly')]),
        ch('hist-1956-4c', 'Pivot to economic statecraft in the region', 'Aid and markets.', 'economic', 'port', 'PIVOT', [fx('diplomacy', 2, 'Soft reset'), fx('market_stability', 1, 'Commerce'), fx('credibility', 1, 'New brand')]),
      ]),
    ],
  }),

  scenario({
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
    tension: 'Remove the missiles without a nuclear exchange.',
    beats: [
      beat('hist-1962-1', 'Opening move', 'Options: surgical air strike, naval quarantine, or secret diplomacy first.', 'The first public act sets the escalation ladder.', [
        ch('hist-1962-1a', 'Announce a naval quarantine', 'Interdict military shipments.', 'naval', 'port', 'QUARANT', [fx('deterrence', 2, 'Draws a line'), fx('escalation', 1, 'Sea confrontation'), fx('alliance_cohesion', 1, 'Allies can join')]),
        ch('hist-1962-1b', 'Authorize a surprise strike on sites', 'Facts before talks.', 'kinetic', 'plaza', 'STRIKE', [fx('escalation', 3, 'War risk'), fx('deterrence', 2, 'Removes hardware'), fx('diplomacy', -3, 'Talks poisoned')]),
        ch('hist-1962-1c', 'Open a secret channel before any public act', 'Probe a trade.', 'diplomatic', 'capital', 'SECRET', [fx('diplomacy', 2, 'Off-ramp'), fx('time', -1, 'Missiles mature'), fx('credibility', -1, 'If leaks as weakness')]),
      ]),
      beat('hist-1962-2', 'Alliance management', 'Partners demand consultation; some want toughness, others dread cities as hostages.', 'NATO solidarity is a second theater.', [
        ch('hist-1962-2a', 'Full briefing and shared quarantine rules', 'Coalition ownership.', 'diplomatic', 'imf', 'BRIEF', [fx('alliance_cohesion', 3, 'Shared ops'), fx('credibility', 1, 'Transparent'), fx('time', 1, 'Coordination cost')]),
        ch('hist-1962-2b', 'Inform after decisions are set', 'Speed over process.', 'political', 'capital', 'AFTER', [fx('time', -1, 'Faster'), fx('alliance_cohesion', -2, 'Resentment'), fx('deterrence', 1, 'Unity of command')]),
        ch('hist-1962-2c', 'Offer a European missile trade discussion privately', 'Link theaters.', 'diplomatic', 'court', 'LINK', [fx('diplomacy', 2, 'Bargain space'), fx('alliance_cohesion', -1, 'Host nations uneasy'), fx('escalation', -1, 'Trade possible')]),
      ]),
      beat('hist-1962-3', 'Ship challenge', 'A freighter approaches the line. Boarding may spark war; waving it through may unravel the quarantine.', 'A single hull is now strategic.', [
        ch('hist-1962-3a', 'Board and inspect', 'Enforce the line.', 'naval', 'port', 'BOARD', [fx('credibility', 2, 'Line real'), fx('escalation', 2, 'Incident risk'), fx('deterrence', 2, 'Shown')]),
        ch('hist-1962-3b', 'Shadow but do not board yet', 'Buy hours for cables.', 'naval', 'farm', 'SHADOW', [fx('time', 1, 'Space'), fx('credibility', -1, 'Looks soft'), fx('diplomacy', 1, 'Room for deal')]),
        ch('hist-1962-3c', 'Publicly divert via warning shots doctrine', 'Signal without seizure.', 'kinetic', 'plaza', 'WARN', [fx('deterrence', 1, 'Signal'), fx('escalation', 1, 'Dangerous'), fx('alliance_cohesion', 1, 'Visible resolve')]),
      ]),
      beat('hist-1962-4', 'Trade package', 'A deal shape appears: withdraw missiles for a no-invasion pledge—and maybe a quiet reciprocal removal elsewhere.', 'Public victory versus private symmetry.', [
        ch('hist-1962-4a', 'Accept public pledge; keep reciprocal removal secret', 'Dual track.', 'diplomatic', 'capital', 'DUAL', [fx('diplomacy', 3, 'Crisis ends'), fx('credibility', 1, 'Public win'), fx('alliance_cohesion', -1, 'If secret later leaks')]),
        ch('hist-1962-4b', 'Demand public symmetry on all removals', 'No secret trades.', 'political', 'court', 'PUBLIC', [fx('credibility', 2, 'Transparency'), fx('diplomacy', -1, 'Harder yes'), fx('escalation', 1, 'Deal may fail')]),
        ch('hist-1962-4c', 'Reject; prepare strike while quarantine holds', 'Force the removal.', 'kinetic', 'plaza', 'REJECT', [fx('escalation', 3, 'War nearer'), fx('deterrence', 1, 'Pressure'), fx('diplomacy', -2, 'Channel burns')]),
      ]),
    ],
  }),

  scenario({
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
    tension: 'Moral support without a NATO–Warsaw war.',
    beats: [
      beat('hist-1968-1', 'Public posture', 'Reformers want loud solidarity. Your military warns that loudness without force is cruelty.', 'Words create expectations you may not meet.', [
        ch('hist-1968-1a', 'Loud political solidarity; no military hints', 'Voice without tripwire.', 'political', 'brussels', 'VOICE', [fx('norm_protection', 2, 'Names reform'), fx('credibility', -1, 'No teeth'), fx('alliance_cohesion', 1, 'West speaks')]),
        ch('hist-1968-1b', 'Quiet channel urging restraint to Moscow', 'Private diplomacy.', 'diplomatic', 'capital', 'QUIET', [fx('diplomacy', 2, 'Channel'), fx('credibility', -1, 'Public silence'), fx('escalation', -1, 'Lower heat')]),
        ch('hist-1968-1c', 'Hint at economic costs for intervention', 'Sanctions shadow.', 'economic', 'parliament', 'COST', [fx('economic_pressure', 1, 'Warning'), fx('escalation', 1, 'May harden'), fx('deterrence', 1, 'Some price')]),
      ]),
      beat('hist-1968-2', 'Intervention night', 'Tanks cross. Refugees head west. Allies ask for an emergency meeting.', 'The map just changed; your doctrine must answer.', [
        ch('hist-1968-2a', 'Emergency NATO consult; raise alert carefully', 'Alliance theater.', 'diplomatic', 'brussels', 'NATO', [fx('alliance_cohesion', 2, 'Unity'), fx('escalation', 1, 'Alert risk'), fx('deterrence', 1, 'Signal')]),
        ch('hist-1968-2b', 'Open borders and refugee corridors', 'Humanitarian first.', 'civic', 'streets', 'REFUGE', [fx('civilian_cost', -2, 'Shelter'), fx('social_calm', 1, 'Orderly aid'), fx('polarization', 1, 'Domestic politics')]),
        ch('hist-1968-2c', 'Covert aid to reformers', 'Radios, funds, exfil.', 'kinetic', 'districts', 'COVERT', [fx('escalation', 2, 'Proxy risk'), fx('credibility', 1, 'Not passive'), fx('diplomacy', -1, 'If exposed')]),
      ]),
      beat('hist-1968-3', 'Normalization pressure', 'Occupiers demand Western acceptance of a restored hard line as the price of “stability.”', 'Recognition can become complicity.', [
        ch('hist-1968-3a', 'Refuse business-as-usual summits', 'Diplomatic chill.', 'diplomatic', 'capital', 'CHILL', [fx('norm_protection', 2, 'Non-acceptance'), fx('diplomacy', -1, 'Channels thin'), fx('credibility', 1, 'Principled')]),
        ch('hist-1968-3b', 'Continue arms-control tracks anyway', 'Separate issues.', 'diplomatic', 'ballot', 'ARMS', [fx('diplomacy', 2, 'Big stakes saved'), fx('norm_erosion', 1, 'Looks cynical'), fx('alliance_cohesion', -1, 'Moral camp splits')]),
        ch('hist-1968-3c', 'Targeted cultural and academic boycotts', 'Soft isolation.', 'civic', 'districts', 'BOYCOTT', [fx('polarization', 1, 'Symbolic fight'), fx('credibility', 1, 'Visible stand'), fx('diplomacy', -1, 'Irritant')]),
      ]),
      beat('hist-1968-4', 'Doctrine memo', 'You must write what this means for future Eastern reform movements.', 'Doctrine teaches the next Prague—or Hungary.', [
        ch('hist-1968-4a', 'Codify non-intervention beyond rhetoric aid', 'Clear limits.', 'political', 'parliament', 'LIMITS', [fx('credibility', 2, 'Honest bounds'), fx('deterrence', -1, 'Less fear'), fx('alliance_cohesion', 1, 'Shared realism')]),
        ch('hist-1968-4b', 'Promise future linkage to Helsinki-style rights baskets', 'Long game.', 'legal', 'brussels', 'RIGHTS', [fx('norm_protection', 2, 'Rights track'), fx('time', 2, 'Slow tool'), fx('diplomacy', 1, 'Agenda set')]),
        ch('hist-1968-4c', 'Accelerate conventional forces on the central front', 'Hard answer.', 'kinetic', 'streets', 'FORCE', [fx('deterrence', 2, 'Teeth'), fx('escalation', 1, 'Arms race'), fx('market_stability', -1, 'Spend')]),
      ]),
    ],
  }),

  scenario({
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
    tension: 'Keep society functioning without turning energy into open war.',
    beats: [
      beat('hist-1973-1', 'Rationing politics', 'Queues form. Industry wants priority; voters want fairness.', 'Allocation is legitimacy.', [
        ch('hist-1973-1a', 'Odd-even rationing with industrial priority carve-outs', 'Hybrid fairness.', 'civic', 'energy', 'RATION', [fx('social_calm', 1, 'Some order'), fx('market_stability', 1, 'Industry held'), fx('polarization', 1, 'Carve-out anger')]),
        ch('hist-1973-1b', 'Price liberalization to clear queues', 'Let prices ration.', 'economic', 'exchange', 'PRICE', [fx('market_stability', 2, 'Queues shrink'), fx('civilian_cost', 2, 'Cost shock'), fx('domestic_support', -2, 'Voters hurt')]),
        ch('hist-1973-1c', 'Strategic reserve release for essentials only', 'Targeted calm.', 'economic', 'treasury', 'SPR', [fx('market_stability', 2, 'Blunts spike'), fx('time', 1, 'Buys weeks'), fx('credibility', -1, 'Finite card')]),
      ]),
      beat('hist-1973-2', 'Alliance split', 'Partners cut separate deals with producers. Your unity message is failing.', 'Every bilateral deal weakens the next negotiation.', [
        ch('hist-1973-2a', 'Propose a consumers’ cartel coordination desk', 'Joint purchasing.', 'diplomatic', 'em', 'CARTEL', [fx('alliance_cohesion', 2, 'Shared frame'), fx('economic_pressure', 1, 'Buyer power'), fx('diplomacy', 1, 'Counter-table')]),
        ch('hist-1973-2b', 'Authorize your own bilateral supply deal', 'Secure your barrels.', 'economic', 'energy', 'BILAT', [fx('market_stability', 1, 'Your supply'), fx('alliance_cohesion', -2, 'Defect'), fx('credibility', -1, 'Lectures ring hollow')]),
        ch('hist-1973-2c', 'Tie diplomacy to a Middle East ceasefire push', 'Politics for oil.', 'diplomatic', 'fed', 'PEACE', [fx('diplomacy', 2, 'Linkage'), fx('escalation', -1, 'If it works'), fx('time', 1, 'Complex talks')]),
      ]),
      beat('hist-1973-3', 'Force talk', 'Admirals float contingency plans to seize fields. Leak risk is extreme.', 'Even studying force can explode the crisis.', [
        ch('hist-1973-3a', 'Kill force planning; invest in efficiency mandates', 'Demand destruction.', 'civic', 'desk', 'EFFIC', [fx('market_stability', 1, 'Longer fix'), fx('escalation', -2, 'No war path'), fx('domestic_support', -1, 'Lifestyle hit')]),
        ch('hist-1973-3b', 'Keep planning secret as deterrent only', 'Shadow option.', 'kinetic', 'energy', 'SHADOW', [fx('deterrence', 1, 'Unknown risk'), fx('escalation', 1, 'If leaked'), fx('credibility', -1, 'Hypocrisy risk')]),
        ch('hist-1973-3c', 'Publicly rule out seizure; seek producer investment deals', 'Interdependence.', 'diplomatic', 'em', 'INVEST', [fx('diplomacy', 2, 'Positive sum pitch'), fx('market_stability', 1, 'Capital flows'), fx('deterrence', -1, 'No stick')]),
      ]),
      beat('hist-1973-4', 'New normal', 'Prices may not return. You need a multi-year energy doctrine.', 'Crisis policy becomes industrial policy.', [
        ch('hist-1973-4a', 'Crash program for domestic supply and nuclear', 'Independence bid.', 'economic', 'treasury', 'DOMESTIC', [fx('credibility', 1, 'Long game'), fx('market_stability', 1, 'Future supply'), fx('polarization', 1, 'Siting fights')]),
        ch('hist-1973-4b', 'International energy agency with shared stocks', 'Institutionalize buffers.', 'diplomatic', 'fed', 'IEA', [fx('alliance_cohesion', 2, 'Shared stocks'), fx('market_stability', 2, 'Buffers'), fx('diplomacy', 1, 'Rules')]),
        ch('hist-1973-4c', 'Accept higher prices; protect poorest with transfers', 'Adaptation.', 'civic', 'exchange', 'TRANSFER', [fx('social_calm', 2, 'Targeted help'), fx('civilian_cost', -1, 'Cushion'), fx('market_stability', 1, 'Prices work')]),
      ]),
    ],
  }),

  scenario({
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
    tension: 'Recover people and standing without a wider Gulf war.',
    beats: [
      beat('hist-1979-1', 'Ally collapse', 'The old government falls. Do you evacuate early, recognize new authorities, or bet on a restoration?', 'Timing decides who owns the narrative of abandonment.', [
        ch('hist-1979-1a', 'Full noncombatant evacuation now', 'People first.', 'diplomatic', 'base', 'EVAC', [fx('civilian_cost', -2, 'Staff safe'), fx('credibility', -1, 'Looks like flight'), fx('alliance_cohesion', -1, 'Local allies panic')]),
        ch('hist-1979-1b', 'Recognize a transitional authority if it forms', 'Engage facts.', 'diplomatic', 'tehran', 'RECOG', [fx('diplomacy', 2, 'Channel'), fx('credibility', -1, 'Betrays old clients'), fx('time', 1, 'Talks')]),
        ch('hist-1979-1c', 'Covertly back remnants', 'Restoration bid.', 'kinetic', 'proxy', 'REMNANT', [fx('escalation', 2, 'Civil war fuel'), fx('credibility', 1, 'Loyalty story'), fx('diplomacy', -2, 'Revolution hardens')]),
      ]),
      beat('hist-1979-2', 'Embassy crisis', 'Diplomats are seized. Options: quiet negotiation, sanctions, or a rescue attempt.', 'Each path risks the hostages differently.', [
        ch('hist-1979-2a', 'Open a multilateral negotiation track', 'Third-party mediation.', 'diplomatic', 'oman', 'MEDIATE', [fx('diplomacy', 2, 'Off-ramp'), fx('time', 1, 'Slow'), fx('domestic_support', -1, 'Looks passive')]),
        ch('hist-1979-2b', 'Freeze assets and sanction oil liftings', 'Pressure.', 'economic', 'dubai', 'SANCT', [fx('economic_pressure', 2, 'Squeeze'), fx('market_stability', -1, 'Oil spike'), fx('escalation', 1, 'Hardens captors')]),
        ch('hist-1979-2c', 'Authorize a high-risk rescue mission', 'Force recovery.', 'kinetic', 'base', 'RESCUE', [fx('credibility', 1, 'Action'), fx('escalation', 3, 'If it fails'), fx('civilian_cost', 2, 'Hostage risk')]),
      ]),
      beat('hist-1979-3', 'Gulf partners', 'Neighboring monarchies want new security guarantees and weapons.', 'Replacing one pillar with a chain of dependencies.', [
        ch('hist-1979-3a', 'Offer a regional security umbrella statement', 'Public shield.', 'diplomatic', 'riyadh', 'UMBRELLA', [fx('alliance_cohesion', 2, 'Partners held'), fx('deterrence', 2, 'Signal'), fx('escalation', 1, 'Tripwires grow')]),
        ch('hist-1979-3b', 'Arms packages without new treaties', 'Capacity only.', 'economic', 'oil', 'ARMS', [fx('deterrence', 1, 'Local teeth'), fx('escalation', 1, 'Arms race'), fx('market_stability', 1, 'Recycling petrodollars')]),
        ch('hist-1979-3c', 'Push a Gulf collective self-defense forum', 'Local ownership.', 'diplomatic', 'oman', 'FORUM', [fx('diplomacy', 2, 'Regional frame'), fx('alliance_cohesion', 1, 'If it works'), fx('credibility', 1, 'Not only bilateral')]),
      ]),
      beat('hist-1979-4', 'Doctrine aftershock', 'You must decide whether revolution ends the old dual-pillar strategy.', 'Strategy is grieving in public.', [
        ch('hist-1979-4a', 'Write a dual-containment posture', 'Pressure both rivals.', 'political', 'tehran', 'CONTAIN', [fx('deterrence', 2, 'Hard line'), fx('diplomacy', -1, 'Fewer talks'), fx('escalation', 1, 'Chronic tension')]),
        ch('hist-1979-4b', 'Keep a back channel for eventual normalization', 'Long game.', 'diplomatic', 'oman', 'CHANNEL', [fx('diplomacy', 2, 'Future path'), fx('credibility', -1, 'Hawks object'), fx('time', 1, 'Strategic patience')]),
        ch('hist-1979-4c', 'Pivot energy strategy away from the Gulf premium', 'Reduce exposure.', 'economic', 'oil', 'DIVERSE', [fx('market_stability', 1, 'Longer resilience'), fx('alliance_cohesion', -1, 'Partners feel dropped'), fx('credibility', 1, 'Structural fix')]),
      ]),
    ],
  }),
];
