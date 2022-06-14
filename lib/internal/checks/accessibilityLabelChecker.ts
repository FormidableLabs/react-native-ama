import { isAccessibilityLabelAllowed, log } from '../logger';
import type { CHECK_STATUS } from './types';

export const accessibilityLabelChecker = (
  accessibilityLabel?: string,
): CHECK_STATUS => {
  if (!accessibilityLabel) {
    return 'SUCCEED';
  }

  const isAllowed = isAccessibilityLabelAllowed(accessibilityLabel);

  if (!isAllowed && isUpperCase(accessibilityLabel)) {
    log(
      'UPPERCASE_ACCESSIBILITY_LABEL',
      'The accessibilityLabel cannot be all CAPS',
      accessibilityLabel,
    );

    return 'ERROR';
  }

  return 'SUCCEED';
};

const isUpperCase = (string: string) => string.toUpperCase() === string;
