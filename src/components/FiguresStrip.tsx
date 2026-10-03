import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import type { TheaterFigure } from '@/data/figures/catalog';
import { portraitSource } from '@/data/figures/portraits';
import { GlassPanel } from '@/components/GlassPanel';
import { colors, fonts } from '@/theme/colors';

type Props = {
  figures: TheaterFigure[];
  compact?: boolean;
  title?: string;
};

export function FiguresStrip({ figures, compact, title = 'DESK FIGURES' }: Props) {
  if (!figures.length) return null;

  return (
    <GlassPanel gold style={compact ? styles.wrapCompact : undefined} padded={false}>
      <View style={[styles.inner, compact && styles.innerCompact]} nativeID="figures-strip">
        <Text style={styles.kicker}>{title}</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.row}
        >
          {figures.map((fig) => {
            const src = portraitSource(fig.portraitKey);
            return (
              <View key={fig.id} style={[styles.card, compact && styles.cardCompact]}>
                <View style={[styles.frame, compact && styles.frameCompact]}>
                  {src ? (
                    <Image source={src} style={styles.portrait} />
                  ) : (
                    <View style={[styles.portrait, styles.fallback]} />
                  )}
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.75)']}
                    style={styles.portraitShade}
                  />
                </View>
                <Text style={styles.name} numberOfLines={2}>
                  {fig.name}
                </Text>
                <Text style={styles.role} numberOfLines={2}>
                  {fig.role}
                </Text>
              </View>
            );
          })}
        </ScrollView>
        <Text style={styles.credit}>
          HISTORICAL DOSSIER · PD / STUDIO ART · NOT PRESS PHOTOGRAPHY
        </Text>
      </View>
    </GlassPanel>
  );
}

const styles = StyleSheet.create({
  wrapCompact: {},
  inner: {
    padding: 14,
    gap: 10,
  },
  innerCompact: {
    padding: 10,
    gap: 8,
  },
  kicker: {
    fontFamily: fonts.bodyMed,
    fontSize: 10,
    letterSpacing: 1.8,
    color: colors.goldInk,
  },
  row: {
    gap: 12,
    paddingRight: 8,
  },
  card: {
    width: 124,
    gap: 5,
  },
  cardCompact: {
    width: 100,
  },
  frame: {
    width: 124,
    height: 156,
    borderWidth: 1,
    borderColor: 'rgba(212,160,74,0.55)',
    overflow: 'hidden',
    backgroundColor: colors.deep,
  },
  frameCompact: {
    width: 100,
    height: 126,
  },
  portrait: {
    width: '100%',
    height: '100%',
  },
  portraitShade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '45%',
  },
  fallback: {
    backgroundColor: '#1A2428',
  },
  name: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    color: colors.chalk,
    letterSpacing: 0.3,
  },
  role: {
    fontFamily: fonts.body,
    fontSize: 10,
    lineHeight: 13,
    color: colors.mist,
  },
  credit: {
    fontFamily: fonts.bodyMed,
    fontSize: 8,
    letterSpacing: 1,
    color: colors.fog,
    marginTop: 2,
  },
});
