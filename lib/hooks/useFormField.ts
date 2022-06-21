import React from 'react';

import { useChecks } from '../internal/useChecks';
import { useForm } from '../providers/Form';
import { useFocus } from './useFocus';

export const useFormField = ({
  ref,
  hasFocusCallback,
  id,
  nextFieldId,
  nextFormFieldRef,
}: {
  ref: React.RefObject<any> | React.ForwardedRef<any> | null;
  hasFocusCallback: boolean;
  id?: string;
  nextFieldId?: string;
  nextFormFieldRef?: React.RefObject<any>;
}) => {
  const { refs, onSubmit } = useForm();
  const { setFocus } = useFocus();
  const fieldRef = React.useRef(ref);

  /*block:start*/
  const { checkFocusTrap } = useChecks();
  /*block:end*/

  const getMyIndex = () => {
    const allRefs = refs!;
    const item = allRefs.find(r => r.ref === fieldRef);

    return item ? allRefs.indexOf(item) : -1;
  };

  const focusNextFormField = () => {
    const allRefs = refs!;
    const myIndex = getMyIndex();
    const isLastItem = isLastField();

    if (isLastItem) {
      return onSubmit();
    }

    const nextRef = getNextFieldRef();

    /**
     * Refs passed as prop have another ".current"
     */
    const nextRefElement = nextRef?.ref?.current?.current
      ? nextRef?.ref.current
      : nextRef?.ref;

    const callFocus =
      // @ts-ignore
      nextRefElement?.current?.focus && nextRef?.hasFocusCallback;

    if (callFocus) {
      nextRefElement.current?.focus();

      /*block:start*/
      if (nextRefElement) {
        checkFocusTrap({ ref: nextRefElement, shouldHaveFocus: true });
      }
      /*block:end*/
    } else if (nextRefElement.current) {
      setFocus(nextRefElement.current);
    }

    const currentRef = allRefs[myIndex];

    /*block:start*/
    if (currentRef.hasFocusCallback) {
      checkFocusTrap({ ref: currentRef.ref.current, shouldHaveFocus: false });
    }
    /*block:end*/
  };

  const getNextFieldRef = () => {
    const allRefs = refs!;

    if (nextFormFieldRef) {
      return { ref: nextFormFieldRef };
    } else if (nextFieldId) {
      return allRefs.find(item => item.id === nextFieldId);
    }

    return allRefs[getMyIndex() + 1];
  };

  const isLastField = () => {
    const myIndex = getMyIndex();

    return myIndex === refs!.length - 1;
  };

  React.useEffect(() => {
    refs?.push({ ref: fieldRef, hasFocusCallback, id });

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
