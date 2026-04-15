import { StatusBar } from "expo-status-bar";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../components/Header";
import { ListItem } from "../components/ListItem";
import { Spacer } from "../components/Spacer";
import { theme } from "../theme";
import { Text } from "../components/Text";

export const PackagesTabScreen = () => {
  return (
    <>
      <StatusBar style="light" />
      <SafeAreaView style={theme.safeAreaViewBlue} edges={["top"]} />
      <SafeAreaView
        style={theme.safeAreaView}
        edges={["left", "right", "bottom"]}
      >
        <View style={styles.header}>
          <Header title="Packages" white />

          <Text white>
            This section showcases packages developed by the React Native AMA team.
          </Text>
          <Text white>
            Each package includes a demo screen and documentation to help you get started.
          </Text>
        </View>

        <ScrollView style={styles.list}>
          <View style={styles.group}>
            <ListItem
              title="@react-native-ama/core"
              navigateTo="AmaCore"
            />
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
  header: {
    backgroundColor: theme.color.header,
    paddingHorizontal: theme.padding.big,
    paddingBottom: theme.padding.big,
  },
  list: {
    paddingHorizontal: theme.padding.big,
    backgroundColor: theme.color.white,
    paddingTop: theme.padding.big,
  },
  group: {
    borderWidth: 1,
    borderColor: theme.color.gray,
    borderRadius: theme.border,
  },
});
