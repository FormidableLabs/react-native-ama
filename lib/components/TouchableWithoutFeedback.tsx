import * as React from 'react';
import {
  AccessibilityRole,
  AccessibilityState,
  TouchableWithoutFeedback as RNTouchableWithoutFeedback,
  TouchableWithoutFeedbackProps as RNTouchableWithoutFeedbackProps,
} from 'react-native';

import { accessibilityLabelChecker } from '../internal/accessibilityLabelChecker';
import { checkMinimumSize } from '../internal/checkMinimumSize';
import { contrastChecker } from '../internal/contrastChecker';
import { noUndefinedProperty } from '../internal/noUndefinedProperty';
import type { AMAAccessibilityState } from '../types/types';

export type TouchableWithoutFeedbackProps = Omit<
  RNTouchableWithoutFeedbackProps,
  'accessibilityRole' | 'disabled' | 'accessibilityLabel' | 'accessibilityState'
> &
  AMAAccessibilityState & {
    accessibilityRole: AccessibilityRole;
    accessibilityLabel: string;
  };

export const TouchableWithoutFeedback: React.FC<
  TouchableWithoutFeedbackProps
> = ({ children, ...rest }) => {
  const accessibilityState: AccessibilityState = {
    disabled: rest.disabled,
    selected: rest.selected,
    checked: rest.checked,
    busy: rest.busy,
    expanded: rest.expanded,
  };

  __DEV__ &&
    noUndefinedProperty(rest, 'accessibilityRole', 'NO_ACCESSIBILITY_ROLE');
  __DEV__ &&
    noUndefinedProperty(rest, 'accessibilityLabel', 'NO_ACCESSIBILITY_LABEL');

  __DEV__ &&
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      contrastChecker(rest?.style, children);

      accessibilityLabelChecker(rest.accessibilityLabel);
    }, [rest.style, rest.accessibilityLabel, children]);

  return (
    <RNTouchableWithoutFeedback
      accessibilityState={accessibilityState}
      onLayout={checkMinimumSize}
      {...rest}>
      {children}
    </RNTouchableWithoutFeedback>
  );
};
