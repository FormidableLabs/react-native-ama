import * as Logger from '../logger';
import { noUndefinedProperty } from './noUndefinedProperty';

afterEach(() => {
  jest.clearAllMocks();
});

describe('AMA Internal Debug utilities', () => {
  it('noUndefined: prints and throws an Error if the given property is undefined', () => {
    const log = jest.spyOn(Logger, 'log');

    noUndefinedProperty({} as any, 'test', 'RANDOM_RULE' as any);

    expect(log).toHaveBeenCalledWith(
      'RANDOM_RULE',
      'The property "test" cannot be UNDEFINED',
    );
  });
});

jest.mock('./logger');
