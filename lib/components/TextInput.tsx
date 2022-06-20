import * as React from 'react';
import {
  LayoutChangeEvent,
  NativeSyntheticEvent,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  TextInputSubmitEditingEventData,
} from 'react-native';

import { useFormField } from '../hooks/useFormField';
import { applyStyle } from '../internal/applyStyle';
import { maybeGenerateStringFromElement } from '../internal/maybeGenerateStringFromElement';
import { useChecks } from '../internal/useChecks';
import { HideChildrenFromAccessibilityTree } from './HideChildrenFromAccessibilityTree';

export type TextInputProps = RNTextInputProps & {
  label: JSX.Element;
  labelPosition?: 'beforeInput' | 'afterInput';
  nextFormField?: React.RefObject<RNTextInput>;
  id?: string;
  nextFieldId?: string;
} & (
    | {
        hasValidation: true;
        error: JSX.Element;
        hasError: boolean;
        errorPosition?: 'belowLabel' | 'afterInput';
        errorText?: string;
      }
    | {
        hasValidation: false;
        error?: never;
        hasError?: never;
        errorPosition?: never;
        errorText?: never;
      }
  );

export const TextInput = React.forwardRef<RNTextInput, TextInputProps>(
  (
    {
      label,
      labelPosition = 'beforeInput',
      nextFormField,
      id,
      nextFieldId,
      accessibilityHint,
      hasError,
      error,
      errorPosition = 'afterInput',
      hasValidation,
      ...rest
    },
    forwardedRef,
  ) => {
    const inputRef = React.useRef<React.ElementRef<typeof TextInput> | null>(
      null,
    );

    React.useImperativeHandle(forwardedRef, () => inputRef.current!);

    const { focusNextFormField, isLastField } = useFormField({
      ref: inputRef,
      id,
      nextFieldId,
      nextFormFieldRef: nextFormField,
      hasFocusCallback: true,
    });

    const [returnKeyType, setReturnKeyType] = React.useState(
      rest.returnKeyType || 'next',
    );

    /*block:start*/
    const { noUndefinedProperty } = useChecks();

    const debugStyle = {
      ...noUndefinedProperty({
        properties: { label },
        property: 'label',
        rule: 'NO_FORM_LABEL',
      }),
      ...(hasValidation
        ? noUndefinedProperty({
            // @ts-ignore
            properties: { error },
            property: 'error',
            rule: 'NO_FORM_ERROR',
          })
        : {}),
    };

    const style = applyStyle({ style: rest.style || {}, debugStyle });
    /*block:end*/

    const showLabelBeforeInput = labelPosition === 'beforeInput';

    const accessibilityLabel = React.useMemo(
      () => maybeGenerateStringFromElement(label, rest.accessibilityLabel),
      [label, rest.accessibilityLabel],
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

      focusNextFormField();
    };

    const checkReturnKeyType = (event: LayoutChangeEvent) => {
      const setReturnKeyTypeAsDone =
        isLastField() && rest.returnKeyType == null;

      if (setReturnKeyTypeAsDone) {
        setReturnKeyType('done');
      }

      rest.onLayout?.(event);
    };

    const errorText = React.useMemo(() => {
      return hasValidation
        ? maybeGenerateStringFromElement(error, rest.errorText)
        : '';
    }, [hasValidation, error, rest.errorText]);

    const renderError = () => {
      return (
        <HideChildrenFromAccessibilityTree>
          {error}
        </HideChildrenFromAccessibilityTree>
      );
    };

    const fullAccessibilityHint = [accessibilityHint || '', errorText || '']
      .filter(item => item.length > 0)
      ?.join(',');

    return (
      <>
        {showLabelBeforeInput ? accessibilityHiddenLabel : null}
        {hasError && errorPosition === 'belowLabel' ? renderError() : null}
        <RNTextInput
          // @ts-ignore
          ref={inputRef}
          key={returnKeyType}
          returnKeyType={returnKeyType}
          {...rest}
          /*block:start*/
          style={style}
          /*block:end*/
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={fullAccessibilityHint}
          onSubmitEditing={handleOnSubmitEditing}
          onLayout={checkReturnKeyType}
        />
        {showLabelBeforeInput ? null : accessibilityHiddenLabel}
        {hasError && errorPosition === 'afterInput' ? renderError() : null}
      </>
    );
  },
);
