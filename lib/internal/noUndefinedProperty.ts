import { log } from './logger';
import type { Rule } from './logger.rules';

export const noUndefinedProperty = <T>(
  properties: T,
  property: keyof T,
  rule: Rule = 'NO_UNDEFINED',
) => {
  if (properties[property] === undefined) {
    log(rule, `The property "${property}" cannot be UNDEFINED`);
  }
};
