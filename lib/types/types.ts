/* istanbul ignore file */
import type { AccessibilityState } from 'react-native';

export type AMAAccessibilityState = Pick<
  AccessibilityState,
  'selected' | 'checked' | 'busy' | 'expanded'
>;
