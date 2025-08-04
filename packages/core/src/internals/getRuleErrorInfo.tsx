import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { A11yIssue } from './types';

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
        message: 'Text contrast ratio does not meet accessibility standards.',
        expectation: 'Ensure text has sufficient contrast against its background.',
      },
      CONTRAST_FAILED_AAA: {
        url: '/guidelines/contrast',
        issue: 'Contrast ratio failed AAA',
        severity: 'Serious',
        message: 'Text contrast ratio does not meet AAA accessibility standards.',
        expectation: 'Ensure text has sufficient contrast for AAA compliance.',
      },
      MINIMUM_SIZE: {
        url: '/guidelines/minimum-size',
        issue: 'Element too small',
        severity: 'Serious',
        message: 'Interactive elements should meet minimum size requirements for accessibility.',
        expectation: 'Ensure interactive elements are at least 44x44 points.',
      },
      UPPERCASE_TEXT_NO_ACCESSIBILITY_LABEL: {
        url: '/guidelines/text',
        issue: 'Uppercase text without accessibility label',
        severity: 'Serious',
        message: 'Uppercase text can be difficult for screen readers to pronounce correctly.',
        expectation: 'Provide an accessibility label with proper capitalization.',
      },
      NO_UPPERCASE_TEXT: {
        url: '/guidelines/text',
        issue: 'Avoid uppercase text',
        severity: 'Serious',
        message: 'Uppercase text can be difficult to read and understand.',
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
        message: 'Users should be able to navigate away from form elements using the keyboard.',
        expectation: 'Ensure keyboard navigation allows users to exit form fields.',
      },
      NO_FORM_LABEL: {
        url: '/guidelines/forms',
        issue: 'Missing form label',
        severity: 'Critical',
        message: 'Form inputs must have associated labels for accessibility.',
        expectation: 'Add a label element or aria-label to form inputs.',
      },
      NO_FORM_ERROR: {
        url: '/guidelines/forms',
        issue: 'Missing form error handling',
        severity: 'Serious',
        message: 'Form validation errors must be communicated to users.',
        expectation: 'Provide clear error messages for form validation failures.',
      },
      FLATLIST_NO_COUNT_IN_SINGULAR_MESSAGE: {
        url: '/guidelines/lists-grids#number-of-results',
        issue: 'Missing count in singular message',
        severity: 'Serious',
        message: 'List announcements should include item counts for better context.',
        expectation: 'Include the number of items in singular list announcements.',
      },
      FLATLIST_NO_COUNT_IN_PLURAL_MESSAGE: {
        url: '/guidelines/lists-grids#number-of-results',
        issue: 'Missing count in plural message',
        severity: 'Serious',
        message: 'List announcements should include item counts for better context.',
        expectation: 'Include the number of items in plural list announcements.',
      },
      BOTTOM_SHEET_CLOSE_ACTION: {
        url: '/guidelines/bottomsheet',
        issue: 'Missing bottom sheet close action',
        severity: 'Critical',
        message: 'Bottom sheets must provide an accessible way to close them.',
        expectation: 'Add a close button or gesture that is accessible to screen readers.',
      },
      INCOMPATIBLE_ACCESSIBILITY_STATE: {
        url: '/guidelines/accessibility-role',
        issue: 'Incompatible accessibility state',
        severity: 'Serious',
        message: 'The accessibility state is not compatible with the element type.',
        expectation: 'Use accessibility states that are appropriate for the element type.',
      },
      INCOMPATIBLE_ACCESSIBILITY_ROLE: {
        url: '/guidelines/accessibility-role',
        issue: 'Incompatible accessibility role',
        severity: 'Serious',
        message: 'The accessibility role is not compatible with the element type.',
        expectation: 'Use accessibility roles that are appropriate for the element type.',
      },
      NO_FORM_LABEL_ENDING_WITH_ASTERISK: {
        url: '/guidelines/forms#labels',
        issue: 'Form label ends with asterisk',
        severity: 'Serious',
        message: 'Form labels should not end with asterisks as they can confuse screen readers.',
        expectation: 'Use proper required field indicators instead of asterisks in labels.',
      },
    }
  : null;

export const GetRuleError = __DEV__
  ? ({ issue }: { issue: A11yIssue }) => {
      const ruleHelp = RULES_HELP![issue.rule];

      return (
        <>
          <View style={styles!.row}>
            <Text style={styles!.bold} aria-role="header">
              Issue:
            </Text>
            <Text>{ruleHelp.issue}</Text>
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
          <View style={styles!.row}>
            <Text style={styles?.text}>{ruleHelp.message}</Text>
          </View>
          <Text style={[styles!.bold, styles?.full]} aria-role="header">
            How to fix:
          </Text>
          <View style={styles!.row}>
            <Text style={styles?.text}>{ruleHelp.expectation}</Text>
          </View>
        </>
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
    })
  : null;
