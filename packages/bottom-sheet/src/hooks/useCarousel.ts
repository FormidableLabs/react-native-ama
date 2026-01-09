import { useRef } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import {
  AccessibilityActionEvent,
  AccessibilityRole,
} from 'react-native/types';

type UseCarousel<T> = {
  data: ArrayLike<T> | null | undefined;
  flatListRef: React.Ref<FlatList<T> | null>;
};

export const useCarousel = <T = any>({ data, flatListRef }: UseCarousel<T>) => {
  const carouselIndexForScreenReader = useRef(0);
  const totalItems = data?.length || 0;

  const accessibilityActions = [
    { name: 'increment' },
    { name: 'decrement' },
  ] as const;

  const onAccessibilityAction = (event: AccessibilityActionEvent) => {
    const value = event.nativeEvent.actionName === 'increment' ? 1 : -1;
    const newIndex = carouselIndexForScreenReader.current + value;

    carouselIndexForScreenReader.current = clamp(newIndex, 0, totalItems);

    // @ts-ignore
    flatListRef?.current?.scrollToIndex?.({
      index: carouselIndexForScreenReader.current,
    });
  };

  return {
    accessible: true,
    accessibilityRole: 'adjustable' as AccessibilityRole,
    accessibilityActions,
    onAccessibilityAction,
  };
};

const clamp = (num: number, min: number, max: number) =>
  Math.min(Math.max(num, min), max);
