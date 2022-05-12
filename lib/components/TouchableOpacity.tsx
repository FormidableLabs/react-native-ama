import * as React from 'react';
import {
  AccessibilityRole,
  AccessibilityState,
  TouchableOpacity as RNTouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import type { AMAAccessibilityState } from 'lib/types';

import { amaNoUndefined } from '../internal/debug';

type AMAPressableProps = Exclude<
  TouchableOpacityProps,
  'accessibilityRole' | 'disabled'
> &
  AMAAccessibilityState & {
    accessibilityRole: AccessibilityRole;
  };

export const TouchableOpacity = (props: AMAPressableProps) => {
  const accessibilityState: AccessibilityState = {
    disabled: props.disabled,
    selected: props.selected,
    checked: props.checked,
    busy: props.busy,
    expanded: props.expanded,
  };

  amaNoUndefined(props, 'accessibilityRole');

  return (
    <RNTouchableOpacity accessibilityState={accessibilityState} {...props} />
  );
};
