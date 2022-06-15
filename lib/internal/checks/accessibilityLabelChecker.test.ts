import * as Logger from '../logger';
import { accessibilityLabelChecker } from './accessibilityLabelChecker';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('accessibilityLabelChecker', () => {
  it.each(['TEST ME', 'ÁÖÜÄ'])(
    'logs the UPPERCASE_ACCESSIBILITY_LABEL error if the accessibilityLabel is all uppercase',
    accessibilityLabel => {
      const logSpy = jest.spyOn(Logger, 'log');

      accessibilityLabelChecker({ accessibilityLabel });

      expect(logSpy).toHaveBeenCalledWith(
        'UPPERCASE_ACCESSIBILITY_LABEL',
        'The accessibilityLabel cannot be all CAPS',
        accessibilityLabel,
      );
    },
  );
});

jest.mock('./logger');
