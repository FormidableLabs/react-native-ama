import * as React from 'react';
import type { PropsWithChildren } from 'react';
import type { ViewProps, ViewStyle } from 'react-native';
import Animated, { AnimateProps } from 'react-native-reanimated';

import {
  AnimatedEntryViewStyle,
  AnimatedExitViewStyle,
  useReanimatedAnimationBuilder,
} from '../hooks/useReanimatedAnimationBuilder';
import { AutofocusContainer } from './AutofocusContainer';

type UseReanimated = Omit<AnimateProps<ViewProps>, 'entering' | 'exiting'> & {
  from: AnimatedEntryViewStyle;
  to: AnimatedEntryViewStyle | AnimatedExitViewStyle;
  exitFrom?: AnimatedExitViewStyle;
  style?: ViewStyle | ViewStyle[];
  duration?: number;
  autofocus?: boolean;
};

export const AnimatedContainer = React.forwardRef<
  Animated.View,
  PropsWithChildren<UseReanimated>
>(
  (
    { from, to, exitFrom, duration = 300, style, autofocus, children, ...rest },
    forwardRef,
  ) => {
    const { entering, exiting } = useReanimatedAnimationBuilder({
      from,
      to,
      exitFrom,
      duration,
    });

    const Wrapper = autofocus ? AutofocusContainer : React.Fragment;
    return (
      <Wrapper>
        <Animated.View
          style={[style]}
          entering={entering}
          exiting={exiting}
          ref={forwardRef}
          {...rest}>
          {children}
        </Animated.View>
      </Wrapper>
    );
  },
);
