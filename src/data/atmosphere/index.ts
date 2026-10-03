import type { ImageSourcePropType } from 'react-native';
import { eraFromYear, type AmbientEra } from '@/audio/SoundProvider';

export type AtmosphereKey = 'early' | 'war' | 'cold' | 'modern' | 'cabinet' | 'crowd';

const ATMOSPHERES: Record<AtmosphereKey, ImageSourcePropType> = {
  early: require('../../../assets/atmosphere/atm_early.jpg'),
  war: require('../../../assets/atmosphere/atm_war.jpg'),
  cold: require('../../../assets/atmosphere/atm_cold.jpg'),
  modern: require('../../../assets/atmosphere/atm_modern.jpg'),
  cabinet: require('../../../assets/atmosphere/atm_cabinet.jpg'),
  crowd: require('../../../assets/atmosphere/atm_crowd.jpg'),
};

export function atmosphereSource(key: AtmosphereKey): ImageSourcePropType {
  return ATMOSPHERES[key];
}

/** Map calendar year → primary living backdrop. */
export function atmosphereForYear(year: number): AtmosphereKey {
  const era = eraFromYear(year);
  if (era === 'early') return 'early';
  if (era === 'war') return 'war';
  if (era === 'cold') return 'cold';
  return 'modern';
}

/** Secondary motif for briefing/after-action variety. */
export function atmosphereMotif(year: number, kind: 'desk' | 'street' | 'ops'): AtmosphereKey {
  if (kind === 'desk') return year < 1960 ? 'cabinet' : 'cold';
  if (kind === 'street') return year < 1945 ? 'crowd' : atmosphereForYear(year);
  return atmosphereForYear(year);
}

export function eraKeyFromYear(year: number): AmbientEra {
  return eraFromYear(year);
}
