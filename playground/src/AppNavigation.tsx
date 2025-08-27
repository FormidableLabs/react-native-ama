import { useAMAContext } from '@react-native-ama/core';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from '@react-navigation/native-stack';
import React from 'react';
import { BackButton } from './components/BackButton';
import { Header } from './components/Header';
import { BottomSheetScreen } from './screens/BottomSheet.screen';
import { CarouselScreen } from './screens/Carousel.screen';
import { ExpandablePressableScreen } from './screens/ExpandablePressableScreen';
import { FlatListScreen } from './screens/FlatList.screen';
import { FlatListDynamicScreen } from './screens/FlatListDynamic.screen';
import { FlatListStaticScreen } from './screens/FlatListStatic.screen';
import { FormScreen } from './screens/Form.screen';
import { HomeScreen } from './screens/Home.screen';
import { LoadingScreen } from './screens/Loading.screen';
import { PressableScreen } from './screens/Pressable.screen';
import { UseAnimationDurationScreen } from './screens/UseAnimationDurationScreen';
import { UseAnimationScreen } from './screens/UseAnimationScreen';
import { UseReanimatedAnimationBuilderScreen } from './screens/UseReanimatedAnimationBuilderScreen';
import { UseReanimatedTimingScreen } from './screens/UseReanimatedTimingScreen';
import { UseTimedActionScreen } from './screens/UseTimedAction.screen';
import { theme } from './theme';

export const AppNavigator = () => {
  const { reactNavigationScreenOptions: amaAnimationScreenOptions } =
    useAMAContext();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          ...BaseNavigatorOptions,
          ...amaAnimationScreenOptions,
          headerStyle: {
            backgroundColor: theme.color.header,
          },
          headerLeft: () => <BackButton />,
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Pressable"
          component={PressableScreen}
          options={{
            headerTitle: () => (
              <Header noMargin title={'Pressable elements'} autofocus white />
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

export type RootStackParamList = {
  Home: undefined;
  Pressable: undefined;
  TouchableOpacity: undefined;
  TouchableWithoutFeedback: undefined;
  Text: undefined;
  UseAnimation: undefined;
  UseAnimationDuration: undefined;
  UseReanimatedTiming: undefined;
  UseReanimatedAnimationBuilder: undefined;
  Form: undefined;
  FlatList: undefined;
  SwitchListItem: undefined;
  ExpandablePressable: undefined;
  FlatListDynamic: undefined;
  FlatListStatic: undefined;
  BottomSheet: undefined;
  Carousel: undefined;
  Loading: undefined;
  UseTimedAction: undefined;
  UseAMAContext: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
