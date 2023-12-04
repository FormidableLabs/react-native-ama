import { LogParams, isAccessibilityLabelAllowed } from '../utils/logger';
import type { Rule } from '../utils/logger.rules';

export type UppercaseStringChecker = {
  text?: string;
  canBeEmpty?: boolean;
  rule?: Rule;
};

export const uppercaseStringChecker = ({
  text,
  canBeEmpty = true,
  rule = 'NO_UPPERCASE_TEXT',
}: UppercaseStringChecker = {}): LogParams | null => {
  const isEmpty = !text || text?.trim()?.length === 0;

  if (isEmpty && canBeEmpty) {
    return null;
  }

  if (isEmpty && !canBeEmpty) {
    return {
      rule: 'NO_ACCESSIBILITY_LABEL',
      message: 'The accessibilityLabel cannot be empty',
      extra: text,
    };
  }

  const isAllowed = isAccessibilityLabelAllowed?.(text!);

  if (!isAllowed && isUpperCase(text!)) {
    return {
      rule,
      message: 'The accessibilityLabel cannot be all CAPS',
      extra: text,
    };
  }

  return null;
};

const isUpperCase = (string: string) =>
  string.replace(/\d/, '').toUpperCase() === string;
