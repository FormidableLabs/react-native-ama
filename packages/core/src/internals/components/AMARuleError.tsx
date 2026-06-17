/* eslint-disable react-native/no-inline-styles */
import React, { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { AmaError } from '../types';
import { A11ySeverity } from '../utils/getRuleErrorInfo';
import { RULES_HELP } from '../utils/rules';

const SEVERITIES: { [key in A11ySeverity]: string } | null = __DEV__
  ? {
      Serious: 'Serious',
      Critical: 'Critical',
      Warning: 'Warning',
    }
  : null;

const REGEX_MARKDOWN = /(`[^`]+`|\*\*[^*]+\*\*)/g;

export const AMARuleError = __DEV__
  ? ({
      issue,
      maxHeight,
      onClose,
    }: {
      issue: AmaError;
      onClose: () => void;
      maxHeight: number;
    }) => {
      const ruleHelp = RULES_HELP![issue.rule];
      const COLOR_TOKEN_REGEX = /(\(#[0-9A-Fa-f]{3,8}\))/g;

      const renderMarkdown = (text: string) => {
        const parts = text.split(REGEX_MARKDOWN);

        return parts.map((part, index) => {
          if (part.startsWith('`') && part.endsWith('`') && Code) {
            return <Code key={index}>{part.slice(1, -1)}</Code>;
          }

          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <Text key={index} style={[styles?.text, styles?.bold]}>
                {part.slice(2, -2)}
              </Text>
            );
          }

          return (
            <Text key={index} style={styles?.text}>
              {part}
            </Text>
          );
        });
      };

      const renderHowToFix = (text: string | string[]) => {
        if (typeof text === 'string') {
          return <Text style={styles?.text}>{renderMarkdown(text)}</Text>;
        }

        return (
          <View>
            {text.map((value, index) => {
              return (
                <Text key={index} style={styles!.text}>
                  {renderMarkdown(value)}
                </Text>
              );
            })}
          </View>
        );
      };

      const renderTextWithColorSwatches = (text: string) => {
        const parts = text.split(COLOR_TOKEN_REGEX);

        return parts.map((part, index) => {
          if (part.startsWith('(#') && part.endsWith(')')) {
            const color = part.slice(1, -1);

            return (
              <React.Fragment key={index}>
                <Text
                  style={styles?.text}
                  importantForAccessibility="no-hide-descendants"
                  accessibilityElementsHidden
                >
                  (
                </Text>
                <Text
                  style={styles!.swatchFrame}
                  importantForAccessibility="no-hide-descendants"
                  accessibilityElementsHidden
                >
                  <Text
                    style={[styles!.swatchGlyph, { color }]}
                    importantForAccessibility="no-hide-descendants"
                    accessibilityElementsHidden
                  >
                    ■
                  </Text>
                </Text>
                <Text
                  style={styles?.text}
                  importantForAccessibility="no-hide-descendants"
                  accessibilityElementsHidden
                  accessible={false}
                >
                  {` ${color}`}
                </Text>
                <Text
                  style={styles?.text}
                  importantForAccessibility="no-hide-descendants"
                  accessibilityElementsHidden
                >
                  )
                </Text>
              </React.Fragment>
            );
          }

          return (
            <Text key={index} style={styles?.text}>
              {part}
            </Text>
          );
        });
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
              <View style={styles!.extraInline}>
                {renderTextWithColorSwatches(String(issue.extra))}
              </View>
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

const Code = __DEV__
  ? ({ children }: { children: ReactNode }) => {
      const code =
        typeof children === 'string' ? children.replace(/`/g, '') : children;

      return <Text style={styles!.code}> {code} </Text>;
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
      extraInline: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
      },
      swatchFrame: {
        backgroundColor: '#000',
        paddingHorizontal: 2,
        marginHorizontal: 2,
        lineHeight: 14,
      },
      swatchGlyph: {
        fontSize: 11,
        lineHeight: 14,
      },
    })
  : null;
