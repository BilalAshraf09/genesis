import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Choice } from '@/data/scenarios';
import { resolveChoiceOp } from '@/lib/scenarioRegistry';
import { colors, fonts } from '@/theme/colors';

type Props = {
  phaseTitle: string;
  moveIndex: number;
  moveTotal: number;
  streak: number;
  selected: Choice | null;
  onClear?: () => void;
  locked?: boolean;
  resolving?: boolean;
};

/**
 * Slim game chrome — move count + selected action.
 * No pros/cons or meter ticks during play.
 */
export function PlayChrome({
  phaseTitle,
  moveIndex,
  moveTotal,
  streak,
  selected,
  onClear,
  locked,
  resolving,
}: Props) {
  const pulse = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    if (streak < 2) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 280, useNativeDriver: false }),
        Animated.timing(pulse, { toValue: 0.45, duration: 280, useNativeDriver: false }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [streak, pulse]);

  const op = selected ? resolveChoiceOp(selected.id) : undefined;

  return (
    <View style={styles.bar} nativeID="play-chrome">
      <View style={styles.left}>
        <Text style={styles.move}>
          MOVE {moveIndex}/{moveTotal}
        </Text>
        <Text style={styles.target} numberOfLines={1}>
          {phaseTitle.toUpperCase()}
        </Text>
      </View>

      <View style={styles.mid}>
        {!selected && !resolving ? (
          <Text style={styles.hint}>TAP A LIT MOVE · THEN LOCK IN</Text>
        ) : resolving ? (
          <Text style={styles.hintHot}>OP RESOLVED — TAP TO CONTINUE</Text>
        ) : (
          <View style={styles.selRow}>
            <Text style={styles.selShort}>{op?.short ?? 'OP'}</Text>
            <Text style={styles.selLabel} numberOfLines={1}>
              {selected?.label}
            </Text>
            {onClear && !locked ? (
              <Pressable onPress={onClear} hitSlop={10} accessibilityRole="button">
                <Text style={styles.clear}>UNDO</Text>
              </Pressable>
            ) : null}
          </View>
        )}
      </View>

      <Animated.View
        style={[
          styles.streak,
          streak >= 2 && {
            borderColor: colors.amberHot,
            opacity: pulse,
          },
        ]}
      >
        <Text style={styles.streakKey}>STREAK</Text>
        <Text style={[styles.streakVal, streak >= 2 && { color: colors.amberHot }]}>
          {streak}×
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(4,10,16,0.88)',
    borderWidth: 1,
    borderColor: 'rgba(212,168,90,0.4)',
    minHeight: 48,
  },
  left: {
    gap: 1,
    minWidth: 88,
  },
  move: {
    fontFamily: fonts.bodyMed,
    fontSize: 9,
    letterSpacing: 1.6,
    color: colors.goldInk,
  },
  target: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 0.6,
    color: colors.chalk,
    maxWidth: 140,
  },
  mid: {
    flex: 1,
    gap: 3,
  },
  hint: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 0.8,
    color: colors.tealBright,
  },
  hintHot: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1,
    color: colors.amberHot,
  },
  selRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selShort: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1,
    color: colors.void,
    backgroundColor: colors.amber,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  selLabel: {
    flex: 1,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    color: colors.chalk,
  },
  clear: {
    fontFamily: fonts.bodyMed,
    fontSize: 10,
    letterSpacing: 1,
    color: colors.mist,
  },
  streak: {
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.steelEdge,
    minWidth: 56,
  },
  streakKey: {
    fontFamily: fonts.bodyMed,
    fontSize: 8,
    letterSpacing: 1.2,
    color: colors.fog,
  },
  streakVal: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.chalk,
    lineHeight: 24,
  },
});
