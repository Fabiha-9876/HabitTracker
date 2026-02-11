import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { format } from 'date-fns';
import { useHabitStore } from '@/src/stores/habitStore';
import { HabitCheckbox } from '@/src/components/HabitCheckbox';
import { HabitCard } from '@/src/components/HabitCard';
import { StudyHoursInput } from '@/src/components/StudyHoursInput';
import { ProgressBar } from '@/src/components/ProgressBar';
import { StreakBadge } from '@/src/components/StreakBadge';
import { PRAYER_KEYS, PRAYER_LABELS, EMPTY_HABITS, PrayerKey } from '@/src/utils/constants';
import { getCurrentStreak } from '@/src/utils/streaks';
import { Colors, Spacing, FontSize } from '@/src/theme';

export default function TodayScreen() {
  const today = format(new Date(), 'yyyy-MM-dd');
  const allHabits = useHabitStore((s) => s.habits);
  const toggleHabit = useHabitStore((s) => s.toggleHabit);
  const togglePrayer = useHabitStore((s) => s.togglePrayer);
  const setStudyHours = useHabitStore((s) => s.setStudyHours);

  const habits = useMemo(() => {
    const h = allHabits[today];
    if (!h) return { ...EMPTY_HABITS, prayers: { ...EMPTY_HABITS.prayers } };
    return {
      ...EMPTY_HABITS,
      ...h,
      prayers: { ...EMPTY_HABITS.prayers, ...(h.prayers || {}) },
    };
  }, [allHabits, today]);

  const streak = getCurrentStreak(allHabits);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.date}>{format(new Date(), 'EEEE, MMMM d')}</Text>

      <StreakBadge streak={streak} />
      <ProgressBar completed={habits.completedCount || 0} />

      <HabitCard title="Morning Routine" icon="sunny-outline">
        <HabitCheckbox
          label="Bran Water"
          checked={!!habits.branWater}
          onToggle={() => toggleHabit('branWater')}
          icon="water-outline"
        />
        <HabitCheckbox
          label="Fenugreek Water"
          checked={!!habits.fenugreekWater}
          onToggle={() => toggleHabit('fenugreekWater')}
          icon="leaf-outline"
        />
        <HabitCheckbox
          label="Supplements"
          checked={!!habits.supplements}
          onToggle={() => toggleHabit('supplements')}
          icon="medkit-outline"
        />
      </HabitCard>

      <HabitCard title="Daily Prayers" icon="moon-outline">
        {PRAYER_KEYS.map((key: PrayerKey) => (
          <HabitCheckbox
            key={key}
            label={PRAYER_LABELS[key]}
            checked={!!habits.prayers[key]}
            onToggle={() => togglePrayer(key)}
            icon="star-outline"
          />
        ))}
      </HabitCard>

      <HabitCard title="Health & Growth" icon="fitness-outline">
        <HabitCheckbox
          label="Gym"
          checked={!!habits.gym}
          onToggle={() => toggleHabit('gym')}
          icon="barbell-outline"
        />
        <HabitCheckbox
          label="Fruits"
          checked={!!habits.fruits}
          onToggle={() => toggleHabit('fruits')}
          icon="nutrition-outline"
        />
        <StudyHoursInput value={habits.studyHours || 0} onChange={setStudyHours} />
      </HabitCard>

      <View style={styles.bottom} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl * 2,
  },
  date: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  bottom: {
    height: Spacing.xl,
  },
});
