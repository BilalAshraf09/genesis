import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import type { Choice } from '@/data/scenarios';
import type { LiveMeter } from '@/lib/liveMeters';
import { resolveChoiceOp } from '@/lib/scenarioRegistry';
import { GlassPanel } from '@/components/GlassPanel';
import { colors, fonts } from '@/theme/colors';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  phaseTitle: string;
  phaseHint: string;
  selected: Choice | null;
  meters: LiveMeter[];
  baselineMeters: LiveMeter[];
  onCommit: () => void;
  onClear: () => void;
  commitLabel: string;
  disabled?: boolean;
  busy?: boolean;
};

const kindColor: Record<string, string> = {
  naval: colors.tealBright,
  diplomatic: colors.amber,
  economic: '#C4A878',
  kinetic: colors.alert,
  political: colors.teal,
  legal: '#8EB4C8',
  civic: '#9BC49A',
};

export function OpConfirmDock({
  phaseTitle,
  phaseHint,
  selected,
  meters,
  baselineMeters,
  onCommit,
  onClear,
  commitLabel,
  disabled,
  busy,
}: Props) {
  const slide = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(slide, {
      toValue: selected ? 1 : 0,
      friction: 8,
      tension: 60,
      useNativeDriver: false,
    }).start();
  }, [selected, slide]);

  const op = selected ? resolveChoiceOp(selected.id) : undefined;
  const accent = kindColor[op?.kind ?? 'political'] ?? colors.teal;

  const deltas = meters.map((m, i) => {
    const base = baselineMeters[i]?.value ?? m.value;
    return { id: m.id, label: m.label, delta: Math.round(m.value - base), tone: m.tone };
  });

  return (
    <GlassPanel raised gold style={styles.dockOuter} padded={false}>
      <View style={styles.dock} nativeID="op-confirm-dock">
      <View style={styles.phaseRow}>
        <Text style={styles.phaseKicker}>PHASE TARGET</Text>
        <Text style={styles.phaseTitle} numberOfLines={1}>
          {phaseTitle.toUpperCase()}
        </Text>
        <Text style={styles.phaseHint} numberOfLines={2}>
          {phaseHint}
        </Text>
      </View>

      {!selected ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>SELECT A NODE</Text>
          <Text style={styles.emptyBody}>Tap a highlighted marker on the board to place an ops token.</Text>
        </View>
      ) : (
        <Animated.View
          style={[
            styles.selected,
            {
              borderColor: accent,
              opacity: slide.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] }),
              transform: [
                {
                  translateY: slide.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }),
                },
              ],
            },
          ]}
        >
          <View style={styles.tokenRow}>
            <View style={[styles.token, { backgroundColor: accent }]}>
              <Text style={styles.tokenText}>{op?.short ?? 'OP'}</Text>
            </View>
            <View style={styles.tokenMeta}>
              <Text style={[styles.kind, { color: accent }]}>{(op?.kind ?? 'op').toUpperCase()}</Text>
              <Text style={styles.opLabel} numberOfLines={1}>
                {selected.label}
              </Text>
            </View>
            <Pressable onPress={onClear} hitSlop={12} accessibilityRole="button" accessibilityLabel="Clear selection">
              <Text style={styles.clear}>CLEAR</Text>
            </Pressable>
          </View>
          <Text style={styles.opDetail} numberOfLines={2}>
            {selected.detail}
          </Text>
          <View style={styles.previewRow}>
            <Text style={styles.previewLabel}>PREVIEW · THEATER SHIFT</Text>
            <View style={styles.chips}>
              {deltas.map((d) => (
                <View key={d.id} style={styles.chip}>
                  <Text style={styles.chipLabel}>{d.label}</Text>
                  <Text
                    style={[
                      styles.chipDelta,
                      {
                        color:
                          d.delta > 0
                            ? colors.tealBright
                            : d.delta < 0
                              ? colors.alert
                              : colors.mist,
                      },
                    ]}
                  >
                    {d.delta > 0 ? `+${d.delta}` : d.delta === 0 ? '·' : `${d.delta}`}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>
      )}

      <Pressable
        accessibilityRole="button"
        disabled={!selected || disabled || busy}
        onPress={onCommit}
        style={({ pressed }) => [
          styles.commit,
          (!selected || disabled || busy) && styles.commitOff,
          pressed && selected && !disabled && styles.commitPressed,
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
    </GlassPanel>
  );
}

const styles = StyleSheet.create({
  dockOuter: {
    borderColor: colors.lineGold,
  },
  dock: {
    padding: 12,
    gap: 10,
  },
  phaseRow: {
    gap: 3,
  },
  phaseKicker: {
    fontFamily: fonts.bodyMed,
    fontSize: 9,
    letterSpacing: 1.8,
    color: colors.goldInk,
  },
  phaseTitle: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: colors.chalk,
    letterSpacing: 1,
  },
  phaseHint: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17,
    color: colors.chalkDim,
  },
  empty: {
    borderWidth: 1,
    borderColor: colors.steelEdge,
    borderStyle: 'dashed',
    padding: 14,
    gap: 4,
    backgroundColor: 'rgba(4,10,16,0.55)',
  },
  emptyTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1.4,
    color: colors.mist,
  },
  emptyBody: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17,
    color: colors.fog,
  },
  selected: {
    borderWidth: 1,
    padding: 12,
    gap: 8,
    backgroundColor: 'rgba(18,40,52,0.85)',
  },
  tokenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  token: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 52,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  tokenText: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1,
    color: colors.void,
  },
  tokenMeta: {
    flex: 1,
    gap: 1,
  },
  kind: {
    fontFamily: fonts.bodyMed,
    fontSize: 10,
    letterSpacing: 1.2,
  },
  opLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    color: colors.chalk,
  },
  clear: {
    fontFamily: fonts.bodyMed,
    fontSize: 10,
    letterSpacing: 1.2,
    color: colors.mist,
  },
  opDetail: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17,
    color: colors.mist,
  },
  previewRow: {
    gap: 6,
  },
  previewLabel: {
    fontFamily: fonts.bodyMed,
    fontSize: 9,
    letterSpacing: 1.4,
    color: colors.fog,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
    backgroundColor: 'rgba(4,10,16,0.7)',
    borderWidth: 1,
    borderColor: colors.steelEdge,
  },
  chipLabel: {
    fontFamily: fonts.body,
    fontSize: 10,
    color: colors.chalkDim,
  },
  chipDelta: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
  },
  commit: {
    paddingVertical: 14,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.amberHot,
  },
  commitOff: {
    opacity: 0.35,
  },
  commitPressed: {
    transform: [{ scale: 0.98 }],
  },
  commitText: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    letterSpacing: 1.6,
    color: colors.void,
    zIndex: 1,
  },
});
