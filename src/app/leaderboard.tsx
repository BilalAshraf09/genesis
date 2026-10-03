import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAccount } from '@/account/AccountProvider';
import { GlassPanel } from '@/components/GlassPanel';
import { pathLabel } from '@/retention/algo';
import {
  buildWeeklyLeaderboard,
  LEADERBOARD_API_URL,
  type LeaderboardRow,
} from '@/retention/leaderboard';
import { useRetention } from '@/retention/RetentionProvider';
import { colors, fonts, radii, space } from '@/theme/colors';

/**
 * Global weekly leaderboard — mock roster + local player PB overwrite.
 * LEADERBOARD_API_URL stub for a real backend later.
 */
export default function LeaderboardScreen() {
  const router = useRouter();
  const account = useAccount();
  const ret = useRetention();
  const [loading, setLoading] = useState(true);
  const [top, setTop] = useState<LeaderboardRow[]>([]);
  const [yourRank, setYourRank] = useState<number | null>(null);
  const [yourRow, setYourRow] = useState<LeaderboardRow | null>(null);
  const [source, setSource] = useState<'api' | 'mock'>('mock');
  const [error, setError] = useState<string | null>(null);

  const bestScore = useMemoBest(ret);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const name =
        account.user?.email?.split('@')[0]?.slice(0, 20) ||
        ret.state.deskTitle.replace(/\s+/g, '') ||
        'You';
      const board = await buildWeeklyLeaderboard({
        playerName: account.isAuthenticated ? name : null,
        playerScore: bestScore?.score ?? null,
        theater: bestScore?.theater ?? null,
        path: bestScore?.path ?? null,
      });
      setTop(board.top);
      setYourRank(board.yourRank);
      setYourRow(board.yourRow);
      setSource(board.source);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Leaderboard failed');
    } finally {
      setLoading(false);
    }
  }, [account.isAuthenticated, account.user?.email, bestScore, ret.state.deskTitle]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <SafeAreaView style={styles.safe} nativeID="leaderboard-screen">
      <LinearGradient
        colors={['rgba(255,184,77,0.1)', 'transparent', 'rgba(46,230,200,0.06)']}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>← DESK</Text>
        </Pressable>
        <Text style={styles.brand}>GLOBAL DESK · WEEKLY</Text>
        <Text style={styles.meta}>
          Top 20 · {source === 'api' ? 'LIVE API' : 'MOCK GLOBAL + LOCAL PB'}
          {LEADERBOARD_API_URL ? '' : ' · set LEADERBOARD_API_URL later'}
        </Text>
      </View>

      <View style={styles.youBand} nativeID="leaderboard-your-rank">
        <GlassPanel gold padded>
          <Text style={styles.youKicker}>YOUR RANK</Text>
          <Text style={styles.youRank}>
            {yourRank != null ? `#${yourRank}` : account.isAuthenticated ? '—' : 'SIGN IN'}
          </Text>
          {yourRow ? (
            <Text style={styles.youMeta}>
              {yourRow.score} · {yourRow.theater} · {pathLabel(yourRow.path)}
            </Text>
          ) : (
            <Text style={styles.youMeta}>Clear a theater to plant your score on the board.</Text>
          )}
        </GlassPanel>
      </View>

      <View style={styles.toolbar}>
        <Pressable
          onPress={() => void refresh()}
          style={({ pressed }) => [styles.refresh, pressed && { opacity: 0.85 }]}
          nativeID="leaderboard-refresh"
        >
          <Text style={styles.refreshText}>REFRESH</Text>
        </Pressable>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.cyan} style={{ marginTop: 40 }} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {top.map((row) => (
            <View
              key={`${row.rank}-${row.name}`}
              style={[styles.row, row.isYou && styles.rowYou]}
              nativeID={row.isYou ? 'leaderboard-you-row' : undefined}
            >
              <Text style={styles.rank}>#{row.rank}</Text>
              <View style={styles.rowMid}>
                <Text style={styles.name} numberOfLines={1}>
                  {row.name}
                  {row.isYou ? ' · YOU' : ''}
                </Text>
                <Text style={styles.sub} numberOfLines={1}>
                  {row.theater} · {pathLabel(row.path)}
                </Text>
              </View>
              <Text style={styles.score}>{row.score}</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function useMemoBest(ret: ReturnType<typeof useRetention>) {
  const pbs = ret.state.personalBests;
  let best: { score: number; theater: string; path: string } | null = null;
  for (const [id, pb] of Object.entries(pbs)) {
    if (!best || pb.score > best.score) {
      const title =
        ret.theaters.find((t) => t.id === id)?.title || id;
      best = {
        score: pb.score,
        theater: title,
        path: pb.pathFamily || 'mixed',
      };
    }
  }
  return best;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.void },
  header: { paddingHorizontal: space.lg, paddingTop: 12, gap: 4 },
  back: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1.4,
    color: colors.cyan,
  },
  brand: {
    fontFamily: fonts.display,
    fontSize: 22,
    letterSpacing: 1.5,
    color: colors.chalk,
  },
  meta: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.mist,
  },
  youBand: { paddingHorizontal: space.md, marginTop: 14 },
  youKicker: {
    fontFamily: fonts.bodyMed,
    fontSize: 10,
    letterSpacing: 1.6,
    color: colors.amberHot,
  },
  youRank: {
    fontFamily: fonts.display,
    fontSize: 36,
    color: colors.chalk,
  },
  youMeta: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.mist,
    marginTop: 4,
  },
  toolbar: {
    paddingHorizontal: space.md,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  refresh: {
    borderWidth: 1,
    borderColor: colors.lineCyan,
    borderRadius: radii.sm,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  refreshText: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1.4,
    color: colors.cyanHot,
  },
  list: { padding: space.md, paddingBottom: 48, gap: 6 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.steelEdge,
    backgroundColor: 'rgba(14,20,34,0.8)',
  },
  rowYou: {
    borderColor: colors.amberHot,
    backgroundColor: 'rgba(255,184,77,0.08)',
  },
  rank: {
    fontFamily: fonts.displayMed,
    fontSize: 14,
    color: colors.mist,
    minWidth: 36,
  },
  rowMid: { flex: 1, gap: 2 },
  name: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    color: colors.chalk,
  },
  sub: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.mist,
  },
  score: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.cyanHot,
  },
  error: {
    margin: space.lg,
    fontFamily: fonts.body,
    color: colors.alert,
  },
});
