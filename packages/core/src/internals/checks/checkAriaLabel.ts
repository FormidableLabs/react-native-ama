import { AmaNode } from '../../ReactNativeAma.types';
import { AmaError } from '../types';

export const checkAriaLabel = (node: AmaNode): AmaError | null => {
  const { ariaLabel } = node;

  if (['Pressable', 'TextInput'].includes(node.type) && !ariaLabel) {
    return {
      rule: 'NO_ACCESSIBILITY_LABEL',
      label: node.ariaLabel,
      viewId: node.viewId,
    };
  }

  return null;
};
