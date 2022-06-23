import type { PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import {
  SharedValue,
  runOnJS,
  useAnimatedGestureHandler,
  withTiming,
} from 'react-native-reanimated';

import { useAMAContext } from '../providers/AMAProvider';

type UseBottomSheetGestureHandler = {
  translateY: SharedValue<number>;
  contentHeight: SharedValue<number>;
  closeDistance: number;
  onRequestClose: () => void;
};

export const useBottomSheetGestureHandler = ({
  translateY,
  closeDistance,
  contentHeight,
  onRequestClose,
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
    },
    onEnd: _ => {
      const minimumDistanceToClose = contentHeight.value * closeDistance;
      const shouldCloseBottomSheet = translateY.value >= minimumDistanceToClose;

      if (shouldCloseBottomSheet) {
        runOnJS(onRequestClose)();
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
