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

function today(): string {
  const d = new Date();
  return (
    d.getFullYear() +
    '-' +
    String(d.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(d.getDate()).padStart(2, '0')
  );
}

function offsetDay(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T12:00:00');
  d.setDate(d.getDate() + days);
  return (
    d.getFullYear() +
    '-' +
    String(d.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(d.getDate()).padStart(2, '0')
  );
}

function computeStreak(records: WorkoutRecord[]): number {
  if (!records.length) return 0;
  const dates = [...new Set(records.map((r) => r.date))].sort().reverse();
  const todayStr = today();
  // Start from today if trained today, else from yesterday
  let cursor = dates[0] === todayStr ? todayStr : offsetDay(todayStr, -1);
  let count = 0;
  for (const d of dates) {
    if (d === cursor) {
      count++;
      cursor = offsetDay(cursor, -1);
    } else if (d < cursor) {
      break;
    }
  }
  return count;
}

function computeBestStreak(records: WorkoutRecord[]): number {
  if (!records.length) return 0;
  const dates = [...new Set(records.map((r) => r.date))].sort();
  let best = 1;
  let current = 1;
  for (let i = 1; i < dates.length; i++) {
    if (dates[i] === offsetDay(dates[i - 1], 1)) {
      current++;
      if (current > best) best = current;
    } else {
      current = 1;
    }
  }
  return best;
}

export function useWorkoutHistory() {
  const [records, setRecords] = useState<WorkoutRecord[]>([]);

  useEffect(() => {
    sg<WorkoutRecord[]>('workouts').then((r) => setRecords(r ?? []));
  }, []);

  const addRecord = useCallback((rec: WorkoutRecord) => {
    setRecords((prev) => {
      const next = [rec, ...prev].slice(0, 90);
      ss('workouts', next);
      return next;
    });
  }, []);

  const streak = computeStreak(records);
  const bestStreak = computeBestStreak(records);
  const totalSessions = records.length;
  const totalMinutes = Math.round(records.reduce((s, r) => s + r.elapsed, 0) / 60);

  return { records, addRecord, streak, bestStreak, totalSessions, totalMinutes };
}
