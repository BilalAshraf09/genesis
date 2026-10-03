/**
 * Predatory FOMO / urgency loops — daily-seeded scarcity (not random spam).
 * Resets with Crisis day hash so freemium fairness isn't permanently broken.
 */

import type { HistoricalScenario } from '@/data/historical';
import {
  dayHash,
  daysBetween,
  hoursLeftInUtcDay,
  utcDayKey,
  type CrisisOfTheDay,
} from '@/retention/algo';
import type { RetentionState } from '@/retention/types';

export type FomoUrgency = {
  /** Crisis countdown line; red urgency when < 3h. */
  crisisCountdown: string;
  crisisUrgent: boolean;
  minutesLeft: number;
  hoursLeft: number;
  /** Limited desk seats for Crisis of Day (daily seed). */
  seatsLeft: number;
  seatsCopy: string;
  /** Soft unlock-all urgency when Crisis active + soft-walled. */
  unlockUrgency: string | null;
  /** Streak goes cold tonight. */
  streakColdTonight: boolean;
  streakColdCopy: string | null;
};

export function minutesLeftInUtcDay(now: Date = new Date()): number {
  const end = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
    0,
    0,
    0,
  );
  return Math.max(0, Math.ceil((end - now.getTime()) / 60_000));
}

/** Rotating scarcity copy — stable for the UTC day + hour bucket (not every second). */
const SEAT_LINES = [
  'LIMITED DESK SEATS',
  'CABINET SLOTS CLOSING',
  'OPS CHAIRS FILLING',
  'FLASH BRIEFING CAPACITY',
  'CRISIS WINDOW SEATS',
];

export function crisisSeatsLeft(day: string, now: Date = new Date()): number {
  const h = dayHash(`${day}:seats`);
  // 2–11 seats; drifts slightly by hour so urgency rises late day without RNG spam
  const hour = now.getUTCHours();
  const base = 2 + (h % 10);
  const burn = Math.floor(hour / 4); // 0..5 as day progresses
  return Math.max(1, base - burn);
}

export function crisisSeatsCopy(day: string, seats: number): string {
  const line = SEAT_LINES[dayHash(`${day}:seatline`) % SEAT_LINES.length]!;
  return `${line} · ${seats} LEFT TODAY`;
}

export function formatCrisisCountdown(minutesLeft: number): string {
  const h = Math.floor(minutesLeft / 60);
  const m = minutesLeft % 60;
  if (h <= 0) return `${m}m LEFT · WINDOW COLLAPSING`;
  if (h < 3) return `${h}h ${m.toString().padStart(2, '0')}m · SEAT EXPIRES`;
  return `${h}h ${m.toString().padStart(2, '0')}m UNTIL MIDNIGHT UTC`;
}

/**
 * Streak “goes cold tonight” if last play was yesterday and hours-to-midnight low.
 */
export function streakColdTonight(
  state: RetentionState,
  now: Date = new Date(),
): { cold: boolean; copy: string | null } {
  const today = utcDayKey(now);
  if (!state.lastPlayDay || state.currentStreak < 1) {
    return { cold: false, copy: null };
  }
  const gap = daysBetween(state.lastPlayDay, today);
  if (gap !== 1) return { cold: false, copy: null };
  const hours = hoursLeftInUtcDay(now);
  if (hours > 6) {
    return {
      cold: false,
      copy: `${state.currentStreak}-day streak · redeploy before midnight or it goes cold`,
    };
  }
  return {
    cold: true,
    copy: `STREAK GOES COLD TONIGHT · ${hours}h left · ${state.currentStreak}-day desk at risk`,
  };
}

export function buildFomoUrgency(opts: {
  crisis: CrisisOfTheDay | null;
  state: RetentionState;
  softWalled: boolean;
  now?: Date;
}): FomoUrgency {
  const now = opts.now ?? new Date();
  const minutesLeft = minutesLeftInUtcDay(now);
  const hoursLeft = hoursLeftInUtcDay(now);
  const day = opts.crisis?.day ?? utcDayKey(now);
  const seats = crisisSeatsLeft(day, now);
  const seatsCopy = crisisSeatsCopy(day, seats);
  const crisisUrgent = minutesLeft < 180;
  const crisisCountdown = formatCrisisCountdown(minutesLeft);
  const cold = streakColdTonight(opts.state, now);

  let unlockUrgency: string | null = null;
  if (opts.softWalled && opts.crisis) {
    unlockUrgency = crisisUrgent
      ? `Crisis bonus expires with the day — unlock before the window closes (${crisisCountdown})`
      : `Crisis of the Day active · unlock-all before the ×${opts.crisis.multiplier.toFixed(2)} window closes`;
  }

  return {
    crisisCountdown,
    crisisUrgent,
    minutesLeft,
    hoursLeft,
    seatsLeft: seats,
    seatsCopy,
    unlockUrgency,
    streakColdTonight: cold.cold,
    streakColdCopy: cold.copy,
  };
}

export function fomoTheaterTeaser(scenario: HistoricalScenario, seats: number): string {
  return `${scenario.title} · ${seats} desk seats left before midnight UTC`;
}
