import type { ViewStyle } from 'react-native';

export type MotionAnimationKey = Partial<keyof ViewStyle> | 'scale';

export const MOTION_ANIMATIONS: MotionAnimationKey[] = [
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
  'padding',
  'paddingBottom',
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'paddingVertical',
  'paddingHorizontal',
  'margin',
  'marginBottom',
  'marginLeft',
  'marginRight',
  'marginTop',
  'marginHorizontal',
  'marginVertical',
  'rotation',
];
