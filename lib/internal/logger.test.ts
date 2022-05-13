import * as fs from 'fs';

import { log } from './logger';

beforeEach(() => {
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('Logger', () => {
  describe('When no custom logger rules have been defined uses the default ones', () => {
    beforeEach(() => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(false);
    });

    it('log: console.log and throws an error when the rule is "throw"', () => {
      const errorMessage = '❌ [AMA CONTRAST_CHECKER] - Error Message';
      const consoleError = jest.spyOn(console, 'error');

      expect(() => log('CONTRAST_CHECKER', 'Error Message')).toThrowError(
        errorMessage,
      );

      expect(consoleError).toHaveBeenCalledWith(errorMessage);
    });

    it('log: console.warn the message when the rule is "warn"', () => {
      const errorMessage = '❌ [AMA UPPERCASE_TEXT] - Error Message';
      const consoleWarn = jest.spyOn(console, 'warn');

      log('UPPERCASE_TEXT', 'Error Message');
      expect(consoleWarn).toHaveBeenCalledWith(errorMessage);
    });
  });

  describe('When the custom rules file exists', () => {
    beforeEach(() => {
      jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    });

    it('it uses the the override rules first', () => {
      const errorMessage = '❌ [AMA CONTRAST_CHECKER] - Error Message';
      const consoleWarn = jest.spyOn(console, 'warn');

      log('CONTRAST_CHECKER', 'Error Message');

      expect(consoleWarn).toHaveBeenCalledWith(errorMessage);
    });
  });
});

jest.mock('fs');

jest.mock(
  `${__dirname}/../../ama.json`,
  () => {
    return {
      CONTRAST_CHECKER: 'warn',
    };
  },
  { virtual: true },
);

jest.mock('./logger.rules.ts', () => {
  return {
    loggerRules: {
      CONTRAST_CHECKER: 'throw',
      UPPERCASE_TEXT: 'warn',
    },
  };
});
