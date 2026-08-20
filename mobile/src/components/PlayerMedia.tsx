import { StyleSheet, View } from 'react-native';
import type { Step } from '../lib/session';
import { ALL } from '../data/exercises';
import { ExerciseMedia } from './ExerciseMedia';
import { ExerciseSvg } from './ExerciseSvg';
import { COLORS } from '../theme/tokens';

interface Props {
  step: Step | null;
  nextStep?: Step | null;
  paused: boolean;
}

export function PlayerMedia({ step, nextStep, paused }: Props) {
  const isWork = step?.type === 'work';
  const isPreview = step?.type === 'rest' || step?.type === 'gap';

  // During rest/gap, show the upcoming exercise; during work, show the current one
  const displayId = isPreview ? (nextStep?.id ?? step?.id) : step?.id;
  const exercise = displayId ? ALL[displayId] : null;

  return (
    <View
      style={[
        styles.pmedia,
        isWork && styles.pmediaWork,
        isPreview && styles.pmediaRest,
        isPreview && nextStep?.id && styles.pmediaPreview,
      ]}
    >
      {exercise ? (
        <ExerciseMedia exercise={exercise} variant="player" paused={paused} />
      ) : (
        <ExerciseSvg motionType="plank" variant="player" paused={paused} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  pmedia: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.surf,
    borderWidth: 2,
    borderColor: COLORS.line,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 12,
  },
  pmediaWork: {
    borderColor: COLORS.blaze,
    borderStyle: 'solid',
  },
  pmediaRest: {
    borderColor: COLORS.rest,
    borderStyle: 'dashed',
    borderWidth: 3,
  },
  pmediaPreview: {
    opacity: 0.82,
  },
});
