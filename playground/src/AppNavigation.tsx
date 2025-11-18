import { useAMAContext } from "@react-native-ama/core";
import { NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import React from "react";
import { BackButton } from "./components/BackButton";
import { Header } from "./components/Header";
import { HomeScreen } from "./screens/Home.screen";
import { InteractionsScreen } from "./screens/Interactions.screen";
import { PressableScreen } from "./screens/Pressable.screen";
import { TextScreen } from "./screens/Text.screen";
import { theme } from "./theme";

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
              <Header noMargin title={"Pressable elements"} autofocus white />
            ),
          }}
        />
        <Stack.Screen
          name="Text"
          component={TextScreen}
          options={{
            headerTitle: () => (
              <Header
                noMargin
                title={"Text elements"}
                autofocus
                white
                noHeader
              />
            ),
          }}
        />
        <Stack.Screen
          name="Interactions"
          component={InteractionsScreen}
          options={{
            headerTitle: () => (
              <Header noMargin title={"Interactions"} autofocus white />
            ),
          }}
        />
        <Stack.Screen
          name="Forms"
          component={InteractionsScreen}
          options={{
            headerTitle: () => (
              <Header noMargin title={"Interactions"} autofocus white />
            ),
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const BaseNavigatorOptions: NativeStackNavigationOptions = {
  headerTitleAlign: "center",
  headerBackVisible: false,
};

export type RootStackParamList = {
  Home: undefined;
  Pressable: undefined;
  TouchableOpacity: undefined;
  TouchableWithoutFeedback: undefined;
  Interactions: undefined;
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
