import React from 'react';
import {
  Form as FormProvider,
  type FormActions,
  type FormProps,
} from './components/Form';
import { FormField, type FormFieldProps } from './components/FormField';
import {
  FormSubmit,
  type FormSubmitProps,
  type FormSubmitRenderProps,
} from './components/FormSubmit';

type FormComponent = typeof FormProvider & {
  Submit: (props: FormSubmitProps) => React.ReactElement;
  Field: typeof FormField;
};

const Form = FormProvider as unknown as FormComponent;
Form.Submit = FormSubmit;
Form.Field = FormField;

export {
  Form,
  type FormProps,
  type FormActions,
  type FormFieldProps,
  type FormSubmitProps,
  type FormSubmitRenderProps,
};
