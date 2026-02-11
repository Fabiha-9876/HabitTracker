import React from 'react';
import { ScrollView, View, Text, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHabitStore } from '@/src/stores/habitStore';
import {
  getCurrentStreak,
  getLongestStreak,
  getHabitStreak,
  getWeeklyData,
  getMonthlyCompletionRate,
  getTotalStudyHours,
} from '@/src/utils/streaks';
import { PRAYER_KEYS, PRAYER_LABELS, TOTAL_HABITS } from '@/src/utils/constants';
import { Colors, Spacing, BorderRadius, FontSize, Shadow } from '@/src/theme';

const screenWidth = Dimensions.get('window').width;

function StatBox({ label, value, icon, color }: { label: string; value: string | number; icon: string; color: string }) {
  return (
    <View style={[styles.statBox, { borderLeftColor: color }]}>
      <Ionicons name={icon as any} size={24} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function HabitStreakRow({ label, streak }: { label: string; streak: number }) {
  return (
    <View style={styles.streakRow}>
      <Text style={styles.streakLabel}>{label}</Text>
      <View style={styles.streakBadge}>
        <Ionicons name="flame" size={14} color={Colors.orange} />
        <Text style={styles.streakCount}>{streak}</Text>
      </View>
    </View>
  );
}

function WeeklyChart({ data, labels }: { data: number[]; labels: string[] }) {
  const maxVal = Math.max(...data, 1);
  const barWidth = (screenWidth - Spacing.md * 6) / 7;

  return (
    <View style={styles.chartContainer}>
      <View style={styles.barsRow}>
        {data.map((val, i) => (
          <View key={labels[i]} style={styles.barCol}>
            <Text style={styles.barValue}>{val}</Text>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  {
                    height: `${Math.max((val / maxVal) * 100, 2)}%`,
                    backgroundColor: val > 0 ? Colors.primary : Colors.border,
                  },
                ]}
              />
            </View>
            <Text style={styles.barLabel}>{labels[i]}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function StatsScreen() {
  const habits = useHabitStore((s) => s.habits);
  const now = new Date();

  const currentStreak = getCurrentStreak(habits);
  const longestStreak = getLongestStreak(habits);
  const weeklyData = getWeeklyData(habits);
  const monthlyRate = getMonthlyCompletionRate(habits, now.getFullYear(), now.getMonth());
  const totalStudy = getTotalStudyHours(habits);
  const totalDays = Object.keys(habits).length;

  const habitStreaks = [
    { label: 'Bran Water', key: 'branWater' },
    { label: 'Fenugreek Water', key: 'fenugreekWater' },
    { label: 'Supplements', key: 'supplements' },
    ...PRAYER_KEYS.map((k) => ({ label: PRAYER_LABELS[k], key: k })),
    { label: 'Gym', key: 'gym' },
    { label: 'Fruits', key: 'fruits' },
    { label: 'Study', key: 'studyHours' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.statGrid}>
        <StatBox label="Current Streak" value={currentStreak} icon="flame" color={Colors.orange} />
        <StatBox label="Longest Streak" value={longestStreak} icon="trophy" color={Colors.warning} />
        <StatBox label="Monthly Rate" value={`${monthlyRate}%`} icon="pie-chart" color={Colors.primary} />
        <StatBox label="Total Study" value={`${totalStudy}h`} icon="book" color={Colors.success} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>This Week</Text>
        <WeeklyChart data={weeklyData.data} labels={weeklyData.labels} />
        <Text style={styles.chartSubtitle}>Habits completed per day (out of {TOTAL_HABITS})</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Per-Habit Streaks</Text>
        {habitStreaks.map(({ label, key }) => (
          <HabitStreakRow key={key} label={label} streak={getHabitStreak(habits, key)} />
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Days tracked</Text>
          <Text style={styles.summaryValue}>{totalDays}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Total study hours</Text>
          <Text style={styles.summaryValue}>{totalStudy}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>This month completion</Text>
          <Text style={styles.summaryValue}>{monthlyRate}%</Text>
        </View>
      </View>

      <View style={{ height: Spacing.xl * 2 }} />
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
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  statBox: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    alignItems: 'center',
    borderLeftWidth: 4,
    ...Shadow.sm,
  },
  statValue: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.text,
    marginTop: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.md,
  },
  cardTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  chartContainer: {
    paddingVertical: Spacing.sm,
  },
  barsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
  },
  barValue: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  barTrack: {
    width: 28,
    height: 120,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 6,
  },
  barLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 4,
  },
  chartSubtitle: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  streakRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  streakLabel: {
    fontSize: FontSize.md,
    color: Colors.text,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.orangeLight,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  streakCount: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.orange,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  summaryLabel: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.text,
  },
});
