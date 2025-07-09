export type A11yIssue = {
  rule: Rule;
  label: string;
  reason: string;
  type: 'MUST' | 'MUST_NOT' | 'SHOULD' | 'SHOULD_NOT';
  viewId: number;
  bounds: [number, number, number, number];
};

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

type RuleError = {
  url: string;
  message: string;
};

const RULES_HELP = __DEV__
  ? {
      CONTRAST_FAILED: {
        url: '/guidelines/contrast',
        message: '',
      },
      CONTRAST_FAILED_AAA: '/guidelines/contrast',
      MINIMUM_SIZE: '/guidelines/minimum-size',
      UPPERCASE_TEXT_NO_ACCESSIBILITY_LABEL: '/guidelines/text',
      NO_UPPERCASE_TEXT: '/guidelines/text',
      NO_ACCESSIBILITY_LABEL: '/guidelines/accessibility-labels',
      NO_ACCESSIBILITY_ROLE: {
        url: '/guidelines/accessibility-role',
        message: 'The component is missing the accessibility role.',
      },
      NO_KEYBOARD_TRAP: '/guidelines/forms',
      NO_FORM_LABEL: '/guidelines/forms',
      NO_FORM_ERROR: '/guidelines/forms',
      FLATLIST_NO_COUNT_IN_SINGULAR_MESSAGE:
        '/guidelines/lists-grids#number-of-results',
      FLATLIST_NO_COUNT_IN_PLURAL_MESSAGE:
        '/guidelines/lists-grids#number-of-results',
      BOTTOM_SHEET_CLOSE_ACTION: '/guidelines/bottomsheet',
      INCOMPATIBLE_ACCESSIBILITY_STATE: '/guidelines/accessibility-role',
      INCOMPATIBLE_ACCESSIBILITY_ROLE: '/guidelines/accessibility-role',
      NO_FORM_LABEL_ENDING_WITH_ASTERISK: '/guidelines/forms#labels',
    }
  : null;

export const logAMAError = (issue: A11yIssue) => {
  const logger =
    issue.type === 'MUST' || issue.type === 'MUST_NOT'
      ? console.error
      : console.warn;

  const { message, url } = getRuleErrorInfo(issue);

  logger(
    `[React Native AMA]: ${issue.label} >> ${message}\nLearn about: ${url}\n`,
  );
};

export const getRuleErrorInfo = (issue: A11yIssue) => {
  const ruleHelp = RULES_HELP![issue.rule];

  let message = ruleHelp.message;

  if (issue.reason) {
    message += ': ' + issue.reason;
  }

  const url = `https://nearform.com/open-source/react-native-ama/${ruleHelp.url}`;

  return { message, url };
};
