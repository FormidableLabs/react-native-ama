import React from "react";
import { useForm } from "../components/Form";

export type FormSubmitRenderProps = {
  onPress: () => Promise<void>;
};

export type FormSubmitProps = {
  children: (props: FormSubmitRenderProps) => React.ReactNode;
};

export const FormSubmit = ({ children }: FormSubmitProps) => {
  const { submitForm } = useForm();

  return <>{children({ onPress: submitForm })}</>;
};
