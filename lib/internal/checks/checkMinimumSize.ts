import type { LayoutChangeEvent } from 'react-native';

import { MINIMUM_TOUCHABLE_SIZE } from '../../utils/minimumTouchableSize';
import { log } from '../logger';
import type { CHECK_STATUS } from './types';

export const checkMinimumSize = (event: LayoutChangeEvent): CHECK_STATUS => {
  const width = event.nativeEvent.layout.width;
  const height = event.nativeEvent.layout.height;

  if (width < MINIMUM_TOUCHABLE_SIZE || height < MINIMUM_TOUCHABLE_SIZE) {
    return log(
      'MINIMUM_SIZE',
      `The touchable area must have a minimum size of ${MINIMUM_TOUCHABLE_SIZE}x${MINIMUM_TOUCHABLE_SIZE} found instead: ${width}x${height}`,
      '',
    );
  }

  return 'SUCCEED';
};
