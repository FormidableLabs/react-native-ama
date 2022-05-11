import { renderHook } from '@testing-library/react-hooks';

import { useA11yFocus } from './useA11yFocus';

beforeEach(() => {
  jest.clearAllMocks();
});

let findNodeHandleMock: jest.Mock;
let setAccessibilityFocusMock: jest.Mock;

describe('useA11yFocus', () => {
  it.each([null, undefined])('does nothing if the Ref is %s', refElement => {
    // @ts-ignore
    renderHook(() => useA11yFocus(refElement));

    expect(findNodeHandleMock).not.toHaveBeenCalled();
  });

  it('call setAccessibilityFocus on the given Ref Component', () => {
    findNodeHandleMock.mockReturnValue('element-id');

    renderHook(() => useA11yFocus({ current: 'test-element' }));

    expect(findNodeHandleMock).toHaveBeenCalledWith('test-element');
    expect(setAccessibilityFocusMock).toHaveBeenNthCalledWith(1, 'element-id');
    expect(setAccessibilityFocusMock).toHaveBeenNthCalledWith(2, 'element-id');
  });

  it('focus calls setAccessibilityFocus on the given component', () => {
    findNodeHandleMock.mockReturnValue('test-focus-id');

    const { result } = renderHook(() => useA11yFocus());

    result.current.setFocus('component' as any);

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

function mockReactNative() {
  findNodeHandleMock = jest.fn();
  setAccessibilityFocusMock = jest.fn();

  return {
    findNodeHandle: findNodeHandleMock,
    AccessibilityInfo: {
      setAccessibilityFocus: setAccessibilityFocusMock,
    },
  };
}

jest.mock('react-native', () => mockReactNative());
