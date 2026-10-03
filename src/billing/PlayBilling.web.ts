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
  PRO_PACKAGE_IDS,
  PRO_PACKAGE_LABELS,
  PRO_PACKAGE_MOCK_PRICE,
  RC_ENTITLEMENT_PRO,
  STREAK_FREEZE_PRICE_USD,
  STREAK_FREEZE_PRODUCT_ID,
} from '@/billing/types';

/**
 * Web stub — Play / RevenueCat native SDK is not used on Expo web.
 * `createBillingProvider` returns MockBilling on web; this file exists so Metro
 * never loads `react-native-purchases` / `react-native-purchases-ui` in the browser bundle.
 */
export const PlayBilling: BillingProvider = {
  id: 'play',
  badge: 'STORE · REVENUECAT',
  ctaLabel: 'Genesis Pro · subscribe or unlock',
  restoreLabel: 'Restore purchases',
  streakFreezeCtaLabel: `Buy streak freeze · $${STREAK_FREEZE_PRICE_USD}`,
  isSandbox: true,
  channelNote: `Entitlement ${RC_ENTITLEMENT_PRO} · web uses MockBilling (no native store).`,
  supportsNativePaywall: false,
  supportsCustomerCenter: false,

  async purchaseUnlockAll(_ctx: BillingContext): Promise<PurchaseResult> {
    return {
      ok: false,
      error: 'Store billing runs on Android / iOS builds only. Use MockBilling sandbox on web.',
      provider: 'play',
      sandbox: true,
    };
  },

  async purchaseProPackage(_ctx: BillingContext, _packageId: ProPackageId): Promise<PurchaseResult> {
    return {
      ok: false,
      error: 'Store billing runs on Android / iOS builds only. Use MockBilling sandbox on web.',
      provider: 'play',
      sandbox: true,
    };
  },

  async purchaseStreakFreeze(_ctx: BillingContext): Promise<PurchaseResult> {
    return {
      ok: false,
      error: 'Store billing runs on Android / iOS builds only. Use MockBilling sandbox on web.',
      provider: 'play',
      sandbox: true,
    };
  },

  async restorePurchases(ctx: BillingContext): Promise<RestoreResult> {
    void playBillingReady;
    return { restored: ctx.hasUnlockAll(), sandbox: true, provider: 'play' };
  },

  async getOfferingPackages(): Promise<OfferingPackageSummary[]> {
    return PRO_PACKAGE_IDS.map((id) => ({
      id,
      identifier: id,
      title: PRO_PACKAGE_LABELS[id],
      priceString: PRO_PACKAGE_MOCK_PRICE[id],
      description: 'Web stub — MockBilling presents these.',
    }));
  },

  async presentNativePaywall(_ctx: BillingContext): Promise<PresentPaywallResult> {
    return {
      presented: false,
      purchased: false,
      fallback: true,
      error: 'Paywalls UI unavailable on web.',
    };
  },

  async presentCustomerCenter(_ctx: BillingContext): Promise<PresentCustomerCenterResult> {
    return { presented: false, error: 'Customer Center unavailable on web.' };
  },

  async syncCustomerInfo(ctx: BillingContext): Promise<{ active: boolean }> {
    return { active: ctx.hasUnlockAll() };
  },
};
