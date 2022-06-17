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
  const shouldCheckLayout = React.useRef(true);
  const layoutCheckTimeout = React.useRef<NodeJS.Timeout>();
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
    ...noUndefinedProperty({
      properties: props,
      property: 'accessibilityRole',
      rule: 'NO_ACCESSIBILITY_ROLE',
    }),
    ...noUndefinedProperty({
      properties: props,
      property: 'accessibilityLabel',
      rule: 'NO_ACCESSIBILITY_LABEL',
    }),
    ...accessibilityLabelChecker(
      props.accessibilityLabel,
      // @ts-ignore
      props.accessibilityHint,
    ),
    ...(minimumSizeFailed ? ERROR_STYLE : {}),
  };

  const contrastCheckerCallback = shouldPerformContrastCheck
    ? contrastChecker
    : undefined;

  const theStyle = applyStyle({
    style,
    debugStyle,
    children,
    contrastCheckerCallback,
  });

  const onLayout = (event: LayoutChangeEvent) => {
    /**
     * When the check fails there are situation when adding a border makes the
     * component meet the minimum size requirement, and this causes a loop as the
     * state is update continuously between true and false.
     * To "avoid" that we wait at least 100ms before checking the size again, as
     * this gives the dev time to hot-reload the changes.
     */
    if (!shouldCheckLayout.current) {
      return;
    }

    shouldCheckLayout.current = false;

    // @ts-ignore
    clearTimeout(layoutCheckTimeout.current);

    layoutCheckTimeout.current = setTimeout(() => {
      shouldCheckLayout.current = true;
    }, 100);

    const result = checkMinimumSize(event);

    setMinimumSizeFailed(Object.keys(result).length > 0);
  };

  return {
    onLayout,
    debugStyle: theStyle,
  };
};
