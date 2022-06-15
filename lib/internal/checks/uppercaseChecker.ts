import type { ReactNode } from 'react';
import type { StyleProp } from 'react-native';

import { getPropertyFromStyle } from '../getPropertyFromStyle';
import type { LogParams } from '../logger';

export type UppercaseCheckerParams = {
  style: StyleProp<Text> | undefined;
  accessibilityLabel?: string;
  extra?: ReactNode;
};

export const uppercaseChecker = ({
  style,
  extra,
  accessibilityLabel,
}: UppercaseCheckerParams): LogParams | null => {
  const textTransform = getPropertyFromStyle(style, 'textTransform');
  const isAccessibilityLabelEmpty = !accessibilityLabel?.trim();

  const fails = textTransform === 'uppercase' && isAccessibilityLabelEmpty;

  if (fails) {
    return {
      rule: 'UPPERCASE_TEXT_NO_ACCESSIBILITY_LABEL',
      message:
        'accessibilityLabel cannot be empty when using `textTransform = uppercase`',
      extra: extra,
    };
  }

  return null;
};
