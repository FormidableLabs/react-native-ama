import React from 'react';
import type { ViewProps } from 'react-native';
import type { AccessibilityState } from 'react-native';

import { generateAccessibilityStateFromProp } from '../internal/generateAccessibilityStateFromProp';
import { useButtonChecks } from '../internal/useButtonChecks';

type UseSwitch = Omit<
  ViewProps,
  'children' | 'accessibilityRole' | 'accessibilityLabel'
> & {
  accessibilityLabel: string;
};

type UseSwitchReturn = Omit<
  ViewProps,
  'children' | 'accessibilityRole' | 'accessibilityLabel'
> & {
  accessibilityLabel: string;
  accessibilityRole: 'switch';
};

export const useSwitch = (props: UseSwitch): UseSwitchReturn => {
  const accessibilityState: AccessibilityState = React.useMemo(
    () => generateAccessibilityStateFromProp(props),
    [props],
  );

  let style = props.style || {};

  /*block:start*/
  const { debugStyle, onLayout } = useButtonChecks({
    ...props,
    accessibilityRole: 'switch',
  });

  style = debugStyle;
  /*block:end*/

  return {
    accessibilityRole: 'switch',
    accessibilityState,
    ...props,
    /*block:start*/
    onLayout,
    style,
    /*block:end*/
  };
};
