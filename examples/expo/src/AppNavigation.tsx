import {
  BackButton,
  BottomSheetScreen,
  ExpandablePressableScreen,
  FlatListDynamicScreen,
  FlatListScreen,
  FlatListStaticScreen,
  FormScreen,
  Header,
  HomeScreen,
  PressableScreen,
  TextScreen,
  TouchableOpacityScreen,
  TouchableWithoutFeedbackScreen,
  UseAMAContextScreen,
  UseAnimationScreen,
  UseReanimatedTimingScreen,
  UseTimedActionScreen,
} from '@examples/shared-ui';
import { useAMAContext } from '@react-native-ama/core';
import { NavigationContainer } from '@react-navigation/native';
import {
  NativeStackNavigationOptions,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import React from 'react';

export const AppNavigator = () => {
  const { reactNavigationScreenOptions: amaAnimationScreenOptions } =
    useAMAContext();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          ...BaseNavigatorOptions,
          ...amaAnimationScreenOptions,
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

const Stack = createNativeStackNavigator<StackParamList>();

const BaseNavigatorOptions: NativeStackNavigationOptions = {
  headerTitleAlign: 'center',
  headerBackVisible: false,
};

type StackParamList = {
  Home: undefined;
  Pressable: undefined;
  TouchableOpacity: undefined;
  TouchableWithoutFeedback: undefined;
  Text: undefined;
  UseAnimation: undefined;
  UseReanimatedTiming: undefined;
  Form: undefined;
  FlatList: undefined;
  ExpandablePressable: undefined;
  FlatListDynamic: undefined;
  FlatListStatic: undefined;
  BottomSheet: undefined;
  UseTimedAction: undefined;
  UseAMAContext: undefined;
};
