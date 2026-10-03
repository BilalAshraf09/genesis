/**
 * Billing product constants — keep in sync with Play Console / App Store + RevenueCat.
 *
 * Live path: entitlement `genesis_pro` via packages lifetime / yearly / monthly.
 * Streak freeze remains a Mock / secondary consumable (does not gate timeline unlock).
 */

/** @deprecated Prefer RC packages; kept for mock CTA / docs continuity. */
export const UNLOCK_PRODUCT_ID = 'genesis_unlock_all';
/** Display fallback when store price is unavailable (lifetime mock). */
export const UNLOCK_PRICE_USD = 49.99;
/** Consumable / single-charge streak freeze (~$0.99) — Mock-primary. */
export const STREAK_FREEZE_PRODUCT_ID = 'genesis_streak_freeze';
export const STREAK_FREEZE_PRICE_USD = 0.99;

/** RevenueCat entitlement that grants full timeline (`unlockAll`). */
export const RC_ENTITLEMENT_PRO = 'genesis_pro';
/** @deprecated Use RC_ENTITLEMENT_PRO — prior one-time unlock entitlement id. */
export const RC_ENTITLEMENT_UNLOCK_ALL = RC_ENTITLEMENT_PRO;

/** Offering package identifiers Bilal must attach in RC dashboard. */
export const RC_PACKAGE_LIFETIME = 'lifetime';
export const RC_PACKAGE_YEARLY = 'yearly';
export const RC_PACKAGE_MONTHLY = 'monthly';

export type ProPackageId = 'lifetime' | 'yearly' | 'monthly';

export const PRO_PACKAGE_IDS: readonly ProPackageId[] = [
  RC_PACKAGE_LIFETIME,
  RC_PACKAGE_YEARLY,
  RC_PACKAGE_MONTHLY,
] as const;

export const PRO_PACKAGE_LABELS: Record<ProPackageId, string> = {
  lifetime: 'Lifetime',
  yearly: 'Yearly',
  monthly: 'Monthly',
};

export const PRO_PACKAGE_MOCK_PRICE: Record<ProPackageId, string> = {
  lifetime: '$49.99 once',
  yearly: '$29.99 / year',
  monthly: '$4.99 / month',
};

export type BillingProviderId = 'mock' | 'play';

export type PurchaseResult =
  | { ok: true; sandbox: boolean; provider: BillingProviderId; packageId?: ProPackageId }
  | { ok: false; error: string; sandbox?: boolean; provider: BillingProviderId };

export type RestoreResult = {
  restored: boolean;
  sandbox: boolean;
  provider: BillingProviderId;
};

export type PresentPaywallResult = {
  /** True when RevenueCat Paywalls UI was shown (native). */
  presented: boolean;
  /** True when a purchase or restore completed via that UI. */
  purchased: boolean;
  /** Fall back to in-app glass paywall when false / error. */
  fallback: boolean;
  error?: string;
};

export type PresentCustomerCenterResult = {
  presented: boolean;
  error?: string;
};

export type OfferingPackageSummary = {
  id: ProPackageId;
  identifier: string;
  title: string;
  priceString: string;
  description: string;
};

export type BillingContext = {
  /** Account email for receipts / store identity */
  email?: string;
  /** Account user id */
  userId?: string;
  /** Persist unlock on the signed-in account */
  grantUnlockAll: (opts: { sandbox: boolean; source: BillingProviderId }) => Promise<void>;
  /** Sync unlockAll from live CustomerInfo (may clear when entitlement lapses). */
  syncProEntitlement?: (opts: {
    active: boolean;
    sandbox: boolean;
    source: BillingProviderId;
  }) => Promise<void>;
  /** Whether this account already has unlockAll */
  hasUnlockAll: () => boolean;
  /** Grant one streak-freeze charge after successful IAP */
  grantStreakFreezeCharge?: (opts: { sandbox: boolean; source: BillingProviderId }) => Promise<void>;
};

export interface BillingProvider {
  readonly id: BillingProviderId;
  /** Short UI badge, e.g. SANDBOX / PLAY BILLING */
  readonly badge: string;
  /** Primary CTA label */
  readonly ctaLabel: string;
  /** Restore button label */
  readonly restoreLabel: string;
  /** Streak-freeze CTA */
  readonly streakFreezeCtaLabel: string;
  /** True when no live credentials / mock path */
  readonly isSandbox: boolean;
  /** One-line explainer under price */
  readonly channelNote: string;
  /** True when native RC Paywalls UI can be presented. */
  readonly supportsNativePaywall: boolean;
  /** True when Customer Center can be presented. */
  readonly supportsCustomerCenter: boolean;
  /** Legacy / convenience: purchase lifetime (or default package). Prefer purchaseProPackage. */
  purchaseUnlockAll(ctx: BillingContext): Promise<PurchaseResult>;
  purchaseProPackage(ctx: BillingContext, packageId: ProPackageId): Promise<PurchaseResult>;
  purchaseStreakFreeze(ctx: BillingContext): Promise<PurchaseResult>;
  restorePurchases(ctx: BillingContext): Promise<RestoreResult>;
  getOfferingPackages(): Promise<OfferingPackageSummary[]>;
  presentNativePaywall(ctx: BillingContext): Promise<PresentPaywallResult>;
  presentCustomerCenter(ctx: BillingContext): Promise<PresentCustomerCenterResult>;
  /** Configure SDK + pull CustomerInfo; grant/sync genesis_pro → unlockAll. */
  syncCustomerInfo(ctx: BillingContext): Promise<{ active: boolean }>;
}

export function playBillingReady(): boolean {
  return Boolean(process.env.EXPO_PUBLIC_REVENUECAT_KEY?.trim());
}

export function revenueCatApiKey(): string | undefined {
  const key = process.env.EXPO_PUBLIC_REVENUECAT_KEY?.trim();
  return key || undefined;
}
