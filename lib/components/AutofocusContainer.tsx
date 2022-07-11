import * as React from 'react';
import { TouchableWithoutFeedback, View, ViewProps } from 'react-native';

import { useFocus } from '../hooks/useFocus';

type AutofocusContainerProps = React.PropsWithChildren<{
  wrapChildrenInAccessibleView?: boolean;
  viewProps?: ViewProps;
}>;

export const AutofocusContainer = ({
  children,
  wrapChildrenInAccessibleView = true,
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
    <TouchableWithoutFeedback ref={containerRef}>
      <View accessible={true} {...viewProps}>
        {children}
      </View>
    </TouchableWithoutFeedback>
  ) : (
    <TouchableWithoutFeedback ref={containerRef}>
      {children}
    </TouchableWithoutFeedback>
  );
};
