import * as React from 'react';
import {
  Pressable as RNPressable,
  PressableProps as RNPressableProps,
} from 'react-native';

import { usePressable } from '../hooks/usePressable';
import type { UsePressable } from '../hooks/usePressable';

export type PressableProps = UsePressable<RNPressableProps>;

export const Pressable = React.forwardRef<typeof RNPressable, PressableProps>(
  ({ children, ...rest }, ref) => {
    const pressableProps = usePressable<PressableProps>(rest, children);

    return (
      <RNPressable
        // @ts-ignore
        ref={ref}
        {...rest}
        {...pressableProps}>
        {children}
      </RNPressable>
    );
  },
);
