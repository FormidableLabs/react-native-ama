import * as React from 'react';
import type { ViewStyle } from 'react-native';
import { Animated } from 'react-native';

import { useAMAContext } from '../components/AMAProvider';
import { interpolateAnimationStates } from '../internal/interpolateAnimationStates';

type UseAccessibleAnimation = {
  from: ViewStyle;
  to: ViewStyle;
  duration: number;
  useNativeDriver: boolean;
  skipIfReduceMotionEnabled?: boolean;
};

export const useAccessibleAnimation = ({
  duration,
  useNativeDriver,
  from,
  to,
  skipIfReduceMotionEnabled = false,
}: UseAccessibleAnimation) => {
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
    );

    hasOnlyMotionAnimation.current = __hasOnlyMotionAnimation;

    return style;
  }, [from, to, isReduceMotionEnabled, progress, reduceMotionProgress]);

  return {
    animatedStyle,
    progress,
    play,
  };
};
