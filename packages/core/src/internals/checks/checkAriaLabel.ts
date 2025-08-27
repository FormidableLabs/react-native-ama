import { AmaNode } from '../../ReactNativeAma.types';
import { AMAError } from '../types';

export const checkAriaLabel = (node: AmaNode): AMAError | null => {
  const { ariaLabel } = node;

  if (!Boolean(ariaLabel)) {
    return {
      rule: 'NO_ACCESSIBILITY_LABEL',
      label: node.ariaLabel,
      viewId: node.viewId,
    };
  }

  return null;
};
