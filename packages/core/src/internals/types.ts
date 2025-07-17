export type A11yIssueType = 'MUST' | 'MUST_NOT' | 'SHOULD' | 'SHOULD_NOT';
export type A11yIssue = {
  rule: Rule;
  label: string;
  reason: string;
  type: A11yIssueType;
  viewId: number;
};

export type Position = [number, number, number, number];

export type Rule =
  | 'BOTTOM_SHEET_CLOSE_ACTION'
  | 'CONTRAST_FAILED'
  | 'CONTRAST_FAILED_AAA'
  | 'FLATLIST_NO_COUNT_IN_PLURAL_MESSAGE'
  | 'FLATLIST_NO_COUNT_IN_SINGULAR_MESSAGE'
  | 'MINIMUM_SIZE'
  | 'NO_ACCESSIBILITY_LABEL'
  | 'NO_ACCESSIBILITY_ROLE'
  | 'NO_FORM_ERROR'
  | 'NO_FORM_LABEL'
  | 'NO_KEYBOARD_TRAP'
  | 'NO_UNDEFINED'
  | 'NO_UPPERCASE_TEXT'
  | 'INCOMPATIBLE_ACCESSIBILITY_STATE'
  | 'INCOMPATIBLE_ACCESSIBILITY_ROLE'
  | 'NO_FORM_LABEL_ENDING_WITH_ASTERISK'
  | 'UPPERCASE_TEXT_NO_ACCESSIBILITY_LABEL';

export type RuleAction =
  | 'SHOULD_NOT'
  | 'MUST_NOT'
  | 'MUST'
  | 'SHOULD'
  | 'PLEASE_FORGIVE_ME';
