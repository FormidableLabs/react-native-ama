import { isAccessibilityLabelAllowed, log } from './logger';

export const accessibilityLabelChecker = (accessibilityLabel?: string) => {
  if (!accessibilityLabel) {
    return;
  }
  const isAllowed = isAccessibilityLabelAllowed(accessibilityLabel);

  if (!isAllowed && isUpperCase(accessibilityLabel)) {
    log(
      'UPPERCASE_ACCESSIBILITY_LABEL',
      'The accessibilityLabel cannot be all CAPS',
      accessibilityLabel,
    );
  }
};

const isUpperCase = (string: string) => string.toUpperCase() === string;
