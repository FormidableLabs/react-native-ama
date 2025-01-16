import * as React from 'react';
import {
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
  View,
  ViewProps,
} from 'react-native';

import { useFocus } from '../hooks/useFocus';

export type AutofocusContainerProps = React.PropsWithChildren<
  | ({
      wrapChildrenInAccessibleView?: true;
      touchableAccessibilityProps?: Pick<
        TouchableWithoutFeedbackProps,
        'accessibilityState'
      >;
    } & ViewProps)
  | {
      wrapChildrenInAccessibleView: false;
      touchableAccessibilityProps?: Pick<
        TouchableWithoutFeedbackProps,
        'accessibilityState'
      >;
    }
>;

export const AutofocusContainer = ({
  children,
  wrapChildrenInAccessibleView = true,
  touchableAccessibilityProps,
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
      {...touchableAccessibilityProps}>
      <View
        accessible={true}
        testID="autofocusContainer.accessibleView"
        {...viewProps}>
        {children}
      </View>
    </TouchableWithoutFeedback>
  ) : (
    <TouchableWithoutFeedback
      ref={containerRef}
      {...touchableAccessibilityProps}>
      {children}
    </TouchableWithoutFeedback>
  );
};
