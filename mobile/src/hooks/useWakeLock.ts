import { useKeepAwake } from 'expo-keep-awake';

// The web version (navigator.wakeLock) has to manually re-acquire the lock
// on every visibilitychange, because Safari/Chrome silently release it when
// the tab is hidden — and returns an `acquire()` function PlayerScreen calls
// again on every tap of the pause/play button as a result. expo-keep-awake's
// useKeepAwake() manages that whole lifecycle itself for as long as the
// component stays mounted, so there's nothing left to do here beyond calling
// it — PlayerScreen only mounts while a workout is in progress.
export function useWakeLock(): void {
  useKeepAwake();
}
