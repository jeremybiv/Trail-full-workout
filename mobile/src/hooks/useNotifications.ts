import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import type { ProfilePrefs } from './useProfile';

// The web version uses Web Push + a Cloudflare Worker that evaluates, on an
// hourly cron, whether each device has met its weekly workout goal yet and
// only pushes a reminder if not. Reproducing that "goal-aware" suppression
// with on-device local notifications would mean rescheduling every day based
// on app opens (no background execution without a dev-client build) — not
// reliable enough to be worth it. Instead this schedules a single daily local
// notification at the chosen time, unconditionally, via expo-notifications —
// no backend involved at all. Revisit server-driven push only if the
// goal-aware behavior turns out to matter in practice.
export type NotifPermission = 'granted' | 'denied' | 'undetermined';

const REMINDER_ID = 'daily-workout-reminder';
const CHANNEL_ID = 'reminders';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function useNotifications(prefs: ProfilePrefs | null) {
  const [permission, setPermission] = useState<NotifPermission>('undetermined');

  useEffect(() => {
    void Notifications.getPermissionsAsync().then((r) => setPermission(r.status as NotifPermission));
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    void Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: "Rappels d'entraînement",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    const result = await Notifications.requestPermissionsAsync();
    setPermission(result.status as NotifPermission);
    return result.granted;
  }, []);

  // (Re)schedule or cancel the daily reminder whenever the relevant prefs change.
  useEffect(() => {
    if (!prefs) return;
    void (async () => {
      await Notifications.cancelScheduledNotificationAsync(REMINDER_ID).catch(() => {});
      if (!prefs.notificationsEnabled || permission !== 'granted') return;

      const [hour, minute] = prefs.reminderTime.split(':').map(Number);
      await Notifications.scheduleNotificationAsync({
        identifier: REMINDER_ID,
        content: {
          title: 'Renfo Trail',
          body: "C'est l'heure de ta séance de renfo 💪",
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour,
          minute,
          channelId: CHANNEL_ID,
        },
      });
    })();
  }, [prefs, permission]);

  return { permission, requestPermission };
}
