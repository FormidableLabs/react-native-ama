import 'react-native-gesture-handler';

import { AMAProvider } from '@react-native-ama/core';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AppNavigator } from './AppNavigator';

const App = () => {
  return (
    <GestureHandlerRootView style={{ flexGrow: 1 }}>
      <AMAProvider>
        <AppNavigator />
      </AMAProvider>
    </GestureHandlerRootView>
  );
};

export default App;
