import { checkFocusTrap } from './checkFocusTrap';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('checkFocusTrap', () => {
  it.each([true, false])(
    'waits 100ms before checking for the focus trap %s',
    shouldHaveFocus => {
      jest.useFakeTimers();

      const isFocused = jest.fn();

      checkFocusTrap({
        ref: { current: { isFocused } } as any,
        shouldHaveFocus,
      });

      expect(isFocused).not.toHaveBeenCalled();

      jest.advanceTimersByTime(99);

      expect(isFocused).not.toHaveBeenCalled();

      jest.advanceTimersByTime(2);

      expect(isFocused).toHaveBeenCalledWith();
    },
  );

  it.each([true, false])(
    'resolves with null if the focus check succeed %s',
    async shouldHaveFocus => {
      jest.useRealTimers();

      const isFocused = jest.fn().mockReturnValue(shouldHaveFocus);

      const result = await checkFocusTrap({
        ref: { current: { isFocused } } as any,
        shouldHaveFocus,
      });

      expect(result).toBe(null);
    },
  );

  it.each`
    shouldHaveFocus | expectedMessage
    ${true}         | ${'The component did not receive the focus'}
    ${false}        | ${'The component did trap the focus'}
  `(
    'resolves with an error if the focus check fails %s',
    async ({ shouldHaveFocus, expectedMessage }) => {
      jest.useRealTimers();

      const isFocused = jest.fn().mockReturnValue(!shouldHaveFocus);

      const result = await checkFocusTrap({
        ref: { current: { isFocused } } as any,
        shouldHaveFocus,
      });

      expect(result).toEqual({
        extra: undefined,
        message: expectedMessage,
        rule: 'NO_KEYBOARD_TRAP',
      });
    },
  );
});
