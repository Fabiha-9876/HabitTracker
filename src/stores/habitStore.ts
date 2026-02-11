import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import {
  DailyHabits,
  EMPTY_HABITS,
  PrayerKey,
  countCompleted,
  NotificationSettings,
  DEFAULT_NOTIFICATION_SETTINGS,
} from '../utils/constants';
import { saveHabits as saveToFirestore, getHabits, getAllHabits } from '../services/habits';

interface HabitState {
  userId: string | null;
  habits: Record<string, DailyHabits>;
  notificationSettings: NotificationSettings;
  setUserId: (id: string | null) => void;
  getTodayHabits: () => DailyHabits;
  getHabitsForDate: (date: string) => DailyHabits;
  toggleHabit: (key: keyof Omit<DailyHabits, 'prayers' | 'studyHours' | 'completedCount' | 'updatedAt'>) => void;
  togglePrayer: (prayer: PrayerKey) => void;
  setStudyHours: (hours: number) => void;
  syncFromFirestore: () => Promise<void>;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
}

const getToday = () => format(new Date(), 'yyyy-MM-dd');

export const useHabitStore = create<HabitState>()(
  persist(
    (set, get) => ({
      userId: null,
      habits: {},
      notificationSettings: { ...DEFAULT_NOTIFICATION_SETTINGS },

      setUserId: (id) => set({ userId: id }),

      getTodayHabits: () => {
        const today = getToday();
        const h = get().habits[today];
        if (!h) return { ...EMPTY_HABITS, prayers: { ...EMPTY_HABITS.prayers } };
        return { ...h, prayers: { ...EMPTY_HABITS.prayers, ...h.prayers } };
      },

      getHabitsForDate: (date: string) => {
        const h = get().habits[date];
        if (!h) return { ...EMPTY_HABITS, prayers: { ...EMPTY_HABITS.prayers } };
        return { ...h, prayers: { ...EMPTY_HABITS.prayers, ...h.prayers } };
      },

      toggleHabit: (key) => {
        const today = getToday();
        const current = get().habits[today] || { ...EMPTY_HABITS };
        const updated = { ...current, [key]: !current[key as keyof DailyHabits] };
        updated.completedCount = countCompleted(updated as DailyHabits);
        updated.updatedAt = Date.now();

        set((state) => ({
          habits: { ...state.habits, [today]: updated as DailyHabits },
        }));

        const userId = get().userId;
        if (userId) {
          saveToFirestore(userId, today, updated as DailyHabits).catch(console.error);
        }
      },

      togglePrayer: (prayer) => {
        const today = getToday();
        const current = get().habits[today] || { ...EMPTY_HABITS };
        const updated = {
          ...current,
          prayers: {
            ...current.prayers,
            [prayer]: !current.prayers[prayer],
          },
        };
        updated.completedCount = countCompleted(updated);
        updated.updatedAt = Date.now();

        set((state) => ({
          habits: { ...state.habits, [today]: updated },
        }));

        const userId = get().userId;
        if (userId) {
          saveToFirestore(userId, today, updated).catch(console.error);
        }
      },

      setStudyHours: (hours) => {
        const today = getToday();
        const current = get().habits[today] || { ...EMPTY_HABITS };
        const updated = { ...current, studyHours: hours };
        updated.completedCount = countCompleted(updated);
        updated.updatedAt = Date.now();

        set((state) => ({
          habits: { ...state.habits, [today]: updated },
        }));

        const userId = get().userId;
        if (userId) {
          saveToFirestore(userId, today, updated).catch(console.error);
        }
      },

      syncFromFirestore: async () => {
        const userId = get().userId;
        if (!userId) return;
        try {
          const all = await getAllHabits(userId);
          set((state) => ({
            habits: { ...state.habits, ...all },
          }));
        } catch (e) {
          console.error('Sync failed:', e);
        }
      },

      updateNotificationSettings: (settings) => {
        set((state) => ({
          notificationSettings: { ...state.notificationSettings, ...settings },
        }));
      },
    }),
    {
      name: 'habit-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
