import * as React from "react";
import { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Accordion } from "../components/Accordion";
import { CTAPressable } from "../components/CTAPressable";
import { Pressable } from "../components/Pressable";
import { Spacer } from "../components/Spacer";
import { Switch } from "../components/Switch";
import { Text } from "../components/Text";
import { theme } from "../theme";

export const InteractionsScreen = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setTimeout(() => setIsLoading(false), 1000);
    }
  }, [isLoading]);

  return (
    <SafeAreaView>
      <View style={styles.view}>
        <Text mt={8} mb={8}>
          This screen showcases the accessibility checks AMA performs on
          interactive elements. For instance, if AMA detects a UI change after a
          tap, it verifies whether the element’s accessibility state (ARIA
          state) is updated correctly. If not, the issue is highlighted for
          review.
        </Text>
        <Spacer height="big" />
        {/*
         *	To fix this issue we need to handle the aria-checked state
         * aria-checked={isChecked}
         */}
        <Pressable
          style={{ flexDirection: "row" }}
          onPress={() => setIsChecked((value) => !value)}
          role="switch"
        >
          <Text style={{ flex: 1, alignSelf: "center" }}>Test switch</Text>
          <Switch
            value={isChecked}
            onValueChange={(checked) => setIsChecked(checked)}
            label="Test switch"
          />
        </Pressable>
        <Spacer height="normal" />
        {/*
         * To fix this handle the aria-checked attribute inside the Accordion component
         */}
        <Accordion title="This is an accordion">
          <Text>This is the content of the accordion</Text>
        </Accordion>
        <Spacer height="normal" />
        {/*
         * To fix this handle the aria-busy attribute inside the CTAPressable component
         */}
        <CTAPressable
          onPress={() => setIsLoading(true)}
          isLoading={isLoading}
          title="Press me"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  view: {
    paddingHorizontal: theme.padding.big,
    paddingTop: theme.padding.big,
  },
  textTransform: {
    textTransform: "uppercase",
  },
  textWithOnPress: {
    marginTop: 12,
    lineHeight: 24,
  },
  container: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 32,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
  },
  paragraph: {
    fontSize: 15,
  },
  checkbox: {
    margin: 8,
    height: 24,
    width: 24,
  },
});
