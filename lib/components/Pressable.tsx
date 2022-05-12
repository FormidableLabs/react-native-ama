import * as React from 'react';
import {
  AccessibilityRole,
  AccessibilityState,
  Pressable as RNPressable,
  PressableProps as RNPressableProps,
} from 'react-native';
import type { AMAAccessibilityState } from 'lib/types';

import { amaNoUndefined } from '../internal/debug';
import { contrastChecker } from '../internal/contrast-checker';

export type PressableProps = Exclude<
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
      contrastChecker(rest.style, children);
    }, [rest.style, children]);

  return (
    <RNPressable accessibilityState={accessibilityState} {...rest}>
      {children}
    </RNPressable>
  );
};
