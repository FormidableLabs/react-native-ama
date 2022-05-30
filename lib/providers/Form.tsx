import React from 'react';

export const Form: React.FC<FormContextValue> = ({ children, onSubmit }) => {
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
};

const DEFAULT_VALUES: FormContextValue = {
  refs: [],
  onSubmit: () => {},
};

const FormContext = React.createContext<FormContextValue>(DEFAULT_VALUES);
export const useForm = () => React.useContext(FormContext);
