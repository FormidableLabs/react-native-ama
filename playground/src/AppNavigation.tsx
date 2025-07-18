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
import { SwitchListItemScreen } from './screens/SwitchListItemScreen';
import { TextScreen } from './screens/Text.screen';
import { TouchableOpacityScreen } from './screens/TouchableOpacity.screen';
import { TouchableWithoutFeedbackScreen } from './screens/TouchableWithoutFeedback.screen';
import { UseAMAContextScreen } from './screens/UseAMAContext.screen';
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
        <Stack.Screen
          name="SwitchListItem"
          component={SwitchListItemScreen}
          options={{
            headerLeft: () => <BackButton />,
            headerTitle: () => (
              <Header title={'Switch List Item Demo'} autofocus />
            ),
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
          name="UseAnimationDuration"
          component={UseAnimationDurationScreen}
          options={{
            headerLeft: () => <BackButton />,
            headerTitle: () => (
              <Header title={'Animation Duration Demo'} autofocus />
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
          name="UseReanimatedAnimationBuilder"
          component={UseReanimatedAnimationBuilderScreen}
          options={{
            headerLeft: () => <BackButton />,
            headerTitle: () => (
              <Header title={'Reanimated Animation Builder Demo'} autofocus />
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
          name="Carousel"
          component={CarouselScreen}
          options={{
            headerLeft: () => <BackButton />,
            headerTitle: () => <Header title={'Carousel Demo'} autofocus />,
          }}
        />
        <Stack.Screen
          name="Loading"
          component={LoadingScreen}
          options={{
            headerLeft: () => <BackButton />,
            headerTitle: () => <Header title={'Carousel Demo'} autofocus />,
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
