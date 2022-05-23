import React from 'react';
import type { ViewStyle } from 'react-native';

import { useAMAContext } from '../components/AMAProvider';
import { isMotionAnimation } from '../utils/isMotionAnimation';

export const useAccessibleAnimationDuration = () => {
  const { isReduceMotionEnabled } = useAMAContext();

  const getAccessibleDuration = React.useCallback(
    (propertyToAnimate: keyof ViewStyle, defaultDuration: number) => {
      if (isReduceMotionEnabled && isMotionAnimation(propertyToAnimate)) {
        return { duration: 0 };
      }

      return {
        duration: defaultDuration,
      };
    },
    [isReduceMotionEnabled],
  );

  return {
    getAccessibleDuration,
  };
};
