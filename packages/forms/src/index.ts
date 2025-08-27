// Components

import React from 'react';
import {
  Form as FormProvider,
  type FormActions,
  type FormProps,
} from './components/Form';
import { FormField, type FormFieldProps } from './components/FormField';
import { FormSubmit, type FormSubmitProps } from './components/FormSubmit';
import { FormSwitch, type FormSwitchProps } from './components/FormSwitch';

type FormComponent = React.FunctionComponent & {
  Submit: (props: FormSubmitProps) => React.ReactElement;
  Field: React.FunctionComponent;
  Switch: (props: FormSwitchProps) => React.ReactElement;
};

// @ts-ignore
const Form: FormComponent = FormProvider;
Form.Submit = FormSubmit;
Form.Field = FormField;
Form.Switch = FormSwitch;

export { Form, FormField, FormSubmit, FormSwitch };

// Components
export { TextInput, type TextInputProps } from './components/TextInput';

// Hooks
export { useFormField, type UseFormField } from './hooks/useFormField';
export { useTextInput, type UseTextInput } from './hooks/useTextInput';

// Types
export {
  type FormProps,
  type FormActions,
  type FormFieldProps,
  type FormSubmitProps,
  type FormSwitchProps,
};
