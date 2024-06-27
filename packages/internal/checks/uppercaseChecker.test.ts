import { uppercaseChecker } from './uppercaseChecker';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('uppercaseChecked', () => {
  describe('Given the style has `textTransform = uppercase` property set', () => {
    it.each([null, undefined, '', ' '])(
      'Then fails if no accessibilityLabel is provided',
      accessibilityLabel => {
        const result = uppercaseChecker({
          style: {
            textTransform: 'uppercase',
          },
          // @ts-ignore
          accessibilityLabel: accessibilityLabel,
          extra: 'COMPONENT',
        });

        expect(result).toMatchObject({
          rule: 'UPPERCASE_TEXT_NO_ACCESSIBILITY_LABEL',
          message:
            'accessibilityLabel cannot be empty when using `textTransform = uppercase`',
          extra: 'COMPONENT',
        });
      },
    );

    it('Succeed if accessibilityLabel is not empty', () => {
      const result = uppercaseChecker({
        style: {
          textTransform: 'uppercase',
        },
        accessibilityLabel: ' whatever',
        extra: 'COMPONENT',
      });

      expect(result).toBe(null);
    });
  });
});
