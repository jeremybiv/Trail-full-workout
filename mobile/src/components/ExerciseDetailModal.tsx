import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { Exercise } from '../data/exercises';
import { NAME_EN } from '../data/exerciseNamesEn';
import { ExerciseMedia } from './ExerciseMedia';
import { COLORS, FONTS } from '../theme/tokens';

interface Props {
  exercise: Exercise;
  isLeg: boolean;
  onClose: () => void;
}

// NOTE: the web version shows a looping .mp4 for exercises with `exercise.video`
// (via ExerciseVideo). That component needs expo-video, which is Phase 4 scope —
// for now every exercise falls back to its photo crossfade / lottie animation.
export function ExerciseDetailModal({ exercise, isLeg, onClose }: Props) {
  const tag = isLeg ? '🎲 Jambes — tirage du jour' : exercise.hold ? 'Maintien' : 'Haut du corps / Abdos';

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

            <View style={styles.media}>
              <ExerciseMedia exercise={exercise} variant="player" />
            </View>

            <View style={styles.info}>
              <Text style={[styles.tag, isLeg && styles.tagLeg]}>{tag}</Text>
              <Text style={styles.name}>{NAME_EN[exercise.id]}</Text>
              <Text style={styles.desc}>{exercise.desc}</Text>
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
    overflow: 'hidden',
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
  media: {
    width: '100%',
    height: 220,
    backgroundColor: COLORS.surf2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaLeg: {},
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
