import type { AccessibilityState } from 'react-native';

export const generateAccessibilityStateFromProp = (
  props: StateKeyValue,
): AccessibilityState => {
  const state: Record<keyof AccessibilityState, any> = {
    disabled: props.disabled,
    selected: props.selected,
    checked: props.checked,
    busy: props.busy,
    expanded: props.expanded,
    ...(props.accessibilityState || {}),
  };

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
};
