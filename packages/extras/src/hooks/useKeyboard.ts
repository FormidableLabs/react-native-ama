/*
 * Based on: https://github.com/gorhom/react-native-bottom-sheet
 */
import { useCallback, useEffect } from 'react';
import {
  Keyboard,
  KeyboardEvent,
  KeyboardEventEasing,
  KeyboardEventName,
  Platform,
} from 'react-native';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';

const KEYBOARD_EVENT_SHOW: KeyboardEventName = Platform.select({
  ios: 'keyboardWillShow',
  default: 'keyboardDidShow',
});

const KEYBOARD_EVENT_HIDE: KeyboardEventName = Platform.select({
  ios: 'keyboardWillHide',
  default: 'keyboardDidHide',
});

export const useKeyboard = (shouldHandleKeyboardEvents: boolean) => {
  const keyboardHeight = useSharedValue(0);
  const keyboardFinalHeight = useSharedValue(0);
  const isKeyboardVisible = useSharedValue(false);

  const handleKeyboardEvent = useCallback(
    (
      isVisible: boolean,
      height: number,
      duration: number,
      easing: KeyboardEventEasing,
    ) => {
      const finalHeight = isVisible ? height : 0;

      const animationConfig = getKeyboardAnimationConfigs(easing, duration);

      keyboardFinalHeight.value = finalHeight;
      keyboardHeight.value = withTiming(
        isVisible ? finalHeight : 0,
        animationConfig,
      );
      isKeyboardVisible.value = isVisible;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    if (!shouldHandleKeyboardEvents) {
      return;
    }

    const handleEvent = (isVisible: boolean) => {
      return (event: KeyboardEvent) => {
        return handleKeyboardEvent(
          isVisible,
          event.endCoordinates.height,
          event.duration,
          event.easing,
        );
      };
    };

    const showSubscription = Keyboard.addListener(
      KEYBOARD_EVENT_SHOW,
      handleEvent(true),
    );

    const hideSubscription = Keyboard.addListener(
      KEYBOARD_EVENT_HIDE,
      handleEvent(false),
    );

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [handleKeyboardEvent, shouldHandleKeyboardEvents]);

  return {
    keyboardHeight,
    keyboardFinalHeight,
    isKeyboardVisible,
  };
};

const getKeyboardAnimationConfigs = (
  easing: KeyboardEventEasing,
  duration: number,
) => {
  switch (easing) {
    case 'easeIn':
      return {
        easing: Easing.in(Easing.ease),
        duration,
      };

    case 'easeOut':
      return {
        easing: Easing.out(Easing.ease),
        duration,
      };

    case 'easeInEaseOut':
      return {
        easing: Easing.inOut(Easing.ease),
        duration,
      };

    case 'linear':
      return {
        easing: Easing.linear,
        duration,
      };

    case 'keyboard':
      return {
        damping: 500,
        stiffness: 1000,
        mass: 3,
        overshootClamping: true,
        restDisplacementThreshold: 10,
        restSpeedThreshold: 10,
        duration,
      };
  }
};
