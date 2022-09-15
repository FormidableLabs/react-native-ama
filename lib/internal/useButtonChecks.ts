import { checkAccessibilityRole } from 'lib/internal/checks/checkAccessibilityRole';
import type React from 'react';

import { applyStyle } from '../internal/applyStyle';
import { useChecks } from '../internal/useChecks';

export const useButtonChecks = __DEV__
  ? (
      props: Record<string, any>,
      children?: React.ReactNode,
      shouldPerformContrastCheck: boolean = true,
    ) => {
      const {
        noUndefinedProperty,
        contrastChecker,
        onLayout,
        noUppercaseStringChecker,
        checkCompatibleAccessibilityState,
        debugStyle,
        // @ts-ignore
      } = useChecks();

      // @ts-ignore
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
      checkCompatibleAccessibilityState(props);
      checkAccessibilityRole(props.accessibilityRole);

      const contrastCheckerCallback = shouldPerformContrastCheck
        ? contrastChecker
        : undefined;

      const theStyle = applyStyle?.({
        style,
        debugStyle,
        children,
        contrastCheckerCallback,
      });

      return {
        onLayout,
        debugStyle: theStyle,
      };
    }
  : null;
