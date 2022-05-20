import React from 'react';
import { ActivityIndicator, Omit, StyleSheet, Text } from 'react-native';
import { AMAAccessibilityState, TouchableOpacity } from 'react-native-ama';
import type { TouchableOpacityProps } from 'react-native-ama';

import { theme } from '../theme';

type CTATouchableOpacityProps = Omit<
  TouchableOpacityProps,
  'accessibilityRole' | 'accessibilityLabel'
> & {
  title: string;
  accessibilityLabel?: string;
  textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase' | undefined;
} & {
  marginLeft?: number;
  marginRight?: number;
};

export const CTATouchableOpacity = ({
  title,
  onPress,
  disabled,
  textTransform,
  marginLeft,
  marginRight,
  accessibilityLabel,
  ...rest
}: CTATouchableOpacityProps) => {
  const style = {
    ...styles.button,
    ...getButtonStyle(disabled, rest?.checked, rest?.selected),
  };

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      disabled={disabled}
      style={style}
      onPress={onPress}
      {...rest}>
      {rest.busy ? <ActivityIndicator color={theme.color.white} /> : null}
      <Text style={[styles.text, { textTransform }]}>{title}</Text>
    </TouchableOpacity>
  );
};

function getButtonStyle(
  disabled?: AMAAccessibilityState['disabled'],
  checked?: AMAAccessibilityState['checked'],
  selected?: AMAAccessibilityState['selected'],
) {
  if (disabled) {
    return styles.disabled;
  } else if (checked) {
    return checked === 'mixed' ? styles.mixed : styles.checked;
  } else if (selected) {
    return styles.selected;
  }

  return {};
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: theme.padding.normal,
    backgroundColor: theme.color.black,
    flex: 1,
    minHeight: 48,
    minWidth: 48,
  },
  pressed: {
    backgroundColor: theme.color.hover,
  },
  checked: {
    backgroundColor: theme.color.checked,
  },
  mixed: {
    backgroundColor: theme.color.mixed,
  },
  selected: {
    backgroundColor: theme.color.selected,
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
