import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, Stop, LinearGradient as SvgGrad } from 'react-native-svg';
import { GlassPanel } from '@/components/GlassPanel';
import { colors, fonts, radii } from '@/theme/colors';

type Props = {
  moveIndex: number;
  moveTotal: number;
  missionTitle: string;
  theaterLabel: string;
  seconds: number;
  secondsTotal: number;
  pressure: number;
  streak: number;
  muted?: boolean;
  onToggleMute?: () => void;
  locked?: boolean;
};

/** Modern game HUD — objective + countdown ring + pressure. */
export function ThrillerHud({
  moveIndex,
  moveTotal,
  missionTitle,
  theaterLabel,
  seconds,
  secondsTotal,
  pressure,
  streak,
  muted,
  onToggleMute,
  locked,
}: Props) {
  const pulse = useRef(new Animated.Value(0.5)).current;
  const hot = seconds <= 12 || pressure >= 65;
  const critical = seconds <= 6;

  useEffect(() => {
    if (!hot) {
      pulse.setValue(0.5);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: critical ? 220 : 420,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(pulse, {
          toValue: 0.35,
          duration: critical ? 220 : 420,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [hot, critical, pulse]);

  const pct = Math.max(0, Math.min(1, seconds / Math.max(1, secondsTotal)));
  const r = 28;
  const c = 2 * Math.PI * r;
  const dash = c * pct;
  const mm = String(Math.floor(seconds / 60)).padStart(1, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <GlassPanel
      cyan={!hot}
      gold={hot}
      padded={false}
      style={[styles.bar, hot && styles.barHot, locked && styles.barLocked]}
    >
      <View style={styles.inner} nativeID="thriller-hud">
        <View style={styles.left}>
          <Text style={styles.kicker}>{theaterLabel.toUpperCase()}</Text>
          <Text style={styles.move}>
            OBJ {moveIndex}/{moveTotal}
          </Text>
          <Text style={styles.mission} numberOfLines={1}>
            {missionTitle.toUpperCase()}
          </Text>
        </View>

        <Animated.View style={[styles.ringWrap, { opacity: hot ? pulse : 1 }]}>
          <Svg width={78} height={78} viewBox="0 0 78 78" style={styles.ringSvg}>
            <Defs>
              <SvgGrad id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0%" stopColor={critical ? colors.alert : colors.cyanHot} />
                <Stop offset="100%" stopColor={critical ? '#8A2010' : colors.cyan} />
              </SvgGrad>
            </Defs>
            <Circle cx="39" cy="39" r={r} stroke="rgba(255,255,255,0.08)" strokeWidth="5" fill="none" />
            <Circle
              cx="39"
              cy="39"
              r={r}
              stroke="url(#ringGrad)"
              strokeWidth="5"
              fill="none"
              strokeDasharray={`${dash} ${c}`}
              strokeLinecap="round"
            />
          </Svg>
          <View style={styles.ringCenter} pointerEvents="none">
            <Text style={[styles.clock, critical && styles.clockCrit]}>
              {mm}:{ss}
            </Text>
            <Text style={styles.clockSub}>{critical ? 'LOCK' : 'TIMER'}</Text>
          </View>
        </Animated.View>

        <View style={styles.right}>
          <View style={styles.stat}>
            <Text style={styles.statKey}>PRESSURE</Text>
            <Text
              style={[
                styles.statVal,
                {
                  color:
                    pressure >= 70
                      ? colors.alert
                      : pressure >= 45
                        ? colors.amberHot
                        : colors.cyanHot,
                },
              ]}
            >
              {Math.round(pressure)}
            </Text>
          </View>
          {streak >= 2 ? (
            <View style={styles.stat}>
              <Text style={styles.statKey}>STREAK</Text>
              <Text style={[styles.statVal, { color: colors.amberHot }]}>{streak}×</Text>
            </View>
          ) : null}
          {onToggleMute ? (
            <Pressable onPress={onToggleMute} style={styles.mute} accessibilityRole="button">
              <Text style={styles.muteText}>{muted ? 'MUTED' : 'AUDIO'}</Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </GlassPanel>
  );
}

const styles = StyleSheet.create({
  bar: { minHeight: 96 },
  barHot: {},
  barLocked: { opacity: 0.75 },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  left: { flex: 1, gap: 2, minWidth: 0 },
  kicker: {
    fontFamily: fonts.bodyMed,
    fontSize: 10,
    letterSpacing: 1.8,
    color: colors.goldInk,
  },
  move: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 1.6,
    color: colors.cyanHot,
  },
  mission: {
    fontFamily: fonts.display,
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: 1,
    color: colors.chalk,
  },
  ringWrap: {
    width: 78,
    height: 78,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringSvg: {
    transform: [{ rotate: '-90deg' }],
  },
  ringCenter: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clock: {
    fontFamily: fonts.display,
    fontSize: 20,
    lineHeight: 22,
    color: colors.chalk,
  },
  clockCrit: { color: colors.alert },
  clockSub: {
    fontFamily: fonts.bodyMed,
    fontSize: 8,
    letterSpacing: 1.6,
    color: colors.mist,
  },
  right: { alignItems: 'flex-end', gap: 6, minWidth: 76 },
  stat: { alignItems: 'flex-end' },
  statKey: {
    fontFamily: fonts.bodyMed,
    fontSize: 8,
    letterSpacing: 1.4,
    color: colors.fog,
  },
  statVal: {
    fontFamily: fonts.display,
    fontSize: 24,
    lineHeight: 26,
    color: colors.chalk,
  },
  mute: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.steelEdge,
    borderRadius: radii.xs,
  },
  muteText: {
    fontFamily: fonts.bodyMed,
    fontSize: 9,
    letterSpacing: 1.2,
    color: colors.mist,
  },
});
