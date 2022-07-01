import * as React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';

import { useFocus } from '../hooks/useFocus';
import { applyStyle } from '../internal/applyStyle';
import { useChecks } from '../internal/useChecks';

export type TextProps = RNTextProps & {
  autofocus?: boolean;
};

export const Text = ({ autofocus, ...rest }: TextProps) => {
  const textRef = React.useRef<RNText>(null);

  useFocus(autofocus ? textRef : undefined);

  const checks = __DEV__ ? useChecks?.() : undefined;

  __DEV__ &&
    checks?.uppercaseChecker({
      style: rest.style,
      extra: rest.children,
      accessibilityLabel: rest.accessibilityLabel,
    });
  __DEV__ &&
    checks?.noUppercaseStringChecker({
      text: rest.accessibilityLabel,
      canBeEmpty: true,
    });
  __DEV__ &&
    rest.onPress &&
    checks?.noUndefinedProperty({
      properties: rest,
      property: 'accessibilityRole',
      rule: 'NO_ACCESSIBILITY_ROLE',
    });

  const role = autofocus ? 'header' : rest.accessibilityRole;

  return __DEV__ ? (
    <RNText
      ref={textRef}
      {...rest}
      accessibilityRole={role}
      style={applyStyle?.({
        // @ts-ignore
        style: rest.style,
        // @ts-ignore
        debugStyle: checks?.debugStyle,
      })}
      onLayout={rest.onPress ? checks?.onLayout : undefined}
    />
  ) : (
    <RNText ref={textRef} {...rest} accessibilityRole={role} />
  );
};
