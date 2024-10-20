import { AutofocusContainer } from '@react-native-ama/core';
import * as React from 'react';
import type { PropsWithChildren } from 'react';
import type { ViewProps } from 'react-native';
import Animated, { AnimateProps } from 'react-native-reanimated';

import {
  AnimatedEntryViewStyle,
  AnimatedExitViewStyle,
  ToAnimation,
  useReanimatedAnimationBuilder,
} from '../hooks/useReanimatedAnimationBuilder';

type UseReanimated = Omit<AnimateProps<ViewProps>, 'entering' | 'exiting'> & {
  autofocus?: boolean;
  duration?: number;
  from: AnimatedEntryViewStyle;
  exitFrom?: AnimatedExitViewStyle;
  exitTo?: ToAnimation;
  to: ToAnimation;
  style?: Pick<ViewProps, 'style'>;
};

export const AnimatedContainer = React.forwardRef<
  Animated.View,
  PropsWithChildren<UseReanimated>
>(
  (
    {
      from,
      to,
      exitFrom,
      exitTo,
      duration = 300,
      style,
      autofocus,
      children,
      ...rest
    },
    forwardRef,
  ) => {
    const { entering, exiting } = useReanimatedAnimationBuilder({
      from,
      to,
      exitFrom,
      exitTo,
      duration,
    });

    return autofocus ? (
      <AutofocusContainer>
        <Animated.View
          style={style}
          entering={entering}
          exiting={exiting}
          ref={forwardRef}
          {...rest}>
          {children}
        </Animated.View>
      </AutofocusContainer>
    ) : (
      <Animated.View
        style={style}
        entering={entering}
        exiting={exiting}
        ref={forwardRef}
        {...rest}>
        {children}
      </Animated.View>
    );
  },
);
