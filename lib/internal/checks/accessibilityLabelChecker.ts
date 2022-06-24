import { LogParams, isAccessibilityLabelAllowed } from '../logger';

export type AccessibilityLabelChecker = {
  accessibilityLabel?: string;
  canBeEmpty?: boolean;
};

export const accessibilityLabelChecker = ({
  accessibilityLabel,
  canBeEmpty = false,
}: AccessibilityLabelChecker = {}): LogParams | null => {
  const isEmpty =
    !accessibilityLabel || accessibilityLabel?.trim()?.length === 0;

  if (isEmpty && canBeEmpty) {
    return null;
  }

  if (isEmpty && !canBeEmpty) {
    return {
      rule: 'NO_ACCESSIBILITY_LABEL',
      message: 'The accessibilityLabel cannot be empty',
      extra: accessibilityLabel,
    };
  }

  const isAllowed = isAccessibilityLabelAllowed?.(accessibilityLabel!);

  if (!isAllowed && isUpperCase(accessibilityLabel!)) {
    return {
      rule: 'UPPERCASE_ACCESSIBILITY_LABEL',
      message: 'The accessibilityLabel cannot be all CAPS',
      extra: accessibilityLabel,
    };
  }

  return null;
};

const isUpperCase = (string: string) => string.toUpperCase() === string;
