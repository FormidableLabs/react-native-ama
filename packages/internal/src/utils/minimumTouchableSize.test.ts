beforeEach(() => {
  jest.resetModules();
});

describe('minimumTouchableSize', () => {
  it.each`
    os           | minimumSize
    ${'ios'}     | ${44}
    ${'android'} | ${48}
  `(
    'returns the correct minimum touchable area size for $os',
    ({ os, minimumSize }) => {
      const Platform = jest.requireActual(
        'react-native/Libraries/Utilities/Platform',
      );

      Platform.OS = os;

      const { MINIMUM_TOUCHABLE_SIZE } = require('./minimumTouchableSize');

      expect(MINIMUM_TOUCHABLE_SIZE).toEqual(minimumSize);
    },
  );
});
