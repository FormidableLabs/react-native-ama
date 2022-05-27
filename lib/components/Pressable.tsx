import type { AMAAccessibilityState } from 'lib/types/types';
import * as React from 'react';
import {
  AccessibilityRole,
  AccessibilityState,
  Pressable as RNPressable,
  PressableProps as RNPressableProps,
} from 'react-native';

import { accessibilityLabelChecker } from '../internal/accessibilityLabelChecker';
import { checkMinimumSize } from '../internal/checkMinimumSize';
import { contrastChecker } from '../internal/contrastChecker';
import { noUndefined } from '../internal/noUndefined';

export type PressableProps = Omit<
  RNPressableProps,
  'accessibilityRole' | 'disabled' | 'accessibilityLabel' | 'accessibilityState'
> &
  AMAAccessibilityState & {
    accessibilityRole: AccessibilityRole;
    accessibilityLabel: string;
  };

export const Pressable = React.forwardRef<typeof RNPressable, PressableProps>(
  ({ children, ...rest }, ref) => {
    const accessibilityState: AccessibilityState = {
      disabled: rest.disabled,
      selected: rest.selected,
      checked: rest.checked,
      busy: rest.busy,
      expanded: rest.expanded,
    };

    __DEV__ && noUndefined(rest, 'accessibilityRole', 'NO_ACCESSIBILITY_ROLE');
    __DEV__ &&
      noUndefined(rest, 'accessibilityLabel', 'NO_ACCESSIBILITY_LABEL');

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
        // @ts-ignore
        ref={ref}
        {...rest}>
        {children}
      </RNPressable>
    );
  },
);
