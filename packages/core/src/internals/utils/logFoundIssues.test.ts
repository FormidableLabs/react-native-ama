describe('logFoundIssues', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    // @ts-ignore
    global.__DEV__ = true;
  });

  it('logs only the summary when log mode is inspect', () => {
    const loggerLog = jest.fn();
    const logError = jest.fn();

    jest.doMock('../config', () => ({
      __esModule: true,
      default: {
        log: 'inspect',
      },
    }));
    jest.doMock('./logger', () => ({
      __esModule: true,
      default: {
        log: loggerLog,
      },
    }));
    jest.doMock('./logError', () => ({
      logError,
    }));

    const { logFoundIssues } = require('./logFoundIssues');

    logFoundIssues([{ rule: 'NO_HEADER_FOUND', viewId: -1 }]);

    expect(loggerLog).toHaveBeenCalledWith('Issues found: 1');
    expect(logError).not.toHaveBeenCalled();
  });

  it('logs every issue when log mode is always', () => {
    const loggerLog = jest.fn();
    const logError = jest.fn();
    const issues = [
      { rule: 'NO_HEADER_FOUND', viewId: -1 },
      { rule: 'NO_ACCESSIBILITY_ROLE', viewId: 42, label: 'Checkout' },
    ];

    jest.doMock('../config', () => ({
      __esModule: true,
      default: {
        log: 'always',
      },
    }));
    jest.doMock('./logger', () => ({
      __esModule: true,
      default: {
        log: loggerLog,
      },
    }));
    jest.doMock('./logError', () => ({
      logError,
    }));

    const { logFoundIssues } = require('./logFoundIssues');

    logFoundIssues(issues);

    expect(loggerLog).toHaveBeenCalledWith('Issues found: 2');
    expect(logError).toHaveBeenCalledTimes(2);
    expect(logError).toHaveBeenNthCalledWith(1, issues[0]);
    expect(logError).toHaveBeenNthCalledWith(2, issues[1]);
  });

  it('does nothing when there are no issues', () => {
    const loggerLog = jest.fn();
    const logError = jest.fn();

    jest.doMock('../config', () => ({
      __esModule: true,
      default: {
        log: 'always',
      },
    }));
    jest.doMock('./logger', () => ({
      __esModule: true,
      default: {
        log: loggerLog,
      },
    }));
    jest.doMock('./logError', () => ({
      logError,
    }));

    const { logFoundIssues } = require('./logFoundIssues');

    logFoundIssues([]);

    expect(loggerLog).not.toHaveBeenCalled();
    expect(logError).not.toHaveBeenCalled();
  });
});
