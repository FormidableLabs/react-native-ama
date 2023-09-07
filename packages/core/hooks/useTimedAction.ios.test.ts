import { renderHook } from '@testing-library/react-hooks';
import { AccessibilityInfo, Platform } from 'react-native';

import { useTimedAction } from './useTimedAction';

beforeEach(() => {
  jest.clearAllMocks();

  Platform.OS = 'ios';
});

jest
  .spyOn(AccessibilityInfo, 'getRecommendedTimeoutMillis')
  .mockImplementation((value: any) => {
    return new Promise(resolve => {
      resolve(value);
    });
  });

describe('useTimedAction', () => {
  it('onTimeout executes the callback with the given timeout if the screen reader is off', async () => {
    const callback = jest.fn();

    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

    useAccessibilityInfo.mockReturnValue({
      isScreenReaderEnabled: false,
    });

    const { result } = renderHook(() => useTimedAction());

    setTimeoutSpy.mockClear();
    await result.current.onTimeout(callback, 42);

    expect(setTimeoutSpy).toHaveBeenCalledWith(callback, 42);
  });

  it('onTimeout does not executes the callback when the screen reader is off', async () => {
    const callback = jest.fn();

    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
    useAccessibilityInfo.mockReturnValue({
      isScreenReaderEnabled: true,
    });

    const { result } = renderHook(() => useTimedAction());

    setTimeoutSpy.mockClear();

    await result.current.onTimeout(callback, 42);

    expect(setTimeoutSpy).not.toHaveBeenCalled();
  });
});

let useAccessibilityInfo: jest.Mock;

function mockUseAccessibilityInfo() {
  useAccessibilityInfo = jest.fn();

  return {
    useAccessibilityInfo,
  };
}

jest.mock('./useAccessibilityInfo', () => mockUseAccessibilityInfo());
