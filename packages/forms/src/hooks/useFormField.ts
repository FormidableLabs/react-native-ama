import { useAMAContext, useChecks } from '@react-native-ama/core';
import { applyStyle } from '@react-native-ama/internal';
import React from 'react';
import { Keyboard, ViewStyle } from 'react-native';

import { useForm } from '../components/Form';

export type UseFormField = {
  ref?: React.RefObject<any> | React.ForwardedRef<any> | null;
  hasFocusCallback: boolean;
  id?: string;
  nextFieldId?: string;
  nextFormFieldRef?: React.RefObject<any>;
  accessibilityHint?: string;
  style?: ViewStyle;
  editable?: boolean;
  hasValidation: boolean;
  hasError?: boolean;
  errorMessage?: string;
};

export const useFormField = ({
  ref,
  hasFocusCallback,
  id,
  nextFieldId,
  nextFormFieldRef,
  hasValidation,
  hasError,
  accessibilityHint,
  errorMessage,
  editable = true,
  style = {},
}: UseFormField) => {
  const { refs, submitForm, focusField } = useForm();
  const { isScreenReaderEnabled } = useAMAContext();
  const fieldRef = React.useRef(ref);

  const checks = __DEV__ ? useChecks?.() : undefined;

  const getMyIndex = () => {
    const allRefs = refs!;
    const item = allRefs.find(r => r.ref === fieldRef);

    return item ? allRefs.indexOf(item) : -1;
  };

  const focusNextFormField = () => {
    const isLastItem = isLastField();

    if (isLastItem) {
      Keyboard.dismiss();

      if (isScreenReaderEnabled) {
        submitForm();
      }

      return;
    }

    const currentField = refs![getMyIndex()];

    focusField?.(getNextFieldRef());

    __DEV__ &&
      currentField?.hasFocusCallback &&
      checks?.checkFocusTrap({
        ref: currentField?.ref?.current,
        shouldHaveFocus: false,
      });
  };

  const getNextFieldRef = () => {
    const allRefs = refs || [];

    if (nextFormFieldRef) {
      return {
        ref: nextFormFieldRef,
      };
    } else if (nextFieldId) {
      return allRefs.find(item => item.id === nextFieldId);
    }

    return allRefs[getMyIndex() + 1];
  };

  const isLastField = () => {
    const myIndex = getMyIndex();

    return myIndex === refs!.length - 1;
  };

  React.useEffect(() => {
    refs?.push({
      ref: fieldRef,
      hasFocusCallback,
      id,
      hasValidation,
      hasError,
      isEditable: editable,
    });

    return () => {
      const myIndex = getMyIndex();

      refs?.splice(myIndex, 1);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const myRefIndex = refs?.findIndex(item => item.ref === fieldRef);

    // @ts-ignore
    refs[myRefIndex].hasError = hasError;
    // @ts-ignore
    refs[myRefIndex].isEditable = editable;
  }, [editable, hasError, refs]);

  const fullAccessibilityHint = [accessibilityHint, errorMessage]
    .filter(Boolean)
    .join(',');

  return __DEV__
    ? {
        focusNextFormField,
        isLastField,
        style: applyStyle?.({ style, debugStyle: checks?.debugStyle }),
        accessibilityHint: fullAccessibilityHint,
      }
    : {
        focusNextFormField,
        accessibilityHint: fullAccessibilityHint,
        isLastField,
      };
};
