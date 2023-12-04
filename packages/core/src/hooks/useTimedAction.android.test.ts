import { renderHook } from '@testing-library/react-native';
import { AccessibilityInfo, Platform } from 'react-native';

import * as AMAProvider from '../components/AMAProvider';
import { useTimedAction } from './useTimedAction';

beforeEach(() => {
  jest.clearAllMocks();

  Platform.OS = 'android';
});

describe('useTimedAction', () => {
  it.each([true, false])(
    'onTimeout uses the value provided by getRecommendedTimeoutMillis for the timeout',
    async isScreenReaderEnabled => {
      const callback = jest.fn();

      jest.spyOn(AMAProvider, 'useAMAContext').mockReturnValue({
        isScreenReaderEnabled,
      } as any);

      const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

      const getRecommendedTimeoutMillis = jest
        .spyOn(AccessibilityInfo, 'getRecommendedTimeoutMillis')
        .mockResolvedValue(142);

      const { result } = renderHook(() => useTimedAction());

      await result.current.onTimeout(callback, 42);

      expect(getRecommendedTimeoutMillis).toHaveBeenCalledWith(42);
      expect(setTimeoutSpy).toHaveBeenCalledWith(callback, 142);
    },
  );
});

jest.mock('../components/AMAProvider');
