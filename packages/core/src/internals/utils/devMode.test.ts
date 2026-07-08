/**
 * Tests the __DEV__ = false branch for modules that export null when not in dev mode.
 * Each test uses jest.resetModules + __DEV__ = false to hit the null branch.
 */

describe('dev mode null exports', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    // @ts-ignore
    global.__DEV__ = true;
  });

  it('logError is null when __DEV__ is false', () => {
    // @ts-ignore
    global.__DEV__ = false;
    const { logError } = require('./logError');
    expect(logError).toBeNull();
  });

  it('isRuleDisabled is null when __DEV__ is false', () => {
    // @ts-ignore
    global.__DEV__ = false;
    const { isRuleDisabled } = require('./isRuleDisabled');
    expect(isRuleDisabled).toBeNull();
  });

  it('getRuleAction is null when __DEV__ is false', () => {
    // @ts-ignore
    global.__DEV__ = false;
    const { getRuleAction } = require('./getRuleAction');
    expect(getRuleAction).toBeNull();
  });

  it('getAMARuleErrorInfo is null when __DEV__ is false', () => {
    // @ts-ignore
    global.__DEV__ = false;
    const { getAMARuleErrorInfo } = require('./getRuleErrorInfo');
    expect(getAMARuleErrorInfo).toBeNull();
  });

  it('shouldIgnoreContrastCheckForDisabledElement is null when __DEV__ is false', () => {
    // @ts-ignore
    global.__DEV__ = false;
    const { shouldIgnoreContrastCheckForDisabledElement } = require('./ignoreContrastCheck');
    expect(shouldIgnoreContrastCheckForDisabledElement).toBeNull();
  });

  it('isAccessibilityLabelAllowed is null when __DEV__ is false', () => {
    // @ts-ignore
    global.__DEV__ = false;
    const { isAccessibilityLabelAllowed } = require('./isA11yLabelAllowed');
    expect(isAccessibilityLabelAllowed).toBeNull();
  });

  it('amaClearHighlight is null when __DEV__ is false', () => {
    // @ts-ignore
    global.__DEV__ = false;
    const { amaClearHighlight } = require('./amaClearHighlight');
    expect(amaClearHighlight).toBeNull();
  });

  it('amaHighlightComponent is null when __DEV__ is false', () => {
    // @ts-ignore
    global.__DEV__ = false;
    const { amaHighlightComponent } = require('./amaHighlightComponent');
    expect(amaHighlightComponent).toBeNull();
  });

  it('logger is null when __DEV__ is false', () => {
    // @ts-ignore
    global.__DEV__ = false;
    const logger = require('./logger').default;
    expect(logger).toBeNull();
  });

  it('LOGGER_RULES is null when __DEV__ is false', () => {
    // @ts-ignore
    global.__DEV__ = false;
    const { LOGGER_RULES } = require('./rules');
    expect(LOGGER_RULES).toBeNull();
  });

  it('RULES_HELP is null when __DEV__ is false', () => {
    // @ts-ignore
    global.__DEV__ = false;
    const { RULES_HELP } = require('./rules');
    expect(RULES_HELP).toBeNull();
  });

  it('useAMADev is null when __DEV__ is false', () => {
    // @ts-ignore
    global.__DEV__ = false;
    const { useAMADev } = require('../useAMADev');
    expect(useAMADev).toBeNull();
  });
});
