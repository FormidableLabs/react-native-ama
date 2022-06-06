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
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        // @ts-ignore
        importantForAccessibility: 'no',
        accessibilityElementsHidden: true,
      });
    }

    // @ts-ignore
    if (child?.props?.children) {
      return hideChildrenFromAccessibilityTree(child);
    }

    return child;
  });
};
