import React from 'react';
import { ScrollView, View, Text, Switch, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useHabitStore } from '@/src/stores/habitStore';
import { signOut, getCurrentUser } from '@/src/services/auth';
import { scheduleAllNotifications } from '@/src/services/notifications';
import { PRAYER_KEYS, PRAYER_LABELS, PrayerKey } from '@/src/utils/constants';
import { Colors, Spacing, BorderRadius, FontSize, Shadow } from '@/src/theme';

function cycleTime(current: string, forward: boolean): string {
  const [h, m] = current.split(':').map(Number);
  let totalMins = h * 60 + m + (forward ? 30 : -30);
  if (totalMins < 0) totalMins = 24 * 60 - 30;
  if (totalMins >= 24 * 60) totalMins = 0;
  const newH = Math.floor(totalMins / 60);
  const newM = totalMins % 60;
  return `${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}`;
}

export default function SettingsScreen() {
  const settings = useHabitStore((s) => s.notificationSettings);
  const updateSettings = useHabitStore((s) => s.updateNotificationSettings);
  const user = getCurrentUser();

  const handleToggle = (key: string, value: boolean) => {
    const updated = { ...settings, [key]: value };
    updateSettings({ [key]: value });
    scheduleAllNotifications(updated).catch(console.error);
  };

  const handleTimeChange = (key: string, forward: boolean) => {
    if (key.startsWith('prayer_')) {
      const prayer = key.replace('prayer_', '') as PrayerKey;
      const newTime = cycleTime(settings.prayerTimes[prayer], forward);
      const newPrayerTimes = { ...settings.prayerTimes, [prayer]: newTime };
      const updated = { ...settings, prayerTimes: newPrayerTimes };
      updateSettings({ prayerTimes: newPrayerTimes });
      scheduleAllNotifications(updated).catch(console.error);
    } else {
      const currentTime = (settings as any)[key] || '12:00';
      const newTime = cycleTime(currentTime, forward);
      const updated = { ...settings, [key]: newTime };
      updateSettings({ [key]: newTime });
      scheduleAllNotifications(updated).catch(console.error);
    }
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Account</Text>
        <View style={styles.row}>
          <Ionicons name="person-circle-outline" size={24} color={Colors.primary} />
          <Text style={styles.rowLabel}>{user?.email || 'Not signed in'}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Notifications</Text>
        <View style={styles.switchRow}>
          <Text style={styles.rowLabel}>Enable Notifications</Text>
          <Switch
            value={settings.enabled}
            onValueChange={(v) => handleToggle('enabled', v)}
            trackColor={{ true: Colors.primaryLight }}
            thumbColor={settings.enabled ? Colors.primary : '#ccc'}
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.rowLabel}>Morning Reminder</Text>
          <Switch
            value={settings.morningReminder}
            onValueChange={(v) => handleToggle('morningReminder', v)}
            trackColor={{ true: Colors.primaryLight }}
            thumbColor={settings.morningReminder ? Colors.primary : '#ccc'}
          />
        </View>
        {settings.morningReminder && (
          <TimeRow
            label="Morning Time"
            value={settings.morningReminderTime}
            onBack={() => handleTimeChange('morningReminderTime', false)}
            onForward={() => handleTimeChange('morningReminderTime', true)}
          />
        )}

        <View style={styles.switchRow}>
          <Text style={styles.rowLabel}>Prayer Reminders</Text>
          <Switch
            value={settings.prayerReminders}
            onValueChange={(v) => handleToggle('prayerReminders', v)}
            trackColor={{ true: Colors.primaryLight }}
            thumbColor={settings.prayerReminders ? Colors.primary : '#ccc'}
          />
        </View>
        {settings.prayerReminders &&
          PRAYER_KEYS.map((key) => (
            <TimeRow
              key={key}
              label={PRAYER_LABELS[key]}
              value={settings.prayerTimes[key]}
              onBack={() => handleTimeChange(`prayer_${key}`, false)}
              onForward={() => handleTimeChange(`prayer_${key}`, true)}
            />
          ))}

        <View style={styles.switchRow}>
          <Text style={styles.rowLabel}>Gym Reminder</Text>
          <Switch
            value={settings.gymReminder}
            onValueChange={(v) => handleToggle('gymReminder', v)}
            trackColor={{ true: Colors.primaryLight }}
            thumbColor={settings.gymReminder ? Colors.primary : '#ccc'}
          />
        </View>
        {settings.gymReminder && (
          <TimeRow
            label="Gym Time"
            value={settings.gymReminderTime}
            onBack={() => handleTimeChange('gymReminderTime', false)}
            onForward={() => handleTimeChange('gymReminderTime', true)}
          />
        )}
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Ionicons name="log-out-outline" size={20} color={Colors.danger} />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      <View style={{ height: Spacing.xl * 2 }} />
    </ScrollView>
  );
}

function TimeRow({ label, value, onBack, onForward }: { label: string; value: string; onBack: () => void; onForward: () => void }) {
  return (
    <View style={styles.timeRow}>
      <Text style={styles.timeLabel}>{label}</Text>
      <View style={styles.timePicker}>
        <TouchableOpacity onPress={onBack} style={styles.timeBtn}>
          <Ionicons name="chevron-back" size={18} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.timeValue}>{value}</Text>
        <TouchableOpacity onPress={onForward} style={styles.timeBtn}>
          <Ionicons name="chevron-forward" size={18} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  rowLabel: {
    fontSize: FontSize.md,
    color: Colors.text,
    flex: 1,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingLeft: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  timeLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  timePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeBtn: {
    padding: 6,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primaryLight + '20',
  },
  timeValue: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.primary,
    backgroundColor: Colors.primaryLight + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
    minWidth: 50,
    textAlign: 'center',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.dangerLight,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.sm,
  },
  signOutText: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.danger,
  },
});
