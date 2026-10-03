import { Platform } from 'react-native';
import { MockBilling } from '@/billing/MockBilling';
import { PlayBilling } from '@/billing/PlayBilling';
import type { BillingProvider } from '@/billing/types';
import { playBillingReady } from '@/billing/types';

/**
 * Pick the platform-appropriate billing implementation.
 * Web / missing credentials → MockBilling so Try Live / CI never hard-requires Play.
 * Android / iOS with RevenueCat key → PlayBilling (`react-native-purchases` + UI).
 */
export function createBillingProvider(): BillingProvider {
  if ((Platform.OS === 'android' || Platform.OS === 'ios') && playBillingReady()) {
    return PlayBilling;
  }
  return MockBilling;
}
