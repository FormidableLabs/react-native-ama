import { useChecks, useFocus } from '@react-native-ama/core';
import * as React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { applyStyle } from '~internal';

export type TextProps = RNTextProps & {
  autofocus?: boolean;
};

export const Text = ({ autofocus, ...rest }: TextProps) => {
  const textRef = React.useRef<RNText>(null);

  useFocus(autofocus ? textRef : undefined);

  const checks = __DEV__ ? useChecks?.() : undefined;
  const isAccessible = rest.accessible !== false;

  __DEV__ &&
    isAccessible &&
    rest.children &&
    checks?.uppercaseChecker({
      style: rest.style,
      extra: rest,
      accessibilityLabel: rest.accessibilityLabel,
    });
  __DEV__ &&
    isAccessible &&
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
