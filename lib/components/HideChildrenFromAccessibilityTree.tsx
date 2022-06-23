import React, { PropsWithChildren } from 'react';
import { Platform, View } from 'react-native';

const HideChildrenFromAccessibilityTreeIOS = ({
  children,
}: PropsWithChildren<{}>) => {
  return React.useMemo(
    () => hideChildrenFromAccessibilityTree(children),
    [children],
  );
};

// TODO: Fix return type
const hideChildrenFromAccessibilityTree = (component: React.ReactNode): any => {
  return (
    React.Children.map(component, child => {
      return React.isValidElement(child)
        ? React.cloneElement(child, {
            // @ts-ignore
            importantForAccessibility: 'no',
            accessibilityElementsHidden: true,
            children: hideChildrenFromAccessibilityTree(child.props.children),
          })
        : child;
    }) || null
  );
};

const HideChildrenFromAccessibilityAndroid = ({
  children,
}: PropsWithChildren<{}>) => {
  return (
    <View importantForAccessibility="no-hide-descendants">{children}</View>
  );
};

export const HideChildrenFromAccessibilityTree =
  Platform.OS === 'android'
    ? HideChildrenFromAccessibilityAndroid
    : HideChildrenFromAccessibilityTreeIOS;
