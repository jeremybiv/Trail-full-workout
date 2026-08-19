import { Dimensions, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fmt } from '../lib/format';
import { WDAYS, MONTHS } from '../data/constants';
import type { WorkoutRecord } from '../hooks/useWorkoutHistory';
import { COLORS, FONTS, RADIUS } from '../theme/tokens';

interface Props {
  records: WorkoutRecord[];
  streak: number;
  bestStreak: number;
  totalSessions: number;
  totalMinutes: number;
  onClose: () => void;
}

function fmtDate(date: string): string {
  const [, m, d] = date.split('-').map(Number);
  const day = new Date(date + 'T12:00:00').getDay();
  return `${WDAYS[day]} ${d} ${MONTHS[m - 1]}`;
}

export function HistoryModal({ records, streak, bestStreak, totalSessions, totalMinutes, onClose }: Props) {
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
            <Text style={styles.title}>Mon historique</Text>

            <View style={styles.statsGrid}>
              <View style={styles.statBox}>
                <Text style={styles.statVal}>🔥 {streak}</Text>
                <Text style={styles.statLbl}>Streak actuel</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statVal}>⭐ {bestStreak}</Text>
                <Text style={styles.statLbl}>Meilleur streak</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statVal}>{totalSessions}</Text>
                <Text style={styles.statLbl}>Séances</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statVal}>{totalMinutes}</Text>
                <Text style={styles.statLbl}>Minutes</Text>
              </View>
            </View>

            {records.length === 0 ? (
              <Text style={styles.empty}>Aucune séance enregistrée.</Text>
            ) : (
              <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
                {records.map((r) => (
                  <View key={r.ts} style={styles.row}>
                    <Text style={styles.rowDate}>{fmtDate(r.date)}</Text>
                    <Text style={styles.rowTag}>{r.focus === 'upper' ? '💪' : '🦵'} {r.rounds}×</Text>
                    <Text style={styles.rowDur}>{fmt(r.elapsed)}</Text>
                  </View>
                ))}
              </ScrollView>
            )}
          </SafeAreaView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const SCREEN_H = Dimensions.get('window').height;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: SCREEN_H * 0.85,
    backgroundColor: COLORS.surf,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 28,
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
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  statBox: {
    width: '48%',
    backgroundColor: COLORS.surf2,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: RADIUS.md,
    padding: 14,
    alignItems: 'center',
  },
  statVal: {
    fontFamily: FONTS.display,
    fontSize: 28,
    color: COLORS.ink,
  },
  statLbl: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: COLORS.dim,
    marginTop: 3,
  },
  empty: {
    textAlign: 'center',
    color: COLORS.dim,
    fontSize: 14,
    paddingVertical: 24,
  },
  list: {
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.surf,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 6,
  },
  rowDate: {
    flex: 1,
    fontSize: 13,
    color: COLORS.dim,
  },
  rowTag: {
    fontSize: 13,
    color: COLORS.ink,
    fontWeight: '600',
  },
  rowDur: {
    fontSize: 13,
    color: COLORS.gold,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
});
