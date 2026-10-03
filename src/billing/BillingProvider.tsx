import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Platform } from 'react-native';
import { useAccount } from '@/account/AccountProvider';
import { createBillingProvider } from '@/billing/createBilling';
import {
  addCustomerInfoListener,
  configureRevenueCat,
  hasGenesisPro,
} from '@/billing/revenueCat';
import type { BillingProvider } from '@/billing/types';
import { playBillingReady } from '@/billing/types';

type BillingApi = BillingProvider & {
  /** True after first configure attempt (or skipped on mock/web). */
  ready: boolean;
  /** Last known genesis_pro from CustomerInfo (native + key only). */
  rcProActive: boolean | null;
};

const BillingCtx = createContext<BillingApi | null>(null);

export function BillingProviderHost({ children }: { children: ReactNode }) {
  const account = useAccount();
  const provider = useMemo(() => createBillingProvider(), []);
  const [ready, setReady] = useState(provider.id === 'mock');
  const [rcProActive, setRcProActive] = useState<boolean | null>(null);

  const syncFromInfo = useCallback(
    async (active: boolean) => {
      setRcProActive(active);
      if (!account.isAuthenticated) return;
      if (account.syncProEntitlement) {
        await account.syncProEntitlement({
          active,
          sandbox: false,
          source: 'play',
        });
      } else if (active && !account.entitlement.unlockAll) {
        await account.grantUnlockAll({ sandbox: false, source: 'play' });
      }
    },
    [account],
  );

  useEffect(() => {
    if (provider.id !== 'play' || !playBillingReady()) {
      setReady(true);
      return;
    }
    if (Platform.OS === 'web') {
      setReady(true);
      return;
    }

    let cancelled = false;
    let removeListener: (() => void) | undefined;

    (async () => {
      try {
        const appUserId = account.user?.id?.trim() || account.user?.email?.trim();
        await configureRevenueCat(appUserId);
        if (cancelled) return;

        removeListener = addCustomerInfoListener((info) => {
          void syncFromInfo(hasGenesisPro(info));
        });

        const result = await provider.syncCustomerInfo({
          email: account.user?.email,
          userId: account.user?.id,
          grantUnlockAll: account.grantUnlockAll,
          syncProEntitlement: account.syncProEntitlement,
          hasUnlockAll: () => account.entitlement.unlockAll,
        });
        if (!cancelled) {
          setRcProActive(result.active);
        }
      } catch {
        // Missing native module / misconfig — leave mock entitlement path.
      } finally {
        if (!cancelled) setReady(true);
      }
    })();

    return () => {
      cancelled = true;
      removeListener?.();
    };
    // Re-run when signed-in identity changes so we logIn + resync.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider, account.user?.id, account.user?.email, account.isAuthenticated]);

  const value = useMemo<BillingApi>(
    () => ({
      ...provider,
      ready,
      rcProActive,
    }),
    [provider, ready, rcProActive],
  );

  return <BillingCtx.Provider value={value}>{children}</BillingCtx.Provider>;
}

export function useBilling(): BillingApi {
  const ctx = useContext(BillingCtx);
  if (!ctx) throw new Error('useBilling must be used within BillingProviderHost');
  return ctx;
}
