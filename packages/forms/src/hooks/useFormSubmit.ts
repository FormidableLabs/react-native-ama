import { useForm } from '../components/Form';

export type UseFormSubmit = {
  submitForm: () => Promise<void>;
};

export const useFormSubmit = (): UseFormSubmit => {
  const { submitForm } = useForm();

  const handleSubmit = () => {
    return submitForm();
  };

  return {
    submitForm: handleSubmit,
  };
};
