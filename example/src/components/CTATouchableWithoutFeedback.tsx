import React from 'react';
import { ActivityIndicator, Omit, StyleSheet, Text, View } from 'react-native';
import {
  AMAAccessibilityState,
  TouchableWithoutFeedback,
} from 'react-native-ama';
import type { TouchableWithoutFeedbackProps } from 'react-native-ama';

import { theme } from '../theme';

type CTATouchableWithoutFeedbackProps = Omit<
  TouchableWithoutFeedbackProps,
  'accessibilityRole' | 'accessibilityLabel'
> & {
  title: string;
  accessibilityLabel?: string;
  textTransform?: 'none' | 'capitalize' | 'uppercase' | 'lowercase' | undefined;
} & {
  marginLeft?: number;
  marginRight?: number;
};

export const CTATouchableWithoutFeedback = ({
  title,
  onPress,
  disabled,
  textTransform,
  marginLeft,
  marginRight,
  accessibilityLabel,
  ...rest
}: CTATouchableWithoutFeedbackProps) => {
  const style = {
    ...styles.button,
    ...getButtonStyle(disabled, rest?.checked, rest?.selected),
  };

  return (
    <TouchableWithoutFeedback
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      disabled={disabled}
      onPress={onPress || noop}
      {...rest}>
      <View style={style}>
        {rest.busy ? <ActivityIndicator color={theme.color.white} /> : null}
        <Text style={[styles.text, { textTransform }]}>{title}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

function noop() {}

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
