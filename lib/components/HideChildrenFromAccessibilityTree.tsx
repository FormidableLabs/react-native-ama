import React from 'react';

export const HideChildrenFromAccessibilityTree: React.FC<{}> = ({
  children,
}) => {
  return React.useMemo(
    () => hideChildrenFromAccessibilityTree(children),
    [children],
  );
};

// TODO: Fix return type
const hideChildrenFromAccessibilityTree = (component: React.ReactNode): any => {
  return React.Children.map(component, child => {
    return React.isValidElement(child)
      ? React.cloneElement(child, {
          // @ts-ignore
          importantForAccessibility: 'no',
          accessibilityElementsHidden: true,
          children: hideChildrenFromAccessibilityTree(child.props.children),
        })
      : child;
  });
};
