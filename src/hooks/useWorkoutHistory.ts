import { useCallback, useEffect, useState } from 'react';
import { sg, ss } from '../lib/storage';

export interface WorkoutRecord {
  date: string;
  ts: number;
  elapsed: number;
  focus: 'upper' | 'lower';
  duration: 'short' | 'long';
  rounds: number;
}

export function useWorkoutHistory() {
  const [records, setRecords] = useState<WorkoutRecord[]>([]);

  useEffect(() => {
    sg<WorkoutRecord[]>('workouts').then((r) => setRecords(r ?? []));
  }, []);

  const addRecord = useCallback((rec: WorkoutRecord) => {
    setRecords((prev) => {
      const next = [rec, ...prev].slice(0, 30);
      ss('workouts', next);
      return next;
    });
  }, []);

  return { records, addRecord };
}
