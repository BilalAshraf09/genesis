import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { Button } from '@/components/Button';
import { UnityTheaterBoard, type MapOp } from '@/components/UnityTheaterBoard';
import { MissionConfirm } from '@/components/MissionConfirm';
import { ThrillerHud } from '@/components/ThrillerHud';
import { ResolveBeat } from '@/components/ResolveBeat';
import { TheaterMap } from '@/components/TheaterMap';
import { TensionShake } from '@/components/immersion/TensionShake';
import { FiguresStrip } from '@/components/FiguresStrip';
import { EraAtmosphere } from '@/components/EraAtmosphere';
import { branchesFromBeat } from '@/components/WorldCourseVisual';
import { figuresForScenario } from '@/data/figures/catalog';
import { type Choice } from '@/data/scenarios';
import { getHistoricalScenario } from '@/data/historical';
import { eraFromYear, useSound } from '@/audio/SoundProvider';
import { useAccount } from '@/account/AccountProvider';
import { useRetention } from '@/retention/RetentionProvider';
import { resolveChoiceOp, resolveScenario, resolveTheater } from '@/lib/scenarioRegistry';
import { useGame } from '@/context/GameContext';
import { evaluateRun } from '@/lib/evaluate';
import { computeLiveMeters } from '@/lib/liveMeters';
import { colors, fonts, radii, space } from '@/theme/colors';

/** Ops window per objective — thriller pressure, not a quiz clock */
const PHASE_WINDOW = 28;

export default function ScenarioScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const scenario = useMemo(() => (id ? resolveScenario(id) : undefined), [id]);
  const historical = useMemo(() => (id ? getHistoricalScenario(id) : undefined), [id]);
  const theater = scenario ? resolveTheater(scenario.id) : undefined;
  const router = useRouter();
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  const {
    setScenario,
    resumeScenario,
    recordDecision,
    replaceDecisions,
    decisions,
    setEvaluation,
  } = useGame();
  const sound = useSound();
  const account = useAccount();
  const retention = useRetention();
  const [beatIndex, setBeatIndex] = useState(0);
  const [selected, setSelected] = useState<Choice | null>(null);
  const [started, setStarted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [commitFlash, setCommitFlash] = useState(false);
  const [windowSeconds, setWindowSeconds] = useState(PHASE_WINDOW);
  const [streak, setStreak] = useState(0);
  const [forcedHint, setForcedHint] = useState<string | null>(null);
  const [canResume, setCanResume] = useState(false);
  const resumeHydrated = useRef(false);
  const [resolving, setResolving] = useState<{
    title: string;
    detail: string;
    markerLabel?: string;
    branches?: ReturnType<typeof branchesFromBeat>;
    choice: Choice;
  } | null>(null);
  const riserPlayed = useRef(false);
  const committing = useRef(false);
  const selectedRef = useRef<Choice | null>(null);
  const opsRef = useRef<MapOp[]>([]);
  const forcedFired = useRef(false);
  const windowSecondsRef = useRef(PHASE_WINDOW);
  const resolvingRef = useRef(resolving);
  const submittingRef = useRef(submitting);
  const beatIndexRef = useRef(beatIndex);

  selectedRef.current = selected;
  windowSecondsRef.current = windowSeconds;
  resolvingRef.current = resolving;
  submittingRef.current = submitting;
  beatIndexRef.current = beatIndex;

  const year = historical?.year ?? 1900;
  const figures = useMemo(() => (id ? figuresForScenario(id) : []), [id]);

  const beat = scenario?.beats[beatIndex];
  const availableOps: MapOp[] = useMemo(() => {
    if (!beat || !theater) return [];
    return beat.choices.map((choice) => {
      const op = resolveChoiceOp(choice.id);
      return {
        choice,
        markerId: op?.markerId ?? theater.markers[0]?.id ?? 'capital_a',
        short: op?.short ?? 'OP',
        kind: op?.kind ?? 'political',
      };
    });
  }, [beat, theater]);
  opsRef.current = availableOps;

  useEffect(() => {
    if (!account.ready || !id) return;
    if (!account.isAuthenticated) {
      router.replace('/auth?mode=signup');
      return;
    }
    if (account.isLocked(id)) {
      router.replace('/');
    }
  }, [account.ready, account.isAuthenticated, account.entitlement, id, router]);

  // Hydrate unfinished run for this theater
  useEffect(() => {
    if (!retention.ready || !id || !scenario || resumeHydrated.current) return;
    resumeHydrated.current = true;
    const snap = retention.state.incompleteRun;
    if (snap && snap.scenarioId === id && snap.decisions.length > 0) {
      resumeScenario(id, snap.decisions);
      setBeatIndex(Math.min(snap.beatIndex, scenario.beats.length - 1));
      setCanResume(true);
    } else {
      setCanResume(false);
    }
  }, [retention.ready, retention.state.incompleteRun, id, scenario, resumeScenario]);

  // Persist mid-run progress (habit / comeback loop)
  useEffect(() => {
    if (!started || !scenario || !historical || !retention.ready) return;
    if (decisions.length === 0 && beatIndex === 0) return;
    void retention.saveIncomplete({
      scenarioId: scenario.id,
      title: scenario.title,
      year: historical.year,
      beatIndex,
      totalBeats: scenario.beats.length,
      decisions,
      updatedAt: new Date().toISOString(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only on move progress
  }, [started, scenario?.id, historical?.year, beatIndex, decisions]);

  useEffect(() => {
    if (!started) return;
    setWindowSeconds(PHASE_WINDOW);
    riserPlayed.current = false;
    forcedFired.current = false;
    setForcedHint(null);
  }, [beatIndex, started]);

  useEffect(() => {
    if (!started || resolving || submitting) return;
    const timer = setInterval(() => {
      setWindowSeconds((s) => {
        const next = Math.max(0, s - 1);
        if (next === 10 && !riserPlayed.current) {
          riserPlayed.current = true;
          sound.play('riser', { volume: 0.5 });
        }
        if (next > 0 && next <= 8 && next % 2 === 0) {
          sound.play('tick', { volume: 0.32 });
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [started, resolving, submitting, beatIndex, sound]);

  const finishRun = useCallback(
    async (choice: Choice, beatId: string, beatTitle: string) => {
      if (!scenario) return;
      setSubmitting(true);
      try {
        const nextDecisions = [
          ...decisions.filter((d) => d.beatId !== beatId),
          { beatId, beatTitle, choice },
        ];
        replaceDecisions(nextDecisions);
        const result = await evaluateRun(scenario, nextDecisions);
        setEvaluation(result);
        await sound.resolveMusic({ coda: true });
        await sound.setAmbient(null);
        router.replace('/evaluation');
      } catch {
        setError('Evaluation uplink failed. Retry with local mock.');
      } finally {
        setSubmitting(false);
      }
    },
    [scenario, decisions, replaceDecisions, setEvaluation, sound, router],
  );

  const executeChoice = useCallback(
    async (choice: Choice, opts?: { forced?: boolean }) => {
      if (!scenario || !beat || resolvingRef.current || submittingRef.current || committing.current) {
        return;
      }
      committing.current = true;
      setError(null);
      if (opts?.forced) {
        setForcedHint(
          selectedRef.current
            ? 'WINDOW CLOSED — LOCKING CURRENT TARGET'
            : 'WINDOW CLOSED — ESCALATION PROTOCOL',
        );
      }

      const op = resolveChoiceOp(choice.id);
      const marker = theater?.markers.find((m) => m.id === op?.markerId);
      const siblings = beat.choices.map((c) => ({ label: c.label, detail: c.detail }));
      const branches = branchesFromBeat({
        chosenLabel: choice.label,
        chosenDetail: choice.detail,
        siblings,
      });

      const secs = windowSecondsRef.current;
      const quick = !opts?.forced && secs > PHASE_WINDOW * 0.35;
      setStreak((s) => (quick ? s + 1 : opts?.forced ? 0 : 1));

      await sound.peakMusic();
      sound.play('commit', { volume: 0.65 });
      sound.play('sting', { volume: 0.42 });
      setCommitFlash(true);
      setSelected(choice);
      setResolving({
        title: choice.label,
        detail: choice.detail,
        markerLabel: marker?.label ?? op?.short,
        branches,
        choice,
      });
    },
    [scenario, beat, theater, sound],
  );

  // Force commit when ops window hits zero
  useEffect(() => {
    if (!started || resolving || submitting) return;
    if (windowSeconds > 0 || forcedFired.current) return;
    forcedFired.current = true;
    const choice = selectedRef.current ?? opsRef.current[0]?.choice;
    if (!choice) return;
    sound.play('riser', { volume: 0.55 });
    void executeChoice(choice, { forced: true });
  }, [windowSeconds, started, resolving, submitting, executeChoice, sound]);

  const onResolveContinue = useCallback(async () => {
    if (!resolving || !scenario || !beat) return;
    const choice = resolving.choice;
    const last = beatIndex >= scenario.beats.length - 1;
    const beatId = beat.id;
    const beatTitle = beat.title;
    setCommitFlash(false);
    setResolving(null);
    setSelected(null);
    setForcedHint(null);
    committing.current = false;
    await sound.resolveMusic({ coda: false });

    if (last) {
      await finishRun(choice, beatId, beatTitle);
      return;
    }

    recordDecision(beatId, beatTitle, choice);
    sound.play('tick', { volume: 0.28 });
    setBeatIndex((i) => i + 1);
  }, [resolving, scenario, beat, beatIndex, sound, finishRun, recordDecision]);

  if (!scenario || !theater) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorTitle}>Theater offline</Text>
        <Text style={styles.errorBody}>That command board is not in this build.</Text>
        <Button label="Return to map" onPress={() => router.replace('/')} />
      </View>
    );
  }

  const isLast = beatIndex >= scenario.beats.length - 1;
  const meters = computeLiveMeters(scenario, decisions, selected);
  const pressureMeter =
    meters.find((m) => m.id === 'escalation') ??
    meters.find((m) => m.id === 'polarization') ??
    meters.find((m) => m.id === 'markets') ??
    meters[0];
  const pressure = pressureMeter?.value ?? 40;
  const shakeIntensity = Math.max(0, (pressure - 55) / 45);
  const urgency = Math.max(
    (PHASE_WINDOW - windowSeconds) / PHASE_WINDOW,
    (pressure - 40) / 60,
  );

  const onSelectOp = (op: MapOp) => {
    if (resolving || submitting || committing.current) return;
    setForcedHint(null);
    setSelected(op.choice);
    sound.play('deploy', { volume: 0.5 });
  };

  const commitOp = () => {
    if (!selected) return;
    void executeChoice(selected);
  };

  async function enterTheater(opts?: { resume?: boolean }) {
    if (!scenario) return;
    await sound.unlock();
    if (opts?.resume && canResume) {
      // decisions already restored via resumeScenario
    } else {
      setScenario(scenario.id);
      setBeatIndex(0);
      await retention.clearIncomplete();
      setCanResume(false);
    }
    await sound.beginMusicSequence(eraFromYear(year));
    setStarted(true);
    setStreak(0);
    sound.play('deploy', { volume: 0.45 });
  }

  if (!started) {
    return (
      <>
        <Stack.Screen options={{ title: scenario.title }} />
        <ScrollView
          style={styles.root}
          contentContainerStyle={[styles.scroll, wide && styles.scrollWide]}
        >
          <EraAtmosphere year={year} motif="desk" intensity={1} />
          <View style={[styles.column, wide && styles.columnWide]}>
            <TheaterMap
              theater={theater}
              height={wide ? 280 : 220}
              activeMarkerIds={theater.markers
                .filter((m) => m.kind !== 'capital')
                .map((m) => m.id)
                .slice(0, 3)}
            />
            <View style={styles.briefPanel}>
              <Text style={styles.kicker}>
                {year} · {scenario.region}
              </Text>
              <Text style={styles.h1}>{scenario.title.toUpperCase()}</Text>
              <Text style={styles.body} numberOfLines={3}>
                {scenario.premise}
              </Text>
              <FiguresStrip figures={figures} compact />
              <Text style={styles.phases}>
                {scenario.beats.length} OBJECTIVES · HOTSPOT SELECT · OPS TIMER
              </Text>
              {canResume ? (
                <>
                  <Text style={styles.resumeHint}>
                    Unfinished run · move {Math.min(beatIndex + 1, scenario.beats.length)}/
                    {scenario.beats.length}
                  </Text>
                  <Button label="Resume run" onPress={() => enterTheater({ resume: true })} />
                  <Button
                    label="Restart from order 1"
                    variant="ghost"
                    onPress={() => enterTheater({ resume: false })}
                  />
                </>
              ) : (
                <Button label="Deploy" onPress={() => enterTheater()} />
              )}
              <Button label="Abort" variant="ghost" onPress={() => router.back()} />
            </View>
          </View>
        </ScrollView>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: scenario.title }} />
      <View style={styles.root}>
        <EraAtmosphere year={year} motif="ops" intensity={1} />
        <ScrollView
          style={styles.playScroll}
          contentContainerStyle={[styles.playRoot, wide && styles.playRootWide]}
          keyboardShouldPersistTaps="handled"
        >
          <ThrillerHud
            moveIndex={beatIndex + 1}
            moveTotal={scenario.beats.length}
            missionTitle={beat?.title ?? scenario.title}
            theaterLabel={theater.title}
            seconds={windowSeconds}
            secondsTotal={PHASE_WINDOW}
            pressure={pressure}
            streak={streak}
            muted={sound.muted}
            onToggleMute={sound.toggleMute}
            locked={!!resolving || submitting}
          />

          {/* Objective lives on the board ribbon — no quiz prompt stack above the map */}

          <TensionShake intensity={Math.max(shakeIntensity, urgency > 0.7 ? 0.35 : 0)}>
            <View style={styles.mapStage}>
              <UnityTheaterBoard
                theater={theater}
                height={wide ? 680 : 620}
                availableOps={availableOps}
                selectedChoiceId={selected?.id}
                onSelectOp={onSelectOp}
                locked={!!resolving || submitting}
                phaseKey={beatIndex}
                urgency={urgency}
                pressure={pressure}
                commitFlash={commitFlash}
                timerSeconds={windowSeconds}
                objectiveLine={
                  beat?.stakes?.trim()
                    ? `${beat.title} — ${beat.stakes.trim()}`
                    : (beat?.briefing ?? beat?.title ?? scenario.title)
                }
              />
              {commitFlash ? (
                <View style={styles.courseFlash} pointerEvents="none">
                  <Text style={styles.courseFlashText}>WORLD COURSE SHIFTED</Text>
                </View>
              ) : null}
              <ResolveBeat
                visible={!!resolving}
                title={resolving?.title ?? ''}
                detail={resolving?.detail ?? ''}
                markerLabel={resolving?.markerLabel}
                year={year}
                branches={resolving?.branches}
                theaterId={scenario.id}
                theaterTitle={scenario.title}
                moveIndex={beatIndex + 1}
                moveTotal={scenario.beats.length}
                onContinue={onResolveContinue}
              />
            </View>
          </TensionShake>

          {!resolving ? (
            <MissionConfirm
              selected={selected}
              onCommit={commitOp}
              onClear={() => {
                if (committing.current) return;
                setSelected(null);
                setForcedHint(null);
                sound.play('tick', { volume: 0.2 });
              }}
              commitLabel={isLast ? 'EXECUTE · END RUN' : 'EXECUTE ORDER'}
              busy={submitting}
              forcedHint={forcedHint}
            />
          ) : null}

          {error ? <Text style={styles.errorInline}>{error}</Text> : null}
          {submitting ? (
            <View style={styles.loading}>
              <ActivityIndicator color={colors.amber} />
              <Text style={styles.loadingText}>Scoring run…</Text>
            </View>
          ) : null}
        </ScrollView>
        {!sound.unlocked ? (
          <Pressable style={styles.unlockBanner} onPress={() => sound.unlock()}>
            <Text style={styles.unlockBannerText}>TAP TO UNLOCK AUDIO</Text>
          </Pressable>
        ) : null}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.void,
  },
  playScroll: {
    flex: 1,
  },
  playRoot: {
    padding: space.sm,
    gap: 8,
    maxWidth: 1100,
    width: '100%',
    alignSelf: 'center',
    paddingBottom: 40,
  },
  playRootWide: {
    paddingHorizontal: space.md,
  },
  scroll: {
    padding: space.md,
    paddingBottom: 48,
  },
  scrollWide: {
    alignItems: 'center',
  },
  column: {
    gap: 14,
  },
  columnWide: {
    width: '100%',
    maxWidth: 900,
  },
  mapStage: {
    position: 'relative',
    borderRadius: radii.lg,
    overflow: 'hidden',
  },
  courseFlash: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 72,
    backgroundColor: 'rgba(255, 107, 74, 0.2)',
    zIndex: 4,
  },
  courseFlashText: {
    fontFamily: fonts.displayMed,
    fontSize: 13,
    letterSpacing: 2.4,
    color: colors.amberHot,
    backgroundColor: 'rgba(5,7,12,0.88)',
    borderWidth: 1,
    borderColor: colors.alert,
    borderRadius: radii.sm,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  briefPanel: {
    gap: 12,
    backgroundColor: colors.panelSolid,
    borderWidth: 1,
    borderColor: colors.lineCyan,
    borderRadius: radii.lg,
    padding: space.lg,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
    backgroundColor: colors.void,
  },
  errorTitle: {
    fontFamily: fonts.display,
    fontSize: 32,
    color: colors.chalk,
  },
  errorBody: {
    fontFamily: fonts.body,
    color: colors.mist,
    textAlign: 'center',
  },
  kicker: {
    fontFamily: fonts.bodyMed,
    color: colors.tealBright,
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  h1: {
    fontFamily: fonts.display,
    fontSize: 36,
    color: colors.chalk,
    letterSpacing: 1,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.chalkDim,
  },
  phases: {
    fontFamily: fonts.bodyMed,
    fontSize: 11,
    letterSpacing: 1.2,
    color: colors.fog,
  },
  resumeHint: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.amberHot,
    marginBottom: 4,
  },
  errorInline: {
    fontFamily: fonts.body,
    color: colors.alert,
    fontSize: 12,
  },
  loading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 8,
  },
  loadingText: {
    fontFamily: fonts.body,
    color: colors.mist,
    fontSize: 12,
  },
  unlockBanner: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(4,10,16,0.9)',
    borderWidth: 1,
    borderColor: colors.lineGold,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  unlockBannerText: {
    fontFamily: fonts.bodyBold,
    letterSpacing: 1.4,
    color: colors.amberHot,
    fontSize: 11,
  },
});
