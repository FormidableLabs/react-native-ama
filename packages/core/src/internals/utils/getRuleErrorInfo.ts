import { Platform } from 'react-native';
import { AMAError } from '../types';

export type A11ySeverity = 'Serious' | 'Critical' | 'Warning';

type RuleHelp = {
  [key: string]: {
    url: string;
    issue: string;
    severity: A11ySeverity;
    message: string;
    expectation: string;
  };
};

export const RULES_HELP: RuleHelp | null = __DEV__
  ? {
      CONTRAST_FAILED: {
        url: '/guidelines/contrast',
        issue: 'Contrast ratio failed',
        severity: 'Serious',
        message:
          'Clear contrast between text and its background is essential for readability, especially for people with low vision. When the contrast is too low, the text becomes illegible, leading to eye strain and preventing users from accessing information effectively.',
        expectation:
          'Ensure text has sufficient contrast against its background for AA compliance.',
      },
      CONTRAST_FAILED_AAA: {
        url: '/guidelines/contrast',
        issue: 'Contrast ratio failed AAA',
        severity: 'Serious',
        message:
          'Clear contrast between text and its background is essential for readability, especially for people with low vision. When the contrast is too low, the text becomes illegible, leading to eye strain and preventing users from accessing information effectively.',
        expectation:
          'Ensure text has sufficient contrast against its background for AAA compliance.',
      },
      MINIMUM_SIZE: {
        url: '/guidelines/minimum-size',
        issue: 'Element too small',
        severity: 'Serious',
        message:
          'Adequately sized touch targets are essential for all users to interact with an interface accurately, especially those with motor disabilities. If an element is too small, it becomes difficult to tap without error, preventing users from completing their task.',
        expectation: `Pressable area should be at least ${Platform.select({
          ios: '44x44',
          default: '48x48',
        })} points.`,
      },
      UPPERCASE_TEXT_NO_ACCESSIBILITY_LABEL: {
        url: '/guidelines/text',
        issue: 'Uppercase text without accessibility label',
        severity: 'Serious',
        message:
          'Screen readers use capitalization as a cue to pronounce text correctly, distinguishing between words and acronyms. Using all-caps can cause words to be spelled out individually, making the information difficult for users to understand and follow.',
        expectation:
          'Provide an accessibility label with proper capitalization.',
      },
      NO_UPPERCASE_TEXT: {
        url: '/guidelines/text',
        issue: 'Avoid uppercase text',
        severity: 'Serious',
        message:
          'Screen readers use capitalization as a cue to pronounce text correctly, distinguishing between words and acronyms. Using all-caps can cause words to be spelled out individually, making the information difficult for users to understand and follow.',
        expectation: 'Use normal capitalization instead of all uppercase text.',
      },
      NO_UPPERCASE_ACCESSIBILITY_LABEL: {
        url: '/guidelines/accessibility-label#avoid-all-caps-accessibility-label',
        issue: 'Avoid ALL CAPS Accessibility Label',
        severity: 'Warning',
        message:
          'Screen readers use capitalization as a cue to pronounce text correctly, distinguishing between words and acronyms. Using all-caps can cause words to be spelled out individually, making the information difficult for users to understand and follow.',
        expectation: 'Use normal capitalization instead of all uppercase text.',
      },
      NO_ACCESSIBILITY_LABEL: {
        url: '/guidelines/accessibility-label',
        issue: 'Missing accessibility label',
        severity: 'Critical',
        message:
          "Screen readers rely on accessibility labels to announce the purpose of elements. Without labels, visually impaired users can't understand the functionality.",
        expectation:
          'Add a descriptive aria-label prop clearly explaining the element\'s action (e.g., "Add to cart", "Go back").',
      },
      NO_ACCESSIBILITY_ROLE: {
        url: '/guidelines/accessibility-role',
        severity: 'Critical',
        issue: 'Missing accessibility role',
        message:
          'Accessibility roles help users understand how to interact with an element, indicating what action can be performed and what outcome to expect.',
        expectation:
          'Specify an appropriate aria-role prop (e.g., "button", "link") for the component.',
      },
      NO_KEYBOARD_TRAP: {
        url: '/guidelines/forms',
        issue: 'Keyboard trap detected',
        severity: 'Critical',
        message:
          'A user must always be able to navigate away from an input field, even when validation fails. Trapping focus on an invalid field creates a frustrating loop, leaving the user stuck without a clear way to understand or resolve the error.',
        expectation:
          'Ensure keyboard navigation allows users to exit form fields.',
      },
      NO_FORM_LABEL: {
        url: '/guidelines/forms',
        issue: 'Missing form label',
        severity: 'Critical',
        message:
          "Screen reader users navigate forms by listening for the labels associated with each input field. If a label is missing, the input's purpose is unknown, making it impossible for the user to proceed correctly.",
        expectation: 'Add a label element or aria-label to form inputs.',
      },
      NO_FORM_ERROR: {
        url: '/guidelines/forms',
        issue: 'Missing form error handling',
        severity: 'Serious',
        message:
          'After a failed form submission, focus should be programmatically moved to the first error to alert users of assistive technologies. Otherwise, the user receives no feedback and is left confused, unable to find and fix the validation errors.',
        expectation:
          'Provide clear error messages for form validation failures.',
      },

      NO_FORM_LABEL_ENDING_WITH_ASTERISK: {
        url: '/guidelines/forms#labels',
        issue: 'Form label ends with asterisk',
        severity: 'Serious',
        message:
          'Required fields should be marked programmatically so that screen readers can clearly announce their state to the user. Relying on a visual asterisk for this purpose creates auditory noise and fails to explicitly convey that the field is mandatory.',
        expectation:
          'Use proper required field indicators instead of asterisks in labels.',
      },
      FLATLIST_NO_COUNT_IN_SINGULAR_MESSAGE: {
        url: '/guidelines/lists-grids#number-of-results',
        issue: 'Missing count in singular message',
        severity: 'Serious',
        message:
          'List announcements should include item counts for better context.',
        expectation:
          'Include the number of items in singular list announcements.',
      },
      FLATLIST_NO_COUNT_IN_PLURAL_MESSAGE: {
        url: '/guidelines/lists-grids#number-of-results',
        issue: 'Missing count in plural message',
        severity: 'Serious',
        message:
          'List announcements should include item counts for better context.',
        expectation:
          'Include the number of items in plural list announcements.',
      },
      BOTTOM_SHEET_CLOSE_ACTION: {
        url: '/guidelines/bottomsheet',
        issue: 'Missing bottom sheet close action',
        severity: 'Critical',
        message: 'Bottom sheets must provide an accessible way to close them.',
        expectation:
          'Add a close button or gesture that is accessible to screen readers.',
      },
      INCOMPATIBLE_ACCESSIBILITY_STATE: {
        url: '/guidelines/accessibility-role',
        issue: 'Incompatible accessibility state',
        severity: 'Serious',
        message:
          'The accessibility state is not compatible with the element type.',
        expectation:
          'Use accessibility states that are appropriate for the element type.',
      },
      INCOMPATIBLE_ACCESSIBILITY_ROLE: {
        url: '/guidelines/accessibility-role',
        issue: 'Incompatible accessibility role',
        severity: 'Serious',
        message:
          'The accessibility role is not compatible with the element type.',
        expectation:
          'Use accessibility roles that are appropriate for the element type.',
      },
    }
  : null;

export const getAMARuleErrorInfo = __DEV__
  ? (issue: AMAError) => {
      const ruleHelp = RULES_HELP![issue.rule];

      let message = ruleHelp.message;

      if (issue.extra) {
        message += ': ' + issue.extra;
      }

      const url = `https://nearform.com/open-source/react-native-ama/${ruleHelp.url}`;

      return { message, url, severity: ruleHelp.severity };
    }
  : null;
