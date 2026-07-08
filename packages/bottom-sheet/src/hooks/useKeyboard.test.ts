import { renderHook, act } from '@testing-library/react-native';
import { useKeyboard } from './useKeyboard';

const rn = jest.requireMock('react-native');
const reanimated = jest.requireMock('react-native-reanimated');

// Easing is not in the jest.setup.js reanimated mock — patch it before tests run
const mockEasingFn = jest.fn(() => jest.fn());
beforeAll(() => {
  reanimated.Easing = {
    in: mockEasingFn,
    out: mockEasingFn,
    inOut: mockEasingFn,
    ease: jest.fn(),
    linear: jest.fn(),
  };
});

type KeyboardCallback = (event: any) => void;

let showCallback: KeyboardCallback | null = null;
let hideCallback: KeyboardCallback | null = null;

beforeEach(() => {
  jest.clearAllMocks();
  showCallback = null;
  hideCallback = null;

  rn.Keyboard.addListener = jest.fn((event: string, cb: KeyboardCallback) => {
    if (event === 'keyboardWillShow' || event === 'keyboardDidShow') {
      showCallback = cb;
    } else if (event === 'keyboardWillHide' || event === 'keyboardDidHide') {
      hideCallback = cb;
    }
    return { remove: jest.fn() };
  });
});

const makeKeyboardEvent = (height: number, easing: string, duration: number) => ({
  endCoordinates: { height },
  duration,
  easing,
});

describe('useKeyboard', () => {
  it('does not register keyboard listeners when shouldHandleKeyboardEvents is false', () => {
    renderHook(() => useKeyboard(false));
    expect(rn.Keyboard.addListener).not.toHaveBeenCalled();
  });

  it('registers keyboard show and hide listeners when shouldHandleKeyboardEvents is true', () => {
    renderHook(() => useKeyboard(true));
    expect(rn.Keyboard.addListener).toHaveBeenCalledTimes(2);
  });

  it('updates keyboardHeight and isKeyboardVisible when keyboard shows', () => {
    const { result } = renderHook(() => useKeyboard(true));

    act(() => {
      showCallback?.(makeKeyboardEvent(300, 'easeIn', 250));
    });

    expect(reanimated.withTiming).toHaveBeenCalledWith(300, expect.any(Object));
    expect(result.current.keyboardFinalHeight.value).toBe(300);
    expect(result.current.isKeyboardVisible.value).toBe(true);
  });

  it('resets keyboardHeight when keyboard hides', () => {
    const { result } = renderHook(() => useKeyboard(true));

    act(() => {
      showCallback?.(makeKeyboardEvent(300, 'easeOut', 250));
    });

    act(() => {
      hideCallback?.(makeKeyboardEvent(300, 'linear', 200));
    });

    expect(result.current.keyboardFinalHeight.value).toBe(0);
    expect(result.current.isKeyboardVisible.value).toBe(false);
  });

  it('removes listeners on unmount', () => {
    const removeMock = jest.fn();
    rn.Keyboard.addListener = jest.fn(() => ({ remove: removeMock }));

    const { unmount } = renderHook(() => useKeyboard(true));
    unmount();

    expect(removeMock).toHaveBeenCalledTimes(2);
  });
});

describe('getKeyboardAnimationConfigs easing variants', () => {
  it('uses easeIn config', () => {
    renderHook(() => useKeyboard(true));
    act(() => {
      showCallback?.(makeKeyboardEvent(300, 'easeIn', 250));
    });
    expect(reanimated.withTiming).toHaveBeenCalledWith(300, expect.objectContaining({ duration: 250 }));
  });

  it('uses easeOut config', () => {
    renderHook(() => useKeyboard(true));
    act(() => {
      showCallback?.(makeKeyboardEvent(300, 'easeOut', 200));
    });
    expect(reanimated.withTiming).toHaveBeenCalledWith(300, expect.objectContaining({ duration: 200 }));
  });

  it('uses easeInEaseOut config', () => {
    renderHook(() => useKeyboard(true));
    act(() => {
      showCallback?.(makeKeyboardEvent(300, 'easeInEaseOut', 300));
    });
    expect(reanimated.withTiming).toHaveBeenCalledWith(300, expect.objectContaining({ duration: 300 }));
  });

  it('uses linear config', () => {
    renderHook(() => useKeyboard(true));
    act(() => {
      showCallback?.(makeKeyboardEvent(300, 'linear', 150));
    });
    expect(reanimated.withTiming).toHaveBeenCalledWith(300, expect.objectContaining({ duration: 150 }));
  });

  it('uses keyboard spring config', () => {
    renderHook(() => useKeyboard(true));
    act(() => {
      showCallback?.(makeKeyboardEvent(300, 'keyboard', 400));
    });
    expect(reanimated.withTiming).toHaveBeenCalledWith(
      300,
      expect.objectContaining({ damping: 500, stiffness: 1000 }),
    );
  });
});
