/**
 * Native RevenueCat SDK helpers (iOS / Android).
 * Metro resolves `revenueCat.web.ts` on web so Purchases never loads in the browser bundle.
 */
import { Platform } from 'react-native';
import Purchases, {
  LOG_LEVEL,
  PACKAGE_TYPE,
  PURCHASES_ERROR_CODE,
  type CustomerInfo,
  type CustomerInfoUpdateListener,
  type PurchasesError,
  type PurchasesOffering,
  type PurchasesPackage,
} from 'react-native-purchases';
import RevenueCatUI, { PAYWALL_RESULT } from 'react-native-purchases-ui';
import {
  PRO_PACKAGE_LABELS,
  RC_ENTITLEMENT_PRO,
  RC_PACKAGE_LIFETIME,
  RC_PACKAGE_MONTHLY,
  RC_PACKAGE_YEARLY,
  type OfferingPackageSummary,
  type PresentCustomerCenterResult,
  type PresentPaywallResult,
  type ProPackageId,
  revenueCatApiKey,
} from '@/billing/types';

let configured = false;
let configuring: Promise<void> | null = null;

export function isPurchasesError(e: unknown): e is PurchasesError {
  return Boolean(e && typeof e === 'object' && 'code' in e);
}

export function userCancelledPurchase(e: unknown): boolean {
  return isPurchasesError(e) && e.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR;
}

export function hasGenesisPro(info: CustomerInfo): boolean {
  return Boolean(info.entitlements.active[RC_ENTITLEMENT_PRO]);
}

export async function configureRevenueCat(appUserId?: string): Promise<void> {
  const apiKey = revenueCatApiKey();
  if (!apiKey) {
    throw new Error('EXPO_PUBLIC_REVENUECAT_KEY is missing.');
  }

  if (!configured) {
    if (!configuring) {
      configuring = (async () => {
        if (__DEV__) {
          Purchases.setLogLevel(LOG_LEVEL.DEBUG);
        }
        // Platform-aware: same public key env for Google / Apple apps in RC project.
        Purchases.configure({ apiKey });
        configured = true;
      })();
    }
    await configuring;
  }

  const id = appUserId?.trim();
  if (id) {
    try {
      await Purchases.logIn(id);
    } catch {
      // Anonymous / already identified — continue.
    }
  }
}

export function addCustomerInfoListener(listener: CustomerInfoUpdateListener): () => void {
  Purchases.addCustomerInfoUpdateListener(listener);
  return () => {
    Purchases.removeCustomerInfoUpdateListener(listener);
  };
}

export async function fetchCustomerInfo(): Promise<CustomerInfo> {
  return Purchases.getCustomerInfo();
}

export async function restoreCustomerPurchases(): Promise<CustomerInfo> {
  return Purchases.restorePurchases();
}

function mapPackageId(pkg: PurchasesPackage): ProPackageId | null {
  const id = pkg.identifier.toLowerCase();
  if (
    id === RC_PACKAGE_LIFETIME ||
    id === '$rc_lifetime' ||
    pkg.packageType === PACKAGE_TYPE.LIFETIME
  ) {
    return 'lifetime';
  }
  if (
    id === RC_PACKAGE_YEARLY ||
    id === 'annual' ||
    id === '$rc_annual' ||
    pkg.packageType === PACKAGE_TYPE.ANNUAL
  ) {
    return 'yearly';
  }
  if (
    id === RC_PACKAGE_MONTHLY ||
    id === '$rc_monthly' ||
    pkg.packageType === PACKAGE_TYPE.MONTHLY
  ) {
    return 'monthly';
  }
  return null;
}

export async function getCurrentOffering(): Promise<PurchasesOffering | null> {
  const offerings = await Purchases.getOfferings();
  return offerings.current ?? null;
}

export async function listProPackages(): Promise<OfferingPackageSummary[]> {
  const offering = await getCurrentOffering();
  if (!offering) return [];

  const out: OfferingPackageSummary[] = [];
  const seen = new Set<ProPackageId>();

  for (const pkg of offering.availablePackages) {
    const proId = mapPackageId(pkg);
    if (!proId || seen.has(proId)) continue;
    seen.add(proId);
    out.push({
      id: proId,
      identifier: pkg.identifier,
      title: PRO_PACKAGE_LABELS[proId],
      priceString: pkg.product.priceString,
      description: pkg.product.description || packageBlurb(proId),
    });
  }

  // Stable order: lifetime → yearly → monthly
  const order: ProPackageId[] = ['lifetime', 'yearly', 'monthly'];
  return order
    .map((id) => out.find((p) => p.id === id))
    .filter((p): p is OfferingPackageSummary => Boolean(p));
}

function packageBlurb(id: ProPackageId): string {
  switch (id) {
    case 'lifetime':
      return 'One-time unlock — full timeline forever.';
    case 'yearly':
      return 'Best value subscription — billed annually.';
    case 'monthly':
      return 'Flexible access — cancel anytime.';
  }
}

export async function findPackage(packageId: ProPackageId): Promise<PurchasesPackage | null> {
  const offering = await getCurrentOffering();
  if (!offering) return null;
  return offering.availablePackages.find((pkg) => mapPackageId(pkg) === packageId) ?? null;
}

export async function purchaseProPackageNative(packageId: ProPackageId): Promise<CustomerInfo> {
  const pkg = await findPackage(packageId);
  if (!pkg) {
    throw new Error(
      `Package "${packageId}" not in current offering. In RevenueCat, attach lifetime / yearly / monthly to the current offering and ensure entitlement ${RC_ENTITLEMENT_PRO} is granted.`,
    );
  }
  const { customerInfo } = await Purchases.purchasePackage(pkg);
  return customerInfo;
}

export async function presentRevenueCatPaywall(): Promise<PresentPaywallResult> {
  if (Platform.OS === 'web') {
    return { presented: false, purchased: false, fallback: true, error: 'Paywalls UI unavailable on web.' };
  }
  try {
    const offering = await getCurrentOffering();
    if (!offering || offering.availablePackages.length === 0) {
      return {
        presented: false,
        purchased: false,
        fallback: true,
        error: 'No current offering packages. Configure offerings in RevenueCat dashboard.',
      };
    }
    const result = await RevenueCatUI.presentPaywall({
      offering,
      displayCloseButton: true,
    });
    switch (result) {
      case PAYWALL_RESULT.PURCHASED:
      case PAYWALL_RESULT.RESTORED:
        return { presented: true, purchased: true, fallback: false };
      case PAYWALL_RESULT.CANCELLED:
        return { presented: true, purchased: false, fallback: false };
      case PAYWALL_RESULT.NOT_PRESENTED:
      case PAYWALL_RESULT.ERROR:
      default:
        return {
          presented: false,
          purchased: false,
          fallback: true,
          error: `Paywall result: ${String(result)}`,
        };
    }
  } catch (e) {
    const msg = isPurchasesError(e) ? e.message : e instanceof Error ? e.message : 'Paywall failed.';
    return { presented: false, purchased: false, fallback: true, error: msg };
  }
}

export async function presentRevenueCatCustomerCenter(): Promise<PresentCustomerCenterResult> {
  if (Platform.OS === 'web') {
    return { presented: false, error: 'Customer Center unavailable on web.' };
  }
  try {
    await RevenueCatUI.presentCustomerCenter();
    return { presented: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Customer Center failed.';
    return { presented: false, error: msg };
  }
}
