import type { LayoutChangeEvent } from 'react-native';
import { Platform } from 'react-native';

import { log } from './logger';

const MINIMUM_SIZE = Platform.OS === 'android' ? 48 : 44;

export const checkMinimumSize = (event: LayoutChangeEvent) => {
  const width = event.nativeEvent.layout.width;
  const height = event.nativeEvent.layout.height;

  if (width < MINIMUM_SIZE || height < MINIMUM_SIZE) {
    log(
      'MINIMUM_SIZE',
      `The touchable are must have a minimum size of ${MINIMUM_SIZE}x${MINIMUM_SIZE} found instead: ${width}x${height}`,
    );
  }
};
