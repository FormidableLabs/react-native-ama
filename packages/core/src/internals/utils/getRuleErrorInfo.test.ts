beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
  // @ts-ignore
  global.__DEV__ = true;
});

describe('getAMARuleErrorInfo', () => {
  it('returns message, url, and severity for a known rule', () => {
    jest.doMock('./rules', () => ({
      RULES_HELP: {
        NO_ACCESSIBILITY_LABEL: {
          message: 'Missing label',
          url: '/guidelines/accessibility-label',
          severity: 'Critical',
          issue: 'Missing accessibility label',
          howToFix: 'Add a label',
        },
      },
    }));

    const { getAMARuleErrorInfo } = require('./getRuleErrorInfo');
    const result = getAMARuleErrorInfo({ rule: 'NO_ACCESSIBILITY_LABEL', viewId: 1 });

    expect(result.message).toBe('Missing label');
    expect(result.url).toContain('/guidelines/accessibility-label');
    expect(result.severity).toBe('Critical');
  });

  it('appends extra to message when provided', () => {
    jest.doMock('./rules', () => ({
      RULES_HELP: {
        CONTRAST_FAILED: {
          message: 'Low contrast',
          url: '/guidelines/contrast',
          severity: 'Serious',
          issue: 'Contrast issue',
          howToFix: 'Fix contrast',
        },
      },
    }));

    const { getAMARuleErrorInfo } = require('./getRuleErrorInfo');
    const result = getAMARuleErrorInfo({ rule: 'CONTRAST_FAILED', viewId: 2, extra: '(#fff vs #eee)' });

    expect(result.message).toBe('Low contrast: (#fff vs #eee)');
  });

  it('throws when rule help is missing', () => {
    jest.doMock('./rules', () => ({
      RULES_HELP: {},
    }));

    const { getAMARuleErrorInfo } = require('./getRuleErrorInfo');
    expect(() => getAMARuleErrorInfo({ rule: 'UNKNOWN_RULE', viewId: 3 })).toThrow(
      'Missing rule help: UNKNOWN_RULE',
    );
  });
});
