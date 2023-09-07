import { renderHook } from '@testing-library/react-hooks';
import { AccessibilityInfo, Platform } from 'react-native';

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

      useAccessibilityInfo.mockReturnValue({
        isScreenReaderEnabled,
      });

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

let useAccessibilityInfo: jest.Mock;

function mockUseAccessibilityInfo() {
  useAccessibilityInfo = jest.fn();

  return {
    useAccessibilityInfo,
  };
}

jest.mock('./useAccessibilityInfo', () => mockUseAccessibilityInfo());
