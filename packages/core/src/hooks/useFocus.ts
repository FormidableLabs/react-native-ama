import { SHELL_COLORS } from '@react-native-ama/internal';
import * as React from 'react';
import { AccessibilityInfo, findNodeHandle } from 'react-native';

export const useFocus = (refComponent?: React.RefObject<any>) => {
  const setFocus = React.useCallback(
    (
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
          // @ts-ignore
          `${SHELL_COLORS.BG_RED}AMA.${SHELL_COLORS.RESET} ${SHELL_COLORS.BLUE}useFocus${SHELL_COLORS.RESET}: ${SHELL_COLORS.YELLOW}Ref element not found${SHELL_COLORS.RESET}`,
        );
      }
    },
    [],
  );

  React.useEffect(() => {
    if (!refComponent) {
      return;
    }

    setFocus(refComponent.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refComponent]);

  return {
    setFocus,
  };
};
