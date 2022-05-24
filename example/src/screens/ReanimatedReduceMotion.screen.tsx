import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  ClickableSpan,
  Span,
  isMotionAnimation,
  useAMAContext,
  useAnimationDuration,
  useReanimatedTiming,
} from 'react-native-ama';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { CTAPressable } from '../components/CTAPressable';
import { Spacer } from '../components/Spacer';
import { theme } from '../theme';

export const ReanimatedReduceMotionScreen = () => {
  const value = useSharedValue(0);
  const { withTiming, withSpring } = useReanimatedTiming();

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: value.value * 255 }],
    };
  });

  const testWithTiming = () => {
    value.value = withTiming('translateX', Math.random(), { duration: 300 });
  };

  const testWithSpring = () => {
    value.value = withSpring('translateX', Math.random());
  };

  return (
    <View style={styles.view}>
      <Spacer height="big" />
      <Span style={styles.intro}>
        This example shows how to use the{' '}
        <ClickableSpan onPress={() => {}}>getAnimationDuration</ClickableSpan>{' '}
        with Reanimated for a more accessible animations.
      </Span>
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
  intro: {
    lineHeight: theme.lineHeight.medium,
  },
});
