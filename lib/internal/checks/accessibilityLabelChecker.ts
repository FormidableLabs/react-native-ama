import { LogParams, isAccessibilityLabelAllowed, log } from '../logger';

export type AccessibilityLabelCheckerParams = {
  accessibilityLabel?: string;
};

export const accessibilityLabelChecker = ({
  accessibilityLabel,
}: AccessibilityLabelCheckerParams = {}): LogParams | null => {
  if (!accessibilityLabel) {
    return null;
  }

  const isAllowed = isAccessibilityLabelAllowed(accessibilityLabel);

  if (!isAllowed && isUpperCase(accessibilityLabel)) {
    return {
      rule: 'UPPERCASE_ACCESSIBILITY_LABEL',
      message: 'The accessibilityLabel cannot be all CAPS',
      extra: accessibilityLabel,
    };
  }

  return null;
};

const isUpperCase = (string: string) => string.toUpperCase() === string;
