import type { ImageSourcePropType } from 'react-native';
import type { TheaterArchetype } from '@/data/theaterTemplates';
import type { TheaterDef } from '@/data/theaters';

const TERRAIN: Record<TheaterArchetype, ImageSourcePropType> = {
  pacific: require('../../assets/maps/terrain_pacific.jpg'),
  sahel: require('../../assets/maps/terrain_sahel.jpg'),
  redsea: require('../../assets/maps/terrain_redsea.jpg'),
  americas: require('../../assets/maps/terrain_americas.jpg'),
  southasia: require('../../assets/maps/terrain_southasia.jpg'),
  markets: require('../../assets/maps/terrain_markets.jpg'),
  arctic: require('../../assets/maps/terrain_arctic.jpg'),
  gulf: require('../../assets/maps/terrain_gulf.jpg'),
  europe: require('../../assets/maps/terrain_europe.jpg'),
};

const ORDER: TheaterArchetype[] = [
  'pacific',
  'sahel',
  'redsea',
  'americas',
  'southasia',
  'markets',
  'arctic',
  'gulf',
  'europe',
];

export function resolveMapArchetype(theater: TheaterDef): TheaterArchetype {
  const id = theater.id.toLowerCase();
  const scenario = (theater.scenarioId ?? '').toLowerCase();
  const hay = `${id} ${scenario}`;
  if (hay.includes('radcliffe') || hay.includes('southasia') || hay.includes('partition')) {
    return 'southasia';
  }
  if (hay.includes('korea') || hay.includes('manchuria') || hay.includes('mukden') || hay.includes('port-arthur')) {
    return 'pacific';
  }
  if (hay.includes('cuba') || hay.includes('americas') || hay.includes('caribbean')) {
    return 'americas';
  }
  if (hay.includes('hormuz') || hay.includes('gulf') || hay.includes('persian') || hay.includes('oil')) {
    return 'gulf';
  }
  if (hay.includes('suez') || hay.includes('balfour') || hay.includes('anatolia') || hay.includes('redsea')) {
    return 'redsea';
  }
  if (hay.includes('sahel') || hay.includes('enduring') || hay.includes('afghan')) {
    return 'sahel';
  }
  if (hay.includes('lehman') || hay.includes('black-thursday') || hay.includes('contagion') || hay.includes('markets')) {
    return 'markets';
  }
  if (hay.includes('arctic')) {
    return 'arctic';
  }
  for (const a of ORDER) {
    if (id.startsWith(a)) return a;
  }
  return 'europe';
}

export function terrainSource(theater: TheaterDef): ImageSourcePropType {
  return TERRAIN[resolveMapArchetype(theater)];
}

export { TERRAIN };
