import * as React from 'react';
import {
  LayoutChangeEvent,
  NativeSyntheticEvent,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  TextInputSubmitEditingEventData,
} from 'react-native';

import { useFormField } from '../hooks/useFormField';
import { generateAccessibilityLabelFromProps } from '../internal/generateAccessibilityLabelFromProps';
import { noUndefinedProperty } from '../internal/noUndefinedProperty';
import { HideChildrenFromAccessibilityTree } from './HideFromAccessibilityTree';

export type TextInputProps = RNTextInputProps & {
  label: JSX.Element;
  labelPosition?: 'beforeInput' | 'afterInput';
} & {
  nextFormField?: React.RefObject<RNTextInput>;
};

export const TextInput = React.forwardRef<RNTextInput, TextInputProps>(
  (props, forwardedRef) => {
    const inputRef = React.useRef<React.ElementRef<typeof TextInput> | null>(
      null,
    );

    React.useImperativeHandle(forwardedRef, () => inputRef.current!);

    const { focusNextFormField, isLastField } = useFormField({
      ref: inputRef,
      hasFocusCallback: true,
    });
    const [returnKeyType, setReturnKeyType] = React.useState(
      props.returnKeyType || 'next',
    );
    const {
      label,
      labelPosition = 'beforeInput',
      nextFormField,
      ...rest
    } = props;

    const showLabelBeforeInput = labelPosition === 'beforeInput';

    const accessibilityLabel = React.useMemo(
      () => generateAccessibilityLabelFromProps(props),
      [props],
    );

    const accessibilityHiddenLabel = React.useMemo(
      () => (
        <HideChildrenFromAccessibilityTree>
          {label}
        </HideChildrenFromAccessibilityTree>
      ),
      [label],
    );

    const handleOnSubmitEditing = (
      event: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
    ) => {
      rest?.onSubmitEditing?.(event);

      focusNextFormField(nextFormField);
    };

    const checkReturnKeyType = (event: LayoutChangeEvent) => {
      const setReturnKeyTypeAsDone =
        isLastField() && props.returnKeyType == null;

      if (setReturnKeyTypeAsDone) {
        setReturnKeyType('done');
      }

      props.onLayout?.(event);
    };

    __DEV__ && noUndefinedProperty(props, 'label', 'NO_FORM_LABEL');

    return (
      <>
        {showLabelBeforeInput ? accessibilityHiddenLabel : null}
        <RNTextInput
          // @ts-ignore
          ref={inputRef}
          key={returnKeyType}
          accessibilityLabel={accessibilityLabel}
          returnKeyType={returnKeyType}
          {...rest}
          onSubmitEditing={handleOnSubmitEditing}
          onLayout={checkReturnKeyType}
        />
        {showLabelBeforeInput ? null : accessibilityHiddenLabel}
      </>
    );
  },
);
