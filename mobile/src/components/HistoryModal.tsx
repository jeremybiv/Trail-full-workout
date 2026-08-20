import { StyleSheet, Text, View } from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Sheet } from './Sheet';
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
    <Sheet onClose={onClose} snapPoints={['55%', '90%']}>
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
        <BottomSheetScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {records.map((r) => (
            <View key={r.ts} style={styles.row}>
              <Text style={styles.rowDate}>{fmtDate(r.date)}</Text>
              <Text style={styles.rowTag}>{r.focus === 'upper' ? '💪' : '🦵'} {r.rounds}×</Text>
              <Text style={styles.rowDur}>{fmt(r.elapsed)}</Text>
            </View>
          ))}
        </BottomSheetScrollView>
      )}
    </Sheet>
  );
}

const styles = StyleSheet.create({
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
    flex: 1,
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
