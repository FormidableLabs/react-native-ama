import * as React from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';

import { useFocus } from '../hooks/useFocus';

type AutofocusContainerProps = React.PropsWithChildren<{
  accessibilityLabel?: string;
}>;

export const AutofocusContainer = ({
  children,
  accessibilityLabel,
}: AutofocusContainerProps) => {
  const containerRef = React.useRef(null);
  const { setFocus } = useFocus();

  React.useEffect(() => {
    setTimeout(() => {
      setFocus(containerRef.current);
    }, 0);
  }, [setFocus]);

  return accessibilityLabel ? (
    <TouchableWithoutFeedback ref={containerRef}>
      <View accessible={true} accessibilityLabel={accessibilityLabel}>
        {children}
      </View>
    </TouchableWithoutFeedback>
  ) : (
    <TouchableWithoutFeedback ref={containerRef}>
      {children}
    </TouchableWithoutFeedback>
  );
};
