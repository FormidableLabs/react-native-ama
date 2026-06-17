beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();
  // @ts-ignore
  global.__DEV__ = true;
});

describe('isRuleDisabled', () => {
  it('returns true when the rule action is PLEASE_FORGIVE_ME', () => {
    jest.doMock('./getRuleAction', () => ({
      getRuleAction: () => 'PLEASE_FORGIVE_ME',
    }));

    const { isRuleDisabled } = require('./isRuleDisabled');
    expect(isRuleDisabled({ rule: 'CONTRAST_FAILED', viewId: 1 })).toBe(true);
  });

  it('returns false when the rule action is MUST', () => {
    jest.doMock('./getRuleAction', () => ({
      getRuleAction: () => 'MUST',
    }));

    const { isRuleDisabled } = require('./isRuleDisabled');
    expect(isRuleDisabled({ rule: 'NO_ACCESSIBILITY_LABEL', viewId: 1 })).toBe(false);
  });

  it('returns false when the rule action is SHOULD', () => {
    jest.doMock('./getRuleAction', () => ({
      getRuleAction: () => 'SHOULD',
    }));

    const { isRuleDisabled } = require('./isRuleDisabled');
    expect(isRuleDisabled({ rule: 'CONTRAST_FAILED_AAA', viewId: 1 })).toBe(false);
  });
});
