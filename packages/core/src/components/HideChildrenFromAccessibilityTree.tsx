import React, { PropsWithChildren, type JSX } from 'react';
import { Platform, View } from 'react-native';
import { useAMAContext } from './AMAProvider';

type HideChildrenFromAccessibilityTreeProps = {
  testID?: string;
};

export const HideChildrenFromAccessibilityTree = (
  props: PropsWithChildren<HideChildrenFromAccessibilityTreeProps>,
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

const HideChildrenFromAccessibilityAndroid = ({
  children,
  testID,
}: PropsWithChildren<HideChildrenFromAccessibilityTreeProps>) => {
  return (
    <View importantForAccessibility="no-hide-descendants" testID={testID}>
      {children}
    </View>
  );
};

const HideChildrenFromAccessibilityTreeIOS = ({
  children,
}: PropsWithChildren<{}>) => {
  return hideChildrenFromAccessibilityTree(children);
};

const hideChildrenFromAccessibilityTree = (component: React.ReactNode): React.ReactNode => {
  return (
    React.Children.map(component, child => {
      if (React.isValidElement(child)) {
        const element = child as React.ReactElement<{ children?: React.ReactNode }>;
        return React.cloneElement(element, {
          // @ts-ignore
          importantForAccessibility: 'no',
          accessibilityElementsHidden: true,
          children: hideChildrenFromAccessibilityTree(element.props.children),
        });
      }
      return child;
    }) || null
  );
};
