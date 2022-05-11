import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from 'react-native-ama';

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
    fontWeight: 'bold',
  },
});
