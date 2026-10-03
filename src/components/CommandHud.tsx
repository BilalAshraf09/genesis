import { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import type { LiveMeter } from '@/lib/liveMeters';
import { PhaseCountdown } from '@/components/immersion/PhaseCountdown';
import { GlassPanel } from '@/components/GlassPanel';
import { colors, fonts } from '@/theme/colors';

type Props = {
  phase: number;
  total: number;
  pressure: number;
  meters: LiveMeter[];
  opsCommitted: number;
  windowSeconds: number;
  windowTotal: number;
  muted?: boolean;
  onToggleMute?: () => void;
  streak?: number;
};

export function CommandHud({
  phase,
  total,
  pressure,
  meters,
  opsCommitted,
  windowSeconds,
  windowTotal,
  muted,
  onToggleMute,
  streak = 0,
}: Props) {
  const tick = useRef(new Animated.Value(1)).current;
  const pressureAnim = useRef(new Animated.Value(pressure)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(tick, {
          toValue: 0.28,
          duration: 800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(tick, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [tick]);

  useEffect(() => {
    Animated.timing(pressureAnim, {
      toValue: pressure,
      duration: 450,
      useNativeDriver: false,
    }).start();
  }, [pressure, pressureAnim]);

  const hot = meters.find((m) => m.tone === 'hot') ?? meters.find((m) => m.tone === 'warn');
  const pressureColor =
    pressure >= 70 ? colors.alert : pressure >= 45 ? colors.amber : colors.tealBright;

  return (
    <GlassPanel raised style={styles.hud} padded={false}>
      <View style={styles.inner} nativeID="command-hud">
        <View style={styles.top}>
          <View style={styles.phaseBlock}>
            <Text style={styles.kicker}>PLAY TABLE</Text>
            <Text style={styles.phase}>
              MOVE {phase}/{total}
            </Text>
          </View>
          <View style={styles.topRight}>
            <PhaseCountdown
              seconds={windowSeconds}
              total={windowTotal}
              urgent={pressure >= 65 || windowSeconds <= 12}
            />
            <View style={styles.timerBlock}>
              <Animated.View style={[styles.timerDot, { opacity: tick }]} />
              <Text style={styles.timerLabel}>LIVE</Text>
            </View>
            {onToggleMute ? (
              <Pressable
                onPress={onToggleMute}
                accessibilityRole="button"
                accessibilityLabel={muted ? 'Unmute audio' : 'Mute audio'}
                style={styles.muteBtn}
              >
                <Text style={styles.muteText}>{muted ? 'MUTED' : 'AUDIO'}</Text>
              </Pressable>
            ) : null}
          </View>
        </View>

        <View style={styles.rail}>
          {Array.from({ length: total }).map((_, i) => (
            <View
              key={i}
              style={[
                styles.seg,
                i < phase ? styles.segOn : styles.segOff,
                i === phase - 1 && styles.segCurrent,
              ]}
            />
          ))}
        </View>

        <View style={styles.chips}>
          <View style={styles.chip}>
            <Text style={styles.chipKey}>PRESSURE</Text>
            <Text style={[styles.chipVal, { color: pressureColor }]}>{Math.round(pressure)}</Text>
            <Animated.View
              style={[
                styles.pressureFill,
                {
                  width: pressureAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                  }),
                  backgroundColor: pressureColor,
                },
              ]}
            />
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipKey}>OPS IN</Text>
            <Text style={styles.chipVal}>{opsCommitted}</Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipKey}>STREAK</Text>
            <Text style={[styles.chipVal, streak >= 2 && { color: colors.amberHot }]}>
              {streak}×
            </Text>
          </View>
          <View style={styles.chip}>
            <Text style={styles.chipKey}>HOT ZONE</Text>
            <Text
              style={[styles.chipVal, { color: hot?.tone === 'hot' ? colors.alert : colors.amber }]}
            >
              {hot?.label?.toUpperCase() ?? 'STABLE'}
            </Text>
          </View>
        </View>
      </View>
    </GlassPanel>
  );
}

const styles = StyleSheet.create({
  hud: {
    borderColor: colors.lineGold,
  },
  inner: {
    padding: 12,
    gap: 10,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  phaseBlock: {
    gap: 2,
    flexShrink: 1,
  },
  topRight: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  kicker: {
    fontFamily: fonts.bodyMed,
    fontSize: 9,
    letterSpacing: 2,
    color: colors.goldInk,
  },
  phase: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.chalk,
    letterSpacing: 1.2,
  },
  timerBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(196,92,58,0.45)',
    backgroundColor: 'rgba(8,16,22,0.85)',
  },
  timerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.alert,
  },
  timerLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1.4,
    color: colors.chalk,
  },
  muteBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.steelEdge,
    backgroundColor: 'rgba(8,16,22,0.85)',
    justifyContent: 'center',
    minHeight: 44,
  },
  muteText: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1.2,
    color: colors.mist,
  },
  rail: {
    flexDirection: 'row',
    gap: 4,
  },
  seg: {
    flex: 1,
    height: 4,
  },
  segOn: {
    backgroundColor: colors.teal,
  },
  segOff: {
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  segCurrent: {
    backgroundColor: colors.amberHot,
    shadowColor: colors.amberHot,
    shadowOpacity: 0.7,
    shadowRadius: 6,
  },
  chips: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    flex: 1,
    gap: 2,
    paddingVertical: 7,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(4,10,16,0.65)',
    borderWidth: 1,
    borderColor: 'rgba(170,210,200,0.16)',
    overflow: 'hidden',
  },
  chipKey: {
    fontFamily: fonts.bodyMed,
    fontSize: 9,
    letterSpacing: 1.2,
    color: colors.fog,
  },
  chipVal: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    color: colors.chalk,
  },
  pressureFill: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    height: 2,
    opacity: 0.9,
  },
});
