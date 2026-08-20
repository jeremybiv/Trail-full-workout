import { useCallback, useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Session, Difficulty } from '../../lib/session';
import type { Exercise } from '../../data/exercises';
import { ALL } from '../../data/exercises';
import { dateLabel } from '../../lib/format';
import { sg, ss } from '../../lib/storage';
import { ExerciseCard } from '../ExerciseCard';
import { ExerciseDetailModal } from '../ExerciseDetailModal';
import { COLORS, FONTS, RADIUS, SPACING } from '../../theme/tokens';

const LOWER_SERIES_UNLOCK_KEY = 'lowerSeriesUnlocked';
const LONG_PRESS_MS = 2000;

interface Props {
  session: Session | null;
  routeName: string;
  ready: boolean;
  onRegen: () => void;
  onStart: () => void;
  focus: 'upper' | 'lower';
  duration: 'short' | 'long';
  onFocusChange: (f: 'upper' | 'lower') => void;
  onDurationChange: (d: 'short' | 'long') => void;
  streak: number;
  onOpenHistory: () => void;
  onOpenProfile: () => void;
  difficulty: Difficulty;
  onDifficultyChange: (d: Difficulty) => void;
  onStartLowerSeries: () => void;
}

const DIFF_LABELS: Record<Difficulty, string> = {
  deb: '🟢 Débutant',
  int: '🔵 Intermédiaire',
  conf: '🔴 Confirmé',
};

export function HomeScreen({
  session, routeName, ready, onRegen, onStart,
  focus, duration, onFocusChange, onDurationChange,
  streak, onOpenHistory, onOpenProfile,
  difficulty, onDifficultyChange,
  onStartLowerSeries,
}: Props) {
  const exercises = session ? session.ids.map((id) => ALL[id]) : [];
  const [detailExercise, setDetailExercise] = useState<{ ex: Exercise; isLeg: boolean } | null>(null);
  const [lowerSeriesUnlocked, setLowerSeriesUnlocked] = useState(false);

  useEffect(() => {
    void sg<boolean>(LOWER_SERIES_UNLOCK_KEY).then((v) => {
      if (v) setLowerSeriesUnlocked(true);
    });
  }, []);

  const handleTitleLongPress = useCallback(() => {
    setLowerSeriesUnlocked(true);
    void ss(LOWER_SERIES_UNLOCK_KEY, true);
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.hdr}>
          <View style={styles.hdrTop}>
            <Text style={styles.eyebrow}>{dateLabel()}</Text>
            <View style={styles.hdrActions}>
              {streak > 0 && (
                <View style={styles.streakBadge}>
                  <Text style={styles.streakBadgeText}>🔥 {streak}</Text>
                </View>
              )}
              <Pressable style={styles.historyBtn} onPress={onOpenHistory} hitSlop={4}>
                <Text style={styles.historyBtnIcon}>📋</Text>
              </Pressable>
              <Pressable style={styles.profileBtn} onPress={onOpenProfile} hitSlop={4}>
                <Text style={styles.profileBtnIcon}>👤</Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.hdrRow}>
            <Pressable onLongPress={handleTitleLongPress} delayLongPress={LONG_PRESS_MS} style={styles.routeTouch}>
              <Text style={styles.route} numberOfLines={1}>{routeName || 'Renfo du jour'}</Text>
            </Pressable>
            <Pressable style={styles.regenBtn} onPress={onRegen} hitSlop={8}>
              <Text style={styles.regenIcon}>🎲</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.optRow}>
          <View style={styles.optGroup}>
            {(['upper', 'lower'] as const).map((f) => (
              <Pressable
                key={f}
                onPress={() => onFocusChange(f)}
                style={[styles.optPill, focus === f && styles.optPillActive]}
              >
                <Text style={[styles.optPillText, focus === f && styles.optPillTextActive]}>
                  {f === 'upper' ? '💪 Upper' : '🦵 Lower'}
                </Text>
              </Pressable>
            ))}
          </View>
          <View style={styles.optGroup}>
            {(['short', 'long'] as const).map((d) => (
              <Pressable
                key={d}
                onPress={() => onDurationChange(d)}
                style={[styles.optPill, duration === d && styles.optPillActive]}
              >
                <Text style={[styles.optPillText, duration === d && styles.optPillTextActive]}>
                  {d === 'short' ? '15 min' : '30 min'}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={[styles.optRow, styles.diffRow]}>
          {(['deb', 'int', 'conf'] as const).map((d) => (
            <Pressable
              key={d}
              onPress={() => onDifficultyChange(d)}
              style={[styles.optPill, styles.diffPill, difficulty === d && styles.optPillActive]}
            >
              <Text style={[styles.optPillText, styles.diffPillText, difficulty === d && styles.optPillTextActive]}>
                {DIFF_LABELS[d]}
              </Text>
            </Pressable>
          ))}
        </View>

        {lowerSeriesUnlocked && (
          <Pressable style={styles.lowerSeriesBtn} onPress={onStartLowerSeries}>
            <Text style={styles.lowerSeriesBtnText}>🦵 Série bas du corps (perso)</Text>
          </Pressable>
        )}

        <View style={styles.workoutMeta}>
          <View style={styles.metaPill}><Text style={styles.metaPillText}>{duration === 'short' ? '~14 min' : '~29 min'}</Text></View>
          <View style={styles.metaPill}><Text style={styles.metaPillText}>{duration === 'short' ? '2 rounds' : '4 rounds'}</Text></View>
          <View style={styles.metaPill}><Text style={styles.metaPillText}>8 exercices</Text></View>
        </View>

        <View style={styles.exList}>
          {exercises.map((ex) => {
            const isLeg = session ? session.legIds.includes(ex.id) : false;
            return (
              <ExerciseCard
                key={ex.id}
                exercise={ex}
                isLeg={isLeg}
                onPress={() => setDetailExercise({ ex, isLeg })}
              />
            );
          })}
        </View>

        <Pressable style={[styles.startBtn, !ready && styles.startBtnDisabled]} onPress={onStart} disabled={!ready}>
          <Text style={styles.startBtnText}>▶ START</Text>
        </Pressable>
      </ScrollView>

      {detailExercise && (
        <ExerciseDetailModal
          exercise={detailExercise.ex}
          isLeg={detailExercise.isLeg}
          onClose={() => setDetailExercise(null)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 24,
  },
  hdr: {
    marginBottom: 20,
  },
  hdrTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: COLORS.dim,
  },
  hdrActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  streakBadge: {
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: 'rgba(255, 140, 0, 0.3)',
    backgroundColor: 'rgba(255, 140, 0, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  streakBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.streak,
  },
  historyBtn: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surf,
    borderWidth: 1,
    borderColor: COLORS.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyBtnIcon: {
    fontSize: 18,
  },
  profileBtn: {
    padding: 4,
  },
  profileBtnIcon: {
    fontSize: 19,
    opacity: 0.8,
  },
  hdrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  routeTouch: {
    flex: 1,
  },
  route: {
    fontFamily: FONTS.display,
    fontSize: 42,
    letterSpacing: 0.8,
    color: COLORS.ink,
    lineHeight: 44,
  },
  regenBtn: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  regenIcon: {
    fontSize: 20,
  },
  optRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingVertical: 4,
    paddingBottom: 12,
    justifyContent: 'space-between',
  },
  diffRow: {
    paddingTop: 0,
    paddingBottom: 14,
    justifyContent: 'flex-start',
  },
  optGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  optPill: {
    borderWidth: 1.5,
    borderColor: COLORS.line,
    backgroundColor: 'transparent',
    borderRadius: RADIUS.pill,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  optPillActive: {
    backgroundColor: COLORS.blaze,
    borderColor: COLORS.blaze,
  },
  optPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.dim,
  },
  optPillTextActive: {
    color: '#fff',
  },
  diffPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  diffPillText: {
    fontSize: 12,
  },
  lowerSeriesBtn: {
    width: '100%',
    paddingVertical: 10,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: COLORS.blaze,
    borderStyle: 'dashed',
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  lowerSeriesBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.blaze,
  },
  workoutMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  metaPill: {
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.line,
    backgroundColor: COLORS.surf,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  metaPillText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: COLORS.dim,
  },
  exList: {
    gap: SPACING.sm,
    marginBottom: 24,
  },
  startBtn: {
    width: '100%',
    paddingVertical: 18,
    backgroundColor: COLORS.blaze,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    marginTop: 'auto',
  },
  startBtnDisabled: {
    opacity: 0.45,
  },
  startBtnText: {
    color: COLORS.onBlaze,
    fontWeight: '800',
    fontSize: 18,
    letterSpacing: 0.4,
  },
});
