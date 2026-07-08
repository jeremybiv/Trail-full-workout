import { useCallback, useState } from 'react';
import { useWorkoutSession } from './hooks/useWorkoutSession';
import { unlockAudio } from './lib/audio';
import { HomeScreen } from './components/screens/HomeScreen';
import { PlayerScreen } from './components/screens/PlayerScreen';
import { DoneScreen } from './components/screens/DoneScreen';

type View = 'home' | 'player' | 'done';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [doneDuration, setDoneDuration] = useState(0);

  const { session, routeName, ready, regen, focus, duration, setFocus, setDuration } = useWorkoutSession();

  const handleStart = useCallback(() => {
    unlockAudio();
    setView('player');
  }, []);

  const handleDone = useCallback((elapsed: number) => {
    setDoneDuration(elapsed);
    setView('done');
  }, []);

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
        <DoneScreen totalDur={doneDuration} onBack={handleBack} />
      )}
    </>
  );
}
