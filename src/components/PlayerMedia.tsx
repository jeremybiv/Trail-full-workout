import type { Step } from '../lib/session';
import { ALL } from '../data/exercises';
import { PHOTO_EXERCISES } from '../data/exercisePhotos';
import { ExercisePhoto } from './ExercisePhoto';
import { ExerciseSvg } from './ExerciseSvg';

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

  let cls = 'pmedia';
  if (isWork) cls += ' work';
  else if (isPreview) cls += ' rest' + (nextStep?.id ? ' preview' : '');

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
