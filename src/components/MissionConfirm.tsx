import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { Choice } from '@/data/scenarios';
import { resolveChoiceOp } from '@/lib/scenarioRegistry';
import { GlassPanel } from '@/components/GlassPanel';
import { colors, fonts, radii } from '@/theme/colors';

type Props = {
  selected: Choice | null;
  onCommit: () => void;
  onClear: () => void;
  commitLabel?: string;
  busy?: boolean;
  forcedHint?: string | null;
};

const KIND_COLOR: Record<string, string> = {
  naval: colors.cyan,
  diplomatic: colors.amber,
  economic: '#C4A878',
  kinetic: colors.alert,
  political: colors.cyanDeep,
  legal: '#8EB4C8',
  civic: '#9BC49A',
};

/** Cinematic confirm dock — appears after map target select. */
export function MissionConfirm({
  selected,
  onCommit,
  onClear,
  commitLabel = 'EXECUTE ORDER',
  busy,
  forcedHint,
}: Props) {
  if (!selected && !forcedHint) return null;

  if (!selected) {
    return (
      <GlassPanel gold padded>
        <View nativeID="mission-confirm">
          <Text style={styles.forcedText}>{forcedHint}</Text>
        </View>
      </GlassPanel>
    );
  }

  const op = resolveChoiceOp(selected.id);
  const accent = KIND_COLOR[op?.kind ?? 'political'] ?? colors.cyan;

  return (
    <GlassPanel cyan padded style={{ borderColor: accent }}>
      <View style={styles.wrap} nativeID="mission-confirm">
        <View style={styles.head}>
          <View style={[styles.badge, { backgroundColor: accent }]}>
            <Text style={styles.badgeText}>{(op?.short ?? 'OP').toUpperCase()}</Text>
          </View>
          <Text style={[styles.kind, { color: accent }]}>
            {(op?.kind ?? 'op').toUpperCase()} · ORDER ARMED
          </Text>
          <Pressable onPress={onClear} hitSlop={12} disabled={busy} accessibilityRole="button">
            <Text style={styles.clear}>ABORT</Text>
          </Pressable>
        </View>
        <Text style={styles.label}>{selected.label}</Text>
        <Text style={styles.detail} numberOfLines={2}>
          {selected.detail}
        </Text>
        <Text style={styles.verbHint}>Pros / cons resolve after EXECUTE — not on the board.</Text>
        {forcedHint ? <Text style={styles.forcedInline}>{forcedHint}</Text> : null}
        <Pressable
          accessibilityRole="button"
          disabled={busy}
          onPress={onCommit}
          style={({ pressed }) => [styles.exec, busy && styles.execOff, pressed && !busy && styles.execPressed]}
        >
          <LinearGradient
            colors={[colors.cyanHot, colors.cyan, colors.cyanDeep]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Text style={styles.execText}>{busy ? 'COMMITTING…' : commitLabel}</Text>
        </Pressable>
      </View>
    </GlassPanel>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.xs,
  },
  badgeText: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1.2,
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
    fontSize: 17,
    lineHeight: 22,
    color: colors.chalk,
  },
  detail: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: colors.chalkDim,
  },
  verbHint: {
    fontFamily: fonts.bodyMed,
    fontSize: 10,
    letterSpacing: 0.6,
    color: colors.fog,
  },
  forcedText: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 1,
    color: colors.alert,
    textAlign: 'center',
  },
  forcedInline: {
    fontFamily: fonts.bodyMed,
    fontSize: 11,
    letterSpacing: 0.8,
    color: colors.alert,
  },
  exec: {
    marginTop: 6,
    paddingVertical: 16,
    alignItems: 'center',
    minHeight: 54,
    justifyContent: 'center',
    overflow: 'hidden',
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.cyanHot,
  },
  execOff: { opacity: 0.4 },
  execPressed: { transform: [{ scale: 0.98 }] },
  execText: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    letterSpacing: 2.2,
    color: colors.void,
    zIndex: 1,
  },
});
