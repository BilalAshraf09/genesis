import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { persistDelete, persistGet, persistSet } from '@/account/persist';
import {
  FREE_THEATER_LIMIT,
  UNLOCK_PRICE_USD,
  UNLOCK_PRODUCT_ID,
  canAccessTheater,
  emptyEntitlement,
  freeSlotsRemaining,
  isTheaterLocked,
  mockHash,
  type AccountUser,
  type Entitlement,
  type Session,
} from '@/account/types';
import type { BillingProviderId } from '@/billing/types';

const SESSION_KEY = 'genesis.session.v1';
const USERS_KEY = 'genesis.users.v1';

type StoredUser = AccountUser & { passwordHash: string; entitlement: Entitlement };

type AccountApi = {
  ready: boolean;
  session: Session | null;
  user: AccountUser | null;
  entitlement: Entitlement;
  isAuthenticated: boolean;
  freeLimit: number;
  unlockPriceUsd: number;
  productId: string;
  freeSlotsLeft: number;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  canPlay: (theaterId: string) => boolean;
  isLocked: (theaterId: string) => boolean;
  /** Call when user starts a theater they are entitled to (consumes free slot if new). */
  markTheaterPlayed: (theaterId: string) => Promise<void>;
  /** Persist unlockAll after mock / Play success. */
  grantUnlockAll: (opts: { sandbox: boolean; source: BillingProviderId }) => Promise<void>;
  /** Sync unlockAll from RevenueCat `genesis_pro` (may clear when subscription lapses). */
  syncProEntitlement: (opts: {
    active: boolean;
    sandbox: boolean;
    source: BillingProviderId;
  }) => Promise<void>;
  /** @deprecated prefer useBilling().purchaseUnlockAll — kept for older call sites */
  purchaseUnlockAllSandbox: () => Promise<{ ok: true; sandbox: true }>;
  restorePurchasesSandbox: () => Promise<{ restored: boolean; sandbox: true }>;
};

const AccountContext = createContext<AccountApi | null>(null);

async function loadUsers(): Promise<Record<string, StoredUser>> {
  const raw = await persistGet(USERS_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, StoredUser>;
  } catch {
    return {};
  }
}

async function saveUsers(users: Record<string, StoredUser>) {
  await persistSet(USERS_KEY, JSON.stringify(users));
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function AccountProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const raw = await persistGet(SESSION_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Session;
          if (parsed?.user?.email && parsed.entitlement) {
            setSession(parsed);
          }
        }
      } catch {
        // ignore corrupt session
      } finally {
        setReady(true);
      }
    })();
  }, []);

  const persistSession = useCallback(async (next: Session | null) => {
    setSession(next);
    if (!next) {
      await persistDelete(SESSION_KEY);
      return;
    }
    await persistSet(SESSION_KEY, JSON.stringify(next));
    const users = await loadUsers();
    const key = normalizeEmail(next.user.email);
    if (users[key]) {
      users[key] = { ...users[key], entitlement: next.entitlement };
      await saveUsers(users);
    }
  }, []);

  const signup = useCallback(
    async (email: string, password: string) => {
      const e = normalizeEmail(email);
      if (!e.includes('@') || password.length < 6) {
        throw new Error('Use a valid email and password (6+ characters).');
      }
      const users = await loadUsers();
      if (users[e]) throw new Error('Account already exists. Sign in instead.');
      const salt = Math.random().toString(36).slice(2, 10);
      const user: AccountUser = {
        id: `usr_${Date.now().toString(36)}`,
        email: e,
        createdAt: new Date().toISOString(),
      };
      const entitlement = emptyEntitlement();
      users[e] = { ...user, passwordHash: mockHash(password, salt), entitlement };
      await saveUsers(users);
      const next: Session = {
        user,
        entitlement,
        token: `mock.${user.id}.${Date.now()}`,
      };
      await persistSession(next);
    },
    [persistSession],
  );

  const login = useCallback(
    async (email: string, password: string) => {
      const e = normalizeEmail(email);
      const users = await loadUsers();
      const row = users[e];
      if (!row) throw new Error('No account for that email. Sign up first.');
      const salt = row.passwordHash.split('$')[1] ?? '';
      if (row.passwordHash !== mockHash(password, salt)) {
        throw new Error('Incorrect password.');
      }
      const next: Session = {
        user: { id: row.id, email: row.email, createdAt: row.createdAt },
        entitlement: row.entitlement ?? emptyEntitlement(),
        token: `mock.${row.id}.${Date.now()}`,
      };
      await persistSession(next);
    },
    [persistSession],
  );

  const logout = useCallback(async () => {
    await persistSession(null);
  }, [persistSession]);

  const entitlement = session?.entitlement ?? emptyEntitlement();

  const markTheaterPlayed = useCallback(
    async (theaterId: string) => {
      if (!session) return;
      const ent = session.entitlement;
      if (ent.unlockAll || ent.freeTheaterIds.includes(theaterId)) return;
      if (ent.freeTheaterIds.length >= FREE_THEATER_LIMIT) return;
      const nextEnt: Entitlement = {
        ...ent,
        freeTheaterIds: [...ent.freeTheaterIds, theaterId],
        sandbox: true,
      };
      await persistSession({ ...session, entitlement: nextEnt });
    },
    [session, persistSession],
  );

  const grantUnlockAll = useCallback(
    async (opts: { sandbox: boolean; source: BillingProviderId }) => {
      if (!session) throw new Error('Sign in to purchase.');
      const nextEnt: Entitlement = {
        ...session.entitlement,
        unlockAll: true,
        unlockedAt: new Date().toISOString(),
        sandbox: opts.sandbox,
      };
      await persistSession({ ...session, entitlement: nextEnt });
    },
    [session, persistSession],
  );

  const syncProEntitlement = useCallback(
    async (opts: { active: boolean; sandbox: boolean; source: BillingProviderId }) => {
      if (!session) return;
      const ent = session.entitlement;
      // Do not wipe a local sandbox unlock when RC reports inactive (web / mock demos).
      if (!opts.active && ent.sandbox && opts.source === 'play') {
        return;
      }
      if (ent.unlockAll === opts.active && (opts.active ? ent.sandbox === opts.sandbox : true)) {
        return;
      }
      const nextEnt: Entitlement = {
        ...ent,
        unlockAll: opts.active,
        unlockedAt: opts.active ? ent.unlockedAt ?? new Date().toISOString() : undefined,
        sandbox: opts.active ? opts.sandbox : ent.sandbox,
      };
      await persistSession({ ...session, entitlement: nextEnt });
    },
    [session, persistSession],
  );

  const purchaseUnlockAllSandbox = useCallback(async () => {
    // MOCK / SANDBOX — no real charge. Prefer useBilling().purchaseUnlockAll.
    await new Promise((r) => setTimeout(r, 600));
    await grantUnlockAll({ sandbox: true, source: 'mock' });
    return { ok: true as const, sandbox: true as const };
  }, [grantUnlockAll]);

  const restorePurchasesSandbox = useCallback(async () => {
    if (!session) return { restored: false, sandbox: true as const };
    const users = await loadUsers();
    const row = users[normalizeEmail(session.user.email)];
    if (row?.entitlement?.unlockAll) {
      await persistSession({ ...session, entitlement: { ...row.entitlement } });
      return { restored: true, sandbox: true as const };
    }
    return { restored: !!session.entitlement.unlockAll, sandbox: true as const };
  }, [session, persistSession]);

  const value = useMemo<AccountApi>(
    () => ({
      ready,
      session,
      user: session?.user ?? null,
      entitlement,
      isAuthenticated: !!session,
      freeLimit: FREE_THEATER_LIMIT,
      unlockPriceUsd: UNLOCK_PRICE_USD,
      productId: UNLOCK_PRODUCT_ID,
      freeSlotsLeft: freeSlotsRemaining(entitlement),
      signup,
      login,
      logout,
      canPlay: (id) => (session ? canAccessTheater(entitlement, id) : false),
      isLocked: (id) => (session ? isTheaterLocked(entitlement, id) : true),
      markTheaterPlayed,
      grantUnlockAll,
      syncProEntitlement,
      purchaseUnlockAllSandbox,
      restorePurchasesSandbox,
    }),
    [
      ready,
      session,
      entitlement,
      signup,
      login,
      logout,
      markTheaterPlayed,
      grantUnlockAll,
      syncProEntitlement,
      purchaseUnlockAllSandbox,
      restorePurchasesSandbox,
    ],
  );

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error('useAccount must be used within AccountProvider');
  return ctx;
}
