// Components

import { isFocused } from '@react-native-ama/internal';

import {
  FormActions,
  FormProps,
  Form as FormProvider,
} from './components/Form';
import { FormField, FormFieldProps } from './components/FormField';
import { FormSubmit, FormSubmitProps } from './components/FormSubmit';
import { FormSwitch, FormSwitchProps } from './components/FormSwitch';

type FormComponent = React.FunctionComponent<FormProps> & {
  Submit: (props: FormSubmitProps) => JSX.Element;
  Field: React.FunctionComponent<FormFieldProps>;
  Switch: (props: FormSwitchProps) => JSX.Element;
};

// @ts-ignore
const Form: FormComponent = FormProvider;
Form.Submit = FormSubmit;
Form.Field = FormField;
Form.Switch = FormSwitch;

export { Form, FormField, FormSubmit };

// Components
export { TextInput } from './components/TextInput';

// Hooks
export { useFormField } from './hooks/useFormField';
export { useTextInput } from './hooks/useTextInput';

// utils
export { isFocused };

// Types
export {
  type FormProps,
  type FormActions,
  type FormFieldProps,
  type FormSubmitProps,
  type FormSwitchProps,
};
