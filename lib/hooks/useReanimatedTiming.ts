import type { ViewStyle } from 'react-native';
import {
  AnimationCallback,
  withSpring as ReanimateWithSpring,
  withTiming as ReanimateWithTiming,
  WithSpringConfig,
  WithTimingConfig,
} from 'react-native-reanimated';

import { useAMAContext } from '../providers/AMAProvider';
import { isMotionAnimation } from '../utils/isMotionAnimation';

export const useReanimatedTiming = () => {
  const { isReduceMotionEnabled } = useAMAContext();

  const withTiming = (
    propertyKey: keyof ViewStyle,
    toValue: number,
    config: WithTimingConfig = {},
    callback?: AnimationCallback,
  ) => {
    if (isReduceMotionEnabled && isMotionAnimation(propertyKey)) {
      config.duration = 0;
    }

    return ReanimateWithTiming(toValue, config, callback);
  };

  const withSpring = (
    propertyKey: keyof ViewStyle,
    toValue: number,
    config?: WithSpringConfig,
    callback?: AnimationCallback,
  ) => {
    if (isReduceMotionEnabled && isMotionAnimation(propertyKey)) {
      return ReanimateWithTiming(toValue, { duration: 0 });
    }

    return ReanimateWithSpring(toValue, config, callback);
  };

  return {
    withTiming,
    withSpring,
  };
};
