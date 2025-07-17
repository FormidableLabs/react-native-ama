import type { StyleProp, TextStyle } from 'react-native';
import { getPropertyFromStyle } from '../utils/getPropertyFromStyle';
import type { LogParams } from '../utils/logger';

export type UppercaseChecker = {
  style: StyleProp<Text> | StyleProp<TextStyle> | undefined;
  accessibilityLabel?: string;
  extra?: any;
};

export const uppercaseChecker = ({
  style,
  extra,
  accessibilityLabel,
}: UppercaseChecker): LogParams | null => {
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
