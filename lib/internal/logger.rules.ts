export type Rule =
  | 'CONTRAST_FAILED'
  | 'CONTRAST_FAILED_AAA'
  | 'MINIMUM_SIZE'
  | 'PROPERTY_UNDEFINED';
export type RuleValue = 'warn' | 'throw';

export const loggerRules: Record<Rule, RuleValue> = {
  CONTRAST_FAILED: 'throw',
  CONTRAST_FAILED_AAA: 'warn',
  MINIMUM_SIZE: 'throw',
  PROPERTY_UNDEFINED: 'throw',
};
