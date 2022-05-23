import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  isMotionAnimation,
  useAMAContext,
  useAccessibleAnimationDuration,
} from 'react-native-ama';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { CTAPressable } from '../components/CTAPressable';
import { Spacer } from '../components/Spacer';
import { theme } from '../theme';

export const ReanimatedReduceMotionScreen = () => {
  const { getAccessibleDuration } = useAccessibleAnimationDuration();
  const { isReduceMotionEnabled } = useAMAContext();
  const value = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: value.value * 255 }],
    };
  });

  const testWithTiming = () => {
    value.value = withTiming(
      Math.random(),
      getAccessibleDuration('translateX', 300),
    );
  };

  const testWithSpring = () => {
    const to = Math.random();

    value.value =
      isReduceMotionEnabled && isMotionAnimation('left')
        ? withTiming(to, { duration: 0 })
        : withSpring(to);
  };

  return (
    <View style={styles.view}>
      <Spacer height="big" />
      <Animated.View style={[styles.box, animatedStyles]} />

      <Spacer height="big" />
      <CTAPressable title="Test: withTiming" onPress={testWithTiming} />
      <Spacer height="normal" />
      <CTAPressable title="Test: withSpring" onPress={testWithSpring} />
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    paddingHorizontal: theme.padding.big,
  },
  box: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: theme.color.mixed,
  },
});
