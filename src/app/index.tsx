import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TheaterMap } from '@/components/TheaterMap';
import { useAccount } from '@/account/AccountProvider';
import { useBilling } from '@/billing/BillingProvider';
import { PaywallModal } from '@/components/PaywallModal';
import { EraAtmosphere } from '@/components/EraAtmosphere';
import { GlassPanel } from '@/components/GlassPanel';
import {
  HISTORICAL_ERAS,
  listHistoricalScenarios,
  type HistoricalEra,
  type HistoricalScenario,
} from '@/data/historical';
import { resolveTheater } from '@/lib/scenarioRegistry';
import { useGame } from '@/context/GameContext';
import { useSound } from '@/audio/SoundProvider';
import { RetentionHomeRails } from '@/components/RetentionHomeRails';
import { useRetention } from '@/retention/RetentionProvider';
import { colors, fonts, radii, space } from '@/theme/colors';

function useRetentionSoftWall(soft: boolean) {
  const ret = useRetention();
  useEffect(() => {
    ret.setSoftWalled(soft);
    return () => ret.setSoftWalled(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soft]);
}

function yearForEraFilter(era: HistoricalEra | 'ALL'): number {
  if (era === 'ALL') return 1938;
  if (era.startsWith('1900')) return 1905;
  if (era.startsWith('1914')) return 1917;
  if (era.startsWith('1919')) return 1931;
  if (era.startsWith('1939')) return 1941;
  if (era.startsWith('1945')) return 1956;
  if (era.startsWith('1962')) return 1968;
  if (era.startsWith('1979')) return 1989;
  if (era.startsWith('1991')) return 2001;
  return 2014;
}

function TheaterTile({
  scenario,
  wide,
  locked,
  freeUsed,
  featured,
  onPress,
}: {
  scenario: HistoricalScenario;
  wide: boolean;
  locked: boolean;
  freeUsed: boolean;
  featured?: boolean;
  onPress: () => void;
}) {
  const theater = resolveTheater(scenario.id);
  if (!theater) return null;
  const mapH = featured ? (wide ? 240 : 200) : wide ? 150 : 132;

  return (
    <Pressable
      style={({ pressed }) => [
        styles.tile,
        featured && styles.tileFeatured,
        pressed && styles.tilePressed,
        locked && styles.tileLocked,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${locked ? 'Locked ' : ''}${scenario.title}, ${scenario.year}`}
      onPress={onPress}
    >
      <TheaterMap
        theater={theater}
        height={mapH}
        activeMarkerIds={theater.markers.filter((m) => m.kind === 'flashpoint').map((m) => m.id)}
        pulse={false}
      />
      <LinearGradient
        colors={['transparent', 'rgba(5,7,12,0.55)', 'rgba(5,7,12,0.96)']}
        locations={[0.15, 0.55, 1]}
        style={styles.tileGrad}
        pointerEvents="none"
      />
      {locked ? (
        <View style={styles.lockBadgeWrap} pointerEvents="none">
          <Text style={styles.lockBadge}>LOCKED</Text>
        </View>
      ) : null}
      <View style={styles.tileMeta}>
        <View style={styles.metaTop}>
          <Text style={styles.year}>{scenario.year}</Text>
          {freeUsed ? <Text style={styles.freeTag}>FREE</Text> : null}
        </View>
        <Text style={[styles.tileTitle, featured && styles.tileTitleFeatured]} numberOfLines={2}>
          {scenario.title.toUpperCase()}
        </Text>
        <Text style={styles.tileSub} numberOfLines={1}>
          {scenario.region}
        </Text>
        <Text style={[styles.deploy, locked && styles.deployLocked]}>
          {locked ? 'UNLOCK' : 'DEPLOY'}
        </Text>
      </View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const { setScenario } = useGame();
  const sound = useSound();
  const account = useAccount();
  const billing = useBilling();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const fade = useRef(new Animated.Value(0)).current;
  const brandPulse = useRef(new Animated.Value(0.85)).current;
  const all = useMemo(() => listHistoricalScenarios(), []);
  const [era, setEra] = useState<HistoricalEra | 'ALL'>('ALL');
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [paywallTitle, setPaywallTitle] = useState<string | undefined>();

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 700, useNativeDriver: false }).start();
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(brandPulse, { toValue: 1, duration: 1600, useNativeDriver: false }),
        Animated.timing(brandPulse, { toValue: 0.85, duration: 1600, useNativeDriver: false }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [fade, brandPulse]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await sound.unlock();
      if (!cancelled) await sound.playMenuMusic();
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visible = era === 'ALL' ? all : all.filter((s) => s.era === era);
  const featured = visible.slice(0, 2);
  const rest = visible.slice(2);
  const used = account.entitlement.freeTheaterIds.length;
  const unlocked = account.entitlement.unlockAll;
  const atmosphereYear = yearForEraFilter(era);
  useRetentionSoftWall(account.isAuthenticated && !unlocked);

  const openScenario = async (scenario: HistoricalScenario) => {
    await sound.unlock();
    sound.play('tick', { volume: 0.3 });
    if (!account.isAuthenticated) {
      router.push('/auth?mode=signup');
      return;
    }
    if (account.isLocked(scenario.id)) {
      setPaywallTitle(scenario.title);
      setPaywallOpen(true);
      return;
    }
    await account.markTheaterPlayed(scenario.id);
    setScenario(scenario.id);
    router.push(`/scenario/${scenario.id}`);
  };

  const openById = async (scenarioId: string) => {
    const sc = all.find((s) => s.id === scenarioId);
    if (sc) await openScenario(sc);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <EraAtmosphere
        year={atmosphereYear}
        motif={era === 'ALL' || atmosphereYear < 1945 ? 'street' : 'era'}
        intensity={1}
      />
      <LinearGradient
        colors={['rgba(46,230,200,0.08)', 'transparent', 'rgba(255,107,74,0.05)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <ScrollView contentContainerStyle={[styles.scroll, wide && styles.scrollWide]}>
        <Animated.View style={[styles.hero, wide && styles.heroWide, { opacity: fade }]}>
          <View style={styles.heroTop}>
            <Animated.Text style={[styles.brand, { opacity: brandPulse }]}>GENESIS</Animated.Text>
            <Pressable
              style={styles.accountChip}
              onPress={() => {
                if (account.isAuthenticated) account.logout();
                else router.push('/auth?mode=login');
              }}
              accessibilityRole="button"
            >
              <Text style={styles.accountChipText}>
                {account.isAuthenticated
                  ? account.user?.email?.split('@')[0] ?? 'ACCOUNT'
                  : 'SIGN IN'}
              </Text>
            </Pressable>
          </View>
          <Text style={styles.tag}>SELECT THEATER</Text>
          <Text style={styles.tagline}>
            Thirty-two turning points. Ten orders that rewrite the course.
          </Text>
          <GlassPanel cyan padded style={styles.statusGlass}>
            <Text style={styles.count}>
              {all.length} THEATERS · 10 MOVES ·{' '}
              {unlocked
                ? 'FULL ACCESS'
                : account.isAuthenticated
                  ? `FREE ${used}/${account.freeLimit}`
                  : 'SIGN IN TO DEPLOY'}
            </Text>
          </GlassPanel>
          {account.isAuthenticated ? (
            <RetentionHomeRails onPlayTheater={openById} />
          ) : null}
          {account.isAuthenticated && !unlocked ? (
            <Pressable
              style={styles.paywallCta}
              onPress={() => {
                setPaywallTitle(undefined);
                setPaywallOpen(true);
              }}
              nativeID="home-genesis-pro-cta"
            >
              <LinearGradient
                colors={[colors.amberHot, colors.amber, colors.amberDeep]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <Text style={styles.paywallCtaText}>
                {billing.id === 'play'
                  ? 'GENESIS PRO · SUBSCRIBE OR UNLOCK'
                  : 'GENESIS PRO · SANDBOX'}
              </Text>
            </Pressable>
          ) : null}
          {account.isAuthenticated && unlocked ? (
            <Pressable
              style={styles.manageCta}
              onPress={async () => {
                if (billing.supportsCustomerCenter) {
                  const res = await billing.presentCustomerCenter({
                    email: account.user?.email,
                    userId: account.user?.id,
                    grantUnlockAll: account.grantUnlockAll,
                    syncProEntitlement: account.syncProEntitlement,
                    hasUnlockAll: () => account.entitlement.unlockAll,
                  });
                  if (!res.presented) {
                    setPaywallTitle(undefined);
                    setPaywallOpen(true);
                  }
                  return;
                }
                setPaywallTitle(undefined);
                setPaywallOpen(true);
              }}
              nativeID="home-customer-center"
            >
              <Text style={styles.manageCtaText}>
                {billing.supportsCustomerCenter ? 'MANAGE SUBSCRIPTION' : 'PRO ACTIVE · RESTORE'}
              </Text>
            </Pressable>
          ) : null}
        </Animated.View>

        <View style={[styles.board, wide && styles.boardWide]}>
          <Text style={styles.section}>ERA</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.eraRow}>
            <Pressable
              onPress={() => setEra('ALL')}
              style={[styles.eraChip, era === 'ALL' && styles.eraChipOn]}
            >
              <Text style={[styles.eraChipText, era === 'ALL' && styles.eraChipTextOn]}>ALL</Text>
            </Pressable>
            {HISTORICAL_ERAS.map((e) => (
              <Pressable
                key={e}
                onPress={() => setEra(e)}
                style={[styles.eraChip, era === e && styles.eraChipOn]}
              >
                <Text style={[styles.eraChipText, era === e && styles.eraChipTextOn]}>{e}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <Text style={styles.section}>FEATURED</Text>
          <View style={[styles.featuredRow, wide && styles.featuredRowWide]}>
            {featured.map((scenario) => {
              const showLock = account.isAuthenticated && account.isLocked(scenario.id);
              return (
                <View key={scenario.id} style={wide ? styles.featuredCol : undefined}>
                  <TheaterTile
                    scenario={scenario}
                    wide={wide}
                    locked={!!showLock}
                    freeUsed={account.entitlement.freeTheaterIds.includes(scenario.id)}
                    featured
                    onPress={() => openScenario(scenario)}
                  />
                </View>
              );
            })}
          </View>

          <Text style={styles.section}>
            {era === 'ALL' ? 'ALL THEATERS' : era} · {rest.length + featured.length}
          </Text>
          <View style={[styles.grid, wide && styles.gridWide]}>
            {rest.map((scenario) => {
              const showLock = account.isAuthenticated && account.isLocked(scenario.id);
              return (
                <View key={scenario.id} style={wide ? styles.gridItem : undefined}>
                  <TheaterTile
                    scenario={scenario}
                    wide={wide}
                    locked={!!showLock}
                    freeUsed={account.entitlement.freeTheaterIds.includes(scenario.id)}
                    onPress={() => openScenario(scenario)}
                  />
                </View>
              );
            })}
          </View>
        </View>

        <Pressable
          style={styles.privacyLink}
          onPress={() => router.push('/privacy')}
          accessibilityRole="link"
          accessibilityLabel="Privacy Policy"
        >
          <Text style={styles.privacyLinkText}>Privacy Policy</Text>
        </Pressable>
      </ScrollView>

      <PaywallModal
        visible={paywallOpen}
        theaterTitle={paywallTitle}
        onClose={() => setPaywallOpen(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.void },
  scroll: { paddingBottom: 64 },
  scrollWide: { alignItems: 'center' },
  hero: {
    paddingHorizontal: space.lg,
    paddingTop: 32,
    paddingBottom: space.md,
    gap: 8,
  },
  heroWide: { width: '100%', maxWidth: 1040, paddingTop: 48 },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  brand: {
    fontFamily: fonts.display,
    fontSize: 64,
    lineHeight: 68,
    color: colors.chalk,
    letterSpacing: 6,
    flexShrink: 1,
    textShadowColor: 'rgba(46,230,200,0.45)',
    textShadowRadius: 24,
    textShadowOffset: { width: 0, height: 0 },
  },
  accountChip: {
    borderWidth: 1,
    borderColor: colors.lineCyan,
    backgroundColor: 'rgba(14,20,34,0.75)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 10,
    borderRadius: radii.sm,
    maxWidth: 150,
  },
  accountChipText: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1.4,
    color: colors.cyanHot,
    textTransform: 'uppercase',
  },
  tag: {
    fontFamily: fonts.bodyMed,
    fontSize: 12,
    letterSpacing: 3,
    color: colors.cyan,
    marginTop: 4,
  },
  tagline: {
    fontFamily: fonts.body,
    fontSize: 18,
    lineHeight: 26,
    color: colors.chalkDim,
    maxWidth: 520,
    marginTop: 4,
  },
  statusGlass: { marginTop: 8, alignSelf: 'flex-start' },
  count: {
    fontFamily: fonts.bodyMed,
    fontSize: 11,
    letterSpacing: 1.4,
    color: colors.cyanHot,
  },
  paywallCta: {
    marginTop: 10,
    alignSelf: 'flex-start',
    borderRadius: radii.sm,
    overflow: 'hidden',
    paddingHorizontal: 18,
    paddingVertical: 14,
    minHeight: 48,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.amberHot,
  },
  paywallCtaText: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 1.4,
    color: colors.void,
    zIndex: 1,
  },
  manageCta: {
    marginTop: 10,
    alignSelf: 'flex-start',
    borderRadius: radii.sm,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.lineCyan,
    backgroundColor: 'rgba(14,20,34,0.75)',
  },
  manageCtaText: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1.4,
    color: colors.cyanHot,
  },
  board: { paddingHorizontal: space.md, gap: 14 },
  boardWide: { width: '100%', maxWidth: 1040 },
  section: {
    fontFamily: fonts.displayMed,
    fontSize: 13,
    letterSpacing: 2.4,
    color: colors.mist,
    marginTop: 8,
  },
  eraRow: { gap: 8, paddingVertical: 4 },
  eraChip: {
    borderWidth: 1,
    borderColor: colors.steelEdge,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: 'rgba(14,20,34,0.7)',
    borderRadius: radii.sm,
  },
  eraChipOn: {
    borderColor: colors.cyan,
    backgroundColor: 'rgba(46,230,200,0.12)',
  },
  eraChipText: {
    fontFamily: fonts.bodyMed,
    fontSize: 11,
    letterSpacing: 0.8,
    color: colors.mist,
  },
  eraChipTextOn: { color: colors.cyanHot },
  featuredRow: { gap: 14 },
  featuredRowWide: { flexDirection: 'row' },
  featuredCol: { flex: 1 },
  grid: { gap: 12 },
  gridWide: { flexDirection: 'row', flexWrap: 'wrap' },
  gridItem: { width: '48.5%', flexGrow: 1 },
  tile: {
    borderRadius: radii.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(160,190,220,0.18)',
    backgroundColor: colors.panelSolid,
    minHeight: 220,
  },
  tileFeatured: {
    borderColor: colors.lineCyan,
    minHeight: 280,
  },
  tileLocked: { opacity: 0.9 },
  tilePressed: {
    borderColor: colors.cyanHot,
    transform: [{ scale: 0.99 }],
  },
  tileGrad: {
    ...StyleSheet.absoluteFill,
    top: '28%',
  },
  lockBadgeWrap: {
    position: 'absolute',
    top: 14,
    right: 14,
    zIndex: 4,
  },
  lockBadge: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1.6,
    color: colors.amberHot,
    backgroundColor: 'rgba(5,7,12,0.85)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radii.xs,
    borderWidth: 1,
    borderColor: colors.lineGold,
  },
  tileMeta: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    gap: 3,
    zIndex: 3,
  },
  metaTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  year: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.cyanHot,
    letterSpacing: 1,
  },
  freeTag: {
    fontFamily: fonts.bodyBold,
    fontSize: 9,
    letterSpacing: 1.4,
    color: colors.cyanHot,
    borderWidth: 1,
    borderColor: colors.cyan,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radii.xs,
  },
  tileTitle: {
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 26,
    color: colors.chalk,
    letterSpacing: 1,
  },
  tileTitleFeatured: { fontSize: 28, lineHeight: 32 },
  tileSub: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.mist,
  },
  deploy: {
    marginTop: 8,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 2,
    color: colors.cyanHot,
  },
  deployLocked: { color: colors.alert },
  privacyLink: {
    alignSelf: 'center',
    paddingVertical: space.lg,
    paddingHorizontal: space.md,
    marginBottom: space.md,
  },
  privacyLinkText: {
    fontFamily: fonts.bodyMed,
    fontSize: 12,
    letterSpacing: 1.2,
    color: colors.fog,
    textTransform: 'uppercase',
  },
});
