import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Pressable, PressableProps } from 'react-native-ama';

import { theme } from '../theme';

type ButtonProps = Pick<PressableProps, 'onPress'> & {
  title: string;
};

export const Button: React.FC<ButtonProps> = ({ title, onPress }) => {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      style={styles.button}
      onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: theme.padding.normal,
    backgroundColor: theme.color.black,
  },
  text: {
    textAlign: 'center',
    color: theme.color.white,
    fontSize: theme.fontSize.medium,
  },
});
