import type { LayoutChangeEvent } from 'react-native';
import { Platform } from 'react-native';

import type { LogParams } from '../utils/logger';
import { getRuleAction } from '../utils/logger';
import {
  ANDROID_MINIMUM_TOUCHABLE_SIZE,
  MINIMUM_TOUCHABLE_SIZE,
} from '../utils/minimumTouchableSize';

export const checkMinimumSize = (
  event: LayoutChangeEvent,
): LogParams | null => {
  const width = Math.ceil(event.nativeEvent.layout.width);
  const height = Math.ceil(event.nativeEvent.layout.height);
  const shouldForgive = getRuleAction?.('MINIMUM_SIZE') === 'PLEASE_FORGIVE_ME';

  if (
    Platform.OS === 'ios' &&
    width < ANDROID_MINIMUM_TOUCHABLE_SIZE &&
    height < ANDROID_MINIMUM_TOUCHABLE_SIZE
  ) {
    if (shouldForgive) {
      console.info('The minimum size might be too small for Android');
    } else {
      console.warn('The minimum size might be too small for Android');
    }
  }

  if (width < MINIMUM_TOUCHABLE_SIZE || height < MINIMUM_TOUCHABLE_SIZE) {
    return {
      rule: 'MINIMUM_SIZE',
      message: `The touchable area must have a minimum size of ${MINIMUM_TOUCHABLE_SIZE}x${MINIMUM_TOUCHABLE_SIZE} found instead: ${width.toFixed(
        0,
      )}x${height.toFixed(0)}`,
    };
  }

  return null;
};
