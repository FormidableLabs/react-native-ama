import * as React from 'react';
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

type ReturnUsePressable<T> = {
  accessibilityState: AccessibilityState;
  onLayout: (event: LayoutChangeEvent) => void;
  style: Pick<T, keyof T>;
};

export const usePressable = <T>(
  props: Partial<UsePressable<T>>,
  children?: React.ReactNode,
): ReturnUsePressable<T> => {
  const accessibilityState = React.useMemo(
    () => generateAccessibilityStateFromProp(props),
    [props],
  );

  /* block:start */
  const ignoreContrastCheck =
    props.disabled && shouldIgnoreContrastCheckForDisabledElement();

  const { debugStyle, onLayout } = useButtonChecks(
    props,
    children,
    !ignoreContrastCheck,
  );

  let style = debugStyle;
  /* block:end */

  return {
    accessibilityState,
    /* block:start */
    onLayout,
    style,
    /* block:end */
  };
};
