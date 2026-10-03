import { Image, StyleSheet, Text, View } from 'react-native';
import type { TheaterFigure } from '@/data/figures/catalog';
import { portraitSource } from '@/data/figures/portraits';
import { colors, fonts, elevation } from '@/theme/colors';

/** Compact chips for board edge — does not cover legal squares. */
export function FigureChips({ figures }: { figures: TheaterFigure[] }) {
  if (!figures.length) return null;
  return (
    <View style={styles.row} pointerEvents="none" nativeID="figure-chips">
      {figures.slice(0, 3).map((fig) => {
        const src = portraitSource(fig.portraitKey);
        return (
          <View key={fig.id} style={[styles.chip, elevation.piece]}>
            {src ? <Image source={src} style={styles.img} /> : <View style={styles.img} />}
            <View style={styles.cap}>
              <Text style={styles.label} numberOfLines={1}>
                {fig.name.split(' ').slice(-1)[0]}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    position: 'absolute',
    right: 8,
    top: 48,
    flexDirection: 'row',
    gap: 6,
    zIndex: 6,
  },
  chip: {
    width: 36,
    alignItems: 'center',
  },
  img: {
    width: 34,
    height: 40,
    borderWidth: 1.5,
    borderColor: 'rgba(240,192,106,0.65)',
    backgroundColor: colors.deep,
  },
  cap: {
    marginTop: -10,
    backgroundColor: 'rgba(4,10,16,0.88)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderWidth: 1,
    borderColor: 'rgba(212,160,74,0.35)',
  },
  label: {
    fontFamily: fonts.bodyMed,
    fontSize: 8,
    letterSpacing: 0.5,
    color: colors.chalk,
  },
});
