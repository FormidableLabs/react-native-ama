import * as React from 'react';
import { AccessibilityInfo, findNodeHandle } from 'react-native';

export const useA11yFocus = (refComponent?: React.RefObject<any>) => {
  const focus = (component: React.Component) => {
    const elementId = findNodeHandle(component);

    if (elementId) {
      AccessibilityInfo.setAccessibilityFocus(elementId);
      AccessibilityInfo.setAccessibilityFocus(elementId);
    } else if (__DEV__) {
      console.warn('Element not found');
    }
  };

  React.useEffect(() => {
    if (!refComponent) {
      return;
    }

    focus(refComponent.current);
  }, [refComponent]);

  return {
    focus,
  };
};