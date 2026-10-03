import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Choice } from '@/data/scenarios';
import { resolveChoiceOp } from '@/lib/scenarioRegistry';
import { colors, fonts } from '@/theme/colors';

type Props = {
  choices: Choice[];
  selectedId: string | null;
  onSelect: (choice: Choice) => void;
  briefing: string;
  stakes: string;
  title: string;
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

export function CommandPanel({
  choices,
  selectedId,
  onSelect,
  briefing,
  stakes,
  title,
}: Props) {
  return (
    <View style={styles.panel}>
      <Text style={styles.opsTitle}>OPS BRIEF · {title.toUpperCase()}</Text>
      <Text style={styles.briefing} numberOfLines={4}>
        {briefing}
      </Text>
      <Text style={styles.stakes} numberOfLines={2}>
        {stakes}
      </Text>
      <View style={styles.ops}>
        {choices.map((choice) => {
          const op = resolveChoiceOp(choice.id);
          const active = selectedId === choice.id;
          const accent = kindColor[op?.kind ?? 'political'] ?? colors.teal;
          return (
            <Pressable
              key={choice.id}
              onPress={() => onSelect(choice)}
              style={[styles.op, active && { borderColor: accent, backgroundColor: colors.panelRaised }]}
              accessibilityRole="radio"
              accessibilityState={{ selected: active }}
            >
              <View style={styles.opTop}>
                <View style={[styles.token, { backgroundColor: accent }]}>
                  <Text style={styles.tokenText}>{op?.short ?? 'OP'}</Text>
                </View>
                <Text style={[styles.kind, { color: accent }]}>
                  {(op?.kind ?? 'op').toUpperCase()}
                </Text>
              </View>
              <Text style={styles.opLabel}>{choice.label}</Text>
              <Text style={styles.opDetail} numberOfLines={2}>
                {choice.detail}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 14,
    gap: 8,
  },
  opsTitle: {
    fontFamily: fonts.bodyMed,
    fontSize: 10,
    letterSpacing: 1.6,
    color: colors.amber,
  },
  briefing: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
    color: colors.chalk,
  },
  stakes: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17,
    color: colors.chalkDim,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  ops: {
    gap: 8,
  },
  op: {
    borderWidth: 1,
    borderColor: colors.line,
    padding: 12,
    gap: 5,
    backgroundColor: colors.deep,
  },
  opTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  token: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tokenText: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1,
    color: colors.void,
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
  opDetail: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17,
    color: colors.mist,
  },
});
