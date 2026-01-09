import { useAMAContext } from '@react-native-ama/core';
import { Gesture } from 'react-native-gesture-handler';
import {
  runOnJS,
  SharedValue,
  useSharedValue,
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
  const startY = useSharedValue(0);

  const gestureHandler = Gesture.Pan()
    .onStart(() => {
      startY.value = translateY.value;
    })
    .onUpdate(event => {
      translateY.value = Math.max(0, startY.value + event.translationY);

      const distance = contentHeight.value - translateY.value;
      const opacity = Math.min(distance / contentHeight.value, overlayOpacity);

      dragOpacity.value = opacity;
    })
    .onEnd(event => {
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
    });

  return {
    gestureHandler,
  };
};
