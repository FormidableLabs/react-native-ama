// https://peerlist.io/blog/engineering/creating-custom-switch-component-in-react-native
import React, { FC, useEffect, useState } from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";

const defaultStyles = {
  bgGradientColors: ["#f7f7f7", "#d2d2d2"],
  headGradientColors: ["#000", "#000"],
};

const activeStyles = {
  bgGradientColors: ["#11893d", "#21e067"],
  headGradientColors: ["#fff", "#e0e0e0"],
};

type SwitchProps = {
  value: boolean;
  onValueChange: (newValue: boolean) => void;
  label: string;
};

export const Switch: FC<SwitchProps> = ({ value, onValueChange, label }) => {
  const [animatedValue] = useState(new Animated.Value(value ? 1 : 0));

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [4, 28],
  });

  const toggleSwitch = () => {
    const newValue = !value;

    onValueChange(newValue);
  };

  const currentStyles = value ? activeStyles : defaultStyles;

  return (
    <Pressable
      role="switch"
      onPress={toggleSwitch}
      style={styles.pressable}
      hitSlop={{ left: 12, top: 12, right: 12, bottom: 12 }}
      aria-label={label}
      aria-checked={value}
    >
      <LinearGradient
        colors={currentStyles.bgGradientColors}
        style={styles.backgroundGradient}
        start={{
          x: 0,
          y: 0.2,
        }}
        end={{
          x: 0,
          y: 1.0,
        }}
      >
        <View style={styles.innerContainer}>
          <Animated.View
            style={{
              transform: [{ translateX }],
            }}
          >
            <LinearGradient
              colors={currentStyles.headGradientColors}
              style={styles.headGradient}
            />
          </Animated.View>
        </View>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    width: 56,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#c0c0c0",
  },
  backgroundGradient: {
    borderRadius: 16,
    flex: 1,
  },
  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    position: "relative",
  },
  headGradient: {
    width: 24,
    height: 24,
    borderRadius: 100,
  },
});
