import React from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AMAError, Position } from '../types';
import { A11ySeverity } from '../utils/getRuleErrorInfo';
import { RULES_HELP } from '../utils/rules';

const WINDOW_HEIGHT = Dimensions.get('window').height;

const SEVERITIES: { [key in A11ySeverity]: string } | null = __DEV__
  ? {
      Serious: 'Serious',
      Critical: 'Critical',
      Warning: 'Warning',
    }
  : null;

export const AMARuleError = __DEV__
  ? ({
      issue,
      componentPosition,
      onClose,
    }: {
      issue: AMAError;
      componentPosition: Position;
      onClose: () => void;
    }) => {
      const ruleHelp = RULES_HELP![issue.rule];
      const [, top] = componentPosition;
      const maxHeight = WINDOW_HEIGHT - top - 160;

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
              onPress={onClose}
            >
              <Text> ✖ </Text>
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
            {issue.extra ? (
              <Text style={styles?.text}>{issue.extra}</Text>
            ) : null}
          </View>
          <Text style={[styles!.bold, styles?.full]} aria-role="header">
            How to fix:
          </Text>
          <View style={styles!.row}>
            <Text style={styles?.text}>{ruleHelp.howToFix}</Text>
          </View>
        </ScrollView>
      );
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
