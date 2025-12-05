import React, { ReactNode } from 'react';
import {
  Dimensions,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AmaError, Position } from '../types';
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

	const CODE_REGEX = /(`[^`]*)./g;

export const AMARuleError = __DEV__
  ? ({
      issue,
      componentPosition,
      onClose,
    }: {
      issue: AmaError;
      componentPosition: Position;
      onClose: () => void;
    }) => {
      const ruleHelp = RULES_HELP![issue.rule];
      const [, top] = componentPosition;
      const maxHeight = WINDOW_HEIGHT - top - 160;

      const renderHowToFix = (text: string | string[]) => {
        if (typeof text === 'string') {
          return <Text style={styles?.text}>{text}</Text>;
        }

        return (
          <View>
            {text.map((value, index) => {
              const prefix = index > 0 ? ' - ' : '';
							const [code] = CODE_REGEX.exec(value) ?? [];

							const text = value.replaceAll(CODE_REGEX, '');

							return (
                <Text style={styles!.text}>
                  {prefix}
                  {text}
									{code ? <Code>{code}</Code> : null}
                </Text>
              );
            })}
          </View>
        );
      };

      return (
        <ScrollView style={{ maxHeight, flex: 1, width: '100%', padding: 12 }}>
          <View style={styles!.row}>
            <Text style={styles!.bold} aria-role="header">
              {SEVERITIES![ruleHelp.severity]}:
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
          <View style={styles!.row}>{renderHowToFix(ruleHelp.howToFix)}</View>
        </ScrollView>
      );
    }
  : null;

	const Code = __DEV__ ? ({children}: {children: ReactNode}) => {

		const code = typeof children === 'string' ? children.replaceAll('`', '') : children;

		return <Text style={styles!.code}> {code} </Text>;
	} : null;

const styles = __DEV__
  ? StyleSheet.create({
      row: {
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
        fontSize: 14,
        width: '100%',
        marginBottom: 12,
        flex: 1,
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
				paddingBottom: 4,
      },
      column: {
        flexDirection: 'column',
      },
      flex: {
        flex: 1,
      },
			code: {
				backgroundColor: '#333',
				color: '#fff',
			},
    })
  : null;

