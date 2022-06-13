import * as React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';

import { useFocus } from '../hooks/useFocus';
import { accessibilityLabelChecker } from '../internal/checks/accessibilityLabelChecker';
import { uppercaseChecker } from '../internal/checks/uppercaseChecker';

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

  useFocus(autofocus ? textRef : undefined);

  __DEV__ &&
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      uppercaseChecker(rest.style, rest.accessibilityLabel);
      accessibilityLabelChecker(rest.accessibilityLabel);
    }, [rest, rest.accessibilityLabel, rest.style]);

  return <RNText ref={textRef} {...rest} />;
};
