import type { AccessibilityState } from 'react-native';

export type AMAAccessibilityState = Pick<AccessibilityState, 'busy'>;

export type PickAccessibleProps<T> = {
  [K in keyof T as K extends
    | `${string}accessible${string}`
    | `${string}accessibility${string}`
    | `${string}Accessible${string}`
    | `${string}Accessibility${string}`
    ? K
    : never]: T[K];
};

export type AccessibilityRoles =
  | {
      accessibilityRole:
        | 'none'
        | 'link'
        | 'search'
        | 'image'
        | 'keyboardkey'
        | 'text'
        | 'imagebutton'
        | 'header'
        | 'summary'
        | 'alert'
        | 'combobox'
        | 'menu'
        | 'menubar'
        | 'menuitem'
        | 'progressbar'
        | 'radiogroup'
        | 'scrollbar'
        | 'spinbutton'
        | 'tabbar'
        | 'tablist'
        | 'timer'
        | 'list'
        | 'toolbar';
    }
  | {
      accessibilityRole: 'button';
      expanded?: AccessibilityState['expanded'];
    }
  | {
      accessibilityRole: 'switch';
      checked: AccessibilityState['checked'];
    }
  | {
      accessibilityRole: 'tab' | 'radio';
      selected: AccessibilityState['selected'];
    }
  | {
      accessibilityRole: 'togglebutton' | 'switch' | 'checkbox';
      checked: AccessibilityState['checked'];
    };
