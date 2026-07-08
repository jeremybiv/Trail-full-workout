import type { Exercise } from '../data/exercises';
import { ExercisePhoto } from './ExercisePhoto';
import { ExerciseSvg } from './ExerciseSvg';

interface Props {
  exercise: Exercise;
  variant: 'card' | 'player';
  paused?: boolean;
}

export function ExerciseMedia({ exercise, variant, paused }: Props) {
  return exercise.photo ? (
    <ExercisePhoto id={exercise.id} paused={paused} />
  ) : (
    <ExerciseSvg motionType={exercise.m} variant={variant} paused={paused} />
  );
}
