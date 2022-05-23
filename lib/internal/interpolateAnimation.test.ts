import {
  MOTION_ANIMATIONS,
  interpolateAnimationStates,
} from './interpolateAnimationStates';

describe('interpolateAnimationStates', () => {
  describe('Given isReduceMotionEnabled is false', () => {
    it('Then interpolate the animation using the "normal progress" Animated.Value', () => {
      const [fakeProgress, interpolate] = createFakeProgress();
      const [reduceMotionProgress, reduceMotionInterpolate] =
        createFakeProgress();

      const output = interpolateAnimationStates(
        {
          left: 100,
          opacity: 1,
        },
        { left: 0, opacity: 0 },
        false,
        fakeProgress,
        reduceMotionProgress,
      );

      expect(interpolate).toHaveBeenNthCalledWith(1, {
        inputRange: [0, 1],
        outputRange: [100, 0],
      });

      expect(interpolate).toHaveBeenNthCalledWith(2, {
        inputRange: [0, 1],
        outputRange: [1, 0],
      });

      expect(reduceMotionInterpolate).not.toHaveBeenCalled();

      expect(output).toEqual({
        left: 'done',
        opacity: 'done',
        __hasOnlyMotionAnimation: false,
      });
    });

    it('Then interpolate arrays correctly', () => {
      const [fakeProgress, interpolate] = createFakeProgress();
      const [reduceMotionProgress, reduceMotionInterpolate] =
        createFakeProgress();

      const output = interpolateAnimationStates(
        {
          transform: [{ translateX: 200 }],
          opacity: 1,
        },
        {
          transform: [{ translateX: 42 }],
          opacity: 0,
        },
        false,
        fakeProgress,
        reduceMotionProgress,
      );

      expect(interpolate).toHaveBeenNthCalledWith(1, {
        inputRange: [0, 1],
        outputRange: [200, 42],
      });

      expect(interpolate).toHaveBeenNthCalledWith(2, {
        inputRange: [0, 1],
        outputRange: [1, 0],
      });

      expect(reduceMotionInterpolate).not.toHaveBeenCalled();

      expect(output).toEqual({
        opacity: 'done',
        transform: [{ translateX: 'done' }],
        __hasOnlyMotionAnimation: false,
      });
    });
  });

  describe('Given isReduceMotionEnabled is true', () => {
    it.each(MOTION_ANIMATIONS)(
      'Then interpolate the motion animations using the "reduceMotionProgress" Animated.Value',
      motionAnimationKey => {
        const [fakeProgress, normalInterpolate] = createFakeProgress();
        const [reduceMotionProgress, reduceMotionInterpolate] =
          createFakeProgress();

        const initialState: Record<string, any> = {};
        const finalState: Record<string, any> = {};

        initialState[motionAnimationKey] = 142;
        finalState[motionAnimationKey] = 42;

        const output = interpolateAnimationStates(
          {
            ...initialState,
            opacity: 0,
          },
          { ...finalState, opacity: 1 },
          true,
          fakeProgress,
          reduceMotionProgress,
        );

        expect(normalInterpolate).toHaveBeenCalledTimes(1);
        expect(normalInterpolate).toBeCalledWith({
          inputRange: [0, 1],
          outputRange: [0, 1],
        });

        expect(reduceMotionInterpolate).toHaveBeenCalledTimes(1);
        expect(reduceMotionInterpolate).toBeCalledWith({
          inputRange: [0, 1],
          outputRange: [142, 42],
        });

        const expectedOutput: Record<string, any> = {
          opacity: 'done',
          __hasOnlyMotionAnimation: false,
        };
        expectedOutput[motionAnimationKey] = 'done';

        expect(output).toEqual(expectedOutput);
      },
    );

    it('Then interpolate arrays correctly', () => {
      const [fakeProgress, normalInterpolate] = createFakeProgress();
      const [reduceMotionProgress, reduceMotionInterpolate] =
        createFakeProgress();

      const output = interpolateAnimationStates(
        {
          transform: [{ translateX: 200 }],
          opacity: 1,
        },
        {
          transform: [{ translateX: 42 }],
          opacity: 0,
        },
        true,
        fakeProgress,
        reduceMotionProgress,
      );

      expect(normalInterpolate).toHaveBeenCalledTimes(1);
      expect(normalInterpolate).toBeCalledWith({
        inputRange: [0, 1],
        outputRange: [1, 0],
      });

      expect(reduceMotionInterpolate).toHaveBeenCalledTimes(1);
      expect(reduceMotionInterpolate).toBeCalledWith({
        inputRange: [0, 1],
        outputRange: [200, 42],
      });

      expect(output).toEqual({
        opacity: 'done',
        transform: [{ translateX: 'done' }],
        __hasOnlyMotionAnimation: false,
      });
    });
  });
});

const createFakeProgress = () => {
  const interpolateMock = jest.fn().mockReturnValue('done');

  return [
    {
      interpolate: interpolateMock,
    } as any,
    interpolateMock,
  ];
};
