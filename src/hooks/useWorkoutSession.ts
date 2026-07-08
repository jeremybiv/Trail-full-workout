import { useCallback, useEffect, useState } from 'react';
import type { Session } from '../lib/session';
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
  regen: () => Promise<void>;
  setFocus: (f: 'upper' | 'lower') => void;
  setDuration: (d: 'short' | 'long') => void;
}

type SavedPrefs = { focus: 'upper' | 'lower'; duration: 'short' | 'long' };
type SavedSession = { seed: string; legIds: string[]; focus?: 'upper' | 'lower'; duration?: 'short' | 'long' };

export function useWorkoutSession(): UseWorkoutSession {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [focus, setFocusState] = useState<'upper' | 'lower'>('upper');
  const [duration, setDurationState] = useState<'short' | 'long'>('short');

  useEffect(() => {
    void (async () => {
      const t = today();
      const prefs = await sg<SavedPrefs>('prefs');
      const initFocus = prefs?.focus ?? 'upper';
      const initDuration = prefs?.duration ?? 'short';

      const saved = await sg<SavedSession>(`sess:${t}`);
      const resolvedFocus = saved?.focus ?? initFocus;
      const resolvedDuration = saved?.duration ?? initDuration;
      setFocusState(resolvedFocus);
      setDurationState(resolvedDuration);

      const s = saved
        ? buildSession(saved.seed, { legIds: saved.legIds, focus: resolvedFocus, duration: resolvedDuration })
        : buildSession(t, { focus: resolvedFocus, duration: resolvedDuration });
      if (!saved) await ss(`sess:${t}`, { seed: s.seed, legIds: s.legIds, focus: resolvedFocus, duration: resolvedDuration });
      setSession(s);
      setReady(true);
    })();
  }, []);

  const regen = useCallback(async () => {
    const seed = `${today()}-r${Date.now()}`;
    const s = buildSession(seed, { focus, duration });
    await ss(`sess:${today()}`, { seed: s.seed, legIds: s.legIds, focus, duration });
    setSession(s);
  }, [focus, duration]);

  const setFocus = useCallback((f: 'upper' | 'lower') => {
    setFocusState(f);
    void ss('prefs', { focus: f, duration });
    const seed = `${today()}-r${Date.now()}`;
    const s = buildSession(seed, { focus: f, duration });
    void ss(`sess:${today()}`, { seed: s.seed, legIds: s.legIds, focus: f, duration });
    setSession(s);
  }, [duration]);

  const setDuration = useCallback((d: 'short' | 'long') => {
    setDurationState(d);
    void ss('prefs', { focus, duration: d });
    setSession((prev) => {
      if (!prev) return null;
      void ss(`sess:${today()}`, { seed: prev.seed, legIds: prev.legIds, focus, duration: d });
      return { ...prev, duration: d };
    });
  }, [focus]);

  const routeName = session
    ? (() => {
        const r = rng32(hash(session.seed + '-n'));
        return ROUTES[Math.floor(r() * ROUTES.length)];
      })()
    : '';

  return { session, routeName, ready, regen, focus, duration, setFocus, setDuration };
}
