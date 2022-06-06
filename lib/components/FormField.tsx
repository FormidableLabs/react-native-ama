import React from 'react';
import {
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
  findNodeHandle,
} from 'react-native';

import { useFormField } from '../hooks/useFormField';

type FormFieldProps = TouchableWithoutFeedbackProps & {
  children: React.ReactNode;
};

const FormFieldBase: React.FC<FormFieldProps> = ({ children, ...props }) => {
  const viewRef = React.useRef<React.ElementRef<
    typeof TouchableWithoutFeedback
  > | null>(null);

  useFormField({ ref: viewRef, hasFocusCallback: false });

  React.useEffect(() => {
    const elementId = findNodeHandle(viewRef.current);

    console.info({ elementId });
  }, []);

  return (
    <TouchableWithoutFeedback {...props} ref={viewRef}>
      {children}
    </TouchableWithoutFeedback>
  );
};

export const FormField = React.memo(FormFieldBase);
