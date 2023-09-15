import { UsePressable, usePressable } from '@react-native-ama/core';
import * as React from 'react';
import {
  TouchableWithoutFeedback as RNTouchableWithoutFeedback,
  TouchableWithoutFeedbackProps as RNTouchableWithoutFeedbackProps,
} from 'react-native';

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
