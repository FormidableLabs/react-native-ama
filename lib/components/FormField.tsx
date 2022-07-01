import * as React from 'react';
import {
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
} from 'react-native';

import { UseFormField, useFormField } from '../hooks/useFormField';

type FormFieldProps = React.PropsWithChildren<
  TouchableWithoutFeedbackProps & Omit<UseFormField, 'hasFocusCallback'>
>;

const FormFieldBase = ({ children, ...props }: FormFieldProps) => {
  const viewRef = React.useRef<React.ElementRef<
    typeof TouchableWithoutFeedback
  > | null>(null);

  // @ts-ignore
  const formProps = useFormField({
    hasFocusCallback: false,
    ref: viewRef,
    ...props,
  });

  return (
    <TouchableWithoutFeedback {...props} ref={viewRef} {...formProps}>
      <>{children}</>
    </TouchableWithoutFeedback>
  );
};

export const FormField = React.memo(FormFieldBase);
