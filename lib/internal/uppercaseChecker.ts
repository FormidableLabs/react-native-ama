import type { ReactNode } from 'react';
import type { StyleProp } from 'react-native';

import { log } from './logger';
import { getPropertyFromStyle } from './styleHandler';

export const uppercaseChecker = (
  style: StyleProp<Text> | undefined,
  accessibilityLabel?: string,
  component?: ReactNode,
) => {
  const textTransform = getPropertyFromStyle(style, 'textTransform');
  const isAccessibilityLabelEmpty = !accessibilityLabel?.trim();

  const fails = textTransform === 'uppercase' && isAccessibilityLabelEmpty;

  if (fails) {
    log(
      'UPPERCASE_TEXT_NO_ACCESSIBILITY_LABEL',
      'accessibilityLabel cannot be empty when using `textTransform = uppercase`',
      component,
    );
  }
};
