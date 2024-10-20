import { AMAProvider } from '@react-native-ama/core';
import { act, renderHook } from '@testing-library/react-native';
import * as React from 'react';
import { SharedValue } from 'react-native-reanimated';

import { useBottomSheetGestureHandler } from './useBottomSheetGestureHandler';

beforeEach(() => {
  jest.clearAllMocks();
});

const renderHookWrapper = ({ children }) => (
  <AMAProvider>{children}</AMAProvider>
);

describe('useBottomSheetGestureHandler', () => {
  it('onStarts stores the current translateY position', async () => {
    const translateY = { value: 42 } as SharedValue<number>;
    const { result } = renderHook(
      () =>
        useBottomSheetGestureHandler({
          translateY,
          closeDistance: 0.5,
          contentHeight: { value: 100 } as SharedValue<number>,
          dragOpacity: { value: 0 } as SharedValue<number>,
          minVelocityToClose: 0,
          overlayOpacity: 0,
          onClose: () => { },
        }),
      { wrapper: renderHookWrapper },
    );

    const context = { y: 0 };
    // @ts-ignore
    await act(() => {
      result.current.gestureHandler.onStart(null, context);
    });

    expect(context.y).toBe(42);
  });

  it('onActive updates the translateY limiting it to be >= 0', async () => {
    const translateY = { value: 42 } as SharedValue<number>;
    const { result } = renderHook(
      () =>
        useBottomSheetGestureHandler({
          dragOpacity: { value: 0 } as SharedValue<number>,
          minVelocityToClose: 0,
          overlayOpacity: 0,
          translateY,
          closeDistance: 0.5,
          contentHeight: { value: 100 } as SharedValue<number>,
          onClose: () => { },
        }),
      { wrapper: renderHookWrapper },
    );

    const context = { y: 0 };
    await act(() => {
      // @ts-ignore
      result.current.gestureHandler.onStart(null, context);
      // @ts-ignore
      result.current.gestureHandler.onActive({ translationY: 100 }, context);
    });
    expect(translateY.value).toBe(142);

    await act(() => {
      // @ts-ignore
      result.current.gestureHandler.onActive({ translationY: -500 }, context);
    });

    expect(translateY.value).toBe(0);
  });

  describe('onEnd', () => {
    it('animates back translateY to 0 when the distance is less than the specified one', async () => {
      const translateY = { value: 0 };
      const { result } = renderHook(
        () =>
          useBottomSheetGestureHandler({
            translateY,
            closeDistance: 0.5,
            contentHeight: { value: 500 },
            onClose: () => { },
            dragOpacity: { value: 0 },
            minVelocityToClose: 1000,
          } as any),
        { wrapper: renderHookWrapper },
      );

      const context = { y: 0 };
      await act(() => {
        // @ts-ignore
        result.current.gestureHandler.onActive({ translationY: 249 }, context);
        // @ts-ignore
        result.current.gestureHandler.onEnd({ velocityY: 100 });
      });
      expect(translateY.value).toBe(0);
      expect(withTiming).toHaveBeenCalledWith(0, { duration: 300 });
    });

    it('calls the onClose event when the distance is at least the requested one', async () => {
      const translateY = { value: 0 } as SharedValue<number>;
      const onClose = jest.fn();

      const { result } = renderHook(
        () =>
          useBottomSheetGestureHandler({
            translateY,
            closeDistance: 0.5,
            dragOpacity: { value: 0 } as SharedValue<number>,
            minVelocityToClose: 0,
            overlayOpacity: 0,
            contentHeight: { value: 500 } as SharedValue<number>,
            onClose,
          }),
        { wrapper: renderHookWrapper },
      );

      const context = { y: 0 };
      await act(() => {
        // @ts-ignore
        result.current.gestureHandler.onActive({ translationY: 250 }, context);
        // @ts-ignore
        result.current.gestureHandler.onEnd(null);
      });
      expect(runOnJS).toHaveBeenCalledWith(onClose);
      expect(onClose).toHaveBeenCalledWith();
      expect(withTiming).not.toHaveBeenCalled();
    });

    it('call onClose when the velocity is bigger than minVelocityToClose', async () => {
      const onClose = jest.fn();

      const translateY = { value: 0 };
      const { result } = renderHook(
        () =>
          useBottomSheetGestureHandler({
            translateY,
            closeDistance: 0.9,
            contentHeight: { value: 500 },
            onClose,
            dragOpacity: { value: 0 },
            minVelocityToClose: 1000,
          } as any),
        { wrapper: renderHookWrapper },
      );

      const context = { y: 0 };
      await act(() => {
        // @ts-ignore
        result.current.gestureHandler.onActive({ translationY: 42 }, context);
        // @ts-ignore
        result.current.gestureHandler.onEnd({ velocityY: 1001 });
      });
      expect(runOnJS).toHaveBeenCalledWith(onClose);
      expect(onClose).toHaveBeenCalledWith();
      expect(withTiming).not.toHaveBeenCalled();
    });
  });
});

let useAnimatedGestureHandler: jest.Mock;
let withTiming: jest.Mock;
let runOnJS: jest.Mock;

function mockReanimated() {
  useAnimatedGestureHandler = jest.fn(p => {
    return p;
  });

  withTiming = jest.fn(value => value);
  runOnJS = jest.fn(callback => callback);

  return {
    SharedValue: undefined,
    runOnJS,
    useAnimatedGestureHandler,
    useAnimatedStyle: jest.fn(),
    useSharedValue: jest.fn(() => {
      return { value: 0 };
    }),
    withTiming,
  };
}

jest.mock('react-native-reanimated', () => mockReanimated());
