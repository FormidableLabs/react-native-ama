import { AmaNode } from '../../ReactNativeAma.types';
import { AmaError, AmaRule } from '../types';
import { isAccessibilityLabelAllowed } from '../utils/isA11yLabelAllowed';

export type UppercaseStringChecker = {
  node: AmaNode;
  canBeEmpty?: boolean;
  rule?: AmaRule;
};

export const checkIsUppercase = ({
  node,
  canBeEmpty = true,
  rule = 'NO_UPPERCASE_TEXT',
}: UppercaseStringChecker): AmaError | null => {
  const text = node.ariaLabel ?? node.content;
  const isEmpty = !text || text?.trim()?.length === 0;

  if ((isEmpty && canBeEmpty) || !node.isAccessible) {
    return null;
  }

  const isAllowed = isAccessibilityLabelAllowed?.(text!);

  if (!isAllowed && isUpperCase(text!)) {
    return {
      rule,
      label: node.ariaLabel,
      viewId: node.viewId,
    };
  }

  return null;
};

const NO_LETTERS = /(\W|\d)/g;

const isUpperCase = (string: string) => {
  const cleanString = string.replaceAll(NO_LETTERS, '');

  if (cleanString.trim().length === 0) {
    return false;
  }

  return cleanString.toUpperCase() === cleanString;
};
