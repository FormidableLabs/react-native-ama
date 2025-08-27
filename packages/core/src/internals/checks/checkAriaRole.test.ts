import { Platform } from 'react-native';

describe('checkAriaRole', () => {
  it('fails if the role is not supported by the platform', () => {
    Platform.OS = 'android';

    const checkAriaRole =
      require('./checkAriaRole').checkAriaRole;

    expect(checkAriaRole('adjustable')).toEqual({
      message: '"adjustable" is not a native element for "android"',
      rule: 'INCOMPATIBLE_ACCESSIBILITY_ROLE',
    });
  });
});
