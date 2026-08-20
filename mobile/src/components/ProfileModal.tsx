import { useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import type { ProfilePrefs } from '../hooks/useProfile';
import type { NotifPermission } from '../hooks/useNotifications';
import { COLORS, FONTS, RADIUS } from '../theme/tokens';

interface Props {
  prefs: ProfilePrefs;
  permission: NotifPermission;
  streak: number;
  totalSessions: number;
  onUpdate: (patch: Partial<ProfilePrefs>) => void;
  onRequestPermission: () => Promise<boolean>;
  onClose: () => void;
}

const DAYS_OPTIONS = [1, 2, 3, 4, 5, 6, 7];

function parseTime(reminderTime: string): Date {
  const [h, m] = reminderTime.split(':').map(Number);
  const d = new Date();
  d.setHours(h || 0, m || 0, 0, 0);
  return d;
}

export function ProfileModal({ prefs, permission, streak, totalSessions, onUpdate, onRequestPermission, onClose }: Props) {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const notifDenied = permission === 'denied';
  const notifOn = permission === 'granted' && prefs.notificationsEnabled;

  async function handleToggleNotif() {
    if (prefs.notificationsEnabled) {
      onUpdate({ notificationsEnabled: false });
      return;
    }
    if (permission !== 'granted') {
      const ok = await onRequestPermission();
      if (!ok) return;
    }
    onUpdate({ notificationsEnabled: true });
  }

  return (
    <Modal
      visible
      animationType="slide"
      transparent
      presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : undefined}
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <SafeAreaView edges={['bottom']}>
            <Pressable style={styles.closeBtn} onPress={onClose} hitSlop={8}>
              <Text style={styles.closeIcon}>✕</Text>
            </Pressable>
            <Text style={styles.title}>Mon profil</Text>

            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statVal}>🔥 {streak}</Text>
                <Text style={styles.statLbl}>Streak</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statVal}>{totalSessions}</Text>
                <Text style={styles.statLbl}>Séances</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Objectif par semaine</Text>
              <View style={styles.daysRow}>
                {DAYS_OPTIONS.map((d) => (
                  <Pressable
                    key={d}
                    onPress={() => onUpdate({ workoutsPerWeek: d })}
                    style={[styles.dayBtn, prefs.workoutsPerWeek === d && styles.dayBtnActive]}
                  >
                    <Text style={[styles.dayBtnText, prefs.workoutsPerWeek === d && styles.dayBtnTextActive]}>
                      {d}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <Text style={styles.hint}>{prefs.workoutsPerWeek}x / semaine</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Rappel d'entraînement</Text>

              {notifDenied ? (
                <Text style={styles.hintDenied}>
                  Notifications bloquées — active-les dans les réglages de ton téléphone pour cette app.
                </Text>
              ) : (
                <>
                  <View style={styles.notifRow}>
                    <Text style={styles.notifLabel}>{notifOn ? 'Activé' : 'Désactivé'}</Text>
                    <Switch
                      value={notifOn}
                      onValueChange={handleToggleNotif}
                      trackColor={{ false: COLORS.surf2, true: COLORS.blaze }}
                      thumbColor="#fff"
                    />
                  </View>

                  {notifOn && (
                    <Pressable style={styles.timeRow} onPress={() => setShowTimePicker(true)}>
                      <Text style={styles.label2}>Heure du rappel</Text>
                      <View style={styles.timeValue}>
                        <Text style={styles.timeValueText}>{prefs.reminderTime}</Text>
                      </View>
                    </Pressable>
                  )}

                  {showTimePicker && (
                    <DateTimePicker
                      value={parseTime(prefs.reminderTime)}
                      mode="time"
                      is24Hour
                      display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                      onChange={(event, date) => {
                        if (Platform.OS === 'android') setShowTimePicker(false);
                        if (event.type === 'set' && date) {
                          const hh = String(date.getHours()).padStart(2, '0');
                          const mm = String(date.getMinutes()).padStart(2, '0');
                          onUpdate({ reminderTime: `${hh}:${mm}` });
                        }
                      }}
                    />
                  )}
                </>
              )}
            </View>
          </SafeAreaView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.surf,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
    gap: 20,
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 16,
    zIndex: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.surf2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    color: COLORS.dim,
    fontSize: 13,
  },
  title: {
    fontFamily: FONTS.display,
    fontSize: 29,
    letterSpacing: 0.6,
    color: COLORS.ink,
    marginBottom: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.surf2,
    borderRadius: RADIUS.xl,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 4,
  },
  statVal: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.ink,
  },
  statLbl: {
    fontSize: 12,
    color: COLORS.dim,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  section: {
    gap: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.dim,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  daysRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.surf2,
    borderWidth: 2,
    borderColor: COLORS.surf2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayBtnActive: {
    backgroundColor: COLORS.blaze,
    borderColor: COLORS.blaze,
  },
  dayBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.dim,
  },
  dayBtnTextActive: {
    color: '#fff',
  },
  hint: {
    fontSize: 13,
    color: COLORS.dim,
  },
  hintDenied: {
    fontSize: 13,
    color: '#e05252',
    lineHeight: 19,
  },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notifLabel: {
    fontSize: 15,
    color: COLORS.ink,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label2: {
    fontSize: 13,
    color: COLORS.dim,
  },
  timeValue: {
    backgroundColor: COLORS.surf2,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  timeValueText: {
    fontSize: 15,
    color: COLORS.ink,
  },
});
