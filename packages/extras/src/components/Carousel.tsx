import * as React from 'react';
import { FlatListProps, LayoutChangeEvent } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { useCarousel } from '../hooks/useCarousel';

function fixedForwardRef<T, P = {}>(
  render: (props: P, ref: React.Ref<T>) => React.ReactNode,
): (props: P & React.RefAttributes<T>) => React.ReactNode {
  return React.forwardRef(render) as any;
}

export type CarouselProps<T = any> = Omit<
  FlatListProps<T>,
  | 'accessibilityLabel'
  | 'accessibilityRole'
  | 'accessibilityActions'
  | 'onAccessibilityAction'
> & {
  accessibilityLabel: string;
};

const CarouselInner = <T,>(
  props: CarouselProps<T>,
  forwardedRef: React.ForwardedRef<FlatList<T>>,
) => {
  const a11yProps = useCarousel({
    data: props.data,
    flatListRef: forwardedRef,
  });

  return (
    <FlatList
      ref={forwardedRef}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      decelerationRate="fast"
      horizontal
      {...props}
      {...a11yProps}
    />
  );
};

export const Carousel = fixedForwardRef(CarouselInner);
