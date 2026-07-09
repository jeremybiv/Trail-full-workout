import { useCallback, useState } from 'react';
import { useWorkoutSession } from './hooks/useWorkoutSession';
import { useWorkoutHistory } from './hooks/useWorkoutHistory';
import { usePWA } from './hooks/usePWA';
import { unlockAudio } from './lib/audio';
import { today } from './lib/session';
import { HomeScreen } from './components/screens/HomeScreen';
import { PlayerScreen } from './components/screens/PlayerScreen';
import { DoneScreen } from './components/screens/DoneScreen';

type View = 'home' | 'player' | 'done';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [doneDuration, setDoneDuration] = useState(0);

  const { session, routeName, ready, regen, focus, duration, setFocus, setDuration } = useWorkoutSession();
  const { records, addRecord } = useWorkoutHistory();
  const { canInstall, isIOSInstallable, installed, install, needRefresh, updateServiceWorker } = usePWA();

  const handleStart = useCallback(() => {
    unlockAudio();
    setView('player');
  }, []);

  const handleDone = useCallback((elapsed: number) => {
    if (session) {
      addRecord({
        date: today(),
        ts: Date.now(),
        elapsed,
        focus: session.focus,
        duration: session.duration,
        rounds: session.duration === 'long' ? 4 : 2,
      });
    }
    setDoneDuration(elapsed);
    setView('done');
  }, [session, addRecord]);

  const handleQuit = useCallback(() => setView('home'), []);
  const handleBack = useCallback(() => setView('home'), []);

  return (
    <>
      {view === 'home' && (
        <HomeScreen
          session={session}
          routeName={routeName}
          ready={ready}
          onRegen={regen}
          onStart={handleStart}
          focus={focus}
          duration={duration}
          onFocusChange={setFocus}
          onDurationChange={setDuration}
          canInstall={canInstall && !installed}
          isIOSInstallable={isIOSInstallable && !installed}
          onInstall={install}
          needRefresh={needRefresh}
          onUpdate={() => updateServiceWorker(true)}
        />
      )}
      {view === 'player' && session && (
        <PlayerScreen
          session={session}
          onQuit={handleQuit}
          onDone={handleDone}
        />
      )}
      {view === 'done' && (
        <DoneScreen totalDur={doneDuration} session={session} records={records} onBack={handleBack} />
      )}
    </>
  );
}
