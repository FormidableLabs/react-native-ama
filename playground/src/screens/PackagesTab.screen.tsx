import { StatusBar } from "expo-status-bar";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../components/Header";
import { ListItem } from "../components/ListItem";
import { Spacer } from "../components/Spacer";
import { theme } from "../theme";

export const PackagesTabScreen = () => {
  return (
    <>
      <StatusBar style="light" />
      <SafeAreaView style={theme.safeAreaViewBlue} edges={["top"]} />
      <SafeAreaView
        style={theme.safeAreaView}
        edges={["left", "right", "bottom"]}
      >
        <ScrollView style={styles.list}>
          <Header title="Packages" />
          <View style={styles.group}>
            <ListItem
              title="@react-native-ama/bottom-sheet"
              navigateTo="AmaBottomSheet"
            />
            <ListItem
              title="@react-native-ama/forms"
              border={false}
              navigateTo="AmaForms"
            />
          </View>

          <Spacer height="big" />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: theme.padding.big,
    backgroundColor: theme.color.white,
  },
  group: {
    borderWidth: 1,
    borderColor: theme.color.gray,
    borderRadius: theme.border,
  },
});
