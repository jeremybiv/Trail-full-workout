import type { Exercise } from '../data/exercises';
import { gifCache } from '../lib/gif';
import { ExerciseSvg } from './ExerciseSvg';

interface Props {
  exercise: Exercise;
  index: number;
  isLeg: boolean;
  gifVersion: number;
}

export function ExerciseCard({ exercise, index, isLeg, gifVersion: _ }: Props) {
  const gifUrl = gifCache.get(exercise.id);

  return (
    <div className={`ex-card${isLeg ? ' leg' : ''}`}>
      <span className="ex-idx">{index + 1}</span>
      <div className="media-wrap">
        {gifUrl ? (
          <img src={gifUrl} alt="" loading="lazy" />
        ) : (
          <ExerciseSvg motionType={exercise.m} variant="card" />
        )}
      </div>
      <div className="ex-info">
        <p className="ex-name">{exercise.name}</p>
        <p className="ex-tag">
          {isLeg ? (
            <><span className="dice">🎲</span> Jambes — tirage du jour</>
          ) : exercise.hold ? (
            'Maintien'
          ) : (
            'Haut du corps / Abdos'
          )}
        </p>
      </div>
    </div>
  );
}
