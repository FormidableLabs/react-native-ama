import { useChecks, useFocus } from '@react-native-ama/core';
import { isFocused } from '@react-native-ama/internal';
import * as React from 'react';
import { InteractionManager } from 'react-native';

export type FormProps = React.PropsWithChildren<{
  onSubmit: () => boolean | Promise<boolean>;
}>;

export type FormActions = {
  focusFirstInvalidField: () => void;
  focusFieldAt: (fieldNumber: number) => void;
};

export const Form = React.forwardRef<FormActions, FormProps>(
  ({ children, onSubmit }, ref) => {
    const refs = React.useRef<FormRef[]>([]);
    const { setFocus } = useFocus();

    const checks = __DEV__ ? useChecks?.() : undefined;

    const focusField = React.useCallback(
      (nextField?: Partial<FormRef> | undefined) => {
        /**
         * Refs passed as prop have another ".current"
         */
        const nextRefElement = nextField?.ref?.current?.current
          ? nextField?.ref.current
          : nextField?.ref;

        const callFocus =
          // @ts-ignore
          nextRefElement?.current?.focus &&
          nextField?.hasFocusCallback &&
          nextField?.isEditable;

        __DEV__ &&
          nextRefElement == null &&
          checks?.logResult('nextRefElement', {
            message:
              'No next field found. Make sure you wrapped your form inside the <Form /> component',
            rule: 'NO_UNDEFINED',
          });

        if (callFocus) {
          /**
           * On some apps, if we call focus immediately and the field is already focused we lose the focus.
           * Same happens if we do not call `focus` if the field is already focused.
           */
          const timeoutValue = isFocused(nextRefElement.current) ? 50 : 0;

          setTimeout(() => {
            nextRefElement?.current?.focus();

            __DEV__ &&
              nextRefElement &&
              checks?.checkFocusTrap({
                ref: nextRefElement,
                shouldHaveFocus: true,
              });
          }, timeoutValue);
        } else if (nextRefElement?.current) {
          setFocus(nextRefElement?.current);
        }
      },
      [checks, setFocus],
    );

    const focusFieldAt = React.useCallback(
      (position: number) => {
        InteractionManager.runAfterInteractions(() => {
          setTimeout(() => {
            const fieldWithError = refs.current[position];

            focusField(fieldWithError);
          }, 0);
        });
      },
      [focusField],
    );

    const focusFirstInvalidField = React.useCallback(() => {
      const fieldWithError = (refs.current || []).findIndex(
        fieldRef => fieldRef.hasValidation && fieldRef.hasError,
      );

      __DEV__ &&
        fieldWithError == null &&
        checks?.logResult('Form', {
          message:
            'The form validation has failed, but no component with error was found',
          rule: 'NO_UNDEFINED',
        });

      focusFieldAt(fieldWithError);
    }, [focusFieldAt, checks]);

    const submitForm = React.useCallback(async () => {
      const isValid = await onSubmit();

      if (isValid) {
        return;
      }

      focusFirstInvalidField();
    }, [focusFirstInvalidField, onSubmit]);

    React.useImperativeHandle(ref, () => ({
      focusFirstInvalidField,
      focusFieldAt,
    }));

    return (
      <FormContext.Provider
        value={{ refs: refs.current, submitForm, focusField }}>
        {children}
      </FormContext.Provider>
    );
  },
);

export type FormContextValue = {
  refs?: FormRef[];
  submitForm: () => Promise<void>;
  focusField?: (nextField?: Partial<FormRef> | undefined) => void;
};

export type FormRef = {
  ref: React.RefObject<any>;
  hasFocusCallback: boolean;
  id: string | undefined;
  hasValidation: boolean;
  hasError?: boolean;
  isEditable?: boolean;
};

export const FormContext = React.createContext<FormContextValue | null>(null);

const DEFAULT_CONTEXT_VALUE: FormContextValue = {
  refs: [],
  submitForm: () => Promise.resolve(),
  focusField: () => {},
};

export const useForm = (
  { suppressError }: { suppressError?: boolean } = { suppressError: false },
) => {
  const context = React.useContext(FormContext);

  if (!context && suppressError) {
    return DEFAULT_CONTEXT_VALUE; // return default values so internal useForm hooks don't throw undefined errors when user choose to suppress errors
  }

  if (!context) {
    __DEV__ &&
      console.error(
        'Please wrap your form field inside the <Form /> component',
      );
    throw new Error(
      'useForm must be used within a FormContextProvider, please wrap your form field inside the <Form /> component',
    );
  }

  return context;
};
