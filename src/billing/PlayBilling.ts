import {
  configureRevenueCat,
  fetchCustomerInfo,
  hasGenesisPro,
  isPurchasesError,
  listProPackages,
  presentRevenueCatCustomerCenter,
  presentRevenueCatPaywall,
  purchaseProPackageNative,
  restoreCustomerPurchases,
  userCancelledPurchase,
} from '@/billing/revenueCat';
import type {
  BillingContext,
  BillingProvider,
  OfferingPackageSummary,
  PresentCustomerCenterResult,
  PresentPaywallResult,
  ProPackageId,
  PurchaseResult,
  RestoreResult,
} from '@/billing/types';
import {
  playBillingReady,
  PRO_PACKAGE_LABELS,
  RC_ENTITLEMENT_PRO,
  RC_PACKAGE_LIFETIME,
  RC_PACKAGE_MONTHLY,
  RC_PACKAGE_YEARLY,
  STREAK_FREEZE_PRICE_USD,
  STREAK_FREEZE_PRODUCT_ID,
} from '@/billing/types';

async function ensureReady(ctx: BillingContext): Promise<void> {
  await configureRevenueCat(ctx.userId?.trim() || ctx.email?.trim());
}

async function applyPro(ctx: BillingContext, active: boolean): Promise<void> {
  if (ctx.syncProEntitlement) {
    await ctx.syncProEntitlement({ active, sandbox: false, source: 'play' });
    return;
  }
  if (active && !ctx.hasUnlockAll()) {
    await ctx.grantUnlockAll({ sandbox: false, source: 'play' });
  }
}

/**
 * Google Play / App Store Billing via RevenueCat (`react-native-purchases` + UI).
 *
 * Entitlement: `genesis_pro` → AccountProvider `unlockAll`
 * Packages (current offering): `lifetime` · `yearly` · `monthly`
 *
 * When `EXPO_PUBLIC_REVENUECAT_KEY` is unset, `createBillingProvider` uses MockBilling.
 */
export const PlayBilling: BillingProvider = {
  id: 'play',
  badge: 'STORE · REVENUECAT',
  ctaLabel: 'Genesis Pro · subscribe or unlock',
  restoreLabel: 'Restore purchases',
  streakFreezeCtaLabel: `Buy streak freeze · $${STREAK_FREEZE_PRICE_USD}`,
  isSandbox: !playBillingReady(),
  channelNote: `Entitlement ${RC_ENTITLEMENT_PRO} · packages ${RC_PACKAGE_LIFETIME} / ${RC_PACKAGE_YEARLY} / ${RC_PACKAGE_MONTHLY} · Paywalls UI + Customer Center.`,
  supportsNativePaywall: true,
  supportsCustomerCenter: true,

  async purchaseUnlockAll(ctx: BillingContext): Promise<PurchaseResult> {
    return this.purchaseProPackage(ctx, 'lifetime');
  },

  async purchaseProPackage(ctx: BillingContext, packageId: ProPackageId): Promise<PurchaseResult> {
    if (!ctx.email) {
      return { ok: false, error: 'Sign in to purchase.', provider: 'play' };
    }
    if (!playBillingReady()) {
      return {
        ok: false,
        error:
          'Store billing not configured. Set EXPO_PUBLIC_REVENUECAT_KEY and rebuild. Use sandbox on web/dev.',
        provider: 'play',
        sandbox: true,
      };
    }
    try {
      await ensureReady(ctx);
      const info = await purchaseProPackageNative(packageId);
      const active = hasGenesisPro(info);
      await applyPro(ctx, active);
      if (!active) {
        return {
          ok: false,
          error: `Purchase completed but entitlement ${RC_ENTITLEMENT_PRO} is inactive. Map ${PRO_PACKAGE_LABELS[packageId]} → ${RC_ENTITLEMENT_PRO} in RevenueCat.`,
          provider: 'play',
        };
      }
      return { ok: true, sandbox: false, provider: 'play', packageId };
    } catch (e) {
      if (userCancelledPurchase(e)) {
        return { ok: false, error: 'Purchase cancelled.', provider: 'play' };
      }
      const msg = isPurchasesError(e) ? e.message : e instanceof Error ? e.message : 'Purchase failed.';
      return { ok: false, error: msg, provider: 'play' };
    }
  },

  async purchaseStreakFreeze(ctx: BillingContext): Promise<PurchaseResult> {
    // Streak freeze stays Mock / secondary — do not block Pro subscription path.
    if (!ctx.email) {
      return { ok: false, error: 'Sign in to purchase.', provider: 'play' };
    }
    if (!ctx.grantStreakFreezeCharge) {
      return { ok: false, error: 'Streak freeze grant hook missing.', provider: 'play' };
    }
    return {
      ok: false,
      error: `Streak freeze (${STREAK_FREEZE_PRODUCT_ID}) is sandbox/Mock-only in this build. Use MockBilling on web/dev, or buy Genesis Pro for timeline access.`,
      provider: 'play',
      sandbox: true,
    };
  },

  async restorePurchases(ctx: BillingContext): Promise<RestoreResult> {
    if (!playBillingReady()) {
      return { restored: ctx.hasUnlockAll(), sandbox: true, provider: 'play' };
    }
    try {
      await ensureReady(ctx);
      const info = await restoreCustomerPurchases();
      const restored = hasGenesisPro(info);
      await applyPro(ctx, restored);
      return { restored: restored || ctx.hasUnlockAll(), sandbox: false, provider: 'play' };
    } catch {
      return { restored: ctx.hasUnlockAll(), sandbox: false, provider: 'play' };
    }
  },

  async getOfferingPackages(): Promise<OfferingPackageSummary[]> {
    if (!playBillingReady()) return [];
    try {
      await configureRevenueCat();
      return await listProPackages();
    } catch {
      return [];
    }
  },

  async presentNativePaywall(ctx: BillingContext): Promise<PresentPaywallResult> {
    if (!playBillingReady()) {
      return {
        presented: false,
        purchased: false,
        fallback: true,
        error: 'Missing EXPO_PUBLIC_REVENUECAT_KEY.',
      };
    }
    try {
      await ensureReady(ctx);
      const result = await presentRevenueCatPaywall();
      if (result.purchased) {
        const info = await fetchCustomerInfo();
        await applyPro(ctx, hasGenesisPro(info));
      }
      return result;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Paywall failed.';
      return { presented: false, purchased: false, fallback: true, error: msg };
    }
  },

  async presentCustomerCenter(ctx: BillingContext): Promise<PresentCustomerCenterResult> {
    if (!playBillingReady()) {
      return { presented: false, error: 'Missing EXPO_PUBLIC_REVENUECAT_KEY.' };
    }
    try {
      await ensureReady(ctx);
      const result = await presentRevenueCatCustomerCenter();
      try {
        const info = await fetchCustomerInfo();
        await applyPro(ctx, hasGenesisPro(info));
      } catch {
        // ignore sync errors after center dismiss
      }
      return result;
    } catch (e) {
      return { presented: false, error: e instanceof Error ? e.message : 'Customer Center failed.' };
    }
  },

  async syncCustomerInfo(ctx: BillingContext): Promise<{ active: boolean }> {
    if (!playBillingReady()) {
      return { active: ctx.hasUnlockAll() };
    }
    try {
      await ensureReady(ctx);
      const info = await fetchCustomerInfo();
      const active = hasGenesisPro(info);
      await applyPro(ctx, active);
      return { active };
    } catch {
      return { active: ctx.hasUnlockAll() };
    }
  },
};
