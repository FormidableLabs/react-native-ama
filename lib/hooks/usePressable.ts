import type React from 'react';
import type {
  AccessibilityRole,
  AccessibilityState,
  LayoutChangeEvent,
} from 'react-native';
import { Platform } from 'react-native';

import { generateAccessibilityStateFromProp } from '../internal/generateAccessibilityStateFromProp';
import { shouldIgnoreContrastCheckForDisabledElement } from '../internal/logger';
import { useButtonChecks } from '../internal/useButtonChecks';
import type { AMAAccessibilityState, AccessibilityRoles } from '../types';

export type UsePressable<T> = Omit<
  T,
  'accessibilityRole' | 'accessibilityLabel'
> &
  AMAAccessibilityState &
  AccessibilityRoles & {
    accessibilityLabel: string;
  };

type ReturnUsePressable = {
  accessibilityState: AccessibilityState;
  accessibilityRole: AccessibilityRole;
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

  const accessibilityRole =
    Platform.OS === 'ios' &&
    IOS_BUTTON_ACCESSIBILITY_ROLES.includes(props.accessibilityRole!)
      ? 'button'
      : props.accessibilityRole!;

  const checks = __DEV__
    ? useButtonChecks?.(
        { ...props, accessibilityRole, accessibilityState },
        children,
        !ignoreContrastCheck,
      )
    : null;

  return __DEV__
    ? {
        accessibilityState,
        // @ts-ignore
        onLayout: checks.onLayout,
        // @ts-ignore
        style: checks.debugStyle,
        accessibilityRole,
      }
    : {
        accessibilityState,
        accessibilityRole,
      };
};

const IOS_BUTTON_ACCESSIBILITY_ROLES = [
  'checkbox',
  'togglebutton',
  'radiobutton',
];
