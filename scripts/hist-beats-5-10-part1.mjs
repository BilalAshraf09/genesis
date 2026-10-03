/** Extra beats 5–10 for each historical scenario (deepening crisis arc). */
import { fx, ch, beat } from './hist-helpers.mjs';

/** @type {Record<string, ReturnType<typeof beat>[]>} */
export const extraBeatsByScenarioId = {
  'hist-1905-port-arthur': [
    beat('hist-1905-5', 'Naval incident fog', 'A collier and a destroyer exchange warning shots near a disputed roadstead. Admiralties demand ROE clarity before dawn cables harden into ultimata.', 'An unclear incident can outrun your mediation track.', [
      ch('hist-1905-5a', 'Issue restrictive ROE and notify both fleets', 'Bound observation with no pursuit; copy both capitals.', 'naval', 'fleet', 'ROE', [fx('escalation', -2, 'Lowers kinetic odds'), fx('diplomacy', 1, 'Transparent restraint'), fx('deterrence', -1, 'Presence looks softer')]),
      ch('hist-1905-5b', 'Escalate observation to armed escort of neutrals', 'Protect commercial flags; accept higher contact risk.', 'naval', 'strait', 'ESCORT', [fx('deterrence', 2, 'Shows teeth at sea'), fx('escalation', 2, 'Incident ladder rises'), fx('market_stability', 1, 'Trade reassured')]),
      ch('hist-1905-5c', 'Demand joint inquiry before any further sorties', 'Freeze narrative with a shared fact-finding clock.', 'diplomatic', 'cable', 'INQUIRE', [fx('time', 2, 'Buys investigative days'), fx('credibility', 1, 'Process looks fair'), fx('alliance_cohesion', -1, 'Hawks call delay')]),
    ]),
    beat('hist-1905-6', 'Domestic loan revolt', 'Parliamentarians and papers attack “Asian adventures” financed by your banks. Finance ministry warns of a confidence wobble if you stay silent.', 'Home politics can yank the lending lever from your hand.', [
      ch('hist-1905-6a', 'Brief a closed-session economic case for mediation', 'Trade continuity as the public frame.', 'political', 'capital_a', 'BRIEF', [fx('domestic_support', 1, 'Some oxygen'), fx('diplomacy', 1, 'Links home to table'), fx('credibility', 1, 'Looks deliberate')]),
      ch('hist-1905-6b', 'Announce a temporary war-loan moratorium at home', 'Force markets and cabinets to feel scarcity.', 'economic', 'cable', 'MORAT', [fx('economic_pressure', 2, 'Squeezes belligerents'), fx('market_stability', -2, 'Domestic nerves'), fx('civilian_cost', 1, 'Savings scare')]),
      ch('hist-1905-6c', 'Let the press run while you hold the line privately', 'Absorb heat; change nothing publicly.', 'political', 'capital_b', 'ABSORB', [fx('time', 1, 'Avoids hasty pivot'), fx('domestic_support', -2, 'Anger builds'), fx('credibility', -1, 'Looks evasive')]),
    ]),
    beat('hist-1905-7', 'Ally asks for a fleet signal', 'A partner capital wants a joint naval demonstration “to keep the settlement honest.” Your admiralty is split between solidarity and entanglement.', 'Visible solidarity can lock you into enforcement.', [
      ch('hist-1905-7a', 'Offer a time-limited joint observation patrol', 'Shared presence, no boarding mandate.', 'naval', 'fleet', 'JOINT', [fx('alliance_cohesion', 2, 'Partner reassured'), fx('deterrence', 1, 'Combined signal'), fx('escalation', 1, 'More hulls in theater')]),
      ch('hist-1905-7b', 'Refuse demonstration; propose a commercial open-door note', 'Lead with trade norms instead of guns.', 'diplomatic', 'island', 'NOTE', [fx('market_stability', 2, 'Commercial frame'), fx('alliance_cohesion', -1, 'Partner feels alone'), fx('diplomacy', 1, 'Wider table')]),
      ch('hist-1905-7c', 'Commit only to intelligence sharing from cable stations', 'Help without hulls.', 'diplomatic', 'cable', 'INTEL', [fx('alliance_cohesion', 1, 'Useful but limited'), fx('time', 1, 'Keeps options'), fx('deterrence', -1, 'No force signal')]),
    ]),
    beat('hist-1905-8', 'Conflicting casualty cables', 'Two rival wires disagree on whether a coastal town was shelled. Your press and partners demand a sided narrative before talks resume.', 'Information fog is a weapon; owning a false map costs more later.', [
      ch('hist-1905-8a', 'Publish only verified, timestamped facts', 'Starve rumor; accept looking slow.', 'diplomatic', 'cable', 'FACTS', [fx('credibility', 2, 'Truth discipline'), fx('time', 1, 'Slower spin cycle'), fx('domestic_support', -1, 'Press impatient')]),
      ch('hist-1905-8b', 'Amplify the version that favors your mediation brief', 'Shape the room even if evidence is thin.', 'political', 'capital_a', 'SHAPE', [fx('diplomacy', 1, 'Narrative leverage'), fx('credibility', -2, 'Risk of exposure'), fx('escalation', 1, 'Hardens blame')]),
      ch('hist-1905-8c', 'Convene a three-power telegraph board', 'Force shared sourcing rules mid-crisis.', 'diplomatic', 'capital_b', 'BOARD', [fx('alliance_cohesion', 1, 'Process shared'), fx('diplomacy', 2, 'Rebuilds table'), fx('time', -1, 'Coordination tax')]),
    ]),
    beat('hist-1905-9', 'Treaty off-ramp window', 'A 72-hour pause appears: both sides hint they can accept a corridor-plus-indemnity formula if you guarantee quiet implementation.', 'Windows close when prestige speeches begin.', [
      ch('hist-1905-9a', 'Guarantee quiet implementation with observers only', 'No flags, no occupation rhetoric.', 'diplomatic', 'strait', 'OBSERV', [fx('diplomacy', 3, 'Locks a bargain'), fx('escalation', -1, 'Lowers heat'), fx('credibility', 1, 'Honest broker')]),
      ch('hist-1905-9b', 'Demand a public apology clause before signing', 'Satisfy domestic honor politics.', 'political', 'capital_a', 'APOLOGY', [fx('domestic_support', 2, 'Honor framed'), fx('diplomacy', -2, 'May kill the window'), fx('time', -1, 'Deadline risk')]),
      ch('hist-1905-9c', 'Tie the formula to a short-term credit bridge', 'Money makes the map stick.', 'economic', 'cable', 'BRIDGE', [fx('market_stability', 2, 'Settlement finance'), fx('diplomacy', 1, 'Practical glue'), fx('economic_pressure', 1, 'Conditional cash')]),
    ]),
    beat('hist-1905-10', 'Settlement enforcement endgame', 'Signature is near. You must choose how hard to police the new map—and whether your navy becomes its guarantor.', 'Enforcement defines whether peace is architecture or paper.', [
      ch('hist-1905-10a', 'Accept a limited naval guarantee for the corridor', 'Time-bounded patrol authority.', 'naval', 'fleet', 'GUARANT', [fx('deterrence', 2, 'Map has teeth'), fx('alliance_cohesion', 1, 'Shared duty'), fx('escalation', 1, 'Longer entanglement')]),
      ch('hist-1905-10b', 'Refuse force guarantees; push commercial arbitration', 'Courts and tariffs, not hulls.', 'legal', 'island', 'ARB', [fx('market_stability', 2, 'Rule-based trade'), fx('deterrence', -1, 'Weak enforcement'), fx('diplomacy', 1, 'Legal path')]),
      ch('hist-1905-10c', 'Declare mission complete and withdraw influence', 'Exit before the next quarrel.', 'political', 'capital_b', 'EXIT', [fx('time', 1, 'Clears bandwidth'), fx('credibility', -1, 'Looks fickle'), fx('alliance_cohesion', -2, 'Partners stranded')]),
    ]),
  ],

  'hist-1914-july-wire': [
    beat('hist-1914-5', 'Railway timetable shock', 'General staffs report that once certain trains move, reversal costs days you may not have. A partial halt is still technically possible.', 'Logistics can become destiny if cabinets sleep.', [
      ch('hist-1914-5a', 'Order a 24-hour freeze on further rolling stock', 'Buy one more night of talk.', 'political', 'capital', 'FREEZE', [fx('time', 2, 'Clock pauses'), fx('escalation', -1, 'Slows machine'), fx('deterrence', -1, 'Looks exposed')]),
      ch('hist-1914-5b', 'Authorize masked concentration while denying mobilization', 'Prepare without the word.', 'kinetic', 'districts', 'MASK', [fx('deterrence', 2, 'Hidden readiness'), fx('escalation', 2, 'War logic advances'), fx('credibility', -1, 'Partners smell deceit')]),
      ch('hist-1914-5c', 'Publish a joint civilian-military pause proposal', 'Make restraint a public offer.', 'diplomatic', 'brussels', 'PAUSE', [fx('diplomacy', 2, 'Visible off-ramp'), fx('alliance_cohesion', 1, 'Shared ask'), fx('domestic_support', -1, 'Hawks howl')]),
    ]),
    beat('hist-1914-6', 'Street and press pressure', 'Crowds and papers demand “firmness.” Soft language is framed as betrayal of allies and of the dead in Sarajevo.', 'Domestic theater can close diplomatic doors.', [
      ch('hist-1914-6a', 'Address the chamber with conditional firmness', 'Pledge defense of partners, not offense.', 'political', 'parliament', 'COND', [fx('domestic_support', 2, 'Optics of resolve'), fx('alliance_cohesion', 1, 'Partners hear loyalty'), fx('escalation', 1, 'Less soft room')]),
      ch('hist-1914-6b', 'Impose temporary press guidelines on mobilization rumors', 'Slow panic cascades.', 'legal', 'streets', 'PRESS', [fx('social_calm', 1, 'Less stampede'), fx('norm_erosion', 1, 'Speech friction'), fx('credibility', -1, 'Censorship charge')]),
      ch('hist-1914-6c', 'Refuse spectacle; keep talks in closed cabinet', 'Govern quietly.', 'political', 'capital', 'CLOSED', [fx('diplomacy', 1, 'Room to bargain'), fx('domestic_support', -2, 'Vacuum of leadership'), fx('time', 1, 'Less theater tax')]),
    ]),
    beat('hist-1914-7', 'Ally’s blank-check ask', 'Your principal ally wants an unambiguous public guarantee tonight. Ambiguity may keep peace—or invite miscalculation.', 'Clarity can deter or compel.', [
      ch('hist-1914-7a', 'Issue a narrow defensive guarantee only', 'Attack on ally triggers aid; offensive wars do not.', 'diplomatic', 'brussels', 'DEFONLY', [fx('alliance_cohesion', 2, 'Credible loyalty'), fx('deterrence', 1, 'Clear tripwire'), fx('escalation', 1, 'Harder to stay out')]),
      ch('hist-1914-7b', 'Give a private assurance, public ambiguity', 'Two audiences, two texts.', 'diplomatic', 'capital', 'DUAL', [fx('alliance_cohesion', 1, 'Private comfort'), fx('credibility', -1, 'Mixed signals'), fx('time', 1, 'Keeps flexibility')]),
      ch('hist-1914-7c', 'Refuse any new guarantee beyond existing treaties', 'Hold the written line.', 'political', 'parliament', 'HOLD', [fx('escalation', -1, 'Less automatic war'), fx('alliance_cohesion', -2, 'Ally feels abandoned'), fx('diplomacy', 1, 'Space for mediation')]),
    ]),
    beat('hist-1914-8', 'Conflicting Balkan reports', 'One cable says local fighting has stopped; another claims artillery already moved. Your war office and foreign office brief opposite worlds.', 'Bad maps make irrevocable choices.', [
      ch('hist-1914-8a', 'Require dual-source confirmation before any military reply', 'Slow the OODA loop deliberately.', 'diplomatic', 'capital', 'DUALSRC', [fx('time', 2, 'Verification delay'), fx('escalation', -1, 'Fewer hair-triggers'), fx('deterrence', -1, 'Looks sluggish')]),
      ch('hist-1914-8b', 'Side with the war office picture and prep countermoves', 'Assume the worst case.', 'kinetic', 'districts', 'WORST', [fx('deterrence', 2, 'Ready posture'), fx('escalation', 2, 'Assumes war'), fx('diplomacy', -1, 'Talks starved')]),
      ch('hist-1914-8c', 'Send a neutral military observer team if transit allows', 'Buy independent eyes.', 'diplomatic', 'brussels', 'OBS', [fx('credibility', 1, 'Independent view'), fx('diplomacy', 1, 'Process signal'), fx('time', -1, 'Transit risk')]),
    ]),
    beat('hist-1914-9', 'Last mediation window', 'A neutral king offers a 12-hour conference if all partial mobilizations pause. Staffs say the pause is military suicide—or the only peace left.', 'Honor and survival arguments collide at midnight.', [
      ch('hist-1914-9a', 'Accept the conference and order a matching pause', 'Risk exposure for a table.', 'diplomatic', 'brussels', 'TABLE', [fx('diplomacy', 3, 'Last off-ramp'), fx('escalation', -2, 'Trains may stop'), fx('deterrence', -1, 'Temporary exposure')]),
      ch('hist-1914-9b', 'Accept talks but refuse any halt in preparations', 'Talk while loading.', 'political', 'capital', 'TALKARM', [fx('diplomacy', 1, 'Channel open'), fx('escalation', 1, 'Prep continues'), fx('credibility', -1, 'Looks insincere')]),
      ch('hist-1914-9c', 'Decline; prioritize alliance timetable discipline', 'Do not let neutrals rewrite your war plan.', 'kinetic', 'parliament', 'TIMETBL', [fx('alliance_cohesion', 2, 'Staffs aligned'), fx('escalation', 3, 'War likelier'), fx('diplomacy', -2, 'Window closed')]),
    ]),
    beat('hist-1914-10', 'Irrevocable night', 'Either the first general mobilization orders go out, or you attempt a unilateral stand-down that may shatter alliances. There is no clean status quo.', 'Endgame choices define the century’s opening.', [
      ch('hist-1914-10a', 'Authorize general mobilization with a parallel peace note', 'Sword and olive branch together.', 'kinetic', 'capital', 'MOBPEACE', [fx('deterrence', 2, 'Force massing'), fx('escalation', 3, 'War machine live'), fx('diplomacy', 1, 'Note still sent')]),
      ch('hist-1914-10b', 'Unilateral stand-down pending 48-hour talks', 'Break the timetable alone if needed.', 'diplomatic', 'brussels', 'STAND', [fx('escalation', -3, 'Hard brake'), fx('alliance_cohesion', -3, 'Allies shocked'), fx('diplomacy', 2, 'Peace bet')]),
      ch('hist-1914-10c', 'Seek a cabinet vote that splits war and diplomacy portfolios', 'Institutionalize dual tracks.', 'political', 'parliament', 'SPLIT', [fx('governability', 1, 'Process clarity'), fx('time', 1, 'Hours bought'), fx('credibility', -1, 'Looks divided')]),
    ]),
  ],

  'hist-1917-petrograd': [
    beat('hist-1917-5', 'Front desertion cascade', 'Reports of units melting westward collide with Allied demands that Russia hold. Your liaison can still shape whether aid is framed as rescue or leverage.', 'A collapsing front can end your eastern strategy overnight.', [
      ch('hist-1917-5a', 'Condition further munitions on a holding order only', 'No offensive; stabilize lines.', 'diplomatic', 'capital', 'HOLD', [fx('alliance_cohesion', 1, 'War effort framed'), fx('escalation', -1, 'Less offensive push'), fx('credibility', 1, 'Clear ask')]),
      ch('hist-1917-5b', 'Flood aid without political strings this week', 'Prioritize keeping any eastern pressure.', 'economic', 'brussels', 'FLOOD', [fx('alliance_cohesion', 2, 'Partners stay'), fx('escalation', 1, 'War continues'), fx('governability', -1, 'Props weak center')]),
      ch('hist-1917-5c', 'Open quiet talks on a separate armistice track', 'Admit the front may be unsustainable.', 'diplomatic', 'parliament', 'ARM', [fx('diplomacy', 2, 'Exit path'), fx('alliance_cohesion', -2, 'Western fury'), fx('time', 1, 'Space to rethink')]),
    ]),
    beat('hist-1917-6', 'Dual-power street night', 'Soviets and ministers claim the same squares. Your embassy’s security detail asks whether to shelter liberals, stay neutral, or evacuate nonessentials.', 'Choosing sides in a capital’s streets is a recognition act.', [
      ch('hist-1917-6a', 'Shelter provisional ministers quietly', 'Signal continuity preference without proclamation.', 'diplomatic', 'capital', 'SHELTER', [fx('alliance_cohesion', 1, 'Continuity bias'), fx('escalation', 1, 'Factional risk'), fx('credibility', -1, 'Partial look')]),
      ch('hist-1917-6b', 'Evacuate nonessentials; keep political staff thin', 'Reduce hostage and incident risk.', 'political', 'streets', 'EVAC', [fx('civilian_cost', -1, 'People safer'), fx('time', 1, 'Flexibility'), fx('credibility', -1, 'Looks like flight')]),
      ch('hist-1917-6c', 'Issue a public call for civic order and legal transfer', 'Moralize process over persons.', 'civic', 'districts', 'ORDER', [fx('norm_protection', 2, 'Process frame'), fx('polarization', 1, 'Both camps angered'), fx('diplomacy', 1, 'Standards stated')]),
    ]),
    beat('hist-1917-7', 'Allied war-aims telegram', 'London and Paris demand you press Petrograd to renounce a separate peace—publicly. Soft language may be read as greenlighting exit.', 'Alliance discipline versus Russian survival politics.', [
      ch('hist-1917-7a', 'Deliver the hard message privately, soft publicly', 'Two-level game to save face.', 'diplomatic', 'brussels', 'TWOLVL', [fx('alliance_cohesion', 1, 'Allies hear firmness'), fx('diplomacy', 1, 'Local room'), fx('credibility', -1, 'Dual text risk')]),
      ch('hist-1917-7b', 'Refuse to coerce; argue for conditional patience', 'Protect any governable center.', 'diplomatic', 'capital', 'PATIENT', [fx('governability', 1, 'Center oxygen'), fx('alliance_cohesion', -2, 'Allies furious'), fx('time', 2, 'Buys weeks')]),
      ch('hist-1917-7c', 'Threaten recognition withdrawal if separate peace proceeds', 'Make exit expensive.', 'political', 'parliament', 'THREAT', [fx('economic_pressure', 2, 'Recognition lever'), fx('escalation', 1, 'Hardens radicals'), fx('diplomacy', -1, 'Bridges burn')]),
    ]),
    beat('hist-1917-8', 'Propaganda fog', 'Leaflets claim Allied gold buys the provisional cabinet. Your own cables are leaked and distorted. Clarity may require painful transparency.', 'Information war can finish a government faster than armies.', [
      ch('hist-1917-8a', 'Publish selected aid ledgers with redactions', 'Transparency as inoculation.', 'political', 'ballot', 'LEDGER', [fx('credibility', 2, 'Counters graft myth'), fx('domestic_support', -1, 'Awkward numbers'), fx('alliance_cohesion', 1, 'Allies can defend')]),
      ch('hist-1917-8b', 'Flood counter-propaganda through friendly papers', 'Fight narrative with narrative.', 'civic', 'streets', 'SPIN', [fx('polarization', 2, 'Info war heats'), fx('credibility', -1, 'Looks manipulative'), fx('time', 1, 'Buys a news cycle')]),
      ch('hist-1917-8c', 'Stay silent and tighten cable security', 'Starve oxygen; fix the pipes.', 'diplomatic', 'capital', 'SILENT', [fx('time', 1, 'Less fuel'), fx('credibility', -2, 'Rumor wins'), fx('diplomacy', 1, 'Quiet channels')]),
    ]),
    beat('hist-1917-9', 'Constituent assembly off-ramp', 'A narrow window opens to schedule elections that might re-legitimize a center—if you fund logistics and accept messy results.', 'Democracy as crisis tool is slow and risky—and sometimes the only glue.', [
      ch('hist-1917-9a', 'Fund election logistics and secure printing', 'Bet on procedural legitimacy.', 'economic', 'ballot', 'ELECT', [fx('norm_protection', 2, 'Ballot path'), fx('governability', 1, 'Future mandate'), fx('alliance_cohesion', -1, 'War desks impatient')]),
      ch('hist-1917-9b', 'Delay elections; prioritize front stabilization first', 'Order before ballots.', 'political', 'parliament', 'DELAY', [fx('governability', 1, 'Short-term control'), fx('norm_erosion', 1, 'Mandate slips'), fx('escalation', 1, 'Military priority')]),
      ch('hist-1917-9c', 'Condition aid on a cross-faction electoral compact', 'Force power-sharing rules.', 'diplomatic', 'brussels', 'COMPACT', [fx('diplomacy', 2, 'Brokered rules'), fx('polarization', -1, 'Some buy-in'), fx('time', -1, 'Hard bargaining')]),
    ]),
    beat('hist-1917-10', 'Recognition endgame', 'A new authority claims the capital. You must recommend recognition, delay, or dual engagement before other capitals lock a bloc line.', 'Recognition is strategy wearing legal clothes.', [
      ch('hist-1917-10a', 'Delay recognition; keep consular channels only', 'Buy time without blessing.', 'diplomatic', 'capital', 'DELAYR', [fx('time', 2, 'Option value'), fx('diplomacy', 1, 'Channel survives'), fx('alliance_cohesion', -1, 'Bloc unclear')]),
      ch('hist-1917-10b', 'Recognize de facto control with human-rights riders', 'Facts first, norms attached.', 'legal', 'parliament', 'DEFACTO', [fx('credibility', 1, 'Reality-based'), fx('norm_protection', 1, 'Riders stated'), fx('alliance_cohesion', 1, 'Common line possible')]),
      ch('hist-1917-10c', 'Refuse recognition and pivot aid to non-Bolshevik regions', 'Bet against the capital.', 'political', 'districts', 'PIVOT', [fx('escalation', 2, 'Civil-war fuel'), fx('alliance_cohesion', 1, 'Anti-radical bloc'), fx('civilian_cost', 2, 'Fragmentation pain')]),
    ]),
  ],
};
