import React from 'react';
import { View, ViewProps } from 'react-native';

import { useFormField } from '../hooks/useFormField';

type FormFieldProps = ViewProps & {
  children: React.ReactNode;
};

const FormFieldBase = React.forwardRef<View, FormFieldProps>(
  ({ children, ...props }, forwardedRef) => {
    const viewRef = React.useRef<React.ElementRef<typeof View> | null>(null);

    React.useImperativeHandle(forwardedRef, () => viewRef.current!);

    useFormField({ ref: viewRef, hasFocusCallback: false });

    return (
      <View {...props} focusable={true} accessible={true} ref={viewRef}>
        {children}
      </View>
    );
  },
);

export const FormField = React.memo(FormFieldBase);
