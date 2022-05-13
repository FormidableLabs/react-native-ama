export type Rule =
  | 'CONTRAST_CHECKER'
  | 'CONTRAST_CHECKER_AAA'
  | 'UPPERCASE_TEXT';
export type RuleValue = 'warn' | 'throw';

export const loggerRules: Record<Rule, RuleValue> = {
  CONTRAST_CHECKER: 'throw',
  CONTRAST_CHECKER_AAA: 'warn',
  UPPERCASE_TEXT: 'throw',
};
