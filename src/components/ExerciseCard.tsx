import type { Exercise } from '../data/exercises';
import { NAME_EN } from '../data/exerciseNamesEn';
import { ExerciseMedia } from './ExerciseMedia';

interface Props {
  exercise: Exercise;
  isLeg: boolean;
}

export function ExerciseCard({ exercise, isLeg }: Props) {
  return (
    <div className={`ex-card${isLeg ? ' leg' : ''}`}>
      <span className="cat-dot" />
      <div className="media-wrap">
        <ExerciseMedia exercise={exercise} variant="card" />
      </div>
      <div className="ex-info">
        <p className="ex-name">{NAME_EN[exercise.id]}</p>
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
