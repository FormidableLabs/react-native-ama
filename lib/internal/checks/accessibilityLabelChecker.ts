import { LogParams, isAccessibilityLabelAllowed } from '../logger';

export type AccessibilityLabelChecker = {
  accessibilityLabel?: string;
};

export const accessibilityLabelChecker = ({
  accessibilityLabel,
}: AccessibilityLabelChecker = {}): LogParams | null => {
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
