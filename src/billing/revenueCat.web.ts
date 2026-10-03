/**
 * Web stubs — native Purchases / Paywalls UI are not loaded on Expo web.
 */
import type {
  OfferingPackageSummary,
  PresentCustomerCenterResult,
  PresentPaywallResult,
  ProPackageId,
} from '@/billing/types';
import {
  PRO_PACKAGE_IDS,
  PRO_PACKAGE_LABELS,
  PRO_PACKAGE_MOCK_PRICE,
} from '@/billing/types';

type StubCustomerInfo = { entitlements: { active: Record<string, unknown> } };

export function isPurchasesError(_e: unknown): boolean {
  return false;
}

export function userCancelledPurchase(_e: unknown): boolean {
  return false;
}

export function hasGenesisPro(_info: StubCustomerInfo): boolean {
  return false;
}

export async function configureRevenueCat(_appUserId?: string): Promise<void> {
  throw new Error('RevenueCat is not available on web.');
}

export function addCustomerInfoListener(_listener: (info: StubCustomerInfo) => void): () => void {
  return () => undefined;
}

export async function fetchCustomerInfo(): Promise<StubCustomerInfo> {
  throw new Error('RevenueCat is not available on web.');
}

export async function restoreCustomerPurchases(): Promise<StubCustomerInfo> {
  throw new Error('RevenueCat is not available on web.');
}

export async function getCurrentOffering(): Promise<null> {
  return null;
}

export async function listProPackages(): Promise<OfferingPackageSummary[]> {
  return PRO_PACKAGE_IDS.map((id) => ({
    id,
    identifier: id,
    title: PRO_PACKAGE_LABELS[id],
    priceString: PRO_PACKAGE_MOCK_PRICE[id],
    description: 'Web demo — use MockBilling.',
  }));
}

export async function findPackage(_packageId: ProPackageId): Promise<null> {
  return null;
}

export async function purchaseProPackageNative(_packageId: ProPackageId): Promise<StubCustomerInfo> {
  throw new Error('RevenueCat purchases are not available on web.');
}

export async function presentRevenueCatPaywall(): Promise<PresentPaywallResult> {
  return {
    presented: false,
    purchased: false,
    fallback: true,
    error: 'Paywalls UI unavailable on web.',
  };
}

export async function presentRevenueCatCustomerCenter(): Promise<PresentCustomerCenterResult> {
  return { presented: false, error: 'Customer Center unavailable on web.' };
}
