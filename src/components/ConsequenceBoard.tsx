import { StyleSheet, Text, View } from 'react-native';
import type { DecisionRecord } from '@/lib/evaluate';
import type { Scenario } from '@/data/scenarios';
import { resolveChoiceOp } from '@/lib/scenarioRegistry';
import { colors, fonts } from '@/theme/colors';

type Props = {
  scenario: Scenario;
  decisions: DecisionRecord[];
};

type Pill = {
  tag: string;
  weight: number;
  summary: string;
  move: number;
  label: string;
};

/**
 * Visual consequence board — good vs bad outcomes, scannable pills.
 * Short captions only; no essay walls.
 */
export function ConsequenceBoard({ scenario, decisions }: Props) {
  const goods: Pill[] = [];
  const bads: Pill[] = [];

  decisions.forEach((d, i) => {
    for (const e of d.choice.effects) {
      const pill: Pill = {
        tag: e.tag,
        weight: e.weight,
        summary: e.summary,
        move: i + 1,
        label: d.choice.label,
      };
      if (e.weight >= 0) goods.push(pill);
      else bads.push(pill);
    }
  });

  // Strongest first
  goods.sort((a, b) => b.weight - a.weight);
  bads.sort((a, b) => a.weight - b.weight);

  return (
    <View style={styles.wrap} nativeID="consequence-board">
      <Text style={styles.kicker}>HOW YOUR MOVES LANDED</Text>
      <View style={styles.columns}>
        <View style={[styles.col, styles.colGood]}>
          <Text style={styles.colHead}>▲ GAINS</Text>
          {goods.length === 0 ? (
            <Text style={styles.empty}>No clear gains this run.</Text>
          ) : (
            goods.slice(0, 8).map((p, i) => (
              <View key={`g-${i}`} style={styles.pillGood}>
                <View style={styles.pillTop}>
                  <Text style={styles.pillMove}>M{p.move}</Text>
                  <Text style={styles.pillTag}>{p.tag.replace(/_/g, ' ')}</Text>
                  <Text style={styles.pillUp}>+{p.weight}</Text>
                </View>
                <Text style={styles.pillSum}>{p.summary}</Text>
              </View>
            ))
          )}
        </View>
        <View style={[styles.col, styles.colBad]}>
          <Text style={[styles.colHead, styles.colHeadBad]}>▼ COSTS</Text>
          {bads.length === 0 ? (
            <Text style={styles.empty}>No hard costs logged.</Text>
          ) : (
            bads.slice(0, 8).map((p, i) => (
              <View key={`b-${i}`} style={styles.pillBad}>
                <View style={styles.pillTop}>
                  <Text style={styles.pillMove}>M{p.move}</Text>
                  <Text style={styles.pillTag}>{p.tag.replace(/_/g, ' ')}</Text>
                  <Text style={styles.pillDown}>{p.weight}</Text>
                </View>
                <Text style={styles.pillSum}>{p.summary}</Text>
              </View>
            ))
          )}
        </View>
      </View>

      <Text style={styles.opsKicker}>MOVE IMPACT</Text>
      <View style={styles.opsRow}>
        {decisions.map((d, i) => {
          const short = resolveChoiceOp(d.choice.id)?.short ?? 'OP';
          const pos = d.choice.effects.filter((e) => e.weight > 0).length;
          const neg = d.choice.effects.filter((e) => e.weight < 0).length;
          const beat = scenario.beats.find((b) => b.id === d.beatId);
          return (
            <View key={d.beatId} style={styles.opCard}>
              <Text style={styles.opMove}>{i + 1}</Text>
              <Text style={styles.opShort}>{short}</Text>
              <Text style={styles.opBeat} numberOfLines={1}>
                {beat?.title ?? d.beatTitle}
              </Text>
              <View style={styles.opPolar}>
                {pos > 0 ? <Text style={styles.opGood}>▲{pos}</Text> : null}
                {neg > 0 ? <Text style={styles.opBad}>▼{neg}</Text> : null}
                {pos === 0 && neg === 0 ? <Text style={styles.opFlat}>·</Text> : null}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 10,
  },
  kicker: {
    fontFamily: fonts.bodyMed,
    fontSize: 10,
    letterSpacing: 1.8,
    color: colors.goldInk,
  },
  columns: {
    flexDirection: 'row',
    gap: 8,
  },
  col: {
    flex: 1,
    gap: 6,
    padding: 8,
    borderWidth: 1,
    minHeight: 120,
  },
  colGood: {
    borderColor: 'rgba(91,196,181,0.45)',
    backgroundColor: 'rgba(91,196,181,0.06)',
  },
  colBad: {
    borderColor: 'rgba(196,92,58,0.45)',
    backgroundColor: 'rgba(196,92,58,0.06)',
  },
  colHead: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 1.2,
    color: colors.tealBright,
    marginBottom: 2,
  },
  colHeadBad: {
    color: colors.alert,
  },
  empty: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.fog,
  },
  pillGood: {
    padding: 7,
    gap: 3,
    borderWidth: 1,
    borderColor: 'rgba(91,196,181,0.3)',
    backgroundColor: 'rgba(4,10,16,0.45)',
  },
  pillBad: {
    padding: 7,
    gap: 3,
    borderWidth: 1,
    borderColor: 'rgba(196,92,58,0.3)',
    backgroundColor: 'rgba(4,10,16,0.45)',
  },
  pillTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pillMove: {
    fontFamily: fonts.bodyBold,
    fontSize: 9,
    letterSpacing: 0.8,
    color: colors.fog,
  },
  pillTag: {
    flex: 1,
    fontFamily: fonts.bodyMed,
    fontSize: 9,
    letterSpacing: 0.6,
    color: colors.mist,
    textTransform: 'uppercase',
  },
  pillUp: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    color: colors.tealBright,
  },
  pillDown: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    color: colors.alert,
  },
  pillSum: {
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 15,
    color: colors.chalk,
  },
  opsKicker: {
    marginTop: 4,
    fontFamily: fonts.bodyMed,
    fontSize: 10,
    letterSpacing: 1.6,
    color: colors.amber,
  },
  opsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  opCard: {
    width: '18%',
    minWidth: 56,
    maxWidth: 72,
    padding: 6,
    gap: 2,
    borderWidth: 1,
    borderColor: colors.steelEdge,
    backgroundColor: 'rgba(4,10,16,0.65)',
    alignItems: 'center',
  },
  opMove: {
    fontFamily: fonts.bodyMed,
    fontSize: 9,
    color: colors.fog,
  },
  opShort: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 0.6,
    color: colors.chalk,
  },
  opBeat: {
    fontFamily: fonts.body,
    fontSize: 8,
    color: colors.mist,
    textAlign: 'center',
  },
  opPolar: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 2,
  },
  opGood: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    color: colors.tealBright,
  },
  opBad: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    color: colors.alert,
  },
  opFlat: {
    fontFamily: fonts.body,
    fontSize: 10,
    color: colors.fog,
  },
});
