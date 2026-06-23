import { checkFocusTrap } from './checkFocusTrap';

beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
  // @ts-ignore
  global.__DEV__ = true;
});

afterEach(() => {
  jest.useRealTimers();
  // @ts-ignore
  global.__DEV__ = true;
});

describe('checkFocusTrap', () => {
  it('calls trackError with NO_KEYBOARD_TRAP when ref is focused and shouldHaveFocus is false', async () => {
    const trackError = jest.fn();
    const ref = { current: { isFocused: () => true } } as any;

    const promise = checkFocusTrap!({ ref, shouldHaveFocus: false, trackError });
    jest.runAllTimers();
    await promise;

    expect(trackError).toHaveBeenCalledWith('NO_KEYBOARD_TRAP', ref);
  });

  it('calls trackError with NO_KEYBOARD_TRAP when ref is not focused and shouldHaveFocus is true', async () => {
    const trackError = jest.fn();
    const ref = { current: { isFocused: () => false } } as any;

    const promise = checkFocusTrap!({ ref, shouldHaveFocus: true, trackError });
    jest.runAllTimers();
    await promise;

    expect(trackError).toHaveBeenCalledWith('NO_KEYBOARD_TRAP', ref);
  });

  it('does not call trackError when no trap condition exists', async () => {
    const trackError = jest.fn();
    const ref = { current: { isFocused: () => false } } as any;

    const promise = checkFocusTrap!({ ref, shouldHaveFocus: false, trackError });
    jest.runAllTimers();
    await promise;

    expect(trackError).not.toHaveBeenCalled();
  });

  it('calls console.error when trackError is unavailable and trap is detected', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
    const ref = { current: { isFocused: () => true } } as any;

    const promise = checkFocusTrap!({ ref, shouldHaveFocus: false, trackError: null });
    jest.runAllTimers();
    await promise;

    expect(errorSpy).toHaveBeenCalledWith('The component did trap the focus');
    errorSpy.mockRestore();
  });

  it.each([null, undefined])('does not throw when ref.current is %s', async (currentValue) => {
    const trackError = jest.fn();
    const ref = { current: currentValue } as any;

    const promise = checkFocusTrap!({ ref, shouldHaveFocus: false, trackError });
    jest.runAllTimers();
    await promise;

    // No throw — test passes if we reach here
  });
});

jest.mock('react-native', () => mockReactNative());

function mockReactNative() {
  return {
    Platform: { OS: 'ios' },
  };
}
