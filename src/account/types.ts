/**
 * Account + freemium entitlement layer.
 *
 * LOCAL / DEV: mock email-password auth + mock Genesis Pro unlock (sandbox-labeled).
 * PRODUCTION swap (documented in README):
 *   Auth → Supabase Auth or Firebase Auth
 *   IAP  → RevenueCat entitlement `genesis_pro` (lifetime / yearly / monthly)
 */

import { UNLOCK_PRICE_USD, UNLOCK_PRODUCT_ID } from '@/billing/types';

export { UNLOCK_PRICE_USD, UNLOCK_PRODUCT_ID };
export const FREE_THEATER_LIMIT = 2;

export type AccountUser = {
  id: string;
  email: string;
  createdAt: string;
};

export type Entitlement = {
  /** Theater IDs counted against the free allowance (replay allowed). */
  freeTheaterIds: string[];
  /** Genesis Pro (`genesis_pro`) unlocked all remaining theaters. */
  unlockAll: boolean;
  /** ISO time of mock/sandbox purchase, if any */
  unlockedAt?: string;
  /** Always true in this build's mock commerce path */
  sandbox: boolean;
};

export type Session = {
  user: AccountUser;
  entitlement: Entitlement;
  /** Mock session token — replace with real JWT in production */
  token: string;
};

export function emptyEntitlement(): Entitlement {
  return { freeTheaterIds: [], unlockAll: false, sandbox: true };
}

export function canAccessTheater(entitlement: Entitlement, theaterId: string): boolean {
  if (entitlement.unlockAll) return true;
  if (entitlement.freeTheaterIds.includes(theaterId)) return true;
  return entitlement.freeTheaterIds.length < FREE_THEATER_LIMIT;
}

export function isTheaterLocked(entitlement: Entitlement, theaterId: string): boolean {
  return !canAccessTheater(entitlement, theaterId);
}

export function freeSlotsRemaining(entitlement: Entitlement): number {
  if (entitlement.unlockAll) return Infinity;
  return Math.max(0, FREE_THEATER_LIMIT - entitlement.freeTheaterIds.length);
}

/** Simple non-crypto hash for mock password storage (not for production). */
export function mockHash(password: string, salt: string): string {
  let h = 2166136261;
  const s = `${salt}:${password}`;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `mock$${salt}$${(h >>> 0).toString(16)}`;
}
