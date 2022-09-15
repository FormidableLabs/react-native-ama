import { Platform } from 'react-native';

beforeEach(() => {
  jest.clearAllMocks();
});

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

  it('warns if the role is not supported by the "mirror" platform', () => {
    const consoleWarn = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => {});
    Platform.OS = 'ios';

    const checkAccessibilityRole =
      require('./checkAccessibilityRole').checkAccessibilityRole;

    expect(checkAccessibilityRole('adjustable')).toEqual(null);

    expect(consoleWarn).toHaveBeenCalledWith(
      'NOTE: "adjustable" is not a native element for "android"',
    );
  });
});
