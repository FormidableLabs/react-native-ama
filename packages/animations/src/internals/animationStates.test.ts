import { Animated } from 'react-native';
import { interpolateAnimationStates } from './animationStates';

const makeValue = () => {
  const value = new Animated.Value(0);
  // react-native mock exposes .interpolate; ensure it returns something
  return value;
};

describe('interpolateAnimationStates', () => {
  it('interpolates scalar properties using the progress value', () => {
    const progress = makeValue();
    const reduceMotionProgress = makeValue();
    const result = interpolateAnimationStates(
      { opacity: 0 },
      { opacity: 1 },
      false,
      progress,
      reduceMotionProgress,
    );

    expect(result).toHaveProperty('opacity');
    expect(result.__hasOnlyMotionAnimation).toBe(false);
  });

  it('uses reduceMotionProgressValue for motion properties when reduce motion is enabled', () => {
    const progress = makeValue();
    const reduceMotionProgress = makeValue();
    const result = interpolateAnimationStates(
      { translateX: 0 },
      { translateX: 100 },
      true,
      progress,
      reduceMotionProgress,
    );

    expect(result).toHaveProperty('translateX');
    expect(result.__hasOnlyMotionAnimation).toBe(true);
  });

  it('handles array values (transform arrays) recursively', () => {
    const progress = makeValue();
    const reduceMotionProgress = makeValue();
    const result = interpolateAnimationStates(
      { transform: [{ translateX: 0 }, { scale: 1 }] },
      { transform: [{ translateX: 100 }, { scale: 2 }] },
      false,
      progress,
      reduceMotionProgress,
    );

    expect(Array.isArray(result.transform)).toBe(true);
    expect(result.transform).toHaveLength(2);
    expect(result.transform[0]).toHaveProperty('translateX');
    expect(result.transform[1]).toHaveProperty('scale');
  });

  it('sets __hasOnlyMotionAnimation false when mixing motion and non-motion props', () => {
    const progress = makeValue();
    const reduceMotionProgress = makeValue();
    const result = interpolateAnimationStates(
      { opacity: 0, translateX: 0 },
      { opacity: 1, translateX: 100 },
      false,
      progress,
      reduceMotionProgress,
    );

    expect(result.__hasOnlyMotionAnimation).toBe(false);
  });
});
