import { useAMAContext } from '@react-native-ama/core';
import React from 'react';
import {
  AnimationCallback,
  withSpring as ReanimateWithSpring,
  withTiming as ReanimateWithTiming,
  WithSpringConfig,
  WithTimingConfig,
} from 'react-native-reanimated';
import type { MotionAnimationKey } from '~internal';

import { isMotionAnimation } from '../utils/isMotionAnimation';

export const useReanimatedTiming = () => {
  const { isReduceMotionEnabled } = useAMAContext();

  const withTiming = React.useCallback(
    (
      propertyKey: MotionAnimationKey,
      toValue: number,
      config: WithTimingConfig = {},
      callback?: AnimationCallback,
    ) => {
      if (isReduceMotionEnabled && isMotionAnimation(propertyKey)) {
        config.duration = 0;
      }

      return ReanimateWithTiming(toValue, config, callback);
    },
    [isReduceMotionEnabled],
  );

  const withSpring = React.useCallback(
    (
      propertyKey: MotionAnimationKey,
      toValue: number,
      config?: WithSpringConfig,
      callback?: AnimationCallback,
    ) => {
      if (isReduceMotionEnabled && isMotionAnimation(propertyKey)) {
        return ReanimateWithTiming(toValue, { duration: 0 });
      }

      return ReanimateWithSpring(toValue, config, callback);
    },
    [isReduceMotionEnabled],
  );

  return {
    withTiming,
    withSpring,
  };
};
