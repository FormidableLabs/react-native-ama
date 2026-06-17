beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
  // @ts-ignore
  global.__DEV__ = true;
});

describe('logError', () => {
  it('calls logger.error for a MUST rule', () => {
    const loggerError = jest.fn();
    const loggerWarn = jest.fn();

    jest.doMock('./logger', () => ({
      __esModule: true,
      default: { log: jest.fn(), warn: loggerWarn, error: loggerError },
    }));
    jest.doMock('./getRuleAction', () => ({
      getRuleAction: () => 'MUST',
    }));
    jest.doMock('./rules', () => ({
      RULES_HELP: {
        NO_ACCESSIBILITY_LABEL: {
          message: 'Missing label',
          url: '/guidelines/accessibility-label',
          severity: 'Critical',
        },
      },
    }));

    const { logError } = require('./logError');
    logError({ rule: 'NO_ACCESSIBILITY_LABEL', viewId: 1 });

    expect(loggerError).toHaveBeenCalledTimes(1);
    expect(loggerWarn).not.toHaveBeenCalled();
  });

  it('calls logger.error for a MUST_NOT rule', () => {
    const loggerError = jest.fn();
    const loggerWarn = jest.fn();

    jest.doMock('./logger', () => ({
      __esModule: true,
      default: { log: jest.fn(), warn: loggerWarn, error: loggerError },
    }));
    jest.doMock('./getRuleAction', () => ({
      getRuleAction: () => 'MUST_NOT',
    }));
    jest.doMock('./rules', () => ({
      RULES_HELP: {
        NO_UPPERCASE_TEXT: {
          message: 'Avoid uppercase',
          url: '/guidelines/text',
          severity: 'Serious',
        },
      },
    }));

    const { logError } = require('./logError');
    logError({ rule: 'NO_UPPERCASE_TEXT', viewId: 2 });

    expect(loggerError).toHaveBeenCalledTimes(1);
    expect(loggerWarn).not.toHaveBeenCalled();
  });

  it('calls logger.warn for a SHOULD rule', () => {
    const loggerError = jest.fn();
    const loggerWarn = jest.fn();

    jest.doMock('./logger', () => ({
      __esModule: true,
      default: { log: jest.fn(), warn: loggerWarn, error: loggerError },
    }));
    jest.doMock('./getRuleAction', () => ({
      getRuleAction: () => 'SHOULD',
    }));
    jest.doMock('./rules', () => ({
      RULES_HELP: {
        CONTRAST_FAILED_AAA: {
          message: 'Low contrast AAA',
          url: '/guidelines/contrast',
          severity: 'Serious',
        },
      },
    }));

    const { logError } = require('./logError');
    logError({ rule: 'CONTRAST_FAILED_AAA', viewId: 3 });

    expect(loggerWarn).toHaveBeenCalledTimes(1);
    expect(loggerError).not.toHaveBeenCalled();
  });

  it('includes the label in the log when provided', () => {
    const loggerError = jest.fn();

    jest.doMock('./logger', () => ({
      __esModule: true,
      default: { log: jest.fn(), warn: jest.fn(), error: loggerError },
    }));
    jest.doMock('./getRuleAction', () => ({
      getRuleAction: () => 'MUST',
    }));
    jest.doMock('./rules', () => ({
      RULES_HELP: {
        NO_ACCESSIBILITY_LABEL: {
          message: 'Missing label',
          url: '/guidelines/accessibility-label',
          severity: 'Critical',
        },
      },
    }));

    const { logError } = require('./logError');
    logError({ rule: 'NO_ACCESSIBILITY_LABEL', viewId: 5, label: 'Submit' });

    expect(loggerError).toHaveBeenCalledWith(
      expect.stringContaining('Submit'),
    );
  });

  it('includes extra in the message when provided', () => {
    const loggerError = jest.fn();

    jest.doMock('./logger', () => ({
      __esModule: true,
      default: { log: jest.fn(), warn: jest.fn(), error: loggerError },
    }));
    jest.doMock('./getRuleAction', () => ({
      getRuleAction: () => 'MUST',
    }));
    jest.doMock('./rules', () => ({
      RULES_HELP: {
        NO_ACCESSIBILITY_LABEL: {
          message: 'Missing label',
          url: '/guidelines/accessibility-label',
          severity: 'Critical',
        },
      },
    }));

    const { logError } = require('./logError');
    logError({ rule: 'NO_ACCESSIBILITY_LABEL', viewId: 6, extra: 'extra info' });

    expect(loggerError).toHaveBeenCalledWith(
      expect.stringContaining('extra info'),
    );
  });
});
