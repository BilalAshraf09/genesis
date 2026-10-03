/**
 * Theater-specific geographic silhouettes (normalized 0–100 board space).
 * Each crisis gets a recognizable landmass — coasts, peninsulas, islands —
 * readable like a modern strategy ops map, not an abstract painted blob.
 */

export type GeoPoint = [number, number];

export type GeoRegion = {
  id: string;
  label: string;
  water: string;
  land: string;
  landHi: string;
  accent: string;
  /** Closed land polygons */
  lands: GeoPoint[][];
  /** Optional inland seas / lakes */
  waters?: GeoPoint[][];
  /** Border strokes (partition lines, DMZ, etc.) */
  borders?: GeoPoint[][];
  /** Optional river polylines for terrain read */
  rivers?: GeoPoint[][];
  cities: { name: string; x: number; y: number }[];
};

/** Scenario id → region id */
export const SCENARIO_GEO: Record<string, string> = {
  'hist-1905-port-arthur': 'manchuria',
  'hist-1914-july-wire': 'europe-central',
  'hist-1917-balfour': 'levant',
  'hist-1917-petrograd': 'russia-west',
  'hist-1919-versailles': 'europe-west',
  'hist-1920-anatolia': 'anatolia',
  'hist-1929-black-thursday': 'atlantic-finance',
  'hist-1931-mukden': 'manchuria',
  'hist-1938-munich': 'europe-central',
  'hist-1939-corridor': 'poland-corridor',
  'hist-1941-pacific-entry': 'pacific-hawaii',
  'hist-1945-trinity': 'pacific-japan',
  'hist-1947-radcliffe': 'southasia',
  'hist-1948-two-koreas': 'korea',
  'hist-1948-marshall': 'europe-west',
  'hist-1949-october': 'china-east',
  'hist-1950-korea': 'korea',
  'hist-1956-suez': 'suez',
  'hist-1962-cuba': 'caribbean',
  'hist-1968-prague': 'europe-central',
  'hist-1973-oil': 'gulf',
  'hist-1979-persian-pivot': 'gulf',
  'hist-1989-wall': 'berlin',
  'hist-1991-union-end': 'russia-west',
  'hist-1997-contagion': 'se-asia',
  'hist-2001-enduring': 'afghanistan',
  'hist-2008-lehman': 'atlantic-finance',
  'hist-2011-squares': 'maghreb-east',
  'hist-2014-crimea': 'black-sea',
  'hist-2020-lockdown': 'world-hubs',
  'hist-2024-hormuz-relapse': 'gulf',
  'hist-2025-coalition-aftershock': 'europe-east',
};

export const GEO_REGIONS: Record<string, GeoRegion> = {
  manchuria: {
    id: 'manchuria',
    label: 'Manchuria · Sea of Japan',
    water: '#0A2430',
    land: '#1A3A2E',
    landHi: '#2A5040',
    accent: '#5BC4B5',
    lands: [
      // Liaodong / Manchuria mainland with Yellow Sea bite
      [
        [6, 28], [18, 16], [34, 10], [48, 14], [58, 22], [62, 34],
        [58, 48], [52, 58], [44, 66], [34, 70], [24, 64], [16, 52],
        [10, 40],
      ],
      // Korean peninsula tip east
      [
        [58, 36], [66, 32], [72, 40], [70, 54], [64, 66], [56, 72],
        [52, 62], [54, 48],
      ],
      // Honshu arc
      [
        [74, 24], [84, 18], [92, 28], [90, 42], [82, 50], [74, 40],
      ],
    ],
    cities: [
      { name: 'Port Arthur', x: 42, y: 62 },
      { name: 'Mukden', x: 38, y: 36 },
      { name: 'Tokyo', x: 82, y: 34 },
      { name: 'Vladivostok', x: 62, y: 26 },
    ],
  },
  'europe-central': {
    id: 'europe-central',
    label: 'Central Europe',
    water: '#0C2230',
    land: '#243428',
    landHi: '#344838',
    accent: '#D4A04A',
    lands: [
      // Contiguous Central Europe with Adriatic bite + Baltic north
      [
        [18, 22], [32, 12], [48, 8], [64, 12], [78, 20], [86, 34],
        [84, 48], [76, 58], [68, 68], [54, 76], [40, 74], [28, 66],
        [18, 54], [14, 38],
      ],
    ],
    waters: [
      // Adriatic notch
      [[48, 68], [58, 70], [56, 82], [46, 78]],
    ],
    borders: [[[42, 16], [44, 34], [50, 50], [54, 68]]],
    cities: [
      { name: 'Munich', x: 44, y: 52 },
      { name: 'Prague', x: 52, y: 40 },
      { name: 'Berlin', x: 50, y: 28 },
      { name: 'Vienna', x: 58, y: 56 },
    ],
  },
  levant: {
    id: 'levant',
    label: 'Levant · Eastern Mediterranean',
    water: '#0A1E2C',
    land: '#2A2818',
    landHi: '#3A3824',
    accent: '#C4A878',
    lands: [
      // Anatolia plateau
      [
        [28, 8], [48, 6], [68, 12], [78, 24], [72, 34], [52, 32],
        [36, 28], [28, 18],
      ],
      // Levant corridor + Sinai + Nile delta
      [
        [42, 34], [54, 36], [58, 48], [56, 62], [48, 74], [40, 82],
        [32, 76], [28, 62], [30, 48], [36, 38],
      ],
      // Cyprus
      [[48, 28], [56, 26], [58, 32], [50, 34]],
    ],
    cities: [
      { name: 'Jerusalem', x: 50, y: 58 },
      { name: 'Cairo', x: 36, y: 74 },
      { name: 'Damascus', x: 54, y: 48 },
      { name: 'Istanbul', x: 42, y: 18 },
    ],
  },
  'russia-west': {
    id: 'russia-west',
    label: 'Western Russia · Baltic',
    water: '#0A2030',
    land: '#1C2830',
    landHi: '#2C3840',
    accent: '#8EB4C8',
    lands: [
      [
        [22, 14], [48, 8], [72, 14], [88, 28], [90, 48], [78, 66],
        [58, 78], [38, 74], [22, 60], [14, 40], [16, 24],
      ],
    ],
    waters: [
      // Gulf of Finland bite
      [[28, 18], [42, 16], [44, 26], [30, 28]],
    ],
    cities: [
      { name: 'Petrograd', x: 36, y: 24 },
      { name: 'Moscow', x: 58, y: 40 },
      { name: 'Kiev', x: 40, y: 58 },
      { name: 'Riga', x: 30, y: 32 },
    ],
  },
  'europe-west': {
    id: 'europe-west',
    label: 'Western Europe',
    water: '#0C2434',
    land: '#223428',
    landHi: '#324838',
    accent: '#D4A04A',
    lands: [
      // Iberia + France + Low Countries + W Germany
      [
        [18, 58], [22, 42], [28, 28], [38, 18], [52, 14], [64, 18],
        [72, 28], [74, 42], [68, 56], [58, 68], [46, 74], [34, 78],
        [24, 72], [16, 64],
      ],
      // Britain
      [
        [34, 6], [46, 4], [52, 12], [48, 22], [38, 24], [32, 16],
      ],
      // Ireland
      [[26, 12], [32, 10], [34, 18], [28, 20]],
    ],
    cities: [
      { name: 'Paris', x: 46, y: 40 },
      { name: 'London', x: 42, y: 16 },
      { name: 'Berlin', x: 64, y: 28 },
      { name: 'Brussels', x: 50, y: 30 },
    ],
  },
  anatolia: {
    id: 'anatolia',
    label: 'Anatolia · Aegean',
    water: '#0A2230',
    land: '#2A2A1C',
    landHi: '#3A3A28',
    accent: '#C45C3A',
    lands: [
      // Anatolian rectangle with Aegean fingers
      [
        [22, 28], [40, 18], [62, 16], [82, 24], [88, 40], [82, 56],
        [64, 64], [46, 62], [32, 54], [22, 42],
      ],
      // Greece / Aegean mainland
      [
        [14, 48], [24, 44], [28, 56], [24, 68], [16, 64],
      ],
    ],
    cities: [
      { name: 'Istanbul', x: 42, y: 26 },
      { name: 'Ankara', x: 58, y: 40 },
      { name: 'Smyrna', x: 32, y: 48 },
      { name: 'Athens', x: 20, y: 58 },
    ],
  },
  'atlantic-finance': {
    id: 'atlantic-finance',
    label: 'North Atlantic · finance hubs',
    water: '#081828',
    land: '#1A2830',
    landHi: '#2A3840',
    accent: '#C4A878',
    lands: [
      // NE America seaboard
      [
        [6, 22], [22, 12], [34, 18], [36, 36], [32, 54], [22, 66],
        [10, 58], [6, 40],
      ],
      // Britain + Ireland
      [
        [58, 18], [70, 14], [76, 24], [72, 36], [62, 38], [56, 28],
      ],
      [[50, 22], [56, 20], [58, 28], [52, 30]],
      // W Europe fringe
      [
        [62, 42], [78, 40], [84, 52], [78, 64], [64, 62], [58, 52],
      ],
    ],
    cities: [
      { name: 'New York', x: 24, y: 36 },
      { name: 'London', x: 66, y: 28 },
      { name: 'Paris', x: 70, y: 48 },
      { name: 'Boston', x: 28, y: 24 },
    ],
  },
  'poland-corridor': {
    id: 'poland-corridor',
    label: 'Polish Corridor · Baltic',
    water: '#0A2230',
    land: '#243428',
    landHi: '#344838',
    accent: '#D4A04A',
    lands: [
      [
        [16, 28], [36, 14], [58, 12], [78, 22], [86, 40], [80, 60],
        [62, 74], [40, 78], [22, 66], [14, 46],
      ],
    ],
    waters: [
      // Baltic bite / Danzig
      [[42, 8], [58, 10], [56, 22], [42, 20]],
    ],
    borders: [[[48, 18], [50, 40], [48, 62]]],
    cities: [
      { name: 'Danzig', x: 48, y: 22 },
      { name: 'Warsaw', x: 54, y: 48 },
      { name: 'Berlin', x: 36, y: 38 },
      { name: 'Königsberg', x: 62, y: 24 },
    ],
  },
  'pacific-hawaii': {
    id: 'pacific-hawaii',
    label: 'Central Pacific · Hawaii',
    water: '#061E2C',
    land: '#1A3834',
    landHi: '#2A4844',
    accent: '#5BC4B5',
    lands: [
      // Hawaiian chain
      [[28, 48], [38, 44], [42, 52], [34, 56]],
      [[48, 46], [58, 42], [62, 50], [52, 54]],
      [[66, 40], [78, 36], [82, 46], [70, 50]],
      // Midway / atolls
      [[18, 28], [26, 26], [28, 34], [20, 36]],
      [[72, 22], [80, 20], [82, 28], [74, 30]],
    ],
    cities: [
      { name: 'Pearl Harbor', x: 54, y: 48 },
      { name: 'Honolulu', x: 58, y: 50 },
      { name: 'Midway', x: 22, y: 30 },
      { name: 'Wake', x: 78, y: 24 },
    ],
  },
  'pacific-japan': {
    id: 'pacific-japan',
    label: 'Japan · Home Islands',
    water: '#061E2C',
    land: '#1A3834',
    landHi: '#2A4844',
    accent: '#5BC4B5',
    lands: [
      // Hokkaido
      [[58, 8], [72, 6], [78, 16], [70, 24], [58, 20]],
      // Honshu
      [
        [52, 22], [66, 18], [76, 28], [74, 42], [66, 52], [56, 56],
        [48, 46], [48, 32],
      ],
      // Shikoku
      [[52, 56], [62, 54], [64, 64], [54, 66]],
      // Kyushu
      [[46, 62], [56, 60], [58, 74], [48, 78], [42, 70]],
      // Okinawa chain
      [[38, 82], [48, 80], [50, 90], [40, 92]],
    ],
    cities: [
      { name: 'Tokyo', x: 68, y: 34 },
      { name: 'Hiroshima', x: 52, y: 54 },
      { name: 'Nagasaki', x: 48, y: 68 },
      { name: 'Okinawa', x: 44, y: 86 },
    ],
  },

  southasia: {
    id: 'southasia',
    label: 'Indian subcontinent',
    water: '#0A2434',
    land: '#2A3A24',
    landHi: '#3A4A34',
    accent: '#D4A04A',
    lands: [
      // Dense subcontinent outline — Himalaya → Assam → tip → Gujarat
      [
        [11, 44], [10, 38], [11, 32], [14, 26], [18, 20], [24, 14], [30, 10],
        [36, 8], [42, 7], [48, 8], [54, 10], [60, 12], [66, 15], [72, 18],
        [77, 22], [81, 28], [83, 34], [82, 40], [80, 46], [77, 50], [73, 53],
        [69, 55], [66, 58], [64, 63], [62, 68], [60, 73], [57, 78], [54, 82],
        [50, 86], [46, 89], [43, 91], [40, 89], [38, 85], [36, 80], [34, 75],
        [32, 70], [30, 65], [29, 60], [27, 56], [24, 52], [20, 48], [16, 46],
        [13, 45],
      ],
      // Kathiawar / Gujarat peninsula (distinct west bulge)
      [
        [15, 48], [21, 46], [26, 50], [25, 56], [20, 58], [15, 54],
      ],
      // Sri Lanka teardrop
      [
        [48, 92], [53, 91], [56, 94], [55, 98], [50, 99], [46, 96],
      ],
      // Andaman chain hint
      [[79, 62], [83, 60], [85, 67], [81, 69]],
    ],
    rivers: [
      [[18, 22], [20, 32], [18, 42], [16, 48]],
      [[48, 28], [56, 34], [64, 42], [72, 48], [78, 46]],
    ],
    borders: [
      [[28, 16], [34, 26], [40, 34], [48, 42], [58, 48], [70, 50], [78, 44]],
    ],
    cities: [
      { name: 'Delhi', x: 48, y: 36 },
      { name: 'Lahore', x: 38, y: 28 },
      { name: 'Calcutta', x: 70, y: 50 },
      { name: 'Karachi', x: 16, y: 46 },
      { name: 'Dhaka', x: 76, y: 46 },
      { name: 'Mumbai', x: 30, y: 62 },
    ],
  },

  /**
   * Korean Peninsula — must read as peninsula hanging south of Manchuria,
   * with Yellow Sea (W) and Sea of Japan (E), DMZ across the waist.
   */
  korea: {
    id: 'korea',
    label: 'Korean Peninsula',
    water: '#0A2030',
    land: '#1A342E',
    landHi: '#2A443E',
    accent: '#5BC4B5',
    lands: [
      // Narrow Chinese/Manchurian shoulder (north only — don't drown the peninsula)
      [
        [18, 6], [34, 4], [48, 6], [54, 14], [48, 20], [34, 22], [20, 16],
      ],
      // THE peninsula — tall, thin, unmistakable southward spear
      [
        [44, 18], [50, 16], [56, 18], [60, 24], [62, 32], [64, 42],
        [64, 52], [62, 62], [60, 70], [56, 78], [52, 84], [48, 88],
        [44, 84], [42, 76], [40, 66], [40, 56], [40, 46], [42, 36],
        [42, 26],
      ],
      // Jeju south of tip
      [[46, 92], [54, 91], [56, 96], [50, 98], [46, 96]],
      // Honshu west edge (far right, separated by Sea of Japan)
      [
        [78, 28], [88, 24], [94, 34], [90, 48], [82, 52], [78, 40],
      ],
    ],
    borders: [
      [[42, 50], [62, 50]],
    ],
    cities: [
      { name: 'Seoul', x: 50, y: 56 },
      { name: 'Pyongyang', x: 48, y: 40 },
      { name: 'Busan', x: 56, y: 80 },
      { name: 'Incheon', x: 44, y: 54 },
    ],
  },

  'china-east': {
    id: 'china-east',
    label: 'Eastern China',
    water: '#0A2430',
    land: '#243828',
    landHi: '#344838',
    accent: '#C45C3A',
    lands: [
      // China eastern seaboard with Bohai / Yellow Sea bite
      [
        [14, 18], [36, 8], [58, 10], [74, 20], [82, 36], [80, 52],
        [72, 66], [60, 78], [46, 84], [32, 78], [20, 64], [14, 44],
        [12, 28],
      ],
      // Taiwan
      [[78, 62], [86, 58], [88, 72], [80, 76]],
      // Korea tip
      [[68, 22], [76, 20], [78, 32], [72, 36]],
    ],
    waters: [
      // Bohai Gulf
      [[52, 22], [64, 20], [66, 32], [54, 34]],
    ],
    cities: [
      { name: 'Beijing', x: 54, y: 26 },
      { name: 'Shanghai', x: 70, y: 48 },
      { name: 'Nanjing', x: 64, y: 44 },
      { name: 'Guangzhou', x: 56, y: 72 },
    ],
  },
  suez: {
    id: 'suez',
    label: 'Suez · Red Sea',
    water: '#0A1E2C',
    land: '#2A2818',
    landHi: '#3A3824',
    accent: '#C45C3A',
    lands: [
      // Nile delta / Egypt
      [
        [18, 28], [32, 22], [42, 28], [44, 42], [40, 58], [34, 72],
        [26, 80], [18, 70], [14, 50], [14, 36],
      ],
      // Sinai triangle
      [
        [44, 34], [56, 30], [60, 44], [54, 56], [46, 52],
      ],
      // Levant coast
      [
        [56, 18], [66, 14], [70, 28], [64, 38], [56, 34],
      ],
      // Arabian Red Sea coast
      [
        [62, 52], [74, 48], [78, 64], [72, 78], [60, 72],
      ],
    ],
    borders: [[[46, 34], [48, 46], [46, 56]]],
    cities: [
      { name: 'Suez', x: 48, y: 50 },
      { name: 'Cairo', x: 34, y: 52 },
      { name: 'Port Said', x: 44, y: 34 },
      { name: 'Tel Aviv', x: 60, y: 28 },
    ],
  },
  caribbean: {
    id: 'caribbean',
    label: 'Caribbean · Cuba',
    water: '#061E2C',
    land: '#1A3A32',
    landHi: '#2A4A42',
    accent: '#5BC4B5',
    lands: [
      // Cuba — long cigar with Habana west / Oriente east
      [
        [12, 44], [18, 40], [28, 36], [40, 34], [52, 35], [64, 38],
        [74, 42], [80, 46], [82, 52], [76, 56], [64, 55], [50, 53],
        [36, 52], [24, 50], [14, 48],
      ],
      // Florida peninsula pointing south
      [
        [50, 6], [58, 5], [64, 10], [66, 18], [64, 28], [58, 34],
        [52, 30], [50, 20], [48, 12],
      ],
      // Yucatán
      [
        [4, 56], [14, 50], [24, 52], [28, 62], [22, 72], [10, 74], [4, 66],
      ],
      // Hispaniola
      [
        [78, 58], [90, 56], [94, 64], [88, 70], [78, 66],
      ],
    ],
    cities: [
      { name: 'Havana', x: 28, y: 44 },
      { name: 'Miami', x: 58, y: 24 },
      { name: 'Guantánamo', x: 72, y: 50 },
      { name: 'Key West', x: 52, y: 32 },
    ],
  },
  gulf: {
    id: 'gulf',
    label: 'Persian Gulf · Hormuz',
    water: '#0A2434',
    land: '#2A2818',
    landHi: '#3A3824',
    accent: '#D4A04A',
    lands: [
      // Arabian Peninsula (NE corner / Gulf coast)
      [
        [14, 48], [32, 42], [48, 48], [52, 62], [48, 78], [32, 88],
        [16, 82], [10, 64],
      ],
      // Iran / Zagros
      [
        [42, 12], [62, 8], [82, 14], [90, 28], [86, 44], [72, 52],
        [56, 48], [46, 36], [42, 24],
      ],
      // Qatar / Bahrain spit
      [[42, 54], [48, 52], [50, 60], [44, 62]],
    ],
    cities: [
      { name: 'Hormuz', x: 60, y: 50 },
      { name: 'Tehran', x: 68, y: 24 },
      { name: 'Riyadh', x: 32, y: 70 },
      { name: 'Dubai', x: 54, y: 56 },
    ],
  },
  berlin: {
    id: 'berlin',
    label: 'Berlin · divided city',
    water: '#0C2030',
    land: '#222830',
    landHi: '#323840',
    accent: '#8EB4C8',
    lands: [
      [
        [18, 22], [40, 12], [66, 14], [84, 28], [86, 50], [74, 70],
        [52, 82], [28, 76], [14, 56], [12, 36],
      ],
    ],
    borders: [[[50, 14], [50, 82]]],
    cities: [
      { name: 'Berlin', x: 50, y: 46 },
      { name: 'Potsdam', x: 44, y: 56 },
      { name: 'Warsaw', x: 72, y: 42 },
      { name: 'Prague', x: 54, y: 68 },
    ],
  },
  'se-asia': {
    id: 'se-asia',
    label: 'Southeast Asia',
    water: '#061E2C',
    land: '#1A3A2E',
    landHi: '#2A4A3E',
    accent: '#5BC4B5',
    lands: [
      // Indochina mainland
      [
        [38, 8], [54, 6], [64, 16], [62, 32], [54, 42], [46, 38],
        [40, 24],
      ],
      // Malay Peninsula
      [
        [46, 42], [56, 44], [58, 58], [52, 66], [46, 58],
      ],
      // Sumatra
      [
        [36, 58], [48, 62], [52, 76], [40, 82], [30, 72],
      ],
      // Java
      [
        [48, 78], [68, 76], [74, 84], [56, 88], [46, 84],
      ],
      // Borneo
      [
        [58, 52], [74, 48], [80, 62], [70, 70], [58, 64],
      ],
    ],
    cities: [
      { name: 'Bangkok', x: 50, y: 32 },
      { name: 'Singapore', x: 52, y: 62 },
      { name: 'Jakarta', x: 58, y: 82 },
      { name: 'HK', x: 60, y: 12 },
    ],
  },
  afghanistan: {
    id: 'afghanistan',
    label: 'Afghanistan · Hindu Kush',
    water: '#1A140C',
    land: '#2A2418',
    landHi: '#3A3428',
    accent: '#D4A04A',
    lands: [
      [
        [16, 36], [34, 16], [56, 12], [74, 20], [86, 36], [82, 56],
        [66, 72], [44, 80], [24, 70], [14, 52],
      ],
    ],
    cities: [
      { name: 'Kabul', x: 54, y: 40 },
      { name: 'Kandahar', x: 42, y: 62 },
      { name: 'Herat', x: 26, y: 44 },
      { name: 'Islamabad', x: 72, y: 42 },
    ],
  },
  'maghreb-east': {
    id: 'maghreb-east',
    label: 'North Africa · Levant squares',
    water: '#0A1E2C',
    land: '#2A2818',
    landHi: '#3A3824',
    accent: '#C45C3A',
    lands: [
      // Maghreb → Egypt coastal belt
      [
        [6, 38], [28, 24], [52, 20], [74, 26], [88, 36], [90, 52],
        [78, 64], [56, 72], [32, 74], [12, 64], [4, 50],
      ],
    ],
    cities: [
      { name: 'Cairo', x: 68, y: 48 },
      { name: 'Tunis', x: 32, y: 36 },
      { name: 'Tripoli', x: 44, y: 52 },
      { name: 'Damascus', x: 80, y: 40 },
    ],
  },
  'black-sea': {
    id: 'black-sea',
    label: 'Black Sea · Crimea',
    water: '#0A2030',
    land: '#1C2C30',
    landHi: '#2C3C40',
    accent: '#8EB4C8',
    lands: [
      // Ukraine / Russian steppe north of Black Sea
      [
        [14, 12], [42, 6], [68, 10], [84, 22], [88, 38], [78, 46],
        [62, 42], [48, 44], [34, 42], [20, 46], [12, 32],
      ],
      // Crimea peninsula
      [
        [48, 46], [62, 44], [66, 54], [58, 62], [48, 56],
      ],
      // Anatolian north shore
      [
        [22, 68], [48, 64], [72, 66], [80, 76], [64, 86], [30, 84],
        [18, 76],
      ],
    ],
    cities: [
      { name: 'Crimea', x: 56, y: 52 },
      { name: 'Kyiv', x: 48, y: 22 },
      { name: 'Sevastopol', x: 54, y: 56 },
      { name: 'Moscow', x: 70, y: 14 },
    ],
  },
  'world-hubs': {
    id: 'world-hubs',
    label: 'Global hubs',
    water: '#06101A',
    land: '#1A2830',
    landHi: '#2A3840',
    accent: '#5BC4B5',
    lands: [
      [[10, 30], [26, 24], [32, 40], [18, 48]],
      [[40, 24], [56, 20], [60, 36], [44, 40]],
      [[64, 34], [78, 30], [82, 46], [66, 50]],
      [[34, 54], [48, 50], [52, 66], [36, 70]],
    ],
    cities: [
      { name: 'NYC', x: 20, y: 36 },
      { name: 'London', x: 48, y: 28 },
      { name: 'Shanghai', x: 72, y: 40 },
      { name: 'São Paulo', x: 28, y: 64 },
    ],
  },
  'europe-east': {
    id: 'europe-east',
    label: 'Eastern Europe · coalition belt',
    water: '#0C2230',
    land: '#243028',
    landHi: '#344038',
    accent: '#D4A04A',
    lands: [
      [
        [14, 20], [38, 8], [64, 10], [82, 22], [90, 42], [84, 64],
        [66, 78], [42, 84], [22, 72], [12, 48],
      ],
    ],
    waters: [
      // Baltic
      [[40, 6], [58, 8], [56, 18], [40, 16]],
      // Black Sea bite
      [[58, 68], [74, 66], [76, 78], [60, 80]],
    ],
    cities: [
      { name: 'Warsaw', x: 48, y: 40 },
      { name: 'Kyiv', x: 64, y: 44 },
      { name: 'Bucharest', x: 60, y: 62 },
      { name: 'Baltic', x: 46, y: 20 },
    ],
  },
};

export function geoForScenario(scenarioId: string): GeoRegion {
  const key = SCENARIO_GEO[scenarioId] ?? 'europe-central';
  return GEO_REGIONS[key] ?? GEO_REGIONS['europe-central'];
}

export function geoForTheaterId(theaterId: string): GeoRegion {
  if (SCENARIO_GEO[theaterId]) return geoForScenario(theaterId);
  const id = theaterId.toLowerCase();
  if (id.includes('korea')) return GEO_REGIONS.korea;
  if (id.includes('radcliffe') || id.includes('southasia')) return GEO_REGIONS.southasia;
  if (id.includes('balfour')) return GEO_REGIONS.levant;
  if (id.includes('munich') || id.includes('prague')) return GEO_REGIONS['europe-central'];
  if (id.includes('hormuz') || id.includes('gulf') || id.includes('persian')) return GEO_REGIONS.gulf;
  if (id.includes('crimea')) return GEO_REGIONS['black-sea'];
  if (id.includes('cuba')) return GEO_REGIONS.caribbean;
  if (id.includes('suez')) return GEO_REGIONS.suez;
  return GEO_REGIONS['europe-central'];
}
