import { StatusBar } from "expo-status-bar";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "../components/Header";
import { ListItem } from "../components/ListItem";
import { Spacer } from "../components/Spacer";
import { Text } from "../components/Text";
import { theme } from "../theme";

export const PlaygroundTabScreen = () => {
  return (
    <>
      <StatusBar style="light" />
      <SafeAreaView style={theme.safeAreaViewBlue} edges={["top"]} />
      <SafeAreaView
        style={theme.safeAreaView}
        edges={["left", "right", "bottom"]}
      >
        <View style={styles.header}>
          <Header title="Welcome to the AMA Playground" white />
          <Text white>
            This app helps you explore and learn about accessibility in React
            Native.
          </Text>
          <Text white>
            See issues, learn fixes, and improve your app’s inclusivity.
          </Text>
        </View>

        <ScrollView style={styles.list}>
          <Header title="Playground" />
          <View style={styles.group}>
            <ListItem title="Forms" navigateTo="Form" />
            <ListItem title="Images" navigateTo="Images" />
            <ListItem title="Pressable components" navigateTo="Pressable" />
            <ListItem title="Text" border={false} navigateTo="Text" />
          </View>

          <Spacer height="normal" />
          <Header title="Advanced" />

          <View style={styles.group}>
            <ListItem
              title="Interactions"
              navigateTo="Interactions"
              border={false}
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
  header: {
    backgroundColor: theme.color.header,
    paddingHorizontal: theme.padding.big,
    paddingBottom: theme.padding.big,
  },
});
