import type { Exercise } from '../data/exercises';
import { UP, LG, ALL } from '../data/exercises';
import { NAME_EN } from '../data/exerciseNamesEn';
import { ROUNDS, ROUNDS_LONG, PREP_DUR } from '../data/constants';
import { hash, rng32, shuffle } from './rng';

export type Difficulty = 'deb' | 'int' | 'conf';

export interface Session {
  ids: string[];
  legIds: string[];
  seed: string;
  focus: 'upper' | 'lower';
  duration: 'short' | 'long';
  difficulty: Difficulty;
}

export type StepKind = 'prep' | 'work' | 'rest' | 'gap';

export interface Step {
  type: StepKind;
  id?: string;
  dur: number;
  round: number;
}

export function today(): string {
  const d = new Date();
  return (
    d.getFullYear() +
    '-' +
    String(d.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(d.getDate()).padStart(2, '0')
  );
}

export function buildSession(seed: string, opts?: {
  legIds?: string[];
  focus?: 'upper' | 'lower';
  duration?: 'short' | 'long';
  difficulty?: Difficulty;
}): Session {
  const focus = opts?.focus ?? 'upper';
  const duration = opts?.duration ?? 'short';
  const difficulty = opts?.difficulty ?? 'int';
  const rng = rng32(hash(seed));

  const upPool = difficulty === 'deb' ? UP.filter((e) => e.level <= 2)
               : difficulty === 'conf' ? UP.filter((e) => e.level >= 2)
               : UP;
  const lgPool = difficulty === 'deb' ? LG.filter((e) => e.level <= 2)
               : difficulty === 'conf' ? LG.filter((e) => e.level >= 2)
               : LG;

  if (focus === 'lower') {
    const legs = opts?.legIds ? opts.legIds.map((id) => ALL[id]) : shuffle(lgPool, rng).slice(0, 6);
    const upper = shuffle(upPool, rng).slice(0, 2);
    const order = [
      legs[0], legs[1], upper[0],
      legs[2], legs[3], upper[1],
      legs[4], legs[5],
    ] as Exercise[];
    return { ids: order.map((e) => e.id), legIds: legs.map((e) => e.id), seed, focus, duration, difficulty };
  } else {
    const upper = shuffle(upPool, rng).slice(0, 6);
    const legs = opts?.legIds ? opts.legIds.map((id) => ALL[id]) : shuffle(lgPool, rng).slice(0, 2);
    const order = [
      upper[0], upper[1], legs[0],
      upper[2], upper[3], legs[1],
      upper[4], upper[5],
    ] as Exercise[];
    return { ids: order.map((e) => e.id), legIds: legs.map((e) => e.id), seed, focus, duration, difficulty };
  }
}

export function buildTimeline(ids: string[], duration: 'short' | 'long' = 'short'): Step[] {
  const rounds = duration === 'long' ? ROUNDS_LONG : ROUNDS;
  const steps: Step[] = [{ type: 'prep', dur: PREP_DUR, round: 1 }];
  rounds.forEach((r, ri) => {
    if (ri > 0) steps.push({ type: 'gap', dur: 30, round: ri + 1 });
    ids.forEach((id, i) => {
      steps.push({ type: 'work', id, dur: r.work, round: ri + 1 });
      const last = ri === rounds.length - 1 && i === ids.length - 1;
      if (!last) steps.push({ type: 'rest', id, dur: r.rest, round: ri + 1 });
    });
  });
  return steps;
}

export function nextWorkName(timeline: Step[], fromIndex: number): string | null {
  for (let i = fromIndex + 1; i < timeline.length; i++) {
    if (timeline[i].type === 'work' && timeline[i].id) return NAME_EN[timeline[i].id!];
  }
  return null;
}

export function nextWorkStep(timeline: Step[], fromIndex: number): Step | null {
  for (let i = fromIndex + 1; i < timeline.length; i++) {
    if (timeline[i].type === 'work') return timeline[i];
  }
  return null;
}
