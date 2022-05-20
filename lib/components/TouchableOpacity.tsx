import * as React from 'react';
import {
  AccessibilityRole,
  AccessibilityState,
  TouchableOpacity as RNTouchableOpacity,
  TouchableOpacityProps as RNTouchableOpacityProps,
} from 'react-native';
import type { AMAAccessibilityState } from '../types';
import { amaNoUndefined } from '../internal/debug';
import { contrastChecker } from '../internal/contrastChecker';
import { accessibilityLabelChecker } from '../internal/accessibilityLabelChecker';
import { checkMinimumSize } from '../internal/checkMinimumSize';

export type TouchableOpacityProps = Omit<
  RNTouchableOpacityProps,
  'accessibilityRole' | 'disabled' | 'accessibilityLabel' | 'accessibilityState'
> &
  AMAAccessibilityState & {
    accessibilityRole: AccessibilityRole;
    accessibilityLabel: string;
  };

export const TouchableOpacity: React.FC<TouchableOpacityProps> = ({
  children,
  ...rest
}) => {
  const accessibilityState: AccessibilityState = {
    disabled: rest.disabled,
    selected: rest.selected,
    checked: rest.checked,
    busy: rest.busy,
    expanded: rest.expanded,
  };

  __DEV__ && amaNoUndefined(rest, 'accessibilityRole');
  __DEV__ && amaNoUndefined(rest, 'accessibilityLabel');

  __DEV__ &&
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      contrastChecker(rest?.style, children);

      accessibilityLabelChecker(rest.accessibilityLabel);
    }, [rest.style, rest.accessibilityLabel, children]);

  return (
    <RNTouchableOpacity
      accessibilityState={accessibilityState}
      onLayout={checkMinimumSize}
      {...rest}>
      {children}
    </RNTouchableOpacity>
  );
};
