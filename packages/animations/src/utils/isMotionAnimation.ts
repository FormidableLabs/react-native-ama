import { MOTION_ANIMATIONS, type MotionAnimationKey } from '~internal';

export const isMotionAnimation = (key: MotionAnimationKey) => {
  return MOTION_ANIMATIONS.includes(key);
};
