import type { LayoutChangeEvent } from 'react-native';
import { Platform } from 'react-native';

import {
  ANDROID_MINIMUM_TOUCHABLE_SIZE,
  MINIMUM_TOUCHABLE_SIZE,
} from '../../utils/minimumTouchableSize';
import type { LogParams } from '../logger';
import { getRuleAction } from '../logger';

export const checkMinimumSize = (
  event: LayoutChangeEvent,
): LogParams | null => {
  const width = event.nativeEvent.layout.width;
  const height = event.nativeEvent.layout.height;
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
