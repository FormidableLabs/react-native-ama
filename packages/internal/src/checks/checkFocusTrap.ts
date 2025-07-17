import type React from 'react';
import type { TextInput } from 'react-native';
import { isFocused } from '../utils/isFocused';
import type { LogParams } from '../utils/logger';

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
      const hasFocus = isFocused(ref?.current) === shouldHaveFocus;

      if (!hasFocus) {
        const message = shouldHaveFocus
          ? 'The component did not receive the focus'
          : 'The component did trap the focus';

        resolve({
          rule: 'NO_KEYBOARD_TRAP',
          message,
          // @ts-ignore
          extra: ref?.current?._internalFiberInstanceHandleDEV?.memoizedProps,
        });
      }

      resolve(null);
    }, 100);
  });
};
