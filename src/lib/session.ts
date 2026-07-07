import type { Exercise } from '../data/exercises';
import { UP, LG, ALL } from '../data/exercises';
import { NAME_EN } from '../data/exerciseNamesEn';
import { ROUNDS, PREP_DUR } from '../data/constants';
import { hash, rng32, shuffle } from './rng';

export interface Session {
  ids: string[];
  legIds: string[];
  seed: string;
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

export function buildSession(seed: string, legIds?: string[]): Session {
  const rng = rng32(hash(seed));
  const upper = shuffle(UP, rng).slice(0, 6);
  const legs = legIds ? legIds.map((id) => ALL[id]) : shuffle(LG, rng).slice(0, 2);
  const order = [
    upper[0], upper[1], legs[0],
    upper[2], upper[3], legs[1],
    upper[4], upper[5],
  ] as Exercise[];
  return { ids: order.map((e) => e.id), legIds: legs.map((e) => e.id), seed };
}

export function buildTimeline(ids: string[]): Step[] {
  const steps: Step[] = [{ type: 'prep', dur: PREP_DUR, round: 1 }];
  ROUNDS.forEach((r, ri) => {
    if (ri === 1) steps.push({ type: 'gap', dur: 30, round: 2 });
    ids.forEach((id, i) => {
      steps.push({ type: 'work', id, dur: r.work, round: ri + 1 });
      const last = ri === ROUNDS.length - 1 && i === ids.length - 1;
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
