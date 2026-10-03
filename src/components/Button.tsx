import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, radii } from '@/theme/colors';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost' | 'danger';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({ label, onPress, variant = 'primary', disabled, style }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variant === 'ghost' && styles.ghost,
        variant === 'danger' && styles.danger,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {variant === 'primary' ? (
        <LinearGradient
          colors={[colors.cyanHot, colors.cyan, colors.cyanDeep]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      ) : null}
      <View style={styles.sheen} pointerEvents="none" />
      <Text
        style={[
          styles.label,
          variant === 'primary' && styles.primaryLabel,
          variant === 'ghost' && styles.ghostLabel,
          variant === 'danger' && styles.dangerLabel,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.cyanHot,
    borderRadius: radii.sm,
    overflow: 'hidden',
    minHeight: 52,
  },
  ghost: {
    backgroundColor: 'rgba(16, 22, 36, 0.65)',
    borderColor: colors.steelEdge,
  },
  danger: {
    backgroundColor: colors.alertSoft,
    borderColor: colors.alert,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.985 }],
  },
  disabled: {
    opacity: 0.4,
  },
  sheen: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 16,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  label: {
    fontSize: 13,
    fontFamily: fonts.bodyBold,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    zIndex: 1,
  },
  primaryLabel: {
    color: colors.void,
  },
  ghostLabel: {
    color: colors.chalk,
  },
  dangerLabel: {
    color: colors.alert,
  },
});
