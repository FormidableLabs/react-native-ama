import { AMAProvider } from "@react-native-ama/core";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { AppNavigator } from "./src/AppNavigation";
import { LogBox } from "react-native";

LogBox.ignoreAllLogs();

export default function App() {
  return (
    <AMAProvider>
      <StatusBar style="auto" />
      <AppNavigator />
    </AMAProvider>
  );
}
