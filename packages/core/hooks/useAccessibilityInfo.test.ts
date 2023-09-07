import { renderHook } from '@testing-library/react-hooks';
import { act } from '@testing-library/react-native';
import { flushMicroTasks } from '@testing-library/react-native/build/flushMicroTasks';
import { AccessibilityInfo } from 'react-native';

import { useAccessibilityInfo } from './useAccessibilityInfo';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('useAccessibilityInfo', () => {
  it.each`
    eventName
    ${'reduceMotionChanged'}
    ${'screenReaderChanged'}
    ${'reduceTransparencyChanged'}
    ${'grayscaleChanged'}
    ${'boldTextChanged'}
    ${'invertColorsChanged'}
  `('adds event listener for "$eventName"', async ({ eventName }) => {
    const spy = jest
      .spyOn(AccessibilityInfo, 'addEventListener')
      .mockReturnValue({ remove: jest.fn() } as any);

    await renderUseAccessibilityInfo();

    expect(spy).toHaveBeenCalledWith(eventName, expect.any(Function));
  });

  it('setups the initial value for all the states', async () => {
    const events = [
      'isReduceMotionEnabled',
      'isScreenReaderEnabled',
      'isReduceTransparencyEnabled',
      'isGrayscaleEnabled',
      'isBoldTextEnabled',
      'isInvertColorsEnabled',
    ];

    const states: any = {};

    events.forEach(event => {
      // @ts-ignore
      jest.spyOn(AccessibilityInfo, event).mockResolvedValue('yay');
      states[event] = 'yay';
    });

    const { result } = await renderUseAccessibilityInfo();

    expect(result.current).toMatchObject(states);
  });

  it.each`
    eventName
    ${'reduceMotionChanged'}
    ${'screenReaderChanged'}
    ${'reduceTransparencyChanged'}
    ${'grayscaleChanged'}
    ${'boldTextChanged'}
    ${'invertColorsChanged'}
  `(
    'remove the "$eventName" subscription when the hook is unmounted',
    async ({ eventName }) => {
      const removeMock = jest.fn();
      jest
        .spyOn(AccessibilityInfo, 'addEventListener')
        // @ts-ignore
        .mockImplementation((name, _callback) => {
          return { remove: name === eventName ? removeMock : jest.fn() };
        });

      const theHook = await renderUseAccessibilityInfo();
      theHook.unmount();

      expect(removeMock).toHaveBeenCalledWith();
    },
  );
});

async function renderUseAccessibilityInfo() {
  const renderAPI = renderHook(() => useAccessibilityInfo());

  await act(async () => {
    await flushMicroTasks();
  });

  return renderAPI;
}
