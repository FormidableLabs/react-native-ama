import { renderHook, act } from '@testing-library/react-native';
import { useFocus } from './useFocus';

const rn = jest.requireMock('react-native');

// useFocus uses SHELL_COLORS as a global — define it for the test environment
(global as any).SHELL_COLORS = {
  BG_RED: '', RESET: '', BLUE: '', YELLOW: '',
};

beforeEach(() => {
  jest.clearAllMocks();
  // @ts-ignore
  global.__DEV__ = true;
  rn.InteractionManager.runAfterInteractions = jest.fn((cb) => cb());
  rn.findNodeHandle = jest.fn(() => 42);
});

afterEach(() => {
  // @ts-ignore
  global.__DEV__ = true;
});

describe('useFocus', () => {
  it('returns a setFocus function', () => {
    const { result } = renderHook(() => useFocus());
    expect(typeof result.current.setFocus).toBe('function');
  });

  it('does nothing when called with null', () => {
    const { result } = renderHook(() => useFocus());
    act(() => {
      result.current.setFocus(null);
    });
    expect(rn.AccessibilityInfo.setAccessibilityFocus).not.toHaveBeenCalled();
  });

  it('calls setAccessibilityFocus when a valid node handle is found', () => {
    jest.useFakeTimers();
    rn.findNodeHandle = jest.fn(() => 42);

    const { result } = renderHook(() => useFocus());
    act(() => {
      result.current.setFocus({} as any);
    });

    expect(rn.AccessibilityInfo.setAccessibilityFocus).toHaveBeenCalledWith(42);

    act(() => {
      jest.runAllTimers();
    });

    expect(rn.AccessibilityInfo.setAccessibilityFocus).toHaveBeenCalledTimes(2);
    jest.useRealTimers();
  });

  it('warns in __DEV__ mode when node handle is not found', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    rn.findNodeHandle = jest.fn(() => null);

    const { result } = renderHook(() => useFocus());
    act(() => {
      result.current.setFocus({} as any);
    });

    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('does not warn when __DEV__ is false and node handle is not found', () => {
    // @ts-ignore
    global.__DEV__ = false;
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    rn.findNodeHandle = jest.fn(() => null);

    const { result } = renderHook(() => useFocus());
    act(() => {
      result.current.setFocus({} as any);
    });

    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('warns in __DEV__ when findNodeHandle throws', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    rn.findNodeHandle = jest.fn(() => {
      throw new Error('boom');
    });

    const { result } = renderHook(() => useFocus());
    act(() => {
      result.current.setFocus({} as any);
    });

    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('does not warn when __DEV__ is false and findNodeHandle throws', () => {
    // @ts-ignore
    global.__DEV__ = false;
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    rn.findNodeHandle = jest.fn(() => {
      throw new Error('boom');
    });

    const { result } = renderHook(() => useFocus());
    act(() => {
      result.current.setFocus({} as any);
    });

    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('auto-focuses refComponent on mount when provided', () => {
    rn.findNodeHandle = jest.fn(() => 99);
    const ref = { current: {} };

    renderHook(() => useFocus(ref));

    expect(rn.AccessibilityInfo.setAccessibilityFocus).toHaveBeenCalledWith(99);
  });

  it('does not auto-focus when refComponent is not provided', () => {
    renderHook(() => useFocus());
    expect(rn.AccessibilityInfo.setAccessibilityFocus).not.toHaveBeenCalled();
  });
});
