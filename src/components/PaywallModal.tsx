import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Button } from '@/components/Button';
import { useAccount } from '@/account/AccountProvider';
import { useBilling } from '@/billing/BillingProvider';
import type { OfferingPackageSummary, ProPackageId } from '@/billing/types';
import {
  PRO_PACKAGE_IDS,
  PRO_PACKAGE_LABELS,
  PRO_PACKAGE_MOCK_PRICE,
  RC_ENTITLEMENT_PRO,
  STREAK_FREEZE_PRICE_USD,
  STREAK_FREEZE_PRODUCT_ID,
} from '@/billing/types';
import { useRetention } from '@/retention/RetentionProvider';
import { colors, fonts } from '@/theme/colors';

type Props = {
  visible: boolean;
  onClose: () => void;
  theaterTitle?: string;
};

function billingCtx(
  account: ReturnType<typeof useAccount>,
  retention: ReturnType<typeof useRetention>,
) {
  return {
    email: account.user?.email,
    userId: account.user?.id,
    grantUnlockAll: account.grantUnlockAll,
    syncProEntitlement: account.syncProEntitlement,
    hasUnlockAll: () => account.entitlement.unlockAll,
    grantStreakFreezeCharge: async () => {
      await retention.grantStreakFreezeCharge();
    },
  };
}

/**
 * Prefer RevenueCat Paywalls UI on native when offerings exist.
 * Fall back to this glass modal (lifetime / yearly / monthly) on web / missing UI.
 */
export function PaywallModal({ visible, onClose, theaterTitle }: Props) {
  const account = useAccount();
  const billing = useBilling();
  const retention = useRetention();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [packages, setPackages] = useState<OfferingPackageSummary[]>([]);
  const [showGlass, setShowGlass] = useState(false);

  const used = account.entitlement.freeTheaterIds.length;
  const unlocked = account.entitlement.unlockAll;
  const softWalled = account.isAuthenticated && !unlocked;
  const ctx = billingCtx(account, retention);

  const loadPackages = useCallback(async () => {
    try {
      const list = await billing.getOfferingPackages();
      setPackages(
        list.length
          ? list
          : PRO_PACKAGE_IDS.map((id) => ({
              id,
              identifier: id,
              title: PRO_PACKAGE_LABELS[id],
              priceString: PRO_PACKAGE_MOCK_PRICE[id],
              description:
                id === 'lifetime'
                  ? 'One-time unlock — full timeline forever.'
                  : id === 'yearly'
                    ? 'Best value subscription — billed annually.'
                    : 'Flexible access — cancel anytime.',
            })),
      );
    } catch {
      setPackages([]);
    }
  }, [billing]);

  useEffect(() => {
    retention.setSoftWalled(visible && softWalled);
    return () => retention.setSoftWalled(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, softWalled]);

  useEffect(() => {
    if (!visible) {
      setMessage(null);
      setShowGlass(false);
      setBusy(false);
      return;
    }

    let cancelled = false;
    (async () => {
      await loadPackages();
      if (cancelled) return;

      // Already Pro → show manage / restore glass surface.
      if (unlocked) {
        setShowGlass(true);
        return;
      }

      if (billing.supportsNativePaywall) {
        setBusy(true);
        try {
          const result = await billing.presentNativePaywall(ctx);
          if (cancelled) return;
          if (result.purchased) {
            setMessage('Genesis Pro active — full timeline unlocked.');
            setShowGlass(false);
            onClose();
            return;
          }
          if (result.presented && !result.fallback) {
            // User dismissed RC paywall without purchase.
            onClose();
            return;
          }
          // Fall through to glass modal.
          setShowGlass(true);
          if (result.error && __DEV__) {
            setMessage(result.error);
          }
        } catch (e) {
          if (!cancelled) {
            setShowGlass(true);
            setMessage(e instanceof Error ? e.message : 'Paywall unavailable.');
          }
        } finally {
          if (!cancelled) setBusy(false);
        }
        return;
      }

      setShowGlass(true);
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  async function buyPackage(packageId: ProPackageId) {
    setBusy(true);
    setMessage(null);
    try {
      const res = await billing.purchaseProPackage(ctx, packageId);
      if (!res.ok) {
        setMessage(res.error);
        return;
      }
      setMessage(
        res.sandbox
          ? `Sandbox: Genesis Pro (${packageId}) — all theaters unlocked.`
          : `Genesis Pro (${packageId}) active — full timeline unlocked.`,
      );
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Purchase failed.');
    } finally {
      setBusy(false);
    }
  }

  async function buyFreeze() {
    setBusy(true);
    setMessage(null);
    try {
      const res = await billing.purchaseStreakFreeze(ctx);
      if (!res.ok) {
        setMessage(res.error);
        return;
      }
      setMessage(
        res.sandbox
          ? `Sandbox: +1 streak freeze · ${retention.state.streakFreezeCharges + 1} charge(s) (syncing).`
          : 'Streak freeze charge added.',
      );
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Purchase failed.');
    } finally {
      setBusy(false);
    }
  }

  async function restore() {
    setBusy(true);
    setMessage(null);
    try {
      const res = await billing.restorePurchases(ctx);
      const local = await account.restorePurchasesSandbox();
      const restored = res.restored || local.restored;
      setMessage(
        restored
          ? `Restored: ${RC_ENTITLEMENT_PRO} found (${billing.id}).`
          : `No active ${RC_ENTITLEMENT_PRO} on this account (${billing.id}).`,
      );
    } finally {
      setBusy(false);
    }
  }

  async function openCustomerCenter() {
    setBusy(true);
    setMessage(null);
    try {
      const res = await billing.presentCustomerCenter(ctx);
      if (!res.presented) {
        setMessage(res.error ?? 'Customer Center unavailable — use Restore.');
      }
    } finally {
      setBusy(false);
    }
  }

  const fomoLine = retention.fomo.unlockUrgency;
  const glassVisible = visible && showGlass;

  return (
    <Modal visible={glassVisible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card} nativeID="paywall-modal">
          <Text style={styles.badge}>{billing.badge}</Text>
          <Text style={styles.title}>GENESIS PRO</Text>
          {theaterTitle ? (
            <Text style={styles.sub}>
              “{theaterTitle}” is locked. Free allowance is {account.freeLimit} theaters.
            </Text>
          ) : (
            <Text style={styles.sub}>
              Play {account.freeLimit} theaters free. Subscribe or unlock lifetime for the full
              timeline — entitlement {RC_ENTITLEMENT_PRO}.
            </Text>
          )}

          {fomoLine ? (
            <View style={styles.fomo} nativeID="paywall-fomo">
              <Text style={styles.fomoKicker}>WINDOW CLOSING</Text>
              <Text style={styles.fomoBody}>{fomoLine}</Text>
              {retention.crisis ? (
                <Text style={[styles.fomoClock, retention.fomo.crisisUrgent && styles.fomoHot]}>
                  {retention.fomo.crisisCountdown}
                </Text>
              ) : null}
            </View>
          ) : null}

          <View style={styles.meter}>
            <Text style={styles.meterLabel}>FREE SLOTS USED</Text>
            <Text style={styles.meterVal}>
              {Math.min(used, account.freeLimit)} / {account.freeLimit}
            </Text>
            <View style={styles.rail}>
              {Array.from({ length: account.freeLimit }).map((_, i) => (
                <View key={i} style={[styles.seg, i < used ? styles.segOn : styles.segOff]} />
              ))}
            </View>
          </View>

          {unlocked ? (
            <Text style={styles.unlocked}>Genesis Pro active on this account.</Text>
          ) : (
            <View style={styles.pkgList} nativeID="paywall-packages">
              {(packages.length ? packages : []).map((pkg) => (
                <Pressable
                  key={pkg.id}
                  style={({ pressed }) => [styles.pkgRow, pressed && styles.pkgPressed]}
                  onPress={() => buyPackage(pkg.id)}
                  disabled={busy}
                  accessibilityRole="button"
                >
                  <View style={styles.pkgText}>
                    <Text style={styles.pkgTitle}>{pkg.title}</Text>
                    <Text style={styles.pkgDesc} numberOfLines={2}>
                      {pkg.description}
                    </Text>
                  </View>
                  <Text style={styles.pkgPrice}>{pkg.priceString}</Text>
                </Pressable>
              ))}
              <Text style={styles.channel}>{billing.channelNote}</Text>
            </View>
          )}

          {unlocked && billing.supportsCustomerCenter ? (
            <Button
              label={busy ? 'Opening…' : 'Manage subscription'}
              onPress={openCustomerCenter}
              disabled={busy}
            />
          ) : null}

          <View style={styles.freezeBox} nativeID="paywall-streak-freeze">
            <Text style={styles.freezeKicker}>STREAK FREEZE · ${STREAK_FREEZE_PRICE_USD}</Text>
            <Text style={styles.freezeBody}>
              Save a missed day. Charges on desk: {retention.state.streakFreezeCharges}. SKU{' '}
              {STREAK_FREEZE_PRODUCT_ID} (sandbox / secondary).
            </Text>
            <Button
              label={busy ? 'Processing…' : billing.streakFreezeCtaLabel}
              variant="ghost"
              onPress={buyFreeze}
              disabled={busy}
            />
          </View>

          <Button label={billing.restoreLabel} variant="ghost" onPress={restore} disabled={busy} />
          <Pressable onPress={onClose} style={styles.close}>
            <Text style={styles.closeText}>CLOSE</Text>
          </Pressable>
          {busy ? <ActivityIndicator color={colors.amber} style={{ marginTop: 8 }} /> : null}
          {message ? <Text style={styles.message}>{message}</Text> : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(7, 16, 24, 0.82)',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.amber,
    padding: 20,
    gap: 12,
    maxHeight: '92%',
  },
  badge: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1.6,
    color: colors.alert,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 32,
    color: colors.chalk,
    letterSpacing: 1,
  },
  sub: {
    fontFamily: fonts.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.chalkDim,
  },
  fomo: {
    borderWidth: 1,
    borderColor: 'rgba(255,107,74,0.55)',
    backgroundColor: 'rgba(255,107,74,0.1)',
    padding: 12,
    gap: 4,
  },
  fomoKicker: {
    fontFamily: fonts.bodyBold,
    fontSize: 10,
    letterSpacing: 1.6,
    color: colors.alert,
  },
  fomoBody: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    color: colors.chalk,
  },
  fomoClock: {
    marginTop: 4,
    fontFamily: fonts.displayMed,
    fontSize: 12,
    letterSpacing: 1,
    color: colors.amberHot,
  },
  fomoHot: { color: colors.alert },
  meter: { gap: 6 },
  meterLabel: {
    fontFamily: fonts.bodyMed,
    fontSize: 10,
    letterSpacing: 1.4,
    color: colors.fog,
  },
  meterVal: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.amberHot,
  },
  rail: { flexDirection: 'row', gap: 6 },
  seg: { flex: 1, height: 6 },
  segOn: { backgroundColor: colors.amber },
  segOff: { backgroundColor: 'rgba(255,255,255,0.1)' },
  pkgList: { gap: 8 },
  pkgRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.deep,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  pkgPressed: { borderColor: colors.amber, backgroundColor: 'rgba(255,184,77,0.08)' },
  pkgText: { flex: 1, gap: 2 },
  pkgTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: 14,
    letterSpacing: 0.6,
    color: colors.chalk,
  },
  pkgDesc: {
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 15,
    color: colors.chalkDim,
  },
  pkgPrice: {
    fontFamily: fonts.displayMed,
    fontSize: 13,
    letterSpacing: 0.4,
    color: colors.tealBright,
  },
  channel: {
    fontFamily: fonts.body,
    fontSize: 11,
    lineHeight: 16,
    color: colors.chalkDim,
    marginTop: 4,
  },
  freezeBox: {
    borderWidth: 1,
    borderColor: colors.lineCyan,
    backgroundColor: 'rgba(14,20,34,0.65)',
    padding: 12,
    gap: 8,
  },
  freezeKicker: {
    fontFamily: fonts.bodyBold,
    fontSize: 11,
    letterSpacing: 1.4,
    color: colors.cyanHot,
  },
  freezeBody: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17,
    color: colors.chalkDim,
  },
  unlocked: {
    fontFamily: fonts.bodyBold,
    fontSize: 13,
    color: colors.tealBright,
  },
  close: { alignItems: 'center', paddingVertical: 8 },
  closeText: {
    fontFamily: fonts.bodyMed,
    fontSize: 11,
    letterSpacing: 1.4,
    color: colors.mist,
  },
  message: {
    fontFamily: fonts.body,
    fontSize: 12,
    lineHeight: 17,
    color: colors.chalkDim,
  },
});
