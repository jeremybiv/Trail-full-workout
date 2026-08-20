import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Exercise } from '../data/exercises';
import { NAME_EN } from '../data/exerciseNamesEn';
import { ExerciseMedia } from './ExerciseMedia';
import { COLORS, RADIUS } from '../theme/tokens';

interface Props {
  exercise: Exercise;
  isLeg: boolean;
  onPress?: () => void;
}

const LEVEL_COLOR = { 1: COLORS.lv1, 2: COLORS.lv2, 3: COLORS.lv3 } as const;

export function ExerciseCard({ exercise, isLeg, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        isLeg && styles.cardLeg,
        pressed && onPress && styles.cardPressed,
      ]}
    >
      <View style={[styles.catDot, isLeg && styles.catDotLeg]} />
      <View style={styles.mediaWrap}>
        <ExerciseMedia exercise={exercise} variant="card" />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{NAME_EN[exercise.id]}</Text>
        <View style={styles.footer}>
          <Text style={styles.tag} numberOfLines={1}>
            {isLeg ? '🎲 Jambes — tirage du jour' : exercise.hold ? 'Maintien' : 'Haut du corps / Abdos'}
          </Text>
          <Text style={[styles.level, { color: LEVEL_COLOR[exercise.level] }]}>
            {'●'.repeat(exercise.level)}{'○'.repeat(3 - exercise.level)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.surf,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: RADIUS.md,
    paddingVertical: 8,
    paddingLeft: 10,
    paddingRight: 12,
  },
  cardLeg: {
    borderColor: 'rgba(44, 116, 232, 0.5)',
  },
  cardPressed: {
    transform: [{ scale: 0.97 }],
  },
  catDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.dim,
  },
  catDotLeg: {
    backgroundColor: COLORS.blaze,
  },
  mediaWrap: {
    width: 54,
    height: 54,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.surf2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.ink,
    marginBottom: 2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
  },
  tag: {
    flex: 1,
    fontSize: 10,
    color: COLORS.dim,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  level: {
    fontSize: 9,
    letterSpacing: 1,
    opacity: 0.7,
  },
});
