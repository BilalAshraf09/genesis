import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { TheaterStage3D } from '@/components/TheaterStage3D';

type Props = {
  year?: number;
  motif?: 'era' | 'desk' | 'street' | 'ops';
  /** Kept for API compat — ignored (3D stage replaces photo keys) */
  atmosphere?: string;
  intensity?: number;
  kenBurns?: boolean;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

/**
 * Full-bleed living theater backdrop — 3D command stage, not flat photos.
 */
export function EraAtmosphere({
  year = 1962,
  motif = 'era',
  intensity = 1,
  style,
  children,
}: Props) {
  return (
    <View style={[styles.root, style]} pointerEvents="box-none">
      <TheaterStage3D year={year} motif={motif} intensity={intensity} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
    backgroundColor: '#040A10',
  },
});
