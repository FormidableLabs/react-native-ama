import type { AmaNode } from '../../ReactNativeAma.types';

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
  // @ts-ignore
  global.__DEV__ = true;
});

const createNode = (overrides: Partial<AmaNode> = {}): AmaNode => ({
  type: 'Text',
  viewId: 1,
  bounds: [0, 0, 100, 100],
  hasOnSubmitEditing: false,
  isAccessible: true,
  ...overrides,
});

const setupMock = (longNumberMinLength = 12) => {
  jest.doMock('../config', () => ({
    __esModule: true,
    default: { longNumberMinLength },
  }));
};

describe('checkLongNumber', () => {
  it('flags text with an unformatted digit run at or above the threshold', () => {
    setupMock(12);
    const { checkLongNumber } = require('./checkLongNumber');

    const node = createNode({ content: '4111111111111111' });

    const result = checkLongNumber(node);
    expect(result).toMatchObject({
      rule: 'LONG_NUMBER_NOT_FORMATTED',
      viewId: 1,
    });
  });

  it('does not flag a formatted phone number, even with more digits than the threshold', () => {
    setupMock(12);
    const { checkLongNumber } = require('./checkLongNumber');

    const node = createNode({ content: '+44 20 7123 4567' });

    const result = checkLongNumber(node);
    expect(result).toBeNull();
  });

  it('does not flag a digit run shorter than the threshold', () => {
    setupMock(12);
    const { checkLongNumber } = require('./checkLongNumber');

    const node = createNode({ content: '1234567890' });

    const result = checkLongNumber(node);
    expect(result).toBeNull();
  });

  it('flags a shorter digit run when longNumberMinLength is lowered', () => {
    setupMock(8);
    const { checkLongNumber } = require('./checkLongNumber');

    const node = createNode({ content: '12345678' });

    const result = checkLongNumber(node);
    expect(result).toMatchObject({
      rule: 'LONG_NUMBER_NOT_FORMATTED',
      viewId: 1,
    });
  });

  it('prefers ariaLabel over content when checking for a long number', () => {
    setupMock(12);
    const { checkLongNumber } = require('./checkLongNumber');

    const node = createNode({
      ariaLabel: '4111111111111111',
      content: 'Card number',
    });

    const result = checkLongNumber(node);
    expect(result).toMatchObject({
      rule: 'LONG_NUMBER_NOT_FORMATTED',
      label: '4111111111111111',
    });
  });

  it('returns null when there is no text content', () => {
    setupMock(12);
    const { checkLongNumber } = require('./checkLongNumber');

    const node = createNode({ content: undefined, ariaLabel: undefined });

    const result = checkLongNumber(node);
    expect(result).toBeNull();
  });

  it('returns null when the node is not accessible', () => {
    setupMock(12);
    const { checkLongNumber } = require('./checkLongNumber');

    const node = createNode({
      content: '4111111111111111',
      isAccessible: false,
    });

    const result = checkLongNumber(node);
    expect(result).toBeNull();
  });
});
