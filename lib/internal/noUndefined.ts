import { log } from './logger';
import type { Rule } from './logger.rules';

export const noUndefined = (value: any, name: string, rule: Rule) => {
  if (value == undefined) {
    log(rule, `The property "${name}" cannot be UNDEFINED`);
  }
};
