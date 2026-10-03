import { StyleSheet, Text, View } from 'react-native';
import type { EfficiencyBreakdown } from '@/lib/efficiency';
import { colors, fonts } from '@/theme/colors';

type Props = {
  score: EfficiencyBreakdown;
};

export function EfficiencyBoard({ score }: Props) {
  return (
    <View style={styles.wrap} testID="efficiency-board" nativeID="efficiency-board">
      <View style={styles.header}>
        <View>
          <Text style={styles.kicker}>EFFICIENCY SCORE</Text>
          <Text style={styles.subtitle}>Outcome per cost — not a morality grade</Text>
        </View>
        <View style={styles.gradeBox}>
          <Text style={styles.grade}>{score.grade}</Text>
          <Text style={styles.total}>{Math.round(score.total)}</Text>
        </View>
      </View>
      <Text style={styles.summary}>{score.summary}</Text>
      <View style={styles.axes}>
        {score.axes.map((axis) => (
          <View key={axis.id} style={styles.axis}>
            <View style={styles.axisHead}>
              <Text style={styles.axisLabel}>{axis.label}</Text>
              <Text style={styles.axisScore}>{Math.round(axis.score)}</Text>
            </View>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${Math.round(axis.score)}%` }]} />
            </View>
            <Text style={styles.note}>{axis.note}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 1,
    borderColor: colors.amber,
    backgroundColor: colors.panel,
    padding: 14,
    gap: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  kicker: {
    fontFamily: fonts.bodyMed,
    fontSize: 11,
    letterSpacing: 1.6,
    color: colors.amber,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.mist,
    marginTop: 2,
  },
  gradeBox: {
    alignItems: 'center',
    minWidth: 64,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: colors.amber,
    backgroundColor: colors.deep,
  },
  grade: {
    fontFamily: fonts.display,
    fontSize: 36,
    lineHeight: 36,
    color: colors.amberHot,
  },
  total: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    color: colors.chalkDim,
  },
  summary: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
    color: colors.chalk,
  },
  axes: {
    gap: 10,
  },
  axis: {
    gap: 4,
  },
  axisHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  axisLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    color: colors.chalk,
  },
  axisScore: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    color: colors.tealBright,
  },
  track: {
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  fill: {
    height: 5,
    backgroundColor: colors.amber,
  },
  note: {
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 16,
    color: colors.mist,
  },
});
