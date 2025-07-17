import { SHELL_COLORS } from '@react-native-ama/internal';
import * as React from 'react';
import {
  AccessibilityInfo,
  findNodeHandle,
  InteractionManager,
} from 'react-native';

export const useFocus = (refComponent?: React.RefObject<any>) => {
  const setFocus = React.useCallback(
    (
      component:
        | null
        | number
        | React.Component<any, any>
        | React.ComponentClass<any>,
    ) => {
      if (!component) {
        return;
      }

      InteractionManager.runAfterInteractions(() => {
        try {
          const elementId = findNodeHandle(component);

          if (elementId) {
            AccessibilityInfo.setAccessibilityFocus(elementId);
            setTimeout(() => {
              AccessibilityInfo.setAccessibilityFocus(elementId); //ISSUE: https://github.com/facebook/react-native/issues/30097
            }, 100);
          } else if (__DEV__) {
            console.warn(
              // @ts-ignore
              `${SHELL_COLORS.BG_RED}AMA.${SHELL_COLORS.RESET} ${SHELL_COLORS.BLUE}useFocus${SHELL_COLORS.RESET}: ${SHELL_COLORS.YELLOW}Ref element not found${SHELL_COLORS.RESET}`,
            );
          }
        } catch (error) {
          if (__DEV__) {
            console.warn(
              // @ts-ignore
              `${SHELL_COLORS.BG_RED}AMA.${SHELL_COLORS.RESET} ${SHELL_COLORS.BLUE}useFocus${SHELL_COLORS.RESET}: ${SHELL_COLORS.YELLOW}Error finding node handle${SHELL_COLORS.RESET} \n`,
              error,
            );
          }
        }
      });
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
