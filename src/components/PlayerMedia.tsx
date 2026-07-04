import type { Step } from '../lib/session';
import { ALL } from '../data/exercises';
import { gifCache } from '../lib/gif';
import { ExerciseSvg } from './ExerciseSvg';

interface Props {
  step: Step | null;
  gifVersion: number;
  paused: boolean;
}

export function PlayerMedia({ step, gifVersion: _, paused }: Props) {
  const isWork = step?.type === 'work';
  const isRest = step?.type === 'rest' || step?.type === 'gap';
  const exercise = step?.id ? ALL[step.id] : null;

  let cls = 'pmedia';
  if (isWork) cls += ' work';
  else if (isRest) cls += ' rest';

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
