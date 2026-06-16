import {
  MOTION_ANIMATIONS,
  type MotionAnimationKey,
} from '../internals/animationConstants';

export const isMotionAnimation = (key: MotionAnimationKey) => {
  return MOTION_ANIMATIONS.includes(key);
};
