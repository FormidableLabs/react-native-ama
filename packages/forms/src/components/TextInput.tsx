import * as React from "react";
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
} from "react-native";
import { UseTextInput, useTextInput } from "../hooks/useTextInput";

export type TextInputProps = RNTextInputProps &
  Omit<UseTextInput, "required" | "accessibilityLabel"> & {
    labelPosition?: "beforeInput" | "afterInput";
    nextFormField?: React.RefObject<RNTextInput>;
    id?: string;
    nextFieldId?: string;
    errorPosition?: "belowLabel" | "afterInput";
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
      ...rest
    },
    forwardedRef
  ) => {
    const inputRef = React.useRef<React.ElementRef<typeof TextInput> | null>(
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
      accessibilityLabel: accessibilityLabel || rest?.["aria-label"],
    });

    const fullAccessibilityHint = [accessibilityHint, errorMessage]
      .filter(Boolean)
      ?.join(", ");

    return (
      <RNTextInput
        // @ts-ignore
        ref={inputRef}
        {...rest}
        {...textInputProps}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={fullAccessibilityHint}
      />
    );
  }
);
