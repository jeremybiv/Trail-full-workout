import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { ProfilePrefs } from '../hooks/useProfile';
import { COLORS, FONTS, RADIUS } from '../theme/tokens';

interface Props {
  prefs: ProfilePrefs;
  streak: number;
  totalSessions: number;
  onUpdate: (patch: Partial<ProfilePrefs>) => void;
  onClose: () => void;
}

const DAYS_OPTIONS = [1, 2, 3, 4, 5, 6, 7];

// NOTE: the web version's notification section (toggle + reminder time, backed
// by Web Push + a Cloudflare Worker) needs expo-notifications and a rework of
// the push backend for Expo's token format — that's Phase 5. This just shows
// a placeholder for now instead of a toggle that can't actually do anything.
export function ProfileModal({ prefs, streak, totalSessions, onUpdate, onClose }: Props) {
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
              <Text style={styles.hint}>Bientôt disponible.</Text>
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
});
