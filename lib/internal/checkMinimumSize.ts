import type { LayoutChangeEvent } from 'react-native';

import { MINIMUM_TOUCHABLE_SIZE } from '../utils/minimumTouchableSize';
import { log } from './logger';

export const checkMinimumSize = (event: LayoutChangeEvent) => {
  const width = event.nativeEvent.layout.width;
  const height = event.nativeEvent.layout.height;

  if (width < MINIMUM_TOUCHABLE_SIZE || height < MINIMUM_TOUCHABLE_SIZE) {
    log(
      'MINIMUM_SIZE',
      `The touchable area must have a minimum size of ${MINIMUM_TOUCHABLE_SIZE}x${MINIMUM_TOUCHABLE_SIZE} found instead: ${width}x${height}`,
    );
  }
};
