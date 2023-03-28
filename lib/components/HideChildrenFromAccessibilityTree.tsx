import React, { PropsWithChildren } from 'react';
import { Platform, View } from 'react-native';

import { useAMAContext } from '../providers/AMAProvider';

const HideChildrenFromAccessibilityTreeIOS = ({
  children,
}: PropsWithChildren<{}>) => {
  return hideChildrenFromAccessibilityTree(children);
};

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

export const HideChildrenFromAccessibilityTree = (
  props: PropsWithChildren<{}>,
): JSX.Element => {
  const { isScreenReaderEnabled } = useAMAContext();

  if (!isScreenReaderEnabled) {
    return <>{props.children}</>;
  }

  return Platform.select({
    default: <HideChildrenFromAccessibilityAndroid {...props} />,
    ios: <HideChildrenFromAccessibilityTreeIOS {...props} />,
  });
};
