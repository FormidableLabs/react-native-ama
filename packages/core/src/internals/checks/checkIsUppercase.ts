import { AmaNode } from '../../ReactNativeAma.types';
import { AMAError, AMARule } from '../types';
import { isAccessibilityLabelAllowed } from '../utils/isA11yLabelAllowed';

export type UppercaseStringChecker = {
  node: AmaNode;
  canBeEmpty?: boolean;
  rule?: AMARule;
};

export const checkIsUppercase = ({
  node,
  canBeEmpty = true,
  rule = 'NO_UPPERCASE_TEXT',
}: UppercaseStringChecker): AMAError | null => {
  const text = node.ariaLabel ?? node.content
  const isEmpty = !text || text?.trim()?.length === 0;

  if (isEmpty && canBeEmpty) {
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

const isUpperCase = (string: string) =>
  string.toUpperCase() === string;
