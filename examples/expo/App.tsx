import 'react-native-gesture-handler';

import { AMAProvider } from '@react-native-ama/core';
import { StatusBar } from 'expo-status-bar';

import { AppNavigator } from './src/AppNavigation';

export default function App() {
  return (
    <AMAProvider>
      <StatusBar style="auto" />
      <AppNavigator />
    </AMAProvider>
  );
}
