import React from 'react';
import type { StyleProp, SwitchProps, ViewStyle } from 'react-native';
import { StyleSheet, Switch } from 'react-native';

import { generateAccessibilityLabelFromProps } from '../internal/generateAccessibilityLabelFromProps';
import { MINIMUM_TOUCHABLE_SIZE } from '../utils/minimumTouchableSize';
import { FormField } from './FormField';
import { HideChildrenFromAccessibilityTree } from './HideChildrenFromAccessibilityTree';
import { Pressable } from './Pressable';

type SwitchListItemProps = Omit<
  SwitchProps,
  'style' | 'value' | 'onValueChange'
> & {
  label: JSX.Element;
  labelPosition?: 'left' | 'right';
  style?: StyleProp<ViewStyle>;
  switchStyle?: StyleProp<ViewStyle>;
  value: boolean;
  onValueChange: () => void;
};

export const SwitchListItem: React.FC<SwitchListItemProps> = ({
  children,
  testID,
  ...props
}) => {
  const {
    label,
    labelPosition = 'left',
    style = {},
    switchStyle = {},
    value,
    onValueChange,
    ...rest
  } = props;
  const isLabelPositionLeft = labelPosition === 'left';

  const accessibilityLabel = React.useMemo(
    () => generateAccessibilityLabelFromProps(props),
    [props],
  );

  return (
    <FormField>
      <Pressable
        accessibilityRole="switch"
        accessibilityLabel={accessibilityLabel}
        style={[allStyles.container, style]}
        onPress={onValueChange}
        checked={value}
        testID={testID}>
        {isLabelPositionLeft ? label : null}
        <HideChildrenFromAccessibilityTree>
          {children ? (
            children
          ) : (
            <Switch
              {...rest}
              accessibilityLabel={accessibilityLabel}
              style={switchStyle}
              value={value}
              onValueChange={onValueChange}
              testID={`${testID}-switch`}
            />
          )}
        </HideChildrenFromAccessibilityTree>
        {isLabelPositionLeft ? null : label}
      </Pressable>
    </FormField>
  );
};

const allStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    alignContent: 'center',
    alignItems: 'center',
    minHeight: MINIMUM_TOUCHABLE_SIZE,
  },
});
