import * as React from 'react';
import {
  TouchableWithoutFeedback,
  TouchableWithoutFeedbackProps,
  View,
} from 'react-native';

import { UseFormField, useFormField } from '../hooks/useFormField';

export type FormFieldProps = React.PropsWithChildren<
  TouchableWithoutFeedbackProps &
    Omit<
      UseFormField,
      'hasFocusCallback' | 'nextFormFieldRef' | 'nextFieldId' | 'editable'
    > & {
      wrapInsideAccessibleView?: boolean;
    }
>;

export const FormField = ({
  children,
  wrapInsideAccessibleView = true,
  ...props
}: FormFieldProps) => {
  const viewRef = React.useRef<React.ElementRef<
    typeof TouchableWithoutFeedback
  > | null>(null);

  const formProps = useFormField({
    hasFocusCallback: false,
    ref: viewRef,
    ...props,
  });

  return wrapInsideAccessibleView ? (
    <TouchableWithoutFeedback {...props} ref={viewRef} {...formProps}>
      <View accessible>{children}</View>
    </TouchableWithoutFeedback>
  ) : (
    <TouchableWithoutFeedback {...props} ref={viewRef} {...formProps}>
      <>{children}</>
    </TouchableWithoutFeedback>
  );
};
