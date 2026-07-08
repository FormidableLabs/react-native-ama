import { AmaNode } from '../../ReactNativeAma.types';

jest.mock('react-native', () => ({ Platform: { OS: 'ios' } }));

beforeEach(() => {
  jest.clearAllMocks();
});

const createNode = (overrides: Partial<AmaNode> = {}): AmaNode => ({
  type: 'Pressable',
  viewId: 1,
  bounds: [44, 44, 0, 0],
  hasOnSubmitEditing: false,
  isAccessible: true,
  ...overrides,
});

describe('checkMinimumSize', () => {
  it.each`
    platform     | minimumSize | layoutSize
    ${'android'} | ${48}       | ${45}
    ${'ios'}     | ${44}       | ${43}
  `(
    '$platform: returns MINIMUM_SIZE error if touchable area is smaller than required',
    ({ platform, minimumSize, layoutSize }) => {
      jest.resetModules();
      jest.doMock('react-native', () => ({ Platform: { OS: platform } }));

      const { checkMinimumSize } = require('./checkMinimumSize');

      const result = checkMinimumSize(
        createNode({ bounds: [layoutSize, layoutSize, 0, 0] }),
      );

      expect(result).toMatchObject({
        rule: 'MINIMUM_SIZE',
        extra: expect.stringContaining(
          `${minimumSize}x${minimumSize} found instead: ${layoutSize}x${layoutSize}`,
        ),
      });
    },
  );

  it('returns null if touchable area meets minimum size', () => {
    jest.resetModules();
    jest.doMock('react-native', () => ({ Platform: { OS: 'ios' } }));

    const { checkMinimumSize } = require('./checkMinimumSize');

    const result = checkMinimumSize(createNode({ bounds: [44, 44, 0, 0] }));

    expect(result).toBeNull();
  });

  it('returns null for non-Pressable nodes', () => {
    jest.resetModules();
    jest.doMock('react-native', () => ({ Platform: { OS: 'ios' } }));

    const { checkMinimumSize } = require('./checkMinimumSize');

    const result = checkMinimumSize(
      createNode({ type: 'Text', bounds: [10, 10, 0, 0] }),
    );

    expect(result).toBeNull();
  });
});
