import { useRef } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import {
  AccessibilityActionEvent,
  AccessibilityRole,
} from 'react-native/types';

type UseCarousel = {
  data: ArrayLike<any> | null | undefined;
  flatListRef: React.MutableRefObject<FlatList<any> | null>;
};

export const useCarousel = ({ data, flatListRef }: UseCarousel) => {
  const carouselIndexForScreenReader = useRef(0);
  const totalItems = data?.length || 0;

  const accessibilityActions = [{ name: 'increment' }, { name: 'decrement' }];

  const onAccessibilityAction = (event: AccessibilityActionEvent) => {
    const value = event.nativeEvent.actionName === 'increment' ? 1 : -1;
    const newIndex = carouselIndexForScreenReader.current + value;

    carouselIndexForScreenReader.current = clamp(newIndex, 0, totalItems);

    flatListRef.current?.scrollToIndex({
      index: carouselIndexForScreenReader.current,
    });
  };

  return {
    accessibilityRole: 'adjustable' as AccessibilityRole,
    accessibilityActions,
    onAccessibilityAction,
  };
};

const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max);
