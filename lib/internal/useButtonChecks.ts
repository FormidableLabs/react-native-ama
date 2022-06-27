import type React from 'react';

import { applyStyle } from '../internal/applyStyle';
import { ERROR_STYLE } from '../internal/error.style';
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
        accessibilityLabelChecker,
        minimumSizeFailed,
        // @ts-ignore
      } = useChecks();

      // @ts-ignore
      let style = props.style || {};

      const isAccessible = props.accessible !== false;

      // @ts-ignore
      const debugStyle = {
        ...(isAccessible
          ? noUndefinedProperty({
              properties: props,
              property: 'accessibilityRole',
              rule: 'NO_ACCESSIBILITY_ROLE',
            })
          : {}),
        ...(isAccessible
          ? noUndefinedProperty({
              properties: props,
              property: 'accessibilityLabel',
              rule: 'NO_ACCESSIBILITY_LABEL',
            })
          : {}),
        ...(isAccessible
          ? accessibilityLabelChecker({
              accessibilityLabel: props.accessibilityLabel,
            })
          : {}),
        ...(minimumSizeFailed ? ERROR_STYLE : {}),
      };

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
