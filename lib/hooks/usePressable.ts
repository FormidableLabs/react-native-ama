import * as React from 'react';
import type {
  AccessibilityRole,
  AccessibilityState,
  LayoutChangeEvent,
} from 'react-native';

import { accessibilityLabelChecker } from '../internal/checks/accessibilityLabelChecker';
import { ERROR_STYLE } from '../internal/error.style';
import { shouldIgnoreContrastCheckForDisabledElement } from '../internal/logger';
import { useChecks } from '../internal/useChecks';
import type { AMAAccessibilityState } from '../types/types';

export type UsePressable<T> = Omit<
  T,
  'accessibilityRole' | 'disabled' | 'accessibilityLabel' | 'accessibilityState'
> &
  AMAAccessibilityState & {
    accessibilityRole: AccessibilityRole;
    accessibilityLabel: string;
  };

type ReturnUsePressable<T> = {
  accessibilityState: AccessibilityState;
  onLayout: (event: LayoutChangeEvent) => void;
  style: Pick<T, keyof T>;
};

export const usePressable = <T>(
  props: Partial<UsePressable<T>>,
  children?: React.ReactNode,
): ReturnUsePressable<T> => {
  const accessibilityState: AccessibilityState = React.useMemo(() => {
    return {
      disabled: props.disabled,
      selected: props.selected,
      checked: props.checked,
      busy: props.busy,
      expanded: props.expanded,
    };
  }, [
    props.busy,
    props.checked,
    props.disabled,
    props.expanded,
    props.selected,
  ]);

  /* test-code */
  const [minimumSizeFailed, setMinimumSizeFailed] = React.useState(false);
  const { noUndefinedProperty, contrastChecker, checkMinimumSize } =
    useChecks();

  // @ts-ignore
  let style = props.style || {};

  const ignoreContrastCheck =
    props.disabled && shouldIgnoreContrastCheckForDisabledElement();

  if (!ignoreContrastCheck) {
    // @ts-ignore
    const devStyle = {
      ...noUndefinedProperty(
        props,
        'accessibilityRole',
        'NO_ACCESSIBILITY_ROLE',
      ),
      ...noUndefinedProperty(
        props,
        'accessibilityLabel',
        'NO_ACCESSIBILITY_LABEL',
      ),
      ...accessibilityLabelChecker(
        props.accessibilityLabel,
        // @ts-ignore
        props.accessibilityHint,
      ),
      ...(minimumSizeFailed ? ERROR_STYLE : {}),
    };

    if (typeof style === 'function') {
      style = applyStyle(contrastChecker, style, devStyle, children);
    } else {
      style = {
        ...style,
        ...devStyle,
        ...contrastChecker(style, children),
      };
    }
  }

  const checkSize = (event: LayoutChangeEvent) => {
    const result = checkMinimumSize(event, children);

    setMinimumSizeFailed('borderColor' in result);
  };
  /* end-test-code */

  return {
    accessibilityState,
    /* test-code */
    onLayout: checkSize,
    style,
    /* end-test-code */
  };
};

function performChecks() {}
function applyStyle(
  contrastChecker: Function,
  style: Function,
  devStyle: Record<any, any>,
  children: React.ReactNode,
) {
  return (...params: any) => {
    const s = style(...params);
    const contrastStyle = contrastChecker(s, children);

    if (Array.isArray(s)) {
      s.push(devStyle);
      s.push(contrastStyle);

      return s;
    }

    return {
      ...s,
      ...devStyle,
      ...contrastStyle,
    };
  };
}
