// Components
import {
  FormActions,
  FormProps,
  Form as FormProvider,
} from './components/Form';
import { FormField, FormFieldProps } from './components/FormField';
import { FormSubmit, FormSubmitProps } from './components/FormSubmit';

type FormComponent = React.FunctionComponent<FormProps> & {
  Submit: (props: FormSubmitProps) => JSX.Element;
  Field: React.FunctionComponent<FormFieldProps>;
};

// @ts-ignore
const Form: FormComponent = FormProvider;
Form.Submit = FormSubmit;
Form.Field = FormField;

export { Form, FormField, FormSubmit };

// Components
export { TextInput } from './components/TextInput';

// Hooks
export { useFormField } from './hooks/useFormField';
export { useTextInput } from './hooks/useTextInput';

// Types
export {
  type FormProps,
  type FormActions,
  type FormFieldProps,
  type FormSubmitProps,
};
