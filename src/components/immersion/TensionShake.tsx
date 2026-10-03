import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, type ViewStyle } from 'react-native';

type Props = {
  children: React.ReactNode;
  /** 0–1 shake intensity */
  intensity?: number;
  style?: ViewStyle;
};

/** Subtle command-desk shake when escalation spikes. */
export function TensionShake({ children, intensity = 0, style }: Props) {
  const x = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (intensity < 0.45) {
      x.setValue(0);
      return;
    }
    const amp = 1 + intensity * 3.5;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(x, { toValue: amp, duration: 40, useNativeDriver: false }),
        Animated.timing(x, { toValue: -amp, duration: 50, useNativeDriver: false }),
        Animated.timing(x, { toValue: amp * 0.6, duration: 40, useNativeDriver: false }),
        Animated.timing(x, { toValue: 0, duration: 60, useNativeDriver: false }),
        Animated.delay(intensity > 0.75 ? 220 : 520),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [intensity, x]);

  return (
    <Animated.View style={[styles.wrap, style, { transform: [{ translateX: x }] }]}>
      <View style={styles.inner}>{children}</View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
  },
  inner: {
    width: '100%',
  },
});
