import { renderHook } from '@testing-library/react-native';
import { Platform } from 'react-native';
import * as AMAProvider from '../components/AMAProvider';
import { useTimedAction } from './useTimedAction';

beforeEach(() => {
  jest.clearAllMocks();

  Platform.OS = 'ios';
});

describe('useTimedAction', () => {
  it('onTimeout executes the callback with the given timeout if the screen reader is off', async () => {
    const callback = jest.fn();
    //TODO: AMAProvider does not export useAMAContext
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
    jest.spyOn(AMAProvider, 'useAMAContext').mockReturnValue({
      isScreenReaderEnabled: false,
    } as any);

    const { result } = renderHook(() => useTimedAction());

    setTimeoutSpy.mockClear();
    await result.current.onTimeout(callback, 42);

    expect(setTimeoutSpy).toHaveBeenCalledWith(callback, 42);
  });

  it('onTimeout does not executes the callback when the screen reader is off', async () => {
    const callback = jest.fn();

    const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
    jest.spyOn(AMAProvider, 'useAMAContext').mockReturnValue({
      isScreenReaderEnabled: true,
    } as any);

    const { result } = renderHook(() => useTimedAction());

    setTimeoutSpy.mockClear();

    await result.current.onTimeout(callback, 42);

    expect(setTimeoutSpy).not.toHaveBeenCalled();
  });
});
