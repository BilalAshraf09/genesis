/** Genesis modern AAA visual system — console strategy / narrative-action grade. */

export const colors = {
  // Depth
  void: '#05070C',
  deep: '#0A0E18',
  ink: '#0D1220',
  panel: 'rgba(16, 22, 36, 0.72)',
  panelSolid: '#121826',
  panelRaised: 'rgba(24, 32, 52, 0.88)',
  panelGlass: 'rgba(14, 20, 34, 0.55)',

  // Edges
  steel: '#1C2438',
  steelEdge: 'rgba(160, 190, 220, 0.22)',
  steelHi: 'rgba(255, 255, 255, 0.16)',
  steelLo: 'rgba(0, 0, 0, 0.5)',
  grid: 'rgba(80, 200, 220, 0.07)',
  line: 'rgba(140, 180, 210, 0.2)',
  lineGold: 'rgba(255, 196, 96, 0.45)',
  lineCyan: 'rgba(64, 230, 210, 0.45)',

  // Type
  mist: '#9AADC2',
  fog: '#5E7188',
  chalk: '#F4F7FB',
  chalkDim: '#B4C2D4',

  // Accents — electric cyan primary, ember secondary (no purple cluster)
  cyan: '#2EE6C8',
  cyanHot: '#6FF5DE',
  cyanDeep: '#0A8A78',
  amber: '#FFB84D',
  amberHot: '#FFD078',
  amberDeep: '#B06A12',
  teal: '#2EE6C8',
  tealBright: '#6FF5DE',
  alert: '#FF6B4A',
  alertSoft: 'rgba(255, 107, 74, 0.2)',
  safe: '#3DCF8A',
  goldInk: '#E8B86A',

  // Legacy aliases used across codebase
  corridor: 'rgba(46, 230, 200, 0.28)',
  tension: 'rgba(255, 107, 74, 0.28)',
  marker: '#E8F0F8',
  black: '#000000',
  film: 'rgba(5, 7, 12, 0.4)',
} as const;

export const fonts = {
  display: 'Orbitron_700Bold',
  displayMed: 'Orbitron_600SemiBold',
  body: 'Sora_400Regular',
  bodyMed: 'Sora_500Medium',
  bodyBold: 'Sora_600SemiBold',
} as const;

export const radii = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
} as const;

export const space = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 36,
} as const;

/** Period color grades keyed loosely by year band. */
export const eraGrade = {
  early: { cool: 'rgba(20, 40, 55, 0.35)', warm: 'rgba(80, 50, 20, 0.18)', sepia: 0.1 },
  mid: { cool: 'rgba(18, 36, 55, 0.32)', warm: 'rgba(70, 45, 20, 0.12)', sepia: 0.05 },
  cold: { cool: 'rgba(20, 45, 70, 0.38)', warm: 'rgba(30, 40, 60, 0.1)', sepia: 0.02 },
  modern: { cool: 'rgba(12, 28, 48, 0.35)', warm: 'rgba(40, 30, 25, 0.08)', sepia: 0 },
} as const;

export function gradeForYear(year: number) {
  if (year < 1939) return eraGrade.early;
  if (year < 1962) return eraGrade.mid;
  if (year < 1991) return eraGrade.cold;
  return eraGrade.modern;
}

export const motion = {
  snap: 160,
  soft: 320,
  cinematic: 700,
  springFriction: 7,
} as const;

export const elevation = {
  board: {
    shadowColor: '#000',
    shadowOpacity: 0.55,
    shadowRadius: 28,
    shadowOffset: { width: 0, height: 14 },
    elevation: 16,
  },
  hud: {
    shadowColor: '#0A8A78',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  piece: {
    shadowColor: '#000',
    shadowOpacity: 0.55,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  glowCyan: {
    shadowColor: '#2EE6C8',
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },
} as const;
