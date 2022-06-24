import type React from 'react';
import type {
  AccessibilityRole,
  AccessibilityState,
  LayoutChangeEvent,
} from 'react-native';

import { generateAccessibilityStateFromProp } from '../internal/generateAccessibilityStateFromProp';
import { shouldIgnoreContrastCheckForDisabledElement } from '../internal/logger';
import { useButtonChecks } from '../internal/useButtonChecks';
import type { AMAAccessibilityState } from '../types/types';

export type UsePressable<T> = Omit<
  T,
  'accessibilityRole' | 'accessibilityLabel'
> &
  AMAAccessibilityState & {
    accessibilityRole: AccessibilityRole;
    accessibilityLabel: string;
  };

type ReturnUsePressable = {
  accessibilityState: AccessibilityState;
  onLayout?: (event: LayoutChangeEvent) => void;
  style?: Record<string, any>;
};

export const usePressable = <T>(
  props: Partial<UsePressable<T>>,
  children?: React.ReactNode,
): ReturnUsePressable => {
  const accessibilityState = generateAccessibilityStateFromProp(props);

  const ignoreContrastCheck = __DEV__
    ? // @ts-ignore
      props.disabled && shouldIgnoreContrastCheckForDisabledElement()
    : null;

  const checks = __DEV__
    ? useButtonChecks?.(props, children, !ignoreContrastCheck)
    : null;

  return __DEV__
    ? {
        accessibilityState,
        // @ts-ignore
        onLayout: checks.onLayout,
        // @ts-ignore
        style: checks.debugStyle,
      }
    : {
        accessibilityState,
      };
};
