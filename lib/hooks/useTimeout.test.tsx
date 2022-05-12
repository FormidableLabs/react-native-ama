import { renderHook } from '@testing-library/react-hooks';
import { AccessibilityInfo } from 'react-native';

import { wait } from '../internal/wait';
import { useTimeout } from './useTimeout';

afterEach(() => {
  jest.clearAllMocks();
});

describe('useSetTimeout', () => {
  it('onTimeout does not execute the given callback if the SR is active', async () => {
    const testFN = jest.fn();

    AccessibilityInfo.isScreenReaderEnabled = jest.fn().mockResolvedValue(true);

    const { result } = renderHook(() => useTimeout());

    await result.current.onTimeout(() => {
      testFN();
    }, 0);

    await wait(100);

    expect(testFN).not.toHaveBeenCalled();
  });

  it('onTimeout executes the given callback if the SR is not active', async () => {
    const testFN = jest.fn();

    AccessibilityInfo.isScreenReaderEnabled = jest
      .fn()
      .mockResolvedValue(false);

    const { result } = renderHook(() => useTimeout());

    await result.current.onTimeout(() => {
      testFN();
    }, 20);

    await wait(100);

    expect(testFN).toHaveBeenCalledWith();
  });
});
