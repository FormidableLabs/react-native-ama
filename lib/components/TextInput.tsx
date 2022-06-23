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
  labelComponent: JSX.Element;
  labelPosition?: 'beforeInput' | 'afterInput';
  nextFormField?: React.RefObject<RNTextInput>;
  id?: string;
  nextFieldId?: string;
} & (
    | {
        hasValidation: true;
        errorComponent: JSX.Element;
        hasError: boolean;
        errorPosition?: 'belowLabel' | 'afterInput';
        errorText?: string;
      }
    | {
        hasValidation: false;
        errorComponent?: never;
        hasError?: never;
        errorPosition?: never;
        errorText?: never;
      }
  );

export const TextInput = React.forwardRef<RNTextInput, TextInputProps>(
  (
    {
      labelComponent,
      labelPosition = 'beforeInput',
      nextFormField,
      id,
      nextFieldId,
      accessibilityHint,
      hasError,
      errorComponent,
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
        properties: { labelComponent },
        property: 'labelComponent',
        rule: 'NO_FORM_LABEL',
      }),
      ...(hasValidation
        ? noUndefinedProperty({
            // @ts-ignore
            properties: { errorComponent },
            property: 'errorComponent',
            rule: 'NO_FORM_ERROR',
          })
        : {}),
    };

    const style = applyStyle({ style: rest.style || {}, debugStyle });
    /*block:end*/

    const showLabelBeforeInput = labelPosition === 'beforeInput';

    const accessibilityLabel = React.useMemo(
      () =>
        maybeGenerateStringFromElement(labelComponent, rest.accessibilityLabel),
      [labelComponent, rest.accessibilityLabel],
    );

    const accessibilityHiddenLabel = React.useMemo(
      () => (
        <HideChildrenFromAccessibilityTree>
          {labelComponent}
        </HideChildrenFromAccessibilityTree>
      ),
      [labelComponent],
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
      return hasValidation && hasError
        ? maybeGenerateStringFromElement(errorComponent, rest.errorText)
        : '';
    }, [hasValidation, hasError, errorComponent, rest.errorText]);

    const renderError = () => {
      return (
        <HideChildrenFromAccessibilityTree>
          {errorComponent}
        </HideChildrenFromAccessibilityTree>
      );
    };

    const fullAccessibilityHint = [accessibilityHint || '', errorText || '']
      .filter(item => item.length > 0)
      ?.join(', ');

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
