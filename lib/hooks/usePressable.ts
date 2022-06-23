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
  onLayout: (event: LayoutChangeEvent) => void;
  style: Record<string, any>;
};

export const usePressable = <T>(
  props: Partial<UsePressable<T>>,
  children?: React.ReactNode,
): ReturnUsePressable => {
  const accessibilityState = generateAccessibilityStateFromProp(props);

  /* block:start */
  const ignoreContrastCheck =
    // @ts-ignore
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
