import type { OpKind, TheaterDef } from '@/data/theaters';

export type TheaterArchetype =
  | 'pacific'
  | 'sahel'
  | 'redsea'
  | 'americas'
  | 'southasia'
  | 'markets'
  | 'arctic'
  | 'gulf'
  | 'europe';

type Template = Omit<TheaterDef, 'scenarioId' | 'title'> & {
  archetype: TheaterArchetype;
  defaultTitle: string;
};

const templates: Template[] = [
  {
    archetype: 'pacific',
    id: 'pacific',
    defaultTitle: 'PACIFIC LANE',
    subtitle: 'Indo-Pacific · strait watch',
    water: '#082430',
    land: '#16363A',
    accent: '#5BC4B5',
    markers: [
      { id: 'strait', label: 'Strait', x: 52, y: 55, kind: 'flashpoint' },
      { id: 'capital_a', label: 'Capital A', x: 40, y: 42, kind: 'capital' },
      { id: 'capital_b', label: 'Capital B', x: 68, y: 38, kind: 'capital' },
      { id: 'fleet', label: 'Fleet', x: 58, y: 62, kind: 'corridor' },
      { id: 'cable', label: 'Cable', x: 46, y: 68, kind: 'hotspot' },
      { id: 'island', label: 'Island', x: 62, y: 50, kind: 'hotspot' },
    ],
    corridors: [
      { from: 'fleet', to: 'strait' },
      { from: 'strait', to: 'island' },
    ],
    zones: [
      { id: 'lane', label: 'SEA LANE', x: 44, y: 48, w: 28, h: 20, tension: 0.75 },
      { id: 'island-chain', label: 'ISLAND CHAIN', x: 56, y: 36, w: 22, h: 18, tension: 0.55 },
    ],
  },
  {
    archetype: 'sahel',
    id: 'sahel',
    defaultTitle: 'SAHEL FRONT',
    subtitle: 'Sahel · corridor & capital',
    water: '#1A140C',
    land: '#2A2418',
    accent: '#D4A04A',
    markers: [
      { id: 'capital', label: 'Capital', x: 48, y: 40, kind: 'capital' },
      { id: 'border', label: 'Border', x: 62, y: 48, kind: 'flashpoint' },
      { id: 'mine', label: 'Mine belt', x: 36, y: 58, kind: 'hotspot' },
      { id: 'convoy', label: 'Convoy', x: 54, y: 62, kind: 'corridor' },
      { id: 'radio', label: 'Broadcast', x: 42, y: 34, kind: 'hotspot' },
      { id: 'camp', label: 'Camp', x: 70, y: 56, kind: 'flashpoint' },
    ],
    corridors: [
      { from: 'capital', to: 'border' },
      { from: 'convoy', to: 'mine' },
    ],
    zones: [
      { id: 'state', label: 'STATE CORE', x: 38, y: 32, w: 24, h: 22, tension: 0.65 },
      { id: 'frontier', label: 'FRONTIER', x: 52, y: 48, w: 28, h: 22, tension: 0.8 },
    ],
  },
  {
    archetype: 'redsea',
    id: 'redsea',
    defaultTitle: 'RED SEA LANE',
    subtitle: 'Red Sea · Bab el-Mandeb',
    water: '#0A1E2A',
    land: '#1C2E28',
    accent: '#C45C3A',
    markers: [
      { id: 'chokepoint', label: 'Chokepoint', x: 50, y: 58, kind: 'flashpoint' },
      { id: 'port', label: 'Port', x: 42, y: 48, kind: 'hotspot' },
      { id: 'escort', label: 'Escort', x: 58, y: 64, kind: 'corridor' },
      { id: 'proxy', label: 'Proxy', x: 56, y: 42, kind: 'flashpoint' },
      { id: 'insurer', label: 'Insurer', x: 28, y: 36, kind: 'hotspot' },
      { id: 'canal', label: 'Canal link', x: 48, y: 28, kind: 'corridor' },
    ],
    corridors: [
      { from: 'canal', to: 'chokepoint' },
      { from: 'escort', to: 'port' },
    ],
    zones: [
      { id: 'lane', label: 'SHIPPING LANE', x: 40, y: 44, w: 28, h: 28, tension: 0.85 },
      { id: 'shore', label: 'SHORE NODES', x: 48, y: 34, w: 22, h: 16, tension: 0.6 },
    ],
  },
  {
    archetype: 'americas',
    id: 'americas',
    defaultTitle: 'AMERICAS DESK',
    subtitle: 'Americas · capital & commodity',
    water: '#0A2228',
    land: '#1A322C',
    accent: '#5BC4B5',
    markers: [
      { id: 'capital', label: 'Capital', x: 44, y: 46, kind: 'capital' },
      { id: 'port', label: 'Export port', x: 58, y: 62, kind: 'hotspot' },
      { id: 'plaza', label: 'Plaza', x: 40, y: 54, kind: 'flashpoint' },
      { id: 'imf', label: 'Creditor', x: 22, y: 30, kind: 'hotspot' },
      { id: 'farm', label: 'Farm belt', x: 52, y: 58, kind: 'corridor' },
      { id: 'court', label: 'Court', x: 46, y: 40, kind: 'hotspot' },
    ],
    corridors: [
      { from: 'farm', to: 'port' },
      { from: 'capital', to: 'imf' },
    ],
    zones: [
      { id: 'urban', label: 'URBAN CORE', x: 36, y: 40, w: 22, h: 22, tension: 0.55 },
      { id: 'export', label: 'EXPORT AXIS', x: 46, y: 52, w: 26, h: 18, tension: 0.5 },
    ],
  },
  {
    archetype: 'southasia',
    id: 'southasia',
    defaultTitle: 'PARTITION LINE',
    subtitle: 'India–Pakistan · Partition theater',
    water: '#0C2030',
    land: '#1E3340',
    accent: '#D4A04A',
    markers: [
      { id: 'loc', label: 'Punjab line', x: 40, y: 30, kind: 'flashpoint' },
      { id: 'capital_a', label: 'Delhi', x: 48, y: 38, kind: 'capital' },
      { id: 'capital_b', label: 'Karachi', x: 18, y: 52, kind: 'capital' },
      { id: 'valley', label: 'Kashmir', x: 46, y: 16, kind: 'hotspot' },
      { id: 'media', label: 'Bengal', x: 78, y: 48, kind: 'hotspot' },
      { id: 'third', label: 'Princely', x: 60, y: 60, kind: 'hotspot' },
    ],
    corridors: [
      { from: 'capital_a', to: 'loc' },
      { from: 'capital_b', to: 'loc' },
      { from: 'media', to: 'capital_a' },
    ],
    zones: [
      { id: 'border', label: 'PARTITION BELT', x: 34, y: 28, w: 32, h: 22, tension: 0.8 },
      { id: 'info', label: 'REFUGEE LANES', x: 30, y: 48, w: 28, h: 18, tension: 0.55 },
    ],
  },
  {
    archetype: 'markets',
    id: 'markets',
    defaultTitle: 'MARKET DESK',
    subtitle: 'Global markets · liquidity lane',
    water: '#0A1824',
    land: '#162636',
    accent: '#E8B85C',
    markers: [
      { id: 'exchange', label: 'Exchange', x: 48, y: 48, kind: 'capital' },
      { id: 'fed', label: 'Central bank', x: 32, y: 40, kind: 'hotspot' },
      { id: 'desk', label: 'Trading desk', x: 58, y: 42, kind: 'hotspot' },
      { id: 'treasury', label: 'Treasury', x: 40, y: 56, kind: 'flashpoint' },
      { id: 'em', label: 'EM flows', x: 68, y: 58, kind: 'corridor' },
      { id: 'energy', label: 'Energy', x: 54, y: 64, kind: 'hotspot' },
    ],
    corridors: [
      { from: 'fed', to: 'exchange' },
      { from: 'exchange', to: 'em' },
    ],
    zones: [
      { id: 'core', label: 'LIQUIDITY CORE', x: 36, y: 38, w: 30, h: 24, tension: 0.7 },
      { id: 'periphery', label: 'EM RING', x: 56, y: 52, w: 24, h: 18, tension: 0.55 },
    ],
  },
  {
    archetype: 'arctic',
    id: 'arctic',
    defaultTitle: 'ARCTIC LANE',
    subtitle: 'Arctic · route & claim',
    water: '#0A2030',
    land: '#1A2E3A',
    accent: '#8EB4C8',
    markers: [
      { id: 'route', label: 'Sea route', x: 50, y: 48, kind: 'corridor' },
      { id: 'claim', label: 'Claim', x: 58, y: 40, kind: 'flashpoint' },
      { id: 'base', label: 'Base', x: 42, y: 56, kind: 'hotspot' },
      { id: 'rig', label: 'Rig', x: 62, y: 54, kind: 'hotspot' },
      { id: 'council', label: 'Council', x: 34, y: 36, kind: 'capital' },
      { id: 'cable', label: 'Cable', x: 48, y: 62, kind: 'hotspot' },
    ],
    corridors: [
      { from: 'route', to: 'rig' },
      { from: 'base', to: 'route' },
    ],
    zones: [
      { id: 'passage', label: 'PASSAGE', x: 40, y: 42, w: 30, h: 20, tension: 0.6 },
      { id: 'claims', label: 'CLAIMS', x: 50, y: 34, w: 22, h: 16, tension: 0.7 },
    ],
  },
  {
    archetype: 'gulf',
    id: 'gulf',
    defaultTitle: 'GULF LANE',
    subtitle: 'Gulf theater · Hormuz lane',
    water: '#0A2A36',
    land: '#1A3A32',
    accent: '#D4A04A',
    markers: [
      { id: 'strait', label: 'Strait', x: 48, y: 58, kind: 'flashpoint' },
      { id: 'hormuz', label: 'Hormuz', x: 56, y: 52, kind: 'corridor' },
      { id: 'tehran', label: 'Tehran', x: 58, y: 28, kind: 'capital' },
      { id: 'dubai', label: 'Dubai', x: 62, y: 62, kind: 'hotspot' },
      { id: 'riyadh', label: 'Riyadh', x: 38, y: 68, kind: 'capital' },
      { id: 'oman', label: 'Muscat', x: 72, y: 70, kind: 'hotspot' },
      { id: 'oil', label: 'SPR node', x: 22, y: 42, kind: 'hotspot' },
      { id: 'base', label: 'Logistics', x: 44, y: 48, kind: 'hotspot' },
      { id: 'proxy', label: 'Proxy dep.', x: 52, y: 38, kind: 'flashpoint' },
    ],
    corridors: [
      { from: 'hormuz', to: 'dubai' },
      { from: 'strait', to: 'oman' },
      { from: 'oil', to: 'strait' },
    ],
    zones: [
      { id: 'lane', label: 'TRAFFIC LANE', x: 42, y: 48, w: 28, h: 18, tension: 0.8 },
      { id: 'iran', label: 'IRAN', x: 48, y: 18, w: 30, h: 22, tension: 0.55 },
      { id: 'gulf-arab', label: 'GULF STATES', x: 28, y: 58, w: 26, h: 22, tension: 0.4 },
    ],
  },
  {
    archetype: 'europe',
    id: 'europe',
    defaultTitle: 'EUROPE DESK',
    subtitle: 'EU theater · capital axis',
    water: '#0A2230',
    land: '#1B2E3A',
    accent: '#5BC4B5',
    markers: [
      { id: 'capital', label: 'Capital', x: 42, y: 48, kind: 'capital' },
      { id: 'brussels', label: 'Brussels', x: 38, y: 42, kind: 'hotspot' },
      { id: 'parliament', label: 'Parliament', x: 44, y: 52, kind: 'hotspot' },
      { id: 'streets', label: 'Streets', x: 40, y: 56, kind: 'flashpoint' },
      { id: 'districts', label: 'Districts', x: 52, y: 58, kind: 'flashpoint' },
      { id: 'ballot', label: 'Ballot', x: 48, y: 44, kind: 'hotspot' },
    ],
    corridors: [
      { from: 'capital', to: 'brussels' },
      { from: 'parliament', to: 'streets' },
    ],
    zones: [
      { id: 'core', label: 'GOVERNANCE CORE', x: 34, y: 38, w: 24, h: 24, tension: 0.7 },
      { id: 'civic', label: 'CIVIC BELT', x: 36, y: 54, w: 28, h: 16, tension: 0.6 },
      { id: 'eu-ring', label: 'EU RING', x: 22, y: 28, w: 40, h: 18, tension: 0.45 },
    ],
  },
];

export function buildTheaterFromArchetype(
  archetype: TheaterArchetype,
  scenarioId: string,
  title: string,
): TheaterDef {
  const t = templates.find((x) => x.archetype === archetype) ?? templates[0];
  return {
    id: `${t.id}-${scenarioId}`,
    scenarioId,
    title: title.toUpperCase().slice(0, 22),
    subtitle: t.subtitle,
    water: t.water,
    land: t.land,
    accent: t.accent,
    markers: t.markers.map((m) => ({ ...m })),
    corridors: t.corridors.map((c) => ({ ...c })),
    zones: t.zones.map((z) => ({ ...z })),
  };
}

export const defaultOpsForMarkers = (
  choiceId: string,
  markerId: string,
  kind: OpKind,
  short: string,
) => ({ [choiceId]: { kind, markerId, short } });
