import { Platform } from 'react-native';
import type { ReminderStatus } from '@/retention/types';

const CRISIS_REMINDER_ID = 'genesis-crisis-daily';

export type ReminderResult = {
  status: ReminderStatus;
  detail?: string;
};

/**
 * Opt-in Crisis of the Day local reminder.
 * Mock-safe: web / denied / missing native module → quiet no-op, never throws.
 */
export async function enableCrisisReminder(): Promise<ReminderResult> {
  if (Platform.OS === 'web') {
    return {
      status: 'unsupported',
      detail: 'Local alerts need the Android / iOS build — web stays silent.',
    };
  }

  try {
    const Notifications = await import('expo-notifications');
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });

    const current = await Notifications.getPermissionsAsync();
    let granted =
      current.granted ||
      current.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;

    if (!granted) {
      const asked = await Notifications.requestPermissionsAsync();
      granted =
        asked.granted ||
        asked.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
    }

    if (!granted) {
      return {
        status: 'denied',
        detail: 'Permission denied — desk stays quiet. You can enable later in system settings.',
      };
    }

    await Notifications.cancelScheduledNotificationAsync(CRISIS_REMINDER_ID).catch(() => {});

    // One daily ping mid-morning local time — not spammy, not paywall-tied.
    await Notifications.scheduleNotificationAsync({
      identifier: CRISIS_REMINDER_ID,
      content: {
        title: 'GENESIS · Crisis window open',
        body: 'Today’s theater carries a ×1.15 cabinet bonus. Deploy before the day flips.',
        sound: false,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 10,
        minute: 0,
      },
    });

    return { status: 'on', detail: 'Daily Crisis alert armed for 10:00 local.' };
  } catch {
    return {
      status: 'unsupported',
      detail: 'Notifications unavailable in this build — preference saved as off.',
    };
  }
}

export async function disableCrisisReminder(): Promise<ReminderResult> {
  if (Platform.OS === 'web') {
    return { status: 'unset' };
  }
  try {
    const Notifications = await import('expo-notifications');
    await Notifications.cancelScheduledNotificationAsync(CRISIS_REMINDER_ID).catch(() => {});
  } catch {
    // ignore
  }
  return { status: 'unset' };
}
