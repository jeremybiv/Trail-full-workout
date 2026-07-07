import type { Step } from '../lib/session';
import { ALL } from '../data/exercises';
import { gifCache } from '../lib/gif';
import { ExerciseSvg } from './ExerciseSvg';

interface Props {
  step: Step | null;
  nextStep?: Step | null;
  gifVersion: number;
  paused: boolean;
}

export function PlayerMedia({ step, nextStep, gifVersion: _, paused }: Props) {
  const isWork = step?.type === 'work';
  const isPreview = step?.type === 'rest' || step?.type === 'gap';

  // During rest/gap, show the upcoming exercise; during work, show the current one
  const displayId = isPreview ? (nextStep?.id ?? step?.id) : step?.id;
  const exercise = displayId ? ALL[displayId] : null;

  let cls = 'pmedia';
  if (isWork) cls += ' work';
  else if (isPreview) cls += ' rest' + (nextStep?.id ? ' preview' : '');

  const gifUrl = exercise ? gifCache.get(exercise.id) : null;

  return (
    <div className={cls}>
      {exercise ? (
        gifUrl ? (
          <img src={gifUrl} alt="" style={{ opacity: paused ? 0.4 : 1 }} />
        ) : (
          <ExerciseSvg motionType={exercise.m} variant="player" paused={paused} />
        )
      ) : (
        <ExerciseSvg motionType="plank" variant="player" paused={paused} />
      )}
    </div>
  );
}
