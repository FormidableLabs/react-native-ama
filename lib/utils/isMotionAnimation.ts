import { MOTION_ANIMATIONS, MotionAnimationKey } from '../internal/costants';

export const isMotionAnimation = (key: MotionAnimationKey) => {
  return MOTION_ANIMATIONS.includes(key);
};
