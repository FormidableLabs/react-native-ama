import { Platform } from 'react-native';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('generateAccessibilityStateFromProp', () => {
  it('copy the checked state into the select one for iOS and button role', () => {
    Platform.OS = 'ios';

    const {
      generateAccessibilityStateFromProp,
    } = require('./generateAccessibilityStateFromProp');

    const result = generateAccessibilityStateFromProp({
      accessibilityRole: 'button',
      // @ts-ignore
      checked: 'whatever',
    });

    expect(result).toEqual({ selected: 'whatever' });
  });

  it('does not copy the checked state into the select one for Android and button role', () => {
    Platform.OS = 'android';

    const {
      generateAccessibilityStateFromProp,
    } = require('./generateAccessibilityStateFromProp');

    const result = generateAccessibilityStateFromProp({
      accessibilityRole: 'button',
      // @ts-ignore
      checked: 'whatever',
    });

    expect(result).toEqual({ checked: 'whatever' });
  });
});
