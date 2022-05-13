import { amaNoUndefined } from './debug';
import * as Logger from './logger';

afterEach(() => {
  jest.clearAllMocks();
});

describe('AMA Internal Debug utilities', () => {
  it('amaNoUndefined: prints and throws an Error if the given property is undefined', () => {
    const log = jest.spyOn(Logger, 'log');

    amaNoUndefined({} as any, 'test');

    expect(log).toHaveBeenCalledWith(
      'PROPERTY_UNDEFINED',
      'The property "test" cannot be UNDEFINED',
    );
  });
});

jest.mock('./logger');
