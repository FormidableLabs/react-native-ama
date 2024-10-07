import { AMAProvider } from '@react-native-ama/core';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AppNavigator } from './src/AppNavigation';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AMAProvider>
        <StatusBar style="auto" />
        <AppNavigator />
      </AMAProvider>
    </GestureHandlerRootView>
  );
}
