import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, Path, Stop, LinearGradient } from 'react-native-svg';
import { GlassPanel } from '@/components/GlassPanel';
import { colors, fonts } from '@/theme/colors';

export type Branch = {
  id: string;
  label: string;
  taken: boolean;
  consequence: string;
};

type Props = {
  year: number;
  title?: string;
  branches: Branch[];
  /** Compact overlay mode for resolve beat */
  compact?: boolean;
};

/** Visual storytelling: one decision forks the world’s course. */
export function WorldCourseVisual({
  year,
  title = 'WORLD COURSE',
  branches,
  compact,
}: Props) {
  const draw = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    draw.setValue(0);
    Animated.timing(draw, {
      toValue: 1,
      duration: compact ? 700 : 1400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(pulse, {
          toValue: 0.35,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [branches, draw, pulse, compact]);

  const taken = useMemo(() => branches.find((b) => b.taken) ?? branches[0], [branches]);
  const alts = useMemo(() => branches.filter((b) => !b.taken).slice(0, 2), [branches]);

  if (compact) {
    return (
      <View style={styles.compact} nativeID="world-course-compact" pointerEvents="none">
        <Text style={styles.compactKicker}>{year} · COURSE SHIFT</Text>
        <Text style={styles.compactTitle} numberOfLines={1}>
          {taken?.label ?? 'PATH TAKEN'}
        </Text>
        <View style={styles.rippleRow}>
          <Animated.View
            style={[
              styles.ripple,
              {
                opacity: pulse,
                transform: [
                  {
                    scale: pulse.interpolate({ inputRange: [0.35, 1], outputRange: [0.85, 1.25] }),
                  },
                ],
              },
            ]}
          />
          <Text style={styles.compactBody} numberOfLines={2}>
            {taken?.consequence}
          </Text>
        </View>
        {alts[0] ? (
          <Text style={styles.ghost} numberOfLines={1}>
            FADING · {alts[0].label}
          </Text>
        ) : null}
      </View>
    );
  }

  return (
    <GlassPanel gold raised style={styles.wrap} padded={false}>
      <View style={styles.inner} nativeID="world-course">
        <Text style={styles.kicker}>{title}</Text>
        <Text style={styles.sub}>
          {year} · ONE DECISION · BRANCHING FUTURES
        </Text>

        <View style={styles.stage}>
          <Svg width="100%" height={compact ? 120 : 168} viewBox="0 0 320 168">
            <Defs>
              <LinearGradient id="takenGrad" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0%" stopColor={colors.amberHot} stopOpacity="0.9" />
                <Stop offset="100%" stopColor={colors.tealBright} stopOpacity="0.85" />
              </LinearGradient>
              <LinearGradient id="ghostGrad" x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0%" stopColor="#8FA8A3" stopOpacity="0.35" />
                <Stop offset="100%" stopColor="#8FA8A3" stopOpacity="0.05" />
              </LinearGradient>
            </Defs>
            {/* origin */}
            <Circle cx="36" cy="84" r="10" fill={colors.amber} />
            <Circle cx="36" cy="84" r="16" fill="none" stroke={colors.amberHot} strokeWidth="1.2" opacity="0.5" />
            {/* taken path */}
            <Path
              d="M46 84 C 110 84, 140 40, 210 36"
              stroke="url(#takenGrad)"
              strokeWidth="3.5"
              fill="none"
            />
            <Circle cx="210" cy="36" r="8" fill={colors.tealBright} />
            {/* alternate fading worlds */}
            <Path
              d="M46 84 C 110 84, 150 84, 220 84"
              stroke="url(#ghostGrad)"
              strokeWidth="2"
              strokeDasharray="4 4"
              fill="none"
            />
            <Path
              d="M46 84 C 110 84, 140 128, 210 132"
              stroke="url(#ghostGrad)"
              strokeWidth="2"
              strokeDasharray="3 5"
              fill="none"
            />
            <Circle cx="220" cy="84" r="6" fill="#5C7370" opacity="0.45" />
            <Circle cx="210" cy="132" r="6" fill="#5C7370" opacity="0.3" />
            {/* ripple arcs */}
            <Path
              d="M210 36 Q 250 50 270 84"
              stroke={colors.amberHot}
              strokeWidth="1"
              fill="none"
              opacity="0.55"
            />
            <Path
              d="M210 36 Q 260 70 280 120"
              stroke={colors.teal}
              strokeWidth="1"
              fill="none"
              opacity="0.35"
            />
          </Svg>

          <View style={styles.labels}>
            <View style={styles.takenCard}>
              <Text style={styles.takenTag}>WORLD THAT FOLLOWED</Text>
              <Text style={styles.takenLabel}>{taken?.label}</Text>
              <Text style={styles.takenBody}>{taken?.consequence}</Text>
            </View>
            {alts.map((a, i) => (
              <View key={a.id} style={[styles.altCard, i === 1 && styles.altDim]}>
                <Text style={styles.altTag}>ALTERNATE FADED</Text>
                <Text style={styles.altLabel}>{a.label}</Text>
                <Text style={styles.altBody} numberOfLines={2}>
                  {a.consequence}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </GlassPanel>
  );
}

/** Build branch motifs from a chosen choice vs siblings on the same beat. */
export function branchesFromBeat(opts: {
  chosenLabel: string;
  chosenDetail: string;
  siblings: { label: string; detail: string }[];
}): Branch[] {
  const alts = opts.siblings
    .filter((s) => s.label !== opts.chosenLabel)
    .slice(0, 2)
    .map((s, i) => ({
      id: `alt-${i}`,
      label: s.label,
      taken: false,
      consequence: s.detail,
    }));
  return [
    {
      id: 'taken',
      label: opts.chosenLabel,
      taken: true,
      consequence: opts.chosenDetail,
    },
    ...alts,
  ];
}

const styles = StyleSheet.create({
  wrap: { borderColor: colors.lineGold },
  inner: { padding: 14, gap: 8 },
  kicker: {
    fontFamily: fonts.bodyMed,
    fontSize: 10,
    letterSpacing: 2,
    color: colors.goldInk,
  },
  sub: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.mist,
  },
  stage: { gap: 10 },
  labels: { gap: 8 },
  takenCard: {
    borderWidth: 1,
    borderColor: colors.amber,
    backgroundColor: 'rgba(212,160,74,0.08)',
    padding: 10,
    gap: 3,
  },
  takenTag: {
    fontFamily: fonts.bodyMed,
    fontSize: 9,
    letterSpacing: 1.4,
    color: colors.amberHot,
  },
  takenLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    color: colors.chalk,
  },
  takenBody: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17,
    color: colors.chalkDim,
  },
  altCard: {
    borderWidth: 1,
    borderColor: 'rgba(143,168,163,0.25)',
    backgroundColor: 'rgba(8,16,22,0.45)',
    padding: 10,
    gap: 2,
    opacity: 0.72,
  },
  altDim: { opacity: 0.5 },
  altTag: {
    fontFamily: fonts.bodyMed,
    fontSize: 8,
    letterSpacing: 1.2,
    color: colors.fog,
  },
  altLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    color: colors.mist,
  },
  altBody: {
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 15,
    color: colors.fog,
  },
  compact: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(212,160,74,0.35)',
    gap: 4,
  },
  compactKicker: {
    fontFamily: fonts.bodyMed,
    fontSize: 9,
    letterSpacing: 1.6,
    color: colors.amberHot,
  },
  compactTitle: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.chalk,
    letterSpacing: 0.8,
  },
  compactBody: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
    color: colors.chalkDim,
    flex: 1,
  },
  rippleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  ripple: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: colors.tealBright,
  },
  ghost: {
    fontFamily: fonts.bodyMed,
    fontSize: 10,
    letterSpacing: 1,
    color: colors.fog,
    opacity: 0.7,
  },
});
