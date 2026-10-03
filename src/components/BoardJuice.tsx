import { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { colors } from '@/theme/colors';

type Burst = { id: number; x: number; y: number };

type Props = {
  /** Pixel coords relative to board */
  burst?: { x: number; y: number; key: number } | null;
  punch?: number;
};

/** Toyetic particle ring + spark burst on piece snap. */
export function BoardJuice({ burst }: Props) {
  const items = useMemo(() => {
    if (!burst) return [] as Burst[];
    return Array.from({ length: 10 }, (_, i) => ({ id: i, x: burst.x, y: burst.y }));
  }, [burst?.key, burst?.x, burst?.y]);

  if (!burst || !items.length) return null;

  return (
    <View style={styles.layer} pointerEvents="none" nativeID="board-juice">
      <JuiceRing cx={burst.x} cy={burst.y} key={`ring-${burst.key}`} />
      {items.map((p, i) => (
        <Spark key={`${burst.key}-${i}`} cx={burst.x} cy={burst.y} index={i} />
      ))}
    </View>
  );
}

function JuiceRing({ cx, cy }: { cx: number; cy: number }) {
  const scale = useRef(new Animated.Value(0.4)).current;
  const opacity = useRef(new Animated.Value(0.9)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 2.4,
        duration: 480,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 480,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      }),
    ]).start();
  }, [scale, opacity]);
  return (
    <Animated.View
      style={[
        styles.ring,
        {
          left: cx - 28,
          top: cy - 28,
          opacity,
          transform: [{ scale }],
        },
      ]}
    />
  );
}

function Spark({ cx, cy, index }: { cx: number; cy: number; index: number }) {
  const t = useRef(new Animated.Value(0)).current;
  const angle = (index / 10) * Math.PI * 2 + 0.2;
  const dist = 36 + (index % 3) * 14;
  useEffect(() => {
    Animated.timing(t, {
      toValue: 1,
      duration: 420 + (index % 4) * 40,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [t, index]);
  return (
    <Animated.View
      style={[
        styles.spark,
        {
          left: t.interpolate({
            inputRange: [0, 1],
            outputRange: [cx - 3, cx - 3 + Math.cos(angle) * dist],
          }),
          top: t.interpolate({
            inputRange: [0, 1],
            outputRange: [cy - 3, cy - 3 + Math.sin(angle) * dist],
          }),
          opacity: t.interpolate({ inputRange: [0, 0.7, 1], outputRange: [1, 0.8, 0] }),
          transform: [
            {
              scale: t.interpolate({ inputRange: [0, 1], outputRange: [1.2, 0.3] }),
            },
          ],
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  layer: {
    ...StyleSheet.absoluteFill,
    zIndex: 30,
  },
  ring: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: colors.amberHot,
    backgroundColor: 'rgba(240,192,106,0.18)',
  },
  spark: {
    position: 'absolute',
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.amberHot,
  },
});
