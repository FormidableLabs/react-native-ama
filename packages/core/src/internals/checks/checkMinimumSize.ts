import { AmaNode } from '../../ReactNativeAma.types';
import { AMAError } from '../types';
import { MINIMUM_TOUCHABLE_SIZE } from '../utils/minimumTouchableSize';

export const checkMinimumSize = (node: AmaNode): AMAError | null => {
  const width = node.bounds?.[0];
  const height = node.bounds?.[1];

  if (node.type !== 'Pressable') {
    return null;
  }

  if (width < MINIMUM_TOUCHABLE_SIZE || height < MINIMUM_TOUCHABLE_SIZE) {
    return {
      label: node.ariaLabel,
      viewId: node.viewId,
      rule: 'MINIMUM_SIZE',
      extra: `The touchable area must have a minimum size of ${MINIMUM_TOUCHABLE_SIZE}x${MINIMUM_TOUCHABLE_SIZE} found instead: ${width.toFixed(
        0,
      )}x${height.toFixed(0)}`,
    };
  }

  return null;
};
