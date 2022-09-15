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

  it('fails if the button has an incompatible state', () => {
    const state = {
      checked: false,
    };

    expect(
      checkForAccessibilityState({
        ...state,
        accessibilityRole: 'button',
      }),
    ).toEqual({
      message:
        'The accessibilityState "checked" and the role "button" are not compatible',
      rule: 'INCOMPATIBLE_ACCESSIBILITY_STATE',
    });

    state.checked = true;

    expect(
      checkForAccessibilityState({
        accessibilityState: state,
        accessibilityRole: 'button',
      }),
    ).toEqual({
      message:
        'The accessibilityState "checked" and the role "button" are not compatible',
      rule: 'INCOMPATIBLE_ACCESSIBILITY_STATE',
    });
  });

  it('fails is the single state is undefined when not compatible', () => {
    const state = {
      checked: undefined,
    };

    expect(
      checkForAccessibilityState({
        ...state,
        accessibilityRole: 'button',
      }),
    ).toEqual({
      message:
        'The accessibilityState "checked" and the role "button" are not compatible',
      rule: 'INCOMPATIBLE_ACCESSIBILITY_STATE',
    });
  });

  it('ignores states set as undefined when there are multiple states', () => {
    const state = {
      checked: undefined,
      selected: true,
    };

    expect(
      checkForAccessibilityState({
        ...state,
        accessibilityRole: 'button',
      }),
    ).toEqual(null);
  });
});
