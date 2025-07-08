import { useButtonChecks } from '@react-native-ama/core/src/hooks/useButtonChecks';
import {
  generateAccessibilityStateFromProp,
  shouldIgnoreContrastCheckForDisabledElement,
} from '@react-native-ama/internal';
import type {
  AccessibilityRoles,
  AMAAccessibilityState,
} from '@react-native-ama/internal';
import type React from 'react';
import type {
  AccessibilityRole,
  AccessibilityState,
  LayoutChangeEvent,
  PressableStateCallbackType,
} from 'react-native';
import { Platform } from 'react-native';

export type UsePressable<T> = Omit<
  T,
  'accessibilityRole' | 'accessibilityLabel'
> &
  AMAAccessibilityState &
  AccessibilityRoles & {
    accessibilityLabel: string;
  } & { onLayout?: (event: LayoutChangeEvent) => void };

type ReturnUsePressable = {
  accessibilityState: AccessibilityState;
  accessibilityRole: AccessibilityRole;
  onLayout?: (event: LayoutChangeEvent) => void;
  style?: Record<string, any>;
};

export const usePressable = <T>(
  props: Partial<UsePressable<T>>,
  children?:
    | React.ReactNode
    | ((state: PressableStateCallbackType) => React.ReactNode)
    | undefined,
): ReturnUsePressable => {
  const accessibilityRole =
    Platform.OS === 'ios' &&
    IOS_BUTTON_ACCESSIBILITY_ROLES.includes(props.accessibilityRole!)
      ? 'button'
      : props.accessibilityRole!;

  const accessibilityState = generateAccessibilityStateFromProp({
    ...props,
    accessibilityRole,
  });

  const ignoreContrastCheck = __DEV__
    ? // @ts-ignore
      props.disabled && shouldIgnoreContrastCheckForDisabledElement()
    : null;

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
        onLayout: evt => {
          if (props.onLayout) {
            props.onLayout(evt);
          }
          checks?.onLayout(evt);
        },
        // @ts-ignore
        style: checks.debugStyle,
        accessibilityRole,
      }
    : {
        accessibilityState,
        accessibilityRole,
      };
};

const IOS_BUTTON_ACCESSIBILITY_ROLES: AccessibilityRole[] = [
  'checkbox',
  'togglebutton',
  'radio',
];
