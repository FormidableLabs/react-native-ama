import type { ViewStyle } from 'react-native';

import { MOTION_ANIMATIONS } from '../internal/costants';

export const isMotionAnimation = (key: keyof ViewStyle) => {
  MOTION_ANIMATIONS.includes(key);
};
