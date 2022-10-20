import { MOTION_ANIMATIONS, MotionAnimationKey } from '../internal/constants';

export const isMotionAnimation = (key: MotionAnimationKey) => {
  return MOTION_ANIMATIONS.includes(key);
};
