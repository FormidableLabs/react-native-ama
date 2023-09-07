import * as React from 'react';
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
} from 'react-native';

import { useTextInput } from '../hooks/useTextInput';
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
  hasValidation: boolean;
  errorComponent?: JSX.Element;
  hasError?: boolean;
  errorPosition?: 'belowLabel' | 'afterInput';
  errorMessage?: string;
};

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
      errorMessage,
      ...rest
    },
    forwardedRef,
  ) => {
    const inputRef = React.useRef<React.ElementRef<typeof TextInput> | null>(
      null,
    );

    React.useImperativeHandle(forwardedRef, () => inputRef.current!);

    const showLabelBeforeInput = labelPosition === 'beforeInput';

    const accessibilityLabel = React.useMemo(
      () =>
        maybeGenerateStringFromElement(labelComponent, rest.accessibilityLabel),
      [labelComponent, rest.accessibilityLabel],
    );

    // @ts-ignore
    const textInputProps = useTextInput({
      required: false,
      ref: inputRef,
      id,
      nextFieldId,
      nextFormFieldRef: nextFormField,
      hasError,
      hasValidation,
      errorMessage,
      accessibilityLabel,
      ...rest,
    });

    const checks = __DEV__ ? useChecks?.() : undefined;
    __DEV__ &&
      checks?.noUndefinedProperty({
        properties: { labelComponent },
        property: 'labelComponent',
        rule: 'NO_FORM_LABEL',
      });
    __DEV__ &&
      checks?.noUndefinedProperty({
        properties: { accessibilityLabel },
        property: 'accessibilityLabel',
        rule: 'NO_ACCESSIBILITY_LABEL',
      });
    __DEV__ &&
      accessibilityLabel?.trim() === '' &&
      checks?.logResult('NO_ACCESSIBILITY_LABEL', {
        rule: 'NO_ACCESSIBILITY_LABEL',
        message: 'No accessibility label provided',
      });
    __DEV__ &&
      hasValidation &&
      checks?.noUndefinedProperty({
        // @ts-ignore
        properties: { errorComponent },
        property: 'errorComponent',
        rule: 'NO_FORM_ERROR',
      });

    const style =
      __DEV__ && // @ts-ignore
      applyStyle?.({
        // @ts-ignore
        style: textInputProps?.style || {},
        debugStyle: checks?.debugStyle,
      });

    const accessibilityHiddenLabel = React.useMemo(
      () => (
        <HideChildrenFromAccessibilityTree>
          {labelComponent}
        </HideChildrenFromAccessibilityTree>
      ),
      [labelComponent],
    );

    const errorText = React.useMemo(() => {
      return hasValidation && hasError
        ? maybeGenerateStringFromElement(errorComponent, errorMessage)
        : '';
    }, [hasValidation, hasError, errorComponent, errorMessage]);

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

    return __DEV__ ? (
      <>
        {showLabelBeforeInput ? accessibilityHiddenLabel : null}
        {hasError && errorPosition === 'belowLabel' ? renderError() : null}
        <RNTextInput
          // @ts-ignore
          ref={inputRef}
          {...rest}
          {...textInputProps}
          style={style}
          accessibilityLabel={accessibilityLabel!}
          accessibilityHint={fullAccessibilityHint}
        />
        {showLabelBeforeInput ? null : accessibilityHiddenLabel}
        {hasError && errorPosition === 'afterInput' ? renderError() : null}
      </>
    ) : (
      <>
        {showLabelBeforeInput ? accessibilityHiddenLabel : null}
        {hasError && errorPosition === 'belowLabel' ? renderError() : null}
        <RNTextInput
          // @ts-ignore
          ref={inputRef}
          {...rest}
          {...textInputProps}
          accessibilityLabel={accessibilityLabel!}
          accessibilityHint={fullAccessibilityHint}
        />
        {showLabelBeforeInput ? null : accessibilityHiddenLabel}
        {hasError && errorPosition === 'afterInput' ? renderError() : null}
      </>
    );
  },
);
