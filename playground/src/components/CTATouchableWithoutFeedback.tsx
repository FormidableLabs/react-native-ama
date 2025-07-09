import {
  TouchableWithoutFeedback,
  type TouchableWithoutFeedbackProps,
} from '@react-native-ama/react-native';
import React from 'react';
import {
  AccessibilityState,
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';

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
} & {
  checked?: boolean | 'mixed';
  selected?: boolean;
  expanded?: boolean;
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
  disabled?: AccessibilityState['disabled'] | null,
  checked?: AccessibilityState['checked'],
  selected?: AccessibilityState['selected'],
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
