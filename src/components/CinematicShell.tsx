import { useEffect, useMemo, useRef, type ReactNode } from 'react';
import { Animated, Easing, StyleSheet, View, type ViewStyle, type StyleProp } from 'react-native';
import Svg, { Defs, Rect, Circle } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradeForYear } from '@/theme/colors';

type Props = {
  children?: ReactNode;
  year?: number;
  intensity?: number;
  style?: StyleProp<ViewStyle>;
  /** When true, only overlays — parent supplies layout */
  overlay?: boolean;
};

/** Film grain + vignette + era grade — AAA presentation layer. */
export function CinematicShell({ children, year = 1962, intensity = 1, style, overlay }: Props) {
  const grain = useRef(new Animated.Value(0)).current;
  const grade = gradeForYear(year);

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(grain, {
          toValue: 1,
          duration: 90,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
        Animated.timing(grain, {
          toValue: 0,
          duration: 90,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [grain]);

  const dots = useMemo(() => {
    const out: { cx: number; cy: number; r: number; o: number }[] = [];
    let s = (year * 17 + 91) % 997;
    for (let i = 0; i < 48; i++) {
      s = (s * 48271) % 2147483647;
      const cx = (s % 1000) / 10;
      s = (s * 48271) % 2147483647;
      const cy = (s % 1000) / 10;
      s = (s * 48271) % 2147483647;
      const r = 0.15 + (s % 40) / 100;
      s = (s * 48271) % 2147483647;
      const o = 0.04 + (s % 50) / 800;
      out.push({ cx, cy, r, o });
    }
    return out;
  }, [year]);

  const overlays = (
    <>
      <View
        pointerEvents="none"
        style={[styles.cool, { backgroundColor: grade.cool, opacity: intensity }]}
      />
      <View
        pointerEvents="none"
        style={[styles.warm, { backgroundColor: grade.warm, opacity: intensity }]}
      />
      {grade.sepia > 0 ? (
        <View
          pointerEvents="none"
          style={[styles.sepia, { opacity: grade.sepia * intensity }]}
        />
      ) : null}
      <LinearGradient
        pointerEvents="none"
        colors={['rgba(0,0,0,0.55)', 'transparent', 'transparent', 'rgba(0,0,0,0.62)']}
        locations={[0, 0.18, 0.72, 1]}
        style={styles.vignette}
      />
      <LinearGradient
        pointerEvents="none"
        colors={['rgba(0,0,0,0.35)', 'transparent', 'rgba(0,0,0,0.4)']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.sideVignette}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          styles.grainWrap,
          {
            opacity: grain.interpolate({
              inputRange: [0, 1],
              outputRange: [0.045 * intensity, 0.09 * intensity],
            }),
          },
        ]}
      >
        <Svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <Defs />
          {dots.map((d, i) => (
            <Circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill="#fff" opacity={d.o * 8} />
          ))}
          <Rect x="0" y="0" width="100" height="100" fill="rgba(255,255,255,0.02)" />
        </Svg>
      </Animated.View>
      <View pointerEvents="none" style={styles.scan} />
    </>
  );

  if (overlay) {
    return <View style={[StyleSheet.absoluteFill, style]} pointerEvents="none">{overlays}</View>;
  }

  return (
    <View style={[styles.root, style]}>
      {children}
      {overlays}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.void,
    overflow: 'hidden',
  },
  cool: {
    ...StyleSheet.absoluteFill,
  },
  warm: {
    ...StyleSheet.absoluteFill,
  },
  sepia: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(140, 100, 50, 0.25)',
  },
  vignette: {
    ...StyleSheet.absoluteFill,
  },
  sideVignette: {
    ...StyleSheet.absoluteFill,
  },
  grainWrap: {
    ...StyleSheet.absoluteFill,
  },
  scan: {
    ...StyleSheet.absoluteFill,
    borderWidth: 1,
    borderColor: 'rgba(212, 160, 74, 0.08)',
  },
});
