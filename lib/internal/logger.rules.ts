export type Rule =
  | 'NO_UNDEFINED'
  | 'CONTRAST_FAILED'
  | 'CONTRAST_FAILED_AAA'
  | 'MINIMUM_SIZE'
  | 'UPPERCASE_TEXT_NO_ACCESSIBILITY_LABEL'
  | 'UPPERCASE_ACCESSIBILITY_LABEL'
  | 'NO_ACCESSIBILITY_ROLE'
  | 'NO_ACCESSIBILITY_LABEL'
  | 'NO_KEYBOARD_TRAP';
export type RuleValue = 'SHOULD_NOT' | 'MUST_NOT';

export const NON_OVERRIDABLE_RULES: Partial<Rule>[] = [
  'NO_ACCESSIBILITY_ROLE',
  'NO_ACCESSIBILITY_LABEL',
  'NO_KEYBOARD_TRAP',
  'NO_UNDEFINED',
];

export const LOGGER_RULES: Record<Rule, RuleValue> = {
  CONTRAST_FAILED: 'MUST_NOT',
  CONTRAST_FAILED_AAA: 'SHOULD_NOT',
  MINIMUM_SIZE: 'MUST_NOT',
  UPPERCASE_TEXT_NO_ACCESSIBILITY_LABEL: 'MUST_NOT',
  UPPERCASE_ACCESSIBILITY_LABEL: 'MUST_NOT',
  NO_ACCESSIBILITY_LABEL: 'MUST_NOT',
  NO_ACCESSIBILITY_ROLE: 'MUST_NOT',
  NO_KEYBOARD_TRAP: 'MUST_NOT',
  NO_UNDEFINED: 'MUST_NOT',
};

export const CONTRAST_CHECKER_MAX_DEPTH = 5;

export const RULES_HELP: Record<Rule, string> = {
  NO_UNDEFINED: '',
  CONTRAST_FAILED:
    'https://formidable.com/open-source/react-native-ama/docs/advanced/contrast#contrast_failed',
  CONTRAST_FAILED_AAA:
    'https://formidable.com/open-source/react-native-ama/docs/advanced/contrast#contrast_failed_aaa',
  MINIMUM_SIZE:
    'https://formidable.com/open-source/react-native-ama/docs/advanced/minimum-size',
  UPPERCASE_TEXT_NO_ACCESSIBILITY_LABEL:
    'https://formidable.com/open-source/react-native-ama//docs/rules/uppercase-text#uppercase_text_no_accessibility_label',
  UPPERCASE_ACCESSIBILITY_LABEL:
    'https://formidable.com/open-source/react-native-ama//docs/rules/uppercase-text#uppercase_accessibility_label',
  NO_ACCESSIBILITY_LABEL:
    'https://formidable.com/open-source/react-native-ama/docs/rules/accessibility-labels#no_accessibility_label',
  NO_ACCESSIBILITY_ROLE:
    'https://formidable.com/open-source/react-native-ama/docs/rules/accessibility-role#no_accessibility_role',
  NO_KEYBOARD_TRAP:
    'https://formidable.com/open-source/react-native-ama/docs/rules/accessibility-role#no_accessibility_role',
};

export const canRuleBeOverridden = (rule: Rule) => {
  return !NON_OVERRIDABLE_RULES.includes(rule);
};

export const SHELL_COLORS = {
  RED: '\x1b[31m',
  YELLOW: '\x1b[33m',
  RESET: '\x1b[0m',
};
