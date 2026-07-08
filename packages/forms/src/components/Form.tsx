import * as React from 'react';
import { InteractionManager, TextInput } from 'react-native';
import { useFocus } from '../hooks/useFocus';

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

        if (callFocus) {
          /**
           * On some apps, if we call focus immediately and the field is already focused we lose the focus.
           * Same happens if we do not call `focus` if the field is already focused.
           */
          const timeoutValue = isFocused(nextRefElement.current) ? 50 : 0;

          setTimeout(() => {
            nextRefElement?.current?.focus();
          }, timeoutValue);
        } else if (nextRefElement?.current) {
          setFocus(nextRefElement?.current);
        }
      },
      [setFocus]
    );

    const focusFieldAt = (position: number) => {
      InteractionManager.runAfterInteractions(() => {
        setTimeout(() => {
          const fieldWithError = refs.current[position];

          focusField(fieldWithError);
        }, 0);
      });
    };

    const focusFirstInvalidField = () => {
      const fieldWithError = (refs.current || []).findIndex(
        (fieldRef) => fieldRef.hasValidation && fieldRef.hasError
      );

      focusFieldAt(fieldWithError);
    };

    const submitForm = async () => {
      const isValid = await onSubmit();

      if (isValid) {
        return;
      }

      focusFirstInvalidField();
    };

    React.useImperativeHandle(ref, () => ({
      focusFirstInvalidField,
      focusFieldAt,
    }));

    return (
      <FormContext.Provider
        value={{ refs: refs.current, submitForm, focusField }}
      >
        {children}
      </FormContext.Provider>
    );
  }
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
  focusField: () => { },
};

export const useForm = (
  { suppressError }: { suppressError?: boolean } = { suppressError: false }
) => {
  const context = React.useContext(FormContext);

  if (!context && suppressError) {
    return DEFAULT_CONTEXT_VALUE; // return default values so internal useForm hooks don't throw undefined errors when user choose to suppress errors
  }

  if (!context) {
    __DEV__ &&
      console.error(
        'Please wrap your form field inside the <Form /> component'
      );
    throw new Error(
      'useForm must be used within a FormContextProvider, please wrap your form field inside the <Form /> component'
    );
  }

  return context;
};


const isFocused = (input: TextInput | undefined | null) => {
  return input?.isFocused();
};
