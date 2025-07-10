import { A11yIssue } from './types';

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

export const getRuleErrorInfo = __DEV__
  ? (issue: A11yIssue) => {
      const ruleHelp = RULES_HELP![issue.rule];

      let message = ruleHelp.message;

      if (issue.reason) {
        message += ': ' + issue.reason;
      }

      const url = `https://nearform.com/open-source/react-native-ama/${ruleHelp.url}`;

      return { message, url };
    }
  : null;
