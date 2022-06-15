import * as React from 'react';
import { AccessibilityInfo, findNodeHandle } from 'react-native';

import { SHELL_COLORS } from '../internal/logger.rules';

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
      console.warn(
        `${SHELL_COLORS.BG_BLUE}AMA.${SHELL_COLORS.RESET} ${SHELL_COLORS.BLUE}useFocus${SHELL_COLORS.RESET}: ${SHELL_COLORS.YELLOW}Ref element not found${SHELL_COLORS.RESET}`,
      );
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
