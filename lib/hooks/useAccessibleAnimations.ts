import * as React from 'react';
import type { ViewStyle } from 'react-native';
import { Animated } from 'react-native';

import { useAMAContext } from '../components/AMAProvider';
import { interpolateAnimationStates } from '../internal/interpolateAnimationStates';

type UseAccessibleAnimations = {
  duration: number;
  from: ViewStyle;
  to: ViewStyle;
  useNativeDriver: boolean;
  skipIfReduceMotionEnabled?: boolean;
};

export const useAccessibleAnimations = ({
  duration,
  useNativeDriver,
  from,
  to,
  skipIfReduceMotionEnabled = false,
}: UseAccessibleAnimations) => {
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

  const animatedStyle = React.useMemo(() => {
    const { __hasOnlyMotionAnimation, ...style } = interpolateAnimationStates(
      from,
      to,
      isReduceMotionEnabled,
      progress,
      reduceMotionProgress,
      skipIfReduceMotionEnabled,
    );

    hasOnlyMotionAnimation.current = __hasOnlyMotionAnimation;

    return style;
  }, [
    from,
    to,
    isReduceMotionEnabled,
    progress,
    reduceMotionProgress,
    skipIfReduceMotionEnabled,
  ]);

  return {
    animatedStyle,
    progress,
    reduceMotionProgress,
    play,
  };
};
