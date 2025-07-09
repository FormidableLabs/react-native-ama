import { Text } from '@react-native-ama/react-native';
import * as React from 'react';
import { StyleSheet } from 'react-native';

import { theme } from '../theme';

type HeaderProps = {
  title: string;
  autofocus?: boolean;
};

export const Header: React.FC<HeaderProps> = ({ title, autofocus }) => {
  return (
    <Text style={styles.title} accessibilityRole="header" autofocus={autofocus}>
      {title}
    </Text>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: theme.fontSize.medium,
    fontWeight: 'bold',
  },
});
