import type { LayoutChangeEvent } from 'react-native';
import { Platform } from 'react-native';

beforeEach(() => {
  jest.resetAllMocks();
  jest.resetModules();

  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

describe('checkMinimumSize', () => {
  it.each`
    platform     | minimumSize | layoutSize
    ${'android'} | ${48}       | ${45}
    ${'ios'}     | ${44}       | ${43}
  `(
    '$platform: logs the MINIMUM_SIZE error if the touchable area size is less than the recommended one',
    ({ platform, minimumSize, layoutSize }) => {
      Platform.OS = platform;

      const { checkMinimumSize } = require('./checkMinimumSize');

      const result = checkMinimumSize({
        nativeEvent: {
          layout: {
            width: layoutSize,
            height: layoutSize,
          },
        },
      } as LayoutChangeEvent);

      expect(result).toMatchObject({
        rule: 'MINIMUM_SIZE',
        message: `The touchable area must have a minimum size of ${minimumSize}x${minimumSize} found instead: ${layoutSize}x${layoutSize}`,
      });
    },
  );

  it('warns the developer if the touchable area size is less than the recommended Android one if Platform is "ios"', () => {
    Platform.OS = 'ios';

    const consoleWarn = jest.spyOn(console, 'warn');
    const { checkMinimumSize } = require('./checkMinimumSize');

    checkMinimumSize({
      nativeEvent: {
        layout: {
          width: 45,
          height: 45,
        },
      },
    } as LayoutChangeEvent);

    expect(consoleWarn).toHaveBeenCalledWith(
      'The minimum size might be too small for Android',
    );
  });
});
