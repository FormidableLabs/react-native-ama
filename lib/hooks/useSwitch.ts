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

  const { devStyle, onLayout } = useButtonChecks({
    ...props,
    accessibilityRole: 'switch',
  });

  return {
    accessibilityRole: 'switch',
    accessibilityState,
    onLayout,
    ...props,
    style: devStyle,
  };
};
