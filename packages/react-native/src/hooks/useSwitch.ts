import { useButtonChecks } from '@react-native-ama/core';
import {
  applyStyle,
  generateAccessibilityStateFromProp,
} from '@react-native-ama/internal';
import React from 'react';
import type { ViewProps } from 'react-native';
import type { AccessibilityState } from 'react-native';

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

  const checks = __DEV__
    ? useButtonChecks?.({
        ...props,
        accessibilityRole: 'switch',
      })
    : undefined;

  return __DEV__
    ? {
        accessibilityRole: 'switch',
        accessibilityState,
        ...props,
        // @ts-ignore
        onLayout: checks.onLayout,
        style: applyStyle?.({
          // @ts-ignore
          style: props.style,
          // @ts-ignore
          debugStyle: checks.debugStyle,
        }),
      }
    : {
        accessibilityRole: 'switch',
        accessibilityState,
        ...props,
      };
};
