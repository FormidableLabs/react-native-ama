/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { A11yIssue } from '../hooks/useAMADev';

type A11yCounts = {
  must: number;
  should: number;
};

function countA11yIssues(issues: A11yIssue[]): A11yCounts {
  return issues.reduce<A11yCounts>(
    (acc, { type }) => {
      if (type === 'MUST' || type === 'MUST_NOT') {
        acc.must++;
      } else if (type === 'SHOULD' || type === 'SHOULD_NOT') {
        acc.should++;
      }
      return acc;
    },
    { must: 0, should: 0 },
  );
}

const AMAErrorComponent = ({ issues }: { issues?: A11yIssue[] }) => {
  const { must, should } = countA11yIssues(issues ?? []);

  const error = `${
    must + should
  } component(s) didn't pass the accessibility check(s)`;

  return issues?.length ? (
    <View
      accessibilityLabel={error}
      accessibilityHint="Please check the console for more info..."
      style={{
        paddingHorizontal: 12,
        paddingTop: 12,
        paddingBottom: 24,
        backgroundColor: '#A31420',
      }}
      testID="amaError"
    >
      <View
        accessible={true}
        style={{ flexDirection: 'row', alignItems: 'center' }}
      >
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
          role="button"
          aria-label="Show errors"
          activeOpacity={0.8}
        >
          <Svg viewBox="0 0 512 512" width={32} height={32}>
            <Path
              d="M213.333 0c117.803 0 213.334 95.53 213.334 213.333s-95.531 213.334-213.334 213.334C95.531 426.667 0 331.136 0 213.333 0 95.531 95.53 0 213.333 0zm48.918 134.25l-48.918 48.918-48.917-48.917-30.165 30.165 48.917 48.917-48.917 48.918 30.165 30.165 48.917-48.917 48.918 48.917 30.165-30.165-48.917-48.918 48.917-48.917-30.165-30.165z"
              transform="translate(42.667 42.667)"
              fill="#FFF0F0"
              stroke="none"
              strokeWidth={1}
              fillRule="evenodd"
            />
          </Svg>
          <Text
            style={{
              color: 'white',
              fontSize: 16,
              lineHeight: 26,
              paddingLeft: 24,
            }}
            testID="amaError.message"
          >
            {must} error{must !== 1 ? 's' : ''}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
          role="button"
          aria-label="Show warnings"
          activeOpacity={0.8}
        >
          <Svg viewBox="0 0 1024 1024" width={32} height={32}>
            <Path
              d="M512 64a448 448 0 110 896 448 448 0 010-896zm0 192a58.432 58.432 0 00-58.24 63.744l23.36 256.384a35.072 35.072 0 0069.76 0l23.296-256.384A58.432 58.432 0 00512 256zm0 512a51.2 51.2 0 100-102.4 51.2 51.2 0 000 102.4z"
              fill="#FFF700"
            />
          </Svg>
          <Text
            style={{
              color: 'white',
              fontSize: 16,
              lineHeight: 24,
              paddingLeft: 24,
            }}
          >
            {should} warning{should !== 1 ? 's' : ''}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  ) : null;
};

export const AMAError = __DEV__ ? AMAErrorComponent : null;
