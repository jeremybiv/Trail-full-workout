import { useCallback, useEffect, useRef, useState } from 'react';
import type { Step } from '../lib/session';
import { beep } from '../lib/audio';

interface UseTimerResult {
  step: Step | null;
  stepIndex: number;
  rem: number;
  elapsed: number;
  totalDur: number;
  paused: boolean;
  done: boolean;
  toggle: () => void;
  skip: (dir: -1 | 1) => void;
  start: () => void;
  stop: () => void;
}

export function useTimer(
  timeline: Step[],
  muted: boolean,
  onDone: (elapsed: number) => void,
): UseTimerResult {
  const [si, setSi] = useState(0);
  const [rem, setRem] = useState(timeline[0]?.dur ?? 0);
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(true);
  const [active, setActive] = useState(false);
  const [done, setDone] = useState(false);

  const nextTickRef = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onDoneRef = useRef(onDone);
  const mutedRef = useRef(muted);

  useEffect(() => { onDoneRef.current = onDone; }, [onDone]);
  useEffect(() => { mutedRef.current = muted; }, [muted]);

  const totalDur = timeline.reduce((a, b) => a + b.dur, 0);

  // tick loop via setTimeout (avoids drift on hidden tabs)
  useEffect(() => {
    if (!active || paused || done) return;

    const tick = () => {
      const now = Date.now();
      if (now < nextTickRef.current) {
        timerRef.current = setTimeout(tick, 50);
        return;
      }
      nextTickRef.current += 1000;

      setRem((r) => {
        if (r <= 1) return 0;
        const next = r - 1;
        if (next <= 3) beep(660, 0.08, mutedRef.current);
        return next;
      });
      setElapsed((e) => e + 1);
    };

    timerRef.current = setTimeout(tick, 100);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [active, paused, done]);

  // advance step when rem hits 0
  useEffect(() => {
    if (!active || paused || rem > 0) return;

    setSi((prevSi) => {
      const nextSi = prevSi + 1;
      if (nextSi >= timeline.length) {
        setDone(true);
        setActive(false);
        setElapsed((e) => { onDoneRef.current(e); return e; });
        return prevSi;
      }
      const nextStep = timeline[nextSi];
      setRem(nextStep.dur);
      nextTickRef.current = Date.now() + 1000;
      if (nextStep.type === 'work') beep(880, 0.12, mutedRef.current);
      else beep(440, 0.12, mutedRef.current);
      return nextSi;
    });
  }, [rem, active, paused, timeline]);

  const start = useCallback(() => {
    setPaused(false);
    setActive(true);
    nextTickRef.current = Date.now() + 1000;
    beep(880, 0.12, mutedRef.current);
  }, []);

  const stop = useCallback(() => {
    setActive(false);
    setPaused(true);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const toggle = useCallback(() => {
    setPaused((p) => {
      if (p) nextTickRef.current = Date.now() + 1000;
      return !p;
    });
  }, []);

  const skip = useCallback((dir: -1 | 1) => {
    setSi((prevSi) => {
      const ni = Math.max(0, Math.min(timeline.length - 1, prevSi + dir));
      setRem(timeline[ni].dur);
      setElapsed(timeline.slice(0, ni).reduce((a, b) => a + b.dur, 0));
      nextTickRef.current = Date.now() + 1000;
      return ni;
    });
  }, [timeline]);

  // cleanup on unmount
  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return {
    step: timeline[si] ?? null,
    stepIndex: si,
    rem,
    elapsed,
    totalDur,
    paused,
    done,
    toggle,
    skip,
    start,
    stop,
  };
}
