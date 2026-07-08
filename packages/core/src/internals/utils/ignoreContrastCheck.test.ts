beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
  // @ts-ignore
  global.__DEV__ = true;
});

describe('shouldIgnoreContrastCheckForDisabledElement', () => {
  it('returns the project config override when set', () => {
    jest.doMock('../config', () => ({
      __esModule: true,
      default: { rules: { IGNORE_CONTRAST_FOR_DISABLED_ELEMENTS: true } },
    }));
    jest.doMock('./rules', () => ({
      IGNORE_CONTRAST_FOR_DISABLED_ELEMENTS: false,
    }));

    const { shouldIgnoreContrastCheckForDisabledElement } = require('./ignoreContrastCheck');
    expect(shouldIgnoreContrastCheckForDisabledElement()).toBe(true);
  });

  it('falls back to the default rule value when config has no override', () => {
    jest.doMock('../config', () => ({
      __esModule: true,
      default: { rules: {} },
    }));
    jest.doMock('./rules', () => ({
      IGNORE_CONTRAST_FOR_DISABLED_ELEMENTS: false,
    }));

    const { shouldIgnoreContrastCheckForDisabledElement } = require('./ignoreContrastCheck');
    expect(shouldIgnoreContrastCheckForDisabledElement()).toBe(false);
  });
});
