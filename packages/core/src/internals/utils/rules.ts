import { Platform } from 'react-native';

export type AmaRule =
  | 'BOTTOM_SHEET_CLOSE_ACTION'
  | 'CONTRAST_FAILED'
  | 'CONTRAST_FAILED_AAA'
  | 'FLATLIST_NO_COUNT_IN_PLURAL_MESSAGE'
  | 'FLATLIST_NO_COUNT_IN_SINGULAR_MESSAGE'
  | 'IMAGE_MISSING_ALT_TEXT'
  | 'MINIMUM_SIZE'
  | 'NO_ACCESSIBILITY_LABEL'
  | 'NO_ACCESSIBILITY_ROLE'
  | 'NO_FORM_ERROR'
  | 'INPUT_HAS_NO_VISIBLE_LABEL'
  | 'NO_KEYBOARD_TRAP'
  | 'NO_UNDEFINED'
  | 'NO_UPPERCASE_TEXT'
  | 'INCOMPATIBLE_ACCESSIBILITY_STATE'
  | 'INCOMPATIBLE_ACCESSIBILITY_ROLE'
  | 'INPUT_HAS_NO_VISIBLE_LABEL_ENDING_WITH_ASTERISK'
  | 'UPPERCASE_TEXT_NO_ACCESSIBILITY_LABEL'
  | 'NO_UPPERCASE_ACCESSIBILITY_LABEL'
  | 'NO_HEADER_FOUND'
  | 'NO_ACCESSIBILITY_STATE_SET'
  | 'INPUT_INVALID_RETURN_KEY'
  | 'INPUT_HAS_FOCUSABLE_LABEL';

export type AmaRuleAction =
  | 'SHOULD_NOT'
  | 'MUST_NOT'
  | 'MUST'
  | 'SHOULD'
  | 'PLEASE_FORGIVE_ME';

export const NON_OVERRIDABLE_RULES: Array<AmaRule> | undefined = __DEV__
  ? [
    'NO_ACCESSIBILITY_ROLE',
    'NO_ACCESSIBILITY_LABEL',
    'NO_KEYBOARD_TRAP',
    'NO_UNDEFINED',
    'INPUT_HAS_NO_VISIBLE_LABEL',
    'FLATLIST_NO_COUNT_IN_PLURAL_MESSAGE',
    'BOTTOM_SHEET_CLOSE_ACTION',
    'INCOMPATIBLE_ACCESSIBILITY_STATE',
    'INCOMPATIBLE_ACCESSIBILITY_ROLE',
    'NO_HEADER_FOUND',
  ]
  : undefined;

export const LOGGER_RULES: Record<AmaRule, AmaRuleAction> | null = __DEV__
  ? {
    CONTRAST_FAILED: 'MUST',
    CONTRAST_FAILED_AAA: 'SHOULD',
    FLATLIST_NO_COUNT_IN_SINGULAR_MESSAGE: 'SHOULD',
    FLATLIST_NO_COUNT_IN_PLURAL_MESSAGE: 'MUST',
    IMAGE_MISSING_ALT_TEXT: 'MUST',
    MINIMUM_SIZE: 'MUST',
    NO_ACCESSIBILITY_LABEL: 'MUST',
    NO_ACCESSIBILITY_ROLE: 'MUST',
    INPUT_HAS_NO_VISIBLE_LABEL: 'MUST',
    NO_FORM_ERROR: 'MUST',
    NO_KEYBOARD_TRAP: 'MUST_NOT',
    NO_UNDEFINED: 'MUST_NOT',
    UPPERCASE_TEXT_NO_ACCESSIBILITY_LABEL: 'MUST_NOT',
    NO_UPPERCASE_TEXT: 'MUST_NOT',
    BOTTOM_SHEET_CLOSE_ACTION: 'MUST',
    INCOMPATIBLE_ACCESSIBILITY_STATE: 'MUST',
    INPUT_HAS_NO_VISIBLE_LABEL_ENDING_WITH_ASTERISK: 'MUST_NOT',
    INCOMPATIBLE_ACCESSIBILITY_ROLE: 'MUST_NOT',
    NO_UPPERCASE_ACCESSIBILITY_LABEL: 'SHOULD_NOT',
    NO_HEADER_FOUND: 'MUST',
    NO_ACCESSIBILITY_STATE_SET: 'MUST',
    INPUT_INVALID_RETURN_KEY: 'MUST',
    INPUT_HAS_FOCUSABLE_LABEL: 'MUST',
  }
  : null;

export const CONTRAST_CHECKER_MAX_DEPTH = 5;
export const IGNORE_CONTRAST_FOR_DISABLED_ELEMENTS = false;

export type A11ySeverity = 'Serious' | 'Critical' | 'Warning';

export type RuleHelp = {
  [key in AmaRule]: {
    url: string;
    issue: string;
    severity: A11ySeverity;
    message: string;
    howToFix: string | string[];
  };
};

export const RULES_HELP: RuleHelp | null = __DEV__
  ? {
    CONTRAST_FAILED: {
      url: '/guidelines/contrast',
      issue: 'Insufficient color contrast',
      severity: 'Serious',
      message:
        'Text does not have enough contrast against its background. Low contrast makes content hard or impossible to read for users with low vision or when viewing the screen in poor lighting.',
      howToFix:
        'Increase the contrast between text and background to meet WCAG AA requirements.',
    },

    CONTRAST_FAILED_AAA: {
      url: '/guidelines/contrast',
      issue: 'Insufficient color contrast (AAA)',
      severity: 'Serious',
      message:
        'Text does not meet enhanced contrast requirements. This affects users with more severe visual impairments and reduces overall readability.',
      howToFix:
        'Increase the contrast between text and background to meet WCAG AAA requirements.',
    },

    MINIMUM_SIZE: {
      url: '/guidelines/minimum-size',
      issue: 'Touch target too small',
      severity: 'Serious',
      message:
        'The element is too small to be tapped reliably. Small touch targets increase error rates, especially for users with motor impairments or larger fingers.',
      howToFix: `Ensure the element is at least ${Platform.select({
        ios: '44x44',
        default: '48x48',
      })} points, or increase the tappable area using hitSlop.`,
    },

    UPPERCASE_TEXT_NO_ACCESSIBILITY_LABEL: {
      url: '/guidelines/text',
      issue: 'Uppercase text without accessibility label',
      severity: 'Serious',
      message:
        'All caps text can be read letter by letter by screen readers, making it hard to understand. It can also make voice commands less predictable.',
      howToFix: 'Provide an accessibility label with normal capitalization.',
    },

    NO_UPPERCASE_TEXT: {
      url: '/guidelines/text',
      issue: 'Avoid uppercase text',
      severity: 'Serious',
      message:
        'Uppercase text can reduce readability for both screen reader users and sighted users.',
      howToFix:
        'Use normal capitalization or provide a properly capitalized accessibility label.',
    },

    NO_UPPERCASE_ACCESSIBILITY_LABEL: {
      url: '/guidelines/accessibility-label#avoid-all-caps-accessibility-label',
      issue: 'Uppercase accessibility label',
      severity: 'Warning',
      message:
        'Accessibility labels in all caps may be read incorrectly by screen readers.',
      howToFix: 'Use normal capitalization in accessibility labels.',
    },

    NO_ACCESSIBILITY_LABEL: {
      url: '/guidelines/accessibility-label',
      issue: 'Missing accessibility label',
      severity: 'Critical',
      message:
        'This element has no accessible name. Screen reader users will not know what this control does, and Voice Control users will not be able to target it with voice commands.',
      howToFix: [
        'Add a descriptive accessibility label that explains the action or purpose, for example:',
        ' • `aria-label="Add to cart"`',
        ' • `aria-label="Go back"`',
      ],
    },

    NO_ACCESSIBILITY_ROLE: {
      url: '/guidelines/accessibility-role',
      issue: 'Missing accessibility role',
      severity: 'Critical',
      message:
        'Without a role, assistive technologies cannot determine how this element should be used. Voice Control may also misinterpret how to interact with it.',
      howToFix: [
        'Assign the correct accessibility role, for example:',
        ' • Button: `aria-role="button"`',
        ' • Switch: `aria-role="switch"`',
      ],
    },

    NO_KEYBOARD_TRAP: {
      url: '/guidelines/forms',
      issue: 'Keyboard trap detected',
      severity: 'Critical',
      message:
        'Focus cannot escape this input. Users navigating with a keyboard or assistive technology may get stuck.',
      howToFix:
        'Ensure users can move focus away from the field even when validation fails.',
    },

    INPUT_HAS_NO_VISIBLE_LABEL: {
      url: '/guidelines/forms#labels',
      issue: 'Missing form label',
      severity: 'Critical',
      message:
        'This input has no visible label. Without a persistent label, users can forget what the field is for once they start typing, increasing errors and frustration. Placeholders are not a replacement for labels, as they disappear once text is entered.',
      howToFix:
        "Add a visible, persistent label that clearly explains the field's purpose.",
    },

    NO_FORM_ERROR: {
      url: '/guidelines/forms',
      issue: 'Missing form error handling',
      severity: 'Serious',
      message:
        'After submission fails, users are not informed where the error occurred. Screen reader users receive no feedback.',
      howToFix:
        'Provide clear error messages and move focus to the first invalid field.',
    },

    INPUT_HAS_NO_VISIBLE_LABEL_ENDING_WITH_ASTERISK: {
      url: '/guidelines/forms#labels',
      issue: 'Asterisk used to indicate required field',
      severity: 'Serious',
      message:
        'Asterisks are visual only. Screen readers do not reliably convey that the field is required.',
      howToFix:
        'Mark required fields programmatically instead of relying on an asterisk.',
    },

    FLATLIST_NO_COUNT_IN_SINGULAR_MESSAGE: {
      url: '/guidelines/lists-grids#number-of-results',
      issue: 'Missing item count in list announcement',
      severity: 'Serious',
      message:
        'List announcements without item counts provide poor context for screen reader users.',
      howToFix:
        'Include the number of items in the announcement, even for a single result.',
    },

    FLATLIST_NO_COUNT_IN_PLURAL_MESSAGE: {
      url: '/guidelines/lists-grids#number-of-results',
      issue: 'Missing item count in list announcement',
      severity: 'Serious',
      message:
        'List announcements without item counts provide poor context for screen reader users.',
      howToFix: 'Include the total number of items in the announcement.',
    },

    BOTTOM_SHEET_CLOSE_ACTION: {
      url: '/guidelines/bottomsheet',
      issue: 'No accessible close action',
      severity: 'Critical',
      message:
        'Users must have a clear and accessible way to dismiss a bottom sheet. Without it, Voice Control users may be unable to close the view.',
      howToFix:
        'Provide a close button or gesture that is accessible to screen readers.',
    },

    INCOMPATIBLE_ACCESSIBILITY_STATE: {
      url: '/guidelines/accessibility-role',
      issue: 'Incompatible accessibility state',
      severity: 'Serious',
      message:
        'The accessibility state does not match the element’s behavior.',
      howToFix:
        'Use accessibility states that are valid for the given element type.',
    },

    INCOMPATIBLE_ACCESSIBILITY_ROLE: {
      url: '/guidelines/accessibility-role',
      issue: 'Incompatible accessibility role',
      severity: 'Serious',
      message: 'The assigned role does not match how this element behaves.',
      howToFix:
        'Update the role to reflect the element’s actual interaction pattern.',
    },

    NO_HEADER_FOUND: {
      url: '/guidelines/headers',
      issue: 'Missing header semantics',
      severity: 'Serious',
      message:
        'Screen reader users rely on headers to navigate content efficiently. Headers also help Voice Control users jump to sections by name.',
      howToFix: 'Mark visual headers with `aria-role="header"`.',
    },

    NO_ACCESSIBILITY_STATE_SET: {
      url: '/guidelines/accessibility-states',
      issue: 'Accessibility state not updated',
      severity: 'Critical',
      message:
        'The UI state changed, but assistive technologies were not informed.',
      howToFix: [
        'Update accessibilityState to reflect the new state, for example:',
        ' • `aria-expanded={expanded}`',
        ' • `aria-checked={checked}`',
        ' • `aria-selected={selected}`',
        ' • `aria-busy={busy}`',
      ],
    },

    INPUT_INVALID_RETURN_KEY: {
      url: '/guidelines/forms#focus-on-the-next-field',
      issue: 'Invalid return key behavior',
      severity: 'Serious',
      message:
        'By default, React Native shows the `Return` keyboard action that dismisses the keyboard.  This interrupts form completion and forces users to manually navigate to the next field.',
      howToFix:
        'Explicitly set the appropriate `returnType` (for example `next`) and handle `onSubmitEditing` to move focus to the next input instead of dismissing the keyboard.',
    },

    INPUT_HAS_FOCUSABLE_LABEL: {
      url: '/guidelines/forms#grouping',
      issue: 'Label is focusable',
      severity: 'Serious',
      message:
        'The label receives focus separately, resulting in duplicate announcements.',
      howToFix:
        'Make the label non-focusable and provide the label via `aria-label` on the input.',
    },

    IMAGE_MISSING_ALT_TEXT: {
      url: '/guidelines/images',
      issue: 'Image missing accessibility label',
      severity: 'Critical',
      message:
        'This image has no accessible name. Screen reader users will not know what the image depicts.',
      howToFix: [
        'Add a descriptive accessibility label that explains what the image shows, for example:',
        ' • `aria-label="Product photo"`',
        ' • `aria-label="Icon for settings"`',
        'For decorative images, mark them as non-accessible with `accessible={false}`.',
      ],
    },

    NO_UNDEFINED: {
      url: '/guidelines/accessibility-label',
      issue: 'Undefined accessibility value',
      severity: 'Critical',
      message:
        'An accessibility property has an undefined value. This can cause screen readers to announce unexpected content.',
      howToFix:
        'Ensure all accessibility props are explicitly set to a defined value or omitted entirely.',
    },
  }
  : null;

const canRuleBeOverridden = __DEV__
  ? (rule: AmaRule) => {
    return !NON_OVERRIDABLE_RULES!.includes(rule);
  }
  : null;

export const AMA_COLORS: { [key in A11ySeverity]: string } = {
  Critical: '#f00',
  Serious: '#2563EB',
  Warning: '#2563EB',
};

export default canRuleBeOverridden;
