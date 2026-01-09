import { useAMAContext } from '@react-native-ama/core';
import type { PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import {
  runOnJS,
  SharedValue,
  useAnimatedGestureHandler,
  withTiming,
} from 'react-native-reanimated';

type UseBottomSheetGestureHandler = {
  translateY: SharedValue<number>;
  contentHeight: SharedValue<number>;
  dragOpacity: SharedValue<number>;
  closeDistance: number;
  overlayOpacity: number;
  onClose: () => void;
  minVelocityToClose: number;
};

export const useBottomSheetGestureHandler = ({
  translateY,
  closeDistance,
  contentHeight,
  onClose,
  dragOpacity,
  overlayOpacity,
  minVelocityToClose,
}: UseBottomSheetGestureHandler) => {
  const { isReduceMotionEnabled } = useAMAContext();

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { y: number }
  >({
    onStart: (_, context) => {
      context.y = translateY.value;
    },
    onActive: (event, context) => {
      translateY.value = Math.max(0, context.y + event.translationY);

      const distance = contentHeight.value - translateY.value;
      const opacity = Math.min(distance / contentHeight.value, overlayOpacity);

      dragOpacity.value = opacity;
    },
    onEnd: event => {
      const minimumDistanceToClose = contentHeight.value * closeDistance;
      const shouldCloseBottomSheet =
        translateY.value >= minimumDistanceToClose ||
        event.velocityY >= minVelocityToClose;

      if (shouldCloseBottomSheet) {
        runOnJS(onClose)();
      } else {
        translateY.value = withTiming(0, {
          duration: isReduceMotionEnabled ? 0 : 300,
        });
      }
    },
  });

  return {
    gestureHandler,
  };
};
