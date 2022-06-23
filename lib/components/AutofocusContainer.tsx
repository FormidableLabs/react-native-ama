import * as React from 'react';
import { TouchableWithoutFeedback } from 'react-native';

import { useFocus } from '../hooks/useFocus';

type AutofocusContainerProps = React.PropsWithChildren<{}>;

export const AutofocusContainer = ({ children }: AutofocusContainerProps) => {
  const containerRef = React.useRef(null);
  const { setFocus } = useFocus();

  React.useEffect(() => {
    setTimeout(() => {
      setFocus(containerRef.current);
    }, 0);
  }, [setFocus]);

  return (
    <TouchableWithoutFeedback ref={containerRef}>
      {children}
    </TouchableWithoutFeedback>
  );
};
