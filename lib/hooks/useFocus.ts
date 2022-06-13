import * as React from 'react';
import { AccessibilityInfo, findNodeHandle } from 'react-native';

export const useFocus = (refComponent?: React.RefObject<any>) => {
  const setFocus = (
    component:
      | null
      | number
      | React.Component<any, any>
      | React.ComponentClass<any>,
  ) => {
    // @ts-ignore
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

    setFocus(refComponent.current);
  }, [refComponent]);

  return {
    setFocus,
  };
};
