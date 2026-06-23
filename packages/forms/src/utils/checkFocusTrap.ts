import React from "react";
import type { TextInput } from "react-native";

export type CheckFocusTrap = {
  ref: React.RefObject<TextInput>;
  shouldHaveFocus: boolean;
  trackError?:
    | ((rule: "NO_KEYBOARD_TRAP", ref: React.RefObject<any>) => void)
    | null;
};

const CHECK_FOCUS_TRAP_DELAY_MS = 100;

const isFocused = (ref: TextInput | null): boolean => {
  return ref?.isFocused?.() ?? false;
};

export const checkFocusTrap = __DEV__
  ? ({ ref, shouldHaveFocus, trackError }: CheckFocusTrap): Promise<void> => {
      return new Promise((resolve) => {
        setTimeout(() => {
          const hasFocus = isFocused(ref?.current ?? null) === shouldHaveFocus;

          if (!hasFocus) {
            const message = shouldHaveFocus
              ? "The component did not receive the focus"
              : "The component did trap the focus";

            if (trackError) {
              trackError("NO_KEYBOARD_TRAP", ref);
            } else {
              console.error(message);
            }
          }

          resolve();
        }, CHECK_FOCUS_TRAP_DELAY_MS);
      });
    }
  : null;
