import type { Exercise } from '../data/exercises';
import { NAME_EN } from '../data/exerciseNamesEn';
import { ExerciseMedia } from './ExerciseMedia';

interface Props {
  exercise: Exercise;
  isLeg: boolean;
  onClick?: () => void;
}

export function ExerciseCard({ exercise, isLeg, onClick }: Props) {
  return (
    <div
      className={`ex-card${isLeg ? ' leg' : ''}${onClick ? ' clickable' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
    >
      <span className="cat-dot" />
      <div className="media-wrap">
        <ExerciseMedia exercise={exercise} variant="card" />
      </div>
      <div className="ex-info">
        <p className="ex-name">{NAME_EN[exercise.id]}</p>
        <div className="ex-card-footer">
          <p className="ex-tag">
            {isLeg ? (
              <><span className="dice">🎲</span> Jambes — tirage du jour</>
            ) : exercise.hold ? (
              'Maintien'
            ) : (
              'Haut du corps / Abdos'
            )}
          </p>
          <span className={`ex-level lv${exercise.level}`}>
            {'●'.repeat(exercise.level)}{'○'.repeat(3 - exercise.level)}
          </span>
        </div>
      </div>
    </div>
  );
}
