import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '@/theme/colors';

type Props = {
  /** Seconds remaining in this phase window */
  seconds: number;
  total: number;
  urgent?: boolean;
  onExpire?: () => void;
};

export function PhaseCountdown({ seconds, total, urgent, onExpire }: Props) {
  const pulse = useRef(new Animated.Value(1)).current;
  const fill = useRef(new Animated.Value(seconds / total)).current;
  const prev = useRef(seconds);

  useEffect(() => {
    Animated.timing(fill, {
      toValue: Math.max(0, seconds / total),
      duration: 280,
      useNativeDriver: false,
    }).start();
  }, [seconds, total, fill]);

  useEffect(() => {
    if (seconds <= 8 || urgent) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1.06,
            duration: 280,
            easing: Easing.inOut(Easing.quad),
            useNativeDriver: false,
          }),
          Animated.timing(pulse, {
            toValue: 1,
            duration: 280,
            useNativeDriver: false,
          }),
        ]),
      );
      loop.start();
      return () => loop.stop();
    }
    pulse.setValue(1);
  }, [seconds, urgent, pulse]);

  useEffect(() => {
    if (prev.current > 0 && seconds <= 0) onExpire?.();
    prev.current = seconds;
  }, [seconds, onExpire]);

  const mm = String(Math.floor(seconds / 60)).padStart(1, '0');
  const ss = String(Math.max(0, seconds % 60)).padStart(2, '0');
  const hot = seconds <= 10 || !!urgent;

  return (
    <Animated.View
      style={[styles.wrap, hot && styles.wrapHot, { transform: [{ scale: pulse }] }]}
      nativeID="phase-countdown"
    >
      <Text style={[styles.label, hot && styles.labelHot]}>TIMER</Text>
      <Text style={[styles.time, hot && styles.timeHot]}>
        {mm}:{ss}
      </Text>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
            {
              backgroundColor: hot ? colors.alert : colors.tealBright,
              width: fill.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    minWidth: 88,
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: colors.deep,
    borderWidth: 1,
    borderColor: colors.line,
  },
  wrapHot: {
    borderColor: colors.alert,
    backgroundColor: 'rgba(196, 92, 58, 0.18)',
  },
  label: {
    fontFamily: fonts.bodyMed,
    fontSize: 9,
    letterSpacing: 1.4,
    color: colors.fog,
  },
  labelHot: {
    color: colors.alert,
  },
  time: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.chalk,
    letterSpacing: 1,
  },
  timeHot: {
    color: colors.amberHot,
  },
  track: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  fill: {
    height: 3,
  },
});
