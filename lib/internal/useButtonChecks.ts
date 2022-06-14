import * as React from 'react';
import type { LayoutChangeEvent } from 'react-native';

import { applyStyle } from '../internal/applyStyle';
import { ERROR_STYLE } from '../internal/error.style';
import { useChecks } from '../internal/useChecks';

export const useButtonChecks = (
  props: Record<string, any>,
  children?: React.ReactNode,
  shouldPerformContrastCheck: boolean = true,
) => {
  const [minimumSizeFailed, setMinimumSizeFailed] = React.useState(false);

  const {
    noUndefinedProperty,
    contrastChecker,
    checkMinimumSize,
    accessibilityLabelChecker,
  } = useChecks();

  // @ts-ignore
  let style = props.style || {};

  // @ts-ignore
  const debugStyle = {
    ...noUndefinedProperty(props, 'accessibilityRole', 'NO_ACCESSIBILITY_ROLE'),
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

  const contrastCheckerFunction = shouldPerformContrastCheck
    ? contrastChecker
    : undefined;

  const devStyle = applyStyle(
    style,
    debugStyle,
    children,
    contrastCheckerFunction,
  );

  const onLayout = (event: LayoutChangeEvent) => {
    const result = checkMinimumSize(event);

    setMinimumSizeFailed('borderColor' in result);
  };

  return {
    onLayout,
    devStyle,
  };
};
