import type { LayoutChangeEvent } from 'react-native';

import { MINIMUM_TOUCHABLE_SIZE } from '../../utils/minimumTouchableSize';
import type { LogParams } from '../logger';

export const checkMinimumSize = (
  event: LayoutChangeEvent,
): LogParams | null => {
  const width = event.nativeEvent.layout.width;
  const height = event.nativeEvent.layout.height;

  if (width < MINIMUM_TOUCHABLE_SIZE || height < MINIMUM_TOUCHABLE_SIZE) {
    return {
      rule: 'MINIMUM_SIZE',
      message: `The touchable area must have a minimum size of ${MINIMUM_TOUCHABLE_SIZE}x${MINIMUM_TOUCHABLE_SIZE} found instead: ${width}x${height}`,
    };
  }

  return null;
};
