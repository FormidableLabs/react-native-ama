import { HideChildrenFromAccessibilityTree } from '@react-native-ama/core';
import { maybeGenerateStringFromElement } from '@react-native-ama/internal';
import React from 'react';
import type { StyleProp, SwitchProps, ViewStyle } from 'react-native';
import { StyleSheet, Switch } from 'react-native';

import { SwitchWrapper } from './SwitchWrapper';

export type SwitchListItemProps = React.PropsWithChildren<
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
