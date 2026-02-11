export const PRAYER_KEYS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'] as const;
export type PrayerKey = (typeof PRAYER_KEYS)[number];

export const PRAYER_LABELS: Record<PrayerKey, string> = {
  fajr: 'Fajr',
  dhuhr: 'Dhuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha',
};

export const DEFAULT_PRAYER_TIMES: Record<PrayerKey, string> = {
  fajr: '05:00',
  dhuhr: '12:30',
  asr: '15:30',
  maghrib: '18:00',
  isha: '20:00',
};

export interface DailyHabits {
  branWater: boolean;
  fenugreekWater: boolean;
  supplements: boolean;
  prayers: Record<PrayerKey, boolean>;
  gym: boolean;
  fruits: boolean;
  studyHours: number;
  completedCount: number;
  updatedAt: number;
}

export const EMPTY_HABITS: DailyHabits = {
  branWater: false,
  fenugreekWater: false,
  supplements: false,
  prayers: { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false },
  gym: false,
  fruits: false,
  studyHours: 0,
  completedCount: 0,
  updatedAt: Date.now(),
};

export const TOTAL_HABITS = 11; // 3 morning + 5 prayers + gym + fruits + study(1 if >0)

export function countCompleted(habits: DailyHabits): number {
  let count = 0;
  if (habits.branWater) count++;
  if (habits.fenugreekWater) count++;
  if (habits.supplements) count++;
  for (const key of PRAYER_KEYS) {
    if (habits.prayers[key]) count++;
  }
  if (habits.gym) count++;
  if (habits.fruits) count++;
  if (habits.studyHours > 0) count++;
  return count;
}

export interface NotificationSettings {
  enabled: boolean;
  prayerReminders: boolean;
  morningReminder: boolean;
  morningReminderTime: string; // HH:mm
  gymReminder: boolean;
  gymReminderTime: string;
  prayerTimes: Record<PrayerKey, string>; // HH:mm
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  enabled: true,
  prayerReminders: true,
  morningReminder: true,
  morningReminderTime: '06:00',
  gymReminder: true,
  gymReminderTime: '17:00',
  prayerTimes: { ...DEFAULT_PRAYER_TIMES },
};
