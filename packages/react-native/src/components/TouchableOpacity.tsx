import * as React from 'react';
import type { PropsWithChildren } from 'react';
import {
  TouchableOpacity as RNTouchableOpacity,
  TouchableOpacityProps as RNTouchableOpacityProps,
} from 'react-native';

import { UsePressable, usePressable } from '../hooks/usePressable';

export type TouchableOpacityProps = PropsWithChildren<
  UsePressable<RNTouchableOpacityProps>
>;

const TouchableOpacityBase = ({ children, ...rest }: TouchableOpacityProps) => {
  const pressableProps = usePressable<TouchableOpacityProps>(rest, children);

  return (
    <RNTouchableOpacity {...rest} {...pressableProps}>
      {children}
    </RNTouchableOpacity>
  );
};

export const TouchableOpacity = React.memo(TouchableOpacityBase);
