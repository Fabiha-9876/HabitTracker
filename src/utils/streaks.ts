import { format, subDays, parseISO, startOfWeek, addDays } from 'date-fns';
import { DailyHabits, TOTAL_HABITS, PrayerKey, PRAYER_KEYS } from './constants';

export function getCurrentStreak(habits: Record<string, DailyHabits>): number {
  let streak = 0;
  let date = new Date();

  while (true) {
    const key = format(date, 'yyyy-MM-dd');
    const day = habits[key];
    if (!day || day.completedCount < TOTAL_HABITS) break;
    streak++;
    date = subDays(date, 1);
  }
  return streak;
}

export function getLongestStreak(habits: Record<string, DailyHabits>): number {
  const dates = Object.keys(habits).sort();
  if (dates.length === 0) return 0;

  let longest = 0;
  let current = 0;

  for (let i = 0; i < dates.length; i++) {
    if (habits[dates[i]].completedCount >= TOTAL_HABITS) {
      current++;
      if (i > 0) {
        const prev = parseISO(dates[i - 1]);
        const curr = parseISO(dates[i]);
        const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
        if (diff > 1) current = 1;
      }
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }
  }
  return longest;
}

export function getHabitStreak(
  habits: Record<string, DailyHabits>,
  habitKey: string
): number {
  let streak = 0;
  let date = new Date();

  while (true) {
    const key = format(date, 'yyyy-MM-dd');
    const day = habits[key];
    if (!day) break;

    let completed = false;
    if (habitKey === 'studyHours') {
      completed = day.studyHours > 0;
    } else if (PRAYER_KEYS.includes(habitKey as PrayerKey)) {
      completed = day.prayers[habitKey as PrayerKey];
    } else {
      completed = !!(day as unknown as Record<string, unknown>)[habitKey];
    }

    if (!completed) break;
    streak++;
    date = subDays(date, 1);
  }
  return streak;
}

export function getWeeklyData(habits: Record<string, DailyHabits>) {
  const start = startOfWeek(new Date(), { weekStartsOn: 1 });
  const labels: string[] = [];
  const data: number[] = [];

  for (let i = 0; i < 7; i++) {
    const d = addDays(start, i);
    const key = format(d, 'yyyy-MM-dd');
    labels.push(format(d, 'EEE'));
    const day = habits[key];
    data.push(day ? day.completedCount : 0);
  }

  return { labels, data };
}

export function getMonthlyCompletionRate(
  habits: Record<string, DailyHabits>,
  year: number,
  month: number
): number {
  let totalPossible = 0;
  let totalDone = 0;

  Object.entries(habits).forEach(([dateStr, day]) => {
    const d = parseISO(dateStr);
    if (d.getFullYear() === year && d.getMonth() === month) {
      totalPossible += TOTAL_HABITS;
      totalDone += day.completedCount;
    }
  });

  return totalPossible > 0 ? Math.round((totalDone / totalPossible) * 100) : 0;
}

export function getTotalStudyHours(habits: Record<string, DailyHabits>): number {
  return Object.values(habits).reduce((sum, day) => sum + (day.studyHours || 0), 0);
}
