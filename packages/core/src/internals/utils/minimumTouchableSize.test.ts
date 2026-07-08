jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
  },
}));

describe('minimumTouchableSize', () => {
  it.each`
    os           | minimumSize
    ${'ios'}     | ${44}
    ${'android'} | ${48}
  `(
    'returns the correct minimum touchable area size for $os',
    ({ os, minimumSize }) => {
      jest.resetModules();

      jest.doMock('react-native', () => ({
        Platform: { OS: os },
      }));

      const { MINIMUM_TOUCHABLE_SIZE } = require('./minimumTouchableSize');

      expect(MINIMUM_TOUCHABLE_SIZE).toEqual(minimumSize);

      jest.dontMock('react-native');
    },
  );
});
