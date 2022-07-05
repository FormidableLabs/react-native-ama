import React from 'react';
import type { StyleProp, SwitchProps, ViewStyle } from 'react-native';
import { StyleSheet, Switch } from 'react-native';

import { maybeGenerateStringFromElement } from '../internal/maybeGenerateStringFromElement';
import { FormField } from './FormField';
import { HideChildrenFromAccessibilityTree } from './HideChildrenFromAccessibilityTree';
import { SwitchWrapper } from './SwitchWrapper';

type SwitchListItemProps = React.PropsWithChildren<
  Omit<SwitchProps, 'style' | 'value' | 'onValueChange'> & {
    labelComponent: JSX.Element;
    labelPosition?: 'left' | 'right';
    style?: StyleProp<ViewStyle>;
    switchStyle?: StyleProp<ViewStyle>;
    value: boolean;
    onValueChange: () => void;
  }
>;

export const SwitchListItemBase = ({
  children,
  testID,
  labelComponent,
  labelPosition = 'left',
  style = {},
  switchStyle = {},
  value,
  onValueChange,
  ...rest
}: SwitchListItemProps) => {
  const isLabelPositionLeft = labelPosition === 'left';

  const accessibilityLabel = React.useMemo(
    () =>
      maybeGenerateStringFromElement(labelComponent, rest.accessibilityLabel),
    [labelComponent, rest.accessibilityLabel],
  );

  return (
    <FormField hasValidation={false}>
      <SwitchWrapper
        accessibilityLabel={accessibilityLabel}
        style={[allStyles.container, style]}
        onPress={onValueChange}
        checked={value}
        testID={testID}>
        {isLabelPositionLeft ? labelComponent : null}
        <HideChildrenFromAccessibilityTree>
          {children ? (
            children
          ) : (
            <Switch
              {...rest}
              style={switchStyle}
              value={value}
              onValueChange={onValueChange}
              testID={`${testID}-switch`}
            />
          )}
        </HideChildrenFromAccessibilityTree>
        {isLabelPositionLeft ? null : labelComponent}
      </SwitchWrapper>
    </FormField>
  );
};

export const SwitchListItem = React.memo(SwitchListItemBase);

const allStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: '100%',
    alignContent: 'center',
    alignItems: 'center',
  },
});
