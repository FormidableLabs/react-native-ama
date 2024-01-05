import type { LogParams } from '../utils/logger';
import type { Rule } from '../utils/logger.rules';

export type NoUndefinedProperty<T> = {
  properties: T;
  property: keyof T;
  rule?: Rule;
};

export const noUndefinedProperty = <T>({
  property,
  properties,
  rule = 'NO_UNDEFINED',
}: NoUndefinedProperty<T>): LogParams | null => {
  if (properties?.[property] == null) {
    return {
      rule,
      message: `The property "${property as string}" cannot be UNDEFINED`,
      extra: properties,
    };
  }

  return null;
};
