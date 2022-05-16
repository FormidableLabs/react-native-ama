import * as fs from 'fs';

import { log } from './logger';
import { RULES_HELP, SHELL_COLORS } from './logger.rules';

beforeEach(() => {
  jest.resetModules();
  jest.clearAllMocks();

  console.error = jest.fn();
  console.warn = jest.fn();
});

describe('Logger', () => {
  describe('When no custom logger rules have been defined uses the default ones', () => {
    beforeEach(() => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    });

    it('log: console.log and throws an error when the rule is "throw"', () => {
      const consoleError = jest.spyOn(console, 'error');

      expect(() => log('CONTRAST_FAILED', 'Error Message')).toThrowError(
        '❌ [AMA CONTRAST_FAILED] - Error Message',
      );

      expect(consoleError).toHaveBeenCalledWith(
        `${SHELL_COLORS.RED}❌ [AMA CONTRAST_FAILED]${SHELL_COLORS.RESET} - ${SHELL_COLORS.YELLOW}Error Message${SHELL_COLORS.RESET}\n\n${RULES_HELP.CONTRAST_FAILED}`,
        '\n',
      );
    });

    it('log: console.warn the message when the rule is "warn"', () => {
      const consoleWarn = jest.spyOn(console, 'warn');

      log('CONTRAST_FAILED_AAA', 'Error Message');

      expect(consoleWarn).toHaveBeenCalledWith(
        `${SHELL_COLORS.RED}❌ [AMA CONTRAST_FAILED_AAA]${SHELL_COLORS.RESET} - ${SHELL_COLORS.YELLOW}Error Message${SHELL_COLORS.RESET}\n\n${RULES_HELP.CONTRAST_FAILED_AAA}`,
      );
    });
  });

  describe('When the custom rules file exists', () => {
    it('it uses the the override rules first', () => {
      jest.doMock('./../../ama.rules.json', () => {
        return {
          CONTRAST_FAILED: 'warn',
        };
      });

      const { log: newLog } = require('./logger');

      const consoleWarn = jest.spyOn(console, 'warn');

      newLog('CONTRAST_FAILED', 'Another message');

      expect(consoleWarn).toHaveBeenCalledWith(
        `${SHELL_COLORS.RED}❌ [AMA CONTRAST_FAILED]${SHELL_COLORS.RESET} - ${SHELL_COLORS.YELLOW}Another message${SHELL_COLORS.RESET}\n\n${RULES_HELP.CONTRAST_FAILED}`,
      );
    });
  });
});

jest.mock('./../../ama.rules.json', () => {
  return {};
});

jest.mock('./logger.rules', () => {
  const original = jest.requireActual('./logger.rules');

  return {
    ...original,
    LOGGER_RULES: {
      CONTRAST_FAILED: 'throw',
      CONTRAST_FAILED_AAA: 'warn',
    },
  };
});
