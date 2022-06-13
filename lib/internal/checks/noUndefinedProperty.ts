import { log } from '../logger';
import type { Rule } from '../logger.rules';
import type { CHECK_STATUS } from './types';

export const noUndefinedProperty = <T>(
  properties: T,
  property: keyof T,
  rule: Rule = 'NO_UNDEFINED',
): CHECK_STATUS => {
  if (properties[property] !== undefined) {
    return 'SUCCEED';
  }

  return log(rule, `The property "${property}" cannot be UNDEFINED`);
};
