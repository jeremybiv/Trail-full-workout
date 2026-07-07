import type { Exercise } from '../data/exercises';
import { NAME_EN } from '../data/exerciseNamesEn';
import { PHOTO_EXERCISES } from '../data/exercisePhotos';
import { ExercisePhoto } from './ExercisePhoto';
import { ExerciseSvg } from './ExerciseSvg';

interface Props {
  exercise: Exercise;
  isLeg: boolean;
}

export function ExerciseCard({ exercise, isLeg }: Props) {
  return (
    <div className={`ex-card${isLeg ? ' leg' : ''}`}>
      <span className="cat-dot" />
      <div className="media-wrap">
        {PHOTO_EXERCISES.has(exercise.id) ? (
          <ExercisePhoto id={exercise.id} />
        ) : (
          <ExerciseSvg motionType={exercise.m} variant="card" />
        )}
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
