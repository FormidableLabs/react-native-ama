import type { ViewStyle } from 'react-native';
import { withTiming } from 'react-native-reanimated';

import { MOTION_ANIMATIONS } from '../internal/costants';
import { useAMAContext } from '../providers/AMAProvider';

type UseReanimatedAnimationBuilder = {
  from: AnimatedViewStyle;
  to: AnimatedViewStyle;
  exitFrom?: AnimatedViewStyle;
  duration: number;
};

export const useReanimatedAnimationBuilder = ({
  from,
  to,
  exitFrom,
  duration,
}: UseReanimatedAnimationBuilder) => {
  const { isReduceMotionEnabled } = useAMAContext();

  const animationBuilder = (
    initial: AnimatedViewStyle,
    final: AnimatedViewStyle,
  ) => {
    return (values: Record<string, any>) => {
      'worklet';

      const animations = (function generateAnimations(startValues, endValues) {
        return Object.keys(startValues).reduce((outputAnimation, key) => {
          const k: keyof AnimatedViewStyle = key as keyof AnimatedViewStyle;
          const toValue = endValues[k];
          const value = startValues[k];
          const mappedToValue =
            typeof toValue === 'string' ? values[toValue] || 0 : toValue;

          const realDuration =
            isReduceMotionEnabled && MOTION_ANIMATIONS.includes(k)
              ? 0
              : duration;
          const newValue = Array.isArray(value)
            ? value.map((item, index) =>
                generateAnimations(item as ViewStyle, endValues?.[k]?.[index]),
              )
            : withTiming(mappedToValue, {
                duration: realDuration,
              });

          outputAnimation[k] = newValue;

          return outputAnimation;
        }, {} as AnimatedViewStyle);
      })(initial, final);

      const initialValues = (function generateInitialValues(startValues) {
        return Object.entries(startValues).reduce((newList, [key, value]) => {
          const mappedValue = typeof value === 'string' ? values[value] : value;
          const newValue = Array.isArray(value)
            ? value.map(item => generateInitialValues(item))
            : mappedValue;

          newList[key] = newValue;

          return newList;
        }, {} as AnimatedViewStyle);
      })(initial);

      return {
        initialValues,
        animations,
      };
    };
  };

  return {
    entering: animationBuilder(from, to),
    exiting: animationBuilder(to, exitFrom || from),
  };
};

export type AnimatedViewStyle = {
  [key in keyof Omit<ViewStyle, 'transform'>]:
    | ViewStyle[key]
    | ReanimatedValues;
} & {
  transform?:
    | (
        | PerpectiveTransform
        | RotateTransform
        | RotateXTransform
        | RotateYTransform
        | RotateZTransform
        | ScaleTransform
        | ScaleXTransform
        | ScaleYTransform
        | TranslateXTransform
        | TranslateYTransform
        | SkewXTransform
        | SkewYTransform
        | MatrixTransform
      )[]
    | undefined;
};

interface PerpectiveTransform {
  perspective: number | ReanimatedValues;
}

interface RotateTransform {
  rotate: string | ReanimatedValues;
}

interface RotateXTransform {
  rotateX: string | ReanimatedValues;
}

interface RotateYTransform {
  rotateY: string | ReanimatedValues;
}

interface RotateZTransform {
  rotateZ: string | ReanimatedValues;
}

interface ScaleTransform {
  scale: number | ReanimatedValues;
}

interface ScaleXTransform {
  scaleX: number | ReanimatedValues;
}

interface ScaleYTransform {
  scaleY: number | ReanimatedValues;
}

interface TranslateXTransform {
  translateX: number | ReanimatedValues;
}

interface TranslateYTransform {
  translateY: number | ReanimatedValues;
}

interface SkewXTransform {
  skewX: string | ReanimatedValues;
}

interface SkewYTransform {
  skewY: string | ReanimatedValues;
}

interface MatrixTransform {
  matrix: number[] | ReanimatedValues;
}

type ReanimatedValues =
  | 'targetOriginX'
  | 'targetOriginY'
  | 'targetWidth'
  | 'targetHeight'
  | 'targetGlobalOriginX'
  | 'targetGlobalOriginY'
  | 'currentOriginX'
  | 'currentOriginY'
  | 'currentWidth'
  | 'currentHeight'
  | 'currentGlobalOriginX'
  | 'currentGlobalOriginY'
  | 'windowHeight'
  | 'windowWidth';
