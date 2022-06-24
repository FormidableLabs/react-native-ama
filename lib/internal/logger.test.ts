import { getRuleAction, logFailure } from '../internal/logger';
import {
  NON_OVERRIDABLE_RULES,
  RULES_HELP,
  Rule,
  SHELL_COLORS,
} from './logger.rules';

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();

  console.warn = jest.fn();
  console.info = jest.fn();
});

describe('getRuleAction', () => {
  it.each(Object.keys(LOGGER_RULES))(
    'uses the default rules if no custom ones have been defined',
    // @ts-ignore
    (ruleKey: keyof typeof LOGGER_RULES) => {
      const result = getRuleAction?.(ruleKey);

      expect(result).toBe(LOGGER_RULES[ruleKey]);
    },
  );

  it('uses the custom value if have been defined', () => {
    jest.doMock('./../../ama.rules.json', () => {
      return {
        rules: {
          CONTRAST_FAILED: 'warn',
        },
      };
    });
    const { getRuleAction: originalGetRuleAction } = require('./logger');

    const result = originalGetRuleAction('CONTRAST_FAILED');

    expect(LOGGER_RULES.CONTRAST_FAILED).not.toBe('warn');
    expect(result).toBe('warn');
  });

  it.each(NON_OVERRIDABLE_RULES!)(
    'prevent the rules %s from being overridden',
    rule => {
      const rules = {};

      // @ts-ignore
      rules[rule] = 'SHOULD_NOT';

      jest.doMock('./../../ama.rules.json', () => {
        return {
          rules,
        };
      });

      const result = getRuleAction?.(rule as Rule);

      // @ts-ignore
      expect(result).toBe(LOGGER_RULES[rule]);
    },
  );
});

describe('logFailure', () => {
  it('Uses console.info if the action is MUST_NOT', () => {
    const consoleInfo = jest.spyOn(console, 'info');

    const result = logFailure?.({
      action: 'MUST_NOT',
      rule: 'CONTRAST_FAILED',
      message: 'This is the error message',
      extra: 'This is the extra part',
    });

    expect(result).toBe('ERROR');
    expect(consoleInfo).toHaveBeenCalledWith(
      // @ts-ignore
      `❌ ${SHELL_COLORS.BG_RED}[ AMA ]${SHELL_COLORS.RESET}: ${SHELL_COLORS.BLUE}CONTRAST_FAILED${SHELL_COLORS.RESET} - ${SHELL_COLORS.YELLOW}This is the error message${SHELL_COLORS.RESET}\n\n${RULES_HELP.CONTRAST_FAILED}\n\n`,
      'This is the extra part',
      '\n',
    );
  });
});

jest.mock('./../../ama.rules.json', () => {
  return {};
});

const LOGGER_RULES = {
  CONTRAST_FAILED: 'MUST_NOT',
  CONTRAST_FAILED_AAA: 'SHOULD_NOT',
  MINIMUM_SIZE: 'MUST_NOT',
  UPPERCASE_TEXT_NO_ACCESSIBILITY_LABEL: 'MUST_NOT',
  UPPERCASE_ACCESSIBILITY_LABEL: 'MUST_NOT',
  NO_ACCESSIBILITY_LABEL: 'MUST_NOT',
  NO_ACCESSIBILITY_ROLE: 'MUST_NOT',
  NO_KEYBOARD_TRAP: 'MUST_NOT',
  NO_UNDEFINED: 'MUST_NOT',
  NO_FORM_LABEL: 'MUST_NOT',
};

jest.mock('./logger.rules', () => {
  const original = jest.requireActual('./logger.rules');

  return {
    ...original,
    LOGGER_RULES,
  };
});
