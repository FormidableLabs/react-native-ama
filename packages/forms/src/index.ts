import React from "react";
import {
  Form as FormProvider,
  type FormActions,
  type FormProps,
} from "./components/Form";
import { FormField, type FormFieldProps } from "./components/FormField";
import { FormSubmit, type FormSubmitProps } from "./components/FormSubmit";

type FormComponent = React.FunctionComponent & {
  Submit: (props: FormSubmitProps) => React.ReactElement;
  Field: React.FunctionComponent;
};

// @ts-ignore
const Form: FormComponent = FormProvider;
Form.Submit = FormSubmit;
Form.Field = FormField;

export { Form, FormField, FormSubmit };

// Components
export { TextInput, type TextInputProps } from "./components/TextInput";

// Hooks
export { useFormField, type UseFormField } from "./hooks/useFormField";
export { useTextInput, type UseTextInput } from "./hooks/useTextInput";

// Types
export {
  type FormProps,
  type FormActions,
  type FormFieldProps,
  type FormSubmitProps,
};
