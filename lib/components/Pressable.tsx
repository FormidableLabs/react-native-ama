import * as React from 'react';
import {
  AccessibilityRole,
  AccessibilityState,
  Pressable as RNPressable,
  PressableProps as RNPressableProps,
} from 'react-native';

import { amaNoUndefined } from '../internal/debug';
import { AMAAccessibilityState } from '../types';

export type PressableProps = Exclude<
  RNPressableProps,
  'accessibilityRole' | 'disabled' | 'accessibilityLabel'
> &
  AMAAccessibilityState & {
    accessibilityRole: AccessibilityRole;
    accessibilityLabel: string;
  };

export const Pressable = (props: PressableProps) => {
  const accessibilityState: AccessibilityState = {
    disabled: props.disabled,
    selected: props.selected,
    checked: props.checked,
    busy: props.busy,
    expanded: props.expanded,
  };

  amaNoUndefined(props, 'accessibilityRole');

  return <RNPressable accessibilityState={accessibilityState} {...props} />;
};
