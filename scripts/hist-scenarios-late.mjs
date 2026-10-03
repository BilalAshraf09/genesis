/** Scenarios 21–30 */
import { fx, ch, beat, scenario } from './hist-helpers.mjs';

export const late = [
  scenario({
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
    tension: 'Seize a peaceful opening without frightening a nuclear-armed neighbor into backlash.',
    beats: [
      beat('hist-1989-1', 'Opening night', 'Borders are porous. Do you surge police for order, celebrate publicly, or coordinate quietly with Moscow?', 'Images will outrun policy memos.', [
        ch('hist-1989-1a', 'Public celebration with calm policing guidance', 'Joy plus order.', 'civic', 'streets', 'OPEN', [fx('social_calm', 2, 'Orderly joy'), fx('domestic_support', 2, 'Historic moment'), fx('escalation', -1, 'Less panic')]),
        ch('hist-1989-1b', 'Quiet coordination call to Moscow first', 'Manage great-power nerves.', 'diplomatic', 'brussels', 'CALL', [fx('diplomacy', 2, 'Reassurance'), fx('credibility', -1, 'Looks hesitant'), fx('alliance_cohesion', 1, 'Alliance consulted')]),
        ch('hist-1989-1c', 'Freeze crossings until a legal protocol', 'Control first.', 'legal', 'parliament', 'FREEZE', [fx('governability', 1, 'Procedure'), fx('social_calm', -2, 'Crowd anger'), fx('polarization', 2, 'Missed moment')]),
      ]),
      beat('hist-1989-2', 'Recognition cascade', 'Eastern cabinets fall like dominoes. Partners ask whether to recognize new governments before elections.', 'Speed legitimizes; delay creates vacuums.', [
        ch('hist-1989-2a', 'Recognize after election calendars are set', 'Process condition.', 'diplomatic', 'ballot', 'ELECT', [fx('democratic_mandate', 2, 'Elections first'), fx('time', 1, 'Wait'), fx('diplomacy', 1, 'Standards')]),
        ch('hist-1989-2b', 'Immediate recognition to lock peaceful transitions', 'Facts forward.', 'political', 'capital', 'NOW', [fx('diplomacy', 2, 'Steadies transitions'), fx('credibility', 1, 'Decisive'), fx('norm_erosion', 1, 'Pre-election stamp')]),
        ch('hist-1989-2c', 'Tie recognition to alliance non-expansion assurances', 'Security bargain.', 'diplomatic', 'brussels', 'ASSURE', [fx('escalation', -1, 'Reassures East'), fx('alliance_cohesion', -1, 'Future fight seeded'), fx('diplomacy', 2, 'Grand bargain try')]),
      ]),
      beat('hist-1989-3', 'Monetary rush', 'Currency union talk accelerates. Economists warn of shock; politics wants unity symbols.', 'A currency can unify—or impoverish.', [
        ch('hist-1989-3a', 'Fast currency union with conversion generosity', 'Political price.', 'economic', 'parliament', 'DMFAST', [fx('eu_cohesion', 2, 'Unity symbol'), fx('market_stability', -1, 'Shock risk'), fx('domestic_support', 2, 'East cheered')]),
        ch('hist-1989-3b', 'Staged convertibility with reform benchmarks', 'Economists’ path.', 'economic', 'districts', 'STAGED', [fx('market_stability', 2, 'Less shock'), fx('time', 2, 'Slower unity'), fx('polarization', 1, 'Impatience')]),
        ch('hist-1989-3c', 'Keep separate currencies; deepen trade only', 'Minimal.', 'political', 'capital', 'TRADE', [fx('market_stability', 1, 'Buffers'), fx('eu_cohesion', -2, 'Thin unity'), fx('credibility', -1, 'Missed historic')]),
      ]),
      beat('hist-1989-4', 'Alliance map', 'Will a reunified center stay in the Western alliance? Neutrality proposals appear.', 'The security architecture is the real treaty.', [
        ch('hist-1989-4a', 'Reunified state remains in the alliance', 'No special status.', 'diplomatic', 'brussels', 'NATOIN', [fx('alliance_cohesion', 2, 'Clear'), fx('escalation', 1, 'Neighbor nervous'), fx('deterrence', 2, 'Continuity')]),
        ch('hist-1989-4b', 'Temporary non-nuclear special status in the East', 'Compromise geography.', 'diplomatic', 'ballot', 'SPECIAL', [fx('diplomacy', 2, 'Face-saver'), fx('deterrence', -1, 'Complexity'), fx('alliance_cohesion', 1, 'If accepted')]),
        ch('hist-1989-4c', 'Push a new pan-European security treaty first', 'Architecture before membership.', 'political', 'parliament', 'CSCE', [fx('norm_protection', 1, 'Inclusive order'), fx('time', 2, 'Slow'), fx('credibility', 1, 'Visionary')]),
      ]),
    ],
  }),

  scenario({
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
    tension: 'Midwife a peaceful breakup without loose nukes or famine politics.',
    beats: [
      beat('hist-1991-1', 'Putsch hours', 'Tanks in the capital. Do you back the elected center, stay silent, or prepare exile contacts?', 'Early bets become lasting alignments.', [
        ch('hist-1991-1a', 'Publicly back elected authorities', 'Clear side.', 'political', 'capital', 'BACK', [fx('democratic_mandate', 2, 'Elected line'), fx('escalation', 1, 'If putsch wins'), fx('credibility', 2, 'On record')]),
        ch('hist-1991-1b', 'Silent watch; protect embassy and citizens', 'Minimal.', 'diplomatic', 'brussels', 'WATCH', [fx('escalation', -1, 'Low profile'), fx('credibility', -1, 'Ambiguous'), fx('civilian_cost', -1, 'Staff focus')]),
        ch('hist-1991-1c', 'Quietly contact multiple factions', 'Hedge.', 'diplomatic', 'parliament', 'HEDGE', [fx('diplomacy', 1, 'Options'), fx('credibility', -2, 'If exposed'), fx('time', 1, 'Waits')]),
      ]),
      beat('hist-1991-2', 'Nuclear custody', 'Republics host warheads. You need inventory, dismantlement aid, and command clarity.', 'The most important map is the weapons map.', [
        ch('hist-1991-2a', 'Fund Nunn-Lugar style secure-and-dismantle aid', 'Pay for safety.', 'economic', 'districts', 'NUNN', [fx('deterrence', 1, 'Secure stockpiles'), fx('diplomacy', 2, 'Cooperative threat reduction'), fx('market_stability', -1, 'Spend')]),
        ch('hist-1991-2b', 'Demand central monopoly as recognition price', 'One finger on the button.', 'diplomatic', 'capital', 'MONOPOLY', [fx('credibility', 2, 'Clear standard'), fx('diplomacy', -1, 'Republic anger'), fx('escalation', -1, 'If it works')]),
        ch('hist-1991-2c', 'Offer security guarantees for denuclearizing republics', 'Budapest-style bargains.', 'diplomatic', 'ballot', 'GUARANT', [fx('norm_protection', 1, 'Nonproliferation'), fx('diplomacy', 2, 'Deal shape'), fx('deterrence', -1, 'Guarantees’ future test')]),
      ]),
      beat('hist-1991-3', 'Economic shock', 'Price liberalization proposals meet empty shelves. Aid can cushion—or be stolen.', 'Reform without food is a coup risk.', [
        ch('hist-1991-3a', 'Support shock therapy with a large stabilization fund', 'Fast markets.', 'economic', 'brussels', 'SHOCK', [fx('market_stability', 1, 'If it works'), fx('civilian_cost', 2, 'Painful transition'), fx('polarization', 2, 'Backlash politics')]),
        ch('hist-1991-3b', 'Gradual reforms with food aid corridors', 'Soft landing try.', 'civic', 'streets', 'FOOD', [fx('social_calm', 2, 'Cushion'), fx('time', 2, 'Slower markets'), fx('credibility', 1, 'Humane')]),
        ch('hist-1991-3c', 'Condition aid on anti-corruption monitors', 'Governance first.', 'legal', 'parliament', 'MONITOR', [fx('governability', 2, 'Accountability'), fx('diplomacy', -1, 'Sovereignty friction'), fx('market_stability', 1, 'Less theft')]),
      ]),
      beat('hist-1991-4', 'Recognition of independence', 'Republics ask for seats and borders. Russia asks you not to “encourage disintegration.”', 'You are choosing the successor map.', [
        ch('hist-1991-4a', 'Recognize independence on uti possidetis borders', 'Admin lines become international.', 'diplomatic', 'capital', 'UTI', [fx('norm_protection', 1, 'Border stability idea'), fx('diplomacy', 1, 'Clear rule'), fx('escalation', 1, 'Local disputes remain')]),
        ch('hist-1991-4b', 'Delay recognition pending union treaty salvage', 'One more try.', 'political', 'brussels', 'SALVAGE', [fx('time', 1, 'Delay'), fx('credibility', -1, 'Denies facts'), fx('escalation', -1, 'If it calms')]),
        ch('hist-1991-4c', 'Case-by-case recognition with minority treaties', 'Rights for recognition.', 'legal', 'ballot', 'MINORITY', [fx('norm_protection', 2, 'Rights link'), fx('time', 2, 'Complex'), fx('polarization', 1, 'Each case a fight')]),
      ]),
    ],
  }),

  scenario({
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
    tension: 'Stop contagion without writing a moral-hazard blank check.',
    beats: [
      beat('hist-1997-1', 'First bailout terms', 'A program draft demands austerity and bank closures. Streets may burn; markets may stabilize.', 'Conditionality is politics with decimals.', [
        ch('hist-1997-1a', 'Hard conditionality; front-load closures', 'Orthodox shock.', 'economic', 'fed', 'HARD', [fx('market_stability', 1, 'Creditor calm'), fx('civilian_cost', 2, 'Social pain'), fx('polarization', 2, 'Anti-IMF politics')]),
        ch('hist-1997-1b', 'Larger fund with softer fiscal path', 'Buy social peace.', 'economic', 'fed', 'SOFT', [fx('social_calm', 2, 'Less unrest'), fx('credibility', -1, 'Moral hazard fear'), fx('market_stability', 1, 'Liquidity')]),
        ch('hist-1997-1c', 'Stand aside; let the float purge', 'No program.', 'political', 'exchange', 'ASIDE', [fx('market_stability', -3, 'Deeper crash'), fx('credibility', 1, 'No bailout'), fx('civilian_cost', 3, 'Severe pain')]),
      ]),
      beat('hist-1997-2', 'Contagion hop', 'Korea and Indonesia wobble. Partners beg for a regional fund without Western vetoes.', 'Architecture fights break out mid-fire.', [
        ch('hist-1997-2a', 'Support an IMF-centered package only', 'One doctor.', 'diplomatic', 'fed', 'IMFONLY', [fx('credibility', 1, 'Central role'), fx('alliance_cohesion', -1, 'Asian resentment'), fx('market_stability', 1, 'Familiar tool')]),
        ch('hist-1997-2b', 'Endorse a regional swap network alongside IMF', 'Both layers.', 'diplomatic', 'em', 'SWAP', [fx('alliance_cohesion', 2, 'Regional ownership'), fx('market_stability', 2, 'More backstops'), fx('credibility', -1, 'Dilutes IMF brand')]),
        ch('hist-1997-2c', 'Bilateral swap to a key ally only', 'Pick winners.', 'economic', 'treasury', 'BILAT', [fx('alliance_cohesion', 1, 'One partner saved'), fx('market_stability', -1, 'Others panic'), fx('polarization', 1, 'Favoritism')]),
      ]),
      beat('hist-1997-3', 'Chaebol / connected firm', 'A national champion is insolvent. Closing it teaches markets; saving it teaches politics.', 'Lessons are expensive either way.', [
        ch('hist-1997-3a', 'Force restructuring with foreign participation', 'Open the books.', 'legal', 'desk', 'RESTRUCT', [fx('market_stability', 2, 'Cleanup'), fx('domestic_support', -2, 'Nationalist anger'), fx('credibility', 1, 'Rules')]),
        ch('hist-1997-3b', 'Bridge loan with political oversight board', 'Save and supervise.', 'political', 'treasury', 'BRIDGE', [fx('social_calm', 1, 'Jobs held'), fx('norm_erosion', 1, 'Bailout politics'), fx('market_stability', -1, 'Zombie risk')]),
        ch('hist-1997-3c', 'Order orderly failure with deposit protections', 'Let it die safely.', 'economic', 'exchange', 'FAIL', [fx('credibility', 2, 'No sacred firms'), fx('civilian_cost', 1, 'Job losses'), fx('market_stability', 1, 'Clears deadwood')]),
      ]),
      beat('hist-1997-4', 'Capital controls debate', 'Some economists urge temporary controls; markets call it heresy.', 'Heresy can be a tourniquet.', [
        ch('hist-1997-4a', 'Authorize temporary outflow controls', 'Stop the bleed.', 'legal', 'em', 'CONTROLS', [fx('market_stability', 2, 'Breathing room'), fx('credibility', -1, 'Orthodoxy break'), fx('time', 2, 'Policy space')]),
        ch('hist-1997-4b', 'Reject controls; hike rates to defend', 'Classic defense.', 'economic', 'fed', 'HIRE', [fx('credibility', 1, 'Orthodox'), fx('civilian_cost', 2, 'Credit crunch'), fx('market_stability', -1, 'If it fails')]),
        ch('hist-1997-4c', 'Voluntary rollover roundtables with banks', 'Jawbone creditors.', 'diplomatic', 'desk', 'ROLLOVER', [fx('diplomacy', 2, 'Private deal'), fx('market_stability', 1, 'If honored'), fx('time', 1, 'Negotiation')]),
      ]),
    ],
  }),

  scenario({
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
    tension: 'Punish perpetrators without owning an ungovernable forever war.',
    beats: [
      beat('hist-2001-1', 'War aim draft', 'Speechwriters want maximal language. Generals want achievable objectives.', 'Words become missions.', [
        ch('hist-2001-1a', 'Narrow aim: dismantle the attack network', 'Counterterror first.', 'political', 'capital', 'NARROW', [fx('credibility', 1, 'Achievable'), fx('escalation', -1, 'Limited'), fx('alliance_cohesion', 1, 'Easier coalition')]),
        ch('hist-2001-1b', 'Regime change plus democratic reconstruction', 'Maximal writ.', 'political', 'radio', 'REGIME', [fx('escalation', 2, 'Long war'), fx('norm_protection', 1, 'Democracy frame'), fx('civilian_cost', 2, 'Heavy footprint')]),
        ch('hist-2001-1c', 'Ultimatum to hosts with a short clock', 'One last diplomatic door.', 'diplomatic', 'border', 'ULTIM', [fx('diplomacy', 1, 'Formal chance'), fx('credibility', 2, 'Clear demand'), fx('time', -1, 'Short fuse')]),
      ]),
      beat('hist-2001-2', 'Neighbor leverage', 'A key neighbor offers intel and air access—while hedging with proxies.', 'You need the airport and distrust the ground.', [
        ch('hist-2001-2a', 'Accept cooperation; build parallel verification', 'Use and watch.', 'diplomatic', 'border', 'USE', [fx('alliance_cohesion', 1, 'Access gained'), fx('credibility', -1, 'Enables hedge'), fx('deterrence', 1, 'Ops enabled')]),
        ch('hist-2001-2b', 'Condition aid on verifiable proxy cutoffs', 'Hard bargain.', 'economic', 'mine', 'COND', [fx('economic_pressure', 2, 'Leverage'), fx('diplomacy', -1, 'Friction'), fx('alliance_cohesion', -1, 'Access risk')]),
        ch('hist-2001-2c', 'Minimize dependence; longer logistics chains', 'Autonomy.', 'kinetic', 'convoy', 'AUTON', [fx('credibility', 1, 'Independence'), fx('time', 2, 'Slower campaign'), fx('escalation', 1, 'Harder ops')]),
      ]),
      beat('hist-2001-3', 'Northern allies', 'Local armed factions offer to take cities. Human rights officers warn about tomorrow’s warlords.', 'Tactical friends become strategic problems.', [
        ch('hist-2001-3a', 'Partner tightly; plan DDR later', 'Win first.', 'kinetic', 'camp', 'PARTNER', [fx('escalation', -1, 'Faster fall of regime'), fx('norm_erosion', 2, 'Warlord empowerment'), fx('time', -1, 'Speed')]),
        ch('hist-2001-3b', 'Limit partners; prioritize international force presence', 'Own the aftermath.', 'diplomatic', 'capital', 'ISAF', [fx('norm_protection', 1, 'Accountability hope'), fx('alliance_cohesion', 2, 'Coalition heavy'), fx('civilian_cost', 1, 'Slower clearing')]),
        ch('hist-2001-3c', 'Airpower-heavy; minimal local patronage', 'Stand-off.', 'naval', 'radio', 'AIR', [fx('civilian_cost', 1, 'Strike risk'), fx('escalation', 1, 'Limited ground'), fx('credibility', -1, 'Thin control')]),
      ]),
      beat('hist-2001-4', 'Day-after governance', 'Kabul’s politics open. Do you midwife a big tent, a strongman shortcut, or a long Bonn-style process?', 'The political settlement is the real endstate.', [
        ch('hist-2001-4a', 'Big-tent conference with international guarantors', 'Inclusive process.', 'diplomatic', 'capital', 'BONN', [fx('diplomacy', 2, 'Settlement frame'), fx('governability', 1, 'Broad buy-in hope'), fx('time', 1, 'Slow')]),
        ch('hist-2001-4b', 'Back a security-first strong executive', 'Order over pluralism.', 'political', 'camp', 'STRONG', [fx('governability', 2, 'Short-term order'), fx('norm_erosion', 2, 'Centralized force'), fx('polarization', 1, 'Excluded factions')]),
        ch('hist-2001-4c', 'Light footprint; local arrangements only', 'Avoid ownership.', 'civic', 'border', 'LIGHT', [fx('escalation', -1, 'Smaller presence'), fx('credibility', -1, 'Vacuum risk'), fx('civilian_cost', 1, 'Local predation risk')]),
      ]),
    ],
  }),

  scenario({
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
    tension: 'Prevent systemic collapse without making failure costless for the powerful.',
    beats: [
      beat('hist-2008-1', 'Sunday night firm', 'A major investment bank cannot open Monday. Buyers want government guarantees.', 'Guarantees socialize risk in hours.', [
        ch('hist-2008-1a', 'Broker a sale with temporary public guarantees', 'Private face, public balance sheet.', 'economic', 'exchange', 'SALE', [fx('market_stability', 2, 'Opens Monday'), fx('credibility', -1, 'Bailout politics'), fx('norm_erosion', 1, 'Moral hazard')]),
        ch('hist-2008-1b', 'Refuse guarantees; allow orderly bankruptcy', 'Let it fail.', 'legal', 'treasury', 'FAIL', [fx('credibility', 2, 'No blank check'), fx('market_stability', -3, 'Contagion risk'), fx('polarization', 1, 'Populist fuel later')]),
        ch('hist-2008-1c', 'Temporary public conservatorship', 'Nationalize bridge.', 'political', 'fed', 'CONSERV', [fx('market_stability', 2, 'Stabilizes'), fx('governability', 1, 'Control'), fx('domestic_support', -2, 'Socialism charge')]),
      ]),
      beat('hist-2008-2', 'Interbank freeze', 'Banks stop lending to each other. Commercial paper dies.', 'The real economy is days from payroll failure.', [
        ch('hist-2008-2a', 'Unlimited liquidity to solvent banks', 'Open the window wide.', 'economic', 'fed', 'LIQUID', [fx('market_stability', 3, 'Thaws markets'), fx('credibility', -1, 'Inflation fears'), fx('time', 1, 'Buys days')]),
        ch('hist-2008-2b', 'Guarantee money-market funds', 'Stop the retail run.', 'economic', 'desk', 'MMF', [fx('social_calm', 2, 'Household calm'), fx('market_stability', 2, 'Stops run'), fx('norm_erosion', 1, 'New backstop')]),
        ch('hist-2008-2c', 'Targeted paper facility only; no broad guarantees', 'Narrow tool.', 'economic', 'treasury', 'PAPER', [fx('market_stability', 1, 'Partial'), fx('credibility', 1, 'Limited'), fx('civilian_cost', 1, 'Some payroll risk')]),
      ]),
      beat('hist-2008-3', 'Fiscal package fight', 'Congress wants limits, clawbacks, and homeowner relief. Banks want capital fast and quiet.', 'Speed and fairness collide.', [
        ch('hist-2008-3a', 'Capital injections with warrants and executive caps', 'Tough aid.', 'legal', 'treasury', 'CAPITAL', [fx('market_stability', 2, 'Recap'), fx('credibility', 1, 'Accountability'), fx('domestic_support', 1, 'Caps land')]),
        ch('hist-2008-3b', 'Asset purchases to clear toxic books', 'Buy the sludge.', 'economic', 'exchange', 'TARP', [fx('market_stability', 2, 'Clears uncertainty'), fx('credibility', -1, 'Opaque pricing'), fx('polarization', 1, 'Wall Street first')]),
        ch('hist-2008-3c', 'Homeowner restructuring mandate first', 'Main Street optics.', 'civic', 'em', 'HOMES', [fx('social_calm', 2, 'Households'), fx('market_stability', -1, 'Slower bank fix'), fx('domestic_support', 2, 'Fairness story')]),
      ]),
      beat('hist-2008-4', 'Global coordination', 'Partners want a joint statement on deposit guarantees and stimulus. Defecting looks tempting.', 'A crisis is a coordination game.', [
        ch('hist-2008-4a', 'Lead a synchronized guarantee and stimulus pledge', 'No beggar-thy-neighbor.', 'diplomatic', 'fed', 'SYNC', [fx('alliance_cohesion', 2, 'G-joint action'), fx('market_stability', 2, 'Confidence'), fx('diplomacy', 1, 'Leadership')]),
        ch('hist-2008-4b', 'National measures first; coordinate later', 'Own voters first.', 'political', 'treasury', 'NATIONAL', [fx('domestic_support', 1, 'Sovereignty'), fx('market_stability', -1, 'Fragmentation'), fx('alliance_cohesion', -1, 'Partners annoyed')]),
        ch('hist-2008-4c', 'Push banking union / joint supervision ideas', 'Institutional leap.', 'legal', 'desk', 'UNION', [fx('eu_cohesion', 2, 'If Europe follows'), fx('time', 2, 'Slow build'), fx('credibility', 1, 'Architecture')]),
      ]),
    ],
  }),

  scenario({
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
    tension: 'Support dignity politics without owning chaos—or backing endless strongmen.',
    beats: [
      beat('hist-2011-1', 'First ally wobbles', 'A long-standing partner uses live fire on crowds. Your public line will be replayed for years.', 'Silence is a side.', [
        ch('hist-2011-1a', 'Publicly condemn violence; urge orderly transition', 'Break with the old.', 'diplomatic', 'port', 'CONDEMN', [fx('norm_protection', 2, 'Rights line'), fx('alliance_cohesion', -2, 'Other autocrats nervous'), fx('credibility', 1, 'Clear')]),
        ch('hist-2011-1b', 'Private pressure; public caution', 'Preserve channel.', 'diplomatic', 'canal', 'PRIVATE', [fx('diplomacy', 1, 'Channel held'), fx('credibility', -1, 'Looks complicit'), fx('time', 1, 'Options')]),
        ch('hist-2011-1c', 'Back the partner as bulwark against chaos', 'Order narrative.', 'political', 'proxy', 'ORDER', [fx('escalation', -1, 'If it holds'), fx('norm_erosion', 2, 'Repression enabled'), fx('polarization', 2, 'Street rage')]),
      ]),
      beat('hist-2011-2', 'No-fly debate', 'A coastal civil war triggers calls for air intervention under humanitarian cover.', 'Airpower can stop a massacre and start an ownership problem.', [
        ch('hist-2011-2a', 'Support a UN-mandated no-fly / civilian protection mission', 'Multilateral force.', 'kinetic', 'escort', 'NOFLY', [fx('norm_protection', 2, 'Protection claim'), fx('escalation', 2, 'War joined'), fx('alliance_cohesion', 1, 'If authorized')]),
        ch('hist-2011-2b', 'Arms and intel to rebels only', 'Indirect.', 'economic', 'proxy', 'ARMS', [fx('escalation', 2, 'Proxy war'), fx('credibility', 1, 'Not absent'), fx('civilian_cost', 1, 'Weapon spread')]),
        ch('hist-2011-2c', 'Refuse intervention; maximize humanitarian corridors', 'Aid not bombs.', 'civic', 'port', 'AID', [fx('civilian_cost', -1, 'Some relief'), fx('credibility', -1, 'Inaction charge'), fx('diplomacy', 1, 'Humanitarian frame')]),
      ]),
      beat('hist-2011-3', 'Islamist victories at ballot boxes', 'Elections produce winners your publics distrust. Do you respect results, condition aid, or cultivate deep-state alternatives?', 'Democracy is a stress test of your preferences.', [
        ch('hist-2011-3a', 'Recognize results; condition aid on rights benchmarks', 'Engage and bind.', 'diplomatic', 'canal', 'ENGAGE', [fx('democratic_mandate', 2, 'Respect votes'), fx('norm_protection', 1, 'Rights link'), fx('domestic_support', -1, 'Home skeptics')]),
        ch('hist-2011-3b', 'Freeze aid until cabinets exclude hardliners', 'Shape politics.', 'economic', 'insurer', 'FREEZE', [fx('economic_pressure', 2, 'Leverage'), fx('democratic_mandate', -2, 'Undercuts vote'), fx('polarization', 2, 'Foreign hand charge')]),
        ch('hist-2011-3c', 'Quietly back secular security elites', 'Insurance policy.', 'political', 'proxy', 'DEEP', [fx('governability', 1, 'Short order'), fx('norm_erosion', 2, 'Anti-democratic'), fx('credibility', -1, 'Hypocrisy')]),
      ]),
      beat('hist-2011-4', 'Migration and energy aftershock', 'Flows across the sea and price spikes hit your domestic politics.', 'Foreign policy becomes home politics overnight.', [
        ch('hist-2011-4a', 'EU-style burden-sharing and search-and-rescue surge', 'Collective response.', 'civic', 'chokepoint', 'RESCUE', [fx('eu_cohesion', 2, 'Shared burden'), fx('social_calm', 1, 'Managed flows'), fx('civilian_cost', -1, 'Lives saved')]),
        ch('hist-2011-4b', 'Bilateral interception deals with origin/transit states', 'Externalize.', 'diplomatic', 'port', 'DEALS', [fx('social_calm', 1, 'Lower arrivals'), fx('norm_erosion', 1, 'Rights risk'), fx('credibility', -1, 'Cynical optics')]),
        ch('hist-2011-4c', 'Strategic petroleum + targeted resettlement quota', 'Dual cushion.', 'economic', 'insurer', 'DUAL', [fx('market_stability', 2, 'Energy calm'), fx('liberal_trust', 1, 'Quota openness'), fx('domestic_support', -1, 'Quota politics')]),
      ]),
    ],
  }),

  scenario({
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
    tension: 'Impose costs for annexation without a direct great-power war.',
    beats: [
      beat('hist-2014-1', 'First 72 hours', 'Facts on the ground harden. Options: sanctions sprint, military deployment to allies, or a diplomatic contact group.', 'Speed signals whether borders still matter.', [
        ch('hist-2014-1a', 'Immediate targeted sanctions on decision-makers', 'Name and freeze.', 'economic', 'brussels', 'SANCT', [fx('economic_pressure', 2, 'Personal cost'), fx('credibility', 1, 'Fast'), fx('escalation', -1, 'Non-kinetic')]),
        ch('hist-2014-1b', 'Surge reassurance forces to exposed allies', 'Tripwire politics.', 'kinetic', 'streets', 'SURGE', [fx('deterrence', 2, 'Alliance real'), fx('alliance_cohesion', 2, 'Reassured'), fx('escalation', 1, 'Posture up')]),
        ch('hist-2014-1c', 'Propose an emergency contact group including the aggressor', 'Talk first.', 'diplomatic', 'capital', 'CONTACT', [fx('diplomacy', 2, 'Table'), fx('credibility', -1, 'Looks soft'), fx('time', 1, 'Process')]),
      ]),
      beat('hist-2014-2', 'Energy leverage', 'Pipeline politics cut both ways. Your industry fears winter; partners fear dependence.', 'Sanctions without energy strategy leak.', [
        ch('hist-2014-2a', 'Exempt energy; hit finance and tech', 'Surgical pain.', 'economic', 'parliament', 'EXEMPT', [fx('market_stability', 1, 'Winter cushion'), fx('economic_pressure', 1, 'Partial'), fx('credibility', -1, 'Half-measure charge')]),
        ch('hist-2014-2b', 'Phase energy import cuts with shared storage', 'Collective wean.', 'diplomatic', 'brussels', 'WEAN', [fx('alliance_cohesion', 2, 'Shared cost'), fx('economic_pressure', 2, 'Real squeeze'), fx('market_stability', -1, 'Price risk')]),
        ch('hist-2014-2c', 'Threaten full embargo immediately', 'Maximal.', 'economic', 'districts', 'EMBARGO', [fx('economic_pressure', 3, 'Hard hit'), fx('market_stability', -3, 'Shock'), fx('domestic_support', -2, 'Bills spike')]),
      ]),
      beat('hist-2014-3', 'Arming decision', 'The partner asks for defensive heavy weapons. Some allies fear escalation; others fear another frozen defeat.', 'Weapons are a strategy, not a gesture.', [
        ch('hist-2014-3a', 'Provide defensive arms with training', 'Raise cost of advance.', 'kinetic', 'streets', 'ARMS', [fx('deterrence', 2, 'Defense aided'), fx('escalation', 1, 'Aid as stake'), fx('alliance_cohesion', 1, 'If coordinated')]),
        ch('hist-2014-3b', 'Non-lethal aid only', 'Helmets and radars.', 'diplomatic', 'ballot', 'NLETHAL', [fx('escalation', -1, 'Lower'), fx('credibility', -1, 'Thin support'), fx('civilian_cost', -1, 'Some protection')]),
        ch('hist-2014-3c', 'Condition arms on negotiation track participation', 'Link tracks.', 'diplomatic', 'capital', 'LINK', [fx('diplomacy', 2, 'Talks leverage'), fx('deterrence', -1, 'Slower aid'), fx('alliance_cohesion', -1, 'Partner frustration')]),
      ]),
      beat('hist-2014-4', 'Minsk-like bargain', 'A ceasefire draft freezes lines and promises political status talks. Spoilers abound.', 'A bad freeze can become the new border.', [
        ch('hist-2014-4a', 'Back the ceasefire with monitoring mission', 'Stop the killing first.', 'diplomatic', 'brussels', 'MONITOR', [fx('escalation', -2, 'Quieter lines'), fx('diplomacy', 2, 'Process'), fx('credibility', -1, 'Frozen gains')]),
        ch('hist-2014-4b', 'Reject while occupation stands', 'No legitimizing.', 'political', 'parliament', 'REJECT', [fx('norm_protection', 2, 'No reward'), fx('escalation', 1, 'Fight continues'), fx('civilian_cost', 1, 'Ongoing toll')]),
        ch('hist-2014-4c', 'Accept freeze; escalate sanctions if violated', 'Snapback logic.', 'economic', 'districts', 'SNAP', [fx('economic_pressure', 1, 'Leverage held'), fx('diplomacy', 1, 'Conditional'), fx('time', 1, 'Tests compliance')]),
      ]),
    ],
  }),

  scenario({
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
    tension: 'Save lives and livelihoods without shattering democratic consent.',
    beats: [
      beat('hist-2020-1', 'Restriction trigger', 'Hospitals near capacity. Options: targeted limits, wide stay-home orders, or voluntary guidance only.', 'Timing decides whether policy looks prudent or panicked.', [
        ch('hist-2020-1a', 'Wide stay-home order with essential carve-outs', 'Hard brake.', 'civic', 'plaza', 'LOCK', [fx('civilian_cost', -2, 'Lives saved likely'), fx('market_stability', -2, 'Output shock'), fx('social_calm', -1, 'Compliance strain')]),
        ch('hist-2020-1b', 'Targeted limits by age/risk and venue', 'Surgical.', 'legal', 'court', 'TARGET', [fx('civilian_cost', -1, 'Partial protection'), fx('market_stability', -1, 'Less shock'), fx('credibility', 1, 'Proportionate try')]),
        ch('hist-2020-1c', 'Guidance only; protect hospitals via surge funding', 'Voluntary.', 'economic', 'imf', 'GUIDE', [fx('liberal_trust', 1, 'Freedom frame'), fx('civilian_cost', 2, 'Higher spread risk'), fx('domestic_support', 1, 'Anti-mandate voters')]),
      ]),
      beat('hist-2020-2', 'Fiscal bridge', 'Unemployment spikes. Do you send cash broadly, bail sectors, or insist on austerity to protect debt markets?', 'The cheque is a social contract.', [
        ch('hist-2020-2a', 'Broad household cash transfers', 'People first.', 'economic', 'capital', 'CASH', [fx('social_calm', 2, 'Households held'), fx('domestic_support', 2, 'Visible help'), fx('market_stability', -1, 'Debt rise')]),
        ch('hist-2020-2b', 'Sector bailouts with worker retention conditions', 'Firms as vehicles.', 'economic', 'port', 'SECTOR', [fx('market_stability', 2, 'Payrolls'), fx('credibility', -1, 'Corporate aid optics'), fx('governability', 1, 'Admin channel')]),
        ch('hist-2020-2c', 'Narrow aid; prioritize debt and inflation optics', 'Hard money story.', 'political', 'imf', 'AUSTER', [fx('credibility', 1, 'Bond calm'), fx('civilian_cost', 2, 'Hardship'), fx('polarization', 2, 'Anger')]),
      ]),
      beat('hist-2020-3', 'Information integrity', 'Rumors and foreign influence mix with genuine uncertainty. Platforms ask for guidance.', 'Censorship fears versus harm reduction.', [
        ch('hist-2020-3a', 'Public health board labels; no criminal speech rules', 'Transparency tools.', 'civic', 'plaza', 'LABEL', [fx('credibility', 1, 'Clear science'), fx('liberal_trust', 1, 'Limited coercion'), fx('polarization', 1, 'Label wars')]),
        ch('hist-2020-3b', 'Emergency takedown mandates for medical falsehoods', 'Hard moderation.', 'legal', 'court', 'TAKE', [fx('social_calm', 1, 'Less panic content'), fx('liberal_trust', -2, 'Speech fear'), fx('polarization', 2, 'Censorship narrative')]),
        ch('hist-2020-3c', 'Flood the zone with official briefings only', 'Compete, don’t ban.', 'political', 'capital', 'BRIEF', [fx('credibility', 1, 'If consistent'), fx('time', 1, 'Cadence'), fx('polarization', -1, 'If trusted')]),
      ]),
      beat('hist-2020-4', 'Exit and equity', 'Vaccines or treatments near. Distribution politics will define trust for a generation.', 'The last mile is the legitimacy mile.', [
        ch('hist-2020-4a', 'Risk-priority schedule with global COVAX contribution', 'Domestic + global.', 'diplomatic', 'imf', 'COVAX', [fx('norm_protection', 1, 'Global equity'), fx('civilian_cost', -2, 'Protects vulnerable'), fx('domestic_support', -1, 'Nationalist critique')]),
        ch('hist-2020-4b', 'Domestic-first until surplus', 'Own citizens first.', 'political', 'farm', 'FIRST', [fx('domestic_support', 2, 'National priority'), fx('alliance_cohesion', -2, 'Partners bitter'), fx('credibility', -1, 'Global leadership hit')]),
        ch('hist-2020-4c', 'Lottery plus essential-worker priority hybrid', 'Fairness theater that works.', 'civic', 'plaza', 'LOTTERY', [fx('social_calm', 1, 'Perceived fairness'), fx('credibility', 1, 'Transparent'), fx('polarization', -1, 'Less queue rage')]),
      ]),
    ],
  }),

  scenario({
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
    tension: 'Deterrence without open war; energy markets without appearing to abandon partners.',
    beats: [
      beat('hist-2024-1', 'First move after the seizure', 'A commercial tanker linked to a partner flag is held near the Strait. Your military can interdict the escort, your diplomats can open a quiet channel, or you can freeze related assets and wait for market pressure to speak.', 'Speed signals resolve; restraint preserves off-ramps; economic pressure is slower but harder to reverse.', [
        ch('hist-2024-1a', 'Authorize a limited interdiction escort', 'Naval assets shadow and challenge the holding force. Rules of engagement stay defensive.', 'naval', 'strait', 'ESCORT', [fx('deterrence', 2, 'Shows willingness to contest the maritime commons'), fx('escalation', 2, 'Raises risk of a kinetic incident at sea'), fx('alliance_cohesion', 1, 'Reassures partners who feared paralysis')]),
        ch('hist-2024-1b', 'Open a quiet back channel', 'Use a third-party capital to propose release in exchange for de-escalatory guarantees.', 'diplomatic', 'tehran', 'CHANNEL', [fx('diplomacy', 2, 'Keeps a negotiated off-ramp alive'), fx('credibility', -1, 'Some partners read delay as weakness'), fx('escalation', -1, 'Lowers near-term kinetic risk')]),
        ch('hist-2024-1c', 'Freeze linked financial conduits', 'Target insurers, ship managers, and payment rails without new kinetic posture.', 'economic', 'dubai', 'FREEZE', [fx('economic_pressure', 2, 'Squeezes the seizure’s logistics chain'), fx('civilian_cost', 1, 'Raises friction for regional trade more broadly'), fx('time', 1, 'Buys days while markets reprice risk')]),
      ]),
      beat('hist-2024-2', 'Energy corridor panic', 'Benchmark crude jumps. Domestic industry lobbies for emergency releases from strategic reserves. Partners ask whether you will join a coordinated naval traffic corridor.', 'Market calm can reduce crisis leverage for spoilers — or signal that you will always absorb the shock.', [
        ch('hist-2024-2a', 'Join a multinational traffic corridor', 'Share escorts and routing intel with willing partners under a temporary charter.', 'naval', 'hormuz', 'CORRIDOR', [fx('alliance_cohesion', 2, 'Locks partners into a shared operational frame'), fx('deterrence', 1, 'Raises the cost of further seizures'), fx('escalation', 1, 'Puts more ships in a contested lane')]),
        ch('hist-2024-2b', 'Release strategic petroleum quietly', 'Calm prices without a public military announcement.', 'economic', 'oil', 'SPR', [fx('market_stability', 2, 'Blunts panic premiums'), fx('credibility', -1, 'Adversaries may treat you as shock absorber'), fx('domestic_support', 1, 'Eases pressure from industry and consumers')]),
        ch('hist-2024-2c', 'Hold reserves; demand partner burden-sharing', 'Condition any release on matching contributions and a joint statement of red lines.', 'diplomatic', 'riyadh', 'SHARE', [fx('alliance_cohesion', -1, 'Frays goodwill among energy-importing partners'), fx('credibility', 1, 'Signals you will not underwrite alone'), fx('market_stability', -1, 'Leaves volatility unresolved longer')]),
      ]),
      beat('hist-2024-3', 'Proxy strike attribution', 'A drone attack hits a logistics node used by your contractors. Intelligence leans toward a proxy network with Iranian material support, but the chain of command is contested.', 'Public attribution shapes domestic politics; private signaling shapes adversary calculations.', [
        ch('hist-2024-3a', 'Attribute publicly and threaten calibrated response', 'Name the supporting network and set a 48-hour window for de-escalation.', 'diplomatic', 'base', 'ATTRIB', [fx('credibility', 2, 'Creates a clear public standard'), fx('escalation', 2, 'Narrows room to climb down quietly'), fx('domestic_support', 1, 'Satisfies calls for visibility')]),
        ch('hist-2024-3b', 'Share evidence privately; demand proxy restraint', 'Use intelligence channels and a mediator to warn without locking into a public test.', 'diplomatic', 'tehran', 'PRIVATE', [fx('diplomacy', 2, 'Preserves deniable off-ramps'), fx('deterrence', 1, 'Signals knowledge without spectacle'), fx('domestic_support', -1, 'Looks opaque to a rattled public')]),
        ch('hist-2024-3c', 'Strike a related proxy depot', 'Limited-duration action against a warehouse assessed as low-civilian-risk.', 'kinetic', 'proxy', 'STRIKE', [fx('deterrence', 2, 'Imposes immediate cost on the network'), fx('escalation', 3, 'Invites reciprocal targeting cycles'), fx('civilian_cost', 1, 'Even “limited” strikes risk spillover')]),
      ]),
      beat('hist-2024-4', 'Off-ramp window', 'A regional intermediary offers a package: tanker release, temporary pause on proxy launches, and technical talks on maritime notifications — if you pause new sanctions designations for 30 days.', 'Accepting looks like bargaining with coercion; refusing may close the only near-term exit.', [
        ch('hist-2024-4a', 'Accept with verification milestones', 'Pause designations only after staged releases and third-party monitoring.', 'diplomatic', 'oman', 'DEAL', [fx('diplomacy', 3, 'Converts crisis into sequenced bargaining'), fx('credibility', -1, 'Hardliners at home call it concession'), fx('escalation', -2, 'Lowers odds of immediate wider war')]),
        ch('hist-2024-4b', 'Reject; keep sanctions tempo', 'Treat the offer as an attempt to buy time while consolidating gains at sea.', 'economic', 'dubai', 'HOLD', [fx('economic_pressure', 2, 'Maintains coercive continuity'), fx('escalation', 1, 'Leaves kinetic pathways open'), fx('diplomacy', -2, 'Burns the intermediary’s political capital')]),
        ch('hist-2024-4c', 'Counter with a narrower swap', 'Tanker release now for a shorter sanctions pause and a maritime hotline only.', 'diplomatic', 'oman', 'SWAP', [fx('diplomacy', 1, 'Keeps talks alive without full buy-in'), fx('time', 1, 'Creates another negotiation cycle'), fx('alliance_cohesion', 1, 'Partners can endorse a limited deal')]),
      ]),
    ],
  }),

  scenario({
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
    tension: 'Governability versus democratic norms; EU cohesion versus domestic mandate claims.',
    beats: [
      beat('hist-2025-1', 'Coalition arithmetic', 'Without the far-right party, you lack a majority. They demand the interior ministry and a freeze on new asylum reception capacity. Smaller liberal partners threaten to walk if you concede either.', 'Office without norms risks hollow legitimacy; purity without numbers risks snap elections.', [
        ch('hist-2025-1a', 'Grand bargain with red-line ministries', 'Offer junior portfolios but keep interior, justice, and foreign affairs out of their hands.', 'political', 'capital', 'CABINET', [fx('governability', 2, 'Secures a working majority'), fx('norm_erosion', 1, 'Normalizes the bloc inside cabinet politics'), fx('liberal_trust', -1, 'Strains partners who wanted a cordon')]),
        ch('hist-2025-1b', 'Minority government with issue-by-issue votes', 'Refuse a formal deal; negotiate budgets and security votes ad hoc.', 'political', 'capital', 'MINORITY', [fx('norm_protection', 2, 'Avoids formal cohabitation with the far right'), fx('governability', -2, 'Every bill becomes a crisis'), fx('market_stability', -1, 'Investors price political fragility')]),
        ch('hist-2025-1c', 'Force a second election', 'Tell the president no stable democratic majority exists and seek a fresh mandate.', 'civic', 'ballot', 'REELECT', [fx('democratic_mandate', 1, 'Returns the question to voters'), fx('polarization', 2, 'Campaigns harden identities further'), fx('far_right_momentum', 1, 'Gives them months as opposition tribune')]),
      ]),
      beat('hist-2025-2', 'Street and speech', 'After a far-right rally, clashes injure protesters and two officers. Civil society demands a ban on the party’s youth wing. The party calls it a political persecution test.', 'Rule-of-law tools used unevenly can feed the narrative they campaign on.', [
        ch('hist-2025-2a', 'Independent inquiry + targeted bans on violent cadres', 'Separate criminal accountability from collective political bans.', 'legal', 'streets', 'INQUIRE', [fx('norm_protection', 2, 'Centers evidence over spectacle'), fx('social_calm', 1, 'Offers both camps a procedural path'), fx('time', 1, 'Slows politics while facts are gathered')]),
        ch('hist-2025-2b', 'Broad organizational ban push', 'Ask courts to dissolve the youth wing for pattern of intimidation.', 'legal', 'streets', 'BAN', [fx('norm_protection', 1, 'Draws a hard line against street coercion'), fx('polarization', 2, 'Fuels martyr narratives'), fx('liberal_trust', 1, 'Reassures threatened communities short-term')]),
        ch('hist-2025-2c', 'De-escalate rhetoric; expand local mediation', 'Quiet policing posture and funded local dialogue teams in hot districts.', 'civic', 'districts', 'MEDIATE', [fx('social_calm', 2, 'Reduces immediate confrontation cycles'), fx('credibility', -1, 'Critics call it soft on intimidation'), fx('far_right_momentum', 1, 'They claim the state blinked')]),
      ]),
      beat('hist-2025-3', 'Brussels pressure', 'The Commission warns that proposed asylum freezes may breach common rules. Farmers and logistics firms want you to protect EU funds. Your far-right interlocutors want a sovereignty confrontation.', 'EU funds and legal standing are leverage — and a domestic campaign prop.', [
        ch('hist-2025-3a', 'Negotiate a compliance timeline', 'Trade phased reception capacity for technical assistance and fund certainty.', 'diplomatic', 'brussels', 'COMPLY', [fx('eu_cohesion', 2, 'Keeps you inside the legal community'), fx('governability', 1, 'Avoids an immediate funds crisis'), fx('far_right_momentum', -1, 'Undercuts their confrontation script')]),
        ch('hist-2025-3b', 'Public clash over “national competence”', 'Frame Brussels as overriding the election; dare infringement.', 'political', 'brussels', 'CLASH', [fx('far_right_momentum', 2, 'Aligns executive branding with their voters'), fx('eu_cohesion', -3, 'Opens a lasting rule-of-law fight'), fx('market_stability', -1, 'Risks funding and investment nerves')]),
        ch('hist-2025-3c', 'Quiet legal tweak; loud domestic theater', 'Meet minimum legal thresholds while messaging toughness at home.', 'political', 'capital', 'THEATER', [fx('eu_cohesion', 1, 'Technically stays compliant'), fx('credibility', -1, 'Both camps may call it cynical'), fx('polarization', 1, 'Theater still heats the information space')]),
      ]),
      beat('hist-2025-4', 'Budget night', 'The finance bill needs votes. The far-right offers support if you cut civic-education grants and raise police overtime budgets. Liberals demand the opposite trade.', 'One night can redefine who owns the state’s coercive and civic tools.', [
        ch('hist-2025-4a', 'Pass a narrow confidence budget', 'Strip culture-war riders; fund core services and a review commission.', 'political', 'parliament', 'NARROW', [fx('governability', 2, 'Keeps the lights on without an identity bargain'), fx('liberal_trust', 1, 'Avoids gutting civic programs'), fx('far_right_momentum', -1, 'Denies them a trophy in the bill')]),
        ch('hist-2025-4b', 'Take the far-right security package', 'Accept overtime surge and civic-grant cuts to lock votes.', 'political', 'parliament', 'SECURITY', [fx('governability', 2, 'Gets the bill through'), fx('norm_erosion', 2, 'Trades civic capacity for order optics'), fx('social_calm', -1, 'Minority organizations feel abandoned')]),
        ch('hist-2025-4c', 'Risk defeat; mobilize street legitimacy', 'Refuse both extremes and dare a failed vote while calling supporters to peaceful vigils.', 'civic', 'streets', 'VIGIL', [fx('democratic_mandate', 1, 'Frames integrity over dealmaking'), fx('governability', -3, 'May collapse the government project'), fx('polarization', 2, 'Moves conflict from parliament to streets')]),
      ]),
    ],
  }),
];
