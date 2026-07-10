import { useCallback, useEffect, useState } from 'react';
import type { Session, Difficulty } from '../lib/session';
import { buildSession, today } from '../lib/session';
import { sg, ss } from '../lib/storage';
import { hash, rng32 } from '../lib/rng';
import { ROUTES } from '../data/constants';

interface UseWorkoutSession {
  session: Session | null;
  routeName: string;
  ready: boolean;
  focus: 'upper' | 'lower';
  duration: 'short' | 'long';
  difficulty: Difficulty;
  regen: () => Promise<void>;
  setFocus: (f: 'upper' | 'lower') => void;
  setDuration: (d: 'short' | 'long') => void;
  setDifficulty: (d: Difficulty) => void;
}

type SavedPrefs = { focus: 'upper' | 'lower'; duration: 'short' | 'long'; difficulty?: Difficulty };
type SavedSession = { seed: string; legIds: string[]; focus?: 'upper' | 'lower'; duration?: 'short' | 'long'; difficulty?: Difficulty };

export function useWorkoutSession(): UseWorkoutSession {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [focus, setFocusState] = useState<'upper' | 'lower'>('upper');
  const [duration, setDurationState] = useState<'short' | 'long'>('short');
  const [difficulty, setDifficultyState] = useState<Difficulty>('int');

  useEffect(() => {
    void (async () => {
      const t = today();
      const prefs = await sg<SavedPrefs>('prefs');
      const initFocus = prefs?.focus ?? 'upper';
      const initDuration = prefs?.duration ?? 'short';
      const initDifficulty = prefs?.difficulty ?? 'int';

      const saved = await sg<SavedSession>(`sess:${t}`);
      const resolvedFocus = saved?.focus ?? initFocus;
      const resolvedDuration = saved?.duration ?? initDuration;
      const resolvedDifficulty = saved?.difficulty ?? initDifficulty;
      setFocusState(resolvedFocus);
      setDurationState(resolvedDuration);
      setDifficultyState(resolvedDifficulty);

      const s = saved
        ? buildSession(saved.seed, { legIds: saved.legIds, focus: resolvedFocus, duration: resolvedDuration, difficulty: resolvedDifficulty })
        : buildSession(t, { focus: resolvedFocus, duration: resolvedDuration, difficulty: resolvedDifficulty });
      if (!saved) await ss(`sess:${t}`, { seed: s.seed, legIds: s.legIds, focus: resolvedFocus, duration: resolvedDuration, difficulty: resolvedDifficulty });
      setSession(s);
      setReady(true);
    })();
  }, []);

  const regen = useCallback(async () => {
    const seed = `${today()}-r${Date.now()}`;
    const s = buildSession(seed, { focus, duration, difficulty });
    await ss(`sess:${today()}`, { seed: s.seed, legIds: s.legIds, focus, duration, difficulty });
    setSession(s);
  }, [focus, duration, difficulty]);

  const setFocus = useCallback((f: 'upper' | 'lower') => {
    setFocusState(f);
    void ss('prefs', { focus: f, duration, difficulty });
    const seed = `${today()}-r${Date.now()}`;
    const s = buildSession(seed, { focus: f, duration, difficulty });
    void ss(`sess:${today()}`, { seed: s.seed, legIds: s.legIds, focus: f, duration, difficulty });
    setSession(s);
  }, [duration, difficulty]);

  const setDuration = useCallback((d: 'short' | 'long') => {
    setDurationState(d);
    void ss('prefs', { focus, duration: d, difficulty });
    setSession((prev) => {
      if (!prev) return null;
      void ss(`sess:${today()}`, { seed: prev.seed, legIds: prev.legIds, focus, duration: d, difficulty });
      return { ...prev, duration: d };
    });
  }, [focus, difficulty]);

  const setDifficulty = useCallback((d: Difficulty) => {
    setDifficultyState(d);
    void ss('prefs', { focus, duration, difficulty: d });
    const seed = `${today()}-r${Date.now()}`;
    const s = buildSession(seed, { focus, duration, difficulty: d });
    void ss(`sess:${today()}`, { seed: s.seed, legIds: s.legIds, focus, duration, difficulty: d });
    setSession(s);
  }, [focus, duration]);

  const routeName = session
    ? (() => {
        const r = rng32(hash(session.seed + '-n'));
        return ROUTES[Math.floor(r() * ROUTES.length)];
      })()
    : '';

  return { session, routeName, ready, regen, focus, duration, difficulty, setFocus, setDuration, setDifficulty };
}
