import type { Step } from '../lib/session';
import { ALL } from '../data/exercises';
import { PHOTO_EXERCISES } from '../data/exercisePhotos';
import { ExercisePhoto } from './ExercisePhoto';
import { ExerciseSvg } from './ExerciseSvg';

interface Props {
  step: Step | null;
  paused: boolean;
}

export function PlayerMedia({ step, paused }: Props) {
  const isWork = step?.type === 'work';
  const isRest = step?.type === 'rest' || step?.type === 'gap';
  const exercise = step?.id ? ALL[step.id] : null;

  let cls = 'pmedia';
  if (isWork) cls += ' work';
  else if (isRest) cls += ' rest';

  return (
    <div className={cls}>
      {exercise ? (
        PHOTO_EXERCISES.has(exercise.id) ? (
          <ExercisePhoto id={exercise.id} paused={paused} />
        ) : (
          <ExerciseSvg motionType={exercise.m} variant="player" paused={paused} />
        )
      ) : (
        <ExerciseSvg motionType="plank" variant="player" paused={paused} />
      )}
    </div>
  );
}
