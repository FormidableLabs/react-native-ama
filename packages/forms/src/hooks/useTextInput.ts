import * as React from "react";
import type {
  LayoutChangeEvent,
  NativeSyntheticEvent,
  ReturnKeyTypeOptions,
  StyleProp,
  TextInputSubmitEditingEventData,
  TextStyle,
  ViewStyle,
} from "react-native";
import { TextInputProps } from "../components/TextInput";
import { UseFormField, useFormField } from "./useFormField";

export type UseTextInput = Omit<UseFormField, "hasFocusCallback"> & {
  onLayout?: (event: LayoutChangeEvent) => void;
  returnKeyType?: ReturnKeyTypeOptions;
  onSubmitEditing?: (
    event: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => void;
  accessibilityLabel?: string;
  editable?: boolean;
  style?: ViewStyle | StyleProp<TextStyle> | null;
  required: boolean;
  requiredMessage?: string;
  hasValidation: boolean;
  hasError?: boolean;
  errorMessage?: string;
};

export const useTextInput = ({
  onLayout,
  returnKeyType,
  onSubmitEditing,
  accessibilityLabel,
  requiredMessage,
  required,
  ...rest
}: UseTextInput) => {
  const [theReturnKeyType, setTheReturnKeyType] = React.useState(
    returnKeyType || "next"
  );
  const formField = useFormField({
    hasFocusCallback: true,
    ...rest,
  });

  const handleOnSubmitEditing = (
    event: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => {
    onSubmitEditing?.(event);

    formField.focusNextFormField();
  };

  const checkReturnKeyType = (event: LayoutChangeEvent) => {
    const setReturnKeyTypeAsDone =
      formField.isLastField() && returnKeyType == null;

    if (setReturnKeyTypeAsDone) {
      setTheReturnKeyType("done");
    }

    onLayout?.(event);
  };

  const fullAccessibilityLabel = required
    ? `${accessibilityLabel}, ${requiredMessage}`
    : accessibilityLabel;

  const advancedProps: Partial<TextInputProps> = {
    accessibilityLabel: fullAccessibilityLabel,
    returnKeyType: theReturnKeyType,
    onSubmitEditing: handleOnSubmitEditing,
    onLayout: checkReturnKeyType,
    blurOnSubmit: theReturnKeyType === "done",
  };

  return {
    ...rest,
    ...formField,
    ...advancedProps,
  };
};
