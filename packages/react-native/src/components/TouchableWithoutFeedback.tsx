import * as React from 'react';
import {
  TouchableWithoutFeedback as RNTouchableWithoutFeedback,
  TouchableWithoutFeedbackProps as RNTouchableWithoutFeedbackProps,
} from 'react-native';

import { UsePressable, usePressable } from '../hooks/usePressable';

export type TouchableWithoutFeedbackProps = React.PropsWithChildren<
  UsePressable<RNTouchableWithoutFeedbackProps>
>;

export const TouchableWithoutFeedback = ({
  children,
  ...rest
}: TouchableWithoutFeedbackProps) => {
  const pressableProps = usePressable<TouchableWithoutFeedbackProps>(
    rest,
    children,
  );

  return (
    <RNTouchableWithoutFeedback {...rest} {...pressableProps}>
      {children}
    </RNTouchableWithoutFeedback>
  );
};
