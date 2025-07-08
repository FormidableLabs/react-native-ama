import { useAMAContext } from '@react-native-ama/core';
import React from 'react';
import type { ViewStyle } from 'react-native';
import { isMotionAnimation } from '../utils/isMotionAnimation';

export const useAnimationDuration = () => {
  const { isReduceMotionEnabled } = useAMAContext();

  const getAnimationDuration = React.useCallback(
    (propertyToAnimate: keyof ViewStyle, duration: number) => {
      return isReduceMotionEnabled && isMotionAnimation(propertyToAnimate)
        ? 0
        : duration;
    },
    [isReduceMotionEnabled],
  );

  return {
    getAnimationDuration,
  };
};
