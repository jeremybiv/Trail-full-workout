import { WDAYS, MONTHS } from '../data/constants';

export function fmt(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
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

export function dateLabel(): string {
  const d = new Date();
  return `${WDAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}
