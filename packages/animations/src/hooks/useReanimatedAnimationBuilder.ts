import { useAMAContext } from '@react-native-ama/core';
import { MOTION_ANIMATIONS } from '@react-native-ama/internal';
import type { ViewProps, ViewStyle } from 'react-native';
import {
  EntryAnimationsValues,
  EntryExitAnimationFunction,
  ExitAnimationsValues,
  StyleProps,
  withTiming,
} from 'react-native-reanimated';

export type ToAnimation = ViewProps['style'];

type UseReanimatedAnimationBuilder = {
  from: AnimatedEntryViewStyle;
  to: ToAnimation;
  exitFrom?: AnimatedExitViewStyle;
  exitTo?: ToAnimation;
  duration: number;
};

export const useReanimatedAnimationBuilder = ({
  from,
  to,
  exitFrom,
  exitTo,
  duration,
}: UseReanimatedAnimationBuilder) => {
  const { isReduceMotionEnabled } = useAMAContext();

  const animationBuilder = <InitialValues, FinalValues>(
    initial: InitialValues,
    final: FinalValues,
  ): EntryExitAnimationFunction => {
    return (values: EntryAnimationsValues | ExitAnimationsValues) => {
      'worklet';

      const animations = (function generateAnimations(startValues, endValues) {
        return Object.keys(startValues as object).reduce(
          (outputAnimation, key) => {
            const k: keyof InitialValues = key as keyof InitialValues;
            const toValue = endValues[key as keyof FinalValues];
            const value = startValues[k];
            const mappedToValue =
              // @ts-ignore
              typeof toValue === 'string' ? values[toValue] || 0 : toValue;

            const realDuration =
              isReduceMotionEnabled &&
              MOTION_ANIMATIONS.includes(key as keyof ViewStyle)
                ? 0
                : duration;
            const newValue = Array.isArray(value)
              ? value.map((item, index) =>
                  generateAnimations(
                    item as InitialValues,
                    // @ts-ignore
                    endValues?.[k]?.[index],
                  ),
                )
              : withTiming(mappedToValue, {
                  duration: realDuration,
                });

            outputAnimation[k] = newValue;

            return outputAnimation;
          },
          {} as InitialValues,
        );
      })(initial, final) as StyleProps;

      const initialValues = (function generateInitialValues(
        startValues,
      ): StyleProps {
        return Object.entries(startValues as object).reduce(
          (newList, [key, value]) => {
            const mappedValue =
              // @ts-ignore
              typeof value === 'string' ? values[value] : value;
            const newValue = Array.isArray(value)
              ? value.map(item => generateInitialValues(item as InitialValues))
              : mappedValue;

            newList[key as keyof StyleProps] = newValue;

            return newList;
          },
          {} as StyleProps,
        );
      })(initial);

      return {
        initialValues,
        animations,
      };
    };
  };

  return {
    entering: animationBuilder<AnimatedEntryViewStyle, ToAnimation>(from, to),
    exiting: animationBuilder<
      ToAnimation,
      AnimatedExitViewStyle | AnimatedEntryViewStyle
    >(exitTo || to, exitFrom || from),
  };
};

export type AnimatedEntryViewStyle = ReanimatedStyle<ReanimatedEntryValues>;
export type AnimatedExitViewStyle = ReanimatedStyle<ReanimatedExitValues>;

type ReanimatedStyle<K> = {
  [key in keyof Omit<ViewStyle, 'transform'>]: ViewStyle[key] | K;
} & {
  transform?:
    | (
        | PerspectiveTransform<K>
        | RotateTransform<K>
        | RotateXTransform<K>
        | RotateYTransform<K>
        | RotateZTransform<K>
        | ScaleTransform<K>
        | ScaleXTransform<K>
        | ScaleYTransform<K>
        | TranslateXTransform<K>
        | TranslateYTransform<K>
        | SkewXTransform<K>
        | SkewYTransform<K>
        | MatrixTransform<K>
      )[]
    | undefined;
};

type PerspectiveTransform<K> = {
  c: string | K;
};

type RotateTransform<K> = {
  rotate: string | K;
};

type RotateXTransform<K> = {
  rotateX: string | K;
};

type RotateYTransform<K> = {
  rotateY: string | K;
};

type RotateZTransform<K> = {
  rotateZ: string | K;
};

type ScaleTransform<K> = {
  scale: number | K;
};

type ScaleXTransform<K> = {
  scaleX: number | K;
};

type ScaleYTransform<K> = {
  scaleY: number | K;
};

type TranslateXTransform<K> = {
  translateX: number | K;
};

type TranslateYTransform<K> = {
  translateY: number | K;
};

type SkewXTransform<K> = {
  skewX: string | K;
};

type SkewYTransform<K> = {
  skewY: string | K;
};

type MatrixTransform<K> = {
  matrix: number[] | K;
};

type ReanimatedEntryValues = keyof EntryAnimationsValues;
type ReanimatedExitValues = keyof ExitAnimationsValues;
