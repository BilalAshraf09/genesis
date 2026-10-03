export type OpKind = 'naval' | 'diplomatic' | 'economic' | 'kinetic' | 'political' | 'legal' | 'civic';

export type MapMarker = {
  id: string;
  label: string;
  x: number; // 0-100
  y: number;
  kind: 'hotspot' | 'capital' | 'corridor' | 'flashpoint';
};

export type TheaterDef = {
  id: string;
  scenarioId: string;
  title: string;
  subtitle: string;
  water: string;
  land: string;
  accent: string;
  markers: MapMarker[];
  corridors: { from: string; to: string }[];
  zones: { id: string; label: string; x: number; y: number; w: number; h: number; tension: number }[];
};

/** Choice → map op placement (mirrors existing choice ids). */
export const choiceOps: Record<
  string,
  { kind: OpKind; markerId: string; short: string }
> = {
  'iran-1a': { kind: 'naval', markerId: 'strait', short: 'ESCORT' },
  'iran-1b': { kind: 'diplomatic', markerId: 'tehran', short: 'CHANNEL' },
  'iran-1c': { kind: 'economic', markerId: 'dubai', short: 'FREEZE' },
  'iran-2a': { kind: 'naval', markerId: 'hormuz', short: 'CORRIDOR' },
  'iran-2b': { kind: 'economic', markerId: 'oil', short: 'SPR' },
  'iran-2c': { kind: 'diplomatic', markerId: 'riyadh', short: 'SHARE' },
  'iran-3a': { kind: 'diplomatic', markerId: 'base', short: 'ATTRIB' },
  'iran-3b': { kind: 'diplomatic', markerId: 'tehran', short: 'PRIVATE' },
  'iran-3c': { kind: 'kinetic', markerId: 'proxy', short: 'STRIKE' },
  'iran-4a': { kind: 'diplomatic', markerId: 'oman', short: 'DEAL' },
  'iran-4b': { kind: 'economic', markerId: 'dubai', short: 'HOLD' },
  'iran-4c': { kind: 'diplomatic', markerId: 'oman', short: 'SWAP' },
  'eu-1a': { kind: 'political', markerId: 'capital', short: 'CABINET' },
  'eu-1b': { kind: 'political', markerId: 'capital', short: 'MINORITY' },
  'eu-1c': { kind: 'civic', markerId: 'ballot', short: 'REELECT' },
  'eu-2a': { kind: 'legal', markerId: 'streets', short: 'INQUIRE' },
  'eu-2b': { kind: 'legal', markerId: 'streets', short: 'BAN' },
  'eu-2c': { kind: 'civic', markerId: 'districts', short: 'MEDIATE' },
  'eu-3a': { kind: 'diplomatic', markerId: 'brussels', short: 'COMPLY' },
  'eu-3b': { kind: 'political', markerId: 'brussels', short: 'CLASH' },
  'eu-3c': { kind: 'political', markerId: 'capital', short: 'THEATER' },
  'eu-4a': { kind: 'political', markerId: 'parliament', short: 'NARROW' },
  'eu-4b': { kind: 'political', markerId: 'parliament', short: 'SECURITY' },
  'eu-4c': { kind: 'civic', markerId: 'streets', short: 'VIGIL' },
};

export const theaters: TheaterDef[] = [
  {
    id: 'gulf',
    scenarioId: 'iran-escalation',
    title: 'STRAT. PRESSURE',
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
    id: 'europe',
    scenarioId: 'europe-far-right',
    title: 'BALLOT AFTERSHOCK',
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

export function theaterForScenario(scenarioId: string): TheaterDef | undefined {
  return theaters.find((t) => t.scenarioId === scenarioId);
}
