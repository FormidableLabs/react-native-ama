import * as React from 'react';
import { AccessibilityInfo, Platform } from 'react-native';

import { useAMAContext } from '../providers/AMAProvider';

export const useTimedAction = () => {
  const { isScreenReaderEnabled } = useAMAContext();

  const onTimeout = React.useCallback(
    async (callback: () => void, milliseconds: number) => {
      if (isScreenReaderEnabled && Platform.OS === 'ios') {
        return new Promise<void>(resolve => {
          resolve();
        });
      }

      const timeout = await getRecommendedTimeoutMillis(milliseconds);

      setTimeout(callback, timeout);
    },
    [isScreenReaderEnabled],
  );

  return {
    onTimeout,
  };
};

async function getRecommendedTimeoutMillis(
  milliseconds: number,
): Promise<number> {
  return Platform.OS === 'android'
    ? await AccessibilityInfo.getRecommendedTimeoutMillis(milliseconds)
    : new Promise(resolve => {
        resolve(milliseconds);
      });
}
