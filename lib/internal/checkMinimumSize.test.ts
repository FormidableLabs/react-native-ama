import type { LayoutChangeEvent } from 'react-native';
import { Platform } from 'react-native';

beforeEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
});

describe('checkMinimumSize', () => {
  it.each`
    platform     | minimumSize | layoutSize
    ${'android'} | ${48}       | ${45}
    ${'ios'}     | ${44}       | ${43}
  `(
    '$platform: logs the MINIMUM_SIZE error if the touchable area size is less than the recommended one',
    ({ platform, minimumSize, layoutSize }) => {
      const logMock = jest.fn();
      jest.doMock('./logger', () => {
        return {
          log: logMock,
        };
      });

      Platform.OS = platform;

      const { checkMinimumSize } = require('./checkMinimumSize');

      checkMinimumSize({
        nativeEvent: {
          layout: {
            width: layoutSize,
            height: layoutSize,
          },
        },
      } as LayoutChangeEvent);

      expect(logMock).toHaveBeenCalledWith(
        'MINIMUM_SIZE',
        `The touchable are must have a minimum size of ${minimumSize}x${minimumSize} found instead: ${layoutSize}x${layoutSize}`,
      );
    },
  );
});

jest.mock('./logger');
