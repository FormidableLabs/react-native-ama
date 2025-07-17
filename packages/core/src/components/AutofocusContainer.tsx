import { PickAccessibleProps } from '@react-native-ama/internal';
import * as React from 'react';
import {
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
  View,
  ViewProps,
} from 'react-native';
import { useFocus } from '../hooks/useFocus';

type TouchableAccessibleProps =
  PickAccessibleProps<TouchableWithoutFeedbackProps>;

export type AutofocusContainerProps = React.PropsWithChildren<
  (
    | ({
        wrapChildrenInAccessibleView?: true;
      } & ViewProps)
    | {
        wrapChildrenInAccessibleView: false;
      }
  ) & {
    /**
     * touchableContainerAccessibilityProps is provided as a workaround for any accessibility props that need to be passed to the TouchableWithoutFeedback component which are not recognized on the accessible view.
     */
    touchableContainerAccessibilityProps?: TouchableAccessibleProps;
  }
>;

export const AutofocusContainer = ({
  children,
  wrapChildrenInAccessibleView = true,
  touchableContainerAccessibilityProps,
  ...viewProps
}: AutofocusContainerProps) => {
  const containerRef = React.useRef(null);
  const { setFocus } = useFocus();

  React.useEffect(() => {
    setTimeout(() => {
      setFocus(containerRef.current);
    }, 0);
  }, [setFocus]);

  return wrapChildrenInAccessibleView ? (
    <TouchableWithoutFeedback
      ref={containerRef}
      {...touchableContainerAccessibilityProps}
    >
      <View
        accessible={true}
        testID="autofocusContainer.accessibleView"
        {...viewProps}
      >
        {children}
      </View>
    </TouchableWithoutFeedback>
  ) : (
    <TouchableWithoutFeedback
      ref={containerRef}
      {...touchableContainerAccessibilityProps}
    >
      {children}
    </TouchableWithoutFeedback>
  );
};
