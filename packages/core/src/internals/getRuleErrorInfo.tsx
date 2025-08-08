import React from 'react';
import {
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { A11yIssue, Position } from './types';

export type A11ySeverity = 'Serious' | 'Critical';

type RuleHelp = {
  [key: string]: {
    url: string;
    issue: string;
    severity: A11ySeverity;
    message: string;
    expectation: string;
  };
};

const SCREEN_HEIGHT = Dimensions.get('window').height;

const SEVERITIES: { [key in A11ySeverity]: string } | null = __DEV__
  ? {
      Serious: 'Serious',
      Critical: 'Critical',
    }
  : null;

const RULES_HELP: RuleHelp | null = __DEV__
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
        expectation: `Pressable area should be at least ${Platform.select({ ios: '44x44', default: '48x48' })} points.`,
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

export const GetRuleError = __DEV__
  ? ({
      issue,
      componentPosition,
    }: {
      issue: A11yIssue;
      componentPosition: Position;
    }) => {
      const ruleHelp = RULES_HELP![issue.rule];
      const [, top] = componentPosition;
      const maxHeight = SCREEN_HEIGHT - top - 48;
      console.info({maxHeight})

      return (
        <ScrollView style={{ maxHeight }}>
          <View style={styles!.row}>
            <Text style={styles!.bold} aria-role="header">
              Issue:
            </Text>
            <Text style={styles!.flex}>{ruleHelp.issue}</Text>
            <Pressable
              hitSlop={{ left: 18, top: 18, bottom: 18, right: 18 }}
              role="button"
              aria-label="Close Error information"
            >
              <Text>✖</Text>
            </Pressable>
          </View>

          <View style={styles!.row}>
            <Text style={styles!.bold} aria-role="header">
              Severity:
            </Text>
            <Text>{SEVERITIES![ruleHelp.severity]}</Text>
          </View>
          <Text style={[styles!.bold, styles?.full]} aria-role="header">
            Why this matters:
          </Text>
          <View style={[styles!.row, styles?.column]}>
            <Text style={styles?.text}>{ruleHelp.message}</Text>
            {issue.reason ? (
              <Text style={styles?.text}>{issue.reason}</Text>
            ) : null}
          </View>
          <Text style={[styles!.bold, styles?.full]} aria-role="header">
            How to fix:
          </Text>
          <View style={styles!.row}>
            <Text style={styles?.text}>{ruleHelp.expectation}</Text>
          </View>
        </ScrollView>
      );
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

      return { message, url, severity: ruleHelp.severity };
    }
  : null;

const styles = __DEV__
  ? StyleSheet.create({
      row: {
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
        fontSize: 14,
        width: '100%',
        marginBottom: 12,
      },
      bold: {
        fontSize: 14,
        fontWeight: 600,
        paddingRight: 12,
      },
      full: {
        width: '100%',
        marginBottom: 4,
      },
      text: {
        lineHeight: 18,
      },
      column: {
        flexDirection: 'column',
      },
      flex: {
        flex: 1,
      },
    })
  : null;
