import { renderHook } from '@testing-library/react-native';

import { MOTION_ANIMATIONS } from '../internal/constants';
import * as AMAProvider from '../providers/AMAProvider';
import { useReanimatedTiming } from './useReanimatedTiming';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useReanimatedTiming', () => {
  describe('withTiming', () => {
    it('calls reanimated withTiming function with the give parameters when isReduceMotionEnabled is false', () => {
      jest.spyOn(AMAProvider, 'useAMAContext').mockReturnValue({
        ...amaContextValues,
        isReduceMotionEnabled: false,
      } as any);

      const { result } = renderHook(() => useReanimatedTiming());

      result.current.withTiming('left', 42, { duration: 100 });
      expect(withTiming).toHaveBeenCalledWith(42, { duration: 100 }, undefined);
    });

    it.each(MOTION_ANIMATIONS)(
      'calls reanimated withTiming function with duration = 0 for motion animation when isReduceMotionEnabled is true',
      key => {
        jest.spyOn(AMAProvider, 'useAMAContext').mockReturnValue({
          ...amaContextValues,
          isReduceMotionEnabled: true,
        } as any);

        const { result } = renderHook(() => useReanimatedTiming());

        result.current.withTiming(key as any, 42, { duration: 100 });
        expect(withTiming).toHaveBeenCalledWith(42, { duration: 0 }, undefined);
      },
    );
  });

  describe('withSpring', () => {
    it('calls reanimated withSpring function with the give parameters when isReduceMotionEnabled is false', () => {
      jest.spyOn(AMAProvider, 'useAMAContext').mockReturnValue({
        ...amaContextValues,
        isReduceMotionEnabled: false,
      } as any);

      const { result } = renderHook(() => useReanimatedTiming());

      result.current.withSpring('left', 42, { damping: 42 });
      expect(withSpring).toHaveBeenCalledWith(42, { damping: 42 }, undefined);
    });

    it.each(MOTION_ANIMATIONS)(
      'calls reanimated withTiming function with duration = 0 for motion animation when isReduceMotionEnabled is true',
      key => {
        jest.spyOn(AMAProvider, 'useAMAContext').mockReturnValue({
          ...amaContextValues,
          isReduceMotionEnabled: true,
        } as any);

        const { result } = renderHook(() => useReanimatedTiming());

        result.current.withSpring(key as any, 42);

        expect(withSpring).not.toHaveBeenCalled();
        expect(withTiming).toHaveBeenCalledWith(42, { duration: 0 });
      },
    );
  });
});

const amaContextValues = {
  isReduceTransparencyEnabled: false,
  isBoldTextEnabled: false,
  isGrayscaleEnabled: false,
  isInvertColorsEnabled: false,
  isReduceMotionEnabled: false,
  isScreenReaderEnabled: false,
};

let withSpring: jest.Mock;
let withTiming: jest.Mock;

function mockReanimated() {
  withSpring = jest.fn();
  withTiming = jest.fn();

  return {
    withSpring,
    withTiming,
  };
}

jest.mock('../providers/AMAProvider');
jest.mock('react-native-reanimated', () => mockReanimated());
