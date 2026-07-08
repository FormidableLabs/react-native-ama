import { renderHook } from '@testing-library/react-native';
import { useFocus } from './useFocus';

const SHELL_COLORS = {
  BG_RED: '\x1b[41m',
  RESET: '\x1b[0m',
  BLUE: '\x1b[34m',
  YELLOW: '\x1b[33m',
};

let findNodeHandleMock: jest.Mock;
let setAccessibilityFocusMock: jest.Mock;

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
  jest.spyOn(console, 'warn').mockImplementation();

  const rn = jest.requireMock('react-native');
  findNodeHandleMock = rn.findNodeHandle;
  setAccessibilityFocusMock = rn.AccessibilityInfo.setAccessibilityFocus;
});

afterEach(() => {
  jest.useRealTimers();
});

describe('useFocus', () => {
  it.each([null, undefined])('does nothing if the Ref is %s', refElement => {
    // @ts-ignore
    renderHook(() => useFocus(refElement));

    expect(findNodeHandleMock).not.toHaveBeenCalled();
  });

  it('call setAccessibilityFocus on the given Ref Component', () => {
    findNodeHandleMock.mockReturnValue('element-id');

    renderHook(() => useFocus({ current: 'test-element' }));
    jest.runAllTimers();

    expect(findNodeHandleMock).toHaveBeenCalledWith('test-element');
    expect(setAccessibilityFocusMock).toHaveBeenNthCalledWith(1, 'element-id');
    expect(setAccessibilityFocusMock).toHaveBeenNthCalledWith(2, 'element-id');
  });

  describe('Given the element has not been found', () => {
    beforeEach(function () {
      findNodeHandleMock.mockReturnValue(null);
    });

    it('does not call setAccessibilityFocus', () => {
      renderHook(() => useFocus({ current: 'test-element' }));

      expect(setAccessibilityFocusMock).not.toHaveBeenCalled();
    });

    it('console.warn if __DEV__ is true', () => {
      const spy = jest.spyOn(console, 'warn').mockImplementation();

      renderHook(() => useFocus({ current: 'test-element' }));

      expect(spy).toHaveBeenCalledWith(
        // @ts-ignore
        `${SHELL_COLORS.BG_RED}AMA.${SHELL_COLORS.RESET} ${SHELL_COLORS.BLUE}useFocus${SHELL_COLORS.RESET}: ${SHELL_COLORS.YELLOW}Ref element not found${SHELL_COLORS.RESET}`,
      );
    });

    it('does not log anything if __DEV__ is false', () => {
      // @ts-ignore
      global.__DEV__ = false;

      const spy = jest.spyOn(console, 'warn');

      renderHook(() => useFocus({ current: 'test-element' }));

      expect(spy).not.toHaveBeenCalled();
    });
  });

  it('setFocus calls setAccessibilityFocus on the given component', () => {
    findNodeHandleMock.mockReturnValue('test-focus-id');

    const { result } = renderHook(() => useFocus());

    result.current.setFocus('component' as any);
    jest.runAllTimers();

    expect(findNodeHandleMock).toHaveBeenCalledWith('component');
    expect(setAccessibilityFocusMock).toHaveBeenNthCalledWith(
      1,
      'test-focus-id',
    );
    expect(setAccessibilityFocusMock).toHaveBeenNthCalledWith(
      2,
      'test-focus-id',
    );
  });
});
