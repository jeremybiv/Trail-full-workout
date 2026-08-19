import { useCallback, useEffect } from 'react';
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
import { HomeScreen } from './src/components/screens/HomeScreen';
import { COLORS } from './src/theme/tokens';

void SplashScreen.preventAutoHideAsync();

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

  const {
    session, routeName, ready, regen, focus, duration, difficulty,
    setFocus, setDuration, setDifficulty,
  } = useWorkoutSession();
  const { streak } = useWorkoutHistory();

  useEffect(() => {
    if (fontsLoaded) void SplashScreen.hideAsync();
  }, [fontsLoaded]);

  // Player/Done screens and History/Profile modals land in later phases
  // (Phase 3 and Phase 4 of the mobile rewrite plan) — stub for now.
  const handleStart = useCallback(() => {
    Alert.alert('Bientôt disponible', "L'écran d'entraînement arrive dans une prochaine phase.");
  }, []);
  const handleOpenHistory = useCallback(() => {
    Alert.alert('Bientôt disponible', "L'historique arrive dans une prochaine phase.");
  }, []);
  const handleOpenProfile = useCallback(() => {
    Alert.alert('Bientôt disponible', 'Le profil arrive dans une prochaine phase.');
  }, []);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <View style={styles.root}>
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
          onStartLowerSeries={handleStart}
        />
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
