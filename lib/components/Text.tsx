import * as React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';

import { useA11yFocus } from '../hooks/useA11yFocus';

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

  return <RNText ref={textRef} {...rest} />;
};
