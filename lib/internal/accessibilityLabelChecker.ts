import { log } from './logger';

export const accessibilityLabelChecker = (accessibilityLabel?: string) => {
  if (!accessibilityLabel) {
    return;
  }

  if (isUpperCase(accessibilityLabel)) {
    log(
      'UPPERCASE_ACCESSIBILITY_LABEL',
      'The accessibilityLabel cannot be all CAPS',
    );
  }
};

const isUpperCase = (string: string) => string.toUpperCase() === string;
