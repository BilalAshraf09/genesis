/**
 * Theater figures — dossier identities for each historical scenario.
 * Portraits: Wikimedia Commons PD/CC where available, else studio photoreal art.
 * Bundled offline — not scraped press photography.
 */

export type TheaterFigure = {
  id: string;
  name: string;
  role: string;
  /** Key under assets/figures/{portraitKey}.jpg */
  portraitKey: string;
};

export type TheaterFigures = {
  scenarioId: string;
  year: number;
  title: string;
  era: string;
  figures: TheaterFigure[];
};

function f(id: string, name: string, role: string): TheaterFigure {
  return { id, name, role, portraitKey: id };
}

export const theaterFiguresCatalog: TheaterFigures[] = [
  {
    scenarioId: 'hist-1905-port-arthur',
    year: 1905,
    title: 'Port Arthur Echo',
    era: '1900–1914',
    figures: [
      f('f-1905-witte', 'Sergei Witte', 'Russian peace plenipotentiary'),
      f('f-1905-komura', 'Komura Jutarō', 'Japanese foreign minister'),
      f('f-1905-roosevelt', 'Theodore Roosevelt', 'Mediation host'),
    ],
  },
  {
    scenarioId: 'hist-1914-july-wire',
    year: 1914,
    title: 'July Wire',
    era: '1914–1918',
    figures: [
      f('f-1914-grey', 'Edward Grey', 'British foreign secretary'),
      f('f-1914-berchtold', 'Leopold Berchtold', 'Austro-Hungarian foreign minister'),
      f('f-1914-sazonov', 'Sergei Sazonov', 'Russian foreign minister'),
    ],
  },
  {
    scenarioId: 'hist-1917-petrograd',
    year: 1917,
    title: 'Petrograd Fracture',
    era: '1914–1918',
    figures: [
      f('f-1917-kerensky', 'Alexander Kerensky', 'Provisional Government'),
      f('f-1917-lenin', 'Vladimir Lenin', 'Bolshevik leadership'),
      f('f-1917-buchanan', 'George Buchanan', 'Allied ambassador'),
    ],
  },
  {
    scenarioId: 'hist-1919-versailles',
    year: 1919,
    title: 'Versailles Table',
    era: '1919–1939',
    figures: [
      f('f-1919-wilson', 'Woodrow Wilson', 'U.S. president'),
      f('f-1919-clemenceau', 'Georges Clemenceau', 'French premier'),
      f('f-1919-lloyd', 'David Lloyd George', 'British prime minister'),
    ],
  },
  {
    scenarioId: 'hist-1920-anatolia',
    year: 1920,
    title: 'Anatolian Mandate',
    era: '1919–1939',
    figures: [
      f('f-1920-ataturk', 'Mustafa Kemal', 'Nationalist commander'),
      f('f-1920-venizelos', 'Eleftherios Venizelos', 'Greek statesman'),
      f('f-1920-curzon', 'Lord Curzon', 'British foreign secretary'),
    ],
  },
  {
    scenarioId: 'hist-1929-black-thursday',
    year: 1929,
    title: 'Black Thursday Desk',
    era: '1919–1939',
    figures: [
      f('f-1929-hoover', 'Herbert Hoover', 'U.S. president'),
      f('f-1929-mellon', 'Andrew Mellon', 'Treasury secretary'),
      f('f-1929-strong', 'Benjamin Strong', 'Federal Reserve Bank of NY'),
    ],
  },
  {
    scenarioId: 'hist-1931-mukden',
    year: 1931,
    title: 'Mukden Hour',
    era: '1919–1939',
    figures: [
      f('f-1931-stimson', 'Henry Stimson', 'U.S. secretary of state'),
      f('f-1931-chiang', 'Chiang Kai-shek', 'Chinese Nationalist leader'),
      f('f-1931-lytton', 'Lord Lytton', 'League inquiry chair'),
    ],
  },
  {
    scenarioId: 'hist-1938-munich',
    year: 1938,
    title: 'Munich Window',
    era: '1919–1939',
    figures: [
      f('f-1938-chamberlain', 'Neville Chamberlain', 'British prime minister'),
      f('f-1938-daladier', 'Édouard Daladier', 'French premier'),
      f('f-1938-benes', 'Edvard Beneš', 'Czechoslovak president'),
    ],
  },
  {
    scenarioId: 'hist-1939-corridor',
    year: 1939,
    title: 'Corridor Ultimatum',
    era: '1939–1945',
    figures: [
      f('f-1939-halifax', 'Lord Halifax', 'British foreign secretary'),
      f('f-1939-beck', 'Józef Beck', 'Polish foreign minister'),
      f('f-1939-ribbentrop', 'Joachim von Ribbentrop', 'German foreign minister'),
    ],
  },
  {
    scenarioId: 'hist-1941-pacific-entry',
    year: 1941,
    title: 'Pacific Threshold',
    era: '1939–1945',
    figures: [
      f('f-1941-fdr', 'Franklin D. Roosevelt', 'U.S. president'),
      f('f-1941-hull', 'Cordell Hull', 'Secretary of state'),
      f('f-1941-nomura', 'Kichisaburō Nomura', 'Japanese ambassador'),
    ],
  },
  {
    scenarioId: 'hist-1945-trinity',
    year: 1945,
    title: 'Trinity Choice',
    era: '1939–1945',
    figures: [
      f('f-1945-truman', 'Harry S. Truman', 'U.S. president'),
      f('f-1945-stimson', 'Henry Stimson', 'Secretary of war'),
      f('f-1945-byrnes', 'James Byrnes', 'Secretary of state'),
    ],
  },
  {
    scenarioId: 'hist-1947-radcliffe',
    year: 1947,
    title: 'India Partition',
    era: '1945–1962',
    figures: [
      f('f-1947-mountbatten', 'Lord Mountbatten', 'Viceroy of India'),
      f('f-1947-nehru', 'Jawaharlal Nehru', 'Congress leader'),
      f('f-1947-jinnah', 'Muhammad Ali Jinnah', 'Muslim League leader'),
    ],
  },
  {
    scenarioId: 'hist-1917-balfour',
    year: 1917,
    title: 'Balfour Declaration',
    era: '1914–1918',
    figures: [
      f('f-1917-balfour', 'Arthur Balfour', 'British foreign secretary'),
      f('f-1917-weizmann', 'Chaim Weizmann', 'Zionist Organization'),
      f('f-1917-faisal', 'Emir Faisal', 'Arab Revolt leadership'),
    ],
  },
  {
    scenarioId: 'hist-1948-two-koreas',
    year: 1948,
    title: 'Two Koreas',
    era: '1945–1962',
    figures: [
      f('f-1948-rhee', 'Syngman Rhee', 'Southern republic leadership'),
      f('f-1948-kim', 'Kim Il-sung', 'Northern provisional leadership'),
      f('f-1948-hodge', 'John R. Hodge', 'US occupation commander'),
    ],
  },
  {
    scenarioId: 'hist-1948-marshall',
    year: 1948,
    title: 'ERP Bargain',
    era: '1945–1962',
    figures: [
      f('f-1948-marshall', 'George C. Marshall', 'Secretary of state'),
      f('f-1948-bevin', 'Ernest Bevin', 'British foreign secretary'),
      f('f-1948-schuman', 'Robert Schuman', 'French foreign minister'),
    ],
  },
  {
    scenarioId: 'hist-1949-october',
    year: 1949,
    title: 'October Mandate',
    era: '1945–1962',
    figures: [
      f('f-1949-acheson', 'Dean Acheson', 'Secretary of state'),
      f('f-1949-mao', 'Mao Zedong', 'PRC leadership'),
      f('f-1949-chiang', 'Chiang Kai-shek', 'ROC leadership'),
    ],
  },
  {
    scenarioId: 'hist-1950-korea',
    year: 1950,
    title: 'Parallel War',
    era: '1945–1962',
    figures: [
      f('f-1950-truman', 'Harry S. Truman', 'U.S. president'),
      f('f-1950-acheson', 'Dean Acheson', 'Secretary of state'),
      f('f-1950-macarthur', 'Douglas MacArthur', 'UNC commander'),
    ],
  },
  {
    scenarioId: 'hist-1956-suez',
    year: 1956,
    title: 'Canal Crisis',
    era: '1945–1962',
    figures: [
      f('f-1956-eden', 'Anthony Eden', 'British prime minister'),
      f('f-1956-nasser', 'Gamal Abdel Nasser', 'Egyptian president'),
      f('f-1956-dulles', 'John Foster Dulles', 'U.S. secretary of state'),
    ],
  },
  {
    scenarioId: 'hist-1962-cuba',
    year: 1962,
    title: 'Thirteen Days',
    era: '1962–1979',
    figures: [
      f('f-1962-jfk', 'John F. Kennedy', 'U.S. president'),
      f('f-1962-rfk', 'Robert F. Kennedy', 'Attorney general'),
      f('f-1962-gromyko', 'Andrei Gromyko', 'Soviet foreign minister'),
    ],
  },
  {
    scenarioId: 'hist-1968-prague',
    year: 1968,
    title: 'Prague Spring Desk',
    era: '1962–1979',
    figures: [
      f('f-1968-dubcek', 'Alexander Dubček', 'Czechoslovak party leader'),
      f('f-1968-brezhnev', 'Leonid Brezhnev', 'Soviet general secretary'),
      f('f-1968-brandt', 'Willy Brandt', 'West German foreign minister'),
    ],
  },
  {
    scenarioId: 'hist-1973-oil',
    year: 1973,
    title: 'Embargo Shock',
    era: '1962–1979',
    figures: [
      f('f-1973-kissinger', 'Henry Kissinger', 'U.S. national security advisor'),
      f('f-1973-yamani', 'Ahmed Zaki Yamani', 'Saudi oil minister'),
      f('f-1973-schultz', 'George Shultz', 'Treasury secretary'),
    ],
  },
  {
    scenarioId: 'hist-1979-persian-pivot',
    year: 1979,
    title: 'Persian Pivot',
    era: '1979–1991',
    figures: [
      f('f-1979-carter', 'Jimmy Carter', 'U.S. president'),
      f('f-1979-brzezinski', 'Zbigniew Brzezinski', 'National security advisor'),
      f('f-1979-bazargan', 'Mehdi Bazargan', 'Iranian interim premier'),
    ],
  },
  {
    scenarioId: 'hist-1989-wall',
    year: 1989,
    title: 'Wall Night',
    era: '1979–1991',
    figures: [
      f('f-1989-kohl', 'Helmut Kohl', 'West German chancellor'),
      f('f-1989-gorbachev', 'Mikhail Gorbachev', 'Soviet general secretary'),
      f('f-1989-baker', 'James Baker', 'U.S. secretary of state'),
    ],
  },
  {
    scenarioId: 'hist-1991-union-end',
    year: 1991,
    title: 'Union Dissolution',
    era: '1991–2008',
    figures: [
      f('f-1991-yeltsin', 'Boris Yeltsin', 'Russian president'),
      f('f-1991-gorbachev', 'Mikhail Gorbachev', 'Soviet president'),
      f('f-1991-kravchuk', 'Leonid Kravchuk', 'Ukrainian president'),
    ],
  },
  {
    scenarioId: 'hist-1997-contagion',
    year: 1997,
    title: 'Contagion Desk',
    era: '1991–2008',
    figures: [
      f('f-1997-rubin', 'Robert Rubin', 'U.S. treasury secretary'),
      f('f-1997-camdessus', 'Michel Camdessus', 'IMF managing director'),
      f('f-1997-summers', 'Larry Summers', 'Treasury deputy'),
    ],
  },
  {
    scenarioId: 'hist-2001-enduring',
    year: 2001,
    title: 'Enduring Decision',
    era: '1991–2008',
    figures: [
      f('f-2001-bush', 'George W. Bush', 'U.S. president'),
      f('f-2001-powell', 'Colin Powell', 'Secretary of state'),
      f('f-2001-rice', 'Condoleezza Rice', 'National security advisor'),
    ],
  },
  {
    scenarioId: 'hist-2008-lehman',
    year: 2008,
    title: 'Lehman Weekend',
    era: '2008–2026',
    figures: [
      f('f-2008-paulson', 'Henry Paulson', 'Treasury secretary'),
      f('f-2008-bernanke', 'Ben Bernanke', 'Federal Reserve chair'),
      f('f-2008-geithner', 'Timothy Geithner', 'NY Fed president'),
    ],
  },
  {
    scenarioId: 'hist-2011-squares',
    year: 2011,
    title: 'Square and Square',
    era: '2008–2026',
    figures: [
      f('f-2011-clinton', 'Hillary Clinton', 'U.S. secretary of state'),
      f('f-2011-ashton', 'Catherine Ashton', 'EU high representative'),
      f('f-2011-amr', 'Amr Moussa', 'Arab League secretary-general'),
    ],
  },
  {
    scenarioId: 'hist-2014-crimea',
    year: 2014,
    title: 'Peninsula Shock',
    era: '2008–2026',
    figures: [
      f('f-2014-obama', 'Barack Obama', 'U.S. president'),
      f('f-2014-merkel', 'Angela Merkel', 'German chancellor'),
      f('f-2014-poroshenko', 'Petro Poroshenko', 'Ukrainian president'),
    ],
  },
  {
    scenarioId: 'hist-2020-lockdown',
    year: 2020,
    title: 'Lockdown Mandate',
    era: '2008–2026',
    figures: [
      f('f-2020-fauci', 'Anthony Fauci', 'NIAID director'),
      f('f-2020-tedros', 'Tedros Adhanom', 'WHO director-general'),
      f('f-2020-birx', 'Deborah Birx', 'White House response coordinator'),
    ],
  },
  {
    scenarioId: 'hist-2024-hormuz-relapse',
    year: 2024,
    title: 'Hormuz Relapse',
    era: '2008–2026',
    figures: [
      f('f-2024-sullivan', 'Jake Sullivan', 'National security advisor'),
      f('f-2024-blinken', 'Antony Blinken', 'Secretary of state'),
      f('f-2024-austin', 'Lloyd Austin', 'Secretary of defense'),
    ],
  },
  {
    scenarioId: 'hist-2025-coalition-aftershock',
    year: 2025,
    title: 'Coalition Aftershock',
    era: '2008–2026',
    figures: [
      f('f-2025-pm', 'Incoming PM-designate', 'Centrist coalition lead'),
      f('f-2025-whip', 'Party whip', 'Parliamentary arithmetic'),
      f('f-2025-eu', 'EU envoy', 'External pressure desk'),
    ],
  },
];

export function figuresForScenario(scenarioId: string): TheaterFigure[] {
  return theaterFiguresCatalog.find((t) => t.scenarioId === scenarioId)?.figures ?? [];
}
