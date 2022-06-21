import * as React from 'react';
import type { PropsWithChildren } from 'react';
import type { ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

import {
  AnimatedViewStyle,
  useReanimatedAnimationBuilder,
} from '../hooks/useReanimatedAnimationBuilder';

type UseReanimated = {
  from: AnimatedViewStyle;
  to: AnimatedViewStyle;
  style?: ViewStyle | ViewStyle[];
  duration: number;
};

export const AnimatedContainer = ({
  from,
  to,
  duration,
  style,
  children,
}: PropsWithChildren<UseReanimated>) => {
  const { entering, exiting } = useReanimatedAnimationBuilder({
    from,
    to,
    duration,
  });

  return (
    <Animated.View style={[style]} entering={entering} exiting={exiting}>
      {children}
    </Animated.View>
  );
};
