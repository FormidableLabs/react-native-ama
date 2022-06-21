import * as React from 'react';
import { AccessibilityInfo, Platform } from 'react-native';

import { useAMAContext } from '../providers/AMAProvider';

export const useTimedAction = () => {
  const { isScreenReaderEnabled } = useAMAContext();

  const onTimeout = React.useCallback(
    async (callback: () => void, milliseconds: number) => {
      if (isScreenReaderEnabled && Platform.OS === 'ios') {
        return;
      }

      const timeout = await AccessibilityInfo.getRecommendedTimeoutMillis(
        milliseconds,
      );

      setTimeout(callback, timeout);
    },
    [isScreenReaderEnabled],
  );

  return {
    onTimeout,
  };
};
