import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import React from 'react';
import { AMAProvider, useAMAContext } from 'react-native-ama';
import ErrorBoundary from 'react-native-error-boundary';

import { BackButton } from './components/BackButton';
import { Header } from './components/Header';
import { ExpandablePressableScreen } from './screens/ExpandablePressableScreen';
import { FormScreen } from './screens/Form.screen';
import { HomeScreen } from './screens/Home.screen';
import { PressableScreen } from './screens/Pressable.screen';
import { ReanimatedReduceMotionScreen } from './screens/ReanimatedReduceMotion.screen';
import { ReduceMotionScreen } from './screens/ReduceMotion.screen';
import { TextScreen } from './screens/Text.screen';
import { TouchableOpacityScreen } from './screens/TouchableOpacity.screen';
import { TouchableWithoutFeedbackScreen } from './screens/TouchableWithoutFeedback';
import type { RootStackParamList } from './types';

const App = () => {
  return (
    <ErrorBoundary>
      <AMAProvider>
        <AppNavigator />
      </AMAProvider>
    </ErrorBoundary>
  );
};

const AppNavigator = () => {
  const { reactNavigationScreenOptions } = useAMAContext();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          ...BaseNavigatorOptions,
          ...reactNavigationScreenOptions,
        }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerTitle: () => <Header title={'AMA Examples'} />,
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
        <Stack.Screen
          name="TouchableOpacity"
          component={TouchableOpacityScreen}
          options={{
            headerLeft: () => <BackButton />,
            headerTitle: () => (
              <Header title={'TouchableOpacity Demo'} autofocus />
            ),
          }}
        />
        <Stack.Screen
          name="TouchableWithoutFeedback"
          component={TouchableWithoutFeedbackScreen}
          options={{
            headerLeft: () => <BackButton />,
            headerTitle: () => (
              <Header title={'TouchableWithoutFeedback Demo'} autofocus />
            ),
          }}
        />
        <Stack.Screen
          name="Text"
          component={TextScreen}
          options={{
            headerLeft: () => <BackButton />,
            headerTitle: () => <Header title={'Text Demo'} autofocus />,
          }}
        />
        <Stack.Screen
          name="ReduceMotion"
          component={ReduceMotionScreen}
          options={{
            headerLeft: () => <BackButton />,
            headerTitle: () => (
              <Header title={'Reduce Motion Demo'} autofocus />
            ),
          }}
        />
        <Stack.Screen
          name="ReanimatedReduceMotion"
          component={ReanimatedReduceMotionScreen}
          options={{
            headerLeft: () => <BackButton />,
            headerTitle: () => (
              <Header title={'Reanimated Reduce Motion Demo'} autofocus />
            ),
          }}
        />
        <Stack.Screen
          name="Form"
          component={FormScreen}
          options={{
            headerLeft: () => <BackButton />,
            headerTitle: () => <Header title={'Form Demo'} autofocus />,
          }}
        />
        <Stack.Screen
          name="ExpandablePressable"
          component={ExpandablePressableScreen}
          options={{
            headerLeft: () => <BackButton />,
            headerTitle: () => (
              <Header title={'ExpandablePressable Demo'} autofocus />
            ),
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const BaseNavigatorOptions: NativeStackNavigationOptions = {
  headerTitleAlign: 'center',
  headerBackVisible: false,
};

export default App;
