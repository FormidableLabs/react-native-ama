import { log } from './logger';
import type { Rule } from './logger.rules';

export const noUndefined = <T>(
  properties: T,
  property: keyof T,
  rule: Rule,
) => {
  if (properties[property] === undefined) {
    log(rule, `The property "${property}" cannot be UNDEFINED`);
  }
};
