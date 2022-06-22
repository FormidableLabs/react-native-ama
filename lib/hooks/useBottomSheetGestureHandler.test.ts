import { renderHook } from '@testing-library/react-hooks';

import { useBottomSheetGestureHandler } from './useBottomSheetGestureHandler';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useBottomSheetGestureHandler', () => {
  it('onStarts stores the current translateY position', () => {
    const translateY = { value: 42 };
    const { result } = renderHook(() =>
      useBottomSheetGestureHandler({
        translateY,
        closeDistance: 0.5,
        contentHeight: { value: 100 },
        onRequestClose: () => {},
      }),
    );

    const context = { y: 0 };
    // @ts-ignore
    result.current.gestureHandler.onStart(null, context);

    expect(context.y).toBe(42);
  });

  it('onActive updates the translateY limiting it to be >= 0', () => {
    const translateY = { value: 42 };
    const { result } = renderHook(() =>
      useBottomSheetGestureHandler({
        translateY,
        closeDistance: 0.5,
        contentHeight: { value: 100 },
        onRequestClose: () => {},
      }),
    );

    const context = { y: 0 };
    // @ts-ignore
    result.current.gestureHandler.onStart(null, context);
    // @ts-ignore
    result.current.gestureHandler.onActive({ translationY: 100 }, context);

    expect(translateY.value).toBe(142);

    // @ts-ignore
    result.current.gestureHandler.onActive({ translationY: -500 }, context);

    expect(translateY.value).toBe(0);
  });

  describe('onEnd', () => {
    it('animates back translateY to 0 when the distance is less than the specified one', () => {
      const translateY = { value: 0 };
      const { result } = renderHook(() =>
        useBottomSheetGestureHandler({
          translateY,
          closeDistance: 0.5,
          contentHeight: { value: 500 },
          onRequestClose: () => {},
        }),
      );

      const context = { y: 0 };

      // @ts-ignore
      result.current.gestureHandler.onActive({ translationY: 249 }, context);
      // @ts-ignore
      result.current.gestureHandler.onEnd(null);

      expect(translateY.value).toBe(0);
      expect(withTiming).toHaveBeenCalledWith(0, { duration: 300 });
    });

    it('calls the onRequestClose event when the distance is at least the requested one', () => {
      const translateY = { value: 0 };
      const onRequestClose = jest.fn();

      const { result } = renderHook(() =>
        useBottomSheetGestureHandler({
          translateY,
          closeDistance: 0.5,
          contentHeight: { value: 500 },
          onRequestClose,
        }),
      );

      const context = { y: 0 };

      // @ts-ignore
      result.current.gestureHandler.onActive({ translationY: 250 }, context);
      // @ts-ignore
      result.current.gestureHandler.onEnd(null);

      expect(runOnJS).toHaveBeenCalledWith(onRequestClose);
      expect(onRequestClose).toHaveBeenCalledWith();
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
