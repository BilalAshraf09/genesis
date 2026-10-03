import { Pressable, StyleSheet, Text, View } from 'react-native';
import { GlassPanel } from '@/components/GlassPanel';
import { pathLabel } from '@/retention/algo';
import type { NextPlayRec } from '@/retention/algo';
import type { PersonalBest } from '@/retention/types';
import { colors, fonts, radii } from '@/theme/colors';

type Props = {
  score: number;
  grade: string;
  /** Best after this run was recorded (includes new PB). */
  personalBest: PersonalBest | null;
  /** Best before this run, if any. */
  previousBest: PersonalBest | null;
  isNewBest: boolean;
  dailyBonus: boolean;
  dailyMultiplier: number;
  cliffhanger: { path: string; blurb: string } | null;
  next: NextPlayRec | null;
  onPlayNext: (scenarioId: string) => void;
  onRedeploy: () => void;
  /** Scroll/focus share challenge (viral loop). */
  onShareChallenge?: () => void;
};

/** After-action retention: beat-best, cliffhanger, viral loop, smart next. */
export function RetentionAfterAction({
  score,
  grade,
  personalBest,
  previousBest,
  isNewBest,
  dailyBonus,
  dailyMultiplier,
  cliffhanger,
  next,
  onPlayNext,
  onRedeploy,
  onShareChallenge,
}: Props) {
  const beatLine = (() => {
    if (isNewBest) {
      return previousBest
        ? `NEW PERSONAL BEST — was ${previousBest.score}`
        : 'NEW PERSONAL BEST';
    }
    if (personalBest) {
      const gap = personalBest.score - score;
      if (gap > 0) {
        return `Beat your best ${personalBest.score} (${personalBest.grade}) — ${gap} pts short`;
      }
      return `Matched your best ${personalBest.score}`;
    }
    return null;
  })();

  const showBest = !!(beatLine || dailyBonus);

  return (
    <View style={styles.wrap} nativeID="retention-after">
      {showBest ? (
        <View nativeID="retention-best">
          <GlassPanel gold padded>
            {dailyBonus ? (
              <Text style={styles.dailyTag}>
                CRISIS BONUS ×{dailyMultiplier.toFixed(2)} APPLIED
              </Text>
            ) : null}
            {beatLine ? (
              <Text style={[styles.bestLine, isNewBest && styles.bestHot]}>{beatLine}</Text>
            ) : null}
            <Text style={styles.scoreMeta}>
              This run {score} ({grade})
              {personalBest && !isNewBest ? ` · Best ${personalBest.score}` : ''}
            </Text>
            {!isNewBest && personalBest ? (
              <Pressable onPress={onRedeploy} accessibilityRole="button">
                <Text style={styles.cta}>REDEPLOY TO BEAT {personalBest.score} →</Text>
              </Pressable>
            ) : null}
          </GlassPanel>
        </View>
      ) : null}

      {cliffhanger ? (
        <View nativeID="retention-cliff">
          <GlassPanel cyan padded>
            <Text style={styles.cliffKicker}>STILL UNEXPLORED</Text>
            <Text style={styles.cliffBlurb}>{cliffhanger.blurb}</Text>
            <Pressable
              onPress={onRedeploy}
              accessibilityRole="button"
              accessibilityLabel={`Try ${pathLabel(cliffhanger.path)} path`}
            >
              <Text style={styles.pathChip}>{pathLabel(cliffhanger.path)} · REDEPLOY →</Text>
            </Pressable>
          </GlassPanel>
        </View>
      ) : null}

      {/* Viral loop: challenge + next play */}
      <View style={styles.viral} nativeID="retention-viral-loop">
        <Text style={styles.viralKicker}>OPS LOOP</Text>
        <Text style={styles.viralTitle}>Challenge out · next theater in</Text>
        <View style={styles.viralRow}>
          {onShareChallenge ? (
            <Pressable
              onPress={onShareChallenge}
              accessibilityRole="button"
              accessibilityLabel="Share challenge to beat my path"
              style={({ pressed }) => [styles.viralBtn, pressed && styles.pressed]}
              nativeID="viral-share-challenge"
            >
              <Text style={styles.viralBtnLabel}>SHARE CHALLENGE</Text>
              <Text style={styles.viralBtnSub}>Beat my path · {score}</Text>
            </Pressable>
          ) : null}
          {next ? (
            <Pressable
              onPress={() => onPlayNext(next.scenario.id)}
              accessibilityRole="button"
              accessibilityLabel={`Next play ${next.scenario.title}`}
              style={({ pressed }) => [styles.viralBtn, styles.viralBtnPrimary, pressed && styles.pressed]}
              nativeID="retention-next-play"
            >
              <Text style={[styles.viralBtnLabel, styles.viralBtnLabelDark]}>NEXT PLAY</Text>
              <Text style={[styles.viralBtnSub, styles.viralBtnSubDark]} numberOfLines={1}>
                {next.scenario.title}
              </Text>
            </Pressable>
          ) : null}
        </View>
        {next ? (
          <Text style={styles.viralDetail} numberOfLines={2}>
            {next.headline} — {next.detail}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12 },
  dailyTag: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1.4,
    color: colors.amberHot,
    marginBottom: 6,
  },
  bestLine: {
    fontFamily: fonts.displayMed,
    fontSize: 15,
    letterSpacing: 0.6,
    color: colors.chalk,
  },
  bestHot: { color: colors.amberHot },
  scoreMeta: {
    marginTop: 6,
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.mist,
  },
  cta: {
    marginTop: 10,
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1.4,
    color: colors.cyanHot,
  },
  cliffKicker: {
    fontFamily: fonts.bodyMed,
    fontSize: 10,
    letterSpacing: 1.6,
    color: colors.cyan,
    marginBottom: 6,
  },
  cliffBlurb: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.chalk,
  },
  pathChip: {
    marginTop: 10,
    alignSelf: 'flex-start',
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1.4,
    color: colors.cyanHot,
    borderWidth: 1,
    borderColor: colors.lineCyan,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radii.xs,
  },
  viral: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: 'rgba(255,184,77,0.4)',
    backgroundColor: 'rgba(14,20,34,0.9)',
    padding: 14,
    gap: 8,
  },
  viralKicker: {
    fontFamily: fonts.bodyMed,
    fontSize: 10,
    letterSpacing: 1.6,
    color: colors.amber,
  },
  viralTitle: {
    fontFamily: fonts.displayMed,
    fontSize: 16,
    letterSpacing: 0.5,
    color: colors.chalk,
  },
  viralRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  viralBtn: {
    flexGrow: 1,
    minWidth: '42%',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.steelEdge,
    borderRadius: radii.sm,
    backgroundColor: colors.panelSolid,
    gap: 4,
  },
  viralBtnPrimary: {
    borderColor: colors.cyanHot,
    backgroundColor: colors.cyanHot,
  },
  viralBtnLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1.3,
    color: colors.chalk,
  },
  viralBtnLabelDark: {
    color: colors.void,
  },
  viralBtnSub: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.mist,
  },
  viralBtnSubDark: {
    color: 'rgba(5,7,12,0.75)',
  },
  viralDetail: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17,
    color: colors.chalkDim,
  },
  pressed: { opacity: 0.9 },
});
