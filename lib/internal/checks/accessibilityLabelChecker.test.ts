import { accessibilityLabelChecker } from './accessibilityLabelChecker';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('accessibilityLabelChecker', () => {
  it.each(['TEST ME', 'ÁÖÜÄ'])(
    'logs the UPPERCASE_ACCESSIBILITY_LABEL error if the accessibilityLabel is all uppercase',
    accessibilityLabel => {
      const result = accessibilityLabelChecker({ accessibilityLabel });

      expect(result).toMatchObject({
        rule: 'UPPERCASE_ACCESSIBILITY_LABEL',
        message: 'The accessibilityLabel cannot be all CAPS',
        extra: accessibilityLabel,
      });
    },
  );
});
