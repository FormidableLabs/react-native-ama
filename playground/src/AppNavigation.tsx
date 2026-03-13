import { useAMAContext } from "@react-native-ama/core";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import React from "react";
import { BackButton } from "./components/BackButton";
import { Header } from "./components/Header";
import { InteractionsScreen } from "./screens/Interactions.screen";
import { PressableScreen } from "./screens/Pressable.screen";
import { TextScreen } from "./screens/Text.screen";
import { theme } from "./theme";
import { FormScreen } from "./screens/Form.screen";
import { AmaBottomSheetScreen } from "./screens/AmaBottomSheet.screen";
import { AmaFormScreen } from "./screens/AmaForm.screen";
import { PlaygroundTabScreen } from "./screens/PlaygroundTab.screen";
import { PackagesTabScreen } from "./screens/PackagesTab.screen";

const HomeTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="PlaygroundTab"
        component={PlaygroundTabScreen}
        options={{ title: "Playground", headerShown: false }}
      />
      <Tab.Screen
        name="PackagesTab"
        component={PackagesTabScreen}
        options={{ title: "Packages", headerShown: false }}
      />
    </Tab.Navigator>
  );
};

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
          name="HomeTabs"
          component={HomeTabs}
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
          name="Form"
          component={FormScreen}
          options={{
            headerTitle: () => (
              <Header noMargin title={"Forms"} autofocus white />
            ),
          }}
        />
        <Stack.Screen
          name="AmaBottomSheet"
          component={AmaBottomSheetScreen}
          options={{
            headerTitle: () => (
              <Header
                noMargin
                title={"@react-native-ama/bottom-sheet"}
                autofocus
                white
              />
            ),
          }}
        />
        <Stack.Screen
          name="AmaForms"
          component={AmaFormScreen}
          options={{
            headerTitle: () => (
              <Header
                noMargin
                title={"@react-native-ama/forms"}
                autofocus
                white
              />
            ),
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<HomeTabsParamList>();

const BaseNavigatorOptions: NativeStackNavigationOptions = {
  headerTitleAlign: "center",
  headerBackVisible: false,
};

export type RootStackParamList = {
  HomeTabs: undefined;
  Pressable: undefined;
  TouchableOpacity: undefined;
  TouchableWithoutFeedback: undefined;
  Interactions: undefined;
  Text: undefined;
  Form: undefined;
  AmaBottomSheet: undefined;
  AmaForms: undefined;
};

type HomeTabsParamList = {
  PlaygroundTab: undefined;
  PackagesTab: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
