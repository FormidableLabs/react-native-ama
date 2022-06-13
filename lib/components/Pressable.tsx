import * as React from 'react';
import {
  Pressable as RNPressable,
  PressableProps as RNPressableProps,
} from 'react-native';

import { UsePressable, usePressable } from '../hooks/usePressable';

export type PressableProps = UsePressable<RNPressableProps>;

const PressableBase = React.forwardRef<typeof RNPressable, PressableProps>(
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

export const Pressable = React.memo(PressableBase);
