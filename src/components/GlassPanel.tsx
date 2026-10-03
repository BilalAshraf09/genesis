import type { ReactNode } from 'react';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, elevation, radii } from '@/theme/colors';

type Props = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  raised?: boolean;
  gold?: boolean;
  cyan?: boolean;
  padded?: boolean;
  intensity?: number;
};

/** Frosted glass HUD chassis — modern console panel. */
export function GlassPanel({
  children,
  style,
  raised,
  gold,
  cyan,
  padded = true,
  intensity = 42,
}: Props) {
  const edge = gold ? styles.edgeGold : cyan ? styles.edgeCyan : styles.edge;

  return (
    <View style={[styles.wrap, raised && elevation.hud, style]}>
      {Platform.OS === 'web' ? (
        <View style={[styles.blurFallback, raised && styles.blurRaised]} />
      ) : (
        <BlurView intensity={intensity} tint="dark" style={StyleSheet.absoluteFill} />
      )}
      <LinearGradient
        colors={
          raised
            ? ['rgba(40, 52, 78, 0.55)', 'rgba(12, 18, 32, 0.72)', 'rgba(8, 12, 22, 0.85)']
            : ['rgba(28, 38, 58, 0.45)', 'rgba(10, 16, 28, 0.62)', 'rgba(6, 10, 18, 0.78)']
        }
        locations={[0, 0.5, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.2, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={['rgba(255,255,255,0.14)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.sheen}
        pointerEvents="none"
      />
      <View style={edge} pointerEvents="none" />
      <View style={[styles.inner, padded && styles.padded]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderRadius: radii.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.steelEdge,
    backgroundColor: colors.panelGlass,
  },
  blurFallback: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(10, 14, 24, 0.62)',
  },
  blurRaised: {
    backgroundColor: 'rgba(14, 20, 34, 0.72)',
  },
  sheen: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 22,
  },
  edge: {
    ...StyleSheet.absoluteFill,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: 'transparent',
    borderTopColor: colors.steelHi,
    borderLeftColor: 'rgba(255,255,255,0.06)',
    borderBottomColor: colors.steelLo,
  },
  edgeGold: {
    ...StyleSheet.absoluteFill,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.lineGold,
    borderTopColor: 'rgba(255, 208, 120, 0.4)',
  },
  edgeCyan: {
    ...StyleSheet.absoluteFill,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.lineCyan,
    borderTopColor: 'rgba(111, 245, 222, 0.35)',
  },
  inner: {
    position: 'relative',
    zIndex: 1,
  },
  padded: {
    padding: 14,
  },
});
