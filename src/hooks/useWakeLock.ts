import { useCallback, useEffect, useRef } from 'react';

export function useWakeLock(active: boolean): () => void {
  const lockRef = useRef<{ release: () => Promise<void> } | null>(null);

  const acquire = useCallback(async () => {
    if (!active) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wl = (navigator as any).wakeLock;
    if (!wl) return;
    try { lockRef.current = await wl.request('screen'); } catch { /* low battery or denied */ }
  }, [active]);

  useEffect(() => {
    if (!active) return;

    const onVisibility = () => {
      if (document.visibilityState === 'visible') acquire();
    };

    acquire();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      lockRef.current?.release();
      lockRef.current = null;
    };
  }, [active, acquire]);

  return acquire;
}
