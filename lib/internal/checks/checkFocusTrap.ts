import type React from 'react';
import type { TextInput } from 'react-native';

import { log } from '../logger';

export const checkFocusTrap = (
  ref: React.RefObject<TextInput>,
  shouldHaveFocus: boolean,
) => {
  setTimeout(() => {
    const hasFocus = ref.current?.isFocused() === shouldHaveFocus;

    if (!hasFocus) {
      log({
        rule: 'NO_KEYBOARD_TRAP',
        message: 'The component specified did not receive the focus',
        // @ts-ignore
        extra: ref.current?._internalFiberInstanceHandleDEV?.memoizedProps,
      });
    }
  }, 100);
};
