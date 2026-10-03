import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AxisHud } from '@/components/AxisHud';
import { Button } from '@/components/Button';
import { ConsequenceBoard } from '@/components/ConsequenceBoard';
import { EfficiencyBoard } from '@/components/EfficiencyBoard';
import { PathMindmap } from '@/components/PathMindmap';
import { TheaterMap } from '@/components/TheaterMap';
import { EraAtmosphere } from '@/components/EraAtmosphere';
import { GlassPanel } from '@/components/GlassPanel';
import { WorldCourseVisual, branchesFromBeat } from '@/components/WorldCourseVisual';
import { RetentionAfterAction } from '@/components/RetentionAfterAction';
import { getHistoricalScenario } from '@/data/historical';
import { resolveChoiceOp, resolveScenario, resolveTheater } from '@/lib/scenarioRegistry';
import { useGame } from '@/context/GameContext';
import { useSound } from '@/audio/SoundProvider';
import { useRetention } from '@/retention/RetentionProvider';
import { computeLiveMeters } from '@/lib/liveMeters';
import { scoreEfficiency } from '@/lib/efficiency';
import { buildPathMindmap } from '@/lib/mindmap';
import { computeOverallScore } from '@/lib/overallScore';
import {
  buildStrategyDecisions,
  evaluateRunSync,
  type PathFamily,
} from '@/lib/evaluate';
import { ShareScoreCard } from '@/components/ShareScoreCard';
import { useAccount } from '@/account/AccountProvider';
import type { PersonalBest } from '@/retention/types';
import { colors, fonts, radii, space } from '@/theme/colors';

export default function EvaluationScreen() {
  const params = useLocalSearchParams<{ seed?: string; scenario?: string }>();
  const account = useAccount();
  const {
    evaluation,
    scenarioId,
    decisions,
    resetRun,
    setScenario,
    replaceDecisions,
    setEvaluation,
  } = useGame();
  const sound = useSound();
  const retention = useRetention();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const [seeded, setSeeded] = useState(false);
  const recordedRef = useRef(false);
  const [isNewBest, setIsNewBest] = useState(false);
  const [previousBest, setPreviousBest] = useState<PersonalBest | null>(null);
  const [retentionReady, setRetentionReady] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const shareY = useRef(0);

  // QA / screenshot seed: /evaluation?scenario=hist-1947-radcliffe&seed=kinetic
  useEffect(() => {
    const seed = typeof params.seed === 'string' ? params.seed : undefined;
    const sid = typeof params.scenario === 'string' ? params.scenario : undefined;
    if (!seed || !sid || seeded) return;
    const strat =
      seed === 'kinetic' || seed === 'diplomatic' || seed === 'delay' || seed === 'polar'
        ? seed
        : null;
    if (!strat) return;
    const sc = resolveScenario(sid);
    if (!sc) return;
    const next = buildStrategyDecisions(sc, strat);
    setScenario(sid);
    replaceDecisions(next);
    setEvaluation(evaluateRunSync(sc, next));
    setSeeded(true);
  }, [params.seed, params.scenario, seeded, setScenario, replaceDecisions, setEvaluation]);

  const scenario = scenarioId ? resolveScenario(scenarioId) : undefined;
  const historical = scenarioId ? getHistoricalScenario(scenarioId) : undefined;
  const year = historical?.year ?? 1962;
  const theater = scenario ? resolveTheater(scenario.id) : undefined;
  const [ready, setReady] = useState(false);
  const fade = useRef(new Animated.Value(0)).current;

  const dailyMult = scenario ? retention.dailyMultiplier(scenario.id) : 1;
  const dailyBonus = dailyMult > 1;

  const efficiency = useMemo(
    () => (scenario ? scoreEfficiency(scenario, decisions) : null),
    [scenario, decisions],
  );
  const mindmap = useMemo(
    () => (scenario ? buildPathMindmap(scenario, decisions) : null),
    [scenario, decisions],
  );
  const overall = useMemo(() => {
    if (!scenario || !evaluation || !efficiency) return null;
    return computeOverallScore({
      scenario,
      decisions,
      evaluation,
      efficiency,
      year,
      dailyMultiplier: dailyMult,
    });
  }, [scenario, decisions, evaluation, efficiency, year, dailyMult]);

  const worldBranches = useMemo(() => {
    if (!scenario || !decisions.length) return [];
    const last = decisions[decisions.length - 1];
    const beat = scenario.beats.find((b) => b.id === last.beatId);
    if (!beat) {
      return [
        {
          id: 'taken',
          label: last.choice.label,
          taken: true,
          consequence: last.choice.detail,
        },
      ];
    }
    return branchesFromBeat({
      chosenLabel: last.choice.label,
      chosenDetail: last.choice.detail,
      siblings: beat.choices.map((c) => ({ label: c.label, detail: c.detail })),
    });
  }, [scenario, decisions]);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (ready && evaluation) {
      Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: false }).start();
      sound.resolveMusic({ coda: true }).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, evaluation]);

  // Persist mastery / streak / personal best once per after-action
  useEffect(() => {
    if (!retention.ready || !scenario || !evaluation || !overall || recordedRef.current) return;
    recordedRef.current = true;
    const prev = retention.getPersonalBest(scenario.id);
    setPreviousBest(prev);
    void retention
      .recordCompletion({
        scenarioId: scenario.id,
        title: scenario.title,
        score: overall.score,
        grade: overall.grade,
        pathFamily: evaluation.pathFamily,
        dailyBonusApplied: dailyBonus,
        playerName: account.user?.email?.split('@')[0] ?? null,
      })
      .then((res) => {
        setIsNewBest(res.isNewBest);
        if (res.previousBest) setPreviousBest(res.previousBest);
        setRetentionReady(true);
      })
      .catch(() => setRetentionReady(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [retention.ready, scenario?.id, evaluation, overall?.score, dailyBonus]);

  const cliff = useMemo(() => {
    if (!scenario || !evaluation) return null;
    return retention.cliffhanger(scenario.id, evaluation.pathFamily as PathFamily | null);
  }, [retention, scenario, evaluation]);

  const nextRec = useMemo(() => {
    if (!scenario || !retentionReady) return retention.recommendAfter(scenario?.id ?? '');
    return retention.recommendAfter(scenario.id);
  }, [retention, scenario, retentionReady]);

  const personalBest = scenario ? retention.getPersonalBest(scenario.id) : null;

  if (!evaluation || !scenario || !theater || !efficiency || !mindmap || !overall) {
    return (
      <View style={styles.centered}>
        <EraAtmosphere year={year} motif="desk" intensity={0.9} />
        <Text style={styles.emptyTitle}>NO AFTER-ACTION</Text>
        <Text style={styles.emptyBody}>Complete a theater run to open the consequence board.</Text>
        <Button label="Return to map" onPress={() => router.replace('/')} />
      </View>
    );
  }

  if (!ready) {
    return (
      <View style={styles.centered}>
        <EraAtmosphere year={year} motif="ops" intensity={0.9} />
        <ActivityIndicator color={colors.cyan} />
        <Text style={styles.emptyBody}>Composing after-action…</Text>
      </View>
    );
  }

  const meters = computeLiveMeters(scenario, decisions);
  const markers = decisions
    .map((d) => resolveChoiceOp(d.choice.id)?.markerId)
    .filter(Boolean) as string[];

  const caption =
    evaluation.narrative.split(/(?<=[.!?])\s+/)[0]?.slice(0, 140) ?? evaluation.headline;

  const goTheater = (tid: string) => {
    sound.stopMusic();
    resetRun();
    router.replace(`/scenario/${tid}`);
  };

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.root}
      contentContainerStyle={[styles.scroll, wide && styles.scrollWide]}
    >
      <EraAtmosphere year={year} motif="street" intensity={1} />
      <LinearGradient
        colors={['rgba(46,230,200,0.1)', 'transparent', 'rgba(255,184,77,0.06)']}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <Animated.View
        style={[styles.panel, wide && styles.panelWide, { opacity: fade }]}
        nativeID="after-action"
      >
        <View style={styles.mapWrap}>
          <TheaterMap theater={theater} height={wide ? 240 : 180} activeMarkerIds={markers} />
          <LinearGradient
            colors={['transparent', 'rgba(5,7,12,0.85)']}
            style={styles.mapFade}
            pointerEvents="none"
          />
        </View>

        <GlassPanel cyan padded>
          <Text style={styles.kicker}>
            AFTER-ACTION · {decisions.length} ORDERS
            {evaluation.pathFamily
              ? ` · ${String(evaluation.pathFamily).replace(/_/g, ' ').toUpperCase()}`
              : ''}
            {dailyBonus ? ' · CRISIS BONUS' : ''}
          </Text>
          <Text style={styles.headline}>{evaluation.headline}</Text>
          <Text style={styles.caption}>{caption}</Text>
        </GlassPanel>

        <View
          onLayout={(e) => {
            shareY.current = e.nativeEvent.layout.y;
          }}
        >
          <ShareScoreCard
            theaterTitle={scenario.title}
            year={year}
            headline={evaluation.headline}
            overall={overall}
          />
        </View>

        <RetentionAfterAction
          score={overall.score}
          grade={overall.grade}
          personalBest={personalBest}
          previousBest={previousBest}
          isNewBest={isNewBest}
          dailyBonus={dailyBonus}
          dailyMultiplier={dailyMult}
          cliffhanger={cliff}
          next={nextRec}
          onPlayNext={goTheater}
          onRedeploy={() => goTheater(scenario.id)}
          onShareChallenge={() => {
            scrollRef.current?.scrollTo({ y: Math.max(0, shareY.current - 12), animated: true });
          }}
        />

        <ConsequenceBoard scenario={scenario} decisions={decisions} />

        {worldBranches.length ? (
          <WorldCourseVisual year={year} title="LAST FORK" branches={worldBranches} />
        ) : null}

        <EfficiencyBoard score={efficiency} />

        <AxisHud meters={meters} compact />

        <Text style={styles.section}>AXIS SNAPSHOT</Text>
        <View style={styles.axisRow}>
          {evaluation.axes.map((axis) => {
            const tone =
              axis.score >= 65 ? colors.cyanHot : axis.score <= 40 ? colors.alert : colors.amber;
            return (
              <GlassPanel key={axis.label} padded style={styles.axisChip}>
                <Text style={styles.axisLabel} numberOfLines={1}>
                  {axis.label}
                </Text>
                <Text style={[styles.axisScore, { color: tone }]}>{Math.round(axis.score)}</Text>
                <View style={styles.axisTrack}>
                  <View
                    style={[
                      styles.axisFill,
                      { width: `${Math.round(axis.score)}%`, backgroundColor: tone },
                    ]}
                  />
                </View>
              </GlassPanel>
            );
          })}
        </View>

        <Text style={styles.section}>DECISION MINDMAP</Text>
        <PathMindmap root={mindmap} />

        {evaluation.warnings.length ? (
          <>
            <Text style={styles.section}>WATCHPOINTS</Text>
            <View style={styles.warnRow}>
              {evaluation.warnings.slice(0, 4).map((w) => (
                <View key={w} style={styles.warnChip}>
                  <Text style={styles.warnText} numberOfLines={2}>
                    {w}
                  </Text>
                </View>
              ))}
            </View>
          </>
        ) : null}

        <Button
          label="New theater"
          onPress={() => {
            sound.stopMusic();
            resetRun();
            router.replace('/');
          }}
        />
        <Button
          label="Redeploy this board"
          variant="ghost"
          onPress={() => {
            sound.stopMusic();
            const id = scenario.id;
            resetRun();
            router.replace(`/scenario/${id}`);
          }}
        />
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.void,
  },
  scroll: {
    padding: space.md,
    paddingBottom: 56,
    gap: 14,
  },
  scrollWide: {
    alignItems: 'center',
  },
  panel: {
    gap: 14,
  },
  panelWide: {
    width: '100%',
    maxWidth: 860,
  },
  mapWrap: {
    borderRadius: radii.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.lineCyan,
  },
  mapFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 48,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 24,
    backgroundColor: colors.void,
  },
  emptyTitle: {
    fontFamily: fonts.display,
    fontSize: 32,
    color: colors.chalk,
    letterSpacing: 2,
  },
  emptyBody: {
    fontFamily: fonts.body,
    color: colors.mist,
    textAlign: 'center',
  },
  kicker: {
    fontFamily: fonts.bodyMed,
    fontSize: 11,
    letterSpacing: 1.8,
    color: colors.cyanHot,
    marginBottom: 6,
  },
  headline: {
    fontFamily: fonts.display,
    fontSize: 26,
    lineHeight: 32,
    color: colors.chalk,
    letterSpacing: 0.8,
  },
  caption: {
    marginTop: 8,
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.chalkDim,
  },
  section: {
    marginTop: 4,
    fontFamily: fonts.displayMed,
    fontSize: 12,
    letterSpacing: 2,
    color: colors.amber,
  },
  axisRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  axisChip: {
    width: '47%',
    flexGrow: 1,
  },
  axisLabel: {
    fontFamily: fonts.bodyMed,
    fontSize: 10,
    letterSpacing: 0.8,
    color: colors.mist,
  },
  axisScore: {
    fontFamily: fonts.display,
    fontSize: 28,
    lineHeight: 32,
  },
  axisTrack: {
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
    borderRadius: 3,
    marginTop: 4,
  },
  axisFill: {
    height: 5,
    borderRadius: 3,
  },
  warnRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  warnChip: {
    maxWidth: '48%',
    flexGrow: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,107,74,0.4)',
    backgroundColor: 'rgba(255,107,74,0.1)',
    borderRadius: radii.sm,
  },
  warnText: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 16,
    color: colors.chalk,
  },
});
