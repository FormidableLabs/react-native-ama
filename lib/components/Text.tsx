import * as React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';

import { useFocus } from '../hooks/useFocus';
import { useChecks } from '../internal/useChecks';

export type TextProps = RNTextProps &
  (
    | {
        autofocus?: true;
        accessibilityRole: 'header';
      }
    | { autofocus?: false }
  );

export const Text: React.FC<TextProps> = ({ autofocus, ...rest }) => {
  let style = rest.style || {};
  const textRef = React.useRef<RNText>(null);

  useFocus(autofocus ? textRef : undefined);

  /* block:start */
  const { uppercaseChecker, accessibilityLabelChecker } = useChecks();
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
  };
  /* block:end */

  return <RNText ref={textRef} {...rest} style={style} />;
};
