import {
  MINIMUM_TOUCHABLE_SIZE,
  type AMAAccessibilityState,
} from '~internal';
import React from 'react';
import {
  AccessibilityState,
  GestureResponderEvent,
  View,
  ViewProps,
} from 'react-native';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';

import { useSwitch } from '../hooks/useSwitch';

type SwitchWrapperProps = React.PropsWithChildren<
  Omit<ViewProps, 'accessibilityRole' | 'accessibilityLabel'> &
    AMAAccessibilityState & {
      accessibilityLabel: string;
      children: React.ReactNode;
      onPress?: (event: GestureResponderEvent) => void;
      checked: Pick<AccessibilityState, 'checked'> | boolean;
    }
>;

const SwitchWrapperBase = ({ children, ...rest }: SwitchWrapperProps) => {
  const { style: switchStyle, ...otherSwitchProps } = useSwitch(rest);

  return (
    <TouchableWithoutFeedback {...otherSwitchProps}>
      <View style={[switchStyle, style.switch]}>{children}</View>
    </TouchableWithoutFeedback>
  );
};

export const SwitchWrapper = React.memo(SwitchWrapperBase);

const style = StyleSheet.create({
  switch: {
    minHeight: MINIMUM_TOUCHABLE_SIZE,
    minWidth: MINIMUM_TOUCHABLE_SIZE,
  },
});
