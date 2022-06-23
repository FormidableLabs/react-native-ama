import * as React from 'react';

export const Form = ({
  children,
  onSubmit,
}: React.PropsWithChildren<FormContextValue>) => {
  const refs = React.useRef([]);

  return (
    <FormContext.Provider value={{ refs: refs.current, onSubmit }}>
      {children}
    </FormContext.Provider>
  );
};

export type FormContextValue = {
  refs?: FormRef[];
  onSubmit: () => void;
};

type FormRef = {
  ref: React.RefObject<any>;
  hasFocusCallback: boolean;
  id: string | undefined;
};

const DEFAULT_VALUES: FormContextValue = {
  refs: [],
  onSubmit: () => {},
};

const FormContext = React.createContext<FormContextValue>(DEFAULT_VALUES);
export const useForm = () => React.useContext(FormContext);
