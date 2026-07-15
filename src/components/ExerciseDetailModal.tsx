import type { Exercise } from '../data/exercises';
import { NAME_FR } from '../data/exerciseNamesFr';
import { ExerciseMedia } from './ExerciseMedia';
import { ExerciseVideo } from './ExerciseVideo';

interface Props {
  exercise: Exercise;
  isLeg: boolean;
  onClose: () => void;
}

export function ExerciseDetailModal({ exercise, isLeg, onClose }: Props) {
  const tag = isLeg
    ? 'Jambes — tirage du jour'
    : exercise.hold
    ? 'Maintien'
    : 'Haut du corps / Abdos';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet ex-detail-sheet" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        {exercise.video ? (
          <div className="ex-detail-video">
            <ExerciseVideo url={exercise.video} autoPlay />
          </div>
        ) : (
          <div className={`ex-detail-media${isLeg ? ' leg' : ''}`}>
            <ExerciseMedia exercise={exercise} variant="player" />
          </div>
        )}

        <div className="ex-detail-info">
          <p className={`ex-detail-tag${isLeg ? ' leg' : ''}`}>{tag}</p>
          <h2 className="ex-detail-name">{NAME_FR[exercise.id]}</h2>
          <p className="ex-detail-desc">{exercise.desc}</p>
        </div>
      </div>
    </div>
  );
}
