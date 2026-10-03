import type { Scenario } from '@/data/scenarios';
import type { DecisionRecord } from '@/lib/evaluate';

export type MindNode = {
  id: string;
  label: string;
  kind: 'beat' | 'taken' | 'alt';
  short?: string;
  children?: MindNode[];
};

/**
 * Build a path mindmap: root = scenario title; children = beats in order;
 * each beat node’s primary child is the taken choice (`taken`), with
 * untaken choices as `alt` siblings — so the tree shows path vs branches.
 */
export function buildPathMindmap(scenario: Scenario, decisions: DecisionRecord[]): MindNode {
  const byBeat = new Map(decisions.map((d) => [d.beatId, d]));

  const beatNodes: MindNode[] = scenario.beats.map((beat) => {
    const taken = byBeat.get(beat.id);
    const choiceNodes: MindNode[] = beat.choices.map((choice) => {
      const isTaken = taken?.choice.id === choice.id;
      return {
        id: choice.id,
        label: choice.label,
        kind: isTaken ? 'taken' : 'alt',
        short: undefined,
      };
    });

    // Put taken choice first when present so the primary branch reads as the path.
    if (taken) {
      choiceNodes.sort((a, b) => {
        if (a.kind === 'taken' && b.kind !== 'taken') return -1;
        if (b.kind === 'taken' && a.kind !== 'taken') return 1;
        return 0;
      });
    }

    return {
      id: beat.id,
      label: beat.title,
      kind: 'beat' as const,
      children: choiceNodes,
    };
  });

  return {
    id: scenario.id,
    label: scenario.title,
    kind: 'beat',
    children: beatNodes,
  };
}
