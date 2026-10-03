import { StyleSheet, Text, View } from 'react-native';
import type { MindNode } from '@/lib/mindmap';
import { resolveChoiceOp } from '@/lib/scenarioRegistry';
import { colors, fonts } from '@/theme/colors';

type Props = {
  root: MindNode;
};

function ChoiceRow({ node }: { node: MindNode }) {
  const op = resolveChoiceOp(node.id);
  const taken = node.kind === 'taken';
  return (
    <View style={[styles.choiceRow, taken ? styles.choiceTaken : styles.choiceAlt]}>
      <View style={[styles.dot, taken ? styles.dotTaken : styles.dotAlt]} />
      <View style={styles.choiceText}>
        <Text style={[styles.choiceKind, taken && styles.choiceKindTaken]}>
          {(op?.short ?? node.short ?? 'OP').toUpperCase()}
          {taken ? ' · PATH' : ' · BRANCH'}
        </Text>
        <Text style={[styles.choiceLabel, !taken && styles.choiceLabelAlt]} numberOfLines={2}>
          {node.label}
        </Text>
      </View>
    </View>
  );
}

function BeatBlock({ beat, index }: { beat: MindNode; index: number }) {
  return (
    <View style={styles.beatBlock}>
      <View style={styles.beatRail}>
        <View style={styles.beatIndex}>
          <Text style={styles.beatIndexText}>{index + 1}</Text>
        </View>
        {index < 9 ? <View style={styles.railLine} /> : null}
      </View>
      <View style={styles.beatBody}>
        <Text style={styles.beatTitle}>{beat.label}</Text>
        <View style={styles.choices}>
          {(beat.children ?? []).map((c) => (
            <ChoiceRow key={c.id} node={c} />
          ))}
        </View>
      </View>
    </View>
  );
}

export function PathMindmap({ root }: Props) {
  const beats = root.children ?? [];
  return (
    <View style={styles.wrap} testID="path-mindmap" nativeID="path-mindmap">
      <Text style={styles.rootLabel}>{root.label.toUpperCase()}</Text>
      <Text style={styles.legend}>
        PATH = selections you committed · BRANCH = alternate ops at that phase
      </Text>
      <View style={styles.tree}>
        {beats.map((beat, i) => (
          <BeatBlock key={beat.id} beat={beat} index={i} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.panel,
    padding: 14,
    gap: 10,
  },
  rootLabel: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.chalk,
    letterSpacing: 1,
  },
  legend: {
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 16,
    color: colors.mist,
  },
  tree: {
    gap: 0,
  },
  beatBlock: {
    flexDirection: 'row',
    gap: 10,
  },
  beatRail: {
    width: 28,
    alignItems: 'center',
  },
  beatIndex: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.amber,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.deep,
  },
  beatIndexText: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    color: colors.amber,
  },
  railLine: {
    flex: 1,
    width: 2,
    minHeight: 12,
    backgroundColor: colors.line,
    marginVertical: 2,
  },
  beatBody: {
    flex: 1,
    paddingBottom: 14,
    gap: 6,
  },
  beatTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    color: colors.chalk,
  },
  choices: {
    gap: 6,
  },
  choiceRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    alignItems: 'flex-start',
  },
  choiceTaken: {
    borderColor: colors.tealBright,
    backgroundColor: 'rgba(91, 196, 181, 0.1)',
  },
  choiceAlt: {
    borderColor: colors.line,
    backgroundColor: colors.deep,
    opacity: 0.72,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 5,
  },
  dotTaken: {
    backgroundColor: colors.tealBright,
  },
  dotAlt: {
    backgroundColor: colors.fog,
  },
  choiceText: {
    flex: 1,
    gap: 2,
  },
  choiceKind: {
    fontFamily: fonts.bodyMed,
    fontSize: 10,
    letterSpacing: 1,
    color: colors.mist,
  },
  choiceKindTaken: {
    color: colors.tealBright,
  },
  choiceLabel: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17,
    color: colors.chalk,
  },
  choiceLabelAlt: {
    color: colors.chalkDim,
  },
});
