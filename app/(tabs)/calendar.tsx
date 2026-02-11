import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { format } from 'date-fns';
import { useHabitStore } from '@/src/stores/habitStore';
import { DayDetailSheet } from '@/src/components/DayDetailSheet';
import { TOTAL_HABITS, EMPTY_HABITS } from '@/src/utils/constants';
import { Colors, Spacing } from '@/src/theme';

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

export default function CalendarScreen() {
  const habits = useHabitStore((s) => s.habits);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};

    Object.entries(habits).forEach(([date, day]) => {
      if (!day) return;
      const pct = (day.completedCount || 0) / TOTAL_HABITS;
      let bg = Colors.dangerLight;
      if (pct >= 1) bg = Colors.successLight;
      else if (pct >= 0.75) bg = '#D1FAE5';
      else if (pct >= 0.5) bg = Colors.warningLight;
      else if (pct > 0) bg = Colors.orangeLight;

      marks[date] = {
        customStyles: {
          container: { backgroundColor: bg },
          text: { color: Colors.text },
        },
      };
    });

    const today = format(new Date(), 'yyyy-MM-dd');
    if (!marks[today]) {
      marks[today] = {
        customStyles: {
          container: { backgroundColor: Colors.primaryLight + '30' },
          text: { color: Colors.primary },
        },
      };
    }

    return marks;
  }, [habits]);

  const handleDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
  };

  return (
    <View style={styles.container}>
      <Calendar
        markingType="custom"
        markedDates={markedDates}
        onDayPress={handleDayPress}
        theme={{
          backgroundColor: Colors.background,
          calendarBackground: Colors.surface,
          textSectionTitleColor: Colors.textSecondary,
          todayTextColor: Colors.primary,
          dayTextColor: Colors.text,
          textDisabledColor: Colors.textMuted,
          arrowColor: Colors.primary,
          monthTextColor: Colors.text,
          textMonthFontWeight: '700',
          textDayFontSize: 16,
          textMonthFontSize: 18,
        }}
        style={styles.calendar}
      />

      <View style={styles.legend}>
        <LegendItem color={Colors.successLight} label="100%" />
        <LegendItem color="#D1FAE5" label="75%+" />
        <LegendItem color={Colors.warningLight} label="50%+" />
        <LegendItem color={Colors.orangeLight} label="<50%" />
      </View>

      {selectedDate && (
        <DayDetailSheet
          visible={!!selectedDate}
          date={selectedDate}
          habits={habits[selectedDate] || { ...EMPTY_HABITS }}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  calendar: {
    margin: Spacing.md,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
