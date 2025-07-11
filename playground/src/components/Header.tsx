import * as React from 'react';
import { StyleSheet } from 'react-native';
import { theme } from '../theme';
import { Text } from './Text';

type HeaderProps = {
  title: string;
  autofocus?: boolean;
  noMargin?: boolean;
  white?: boolean;
};

export const Header = (
  { title, autofocus, noMargin = false, white }: HeaderProps,
) => {
  return (
    <Text
      style={{
        ...styles.title,
        color: white ? theme.color.white : undefined,
      }}
      accessibilityRole="header"
      autofocus={autofocus}
      mb={noMargin ? undefined : 12}
      mt={noMargin ? undefined : 24}
      bold
    >
      {title}
    </Text>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: theme.fontSize.big,
    fontWeight: 'bold',
  },
});
