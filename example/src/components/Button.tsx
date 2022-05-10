import React from 'react';
import {Pressable} from 'react-native-ama';
import {StyleSheet, Text} from 'react-native';
import {theme} from '../theme';

type ButtonProps = {
  title: string;
};

export const Button: React.FC<ButtonProps> = ({title}) => {
  return (
    <Pressable accessibilityRole="button" style={styles.button}>
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
