import { useAMAContext } from '@react-native-ama/core';
import { interpolateAnimationStates } from '@react-native-ama/internal';
import * as React from 'react';
import type { ViewStyle } from 'react-native';
import { Animated } from 'react-native';

type UseAnimation = {
  from: ViewStyle;
  to: ViewStyle;
  duration: number;
  useNativeDriver: boolean;
  skipIfReduceMotionEnabled?: boolean;
};

export const useAnimation = ({
  duration,
  useNativeDriver,
  from,
  to,
  skipIfReduceMotionEnabled = false,
}: UseAnimation) => {
  const { isReduceMotionEnabled } = useAMAContext();
  const progress = React.useRef(new Animated.Value(0)).current;
  const reduceMotionProgress = React.useRef(new Animated.Value(0)).current;
  const hasOnlyMotionAnimation = React.useRef(false);

  const play = (toValue: number = 1) => {
    if (isReduceMotionEnabled) {
      Animated.timing(reduceMotionProgress, {
        duration: 0,
        toValue,
        useNativeDriver,
      }).start();
    }

    const animationDuration =
      isReduceMotionEnabled &&
      (hasOnlyMotionAnimation.current || skipIfReduceMotionEnabled)
        ? 0
        : duration;

    return Animated.timing(progress, {
      duration: animationDuration,
      toValue,
      useNativeDriver,
    });
  };

  const { __hasOnlyMotionAnimation, ...style } = interpolateAnimationStates(
    from,
    to,
    isReduceMotionEnabled,
    progress,
    reduceMotionProgress,
  );

  hasOnlyMotionAnimation.current = __hasOnlyMotionAnimation;

  return {
    animatedStyle: style,
    progress,
    play,
  };
};
