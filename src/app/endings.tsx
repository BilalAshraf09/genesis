import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassPanel } from '@/components/GlassPanel';
import { listHistoricalScenarios } from '@/data/historical';
import { pathLabel } from '@/retention/algo';
import { useRetention } from '@/retention/RetentionProvider';
import { COLLECTIBLE_ENDINGS } from '@/retention/types';
import type { PathFamily } from '@/lib/evaluate';
import { colors, fonts, radii, space } from '@/theme/colors';

const ENDING_BLURB: Record<string, string> = {
  kinetic: 'Force committed. The board still smells of cordite and cable traffic.',
  diplomatic: 'Words held the line — for now. Rival desks recalibrate overnight.',
  delay: 'Time bought. The crisis did not leave; it waited.',
  economic: 'Ledgers as weapons. Supply chains became the front.',
  mixed: 'No clean doctrine — a hybrid path that confuses after-action panels.',
  force_order: 'Orders locked kinetic. Civilian corridors went dark on the map.',
  political_hardline: 'Hardline posture. Domestic base cheered; allies flinched.',
  political_norms: 'Norms held under pressure. Precedent outlived the news cycle.',
  political_stalemate: 'Neither side blinked. The theater froze in place.',
};

/**
 * Endings gallery — theaters × path families, unlocked vs locked silhouettes.
 */
export default function EndingsGalleryScreen() {
  const ret = useRetention();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const cols = width >= 900 ? 4 : width >= 600 ? 3 : 2;
  const theaters = useMemo(() => listHistoricalScenarios(), []);
  const [selected, setSelected] = useState<{
    theaterId: string;
    title: string;
    family: PathFamily;
    unlocked: boolean;
  } | null>(null);

  const cells = useMemo(() => {
    const out: {
      key: string;
      theaterId: string;
      title: string;
      year: number;
      family: PathFamily;
      unlocked: boolean;
    }[] = [];
    for (const t of theaters) {
      const unlockedSet = new Set(ret.state.theaterEndings[t.id] ?? []);
      for (const family of COLLECTIBLE_ENDINGS) {
        out.push({
          key: `${t.id}:${family}`,
          theaterId: t.id,
          title: t.title,
          year: t.year,
          family,
          unlocked: unlockedSet.has(family),
        });
      }
    }
    return out;
  }, [theaters, ret.state.theaterEndings]);

  const unlockedCount = cells.filter((c) => c.unlocked).length;

  const cellW = Math.max(140, Math.floor((width - 48) / cols) - 8);

  return (
    <SafeAreaView style={styles.safe} nativeID="endings-gallery">
      <LinearGradient
        colors={['rgba(46,230,200,0.08)', 'transparent']}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} accessibilityRole="button">
          <Text style={styles.back}>← DESK</Text>
        </Pressable>
        <Text style={styles.brand}>ENDINGS GALLERY</Text>
        <Text style={styles.meta}>
          {unlockedCount}/{cells.length} path silhouettes · mastery {ret.progress.collectionPct}%
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.grid}>
          {cells.map((c) => (
            <Pressable
              key={c.key}
              onPress={() =>
                setSelected({
                  theaterId: c.theaterId,
                  title: c.title,
                  family: c.family,
                  unlocked: c.unlocked,
                })
              }
              style={({ pressed }) => [
                styles.cell,
                { width: cellW },
                c.unlocked ? styles.cellOn : styles.cellOff,
                pressed && { opacity: 0.9 },
              ]}
              accessibilityRole="button"
              accessibilityLabel={`${c.title} ${pathLabel(c.family)} ${c.unlocked ? 'unlocked' : 'locked'}`}
            >
              <Text style={[styles.cellPath, !c.unlocked && styles.sil]}>
                {c.unlocked ? pathLabel(c.family) : '████'}
              </Text>
              <Text style={[styles.cellTitle, !c.unlocked && styles.sil]} numberOfLines={2}>
                {c.unlocked ? c.title : 'CLASSIFIED'}
              </Text>
              <Text style={styles.cellYear}>{c.unlocked ? c.year : '····'}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {selected ? (
        <View style={styles.sheet} nativeID="endings-detail">
          <GlassPanel cyan padded>
            <Text style={styles.sheetKicker}>
              {selected.unlocked ? 'UNLOCKED PATH' : 'LOCKED · CLIFFHANGER'}
            </Text>
            <Text style={styles.sheetTitle}>
              {selected.title.toUpperCase()} · {pathLabel(selected.family)}
            </Text>
            <Text style={styles.sheetBody}>
              {selected.unlocked
                ? ENDING_BLURB[selected.family] || 'Path logged in your after-action archive.'
                : `This ${pathLabel(selected.family)} fork is still dark. Redeploy the theater and force a different doctrine.`}
            </Text>
            <View style={styles.sheetRow}>
              <Pressable
                onPress={() => setSelected(null)}
                style={styles.sheetGhost}
              >
                <Text style={styles.sheetGhostText}>CLOSE</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  const id = selected.theaterId;
                  setSelected(null);
                  router.push(`/scenario/${id}`);
                }}
                style={styles.sheetCta}
                nativeID="endings-redeploy"
              >
                <Text style={styles.sheetCtaText}>
                  {selected.unlocked ? 'REDEPLOY' : 'REDEPLOY TO UNLOCK'}
                </Text>
              </Pressable>
            </View>
          </GlassPanel>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.void },
  header: { paddingHorizontal: space.lg, paddingTop: 12, paddingBottom: 8, gap: 4 },
  back: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1.4,
    color: colors.cyan,
  },
  brand: {
    fontFamily: fonts.display,
    fontSize: 24,
    letterSpacing: 2,
    color: colors.chalk,
  },
  meta: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.mist,
  },
  scroll: { paddingHorizontal: space.md, paddingBottom: 120 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'flex-start',
  },
  cell: {
    borderRadius: radii.md,
    borderWidth: 1,
    padding: 12,
    minHeight: 96,
    backgroundColor: 'rgba(14,20,34,0.85)',
  },
  cellOn: { borderColor: colors.lineCyan },
  cellOff: { borderColor: 'rgba(80,90,110,0.45)', opacity: 0.75 },
  cellPath: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1.4,
    color: colors.cyanHot,
  },
  cellTitle: {
    marginTop: 6,
    fontFamily: fonts.displayMed,
    fontSize: 13,
    color: colors.chalk,
  },
  cellYear: {
    marginTop: 4,
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.fog,
  },
  sil: { color: colors.fog, letterSpacing: 2 },
  sheet: {
    position: 'absolute',
    left: space.md,
    right: space.md,
    bottom: space.lg,
  },
  sheetKicker: {
    fontFamily: fonts.bodyMed,
    fontSize: 10,
    letterSpacing: 1.6,
    color: colors.amberHot,
  },
  sheetTitle: {
    marginTop: 6,
    fontFamily: fonts.displayMed,
    fontSize: 16,
    color: colors.chalk,
  },
  sheetBody: {
    marginTop: 8,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
    color: colors.chalkDim,
  },
  sheetRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  sheetGhost: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.steelEdge,
    borderRadius: radii.sm,
  },
  sheetGhostText: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1.2,
    color: colors.mist,
  },
  sheetCta: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: radii.sm,
    backgroundColor: colors.cyanHot,
    alignItems: 'center',
  },
  sheetCtaText: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1.2,
    color: colors.void,
  },
});
