import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { fmt } from '../../lib/format';
import { WDAYS, MONTHS } from '../../data/constants';
import type { Session } from '../../lib/session';
import type { WorkoutRecord } from '../../hooks/useWorkoutHistory';
import { COLORS, FONTS, RADIUS } from '../../theme/tokens';

interface Props {
  totalDur: number;
  session: Session | null;
  records: WorkoutRecord[];
  streak: number;
  bestStreak: number;
  totalSessions: number;
  onBack: () => void;
}

function fmtDate(date: string): string {
  const [, m, d] = date.split('-').map(Number);
  const day = new Date(date + 'T12:00:00').getDay();
  return `${WDAYS[day]} ${d} ${MONTHS[m - 1]}`;
}

function streakMessage(streak: number, totalSessions: number): { emoji: string; title: string; sub: string } {
  if (totalSessions === 1) return { emoji: '🎉', title: 'Première séance !', sub: "Le plus dur, c'est de commencer." };
  if (streak >= 30) return { emoji: '🏆', title: 'Légende du trail !', sub: `${streak} jours sans faillir.` };
  if (streak >= 14) return { emoji: '🔥', title: 'En feu !', sub: `${streak} jours d'affilée. Incroyable.` };
  if (streak >= 7) return { emoji: '💪', title: 'Une semaine pleine !', sub: `${streak} jours consécutifs.` };
  if (streak >= 3) return { emoji: '⚡', title: 'Belle série !', sub: `${streak} jours de suite.` };
  return { emoji: '🏔️', title: 'Sommet atteint !', sub: 'Continue comme ça.' };
}

export function DoneScreen({ totalDur, session, records, streak, bestStreak, totalSessions, onBack }: Props) {
  const seriesCount = (session?.duration === 'long' ? 4 : 2) * 8;
  const { emoji, title, sub } = streakMessage(streak, totalSessions);

  return (
    <SafeAreaView style={styles.done} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.hero}>
          <Text style={styles.emoji}>{emoji}</Text>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.sub}>{sub}</Text>
        </View>

        <View style={styles.stats}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{fmt(totalDur)}</Text>
            <Text style={styles.statLbl}>Durée</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{seriesCount}</Text>
            <Text style={styles.statLbl}>Séries</Text>
          </View>
          <View style={[styles.statBox, styles.statBoxAccent]}>
            <Text style={[styles.statVal, styles.statValAccent]}>🔥 {streak}</Text>
            <Text style={styles.statLbl}>Streak</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{totalSessions}</Text>
            <Text style={styles.statLbl}>Total séances</Text>
          </View>
        </View>

        {bestStreak > streak && (
          <Text style={styles.bestStreak}>Meilleur streak : {bestStreak} jours</Text>
        )}

        {records.length > 1 && (
          <View style={styles.historyList}>
            <Text style={styles.historyTitle}>Historique</Text>
            {records.slice(1).map((r) => (
              <View key={r.ts} style={styles.historyRow}>
                <Text style={styles.historyDate}>{fmtDate(r.date)}</Text>
                <Text style={styles.historyTag}>{r.focus === 'upper' ? '💪' : '🦵'} {r.rounds} rounds</Text>
                <Text style={styles.historyDur}>{fmt(r.elapsed)}</Text>
              </View>
            ))}
          </View>
        )}

        <Pressable style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>Retour à l'accueil</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  done: {
    flex: 1,
    backgroundColor: COLORS.playerBg,
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 24,
  },
  emoji: {
    fontSize: 56,
    marginBottom: 12,
  },
  title: {
    fontFamily: FONTS.display,
    fontSize: 34,
    letterSpacing: 0.6,
    color: COLORS.ink,
    marginBottom: 4,
    textAlign: 'center',
  },
  sub: {
    fontSize: 14,
    color: COLORS.dim,
    textAlign: 'center',
  },
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    width: '100%',
    maxWidth: 320,
    marginBottom: 24,
  },
  statBox: {
    width: '48%',
    backgroundColor: COLORS.surf,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: RADIUS.md,
    padding: 16,
    alignItems: 'center',
  },
  statBoxAccent: {
    borderColor: 'rgba(255, 140, 0, 0.4)',
    backgroundColor: 'rgba(255, 140, 0, 0.08)',
  },
  statVal: {
    fontFamily: FONTS.display,
    fontSize: 32,
    color: COLORS.ink,
  },
  statValAccent: {
    color: COLORS.streak,
  },
  statLbl: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: COLORS.dim,
    marginTop: 2,
  },
  bestStreak: {
    fontSize: 12,
    color: COLORS.dim,
    marginTop: -12,
    marginBottom: 20,
  },
  historyList: {
    width: '100%',
    maxWidth: 320,
    marginBottom: 20,
    gap: 6,
  },
  historyTitle: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: COLORS.dim,
    marginBottom: 4,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.surf,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  historyDate: {
    flex: 1,
    fontSize: 13,
    color: COLORS.dim,
  },
  historyTag: {
    fontSize: 13,
    color: COLORS.ink,
    fontWeight: '600',
  },
  historyDur: {
    fontSize: 13,
    color: COLORS.gold,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  backBtn: {
    width: '100%',
    maxWidth: 320,
    paddingVertical: 18,
    backgroundColor: COLORS.blaze,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
  },
  backBtnText: {
    color: COLORS.onBlaze,
    fontWeight: '800',
    fontSize: 18,
    letterSpacing: 0.4,
  },
});
