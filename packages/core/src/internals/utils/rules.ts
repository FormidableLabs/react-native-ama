import { Platform } from 'react-native';

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
	| 'UPPERCASE_TEXT_NO_ACCESSIBILITY_LABEL'
	| 'NO_UPPERCASE_ACCESSIBILITY_LABEL'
	| 'NO_HEADER_FOUND'
	| 'NO_ACCESSIBILITY_STATE_SET'

export type RuleAction =
	| 'SHOULD_NOT'
	| 'MUST_NOT'
	| 'MUST'
	| 'SHOULD'
	| 'PLEASE_FORGIVE_ME';

export const NON_OVERRIDABLE_RULES: Array<Rule> | undefined = __DEV__
	? [
		'NO_ACCESSIBILITY_ROLE',
		'NO_ACCESSIBILITY_LABEL',
		'NO_KEYBOARD_TRAP',
		'NO_UNDEFINED',
		'NO_FORM_LABEL',
		'FLATLIST_NO_COUNT_IN_PLURAL_MESSAGE',
		'BOTTOM_SHEET_CLOSE_ACTION',
		'INCOMPATIBLE_ACCESSIBILITY_STATE',
		'INCOMPATIBLE_ACCESSIBILITY_ROLE',
		'NO_HEADER_FOUND',
	]
	: undefined;

export const LOGGER_RULES: Record<Rule, RuleAction> | null = __DEV__
	? {
		CONTRAST_FAILED: 'MUST',
		CONTRAST_FAILED_AAA: 'SHOULD',
		FLATLIST_NO_COUNT_IN_SINGULAR_MESSAGE: 'SHOULD',
		FLATLIST_NO_COUNT_IN_PLURAL_MESSAGE: 'MUST',
		MINIMUM_SIZE: 'MUST',
		NO_ACCESSIBILITY_LABEL: 'MUST',
		NO_ACCESSIBILITY_ROLE: 'MUST',
		NO_FORM_LABEL: 'MUST',
		NO_FORM_ERROR: 'MUST',
		NO_KEYBOARD_TRAP: 'MUST_NOT',
		NO_UNDEFINED: 'MUST_NOT',
		UPPERCASE_TEXT_NO_ACCESSIBILITY_LABEL: 'MUST_NOT',
		NO_UPPERCASE_TEXT: 'MUST_NOT',
		BOTTOM_SHEET_CLOSE_ACTION: 'MUST',
		INCOMPATIBLE_ACCESSIBILITY_STATE: 'MUST',
		NO_FORM_LABEL_ENDING_WITH_ASTERISK: 'MUST_NOT',
		INCOMPATIBLE_ACCESSIBILITY_ROLE: 'MUST_NOT',
		NO_UPPERCASE_ACCESSIBILITY_LABEL: 'SHOULD_NOT',
		NO_HEADER_FOUND: 'MUST',
		NO_ACCESSIBILITY_STATE_SET: 'MUST'
	}
	: null;

export const CONTRAST_CHECKER_MAX_DEPTH = 5;
export const IGNORE_CONTRAST_FOR_DISABLED_ELEMENTS = false;

export type A11ySeverity = 'Serious' | 'Critical' | 'Warning';

export type RuleHelp = {
	[key in Rule]: {
		url: string;
		issue: string;
		severity: A11ySeverity;
		message: string;
		howToFix: string;
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
			howToFix:
				'Ensure text has sufficient contrast against its background for AA compliance.',
		},
		CONTRAST_FAILED_AAA: {
			url: '/guidelines/contrast',
			issue: 'Contrast ratio failed AAA',
			severity: 'Serious',
			message:
				'Clear contrast between text and its background is essential for readability, especially for people with low vision. When the contrast is too low, the text becomes illegible, leading to eye strain and preventing users from accessing information effectively.',
			howToFix:
				'Ensure text has sufficient contrast against its background for AAA compliance.',
		},
		MINIMUM_SIZE: {
			url: '/guidelines/minimum-size',
			issue: 'Element too small',
			severity: 'Serious',
			message:
				'Adequately sized touch targets are essential for all users to interact with an interface accurately, especially those with motor disabilities. If an element is too small, it becomes difficult to tap without error, preventing users from completing their task.',
			howToFix: `Define a minimum size of at least ${Platform.select({
				ios: '44x44',
				default: '48x48',
			})} points. Or increase the tappable area using the hitSlop property`,
		},
		UPPERCASE_TEXT_NO_ACCESSIBILITY_LABEL: {
			url: '/guidelines/text',
			issue: 'Uppercase text without accessibility label',
			severity: 'Serious',
			message:
				'Screen readers use capitalization as a cue to pronounce text correctly, distinguishing between words and acronyms. Using all-caps can cause words to be spelled out individually, making the information difficult for users to understand and follow.',
			howToFix: 'Provide an accessibility label with proper capitalization.',
		},
		NO_UPPERCASE_TEXT: {
			url: '/guidelines/text',
			issue: 'Avoid uppercase text',
			severity: 'Serious',
			message:
				'Screen readers use capitalization as a cue to pronounce text correctly, distinguishing between words and acronyms. Using all-caps can cause words to be spelled out individually, making the information difficult for users to understand and follow.',
			howToFix: 'Provide an accessibility label with normal capitalization.',
		},
		NO_UPPERCASE_ACCESSIBILITY_LABEL: {
			url: '/guidelines/accessibility-label#avoid-all-caps-accessibility-label',
			issue: 'Avoid ALL CAPS Accessibility Label',
			severity: 'Warning',
			message:
				'Screen readers use capitalization as a cue to pronounce text correctly, distinguishing between words and acronyms. Using all-caps can cause words to be spelled out individually, making the information difficult for users to understand and follow.',
			howToFix: 'Provide an accessibility label with normal capitalization.',
		},
		NO_ACCESSIBILITY_LABEL: {
			url: '/guidelines/accessibility-label',
			issue: 'Missing accessibility label',
			severity: 'Critical',
			message:
				"Screen readers rely on accessibility labels to announce the purpose of elements. Without labels, visually impaired users can't understand the functionality.",
			howToFix:
				'Add a descriptive aria-label prop clearly explaining the element\'s action (e.g., "Add to cart", "Go back").',
		},
		NO_ACCESSIBILITY_ROLE: {
			url: '/guidelines/accessibility-role',
			severity: 'Critical',
			issue: 'Missing accessibility role',
			message:
				'Accessibility roles help users understand how to interact with an element, indicating what action can be performed and what outcome to expect.',
			howToFix:
				'Specify an appropriate aria-role prop (e.g., "button", "link") for the component.',
		},
		NO_KEYBOARD_TRAP: {
			url: '/guidelines/forms',
			issue: 'Keyboard trap detected',
			severity: 'Critical',
			message:
				'A user must always be able to navigate away from an input field, even when validation fails. Trapping focus on an invalid field creates a frustrating loop, leaving the user stuck without a clear way to understand or resolve the error.',
			howToFix:
				'Ensure keyboard navigation allows users to exit form fields.',
		},
		NO_FORM_LABEL: {
			url: '/guidelines/forms',
			issue: 'Missing form label',
			severity: 'Critical',
			message:
				"Screen reader users navigate forms by listening for the labels associated with each input field. If a label is missing, the input's purpose is unknown, making it impossible for the user to proceed correctly.",
			howToFix: 'Add a label element or aria-label to form inputs.',
		},
		NO_FORM_ERROR: {
			url: '/guidelines/forms',
			issue: 'Missing form error handling',
			severity: 'Serious',
			message:
				'After a failed form submission, focus should be programmatically moved to the first error to alert users of assistive technologies. Otherwise, the user receives no feedback and is left confused, unable to find and fix the validation errors.',
			howToFix: 'Provide clear error messages for form validation failures.',
		},

		NO_FORM_LABEL_ENDING_WITH_ASTERISK: {
			url: '/guidelines/forms#labels',
			issue: 'Form label ends with asterisk',
			severity: 'Serious',
			message:
				'Required fields should be marked programmatically so that screen readers can clearly announce their state to the user. Relying on a visual asterisk for this purpose creates auditory noise and fails to explicitly convey that the field is mandatory.',
			howToFix:
				'Use proper required field indicators instead of asterisks in labels.',
		},
		FLATLIST_NO_COUNT_IN_SINGULAR_MESSAGE: {
			url: '/guidelines/lists-grids#number-of-results',
			issue: 'Missing count in singular message',
			severity: 'Serious',
			message:
				'List announcements should include item counts for better context.',
			howToFix: 'Include the number of items in singular list announcements.',
		},
		FLATLIST_NO_COUNT_IN_PLURAL_MESSAGE: {
			url: '/guidelines/lists-grids#number-of-results',
			issue: 'Missing count in plural message',
			severity: 'Serious',
			message:
				'List announcements should include item counts for better context.',
			howToFix: 'Include the number of items in plural list announcements.',
		},
		BOTTOM_SHEET_CLOSE_ACTION: {
			url: '/guidelines/bottomsheet',
			issue: 'Missing bottom sheet close action',
			severity: 'Critical',
			message: 'Bottom sheets must provide an accessible way to close them.',
			howToFix:
				'Add a close button or gesture that is accessible to screen readers.',
		},
		INCOMPATIBLE_ACCESSIBILITY_STATE: {
			url: '/guidelines/accessibility-role',
			issue: 'Incompatible accessibility state',
			severity: 'Serious',
			message:
				'The accessibility state is not compatible with the element type.',
			howToFix:
				'Use accessibility states that are appropriate for the element type.',
		},
		INCOMPATIBLE_ACCESSIBILITY_ROLE: {
			url: '/guidelines/accessibility-role',
			issue: 'Incompatible accessibility role',
			severity: 'Serious',
			message:
				'The accessibility role is not compatible with the element type.',
			howToFix:
				'Use accessibility roles that are appropriate for the element type.',
		},
		NO_HEADER_FOUND: {
			url: '/guidelines/headers',
			issue: 'No header found',
			severity: 'Serious',
			message:
				'Screen readers rely on accessibility headers to navigate the content efficiently',
			howToFix:
				'Ensure that texts fields that are visually headers have the attribute aria-role="header"',
		},
		NO_ACCESSIBILITY_STATE_SET: {
			url: '/guidelines/accessibility-states',
			issue: 'No accessibility state handled',
			severity: 'Critical',
			message:
				'The UI changed, but no accessibility state was updated. Screen reader users won’t know what changed after interacting with this component.',
			howToFix:
				'Update properties like accessibilityState (e.g. aria-selected, aria-expanded, aria-checked)',
		},

	}
	: null;

const canRuleBeOverridden = __DEV__
	? (rule: Rule) => {
		return !NON_OVERRIDABLE_RULES!.includes(rule);
	}
	: null;

export const AMA_COLORS: { [key in A11ySeverity]: string } = {
	Critical: '#f00',
	Serious: '#FFFf00',
	Warning: '#FFFf00',
};

export default canRuleBeOverridden;
