export function fx(tag, weight, summary) {
  return { tag, weight, summary };
}

export function ch(id, label, detail, kind, markerId, short, effects) {
  if (String(short).length > 8) throw new Error(`short too long: ${short} (${id})`);
  return { id, label, detail, kind, markerId, short, effects };
}

export function beat(id, title, briefing, stakes, choices) {
  if (choices.length !== 3) throw new Error(`beat ${id} needs 3 choices`);
  return { id, title, briefing, stakes, choices };
}

export function scenario(s) {
  if (!s.id.startsWith('hist-')) throw new Error(`id must be hist-*: ${s.id}`);
  if (s.beats.length !== 4 && s.beats.length !== 10) {
    throw new Error(`${s.id} needs 4 or 10 beats (got ${s.beats.length})`);
  }
  return s;
}
