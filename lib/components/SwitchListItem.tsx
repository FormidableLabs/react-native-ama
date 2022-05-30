import React from 'react';
import type { StyleProp, SwitchProps, ViewStyle } from 'react-native';
import { StyleSheet, Switch } from 'react-native';
import { MINIMUM_TOUCHABLE_SIZE, Pressable } from 'react-native-ama';

import { generateAccessibilityLabelFromLabel } from '../internal/generateAccessibilityLabelFromLabel';
import { FormField } from './FormField';

type SwitchListItemProps = Omit<
  SwitchProps,
  'style' | 'value' | 'onValueChange'
> & {
  label: JSX.Element;
  labelPosition: 'left' | 'right';
  style?: StyleProp<ViewStyle>;
  switchStyle?: StyleProp<ViewStyle>;
  value: boolean;
  onValueChange: () => void;
};

export const SwitchListItem: React.FC<SwitchListItemProps> = ({
  children,
  ...props
}) => {
  const {
    label,
    labelPosition = 'beforeInput',
    style = {},
    switchStyle = {},
    value,
    onValueChange,
    ...rest
  } = props;
  const isLabelPositionLeft = labelPosition === 'left';

  const accessibilityLabel = React.useMemo(
    () => generateAccessibilityLabelFromLabel(label, props),
    [label, props],
  );

  return (
    <FormField>
      <Pressable
        accessibilityRole="switch"
        accessibilityLabel={accessibilityLabel}
        style={[styles.container, style]}
        onPress={onValueChange}
        checked={value}>
        {isLabelPositionLeft ? label : null}
        {children ? (
          children
        ) : (
          <Switch
            {...rest}
            accessibilityLabel={accessibilityLabel}
            style={switchStyle}
            value={value}
            onValueChange={onValueChange}
            accessibilityElementsHidden={true}
            importantForAccessibility="no"
          />
        )}
        {isLabelPositionLeft ? null : label}
      </Pressable>
    </FormField>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    alignContent: 'center',
    alignItems: 'center',
    minHeight: MINIMUM_TOUCHABLE_SIZE,
  },
});
