import * as React from 'react';
import {
  TouchableWithoutFeedback as RNTouchableWithoutFeedback,
  TouchableWithoutFeedbackProps as RNTouchableWithoutFeedbackProps,
} from 'react-native';

import { UsePressable, usePressable } from '../hooks/usePressable';

export type TouchableOpacityProps =
  UsePressable<RNTouchableWithoutFeedbackProps>;

export const TouchableWithoutFeedback: React.FC<
  RNTouchableWithoutFeedbackProps
> = ({ children, ...rest }) => {
  const pressableProps = usePressable<TouchableOpacityProps>(rest, children);

  return (
    <RNTouchableWithoutFeedback {...rest} {...pressableProps}>
      {children}
    </RNTouchableWithoutFeedback>
  );
};
