import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Pressable } from 'react-native-ama';
import type { PressableProps } from 'react-native-ama';

import { theme } from '../theme';

type ButtonProps = Omit<
  PressableProps,
  'children' | 'accessibilityRole' | 'accessibilityLabel'
> & {
  title: string;
  textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase' | undefined;
};

export const CTAPressable = ({
  title,
  onPress,
  disabled,
  textTransform,
  ...rest
}: ButtonProps) => {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      disabled={disabled}
      style={({ pressed }) => {
        const buttonStyles = getButtonStyle({ pressed, disabled });
        return [styles.button, buttonStyles];
      }}
      onPress={onPress}
      {...rest}>
      <Text style={[styles.text, { textTransform }]}>{title}</Text>
    </Pressable>
  );
};

function getButtonStyle({
  pressed,
  disabled,
}: {
  pressed: boolean;
  disabled?: boolean;
}) {
  if (pressed) {
    return styles.pressed;
  } else if (disabled) {
    return styles.disabled;
  }

  return {};
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: theme.padding.normal,
    backgroundColor: theme.color.black,
    flex: 1,
    width: 22,
  },
  pressed: {
    backgroundColor: theme.color.hover,
  },
  disabled: {
    backgroundColor: theme.color.disabled,
  },
  text: {
    textAlign: 'center',
    color: theme.color.white,
    fontSize: theme.fontSize.medium,
  },
});
