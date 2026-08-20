import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Sheet } from './Sheet';
import type { Exercise } from '../data/exercises';
import { NAME_EN } from '../data/exerciseNamesEn';
import { ExerciseMedia } from './ExerciseMedia';
import { ExerciseVideo } from './ExerciseVideo';
import { COLORS, FONTS } from '../theme/tokens';

interface Props {
  exercise: Exercise;
  isLeg: boolean;
  onClose: () => void;
}

export function ExerciseDetailModal({ exercise, isLeg, onClose }: Props) {
  const tag = isLeg ? '🎲 Jambes — tirage du jour' : exercise.hold ? 'Maintien' : 'Haut du corps / Abdos';

  return (
    <Sheet onClose={onClose} noPadding>
      <Pressable style={styles.closeBtn} onPress={onClose} hitSlop={8}>
        <Text style={styles.closeIcon}>✕</Text>
      </Pressable>

      {exercise.video ? (
        <ExerciseVideo url={exercise.video} autoPlay />
      ) : (
        <View style={styles.media}>
          <ExerciseMedia exercise={exercise} variant="player" />
        </View>
      )}

      <View style={styles.info}>
        <Text style={[styles.tag, isLeg && styles.tagLeg]}>{tag}</Text>
        <Text style={styles.name}>{NAME_EN[exercise.id]}</Text>
        <Text style={styles.desc}>{exercise.desc}</Text>
      </View>
    </Sheet>
  );
}

const styles = StyleSheet.create({
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
  media: {
    width: '100%',
    height: 220,
    backgroundColor: COLORS.surf2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    padding: 24,
    paddingTop: 20,
  },
  tag: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: COLORS.dim,
    marginBottom: 6,
  },
  tagLeg: {
    color: COLORS.blaze,
  },
  name: {
    fontFamily: FONTS.display,
    fontSize: 32,
    letterSpacing: 0.6,
    color: COLORS.ink,
    marginBottom: 12,
    lineHeight: 34,
  },
  desc: {
    fontSize: 14,
    color: COLORS.dim,
    lineHeight: 22,
  },
});
