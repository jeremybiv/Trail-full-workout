import { useCallback, useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';
import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import { JetBrainsMono_500Medium, JetBrainsMono_700Bold } from '@expo-google-fonts/jetbrains-mono';
import { useWorkoutSession } from './src/hooks/useWorkoutSession';
import { useWorkoutHistory } from './src/hooks/useWorkoutHistory';
import { unlockAudio } from './src/lib/audio';
import { today, buildLowerSeriesSession } from './src/lib/session';
import type { Session } from './src/lib/session';
import { HomeScreen } from './src/components/screens/HomeScreen';
import { PlayerScreen } from './src/components/screens/PlayerScreen';
import { DoneScreen } from './src/components/screens/DoneScreen';
import { COLORS } from './src/theme/tokens';

void SplashScreen.preventAutoHideAsync();

type Screen = 'home' | 'player' | 'done';

export default function App() {
  const [fontsLoaded] = useFonts({
    BebasNeue_400Regular,
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    JetBrainsMono_500Medium,
    JetBrainsMono_700Bold,
  });

  const [view, setView] = useState<Screen>('home');
  const [doneDuration, setDoneDuration] = useState(0);
  const [customSession, setCustomSession] = useState<Session | null>(null);

  const {
    session, routeName, ready, regen, focus, duration, difficulty,
    setFocus, setDuration, setDifficulty,
  } = useWorkoutSession();
  const activeSession = customSession ?? session;
  const { records, addRecord, streak, bestStreak, totalSessions } = useWorkoutHistory();

  useEffect(() => {
    if (fontsLoaded) void SplashScreen.hideAsync();
  }, [fontsLoaded]);

  const handleStart = useCallback(() => {
    unlockAudio();
    setView('player');
  }, []);

  const handleStartLowerSeries = useCallback(() => {
    unlockAudio();
    setCustomSession(buildLowerSeriesSession(duration, difficulty));
    setView('player');
  }, [duration, difficulty]);

  const handleDone = useCallback((elapsed: number) => {
    if (activeSession) {
      addRecord({
        date: today(),
        ts: Date.now(),
        elapsed,
        focus: activeSession.focus,
        duration: activeSession.duration,
        rounds: activeSession.duration === 'long' ? 4 : 2,
      });
    }
    setDoneDuration(elapsed);
    setView('done');
  }, [activeSession, addRecord]);

  const handleQuit = useCallback(() => {
    setCustomSession(null);
    setView('home');
  }, []);

  const handleBack = useCallback(() => {
    setCustomSession(null);
    setView('home');
  }, []);

  // History/Profile screens land in Phase 4 of the mobile rewrite plan — stub for now.
  const handleOpenHistory = useCallback(() => {
    Alert.alert('Bientôt disponible', "L'historique complet arrive dans une prochaine phase.");
  }, []);
  const handleOpenProfile = useCallback(() => {
    Alert.alert('Bientôt disponible', 'Le profil arrive dans une prochaine phase.');
  }, []);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <View style={styles.root}>
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
            streak={streak}
            onOpenHistory={handleOpenHistory}
            onOpenProfile={handleOpenProfile}
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            onStartLowerSeries={handleStartLowerSeries}
          />
        )}
        {view === 'player' && activeSession && (
          <PlayerScreen
            session={activeSession}
            onQuit={handleQuit}
            onDone={handleDone}
          />
        )}
        {view === 'done' && (
          <DoneScreen
            totalDur={doneDuration}
            session={activeSession}
            records={records}
            streak={streak}
            bestStreak={bestStreak}
            totalSessions={totalSessions}
            onBack={handleBack}
          />
        )}
        <StatusBar style="light" />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
});
