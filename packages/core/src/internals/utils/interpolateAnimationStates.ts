import type { Animated, ViewStyle } from 'react-native';
import { MOTION_ANIMATIONS } from './constants';

export const interpolateAnimationStates = (
  from: Record,
  to: Record,
  isReduceMotionEnabled: boolean,
  progressValue: Animated.Value,
  reduceMotionProgressValue: Animated.Value,
): Record => {
  return Object.keys(from).reduce(
    (outputAnimation, key) => {
      const isMotionAnimation = MOTION_ANIMATIONS.includes(
        key as keyof ViewStyle,
      );
      const progressKey =
        isReduceMotionEnabled && isMotionAnimation
          ? reduceMotionProgressValue
          : progressValue;

      if (Array.isArray(from[key])) {
        outputAnimation[key] = from[key].map(
          (animationObject: Record, index: number) => {
            const { __hasOnlyMotionAnimation, ...style } =
              interpolateAnimationStates(
                animationObject,
                to[key][index],
                isReduceMotionEnabled,
                progressValue,
                reduceMotionProgressValue,
              );

            outputAnimation.__hasOnlyMotionAnimation =
              outputAnimation.__hasOnlyMotionAnimation &&
              __hasOnlyMotionAnimation;

            return style;
          },
        );
      } else {
        outputAnimation[key] = progressKey.interpolate({
          inputRange: [0, 1],
          // @ts-ignore
          outputRange: [from[key], to[key]],
        });

        outputAnimation.__hasOnlyMotionAnimation =
          outputAnimation.__hasOnlyMotionAnimation && isMotionAnimation;
      }

      return outputAnimation;
    },
    { __hasOnlyMotionAnimation: true } as Record,
  );
};
