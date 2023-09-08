import * as React from 'react';
import { AccessibilityInfo, Platform } from 'react-native';

import { useAMAContext } from '../components/AMAProvider';

export const useTimedAction = () => {
  const { isScreenReaderEnabled } = useAMAContext();

  const onTimeout = React.useCallback(
    async (
      callback: () => void,
      milliseconds: number,
    ): Promise<null | ReturnType<typeof setTimeout>> => {
      if (isScreenReaderEnabled && Platform.OS === 'ios') {
        return new Promise<null>(resolve => {
          resolve(null);
        });
      }

      const timeout = await getRecommendedTimeoutMillis(milliseconds);

      return setTimeout(callback, timeout);
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
