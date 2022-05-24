import { renderHook } from '@testing-library/react-hooks';
import * as ReactNativeReanimated from 'react-native-reanimated';

import * as AMAProvider from '../components/AMAProvider';
import { MOTION_ANIMATIONS } from '../internal/costants';
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
      });

      const reanimatedWithTiming = jest.spyOn(
        ReactNativeReanimated,
        'withTiming',
      );

      const { result } = renderHook(() => useReanimatedTiming());

      result.current.withTiming('left', 42, { duration: 100 });
      expect(reanimatedWithTiming).toHaveBeenCalledWith(42, { duration: 100 });
    });

    it.each(MOTION_ANIMATIONS)(
      'calls reanimated withTiming function with duration = 0 for motion animation when isReduceMotionEnabled is true',
      key => {
        jest.spyOn(AMAProvider, 'useAMAContext').mockReturnValue({
          ...amaContextValues,
          isReduceMotionEnabled: true,
        });

        const reanimatedWithTiming = jest.spyOn(
          ReactNativeReanimated,
          'withTiming',
        );

        const { result } = renderHook(() => useReanimatedTiming());

        result.current.withTiming(key as any, 42, { duration: 100 });
        expect(reanimatedWithTiming).toHaveBeenCalledWith(42, { duration: 0 });
      },
    );
  });

  describe('withSpring', () => {
    it('calls reanimated withSpring function with the give parameters when isReduceMotionEnabled is false', () => {
      jest.spyOn(AMAProvider, 'useAMAContext').mockReturnValue({
        ...amaContextValues,
        isReduceMotionEnabled: false,
      });

      const reanimatedWithSpring = jest.spyOn(
        ReactNativeReanimated,
        'withSpring',
      );

      const { result } = renderHook(() => useReanimatedTiming());

      result.current.withSpring('left', 42, { damping: 42 });
      expect(reanimatedWithSpring).toHaveBeenCalledWith(42, { damping: 42 });
    });

    it.each(MOTION_ANIMATIONS)(
      'calls reanimated withTiming function with duration = 0 for motion animation when isReduceMotionEnabled is true',
      key => {
        jest.spyOn(AMAProvider, 'useAMAContext').mockReturnValue({
          ...amaContextValues,
          isReduceMotionEnabled: true,
        });

        const reanimatedWithTiming = jest.spyOn(
          ReactNativeReanimated,
          'withTiming',
        );

        const reanimatedWithSpring = jest.spyOn(
          ReactNativeReanimated,
          'withSpring',
        );

        const { result } = renderHook(() => useReanimatedTiming());

        result.current.withTiming(key as any, 42, { duration: 100 });

        expect(reanimatedWithTiming).toHaveBeenCalledWith(42, { duration: 0 });
        expect(reanimatedWithSpring).not.toHaveBeenCalled();
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

jest.mock('../components/AMAProvider');
jest.mock('react-native-reanimated');
