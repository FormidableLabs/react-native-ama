import * as React from 'react';
import type { PropsWithChildren } from 'react';
import type { ViewProps, ViewStyle } from 'react-native';
import Animated, { AnimateProps } from 'react-native-reanimated';

import {
  AnimatedViewStyle,
  useReanimatedAnimationBuilder,
} from '../hooks/useReanimatedAnimationBuilder';

type UseReanimated = Omit<AnimateProps<ViewProps>, 'entering' | 'exiting'> & {
  from: AnimatedViewStyle;
  to: AnimatedViewStyle;
  exitFrom?: AnimatedViewStyle;
  style?: ViewStyle | ViewStyle[];
  duration: number;
};

export const AnimatedContainer = ({
  from,
  to,
  exitFrom,
  duration,
  style,
  children,
  ...rest
}: PropsWithChildren<UseReanimated>) => {
  const { entering, exiting } = useReanimatedAnimationBuilder({
    from,
    to,
    exitFrom,
    duration,
  });

  return (
    <Animated.View
      style={[style]}
      entering={entering}
      exiting={exiting}
      {...rest}>
      {children}
    </Animated.View>
  );
};
