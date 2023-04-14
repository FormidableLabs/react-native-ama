import 'react-native-gesture-handler';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import React from 'react';
import { Platform } from 'react-native';
import { AMAProvider, useAMAContext } from 'react-native-ama';

import { BackButton } from './components/BackButton';
import { Header } from './components/Header';
import { BottomSheetScreen } from './screens/BottomSheet.screen';
import { ExpandablePressableScreen } from './screens/ExpandablePressableScreen';
import { FlatListScreen } from './screens/FlatList.screen';
import { FlatListDynamicScreen } from './screens/FlatListDynamic.screen';
import { FlatListStaticScreen } from './screens/FlatListStatic.screen';
import { FormScreen } from './screens/Form.screen';
import { HomeScreen } from './screens/Home.screen';
import { PressableScreen } from './screens/Pressable.screen';
import { TextScreen } from './screens/Text.screen';
import { TouchableOpacityScreen } from './screens/TouchableOpacity.screen';
import { TouchableWithoutFeedbackScreen } from './screens/TouchableWithoutFeedback.screen';
import { UseAMAContextScreen } from './screens/UseAMAContext.screen';
import { UseAnimationScreen } from './screens/UseAnimationScreen';
import { UseReanimatedTimingScreen } from './screens/UseReanimatedTimingScreen';
import { UseTimedActionScreen } from './screens/UseTimedAction.screen';
import type { RootStackParamList } from './types';

const App = () => {
  return (
    <AMAProvider>
      <AppNavigator />
    </AMAProvider>
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
          name="UseAnimation"
          component={UseAnimationScreen}
          options={{
            headerLeft: () => <BackButton />,
            headerTitle: () => (
              <Header title={'Reduce Motion Demo'} autofocus />
            ),
          }}
        />
        <Stack.Screen
          name="UseReanimatedTiming"
          component={UseReanimatedTimingScreen}
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
          name="FlatList"
          component={FlatListScreen}
          options={{
            headerLeft: () => <BackButton />,
            headerTitle: () => <Header title={'FlatList Demo'} autofocus />,
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
        <Stack.Screen
          name="FlatListDynamic"
          component={FlatListDynamicScreen}
          options={{
            headerLeft: () => <BackButton />,
            headerTitle: () => (
              <Header title={'Dynamic FlatList Demo'} autofocus />
            ),
          }}
        />
        <Stack.Screen
          name="FlatListStatic"
          component={FlatListStaticScreen}
          options={{
            headerLeft: () => <BackButton />,
            headerTitle: () => (
              <Header title={'Static FlatList Demo'} autofocus />
            ),
          }}
        />
        <Stack.Screen
          name="BottomSheet"
          component={BottomSheetScreen}
          options={{
            headerLeft: () => <BackButton />,
            headerTitle: () => <Header title={'BottomSheet Demo'} autofocus />,
          }}
        />
        <Stack.Screen
          name="UseTimedAction"
          component={UseTimedActionScreen}
          options={{
            headerLeft: () => <BackButton />,
            headerTitle: () => (
              <Header title={'useTimedAction Demo'} autofocus />
            ),
          }}
        />
        <Stack.Screen
          name="UseAMAContext"
          component={UseAMAContextScreen}
          options={{
            headerLeft: () => <BackButton />,
            headerTitle: () => (
              <Header title={'useAMAContext Demo'} autofocus />
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
