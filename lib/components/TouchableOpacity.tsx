import * as React from 'react';
import {
  TouchableOpacity as RNTouchableOpacity,
  TouchableOpacityProps as RNTouchableOpacityProps,
} from 'react-native';

import { UsePressable, usePressable } from '../hooks/usePressable';

export type TouchableOpacityProps = UsePressable<RNTouchableOpacityProps>;

const TouchableOpacityBase: React.FC<TouchableOpacityProps> = ({
  children,
  ...rest
}) => {
  const pressableProps = usePressable<TouchableOpacityProps>(rest, children);

  return (
    <RNTouchableOpacity {...rest} {...pressableProps}>
      {children}
    </RNTouchableOpacity>
  );
};

export const TouchableOpacity = React.memo(TouchableOpacityBase);
