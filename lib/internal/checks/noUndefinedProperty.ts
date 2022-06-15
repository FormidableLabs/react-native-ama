import type { LogParams } from '../logger';
import type { Rule } from '../logger.rules';

export type NoUndefinedPropertyParams<T> = {
  properties: T;
  property: keyof T;
  rule?: Rule;
};

export const noUndefinedProperty = <T>({
  property,
  properties,
  rule = 'NO_UNDEFINED',
}: NoUndefinedPropertyParams<T>): LogParams | null => {
  if (properties?.[property] == undefined) {
    return {
      rule,
      message: `The property "${property}" cannot be UNDEFINED`,
    };
  }

  return null;
};
