import { useAMAContext } from "@react-native-ama/core";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import React from "react";
import Svg, { Path, Rect } from "react-native-svg";
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

const PlaygroundIcon = ({ color }: { color: string }) => {
  return (
    <Svg width={18} height={18} viewBox="0 0 14 14" fill="none">
      <Path
        d="M 3.40625,1 C 2.65262,1.047193 1.998524,1.7448953 2,2.5 2.000287,3.2852156 2.714784,3.9994517 3.5,3.9994517 4.285216,3.9994517 4.999713,3.2852156 5,2.5 5.0016,1.6823545 4.222298,0.9488955 3.40625,1 z m 8,3 C 10.65262,4.0471927 9.998524,4.7448953 10,5.5 c 2.87e-4,0.7852156 0.714784,1.4994517 1.5,1.4994517 0.785216,0 1.499713,-0.7142361 1.5,-1.4994517 C 13.001599,4.6823545 12.222298,3.9488956 11.40625,4 z M 3,4.5 C 1.52901,4.5 1.134165,6.3734067 1.03125,7.375 L 0,7 0,8 5.96875,10.125 5,14 9,14 8.0625,10.875 14,13 14,12 13.0625,11.65625 C 13.226562,10.794922 13.75,7.5 12,7.5 c -1.638462,0 -1.915209,2.244501 -1.96875,3.09375 l -5.9375,-2.125 C 4.285012,7.337531 4.614,4.5 3,4.5 z"
        fill={color}
      />
    </Svg>
  );
};

const PackageIcon = ({ color }: { color: string }) => {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="3"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 3V9L12 7L15 9V3"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#0056B3",
        tabBarInactiveTintColor: "#000",
      }}
    >
      <Tab.Screen
        name="PlaygroundTab"
        component={PlaygroundTabScreen}
        options={{
          title: "Playground",
          headerShown: false,
          tabBarIcon: ({ color }) => <PlaygroundIcon color={color} />,
        }}
      />
      <Tab.Screen
        name="PackagesTab"
        component={PackagesTabScreen}
        options={{
          title: "Packages",
          headerShown: false,
          tabBarIcon: ({ color }) => <PackageIcon color={color} />,
        }}
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
