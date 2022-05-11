import { NavigationContainer } from '@react-navigation/native';
import {
  NativeStackNavigationOptions,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import React from 'react';
import { AMAProvider } from 'react-native-ama';

import { BackButton } from './src/components/BackButton';
import { Header } from './src/components/Header';
import { HomeScreen } from './src/screens/Home.screen';
import { PressableScreen } from './src/screens/Pressable.screen';

const Stack = createNativeStackNavigator();

const BaseNavigatorOptions: NativeStackNavigationOptions = {
  headerTitleAlign: 'center',
  headerBackVisible: false,
};

const App = () => {
  return (
    <AMAProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={BaseNavigatorOptions}>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              headerTitle: () => <Header title={'AMA Demo'} />,
            }}
          />
          <Stack.Screen
            name="Pressable"
            component={PressableScreen}
            options={{
              headerLeft: () => <BackButton />,
              headerTitle: () => <Header title={'Pressable Demo'} autofocus />,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AMAProvider>
  );
};

export default App;
