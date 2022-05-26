import type React from 'react';
import type { TextInput } from 'react-native';

import { log } from './logger';

export const checkFocusTrap = (ref: React.RefObject<TextInput>) => {
  setTimeout(() => {
    const hasFocus = ref.current?.isFocused();

    if (!hasFocus) {
      log(
        'NO_KEYBOARD_TRAP',
        'The component specified did not receive the focus',
        // @ts-ignore
        ref.current?._internalFiberInstanceHandleDEV?.memoizedProps,
      );
    }
  }, 100);
};
