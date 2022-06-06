import React from 'react';

import { checkFocusTrap } from '../internal/checkFocusTrap';
import { useForm } from '../providers/Form';
import { useA11yFocus } from './useA11yFocus';

export const useFormField = ({
  ref,
  hasFocusCallback,
}: {
  ref: React.RefObject<any> | React.ForwardedRef<any> | null;
  hasFocusCallback: boolean;
}) => {
  const { refs, onSubmit } = useForm();
  const { setFocus } = useA11yFocus();
  const fieldRef = React.useRef(ref);

  const getMyIndex = () => {
    const allRefs = refs!;
    const item = allRefs.find(r => r.ref === fieldRef);

    return item ? allRefs.indexOf(item) : -1;
  };

  const focusNextFormField = (nextFormField?: React.RefObject<any>) => {
    const allRefs = refs!;
    const myIndex = getMyIndex();
    const isLastItem = myIndex === allRefs.length - 1;

    if (isLastItem) {
      return onSubmit();
    }

    if (nextFormField) {
      return setFocus(nextFormField.current);
    }

    /**
     * Refs passed as prop have another ".current"
     */
    const nextRef = allRefs[myIndex + 1];
    const nextRefElement = nextRef?.ref?.current?.current
      ? nextRef?.ref.current
      : nextRef?.ref;

    const callFocus =
      nextRefElement?.current?.focus && nextRef.hasFocusCallback;

    if (callFocus) {
      nextRefElement.current?.focus();

      __DEV__ && checkFocusTrap(nextRefElement, true);
    } else if (nextRefElement.current) {
      setFocus(nextRefElement.current);
    }

    const currentRef = allRefs[myIndex];
    if (currentRef.hasFocusCallback && __DEV__) {
      checkFocusTrap(currentRef.ref.current, false);
    }
  };

  const isLastField = () => {
    const myIndex = getMyIndex();

    return myIndex === refs!.length - 1;
  };

  React.useEffect(() => {
    refs?.push({ ref: fieldRef, hasFocusCallback });

    return () => {
      const myIndex = getMyIndex();

      refs?.splice(myIndex, 1);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    focusNextFormField,
    isLastField,
  };
};
