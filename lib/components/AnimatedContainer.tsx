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
import { AutofocusContainer } from './AutofocusContainer';

type UseReanimated = Omit<AnimateProps<ViewProps>, 'entering' | 'exiting'> & {
  autofocus?: boolean;
  duration?: number;
  from: AnimatedEntryViewStyle;
  exit?: AnimatedExitViewStyle;
  to: ToAnimation;
  style?: Pick<ViewProps, 'style'>;
};

export const AnimatedContainer = React.forwardRef<
  Animated.View,
  PropsWithChildren<UseReanimated>
>(
  (
    { from, to, exit, duration = 300, style, autofocus, children, ...rest },
    forwardRef,
  ) => {
    const { entering, exiting } = useReanimatedAnimationBuilder({
      from,
      to,
      exit,
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
