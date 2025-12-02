import { StatusBar } from "expo-status-bar";
import * as React from "react";
import {
  AccessibilityState,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { CTAPressable } from "../components/CTAPressable";
import { Intro } from "../components/Intro";
import { Pressable } from "../components/Pressable";
import { Spacer } from "../components/Spacer";
import { theme } from "../theme";
import { TestCase } from "../components/TestCase";

export const PressableScreen = () => {
  return (
    <SafeAreaView style={theme.safeAreaView}>
      <StatusBar style="light" />
      <ScrollView style={styles.list}>
        <Spacer height="big" />
        <Intro element="Pressable" />
        <Spacer height="big" />

        {/*
         *  Issue: NO_ACCESSIBILITY_ROLE
         *  FIX: Set a role of "button"
         */}
        <TestCase title="Test case 1: Missing role">
          <CTAPressable title="Missing role" role="" hasMaring />
        </TestCase>

        {/*
         * Issue: NO_ACCESSIBILITY_LABEL
         * FIX: Specify the aria-label property, e.g: aria-label="Go Back"
         */}
        <TestCase title="Test case 2: No accessibility label">
          <View style={{ flexDirection: "row" }}>
            <Pressable role="button" style={styles.iconOnlyButton}>
              <Svg width={32} height={32} viewBox="0 0 8.467 8.467">
                <Path
                  d="M5.283 1.907l-2.251 2.25L5.434 6.56"
                  fill="none"
                  stroke={theme.color.black}
                  strokeWidth={0.79378125}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeMiterlimit={4}
                  strokeDasharray="none"
                  strokeOpacity={1}
                />
              </Svg>
            </Pressable>
          </View>
        </TestCase>
        <Spacer height={"normal"} />

        {/*
         * Issue: MINIMUM_SIZE
         * FIX: Either increase the padding or increase the tappable area with `hitSlop`
         *           hitSlop={{ left: 10, right: 10, top: 10, bottom: 10 }}
         */}
        <TestCase title="Test case 3: Hit area too small">
          <CTAPressable
            title="X"
            style={{
              width: 24,
              height: 24,
              minHeight: 0,
              minWidth: 0,
              paddingVertical: 0,
              paddingHorizontal: 0,
            }}
            hitSlop={0}
            hasMaring
          />
        </TestCase>

        {/*
         * Issue: NO_UPPERCASE_ACCESSIBILITY_LABEL
         * FIX: Provide a normal cased  label, i.e:
         *           aria-label="add to the cart"
         */}
        <TestCase title="Test case 4: Accessibility label all upper case">
          <CTAPressable title="ADD TO THE CART" hasMaring />
        </TestCase>

        {/*
         * Issue: CONTRAST_FAILED
         * FIX: Increase the contrast ratio between the background and foreground color
         */}
        <TestCase title="Test case 5: Contrast failed">
          <CTAPressable
            title="Contrast failed"
            style={{ backgroundColor: "#e0e0e0" }}
            disabled
            hasMaring
          />
        </TestCase>

        <Spacer height={"big"} />
        <Spacer height={"big"} />
        <Spacer height={"big"} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: theme.padding.big,
  },
  checkButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  checkLabel: {
    paddingLeft: theme.padding.normal,
  },
  testButtons: {
    paddingTop: theme.padding.normal,
    flexDirection: "row",
  },
  failingButtonStyle: {
    backgroundColor: theme.color.black,
    flex: 1,
    minHeight: 48,
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.padding.normal,
  },
  failingText_all: {
    color: "#525252",
  },
  failingText_aa: {
    color: "#c70000",
  },
  failingText_aaa: {
    color: "#FF0000",
  },
  minSizeFailing: {
    backgroundColor: theme.color.black,
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.padding.normal,
    height: 40,
    flex: 1,
  },
  iconOnlyButton: {
    borderWidth: 1,
    flex: 0,
  },
});
