import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Choice } from '@/data/scenarios';
import { resolveChoiceOp } from '@/lib/scenarioRegistry';
import { colors, fonts } from '@/theme/colors';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  selected: Choice | null;
  onCommit: () => void;
  onClear: () => void;
  commitLabel?: string;
  busy?: boolean;
};

const KIND_COLOR: Record<string, string> = {
  naval: colors.tealBright,
  diplomatic: colors.amber,
  economic: '#C4A878',
  kinetic: colors.alert,
  political: colors.teal,
  legal: '#8EB4C8',
  civic: '#9BC49A',
};

/**
 * Selection card — full ops title + briefing only.
 * Pros/cons and meter impacts stay on after-action, not here.
 */
export function NodeDetailCard({
  selected,
  onCommit,
  onClear,
  commitLabel = 'LOCK IN MOVE',
  busy,
}: Props) {
  if (!selected) return null;

  const op = resolveChoiceOp(selected.id);
  const accent = KIND_COLOR[op?.kind ?? 'political'] ?? colors.teal;

  return (
    <View style={[styles.card, { borderColor: accent }]} nativeID="node-detail-card">
      <View style={styles.head}>
        <View style={[styles.badge, { backgroundColor: accent }]}>
          <Text style={styles.badgeText}>{(op?.short ?? 'OP').toUpperCase()}</Text>
        </View>
        <Text style={[styles.kind, { color: accent }]}>
          {(op?.kind ?? 'op').toUpperCase()}
        </Text>
        <Pressable onPress={onClear} hitSlop={12} accessibilityRole="button" disabled={busy}>
          <Text style={styles.clear}>CLEAR</Text>
        </Pressable>
      </View>

      <Text style={styles.label}>{selected.label}</Text>
      <Text style={styles.detail}>{selected.detail}</Text>

      <Pressable
        accessibilityRole="button"
        disabled={busy}
        onPress={onCommit}
        style={({ pressed }) => [
          styles.commit,
          busy && styles.commitOff,
          pressed && !busy && styles.commitPressed,
        ]}
      >
        <LinearGradient
          colors={['#E8C06A', colors.amber, colors.amberDeep]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <Text style={styles.commitText}>{busy ? 'RESOLVING…' : commitLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(6,14,20,0.94)',
    borderWidth: 1.5,
    padding: 12,
    gap: 8,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1,
    color: colors.void,
  },
  kind: {
    flex: 1,
    fontFamily: fonts.bodyMed,
    fontSize: 10,
    letterSpacing: 1.2,
  },
  clear: {
    fontFamily: fonts.bodyMed,
    fontSize: 10,
    letterSpacing: 1.2,
    color: colors.mist,
  },
  label: {
    fontFamily: fonts.bodyBold,
    fontSize: 16,
    lineHeight: 22,
    color: colors.chalk,
    letterSpacing: 0.2,
  },
  detail: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
    color: colors.chalkDim,
  },
  commit: {
    marginTop: 4,
    paddingVertical: 14,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.amberHot,
  },
  commitOff: { opacity: 0.4 },
  commitPressed: { transform: [{ scale: 0.98 }] },
  commitText: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    letterSpacing: 1.6,
    color: colors.void,
    zIndex: 1,
  },
});
