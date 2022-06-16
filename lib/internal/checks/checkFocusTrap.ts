import type React from 'react';
import type { TextInput } from 'react-native';

import type { LogParams } from '../logger';

export type CheckFocusTrap = {
  ref: React.RefObject<TextInput>;
  shouldHaveFocus: boolean;
};
export const checkFocusTrap = async ({
  ref,
  shouldHaveFocus,
}: CheckFocusTrap): Promise<LogParams | null> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const hasFocus = ref?.current?.isFocused() === shouldHaveFocus;

      if (!hasFocus) {
        resolve({
          rule: 'NO_KEYBOARD_TRAP',
          message: 'The component specified did not receive the focus',
          // @ts-ignore
          extra: ref.current?._internalFiberInstanceHandleDEV?.memoizedProps,
        });
      }

      resolve(null);
    }, 100);
  });
};
