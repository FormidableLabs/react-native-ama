beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
  // @ts-ignore
  global.__DEV__ = true;
});

describe('isAccessibilityLabelAllowed', () => {
  const setupMock = (uppercaseMinLength: number, exceptions: string[] = []) => {
    jest.doMock('../config', () => ({
      __esModule: true,
      default: { uppercaseMinLength, accessibilityLabelExceptions: exceptions },
    }));
  };

  it('allows label shorter than uppercaseMinLength', () => {
    setupMock(4);
    const { isAccessibilityLabelAllowed } = require('./isA11yLabelAllowed');
    expect(isAccessibilityLabelAllowed('OK')).toBe(true);
  });

  it('disallows label at or above uppercaseMinLength', () => {
    setupMock(4);
    const { isAccessibilityLabelAllowed } = require('./isA11yLabelAllowed');
    expect(isAccessibilityLabelAllowed('LONG')).toBe(false);
  });

  it('allows label that is in the exceptions list', () => {
    setupMock(4, ['FAQ']);
    const { isAccessibilityLabelAllowed } = require('./isA11yLabelAllowed');
    expect(isAccessibilityLabelAllowed('FAQ')).toBe(true);
  });

  it('disallows label that is not in exceptions and exceeds min length', () => {
    setupMock(4, ['FAQ']);
    const { isAccessibilityLabelAllowed } = require('./isA11yLabelAllowed');
    expect(isAccessibilityLabelAllowed('LONG')).toBe(false);
  });
});
