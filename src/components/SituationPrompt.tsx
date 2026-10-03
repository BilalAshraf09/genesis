import { StyleSheet, Text, View } from 'react-native';
import { GlassPanel } from '@/components/GlassPanel';
import { colors, fonts } from '@/theme/colors';

type Props = {
  briefing: string;
  stakes?: string;
  /** Cinematic objective line — never a quiz question */
  ask?: string;
};

/**
 * Cinematic objective strip — PRIMARY OBJECTIVE + stakes.
 * Not a quiz prompt. Pros/cons stay on after-action only.
 */
export function SituationPrompt({
  briefing,
  stakes,
  ask = 'AUTHORIZE AN ORDER ON THE THEATER',
}: Props) {
  return (
    <GlassPanel gold padded style={styles.wrap}>
      <View nativeID="situation-prompt" style={styles.inner}>
        <Text style={styles.kicker}>PRIMARY OBJECTIVE</Text>
        <Text style={styles.brief} numberOfLines={3}>
          {briefing.trim()}
        </Text>
        {stakes?.trim() ? (
          <View style={styles.stakesRow}>
            <Text style={styles.stakesKey}>STAKES</Text>
            <Text style={styles.stakes} numberOfLines={2}>
              {stakes.trim()}
            </Text>
          </View>
        ) : null}
        <Text style={styles.ask}>{ask}</Text>
      </View>
    </GlassPanel>
  );
}

const styles = StyleSheet.create({
  wrap: {},
  inner: { gap: 6 },
  kicker: {
    fontFamily: fonts.displayMed,
    fontSize: 11,
    letterSpacing: 2.4,
    color: colors.goldInk,
  },
  brief: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: colors.chalk,
  },
  stakesRow: {
    marginTop: 2,
    gap: 2,
    borderLeftWidth: 2,
    borderLeftColor: colors.amber,
    paddingLeft: 10,
  },
  stakesKey: {
    fontFamily: fonts.bodyMed,
    fontSize: 9,
    letterSpacing: 1.8,
    color: colors.amberHot,
  },
  stakes: {
    fontFamily: fonts.bodyMed,
    fontSize: 13,
    lineHeight: 18,
    color: colors.chalkDim,
  },
  ask: {
    marginTop: 8,
    fontFamily: fonts.displayMed,
    fontSize: 13,
    letterSpacing: 1.4,
    color: colors.cyanHot,
  },
});
