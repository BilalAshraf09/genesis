import { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAccount } from '@/account/AccountProvider';
import { PaywallModal } from '@/components/PaywallModal';
import { GlassPanel } from '@/components/GlassPanel';
import { listHistoricalScenarios } from '@/data/historical';
import { parseInviteParams, type InvitePayload } from '@/lib/inviteLinks';
import { useGame } from '@/context/GameContext';
import { pathLabel } from '@/retention/algo';
import { colors, fonts, radii, space } from '@/theme/colors';

/**
 * Deep-link / universal-link invite landing.
 * genesis://invite?from=&theater=&score=&path=  ·  /invite?...
 */
export default function InviteScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const account = useAccount();
  const { setScenario } = useGame();
  const [paywallOpen, setPaywallOpen] = useState(false);
  const theaters = useMemo(() => listHistoricalScenarios(), []);

  const invite: InvitePayload | null = useMemo(() => {
    const flat: Record<string, string> = {};
    for (const [k, v] of Object.entries(params)) {
      flat[k] = Array.isArray(v) ? (v[0] ?? '') : String(v ?? '');
    }
    return parseInviteParams(flat);
  }, [params]);

  const scenario = useMemo(() => {
    if (!invite) return null;
    return theaters.find((t) => t.id === invite.theater) ?? null;
  }, [invite, theaters]);

  useEffect(() => {
    // Soft-wall preview: locked theaters still show challenge CTA → paywall
  }, []);

  const accept = async () => {
    if (!invite || !scenario) {
      router.replace('/');
      return;
    }
    if (!account.isAuthenticated) {
      router.push(
        `/auth?mode=signup&next=${encodeURIComponent(`/invite?theater=${invite.theater}&score=${invite.score}&path=${invite.path}&from=${invite.from}`)}`,
      );
      return;
    }
    if (account.isLocked(scenario.id)) {
      setPaywallOpen(true);
      return;
    }
    await account.markTheaterPlayed(scenario.id);
    setScenario(scenario.id);
    router.replace(`/scenario/${scenario.id}`);
  };

  if (!invite) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.card}>
          <Text style={styles.kicker}>INVITE</Text>
          <Text style={styles.title}>LINK EXPIRED OR INVALID</Text>
          <Text style={styles.body}>This challenge invite is missing theater or score params.</Text>
          <Pressable onPress={() => router.replace('/')} style={styles.cta}>
            <Text style={styles.ctaText}>RETURN TO DESK</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const title = invite.title || scenario?.title || invite.theater;
  const year = invite.year || scenario?.year;

  return (
    <SafeAreaView style={styles.safe} nativeID="invite-screen">
      <LinearGradient
        colors={['rgba(255,107,74,0.12)', 'transparent', 'rgba(46,230,200,0.08)']}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <View style={styles.wrap}>
        <Text style={styles.brand}>GENESIS</Text>
        <Text style={styles.kicker}>CHALLENGE BRIEFING</Text>
        <GlassPanel cyan padded style={styles.panel}>
          <Text style={styles.from}>FROM · {invite.from.toUpperCase()}</Text>
          <Text style={styles.title}>{String(title).toUpperCase()}</Text>
          {year ? <Text style={styles.year}>{year}</Text> : null}
          <View style={styles.scoreRow}>
            <Text style={styles.score}>{invite.score}</Text>
            <View>
              <Text style={styles.scoreLabel}>CABINET SCORE TO BEAT</Text>
              <Text style={styles.path}>{pathLabel(invite.path)}</Text>
            </View>
          </View>
          <Text style={styles.body}>
            Accept this challenge to open the theater briefing. Soft-walled desks hit the unlock
            paywall before DEPLOY.
          </Text>
        </GlassPanel>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Accept challenge"
          onPress={accept}
          style={({ pressed }) => [styles.primary, pressed && { opacity: 0.9 }]}
          nativeID="invite-accept"
        >
          <LinearGradient
            colors={[colors.cyanHot, colors.cyan, colors.cyanDeep]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Text style={styles.primaryText}>
            {account.isAuthenticated && scenario && account.isLocked(scenario.id)
              ? 'UNLOCK TO ACCEPT'
              : 'ACCEPT CHALLENGE · DEPLOY'}
          </Text>
        </Pressable>

        <Pressable onPress={() => router.replace('/')} style={styles.ghost}>
          <Text style={styles.ghostText}>DECLINE · RETURN HOME</Text>
        </Pressable>
      </View>

      <PaywallModal
        visible={paywallOpen}
        theaterTitle={scenario?.title}
        onClose={() => setPaywallOpen(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.void },
  wrap: { flex: 1, padding: space.lg, justifyContent: 'center', gap: 16 },
  card: { padding: space.lg, gap: 12 },
  brand: {
    fontFamily: fonts.display,
    fontSize: 28,
    letterSpacing: 4,
    color: colors.cyanHot,
  },
  kicker: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 2,
    color: colors.amberHot,
  },
  panel: { gap: 8 },
  from: {
    fontFamily: fonts.bodyMed,
    fontSize: 11,
    letterSpacing: 1.4,
    color: colors.mist,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: 1,
    color: colors.chalk,
  },
  year: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    color: colors.amber,
  },
  scoreRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 16, marginTop: 8 },
  score: {
    fontFamily: fonts.display,
    fontSize: 64,
    lineHeight: 68,
    color: colors.cyanHot,
  },
  scoreLabel: {
    fontFamily: fonts.bodyMed,
    fontSize: 10,
    letterSpacing: 1.4,
    color: colors.mist,
  },
  path: {
    marginTop: 4,
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    letterSpacing: 1.2,
    color: colors.amberHot,
  },
  body: {
    marginTop: 8,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.chalkDim,
  },
  primary: {
    borderRadius: radii.sm,
    overflow: 'hidden',
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.cyanHot,
  },
  primaryText: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    letterSpacing: 1.6,
    color: colors.void,
    zIndex: 1,
  },
  cta: {
    marginTop: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.lineCyan,
    borderRadius: radii.sm,
    alignItems: 'center',
  },
  ctaText: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 1.4,
    color: colors.cyanHot,
  },
  ghost: { alignItems: 'center', paddingVertical: 10 },
  ghostText: {
    fontFamily: fonts.bodyMed,
    fontSize: 11,
    letterSpacing: 1.4,
    color: colors.mist,
  },
});
