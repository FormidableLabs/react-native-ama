import * as React from 'react';
import { InteractionManager } from 'react-native';

import { useFocus } from '../hooks/useFocus';
import { useChecks } from '../internal/useChecks';

export type FormProps = React.PropsWithChildren<{
  onSubmit: () => boolean | Promise<boolean>;
}>;

export const Form = ({ children, onSubmit }: FormProps) => {
  const refs = React.useRef<FormRef[]>([]);
  const { setFocus } = useFocus();

  const checks = __DEV__ ? useChecks?.() : undefined;

  const focusField = (nextField?: Partial<FormRef> | undefined) => {
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
      nextRefElement?.current?.focus();

      __DEV__ &&
        nextRefElement &&
        checks?.checkFocusTrap({ ref: nextRefElement, shouldHaveFocus: true });
    } else if (nextRefElement?.current) {
      setFocus(nextRefElement?.current);
    }
  };

  const submitForm = async () => {
    const isValid = await onSubmit();

    if (isValid) {
      return;
    }

    InteractionManager.runAfterInteractions(() => {
      setTimeout(() => {
        const fieldWithError = (refs.current || []).find(
          ref => ref.hasValidation && ref.hasError,
        );

        __DEV__ &&
          fieldWithError == null &&
          checks?.logResult('Form', {
            message:
              'The form validation has failed, but no component with error was found',
            rule: 'NO_UNDEFINED',
          });

        focusField(fieldWithError);
      }, 0);
    });
  };

  return (
    <FormContext.Provider
      value={{ refs: refs.current, submitForm, focusField }}>
      {children}
    </FormContext.Provider>
  );
};

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

const DEFAULT_VALUES: FormContextValue = {
  refs: [],
  submitForm: () => Promise.resolve(),
  focusField: () => null,
};

export const FormContext =
  React.createContext<FormContextValue>(DEFAULT_VALUES);
export const useForm = () => React.useContext(FormContext);
