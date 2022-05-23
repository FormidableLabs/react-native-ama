import * as React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';

import { useA11yFocus } from '../hooks/useA11yFocus';
import { accessibilityLabelChecker } from '../internal/accessibilityLabelChecker';
import { uppercaseChecker } from '../internal/uppercaseChecker';

export type TextProps = RNTextProps &
  (
    | {
        autofocus?: true;
        accessibilityRole: 'header';
      }
    | { autofocus?: false }
  );

export const Text: React.FC<TextProps> = ({ autofocus, ...rest }) => {
  const textRef = React.useRef<RNText>(null);

  useA11yFocus(autofocus ? textRef : undefined);

  __DEV__ &&
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      uppercaseChecker(rest.style, rest.accessibilityLabel);
      accessibilityLabelChecker(rest.accessibilityLabel);
    }, [rest, rest.accessibilityLabel, rest.style]);

  return <RNText ref={textRef} {...rest} />;
};
