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
        message: '',
      },
      CONTRAST_FAILED_AAA: '/guidelines/contrast',
      MINIMUM_SIZE: '/guidelines/minimum-size',
      UPPERCASE_TEXT_NO_ACCESSIBILITY_LABEL: '/guidelines/text',
      NO_UPPERCASE_TEXT: '/guidelines/text',
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
