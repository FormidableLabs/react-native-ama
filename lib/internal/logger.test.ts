import { log } from './logger';
import {
  NON_OVERRIDABLE_RULES,
  RULES_HELP,
  SHELL_COLORS,
} from './logger.rules';

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();

  console.warn = jest.fn();
  console.info = jest.fn();
});

describe('Logger', () => {
  describe('When no custom logger rules have been defined uses the default ones', () => {
    it('console.info the rules and returns ERROR', () => {
      const consoleInfo = jest.spyOn(console, 'info');
      const result = log('CONTRAST_FAILED', 'Error Message');

      expect(result).toBe('ERROR');

      expect(consoleInfo).toHaveBeenCalledWith(
        `${SHELL_COLORS.RED}❌ [AMA CONTRAST_FAILED]${SHELL_COLORS.RESET} - ${SHELL_COLORS.YELLOW}Error Message${SHELL_COLORS.RESET}\n\n${RULES_HELP.CONTRAST_FAILED}\n\n`,
        '',
        '\n',
      );
    });

    it('console.warn the rules and returns WARNING', () => {
      const consoleWarn = jest.spyOn(console, 'warn');

      const result = log('CONTRAST_FAILED_AAA', 'Yellow one');

      expect(result).toBe('WARNING');

      expect(consoleWarn).toHaveBeenCalledWith(
        `${SHELL_COLORS.RED}❌ [AMA CONTRAST_FAILED_AAA]${SHELL_COLORS.RESET} - ${SHELL_COLORS.YELLOW}Yellow one${SHELL_COLORS.RESET}\n\n${RULES_HELP.CONTRAST_FAILED_AAA}\n\n`,
        '',
        '\n',
      );
    });
  });

  describe('When the custom rules file exists', () => {
    it('it uses the the override rules first', () => {
      jest.doMock('./../../ama.rules.json', () => {
        return {
          rules: {
            CONTRAST_FAILED: 'warn',
          },
        };
      });

      const { log: newLog } = require('./logger');

      const consoleWarn = jest.spyOn(console, 'warn');

      const result = newLog('CONTRAST_FAILED', 'Another message');

      expect(result).toBe('WARNING');

      expect(consoleWarn).toHaveBeenCalledWith(
        `${SHELL_COLORS.RED}❌ [AMA CONTRAST_FAILED]${SHELL_COLORS.RESET} - ${SHELL_COLORS.YELLOW}Another message${SHELL_COLORS.RESET}\n\n${RULES_HELP.CONTRAST_FAILED}\n\n`,
        '',
        '\n',
      );
    });
  });

  it.each(NON_OVERRIDABLE_RULES)(
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

      const result = log(rule, 'Error Message');

      expect(result).toBe('ERROR');
    },
  );
});

jest.mock('./../../ama.rules.json', () => {
  return {};
});

jest.mock('./logger.rules', () => {
  const original = jest.requireActual('./logger.rules');

  return {
    ...original,
    LOGGER_RULES: {
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
    },
  };
});
