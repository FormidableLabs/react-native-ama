import React from 'react';
import { FC, PropsWithChildren } from 'react';
import { View } from 'react-native';

import { Text } from './Text';
import { StyleSheet } from 'react-native';
import { theme } from '../theme';

export const TestCase: FC<PropsWithChildren<{ title: string }>> = ({
  children,
  title,
}) => {
  return (
    <View style={styles.wrapper}>
      <Text bold style={{ fontSize: theme.fontSize.medium, marginBottom: 24 }}>
        {title}
      </Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 12,
    paddingHorizontal: 24,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    boxShadow: '0px 2px 6px #999',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    borderRadius: 8,
    marginBottom: theme.padding.big,
  },
});
