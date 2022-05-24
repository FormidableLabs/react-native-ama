import React from 'react';
import type { ViewStyle } from 'react-native';

import { useAMAContext } from '../components/AMAProvider';
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
