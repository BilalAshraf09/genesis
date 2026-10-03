import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { GlassPanel } from '@/components/GlassPanel';
import { useAccount } from '@/account/AccountProvider';
import { useBilling } from '@/billing/BillingProvider';
import { PaywallModal } from '@/components/PaywallModal';
import { useRetention } from '@/retention/RetentionProvider';
import { pathLabel } from '@/retention/algo';
import { colors, fonts, radii } from '@/theme/colors';

type Props = {
  onPlayTheater: (scenarioId: string) => void;
};

/** Habit rails on home — daily / streak / FOMO / freeze / gallery / LB / D1 / reminder. */
export function RetentionHomeRails({ onPlayTheater }: Props) {
  const ret = useRetention();
  const router = useRouter();
  const account = useAccount();
  const billing = useBilling();
  const [reminderMsg, setReminderMsg] = useState<string | null>(null);
  const [freezeMsg, setFreezeMsg] = useState<string | null>(null);
  const [paywallOpen, setPaywallOpen] = useState(false);
  if (!ret.ready) return null;

  const {
    crisis,
    progress,
    streakCopy,
    state,
    nextPlay,
    returnBriefing,
    weeklyDesk,
    fomo,
    streakBreak,
    setReminderOptIn,
    spendStreakFreeze,
    grantStreakFreezeCharge,
  } = ret;

  const incomplete = state.incompleteRun;

  const onToggleReminder = async () => {
    const want = state.reminderStatus !== 'on';
    const res = await setReminderOptIn(want);
    setReminderMsg(res.detail ?? null);
    setTimeout(() => setReminderMsg(null), 3200);
  };

  const onSpendFreeze = async () => {
    const res = await spendStreakFreeze();
    setFreezeMsg(res.detail);
    setTimeout(() => setFreezeMsg(null), 3600);
  };

  const onBuyFreeze = async () => {
    if (!account.isAuthenticated) {
      router.push('/auth?mode=signup');
      return;
    }
    const res = await billing.purchaseStreakFreeze({
      email: account.user?.email,
      userId: account.user?.id,
      grantUnlockAll: account.grantUnlockAll,
      syncProEntitlement: account.syncProEntitlement,
      hasUnlockAll: () => account.entitlement.unlockAll,
      grantStreakFreezeCharge: async () => {
        await grantStreakFreezeCharge();
      },
    });
    setFreezeMsg(res.ok ? 'Streak freeze charge added (sandbox).' : res.error);
    setTimeout(() => setFreezeMsg(null), 3600);
  };

  const reminderLabel =
    state.reminderStatus === 'on'
      ? 'CRISIS ALERT ON · TAP TO CLEAR'
      : state.reminderStatus === 'denied'
        ? 'ALERTS DENIED · TAP TO RETRY'
        : state.reminderStatus === 'unsupported'
          ? 'ALERTS NEED MOBILE BUILD'
          : 'OPT IN · DAILY CRISIS ALERT';

  return (
    <View style={styles.wrap} nativeID="retention-home">
      {/* Streak + mastery */}
      <View style={styles.row}>
        <GlassPanel cyan padded style={styles.half}>
          <Text style={styles.kicker}>STREAK</Text>
          <Text style={styles.big}>
            {state.currentStreak > 0 ? `${state.currentStreak}d` : '—'}
          </Text>
          <Text style={styles.meta} numberOfLines={1}>
            {streakCopy.badge}
            {state.bestStreak > state.currentStreak ? ` · best ${state.bestStreak}d` : ''}
          </Text>
          <Text style={styles.tip} numberOfLines={2}>
            {fomo.streakColdCopy || streakCopy.tip}
          </Text>
          <Text style={styles.freezeCharges}>
            FREEZE ×{state.streakFreezeCharges}
          </Text>
        </GlassPanel>
        <View style={styles.half} nativeID="retention-progress">
          <GlassPanel padded>
            <Text style={styles.kicker}>MASTERY</Text>
            <Text style={styles.big}>{progress.collectionPct}%</Text>
            <Text style={styles.meta} numberOfLines={2}>
              {progress.label}
            </Text>
            <View style={styles.track}>
              <View style={[styles.fill, { width: `${progress.collectionPct}%` }]} />
            </View>
            <Pressable onPress={() => router.push('/endings')} nativeID="home-endings-link">
              <Text style={styles.linkCta}>ENDINGS GALLERY →</Text>
            </Pressable>
          </GlassPanel>
        </View>
      </View>

      {/* Streak cold / freeze offer */}
      {(fomo.streakColdTonight || streakBreak.pending) && (
        <View
          style={[styles.freezeOffer, fomo.streakColdTonight && styles.freezeUrgent]}
          nativeID="streak-freeze-offer"
        >
          <Text style={styles.freezeKicker}>
            {streakBreak.pending ? 'STREAK BROKEN · FREEZE AVAILABLE' : 'STREAK AT RISK'}
          </Text>
          <Text style={styles.freezeDetail}>
            {streakBreak.pending
              ? `Missed ${streakBreak.gap - 1} day(s). Spend a freeze to keep ${streakBreak.streakAtRisk}-day desk — or buy one.`
              : fomo.streakColdCopy}
          </Text>
          <View style={styles.freezeRow}>
            {streakBreak.pending && state.streakFreezeCharges > 0 ? (
              <Pressable
                onPress={onSpendFreeze}
                style={styles.freezeBtn}
                nativeID="spend-streak-freeze"
              >
                <Text style={styles.freezeBtnText}>SPEND FREEZE</Text>
              </Pressable>
            ) : null}
            <Pressable
              onPress={onBuyFreeze}
              style={[styles.freezeBtn, styles.freezeBtnBuy]}
              nativeID="buy-streak-freeze"
            >
              <Text style={[styles.freezeBtnText, styles.freezeBtnTextDark]}>
                BUY STREAK FREEZE
              </Text>
            </Pressable>
          </View>
          {freezeMsg ? <Text style={styles.freezeMsg}>{freezeMsg}</Text> : null}
        </View>
      )}

      {/* Growth nav */}
      <View style={styles.navRow} nativeID="growth-nav">
        <Pressable
          onPress={() => router.push('/leaderboard')}
          style={({ pressed }) => [styles.navChip, pressed && styles.pressed]}
          nativeID="home-leaderboard-link"
        >
          <Text style={styles.navChipText}>GLOBAL LB</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push('/endings')}
          style={({ pressed }) => [styles.navChip, pressed && styles.pressed]}
        >
          <Text style={styles.navChipText}>ENDINGS</Text>
        </Pressable>
        <Pressable
          onPress={() => setPaywallOpen(true)}
          style={({ pressed }) => [styles.navChip, pressed && styles.pressed]}
          nativeID="home-pro-paywall"
        >
          <Text style={styles.navChipText}>
            {account.entitlement.unlockAll ? 'MANAGE PRO' : 'GENESIS PRO'}
          </Text>
        </Pressable>
      </View>

      {/* D0→D1 return briefing */}
      {returnBriefing ? (
        <View style={styles.returnCard} nativeID="retention-d1-hook">
          <LinearGradient
            colors={['rgba(255,184,77,0.16)', 'rgba(14,20,34,0.92)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <Text style={styles.returnKicker}>{returnBriefing.headline}</Text>
          <Text style={styles.returnDetail}>{returnBriefing.detail}</Text>
          <Text style={styles.returnTomorrow}>
            TOMORROW · {returnBriefing.tomorrowTitle.toUpperCase()} ·{' '}
            {returnBriefing.tomorrowYear}
          </Text>
          <Text style={styles.returnCta}>{returnBriefing.cta}</Text>
        </View>
      ) : null}

      {/* Crisis of the Day + FOMO */}
      {crisis ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Crisis of the Day ${crisis.scenario.title}`}
          onPress={() => onPlayTheater(crisis.scenario.id)}
          style={({ pressed }) => [pressed && styles.pressed]}
          nativeID="retention-daily"
        >
          <GlassPanel gold padded>
            <View style={styles.dailyTop}>
              <Text style={styles.dailyKicker}>CRISIS OF THE DAY</Text>
              <Text style={[styles.bonus, fomo.crisisUrgent && styles.bonusHot]}>
                ×{crisis.multiplier.toFixed(2)}
              </Text>
            </View>
            <Text
              style={[styles.countdown, fomo.crisisUrgent && styles.countdownHot]}
              nativeID="crisis-countdown"
            >
              {fomo.crisisCountdown}
            </Text>
            <Text style={styles.seats} nativeID="crisis-seats">
              {fomo.seatsCopy}
            </Text>
            <Text style={styles.dailyTitle} numberOfLines={1}>
              {crisis.scenario.title.toUpperCase()}
            </Text>
            <Text style={styles.dailyYear}>
              {crisis.scenario.year} · {crisis.scenario.region}
            </Text>
            <Text style={styles.teaser} numberOfLines={2}>
              {crisis.teaser}
            </Text>
            <Text style={styles.cta}>{streakCopy.cta}</Text>
          </GlassPanel>
        </Pressable>
      ) : null}

      {/* Soft reminder opt-in */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Toggle Crisis of the Day reminder"
        onPress={onToggleReminder}
        style={({ pressed }) => [styles.reminder, pressed && styles.pressed]}
        nativeID="retention-reminder"
      >
        <Text style={styles.reminderKicker}>DESK ALERT</Text>
        <Text style={styles.reminderLabel}>{reminderLabel}</Text>
        <Text style={styles.reminderTip}>
          One local ping when Crisis of the Day opens — never paywall spam.
        </Text>
        {reminderMsg ? <Text style={styles.reminderMsg}>{reminderMsg}</Text> : null}
      </Pressable>

      {/* Personal weekly desk (local only) */}
      {weeklyDesk.length > 0 ? (
        <View style={styles.weekly} nativeID="retention-weekly">
          <Text style={styles.kicker}>WEEKLY DESK · PERSONAL</Text>
          {weeklyDesk.slice(0, 5).map((r) => (
            <Pressable
              key={`${r.at}-${r.scenarioId}`}
              onPress={() => onPlayTheater(r.scenarioId)}
              accessibilityRole="button"
              style={({ pressed }) => [styles.weeklyRow, pressed && styles.pressed]}
            >
              <Text style={styles.weeklyScore}>{r.score}</Text>
              <View style={styles.weeklyMeta}>
                <Text style={styles.weeklyTitle} numberOfLines={1}>
                  {r.title}
                </Text>
                <Text style={styles.weeklySub}>
                  {r.grade} · {r.day}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      ) : null}

      {/* Resume incomplete */}
      {incomplete ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Resume ${incomplete.title}`}
          onPress={() => onPlayTheater(incomplete.scenarioId)}
          style={({ pressed }) => [pressed && styles.pressed]}
          nativeID="retention-resume"
        >
          <View style={styles.resume}>
            <LinearGradient
              colors={['rgba(255,107,74,0.18)', 'rgba(14,20,34,0.9)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <Text style={styles.resumeKicker}>UNFINISHED RUN</Text>
            <Text style={styles.resumeTitle} numberOfLines={1}>
              Finish your {incomplete.title} run
            </Text>
            <Text style={styles.resumeMeta}>
              Move {Math.min(incomplete.beatIndex + 1, incomplete.totalBeats)}/
              {incomplete.totalBeats} · {incomplete.year}
            </Text>
            <Text style={styles.resumeCta}>RESUME →</Text>
          </View>
        </Pressable>
      ) : null}

      {/* Smart next */}
      {nextPlay && nextPlay.scenario.id !== crisis?.scenario.id ? (
        <Pressable
          accessibilityRole="button"
          onPress={() => onPlayTheater(nextPlay.scenario.id)}
          style={({ pressed }) => [pressed && styles.pressed]}
          nativeID="retention-next"
        >
          <GlassPanel cyan padded>
            <Text style={styles.kicker}>RECOMMENDED</Text>
            <Text style={styles.nextHeadline}>{nextPlay.headline}</Text>
            <Text style={styles.teaser} numberOfLines={2}>
              {nextPlay.detail}
              {nextPlay.suggestedPath
                ? ` · ${pathLabel(nextPlay.suggestedPath)}`
                : ''}
            </Text>
            <Text style={styles.cta}>DEPLOY →</Text>
          </GlassPanel>
        </Pressable>
      ) : null}

      <PaywallModal visible={paywallOpen} onClose={() => setPaywallOpen(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12, marginTop: 4 },
  row: { flexDirection: 'row', gap: 10 },
  half: { flex: 1 },
  pressed: { opacity: 0.92, transform: [{ scale: 0.99 }] },
  kicker: {
    fontFamily: fonts.bodyMed,
    fontSize: 10,
    letterSpacing: 1.6,
    color: colors.cyan,
    marginBottom: 4,
  },
  big: {
    fontFamily: fonts.display,
    fontSize: 28,
    lineHeight: 32,
    color: colors.chalk,
    letterSpacing: 1,
  },
  meta: {
    fontFamily: fonts.bodyMed,
    fontSize: 11,
    color: colors.cyanHot,
    marginTop: 2,
  },
  tip: {
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 15,
    color: colors.mist,
    marginTop: 6,
  },
  freezeCharges: {
    marginTop: 8,
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1.2,
    color: colors.amber,
  },
  linkCta: {
    marginTop: 10,
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1.2,
    color: colors.cyanHot,
  },
  track: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 2,
    marginTop: 10,
    overflow: 'hidden',
  },
  fill: {
    height: 4,
    backgroundColor: colors.cyan,
    borderRadius: 2,
  },
  freezeOffer: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: 'rgba(255,184,77,0.5)',
    backgroundColor: 'rgba(255,184,77,0.08)',
    padding: 14,
    gap: 8,
  },
  freezeUrgent: {
    borderColor: 'rgba(255,107,74,0.65)',
    backgroundColor: 'rgba(255,107,74,0.12)',
  },
  freezeKicker: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1.6,
    color: colors.alert,
  },
  freezeDetail: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: colors.chalk,
  },
  freezeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  freezeBtn: {
    borderWidth: 1,
    borderColor: colors.steelEdge,
    borderRadius: radii.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.panelSolid,
  },
  freezeBtnBuy: {
    borderColor: colors.cyanHot,
    backgroundColor: colors.cyanHot,
  },
  freezeBtnText: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1.2,
    color: colors.chalk,
  },
  freezeBtnTextDark: { color: colors.void },
  freezeMsg: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.cyanHot,
  },
  navRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  navChip: {
    borderWidth: 1,
    borderColor: colors.lineCyan,
    borderRadius: radii.sm,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'rgba(14,20,34,0.8)',
  },
  navChipText: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1.4,
    color: colors.cyanHot,
  },
  returnCard: {
    borderRadius: radii.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,184,77,0.45)',
    padding: 14,
    minHeight: 96,
  },
  returnKicker: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1.6,
    color: colors.amberHot,
  },
  returnDetail: {
    marginTop: 8,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
    color: colors.chalk,
  },
  returnTomorrow: {
    marginTop: 10,
    fontFamily: fonts.displayMed,
    fontSize: 13,
    letterSpacing: 0.8,
    color: colors.chalk,
  },
  returnCta: {
    marginTop: 8,
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1.6,
    color: colors.amberHot,
  },
  dailyTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  dailyKicker: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1.8,
    color: colors.amberHot,
  },
  bonus: {
    fontFamily: fonts.bodyMed,
    fontSize: 10,
    letterSpacing: 0.8,
    color: colors.amber,
  },
  bonusHot: { color: colors.alert },
  countdown: {
    marginTop: 8,
    fontFamily: fonts.displayMed,
    fontSize: 13,
    letterSpacing: 1,
    color: colors.amberHot,
  },
  countdownHot: { color: colors.alert },
  seats: {
    marginTop: 4,
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1.2,
    color: colors.alert,
  },
  dailyTitle: {
    marginTop: 8,
    fontFamily: fonts.display,
    fontSize: 20,
    lineHeight: 24,
    color: colors.chalk,
    letterSpacing: 1,
  },
  dailyYear: {
    marginTop: 2,
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.mist,
  },
  teaser: {
    marginTop: 8,
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: colors.chalkDim,
  },
  cta: {
    marginTop: 10,
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1.6,
    color: colors.cyanHot,
  },
  reminder: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.steelEdge,
    backgroundColor: 'rgba(14,20,34,0.75)',
    padding: 12,
    gap: 4,
  },
  reminderKicker: {
    fontFamily: fonts.bodyMed,
    fontSize: 10,
    letterSpacing: 1.6,
    color: colors.mist,
  },
  reminderLabel: {
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 1.1,
    color: colors.chalk,
  },
  reminderTip: {
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 15,
    color: colors.mist,
  },
  reminderMsg: {
    marginTop: 4,
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.cyanHot,
  },
  weekly: {
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.lineCyan,
    backgroundColor: 'rgba(14,20,34,0.8)',
    padding: 12,
    gap: 8,
  },
  weeklyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(154,173,194,0.2)',
  },
  weeklyScore: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.cyanHot,
    minWidth: 40,
  },
  weeklyMeta: { flex: 1, gap: 2 },
  weeklyTitle: {
    fontFamily: fonts.bodyMed,
    fontSize: 13,
    color: colors.chalk,
  },
  weeklySub: {
    fontFamily: fonts.body,
    fontSize: 11,
    color: colors.mist,
  },
  resume: {
    borderRadius: radii.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,107,74,0.45)',
    padding: 14,
    minHeight: 96,
  },
  resumeKicker: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1.6,
    color: colors.alert,
  },
  resumeTitle: {
    marginTop: 6,
    fontFamily: fonts.displayMed,
    fontSize: 16,
    color: colors.chalk,
    letterSpacing: 0.6,
  },
  resumeMeta: {
    marginTop: 4,
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.mist,
  },
  resumeCta: {
    marginTop: 10,
    fontFamily: fonts.bodyBold,
    fontSize: 12,
    letterSpacing: 1.6,
    color: colors.amberHot,
  },
  nextHeadline: {
    fontFamily: fonts.displayMed,
    fontSize: 16,
    color: colors.chalk,
    letterSpacing: 0.5,
  },
});
