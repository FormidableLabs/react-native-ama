import { Platform } from 'react-native';

describe('checkAccessibilityRole', () => {
  it('fails if the role is not supported by the platform', () => {
    Platform.OS = 'android';

    const checkAccessibilityRole =
      require('./checkAccessibilityRole').checkAccessibilityRole;

    expect(checkAccessibilityRole('adjustable')).toEqual({
      message: '"adjustable" is not a native element for "android"',
      rule: 'INCOMPATIBLE_ACCESSIBILITY_ROLE',
    });
  });

  it('fails if the role is not supported by the mirror platform', () => {
    Platform.OS = 'ios';

    const checkAccessibilityRole =
      require('./checkAccessibilityRole').checkAccessibilityRole;

    expect(checkAccessibilityRole('adjustable')).toEqual({
      message: '"adjustable" is not a native element for "android"',
      rule: 'INCOMPATIBLE_ACCESSIBILITY_ROLE',
    });
  });
});
