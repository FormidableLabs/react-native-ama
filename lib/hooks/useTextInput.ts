import * as React from 'react';
import type {
  LayoutChangeEvent,
  NativeSyntheticEvent,
  ReturnKeyTypeOptions,
  TextInputSubmitEditingEventData,
  TextProps,
  ViewStyle,
} from 'react-native';

import { applyStyle } from '../internal/applyStyle';
import { useChecks } from '../internal/useChecks';
import { UseFormField, useFormField } from './useFormField';

type UseTextInput = Omit<UseFormField, 'hasFocusCallback'> & {
  onLayout?: (event: LayoutChangeEvent) => void;
  returnKeyType?: ReturnKeyTypeOptions;
  onSubmitEditing?: (
    event: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => void;
  accessibilityLabel: string;
  editable?: boolean;
  style?: TextProps['style'] | ViewStyle | Record<string, any>;
} & (
    | {
        hasValidation: true;
        hasError: boolean;
        errorMessage?: string;
      }
    | {
        hasValidation: false;
        hasError?: never;
        errorMessage?: never;
      }
  );

export const useTextInput = ({
  onLayout,
  returnKeyType,
  onSubmitEditing,
  ...rest
}: UseTextInput) => {
  const [theReturnKeyType, setTheReturnKeyType] = React.useState(
    returnKeyType || 'next',
  );
  const formField = useFormField({
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
      properties: rest,
      property: 'accessibilityLabel',
      rule: 'NO_FORM_LABEL',
    });
  __DEV__ &&
    checks?.noUppercaseStringChecker({
      text: rest.accessibilityLabel,
    });
  __DEV__ &&
    checks?.noUppercaseStringChecker({
      text: rest.accessibilityHint,
    });

  return __DEV__
    ? {
        ...rest,
        ...formField,
        returnKeyType: theReturnKeyType,
        onSubmitEditing: handleOnSubmitEditing,
        onLayout: checkReturnKeyType,
        style: applyStyle?.({
          // @ts-ignore
          style: formField.style,
          debugStyle: checks?.debugStyle,
        }),
      }
    : {
        ...rest,
        ...formField,
        returnKeyType: theReturnKeyType,
        onSubmitEditing: handleOnSubmitEditing,
        onLayout: checkReturnKeyType,
      };
};
