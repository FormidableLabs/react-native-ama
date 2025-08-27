import { AMAProvider } from '@react-native-ama/core';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { AppNavigator } from './src/AppNavigation';

export default function App() {
  return (
    <AMAProvider>
      <StatusBar style="auto" />
      <AppNavigator />
    </AMAProvider>
  );
}
