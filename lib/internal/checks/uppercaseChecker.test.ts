import * as Logger from '../logger';
import { uppercaseChecker } from './uppercaseChecker';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('uppercaseChecked', () => {
  describe('Given the style has `textTransform = uppercase` property set', () => {
    it.each([null, undefined, '', ' '])(
      'Then logs NO_UPPERCASE_TEXT error if no accessibilityLabel is provided',
      accessibilityLabel => {
        const logSpy = jest.spyOn(Logger, 'log');

        uppercaseChecker(
          {
            textTransform: 'uppercase',
          },
          // @ts-ignore
          accessibilityLabel,
          'COMPONENT',
        );

        expect(logSpy).toHaveBeenCalledWith(
          'UPPERCASE_TEXT_NO_ACCESSIBILITY_LABEL',
          'accessibilityLabel cannot be empty when using `textTransform = uppercase`',
          'COMPONENT',
        );
      },
    );

    it('Then does nothing if accessibilityLabel is not empty', () => {
      const logSpy = jest.spyOn(Logger, 'log');

      uppercaseChecker(
        {
          textTransform: 'uppercase',
        },
        ' whatever',
        'COMPONENT',
      );

      expect(logSpy).not.toHaveBeenCalled();
    });
  });
});

jest.mock('./logger');
