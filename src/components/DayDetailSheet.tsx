import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { DailyHabits, PRAYER_KEYS, PRAYER_LABELS, TOTAL_HABITS } from '../utils/constants';
import { Colors, Spacing, BorderRadius, FontSize, Shadow } from '../theme';

interface Props {
  visible: boolean;
  date: string;
  habits: DailyHabits;
  onClose: () => void;
}

function CheckRow({ label, done }: { label: string; done: boolean }) {
  return (
    <View style={styles.checkRow}>
      <Ionicons
        name={done ? 'checkmark-circle' : 'ellipse-outline'}
        size={22}
        color={done ? Colors.success : Colors.textMuted}
      />
      <Text style={[styles.checkLabel, done && styles.checkDone]}>{label}</Text>
    </View>
  );
}

export function DayDetailSheet({ visible, date, habits, onClose }: Props) {
  const prayers = habits.prayers || { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false };
  const pct = Math.round(((habits.completedCount || 0) / TOTAL_HABITS) * 100);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={styles.date}>{format(parseISO(date), 'EEEE, MMM d, yyyy')}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-circle" size={28} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={styles.pctRow}>
            <Text style={styles.pctText}>{pct}%</Text>
            <Text style={styles.pctLabel}>
              {habits.completedCount}/{TOTAL_HABITS} completed
            </Text>
          </View>

          <ScrollView>
            <Text style={styles.sectionTitle}>Morning Routine</Text>
            <CheckRow label="Bran Water" done={habits.branWater} />
            <CheckRow label="Fenugreek Water" done={habits.fenugreekWater} />
            <CheckRow label="Supplements" done={habits.supplements} />

            <Text style={styles.sectionTitle}>Daily Prayers</Text>
            {PRAYER_KEYS.map((p) => (
              <CheckRow key={p} label={PRAYER_LABELS[p]} done={!!prayers[p]} />
            ))}

            <Text style={styles.sectionTitle}>Health & Growth</Text>
            <CheckRow label="Gym" done={habits.gym} />
            <CheckRow label="Fruits" done={habits.fruits} />
            <View style={styles.checkRow}>
              <Ionicons
                name={habits.studyHours > 0 ? 'checkmark-circle' : 'ellipse-outline'}
                size={22}
                color={habits.studyHours > 0 ? Colors.success : Colors.textMuted}
              />
              <Text style={[styles.checkLabel, habits.studyHours > 0 && styles.checkDone]}>
                Study: {habits.studyHours} hrs
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    padding: Spacing.lg,
    maxHeight: '80%',
    ...Shadow.lg,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  date: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  pctRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  pctText: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.primary,
  },
  pctLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs + 2,
  },
  checkLabel: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
  },
  checkDone: {
    color: Colors.text,
    fontWeight: '500',
  },
});
