import { useCallback, useEffect, useState } from 'react';
import { useWorkoutSession } from './hooks/useWorkoutSession';
import { useWorkoutHistory } from './hooks/useWorkoutHistory';
import { useProfile } from './hooks/useProfile';
import { useNotifications } from './hooks/useNotifications';
import { usePWA } from './hooks/usePWA';
import { unlockAudio } from './lib/audio';
import { today } from './lib/session';
import { HomeScreen } from './components/screens/HomeScreen';
import { PlayerScreen } from './components/screens/PlayerScreen';
import { DoneScreen } from './components/screens/DoneScreen';
import { HistoryModal } from './components/HistoryModal';
import { ProfileModal } from './components/ProfileModal';

type View = 'home' | 'player' | 'done';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [doneDuration, setDoneDuration] = useState(0);
  const [showHistory, setShowHistory] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const { session, routeName, ready, regen, focus, duration, difficulty, setFocus, setDuration, setDifficulty } = useWorkoutSession();
  const { records, addRecord, streak, bestStreak, totalSessions, totalMinutes } = useWorkoutHistory();
  const { prefs, updatePrefs } = useProfile();
  const { permission, requestPermission, updateSubscription, unsubscribe } = useNotifications(prefs, records);
  const { showInstall, promptReady, ios, install, dismissInstall } = usePWA();

  // Sync subscription when prefs change
  useEffect(() => {
    if (prefs) void updateSubscription(prefs);
  }, [prefs, updateSubscription]);

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
          showInstall={showInstall}
          promptReady={promptReady}
          isIOS={ios}
          onInstall={install}
          onDismissInstall={dismissInstall}
          streak={streak}
          onOpenHistory={() => setShowHistory(true)}
          onOpenProfile={() => setShowProfile(true)}
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
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
        <DoneScreen
          totalDur={doneDuration}
          session={session}
          records={records}
          streak={streak}
          bestStreak={bestStreak}
          totalSessions={totalSessions}
          onBack={handleBack}
        />
      )}
      {showHistory && (
        <HistoryModal
          records={records}
          streak={streak}
          bestStreak={bestStreak}
          totalSessions={totalSessions}
          totalMinutes={totalMinutes}
          onClose={() => setShowHistory(false)}
        />
      )}
      {showProfile && prefs && (
        <ProfileModal
          prefs={prefs}
          permission={permission}
          streak={streak}
          totalSessions={totalSessions}
          onUpdate={updatePrefs}
          onRequestPermission={requestPermission}
          onUnsubscribe={() => unsubscribe(prefs.deviceId)}
          onClose={() => setShowProfile(false)}
        />
      )}
    </>
  );
}
