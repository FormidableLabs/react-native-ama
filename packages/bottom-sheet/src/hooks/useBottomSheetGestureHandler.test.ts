import { renderHook } from '@testing-library/react-native';
import { SharedValue } from 'react-native-reanimated';
import { useBottomSheetGestureHandler } from './useBottomSheetGestureHandler';

var mockWithTiming: jest.Mock;
var mockRunOnJS: jest.Mock;
var mockStartY: { value: number };

jest.mock('react-native-reanimated', () => {
  mockWithTiming = jest.fn(value => value);
  mockRunOnJS = jest.fn(callback => callback);
  mockStartY = { value: 0 };

  return {
    SharedValue: undefined,
    runOnJS: mockRunOnJS,
    useReducedMotion: jest.fn(() => false),
    useAnimatedStyle: jest.fn(),
    useSharedValue: jest.fn(() => mockStartY),
    withTiming: mockWithTiming,
  };
});

jest.mock('react-native-gesture-handler', () => {
  return {
    Gesture: {
      Pan: jest.fn(() => {
        const handler: any = {};
        handler.onStart = (cb: any) => { handler._onStart = cb; return handler; };
        handler.onUpdate = (cb: any) => { handler._onUpdate = cb; return handler; };
        handler.onEnd = (cb: any) => { handler._onEnd = cb; return handler; };
        return handler;
      }),
    },
    GestureDetector: ({ children }: any) => children,
    GestureHandlerRootView: ({ children }: any) => children,
    ScrollView: 'ScrollView',
  };
});

beforeEach(() => {
  jest.clearAllMocks();
  mockStartY = { value: 0 };
});

describe('useBottomSheetGestureHandler', () => {
  it('onStart stores the current translateY position', () => {
    const translateY = { value: 42 } as SharedValue<number>;
    const { result } = renderHook(() =>
      useBottomSheetGestureHandler({
        translateY,
        closeDistance: 0.5,
        contentHeight: { value: 100 } as SharedValue<number>,
        dragOpacity: { value: 0 } as SharedValue<number>,
        minVelocityToClose: 0,
        overlayOpacity: 0,
        onClose: () => {},
      }),
    );

    result.current.gestureHandler._onStart(null);

    expect(mockStartY.value).toBe(42);
  });

  it('onUpdate updates the translateY limiting it to be >= 0', () => {
    const translateY = { value: 42 } as SharedValue<number>;
    const { result } = renderHook(() =>
      useBottomSheetGestureHandler({
        dragOpacity: { value: 0 } as SharedValue<number>,
        minVelocityToClose: 0,
        overlayOpacity: 0,
        translateY,
        closeDistance: 0.5,
        contentHeight: { value: 100 } as SharedValue<number>,
        onClose: () => {},
      }),
    );

    result.current.gestureHandler._onStart(null);
    result.current.gestureHandler._onUpdate({ translationY: 100 });

    expect(translateY.value).toBe(142);

    result.current.gestureHandler._onUpdate({ translationY: -500 });

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
          onClose: () => {},
          dragOpacity: { value: 0 },
          minVelocityToClose: 1000,
        } as any),
      );

      result.current.gestureHandler._onUpdate({ translationY: 249 });
      result.current.gestureHandler._onEnd({ velocityY: 100 });

      expect(translateY.value).toBe(0);
      expect(mockWithTiming).toHaveBeenCalledWith(0, { duration: 300 });
    });

    it('calls the onClose event when the distance is at least the requested one', () => {
      const translateY = { value: 0 } as SharedValue<number>;
      const onClose = jest.fn();

      const { result } = renderHook(() =>
        useBottomSheetGestureHandler({
          translateY,
          closeDistance: 0.5,
          dragOpacity: { value: 0 } as SharedValue<number>,
          minVelocityToClose: 0,
          overlayOpacity: 0,
          contentHeight: { value: 500 } as SharedValue<number>,
          onClose,
        }),
      );

      result.current.gestureHandler._onUpdate({ translationY: 250 });
      result.current.gestureHandler._onEnd(null);

      expect(mockRunOnJS).toHaveBeenCalledWith(onClose);
      expect(onClose).toHaveBeenCalledWith();
      expect(mockWithTiming).not.toHaveBeenCalled();
    });

    it('calls onClose when the velocity is bigger than minVelocityToClose', () => {
      const onClose = jest.fn();

      const translateY = { value: 0 };
      const { result } = renderHook(() =>
        useBottomSheetGestureHandler({
          translateY,
          closeDistance: 0.9,
          contentHeight: { value: 500 },
          onClose,
          dragOpacity: { value: 0 },
          minVelocityToClose: 1000,
        } as any),
      );

      result.current.gestureHandler._onUpdate({ translationY: 42 });
      result.current.gestureHandler._onEnd({ velocityY: 1001 });

      expect(mockRunOnJS).toHaveBeenCalledWith(onClose);
      expect(onClose).toHaveBeenCalledWith();
      expect(mockWithTiming).not.toHaveBeenCalled();
    });
  });
});
