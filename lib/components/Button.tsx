import * as React from 'react';
import {
  AccessibilityRole,
  AccessibilityState,
  Button as RNButton,
  ButtonProps as RNButtonProps,
} from 'react-native';
import type { AMAAccessibilityState } from 'lib/types';

export type ButtonProps = Exclude<
  RNButtonProps,
  'accessibilityRole' | 'disabled'
> &
  AMAAccessibilityState & {
    accessibilityRole: AccessibilityRole;
  };

export const Button = (props: ButtonProps) => {
  const accessibilityState: AccessibilityState = {
    disabled: props.disabled,
    selected: props.selected,
    checked: props.checked,
    busy: props.busy,
    expanded: props.expanded,
  };

  // @ts-ignore
  return <RNButton accessibilityState={accessibilityState} {...props} />;
};
