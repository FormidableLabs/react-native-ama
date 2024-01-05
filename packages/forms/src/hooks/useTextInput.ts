import { useChecks } from '@react-native-ama/core';
import * as React from 'react';
import type {
  LayoutChangeEvent,
  NativeSyntheticEvent,
  ReturnKeyTypeOptions,
  StyleProp,
  TextInputSubmitEditingEventData,
  TextStyle,
  ViewStyle,
} from 'react-native';
import { applyStyle } from '~internal';

import { TextInputProps } from '../components/TextInput';
import { UseFormField, useFormField } from './useFormField';

type UseTextInput = Omit<UseFormField, 'hasFocusCallback'> & {
  onLayout?: (event: LayoutChangeEvent) => void;
  returnKeyType?: ReturnKeyTypeOptions;
  onSubmitEditing?: (
    event: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => void;
  accessibilityLabel: string;
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
    returnKeyType || 'next',
  );
  const { style: formFieldStyle, ...formField } = useFormField({
    hasFocusCallback: true,
    ...rest,
  });

  const handleOnSubmitEditing = (
    event: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => {
    onSubmitEditing?.(event);

    formField.focusNextFormField();
  };

  const checkReturnKeyType = (event: LayoutChangeEvent) => {
    const setReturnKeyTypeAsDone =
      formField.isLastField() && returnKeyType == null;

    if (setReturnKeyTypeAsDone) {
      setTheReturnKeyType('done');
    }

    onLayout?.(event);
  };

  const checks = __DEV__ ? useChecks?.() : undefined;

  __DEV__ &&
    checks?.noUndefinedProperty({
      properties: { accessibilityLabel },
      property: 'accessibilityLabel',
      rule: 'NO_FORM_LABEL',
    });
  __DEV__ &&
    checks?.noUppercaseStringChecker({
      text: accessibilityLabel,
    });
  __DEV__ &&
    checks?.noUppercaseStringChecker({
      text: rest.accessibilityHint,
    });
  __DEV__ &&
    accessibilityLabel?.trim().slice(-1) === '*' &&
    checks?.logResult('NO_FORM_LABEL_ENDING_WITH_ASTERISK', {
      rule: 'NO_FORM_LABEL_ENDING_WITH_ASTERISK',
      message:
        'Form labels should not end with an asterisk. Please remove it and provide a required message instead.',
    });
  __DEV__ &&
    required &&
    checks?.noUndefinedProperty({
      properties: { requiredMessage },
      property: 'requiredMessage',
      rule: 'NO_FORM_LABEL_ENDING_WITH_ASTERISK',
    });

  const fullAccessibilityLabel = required
    ? `${accessibilityLabel}, ${requiredMessage}`
    : accessibilityLabel;

  const advancedProps: Partial<TextInputProps> = {
    accessibilityLabel: fullAccessibilityLabel,
    returnKeyType: theReturnKeyType,
    onSubmitEditing: handleOnSubmitEditing,
    onLayout: checkReturnKeyType,
    blurOnSubmit: theReturnKeyType === 'done',
  };

  return __DEV__
    ? {
        ...rest,
        ...formField,
        ...advancedProps,
        style: applyStyle?.({
          // @ts-ignore
          style: formFieldStyle,
          debugStyle: checks?.debugStyle,
        }) as any,
      }
    : {
        ...rest,
        ...formField,
        ...advancedProps,
      };
};
