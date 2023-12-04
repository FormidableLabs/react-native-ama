import {
  MOTION_ANIMATIONS,
  type MotionAnimationKey,
} from '@react-native-ama/internal';

export const isMotionAnimation = (key: MotionAnimationKey) => {
  return MOTION_ANIMATIONS.includes(key);
};
