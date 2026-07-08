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
  regen: () => Promise<void>;
}

export function useWorkoutSession(): UseWorkoutSession {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void (async () => {
      const t = today();
      const saved = await sg<{ seed: string; legIds: string[] }>(`sess:${t}`);
      const s = saved
        ? buildSession(saved.seed, saved.legIds)
        : buildSession(t);
      if (!saved) await ss(`sess:${t}`, { seed: s.seed, legIds: s.legIds });
      setSession(s);
      setReady(true);
    })();
  }, []);

  const regen = useCallback(async () => {
    const seed = `${today()}-r${Date.now()}`;
    const s = buildSession(seed);
    await ss(`sess:${today()}`, { seed: s.seed, legIds: s.legIds });
    setSession(s);
  }, []);

  const routeName = session
    ? (() => {
        const r = rng32(hash(session.seed + '-n'));
        return ROUTES[Math.floor(r() * ROUTES.length)];
      })()
    : '';

  return { session, routeName, ready, regen };
}
