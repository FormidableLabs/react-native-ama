import { AccessibilityState } from 'react-native';

export type AMAAccessibilityState = Pick<
  AccessibilityState,
  'selected' | 'checked' | 'busy' | 'disabled' | 'expanded'
>;
