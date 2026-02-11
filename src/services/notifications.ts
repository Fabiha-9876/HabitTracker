import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { NotificationSettings, PRAYER_LABELS, PrayerKey, PRAYER_KEYS } from '../utils/constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function requestPermissions(): Promise<boolean> {
  if (!Device.isDevice) {
    console.log('Notifications only work on physical devices');
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;

  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === 'granted';
}

function parseTime(time: string): { hour: number; minute: number } {
  const [h, m] = time.split(':').map(Number);
  return { hour: h, minute: m };
}

export async function scheduleAllNotifications(settings: NotificationSettings) {
  await Notifications.cancelAllScheduledNotificationsAsync();

  if (!settings.enabled) return;

  if (settings.morningReminder) {
    const { hour, minute } = parseTime(settings.morningReminderTime);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Morning Routine',
        body: 'Time for bran water, fenugreek water, and supplements!',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
  }

  if (settings.prayerReminders) {
    for (const key of PRAYER_KEYS) {
      const { hour, minute } = parseTime(settings.prayerTimes[key]);
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `${PRAYER_LABELS[key]} Prayer`,
          body: `It's time for ${PRAYER_LABELS[key]} prayer`,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour,
          minute,
        },
      });
    }
  }

  if (settings.gymReminder) {
    const { hour, minute } = parseTime(settings.gymReminderTime);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Gym Time',
        body: "Don't skip today's workout!",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });
  }
}
