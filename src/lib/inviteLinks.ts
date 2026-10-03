/**
 * Deep-link + universal-link invite helpers.
 * Scheme: genesis://invite?from=&theater=&score=&path=
 * Web: /invite?... (same query)
 */

export type InvitePayload = {
  from: string;
  theater: string;
  score: number;
  path: string;
  year?: number;
  title?: string;
};

const SCHEME = 'genesis';

export function buildInviteQuery(opts: {
  from?: string | null;
  theaterId: string;
  score: number;
  pathFamily?: string | null;
  year?: number;
  title?: string;
}): string {
  const params = new URLSearchParams();
  params.set('from', (opts.from?.trim() || 'ops-desk').slice(0, 48));
  params.set('theater', opts.theaterId);
  params.set('score', String(Math.max(0, Math.round(opts.score))));
  params.set('path', (opts.pathFamily || 'mixed').replace(/\s+/g, '_').toLowerCase());
  if (opts.year) params.set('year', String(opts.year));
  if (opts.title) params.set('title', opts.title.slice(0, 80));
  return params.toString();
}

/** Native / cold-start deep link. */
export function buildGenesisInviteUrl(opts: Parameters<typeof buildInviteQuery>[0]): string {
  return `${SCHEME}://invite?${buildInviteQuery(opts)}`;
}

/** HTTPS universal-link stub (replace host when store listing is live). */
export function buildHttpsInviteUrl(opts: Parameters<typeof buildInviteQuery>[0]): string {
  const host =
    (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_UNIVERSAL_LINK_HOST?.trim()) ||
    'genesis.app';
  return `https://${host}/invite?${buildInviteQuery(opts)}`;
}

/** Prefer web path for share paste; include scheme for native peers. */
export function buildShareableInviteLine(opts: Parameters<typeof buildInviteQuery>[0]): string {
  const web = `/invite?${buildInviteQuery(opts)}`;
  const deep = buildGenesisInviteUrl(opts);
  return `Accept challenge: ${web}\nOr open: ${deep}`;
}

export function parseInviteParams(
  raw: Record<string, string | string[] | undefined> | URLSearchParams | null | undefined,
): InvitePayload | null {
  if (!raw) return null;
  const get = (key: string): string => {
    if (raw instanceof URLSearchParams) return raw.get(key) ?? '';
    const v = raw[key];
    if (Array.isArray(v)) return v[0] ?? '';
    return typeof v === 'string' ? v : '';
  };
  const theater = get('theater').trim();
  const scoreRaw = get('score').trim();
  if (!theater || !scoreRaw) return null;
  const score = Number(scoreRaw);
  if (!Number.isFinite(score)) return null;
  return {
    from: get('from').trim() || 'ops-desk',
    theater,
    score: Math.round(score),
    path: get('path').trim() || 'mixed',
    year: get('year') ? Number(get('year')) || undefined : undefined,
    title: get('title').trim() || undefined,
  };
}

/** Parse genesis://invite?... or https://…/invite?... or relative /invite?... */
export function parseInviteUrl(url: string): InvitePayload | null {
  try {
    const trimmed = url.trim();
    if (!trimmed) return null;
    if (trimmed.startsWith(`${SCHEME}://`)) {
      const rest = trimmed.slice(`${SCHEME}://`.length);
      const qIdx = rest.indexOf('?');
      const path = qIdx >= 0 ? rest.slice(0, qIdx) : rest;
      const query = qIdx >= 0 ? rest.slice(qIdx + 1) : '';
      if (!path.startsWith('invite')) return null;
      return parseInviteParams(new URLSearchParams(query));
    }
    if (trimmed.startsWith('/invite')) {
      const qIdx = trimmed.indexOf('?');
      const query = qIdx >= 0 ? trimmed.slice(qIdx + 1) : '';
      return parseInviteParams(new URLSearchParams(query));
    }
    const u = new URL(trimmed);
    if (!u.pathname.includes('invite')) return null;
    return parseInviteParams(u.searchParams);
  } catch {
    return null;
  }
}
