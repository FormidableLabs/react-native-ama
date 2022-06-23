import * as React from 'react';
import {
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
} from 'react-native';

import { useFormField } from '../hooks/useFormField';

type FormFieldProps = React.PropsWithChildren<
  TouchableWithoutFeedbackProps & {
    id?: string;
  }
>;

const FormFieldBase = ({ children, id, ...props }: FormFieldProps) => {
  const viewRef = React.useRef<React.ElementRef<
    typeof TouchableWithoutFeedback
  > | null>(null);

  useFormField({ ref: viewRef, hasFocusCallback: false, id });

  return (
    <TouchableWithoutFeedback {...props} ref={viewRef}>
      <>{children}</>
    </TouchableWithoutFeedback>
  );
};

export const FormField = React.memo(FormFieldBase);
