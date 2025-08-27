import { AmaNode } from '../../ReactNativeAma.types';
import { AMAError, AMARule } from '../types';
import { isAccessibilityLabelAllowed } from '../utils/isA11yLabelAllowed';

export type UppercaseStringChecker = {
  node: AmaNode;
  text?: string;
  canBeEmpty?: boolean;
  rule?: AMARule;
};

export const checkIsUppercase = ({
  node,
  text,
  canBeEmpty = true,
  rule = 'NO_UPPERCASE_TEXT',
}: UppercaseStringChecker): AMAError | null => {
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
      extra: text,
    };
  }

  return null;
};

const isUpperCase = (string: string) =>
  string.replace(/\d/, '').toUpperCase() === string;
