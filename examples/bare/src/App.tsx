import 'react-native-gesture-handler';

import React from 'react';

import { AppNavigator } from './AppNavigator';
import { AMAProvider } from '@react-native-ama/core';

const App = () => {
  return (
    <AMAProvider>
      <AppNavigator />
    </AMAProvider>
  );
};

export default App;
