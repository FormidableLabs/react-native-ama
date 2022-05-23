import type { AMAAccessibilityState } from 'lib/types/types';
import * as React from 'react';
import {
  AccessibilityRole,
  AccessibilityState,
  Omit,
  Pressable as RNPressable,
  PressableProps as RNPressableProps,
} from 'react-native';

import { accessibilityLabelChecker } from '../internal/accessibilityLabelChecker';
import { checkMinimumSize } from '../internal/checkMinimumSize';
import { contrastChecker } from '../internal/contrastChecker';
import { amaNoUndefined } from '../internal/debug';

export type PressableProps = Omit<
  RNPressableProps,
  'accessibilityRole' | 'disabled' | 'accessibilityLabel' | 'accessibilityState'
> &
  AMAAccessibilityState & {
    accessibilityRole: AccessibilityRole;
    accessibilityLabel: string;
  };

export const Pressable: React.FC<PressableProps> = ({ children, ...rest }) => {
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
      const style = rest?.style;

      if (typeof style === 'function') {
        contrastChecker(style({ pressed: false }), children);
        contrastChecker(style({ pressed: true }), children);
      } else {
        contrastChecker(rest.style, children);
      }

      accessibilityLabelChecker(rest.accessibilityLabel);
    }, [rest.style, rest.accessibilityLabel, children]);

  return (
    <RNPressable
      accessibilityState={accessibilityState}
      onLayout={checkMinimumSize}
      {...rest}>
      {children}
    </RNPressable>
  );
};
