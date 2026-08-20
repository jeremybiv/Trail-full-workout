// Must be the very first import — react-native-gesture-handler (used by
// @gorhom/bottom-sheet) requires this to run before anything else touches
// the native module registry.
import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
