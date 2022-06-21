import * as React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';

import { useFocus } from '../hooks/useFocus';
import { ERROR_STYLE } from '../internal/error.style';
import { useChecks } from '../internal/useChecks';

export type TextProps = RNTextProps & {
  autofocus?: boolean;
};

export const Text: React.FC<TextProps> = ({ autofocus, ...rest }) => {
  const textRef = React.useRef<RNText>(null);

  useFocus(autofocus ? textRef : undefined);

  /* block:start */
  let style = rest.style || {};

  const {
    uppercaseChecker,
    accessibilityLabelChecker,
    noUndefinedProperty,
    onLayout,
    minimumSizeFailed,
  } = useChecks();

  style = {
    ...(style as Record<string, any>),
    ...uppercaseChecker({
      style,
      extra: rest.children,
      accessibilityLabel: rest.accessibilityLabel,
    }),
    ...accessibilityLabelChecker({
      accessibilityLabel: rest.accessibilityLabel,
    }),
    ...(rest.onPress
      ? noUndefinedProperty({
          properties: rest,
          property: 'accessibilityRole',
          rule: 'NO_ACCESSIBILITY_ROLE',
        })
      : {}),
    ...(minimumSizeFailed ? ERROR_STYLE : {}),
  };
  /* block:end */
  const role = autofocus ? 'header' : rest.accessibilityRole;

  return (
    <RNText
      ref={textRef}
      {...rest}
      accessibilityRole={role}
      /* block:start */
      style={style}
      onLayout={rest.onPress ? onLayout : undefined}
      /* block:end */
    />
  );
};
