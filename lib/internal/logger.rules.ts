export type Rule =
  | 'CONTRAST_FAILED'
  | 'CONTRAST_FAILED_AAA'
  | 'MINIMUM_SIZE'
  | 'PROPERTY_UNDEFINED';
export type RuleValue = 'warn' | 'throw';

export const LOGGER_RULES: Record<Rule, RuleValue> = {
  CONTRAST_FAILED: 'throw',
  CONTRAST_FAILED_AAA: 'warn',
  MINIMUM_SIZE: 'throw',
  PROPERTY_UNDEFINED: 'throw',
};

export const CONTRAST_CHECKER_MAX_DEPTH = 5;

export const RULES_HELP: Record<Rule, string> = {
  CONTRAST_FAILED:
    'https://formidable.com/open-source/react-native-ama/docs/advanced/contrast#contrast_failed',
  CONTRAST_FAILED_AAA:
    'https://formidable.com/open-source/react-native-ama/docs/advanced/contrast#contrast_failed_aaa',
  MINIMUM_SIZE:
    'https://formidable.com/open-source/react-native-ama/docs/advanced/minimum-size',
  PROPERTY_UNDEFINED:
    'https://formidable.com/open-source/react-native-ama/docs/advanced/custom-log-rules#contrast_failed',
};

export const SHELL_COLORS = {
  RED: '\x1b[31m',
  YELLOW: '\x1b[33m',
  RESET: '\x1b[0m',
};
