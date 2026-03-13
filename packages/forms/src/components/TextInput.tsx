import * as React from 'react';
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
} from 'react-native';
import { UseTextInput, useTextInput } from '../hooks/useTextInput';

export const a11yProps: Pick<TextInputProps, 'accessibilityElementsHidden' | 'importantForAccessibility'> = {
  importantForAccessibility: 'no-hide-descendants',
  accessibilityElementsHidden: true, 
};

type A11yProps = typeof a11yProps;

type TextInputBaseProps = Omit<RNTextInputProps, 'accessibilityLabel' | 'aria-label'> &
  Omit<UseTextInput, 'required' | 'accessibilityLabel'> & {
    labelPosition?: 'beforeInput' | 'afterInput';
    nextFormField?: React.RefObject<RNTextInput>;
    id?: string;
    nextFieldId?: string;
    errorPosition?: 'belowLabel' | 'afterInput';
    renderLabel?: (a11yProps: A11yProps) => React.ReactNode;
    renderError?: (a11yProps: A11yProps) => React.ReactNode;
  };

// Require either `accessibilityLabel` or `aria-label` (but at least one)
export type TextInputProps =
  | (TextInputBaseProps & { accessibilityLabel: string; 'aria-label'?: never })
  | (TextInputBaseProps & { 'aria-label': string; accessibilityLabel?: never });


const labelA11yProps: A11yProps = {
  importantForAccessibility: 'no-hide-descendants',
  accessibilityElementsHidden: true,
};

export const TextInput = React.forwardRef<RNTextInput, TextInputProps>(
  (
    {
      nextFormField,
      id,
      nextFieldId,
      accessibilityHint,
      hasError,
      hasValidation,
      errorMessage,
      accessibilityLabel,
      labelPosition = 'beforeInput',
      errorPosition = 'afterInput',
      renderLabel,
      renderError,
      ...rest
    },
    forwardedRef
  ) => {
    const inputRef = React.useRef<RNTextInput | null>(
      null
    );

    React.useImperativeHandle(forwardedRef, () => inputRef.current!);

    const textInputProps = useTextInput({
      ...rest,
      ref: inputRef,
      id,
      nextFieldId,
      nextFormFieldRef: nextFormField,
      hasError,
      hasValidation,
      errorMessage,
      required: false,
      accessibilityLabel: accessibilityLabel || rest?.['aria-label'],
    });

    const fullAccessibilityHint = [accessibilityHint, errorMessage]
      .filter(Boolean)
      ?.join(', ');

    const showError = hasError && renderError;

    return (
      <>
        {labelPosition === 'beforeInput' ? renderLabel?.(labelA11yProps) : null}
        {errorPosition === 'belowLabel' && showError ? renderError?.(labelA11yProps) : null}
        <RNTextInput
          ref={inputRef}
          {...rest}
          {...textInputProps}
          accessibilityLabel={accessibilityLabel ?? rest['aria-label']}
          accessibilityHint={fullAccessibilityHint}
        />
        {labelPosition === 'afterInput' ? renderLabel?.(labelA11yProps) : null}
        {errorPosition === 'afterInput' && showError ? renderError?.(labelA11yProps) : null}
      </>
    );
  }
);
