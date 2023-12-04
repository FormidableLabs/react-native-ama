import * as React from 'react';
import { FlatListProps } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { useCarousel } from '../hooks/useCarousel';

export type CarouselWrapperProps<T> = Omit<
  FlatListProps<T>,
  | 'accessibilityLabel'
  | 'accessibilityRole'
  | 'accessibilityActions'
  | 'onAccessibilityAction'
> & {
  accessibilityLabel: string;
};

export const CarouselWrapper = React.forwardRef<
  FlatList,
  CarouselWrapperProps<any>
>((props, forwardedRef) => {
  const a11yProps = useCarousel({
    data: props.data,
    flatListRef: forwardedRef,
  });

  return <FlatList {...props} {...a11yProps} />;
});
