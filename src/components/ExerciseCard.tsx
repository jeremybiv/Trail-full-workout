import type { Exercise } from '../data/exercises';
import { gifCache } from '../lib/gif';
import { ExerciseSvg } from './ExerciseSvg';

interface Props {
  exercise: Exercise;
  isLeg: boolean;
  gifVersion: number;
}

export function ExerciseCard({ exercise, isLeg, gifVersion: _ }: Props) {
  const gifUrl = gifCache.get(exercise.id);

  return (
    <div className={`ex-card${isLeg ? ' leg' : ''}`}>
      <span className="cat-dot" />
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
