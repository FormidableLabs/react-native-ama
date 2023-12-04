import * as AMAProvider from '@react-native-ama/core';
import { renderHook } from '@testing-library/react-native';

import { useReanimatedAnimationBuilder } from './useReanimatedAnimationBuilder';

beforeEach(() => {
  jest.clearAllMocks();
});

let withTiming: jest.Mock;

describe('useReanimatedAnimationBuilder', () => {
  describe('entering animation', () => {
    it('handles the custom reanimated params', () => {
      const { result } = renderHook(() =>
        useReanimatedAnimationBuilder({
          from: { transform: [{ translateY: 'targetHeight' }], opacity: 0 },
          to: {
            transform: [{ translateY: -42 }],
            opacity: 1,
          },
          duration: 300,
        }),
      );

      expect(
        result.current.entering({
          targetHeight: 42,
        } as any),
      ).toEqual({
        animations: {
          opacity: 1,
          transform: [{ translateY: -42 }],
        },
        initialValues: { opacity: 0, transform: [{ translateY: 42 }] },
      });
    });

    it('generates the animation with duration 0 for motion ones', () => {
      jest.spyOn(AMAProvider, 'useAMAContext').mockReturnValue({
        isReduceMotionEnabled: true,
      } as any);

      const { result } = renderHook(() =>
        useReanimatedAnimationBuilder({
          from: { transform: [{ translateY: 'targetHeight' }], opacity: 0 },
          to: {
            transform: [{ translateY: -42 }],
            opacity: 1,
          },
          duration: 300,
        }),
      );

      result.current.entering({
        targetHeight: 42,
      } as any);

      expect(withTiming).toHaveBeenCalledTimes(2);
      expect(withTiming).toHaveBeenNthCalledWith(1, -42, {
        duration: 0,
      });
      expect(withTiming).toHaveBeenNthCalledWith(2, 1, {
        duration: 300,
      });
    });
  });

  describe('exiting animation', () => {
    it('reverse the from/to animation', () => {
      const { result } = renderHook(() =>
        useReanimatedAnimationBuilder({
          from: { transform: [{ translateY: 'targetHeight' }], opacity: 0 },
          to: {
            transform: [{ translateY: -42 }],
            opacity: 1,
          },
          duration: 300,
        }),
      );

      expect(
        result.current.exiting({
          targetHeight: 42,
        } as any),
      ).toEqual({
        animations: {
          opacity: 0,
          transform: [{ translateY: 42 }],
        },
        initialValues: { opacity: 1, transform: [{ translateY: -42 }] },
      });
    });

    it('allows specifying a different start animation', () => {
      const { result } = renderHook(() =>
        useReanimatedAnimationBuilder({
          from: { transform: [{ translateY: 'targetHeight' }], opacity: 0 },
          exitFrom: {
            transform: [{ translateY: 0 }],
            opacity: 0.5,
          },
          to: { transform: [{ translateY: -42 }], opacity: 1 },
          duration: 300,
        }),
      );

      expect(
        result.current.exiting({
          targetHeight: 42,
        } as any),
      ).toEqual({
        animations: {
          opacity: 0.5,
          transform: [{ translateY: 0 }],
        },
        initialValues: { opacity: 1, transform: [{ translateY: -42 }] },
      });
    });

    it('generates the animation with duration 0 for motion ones', () => {
      jest.spyOn(AMAProvider, 'useAMAContext').mockReturnValue({
        isReduceMotionEnabled: true,
      } as any);

      const { result } = renderHook(() =>
        useReanimatedAnimationBuilder({
          from: { transform: [{ translateY: 'targetHeight' }], opacity: 0 },
          to: { transform: [{ translateY: -42 }], opacity: 1 },
          duration: 300,
        }),
      );

      result.current.exiting({ targetHeight: 42 } as any);

      expect(withTiming).toHaveBeenCalledTimes(2);
      expect(withTiming).toHaveBeenNthCalledWith(1, 42, {
        duration: 0,
      });
      expect(withTiming).toHaveBeenNthCalledWith(2, 0, {
        duration: 300,
      });
    });
  });
});

function mockReanimated() {
  withTiming = jest.fn(value => value);

  return {
    withTiming,
  };
}

jest.mock('react-native-reanimated', () => mockReanimated());
