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
  PRO_PACKAGE_IDS,
  PRO_PACKAGE_LABELS,
  PRO_PACKAGE_MOCK_PRICE,
  RC_ENTITLEMENT_PRO,
  STREAK_FREEZE_PRICE_USD,
  STREAK_FREEZE_PRODUCT_ID,
} from '@/billing/types';

/** Freemium mock for `__DEV__` / Expo web / missing RC key — no network, no charge. */
export const MockBilling: BillingProvider = {
  id: 'mock',
  badge: 'SANDBOX · NO REAL CHARGE',
  ctaLabel: 'Genesis Pro · sandbox unlock',
  restoreLabel: 'Restore purchases (sandbox)',
  streakFreezeCtaLabel: `Buy streak freeze · $${STREAK_FREEZE_PRICE_USD} (sandbox)`,
  isSandbox: true,
  channelNote: `Local mock for ${RC_ENTITLEMENT_PRO} packages (lifetime / yearly / monthly). Production native uses RevenueCat + store billing.`,
  supportsNativePaywall: false,
  supportsCustomerCenter: false,

  async purchaseUnlockAll(ctx: BillingContext): Promise<PurchaseResult> {
    return this.purchaseProPackage(ctx, 'lifetime');
  },

  async purchaseProPackage(ctx: BillingContext, packageId: ProPackageId): Promise<PurchaseResult> {
    if (!ctx.email) {
      return { ok: false, error: 'Sign in to purchase.', provider: 'mock', sandbox: true };
    }
    await new Promise((r) => setTimeout(r, 500));
    await ctx.grantUnlockAll({ sandbox: true, source: 'mock' });
    return { ok: true, sandbox: true, provider: 'mock', packageId };
  },

  async purchaseStreakFreeze(ctx: BillingContext): Promise<PurchaseResult> {
    if (!ctx.email) {
      return { ok: false, error: 'Sign in to purchase.', provider: 'mock', sandbox: true };
    }
    if (!ctx.grantStreakFreezeCharge) {
      return {
        ok: false,
        error: 'Streak freeze grant hook missing.',
        provider: 'mock',
        sandbox: true,
      };
    }
    await new Promise((r) => setTimeout(r, 450));
    await ctx.grantStreakFreezeCharge({ sandbox: true, source: 'mock' });
    return { ok: true, sandbox: true, provider: 'mock' };
  },

  async restorePurchases(ctx: BillingContext): Promise<RestoreResult> {
    const restored = ctx.hasUnlockAll();
    return { restored, sandbox: true, provider: 'mock' };
  },

  async getOfferingPackages(): Promise<OfferingPackageSummary[]> {
    return PRO_PACKAGE_IDS.map((id) => ({
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
    }));
  },

  async presentNativePaywall(_ctx: BillingContext): Promise<PresentPaywallResult> {
    return {
      presented: false,
      purchased: false,
      fallback: true,
      error: 'Native Paywalls UI requires store build + RC key.',
    };
  },

  async presentCustomerCenter(_ctx: BillingContext): Promise<PresentCustomerCenterResult> {
    return { presented: false, error: 'Customer Center requires store build + RC key.' };
  },

  async syncCustomerInfo(ctx: BillingContext): Promise<{ active: boolean }> {
    return { active: ctx.hasUnlockAll() };
  },
};
