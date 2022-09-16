/* istanbul ignore file */
import type { AccessibilityState } from 'react-native';

export type AMAAccessibilityState = Pick<AccessibilityState, 'busy'>;

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
      selected?: AccessibilityState['selected'];
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
      accessibilityRole: {
        ios: 'adjustable';
        android: 'button';
      };
    }
  | {
      accessibilityRole: {
        ios: 'button';
        android: 'checkbox';
      };
      checked?: boolean;
      selected?: boolean;
    };
