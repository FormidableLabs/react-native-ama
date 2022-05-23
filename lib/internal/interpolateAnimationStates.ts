import type { Animated, ViewStyle } from 'react-native';

export const interpolateAnimationStates = (
  from: Record<string, any>,
  to: Record<string, any>,
  isReduceMotionEnabled: boolean,
  progressValue: Animated.Value,
  reduceMotionProgressValue: Animated.Value,
  skipIfReduceMotionEnabled: boolean,
): Record<string, any> => {
  return Object.keys(from).reduce(
    (outputAnimation, key) => {
      const isMotionAnimation = MOTION_ANIMATIONS.includes(
        key as keyof ViewStyle,
      );
      const progressKey =
        isReduceMotionEnabled &&
        (isMotionAnimation || skipIfReduceMotionEnabled)
          ? reduceMotionProgressValue
          : progressValue;

      if (Array.isArray(from[key])) {
        outputAnimation[key] = from[key].map(
          (animationObject: Record<string, any>, index: number) => {
            const { __hasOnlyMotionAnimation, ...style } =
              interpolateAnimationStates(
                animationObject,
                to[key][index],
                isReduceMotionEnabled,
                progressValue,
                reduceMotionProgressValue,
                skipIfReduceMotionEnabled,
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
    { __hasOnlyMotionAnimation: true } as Record<string, any>,
  );
};

export const MOTION_ANIMATIONS: (Partial<keyof ViewStyle> | 'scale')[] = [
  'left',
  'bottom',
  'top',
  'right',
  'transform',
  'translateX',
  'translateY',
  'scaleX',
  'scaleY',
  'scale',
  'width',
  'height',
  'marginTop',
];
