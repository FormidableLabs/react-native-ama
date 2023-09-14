import { uppercaseStringChecker } from './uppercaseStringChecker';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('accessibilityLabelChecker', () => {
  it.each(['TEST ME', 'ÁÖÜÄ'])(
    'logs the NO_UPPERCASE_TEXT error if the accessibilityLabel is all uppercase',
    accessibilityLabel => {
      const result = uppercaseStringChecker({ text: accessibilityLabel });

      expect(result).toMatchObject({
        rule: 'NO_UPPERCASE_TEXT',
        message: 'The accessibilityLabel cannot be all CAPS',
        extra: accessibilityLabel,
      });
    },
  );

  it('ignores number', () => {
    const result = uppercaseStringChecker({ text: '123' });

    expect(result).toBeNull();
  });

  it('ignores currencies', () => {
    const result = uppercaseStringChecker({ text: '$123' });

    expect(result).toBeNull();
  });
});
