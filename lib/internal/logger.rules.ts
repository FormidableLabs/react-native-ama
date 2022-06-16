export type Rule =
  | 'NO_UNDEFINED'
  | 'CONTRAST_FAILED'
  | 'CONTRAST_FAILED_AAA'
  | 'MINIMUM_SIZE'
  | 'UPPERCASE_TEXT_NO_ACCESSIBILITY_LABEL'
  | 'UPPERCASE_ACCESSIBILITY_LABEL'
  | 'NO_ACCESSIBILITY_ROLE'
  | 'NO_ACCESSIBILITY_LABEL'
  | 'NO_FORM_LABEL'
  | 'NO_KEYBOARD_TRAP'
  | 'NO_EXPANDED_CONTROL';

export type RuleAction = 'SHOULD_NOT' | 'MUST_NOT' | 'MUST' | 'SHOULD';

export const NON_OVERRIDABLE_RULES: Partial<Rule>[] = [
  'NO_ACCESSIBILITY_ROLE',
  'NO_ACCESSIBILITY_LABEL',
  'NO_KEYBOARD_TRAP',
  'NO_UNDEFINED',
  'NO_FORM_LABEL',
  'NO_EXPANDED_CONTROL',
];

export const LOGGER_RULES: Record<Rule, RuleAction> = {
  CONTRAST_FAILED: 'MUST_NOT',
  CONTRAST_FAILED_AAA: 'SHOULD_NOT',
  MINIMUM_SIZE: 'MUST_NOT',
  UPPERCASE_TEXT_NO_ACCESSIBILITY_LABEL: 'MUST_NOT',
  UPPERCASE_ACCESSIBILITY_LABEL: 'MUST_NOT',
  NO_ACCESSIBILITY_LABEL: 'MUST_NOT',
  NO_ACCESSIBILITY_ROLE: 'MUST_NOT',
  NO_KEYBOARD_TRAP: 'MUST_NOT',
  NO_UNDEFINED: 'MUST_NOT',
  NO_FORM_LABEL: 'MUST_NOT',
  NO_EXPANDED_CONTROL: 'MUST',
};

export const CONTRAST_CHECKER_MAX_DEPTH = 5;
export const IGNORE_CONTRAST_FOR_DISABLED_ELEMENTS = false;

export const RULES_HELP: Record<Rule, string> = {
  NO_UNDEFINED: '',
  CONTRAST_FAILED:
    'https://formidable.com/open-source/react-native-ama/docs/guidelines/contrast',
  CONTRAST_FAILED_AAA:
    'https://formidable.com/open-source/react-native-ama/docs/guidelines/contrast',
  MINIMUM_SIZE:
    'https://formidable.com/open-source/react-native-ama/docs/guidelines/minimum-size',
  UPPERCASE_TEXT_NO_ACCESSIBILITY_LABEL:
    'https://formidable.com/open-source/react-native-ama/docs/guidelines/uppercase-text',
  UPPERCASE_ACCESSIBILITY_LABEL:
    'https://formidable.com/open-source/react-native-ama/docs/guidelines/uppercase-text',
  NO_ACCESSIBILITY_LABEL:
    'https://formidable.com/open-source/react-native-ama/docs/guidelines/accessibility-labels',
  NO_ACCESSIBILITY_ROLE:
    'https://formidable.com/open-source/react-native-ama/docs/guidelines/accessibility-role',
  NO_KEYBOARD_TRAP:
    'https://formidable.com/open-source/react-native-ama/docs/guidelines/keyboard-trap',
  NO_FORM_LABEL:
    'https://formidable.com/open-source/react-native-ama/docs/guidelines/labels',
};

export const canRuleBeOverridden = (rule: Rule) => {
  return !NON_OVERRIDABLE_RULES.includes(rule);
};

export const SHELL_COLORS = {
  RED: '\x1b[31m',
  YELLOW: '\x1b[33m',
  RESET: '\x1b[0m',
  BLUE: '\x1b[36m',
  BG_RED: '\x1b[41m',
};
