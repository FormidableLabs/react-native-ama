import { applyStyle } from '@react-native-ama/internal';
import type React from 'react';
import type { PressableStateCallbackType } from 'react-native';
import { useChecks } from './useChecks';

export const useButtonChecks = __DEV__
  ? (
      props: Record<string, any>,
      children?:
        | React.ReactNode
        | ((state: PressableStateCallbackType) => React.ReactNode)
        | undefined,
      shouldPerformContrastCheck: boolean = true,
    ) => {
      const checks = useChecks();
      if (checks === null) {
        return null;
      }
      const {
        noUndefinedProperty,
        contrastChecker,
        onLayout,
        noUppercaseStringChecker,
        checkCompatibleAccessibilityState,
        checkAccessibilityRole,
        debugStyle,
      } = checks;

      let style = props.style || {};

      const isAccessible = props.accessible !== false;

      isAccessible &&
        noUndefinedProperty({
          properties: props,
          property: 'accessibilityRole',
          rule: 'NO_ACCESSIBILITY_ROLE',
        });
      isAccessible &&
        noUndefinedProperty({
          properties: props,
          property: 'accessibilityLabel',
          rule: 'NO_ACCESSIBILITY_LABEL',
        });
      isAccessible &&
        noUppercaseStringChecker({
          text: props.accessibilityLabel,
        });
      checkCompatibleAccessibilityState({
        accessibilityStates: props?.accessibilityState,
        accessibilityRole: props?.accessibilityRole,
      });
      checkAccessibilityRole(props.accessibilityRole);

      const contrastCheckerCallback = shouldPerformContrastCheck
        ? contrastChecker
        : undefined;

      const theStyle = applyStyle?.({
        style,
        debugStyle,
        // @ts-ignore
        children,
        contrastCheckerCallback,
      });

      return {
        onLayout,
        debugStyle: theStyle,
      };
    }
  : null;
