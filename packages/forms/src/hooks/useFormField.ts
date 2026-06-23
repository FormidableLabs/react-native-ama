import React from "react";
import { Keyboard, ViewStyle } from "react-native";
import { useForm } from "../components/Form";
import { checkFocusTrap } from "../utils/checkFocusTrap";

let _useAMAContext:
  | (() => {
      trackError?: (rule: string, ref?: React.RefObject<any>) => void;
    } | null)
  | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  _useAMAContext = require("@react-native-ama/core").useAMAContext;
} catch {
  // core is an optional peer — fall back to null
}

const getTrackError = () => {
  try {
    return _useAMAContext?.()?.trackError ?? null;
  } catch {
    return null;
  }
};

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
  suppressError?: boolean;
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
  suppressError,
}: UseFormField) => {
  const { refs, submitForm, focusField } = useForm({ suppressError });
  const fieldRef = React.useRef(ref);
  const trackError = __DEV__ ? getTrackError() : null;

  const getMyIndex = () => {
    const allRefs = refs!;
    const item = allRefs.find((r) => r.ref === fieldRef);

    return item ? allRefs.indexOf(item) : -1;
  };

  const focusNextFormField = () => {
    const isLastItem = isLastField();

    if (isLastItem) {
      Keyboard.dismiss();

      submitForm();

      return;
    }

    __DEV__ &&
      hasFocusCallback &&
      checkFocusTrap?.({
        ref: fieldRef.current as React.RefObject<any>,
        shouldHaveFocus: false,
        trackError: trackError ?? null,
      });

    focusField?.(getNextFieldRef());
  };

  const getNextFieldRef = () => {
    const allRefs = refs || [];

    if (nextFormFieldRef) {
      return {
        ref: nextFormFieldRef,
      };
    } else if (nextFieldId) {
      return allRefs.find((item) => item.id === nextFieldId);
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
    const myRefIndex = refs?.findIndex((item) => item.ref === fieldRef);

    // @ts-ignore
    refs[myRefIndex].hasError = hasError;
    // @ts-ignore
    refs[myRefIndex].isEditable = editable;
  }, [editable, hasError, refs]);

  const fullAccessibilityHint = [accessibilityHint, errorMessage]
    .filter(Boolean)
    .join(",");

  return {
    focusNextFormField,
    accessibilityHint: fullAccessibilityHint,
    isLastField,
  };
};
