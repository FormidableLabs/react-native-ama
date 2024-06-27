import type { AccessibilityRole, AccessibilityState } from 'react-native';
import { Platform } from 'react-native';

export const generateAccessibilityStateFromProp = ({
  accessibilityRole,
  ...props
}: StateKeyValue): AccessibilityState => {
  const state: Record<keyof AccessibilityState, any> = {
    disabled: props.disabled,
    selected: props.selected,
    checked: props.checked,
    busy: props.busy,
    expanded: props.expanded,
    ...(props.accessibilityState || {}),
  };

  if (accessibilityRole === 'button' && Platform.OS === 'ios') {
    /**
     * Accessibility roles like
     *   - checkbox
     *   - radio
     *   - togglebutton
     *
     *  need to set the "selected" state for iOS
     */
    if (typeof state.checked !== 'undefined') {
      state.selected = state.checked;

      state.checked = undefined;
    }
  }

  return Object.fromEntries(
    Object.entries(state).filter(
      ([, value]: [string, any]) => value !== undefined,
    ),
  );
};

type StateKeyValue = {
  [key in keyof AccessibilityState]: AccessibilityState[key];
} & {
  accessibilityState?: AccessibilityState;
  accessibilityRole?: AccessibilityRole;
};
