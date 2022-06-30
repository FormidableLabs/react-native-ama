import { checkForAccessibilityState } from './checkForAccessibilityState';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('checkForAccessibilityState', () => {
  it('passes if the button has no state', () => {
    const accessibilityRole = 'button';

    const result = checkForAccessibilityState({
      accessibilityRole,
    });

    expect(result).toBe(null);
  });

  it('passes if the button has busy state', () => {
    const accessibilityRole = 'button';

    expect(
      checkForAccessibilityState({
        busy: true,
        accessibilityRole,
      }),
    ).toBe(null);

    expect(
      checkForAccessibilityState({
        accessibilityState: { busy: true },
        accessibilityRole,
      }),
    ).toBe(null);
  });

  it('passes if the button has expanded state', () => {
    expect(
      checkForAccessibilityState({
        busy: true,
        expanded: false,
        accessibilityRole: 'button',
      }),
    ).toBe(null);

    expect(
      checkForAccessibilityState({
        accessibilityState: { busy: true, expanded: false },
        accessibilityRole: 'button',
      }),
    ).toBe(null);
  });

  it.each(['checked', 'selected'])(
    'fails if the button has an incompatible state',
    key => {
      const state = {};

      // @ts-ignore
      state[key] = false;

      expect(
        checkForAccessibilityState({
          ...state,
          accessibilityRole: 'button',
        }),
      ).toEqual({
        message: `The accessibilityState "${key}" and the role "button" are not compatible`,
        rule: 'INCOMPATIBLE_ACCESSIBILITY_STATE',
      });

      // @ts-ignore
      state[key] = true;

      expect(
        checkForAccessibilityState({
          accessibilityState: state,
          accessibilityRole: 'button',
        }),
      ).toEqual({
        message: `The accessibilityState "${key}" and the role "button" are not compatible`,
        rule: 'INCOMPATIBLE_ACCESSIBILITY_STATE',
      });
    },
  );
});
