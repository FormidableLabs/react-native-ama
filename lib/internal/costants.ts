import type { ViewStyle } from 'react-native';

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
